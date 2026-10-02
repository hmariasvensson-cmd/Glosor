#!/usr/bin/env python3
"""Mäter ordtäckningen i kursernas texter: hur stor andel av de löpande orden eleven kan förväntas känna till.

    python3 tools/tackning.py                 # alla kurser, skriver docs/tackning.md
    python3 tools/tackning.py fr de4          # bara de här kurserna (skriver inte docs/tackning.md)
    python3 tools/tackning.py --visa fr r-k1  # en text med de okända orden markerade [så här]
    python3 build.py --tackning               # bygger och kör sedan verktyget

Kända ord i en kurs = orden i kursens words.txt (och book/words.txt) + alla tidigare kurser i kedjan
(nextCourse följs baklänges) + grammatikord (artiklar, pronomen, prepositioner, konjunktioner, hjälpverb)
+ bindeorden i lang.js (med arv: extends/inherit och {$append}) + textens egna glosor (gloss; bara i hör-, läs- och
kulturtexter, där appen visar dem, inte i berättelser och prov) + namn, siffror och internationella ord.
Böjningar hanteras med en enkel lemmatisering per språk (ändelser, ge-particip, omljud, elision,
oregelbundna former ur verbtabellerna i lang.js, languages/<kod>/verbs.json och datafilens verbTables) och tyska
sammansättningar av två kända ord räknas som kända. Oregelbundna former: tyska starka verb baklänges via avljud
(getrunken, geschienen, verloren, gilt, rief, sprich), superlativ (schönste) och en lista (beste, mehr, nimm);
franska oregelbundna stammar (appris, promis, savais, voyait, suffit, connaissais, pourrait); italienska passato
remoto (parlò, prese, scrisse, fu), enklitiska pronomen (vederti, fermarmi, dimmi), -issimo, oregelbundet futurum
(vorrei, verrò), stamväxling (riesco, tiene) och oregelbunden plural (uomini, uova). Dessutom (Lexicon.other_form,
bara när grundformen finns exakt bland de kända orden): tyska zu-infinitiv av delbara verb (anzubieten, festzuhalten),
feminina på -in/-innen av kända substantiv (Mitarbeiterin, Kollegin, Stadtplanerin) och komparativ (größeren, ärmere,
teurer); franska och italienska feminina (chanteuse, entière, actuelle, attrice, studentessa). Tyska relativ- och
demonstrativpronomen (dessen, diejenigen, derselbe) och pronominaladverb (dafür, woran) är grammatikord, och elisionen
täcker fler former (quelqu'un, gliel'ho, senz'altro). Ett italienskt ord i words.txt som
qualcosa/qualcuno räknas som känt även när det står i en fras.
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
DATE = "2026-10-02"
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
EXTRA_FORMS["de"].update({"beste": "gut", "besten": "gut", "bester": "gut", "bestes": "gut", "besser": "gut", "bessere": "gut",
    "besseren": "gut", "meisten": "viel", "meiste": "viel", "mehr": "viel", "lieber": "gern", "liebsten": "gern",
    "höher": "hoch", "höchste": "hoch", "höchsten": "hoch", "nächste": "nah", "nächsten": "nah", "näher": "nah",
    "nimm": "nehmen", "gib": "geben", "iss": "essen", "lies": "lesen", "sieh": "sehen", "hilf": "helfen", "sprich": "sprechen",
    "wirf": "werfen", "vergiss": "vergessen", "tritt": "treten", "ging": "gehen", "gingen": "gehen", "stand": "stehen",
    "standen": "stehen", "tat": "tun", "taten": "tun", "brachte": "bringen", "brachten": "bringen", "wusste": "wissen",
    "wussten": "wissen", "gewusst": "wissen", "kannte": "kennen", "gekannt": "kennen", "nannte": "nennen", "genannt": "nennen",
    "rannte": "rennen", "gerannt": "rennen", "dachte": "denken", "dachten": "denken", "gesessen": "sitzen", "saßen": "sitzen",
    "hingen": "hängen", "hing": "hängen", "gezogen": "ziehen", "zog": "ziehen", "zogen": "ziehen", "erschrak": "erschrecken"})
EXTRA_FORMS["fr"].update({"meilleur": "bon", "meilleure": "bon", "meilleurs": "bon", "meilleures": "bon", "mieux": "bien",
    "pire": "mauvais", "moindre": "petit", "sois": "être", "soyez": "être", "soyons": "être", "aie": "avoir", "ayez": "avoir",
    "sache": "savoir", "sachez": "savoir", "veuillez": "vouloir", "va": "aller", "vas": "aller", "allons": "aller",
    "fut": "être", "furent": "être", "eut": "avoir", "eurent": "avoir", "fit": "faire", "firent": "faire", "vint": "venir",
    "vinrent": "venir", "dut": "devoir", "put": "pouvoir", "sut": "savoir", "vit": "voir", "virent": "voir", "prit": "prendre",
    "mit": "mettre", "naquit": "naître", "mourut": "mourir", "vécut": "vivre", "connut": "connaître", "voulut": "vouloir"})
EXTRA_FORMS["it"].update({
    # passato remoto (oregelbundet)
    "fu": "essere", "furono": "essere", "fui": "essere", "fosti": "essere", "ebbe": "avere", "ebbero": "avere", "ebbi": "avere",
    "fece": "fare", "fecero": "fare", "feci": "fare", "disse": "dire", "dissero": "dire", "dissi": "dire", "vide": "vedere",
    "videro": "vedere", "vidi": "vedere", "venne": "venire", "vennero": "venire", "venni": "venire", "nacque": "nascere",
    "nacquero": "nascere", "nacqui": "nascere", "diede": "dare", "diedero": "dare", "dette": "dare", "detti": "dare",
    "stette": "stare", "stettero": "stare", "volle": "volere", "vollero": "volere", "seppe": "sapere", "seppero": "sapere",
    "conobbe": "conoscere", "conobbero": "conoscere", "conobbi": "conoscere", "piacque": "piacere", "piacquero": "piacere",
    "tenne": "tenere", "tennero": "tenere", "ruppe": "rompere", "cadde": "cadere", "caddero": "cadere", "morì": "morire",
    "morirono": "morire", "bevve": "bere", "apparve": "apparire", "divenne": "divenire", "rimase": "rimanere",
    "rimasero": "rimanere", "mise": "mettere", "misero": "mettere", "misi": "mettere", "trasse": "trarre", "condusse": "condurre",
    "produsse": "produrre", "tradusse": "tradurre", "introdusse": "introdurre", "scelse": "scegliere", "scelsero": "scegliere",
    "tolse": "togliere", "raccolse": "raccogliere", "accolse": "accogliere", "mosse": "muovere", "nacque": "nascere",
    "crebbe": "crescere", "crebbero": "crescere", "cresciuto": "crescere", "cresciuta": "crescere", "piovve": "piovere",
    "visse": "vivere", "vissero": "vivere", "vinse": "vincere", "vinsero": "vincere", "pianse": "piangere", "spense": "spegnere",
    "giunse": "giungere", "giunsero": "giungere", "raggiunse": "raggiungere", "dipinse": "dipingere", "spinse": "spingere",
    # oregelbundna particip och former
    "bevuto": "bere", "beve": "bere", "bevo": "bere", "bevono": "bere", "chiesto": "chiedere", "risposto": "rispondere",
    "deciso": "decidere", "successo": "succedere", "scelto": "scegliere", "tolto": "togliere", "corso": "correre",
    "perso": "perdere", "offerto": "offrire", "sofferto": "soffrire", "coperto": "coprire", "scoperto": "scoprire",
    "vinto": "vincere", "spento": "spegnere", "acceso": "accendere", "chiuso": "chiudere", "sceso": "scendere",
    "speso": "spendere", "reso": "rendere", "rotto": "rompere", "tradotto": "tradurre", "prodotto": "produrre",
    "condotto": "condurre", "dipinto": "dipingere", "giunto": "giungere", "raggiunto": "raggiungere", "mosso": "muovere",
    "nascosto": "nascondere", "posto": "porre", "proposto": "proporre", "composto": "comporre", "esposto": "esporre",
    "discusso": "discutere", "espresso": "esprimere", "compreso": "comprendere", "sorpreso": "sorprendere", "diviso": "dividere",
    "ucciso": "uccidere", "vale": "valere", "valgono": "valere", "valso": "valere", "parso": "parere", "pare": "parere",
    "dimmi": "dire", "dammi": "dare", "fammi": "fare", "dillo": "dire", "fallo": "fare", "vattene": "andare", "stammi": "stare",
    "dai": "dare", "dà": "dare", "danno": "dare", "stai": "stare", "sta": "stare", "stanno": "stare",
    # oregelbunden plural och komparation
    "uomini": "uomo", "uova": "uovo", "dita": "dito", "mani": "mano", "braccia": "braccio", "ginocchia": "ginocchio",
    "labbra": "labbro", "ossa": "osso", "paia": "paio", "mura": "muro", "lenzuola": "lenzuolo", "centinaia": "centinaio",
    "migliaia": "migliaio", "dei": "dio", "buoi": "bue", "ali": "ala", "armi": "arma", "templi": "tempio",
    "migliore": "buono", "migliori": "buono", "ottimo": "buono", "ottima": "buono", "ottimi": "buono", "meglio": "bene",
    "peggiore": "cattivo", "peggio": "male", "maggiore": "grande", "maggiori": "grande", "massimo": "grande",
    "minore": "piccolo", "minori": "piccolo", "minimo": "piccolo", "pessimo": "cattivo"})

FUNCTION["de"] += " können kann kannst könnt konnte konnten könnte könnten müssen muss musst müsst musste mussten müsste wollen will willst wollt wollte wollten dürfen darf darfst dürft durfte durften dürfte sollen soll sollst sollt sollte sollten mögen mag magst möchte möchtest möchten mochte"
FUNCTION["de"] += " ab pro per oh okay ok hi ah äh hm na tja"   # prepositioner och interjektioner
# Relativ- och demonstrativpronomen, obestämda pronomen och pronominaladverb (da-/wo-/hin-/her-): grammatikord (2026-10-02)
FUNCTION["de"] += """ dessen deren denen derer derjenige diejenige dasjenige diejenigen derjenigen denjenigen demjenigen desjenigen
    derselbe dieselbe dasselbe dieselben denselben demselben derselben desselben jemand jemanden jemandem niemand niemanden
    niemandem irgendwer irgendwas irgendwo irgendwie irgendwann irgendein irgendeine irgendeinen irgendeinem irgendeiner
    solch solche solcher solches solchen solchem manch manche mancher manches manchen manchem beide beiden beides einander
    dabei dafür dagegen daher dahin damit danach daneben daran darauf daraus darin darüber darum darunter davon davor dazu
    dazwischen dadurch dran drauf draus drin drum hierher hinein heraus herum herein hinaus hinauf dar wobei wofür wogegen
    woher wohin womit wonach woran worauf woraus worin worüber worum wovon wozu wodurch andere anderen anderer anderes anderem"""
FUNCTION["it"] += " primo prima primi prime secondo seconda terzo terza quarto quarta quinto quinta sesto sesta settimo ottavo nono decimo"
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
ELISION = {"fr": {"l", "d", "j", "m", "t", "s", "n", "c", "qu", "jusqu", "lorsqu", "puisqu", "quoiqu", "presqu", "quelqu", "entr"},
           "it": {"l", "un", "d", "c", "dell", "dall", "nell", "sull", "all", "quest", "quell", "mezz", "com", "dov", "anch", "tutt", "po",
                  "coll", "dev", "senz", "cos", "v", "m", "t", "s", "n", "ch", "quand", "bell", "grand", "quant", "nessun", "ciascun",
                  "buon", "gliel", "sant"}}
# Feminina och former med annan ändelse än grundformen (ändelse i texten, ändelse i words.txt), efter att plural-s tagits bort.
# Räknas bara när grundformen finns exakt bland de kända orden (2026-10-02).
FEM = {
    "fr": [("euse", "eur"), ("euse", "eux"), ("rice", "eur"), ("ère", "er"), ("elle", "el"), ("elle", "eau"), ("eille", "eil"),
           ("onne", "on"), ("enne", "en"), ("ive", "if"), ("ouse", "oux"), ("ousse", "oux"), ("ouce", "oux"),
           ("ieille", "ieux"), ("olle", "ou"), ("anche", "anc"), ("aîche", "ais"), ("èche", "ec"), ("ongue", "ong"),
           ("ecque", "ec"), ("ique", "ic"), ("aux", "al"), ("eaux", "eau")],   # inte -ette/-et (navette, cachette) eller -ille/-il
    "it": [("trice", "tore"), ("trici", "tori"), ("trici", "tore"), ("essa", "e"), ("esse", "e"), ("essa", "a"), ("esse", "a")],
}
# Tyska: zu-infinitiv av delbara verb (anzubieten -> anbieten), komparativ (größeren -> groß) och feminina på -in/-innen
DE_ZU = sorted("""ab an auf aus bei dar durch ein fest fort her hin los mit nach vor weg weiter zu zurück zusammen um wieder
    kennen statt teil frei dran heraus herum hinein vorbei zurecht wiederher""".split(), key=len, reverse=True)
DE_COMP = sorted("er ere eren erem erer eres".split(), key=len, reverse=True)
SUFFIXES = {
    "fr": sorted("""s x e es ée ées é és i ie is it its ies u ue us ues er ir re ons ez ent ais ait aient ions iez
        erai eras era erons erez eront erais erait erions eraient rai ras ra rons rez ront rais rait rions riez raient
        issons issez issent issais issait issaient isse issant ant ante ants antes ment ement eux euse euses ive ives if ifs
        ienne iennes ien iens elle elles aux ale ales al âmes âtes èrent a as ât""".split(), key=len, reverse=True),
    "de": sorted("""e en em er es n s st t et est te ten tet test ter ern ens nen sten ste ster stes stem este esten ester estem""".split(), key=len, reverse=True),
    "it": sorted("""o a i e are ere ire ato ata ati ate uto uta uti ute ito ita iti ite iamo ano ono ava avo avano
        avamo evo eva evano ivo iva ivano erò erà eremo eranno erei erebbe erebbero irò irà isco isce iscono isci ando endo
        ante anti ente enti mente rsi rlo rla rli rle rne si lo la li le ne ci ò ì ai asti ammo aste arono ei é
        ete ii etti ette erono ettero isti immo iste irono issimo issima issimi issime errò errà errebbe errebbero""".split(), key=len, reverse=True),
}
DE_PREFIXES = sorted("""ab an auf aus bei durch ein fest fort her hin los mit nach vor weg weiter zu zurück zusammen über um
    unter wieder""".split(), key=len, reverse=True)
# Räkneord (lärs via grammatiken): tjugotal, hundratal, ordningstal
NUMERAL = {
    "fr": re.compile(r"^(un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|soixante|cent|mille|et|-|quatr|cinqu|neuv|onz|douz|treiz|quatorz|quinz|seiz|trent|quarant|cinquant|soixant)+(s|ième|ièmes|aine|aines)?$"),
    "de": re.compile(r"^(ein|eins|zwei|drei|vier|fünf|sechs|sieben|sieb|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|und|zig|hundert|tausend|sech|dritt|erst|siebt)+(te|ten|ter|tes|tem|ste|sten|stel|er|erjahre|erjahren)?$"),
    "it": re.compile(r"^(uno|un|due|tre|tré|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti|vent|trenta|trent|quaranta|quarant|cinquanta|cinquant|sessanta|sessant|settanta|settant|ottanta|ottant|novanta|novant|cento|cent|mille|mila|milioni|milione|undic|dodic|tredic|quattordic|quindic|sedic|diciassett|diciott|diciannov)+(esimo|esima|esimi|esime)?$"),
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
        toks = [t for t in toks if t not in {"sich", "qn", "qc", "qch", "etw", "jdn", "jdm", "jds", "qlc", "qlcu", "qc.", "qd"}]
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


def load_nouns(code):
    """Tyska substantiv i words.txt (der/die/das …): grundformen för -in/-innen (Mitarbeiterin) och inte för komparativ."""
    out = set()
    for f in word_files(code):
        for line in f.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(der|die|das)\s+([^\W\d_]+)", line.split("|")[0])
            if m:
                out.add(m.group(2).lower())
    return out


def _add_forms(forms, lang, verb, strings):
    for s in strings:
        if not isinstance(s, str):
            continue
        toks = re.split(r"\s+", s.strip())
        for tok in re.split(r"/", toks[-1]) + (toks[:-1] if len(toks) > 1 and not (lang == "de") else []):
            for t in {re.sub(r"\([^)]*\)", "", tok), tok.replace("(", "").replace(")", "")}:
                t = t.strip("'’!?.,").lower()
                if "'" in t:                             # j'ai, l'ho, m'hai: bara delen efter apostrofen
                    t = t.split("'")[-1]
                if t and t not in FUNCTION_SETS[lang] and t not in AUX[lang]:
                    forms.setdefault(t, verb.lower())
        if lang == "de" and len(toks) > 1:              # 'rufe an', 'bin gefahren': även sista ordet före partikeln
            t = toks[-2].strip("'’!?.,").lower()
            if toks[-1].lower() in DE_PARTICLES and t not in AUX[lang]:
                forms.setdefault(t, verb.lower())


DE_PARTICLES = {"ab", "an", "auf", "aus", "bei", "ein", "fest", "fort", "her", "hin", "los", "mit", "nach", "vor", "weg",
                "weiter", "zu", "zurück", "zusammen", "um", "wieder", "kennen", "statt", "teil"}


def verb_tables(code):
    """Verbtabellerna för en kurs: languages/<kod>/verbs.json och datafilens verbTables (dist/data/<kod>.json)."""
    out = []
    f = LANG_DIR / code / "verbs.json"
    if f.exists():
        out.append(json.loads(f.read_text(encoding="utf-8")))
    d = ROOT / "dist" / "data" / f"{code}.json"
    if d.exists():
        try:
            vt = json.loads(d.read_text(encoding="utf-8")).get("verbTables")
            if isinstance(vt, dict):
                out.append(vt)
        except (ValueError, OSError):
            pass
    return out


def load_verb_forms(lang, codes):
    """Former ur verbtabellerna (lang.js, verbs.json och datafilens verbTables, alla kurser i språket): form -> infinitiv."""
    forms = dict(EXTRA_FORMS.get(lang, {}))
    for c in codes:
        if lang_of(c) != lang:
            continue
        for verb, body in re.findall(r"([^\W\d_]+):\s*\[((?:\s*\"[^\"]*\"\s*,?)+)\]", read_conf(c)):
            _add_forms(forms, lang, verb, re.findall(r'"([^"]*)"', body))
        for vt in verb_tables(c):
            for tense in (vt.get("tenses") or {}).values():
                if not isinstance(tense, dict):
                    continue
                for verb, fl in tense.items():
                    if isinstance(fl, list) and re.fullmatch(r"[^\W\d_]+(?:[ -][^\W\d_]+)*", verb):
                        _add_forms(forms, lang, verb.split()[-1] if lang != "de" else verb.split()[0], fl)
    return forms


def _conf_list(conf, field):
    """Listan i fältet (även {$append: [...]}) och om den ska läggas till förälderns (True) eller ersätta den."""
    m = re.search(r"^\s*" + field + r":\s*(\{\s*\$append:\s*)?\[(.*?)\]", conf, re.M | re.S)
    if not m:
        return None, False
    return re.findall(r'"([^"]*)"', m.group(2)), bool(m.group(1))


def load_verbs(code):
    """Verb i words.txt: ett ord med liten bokstav som slutar på -en/-n (tyska), -er/-ir/-re (franska), -are/-ere/-ire (italienska)."""
    ends = {"de": ("en", "ern", "eln"), "fr": ("er", "ir", "re", "oir"), "it": ("are", "ere", "ire", "rre", "arsi", "ersi", "irsi")}[lang_of(code)]
    out = set()
    for f in word_files(code):
        for line in f.read_text(encoding="utf-8").splitlines():
            e = line.split("|")[0].strip()
            e = re.sub(r"^(sich|se|s'|si)\s+", "", re.sub(r"\([^)]*\)", "", e)).strip()
            if re.fullmatch(r"[a-zäöüßàâçéèêëîïôûùœ]+", e) and e.endswith(ends):
                out.add(e)
    return out


def load_connectors(code, seen=None):
    """Bindeorden i lang.js, med arv: extends + inherit: ["connectors"] och {$append: [...]}."""
    seen = seen or set()
    seen.add(code)
    conf = read_conf(code)
    own, append = _conf_list(conf, "connectors")
    out = set()
    ext = re.search(r'^\s*extends:\s*"([^"]+)"', conf, re.M)
    inh = re.search(r"^\s*inherit:\s*\[([^\]]*)\]", conf, re.M)
    if ext and inh and '"connectors"' in inh.group(1) and (own is None or append) and ext.group(1) not in seen \
            and (LANG_DIR / ext.group(1) / "lang.js").exists():
        out |= load_connectors(ext.group(1), seen)
    for s in own or []:
        out |= variants(s)
    return out



# ---------- oregelbundna former: kandidater utöver ändelserna ----------

VOW = "aeiouäöü"
# Omvänd avljudsserie: vokalen i particip/preteritum/presens -> vokalen i infinitiven
DE_ABLAUT = {"u": ["i", "a", "ei"], "o": ["e", "ie", "ü", "i", "ö"], "ie": ["ei", "a", "u", "au", "e"], "i": ["e", "ei", "a", "ie"],
             "a": ["e", "i", "ie", "o"], "ä": ["a"], "ü": ["u"], "e": ["e"], "a_": ["a"], "ei": ["ei"], "au": ["au"]}
DE_INSEP = ("be", "ver", "ent", "er", "zer", "emp", "miss")


def de_strong(w):
    """Tyska starka former: getrunken -> trinken, geschienen -> scheinen, sprich -> sprechen, verloren -> verlieren,
    gilt -> gelten, begann -> beginnen, bekam -> bekommen, rief -> rufen. Ger (prefix, infinitiv-kandidat).
    Bara particip (ge-…-en), former med oskiljbart prefix och enstaviga former (preteritum, imperativ, presens du/er)."""
    bases = {("", w)}
    for p in DE_PREFIXES + list(DE_INSEP):
        if w.startswith(p) and len(w) - len(p) >= 3:
            bases.add((p, w[len(p):]))
    out = set()
    for p, x in bases:
        part = x.startswith("ge") and x.endswith("en") and len(x) > 5
        if part:
            x = x[2:]
        elif p == "" and len(re.findall("[" + VOW + "]+", re.sub("(en|e|st|t)$", "", x))) != 1:
            continue                                   # utan prefix: bara enstaviga stammar (rief, gilt, trug, sprich)
        stems = {x}
        if part or p:
            for suf in ("en", "n", "e", "t", "st", "est", "et", "te", "ten"):
                if x.endswith(suf) and len(x) - len(suf) >= 2:
                    stems.add(x[: -len(suf)])
        else:                                          # enstavig form: vilka vokaler som passar med ändelsen
            for suf in ("en", "t", "st", "est"):
                if x.endswith(suf) and len(x) - len(suf) >= 2:
                    stems.add((x[: -len(suf)], suf))
            stems = {(y, "") if isinstance(y, str) else y for y in stems}
        for st in stems:
            if isinstance(st, tuple):
                st, suf = st
                m = re.search(r"([" + VOW + r"]+)[^" + VOW + r"]*$", st)
                if not m or (suf == "en" and m.group(1) not in ("a", "ie", "o", "u", "i")) or \
                        (suf in ("t", "st", "est") and m.group(1) not in ("i", "ie", "ä")):
                    continue
            m = re.search(r"([" + VOW + r"]+)([^" + VOW + r"]*)$", st)
            if not m or len(re.findall("[" + VOW + "]+", st)) != 1 and not p:
                continue
            head, v, cons = st[: m.start()], m.group(1), m.group(2)
            for nv in DE_ABLAUT.get(v, []) + ([v] if part or p else []):
                conss = {cons, cons.replace("ß", "ss"), cons.replace("ss", "ß")}
                if nv in ("ei", "ie") and len(cons) == 2 and cons[0] == cons[1]:
                    conss.add(cons[0])                 # geritten -> reiten, gegriffen -> greifen
                if nv in ("ei", "ie") and cons.endswith("tt"):
                    conss.add(cons[:-2] + "d")         # geschnitten -> schneiden
                if nv in ("e", "o") and len(cons) == 1:
                    conss.add(cons + cons)             # kam -> kommen
                if cons.startswith("h") and nv == "e":
                    conss.add(cons[1:])                # nahm -> nehmen
                if v == "ie" and cons.endswith("h") and nv == "e":
                    conss.add(cons)                    # sieht -> sehen, empfiehlt -> empfehlen
                for c2 in conss:
                    base = head + nv + c2
                    out |= {(p, base + "en"), (p, base + "n")}
    return out


FR_STEMS = [("pris", "prendre"), ("prise", "prendre"), ("pren", "prendre"), ("prenn", "prendre"), ("prend", "prendre"),
            ("mis", "mettre"), ("mise", "mettre"), ("met", "mettre"), ("mett", "mettre"), ("venu", "venir"), ("vien", "venir"),
            ("vienn", "venir"), ("ven", "venir"), ("vînt", "venir"), ("tenu", "tenir"), ("tien", "tenir"), ("tienn", "tenir"),
            ("ten", "tenir"), ("naiss", "naître"), ("nu", "naître"), ("naît", "naître"), ("nai", "naître"), ("duis", "duire"),
            ("duit", "duire"), ("crit", "crire"), ("criv", "crire"), ("cri", "crire"), ("voy", "voir"), ("vu", "voir"),
            ("voi", "voir"), ("sav", "savoir"), ("sach", "savoir"), ("sai", "savoir"), ("pouv", "pouvoir"), ("peuv", "pouvoir"),
            ("peu", "pouvoir"), ("voul", "vouloir"), ("veul", "vouloir"), ("veu", "vouloir"), ("dev", "devoir"),
            ("doiv", "devoir"), ("doi", "devoir"), ("fais", "faire"), ("fai", "faire"), ("ouvert", "ouvrir"), ("ouvr", "ouvrir"),
            ("offert", "offrir"), ("offr", "offrir"), ("couvert", "couvrir"), ("çu", "cevoir"), ("çoi", "cevoir"),
            ("çoiv", "cevoir"), ("cev", "cevoir"), ("suff", "suffire"), ("suffi", "suffire"), ("dis", "dire"), ("di", "dire"),
            ("lis", "lire"), ("lu", "lire"), ("li", "lire"), ("dor", "dormir"), ("dorm", "dormir"), ("sor", "sortir"),
            ("sort", "sortir"), ("par", "partir"), ("sen", "sentir"), ("sent", "sentir"), ("ser", "servir"), ("serv", "servir"),
            ("vécu", "vivre"), ("viv", "vivre"), ("vi", "vivre"), ("bu", "boire"), ("buv", "boire"), ("boiv", "boire"),
            ("boi", "boire"), ("cru", "croire"), ("croy", "croire"), ("croi", "croire"), ("plu", "plaire"), ("plais", "plaire"),
            ("plai", "plaire"), ("peign", "peindre"), ("pein", "peindre"), ("joign", "joindre"), ("join", "joindre"),
            ("craign", "craindre"), ("crain", "craindre"), ("connaiss", "connaître"), ("connu", "connaître"),
            ("paraiss", "paraître"), ("paru", "paraître"), ("parai", "paraître"), ("mour", "mourir"), ("meur", "mourir"),
            ("meurt", "mourir"), ("cour", "courir"), ("couru", "courir"), ("court", "courir"), ("vain", "vaincre"),
            ("vainqu", "vaincre"), ("suiv", "suivre"), ("sui", "suivre"), ("suivi", "suivre"), ("résol", "résoudre"),
            ("résolu", "résoudre"), ("fall", "falloir"), ("vaill", "valoir"), ("val", "valoir"), ("vau", "valoir"),
            ("assi", "asseoir"), ("assis", "asseoir"), ("appel", "appeler"), ("appell", "appeler"), ("jett", "jeter"),
            ("envoi", "envoyer"), ("enverr", "envoyer"), ("ser", "être"), ("aur", "avoir"), ("ir", "aller"), ("fer", "faire"),
            ("pourr", "pouvoir"), ("voudr", "vouloir"), ("devr", "devoir"), ("saur", "savoir"), ("viendr", "venir"),
            ("tiendr", "tenir"), ("verr", "voir"), ("faudr", "falloir"), ("vaudr", "valoir"), ("courr", "courir"),
            ("mourr", "mourir"), ("recevr", "recevoir")]
FR_ENDS = sorted("""s t e es ent ons ez ais ait aient ions iez ai as a ont it is ît îmes îtes irent ant ue ues us ie ies ra ras rai
    ront rez rons rais rait raient rions riez""".split(), key=len, reverse=True)


def fr_irregular(w):
    """Franska oregelbundna former: appris -> apprendre, savais -> savoir, voyait -> voir, suffit -> suffire,
    promis -> promettre, connaissais -> connaître, dort -> dormir, pourrait -> pouvoir."""
    rests = {w} | {w[: -len(e)] for e in FR_ENDS if w.endswith(e) and len(w) > len(e)}
    out = set()
    for r in rests:
        for st, inf in FR_STEMS:
            if r.endswith(st) and (len(st) >= 4 or len(r) - len(st) <= 4):
                out.add(r[: -len(st)] + inf)
                if st in ("ser", "aur", "ir", "fer") and r != st:
                    out.discard(r[: -len(st)] + inf)
    return out


IT_CLITICS = sorted("""mi ti ci vi si lo la li le ne gli glielo gliela glieli gliele gliene melo mela meli mele mene telo tela
    teli tele tene celo cela celi cele cene selo sela seli sele sene velo vela veli vele vene""".split(), key=len, reverse=True)
IT_REMOTO_CONS = {"ss": ["v", "gg", "c", "tt", "", "d"], "s": ["d", "nd", "n", "tt", "r", "c", "g", "gn", "gli", "nder"],
                  "ls": ["gli", "lg"], "ns": ["nc", "ng", "gn", "nd"], "bb": ["", "sc", "v"], "pp": ["p", "mp"],
                  "nn": ["n"], "ll": ["l"], "cqu": ["sc", "c"], "qu": ["c"], "rs": ["r", "rd"]}
IT_STEM_ALT = [("iesc", "iusc"), ("esc", "usc"), ("tien", "ten"), ("teng", "ten"), ("vien", "ven"), ("veng", "ven"),
               ("sied", "sed"), ("muoi", "mor"), ("muor", "mor"), ("vuol", "vol"), ("rimang", "riman"), ("pong", "pon"),
               ("salg", "sal"), ("scelg", "scegl"), ("tolg", "togl"), ("valg", "val"), ("appai", "appar")]
IT_FUT = sorted("ò ai à emo ete anno ei esti ebbe emmo este ebbero".split(), key=len, reverse=True)


def it_irregular(w):
    """Italienska: enklitiska pronomen (vederti, fermarmi, dicendolo, guardalo), oregelbundet futurum och
    condizionale (vorrei, potrà, verrò, rimarrebbe) och starkt passato remoto (prese, scrisse, decise, lesse)."""
    out = set()
    for cl in IT_CLITICS:                       # vederti -> vedere, fermarmi -> fermare, dirgli -> dire
        if w.endswith(cl) and len(w) - len(cl) >= 3:
            r = w[: -len(cl)]
            if r.endswith("r"):
                out |= {r + "e", r + "re"}
            elif r.endswith(("ando", "endo")):
                out |= {r[:-4] + "are", r[:-4] + "ere", r[:-4] + "ire", r[:-4] + "re"}
            else:
                out |= {r, r + "re", r[:-1] + "are", r[:-1] + "ere", r[:-1] + "ire"}
                if len(r) >= 2 and r[-1] == r[-2]:     # dimmi, fallo
                    out.add(r[:-1] + "re")
            for c2 in list(out):
                if c2.endswith("rre"):
                    pass
    for e in IT_FUT:                            # vorrei -> volere, potrà -> potere, verrò -> venire
        if w.endswith(e) and len(w) - len(e) >= 3:
            r = w[: -len(e)]
            if r.endswith("rr"):
                out |= {r[:-2] + "lere", r[:-2] + "nere", r[:-2] + "nire", r[:-2] + "re", r[:-1] + "e"}
            elif r.endswith("r"):
                out |= {r[:-1] + "ere", r[:-1] + "are", r[:-1] + "ire", r + "e"}
    for e in ("e", "ero", "i"):                 # prese -> prendere, scrisse -> scrivere, decisero -> decidere
        if w.endswith(e) and len(w) - len(e) >= 3:
            r = w[: -len(e)]
            for cons, subs in IT_REMOTO_CONS.items():
                if r.endswith(cons):
                    for sub in subs:
                        b = r[: -len(cons)] + sub
                        out |= {b + "ere", b + "ire", b + "re", b + "iere"}
    return out


# ---------- lemmatisering ----------

class Lexicon:
    def __init__(self, lang, known, forms, verbs=None, nouns=None):
        self.lang = lang
        self.nouns = set(nouns or ())
        self.verbs = set(verbs or ()) | set(forms.values())
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

    def lemma(self, w, irregular=True):
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
        irr = () if not irregular else de_strong(w) if self.lang == "de" else fr_irregular(w) if self.lang == "fr" else it_irregular(w)
        for c in irr:
            if self.lang == "de":
                p, c = c
                if p + c in self.known and (p + c in self.verbs or c in self.verbs):
                    return p + c
                if not p and c in self.known and c in self.verbs:
                    return c
                continue
            if len(c) >= 4 and c in self.known:
                return c
            if c in self.forms and self.forms[c] in self.known:
                return self.forms[c]
            if self.lang == "it" and c.endswith(("are", "ere", "ire", "rre")) and c in self.verbs \
                    and self.lemma(c, False):
                return c
        if self.lang == "it":                       # riesco -> riuscire, tiene -> tenere, siede -> sedere
            for a, b in IT_STEM_ALT:
                i = w.find(a)
                if i >= 0 and irregular:
                    alt = w[:i] + b + w[i + len(a):]
                    for c in self.candidates(alt):
                        if c in self.known and c.endswith(("are", "ere", "ire", "rre")):
                            return c
        other = self.other_form(w)
        if other:
            return other
        if deaccent(w) in self.plain:
            return w
        s = self.stem(w)
        if len(s) >= 4 and s in self.stems:
            return s
        return None

    def other_form(self, w):
        """Former som ändelserna inte täcker (2026-10-02). Bara när grundformen finns exakt bland de kända orden:
        tyska zu-infinitiv av delbara verb (anzubieten -> anbieten, kennenzulernen -> kennenlernen), feminina på -in/-innen
        av kända substantiv (Mitarbeiterin -> Mitarbeiter, Kollegin -> Kollege, Ärztin -> Arzt) och komparativ av kända ord
        som inte är substantiv (größeren -> groß, ärmere -> arm, teurer -> teuer, dunklere -> dunkel); franska och
        italienska feminina (chanteuse -> chanteur, entière -> entier, attrice -> attore, studentessa -> studente)."""
        L, K = self.lang, self.known
        if L == "de":
            for p in DE_ZU:                                   # anzubieten, festzuhalten
                if w.startswith(p + "zu") and len(w) - len(p) - 2 >= 4 and w.endswith(("en", "ern", "eln")):
                    inf = p + w[len(p) + 2:]
                    if inf in K or (inf in self.forms and self.forms[inf] in K):
                        return inf
            for suf in ("innen", "in"):                       # Mitarbeiterin, Studentinnen, Ärztin, Kollegin
                if w.endswith(suf) and len(w) - len(suf) >= 3:
                    b = w[: -len(suf)]
                    for x in (b, b + "e", b.translate(UMLAUT)):
                        if x in self.nouns and x in K:
                            return x
                    if self.compound(b):                      # Stadtplanerin = Stadt + Planer
                        return b
                    break
            for suf in DE_COMP:                               # größeren, ärmere, teurer, kürzerer
                if w.endswith(suf) and len(w) - len(suf) >= 2:
                    b = w[: -len(suf)]
                    for x in {b, b.translate(UMLAUT), b[:-1] + "er" if b.endswith("r") else b, b[:-1] + "el" if b.endswith("l") else b,
                              b[:-1] + "ch" if b.endswith("h") else b}:
                        if len(x) >= 3 and x in K and x not in self.nouns and x not in self.verbs:
                            return x
            return None
        for fem, masc in FEM.get(L, ()):
            for x in {w, w[:-1] if w.endswith(("s", "x")) and L == "fr" else w}:
                if x.endswith(fem) and len(x) - len(fem) >= 2:
                    b = x[: -len(fem)] + masc
                    if b in K:
                        return b
        return None

    def compound(self, w):
        """Tysk sammansättning av kända delar (Fluchtversuch, Musikschule)."""
        if self.lang != "de" or len(w) < 7:
            return False
        for i in range(3, len(w) - 2):
            head, tail = w[:i], w[i:]
            if len(tail) < 3 or not self.lemma(tail, False):
                continue
            for h in (head, head[:-1] if head.endswith("s") else None, head[:-1] if head.endswith("n") else None,
                      head + "e", head + "en"):
                if h and len(h) >= 3 and (self.lemma(h, False) or self.compound(h)):
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
        out.append(("läs", "stories", x["id"], x.get("title", ""), [(t, x.get("sv", ""))], {}))   # appen visar inga glosor här
    ex = load("exam")
    if isinstance(ex, dict):
        for t in ex.get("tasks", []):
            if not t.get("lines"):
                continue
            kind = "hör" if t.get("part") in LISTEN_PARTS else "läs" if t.get("part") in READ_PARTS else None
            if kind:
                out.append((kind, "exam", t["id"], t.get("title", ""), [(l.get("fr", ""), l.get("sv", "")) for l in t["lines"]], {}))   # provet visar inga glosor
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
        verbs = set(load_verbs(c))
        for p in chain[c]:
            verbs |= load_verbs(p)
        nouns = set(load_nouns(c)) if lang == "de" else set()
        for p in chain[c]:
            nouns |= load_nouns(p) if lang == "de" else set()
        lex = Lexicon(lang, known, forms[lang], verbs, nouns)
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
           "(`nextCourse` baklänges) + grammatikord och bindeord (med arv) + textens glosor (`gloss`, bara i hör-, läs- och kulturtexter där appen visar dem; inte i berättelser och prov) + namn, siffror och internationella ord. "
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
