#!/usr/bin/env python3
"""Bygger glosprogrammet till en enda HTML-fil.

    python3 build.py
    python3 build.py --allow-removed <kod>:<id>     godkänner att ett låst id tas bort (se ids.lock nedan)

Läser src/ och languages/<kod>/ och skriver:
  dist/index.html        sidan som publiceras till artefaktlänken (appen och kursinställningarna)
  dist/data/<kod>.json   varje kurs ord och innehåll, publiceras bredvid sidan och hämtas när kursen väljs
  dist/data/<kod>-exam.json  kursens provträning, hämtas först när provet behövs (bara kurser med exam.json)
  dist/data/lemma-<språk>.json  alla kursers ord i ett språk (grundformer till Mina ord), hämtas när eleven trycker på ord i en text
  dist/preview.html      samma sida med datan inbakad och ett komplett HTML-skal, för att öppna lokalt och för testerna

och kontrollerar/uppdaterar id-låsen languages/<kod>/ids.lock (och book/ids.lock för bokens id), se lock_ids.
Ett ord-id som byter namn står i languages/<kod>/ids.renamed (read_renamed); datafilen får renames och appen flyttar
elevernas framsteg till det nya id:t (applyRenames i src/app.js).
"""
import collections
import datetime
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
LANG_DIR = ROOT / "languages"
DIST = ROOT / "dist"

# Språk som ska ligga först i väljaren. Det första är standard för den som öppnar sidan första gången.
ORDER = ["fr"]
GENDERS = {"", "m", "f", "n", "mpl", "fpl", "npl", "pl"}
MAX_PAGE_KB, MAX_DATA_KB = 420, 1600   # varningsgränser för storleken (okomprimerat), se slutet av main

# Provets index i kursens datafil (split_exam): de fält per uppgift som listor, startsidan, nivåmätaren och planen läser
EXAM_INDEX_FIELDS = ["id", "part", "teil", "title", "level", "type", "minWords", "maxWords", "time", "prep", "speak", "sim", "scale"]
EXAM_TYPES = ["match", "gaps", "short", "pick", "chart", "timed"]   # samma som EX_TYPES i src/kinds/70-exam.js


def split_exam(ex):
    """Delar content.exam i (index, hela provet). Indexet ligger kvar i kursens datafil: provets fält utom tasks,
    lazy: true och tasks med bara EXAM_INDEX_FIELDS plus k (typen som exKind i 70-exam.js räknar fram).
    Hela provet blir dist/data/<kod>-exam.json och ersätter indexet när appen hämtat det (ensureExam)."""
    def kind(t):
        return t["type"] if t.get("type") in EXAM_TYPES else "mc" if t.get("qs") else "write" if t.get("minWords") else "speak"
    index = {k: v for k, v in ex.items() if k != "tasks"}
    index["lazy"] = True
    index["tasks"] = [{**{k: t[k] for k in EXAM_INDEX_FIELDS if k in t}, "k": kind(t)} for t in ex["tasks"]]
    return index, ex


def lemma_lang(code, conf):
    """Språket för grundformerna: de två första bokstäverna i tts ("de-DE" → "de"), som lemmaLang() i 03-lemma.js."""
    return str(conf.get("tts") or code)[:2].lower()


def lemma_files(codes, confs, course_data):
    """{"lemma-<språk>": {"words": [[ord, svenska, genus], …]}}: alla kursers ord i samma språk, i kursernas ordning och
    utan dubbletter (första förekomsten vinner). Bara de fält lemmaOf behöver; exempel och ursprung står i kursfilerna."""
    out = {}
    for c in codes:
        words = course_data.get(c, {}).get("words")
        if not isinstance(words, str):
            continue
        lst = out.setdefault(f"lemma-{lemma_lang(c, confs[c])}", {"words": [], "_seen": set()})
        for line in words.split("\n"):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            f = line.split("|")
            if f[0] in lst["_seen"]:
                continue
            lst["_seen"].add(f[0])
            lst["words"].append([f[0], f[1] if len(f) > 1 else "", f[2] if len(f) > 2 else ""])
    for v in out.values():
        del v["_seen"]
    return out


JS_ID =re.compile(r"[A-Za-z0-9_$\u0080-￿]")
JS_REGEX_AFTER = {"return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "instanceof", "yield", "await"}
JS_SPACE = " \t\r\n\f\v ﻿"


def minify_js(src):
    """Tar bort kommentarer och onödiga blanktecken i JavaScript. Strängar, mallsträngar (även ${…} i flera nivåer)
    och reguljära uttryck lämnas orörda. En radbrytning blir kvar där den kan betyda något (automatiska semikolon),
    och tas bara bort efter { ( [ , ; eller före ) ] } , ;. Två ord eller två av + - / skiljs alltid åt, så
    beteendet ändras inte. Stoppar (JSParseError) på en sträng, kommentar eller ett reguljärt uttryck som inte slutar."""
    out, i, n = [], 0, len(src)
    ws, last, last_word = None, "", ""   # väntande blanktecken (None, " ", "\n"); sista tecknet och ordet som skrivits
    stack = []                           # öppna {: True = ${ i en mallsträng, False = vanlig klammer
    line = lambda p: src.count("\n", 0, p) + 1
    idch = lambda ch: bool(JS_ID.match(ch))

    def emit(tok, word=""):
        nonlocal ws, last, last_word
        if ws is not None and out:
            a, b = out[-1][-1], tok[0]
            b_id = idch(b) or (b == "." and tok[1:2].isdigit())
            if ws == "\n" and not (a in "{([,;" or b in ")]},;"):
                out.append("\n")
            elif (idch(a) and b_id) or (a in "+-/" and b in "+-/"):
                out.append(" ")
        ws = None
        out.append(tok)
        last, last_word = tok[-1], word

    def template(j):   # från efter ` eller } till och med ` (False) eller ${ (True)
        while j < n:
            if src[j] == "\\":
                j += 2
            elif src[j] == "`":
                return j + 1, False
            elif src.startswith("${", j):
                return j + 2, True
            else:
                j += 1
        raise JSParseError("en mallsträng slutar aldrig")

    while i < n:
        c = src[i]
        if c in JS_SPACE:
            j = i
            while j < n and src[j] in JS_SPACE:
                j += 1
            ws = "\n" if "\n" in src[i:j] or ws == "\n" else " "
            i = j
        elif src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
            ws = ws or " "
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            if j < 0:
                raise JSParseError(f"rad {line(i)}: kommentaren /* slutar aldrig")
            ws = "\n" if "\n" in src[i:j] or ws == "\n" else " "
            i = j + 2
        elif c in "'\"":
            j = i + 1
            while j < n and src[j] != c:
                if src[j] == "\n":
                    raise JSParseError(f"rad {line(i)}: strängen slutar aldrig")
                j += 2 if src[j] == "\\" else 1
            emit(src[i:j + 1])
            i = j + 1
        elif c == "`" or (c == "}" and stack and stack[-1]):   # mallsträng, eller den fortsätter efter ${…}
            if c == "}":
                stack.pop()
            j, more = template(i + 1)
            emit(src[i:j])
            if more:
                stack.append(True)
            i = j
        elif c == "/" and (not out or (last_word in JS_REGEX_AFTER if last_word else not (idch(last) or last in ")]}\"'`"))):
            j, cls = i + 1, False   # reguljärt uttryck (inte division): efter en operator, ( , = : [ ! & | ? { } ; eller return …
            while j < n and (cls or src[j] != "/"):
                if src[j] == "\n":
                    raise JSParseError(f"rad {line(i)}: det reguljära uttrycket slutar aldrig")
                if src[j] == "\\":
                    j += 1
                elif src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                j += 1
            j += 1
            while j < n and idch(src[j]):   # flaggor
                j += 1
            emit(src[i:j])
            i = j
        elif idch(c) or (c == "." and src[i + 1:i + 2].isdigit()):
            m = re.match(r"(?:0[xXbBoO][0-9a-fA-F_]+n?|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?n?)", src[i:i + 64]) if (c.isdigit() or c == ".") else None
            j = i + len(m.group(0)) if m else i
            while not m and j < n and idch(src[j]):
                j += 1
            emit(src[i:j], "" if m else src[i:j])
            i = j
        else:
            if c == "{":
                stack.append(False)
            elif c == "}" and stack:
                stack.pop()
            emit(c)
            i += 1
    return "".join(out)


def minify_css(src):
    """Tar bort kommentarer och onödiga blanktecken i CSS. Strängar lämnas orörda; blanktecken tas bara bort runt
    { } ; , > (aldrig runt : eller + -, där "a :hover" och calc(a + b) behöver dem)."""
    parts = re.split(r"(\"(?:\\.|[^\"\\\n])*\"|'(?:\\.|[^'\\\n])*')", re.sub(r"/\*.*?\*/", " ", src, flags=re.S))
    for k in range(0, len(parts), 2):   # jämna index = utanför strängar
        p = re.sub(r"\s+", " ", parts[k])
        parts[k] = re.sub(r" ?([{};,>]) ?", r"\1", p).replace(";}", "}")
    return "".join(parts).strip()

# Samma skal som artefakttjänsten lägger runt sidan vid publicering (används bara för preview.html)
SKELETON_HEAD = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n'


def book_files(code, pattern):
    """Filer i den privata bokmappen, i ordning: book/<pattern> först, sedan book/<kapitel>/<pattern> (t.ex. book/kap05/words.txt)."""
    book = LANG_DIR / code / "book"
    if not book.exists():
        return []
    return sorted(book.glob(pattern)) + sorted(f for f in book.glob("*/" + pattern))


def read_words(code):
    """Läser words.txt (och book/words.txt om den finns), tar bort kommentarer och kontrollerar varje rad."""
    errors, warnings = [], []
    lines, seen, section_ids = [], set(), set()
    origin = {"ord": {}, "avsnitt": {}}   # id -> True om det kommer från den privata bokmappen
    n_words = 0
    section = None
    paths = [LANG_DIR / code / "words.txt", *book_files(code, "words.txt")]
    numbered = [(p, no, line) for p in paths if p.exists() for no, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1)]
    for path, no, line in numbered:
        s = line.strip()
        if not s or s.startswith("//"):
            continue
        where = f"{path.relative_to(ROOT)}:{no}"
        if "`" in s:
            errors.append(f"{where}: tecknet ` är inte tillåtet")
        if not s.startswith("#") and len(s.split("|")) > 3:
            ex = s.split("|")[3]
            if ex.count("[") != ex.count("]") or ex.count("[") > 1 or re.search(r"\[\s*\]", ex):
                errors.append(f"{where}: exempelmeningen ska ha högst en lucka, skriven som [ord]")
        if s.startswith("#"):
            parts = s[1:].split("|")
            if len(parts) not in (2, 3) or not parts[0] or not parts[1]:
                errors.append(f"{where}: avsnittsrader ska se ut så här: #id|Namn eller #id|Namn|bok")
            elif len(parts) == 3 and parts[2] != "bok":
                errors.append(f"{where}: tredje fältet i en avsnittsrad kan bara vara 'bok'")
            elif parts[0] in section_ids:
                errors.append(f"{where}: avsnittet #{parts[0]} finns redan")
            section = parts[0]
            section_ids.add(section)
            origin["avsnitt"].setdefault(section, "book" in path.relative_to(LANG_DIR / code).parts[:1])
            lines.append(s)
            continue
        fields = s.split("|")
        if section is None:
            errors.append(f"{where}: ordet ligger före första avsnittet (#id|Namn)")
        if len(fields) not in (6, 7):
            errors.append(f"{where}: {len(fields)} fält, ska vara 6 eller 7 (ord|svenska|genus|exempel|exempel sv|ursprung|ordagrant)")
        else:
            word, sv, g = fields[0], fields[1], fields[2]
            if not word or not sv:
                errors.append(f"{where}: ordet eller den svenska översättningen saknas")
            if g not in GENDERS:
                errors.append(f"{where}: okänt genus '{g}' (tillåtna: {', '.join(sorted(x for x in GENDERS if x))})")
            # Ord-id är ordet självt, så en dubblett skulle dela framsteg med det första ordet: bygget stoppas
            if word in seen:
                errors.append(f"{where}: '{word}' finns redan i ordlistan (ord-id måste vara unika; ändra inte det gamla ordet, eftersom framstegen hänger på det)")
            seen.add(word)
            origin["ord"].setdefault(word, "book" in path.relative_to(LANG_DIR / code).parts[:1])
            n_words += 1
        lines.append(s)
    return "\n".join(lines), n_words, section_ids, errors, warnings, origin


