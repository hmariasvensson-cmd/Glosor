/* Inställningar för Italienska 7 (steg 7, B2.1, mot CELI 3). Artiklar, pronomen, elision, bindeord,
   tempusigenkänning och verbtabeller hämtas från Italienska 2 (languages/it2/lang.js), som i sin tur ärver från
   Italienska 1, se extends och inherit nedan. Spec: docs/nivaer-italienska.md (steg 7). Toppen av kedjan: inget nextCourse. */
LANGUAGES.it7 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 7",
  courseGy25: "Moderna språk – fördjupning, nivå 3",
  step: 7,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B2",                   // steg 7 ≈ B2.1 enligt Skolverket
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-it7-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "it2",                // fälten i inherit hämtas från Italienska 2 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "CELI 3 (B2)", level: "B2"},   // språkprovet eleven tränar på i Italienska 7

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  // Sambandsord och diskursmarkörer som räknas i skrivchecklistan, utöver dem som ärvs från Italienska 1
  connectors: {$append: ["perciò", "anche se", "comunque", "infatti", "cioè", "tuttavia", "benché", "sebbene", "affinché",
    "nonostante", "dal momento che", "da una parte", "dall'altra", "in primo luogo", "in secondo luogo", "innanzitutto",
    "insomma", "anzi", "pertanto", "dunque", "ciononostante", "in effetti", "in realtà", "d'altronde", "del resto",
    "invece", "mentre", "purché", "qualora", "in conclusione", "per concludere", "in sintesi", "ad esempio",
    "in altre parole", "vale a dire", "inoltre", "oltretutto", "a patto che", "a meno che", "in quanto", "poiché"]},

  // Tempusigenkänning i skrivuppgifterna: som i Italienska 1 och 2, plus condizionale, congiuntivo och passato remoto
  tenseCheck: {
    "condizionale": t => /(^|[^\p{L}])\p{L}+(rei|resti|rebbe|remmo|reste|rebbero)(?![\p{L}])/iu.test(t),
    "congiuntivo": t => /(^|[^\p{L}])(sia|siano|siate|abbia|abbiano|faccia|facciano|vada|vadano|venga|vengano|possa|possano|debba|voglia|sappia|stia|dica|\p{L}+(assi|asse|assimo|assero|essi|esse|essimo|essero|issi|isse|issimo|issero)|fossi|fosse|fossimo|fossero)(?![\p{L}])/iu.test(t),
    "passato remoto": t => /(^|[^\p{L}])(fu|furono|ebbe|ebbero|fece|fecero|disse|dissero|venne|vennero|nacque|morì|scrisse|scrissero|decise|prese|vide|volle|seppe|\p{L}{2,}(ò|arono|erono|irono|ette|ettero))(?![\p{L}])/iu.test(t)
  },

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: passato remoto, congiuntivo, en implicit konstruktion eller en diskursmarkör som passar sammanhanget. Flera berättelser är skrivna i litterär stil, med passato remoto som berättartempus.",
  cultureIntro: "Läs en text om italiensk kultur, vetenskap eller samhälle, svara på en fråga och jämför med hur det är i Sverige.",

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna ärvs från Italienska 2; här läggs passato remoto och congiuntivo imperfetto till.
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "remoto", name: "Passato remoto", sub: "fu, ebbe, fece, disse, parlò, partirono", tenses: ["passato remoto"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "come se fosse, se avessi, non sapevo che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "racconto7", name: "Berätta i litterär stil", sub: "passato remoto och imperfetto blandat", tenses: ["passato remoto", "imperfetto"]},
      {id: "tutti7", name: "Alla tempus", sub: "presens, dåtid, futuro, condizionale, congiuntivo och passato remoto", tenses: ["presente", "passato prossimo", "imperfetto", "futuro semplice", "condizionale", "congiuntivo imperfetto", "passato remoto"]}
    ]
  }
};
