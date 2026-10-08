"""Genererar languages/<kod>/plan.json ur kursdata i dist/data (kör python3 build.py först) och tips i plan_tips.py. Användning: python3 tools/plan.py [repo] [kurser …]. Kör om när en kurs får nya avsnitt eller texter (bygget varnar då).""" 
import json, sys, collections, re
from pathlib import Path
from plan_tips import TIPS, GRAM, TITLES, INTRO
ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import build as B   # noqa: E402  parse_lang_js, elective_groups

def electives(c):
    """Valbara avsnitt (elective i lang.js, ett objekt eller en lista): [regex]. De kommer aldrig med i veckoplanen."""
    return [rx for rx, _ in B.elective_groups(B.parse_lang_js((ROOT / "languages" / c / "lang.js").read_text(encoding="utf-8"), c))]

def load(c):
    d = json.load(open(ROOT / "dist/data" / f"{c}.json"))
    secs, cnt, cur = [], collections.Counter(), None
    for line in d["words"].splitlines():
        if line.startswith("#"):
            p = line[1:].split("|"); cur = p[0]
            if cur not in [s[0] for s in secs]: secs.append((cur, p[1] if len(p) > 1 else ""))
        elif line.strip() and cur: cnt[cur] += 1
    return d, secs, cnt

VSEC = {"hv", "tv", "sv"}   # avsnittet med vanliga ord (tools/frekvens.py), utspritt som uttrycksavsnittet


def std_weeks(secs, rsec, elective=()):
    """8 kapitel à 2 veckor, uttryck/redemittel utspritt (en del per kapitel), vanliga ord (VSEC) likaså i kapitlets
    andra vecka, sedan 2 veckor repetition och prov. Valbara avsnitt (elective, t.ex. musikteorin) tas inte med."""
    vsec = next((s for s, _ in secs if s in VSEC), None)
    chaps = [s for s in secs if s[0] not in (rsec, vsec) and not any(rx.search(s[0]) for rx in elective)]
    W = []
    for n, (sid, name) in enumerate(chaps):
        for part in (1, 2):
            words = [{"sec": sid, "part": part, "of": 2}]
            if part == 1: words.append({"sec": rsec, "part": n + 1, "of": len(chaps)})
            if part == 2 and vsec: words.append({"sec": vsec, "part": n + 1, "of": len(chaps)})
            W.append({"title": f"{name} (del {part})", "words": words, "chap": sid, "last": part == 2})
    return W

FR_WEEKS = [  # Franska 3: bokens kapitel (id), publika avsnitt vanliga, vanliga2 och fm utspridda
    ("Kap 1 · Vie et loisirs", [("k1",1,1),("vanliga",1,4)], "k1", False),
    ("Kap 1 · Zinédine et Zlatan, Ma vie au soleil", [("k1e",1,1),("k1b",1,1),("vanliga2",1,8)], "k1", False),
    ("Kap 1 · fler ord ur kapitlet", [("k1x",1,1),("vanliga",2,4)], "k1", True),
    ("Kap 2 · Arrivée à Paris, Le métro de Paris", [("k2",1,1),("k2b",1,1),("vanliga2",2,8)], "k2", False),
    ("Kap 2 · Aux Champs-Élysées och fler ord", [("k2c",1,1),("k2x",1,1),("vanliga2",3,8)], "k2", True),
    ("Kap 3 · Trouver un travail", [("k3",1,1),("vanliga",3,4)], "k3", False),
    ("Kap 3 · fler ord, och aller-gruppen", [("k3x",1,1),("aller",1,1),("vanliga2",4,8)], "k3", True),
    ("Kap 4 (del 1)", [("k4",1,2),("fm",1,4)], "k4", False),
    ("Kap 4 (del 2)", [("k4",2,2),("vanliga",4,4)], "k4", True),
    ("Kap 5 och 6", [("k5",1,1),("k6",1,1),("fm",2,4)], "k6", True),
    ("Kap 7 (del 1)", [("k7",1,2),("vanliga2",5,8)], "k7", False),
    ("Kap 7 (del 2)", [("k7",2,2),("fm",3,4)], "k7", True),
    ("Kap 8 (del 1)", [("k8",1,1),("vanliga2",6,8)], "k8", False),
    ("Kap 8 (del 2)", [("k8x",1,1),("vanliga2",7,8)], "k8", True),
    ("Kap 9 och 10", [("k9",1,1),("k10",1,1)], "k10", True),
    ("Kap 12 (del 1)", [("k12",1,2),("fm",4,4)], "k12", False),
    ("Kap 12 (del 2)", [("k12",2,2),("vanliga2",8,8)], "k12", True),
]
RSEC = {"hr", "vr", "qr", "tr", "sr"}
FR_KT = {"k1":"k1","k2":"k2","k3":"k3","k4":"k4","k6":"k5","k7":"k7","k8":"k8","k10":"k10","k12":"k12"}

