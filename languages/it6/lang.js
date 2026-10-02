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

  // Tempusigenkänning i skrivuppgifterna: som i Italienska 1 och 2, plus condizionale, congiuntivo och passato remoto.
  // Ord för ord med en verbstam före ändelsen; condizionale och congiuntivo som i it5/lang.js (undantagen förklaras där).
  // Passato remoto: vanliga starka former (fu, ebbe, disse, nacque …) och -ò/-arono/-erono/-irono/-ettero/-ì med en stam,
  // men inte futuro (andrò, farò, parlerò), però, può, ciò, così och veckodagarna; -é och -ette bara för verb på -ere
  // (credé, dovette), inte perché, trentatré, biciclette, diciassette och permette. Testas i tests/run_tests.py.
  tenseCheck: (() => {
    const words = t => t.match(/\p{L}+/gu) || [];
    const cond = /(er|ir|vr|rr|dr|[aeiou]tr|[aeiou]pr)(ei|esti|ebbe|emmo|este|ebbero)$|^(ri|dis|contraf|sod)?(d|f|s|st)ar(ei|esti|ebbe|emmo|este|ebbero)$/iu;
    const notCond = /^(aerei|arresti)$|corremmo$/iu;
    const congW = /^(sia|siano|siate|abbia|abbiano|abbiate|vada|vadano|venga|vengano|possa|possano|debba|debbano|vogliano|sappia|sappiano|stia|stiano|dica|dicano|facciano|fossi|fosse|fossimo|fossero|dessi|desse|dessimo|dessero|stessimo|stessero)$/iu;
    const congNoun = /^(voglia|faccia)$/iu, nounBefore = /^(ho|hai|ha|abbiamo|avete|hanno|avevo|aveva|la|una|di|della|nella|sulla|in|poca|tanta|molta|nessuna|senza|mia|tua|sua)$/iu;
    const congImp = /^\p{L}{2,}[aei]ss(i|e|imo|ero)$/iu;
    const notCong = new RegExp("^(cla|ripa|sorpa|compa|mata|sinta|ipota|rila|(in|s)?gra|(ab|s)?ba|(am|s)?ma|(in|s)?ca|(pro|pre|per|am|com|ri|tras|dis|im|scom|o|s)me)ss[ie]$"
      + "|(press|ccess|ocess|gress|pless|nness|teress|ssess|ntess|oress|ipess|uchess)[ie]$|^(stess|spess|abiss|ecliss)"
      + "|(scr|vv|onv|dd)iss(i|e|ero)$|^(riv|pred|bened|maled)iss|^(ri)?elesse$", "iu");
    const verbIssimo = /^(fin|cap|dorm|part|ven|usc|sent|prefer|apr|offr|segu|serv|riusc|mor|sal|un|pul|sped|costru|scopr|sugger|vest)issimo$/iu;
    // Futuro som it1/lang.js, så att andrò och farò inte räknas som passato remoto
    const fut = /(er|ir|vr|rr|dr|[aeiou]tr|[aeiou]pr)(ò|ai|à|emo|ete|anno)$|^(ri|dis|contraf|sod)?(d|f|s|st)ar(ò|ai|à|emo|ete|anno)$/iu;
    const notFut = /^((ri|at)?tir|gir|(i|a|re|so|tra)spir|ammir|sper|disper|oper|super|consider|liber|gener|alter|esager|toller|cooper)(ò|ai)$|^(però|supremo|operai)$/iu;
    const prW = /^(fu|furono|fui|ebbe|ebbero|ebbi|fece|fecero|feci|disse|dissero|dissi|nacque|nacquero|nacqui|scrisse|scrissero|scrissi|venne|vennero|venni|decise|decisero|prese|presero|vide|videro|vidi|volle|vollero|volli|seppe|seppero|seppi|visse|vissero|vissi|mise|misero|misi|rimase|rimasero|rimasi|diede|diedero|diedi|chiese|chiesero|chiesi|rispose|risposero|risposi|conobbe|conobbero|conobbi|lesse|lessero|scelse|scelsero|vinse|vinsero|perse|persero|morì|morirono)$/iu;
    const prEnd = /^\p{L}{2,}(ò|arono|erono|irono|ettero|ì)$|(cred|vend|ricev|pot|batt|tem|god|perd|ced|ripet|esist|insist|resist)é$|^(st|d|dov|ricev|sed|cred|perd|tem|god|ced|conced|batt|abbatt|esist|insist|resist|pot|vend|ripet)ette$/iu;
    const notPr = /^(però|può|ciò|perciò|falò|casinò|oblò|comò|rococò|ridò|ahò|niccolò|nicolò|bordò|mazzarò|così|costì|colì|lunedì|martedì|mercoledì|giovedì|venerdì|buondì|mezzodì|tassì|colibrì|pipì|forlì|bensì|funiculì|salò)$/iu;
    return {
      "condizionale": t => words(t).some(w => cond.test(w) && !notCond.test(w)),
      "congiuntivo": t => words(t).some((w, i, ws) => congW.test(w) || (congNoun.test(w) && !nounBefore.test(ws[i - 1] || ""))
        || (congImp.test(w) && !notCong.test(w) && (!/issimo$/i.test(w) || verbIssimo.test(w)))),
      "passato remoto": t => words(t).some(w => prW.test(w) || (prEnd.test(w) && !notPr.test(w) && !(fut.test(w) && !notFut.test(w))))
    };
  })(),

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
