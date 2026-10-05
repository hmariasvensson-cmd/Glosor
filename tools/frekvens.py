#!/usr/bin/env python3
"""Frekvenstäckning: hur många av språkets vanligaste lemman kurskedjan lär ut, steg för steg.

    python3 tools/frekvens.py              # alla kedjor, skriver docs/frekvens.md
    python3 tools/frekvens.py fr           # bara kedjan som kursen hör till, skriver ut luckorna (skriver inte filen)
    python3 tools/frekvens.py --saknas fr  # bara de saknade lemmana i kedjan fram till och med kursen, en per rad

Frekvenslistorna ligger i tools/data/frekvens-<språk>.tsv (rang, lemma, …; källa och licens står överst i filen):
franska Lexique 3.83 (CC BY-SA 4.0), tyska DeReWo 2012 (IDS, CC BY-NC 3.0), italienska Kelly-listan (CC BY-NC-SA 2.0).

Kända lemman i en kurs = orden i words.txt (och book/words.txt) i kursen och alla tidigare kurser i kedjan
(nextCourse baklänges, samma regler som tools/tackning.py: även orden i en fras räknas), verben i verbspelen
(verbs.json, fältet sv) i samma kurser och bindeorden i lang.js. Grammatikorden (artiklar, pronomen, prepositioner,
konjunktioner, hjälpverb, räkneord; FUNCTION i tools/tackning.py) räknas inte alls: de lärs via grammatiken, så
"topp 1 000" betyder de 1 000 vanligaste lemmana som inte är grammatikord. Lemman i SKIP nedan (namn, förkortningar,
grova ord, listans egenheter) räknas inte heller.

Jämförelsen är exakt på grundformen (gemener), med några få normaliseringar: tyska 'ein(e)' -> ein/eine, listans
'der,die,das' delas vid komma och snedstreck, italienska reflexiva verb (alzarsi täcker alzare) och franska
'se lever' (orden i frasen räknas). Ett lemma kan alltså finnas i kursen i en annan form (t.ex. bara som femininum)
och ändå räknas som saknat; siffrorna är en uppskattning. Bara Pythons standardbibliotek.
"""
import collections, json, pathlib, re, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import tackning as T  # noqa: E402

ROOT = T.ROOT
LANG_DIR = T.LANG_DIR
DATA = ROOT / "tools" / "data"
OUT = ROOT / "docs" / "frekvens.md"
DATE = "2026-10-05"
TOPS = (1000, 2000)
SOURCE = {
    "fr": "Lexique 3.83 (New m.fl. 2004, www.lexique.org; CC BY-SA 4.0), rang efter medelfrekvensen i filmtextning och böcker",
    "de": "DeReWo v-ww-bll-320000g-2012-12-31-1.0 (© Institut für Deutsche Sprache, Mannheim; CC BY-NC 3.0), tidningsdominerad korpus",
    "it": "Kelly-listan för italienska (Kilgarriff m.fl. 2014, ssharoff.github.io/kelly; CC BY-NC-SA 2.0), webbkorpusen itWaC",
}
LANG_NAME = {"fr": "Franska", "de": "Tyska", "it": "Italienska"}

# Medvetet utelämnade: namn och förkortningar, grova ord, listans egenheter (homografer, korpusens slagsida mot
# nyheter och juridik) och ord som inte passar en elev. Räknas inte i topplistan. Understreck = mellanslag.
SKIP = {
    "fr": """etc o mademoiselle monsieur madame bordel merde putain con connard salaud salope foutre baiser cul pisser
        chier emmerder bite couille enculer flic mec nana bouffer fric cinglé crétin dingue foutu bon-dieu oh ah
        hé eh hein ouais bah euh hum chut bravo allô ok okay ha hep pardi zut ouf aïe hélas
        sire majesté seigneur lord sir capitaine lieutenant sergent colonel général shérif agent inspecteur
        tome bel nouvel vieil mieux pire moindre duquel auquel lesquels lesquelles laquelle lequel desquels
        quiconque autrui maint jadis naguère ci ça pute connerie enfoiré flingue gueule bagnole môme gosse ficher mme ben
        to in faîte parfaire ravir violer est-ce_que là-dedans là-dessus là-haut sacré diable enfer démon comte""",
    "de": """Prozent Euro Mark Dollar Franke Kanton Landgericht Personendatum Alte Mehr Salzburger Berliner Million Milliarde
        dass sowie bzw. ca. Uhr Nr. Mio. Mrd. etc. km
        Weblink Einzelnachweis Infobox Navigationsleiste Sortierung Wikipedia Müller Schneider Fischer Galle Van la ex on Best
        Nu Mär Bayer gelt spanen City Homepage Patentamt Wiener Frankfurter Münchner Mannheimer Mainzer hessisch Eintracht
        Schilling GmbH Pkw Verbandsgemeinde Ortsbürgermeister Bundesliga Infobox Grüne Linke Sozialdemokrat Senat""",
    "it": """Usa ecc. Zaire Bosnia pentito profugo listino piastrella ricavo rialzo babbo lira miliardo milione serbo croato
        sennò vabbè oddio fax web forum cliccare pignoramento svalutazione azionario quotazione predetto suddetto medesimo
        alcun nessun""",
}
NUMWORD = {"fr": set("cent mille million milliard zéro deuxième troisième quatrième cinquième sixième dixième centaine dizaine douzaine".split()),
           "de": set("million milliarde null hundert tausend erst zweit dritt viert fünft sechst".split()),
           "it": set("mille milione miliardo zero centinaio decina dozzina secondo terzo".split())}


