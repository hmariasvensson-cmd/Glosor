#!/usr/bin/env python3
"""Mäter ordtäckningen i kursernas texter: hur stor andel av de löpande orden eleven kan förväntas känna till.

    python3 tools/tackning.py                 # alla kurser, skriver docs/tackning.md
    python3 tools/tackning.py fr de4          # bara de här kurserna (skriver inte docs/tackning.md)
    python3 tools/tackning.py --visa fr r-k1  # en text med de okända orden markerade [så här]
    python3 build.py --tackning               # bygger och kör sedan verktyget

Kända ord i en kurs = orden i kursens words.txt (och book/words.txt) + alla tidigare kurser i kedjan
(nextCourse följs baklänges) + grammatikord (artiklar, pronomen, prepositioner, konjunktioner, hjälpverb)
+ bindeorden i lang.js + textens egna glosor (gloss) + namn, siffror och internationella ord.
Böjningar hanteras med en enkel lemmatisering per språk (ändelser, ge-particip, omljud, elision,
oregelbundna former ur verbtabellerna i lang.js) och tyska sammansättningar av två kända ord räknas som kända.
Namn = ord med stor bokstav mitt i meningen (på tyska: ord med stor bokstav som också står i den svenska
översättningen) och förkortningar. Internationella ord = ord som finns nästan likadant i den svenska översättningen.

Gränser (docs/nivaer.md 3.2): hörtexter minst 95 %, lästexter minst 98 %. Resultatet är en uppskattning:
lemmatiseringen är grov (kan både missa och ge för mycket), och eleven kan förstås inte alla kursens ord.
Bara Pythons standardbibliotek.
"""
import collections, json, pathlib, re, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANG_DIR = ROOT / "languages"
OUT = ROOT / "docs" / "tackning.md"
DATE = "2026-09-29"
LIMIT = {"hör": 0.95, "läs": 0.98}
LISTEN_PARTS = {"co", "hoeren", "ascolto"}
READ_PARTS = {"ce", "lesen", "lettura"}

