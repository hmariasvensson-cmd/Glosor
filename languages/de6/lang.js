/* Inställningar för Tyska 6 (Moderna språk 6, steg 6, B1.2 mot B2). Orden ligger i words.txt och videorna i videos.json.
   Verb, bindeord och tempusigenkänning ärvs från Tyska 5 (languages/de/lang.js), se extends och inherit nedan. */
LANGUAGES.de6 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 6",
  courseGy25: "Moderna språk – fördjupning, nivå 2",
  step: 6,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B1 → B2",           // steg 6 ≈ B1.2 enligt Skolverket, provmålet B2 står i exam
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de6-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "de7",          // kursen man går vidare till när den här är klar
  extends: "de",               // fälten i inherit hämtas från Tyska 5 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat B2 (eller telc B2/TestDaF)", level: "B2"},   // språkprovet eleven siktar på
  goal: "att klara språkprovet för att få studera musik utomlands (i Tyskland)",   // valfritt: elevens mål, nämns i Claudes bedömning
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus (Präteritum, Plusquamperfekt, Konjunktiv I eller II) och ett bindeord som passar både betydelsen och ordföljden.",
  cultureIntro: "Läs en text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se languages/de/content/GRAMMATIK-SPEC.md och content/SPEC.md).
  // Områdena bygger vidare på Tyska 5 och upprepar inte dess områden rakt av.
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Samma verbtabeller som Tyska 5, men verbspelen övar konjunktiven och alla tempus blandat
  verbs: {
    games: [
      {id: "k1", name: "Konjunktiv I", sub: "Indirekt tal: er sei, sie habe, man könne", tenses: ["Konjunktiv I"]},
      {id: "k2", name: "Konjunktiv II", sub: "wäre, hätte, käme, wüsste, müsste", tenses: ["Konjunktiv II"]},
      {id: "alla", name: "Alla tempus", sub: "Präteritum, Perfekt, Konjunktiv I och II blandat", tenses: ["Präteritum", "Perfekt", "Konjunktiv I", "Konjunktiv II"]}
    ]
  }
};