def read_list(lang):
    """[(rang, lemma, ordklass)] ur tools/data/frekvens-<språk>.tsv."""
    out = []
    for line in (DATA / f"frekvens-{lang}.tsv").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        p = line.split("\t")
        out.append((int(p[0]), p[1].strip(), p[3].strip() if lang == "de" and len(p) > 3 else (p[2].strip() if len(p) > 2 else "")))
    return out


def forms(lemma):
    """'der,die,das' -> {der, die, das}; 'jede(r,s)' -> {jede, jeder, jedes}; 'ein(e)' -> {ein, eine};
    'il, lo, la' -> {il, lo, la}; 'cœur'/'coeur' -> båda."""
    out = set()
    lemma = lemma.lower()
    m = re.fullmatch(r"([^()]+)\(([^()]+)\)", lemma.strip())
    if m:
        out.add(m.group(1).strip())
        out |= {m.group(1).strip() + e.strip() for e in m.group(2).split(",")}
    else:
        out |= {p.strip() for p in re.split(r"[,/]", lemma) if p.strip()}
    out |= {o.replace("oe", "œ") for o in out if "oe" in o} | {o.replace("œ", "oe") for o in out if "œ" in o}
    out |= {ALIAS[o] for o in out if o in ALIAS}
    return out


# Samma ord med annan stavning eller form i ordlistorna
ALIAS = {"gerne": "gern", "alleine": "allein", "vacance": "vacances", "cheveu": "cheveux", "lunette": "lunettes",
         "toilette": "toilettes", "parent": "parents", "désoler": "désolé", "clef": "clé", "beamter": "beamte",
         "vorsitzender": "vorsitzende"}


def is_name(lang, lemma, pos):
    if lang == "it" and pos in ("np", "abb"):
        return True
    if lang == "fr" and lemma[:1].isupper():
        return True
    return False


def chains():
    """Kedjorna i ordning, t.ex. [fr1, fr2, fr, frs4, frs5, fr4, fru], via nextCourse."""
    order, before = T.courses()
    out = collections.defaultdict(list)
    for c in order:
        out[T.lang_of(c)].append(c)
    for lang in out:
        out[lang].sort(key=lambda c: len(before[c]))
    return out, before


def course_known(code):
    """Lemman som kursen själv lär ut: words.txt (+ bok), verbspelens verb och bindeord."""
    known = set(T.load_words(code))
    f = LANG_DIR / code / "verbs.json"
    if f.exists():
        try:
            known |= {k.lower() for k in (json.loads(f.read_text(encoding="utf-8")).get("sv") or {})}
        except ValueError:
            pass
    known |= T.load_connectors(code)
    lang = T.lang_of(code)
    if lang == "it":                      # alzarsi täcker alzare
        known |= {k[:-3] + "re" for k in known if k.endswith("rsi")}
    if lang == "fr":                      # s'habiller täcker habiller
        known |= {k[2:] for k in known if k.startswith("s'")}
    return known


def course_name(code):
    m = re.search(r'^\s*course:\s*"([^"]*)"', T.read_conf(code), re.M)
    return m.group(1) if m else code


