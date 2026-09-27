#!/usr/bin/env python3
"""Hämtar extra exempelmeningar från Tatoeba (CC BY 2.0 FR) till languages/<kod>/content/tatoeba.json.

    python3 tools/tatoeba.py fr

Per ord i words.txt söks meningar på målspråket som har en svensk översättning. Upp till två korta
meningar (4–12 ord) sparas, med Tatoebas id och användarnamn för källhänvisningen. Litterära tempus
(passé simple) och meningar med ovanliga tecken hoppas över. Kör om skriptet för att uppdatera.
"""
import json, pathlib, re, sys, time, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANG3 = {"fr": "fra", "de": "deu"}
# Namn som nästan bara förekommer i Tatoebas massinlagda övningsmeningar, och litterära inledningar
SKIP = re.compile(r"\b(Ziri|Rima|Yanni|Skura|Mennad|Baya|Sami|Layla|Taninna|Nuja|Ghanima|Mary|Au commencement)\b")
PASSE_SIMPLE = re.compile(r"\b\w+(âmes|îmes|ûmes|âtes|îtes|ûtes|èrent)\b|\b(fut|furent|eut|eurent|fit|firent|vint|vinrent|dit-il)\b", re.I)


def base_form(t):
    t = re.sub(r"\(.*?\)", "", t).split(",")[0].strip()
    t = re.sub(r"^(le|la|les|l'|un|une|des|se|s')\s*", "", t, flags=re.I).strip()
    return t


def search(lang, query):
    url = "https://tatoeba.org/en/api_v0/search?" + urllib.parse.urlencode(
        {"from": LANG3[lang], "to": "swe", "query": f'="{query}"', "trans_filter": "limit", "trans_to": "swe", "sort": "words"})
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Glosor/1.0"}), timeout=30) as r:
        return json.load(r).get("results", [])


def main():
    lang = sys.argv[1] if len(sys.argv) > 1 else "fr"
    words = [l.split("|") for l in (ROOT / "languages" / lang / "words.txt").read_text(encoding="utf-8").splitlines()
             if l and not l.startswith(("#", "//"))]
    out = {}
    for fields in words:
        wid, ex = fields[0], fields[3].replace("[", "").replace("]", "")
        q = base_form(wid)
        if len(q) < 3:
            continue
        try:
            res = search(lang, q)
        except Exception as e:
            print("fel:", wid, e)
            time.sleep(2)
            continue
        picked = []
        for r in res:
            text = r["text"].strip()
            n = len(text.split())
            sv = [t for g in r.get("translations", []) for t in g if t.get("lang") == "swe"]
            if not sv or not 4 <= n <= 12 or PASSE_SIMPLE.search(text) or text == ex or not re.search(re.escape(q), text, re.I):
                continue
            if any(ch in text for ch in "[]|<>") or SKIP.search(text):
                continue
            picked.append({"t": text, "sv": sv[0]["text"].strip(), "id": r["id"], "by": (r.get("user") or {}).get("username", "")})
            if len(picked) == 2:
                break
        if picked:
            out[wid] = picked
        print(f"{len(out):4} {wid}: {len(picked)}")
        time.sleep(0.4)
    dest = ROOT / "languages" / lang / "content" / "tatoeba.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Klart: {sum(len(v) for v in out.values())} meningar till {len(out)} ord i {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
