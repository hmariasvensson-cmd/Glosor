#!/usr/bin/env python3
"""Hämtar extra exempelmeningar från Tatoeba (CC BY 2.0 FR) till languages/<kod>/content/tatoeba.json.

    python3 tools/tatoeba.py de1 de2 de3 de4 de de6     # en eller flera kurser
    python3 tools/tatoeba.py --lang de                  # alla kurser på tyska (de*), likadant fr och it
    python3 tools/tatoeba.py --new fr                   # börja om (annars behålls meningar som redan finns)

Språket tas från kurskoden (fr*, de*, it*). Skriptet laddar ned Tatoebas exportfiler per språk
(meningar och länkar till svenska, direkt eller via engelska) till en cachemapp (`--cache`, standard
~/.cache/glosor-tatoeba; filer äldre än 30 dagar hämtas om) och söker sedan lokalt.

Per ord i words.txt väljs upp till tre korta meningar (4–12 ord) som innehåller ordet, även böjt
(t.ex. "die Beziehung (-en)" → Beziehung, Beziehungen; "aufwachsen" → wächst … auf, aufgewachsen; starka
verbformer tas ur kommentaren "Starkt verb: wuchs auf, ist aufgewachsen"). Meningar med en direkt svensk
översättning går före sådana som bara är översatta via engelska. Samma mening används bara en gång per kurs.
Litterära tempus (passé simple), gammal stavning (daß) och Tatoebas massinlagda namn hoppas över.
Id och användarnamn sparas för källhänvisningen. Meningar som redan finns i filen behålls först i listan
(deras index ingår i fråge-id "<ord-id>#<n>").

Matchningen (skärpt 2026-10-01, BACKLOG "tatoeba.py matchar för löst"):
  - tyska delbara verb måste ha partikeln: sammanskriven (aufwachsen, aufgewachsen, aufzuwachsen) eller som eget ord
    sist i satsen (wuchs … auf). Starka former ur kommentaren (rief zurück → rief) räknas bara med partikeln, så att
    zurückrufen inte matchar "rief mich an".
  - tyska substantiv bara med stor bokstav. Först i meningen är stor bokstav tvetydig: en böjd form vars små form
    finns som eget ord i meningarna (Leider ≠ das Leid) räknas inte, och inte heller grundformen när nästa ord visar att
    det är ett verb ("Sage mir" ≠ die Sage). Substantiv som är homografer med olika genus (die/das Steuer, der/die
    See …: HOMOGRAPHS och ord som står med två genus i språkets ordlistor) får inga meningar.
  - franska reflexiva verb (s'appeler) kräver ett reflexivt pronomen före verbet (me, te, se, nous nous …) eller
    efter i imperativ (appelle-toi). Substantiv räknas inte efter ett subjektspronomen (je cours ≠ le cours), och en
    pluralform inte efter en bestämning i singular (le cours ≠ la cour). Verb räknas inte efter en bestämning (un
    cours ≠ courir). Verb på -ir, -re och -oir bara med verbändelser (partir ≠ partout).
  - italienska verb bara med verbets ändelser (och påhängda pronomen), inte valfri fortsättning (salutare ≠ salute,
    pesare ≠ pesce).

Granskade filer körs inte om: rättade översättningar och borttagna meningar skulle skrivas över. I stället:

    python3 tools/tatoeba.py --check --lang de          # listar meningar som inte längre matchar sitt ord
    python3 tools/tatoeba.py --check --fix fr fr1 fr2   # och tar bort dem

--fix byter en felkopplad mening mot null i listan i stället för att ta bort den, så att de andra meningarnas index
(fråge-id "<ord-id>#<n>" i elevernas S.dc, S.od, S.tr och sparade rundor) inte flyttas och deras framsteg stannar på rätt
mening. Appen hoppar över null (rebuildWords i 00-common.js), och verktyget fyller aldrig en sådan plats igen: nya meningar
läggs sist. Övriga meningar (och granskarnas rättade översättningar) lämnas orörda.
"""
import argparse, bz2, collections, functools, json, pathlib, re, sys, time, unicodedata, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
LANG3 = {"fr": "fra", "de": "deu", "it": "ita"}
BASE = "https://downloads.tatoeba.org/exports/per_language/"
MAX_PER_WORD, MIN_WORDS, MAX_WORDS = 3, 4, 12
# Namn som nästan bara förekommer i Tatoebas massinlagda övningsmeningar, och litterära inledningar
SKIP = re.compile(r"\b(ziri|rima|yanni|skura|mennad|baya|sami|layla|taninna|nuja|ghanima|mary|au commencement)\b")
PASSE_SIMPLE = re.compile(r"\b\w+(âmes|îmes|ûmes|âtes|îtes|ûtes|èrent)\b|\b(fut|furent|eut|eurent|fit|firent|vint|vinrent|dit-il)\b", re.I)
OLD_DE = re.compile(r"\b(daß|muß|mußt|laß|läßt|Schluß|Kuß|Fluß|Paß|bißchen|Geschoß|Photo\w*)\b")
# Svordomar, sex, våld och droger passar inte i en skolapp (kontrolleras på båda språken)
RUDE = re.compile(r"\b(arschloch\w*|schei(ss|ß)\w*|verdammt\w*|fick\w*|hure\w*|schlampe|töte\w*|getötet|umbringen|umgebracht|mord\w*|ermord\w*|leiche\w*|"
                  r"merde|putain|connard\w*|salope|bordel|foutre|encul\w*|tuer|tué|tuée|meurtr\w*|cadavre|"
                  r"cazz\w*|merda|stronz\w*|puttan\w*|vaffanculo|uccid\w*|ucciso|omicid\w*|"
                  r"clitoris|sexe|sexy|sexuel\w*|sexuell\w*|sessual\w*|droge\w*|drogue\w*|drog(a|he)|suicid\w*|selbstmord|nackt\w*|nue|nues|nud[oaie])\b")
