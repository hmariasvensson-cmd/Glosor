#!/usr/bin/env python3
"""Verbtabeller ur Wiktionary (kaikki.org) till verbspelen (languages/<kod>/verbs.json).

    python3 tools/verbdata.py extract --kaikki DIR      # steg 1: plocka ut verben ur nedladdade kaikki-filer
    python3 tools/verbdata.py check                     # jämför de handskrivna tabellerna med Wiktionary
    python3 tools/verbdata.py apply [--dry-run]         # steg 2: lägg till verb i verbs.json

Källa: kaikki.org, maskinläsbara utdrag ur engelska Wiktionary (Tatu Ylonen, Wiktextract), filerna
kaikki.org-dictionary-{French,German,Italian}-by-pos-verb.jsonl från https://kaikki.org/dictionary/<Språk>/pos-verb/
(cirka 300–500 MB styck, checkas inte in). För tyska verb som kan ha både haben och sein hämtas hjälpverbens
ordning (det vanligaste först) ur tyska Wiktionary via kaikki.org/dewiktionary (per ord, kräver nät, cachas).
Licens: Wiktionarys text är CC BY-SA 4.0 (och GFDL); det härledda utdraget ligger i tools/data/verbs-<språk>.json
med källa och licens överst och följer samma licens.

extract läser bara de verb som behövs: verben i kursernas words.txt (inte bokmappen, som är privat) och nycklarna i
de befintliga verbs.json. Ett verb är ett ord utan genus vars form slutar som en infinitiv (-er/-ir/-re, -en/-ern/-eln,
-are/-ere/-ire/-rsi) och vars svenska översättning är ett verb (första ordet slutar på vokal: gå, tro, vänta),
och som finns som verb med böjningstabell i Wiktionary. Franska "se lever"/"s'habiller" och italienska "alzarsi"
böjs som grundverbet med reflexivt pronomen och être/essere. Tyska reflexiva verb (sich …) tas inte med, och
franska reflexiva verb läggs inte till av apply än: check() i src/app.js stryker ett inledande nous/vous ur svaret,
så "nous levons" (formen i tabellen) godkänns inte. Franska verb på h, â, è … läggs inte heller till: prefix i
lang.js skriver je (inte j') framför dem.

apply lägger till verb, aldrig tar bort eller ändrar befintliga (fråge-id är "<verb>|<tempus>|<person>"):
  - Varje kurs ska i de tempus som kursens verbspel övar (games i lang.js) ha verben i kursens och de tidigare
    kursernas words.txt (kedjan via nextCourse), de vanligaste först (tools/data/frekvens-<språk>.tsv).
  - Tabellerna ärvs (extends + inherit: ["verbs"]). Ett verb läggs i den kurs där det behövs först i arvet; en
    lägre kurs som ärver från en högre (fr1/fr2 från fr, de1–de4 från de) får de tillagda verb den inte ska ha
    bortplockade med $remove.
  - Storleken: kursens datafil får inte gå över MAX_DATA_KB i build.py (minus MARGIN_KB). Bygg först
    (python3 build.py), så att dist/data/<kod>.json finns (storleken räknas utan verbTables i den); blir det för
    stort tas de minst vanliga verben bort.
  - Konjunktiv II bara för verb där formen skiljer sig från preteritum och inte är markerad som ovanlig
    (käme, ginge, wüsste, men inte *führe, *spielte): annars säger man würde + infinitiv.
  - Spel med en egen verblista (verbs i games i lang.js, t.ex. fr1, de1, it1) visar bara verben i listan; apply
    skriver ut förslag på verb att lägga till där.

check skriver ut skillnader mellan de handskrivna tabellerna och Wiktionary (per kurs, tempus, verb och person).
"""
import argparse, collections, json, pathlib, re, sys, time, unicodedata, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANG_DIR = ROOT / "languages"
DATA = ROOT / "tools" / "data"
DIST = ROOT / "dist" / "data"
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tools"))
import build as B          # noqa: E402  parse_lang_js, merge_inherited, conf_parent, MAX_DATA_KB
import tackning as T       # noqa: E402  courses() (kedjorna via nextCourse)

MARGIN_KB = 10
SKIP = {"de": {"sieben", "regnen", "schneien"}, "fr": {"hier", "pleuvoir", "neiger", "falloir"},
        "it": {"piovere", "nevicare"}}   # räkneord/adverb (sju, i går) och väderverb utan personer
LANGS = {"fr": "French", "de": "German", "it": "Italian"}
LICENSE = ("Härlett ur engelska Wiktionary via kaikki.org (Wiktextract, Tatu Ylonen), "
           "https://kaikki.org/dictionary/<Språk>/pos-verb/; tyska hjälpverb ur tyska Wiktionary via "
           "https://kaikki.org/dewiktionary/. Licens: CC BY-SA 4.0 (Wiktionary). Skapad med tools/verbdata.py extract.")
PERSON = {("first-person", "singular"): 0, ("second-person", "singular"): 1, ("third-person", "singular"): 2,
          ("first-person", "plural"): 3, ("second-person", "plural"): 4, ("third-person", "plural"): 5}
GRAMMAR_TAGS = {"first-person", "second-person", "third-person", "singular", "plural", "indicative", "present",
                "imperfect", "historic", "past", "future", "conditional", "subjunctive", "subjunctive-i",
                "subjunctive-ii", "preterite", "participle", "perfect", "pluperfect", "multiword-construction"}
QUALIFIERS_OK_RARE = {"rare", "formal"}   # tyska Konjunktiv II: führe är "formal, rare"
INF_END = {"fr": r"(er|ir|ïr|re)$", "de": r"[a-zäöüß](en|ern|eln)$|^(sein|tun)$", "it": r"(are|ere|ire|rre|rsi)$"}