def build(c):
    d, secs, cnt = load(c)
    C = d.get("content", {}); G = d.get("grammar", {})
    if c == "fr":
        W = [{"title": t, "words": [{"sec": s, "part": p, "of": o} for s, p, o in ws], "chap": ch, "last": last} for t, ws, ch, last in FR_WEEKS]
    else:
        rsec = [s for s, _ in secs if s.endswith("r") and len(s) == 2][0]
        W = std_weeks(secs, rsec, electives(c))
    W += [{"title": "Repetition och provträning", "words": [], "chap": None, "last": False},
          {"title": "Provsimulering och repetition", "words": [], "chap": None, "last": False}]
    N = len(W)
    for w in W: w["grammar"], w["do"] = [], []
    wsec = collections.defaultdict(list)   # avsnitt -> veckor
    for i, w in enumerate(W):
        for r in w["words"]: wsec[r["sec"]].append(i)
    # Innehåll per avsnitt, jämnt över avsnittets veckor (fr: bara publikt innehåll, inga boktexter)
    kinds = [("lq", "listening"), ("rq", "reading"), ("culture", "culture"), ("story", "stories"), ("write", "prompts")]
    rr = collections.Counter()
    for k, ck in kinds:
        for x in C.get(ck, []):
            if str(x["id"]).startswith("bok-"): continue
            ws_ = wsec.get(x.get("sec"))
            ch = W[ws_[0]]["chap"] if ws_ else None
            pool = [j for j, w in enumerate(W) if ch and w["chap"] == ch] or ws_ or [N - 2]
            i = pool[rr[ch] % len(pool)]; rr[ch] += 1
            W[i]["do"].append({"k": k, "id": x["id"]})
    # Kapitelprov sist i kapitlet
    for i, w in enumerate(W):
        if w["last"]:
            w["do"].append({"k": "ktest", "id": FR_KT[w["chap"]] if c == "fr" else w["chap"]})
    # Grammatik: GRAM[c] = {område: veckonummer (1-baserat)} för dem som inte följer kapitlen; annars första veckan
    over = GRAM.get(c, {})
    for t in G.get("topics", []):
        if t["id"] in over: i = over[t["id"]] - 1
        else:
            ss = t.get("secs") or []
            ss = [s for s in ss if s not in RSEC] or ss      # uttrycksavsnittet ligger i många veckor
            cand = sorted({j for s in ss for j in wsec.get(s, [])})
            if not cand: raise SystemExit(f"{c}: område {t['id']} saknar vecka")
            i = min(cand, key=lambda j: (len(W[j]["grammar"]), j))
        W[i]["grammar"].append(t["id"])
    # Provuppgifter: delarna blandade, lägre nivå först, jämnt över vecka 2..N
    tasks = [t for t in C.get("exam", {}).get("tasks", [])]
    byp = collections.OrderedDict()
    for t in sorted(tasks, key=lambda t: 0 if t.get("lv") else 1): byp.setdefault(t["part"], []).append(t["id"])
    order = []
    while any(byp.values()):
        for p in list(byp):
            if byp[p]: order.append(byp[p].pop(0))
    for n, tid in enumerate(order):
        W[1 + n * (N - 1) // len(order)]["do"].append({"k": "exam", "id": tid})
    if C.get("exam"): W[-1]["do"].append({"k": "examsim"})
    tips = TIPS[c]; assert len(tips) == N, (c, len(tips), N)
    out = {"title": TITLES[c], "intro": INTRO[c], "weeks": [
        {"id": f"v{i+1}", "title": w["title"], "words": w["words"], "grammar": w["grammar"], "do": w["do"], "tip": tips[i]}
        for i, w in enumerate(W)]}
    return out

if __name__ == "__main__":
    for c in (sys.argv[2:] or ["fr", "frs4", "frs5", "fr4", "de4", "de6"]):
        p = build(c)
        (ROOT / "languages" / c / "plan.json").write_text(json.dumps(p, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        for w in p["weeks"]:
            print(c, w["id"], w["title"], "|", w["grammar"], "|", len(w["do"]), [x["k"] for x in w["do"]].count("exam"))