RUDE_SV = re.compile(r"\b(fan|jävla|jävlar|helvete\w*|skit\w*|knull\w*|hora|horor|döda|dödade|dödat|mörda\w*|mord\w*|självmord|lik|liket|naken|nakna|sexig|sexuell\w*|droger\w*)\b")
# Passato remoto och congiuntivo imperfetto är för svåra för nybörjarkurserna
IT_HARD = re.compile(r"\b\w+(assi|asse|assimo|assero|essero|isse|issi|issimo|issero|arono|erono|irono)\b|\b(?!però\b|può\b|ciò\b|perciò\b)\w*[^\Wr]ò\b|"
                     r"\b(mise|misero|chiese|chiesero|disse|dissero|fece|fecero|ebbe|ebbero|venne|vennero|prese|presero|vide|videro|stette|"
                     r"diede|nacque|rispose|scrisse|lesse|volle|seppe|cadde|corse|decise|pianse|rimase|scese|tenne|visse|fu|furono)\b", re.I)
FILTER = {"fr": PASSE_SIMPLE, "de": OLD_DE, "it": IT_HARD}
ARTICLES = {
    "fr": r"((le|la|les|un|une|des|du|se)\s+|(l|s)['’])",
    "de": r"((der|die|das|ein|eine|sich)\s+)",
    "it": r"((il|lo|la|i|gli|le|un|uno|una)\s+|(l|un)['’])",
}
PLACEHOLDERS = {"qn", "qc", "qch", "qqn", "qqch", "jdn", "jdm", "jds", "etw",
                "jemanden", "jemandem", "jemands", "jemand", "etwas", "qualcuno", "qualcosa", "qc", "qlcu", "qlco", "sb", "sth"}
DE_SEP = ("zurück", "zusammen", "heraus", "herein", "hinaus", "vorbei", "weiter", "fest", "fern", "heim", "hin", "her",
          "los", "mit", "nach", "vor", "weg", "zu", "auf", "aus", "ab", "an", "ein", "bei", "statt", "teil", "dar", "fort")
DE_END = ["", "e", "en", "n", "er", "es", "s", "ern", "em", "ens", "st", "t", "et", "est", "te", "ten", "tet", "test",
          "ere", "eren", "erer", "eres", "erem", "ste", "sten", "ster", "stes", "stem"]
UML = str.maketrans({"a": "ä", "o": "ö", "u": "ü"})
# Ord som inte går att skilja från en homograf i en mening (olika genus eller betydelse). De får inga Tatoeba-meningar.
HOMOGRAPHS = {
    "de": {"steuer", "leiter", "see", "band", "kiefer", "tor", "gehalt", "erbe", "golf", "heide", "mark", "moment", "schild",
           "verdienst", "flur", "hut", "weise", "taube", "kunde", "messer", "bund", "pony", "single", "teil", "bauer", "otter"},
    "fr": {"audition", "livre", "tour", "poste", "mode", "manche", "voile", "somme", "moule", "page", "mémoire", "vase", "critique"},
    "it": {"pesca", "ancora", "fine", "capitale"},
}
# Nästa ord efter en versal form först i meningen som visar att den är ett verb ("Sage mir …")
DE_AFTER_VERB = {"mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen", "mich", "dich", "ich", "du", "er", "es", "wir", "nicht", "mal", "bitte", "doch"}
FR_SUBJ = {"je", "j", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "ne", "n"}
FR_REFL = {"me", "m", "te", "t", "se", "s"}
FR_SG_DET = {"le", "un", "du", "au", "ce", "cet", "mon", "ton", "son", "notre", "votre", "leur", "chaque", "quel", "la", "une", "cette", "ma", "ta", "sa", "quelle"}
FR_DET = {"un", "une", "des", "du", "au", "aux", "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "cet", "cette", "ces",
          "notre", "votre", "nos", "vos", "leurs", "chaque", "quelques", "plusieurs"}
FR_IR = {"", "s", "t", "e", "es", "ent", "ons", "ez", "is", "it", "issons", "issez", "issent", "isse", "isses", "issions", "issiez",
         "issais", "issait", "issaient", "issant", "ais", "ait", "aient", "ions", "iez", "rai", "ras", "ra", "rons", "rez", "ront",
         "rais", "rait", "rions", "riez", "raient", "i", "ie", "ies", "ite", "ites", "u", "ue", "us", "ues", "ant", "ir", "re", "oir",
         "irai", "iras", "ira", "irons", "irez", "iront", "irais", "irait", "irions", "iriez", "iraient", "is", "it", "îmes", "îtes"}
