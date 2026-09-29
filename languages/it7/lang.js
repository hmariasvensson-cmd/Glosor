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
    sv: {decidere: "bestämma", nascere: "födas", conoscere: "känna, lära känna", rompere: "bryta, ha sönder", cadere: "falla", tenere: "hålla", vincere: "vinna", comporre: "komponera", arrivare: "komma fram", tornare: "återvända"},
    games: [
      {id: "remoto", name: "Passato remoto", sub: "fu, ebbe, fece, disse, parlò, partirono", tenses: ["passato remoto"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "come se fosse, se avessi, non sapevo che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "racconto7", name: "Berätta i litterär stil", sub: "passato remoto och imperfetto blandat", tenses: ["passato remoto", "imperfetto"]},
      {id: "tutti7", name: "Alla tempus", sub: "presens, dåtid, futuro, condizionale, congiuntivo och passato remoto", tenses: ["presente", "passato prossimo", "imperfetto", "futuro semplice", "condizionale", "congiuntivo imperfetto", "passato remoto"]}
    ],
    tenses: {
      "passato remoto": {
        essere: ["fui", "fosti", "fu", "fummo", "foste", "furono"],
        avere: ["ebbi", "avesti", "ebbe", "avemmo", "aveste", "ebbero"],
        fare: ["feci", "facesti", "fece", "facemmo", "faceste", "fecero"],
        dire: ["dissi", "dicesti", "disse", "dicemmo", "diceste", "dissero"],
        venire: ["venni", "venisti", "venne", "venimmo", "veniste", "vennero"],
        vedere: ["vidi", "vedesti", "vide", "vedemmo", "vedeste", "videro"],
        volere: ["volli", "volesti", "volle", "volemmo", "voleste", "vollero"],
        sapere: ["seppi", "sapesti", "seppe", "sapemmo", "sapeste", "seppero"],
        prendere: ["presi", "prendesti", "prese", "prendemmo", "prendeste", "presero"],
        scrivere: ["scrissi", "scrivesti", "scrisse", "scrivemmo", "scriveste", "scrissero"],
        leggere: ["lessi", "leggesti", "lesse", "leggemmo", "leggeste", "lessero"],
        mettere: ["misi", "mettesti", "mise", "mettemmo", "metteste", "misero"],
        decidere: ["decisi", "decidesti", "decise", "decidemmo", "decideste", "decisero"],
        nascere: ["nacqui", "nascesti", "nacque", "nascemmo", "nasceste", "nacquero"],
        conoscere: ["conobbi", "conoscesti", "conobbe", "conoscemmo", "conosceste", "conobbero"],
        rimanere: ["rimasi", "rimanesti", "rimase", "rimanemmo", "rimaneste", "rimasero"],
        vivere: ["vissi", "vivesti", "visse", "vivemmo", "viveste", "vissero"],
        chiedere: ["chiesi", "chiedesti", "chiese", "chiedemmo", "chiedeste", "chiesero"],
        rispondere: ["risposi", "rispondesti", "rispose", "rispondemmo", "rispondeste", "risposero"],
        vincere: ["vinsi", "vincesti", "vinse", "vincemmo", "vinceste", "vinsero"],
        tenere: ["tenni", "tenesti", "tenne", "tenemmo", "teneste", "tennero"],
        cadere: ["caddi", "cadesti", "cadde", "cademmo", "cadeste", "caddero"],
        comporre: ["composi", "componesti", "compose", "componemmo", "componeste", "composero"],
        parlare: ["parlai", "parlasti", "parlò", "parlammo", "parlaste", "parlarono"],
        arrivare: ["arrivai", "arrivasti", "arrivò", "arrivammo", "arrivaste", "arrivarono"],
        tornare: ["tornai", "tornasti", "tornò", "tornammo", "tornaste", "tornarono"],
        lavorare: ["lavorai", "lavorasti", "lavorò", "lavorammo", "lavoraste", "lavorarono"],
        credere: ["credei", "credesti", "credé", "credemmo", "credeste", "crederono"],
        partire: ["partii", "partisti", "partì", "partimmo", "partiste", "partirono"],
        dormire: ["dormii", "dormisti", "dormì", "dormimmo", "dormiste", "dormirono"],
        finire: ["finii", "finisti", "finì", "finimmo", "finiste", "finirono"],
        andare: ["andai", "andasti", "andò", "andammo", "andaste", "andarono"],
        dare: ["diedi", "desti", "diede", "demmo", "deste", "diedero"],
        stare: ["stetti", "stesti", "stette", "stemmo", "steste", "stettero"],
        rule: "Passato remoto är berättartempus i litteratur, historia och biografier (och används i tal i delar av Syditalien). Regelbundna verb: -are → -ai, -asti, -ò, -ammo, -aste, -arono; -ere → -ei (-etti), -esti, -é (-ette), -emmo, -este, -erono (-ettero); -ire → -ii, -isti, -ì, -immo, -iste, -irono. Många -ere-verb är oregelbundna enligt 1-3-3-mönstret: io, lui/lei och loro har en egen stam (scrissi, scrisse, scrissero), de andra personerna är regelbundna (scrivesti, scrivemmo, scriveste)."
      },
      "congiuntivo imperfetto": {
        essere: ["fossi", "fossi", "fosse", "fossimo", "foste", "fossero"],
        avere: ["avessi", "avessi", "avesse", "avessimo", "aveste", "avessero"],
        fare: ["facessi", "facessi", "facesse", "facessimo", "faceste", "facessero"],
        dire: ["dicessi", "dicessi", "dicesse", "dicessimo", "diceste", "dicessero"],
        dare: ["dessi", "dessi", "desse", "dessimo", "deste", "dessero"],
        stare: ["stessi", "stessi", "stesse", "stessimo", "steste", "stessero"],
        bere: ["bevessi", "bevessi", "bevesse", "bevessimo", "beveste", "bevessero"],
        parlare: ["parlassi", "parlassi", "parlasse", "parlassimo", "parlaste", "parlassero"],
        potere: ["potessi", "potessi", "potesse", "potessimo", "poteste", "potessero"],
        volere: ["volessi", "volessi", "volesse", "volessimo", "voleste", "volessero"],
        sapere: ["sapessi", "sapessi", "sapesse", "sapessimo", "sapeste", "sapessero"],
        venire: ["venissi", "venissi", "venisse", "venissimo", "veniste", "venissero"],
        capire: ["capissi", "capissi", "capisse", "capissimo", "capiste", "capissero"],
        andare: ["andassi", "andassi", "andasse", "andassimo", "andaste", "andassero"],
        rule: "Ta bort -re i infinitiven och lägg till -ssi, -ssi, -sse, -ssimo, -ste, -ssero: parla-ssi, pote-ssi, veni-ssi. Essere (fossi), dare (dessi) och stare (stessi) är oregelbundna; fare, dire och bere bygger på de gamla stammarna (facessi, dicessi, bevessi). I steg 7 används formen efter come se (Parla come se fosse il capo), i indirekta frågor i dåtid (Non sapevo se fosse vero) och efter superlativ i dåtid (Era il film più bello che avessi mai visto)."
      }
    },
    notes: {
      "passato remoto|essere": "Helt oregelbundet: fui, fosti, fu, fummo, foste, furono. Förväxla inte fu (var, blev) med fui (jag var).",
      "passato remoto|dare": "Även dette och dettero förekommer, men diede och diedero är vanligast i modern prosa.",
      "passato remoto|credere": "Regelbundet -ere-verb: credei eller credetti, credé eller credette.",
      "passato remoto|nascere": "Nacque (föddes) är den form man oftast möter, i biografier: Pirandello nacque nel 1867."
    }
  }
};
