/* Inställningar för Franska 2 (Moderna språk 2, steg 2, A1.2 mot A2). Orden ligger i words.txt och videorna i videos.json.
   Kursen har ingen lärobok. Artiklar, pronomen, elision, bindeord, tempusigenkänning och verbtabeller ärvs från
   Franska 3 (languages/fr/lang.js), se extends och inherit nedan. Spec: docs/nivaer-franska.md (steg 2) och docs/kursmall.md.
   Kedjan: Franska 1 (fr1) → Franska 2 (fr2) → Franska 3 (fr). */
LANGUAGES.fr2 = {
  name: "Franska",            // samma språk som Franska 3 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 2",
  courseGy25: "Moderna språk – grund, nivå 1",   // steg 2 i Gy25 (se docs/kursmall.md 2.1)
  step: 2,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1 → A2",           // steg 2 ≈ A1.2 enligt Skolverket
  exam: {name: "DELF A1", level: "A1"},   // provträningen i content/exam.json
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-fr2-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "fr",            // kursen man går vidare till när den här är klar (Franska 3)
  extends: "fr",               // fälten i inherit hämtas från Franska 3 (egna fält vinner)
  inherit: ["articles", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: presens, futur proche, passé composé eller imperativ, och rätt bindeord.",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Samma verbtabeller som Franska 3, med spel för steg 2
  verbs: {
    games: [
      {id: "pres", name: "Presens", sub: "être, avoir, aller, faire, pouvoir, vouloir, devoir, prendre, venir", tenses: ["présent"]},
      {id: "pc", name: "Passé composé", sub: "j'ai parlé, j'ai pris, je suis allé(e)", tenses: ["passé composé"]}
    ]
  }
};