def ranked(lang):
    """De vanligaste lemmana som inte är grammatikord, namn, räkneord eller i SKIP: [(rang, lemma)] i frekvensordning."""
    func = T.FUNCTION_SETS[lang]
    skip = {x.replace("_", " ") for x in SKIP[lang].split()}   # est-ce_que = 'est-ce que' 
    skip_l = {s.lower() for s in skip}
    out, seen = [], set()
    for rank, lemma, pos in read_list(lang):
        fs = forms(lemma)
        if lemma in skip or lemma.lower() in skip_l or fs & skip_l or is_name(lang, lemma, pos):
            continue
        if fs & func or any(T.NUMERAL[lang].match(f) for f in fs) or fs & NUMWORD[lang]:
            continue
        if lang == "de" and pos in ("DET", "PRON", "PREP", "CONJ", "NUM"):
            continue
        if lang == "it" and pos in ("prep", "conj", "det", "pron", "num", "art"):
            continue
        if lang == "fr" and pos in ("PRE", "CON", "ART:def", "ART:ind", "PRO:per", "PRO:rel", "PRO:dem", "PRO:pos", "PRO:int",
                                    "ADJ:pos", "ADJ:dem", "ADJ:num", "AUX", "ONO", "LIA"):
            continue
        key = lemma.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append((rank, lemma))
    return out


# Particip och liknande former som listan har som egna lemman (vu, venu, gegeben, laufend, passato):
# täckta om verbet finns (lemmatiseringen i tools/tackning.py).
VERB_END = {"fr": r"[a-zàâçéèêëîïôûùœ]+(er|ir|re|oir)", "de": r"[a-zäöüß]+(en|ern|eln)", "it": r"[a-zàèéìòù]+(are|ere|ire|rre)"}
PARTICIPLE = {"fr": re.compile(r".*(é|u|i|is|it|ant)$"), "de": re.compile(r"(.*ge.+(t|en)|.+end|ver.+t|be.+t|er.+t|ent.+t)$"),
              "it": re.compile(r".*(ato|uto|ito|ante|ente)$")}


def plural_forms(lang, fs, known):
    """Lemmana i fs vars plural (i stället för grundformen) står bland de kända orden."""
    out = set()
    for f in fs:
        if " " in f:
            continue
        if lang == "fr":
            pl = {f + "s", f + "x", re.sub(r"al$", "aux", f), re.sub(r"ail$", "aux", f)}
        elif lang == "it":
            pl = {re.sub(r"[oe]$", "i", f), re.sub(r"a$", "e", f), re.sub(r"ca$", "che", f), re.sub(r"co$", "chi", f),
                  re.sub(r"io$", "i", f), re.sub(r"go$", "ghi", f)}
        else:
            pl = {f + "e", f + "n", f + "en", f + "er"}
        if (pl - {f}) & known:
            out.add(f)
    return out


def covered(lemma, known, lex):
    fs = forms(lemma)
    if fs & known:
        return True
    lang = lex.lang
    if fs & plural_forms(lang, fs, known):            # gli occhi, les cheveux, die Eltern: bara pluralen i ordlistan
        return True
    for f in fs:
        if " " not in f and PARTICIPLE[lang].fullmatch(f) and f[:1].islower() == lemma[:1].islower():
            lm = lex.lemma(f)
            if lm and lm != f and lm in lex.verbs and lm in known:
                return True
    return False


def measure(selected=None):
    ch, before = chains()
    res = {}
    for lang, codes in sorted(ch.items()):
        if selected and not set(codes) & selected and lang not in selected:
            continue
        top = ranked(lang)[: max(TOPS)]
        known = set()
        steps = []
        first = {}
        vforms = T.load_verb_forms(lang, codes)
        for c in codes:
            known |= course_known(c)
            lex = T.Lexicon(lang, known, vforms, verbs={k for k in known if re.fullmatch(VERB_END[lang], k)})
            cov = [lemma for _, lemma in top if lemma not in first and covered(lemma, known, lex)]
            for lemma in cov:
                first.setdefault(lemma, c)
            nums = {n: sum(1 for _, lemma in top[:n] if lemma in first) for n in TOPS}
            steps.append((c, nums, len(known)))
        missing = [(r, lemma) for r, lemma in top if lemma not in first]
        res[lang] = {"codes": codes, "steps": steps, "missing": missing, "first": first, "top": top}
    return res


def pct(a, b):
    return f"{100 * a / b:.1f} %".replace(".", ",") if b else "–"