# Tempus i appen -> nyckel i utdraget (enkla tempus) och hur de sammansatta byggs: (hjälpverbets tempus)
SIMPLE = {
    "fr": {"présent": "pres", "imparfait": "impf", "passé simple": "ps", "futur simple": "fut",
           "conditionnel": "cond", "subjonctif": "subj"},
    "de": {"Präsens": "pres", "Präteritum": "prt", "Konjunktiv I": "k1", "Konjunktiv II": "k2"},
    "it": {"presente": "pres", "imperfetto": "impf", "passato remoto": "rem", "futuro semplice": "fut",
           "condizionale": "cond", "congiuntivo presente": "cong", "congiuntivo imperfetto": "congimp"},
}
COMPOUND = {
    "fr": {"passé composé": "pres", "plus-que-parfait": "impf"},
    "de": {"Perfekt": "pres"},
    "it": {"passato prossimo": "pres", "trapassato prossimo": "impf", "futuro anteriore": "fut",
           "congiuntivo passato": "cong", "congiuntivo trapassato": "congimp", "condizionale passato": "cond"},
}
# Taggar per nyckel: (måste finnas, får inte finnas)
FORM_TAGS = {
    "fr": {"pres": ({"indicative", "present"}, set()), "impf": ({"indicative", "imperfect"}, set()),
           "ps": ({"indicative", "historic", "past"}, set()), "fut": ({"indicative", "future"}, set()),
           "cond": ({"conditional"}, set()), "subj": ({"subjunctive", "present"}, set())},
    "de": {"pres": ({"indicative", "present"}, set()), "prt": ({"indicative", "preterite"}, set()),
           "k1": ({"subjunctive-i"}, set()), "k2": ({"subjunctive-ii"}, set())},
    "it": {"pres": ({"indicative", "present"}, set()), "impf": ({"indicative", "imperfect"}, set()),
           "rem": ({"indicative", "historic", "past"}, set()), "fut": ({"indicative", "future"}, set()),
           "cond": ({"conditional"}, set()), "cong": ({"subjunctive", "present"}, set()),
           "congimp": ({"subjunctive", "imperfect"}, set())},
}
IPA = re.compile(r"[ʁɔɛəʃʒɑɲŋøœ̃ˈˌː./\[\]]")


# ---------- kurser och ordlistor ----------

def confs():
    return {p.name: B.parse_lang_js((p / "lang.js").read_text(encoding="utf-8"), p.name)
            for p in sorted(LANG_DIR.iterdir()) if (p / "lang.js").exists()}


def chains():
    """{språk: [kurser i kedjeordning]} via nextCourse (samma som tools/frekvens.py)."""
    order, before = T.courses()
    out = collections.defaultdict(list)
    for c in order:
        out[T.lang_of(c)].append(c)
    for lang in out:
        out[lang].sort(key=lambda c: len(before[c]))
    return out


def sv_is_verb(sv):
    s = re.sub(r"\([^)]*\)", "", sv)
    s = re.split(r"[,;]", s)[0].strip()
    s = re.sub(r"^att\s+", "", s)
    first = s.split()[0] if s.split() else ""
    return bool(re.search(r"[aeiouyåäö]$", first))


def verb_key(lang, word):
    """Nyckeln i verbtabellen (= ordet utan valensparentes) och grundverbet att slå upp, eller None."""
    w = re.sub(r"\s*\([^)]*\)", "", word).strip()
    refl = False
    if lang == "fr":
        m = re.match(r"^(?:se |s')(\S+)$", w)
        if m:
            refl, base = True, m.group(1)
        elif " " in w:
            return None
        else:
            base = w
    elif lang == "de":
        if " " in w or not w[:1].islower():
            return None
        base = w
    else:
        if " " in w:
            return None
        base = w
        if w.endswith("rsi"):
            refl, base = True, w[:-3] + "re"     # alzarsi -> alzare (porsi -> porre, se rec_of)
    if not re.search(INF_END[lang], w if lang != "it" else (w if not refl else base)):
        return None
    return w, base, refl


def course_verbs(lang, code):
    """{nyckel: (grundverb, reflexivt, svenska)} för verben i kursens words.txt (inte bokmappen), i ordning."""
    out = {}
    f = LANG_DIR / code / "words.txt"
    if not f.exists():
        return out
    for line in f.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("//") or s.startswith("#"):
            continue
        p = s.split("|")
        if len(p) < 3 or p[2] or not sv_is_verb(p[1]):
            continue
        k = verb_key(lang, p[0])
        if k and k[0] not in out and k[0] not in SKIP.get(lang, ()):
            out[k[0]] = (k[1], k[2], re.sub(r"\s+", " ", p[1]).strip())
    return out


def own_tables(code):
    f = LANG_DIR / code / "verbs.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else None


def table_keys(tables):
    out = set()
    for o in (tables or {}).get("tenses", {}).values():
        if isinstance(o, dict):
            out |= {k for k in o if k not in ("rule", "$remove")}
    return out


# ---------- extract ----------

def strip_it(form):
    """Italienska tabeller i Wiktionary markerar betoningen (chiàmo, andàre). Behåll bara accent på sista bokstaven."""
    words = []
    for w in form.split(" "):
        d = unicodedata.normalize("NFD", w)
        out, n = [], len(d)
        for i, ch in enumerate(d):
            if unicodedata.category(ch) == "Mn":
                if i != n - 1:          # accenten hör till sista bokstaven bara om den står sist
                    continue
            out.append(ch)
        w2 = unicodedata.normalize("NFC", "".join(out))
        vowels = re.findall(r"[aeiouàèéìòóù]+", w2)
        if len(vowels) == 1 and w2 not in ("è", "dà", "può", "più", "già", "giù", "ciò"):
            w2 = unicodedata.normalize("NFC", "".join(c for c in unicodedata.normalize("NFD", w2)
                                                      if unicodedata.category(c) != "Mn"))
        words.append(w2)
    return " ".join(words)


def person_of(tags):
    for (p, n), i in PERSON.items():
        if p in tags and n in tags:
            return i
    return None


