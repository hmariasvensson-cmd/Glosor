/* Inställningar för Franska 6 (Moderna språk 6, steg 6, B1.2). Orden ligger i words.txt och videorna i videos.json.
   Koden är fr4 av historiska skäl (kursen hette först Franska 4); koden och storageKey ändras aldrig, så framstegen finns kvar.
   Kursen har ingen lärobok. Bindeord, tempusigenkänning och verbtabeller ärvs från Franska 3
   (languages/fr/lang.js), se extends och inherit nedan. */
LANGUAGES.fr4 = {
  name: "Franska",            // samma språk som Franska 3 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 6",
  courseGy25: "Moderna språk – fördjupning, nivå 2",   // steg 6 i Gy25 (se docs/kursmall.md 2.1)
  step: 6,                       // steg 6 = Moderna språk 6 (sorterar kursväljaren), se docs/nivaer-franska.md
  level: "B1",                // steg 6 ≈ B1.2 enligt Skolverket (provmålet DELF B1 står i exam)
  exam: {name: "DELF B1", level: "B1"},
  goal: "att klara språkprovet för att få studera musik utomlands (i Frankrike)",   // valfritt: elevens mål, nämns i Claudes bedömning
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-fr4-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "fru",           // kursen man går vidare till när den här är klar (Franska I på universitetet)
  extends: "fr",               // fälten i inherit hämtas från Franska 3 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  articles: [/^(le|la|les|un|une|des) /, /^l'/],
  // Längre former först, och mellanslag efter pronomenet (utom j' och qu'), så att "ont", "tues" och "ils sont" inte klipps fel
  pronouns: /^(?:(?:que |qu')?(?:il\/elle|ils\/elles|elles|elle|ils|il|nous|vous|on|tu|je) |(?:que )?j')/,
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},
  elision: /^(l|d|j|qu|n|s|c|m|t|jusqu|lorsqu|puisqu)'/i,

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus eller modus (imparfait, passé composé, plus-que-parfait, conditionnel, subjonctif …) och ett bindeord som passar sammanhanget.",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeorden från Franska 3 plus bindeord för argumenterande text på B1-nivå
  connectors: {$append: ["tout d'abord", "d'une part", "d'autre part", "en effet", "de plus", "d'ailleurs", "puisque", "grâce à",
      "à cause de", "c'est pourquoi", "par conséquent", "alors que", "tandis que", "bien que", "malgré", "en revanche", "néanmoins",
      "afin de", "afin que", "pour que", "en conclusion", "pour conclure"]},
  // Tempusigenkänningen från Franska 3, plus conditionnel och subjonctif (enkel igenkänning för checklistan, inte för rättning)
  tenseCheck: (() => {
    const w = "(?![\\p{L}])", b = "(^|[^\\p{L}])";
    const cond = new RegExp(b + "(\\p{L}*(er|ir|dr|vr|rr|ur|ttr|oir)(ais|ait|ions|iez|aient))" + w, "giu");
    // Imparfait av verb vars stam slutar som ett conditionnel (tirer → tirait, éclairer → éclairait, espérer → espérait)
    const notCond = /^(vrais|(tir|attir|retir|admir|respir|inspir|expir|soupir|transpir|conspir|vir|chavir|délir|désir|éclair|dur|assur|rassur|jur|mesur|figur|murmur|demeur|satur|tortur|captur|pleur|cour|parcour|secour|mour|ouvr|couvr|découvr|offr|souffr)(ais|ait|ions|iez|aient))$|ér(ais|ait|ions|iez|aient)$/i;
    return {
      "conditionnel": t => (t.match(cond) || []).some(m => !notCond.test(m.replace(/^[^\p{L}]+/u, ""))),
      "subjonctif": t => new RegExp(b + "(sois|soit|soient|soyons|soyez|aie|aies|ait|ayons|ayez|aient|fass\\p{L}*|puiss\\p{L}*|aill(e|es|ent)|sach(e|es|ions|iez|ent)|veuill\\p{L}*|vienn(e|es|ent)|prenn(e|es|ent)|doiv(e|es|ent))" + w, "iu").test(t)
        || new RegExp(b + "(que|qu')\\s*(je|j'|tu|il|elle|on|nous|vous|ils|elles)\\s*\\p{L}+(isse|isses|issent|ions|iez)" + w, "iu").test(t)
    };
  })(),

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Samma verbtabeller som Franska 3, med spel för steg 6 (B1)
  verbs: {
    games: [
      {id: "subj", name: "Subjonctif", sub: "que je sois, qu'il fasse, que nous puissions", tenses: ["subjonctif"]},
      {id: "hyp", name: "Framtid och villkor", sub: "Futur simple och conditionnel", tenses: ["futur simple", "conditionnel"]},
      {id: "recit", name: "Berätta i dåtid", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]}
    ]
  }
};
