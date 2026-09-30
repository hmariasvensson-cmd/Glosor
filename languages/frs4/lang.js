/* Inställningar för Franska 4 (Moderna språk 4, steg 4, A2.2 mot B1). Orden ligger i words.txt och videorna i videos.json.
   Kursen har ingen lärobok och är byggd för elever som pluggar på egen hand. Spec: docs/nivaer-franska.md (steg 4)
   och docs/kursmall.md. Accenter, artiklar, pronomen, elision, genus, bindeord, tempusigenkänning och verbtabeller
   ärvs från Franska 3 (languages/fr/lang.js), se extends och inherit nedan.
   Kedjan: Franska 3 (fr) → Franska 4 (frs4) → Franska 5 (frs5) → Franska 6 (fr4). Koden fr4 är upptagen av steg 6. */
LANGUAGES.frs4 = {
  name: "Franska",            // samma språk som Franska 3 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 4",
  courseGy25: "Moderna språk – fortsättning, nivå 2",   // steg 4 i Gy25 (se docs/kursmall.md 2.1)
  step: 4,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A2 → B1",           // steg 4 ≈ A2.2 enligt Skolverket
  exam: {name: "DELF A2", level: "A2"},   // provträningen i content/exam.json
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-frs4-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "frs5",          // kursen man går vidare till när den här är klar (Franska 5)
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  extends: "fr",               // fälten i inherit hämtas från Franska 3 (egna fält vinner)
  inherit: ["accents", "verbAccents", "articles", "pronouns", "genders", "elision", "connectors", "tenseCheck", "verbs"],

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: imparfait, passé composé, plus-que-parfait eller conditionnel, och ett bindeord som passar sammanhanget.",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeorden från Franska 3 plus några för orsak, följd och åsikt (steg 4)
  connectors: {$append: ["puisque", "c'est pourquoi", "grâce à", "à cause de", "en effet", "de plus", "d'abord", "par conséquent", "au contraire", "sinon"]},
  // Tempusigenkänningen från Franska 3, plus conditionnel (enkel igenkänning för checklistan, inte för rättning)
  tenseCheck: {
    "conditionnel": t => (t.match(/(^|[^\p{L}])(\p{L}*(er|ir|dr|vr|rr|ur|oir)(ais|ait|ions|iez|aient))(?![\p{L}])/giu) || [])
      .some(m => !/^(vrais|(tir|attir|retir|admir|respir|inspir|soupir|vir|désir|éclair|dur|assur|rassur|jur|mesur|figur|murmur|demeur|pleur|cour|parcour|secour|mour|ouvr|couvr|découvr|offr|souffr)(ais|ait|ions|iez|aient))$|ér(ais|ait|ions|iez|aient)$/i.test(m.replace(/^[^\p{L}]+/u, "")))
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Samma verbtabeller som Franska 3, med spel för steg 4
  verbs: {
    games: [
      {id: "recit", name: "Berätta i dåtid", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]},
      {id: "cond", name: "Önska och råda", sub: "Futur simple och conditionnel", tenses: ["futur simple", "conditionnel"]},
      {id: "subj", name: "Il faut que …", sub: "Subjonctif présent (början)", tenses: ["subjonctif"]}
    ]
  }
};