def tables_of(e):
    """Böjningsraderna uppdelade per tabell (en post kan ha flera, t.ex. allumer och s'allumer med être)."""
    out, prev = [[]], set()
    for x in e.get("forms", []):
        if x.get("source") != "conjugation" or not x.get("form"):
            continue
        tags = set(x.get("tags", []))
        if ("table-tags" in tags or ("inflection-template" in tags and "table-tags" not in prev)) and \
                any("table-tags" not in set(y.get("tags", [])) and "inflection-template" not in set(y.get("tags", [])) for y in out[-1]):
            out.append([])
        out[-1].append(x)
        prev = tags
    return [t for t in out if t]


def derive(lang, e):
    """Kompakt post för ett verb ur den första fullständiga tabellen, se derive_table."""
    tabs = tables_of(e)
    if lang == "de":                 # tyska: huvudsats- och bisatstabellen hör ihop (bisatsformerna sorteras bort)
        tabs = [[x for t in tabs for x in t]]
    rec = None
    for forms in tabs:
        r = derive_table(lang, forms)
        if "pres" in r:
            rec = r
            break
        rec = rec or r
    rec = rec or {}
    if lang == "it" and rec.get("aux"):
        # Hjälpverb med kvalificering (transitive/intransitive …) ur hela posten. Båda hjälpverben bara när de
        # delar upp verbet efter valens (finire: avere transitivt, essere intransitivt); annars det första.
        q = collections.OrderedDict()
        for x in e.get("forms", []):
            tags = set(x.get("tags", []))
            if "auxiliary" in tags and x.get("source") == "conjugation":
                a = strip_it(x["form"].strip())
                if a in ("avere", "essere"):
                    q.setdefault(a, set()).update(tags - {"auxiliary"})
        ok = [a for a, t in q.items() if not t & {"archaic", "rare", "impersonal", "also", "sometimes", "obsolete"}]
        if ok:
            rec["aux"] = ok[:1]
            if len(ok) > 1 and q[ok[0]] and q[ok[1]] and q[ok[0]] != q[ok[1]]:
                rec["aux"] = ok[:2]          # i Wiktionarys ordning: finire avere först, tornare essere först
                rec["auxBoth"] = True
    return rec


DE_AUX = {"habe": "haben", "hast": "haben", "hat": "haben", "haben": "haben", "habt": "haben",
          "bin": "sein", "bist": "sein", "ist": "sein", "sind": "sein", "seid": "sein"}


def derive_table(lang, forms):
    """{aux: [...], pp, <tempusnyckel>: [6 former, varianter med /], k2rare, perf: {haben|sein: [...]}}."""
    rec, slots, slots_rare = {}, collections.defaultdict(lambda: [[] for _ in range(6)]), collections.defaultdict(lambda: [[] for _ in range(6)])
    aux, perf = [], collections.defaultdict(lambda: [[] for _ in range(6)])
    clean = strip_it if lang == "it" else (lambda s: s)
    for x in forms:
        tags, f = set(x.get("tags", [])), x["form"].strip()
        if (IPA.search(f) and "multiword-construction" not in tags) or f in ("-", "—", "–"):
            continue
        if lang == "fr" and "multiword-construction" not in tags:
            # bara pronominella verb (s'envoler): tabellen har m'envole, nous envolons; pronomenet läggs till i generate
            f2 = re.sub(r"^(?:m'|t'|s'|me |te |se |nous |vous )", "", f)
            if f2 != f and person_of(tags) is not None:
                rec["pron"] = True
                f = f2
        if "auxiliary" in tags:
            for a in re.split(r"\s+or\s+|,\s*", f):
                a = clean(a.strip())
                if a in ("avoir", "être", "haben", "sein", "avere", "essere") and a not in aux:
                    aux.append(a)
            continue
        if tags >= {"participle", "past"} and not (tags - {"participle", "past"}):
            rec.setdefault("pp", clean(f))
            continue
        if lang == "fr" and tags >= {"infinitive", "multiword-construction"}:
            m = re.match(r"^(avoir|être)( or (avoir|être))?( \+ past participle)?$", f)
            if m:
                for a in (m.group(1), m.group(3)):
                    if a and a not in aux:
                        aux.append(a)
            continue
        i = person_of(tags)
        if i is None:
            continue
        if lang == "de" and tags >= {"indicative", "perfect", "multiword-construction"} and not (tags - GRAMMAR_TAGS):
            a = DE_AUX.get(f.split()[0])
            if a and f not in perf[a][i]:
                perf[a][i].append(f)
            continue
        if "multiword-construction" in tags:
            continue
        extra = tags - GRAMMAR_TAGS
        for key, (need, forbid) in FORM_TAGS[lang].items():
            if not (tags >= need) or tags & forbid:
                continue
            if lang in ("fr", "it") and key in ("pres", "fut", "cond") and ({"perfect", "subjunctive"} & tags):
                continue
            if lang in ("fr", "it") and key == "impf" and "subjunctive" in tags:
                continue
            if lang == "fr" and key == "ps" and "anterior" in tags:
                continue
            if lang == "de" and key == "pres" and "subjunctive" in tags:
                continue
            f2 = clean(f)
            if not extra:
                if f2 not in slots[key][i]:
                    slots[key][i].append(f2)
            elif lang == "de" and key == "k2" and extra <= QUALIFIERS_OK_RARE:
                if f2 not in slots_rare[key][i]:
                    slots_rare[key][i].append(f2)
    for key in FORM_TAGS[lang]:
        s = slots.get(key)
        if s and all(s):
            rec[key] = ["/".join(v) for v in s]
        elif lang == "de" and key == "k2" and slots_rare.get(key) and all(slots_rare[key]):
            rec[key] = ["/".join(v) for v in slots_rare[key]]
            rec["k2rare"] = True
    if lang == "de" and perf:
        # Perfekt med det första hjälpverbet som har alla personer; extract byter ordning efter tyska Wiktionary
        rec["perf"] = {}
        for a, s in perf.items():
            if all(s):
                rec["perf"][a] = [v[0] for v in s]
    if aux:
        rec["aux"] = aux
    return rec


