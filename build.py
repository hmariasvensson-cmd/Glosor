#!/usr/bin/env python3
"""Bygger glosprogrammet till en enda HTML-fil.

    python3 build.py

Läser src/ och languages/<kod>/ och skriver:
  dist/index.html    filen som publiceras till artefaktlänken
  dist/preview.html  samma sida med ett komplett HTML-skal, för att öppna lokalt i webbläsaren
"""
import datetime
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


def read_words(code):
    """Läser words.txt, tar bort kommentarer och kontrollerar varje rad."""
    path = LANG_DIR / code / "words.txt"
    errors, warnings = [], []
    lines, seen, section_ids = [], set(), set()
    n_words = 0
    section = None
    for no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
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
            if len(parts) != 2 or not parts[0] or not parts[1]:
                errors.append(f"{where}: avsnittsrader ska se ut så här: #id|Namn")
            elif parts[0] in section_ids:
                errors.append(f"{where}: avsnittet #{parts[0]} finns redan")
            section = parts[0]
            section_ids.add(section)
            lines.append(s)
            continue
        fields = s.split("|")
        if section is None:
            errors.append(f"{where}: ordet ligger före första avsnittet (#id|Namn)")
        if len(fields) != 6:
            errors.append(f"{where}: {len(fields)} fält, ska vara 6 (ord|svenska|genus|exempel|exempel sv|ursprung)")
        else:
            word, sv, g = fields[0], fields[1], fields[2]
            if not word or not sv:
                errors.append(f"{where}: ordet eller den svenska översättningen saknas")
            if g not in GENDERS:
                errors.append(f"{where}: okänt genus '{g}' (tillåtna: {', '.join(sorted(x for x in GENDERS if x))})")
            if word in seen:
                warnings.append(f"{where}: '{word}' finns redan och hoppas över i programmet")
            seen.add(word)
            n_words += 1
        lines.append(s)
    return "\n".join(lines), n_words, len(section_ids), errors, warnings


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
            if a.lower() == ans.lower() or a in x.get("acc", []):
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


def js_string(value):
    # JSON är giltig JavaScript; "</" skrivs om så att texten inte kan avsluta <script>-taggen
    return json.dumps(value, ensure_ascii=False).replace("</", "<\\/")


def main():
    codes = sorted(p.name for p in LANG_DIR.iterdir() if (p / "lang.js").exists())
    codes = [c for c in ORDER if c in codes] + [c for c in codes if c not in ORDER]
    if not codes:
        sys.exit("Hittade inga språk i languages/")

    lang_js, all_errors = [], []
    for code in codes:
        words, n_words, n_sections, errors, warnings = read_words(code)
        all_errors += errors
        for w in warnings:
            print("Varning:", w)
        conf = (LANG_DIR / code / "lang.js").read_text(encoding="utf-8")
        if "</script" in conf.lower():
            all_errors.append(f"languages/{code}/lang.js: får inte innehålla </script")
        js = f"{conf.strip()}\nLANGUAGES.{code}.words = {js_string(words)};"
        content = {}
        for f in sorted((LANG_DIR / code / "content").glob("*.json")) if (LANG_DIR / code / "content").exists() else []:
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/content/{f.name}: {e}")
                continue
            if f.stem.startswith("grammar-"):   # grammatikbankerna slås ihop till en lista
                all_errors += check_grammar(data, f"languages/{code}/content/{f.name}")
                content.setdefault("grammar", []).extend(data)
            else:
                content[f.stem] = data
        if "grammar" in content:
            ids = [x.get("id") for x in content["grammar"]]
            all_errors += [f"languages/{code}/content/grammar-*.json: id {i} finns flera gånger" for i in sorted({i for i in ids if ids.count(i) > 1})]
        if content:
            js += f"\nLANGUAGES.{code}.content = {js_string(content)};"
            print(f"{code}: innehåll " + ", ".join(f"{k} {len(v)}" for k, v in content.items()))
        videos = LANG_DIR / code / "videos.json"
        if videos.exists():
            try:
                data = json.loads(videos.read_text(encoding="utf-8"))
                js += f"\nLANGUAGES.{code}.videos = {js_string(data)};"
            except json.JSONDecodeError as e:
                all_errors.append(f"languages/{code}/videos.json: {e}")
        lang_js.append(js)
        print(f"{code}: {n_words} ord i {n_sections} avsnitt")

    if all_errors:
        print("\nBygget avbröts:", *all_errors, sep="\n  ")
        sys.exit(1)

    title = "Glosor"
    if len(codes) == 1:
        m = re.search(r'title:\s*"([^"]+)"', (LANG_DIR / codes[0] / "lang.js").read_text(encoding="utf-8"))
        title = m.group(1) if m else title

    page = (ROOT / "src" / "page.html").read_text(encoding="utf-8")
    parts = {
        "TITLE": title,
        "STYLE": (ROOT / "src" / "style.css").read_text(encoding="utf-8").strip(),
        "LANGUAGES": "\n".join(lang_js),
        "APP": "\n".join((ROOT / "src" / f).read_text(encoding="utf-8").strip() for f in ("app.js", "exercises.js", "grammar.js", "main.js")),
        "BUILT": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "UPCOMING": js_string(json.loads((LANG_DIR / "upcoming.json").read_text(encoding="utf-8"))) if (LANG_DIR / "upcoming.json").exists() else "[]",
    }
    html = re.sub(r"\{\{(\w+)\}\}", lambda m: parts[m.group(1)], page)

    DIST.mkdir(exist_ok=True)
    (DIST / "index.html").write_text(html, encoding="utf-8")
    (DIST / "preview.html").write_text(SKELETON_HEAD + html + "\n</body></html>\n", encoding="utf-8")
    print(f"Klart: dist/index.html ({len(html.encode()) // 1024} kB)")


if __name__ == "__main__":
    main()