# Artiklar och relativpronomen för att kontrollera de tyska grammatikfrågorna (se docs/spec/grammatik.md)
DEF = {"nom": {"m": "der", "f": "die", "n": "das", "pl": "die"}, "akk": {"m": "den", "f": "die", "n": "das", "pl": "die"},
       "dat": {"m": "dem", "f": "der", "n": "dem", "pl": "den"}, "gen": {"m": "des", "f": "der", "n": "des", "pl": "der"}}
EIN = {"nom": {"m": "", "f": "e", "n": "", "pl": "e"}, "akk": {"m": "en", "f": "e", "n": "", "pl": "e"},
       "dat": {"m": "em", "f": "er", "n": "em", "pl": "en"}, "gen": {"m": "es", "f": "er", "n": "es", "pl": "er"}}
REL = {"nom": {"m": "der", "f": "die", "n": "das", "pl": "die"}, "akk": {"m": "den", "f": "die", "n": "das", "pl": "die"},
       "dat": {"m": "dem", "f": "der", "n": "dem", "pl": "denen"}, "gen": {"m": "dessen", "f": "deren", "n": "dessen", "pl": "deren"}}
CONTR = {"im": "in dem", "ins": "in das", "am": "an dem", "ans": "an das", "zum": "zu dem", "zur": "zu der",
         "vom": "von dem", "beim": "bei dem", "aufs": "auf das", "übers": "über das", "durchs": "durch das", "fürs": "für das", "ums": "um das"}
GAP = re.compile(r"\[([^\]]+)\]")


# Studieplanens hänvisningar: typ i planen -> innehållstyp i content (examsim och ktest har egna kontroller)
PLAN_KINDS = {"lq": "listening", "rq": "reading", "write": "prompts", "culture": "culture", "story": "stories", "exam": "exam"}


def check_plan(plan, section_ids, content, grammar, where):
    """Kontrollerar plan.json: {title, intro, weeks: [{id, title, words: [{sec, part, of}], grammar: [område], do: [{k, id}], tip}]}.
    Fel om formen är fel; varning om ett avsnitt, område eller en uppgift inte finns (appen hoppar över det, så att
    id kan tas bort med ids.removed) och för innehåll som inte är med i planen."""
    errors, warnings, used = [], [], set()
    weeks = plan.get("weeks") if isinstance(plan, dict) else None
    if not isinstance(weeks, list) or not weeks:
        return [f"{where}: weeks saknas"], []
    topics = {t.get("id") for t in (grammar or {}).get("topics", [])}
    have = {k: {x.get("id") for x in (content.get(c, {}).get("tasks", []) if c == "exam" else content.get(c, [])) if isinstance(x, dict)}
            for k, c in PLAN_KINDS.items()}
    ids = [w.get("id") for w in weeks]
    errors += [f"{where}: veckan {i} finns flera gånger" for i in sorted({i for i in ids if ids.count(i) > 1})]
    for w in weeks:
        i = w.get("id") or "?"
        if not w.get("id") or not w.get("title"):
            errors.append(f"{where}: vecka {i} saknar id eller title")
        for r in w.get("words", []):
            if r.get("sec") not in section_ids:
                warnings.append(f"{where}: {i} har okänt avsnitt {r.get('sec')}")
            if not (1 <= r.get("part", 1) <= r.get("of", 1)):
                errors.append(f"{where}: {i} har part/of fel för {r.get('sec')}")
        for t in w.get("grammar", []):
            if t not in topics:
                warnings.append(f"{where}: {i} har okänt grammatikområde {t}")
        for x in w.get("do", []):
            k, ref = x.get("k"), x.get("id")
            if k == "examsim":
                continue
            if k == "ktest":
                ok = ref in section_ids
            elif k in PLAN_KINDS:
                ok = ref in have[k]
            else:
                errors.append(f"{where}: {i} har okänd typ {k}")
                continue
            if not ok:   # bara en varning: appen hoppar över det som saknas, så att innehåll kan tas bort (ids.removed)
                warnings.append(f"{where}: {i} pekar på {k} {ref}, som inte finns (visas inte)")
            used.add((k, ref))
    for k, s in have.items():
        # bokens texter (id bok-…, privata, bara lokalt) ska inte stå i den publika planen
        miss = sorted(r for r in s if r and (k, r) not in used and not str(r).startswith("bok-"))
        if miss:
            warnings.append(f"{where}: {PLAN_KINDS[k]} som inte är med i planen: {', '.join(miss)}")
    return errors, warnings


def check_grammar(items, where):
    errors = []
    for x in items:
        i = x.get("id", "?")
        for k in ("id", "topic", "rule", "q", "why", "sv", "alt"):
            if not x.get(k):
                errors.append(f"{where}: {i} saknar {k}")
        if x.get("type") == "rw":
            words = lambda s: sorted(re.sub(r"[,.!?;:]", " ", s).lower().split())
            for s in [*x.get("acc", []), *x.get("alt", [])]:
                if words(s) != words(x.get("a", "")):
                    errors.append(f"{where}: {i} har andra ord än facit: {s}")
            continue
        gaps = GAP.findall(x.get("q", ""))
        if not gaps:
            errors.append(f"{where}: {i} saknar [lucka]")
            continue
        ans = " … ".join(gaps)
        for a in x.get("alt", []):
            if len(a.split(" … ")) != len(gaps):
                errors.append(f"{where}: {i} alternativet '{a}' har fel antal delar")
            # I "maj", och när felalternativen bara skiljer sig i stor/liten bokstav, räknas versalerna
            cased = x.get("topic") == "maj" or any(b.lower() == ans.lower() and b != ans for b in x.get("alt", []))
            same = a == ans if cased else a.lower() == ans.lower()
            if same or a in x.get("acc", []):
                errors.append(f"{where}: {i} alternativet '{a}' är samma som svaret")
        m = x.get("meta") or {}
        if x.get("topic") == "praep" and m:
            got = gaps[0].split()
            got = CONTR.get(got[0].lower(), gaps[0]).split() if len(got) == 1 else got
            if got and got[0].lower() == m.get("prep", "").lower():
                got = got[1:]
            case, g, art = m.get("case"), m.get("g"), m.get("art")
            want = DEF[case][g] if art == "def" else (("ein" if art == "indef" else m.get("stem", "k" + "ein")) + EIN[case][g]) if case in EIN else None
            if art == "indef" and g == "pl":
                want = None   # obestämd artikel finns inte i plural
            if want and " ".join(got).lower() != want.lower():
                errors.append(f"{where}: {i} har '{gaps[0]}', men {m} ger '{want}'")
        if x.get("topic") == "relativ" and m.get("case") in REL:
            want = REL[m["case"]].get(m.get("g"))
            if want and gaps[0].split()[-1].lower() != want:
                errors.append(f"{where}: {i} har '{gaps[0]}', men {m} ger '{want}'")
    return errors


# Ord i en text så som appen delar upp den (tapText i src/kinds/00-common.js): börjar med en bokstav och slutar med
# bokstav eller apostrof. Glosnyckeln är ordet med små bokstäver, antingen helt eller utan elision (l'amica → amica).
TEXT_WORD = re.compile(r"[^\W\d_](?:[^\W\d_'’\-]|['’\-])*")


def text_keys(lines):
    keys = set()
    for ln in lines:
        for w in TEXT_WORD.findall(str(ln.get("fr", "")) if isinstance(ln, dict) else ""):
            w = w.rstrip("-").lower().replace("’", "'")
            keys.add(w)
            keys.add(re.sub(r"^[^\W\d_]{1,6}'", "", w))
    return keys


def check_question(q, where):
    """En flervalsfråga {q, opts, a}: a ska vara ett index i opts."""
    opts, a = q.get("opts"), q.get("a")
    if not isinstance(opts, list) or len(opts) < 2:
        return [f"{where}: frågan saknar alternativ (opts)"]
    if not isinstance(a, int) or isinstance(a, bool) or not 0 <= a < len(opts):
        return [f"{where}: facit a={a!r} finns inte bland de {len(opts)} alternativen"]
    return []


EXAM_TYPES = ("match", "gaps", "short", "pick", "chart", "timed")
_EXAM_ICONS = None


def exam_icons():
    """Nycklarna i bilduppsättningen EX_ICONS i src/kinds/70-exam.js (bildval, type "pick")."""
    global _EXAM_ICONS
    if _EXAM_ICONS is None:
        src = (pathlib.Path(__file__).resolve().parent / "src" / "kinds" / "70-exam.js").read_text(encoding="utf-8")
        m = re.search(r"const EX_ICONS=\{(.*?)\n\};", src, re.S)
        _EXAM_ICONS = set(re.findall(r"([A-Za-z_]\w*):\[", m.group(1))) if m else set()
    return _EXAM_ICONS


def is_exam_icon(key, icons):
    # Klockslagen skapas i en slinga i 70-exam.js: kl1 … kl12 och kl1.30 … kl12.30
    return isinstance(key, str) and (key in icons or re.fullmatch(r"kl(1[0-2]|[1-9])(\.30)?", key) is not None)


def check_timed(t, where):
    """Talat svar på tid: prep (0–1800) och speak (10–1800) i hela sekunder."""
    prep, speak = t.get("prep", 0), t.get("speak")
    ok = lambda v, lo: isinstance(v, int) and not isinstance(v, bool) and lo <= v <= 1800
    if not ok(prep, 0) or not ok(speak, 10):
        return [f"{where}: prep och speak ska vara sekunder (prep 0–1800, speak 10–1800), fick prep={prep!r} speak={speak!r}"]
    return []


def check_chart(t, where):
    """Grafikbeskrivning: chart {kind bar/line, title, labels, series [{name, values}] (1–3)}, task, minWords (maxWords)."""
    c, errors = t.get("chart"), []
    if not isinstance(c, dict):
        return [f"{where}: grafikuppgiften behöver chart"]
    labels, series = c.get("labels"), c.get("series")
    if c.get("kind") not in ("bar", "line"):
        errors.append(f"{where}: chart.kind ska vara bar eller line")
    if not c.get("title"):
        errors.append(f"{where}: chart.title saknas")
    if not isinstance(labels, list) or not labels or not all(isinstance(x, str) and x for x in labels):
        errors.append(f"{where}: chart.labels ska vara en lista med text")
        labels = []
    if not isinstance(series, list) or not 1 <= len(series) <= 3:
        errors.append(f"{where}: chart.series ska ha 1–3 serier")
        series = []
    for s in series:
        vals = s.get("values") if isinstance(s, dict) else None
        if not isinstance(s, dict) or not s.get("name") or not isinstance(vals, list) or len(vals) != len(labels) \
                or not all(isinstance(v, (int, float)) and not isinstance(v, bool) and v >= 0 for v in vals):
            errors.append(f"{where}: varje serie behöver name och lika många värden (≥ 0) som labels")
    mn, mx = t.get("minWords"), t.get("maxWords")
    if not str(t.get("task") or "").strip() or not isinstance(mn, int) or mn < 1 or (mx is not None and (not isinstance(mx, int) or mx < mn)):
        errors.append(f"{where}: grafikuppgiften behöver task och minWords (och maxWords ≥ minWords)")
    return errors