def wanted_lemmas():
    """{språk: {grundverb}} som extract ska plocka ut: verben i alla words.txt och nycklarna i verbs.json."""
    out = collections.defaultdict(set)
    for p in sorted(LANG_DIR.iterdir()):
        if not (p / "lang.js").exists():
            continue
        lang = T.lang_of(p.name)
        for k, (base, refl, sv) in course_verbs(lang, p.name).items():
            out[lang].add(base)
            if refl and lang == "it":
                out[lang].add(base[:-2] + "rre")
        for k in table_keys(own_tables(p.name)):
            vk = verb_key(lang, k)
            out[lang].add(vk[1] if vk else k)
    for lang in out:
        out[lang] |= {"fr": {"avoir", "être"}, "de": {"haben", "sein"}, "it": {"avere", "essere"}}[lang]
    return out


WORD_RE = re.compile(r'"word": "((?:[^"\\]|\\.)*)"')


def scan(path, lang, want):
    """Läser en kaikki-fil (jsonl) rad för rad och returnerar {grundverb: post} för de verb som behövs."""
    found = {}
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            if not any(json.loads('"' + w + '"') in want for w in WORD_RE.findall(line)):
                continue
            e = json.loads(line)
            w = e.get("word")
            if w not in want or e.get("pos") != "verb":
                continue
            rec = derive(lang, e)
            keys = [k for k in FORM_TAGS[lang] if k in rec]
            old = found.get(w)
            if not keys or (old and len([k for k in FORM_TAGS[lang] if k in old]) >= len(keys)):
                continue
            found[w] = rec
    return found


def fetch_de_aux(word, cache):
    """Hjälpverben i den ordning tyska Wiktionary anger dem (det vanligaste först), eller []."""
    cache.mkdir(parents=True, exist_ok=True)
    f = cache / f"dewikt-{word}.jsonl"
    if not f.exists():
        url = "https://kaikki.org/dewiktionary/Deutsch/meaning/{}/{}/{}.jsonl".format(
            *(urllib.parse.quote(x) for x in (word[0], word[:2], word)))
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                f.write_bytes(r.read())
        except Exception as ex:   # noqa: BLE001  (ordet saknas eller inget nät: behåll engelska Wiktionarys ordning)
            print(f"  {word}: kunde inte hämta tyska Wiktionary ({ex})")
            return []
        time.sleep(0.2)
    for line in f.read_text(encoding="utf-8").splitlines():
        e = json.loads(line)
        if e.get("word") != word or e.get("pos") != "verb":
            continue
        out = []
        for x in e.get("forms", []):
            if set(x.get("tags", [])) == {"auxiliary", "perfect"} and x.get("form") in ("haben", "sein") and x["form"] not in out:
                out.append(x["form"])
        if out:
            return out
    return []


def cmd_extract(args):
    want = wanted_lemmas()
    kdir = pathlib.Path(args.kaikki)
    for lang, name in LANGS.items():
        if args.lang and lang not in args.lang:
            continue
        path = kdir / f"kaikki.org-dictionary-{name}-by-pos-verb.jsonl"
        if not path.exists():
            path = kdir / f"{name}-verb.jsonl"
        print(f"{lang}: läser {path} ({len(want[lang])} verb behövs)")
        found = scan(path, lang, want[lang])
        if lang == "de":
            for w, rec in sorted(found.items()):
                if len(rec.get("aux", [])) > 1:
                    order = fetch_de_aux(w, pathlib.Path(args.cache).expanduser())
                    if order:
                        rec["aux"] = order + [a for a in rec["aux"] if a not in order]
                        rec["auxSource"] = "dewiktionary"
        missing = sorted(want[lang] - set(found))
        out = {"_source": LICENSE, "_missing": missing,
               "verbs": {k: found[k] for k in sorted(found)}}
        dest = DATA / f"verbs-{lang}.json"
        lines = ["{", f' "_source": {json.dumps(LICENSE, ensure_ascii=False)},',
                 f' "_missing": {json.dumps(missing, ensure_ascii=False)},', ' "verbs": {']
        items = [f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False, separators=(',', ':'))}"
                 for k, v in out["verbs"].items()]
        lines.append(",\n".join(items))
        lines += [" }", "}"]
        dest.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"{lang}: {len(found)} verb till {dest.relative_to(ROOT)}, saknas i Wiktionary: {len(missing)}")


# ---------- generera former ----------

def load_data(lang):
    return json.loads((DATA / f"verbs-{lang}.json").read_text(encoding="utf-8"))["verbs"]


# Verb med être som också tar avoir med direkt objekt (j'ai sorti la poubelle). Wiktionary anger båda hjälpverben
# även för t.ex. partir (ålderdomligt transitivt), så listan är den vanliga skolgrammatikens.
# När Wiktionary anger både avoir och être (paraître, disparaître, partir …) avgör "maison d'être"-listan
FR_ETRE = {"aller", "venir", "devenir", "revenir", "intervenir", "parvenir", "survenir", "arriver", "partir", "repartir",
           "entrer", "rentrer", "sortir", "ressortir", "monter", "remonter", "descendre", "redescendre", "naître",
           "mourir", "décéder", "rester", "tomber", "retomber", "retourner", "passer", "repasser", "apparaître"}
FR_BOTH = {"passer", "monter", "descendre", "sortir", "rentrer", "retourner", "remonter", "redescendre", "ressortir", "repasser"}
# Italienska verb där Wiktionary anger avere transitivt men det i praktiken bara är essere (ho tornato är ålderdomligt)
IT_ESSERE_ONLY = {"tornare", "ritornare"}
FR_REFL = ["me", "te", "se", "nous", "vous", "se"]
IT_REFL = ["mi", "ti", "si", "ci", "vi", "si"]


def fr_refl(i, form, elide_h):
    p = FR_REFL[i]
    if p in ("me", "te", "se") and (re.match(r"^[aeéèêiîoôuûâ]", form) or (elide_h and form.startswith("h"))):
        return p[0] + "'" + form
    return p + " " + form


def first(v):
    return v.split("/")[0]


def rec_of(data, base):
    return data.get(base) or (data.get(base[:-2] + "rre") if base.endswith("re") else None)