IT_CLITIC = ("", "lo", "la", "li", "le", "ne", "si", "mi", "ti", "ci", "vi", "gli", "glielo", "gliela", "glieli", "gliele", "gliene", "melo", "mela", "telo", "tela", "selo", "sela", "cela", "celo")
IT_END = {
    "are": ["o", "i", "a", "iamo", "ate", "ano", "avo", "avi", "ava", "avamo", "avate", "avano", "ero", "erai", "era", "eremo", "erete",
            "eranno", "erei", "eresti", "erebbe", "eremmo", "ereste", "erebbero", "ai", "asti", "o", "ammo", "aste", "arono", "iate", "ino",
            "assi", "asse", "assimo", "assero", "ato", "ata", "ati", "ate", "ando", "are", "ar", "iamoci"],
    "ere": ["o", "i", "e", "iamo", "ete", "ono", "evo", "evi", "eva", "evamo", "evate", "evano", "ero", "erai", "era", "eremo", "erete",
            "eranno", "erei", "eresti", "erebbe", "eremmo", "ereste", "erebbero", "ei", "etti", "esti", "ette", "emmo", "este", "erono",
            "ettero", "a", "iate", "ano", "essi", "esse", "essimo", "essero", "uto", "uta", "uti", "ute", "endo", "ere", "er",
            "go", "ga", "gono", "gano", "iuto", "iuta", "iuti", "iute", "rò", "rai", "rà", "remo", "rete", "ranno", "rei", "resti", "rebbe", "remmo", "reste", "rebbero"],
    "ire": ["o", "i", "e", "iamo", "ite", "ono", "isco", "isci", "isce", "iscono", "isca", "iscano", "ivo", "ivi", "iva", "ivamo", "ivate",
            "ivano", "iro", "irai", "ira", "iremo", "irete", "iranno", "irei", "iresti", "irebbe", "iremmo", "ireste", "irebbero", "ii",
            "isti", "immo", "iste", "irono", "a", "iate", "ano", "issi", "isse", "issimo", "issero", "ito", "ita", "iti", "ite", "endo",
            "ire", "ir", "go", "ga", "gono", "gano"],
}


