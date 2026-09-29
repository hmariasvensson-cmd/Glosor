/* Inställningar för Italienska 1 (A1, nybörjare). Orden ligger i words.txt och videorna i videos.json.
   Kapitel och grammatik följer kursplanen och vanliga läromedel, se docs/italienska-plan.md. */
LANGUAGES.it1 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 1",
  courseGy25: "Moderna språk – nybörjare, nivå 1",
  step: 1,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1",
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-it1-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "it2",

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  // Artikeln visas i ordlistan men behövs inte i svaret
  articles: [/^(il|lo|la|i|gli|le|un|uno|una) /, /^(l'|un')/],
  hintStrip: /^(?:(?:il|lo|la|i|gli|le) |l')/,
  // Mellanslag krävs efter pronomenet, så att verbformer som börjar som ett pronomen ("ioni", "tuffo") inte klipps
  pronouns: /^(?:lui\/lei|loro|lui|lei|noi|voi|io|tu) /,
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},
  elision: /^(l|dell|all|dall|nell|sull|un|quell|c|d)'/i,

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform och ett ord som passar.",
  cultureIntro: "Läs en kort text om Italien, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeord som räknas i skrivchecklistan (e och o är för vanliga för att räknas)
  connectors: ["ma","perché","poi","dopo","quando","anche","però","allora","quindi","prima","infine","secondo me","per esempio",
    "invece","mentre","così","siccome","dunque","inoltre","purtroppo","di solito","alla fine"],
  tenseCheck: {
    "presente": t => t.trim().length > 0,
    "passato prossimo": t => /(^|[^\p{L}])(ho|hai|ha|abbiamo|avete|hanno|sono|sei|è|siamo|siete)\s+(\p{L}+(ato|ata|ati|ate|uto|uta|uti|ute|ito|ita|iti|ite)|fatto|detto|preso|messo|visto|scritto|letto|stato|venuto|nato|morto|chiesto|risposto|chiuso|aperto|bevuto|vissuto|rimasto|speso|scelto|corso|perso)(?![\p{L}])/iu.test(t),
    "imperfetto": t => /(^|[^\p{L}])(\p{L}+(avo|avi|ava|avamo|avate|avano|evo|evi|eva|evamo|evate|evano|ivo|ivi|iva|ivamo|ivate|ivano)|ero|eri|era|eravamo|eravate|erano)(?![\p{L}])/iu.test(t),
    "futuro": t => /(^|[^\p{L}])\p{L}+(rò|rai|rà|remo|rete|ranno)(?![\p{L}])/iu.test(t)
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i languages/de/content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    persons: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
    // Pronomenet skrivs framför verbformen (reflexiva former har redan mi, ti, si … i svaret)
    prefix: (i, form, persons) => persons[i] + " ",

    // Varje spel övar ett urval tempus (och i Italienska 1 ett urval verb). Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres-reg", name: "Regelbundna verb", sub: "parlo, prendi, dorme, finisco", tenses: ["presente"], verbs: ["parlare", "abitare", "lavorare", "studiare", "mangiare", "cercare", "pagare", "prendere", "leggere", "scrivere", "vedere", "vivere", "dormire", "partire", "sentire", "aprire", "finire", "capire", "preferire"]},
      {id: "pres-irr", name: "Oregelbundna verb", sub: "sono, ho, faccio, vado, vengo", tenses: ["presente"], verbs: ["essere", "avere", "fare", "andare", "venire", "stare", "uscire", "dare", "dire", "bere", "sapere", "rimanere"]},
      {id: "pres-mod-rifl", name: "Modala och reflexiva verb", sub: "voglio, posso, devo, mi alzo, ti chiami", tenses: ["presente"], verbs: ["volere", "potere", "dovere", "chiamarsi", "alzarsi", "svegliarsi", "lavarsi", "vestirsi", "divertirsi"]}
    ]
  }
};