def generate(lang, data, key, base, refl, tense):
    """Sex former för verbet i tempuset (samma format som de handskrivna tabellerna), eller None."""
    rec = rec_of(data, base)
    if not rec:
        return None
    if tense in SIMPLE[lang]:
        tk = SIMPLE[lang][tense]
        forms = rec.get(tk)
        if not forms:
            return None
        if lang == "de" and tk == "k2":
            if rec.get("k2rare") or [first(x) for x in forms] == [first(x) for x in rec.get("prt", [])]:
                return None
        if refl and lang == "fr":
            return ["/".join(fr_refl(i, v, key.startswith("s'")) for v in f.split("/")) for i, f in enumerate(forms)]
        if refl and lang == "it":
            return ["/".join(IT_REFL[i] + " " + v for v in f.split("/")) for i, f in enumerate(forms)]
        return list(forms)
    # sammansatta tempus: hjälpverb + particip
    at = COMPOUND[lang][tense]
    if lang == "de":
        perf = rec.get("perf") or {}
        aux = [a for a in rec.get("aux", []) if a in ("haben", "sein")]
        a = aux[0] if aux else None
        if not a or a not in perf:
            return None
        return list(perf[a])
    pp = rec.get("pp")
    if not pp:
        return None
    pp = pp.split("/")[0]
    aux = rec.get("aux", [])
    if lang == "fr":
        both = base in FR_BOTH and not refl
        use_etre = refl or aux == ["être"] or ("être" in aux and base in FR_ETRE)
        a_ess, a_av = data["être"].get(at), data["avoir"].get(at)
        out = []
        for i in range(6):
            if use_etre:
                pl = i >= 3
                if pp.endswith("s"):
                    ag = pp + ("(es)" if pl else "(e)")
                    if i == 4:
                        ag = pp + "(e)(s)"
                else:
                    ag = pp + ("(e)s" if pl else "(e)")
                    if i == 4:
                        ag = pp + "(e)(s)"
                f = first(a_ess[i]) + " " + ag
                if refl:
                    f = fr_refl(i, f, key.startswith("s'"))
                if both:
                    f += "/" + first(a_av[i]) + " " + pp
                out.append(f)
            else:
                out.append(first(a_av[i]) + " " + pp)
        return out
    # italienska: essere böjer participet (andato/andata); verb med båda hjälpverben (finire, correre, passare)
    # får båda, avere först (ho finito/sono finito/sono finita)
    both = not refl and rec.get("auxBoth", False) and base not in IT_ESSERE_ONLY
    ess = refl or "essere" in aux[:1] or both or base in IT_ESSERE_ONLY
    auxf, avf = data["essere"].get(at), data["avere"].get(at)
    if not auxf or not avf:
        return None
    out = []
    for i in range(6):
        if ess and pp.endswith("o"):
            st = pp[:-1]
            g = [st + "o", st + "a"] if i < 3 else [st + "i", st + "e"]
            vs = [first(auxf[i]) + " " + x for x in g]
        elif ess:
            vs = [first(auxf[i]) + " " + pp]
        else:
            vs = [first(avf[i]) + " " + pp]
        if refl:
            vs = [IT_REFL[i] + " " + v for v in vs]
        if both:
            av = [first(avf[i]) + " " + pp]
            vs = av + vs if aux[0] == "avere" else vs + av
        out.append("/".join(vs))
    return out


# ---------- jämförelse ----------

def variants(form):
    """Samma tolkning som conjVariants i src/app.js (snedstreck = alternativ, (e)(s) = valfri ändelse)."""
    out = set()
    for f in form.split("/"):
        f = f.strip()
        if "(" in f:
            opts = [re.sub(r"\([^)]*\)", "", f), f.replace("(", "").replace(")", ""),
                    f.replace("(e)(s)", "e", 1).replace("(e)", "e", 1), f.replace("(e)(s)", "s", 1), f.replace("(e)s", "es", 1)]
        else:
            opts = [f]
        out |= {re.sub(r"\s+", " ", o).strip().lower() for o in opts}
    return out


def compare(lang, data, code, tables):
    """[(tempus, verb, person, befintlig, wiktionary)] där den befintliga formen inte godtas av Wiktionarys former."""
    out = []
    for tense, o in (tables.get("tenses") or {}).items():
        if not isinstance(o, dict) or tense not in SIMPLE[lang] and tense not in COMPOUND[lang]:
            continue
        for verb, forms in o.items():
            if verb in ("rule", "$remove"):
                continue
            vk = verb_key(lang, verb)
            base, refl = (vk[1], vk[2]) if vk else (verb, False)
            gen = generate(lang, data, verb, base, refl, tense)
            if gen is None and lang == "de" and tense == "Konjunktiv II" and base in data and data[base].get("k2"):
                gen = data[base]["k2"]   # befintliga tabeller får ha Konjunktiv II även för ovanliga former
            if gen is None:
                out.append((tense, verb, None, "", "saknas i Wiktionary-utdraget" if not rec_of(data, base)
                            else "Wiktionary har ingen fullständig form i det här tempuset"))
                continue
            for i, (a, b) in enumerate(zip(forms, gen)):
                va, vb = variants(a), variants(b)
                if not (va & vb):
                    out.append((tense, verb, i, a, b))
                elif not va <= vb and lang != "fr":
                    out.append((tense, verb, i, a, b + "  (delvis: " + ", ".join(sorted(va - vb)) + " finns inte i Wiktionary)"))
    return out


def cmd_check(args):
    total = 0
    for p in sorted(LANG_DIR.iterdir()):
        tables = own_tables(p.name)
        if not tables:
            continue
        lang = T.lang_of(p.name)
        data = load_data(lang)
        diffs = compare(lang, data, p.name, tables)
        for tense, verb, i, a, b in diffs:
            print(f"{p.name}\t{tense}\t{verb}\t{'' if i is None else i}\t{a}\t{b}")
        total += len(diffs)
    print(f"{total} skillnader")


# ---------- apply ----------

