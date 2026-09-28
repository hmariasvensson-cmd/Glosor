/* Inställningar för Tyska 4 (B1, repetition före Tyska 5). Orden ligger i words.txt och videorna i videos.json.
   Verb, bindeord och tempusigenkänning ärvs från Tyska 5 (languages/de/lang.js), se extends och inherit nedan. */
LANGUAGES.de4 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 4",
  courseGy25: "Moderna språk – fortsättning, nivå 2",
  level: "A2 → B1",           // steg 4 ≈ A2.2 enligt Skolverket
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de4-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "de",               // fälten i inherit hämtas från Tyska 5 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],
  nextCourse: "de",            // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat B1 (delmål mot B2)", level: "B1"},   // språkprovet eleven tränar på i Tyska 4 (B2 i Tyska 5)
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i Präteritum eller Perfekt, och ett bindeord som passar ordföljden.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Samma verbtabeller som Tyska 5, men utan Konjunktiv I och med egna verbspel
  verbs: {
    tenses: {$remove: ["Konjunktiv I"]},
    games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "tempus", name: "Dåtid", sub: "Präteritum och Perfekt", tenses: ["Präteritum", "Perfekt"]},
      {id: "k2", name: "Konjunktiv II", sub: "hätte, wäre, würde, könnte", tenses: ["Konjunktiv II"]}
    ]
  }
};
