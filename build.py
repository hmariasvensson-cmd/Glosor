#!/usr/bin/env python3
"""Bygger glosprogrammet till en enda HTML-fil.

    python3 build.py
    python3 build.py --allow-removed <kod>:<id>     godkänner att ett låst id tas bort (se ids.lock nedan)

Läser src/ och languages/<kod>/ och skriver:
  dist/index.html        sidan som publiceras till artefaktlänken (appen och kursinställningarna)
  dist/data/<kod>.json   varje kurs ord och innehåll, publiceras bredvid sidan och hämtas när kursen väljs
  dist/preview.html      samma sida med datan inbakad och ett komplett HTML-skal, för att öppna lokalt och för testerna

och kontrollerar/uppdaterar id-låsen languages/<kod>/ids.lock (och book/ids.lock för bokens id), se lock_ids.
"""
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
MAX_PAGE_KB, MAX_DATA_KB = 450, 1600   # varningsgränser för storleken (okomprimerat), se slutet av main

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


# Artiklar och relativpronomen för att kontrollera de tyska grammatikfrågorna (se GRAMMATIK-SPEC.md)
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
        miss = sorted(r for r in s if r and (k, r) not in used)
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


def lock_ids(code, storage_key, ids, allowed):
    """Jämför kursens id med låsen. Returnerar (fel, meddelanden, {sökväg: nytt innehåll})."""
    errors, notes, writes = [], [], {}
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


def has_field(confs, code, field, seen=()):
    """Kursen har fältet i sin lang.js, eller ärver det (extends + inherit) från en kurs som har det."""
    conf = confs.get(code, "")
    if re.search(rf'^\s*{re.escape(field)}\s*:', conf, re.M):
        return True
    m = re.search(r'^\s*extends:\s*"([^"]+)"', conf, re.M)
    inh = re.search(r'^\s*inherit:\s*\[([^\]]*)\]', conf, re.M)
    return bool(m and inh and m.group(1) not in seen and f'"{field}"' in inh.group(1)
                and has_field(confs, m.group(1), field, seen + (code,)))