# Grammatikord: lärs via grammatiken och står därför inte i words.txt
FUNCTION = {
    "fr": """le la les l un une des du de d au aux à a en et ou où mais donc or ni car que qu qui quoi dont lequel laquelle
        lesquels lesquelles auquel duquel ce c cet cette ces ça cela ceci celui celle ceux celles je j tu il elle on nous vous ils
        elles me m te t se s moi toi lui leur leurs eux y mon ma mes ton ta tes son sa ses notre nos votre vos le mien
        ne n pas plus jamais rien personne si oui non dans sur sous par pour avec sans chez vers entre contre pendant depuis
        avant après comme quand parce puisque lorsque lorsqu puisqu quoique jusqu jusque tout toute tous toutes quel quelle
        quels quelles est-ce être avoir aller faire il-y-a voici voilà même autre autres aucun aucune chaque très bien aussi
        là ici cent mille deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize vingt trente
        quarante cinquante soixante premier première""",
    "de": """der die das den dem des ein eine einen einem einer eines kein keine keinen keinem keiner keines ich du er sie es
        wir ihr mich dich sich uns euch mir dir ihm ihn ihnen ihm mein meine meinen meinem meiner meines dein deine deinen
        deinem deiner sein seine seinen seinem seiner seines ihre ihren ihrem ihrer ihres unser unsere unseren unserem unserer
        euer eure euren eurem eurer man und oder aber denn sondern doch dass ob weil wenn als wie wo was wer wen wem wessen
        welche welcher welches welchen welchem dieser diese dieses diesen diesem jener jene jenes in im ins an am ans auf aus
        bei beim mit nach seit von vom zu zum zur für durch gegen ohne um bis über unter vor hinter neben zwischen während wegen
        trotz nicht nichts auch noch schon so sehr ja nein nicht sein haben werden hat ist sind war waren wird wurde
        es gibt da hier dort dann zwei drei vier fünf sechs sieben acht neun zehn elf zwölf zwanzig dreißig hundert tausend
        alle alles jeder jede jedes jeden jedem sich selbst""",
    "it": """il lo la l i gli le un uno una un' del dello della dei degli delle al allo alla ai agli alle dal dallo dalla dai
        dagli dalle nel nello nella nei negli nelle sul sullo sulla sui sugli sulle col di d a ad da in con su per tra fra
        e ed o oppure ma però che chi cui quale quali perché se quando come dove mentre anche non né io tu lui lei noi voi
        loro mi ti si ci vi ne me te sé gli mio mia miei mie tuo tua tuoi tue suo sua suoi sue nostro nostra nostri nostre
        vostro vostra vostri vostre questo questa questi queste quello quella quelli quelle quel quei quegli quest quell
        essere avere fare andare stare c è sì no molto tutto tutta tutti tutte ogni due tre quattro cinque sei sette otto
        nove dieci cento mille dell dall nell sull all""",
}
# Oregelbundna former som ofta saknas i verbtabellerna
EXTRA_FORMS = {
    "fr": {"est": "être", "sont": "être", "était": "être", "été": "être", "fut": "être", "sera": "être", "serait": "être",
           "soit": "être", "a": "avoir", "ont": "avoir", "eu": "avoir", "aurait": "avoir", "ait": "avoir", "va": "aller",
           "vont": "aller", "fait": "faire", "faut": "falloir", "fallait": "falloir", "faudra": "falloir", "faudrait": "falloir",
           "peut": "pouvoir", "pu": "pouvoir", "veut": "vouloir", "voulu": "vouloir", "dû": "devoir", "doit": "devoir",
           "sait": "savoir", "su": "savoir", "vu": "voir", "voit": "voir", "mis": "mettre", "pris": "prendre", "dit": "dire",
           "écrit": "écrire", "lu": "lire", "né": "naître", "née": "naître", "nés": "naître", "mort": "mourir", "vécu": "vivre",
           "connu": "connaître", "ouvert": "ouvrir", "offert": "offrir", "reçu": "recevoir", "venu": "venir", "tenu": "tenir",
           "cru": "croire", "bu": "boire", "plu": "plaire", "suivi": "suivre", "peint": "peindre", "craint": "craindre"},
    "de": {"ist": "sein", "bin": "sein", "bist": "sein", "sind": "sein", "war": "sein", "waren": "sein", "gewesen": "sein",
           "wäre": "sein", "wären": "sein", "hat": "haben", "hatte": "haben", "hatten": "haben", "gehabt": "haben",
           "hätte": "haben", "hätten": "haben", "wird": "werden", "wurde": "werden", "wurden": "werden", "würde": "werden",
           "würden": "werden", "geworden": "werden", "worden": "werden", "gibt": "geben", "gab": "geben", "kann": "können",
           "konnte": "können", "könnte": "können", "muss": "müssen", "musste": "müssen", "will": "wollen", "wollte": "wollen",
           "darf": "dürfen", "durfte": "dürfen", "soll": "sollen", "sollte": "sollen", "mag": "mögen", "möchte": "mögen",
           "weiß": "wissen", "wusste": "wissen", "ging": "gehen", "gegangen": "gehen", "kam": "kommen", "gekommen": "kommen",
           "sah": "sehen", "stand": "stehen", "nahm": "nehmen", "genommen": "nehmen", "fand": "finden", "gefunden": "finden",
           "blieb": "bleiben", "geblieben": "bleiben", "lag": "liegen", "saß": "sitzen", "tat": "tun", "getan": "tun",
           "brachte": "bringen", "gebracht": "bringen", "dachte": "denken", "gedacht": "denken", "starb": "sterben",
           "gestorben": "sterben", "schrieb": "schreiben", "geschrieben": "schreiben", "hieß": "heißen", "fuhr": "fahren"},
    "it": {"è": "essere", "sono": "essere", "era": "essere", "erano": "essere", "stato": "essere", "stata": "essere",
           "stati": "essere", "state": "essere", "sarà": "essere", "sarebbe": "essere", "sia": "essere", "fu": "essere",
           "ho": "avere", "hai": "avere", "ha": "avere", "hanno": "avere", "aveva": "avere", "avuto": "avere", "abbia": "avere",
           "fa": "fare", "fatto": "fare", "faceva": "fare", "va": "andare", "vanno": "andare", "andato": "andare",
           "può": "potere", "deve": "dovere", "vuole": "volere", "detto": "dire", "visto": "vedere", "preso": "prendere",
           "messo": "mettere", "scritto": "scrivere", "letto": "leggere", "nato": "nascere", "nata": "nascere",
           "morto": "morire", "venuto": "venire", "rimasto": "rimanere", "vissuto": "vivere", "aperto": "aprire"},
}
FUNCTION["de"] += " können kann kannst könnt konnte konnten könnte könnten müssen muss musst müsst musste mussten müsste wollen will willst wollt wollte wollten dürfen darf darfst dürft durfte durften dürfte sollen soll sollst sollt sollte sollten mögen mag magst möchte möchtest möchten mochte"
FUNCTION["de"] += " ab pro per oh okay ok hi ah äh hm na tja"   # prepositioner och interjektioner
FUNCTION["fr"] += " ci là-bas oh ah allô ok bah euh hein"
FUNCTION["it"] += " oh ah ok beh boh eh"
AUX = {
    "fr": set("ai as a avons avez ont suis es est sommes êtes sont avais avait avions aviez avaient étais était étions étiez étaient aurai auras aura aurons aurez auront aurais aurait aurions auriez auraient serai seras sera serons serez seront serais serait serions seriez seraient aie aies ait ayons ayez aient sois soit soyons soyez soient eu été ayant étant".split()),
    "de": set("habe hast hat haben habt hatte hattest hatten hattet hätte hättest hätten bin bist ist sind seid war warst waren wart wäre wärst wären werde wirst wird werden werdet wurde wurdest wurden würde würdest würden gewesen gehabt geworden worden sei seien".split()),
    "it": set("ho hai ha abbiamo avete hanno avevo avevi aveva avevamo avevate avevano avrò avrai avrà avremo avrete avranno avrei avresti avrebbe avremmo avreste avrebbero abbia abbiano avessi avesse avuto sono sei è siamo siete ero eri era eravamo eravate erano sarò sarai sarà saremo sarete saranno sarei saresti sarebbe saremmo sareste sarebbero sia siano fossi fosse fossero stato stata stati state".split()),
}
for _l in AUX:
    FUNCTION[_l] += " " + " ".join(AUX[_l])