def check_exam_task(t, where):
    """Provuppgifter med type (SPEC överst i src/kinds/70-exam.js): para ihop, lucktext, kortsvar, bildval, grafik och tal på tid."""
    typ = t.get("type")
    errors = []
    if t.get("scale") is not None and t.get("scale") not in ("delf", "tdn", "pct"):
        errors.append(f"{where}: okänd scale {t.get('scale')!r} (delf, tdn eller pct)")
    if typ is None:
        if "speak" in t:   # vanlig taluppgift med timer: prep och speak i sekunder
            errors += check_timed(t, where)
        return errors
    if typ not in EXAM_TYPES:
        return [f"{where}: okänd type {typ!r} ({', '.join(EXAM_TYPES)})"]
    items = t.get("items")
    if typ in ("match", "short", "pick") and (not isinstance(items, list) or not items):
        return errors + [f"{where}: type {typ} behöver items"]
    if typ == "timed":
        if not str(t.get("task") or "").strip():
            errors.append(f"{where}: talat svar på tid behöver task")
        return errors + check_timed(t, where)
    if typ == "chart":
        return errors + check_chart(t, where)
    if typ == "pick":
        icons = exam_icons()
        for i, it in enumerate(items):
            opts, a = it.get("opts"), it.get("a")
            if not it.get("q") or not isinstance(opts, list) or len(opts) < 2:
                errors.append(f"{where} fråga {i + 1}: bildval behöver q och minst två opts")
                continue
            bad = [o for o in opts if not is_exam_icon(o, icons)]
            if bad:
                errors.append(f"{where} fråga {i + 1}: okända bilder {bad} (se EX_ICONS i src/kinds/70-exam.js)")
            if len(set(map(str, opts))) != len(opts):
                errors.append(f"{where} fråga {i + 1}: samma bild två gånger bland alternativen")
            if not isinstance(a, int) or isinstance(a, bool) or not 0 <= a < len(opts):
                errors.append(f"{where} fråga {i + 1}: facit a={a!r} finns inte bland de {len(opts)} bilderna")
        return errors
    if typ == "match":
        opts = t.get("opts")
        if not isinstance(opts, list) or len(opts) < 2:
            return [f"{where}: para ihop behöver opts (minst två)"]
        for i, it in enumerate(items):
            a = it.get("a")
            ok = isinstance(a, int) and not isinstance(a, bool) and (0 <= a < len(opts) or (a == -1 and "none" in t))
            if not it.get("q") or not ok:
                errors.append(f"{where} rad {i + 1}: behöver q och a = index i opts (eller -1 när uppgiften har none)")
        used = [it.get("a") for it in items if isinstance(it.get("a"), int) and it.get("a") >= 0]
        if not t.get("reuse") and len(used) != len(set(used)):
            errors.append(f"{where}: samma alternativ är facit flera gånger (sätt reuse: true om det är meningen)")
    elif typ == "short":
        for i, it in enumerate(items):
            a = it.get("a")
            if not it.get("q") or not isinstance(a, list) or not a or not all(isinstance(x, str) and x.strip() for x in a):
                errors.append(f"{where} fråga {i + 1}: kortsvar behöver q och a = lista med godkända svar")
    else:
        gaps, bank = t.get("gaps"), t.get("bank")
        text = " ".join(str(ln.get("fr", "")) for ln in t.get("lines") or [] if isinstance(ln, dict))
        marks = [int(m) for m in re.findall(r"\{(\d+)\}", text)]
        if not isinstance(gaps, list) or not gaps:
            return [f"{where}: lucktexten behöver gaps"]
        if marks != list(range(1, len(gaps) + 1)):
            errors.append(f"{where}: markörerna {{1}}, {{2}} … i lines ska komma i ordning, en per lucka ({len(gaps)} luckor, markörer {marks})")
        for i, g in enumerate(gaps):
            errors += check_question({"opts": bank, "a": g.get("a")} if bank is not None else g, f"{where} lucka {i + 1}")
        if bank is not None and len({g.get("a") for g in gaps}) != len(gaps):
            errors.append(f"{where}: samma ord i listan (bank) är facit i flera luckor")
    return errors


def check_content(content, section_ids, where, has_book=True):
    """Kontrollerar innehållet: facit inom alternativen, att avsnitten (sec) finns i words.txt och att glosorna finns i texten."""
    errors, warnings = [], []
    for kind in ("reading", "listening"):
        for t in content.get(kind, []):
            for i, q in enumerate(t.get("questions", [])):
                errors += check_question(q, f"{where}/content/{kind}.json: {t.get('id')} fråga {i + 1}")
    for t in content.get("culture", []):
        if isinstance(t.get("q"), dict):
            errors += check_question(t["q"], f"{where}/content/culture.json: {t.get('id')}")
    for x in content.get("teori", []):
        errors += check_question(x, f"{where}/content/teori.json: {x.get('id')}")
    for x in content.get("satsanalys", []):   # a inom opts och exakt en markerad del [[…]]
        errors += check_question(x, f"{where}/content/satsanalys.json: {x.get('id')}")
        if str(x.get("fr", "")).count("[[") != 1 or "]]" not in str(x.get("fr", "")):
            errors.append(f"{where}/content/satsanalys.json: {x.get('id')} ska ha exakt en markerad del [[…]] i fr")
    for x in content.get("transkription", []):   # facit ipa och tre felalternativ som skiljer sig från facit
        alt = x.get("alt")
        if not x.get("fr") or not x.get("ipa") or not isinstance(alt, list) or len(alt) < 3 or x.get("ipa") in alt or len(set(alt)) != len(alt):
            errors.append(f"{where}/content/transkription.json: {x.get('id')} behöver fr, ipa och minst tre olika alt som inte är facit")
    exam = content.get("exam")
    if isinstance(exam, dict):
        for t in exam.get("tasks", []):
            for i, q in enumerate(t.get("qs") or []):
                errors += check_question(q, f"{where}/content/exam.json: {t.get('id')} fråga {i + 1}")
            errors += check_exam_task(t, f"{where}/content/exam.json: {t.get('id')}")
    missing_book = set()
    for kind, items in content.items():
        if kind == "grammar" or not isinstance(items, list):
            continue
        for x in items:
            if isinstance(x, dict) and x.get("sec") and x["sec"] not in section_ids:
                # Utan den privata bokmappen saknas bokens kapitel (k4 …): då räknas de bara, bygget ska gå igenom ändå
                if not has_book:
                    missing_book.add(x["sec"])
                    continue
                errors.append(f"{where}/content/{kind}.json: {x.get('id')} har sec '{x['sec']}', som inte finns i words.txt")
    if missing_book:
        warnings.append(f"{where}: innehåll för avsnitt som bara finns i bokmappen ({', '.join(sorted(missing_book))}), som saknas i den här kopian")
    # Glosor som inte går att trycka på eftersom ordet inte finns i texten
    for kind in ("reading", "listening", "culture"):
        for t in content.get(kind, []):
            keys = text_keys(t.get("lines", []))
            for k in (t.get("gloss") or {}):
                if k not in keys:
                    errors.append(f"{where}/content/{kind}.json: {t.get('id')} har glosan '{k}', men ordet finns inte i texten (nyckeln ska vara ordet med små bokstäver, utan l'/d' …)")
    return errors, warnings


# ---------------------------------------------------------------------------------------------------------
# Fälten per innehållstyp, så som appen läser dem (src/kinds/*.js; formaten i docs/spec/). Ett fält som saknas
# syns annars först som ett fel i appen. CONTENT_FIELDS: typ -> {fält: typ i Python}; str-fält får inte vara tomma.
# Resten (texternas rader, luckorna i berättelserna, skrivuppgifternas krav …) kontrolleras i check_fields.
# ---------------------------------------------------------------------------------------------------------
TEXT_FIELDS = {"id": str, "sec": str, "title": str, "lines": list, "questions": list}
CONTENT_FIELDS = {
    "listening": TEXT_FIELDS,
    "reading": TEXT_FIELDS,
    "culture": {"id": str, "sec": str, "title": str, "lines": list, "q": dict, "ask": str, "model": str},
    "stories": {"id": str, "sec": str, "title": str, "text": str, "gaps": list},
    "phrases": {"id": str, "sit": str, "fr": str, "alt": list, "why": str},
    "prompts": {"id": str, "title": str, "task": str, "min": int, "max": int, "model": str},
    "mal": {"id": str, "sec": str, "goals": list},
    "uttal": {"id": str, "title": str, "pairs": list},
    "teori": {"id": str, "sec": str, "q": str, "opts": list, "why": str},
    "transkription": {"id": str, "sec": str, "topic": str, "fr": str, "ipa": str, "alt": list, "why": str},
    "satsanalys": {"id": str, "sec": str, "lvl": int, "t": str, "fr": str, "opts": list, "why": str},
}
OPTIONAL_FIELDS = {"sec": str, "gloss": dict, "sv": str, "modelSv": str, "tip": str, "need": dict, "level": str, "ok": list, "cat": str}
STORY_CATS = {"tempus", "bindeord"}   # gaps[].cat i stories.json (21-stories.js räknar allt utom bindeord som tempus)
SATS_TYPES = {"fn", "prop"}   # SATS_GROUPS i 62-satsanalys.js
QUESTION_TYPES = {None, "helhet", "detalj", "tolkning"}   # questions[].type i hör- och lästexter (textQ i 30-texts.js)


def js_tok(s):
    """Orden i en text som appen räknar dem (tok i src/kinds/00-common.js)."""
    s = re.sub(r"[’`´]", "'", str(s).lower())
    return re.sub(r"[«»\"“”!?.,;:…()\-–—]", " ", s).split()


def found_connectors(text, connectors):
    """Bindeorden i texten som foundConnectors i src/kinds/40-writing.js: på varje ställe räknas bara det längsta."""
    text, hits = re.sub(r"[’`´]", "'", str(text)), []
    for c in connectors:
        if not isinstance(c, str) or not c:
            continue
        pat = r"(?<![^\W\d_])(?=(" + re.escape(re.sub(r"[’`´]", "'", c)) + r")(?![^\W\d_]))"
        hits += [(m.start(), m.start() + len(m.group(1)), c) for m in re.finditer(pat, text, re.I)]
    hits.sort(key=lambda h: (-(h[1] - h[0]), h[0]))
    taken, found = [], set()
    for i, j, c in hits:
        if not any(i < b and a < j for a, b in taken):
            taken.append((i, j))
            found.add(c)
    return [c for c in connectors if c in found]


def need_fields(x, fields):
    """Fel för fält som saknas, har fel typ eller är tomma."""
    out = []
    for k, t in fields.items():
        v = x.get(k)
        if v is None or v == "" or v == [] or v == {}:
            out.append(f"saknar {k}")
        elif not isinstance(v, t) or (t is int and isinstance(v, bool)):
            out.append(f"{k} ska vara {'text' if t is str else 'ett heltal' if t is int else 'en lista' if t is list else 'ett objekt'}")
    for k, t in OPTIONAL_FIELDS.items():
        if k in x and k not in fields and x[k] is not None and not isinstance(x[k], t):
            out.append(f"{k} ska vara {'text' if t is str else 'en lista' if t is list else 'ett objekt'}")
    return out


def check_lines(lines, sv=True):
    """lines = [{who?, fr, sv}]: texten på målspråket (tl) och översättningen (tapText med sv)."""
    bad = [i + 1 for i, ln in enumerate(lines) if not isinstance(ln, dict) or not isinstance(ln.get("fr"), str) or not ln["fr"].strip()
           or (sv and not isinstance(ln.get("sv"), str))]
    return [f"rad {', '.join(map(str, bad[:5]))} saknar fr" + (" eller sv" if sv else "")] if bad else []