def check_extends(confs):
    """extends/inherit i lang.js: kursen som ärvs från ska finnas, inga cirklar, och storageKey ärvs aldrig."""
    errors, parent = [], {}
    for code, conf in confs.items():
        m = re.search(r'^\s*extends:\s*"([^"]+)"', conf, re.M)
        inh = re.search(r'^\s*inherit:\s*\[([^\]]*)\]', conf, re.M)
        if m:
            parent[code] = m.group(1)
            if m.group(1) not in confs:
                errors.append(f"languages/{code}/lang.js: extends '{m.group(1)}' finns inte")
            if not inh:
                errors.append(f"languages/{code}/lang.js: extends utan inherit (lista fälten som ska ärvas)")
        elif inh:
            errors.append(f"languages/{code}/lang.js: inherit utan extends")
        if inh and re.search(r'"(storageKey|code|words|content|videos|grammar)"', inh.group(1)):
            errors.append(f"languages/{code}/lang.js: storageKey, words, content, videos och grammar kan inte ärvas")
        # Ett fält i inherit som föräldern inte har (t.ex. ett stavfel) skulle annars tyst bli tomt i webbläsaren
        # Föräldern kan i sin tur ha ärvt fältet (it3 → it2 → it1), så kedjan följs
        if m and inh and m.group(1) in confs:
            for f in re.findall(r'"([^"]+)"', inh.group(1)):
                if not has_field(confs, m.group(1), f):
                    errors.append(f"languages/{code}/lang.js: inherit '{f}' finns inte i languages/{m.group(1)}/lang.js")
        # nextCourse: en kod ("de6") eller en lista med koder (["fr5", "fru"]); varje kurs måste finnas
        nxt = re.search(r'^\s*nextCourse:\s*("[^"]*"|\[[^\]]*\])', conf, re.M)
        for n in re.findall(r'"([^"]*)"', nxt.group(1)) if nxt else []:
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
            if not re.search(rf'^\s*{f}\s*:\s*"[^"]+"', conf, re.M):
                errors.append(f"languages/{code}/lang.js: {f} saknas")
        m = re.search(r'^\s*step:\s*("[^"]*"|\d+)', conf, re.M)
        lv = re.search(r'^\s*level:\s*"([^"]*)"', conf, re.M)
        step = None if not m else (m.group(1).strip('"') if m.group(1).startswith('"') else int(m.group(1)))
        one(f"languages/{code}/lang.js", step, lv.group(1) if lv else "")
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
        confs[code] = conf
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
                ids = [x.get("id") for x in v if isinstance(x, dict) and x.get("id")]
                all_errors += [f"languages/{code}: {k} har id {i} flera gånger" for i in sorted({i for i in ids if ids.count(i) > 1}) if k != "grammar"]
        errs, warns = check_content(content, section_ids, f"languages/{code}", (LANG_DIR / code / "book").exists())
        all_errors += errs
        for w in warns:
            print("Varning:", w)
        if "grammar" in content:
            ids = [x.get("id") for x in content["grammar"]]
            all_errors += [f"languages/{code}/content/grammar-*.json: id {i} finns flera gånger" for i in sorted({i for i in ids if ids.count(i) > 1})]
        # Grammatikens områden och regler (grammar.json) följer med kursens datafil, inte index.html
        grammar = None
        gfile = LANG_DIR / code / "grammar.json"
        if gfile.exists():
            try:
                grammar = json.loads(gfile.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/grammar.json: {e}")
        if re.search(r"^\s*grammar\s*:", conf, re.M):
            all_errors.append(f"languages/{code}/lang.js: grammar ska ligga i languages/{code}/grammar.json")
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
        m = re.search(r'^\s*storageKey:\s*"([^"]+)"', conf, re.M)
        if not m:
            all_errors.append(f"languages/{code}/lang.js: storageKey saknas")
        else:
            keys.setdefault(m.group(1), []).append(code)
            errs, notes, writes = lock_ids(code, m.group(1), collect_ids(origin, found, grammar), allowed.get(code, set()))
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
        m = re.search(r'title:\s*"([^"]+)"', (LANG_DIR / codes[0] / "lang.js").read_text(encoding="utf-8"))
        title = m.group(1) if m else title

    # Kursernas data blir egna filer (dist/data/<kod>.json) som appen hämtar när kursen väljs.
    # DATA_VERSION har ett hash per kurs, som ändras när just den kursens data ändras, så att webbläsaren
    # inte använder en gammal fil och inte hämtar de andra kursernas filer i onödan.
    data_json = {c: json.dumps(d, ensure_ascii=False, separators=(",", ":")) for c, d in course_data.items()}
    dataversion = {c: hashlib.sha1(data_json[c].encode()).hexdigest()[:10] for c in codes}
    page = (ROOT / "src" / "page.html").read_text(encoding="utf-8")
    parts = {
        "TITLE": title,
        "STYLE": (ROOT / "src" / "style.css").read_text(encoding="utf-8").strip(),
        "LANGUAGES": "\n".join(lang_js),
        # src/kinds/*.js (en fil per övningstyp) i namnordning, mellan app.js och feedback.js
        "APP": "\n".join(f.read_text(encoding="utf-8").strip() for f in [ROOT / "src" / "app.js", *sorted((ROOT / "src" / "kinds").glob("*.js")), ROOT / "src" / "feedback.js", ROOT / "src" / "main.js"]),
        "BUILT": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "DATAVERSION": js_string(dataversion),
        "UPCOMING": js_string([u for u in upcoming if u.get("code") not in confs]),
    }
    html = re.sub(r"\{\{(\w+)\}\}", lambda m: parts[m.group(1)], page)
    # preview.html har datan inbakad, så att den går att öppna direkt från disken och i testerna
    safe = {c: data_json[c].replace("</", "<\\/") for c in codes}
    inline = "\n".join(f"INLINE_DATA.{c} = {safe[c]};" for c in codes)
    preview = re.sub(r"\{\{(\w+)\}\}", lambda m: parts[m.group(1)] + ("\n" + inline if m.group(1) == "LANGUAGES" else ""), page)

    DIST.mkdir(exist_ok=True)
    (DIST / "data").mkdir(exist_ok=True)
    for old in (DIST / "data").glob("*.json"):
        old.unlink()
    for c in codes:
        (DIST / "data" / f"{c}.json").write_text(data_json[c], encoding="utf-8")
    (DIST / "index.html").write_text(html, encoding="utf-8")
    (DIST / "preview.html").write_text(SKELETON_HEAD + preview + "\n</body></html>\n", encoding="utf-8")
    print(f"Klart: dist/index.html ({len(html.encode()) // 1024} kB) och dist/data/ ("
          + ", ".join(f"{c} {len(data_json[c].encode()) // 1024} kB" for c in codes) + ")")
    # Sidan laddas på telefon: varna innan index.html eller en datafil växer förbi gränserna (2026-09-29: 356 kB, som mest 1 409 kB)
    if len(html.encode()) > MAX_PAGE_KB * 1024:
        print(f"Varning: dist/index.html är större än {MAX_PAGE_KB} kB; flytta data från lang.js till datafilen eller dela upp koden")
    for c in codes:
        if len(data_json[c].encode()) > MAX_DATA_KB * 1024:
            print(f"Varning: dist/data/{c}.json är större än {MAX_DATA_KB} kB; överväg att hämta prov- eller textdelen separat")


if __name__ == "__main__":
    main()