FUNCTION_SETS = {l: set(v.split()) for l, v in FUNCTION.items()}
ELISION = {"fr": {"l", "d", "j", "m", "t", "s", "n", "c", "qu", "jusqu", "lorsqu", "puisqu", "quoiqu", "presqu"},
           "it": {"l", "un", "d", "c", "dell", "dall", "nell", "sull", "all", "quest", "quell", "mezz", "com", "dov", "anch", "tutt", "po"}}
SUFFIXES = {
    "fr": sorted("""s x e es ée ées é és i ie is it its ies u ue us ues er ir re ons ez ent ais ait aient ions iez
        erai eras era erons erez eront erais erait erions eraient rai ras ra rons rez ront rais rait rions riez raient
        issons issez issent issais issait issaient isse issant ant ante ants antes ment ement eux euse euses ive ives if ifs
        ienne iennes ien iens elle elles aux ale ales al âmes âtes èrent a as ât""".split(), key=len, reverse=True),
    "de": sorted("""e en em er es n s st t et est te ten tet test ter ern ens nen sten""".split(), key=len, reverse=True),
    "it": sorted("""o a i e are ere ire ato ata ati ate uto uta uti ute ito ita iti ite iamo ano ono ava avo avano
        avamo evo eva evano ivo iva ivano erò erà eremo eranno erei erebbe erebbero irò irà isco isce iscono isci ando endo
        ante anti ente enti mente rsi rlo rla rli rle rne si lo la li le ne ci""".split(), key=len, reverse=True),
}
DE_PREFIXES = sorted("""ab an auf aus bei durch ein fest fort her hin los mit nach vor weg weiter zu zurück zusammen über um
    unter wieder""".split(), key=len, reverse=True)
# Räkneord (lärs via grammatiken): tjugotal, hundratal, ordningstal
NUMERAL = {
    "fr": re.compile(r"^(un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|soixante|cent|mille|et|-)+(s|ième|ièmes|aine|aines)?$"),
    "de": re.compile(r"^(ein|eins|zwei|drei|vier|fünf|sechs|sieben|sieb|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|und|zig|hundert|tausend)+(te|ten|ter|tes|tem|ste|sten|stel)?$"),
    "it": re.compile(r"^(uno|un|due|tre|tré|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti|vent|trenta|trent|quaranta|quarant|cinquanta|cinquant|sessanta|sessant|settanta|settant|ottanta|ottant|novanta|novant|cento|cent|mille|mila|milioni|milione)+(esimo|esima|esimi|esime)?$"),
}
UMLAUT = str.maketrans("äöü", "aou")
WORD_RE = re.compile(r"[^\W_]+(?:['’][^\W\d_]+)*(?:-[^\W\d_]+)*|\d+(?:[.,:]\d+)*")


