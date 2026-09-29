/* Inställningar för Tyska 3 (A2.1). Orden ligger i words.txt och videorna i videos.json.
   Bindeord, tempusigenkänning och verb ärvs från Tyska 5 (languages/de/lang.js), se extends och inherit nedan.
   Verben är filtrerade till stegets nivå (docs/nivaer-tyska.md 4.1): presens, perfekt och präteritum av sein, haben och modalverben. */
LANGUAGES.de3 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 3",
  courseGy25: "Moderna språk – grund, nivå 3",
  step: 3,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A2",                   // steg 3 ≈ A2.1 enligt Skolverket
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de3-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "de",                 // fälten i inherit hämtas från Tyska 5 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],
  nextCourse: "de4",             // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat A2", level: "A2"},   // språkprovet eleven tränar på i Tyska 3
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: Perfekt eller Präteritum (war, hatte, konnte, musste …), och ett bindeord som passar ordföljden.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se languages/de4/content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Samma verbtabeller som Tyska 5, men bara presens, perfekt och präteritum av sein, haben och modalverben
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "perf", name: "Perfekt", sub: "ich bin gefahren, ich habe geschrieben", tenses: ["Perfekt"]},
      {id: "prt", name: "Präteritum", sub: "war, hatte, konnte, musste, wollte", tenses: ["Präteritum"]}
    ]
  }
};
