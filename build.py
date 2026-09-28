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


def check_content(content, section_ids, where):
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
    exam = content.get("exam")
    if isinstance(exam, dict):
        for t in exam.get("tasks", []):
            for i, q in enumerate(t.get("qs") or []):
                errors += check_question(q, f"{where}/content/exam.json: {t.get('id')} fråga {i + 1}")
    for kind, items in content.items():
        if kind == "grammar" or not isinstance(items, list):
            continue
        for x in items:
            if isinstance(x, dict) and x.get("sec") and x["sec"] not in section_ids:
                errors.append(f"{where}/content/{kind}.json: {x.get('id')} har sec '{x['sec']}', som inte finns i words.txt")
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
    for code in parent:
        seen, c = set(), code
        while c in parent:
            if c in seen:
                errors.append(f"languages/{code}/lang.js: extends går runt i en cirkel")
                break
            seen.add(c)
            c = parent[c]
    return errors


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
            elif isinstance(data, list):
                content.setdefault(f.stem, []).extend(data)
            elif isinstance(data, dict):
                content.setdefault(f.stem, {}).update(data)
        for k, v in content.items():   # id:n måste vara unika inom varje innehållstyp, även mellan boken och det allmänna
            if isinstance(v, list):
                ids = [x.get("id") for x in v if isinstance(x, dict) and x.get("id")]
                all_errors += [f"languages/{code}: {k} har id {i} flera gånger" for i in sorted({i for i in ids if ids.count(i) > 1}) if k != "grammar"]
        errs, warns = check_content(content, section_ids, f"languages/{code}")
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
        print(f"{code}: {n_words} ord i {n_sections} avsnitt")

    all_errors += [f"storageKey '{k}' används av flera kurser: {', '.join(cs)}" for k, cs in keys.items() if len(cs) > 1]
    all_errors += check_extends(confs)
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
        "UPCOMING": js_string(json.loads((LANG_DIR / "upcoming.json").read_text(encoding="utf-8"))) if (LANG_DIR / "upcoming.json").exists() else "[]",
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


if __name__ == "__main__":
    main()
