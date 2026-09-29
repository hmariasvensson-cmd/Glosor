/* Inställningar för Italienska 6 (steg 6, B1.2, mot CELI 2 och delar av CELI 3). Artiklar, pronomen, elision,
   bindeord, tempusigenkänning och verbtabeller hämtas från Italienska 2 (languages/it2/lang.js), som i sin tur ärver
   från Italienska 1, se extends och inherit nedan. Spec: docs/nivaer-italienska.md (steg 6). */
LANGUAGES.it6 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 6",
  courseGy25: "Moderna språk – fördjupning, nivå 2",
  step: 6,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B1 → B2",              // steg 6 ≈ B1.2 enligt Skolverket, på väg mot B2
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  nextCourse: "it7",            // kursen man går vidare till när den här är klar
  storageKey: "glosor-it6-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "it2",                // fälten i inherit hämtas från Italienska 2 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "CELI 2 (B1)", level: "B1"},   // provmålet; CELI 3-delar (competenza linguistica) finns som delmål i exam.json

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  // Sambandsord som räknas i skrivchecklistan, utöver dem som ärvs från Italienska 1
  connectors: {$append: ["perciò", "anche se", "comunque", "infatti", "cioè", "tuttavia", "oppure", "benché", "sebbene",
    "affinché", "purché", "a patto che", "nonostante", "dal momento che", "pertanto", "dunque", "da una parte", "dall'altra",
    "in primo luogo", "in secondo luogo", "innanzitutto", "in conclusione", "in realtà", "insomma", "a mio parere",
    "al contrario", "d'altra parte", "in effetti", "di conseguenza", "anzi", "eppure", "qualora", "visto che", "poiché"]},

  // Tempusigenkänning i skrivuppgifterna: som i Italienska 1 och 2, plus condizionale, congiuntivo och passato remoto
  tenseCheck: {
    "condizionale": t => /(^|[^\p{L}])\p{L}+(rei|resti|rebbe|remmo|reste|rebbero)(?![\p{L}])/iu.test(t),
    "congiuntivo": t => /(^|[^\p{L}])(sia|siano|abbia|abbiano|faccia|vada|venga|possa|debba|voglia|sappia|stia|dica|fossi|fosse|fossimo|fossero|avessi|avesse|avessimo|avessero|\p{L}+(assi|asse|assimo|assero|essi|esse|essimo|essero|issi|isse|issimo|issero))(?![\p{L}])/iu.test(t),
    "passato remoto": t => /(^|[^\p{L}])(fu|furono|ebbe|ebbero|fece|fecero|disse|dissero|nacque|morì|scrisse|scrissero|venne|vennero|\p{L}+(ò|òno|ettero|irono|arono|erono|é))(?![\p{L}])/iu.test(t)
  },

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: passato remoto, congiuntivo imperfetto eller trapassato, rätt form i om-satsen och ett sambandsord som passar.",
  cultureIntro: "Läs en text om Italien, svara på en fråga och jämför med hur det är i Sverige.",

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna ärvs från Italienska 2; här läggs passato remoto, congiuntivo imperfetto och trapassato
  // samt condizionale passato till för ett urval vanliga verb.
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "rem", name: "Passato remoto", sub: "fu, ebbe, fece, disse, nacque, scrisse", tenses: ["passato remoto"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "se fossi, se avessi, volevo che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "congtrap", name: "Congiuntivo trapassato", sub: "se avessi saputo, se fosse arrivata", tenses: ["congiuntivo trapassato"]},
      {id: "condpass", name: "Condizionale passato", sub: "avrei fatto, sarei venuto/venuta", tenses: ["condizionale passato"]},
      {id: "mix6", name: "Om-satser och tempusföljd", sub: "congiuntivo imperfetto och trapassato, condizionale passato", tenses: ["congiuntivo imperfetto", "congiuntivo trapassato", "condizionale passato"]}
    ]
  }
};