def lang_of(code):
    return code[:2]


def deaccent(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


# ---------- kurser och ordlistor ----------

def read_conf(code):
    return (LANG_DIR / code / "lang.js").read_text(encoding="utf-8")


def courses():
    codes = sorted(p.name for p in LANG_DIR.iterdir() if (p / "lang.js").exists())
    nxt = {}
    for c in codes:
        m = re.search(r"^\s*nextCourse:\s*(\[[^\]]*\]|\"[^\"]*\")", read_conf(c), re.M)
        nxt[c] = re.findall(r'"([^"]+)"', m.group(1)) if m else []
    prev = collections.defaultdict(set)
    for c, ns in nxt.items():
        for n in ns:
            prev[n].add(c)

    def before(c, seen=None):
        seen = seen if seen is not None else set()
        for p in prev[c]:
            if p not in seen:
                seen.add(p)
                before(p, seen)
        return seen

    chain = {c: before(c) - {c} for c in codes}
    order = sorted(codes, key=lambda c: (lang_of(c), len(chain[c]), c))
    return order, chain


def word_files(code):
    book = LANG_DIR / code / "book"
    files = [LANG_DIR / code / "words.txt"]
    if book.exists():
        files += sorted(book.glob("words.txt")) + sorted(book.glob("*/words.txt"))
    return [f for f in files if f.exists()]


def variants(entry):
    """'die Beziehung (-en)' -> {'beziehung', 'beziehungen'}; 'habillé, -e (en)' -> {'habillé', 'habillée'} osv."""
    out = set()
    e = entry.strip()
    plural = re.search(r"\(\s*[-¨]+\s*([^\W\d_]*)\s*\)", e)
    for inner in re.findall(r"\(([^\W\d_]{4,})\)", e):   # 'je peux (pouvoir)'
        out.add(inner.lower())
    e = re.sub(r"\([^)]*\)|\[[^\]]*\]", " ", e)
    e = re.sub(r"…|\.\.\.", " ", e)
    e = e.replace("’", "'")
    parts = re.split(r"[,;]", e)
    base = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if p.startswith("-") and base:          # 'habillé, -e' och 'touchant, -e'
            out.add(base[-1] + p[1:].strip())
            continue
        for alt in p.split("/"):                 # 'le/la …', 'er/sie'
            base.append(alt.strip())
    for b in base:
        toks = [t.lower() for t in WORD_RE.findall(b)]
        toks = [t for t in toks if t not in {"sich", "qn", "qc", "qch", "etw", "jdn", "jdm", "jds", "qualcuno", "qualcosa", "qlc", "qlcu"}]
        if not toks:
            continue
        out.add(" ".join(toks))
        out.update(toks)                          # orden i en fras räknas också som kända
        out.update(p for t in toks if "'" in t for p in t.split("'"))   # l'heure -> heure
        if plural and len(toks) >= 1 and plural.group(1):
            suf = plural.group(1).lower()
            head = toks[-1]
            out.add(head + suf if len(suf) <= 3 else suf)
    return {o for o in out if o}


def load_words(code):
    words = set()
    for f in word_files(code):
        for line in f.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if not s or s.startswith("//") or s.startswith("#"):
                continue
            words |= variants(s.split("|")[0])
    return words


def load_verb_forms(lang, codes):
    """Former ur verbtabellerna i lang.js (alla kurser i språket): form -> infinitiv."""
    forms = dict(EXTRA_FORMS.get(lang, {}))
    for c in codes:
        if lang_of(c) != lang:
            continue
        for verb, body in re.findall(r"([^\W\d_]+):\s*\[((?:\s*\"[^\"]*\"\s*,?)+)\]", read_conf(c)):
            for s in re.findall(r'"([^"]*)"', body):
                toks = re.split(r"\s+", s.strip())
                for tok in re.split(r"/", toks[-1]) + (toks[:-1] if len(toks) > 1 and not (lang == "de") else []):
                    for t in {re.sub(r"\([^)]*\)", "", tok), tok.replace("(", "").replace(")", "")}:
                        t = t.strip("'’").lower()
                        if t and t not in FUNCTION_SETS[lang] and t not in AUX[lang]:
                            forms.setdefault(t, verb.lower())
    return forms


def load_connectors(code):
    m = re.search(r"^\s*connectors:\s*\[(.*?)\]", read_conf(code), re.M | re.S)
    out = set()
    if m:
        for s in re.findall(r'"([^"]*)"', m.group(1)):
            out |= variants(s)
    return out


# ---------- lemmatisering ----------

class Lexicon:
    def __init__(self, lang, known, forms):
        self.lang = lang
        self.known = set(known) | FUNCTION_SETS[lang]
        if lang == "it":                          # occuparsi -> occupare, så att occupata hittas
            self.known |= {k[:-3] + "re" for k in known if k.endswith("rsi")}
        self.forms = forms
        self.plain = {deaccent(k) for k in self.known}
        self.stems = {self.stem(k) for k in self.known if " " not in k}

    def stem(self, w):
        w = w.lower()
        if self.lang == "de":
            w = w.translate(UMLAUT)
        for suf in SUFFIXES[self.lang]:
            if w.endswith(suf) and len(w) - len(suf) >= 4:
                return w[: -len(suf)]
        return w

    def candidates(self, w):
        c = {w}
        L = self.lang
        if L == "de":
            ws = {w}
            for p in DE_PREFIXES:                # ausgewählt -> gewählt/auswählen, aufgewachsen -> gewachsen
                if w.startswith(p + "ge") and len(w) > len(p) + 5:
                    ws.add(p + w[len(p) + 2:])
                    ws.add(w[len(p):])
            for x in list(ws):
                if x.startswith("ge") and len(x) > 5:
                    ws.add(x[2:])
            for x in ws:
                c.add(x)
                c.add(x.translate(UMLAUT))
                for suf in SUFFIXES["de"]:
                    if x.endswith(suf) and len(x) - len(suf) >= 3:
                        r = x[: -len(suf)]
                        c |= {r, r.translate(UMLAUT), r + "en", r + "n", r + "e", r.translate(UMLAUT) + "en", r + "ern"}
        else:
            for suf in SUFFIXES[L]:
                if w.endswith(suf) and len(w) - len(suf) >= 2:
                    r = w[: -len(suf)]
                    c.add(r)
                    ends = ("er", "ir", "re", "e", "é", "eau", "al", "if", "eux") if L == "fr" else ("are", "ere", "ire", "o", "a", "e", "io", "co", "go")
                    c |= {r + e for e in ends}
                    if L == "it" and r.endswith("h"):
                        c |= {r[:-1] + e for e in ends}
            c |= {w + v for v in ("o", "a", "e", "i")} if L == "it" else {w + "e"}
            if L == "fr":
                c |= {re.sub(r"è(\w+)$", r"e\1", w), re.sub(r"ette?s?$", "eter", w), w.replace("ç", "c")}
        return c

    def lemma(self, w):
        """Kända lemmat för w, eller None."""
        if w in self.known:
            return w
        if w in self.forms and (self.forms[w] in self.known or self.forms[w] in FUNCTION_SETS[self.lang]):
            return self.forms[w]
        for c in self.candidates(w):
            if c in self.known:
                return c
            if c in self.forms and self.forms[c] in self.known:
                return self.forms[c]
        if deaccent(w) in self.plain:
            return w
        s = self.stem(w)
        if len(s) >= 4 and s in self.stems:
            return s
        return None

    def compound(self, w):
        """Tysk sammansättning av kända delar (Fluchtversuch, Musikschule)."""
        if self.lang != "de" or len(w) < 7:
            return False
        for i in range(3, len(w) - 2):
            head, tail = w[:i], w[i:]
            if len(tail) < 3 or not self.lemma(tail):
                continue
            for h in (head, head[:-1] if head.endswith("s") else None, head[:-1] if head.endswith("n") else None,
                      head + "e", head + "en"):
                if h and len(h) >= 3 and (self.lemma(h) or self.compound(h)):
                    return True
        return False


# ---------- texter ----------

def texts(code):
    """(typ, id, titel, [(målspråk, svenska)], glosor)"""
    d = LANG_DIR / code / "content"
    out = []

    def load(name):
        f = d / f"{name}.json"
        return json.loads(f.read_text(encoding="utf-8")) if f.exists() else None

    for name, kind in (("listening", "hör"), ("reading", "läs"), ("culture", "läs")):
        for x in load(name) or []:
            out.append((kind, name, x["id"], x.get("title", ""), [(l.get("fr", ""), l.get("sv", "")) for l in x.get("lines", [])], x.get("gloss") or {}))
    for x in load("stories") or []:
        t = re.sub(r"\[([^|\]]*)(\|[^\]]*)?\]", r"\1", x.get("text", ""))
        out.append(("läs", "stories", x["id"], x.get("title", ""), [(t, x.get("sv", ""))], x.get("gloss") or {}))
    ex = load("exam")
    if isinstance(ex, dict):
        for t in ex.get("tasks", []):
            if not t.get("lines"):
                continue
            kind = "hör" if t.get("part") in LISTEN_PARTS else "läs" if t.get("part") in READ_PARTS else None
            if kind:
                out.append((kind, "exam", t["id"], t.get("title", ""), [(l.get("fr", ""), l.get("sv", "")) for l in t["lines"]], t.get("gloss") or {}))
    return out


def intl(tok, sv_words):
    """Internationellt ord: finns nästan likadant i den svenska översättningen."""
    def norm(s):
        s = deaccent(s.lower().translate(UMLAUT))
        for a, b in (("ph", "f"), ("th", "t"), ("qu", "kv"), ("c", "k"), ("z", "s"), ("y", "i"), ("ll", "l"), ("ss", "s")):
            s = s.replace(a, b)
        return s
    n = norm(tok)
    if len(n) < 5:
        return False
    k = max(5, len(n) - 3)
    return any(len(sw) >= 5 and norm(sw)[:k] == n[:k] for sw in sv_words)


def sv_names(codes):
    """Ord med stor bokstav mitt i en svensk översättning (Berlin, Léa, DDR): namn i alla kurser."""
    names = set()
    for c in codes:
        for *_, lines, _g in texts(c):
            for _fr, sv in lines:
                for m in WORD_RE.finditer(sv):
                    w = m.group(0)
                    if w[0].isupper() and m.start() > 0 and not re.search(r"[.!?:—–\"«»]\s*$", sv[: m.start()]):
                        names.add(w)
    return names


NAMES_SV = set()


def analyse(lex, lang, lines, gloss):
    """Returnerar (antal ord, antal kända, Counter med okända ord)."""
    gl = set()
    for k, v in gloss.items():
        gl |= {x.lower() for x in WORD_RE.findall(k.replace("’", "'"))}
        gl.add(k.lower().replace("’", "'"))
        if isinstance(v, dict) and v.get("t"):
            gl |= variants(v["t"])
    gl_lex = Lexicon(lang, gl, {}) if gl else None
    total, known, unknown = 0, 0, collections.Counter()
    for fr, sv in lines:
        sv_words = set(WORD_RE.findall(sv))
        sv_lower = {w.lower() for w in sv_words}
        fr = fr.replace("’", "'").replace("«", " ").replace("»", " ")
        for m in WORD_RE.finditer(fr):
            raw = m.group(0)
            if raw[0].isdigit():
                total += 1; known += 1
                continue
            start = m.start() == 0 or re.search(r"[.!?:—–\"„“«»]\s*$", fr[: m.start()]) is not None
            pieces = [raw]
            low = raw.lower()
            if "'" in raw and low not in lex.known and low not in gl:
                pre, _, rest = raw.partition("'")
                if pre.lower() in ELISION.get(lang, ()):
                    total += 1; known += 1
                    pieces = [rest]
                else:                                   # cent'anni, quest'ermo: båda delarna prövas var för sig
                    pieces = [pre, rest]
            for piece in pieces:
                parts = [piece] if (piece.lower() in lex.known or piece.lower() in gl or "-" not in piece) else piece.split("-")
                for p in parts:
                    if not p:
                        continue
                    total += 1
                    w = p.lower()
                    cap = p[0].isupper()
                    if (len(w) == 1 or NUMERAL[lang].match(w) or lex.lemma(w) or w in gl or (gl_lex and gl_lex.lemma(w))
                            or (p.isupper() and len(p) > 1)
                            or (cap and not start and lang != "de")
                            or (cap and (p in sv_words or p in NAMES_SV))
                            or (not cap and w in sv_lower and len(w) >= 4)
                            or intl(p, sv_words)
                            or lex.compound(w)):
                        known += 1
                    elif cap and start and lang != "de" and p in sv_words:
                        known += 1
                    else:
                        unknown[w] += 1
    return total, known, unknown


# ---------- rapport ----------

def run(selected=None, write=True, show=None):
    order, chain = courses()
    codes = [c for c in order if not selected or c in selected]
    words = {c: load_words(c) for c in order}
    forms = {l: load_verb_forms(l, order) for l in FUNCTION}
    NAMES_SV.update(sv_names(order))
    results = {}
    for c in codes:
        lang = lang_of(c)
        known = set(words[c]) | load_connectors(c)
        for p in chain[c]:
            known |= words[p]
        lex = Lexicon(lang, known, forms[lang])
        rows = []
        for kind, typ, tid, title, lines, gloss in texts(c):
            if show and tid != show:
                continue
            total, k, unk = analyse(lex, lang, lines, gloss)
            if show:
                for fr, _ in lines:
                    print(re.sub(r"[^\W_]+", lambda m: f"[{m.group(0)}]" if m.group(0).lower() in unk else m.group(0), fr))
                print(f"\n{c} {tid}: {k}/{total} = {k / max(total, 1):.1%}")
            if total:
                rows.append({"kind": kind, "typ": typ, "id": tid, "title": title, "n": total, "known": k, "cov": k / total, "unk": unk})
        results[c] = {"rows": rows, "chain": sorted(chain[c], key=order.index), "nwords": len(known)}
    if show:
        return results
    report = make_report(results, order)
    if write and not selected:
        OUT.write_text(report, encoding="utf-8")
        print(f"Skrev {OUT.relative_to(ROOT)}")
    summary(results)
    return results


def pct(x):
    return f"{x * 100:.1f} %".replace(".", ",")


def mean(xs):
    return sum(xs) / len(xs) if xs else None


def summary(results):
    print(f"{'kurs':6} {'hör':>8} {'läs':>8}  under gränsen")
    for c, r in results.items():
        h = mean([x["cov"] for x in r["rows"] if x["kind"] == "hör"])
        l = mean([x["cov"] for x in r["rows"] if x["kind"] == "läs"])
        bad = sum(1 for x in r["rows"] if x["cov"] < LIMIT[x["kind"]])
        print(f"{c:6} {pct(h) if h is not None else '–':>8} {pct(l) if l is not None else '–':>8}  {bad}/{len(r['rows'])}")


NAMES = {"listening": "hörtext", "reading": "lästext", "stories": "berättelse", "culture": "kultur", "exam": "prov"}


def make_report(results, order):
    out = [f"# Ordtäckning i kursernas texter", "",
           f"Genererad {DATE} med `python3 tools/tackning.py` (eller `python3 build.py --tackning`). Skriv inte i filen för hand; kör om verktyget.", "",
           "Täckning = andel löpande ord i texten som eleven kan förväntas känna till: kursens ord + alla tidigare kurser i kedjan "
           "(`nextCourse` baklänges) + grammatikord och bindeord + textens glosor (`gloss`) + namn, siffror och internationella ord. "
           "Böjningsformer hanteras med en enkel lemmatisering (se kommentaren i `tools/tackning.py`), så siffrorna är en uppskattning. "
           "Gränserna kommer från `docs/nivaer.md` 3.2: **hörtexter minst 95 %**, **lästexter minst 98 %** (lästexter = reading, stories, culture och provets läsdel; hörtexter = listening och provets hördel).", "",
           "Observera att kursens *alla* ord räknas som kända i alla kursens texter, även ord från senare kapitel.", "",
           "## Sammanfattning", "",
           "| Kurs | Tidigare kurser | Kända lemman | Hörtexter | Medel hör | Under 95 % | Lästexter | Medel läs | Under 98 % |",
           "|---|---|---:|---:|---:|---:|---:|---:|---:|"]
    for c, r in results.items():
        H = [x for x in r["rows"] if x["kind"] == "hör"]
        R = [x for x in r["rows"] if x["kind"] == "läs"]
        mh, ml = mean([x["cov"] for x in H]), mean([x["cov"] for x in R])
        out.append(f"| {c} | {', '.join(r['chain']) or '–'} | {r['nwords']} | {len(H)} | {pct(mh) if mh is not None else '–'} | "
                   f"{sum(x['cov'] < LIMIT['hör'] for x in H)} | {len(R)} | {pct(ml) if ml is not None else '–'} | {sum(x['cov'] < LIMIT['läs'] for x in R)} |")
    out += ["", "## Ord som saknas i hela kedjan", "",
            "Okända ord som förekommer i texterna i **flera kurser** i samma språk (antal kurser, antal förekomster totalt). "
            "Oftast vanliga småord (adverb, räkneord, vardagsord) som aldrig blivit kursord. De bör läggas in i den första kursen där de förekommer.", ""]
    for lang, name in (("fr", "Franska"), ("de", "Tyska"), ("it", "Italienska")):
        where, freq, first = collections.defaultdict(set), collections.Counter(), {}
        for c, r in results.items():
            if lang_of(c) != lang:
                continue
            for x in r["rows"]:
                for w, n in x["unk"].items():
                    where[w].add(c)
                    freq[w] += n
                    first.setdefault(w, c)
        top = sorted((w for w in where if len(where[w]) >= 3), key=lambda w: (-len(where[w]), -freq[w], w))[:40]
        if top:
            out.append(f"- **{name}:** " + ", ".join(f"{w} ({len(where[w])}, {freq[w]}, först {first[w]})" for w in top))
    out += ["", "## Förslag: ord som borde bli kursord eller glosor", "",
            "Okända ord som förekommer i **flera texter** i samma kurs bör bli **kursord** (words.txt, i kapitlet där texten ligger eller tidigare). "
            "Ord som bara finns i **en text** bör bli **glosor** i den texten (`gloss`). Listan tar med ord ur texter under gränsen. "
            "Kontrollera varje förslag: en del är böjningsformer som lemmatiseringen missat, namn i början av en mening eller ord som redan finns i en fras.", ""]
    for c, r in results.items():
        bad = [x for x in r["rows"] if x["cov"] < LIMIT[x["kind"]]]
        if not bad:
            continue
        in_texts = collections.defaultdict(set)
        freq = collections.Counter()
        for x in bad:
            for w, n in x["unk"].items():
                in_texts[w].add(x["id"])
                freq[w] += n
        multi = sorted((w for w in in_texts if len(in_texts[w]) >= 2), key=lambda w: (-len(in_texts[w]), -freq[w], w))
        single = sorted((w for w in in_texts if len(in_texts[w]) == 1 and freq[w] >= 2), key=lambda w: (-freq[w], w))
        out.append(f"### {c}")
        out.append("")
        out.append("- **Kursord** (i flera texter): " + (", ".join(f"{w} ({len(in_texts[w])})" for w in multi[:40]) or "–"))
        out.append("- **Glosor** (flera gånger i en text): " + (", ".join(f"{w} ({next(iter(in_texts[w]))})" for w in single[:25]) or "–"))
        out.append("")
    out += ["## Texter under gränsen, per kurs", "",
            "Sorterade med den lägsta täckningen först. Okända ord med antal förekomster i texten.", ""]
    for c, r in results.items():
        bad = sorted((x for x in r["rows"] if x["cov"] < LIMIT[x["kind"]]), key=lambda x: x["cov"])
        out.append(f"### {c}: {len(bad)} av {len(r['rows'])} texter under gränsen")
        out.append("")
        if not bad:
            out.append("Alla texter når gränsen.")
            out.append("")
            continue
        out.append("| Text | Typ | Ord | Täckning | Vanligaste okända ord |")
        out.append("|---|---|---:|---:|---|")
        for x in bad:
            unk = ", ".join(f"{w}" + (f" ×{n}" if n > 1 else "") for w, n in x["unk"].most_common(8))
            title = x["title"].replace("|", "/")
            out.append(f"| `{x['id']}` {title} | {NAMES[x['typ']]} ({x['kind']}) | {x['n']} | {pct(x['cov'])} | {unk} |")
        out.append("")
    return "\n".join(out) + "\n"


def main(argv):
    args = [a for a in argv if not a.startswith("--")]
    if "--visa" in argv and len(args) == 2:
        run({args[0]}, write=False, show=args[1])
        return
    run(set(args) or None, write=not args)


if __name__ == "__main__":
    main(sys.argv[1:])
