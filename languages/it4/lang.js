/* Inställningar för Italienska 4 (steg 4, A2.2, mot CELI 1). Artiklar, pronomen, elision, bindeord,
   tempusigenkänning och verbtabeller hämtas från Italienska 2 (languages/it2/lang.js), som i sin tur ärver från
   Italienska 1, se extends och inherit nedan. Spec: docs/nivaer-italienska.md (steg 4). */
LANGUAGES.it4 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 4",
  courseGy25: "Moderna språk – fortsättning, nivå 2",
  step: 4,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A2 → B1",              // steg 4 ≈ A2.2 enligt Skolverket
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  nextCourse: "it5",            // kursen man går vidare till när den här är klar
  storageKey: "glosor-it4-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "it2",                // fälten i inherit hämtas från Italienska 2 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "CELI 1 (A2)", level: "A2"},   // språkprovet eleven tränar på i Italienska 4

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  // Sambandsord som räknas i skrivchecklistan, utöver dem som ärvs
  connectors: {$append: ["perciò", "anche se", "comunque", "infatti", "cioè", "sebbene", "tuttavia", "oppure", "invece di", "da una parte", "dall'altra", "prima di tutto", "in conclusione", "per questo"]},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: trapassato, futuro anteriore eller congiuntivo, och ett sambandsord som passar.",
  cultureIntro: "Läs en text om Italien, svara på en fråga och jämför med hur det är i Sverige.",

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna ärvs från Italienska 2; här läggs trapassato prossimo, futuro anteriore och congiuntivo presente till.
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "cong", name: "Congiuntivo presente", sub: "che io sia, abbia, faccia, vada, possa", tenses: ["congiuntivo presente"]},
      {id: "trap", name: "Trapassato prossimo", sub: "avevo mangiato, ero partito/partita", tenses: ["trapassato prossimo"]},
      {id: "futant", name: "Futuro anteriore", sub: "avrò finito, sarò arrivato/arrivata", tenses: ["futuro anteriore"]},
      {id: "cond", name: "Condizionale", sub: "vorrei, potrei, dovrei, sarei", tenses: ["condizionale"]},
      {id: "mix", name: "Alla tempus blandat", sub: "passato prossimo, imperfetto, futuro, trapassato", tenses: ["passato prossimo", "imperfetto", "futuro semplice", "trapassato prossimo"]}
    ]
  }
};
