/* Inställningar för Italienska 2 (A2). Bindeord, tempusigenkänning och uttalsinställningar hämtas från
   Italienska 1 (languages/it1/lang.js), se extends och inherit nedan. Se docs/italienska-plan.md. */
LANGUAGES.it2 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 2",
  courseGy25: "Moderna språk – grund, nivå 1",
  step: 2,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1 → A2",           // steg 2 ≈ A1.2 enligt Skolverket
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  nextCourse: "it3",            // kursen man går vidare till när den här är klar
  storageKey: "glosor-it2-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "it1",                // fälten i inherit hämtas från Italienska 1 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck"],

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: passato prossimo eller imperfetto, imperativ eller futuro, och rätt bindeord.",
  cultureIntro: "Läs en kort text om Italien, svara på en fråga och jämför med hur det är i Sverige.",

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    persons: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
    // Pronomenet skrivs framför verbformen (reflexiva former har redan mi, ti, si … i svaret)
    prefix: (i, form, persons) => persons[i] + " ",

    // Varje spel övar ett urval tempus. Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres", name: "Presens", sub: "Repetition: oregelbundna verb (faccio, vado, posso)", tenses: ["presente"]},
      {id: "pp", name: "Passato prossimo", sub: "ho mangiato, sono andato/andata, mi sono alzato", tenses: ["passato prossimo"]},
      {id: "imp", name: "Imperfetto", sub: "ero, avevo, facevo, parlavo", tenses: ["imperfetto"]},
      {id: "fut", name: "Futuro semplice", sub: "parlerò, sarò, andrò, farò", tenses: ["futuro semplice"]},
      {id: "cond", name: "Condizionale", sub: "vorrei, potrei, dovrei, sarei", tenses: ["condizionale"]}
    ]
  }
};