def game_tenses(cf, code, seen=()):
    """Tempusen i kursens verbspel (games, egna eller ärvda)."""
    conf = cf.get(code) or {}
    v = conf.get("verbs")
    games = v.get("games") if isinstance(v, dict) else None
    if games is None:
        parent, inherit = B.conf_parent(conf)
        if parent and "verbs" in inherit and parent not in seen:
            return game_tenses(cf, parent, seen + (code,))
        return set(), []
    tenses, lists = set(), []
    for g in games:
        if isinstance(g, dict):
            tenses |= set(g.get("tenses") or [])
            if g.get("verbs"):
                lists.append((g.get("id"), g.get("tenses") or [], list(g["verbs"])))
    return tenses, lists


def rank_limit(step):
    """Vilka verb ur kursens words.txt som är relevanta på nivån: steg 1–2 alla, steg 3–4 de 1 000 vanligaste
    lemmana i språket (frekvenslistan), steg 5 och uppåt de 1 500 vanligaste. Verb från tidigare kurser följer med."""
    s = step if isinstance(step, int) else 7
    return 10 ** 9 if s <= 2 else (1000 if s <= 4 else 1500)


def freq_rank(lang):
    rank = {}
    for line in (DATA / f"frekvens-{lang}.tsv").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        p = line.split("\t")
        rank.setdefault(p[1].strip().lower(), int(p[0]))
    return rank


def resolve(cf, own, code, seen=()):
    conf = cf.get(code) or {}
    parent, inherit = B.conf_parent(conf)
    if parent and "verbs" in inherit and parent in cf and parent not in seen:
        return B.merge_inherited(resolve(cf, own, parent, seen + (code,)), own.get(code))
    return own.get(code)


def parent_of(cf, code):
    parent, inherit = B.conf_parent(cf.get(code) or {})
    return parent if parent and "verbs" in inherit else None


def size_of(tables):
    return len(json.dumps(tables, ensure_ascii=False, separators=(",", ":")).encode())


def dump(tables):
    """verbs.json i samma stil som de befintliga filerna: indent 2, en rad per verb och tempus."""
    s = json.dumps(tables, ensure_ascii=False, indent=2)
    # listor med sex former på en rad
    return re.sub(r"\[\n\s+(\"[^\n]*\"(?:,\n\s+\"[^\n]*\")*)\n\s+\]",
                  lambda m: "[" + ", ".join(x.strip() for x in m.group(1).split(",\n")) + "]", s) + "\n"


# ---------- regelbundet eller inte ----------