def check_fields(content, where, connectors=None, tenses=None):
    """Kontrollerar att varje post i content har de fält appen läser (CONTENT_FIELDS), och formen på det som
    appen räknar med: texternas rader och frågor, berättelsernas luckor, frasernas felalternativ, uttalets ordpar,
    målen, regelsidorna och provuppgifterna. Skrivuppgifternas modelltext ska klara uppgiftens egna krav
    (ordgränserna och need.connectors), och need.tenses ska finnas i kursens tenseCheck (connectors och tenses
    med arvet inräknat; None = hoppa över). Returnerar (fel, varningar)."""
    errors, warnings = [], []
    for kind, fields in CONTENT_FIELDS.items():
        items = content.get(kind)
        if items is None:
            continue
        f = f"{where}/content/{kind}.json"
        if not isinstance(items, list):
            errors.append(f"{f}: ska vara en lista")
            continue
        other = {}   # berättelseluckor med annan cat än tempus/bindeord
        for n, x in enumerate(items):
            if not isinstance(x, dict):
                errors.append(f"{f}: post {n + 1} ska vara ett objekt")
                continue
            i = x.get("id") or f"post {n + 1}"
            err = lambda msg: errors.append(f"{f}: {i} {msg}")
            for msg in need_fields(x, fields):
                err(msg)
            if kind in ("listening", "reading", "culture") and isinstance(x.get("lines"), list):
                for msg in check_lines(x["lines"]):
                    err(msg)
            if kind in ("listening", "reading") and isinstance(x.get("questions"), list):
                for k, q in enumerate(x["questions"]):
                    if not isinstance(q, dict) or not isinstance(q.get("q"), str) or not q["q"].strip():
                        err(f"fråga {k + 1} saknar q")
                    elif q.get("type") not in QUESTION_TYPES:
                        other.setdefault(("type", q.get("type")), []).append(f"{i}:{k + 1}")
            if kind == "culture" and isinstance(x.get("q"), dict) and not x["q"].get("q"):
                err("saknar frågan q.q")
            if kind == "stories" and isinstance(x.get("text"), str) and isinstance(x.get("gaps"), list):
                inner = GAP.findall(x["text"])
                if x["text"].count("[") != x["text"].count("]") or x["text"].count("[") != len(inner):
                    err("har en hakparentes som inte går jämnt ut i text")
                if not inner:
                    err("saknar luckor [rätt|fel|fel] i text")
                if len(inner) != len(x["gaps"]):
                    err(f"har {len(inner)} luckor i text men {len(x['gaps'])} i gaps (en post i gaps per lucka, i samma ordning)")
                for k, g in enumerate(inner):
                    opts = [o.strip() for o in g.split("|")]
                    if len(opts) < 2 or not all(opts) or len(set(opts)) != len(opts):
                        err(f"lucka {k + 1} [{g}] ska ha rätt svar först och minst ett annat, olika alternativ, åtskilda av |")
                for k, g in enumerate(x["gaps"]):
                    if not isinstance(g, dict) or not g.get("cat") or not g.get("why"):
                        err(f"gaps[{k}] behöver cat ({' eller '.join(sorted(STORY_CATS))}) och why")
                    elif g["cat"] not in STORY_CATS:
                        other.setdefault(g["cat"], []).append(f"{i}[{k}]")
            if kind == "phrases" and isinstance(x.get("alt"), list) and isinstance(x.get("fr"), str):
                if not all(isinstance(a, str) and a.strip() for a in x["alt"]):
                    err("alt ska vara en lista med felalternativ (text)")
                elif x["fr"].strip() in {a.strip() for a in x["alt"]}:
                    err("har frasen själv bland felalternativen (alt)")
            if kind == "mal" and isinstance(x.get("goals"), list) and not all(isinstance(g, str) and g.strip() for g in x["goals"]):
                err("goals ska vara en lista med mål (text)")
            if kind == "uttal" and isinstance(x.get("pairs"), list):
                bad = [k + 1 for k, p in enumerate(x["pairs"]) if not isinstance(p, list) or len(p) < 2
                       or not all(isinstance(w, str) and w.strip() for w in p) or len(set(p)) != len(p)]
                if bad:
                    err(f"ordpar {', '.join(map(str, bad[:5]))} ska vara listor med minst två olika ord")
            if kind == "satsanalys" and x.get("t") not in SATS_TYPES:
                err(f"har t {x.get('t')!r} (ska vara {' eller '.join(sorted(SATS_TYPES))})")
            if kind == "prompts" and isinstance(x.get("min"), int) and isinstance(x.get("max"), int):
                errors_w, warns_w = check_prompt(x, connectors, tenses)
                errors += [f"{f}: {i} {m}" for m in errors_w]
                warnings += [f"{f}: {i} {m}" for m in warns_w]
        for cat, where_ in other.items():
            some = f"{', '.join(where_[:3])}{' …' if len(where_) > 3 else ''}"
            if isinstance(cat, tuple):
                warnings.append(f"{f}: type '{cat[1]}' i {len(where_)} frågor ({some}) visas utan etikett (30-texts.js känner bara till helhet, detalj och tolkning)")
            else:
                warnings.append(f"{f}: cat '{cat}' i {len(where_)} luckor ({some}) räknas som tempus i statistiken (21-stories.js känner bara till {' och '.join(sorted(STORY_CATS))})")
    regler = content.get("regler")
    if regler is not None:
        f = f"{where}/content/regler.json"
        if not isinstance(regler, dict):
            errors.append(f"{f}: ska vara ett objekt {{<område>: {{title, intro, parts}}}}")
        else:
            for topic, r in regler.items():
                if not isinstance(r, dict) or not isinstance(r.get("title"), str) or not r["title"] or not isinstance(r.get("parts"), list) or not r["parts"]:
                    errors.append(f"{f}: {topic} behöver title och parts")
                    continue
                kort = r.get("kort")
                if kort is not None:
                    lines = kort.split("\n") if isinstance(kort, str) else kort
                    if not isinstance(lines, list) or not all(isinstance(x, str) for x in lines) or not any(x.strip() for x in lines):
                        errors.append(f"{f}: {topic}: kort ska vara en sträng (rader med \\n) eller en lista med strängar")
                    elif len([x for x in lines if x.strip()]) > 6:
                        warnings.append(f"{f}: {topic}: kort har {len([x for x in lines if x.strip()])} rader (2–5 är lagom)")
                for k, p in enumerate(r["parts"]):
                    if not isinstance(p, dict) or not any(p.get(a) for a in ("h", "t", "table", "ex")):
                        errors.append(f"{f}: {topic} del {k + 1} är tom (behöver h, t, table eller ex)")
                        continue
                    if "ex" in p and (not isinstance(p["ex"], list) or not all(isinstance(e, dict) and isinstance(e.get("fr"), str) and e["fr"] for e in p["ex"])):
                        errors.append(f"{f}: {topic} del {k + 1}: ex ska vara en lista med {{fr, sv}}")
                    tb = p.get("table")
                    if tb is not None and (not isinstance(tb, dict) or not isinstance(tb.get("rows"), list)
                                           or not all(isinstance(row, list) for row in tb["rows"]) or not isinstance(tb.get("head", []), list)):
                        errors.append(f"{f}: {topic} del {k + 1}: table ska vara {{head: [...], rows: [[...], ...]}}")
    exam = content.get("exam")
    if exam is not None:
        f = f"{where}/content/exam.json"
        if not isinstance(exam, dict) or not isinstance(exam.get("tasks"), list) or not isinstance(exam.get("parts"), list):
            errors.append(f"{f}: ska vara ett objekt med parts och tasks")
        else:
            parts = {p.get("id") for p in exam["parts"] if isinstance(p, dict)}
            for n, p in enumerate(exam["parts"]):
                if not isinstance(p, dict) or not p.get("id") or not p.get("name"):
                    errors.append(f"{f}: del {n + 1} i parts behöver id och name")
            for n, t in enumerate(exam["tasks"]):
                if not isinstance(t, dict):
                    errors.append(f"{f}: uppgift {n + 1} ska vara ett objekt")
                    continue
                i = t.get("id") or f"uppgift {n + 1}"
                for k in ("id", "part", "title", "instr"):
                    if not isinstance(t.get(k), str) or not t[k]:
                        errors.append(f"{f}: {i} saknar {k}")
                if t.get("part") and t["part"] not in parts:
                    errors.append(f"{f}: {i} har part '{t['part']}', som inte finns i parts")
                if t.get("lines") is not None:
                    if not isinstance(t["lines"], list):
                        errors.append(f"{f}: {i} lines ska vara en lista")
                    else:
                        errors += [f"{f}: {i} {m}" for m in check_lines(t["lines"], sv=False)]
                kind = t.get("type") or ("mc" if t.get("qs") else "write" if t.get("minWords") else "speak")
                if kind == "mc" and not all(isinstance(q, dict) and q.get("q") for q in t["qs"]):
                    errors.append(f"{f}: {i} har en fråga i qs utan q")
                if kind in ("write", "speak") and not t.get("task"):
                    errors.append(f"{f}: {i} ({'skriva' if kind == 'write' else 'tala'}) saknar task")
                if kind == "write" and isinstance(t.get("model"), str) and isinstance(t.get("minWords"), int):
                    n_w = len(js_tok(t["model"]))
                    if n_w < t["minWords"]:
                        warnings.append(f"{f}: {i} har en modelltext på {n_w} ord, men minWords är {t['minWords']}")
    return errors, warnings


def check_prompt(p, connectors, tenses):
    """En skrivuppgift: min ≤ max, need = {connectors, chapterWords, tenses}, och modelltexten klarar ordgränserna
    och antalet bindeord (samma räkning som checklistan i 40-writing.js). Returnerar (fel, varningar).
    need.chapterWords kontrolleras inte här: böjningsreglerna per språk (usesWord i 40-writing.js) finns bara i JS,
    och att modelltexterna har sina kapitelord kontrolleras av tests/run_tests.py ("modelltexterna klarar checklistan")."""
    errors, warnings = [], []
    lo, hi, need = p["min"], p["max"], p.get("need") or {}
    if not 0 < lo <= hi:
        errors.append(f"har min {lo} och max {hi} (ska vara 0 < min ≤ max)")
    for k in ("connectors", "chapterWords"):
        if k in need and (not isinstance(need[k], int) or isinstance(need[k], bool) or need[k] < 0):
            errors.append(f"need.{k} ska vara ett heltal")
    ts = need.get("tenses", [])
    if not isinstance(ts, list) or not all(isinstance(t, str) for t in ts):
        errors.append("need.tenses ska vara en lista med tempusnamn")
    elif tenses is not None:
        for t in ts:
            if t not in tenses:
                errors.append(f"har need.tenses '{t}', som inte finns i kursens tenseCheck (appen hoppar över det; finns: {', '.join(sorted(tenses)) or 'inget'})")
    model = p.get("model") or ""
    n = len(js_tok(model))
    if not lo <= n <= hi:
        warnings.append(f"har en modelltext på {n} ord, utanför uppgiftens {lo}–{hi}")
    want = need.get("connectors")
    if isinstance(want, int) and want and connectors is not None:
        got = found_connectors(model, connectors)
        if len(got) < want:
            warnings.append(f"har en modelltext med {len(got)} bindeord ({', '.join(got) or 'inga'}), men need.connectors är {want}")
    return errors, warnings


# ---------------------------------------------------------------------------------------------------------
# Id-lås. Framstegen hänger på id:n (ord-id i S.w, avsnitts-id i S.src/S.chapter, innehålls-id i statistiken,
# grammatikområden i S.gt och regler i S.gr) och på storageKey. languages/<kod>/ids.lock (incheckad) listar
# alla id som någonsin har byggts. Ett id som försvinner stoppar bygget, liksom en ändrad eller dubblerad
# storageKey. Nya id läggs till automatiskt. Bokens id (privata book/) låses i book/ids.lock, så att det
# publika låset inte avslöjar bokens innehåll. En borttagning som verkligen är meningen godkänns med
# `python3 build.py --allow-removed <kod>:<id>` (eller <kod>:<typ>|<id>) eller en rad <id> eller <typ>|<id>
# i languages/<kod>/ids.removed (book/ids.removed för bokens id).
# ---------------------------------------------------------------------------------------------------------
LOCK_NOTE = "Skrivs av build.py. Id:n här får aldrig försvinna (framstegen hänger på dem), se CLAUDE.md om hur en borttagning godkänns."