def fold(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


def tokens(s):
    return re.findall(r"[^\W\d_]+", s.lower())


# ---------- Tatoebas exportfiler ----------

def fetch(cache, name):
    path = cache / name.split("/")[-1]
    if not path.exists() or time.time() - path.stat().st_mtime > 30 * 86400:
        print("hämtar", name)
        req = urllib.request.Request(BASE + name, headers={"User-Agent": "Glosor/1.0"})
        with urllib.request.urlopen(req, timeout=300) as r:
            path.write_bytes(r.read())
    return path


def rows(path):
    with bz2.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n").split("\t")


def load_pairs(lang, cache):
    """[(id, text, user, [svenska översättningar], direkt)] för alla meningar på språket med svensk översättning."""
    l3 = LANG3[lang]
    direct = collections.defaultdict(list)
    for a, b in rows(fetch(cache, f"{l3}/{l3}-swe_links.tsv.bz2")):
        direct[int(a)].append(int(b))
    eng_swe = collections.defaultdict(list)
    for a, b in rows(fetch(cache, "eng/eng-swe_links.tsv.bz2")):
        eng_swe[int(a)].append(int(b))
    indirect = collections.defaultdict(list)
    for a, b in rows(fetch(cache, f"{l3}/{l3}-eng_links.tsv.bz2")):
        if int(b) in eng_swe:
            indirect[int(a)] += eng_swe[int(b)]
    swe = {}
    for r in rows(fetch(cache, "swe/swe_sentences_detailed.tsv.bz2")):
        swe[int(r[0])] = r[2].strip()
    out = []
    for r in rows(fetch(cache, f"{l3}/{l3}_sentences_detailed.tsv.bz2")):
        sid = int(r[0])
        if sid not in direct and sid not in indirect:
            continue
        d = [swe[i] for i in direct.get(sid, []) if i in swe]
        sv = d or [swe[i] for i in dict.fromkeys(indirect.get(sid, [])) if i in swe]
        if sv:
            out.append((sid, r[2].strip(), r[3] if len(r) > 3 and r[3] != "\\N" else "", sv, bool(d)))
    return out


# ---------- Ordformer ----------

def plural_forms(word, spec):
    """'(-en)' → Beziehungen, '(¨-e)' → Städte, '(-räder)' → Fahrräder, '(Äpfel)' → Äpfel."""
    spec = spec.strip()
    if not spec or " " in spec:
        return []
    if not spec.startswith(("-", "¨")):
        return [spec] if spec[0].isupper() else []
    uml, suf = "¨" in spec, spec.replace("¨", "").lstrip("-")
    if not suf:
        return [word.translate(UML) if uml else word]
    if len(suf) <= 3 and suf in ("e", "en", "n", "er", "s", "nen", "se", "ne"):
        w = word
        if uml:
            m = list(re.finditer(r"au|[aou]", w))
            if m:
                i = m[-1].start()
                w = w[:i] + w[i].translate(UML) + w[i + 1:]
        return [w + suf]
    fw, c = fold(word), fold(suf)[0]
    cand = [i for i in range(len(word)) if fw[i] == c]
    if not cand:
        return []
    i = min(cand, key=lambda i: abs(len(word) - i - len(suf)))
    return [word[:i] + suf]


def parse_word(lang, fields):
    """(lista av token-matchare, extra former) för ett ord-id."""
    wid = fields[0]
    comment = fields[5] if len(fields) > 5 else ""
    extra, t = set(), wid
    if lang == "de":
        for m in re.finditer(r"\(([^)]*)\)", wid):
            head = re.sub(r"\(.*?\)", "", wid).split(",")[0].split()
            if head:
                extra.update(x.lower() for x in plural_forms(head[-1], m.group(1)))
        m = re.search(r"(?:Starkt|Oregelbundet|Blandat)[^:]*verb:\s*([^.;]*)", comment)
        if m:
            for part in m.group(1).split(","):
                ws = [w for w in tokens(part) if w not in ("hat", "ist", "sich", "er", "sie", "es")]
                extra.update(w for w in ws if len(w) > 2 and w not in DE_SEP)
        m = re.search(r"Plural(?:en)?(?: är)?:?\s*(?:die\s+)?([A-ZÄÖÜ][\wäöüß]+)", comment)
        if m:
            extra.add(m.group(1).lower())
    refl = lang == "fr" and bool(re.match(r"(se\s+|s['’])", wid, re.I))
    if lang == "fr" and "," in wid:   # "sûr, -e" → sûre, "chanteur, chanteuse" → chanteuse
        head, fem = [x.strip() for x in re.sub(r"\(.*?\)", "", wid).split(",")[:2]]
        head = re.sub(r"^" + ARTICLES[lang], "", head, flags=re.I).split()
        if head and fem.startswith("-"):
            suf = fem[1:]
            w = head[-1].lower()
            extra.add(w + suf if suf in ("e", "le", "ne", "te") else (w[:max(0, len(w) - len(suf) + 1)] + suf if len(suf) > 1 else w + suf))
        elif head and fem:
            extra.add(fem.split()[-1].lower())
    t = re.sub(r"\(.*?\)", "", t)
    t = re.split(r",|/|;", t)[0].strip()
    t = re.sub(r"^" + ARTICLES[lang], "", t, flags=re.I).strip()
    t = re.sub(r"\.\.\.|…", " ", t)
    rawt = re.findall(r"[^\W\d_]+", t)
    toks = [x for x in tokens(t) if x not in PLACEHOLDERS] or tokens(t)
    if not toks:
        return None
    caps = {x.lower(): x[:1].isupper() and i > 0 for i, x in enumerate(rawt)}
    if len(toks) == 1 and rawt and rawt[0][:1].isupper():
        caps[toks[0]] = True
    caps["\0refl"] = refl   # franska reflexiva verb (s'appeler): pronomenet krävs, se fr_context
    return toks, extra, caps


DE_NOUN = ("", "e", "en", "n", "er", "s", "es", "ern", "ens", "nen", "se", "ses")
DE_VERB = ("", "e", "st", "t", "et", "est", "en", "n", "te", "test", "ten", "tet", "tes")
DE_ADJ = ("", "e", "en", "er", "es", "em", "ere", "eren", "erer", "eres", "erem", "ste", "sten", "ster", "stes", "stem", "st")


def umlaut(s):
    m = list(re.finditer(r"au|[aou]", s))
    return s[:m[-1].start()] + s[m[-1].start()].translate(UML) + s[m[-1].start() + 1:] if m else s


def de_sep(q):
    """Partikeln i ett delbart verb (aufwachsen → auf), annars None."""
    return next((p for p in DE_SEP if q.startswith(p) and len(q) - len(p) >= 4), None)


def de_match(q, raw, idx, st, extra, noun, fin=None):
    """Tyska (utan att vika bort omljud): substantiv med stor bokstav och pluralen ur ord-id:t, verb med
    personändelser, perfekt particip, zu-infinitiv, omljud/e→i i presens, starka former ur kommentaren och
    delbara verb (wächst … auf); övriga ord med adjektivändelser."""
    q, tok = q.lower(), raw.lower()
    cap = raw[:1].isupper() and idx > 0
    if noun:
        if not raw[:1].isupper():
            return False
        plain = tok == q or any(tok == x + e for x in extra for e in ("", "n", "s"))
        if not plain and not any(tok == q + e for e in (DE_NOUN if len(q) > 3 else ("",))):
            return False
        # En böjd form som också finns som eget ord med liten bokstav (Leider) är inte substantivet,
        # och först i meningen visar nästa ord om grundformen är ett verb ("Sage mir")
        if not plain and tok in LOWER["de"]:   # Leider ≠ das Leid, Kochen ≠ der Koch
            return False
        if idx == 0 and tok in LOWER["de"] and len(st) > 1 and st[1] in DE_AFTER_VERB:
            return False
        return True
    if cap:
        return False
    fin = fin or [False] * len(st)
    sep = de_sep(q)
    # Partikeln sist i satsen efter ordet (wuchs … auf), inte en preposition mitt i satsen
    later = lambda p: any(st[j] == p and fin[j] for j in range(idx + 1, len(st)))
    if any(tok == q + e for e in DE_ADJ):
        return True
    for x in extra:   # starka former ur kommentaren: utan partikel (rief) bara med partikeln senare i satsen
        if any(tok == x + e for e in DE_VERB) and (not sep or x.startswith(sep) or later(sep)):
            return True
    stems = set()
    if q.endswith("en") and len(q) > 4:
        stems.add(q[:-2])
    elif q.endswith(("eln", "ern")) and len(q) > 4:
        stems.add(q[:-1])
    for s in stems:
        if any(tok == s + e for e in DE_VERB):
            return True
        if tok.startswith(("ge" + s, "zu" + s)) and tok[len(s) + 2:] in ("t", "et", "en", "te", "ten", "ter", "tes", "tem", "ene", "enen", "ener"):
            return True
        if tok.startswith(s) and tok[len(s):] in ("te", "tet", "ten") and s[:2] in ("be", "ve", "er", "en", "ze", "ge", "mi", "em"):
            return True
        alt = {umlaut(s)} | {s[:i] + r + s[i + 1:] for i in [s.rfind("e")] if i > 0 for r in ("i", "ie")}
        if any(tok == a + e for a in alt - {s} for e in ("", "st", "t")):
            return True
    for p in DE_SEP:
        if q.startswith(p) and len(q) - len(p) >= 4:
            rest = q[len(p):]
            sub_extra = {x[len(p):] for x in extra if x.startswith(p)} | {x for x in extra if not x.startswith(p)}
            if tok.startswith(p) and de_match(rest, tok[len(p):], 0, st, sub_extra, False):
                return True
            if tok.startswith(p + "zu") and de_match(rest, tok[len(p) + 2:], 0, st, set(), False):
                return True
            if later(p) and de_match(rest, raw, idx, st, sub_extra, False, fin):
                return True
    return False


FR_ER = {"e", "es", "ent", "ons", "ez", "ais", "ait", "aient", "ions", "iez", "e", "ee", "es", "ees", "ant", "er", "erai", "eras",
         "era", "erons", "erez", "eront", "erais", "erait", "erions", "eriez", "eraient", "a", "ai", "as", "ea", "eons", "eant", "eais", "eait",
         "eaient", "ea", "le", "les", "lent", "te", "tes", "tent"}


FR_IR_F = {fold(e) for e in FR_IR}
# De vanligaste oregelbundna verben (avoir faim, faire les courses …)
FR_IRREG = {
    "avoir": "ai as a avons avez ont avais avait avions aviez avaient aurai auras aura aurons aurez auront aurais aurait aurions auriez auraient eu eue eus eues aie aies ait ayons ayez aient ayant",
    "être": "suis es est sommes êtes sont étais était étions étiez étaient serai seras sera serons serez seront serais serait serions seriez seraient été sois soit soyons soyez soient étant",
    "faire": "fais fait faisons faites font faisais faisait faisions faisiez faisaient ferai feras fera ferons ferez feront ferais ferait ferions feriez feraient faite faits faites fasse fasses fassions fassiez fassent faisant",
    "aller": "vais vas va allons allez vont allais allait allions alliez allaient irai iras ira irons irez iront irais irait irions iriez iraient allé allée allés allées aille ailles aillent allant",
}
FR_IRREG = {k: set(v.split()) for k, v in FR_IRREG.items()}
FR_SKIP = {"en", "y", "ne", "n", "pas", "plus", "jamais", "bien", "déjà", "toujours", "vraiment", "rien"} | FR_IRREG["être"]


@functools.lru_cache(maxsize=None)
def after_hyphen(sent):
    """För varje ord: står det direkt efter ett bindestreck (inversion: parlait-elle, êtes-vous)?"""
    return [m.start() > 0 and sent[m.start() - 1] == "-" for m in re.finditer(r"[^\W\d_]+", sent)]


def fr_context(st, j, q, noun, refl, first, how, hyph):
    """Sammanhanget runt en träff i franskan: reflexivt pronomen för s'appeler, inget subjektspronomen före ett
    substantiv (je cours ≠ le cours), ingen bestämning i singular före en pluralform (le cours ≠ la cour) och ingen
    bestämning före ett verb (un cours ≠ courir)."""
    prev = st[j - 1] if j else ""
    if noun:
        if first and prev in FR_SUBJ and not hyph[j - 1]:   # "je cours", men inte inversionen "parlait-elle suédois"
            return False
        if st[j] in (q + "s", q + "x", q[:-2] + "aux") and st[j] != q and prev in FR_SG_DET:   # le cours ≠ la cour
            return False
        return True
    if first and how == "verb" and prev in FR_DET:   # un interprète ≠ interpréter
        return False
    if refl and first:
        k = j - 1
        while k >= 0 and st[k] in FR_SKIP and not (st[k] in ("nous", "vous")):   # s'est cassé, me suis réveillé, t'es bien amusé
            k -= 1
        before = st[k] if k >= 0 else ""
        if before in FR_REFL:
            return True
        if before in ("nous", "vous"):
            # nous nous levons, ne vous fâchez pas, êtes-vous brossé, vous devez vous détendre (infinitiv)
            if k >= 1 and (st[k - 1] in ("nous", "vous", "ne", "n", "à", "de", "pour") or st[k - 1] in FR_IRREG["être"] or st[j] == q):
                return True
            return False
        if j + 1 < len(st) and st[j + 1] in ("toi", "vous", "nous", "moi"):
            return True
        # Particip efter être (tu es fâché, j'ai été séparé): samma betydelse, räknas inte som felkopplat
        if prev in FR_IRREG["être"] and re.search(r"(é|ée|és|ées|i|ie|is|ies|u|ue|us|ues)$", st[j]):
            return True
        return False
    return True


def fr_match(q, tok, noun, extra):
    """Franska: verb (-er, -ir, -re, -oir) på stammen, utan accenter (préfère/préférons); substantiv och
    adjektiv bara med plural- och femininformer och med accenterna kvar (été ≠ êtes)."""
    if tok == q:
        return "form"
    if not noun:
        fq, ft = fold(q), fold(tok)
        if tok in FR_IRREG.get(q, ()):
            return "verb"
        if q.endswith("er") and len(q) >= 5:   # -er-verben: bara verbets egna ändelser (saluer ≠ salut)
            st = fq[:-2]
            if len(st) >= 3 and ft.startswith(st) and ft[len(st):] in FR_ER:
                return "verb"
        for end in ("oir", "ir", "re"):   # bara verbändelser (partir ≠ partout)
            if q.endswith(end) and len(q) >= 5 and q not in FR_IRREG:
                st = fq[:-len(end)]
                if len(st) >= 3 and ft.startswith(st) and ft[len(st):] in FR_IR_F:
                    return "verb"
    forms = {q + "s", q + "x"} | {f + e for f in extra for e in ("", "s")}   # femininum bara när ord-id:t anger det ("sûr, -e")
    if q.endswith("al"):
        forms.add(q[:-2] + "aux")
    return "form" if tok in forms else None


IT_END_F = {k: {fold(e) for e in v} for k, v in IT_END.items()}


def it_match(q, tok, noun):
    """Italienska: verb (-are, -ere, -ire, -rsi) på stammen; substantiv och adjektiv med genus- och
    pluraländelser (amico → amici, amica → amiche); övriga ord (tal, adverb) bara precis så."""
    if tok == q:
        return True
    if not noun:   # bara verbets ändelser, med påhängda pronomen (salutare ≠ salute, pesare ≠ pesce)
        fq, ft = fold(q), fold(tok)
        for end in ("arsi", "ersi", "irsi", "are", "ere", "ire"):
            if q.endswith(end) and len(q) >= 5:
                st, conj = fq[:-len(end)], end.replace("rsi", "re")
                # cercare → cerchi, mangiare → mangi, mangerò
                stems = {st} | ({st + "h"} if st.endswith(("c", "g")) else set()) | ({st[:-1]} if st.endswith("i") and conj == "are" else set())
                if len(st) >= 3 and st.endswith("i") and ft == st:   # mangi, scegli
                    return True
                for x in stems:
                    if len(x) >= 3 and ft.startswith(x):
                        r = ft[len(x):]
                        if any(r.endswith(c) and r[:len(r) - len(c)] in IT_END_F[conj] for c in IT_CLITIC):
                            return True
        if q.endswith("rre") and len(q) >= 5:   # porre, tradurre: oregelbundna, stammen räcker
            st = fq[:-3]
            if len(st) >= 3 and ft.startswith(st) and len(ft) - len(st) <= 7:
                return True
    if len(q) < 4 or q[-1] not in "aeio" or (not noun and q[-1] in "ai"):
        return False
    s, v = q[:-1], q[-1]
    forms = {"o": {s + "a", s + "i", s + "e"}, "a": {s + "e", s + "i", s + "o"}, "e": {s + "i"}, "i": {s + "o", s + "e", s + "a"}}[v]
    if s.endswith(("c", "g")):
        forms |= {s + "hi", s + "he"}
    if s.endswith("i") and v in "oa":
        forms |= {s[:-1] + "i", s[:-1] + "e"}
    if s.endswith(("ch", "gh")) and v in "ie":
        forms |= {s[:-1] + "o", s[:-1] + "a"}
    return tok in forms


@functools.lru_cache(maxsize=None)
def split(sent):
    raw = re.findall(r"[^\W\d_]+", sent)
    return raw, [t.lower() for t in raw]


@functools.lru_cache(maxsize=None)
def clause_end(sent):
    """För varje ord: står det sist i satsen (före . , ! ? ; : eller sist i meningen)? För tyskans partiklar (wuchs … auf)."""
    out = []
    for m in re.finditer(r"[^\W\d_]+", sent):
        rest = sent[m.end():].lstrip()
        out.append(not rest or rest[0] in ".,!?;:–—\"»)…" or bool(re.match(r"(und|oder|aber|sondern|denn|wie|als)\b", rest)))
    return out


# Små former som används som egna ord (leider, sage, …): en versal form först i meningen kan vara en av dem.
# Fylls av main() med alla meningar i språket (exportfilerna, eller tatoeba.json och kursernas texter med --check).
LOWER = collections.defaultdict(set)


def lower_words(lang, sentences):
    for sent in sentences:
        raw, st = split(sent)
        LOWER[lang].update(t for r, t in zip(raw[1:], st[1:]) if r[:1].islower())


def contains(lang, parsed, sent, noun=False):
    qtoks, extra, raw_q = parsed
    raw, st = split(sent)
    exact = lambda q, j: q == st[j]
    if lang == "de":
        fin = clause_end(sent)
        def m(q, j):
            n = noun if len(qtoks) == 1 else raw_q.get(q, False)
            return de_match(q, raw[j], j, st, extra if len(qtoks) == 1 or q == qtoks[-1] else set(), n, fin)
    elif lang == "fr":
        refl, hyph = raw_q.get("\0refl", False), after_hyphen(sent)
        def m(q, j):
            how = fr_match(q, st[j], noun, extra if q == qtoks[0] else set())
            return bool(how) and fr_context(st, j, q, noun, refl, q == qtoks[0], how, hyph)
    else:
        m = lambda q, j: it_match(q, st[j], noun)
    # Korta ord i fraser (de, à, in …) måste stå precis så; längre får böjas. Ordningen gäller, med högst
    # två ord emellan (i tyskan, där verbet ofta står sist, sex).
    gap = 6 if lang == "de" else 2
    def at(i, k):
        if k == len(qtoks):
            return True
        q = qtoks[k]
        f = exact if len(q) < 4 and len(qtoks) > 1 else m
        for j in range(i, min(len(st), i + gap + 1) if k else len(st)):
            if f(q, j) and at(j + 1, k + 1):
                return True
        return False
    if at(0, 0):
        return True
    if lang == "de" and len(qtoks) > 1:   # "Sorgen machen" → "Ich mache mir Sorgen"
        return all(any((exact if len(q) < 4 else m)(q, j) for j in range(len(st))) for q in qtoks)
    return False


# ---------- Urval ----------

def head_noun(lang, wid):
    """Substantivets grundform utan artikel och parentes, med små bokstäver (die Steuer (-n) → steuer), annars None."""
    m = re.match(r"^" + ARTICLES[lang], wid, re.I)
    if not m or wid[:m.end()].strip().lower() in ("se", "sich", "s'", "s’"):
        return None
    t = re.split(r",|/|;|\(", wid[m.end():])[0].split()
    return t[0].lower() if len(t) == 1 else None


@functools.lru_cache(maxsize=None)
def homographs(lang):
    """HOMOGRAPHS och substantiv som står med olika genus i språkets ordlistor (alla kurser)."""
    genders = collections.defaultdict(set)
    for d in (ROOT / "languages").iterdir():
        f = d / "words.txt"
        if d.name[:2] != lang or not f.exists():
            continue
        for ln in f.read_text(encoding="utf-8").splitlines():
            x = ln.split("|")
            if len(x) > 2 and not ln.startswith(("#", "//")) and x[2].strip() in ("m", "f", "n"):
                h = head_noun(lang, x[0])
                if h:
                    genders[h].add(x[2].strip())
    return HOMOGRAPHS.get(lang, set()) | ({h for h, g in genders.items() if len(g) > 1} if lang == "de" else set())


def is_homograph(lang, fields):
    h = head_noun(lang, fields[0]) or (fields[0].lower() if len(fields[0].split()) == 1 else None)
    return h in homographs(lang)


def is_noun(fields, parsed):
    return (len(fields) > 2 and fields[2].strip() != "" or parsed[2].get(parsed[0][0], False)
            or bool(re.match(r"(le|la|les|l'|il|lo|gli|i|der|die|das)\b", fields[0])))

def pick(lang, words, pairs, old):
    KEY = 2 if lang == "de" else 3   # tyskans e→i (geben → gibt) ändrar tredje bokstaven
    by_tok = collections.defaultdict(list)
    for p in pairs:
        for t in set(tokens(p[1])):
            by_tok[fold(t)[:KEY]].append(p)
    bad = FILTER.get(lang)
    used, out = set(), {}
    for fields in words:
        wid = fields[0]
        for x in old.get(wid, []):
            if x:
                used.add(x["id"])
    for fields in words:
        wid = fields[0]
        # Befintliga meningar behålls på sina platser, även null (borttagna med --check --fix): indexen är fråge-id
        keep = list(old.get(wid, []))
        live = lambda: sum(1 for x in keep if x)
        parsed = parse_word(lang, fields)
        if parsed is None or live() >= MAX_PER_WORD or is_homograph(lang, fields):
            if keep:
                out[wid] = keep
            continue
        noun = is_noun(fields, parsed)
        ex = fold(fields[3].replace("[", "").replace("]", "")) if len(fields) > 3 else ""
        q0 = fold(parsed[0][0]) if len(parsed[0][0]) >= 3 else None
        keys = {q0[:KEY]} | {fold(x)[:KEY] for x in parsed[1]} if q0 else None
        if lang == "de" and q0:
            keys |= {"ge", "zu"} | {q0[len(p):len(p) + KEY] for p in DE_SEP if q0.startswith(p)}
        cand = {p[0]: p for k in keys for p in by_tok.get(k, [])}.values() if keys else pairs
        good = []
        for sid, text, user, sv, direct in cand:
            n = len(text.split())
            if sid in used or not MIN_WORDS <= n <= MAX_WORDS or fold(text) == ex:
                continue
            if any(ch in text for ch in "[]|<>{}") or SKIP.search(fold(text)) or RUDE.search(text.lower()) or (bad and bad.search(text)):
                continue
            if not contains(lang, parsed, text, noun):
                continue
            svt = min(sv, key=len)
            if RUDE_SV.search(svt.lower()):
                continue
            if len(svt.split()) > 2 * MAX_WORDS:
                continue
            exact = any(t in split(text)[1] for t in parsed[0] if len(t) >= 3)   # ordet precis som i ordlistan går först
            good.append(((not direct, not exact, bool(re.search(r"\bTom\b", text)), abs(n - 7), sid), sid, text, user, svt))
        good.sort()
        for _, sid, text, user, svt in good:
            if live() >= MAX_PER_WORD:
                break
            if any(similar(text, x["t"]) for x in keep if x):   # "Ich habe ein paar Stifte." / "Er hat ein paar Stifte."
                continue
            keep.append({"t": text, "sv": svt, "id": sid, "by": user})
            used.add(sid)
        if keep:
            out[wid] = keep
    return out


def similar(a, b):
    a, b = set(tokens(a)), set(tokens(b))
    return len(a & b) / max(1, len(a | b)) >= 0.4


def read_words(code, music=False):
    """Orden i words.txt, utom musikteorin (ord som si, sol och piano betyder där något annat än i vardagsmeningar)."""
    out, skip = [], False
    for l in (ROOT / "languages" / code / "words.txt").read_text(encoding="utf-8").splitlines():
        if l.startswith("#"):
            skip = "Musikteori" in l and not music
        elif l.strip() and not l.startswith("//") and not skip:
            out.append(l.split("|"))
    return out


def check(code, fix=False):
    """Meningar i tatoeba.json som inte matchar sitt ord med den nuvarande matchningen (eller hör till en homograf,
    eller till ett ord som inte längre finns). Med fix byts de mot null (indexen i fråge-id "<ord-id>#<n>" behålls)."""
    lang = code[:2]
    dest = ROOT / "languages" / code / "content" / "tatoeba.json"
    if not dest.exists():
        return 0, 0
    data = json.loads(dest.read_text(encoding="utf-8"))
    words = {f[0]: f for f in read_words(code, music=True)}
    bad = 0
    for wid, lst in data.items():
        fields = words.get(wid)
        parsed = parse_word(lang, fields) if fields else None
        for i, x in enumerate(lst):
            if not x:
                continue
            why = ("ordet finns inte i words.txt" if not fields
                   else "olämplig" if RUDE.search(x["t"].lower()) or RUDE_SV.search(x.get("sv", "").lower())
                   else "" if parsed and contains(lang, parsed, x["t"], is_noun(fields, parsed)) else "matchar inte")
            if not why and is_homograph(lang, fields):
                # Homografer går inte att skilja automatiskt (die Weise/der Weise): listas för handgranskning, tas inte bort
                print(f"{code}\t{wid}#{i}\thomograf, kontrollera för hand\t{x['t']}")
                continue
            if why:
                bad += 1
                print(f"{code}\t{wid}#{i}\t{why}\t{x['t']}")
                if fix:
                    lst[i] = None
    if fix and bad:
        dest.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return bad, sum(1 for v in data.values() for x in v if x)


def course_sentences(lang):
    """Alla meningar på språket i kursernas tatoeba.json, texter och exempel (för LOWER utan exportfilerna)."""
    out = []
    def walk(x, key=None):
        if isinstance(x, dict):
            for k, v in x.items():
                walk(v, k)
        elif isinstance(x, list):
            for v in x:
                walk(v, key)
        elif isinstance(x, str) and key in ("t", "fr", "text", "model"):
            out.append(x)
    for d in (ROOT / "languages").iterdir():
        if d.name[:2] != lang:
            continue
        for f in (d / "content").glob("*.json"):
            walk(json.loads(f.read_text(encoding="utf-8")))
        if (d / "words.txt").exists():
            out += [ln.split("|")[3].replace("[", "").replace("]", "") for ln in (d / "words.txt").read_text(encoding="utf-8").splitlines() if ln.count("|") >= 4 and not ln.startswith(("#", "//"))]
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("courses", nargs="*", help="kurskoder, t.ex. fr de1 it2")
    ap.add_argument("--lang", choices=sorted(LANG3), help="alla kurser på språket")
    ap.add_argument("--new", action="store_true", help="kasta meningar som redan finns i tatoeba.json")
    ap.add_argument("--cache", default=str(pathlib.Path.home() / ".cache" / "glosor-tatoeba"))
    ap.add_argument("--check", action="store_true", help="hämtar inget: listar meningar i tatoeba.json som inte matchar sitt ord")
    ap.add_argument("--fix", action="store_true", help="med --check: byt de felkopplade meningarna mot null")
    a = ap.parse_args()
    courses = list(a.courses)
    if a.lang:
        courses += sorted(p.name for p in (ROOT / "languages").iterdir() if p.name.startswith(a.lang) and (p / "words.txt").exists())
    if not courses:
        ap.error("ange minst en kurs eller --lang")
    if a.check:
        for lang in dict.fromkeys(c[:2] for c in courses):
            lower_words(lang, course_sentences(lang))
        for code in dict.fromkeys(courses):
            if code[:2] in LANG3:
                bad, left = check(code, a.fix)
                print(f"# {code}: {bad} felkopplade" + (" (borttagna, null)" if a.fix and bad else "") + f", {left} kvar", file=sys.stderr)
        return
    cache = pathlib.Path(a.cache).expanduser()
    cache.mkdir(parents=True, exist_ok=True)
    pairs = {}
    for code in dict.fromkeys(courses):
        lang = code[:2]
        if lang not in LANG3:
            print("okänt språk:", code)
            continue
        if lang not in pairs:
            pairs[lang] = load_pairs(lang, cache)
            lower_words(lang, (p[1] for p in pairs[lang]))
            print(f"{lang}: {len(pairs[lang])} meningar med svensk översättning")
        dest = ROOT / "languages" / code / "content" / "tatoeba.json"
        old = {} if a.new or not dest.exists() else json.loads(dest.read_text(encoding="utf-8"))
        words = read_words(code)
        out = pick(lang, words, pairs[lang], old)
        ids = {l.split("|")[0] for l in (ROOT / "languages" / code / "words.txt").read_text(encoding="utf-8").splitlines()}
        out.update({k: v for k, v in old.items() if k not in out and k in ids})   # t.ex. musikteorin: behåll det som finns
        dest.parent.mkdir(exist_ok=True)
        dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{code}: {sum(len(v) for v in out.values())} meningar till {len(out)} av {len(words)} ord i {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