def report(res):
    L = ["# Frekvenstäckning i kurskedjorna", "",
         f"Genererad {DATE} med `python3 tools/frekvens.py`. Skriv inte i filen för hand; kör om verktyget.", "",
         "Hur många av språkets vanligaste lemman eleven har mött när kursen är klar, räknat **kumulativt** längs kedjan "
         "(`nextCourse`). Ett lemma räknas som täckt om grundformen står i någon `words.txt` (även bokens ord och ord i "
         "en fras), bland verbspelens verb (`verbs.json`) eller bland bindeorden i kursen eller en tidigare kurs. "
         "Grammatikord (artiklar, pronomen, prepositioner, konjunktioner, hjälpverb, räkneord: `FUNCTION` i "
         "`tools/tackning.py`) räknas inte, och inte heller namn, förkortningar, grova ord och listornas egenheter "
         "(`SKIP` i `tools/frekvens.py`). *Topp 1 000* är alltså de 1 000 vanligaste lemmana som återstår. "
         "Jämförelsen är på grundformen, så siffrorna är en uppskattning.", "",
         "Källor (utdrag med rang i `tools/data/frekvens-<språk>.tsv`, källa och licens överst i filerna):", ""]
    for lang in res:
        L.append(f"- {LANG_NAME[lang]}: {SOURCE[lang]}.")
    L += ["", "Målet i backloggen: hela kedjan ska täcka de 2 000 vanligaste lemmana så långt det är rimligt för en elev. "
          "Tumregel (`docs/nivaer.md`): ca 1 000 ord per steg, A2 ≈ 2 000 ord och B1 ≈ 3 000 ord.", "",
          "Tolkning: de låga siffrorna i de första stegen är delvis avsiktliga. Tyska 1–3 tar inte med ord som redan "
          "finns i Tyska 4–6, och Franska 2 inte ord som finns i Franska 3, så ett vanligt ord kan komma först i ett "
          "senare steg. DeReWo bygger mest på tidningstext och Kelly-listan på webbtext, så de saknade orden är ofta "
          "nyhets-, sport- eller förvaltningsord; Lexique bygger på filmtextning och romaner (därav tuer, arme, cadavre). "
          "Avsnitten med vanliga ord (`#vanliga2` i Franska 3, `#ev`/`#dv`/`#hv` i fr1/fr2/frs4, `#ev`/`#bv`/`#tv`/`#sv` i "
          "de1–de6 och `#iv`/`#jv`/`#kv`/`#cv` i it1–it4) fyllde luckorna 2026-10-05.", ""]
    L += ["## Sammanfattning", "", "| Kurs | Kod | Kända lemman (kumulativt) | Topp 1 000 | Topp 2 000 |", "|---|---|---:|---:|---:|"]
    for lang, r in res.items():
        for c, nums, nk in r["steps"]:
            L.append(f"| {course_name(c)} | {c} | {nk} | {pct(nums[1000], min(1000, len(r['top'])))} | "
                     f"{pct(nums[2000], min(2000, len(r['top'])))} |")
    for lang, r in res.items():
        miss = r["missing"]
        L += ["", f"## {LANG_NAME[lang]}: {' → '.join(r['codes'])}", ""]
        n1 = sum(1 for _, l in r["top"][:1000] if l not in r["first"])
        L.append(f"Saknas efter hela kedjan: {n1} av topp 1 000 och {len(miss)} av topp 2 000. "
                 "Rangen (listans) står inom parentes.")
        L.append("")
        for lo, hi in ((0, 1000), (1000, 2000)):
            part = [f"{l} ({rk})" for i, (rk, l) in enumerate(r["top"]) if lo <= i < hi and l not in r["first"]]
            L.append(f"**Topp {lo + 1}–{hi}** ({len(part)}): " + (", ".join(part) if part else "inga") + ".")
            L.append("")
        per = collections.Counter(r["first"].values())
        L.append("Var lemmana i topp 2 000 kommer första gången: " +
                 ", ".join(f"{c} {per[c]}" for c in r["codes"]) + ".")
    return "\n".join(L) + "\n"


def main(argv):
    args = [a for a in argv if not a.startswith("--")]
    if "--saknas" in argv and args:
        code = args[0]
        res = measure({code})
        for lang, r in res.items():
            codes = r["codes"][: r["codes"].index(code) + 1]
            for rk, lemma in r["top"]:
                if r["first"].get(lemma) not in codes:
                    print(rk, lemma, sep="\t")
        return
    res = measure(set(args) or None)
    if args:
        for lang, r in res.items():
            for c, nums, nk in r["steps"]:
                print(f"{c:5} {nk:6}  topp 1000 {pct(nums[1000], 1000):>8}  topp 2000 {pct(nums[2000], 2000):>8}")
            print("Saknas:", ", ".join(l for _, l in r["missing"]))
        return
    OUT.write_text(report(res), encoding="utf-8")
    for lang, r in res.items():
        c, nums, _ = r["steps"][-1]
        print(f"{lang}: {c} topp 1000 {pct(nums[1000], 1000)}, topp 2000 {pct(nums[2000], 2000)}, saknas {len(r['missing'])}")
    print("Skrev", OUT.relative_to(ROOT))


if __name__ == "__main__":
    main(sys.argv[1:])