def content_ids(stem, data, book, out):
    """Lägger id:n i en innehållsfil i out ({typ: {id: från_boken}}). grammar-*.json blir en typ, exam.json:s uppgifter typen prov."""
    kind = "grammar" if stem.startswith("grammar-") else stem
    if isinstance(data, list):
        items, typ = data, "innehåll/" + kind
    elif stem == "exam" and isinstance(data, dict):
        items, typ = data.get("tasks", []), "prov"
    else:
        return
    d = out.setdefault(typ, {})
    for x in items:
        if isinstance(x, dict) and x.get("id") is not None:
            d.setdefault(str(x["id"]), book)


def collect_ids(origin, found, grammar):
    """{typ: {id: från_boken}} för en kurs."""
    ids = {"ord": dict(origin["ord"]), "avsnitt": dict(origin["avsnitt"]), **found}
    if isinstance(grammar, dict):
        ids["grammatikområden"] = {t["id"]: False for t in grammar.get("topics", []) if isinstance(t, dict) and t.get("id")}
        ids["grammatikregler"] = {k: False for k in grammar.get("rules", {})}
    return ids


def read_lock(path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        sys.exit(f"{path.relative_to(ROOT)}: kan inte läsas ({e}). Återställ filen med git.")


def read_removed(path):
    """Godkända borttagningar: rader <id> eller <typ>|<id>, // är kommentar."""
    if not path.exists():
        return set()
    return {ln.strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.strip() and not ln.strip().startswith("//")}


# Id som bytt namn: languages/<kod>/ids.renamed (incheckad, book/ids.renamed för bokens ord) med rader
# <typ>|<gammalt id>|<nytt id>, t.ex. ord|prendre la retraite|prendre sa retraite. Ett låst id som försvunnit men står
# som gammalt id godkänns om det nya finns i kursen; låset uppdateras (det gamla bort, det nya in). Finns det nya redan
# sedan förut slås de två ihop. Kursens datafil får renames = {gammalt: nytt} (kedjor a → b → c upplösta), och appen
# flyttar elevernas framsteg till det nya id:t varje gång ett läge läses in (applyRenames i src/app.js). Raderna ska
# ligga kvar för alltid: en elev som inte öppnat kursen sedan bytet har fortfarande det gamla id:t i sitt sparade läge.
# Bara ord stöds (appen flyttar bara ord-id).
RENAME_TYPES = ("ord",)


def read_renamed(code):
    """({typ: {gammalt: nytt}} med kedjor upplösta, fel). Läser ids.renamed och book/ids.renamed."""
    d = LANG_DIR / code
    errors, out = [], {}
    for path in [d / "ids.renamed", d / "book" / "ids.renamed"]:
        if not path.exists():
            continue
        for no, ln in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            s = ln.strip()
            if not s or s.startswith("//"):
                continue
            where = f"{path.relative_to(ROOT)}:{no}"
            parts = s.split("|")
            if len(parts) != 3 or not all(x.strip() for x in parts):
                errors.append(f"{where}: raden ska vara <typ>|<gammalt id>|<nytt id>")
                continue
            typ, old, new = (x.strip() for x in parts)
            if typ not in RENAME_TYPES:
                errors.append(f"{where}: typen '{typ}' kan inte byta namn (bara {', '.join(RENAME_TYPES)}; appen flyttar bara ord-id)")
            elif old == new:
                errors.append(f"{where}: det gamla och det nya id:t är samma")
            elif old in out.get(typ, {}) and out[typ][old] != new:
                errors.append(f"{where}: '{old}' byter redan namn till '{out[typ][old]}'")
            else:
                out.setdefault(typ, {})[old] = new
    for typ, m in out.items():   # kedjor: a → b och b → c blir a → c och b → c
        for old in list(m):
            seen, new = {old}, m[old]
            while new in m:
                if new in seen:
                    errors.append(f"languages/{code}/ids.renamed: {typ} '{old}' byter namn i en cirkel")
                    break
                seen.add(new)
                new = m[new]
            m[old] = new
    return out, errors


def check_renamed(code, renamed, ids):
    """Det nya id:t måste finnas i kursen och det gamla får inte finnas kvar (då skulle framstegen flyttas från ett ord som finns)."""
    errors = []
    for typ, m in renamed.items():
        have = ids.get(typ, {})
        for old, new in m.items():
            if old in have:
                errors.append(f"languages/{code}/ids.renamed: {typ} '{old}' finns fortfarande i kursen; ta bort det gamla eller raden i ids.renamed")
            if new not in have:
                errors.append(f"languages/{code}/ids.renamed: {typ} '{old}' byter namn till '{new}', men '{new}' finns inte i kursen")
    return errors


def lock_ids(code, storage_key, ids, allowed, renamed=None):
    """Jämför kursens id med låsen. Returnerar (fel, meddelanden, {sökväg: nytt innehåll}).
    renamed = {typ: {gammalt: nytt}} ur ids.renamed (read_renamed): ett gammalt id som försvunnit godkänns när det nya finns."""
    errors, notes, writes = [], [], {}
    renamed = renamed or {}
    d = LANG_DIR / code
    has_book = (d / "book").exists()
    allowed = allowed | read_removed(d / "ids.removed") | (read_removed(d / "book" / "ids.removed") if has_book else set())
    ok_removed = lambda typ, i: i in allowed or f"{typ}|{i}" in allowed
    locks = [(d / "ids.lock", False)] + ([(d / "book" / "ids.lock", True)] if has_book else [])
    for path, book in locks:
        old = read_lock(path)
        rel = path.relative_to(ROOT)
        if old is not None and not book and old.get("storageKey") != storage_key:
            errors.append(f"languages/{code}/lang.js: storageKey är '{storage_key}', men {rel} säger '{old.get('storageKey')}'. "
                          "storageKey får aldrig ändras (elevernas framsteg ligger under den).")
        new = {"_": LOCK_NOTE}
        if not book:
            new["storageKey"] = storage_key
        for typ in sorted(set(ids) | {k for k in (old or {}) if k not in ("_", "storageKey")}):
            have = ids.get(typ, {})
            kept = []
            for i in (old or {}).get(typ, []):
                if i in have:
                    kept.append(i)
                elif i in renamed.get(typ, {}) and renamed[typ][i] in have:
                    nu = renamed[typ][i]
                    merged = nu in (old or {}).get(typ, []) or any(nu in (read_lock(p) or {}).get(typ, []) for p, _ in locks)
                    notes.append(f"{rel}: {typ} '{i}' heter nu '{nu}'" + (" (sammanslaget med ett befintligt id)" if merged else "") + ", framstegen flyttas (ids.renamed)")
                elif ok_removed(typ, i):
                    notes.append(f"{rel}: {typ} '{i}' är borttaget (godkänt)")
                else:
                    errors.append(f"languages/{code}: {typ} '{i}' finns i {rel} men inte längre i kursen. Id:n får inte försvinna eller byta namn, "
                                  f"eftersom framstegen hänger på dem. Är det meningen: python3 build.py --allow-removed {code}:{typ}|{i}")
            # Nya id hamnar i låset där de hör hemma: bokens i book/ids.lock, övriga i det publika låset
            added = [i for i, from_book in have.items() if from_book == book and i not in kept]
            if book and not has_book:
                added = []
            lst = sorted(set(kept) | set(added))
            if lst:
                new[typ] = lst
        if old is None or {k: v for k, v in new.items() if k != "_"} != {k: v for k, v in old.items() if k != "_"}:
            writes[path] = json.dumps(new, ensure_ascii=False, indent=1) + "\n"
            if old is None:
                notes.append(f"{rel}: skapad")
            else:
                n_new = sum(len(set(v) - set(old.get(k, []))) for k, v in new.items() if isinstance(v, list))
                if n_new:
                    notes.append(f"{rel}: {n_new} nya id")
    return errors, notes, writes


# ---------------------------------------------------------------------------------------------------------
# lang.js läses med en liten tokenizer i stället för reguljära uttryck, så att enkla citattecken, kommentarer,
# radbrytningar och flera fält på en rad fungerar. parse_lang_js ger kursobjektet som en dict: rena literaler
# (strängar, tal, true/false/null, listor och objekt av sådana) blir Python-värden, allt annat (regex, funktioner,
# uttryck som tenseCheck: (() => {…})()) blir JSExpr med källtexten. Bara det som build.py behöver läses.
# ---------------------------------------------------------------------------------------------------------
class JSParseError(Exception):
    pass


class JSExpr:
    """Ett värde i lang.js som inte är en ren literal (regex, funktion, uttryck). raw = källtexten."""
    def __init__(self, raw, toks=()):
        self.raw, self.toks = raw, list(toks)

    def __repr__(self):
        return f"JSExpr({self.raw[:40]!r})"


JS_REGEX_AFTER = set("(,=:[!&|?{};+-*%<>~^")   # efter de här tecknen är / början på ett reguljärt uttryck, inte division
JS_REGEX_WORDS = {"return", "typeof", "case", "in", "of", "new", "delete", "void", "throw", "else", "do"}
JS_ESC = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0"}


def js_tokens(src):
    """Delar JavaScript i token (typ, värde, start, slut). Typer: str, tmpl, num, name, regex, punct.
    Kommentarer och blanktecken hoppas över. Stoppar (JSParseError) på en sträng, en kommentar eller ett
    reguljärt uttryck som aldrig slutar."""
    toks, i, n = [], 0, len(src)
    line = lambda p: src.count("\n", 0, p) + 1
    while i < n:
        c = src[i]
        if c.isspace():
            i += 1
        elif src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            if j < 0:
                raise JSParseError(f"rad {line(i)}: kommentaren /* slutar aldrig")
            i = j + 2
        elif c in "'\"":
            out, j = [], i + 1
            while True:
                if j >= n or src[j] == "\n":
                    raise JSParseError(f"rad {line(i)}: strängen slutar aldrig")
                if src[j] == c:
                    break
                if src[j] == "\\":
                    e = src[j + 1:j + 2]
                    if e == "u":
                        m = re.match(r"\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4})", src[j + 2:])
                        out.append(chr(int(m.group(1) or m.group(2), 16)) if m else "u")
                        j += 2 + (len(m.group(0)) if m else 0)
                        continue
                    if e == "x" and re.match(r"[0-9a-fA-F]{2}", src[j + 2:j + 4]):
                        out.append(chr(int(src[j + 2:j + 4], 16)))
                        j += 4
                        continue
                    if e != "\n":   # \ + radbrytning fortsätter strängen på nästa rad
                        out.append(JS_ESC.get(e, e))
                    j += 2
                    continue
                out.append(src[j])
                j += 1
            toks.append(("str", "".join(out), i, j + 1))
            i = j + 1
        elif c == "`":   # mallsträng; med ${…} blir den ett uttryck
            j, depth = i + 1, 0
            while j < n and not (src[j] == "`" and depth == 0):
                if src[j] == "\\":
                    j += 1
                elif src.startswith("${", j):
                    depth += 1
                    j += 1
                elif src[j] == "}" and depth:
                    depth -= 1
                j += 1
            if j >= n:
                raise JSParseError(f"rad {line(i)}: mallsträngen slutar aldrig")
            body = src[i + 1:j]
            toks.append(("tmpl" if "${" in body else "str", body, i, j + 1))
            i = j + 1
        elif c.isdigit() or (c == "." and src[i + 1:i + 2].isdigit()):
            m = re.match(r"0[xX][0-9a-fA-F]+|(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?", src[i:])
            toks.append(("num", m.group(0), i, i + len(m.group(0))))
            i += len(m.group(0))
        elif c == "$" or c == "_" or c.isalpha():
            m = re.match(r"[\w$]+", src[i:])
            toks.append(("name", m.group(0), i, i + len(m.group(0))))
            i += len(m.group(0))
        elif c == "/" and (not toks or (toks[-1][0] == "punct" and toks[-1][1] in JS_REGEX_AFTER)
                           or (toks[-1][0] == "name" and toks[-1][1] in JS_REGEX_WORDS)):
            j, cls = i + 1, False
            while True:
                if j >= n or src[j] == "\n":
                    raise JSParseError(f"rad {line(i)}: det reguljära uttrycket slutar aldrig")
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                elif src[j] == "/" and not cls:
                    break
                j += 1
            m = re.match(r"[a-z]*", src[j + 1:])
            toks.append(("regex", src[i:j + 1 + len(m.group(0))], i, j + 1 + len(m.group(0))))
            i = j + 1 + len(m.group(0))
        else:
            toks.append(("punct", c, i, i + 1))
            i += 1
    return toks


def js_skip_expr(toks, i):
    """Index efter ett uttryck som börjar vid i: fram till , ; eller en stängande parentes på samma nivå."""
    depth, pairs = 0, {"(": ")", "[": "]", "{": "}"}
    while i < len(toks):
        t, v = toks[i][0], toks[i][1]
        if t == "punct" and v in pairs:
            depth += 1
        elif t == "punct" and v in ")]}":
            if depth == 0:
                return i
            depth -= 1
        elif t == "punct" and v in ",;" and depth == 0:
            return i
        i += 1
    if depth:
        raise JSParseError("parenteserna går inte jämnt ut")
    return i


def js_value(src, toks, i):
    """(värde, nästa index) för värdet som börjar vid toks[i]."""
    start = i
    end_ok = lambda k: k >= len(toks) or (toks[k][0] == "punct" and toks[k][1] in ",;)]}")
    if i >= len(toks):
        raise JSParseError("värde saknas i slutet av filen")
    t, v = toks[i][0], toks[i][1]
    val, simple = None, True
    if t == "punct" and v == "{":
        val, i = {}, i + 1
        while not (toks[i][0] == "punct" and toks[i][1] == "}"):
            kt, kv = toks[i][0], toks[i][1]
            if kt not in ("name", "str", "num") or i + 1 >= len(toks) or toks[i + 1][1] != ":" or toks[i + 1][0] != "punct":
                simple = False   # metod, ...spridning eller [beräknad] nyckel: objektet blir ett uttryck
                break
            val[kv], i = js_value(src, toks, i + 2)
            if toks[i][0] == "punct" and toks[i][1] == ",":
                i += 1
            elif not (toks[i][0] == "punct" and toks[i][1] == "}"):
                raise JSParseError(f"rad {src.count(chr(10), 0, toks[i][2]) + 1}: väntade , eller }} efter {kv}")
        if simple:
            i += 1
    elif t == "punct" and v == "[":
        val, i = [], i + 1
        while not (toks[i][0] == "punct" and toks[i][1] == "]"):
            x, i = js_value(src, toks, i)
            val.append(x)
            if toks[i][0] == "punct" and toks[i][1] == ",":
                i += 1
            elif not (toks[i][0] == "punct" and toks[i][1] == "]"):
                simple = False
                break
        if simple:
            i += 1
    elif t == "str":
        val, i = v, i + 1
    elif t == "num" or (t == "punct" and v == "-" and i + 1 < len(toks) and toks[i + 1][0] == "num"):
        neg = t == "punct"
        s = toks[i + neg][1]
        val = int(s, 16) if s[:2].lower() == "0x" else float(s) if re.search(r"[.eE]", s) else int(s)
        val, i = (-val if neg else val), i + 1 + neg
    elif t == "name" and v in ("true", "false", "null", "undefined"):
        val, i = {"true": True, "false": False}.get(v), i + 1
    else:
        simple = False
    if simple and end_ok(i):
        return val, i
    end = js_skip_expr(toks, start)
    return JSExpr(src[toks[start][2]:toks[end - 1][3]], toks[start:end]), end


def parse_lang_js(src, code=None):
    """Kursobjektet i lang.js (LANGUAGES.<kod> = {…}) som en dict. Stoppar (JSParseError) om filen inte går att läsa
    eller om koden efter LANGUAGES. inte är mappens namn."""
    toks = js_tokens(src)
    for i in range(len(toks) - 3):
        if toks[i][:2] != ("name", "LANGUAGES"):
            continue
        if toks[i + 1][1] == "." and toks[i + 2][0] == "name":
            name, j = toks[i + 2][1], i + 3
        elif toks[i + 1][1] == "[" and toks[i + 2][0] == "str" and toks[i + 3][1] == "]":
            name, j = toks[i + 2][1], i + 4
        else:
            continue
        if j + 1 < len(toks) and toks[j][1] == "=" and toks[j + 1][1] == "{":
            if code is not None and name != code:
                raise JSParseError(f"LANGUAGES.{name} ska vara LANGUAGES.{code} (samma som mappens namn)")
            try:
                val, _ = js_value(src, toks, j + 1)
            except IndexError:
                raise JSParseError("filen slutar mitt i kursobjektet (saknas en } eller ]?)") from None
            if not isinstance(val, dict):
                raise JSParseError("kursobjektet går inte att läsa (bara fält av typen namn: värde)")
            return val
    raise JSParseError(f"hittar inte LANGUAGES.{code or '<kod>'} = {{…}}")


def js_object_keys(value):
    """Nycklarna i ett objekt i lang.js: en dict, eller ett uttryck som slutar med return {…} (som tenseCheck i fr4)."""
    if isinstance(value, dict):
        return [k for k in value if k != "$remove"]
    if isinstance(value, JSExpr):
        toks = value.toks
        for i in range(len(toks) - 1, 0, -1):
            if toks[i - 1][:2] == ("name", "return") and toks[i][1] == "{":
                try:
                    v, _ = js_value(value.raw, [(a, b, s - toks[0][2], e - toks[0][2]) for a, b, s, e in toks[i:]], 0)
                except (IndexError, JSParseError):
                    return []
                return list(v) if isinstance(v, dict) else []
    return []


def conf_parent(conf):
    """(förälder, [ärvda fält]) ur extends och inherit, eller (None, [])."""
    ext, inh = conf.get("extends"), conf.get("inherit")
    return (ext if isinstance(ext, str) else None), ([f for f in inh if isinstance(f, str)] if isinstance(inh, list) else [])


def has_field(confs, code, field, seen=()):
    """Kursen har fältet i sin lang.js, eller ärver det (extends + inherit) från en kurs som har det."""
    conf = confs.get(code) or {}
    if field in conf:
        return True
    parent, inherit = conf_parent(conf)
    return bool(parent and parent not in seen and field in inherit and has_field(confs, parent, field, seen + (code,)))


def resolve_field(confs, code, field, seen=()):
    """Fältet med arvet inräknat (samma regler som inheritCourses i app.js, för rena literaler som connectors)."""
    conf = confs.get(code) or {}
    parent, inherit = conf_parent(conf)
    if parent and field in inherit and parent in confs and parent not in seen:
        return merge_inherited(resolve_field(confs, parent, field, seen + (code,)), conf.get(field))
    return conf.get(field)


def tense_names(confs, code, seen=()):
    """Namnen i tenseCheck (egna och ärvda): need.tenses i skrivuppgifterna måste finnas här, annars hoppar appen över dem."""
    conf = confs.get(code) or {}
    own = conf.get("tenseCheck")
    names = set(js_object_keys(own))
    parent, inherit = conf_parent(conf)
    if parent and "tenseCheck" in inherit and parent in confs and parent not in seen:
        drop = set(own.get("$remove", [])) if isinstance(own, dict) else set()
        names |= tense_names(confs, parent, seen + (code,)) - drop
    return names


def merge_inherited(base, own):
    """Samma regler som mergeInherited i src/app.js: objekt slås ihop nyckel för nyckel (kursens egna värden vinner,
    förälderns ordning behålls), {"$append": [...]} lägger till i förälderns lista och {"$remove": [nycklar]} tar bort nycklar."""
    if own is None:
        return base
    if isinstance(own, dict) and isinstance(own.get("$append"), list):
        return (base if isinstance(base, list) else []) + own["$append"]
    if not isinstance(own, dict) or not isinstance(base, dict):
        return own
    drop, out = set(own.get("$remove", [])), {}
    for k, v in base.items():
        if k not in drop:
            out[k] = merge_inherited(v, own[k]) if k in own else v
    for k, v in own.items():
        if k != "$remove" and k not in out:
            out[k] = v
    return out


def resolve_verbs(confs, own, code, seen=()):
    """Verbtabellerna (languages/<kod>/verbs.json: sv, tenses, notes) med arvet inräknat. Ärver kursen "verbs"
    (extends + inherit) slås förälderns tabeller ihop med kursens egna, med samma regler som inheritCourses i app.js
    använder för resten av verbs (persons, prefix, games) i lang.js. Tabellerna följer med kursens datafil (verbTables)."""
    conf = confs.get(code) or {}
    parent, inherit = conf_parent(conf)
    if parent and "verbs" in inherit and parent in confs and parent not in seen:
        return merge_inherited(resolve_verbs(confs, own, parent, seen + (code,)), own.get(code))
    return own.get(code)


def check_extends(confs):
    """extends/inherit i lang.js: kursen som ärvs från ska finnas, inga cirklar, och storageKey ärvs aldrig."""
    errors, parent = [], {}
    for code, conf in confs.items():
        ext, inh = conf.get("extends"), conf.get("inherit")
        # Ett extends/inherit/nextCourse i en form som build.py inte kan läsa skulle annars tyst hoppa över kontrollerna
        if ext is not None and not isinstance(ext, str):
            errors.append(f"languages/{code}/lang.js: extends ska vara en kod inom citattecken, t.ex. extends: \"de\"")
            ext = None
        if inh is not None and (not isinstance(inh, list) or not all(isinstance(f, str) for f in inh)):
            errors.append(f"languages/{code}/lang.js: inherit ska vara en lista med fältnamn inom citattecken")
            inh = None
        if ext:
            parent[code] = ext
            if ext not in confs:
                errors.append(f"languages/{code}/lang.js: extends '{ext}' finns inte")
            if inh is None:
                errors.append(f"languages/{code}/lang.js: extends utan inherit (lista fälten som ska ärvas)")
        elif inh is not None:
            errors.append(f"languages/{code}/lang.js: inherit utan extends")
        if inh and set(inh) & {"storageKey", "code", "words", "content", "videos", "grammar"}:
            errors.append(f"languages/{code}/lang.js: storageKey, words, content, videos och grammar kan inte ärvas")
        # Ett fält i inherit som föräldern inte har (t.ex. ett stavfel) skulle annars tyst bli tomt i webbläsaren
        # Föräldern kan i sin tur ha ärvt fältet (it3 → it2 → it1), så kedjan följs
        if ext and inh and ext in confs:
            for f in inh:
                if not has_field(confs, ext, f):
                    errors.append(f"languages/{code}/lang.js: inherit '{f}' finns inte i languages/{ext}/lang.js")
        # nextCourse: en kod ("de6") eller en lista med koder (["fr5", "fru"]); varje kurs måste finnas
        nxt = conf.get("nextCourse")
        if nxt is not None and not (isinstance(nxt, str) or (isinstance(nxt, list) and all(isinstance(n, str) for n in nxt))):
            errors.append(f"languages/{code}/lang.js: nextCourse ska vara en kod eller en lista med koder inom citattecken")
            nxt = None
        for n in [nxt] if isinstance(nxt, str) else nxt or []:
            if n not in confs:
                errors.append(f"languages/{code}/lang.js: nextCourse '{n}' finns inte")
            elif n == code:
                errors.append(f"languages/{code}/lang.js: nextCourse pekar på kursen själv")
    for code in parent:
        seen, c = set(), code
        while c in parent:
            if c in seen:
                errors.append(f"languages/{code}/lang.js: extends går runt i en cirkel")
                break
            seen.add(c)
            c = parent[c]
    return errors


def check_grammar_refs(content, grammar, section_ids, where, has_book):
    """Grammatikfrågornas topic och rule ska finnas i grammar.json, områdenas secs i words.txt och
    reglerna (content/regler.json) ska höra till ett område. Annars syns frågan eller regeln aldrig i appen."""
    errors = []
    if not isinstance(grammar, dict):
        return [f"{where}/grammar.json saknas, men kursen har grammatikfrågor"] if content.get("grammar") else []
    topics = {t.get("id") for t in grammar.get("topics", []) if isinstance(t, dict)}
    rules = set(grammar.get("rules", {}))
    for x in content.get("grammar", []):
        if x.get("topic") and x["topic"] not in topics:
            errors.append(f"{where}/content/grammar-*.json: {x.get('id')} har topic '{x['topic']}', som inte finns i grammar.json")
        if x.get("rule") and x["rule"] not in rules:
            errors.append(f"{where}/content/grammar-*.json: {x.get('id')} har rule '{x['rule']}', som inte finns i grammar.json")
    for t in grammar.get("topics", []):
        for s in (t.get("secs") or []) if isinstance(t, dict) else []:
            if s not in section_ids and has_book:   # utan den privata bokmappen saknas bokens kapitel (k4 …)
                errors.append(f"{where}/grammar.json: området {t.get('id')} har secs '{s}', som inte finns i words.txt")
        # preview: "<kurskod>" = förhandsvisning av ett område som övas mer i en senare kurs (src/kinds/60-grammar.js)
        p = t.get("preview") if isinstance(t, dict) else None
        if p is not None and not (isinstance(p, str) and p and (LANG_DIR / p / "lang.js").exists()):
            errors.append(f"{where}/grammar.json: området {t.get('id')} har preview '{p}', som inte är en kurs")
    regler = content.get("regler")
    if isinstance(regler, dict):
        errors += [f"{where}/content/regler.json: '{k}' är inget område i grammar.json" for k in regler if k not in topics]
    return errors


# Steg (Moderna språk 1–7, eller "U" för universitetet) och GERS-nivån som steget börjar på (Skolverkets
# kommentarmaterial, betyget E: steg 1 = A1.1, 2 = A1.2, 3 = A2.1 … 7 = B2.1), se docs/kursmall.md 2.1 och 3.7
STEP_LEVEL = {1: "A1", 2: "A1", 3: "A2", 4: "A2", 5: "B1", 6: "B1", 7: "B2"}


def check_steps(confs, upcoming):
    """step och level i lang.js och upcoming.json: step är 1–7 eller "U", level börjar på stegets GERS-nivå
    (t.ex. steg 4: "A2 → B1"). Kommande kurser har kod, språk, namn och steg, och en kod som redan är byggd ger en varning."""
    errors, warnings = [], []
    def one(where, step, level):
        if step is None:
            errors.append(f"{where}: step saknas (1–7 för Moderna språk 1–7, \"U\" för universitetet)")
        elif step not in STEP_LEVEL and step != "U":
            errors.append(f"{where}: step ska vara 1–7 eller \"U\", inte {step!r}")
        if not level:
            errors.append(f"{where}: level saknas (t.ex. \"A2 → B1\")")
        elif step in STEP_LEVEL and not level.startswith(STEP_LEVEL[step]):
            warnings.append(f"{where}: level '{level}' börjar inte med {STEP_LEVEL[step]} (steg {step}, se docs/kursmall.md 3.7)")
    for code, conf in confs.items():
        # Fält som varje kurs måste ha (resten är valfria och har standardvärden i appen)
        for f in ("name", "title", "course", "inLang", "tts"):
            if not isinstance(conf.get(f), str) or not conf[f]:
                errors.append(f"languages/{code}/lang.js: {f} saknas" + (" (ska vara en text inom citattecken)" if f in conf else ""))
        step, lv = conf.get("step"), conf.get("level")
        if isinstance(step, JSExpr) or isinstance(step, bool) or isinstance(step, float):
            step = repr(step.raw if isinstance(step, JSExpr) else step)
        one(f"languages/{code}/lang.js", step, lv if isinstance(lv, str) else "")
    seen = set()
    for i, u in enumerate(upcoming if isinstance(upcoming, list) else []):
        where = f"languages/upcoming.json: {u.get('code') or i + 1}" if isinstance(u, dict) else f"languages/upcoming.json: {i + 1}"
        if not isinstance(u, dict) or not all(u.get(k) for k in ("code", "name", "course")):
            errors.append(f"{where}: varje kommande kurs behöver code, name (språket, som i lang.js) och course")
            continue
        one(where, u.get("step"), u.get("level"))
        if u["code"] in seen:
            errors.append(f"{where}: koden finns två gånger")
        seen.add(u["code"])
        if u["code"] in confs:
            warnings.append(f"{where}: kursen finns redan i languages/{u['code']}/ och visas inte som kommande; ta bort raden")
    if not isinstance(upcoming, list):
        errors.append("languages/upcoming.json: ska vara en lista")
    return errors, warnings


# Hur vanligt varje ord är i kursens egna texter, för ordningen på nya ord (pickNew i app.js: vanligast först inom
# avsnittet). Texten är exempelmeningarna i words.txt och målspråksfälten i content (fr, model, text och ordlistans
# grundformer gloss.t), utan tatoeba.json. Ordet räknas utan parentes och inledande artikel eller reflexivt pronomen
# ("la vie" -> "vie", "se lever" -> "lever"); står flera former (a, b = c) räknas den vanligaste. Böjda former räknas
# inte (bara grundformen), så verb får lägre tal än de förtjänar. Resultatet {ord-id: antal} (bara antal > 0) följer
# med kursens datafil som freq.
FREQ_KEYS = {"fr", "model", "text"}
FREQ_LEAD = {"le", "la", "les", "l", "un", "une", "des", "se", "s", "der", "die", "das", "den", "dem", "ein", "eine",
             "sich", "il", "lo", "gli", "i", "uno", "una", "si"}


def freq_norm(s, lower=True):
    s = (s.lower() if lower else s).replace("’", "'").replace("œ", "oe").replace("æ", "ae").replace("Œ", "Oe")
    return " ".join(re.findall(r"[^\W\d_]+", s))


def word_freq(words, content):
    texts = []

    def walk(x, key=None, in_gloss=False):
        if isinstance(x, dict):
            for k, v in x.items():
                if in_gloss and isinstance(v, dict):
                    texts.append(str(v.get("t", "")))
                else:
                    walk(v, k, k == "gloss")
        elif isinstance(x, list):
            for v in x:
                walk(v, key)
        elif isinstance(x, str) and key in FREQ_KEYS:
            texts.append(x)
    walk({k: v for k, v in content.items() if k != "tatoeba"})
    ids = []
    for line in words.split("\n"):
        if line.startswith("#"):
            continue
        f = line.split("|")
        ids.append(f[0])
        if len(f) > 3:
            texts.append(f[3].replace("[", "").replace("]", ""))
    corpus_cs = " " + " \n ".join(freq_norm(t, False) for t in texts) + " "
    corpus = corpus_cs.lower()
    out = {}
    for wid in ids:
        base = re.sub(r"\(.*?\)|\[.*?\]", " ", wid)
        if "…" in base:   # "ne … jamais": den längsta delen
            base = max(base.split("…"), key=len)
        parts = []
        for alt in re.split(r"[=/]", base):
            bits = [b.strip() for b in alt.split(",") if b.strip() and not b.strip().startswith("-")]
            # "infirmier, infirmière" är två former, men "ce qui me plaît, c'est" är en fras
            parts += bits if all(len(freq_norm(b).split()) <= 2 for b in bits) else [alt]
        best = 0
        for part in parts:
            toks = freq_norm(part, False).split()
            if len(toks) > 1 and toks[0].lower() in FREQ_LEAD:
                toks = toks[1:]
            if toks:   # med stor bokstav (tyska substantiv) räknas bara samma skrivning: "das Es" inte "es"
                key = " " + " ".join(toks) + " "
                best = max(best, (corpus_cs if key != key.lower() else corpus).count(key))
        if best:
            out[wid] = best
    return out


def js_string(value):
    # JSON är giltig JavaScript; "</" skrivs om så att texten inte kan avsluta <script>-taggen
    return json.dumps(value, ensure_ascii=False).replace("</", "<\\/")


def main():
    allowed = {}   # --allow-removed <kod>:<id> eller <kod>:<typ>|<id>
    args = sys.argv[1:]
    for i, a in enumerate(args):
        if a == "--allow-removed" and i + 1 < len(args) and ":" in args[i + 1]:
            c, _, rest = args[i + 1].partition(":")
            allowed.setdefault(c, set()).add(rest)
    codes = sorted(p.name for p in LANG_DIR.iterdir() if (p / "lang.js").exists())
    codes = [c for c in ORDER if c in codes] + [c for c in codes if c not in ORDER]
    if not codes:
        sys.exit("Hittade inga språk i languages/")

    lang_js, all_errors, course_data, confs, lock_writes, lock_notes, keys = [], [], {}, {}, {}, [], {}
    own_verbs = {}   # languages/<kod>/verbs.json
    for code in codes:
        words, n_words, section_ids, errors, warnings, origin = read_words(code)
        n_sections = len(section_ids)
        all_errors += errors
        for w in warnings:
            print("Varning:", w)
        conf = (LANG_DIR / code / "lang.js").read_text(encoding="utf-8")
        if "</script" in conf.lower():
            all_errors.append(f"languages/{code}/lang.js: får inte innehålla </script")
        js = conf.strip()
        try:
            confs[code] = parse_lang_js(conf, code)
        except JSParseError as e:
            all_errors.append(f"languages/{code}/lang.js: kan inte läsas: {e}")
            confs[code] = {}
        cdata = {"words": words}
        content, found = {}, {}
        # Innehåll från boken (book/content, privat mapp) läggs till efter det allmänna innehållet
        content_files = sorted((LANG_DIR / code / "content").glob("*.json")) + book_files(code, "content/*.json")
        for f in content_files:
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                all_errors.append(f"{f.relative_to(ROOT)}: {e}")
                continue
            content_ids(f.stem, data, "book" in f.relative_to(LANG_DIR / code).parts[:1], found)
            kap = re.match(r"kap(\d+)$", f.parent.parent.name)   # book/kapNN/content/*.json: kapitlet följer med
            if kap and isinstance(data, list):
                for x in data:
                    if isinstance(x, dict):
                        x.setdefault("kap", int(kap.group(1)))
            if f.stem.startswith("grammar-"):   # grammatikbankerna slås ihop till en lista
                all_errors += check_grammar(data, f"languages/{code}/content/{f.name}")
                content.setdefault("grammar", []).extend(data)
            elif f.stem in content and type(content[f.stem]) is not type(data):   # t.ex. bokens lista mot kursens objekt
                all_errors.append(f"{f.relative_to(ROOT)}: ska vara {'en lista' if isinstance(content[f.stem], list) else 'ett objekt'}, som {f.name} i kursen")
            elif isinstance(data, list):
                content.setdefault(f.stem, []).extend(data)
            elif isinstance(data, dict):
                content.setdefault(f.stem, {}).update(data)
        for k, v in content.items():   # id:n måste vara unika inom varje innehållstyp, även mellan boken och det allmänna
            if isinstance(v, list):
                ids = collections.Counter(str(x.get("id")) for x in v if isinstance(x, dict) and x.get("id"))
                f = "grammar-*.json" if k == "grammar" else f"{k}.json"
                all_errors += [f"languages/{code}/content/{f}: id {i} finns flera gånger" for i in sorted(i for i, n in ids.items() if n > 1)]
        errs, warns = check_content(content, section_ids, f"languages/{code}", (LANG_DIR / code / "book").exists())
        all_errors += errs
        for w in warns:
            print("Varning:", w)
        # Grammatikens områden och regler (grammar.json) följer med kursens datafil, inte index.html
        grammar = None
        gfile = LANG_DIR / code / "grammar.json"
        if gfile.exists():
            try:
                grammar = json.loads(gfile.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/grammar.json: {e}")
        # Verbtabellerna (sv, tenses, notes) ligger i verbs.json och följer med datafilen (verbTables), inte index.html
        vfile = LANG_DIR / code / "verbs.json"
        if vfile.exists():
            try:
                own_verbs[code] = json.loads(vfile.read_text(encoding="utf-8"))
                bad = [k for k in own_verbs[code] if k not in ("sv", "tenses", "notes")]
                if bad:
                    all_errors.append(f"languages/{code}/verbs.json: bara sv, tenses och notes (inte {', '.join(bad)})")
            except (json.JSONDecodeError, TypeError) as e:
                all_errors.append(f"languages/{code}/verbs.json: {e}")
        verbs_conf = confs[code].get("verbs")
        if {"tenses", "notes"} & (set(confs[code]) | set(verbs_conf if isinstance(verbs_conf, dict) else {})):
            all_errors.append(f"languages/{code}/lang.js: verbtabellerna (sv, tenses, notes) ska ligga i languages/{code}/verbs.json")
        if "grammar" in confs[code]:
            all_errors.append(f"languages/{code}/lang.js: grammar ska ligga i languages/{code}/grammar.json")
        cdata["freq"] = word_freq(words, content)   # ordningen på nya ord, se word_freq
        if content:
            cdata["content"] = content
            print(f"{code}: innehåll " + ", ".join(f"{k} {len(v)}" for k, v in content.items()))
        videos = LANG_DIR / code / "videos.json"
        if videos.exists():
            try:
                vids = json.loads(videos.read_text(encoding="utf-8"))
                cdata["videos"] = vids
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/videos.json: {e}")
        if grammar is not None:
            cdata["grammar"] = grammar
        # Studieplan per vecka (valfri): languages/<kod>/plan.json följer med kursens datafil (L.plan), se src/kinds/82-plan.js
        pfile = LANG_DIR / code / "plan.json"
        if pfile.exists():
            try:
                plan = json.loads(pfile.read_text(encoding="utf-8"))
                errs, warns = check_plan(plan, section_ids, content, grammar, f"languages/{code}/plan.json")
                all_errors += errs
                for w in warns:
                    print("Varning:", w)
                cdata["plan"] = plan
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/plan.json: {e}")
        all_errors += check_grammar_refs(content, grammar, section_ids, f"languages/{code}", (LANG_DIR / code / "book").exists())
        skey = confs[code].get("storageKey")
        if not isinstance(skey, str) or not skey:
            all_errors.append(f"languages/{code}/lang.js: storageKey saknas" + (" (ska vara en text inom citattecken)" if "storageKey" in confs[code] else ""))
        else:
            keys.setdefault(skey, []).append(code)
            renamed, errs = read_renamed(code)
            all_errors += errs
            cids = collect_ids(origin, found, grammar)
            all_errors += check_renamed(code, renamed, cids)
            if renamed.get("ord"):   # appen flyttar framstegen (applyRenames i src/app.js)
                cdata["renames"] = dict(sorted(renamed["ord"].items()))
            errs, notes, writes = lock_ids(code, skey, cids, allowed.get(code, set()), renamed)
            all_errors += errs
            lock_notes += notes
            lock_writes.update(writes)
        lang_js.append(js)
        course_data[code] = cdata
        print(f"{code}: {n_words} ord i {n_words and n_sections} avsnitt")
        if not n_words:
            print(f"Varning: languages/{code}/words.txt saknas eller har inga ord; kursen går att bygga men inte att öva i (testerna kräver ord)")

    all_errors += [f"storageKey '{k}' används av flera kurser: {', '.join(cs)}" for k, cs in keys.items() if len(cs) > 1]
    all_errors += check_extends(confs)
    for code in codes:   # fälten per innehållstyp; skrivuppgifterna mot kursens bindeord och tenseCheck (med arvet)
        conns = resolve_field(confs, code, "connectors")
        errs, warns = check_fields(course_data[code].get("content", {}), f"languages/{code}",
                                   conns if isinstance(conns, list) else [], tense_names(confs, code))
        all_errors += errs
        for w in warns:
            print("Varning:", w)
    for code in codes:   # verbtabellerna med arvet inräknat, i kursens datafil
        tables = resolve_verbs(confs, own_verbs, code)
        if tables:
            if not has_field(confs, code, "verbs"):
                all_errors.append(f"languages/{code}/verbs.json: kursen har verbtabeller men inget verbs (persons, prefix, games) i lang.js")
            elif not isinstance(tables.get("tenses"), dict) or not tables["tenses"]:
                all_errors.append(f"languages/{code}/verbs.json: tenses saknas (egna eller ärvda)")
            course_data[code]["verbTables"] = tables
        elif has_field(confs, code, "verbs"):
            all_errors.append(f"languages/{code}/lang.js: verbs utan verbtabeller (lägg sv, tenses och notes i languages/{code}/verbs.json eller ärv dem)")
    upcoming = []
    if (LANG_DIR / "upcoming.json").exists():
        try:
            upcoming = json.loads((LANG_DIR / "upcoming.json").read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            all_errors.append(f"languages/upcoming.json: {e}")
    errs, warns = check_steps(confs, upcoming)
    all_errors += errs
    for w in warns:
        print("Varning:", w)
    if all_errors:
        print("\nBygget avbröts:", *all_errors, sep="\n  ")
        sys.exit(1)
    for path, text in lock_writes.items():
        path.write_text(text, encoding="utf-8")
    for n in lock_notes:
        print("Id-lås:", n)

    title = "Glosor"
    if len(codes) == 1:
        title = confs[codes[0]].get("title") if isinstance(confs[codes[0]].get("title"), str) else title

    # Kursernas data blir egna filer (dist/data/<kod>.json) som appen hämtar när kursen väljs.
    # DATA_VERSION har ett hash per kurs, som ändras när just den kursens data ändras, så att webbläsaren
    # inte använder en gammal fil och inte hämtar de andra kursernas filer i onödan.
    # Provträningen (content.exam) blir en egen fil, dist/data/<kod>-exam.json, som appen hämtar först när den
    # behövs (ensureExam i app.js); kursens fil får bara indexet (split_exam). Nyckeln i DATA_VERSION är "<kod>-exam".
    for c in codes:
        ex = course_data[c].get("content", {}).get("exam")
        if isinstance(ex, dict) and ex.get("tasks"):
            course_data[c]["content"]["exam"], full = split_exam(ex)
            course_data[f"{c}-exam"] = full
    # Grundformerna för Mina ord (lemmaOf i src/kinds/03-lemma.js): alla kursers ord i samma språk, en fil per språk,
    # dist/data/lemma-<språk>.json (lemma_files). Appen hämtar den först när eleven trycker på ord i en text, så att en
    # böjd form känns igen även om grundformen bara finns i en kurs i kedjan som inte har öppnats. Nyckeln i
    # DATA_VERSION är "lemma-<språk>". Kursernas egna filer ändras inte.
    course_data.update(lemma_files(codes, confs, course_data))
    data_json = {c: json.dumps(d, ensure_ascii=False, separators=(",", ":")) for c, d in course_data.items()}
    dataversion = {c: hashlib.sha1(data_json[c].encode()).hexdigest()[:10] for c in data_json}
    page = (ROOT / "src" / "page.html").read_text(encoding="utf-8")
    # Koden och stilen minifieras (kommentarer och blanktecken, se minify_js), så att index.html hålls liten.
    # python3 build.py --no-minify ger läsbar kod, t.ex. för att felsöka med radnummer.
    mini = "--no-minify" not in sys.argv
    mjs, mcss = (minify_js, minify_css) if mini else (str, str)
    parts = {
        "TITLE": title,
        "STYLE": mcss((ROOT / "src" / "style.css").read_text(encoding="utf-8").strip()),
        "LANGUAGES": mjs("\n".join(lang_js)),
        # src/kinds/*.js (en fil per övningstyp) i namnordning, mellan app.js och feedback.js
        "APP": mjs("\n".join(f.read_text(encoding="utf-8").strip() for f in [ROOT / "src" / "app.js", *sorted((ROOT / "src" / "kinds").glob("*.js")), ROOT / "src" / "feedback.js", ROOT / "src" / "main.js"])),
        "BUILT": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "DATAVERSION": js_string(dataversion),
        "UPCOMING": js_string([u for u in upcoming if u.get("code") not in confs]),
        # Alla kursers id-byten (samma som renames i datafilerna, ett par kB): nivåmätaren läser andra kursers sparade
        # lägen utan att hämta deras datafiler och flyttar id:na i en kopia (peekState i src/kinds/80-level.js)
        "RENAMES": js_string({c: course_data[c]["renames"] for c in codes if course_data[c].get("renames")}),
    }
    html = re.sub(r"\{\{(\w+)\}\}", lambda m: parts[m.group(1)], page)
    # preview.html har datan inbakad, så att den går att öppna direkt från disken och i testerna
    safe = {c: data_json[c].replace("</", "<\\/") for c in data_json}
    inline = "\n".join(f"INLINE_DATA[{json.dumps(c)}] = {safe[c]};" for c in data_json)
    preview = re.sub(r"\{\{(\w+)\}\}", lambda m: parts[m.group(1)] + ("\n" + inline if m.group(1) == "LANGUAGES" else ""), page)

    DIST.mkdir(exist_ok=True)
    (DIST / "data").mkdir(exist_ok=True)
    for old in (DIST / "data").glob("*.json"):
        old.unlink()
    for c in data_json:
        (DIST / "data" / f"{c}.json").write_text(data_json[c], encoding="utf-8")
    (DIST / "index.html").write_text(html, encoding="utf-8")
    (DIST / "preview.html").write_text(SKELETON_HEAD + preview + "\n</body></html>\n", encoding="utf-8")
    kb = lambda c: len(data_json[c].encode()) // 1024
    print(f"Klart: dist/index.html ({len(html.encode()) // 1024} kB) och dist/data/ ("
          + ", ".join(f"{c} {kb(c)} kB" + (f" + prov {kb(c + '-exam')} kB" if c + "-exam" in data_json else "") for c in codes)
          + "; grundformer " + ", ".join(f"{c} {kb(c)} kB" for c in data_json if c.startswith("lemma-")) + ")")
    print(f"Publicera med alla {len(data_json)} filer i dist/data/ i files (även *-exam.json och lemma-*.json), se docs/ARKITEKTUR.md")
    # Sidan laddas på telefon: varna innan index.html eller en datafil växer förbi gränserna (2026-09-29: 456 kB före och cirka 370 kB
    # efter att verbtabellerna flyttats till datafilerna; 2026-09-30: 478 kB före och cirka 360 kB efter minifieringen)
    if len(html.encode()) > MAX_PAGE_KB * 1024:
        print(f"Varning: dist/index.html är större än {MAX_PAGE_KB} kB; flytta data från lang.js till datafilen eller dela upp koden")
    for c in data_json:
        if len(data_json[c].encode()) > MAX_DATA_KB * 1024:
            print(f"Varning: dist/data/{c}.json är större än {MAX_DATA_KB} kB; överväg att hämta prov- eller textdelen separat")


if __name__ == "__main__":
    main()
    if "--tackning" in sys.argv:   # valfritt: ordtäckningen i texterna -> docs/tackning.md (tools/tackning.py)
        import subprocess
        subprocess.run([sys.executable, str(ROOT / "tools" / "tackning.py")], check=False)
