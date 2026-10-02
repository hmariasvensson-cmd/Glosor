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

  // Tempusigenkänning i skrivuppgifterna: som i Italienska 1 och 2, plus condizionale, congiuntivo och passato remoto.
  // Samma kod som i it6/lang.js (förklaringen står där och i it5/lang.js). Testas i tests/run_tests.py.
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