def _fr_regular(base):
    st = base[:-2]
    if base.endswith("er"):
        return {"pres": [st + x for x in ("e", "es", "e", "ons", "ez", "ent")],
                "impf": [st + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "ps": [st + x for x in ("ai", "as", "a", "âmes", "âtes", "èrent")],
                "fut": [base + x for x in ("ai", "as", "a", "ons", "ez", "ont")],
                "cond": [base + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "subj": [st + x for x in ("e", "es", "e", "ions", "iez", "ent")], "pp": st + "é"}
    if base.endswith("ir"):
        return {"pres": [st + x for x in ("is", "is", "it", "issons", "issez", "issent")],
                "impf": [st + "iss" + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "ps": [st + x for x in ("is", "is", "it", "îmes", "îtes", "irent")],
                "fut": [base + x for x in ("ai", "as", "a", "ons", "ez", "ont")],
                "cond": [base + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "subj": [st + "iss" + x for x in ("e", "es", "e", "ions", "iez", "ent")], "pp": st + "i"}
    if base.endswith("re"):
        return {"pres": [st + x for x in ("s", "s", "", "ons", "ez", "ent")],
                "impf": [st + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "ps": [st + x for x in ("is", "is", "it", "îmes", "îtes", "irent")],
                "fut": [base[:-1] + x for x in ("ai", "as", "a", "ons", "ez", "ont")],
                "cond": [base[:-1] + x for x in ("ais", "ais", "ait", "ions", "iez", "aient")],
                "subj": [st + x for x in ("e", "es", "e", "ions", "iez", "ent")], "pp": st + "u"}
    return {}


def _it_regular(base):
    """Möjliga regelbundna paradigm (lista av dict), t.ex. dormire och finire (-isc-)."""
    st, end = base[:-3], base[-3:]
    fut = st + ("er" if end in ("are", "ere") else "ir")
    common = {"fut": [fut + x for x in ("ò", "ai", "à", "emo", "ete", "anno")],
              "cond": [fut + x for x in ("ei", "esti", "ebbe", "emmo", "este", "ebbero")]}
    if end == "are":
        return [dict(common, pres=[st + x for x in ("o", "i", "a", "iamo", "ate", "ano")],
                     impf=[st + x for x in ("avo", "avi", "ava", "avamo", "avate", "avano")],
                     rem=[st + x for x in ("ai", "asti", "ò", "ammo", "aste", "arono")],
                     cong=[st + x for x in ("i", "i", "i", "iamo", "iate", "ino")],
                     congimp=[st + x for x in ("assi", "assi", "asse", "assimo", "aste", "assero")], pp=st + "ato")]
    if end == "ere":
        d = dict(common, pres=[st + x for x in ("o", "i", "e", "iamo", "ete", "ono")],
                 impf=[st + x for x in ("evo", "evi", "eva", "evamo", "evate", "evano")],
                 cong=[st + x for x in ("a", "a", "a", "iamo", "iate", "ano")],
                 congimp=[st + x for x in ("essi", "essi", "esse", "essimo", "este", "essero")], pp=st + "uto")
        return [dict(d, rem=[st + x for x in ("ei", "esti", "é", "emmo", "este", "erono")]),
                dict(d, rem=[st + x for x in ("etti", "esti", "ette", "emmo", "este", "ettero")])]
    if end == "ire":
        d = dict(common, impf=[st + x for x in ("ivo", "ivi", "iva", "ivamo", "ivate", "ivano")],
                 rem=[st + x for x in ("ii", "isti", "ì", "immo", "iste", "irono")],
                 congimp=[st + x for x in ("issi", "issi", "isse", "issimo", "iste", "issero")], pp=st + "ito")
        return [dict(d, pres=[st + x for x in ("o", "i", "e", "iamo", "ite", "ono")],
                     cong=[st + x for x in ("a", "a", "a", "iamo", "iate", "ano")]),
                dict(d, pres=[st + x for x in ("isco", "isci", "isce", "iamo", "ite", "iscono")],
                     cong=[st + x for x in ("isca", "isca", "isca", "iamo", "iate", "iscano")])]
    return []


DE_INSEP = ("be", "ge", "er", "ver", "zer", "ent", "emp", "miss", "über", "unter", "hinter", "wider")


def _de_regular(base, particle):
    """Svagt verb (machen, arbeiten, wandern, lächeln) utan partikel."""
    if base.endswith(("ern", "eln")):
        st = base[:-1]
        ich = st[:-2] + st[-1] + "e" if base.endswith("eln") else st + "e"
        pres = [ich, st + "st", st + "t", base, st + "t", base]
        prt_st, ei = st + "te", False
    else:
        st = base[:-2] if base.endswith("en") else base[:-1]
        ei = bool(re.search(r"(t|d|[^aeiouäöülrh][mn]|ch[mn])$", st))
        du = st + ("est" if ei else ("t" if re.search(r"(s|ß|z|x)$", st) else "st"))
        pres = [st + "e", du, st + ("et" if ei else "t"), base, st + ("et" if ei else "t"), base]
        prt_st = st + ("ete" if ei else "te")
    prt = [prt_st, prt_st + "st", prt_st, prt_st + "n", prt_st + "t", prt_st + "n"]
    t = (st + "et") if ei else (st + "t")
    pp = t if (base.endswith("ieren") or base.startswith(DE_INSEP)) else "ge" + t
    return {"pres": pres, "prt": prt, "pp": particle + pp}


def _same(forms, reg, de=False):
    """Varje person har den regelbundna formen bland sina varianter (wandre/wandere)."""
    if not reg or len(forms) != len(reg):
        return False
    return all(r in [v.split(" ")[0] if de else v for v in f.split("/")] for f, r in zip(forms, reg))


def is_regular(lang, data, key, base, refl, tense, forms):
    """True om verbet böjs helt regelbundet i tempuset (parler, finir, vendre; machen; parlare, credere, dormire)."""
    rec = rec_of(data, base)
    if not rec:
        return False
    if lang == "fr":
        reg = _fr_regular(base)
        if tense in COMPOUND["fr"]:
            return not refl and rec.get("aux") == ["avoir"] and rec.get("pp") == reg.get("pp")
        return _same(rec.get(SIMPLE["fr"][tense], []), reg.get(SIMPLE["fr"][tense]))
    if lang == "it":
        regs = _it_regular(base)
        if tense in COMPOUND["it"]:
            return not refl and rec.get("aux") == ["avere"] and any(rec.get("pp") == r["pp"] for r in regs)
        return any(_same(rec.get(SIMPLE["it"][tense], []), r.get(SIMPLE["it"][tense])) for r in regs)
    # tyska: partikeln i delbara verb (stehe auf) räknas bort
    pres = rec.get("pres") or []
    particle = pres[0].split(" ", 1)[1] if pres and " " in first(pres[0]) else ""
    b = base[len(particle):] if particle and base.startswith(particle) else base
    reg = _de_regular(b, particle)
    if tense == "Konjunktiv I":
        return base != "sein"
    if tense == "Konjunktiv II":
        return False
    if tense == "Perfekt":
        return rec.get("aux", ["haben"])[:1] == ["haben"] and rec.get("pp") == reg["pp"]
    return _same(rec.get(SIMPLE["de"][tense], []), reg.get(SIMPLE["de"][tense]), de=True)


REGULAR_NEW = 30   # så många regelbundna verb (de vanligaste) i ett tempus som är nytt i kursen, från steg 3


def cmd_apply(args):
    cf = confs()
    codes = [c for c in cf if (LANG_DIR / c / "words.txt").exists()]
    own0 = {c: own_tables(c) for c in codes}
    own0 = {c: t for c, t in own0.items() if t is not None}
    res0 = {c: resolve(cf, own0, c) for c in codes}
    limit = (B.MAX_DATA_KB - MARGIN_KB) * 1024
    own = json.loads(json.dumps(own0))
    report, suggest = [], []

    def keys(tab, t):
        return [k for k in (((tab or {}).get("tenses") or {}).get(t) or {}) if k not in ("rule", "$remove")]

    for lang, chain in chains().items():
        data, rank = load_data(lang), freq_rank(lang)
        pos = {c: i for i, c in enumerate(chain)}
        # 1. Urvalet per kurs och tempus, kumulativt längs kedjan (före storleksgränsen)
        sel, sv, seen_t, known, acc = {}, {}, set(), {}, collections.defaultdict(list)
        for code in chain:
            step = cf.get(code, {}).get("step")
            step = step if isinstance(step, int) else 7
            r0 = res0.get(code) or {}
            for k in table_keys(r0):        # verben som redan finns i kursens verbspel är alltid relevanta
                vk = verb_key(lang, k)
                if k not in known and vk and rec_of(data, vk[1]) and (r0.get("sv") or {}).get(k):
                    known[k] = (vk[1], vk[2], r0["sv"][k])
            for k, v in course_verbs(lang, code).items():
                if k not in known and rank.get(v[0].lower(), 10 ** 6) <= rank_limit(step):
                    known[k] = v
            ordered = sorted(known.items(), key=lambda it: rank.get(it[1][0].lower(), 10 ** 6))
            tenses, _ = game_tenses(cf, code)
            sel[code] = {}
            for t in tenses:
                if t not in SIMPLE[lang] and t not in COMPOUND[lang]:
                    continue
                new_t = t not in seen_t
                def regular(k):
                    vk = verb_key(lang, k)
                    return is_regular(lang, data, k, vk[1], vk[2], t, generate(lang, data, k, vk[1], vk[2], t))
                # Det tidigare kurser i kedjan har i tempuset; från steg 3 högst REGULAR_NEW regelbundna verb
                picked, n_reg = [], 0
                for k in acc[t]:
                    if step > 2 and regular(k):
                        if n_reg >= REGULAR_NEW:
                            continue
                        n_reg += 1
                    picked.append(k)
                for k, (base, refl, gloss) in ordered:
                    if k in picked:
                        continue
                    g = generate(lang, data, k, base, refl, t)
                    if not g:
                        continue
                    if is_regular(lang, data, k, base, refl, t, g):
                        if not new_t:
                            continue
                        if step > 2:
                            if n_reg >= REGULAR_NEW:
                                continue
                            n_reg += 1
                    picked.append(k)
                    sv.setdefault(k, gloss)
                sel[code][t] = picked
                acc[t] = picked
            seen_t |= tenses
        # 2. Skriv kursernas egna tabeller, föräldrar före barn
        order, done = [], set()

        def visit(c):
            if c in done or c not in cf:
                return
            p = parent_of(cf, c)
            if p:
                visit(p)
            done.add(c)
            order.append(c)
        for c in chain:
            visit(c)
        for code in order:
            if code not in sel:
                continue
            tenses, lists = game_tenses(cf, code)
            base0 = res0.get(code) or {"tenses": {}}
            parent = parent_of(cf, code)
            mine0 = own.get(code) or {"sv": {}, "tenses": {}}
            removed_tenses = set((mine0.get("tenses") or {}).get("$remove", []))
            prio = sorted({k for t in sel[code] for k in sel[code][t]}, key=lambda k: rank.get(
                (verb_key(lang, k) or (k, k, False))[1].lower(), 10 ** 6))

            def build(allowed):
                inh = resolve(cf, own, parent) if parent else None
                inh_t = (inh or {}).get("tenses") or {}
                inh_sv = (inh or {}).get("sv") or {}
                m = json.loads(json.dumps(mine0))
                m.setdefault("sv", {})
                m.setdefault("tenses", {})
                for t, ks in sel[code].items():
                    if t in removed_tenses:
                        continue
                    o = m["tenses"].setdefault(t, {})
                    present = set(keys(inh, t)) | set(o)
                    for k in ks:
                        if k in allowed and k not in present:
                            vk = verb_key(lang, k)
                            o[k] = generate(lang, data, k, vk[1], vk[2], t)
                            if k not in inh_sv and k not in m["sv"]:
                                m["sv"][k] = sv[k]
                # Ärvda verb som lagts till i en högre kurs men inte ska finnas här (fr1/fr2 från fr, de1–de4 från
                # de): $remove. En högre kurs (fru från fr, de6 från de) behåller allt den ärver.
                lower = parent and pos.get(code, 0) < pos.get(parent, 0)
                for t in (inh_t if lower else ()):
                    if t == "$remove" or t in removed_tenses:
                        continue
                    orig = set(keys(base0, t))
                    keep = set(sel[code].get(t, [])) & allowed
                    extra = [k for k in keys(inh, t) if k not in orig and k not in keep]
                    if extra:
                        mo = m["tenses"].setdefault(t, {})
                        mo["$remove"] = mo.get("$remove", []) + [k for k in extra if k not in mo.get("$remove", [])]
                if not m["sv"]:
                    m.pop("sv")
                return m

            dfile = DIST / f"{code}.json"
            cur, old_vt = 0, 0
            if dfile.exists():     # datafilen från senaste bygget, utan de verbtabeller den byggdes med
                cur = dfile.stat().st_size
                vt = json.loads(dfile.read_text(encoding="utf-8")).get("verbTables")
                old_vt = size_of(vt) if vt else 0
            n = len(prio)
            while True:
                m = build(set(prio[:n]))
                tmp = dict(own)
                tmp[code] = m
                est = cur - old_vt + size_of(resolve(cf, tmp, code))
                if est <= limit or n == 0:
                    break
                n = max(0, n - max(1, n // 20))
            if m.get("tenses") or code in own:
                own[code] = m
            new_res = resolve(cf, own, code) or {"tenses": {}}
            before, after = table_keys(res0.get(code)), table_keys(new_res)
            per_t = {t: (len(keys(base0, t)), len(keys(new_res, t))) for t in sorted(tenses) if t in sel[code]}
            report.append((code, len(before), len(after), per_t, n < len(prio), len(prio), n, est))
            for gid, gt, lst in lists:
                extra = [k for k in after - before if k not in lst and all(k in keys(new_res, t) for t in gt)]
                if extra:
                    suggest.append((code, gid, sorted(extra, key=lambda k: prio.index(k) if k in prio else 0)))
    for code, b, a, per_t, capped, nc, n, est in report:
        print(f"{code}: {b} -> {a} verb" + (f" (storleksgräns: {n} av {nc} valda verb)" if capped else "")
              + f", uppskattad datafil {est // 1024} kB")
        print("   " + ", ".join(f"{t} {x}->{y}" for t, (x, y) in per_t.items()))
    for code, gid, extra in suggest:
        print(f"Förslag: {code} spelet {gid} har egen verblista; {len(extra)} nya verb finns i tabellerna: {', '.join(extra)}")
    if args.dry_run:
        return
    for code, m in own.items():
        if m == own0.get(code):
            continue
        (LANG_DIR / code / "verbs.json").write_text(dump(m), encoding="utf-8")
        print(f"skrev languages/{code}/verbs.json")


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    e = sub.add_parser("extract")
    e.add_argument("--kaikki", required=True, help="mapp med kaikki.org-dictionary-<Språk>-by-pos-verb.jsonl")
    e.add_argument("--cache", default="~/.cache/glosor-verbdata", help="cache för tyska Wiktionary (hjälpverb)")
    e.add_argument("--lang", nargs="*", choices=list(LANGS))
    sub.add_parser("check")
    a = sub.add_parser("apply")
    a.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)
    {"extract": cmd_extract, "check": cmd_check, "apply": cmd_apply}[args.cmd](args)


if __name__ == "__main__":
    main(sys.argv[1:])
