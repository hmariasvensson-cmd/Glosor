/* Inställningar för Tyska 7 (Moderna språk 7, steg 7, B2.1 mot C1). Orden ligger i words.txt och videorna i videos.json.
   Eleven pluggar på egen hand och vill studera musik i Tyskland (TestDaF/Goethe C1 som utblick).
   Verb, bindeord och tempusigenkänning ärvs från Tyska 5 (languages/de/lang.js), se extends och inherit nedan. */
LANGUAGES.de7 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 7",
  courseGy25: "Moderna språk – fördjupning, nivå 3",
  step: 7,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B2 → C1",           // steg 7 ≈ B2.1 enligt Skolverket, provmålet C1/TestDaF står i exam
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de7-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
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
  exam: {name: "Goethe-Zertifikat C1 (och TestDaF)", level: "C1"},   // språkprovet eleven siktar på
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus (Präteritum, Plusquamperfekt, Konjunktiv I eller II, passiv) och ett bindeord som passar både betydelsen och ordföljden.",
  cultureIntro: "Läs en text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json (L.grammar).

  // Samma verbtabeller som Tyska 5; verbspelen blandar alla tempus och båda konjunktiverna, som i längre texter
  verbs: {
    games: [
      {id: "ref", name: "Referat", sub: "Konjunktiv I och II i indirekt tal: sie sei, man habe, sie hätten", tenses: ["Konjunktiv I", "Konjunktiv II"]},
      {id: "text", name: "Berättande text", sub: "Präteritum och Perfekt i längre texter", tenses: ["Präteritum", "Perfekt"]},
      {id: "alla", name: "Alla tempus", sub: "Präteritum, Perfekt, Konjunktiv I och II blandat", tenses: ["Präteritum", "Perfekt", "Konjunktiv I", "Konjunktiv II"]}
    ]
  }
};
