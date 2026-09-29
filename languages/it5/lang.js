/* Inställningar för Italienska 5 (steg 5, B1.1, mot CELI 2). Artiklar, pronomen, elision, bindeord,
   tempusigenkänning och verbtabeller hämtas från Italienska 2 (languages/it2/lang.js), som i sin tur ärver från
   Italienska 1, se extends och inherit nedan. Spec: docs/nivaer-italienska.md (steg 5). */
LANGUAGES.it5 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 5",
  courseGy25: "Moderna språk – fördjupning, nivå 1",
  step: 5,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B1",                   // steg 5 ≈ B1.1 enligt Skolverket
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  nextCourse: "it6",            // kursen man går vidare till när den här är klar
  storageKey: "glosor-it5-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "it2",                // fälten i inherit hämtas från Italienska 2 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "CELI 2 (B1)", level: "B1"},   // språkprovet eleven tränar på i Italienska 5

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  // Sambandsord som räknas i skrivchecklistan, utöver dem som ärvs från Italienska 1
  connectors: {$append: ["perciò", "anche se", "comunque", "infatti", "cioè", "tuttavia", "oppure", "benché", "sebbene",
    "affinché", "prima che", "a patto che", "senza che", "nonostante", "dal momento che", "da una parte", "dall'altra",
    "prima di tutto", "in conclusione", "per questo", "in realtà", "innanzitutto", "in primo luogo", "insomma", "a mio parere"]},

  // Tempusigenkänning i skrivuppgifterna: som i Italienska 1 och 2, plus condizionale och congiuntivo
  tenseCheck: {
    "condizionale": t => /(^|[^\p{L}])\p{L}+(rei|resti|rebbe|remmo|reste|rebbero)(?![\p{L}])/iu.test(t),
    "congiuntivo": t => /(^|[^\p{L}])(sia|siano|siate|abbia|abbiano|faccia|facciano|vada|vadano|venga|vengano|possa|possano|debba|voglia|sappia|stia|dica|\p{L}+(assi|asse|assimo|assero|essi|esse|essimo|essero|issi|isse|issimo|issero)|fossi|fosse|fossimo|fossero)(?![\p{L}])/iu.test(t)
  },

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: congiuntivo eller indikativ, condizionale, passiv, och ett sambandsord som passar.",
  cultureIntro: "Läs en text om Italien, svara på en fråga och jämför med hur det är i Sverige.",

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna ärvs från Italienska 2; här läggs congiuntivo (presente, passato, imperfetto) och condizionale passato till.
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "cong", name: "Congiuntivo presente", sub: "che io sia, abbia, faccia, vada, possa", tenses: ["congiuntivo presente"]},
      {id: "congpass", name: "Congiuntivo passato", sub: "che abbia fatto, che sia partito/partita", tenses: ["congiuntivo passato"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "se avessi, se fossi, vorrei che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "condpass", name: "Condizionale passato", sub: "avrei voluto, sarei venuto/venuta", tenses: ["condizionale passato"]},
      {id: "mix5", name: "Blandat för B1", sub: "congiuntivo, condizionale och condizionale passato", tenses: ["congiuntivo presente", "congiuntivo imperfetto", "condizionale", "condizionale passato"]}
    ]
  }
};
