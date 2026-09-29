/* Inställningar för Tyska 2 (steg 2, A1.2 mot A2). Orden ligger i words.txt och videorna i videos.json.
   Verb, bindeord och tempusigenkänning ärvs från Tyska 5 (languages/de/lang.js), se extends och inherit nedan,
   men bara presens och perfekt övas (spec i docs/nivaer-tyska.md, avsnitt 4.2). */
LANGUAGES.de2 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 2",
  courseGy25: "Moderna språk – grund, nivå 1",
  step: 2,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1 → A2",           // steg 2 ≈ A1.2 enligt Skolverket
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de2-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "de",               // fälten i inherit hämtas från Tyska 5 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],
  nextCourse: "de3",            // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat A1: Start Deutsch 1", level: "A1"},   // provformatet eleven tränar på i Tyska 2
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i Perfekt (haben eller sein), rätt modalverb och ett bindeord som passar.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Tyska 2 kontrollerar bara presens och perfekt i elevens texter
  tenseCheck: {$remove: ["Präteritum", "Konjunktiv II", "Passiv"]},

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json.
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Samma verbtabeller som Tyska 5, men bara presens och perfekt
  verbs: {
    tenses: {$remove: ["Präteritum", "Konjunktiv I", "Konjunktiv II"]},
    games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "perf", name: "Perfekt", sub: "habe gemacht, bin gefahren, habe verstanden", tenses: ["Perfekt"]},
      {id: "mix", name: "Presens och perfekt", sub: "Blandat: nu eller i helgen?", tenses: ["Präsens", "Perfekt"]}
    ]
  }
};
