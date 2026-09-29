/* Inställningar för Franska 5 (Moderna språk 5, steg 5, B1.1). Orden ligger i words.txt och videorna i videos.json.
   Kursen har ingen lärobok och är skriven för elever som pluggar på egen hand, med DELF B1 som provmål.
   Spec: docs/nivaer-franska.md (steg 5). Bindeord, tempusigenkänning och verbtabeller ärvs från Franska 6 (fr4),
   som i sin tur ärver från Franska 3 (fr). */
LANGUAGES.frs5 = {
  name: "Franska",            // samma språk som Franska 3 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 5",
  courseGy25: "Moderna språk – fördjupning, nivå 1",   // steg 5 i Gy25 (se docs/kursmall.md 2.1)
  step: 5,                       // steg 5 = Moderna språk 5 (sorterar kursväljaren)
  level: "B1",                // steg 5 ≈ B1.1 enligt Skolverket
  exam: {name: "DELF B1", level: "B1"},
  goal: "att klara språkprovet för att få studera musik utomlands (i Frankrike)",   // valfritt: elevens mål, nämns i Claudes bedömning
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  storageKey: "glosor-frs5-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "fr4",           // Franska 6 (steg 6, B1.2)
  extends: "fr4",              // fälten i inherit hämtas från fr4 (och via den från fr) och slås ihop med fälten här
  inherit: ["connectors", "tenseCheck", "verbs"],

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  articles: [/^(le|la|les|un|une|des) /, /^l'/],
  pronouns: /^(?:(?:que |qu')?(?:il\/elle|ils\/elles|elles|elle|ils|il|nous|vous|on|tu|je) |(?:que )?j')/,
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},
  elision: /^(l|d|j|qu|n|s|c|m|t|jusqu|lorsqu|puisqu)'/i,

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus eller modus (passé composé, imparfait, plus-que-parfait, conditionnel, subjonctif, gérondif …) och ett bindeord som passar sammanhanget.",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeorden från Franska 3 och 6, plus bindeord för mål, motsats och medgivande på steg 5
  connectors: {$append: ["pourtant", "cependant", "même si", "au lieu de", "de façon à", "de sorte que"]},

  // Grammatikövningar: områden och regelnamn i grammar.json, frågorna i content/grammar-*.json.
  verbs: {
    games: [
      {id: "subj", name: "Subjonctif", sub: "que je sois, qu'il fasse, que nous puissions", tenses: ["subjonctif"]},
      {id: "hyp", name: "Villkor", sub: "Conditionnel: je ferais, j'aurais", tenses: ["conditionnel"]},
      {id: "recit", name: "Berätta i dåtid", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]}
    ]
  }
};
