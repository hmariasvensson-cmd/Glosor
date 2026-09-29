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
    sv: {credere: "tro"},
    games: [
      {id: "rem", name: "Passato remoto", sub: "fu, ebbe, fece, disse, nacque, scrisse", tenses: ["passato remoto"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "se fossi, se avessi, volevo che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "congtrap", name: "Congiuntivo trapassato", sub: "se avessi saputo, se fosse arrivata", tenses: ["congiuntivo trapassato"]},
      {id: "condpass", name: "Condizionale passato", sub: "avrei fatto, sarei venuto/venuta", tenses: ["condizionale passato"]},
      {id: "mix6", name: "Om-satser och tempusföljd", sub: "congiuntivo imperfetto och trapassato, condizionale passato", tenses: ["congiuntivo imperfetto", "congiuntivo trapassato", "condizionale passato"]}
    ],
    tenses: {
      "passato remoto": {
        essere: ["fui", "fosti", "fu", "fummo", "foste", "furono"],
        avere: ["ebbi", "avesti", "ebbe", "avemmo", "aveste", "ebbero"],
        fare: ["feci", "facesti", "fece", "facemmo", "faceste", "fecero"],
        dire: ["dissi", "dicesti", "disse", "dicemmo", "diceste", "dissero"],
        venire: ["venni", "venisti", "venne", "venimmo", "veniste", "vennero"],
        vedere: ["vidi", "vedesti", "vide", "vedemmo", "vedeste", "videro"],
        scrivere: ["scrissi", "scrivesti", "scrisse", "scrivemmo", "scriveste", "scrissero"],
        nascere: ["nacqui", "nascesti", "nacque", "nascemmo", "nasceste", "nacquero"],
        parlare: ["parlai", "parlasti", "parlò", "parlammo", "parlaste", "parlarono"],
        credere: ["credei", "credesti", "credé", "credemmo", "credeste", "crederono"],
        partire: ["partii", "partisti", "partì", "partimmo", "partiste", "partirono"],
        prendere: ["presi", "prendesti", "prese", "prendemmo", "prendeste", "presero"],
        rule: "Används i skrift om avslutade händelser långt tillbaka: historia, biografier, romaner. Regelbundna verb: -ai, -asti, -ò, -ammo, -aste, -arono (parlai, parlò); -ei/-etti (credei, credé); -ii, -isti, -ì (partii, partì). Många vanliga verb är oregelbundna i io, lui/lei och loro (feci, fece, fecero) men regelbundna i tu, noi och voi (facesti, facemmo)."
      },
      "congiuntivo imperfetto": {
        essere: ["fossi", "fossi", "fosse", "fossimo", "foste", "fossero"],
        avere: ["avessi", "avessi", "avesse", "avessimo", "aveste", "avessero"],
        fare: ["facessi", "facessi", "facesse", "facessimo", "faceste", "facessero"],
        dire: ["dicessi", "dicessi", "dicesse", "dicessimo", "diceste", "dicessero"],
        stare: ["stessi", "stessi", "stesse", "stessimo", "steste", "stessero"],
        dare: ["dessi", "dessi", "desse", "dessimo", "deste", "dessero"],
        bere: ["bevessi", "bevessi", "bevesse", "bevessimo", "beveste", "bevessero"],
        parlare: ["parlassi", "parlassi", "parlasse", "parlassimo", "parlaste", "parlassero"],
        prendere: ["prendessi", "prendessi", "prendesse", "prendessimo", "prendeste", "prendessero"],
        partire: ["partissi", "partissi", "partisse", "partissimo", "partiste", "partissero"],
        venire: ["venissi", "venissi", "venisse", "venissimo", "veniste", "venissero"],
        potere: ["potessi", "potessi", "potesse", "potessimo", "poteste", "potessero"],
        rule: "Stammen från imperfetto (parla-vo → parla-) + -ssi, -ssi, -sse, -ssimo, -ste, -ssero. Används efter che när huvudsatsen står i dåtid eller condizionale (Volevo che tu venissi) och i overkliga om-satser (Se avessi tempo, …). Oregelbundna: fossi, dessi, stessi; fare, dire och bere bygger på gamla stammar (facessi, dicessi, bevessi)."
      },
      "congiuntivo trapassato": {
        essere: ["fossi stato/fossi stata", "fossi stato/fossi stata", "fosse stato/fosse stata", "fossimo stati/fossimo state", "foste stati/foste state", "fossero stati/fossero state"],
        avere: ["avessi avuto", "avessi avuto", "avesse avuto", "avessimo avuto", "aveste avuto", "avessero avuto"],
        fare: ["avessi fatto", "avessi fatto", "avesse fatto", "avessimo fatto", "aveste fatto", "avessero fatto"],
        sapere: ["avessi saputo", "avessi saputo", "avesse saputo", "avessimo saputo", "aveste saputo", "avessero saputo"],
        partire: ["fossi partito/fossi partita", "fossi partito/fossi partita", "fosse partito/fosse partita", "fossimo partiti/fossimo partite", "foste partiti/foste partite", "fossero partiti/fossero partite"],
        venire: ["fossi venuto/fossi venuta", "fossi venuto/fossi venuta", "fosse venuto/fosse venuta", "fossimo venuti/fossimo venute", "foste venuti/foste venute", "fossero venuti/fossero venute"],
        studiare: ["avessi studiato", "avessi studiato", "avesse studiato", "avessimo studiato", "aveste studiato", "avessero studiato"],
        dire: ["avessi detto", "avessi detto", "avesse detto", "avessimo detto", "aveste detto", "avessero detto"],
        rule: "Congiuntivo imperfetto av avere eller essere + particip: avessi fatto, fossi partito/partita. Används om något som hade hänt före en annan dåtid (Pensavo che fosse già partito) och i overkliga om-satser om det förflutna (Se avessi saputo, sarei venuto)."
      },
      "condizionale passato": {
        essere: ["sarei stato/sarei stata", "saresti stato/saresti stata", "sarebbe stato/sarebbe stata", "saremmo stati/saremmo state", "sareste stati/sareste state", "sarebbero stati/sarebbero state"],
        avere: ["avrei avuto", "avresti avuto", "avrebbe avuto", "avremmo avuto", "avreste avuto", "avrebbero avuto"],
        fare: ["avrei fatto", "avresti fatto", "avrebbe fatto", "avremmo fatto", "avreste fatto", "avrebbero fatto"],
        venire: ["sarei venuto/sarei venuta", "saresti venuto/saresti venuta", "sarebbe venuto/sarebbe venuta", "saremmo venuti/saremmo venute", "sareste venuti/sareste venute", "sarebbero venuti/sarebbero venute"],
        volere: ["avrei voluto", "avresti voluto", "avrebbe voluto", "avremmo voluto", "avreste voluto", "avrebbero voluto"],
        dovere: ["avrei dovuto", "avresti dovuto", "avrebbe dovuto", "avremmo dovuto", "avreste dovuto", "avrebbero dovuto"],
        potere: ["avrei potuto", "avresti potuto", "avrebbe potuto", "avremmo potuto", "avreste potuto", "avrebbero potuto"],
        andare: ["sarei andato/sarei andata", "saresti andato/saresti andata", "sarebbe andato/sarebbe andata", "saremmo andati/saremmo andate", "sareste andati/sareste andate", "sarebbero andati/sarebbero andate"],
        rule: "Condizionale av avere eller essere + particip: avrei fatto, sarei venuto/venuta. Används om något som skulle ha hänt (Se avessi saputo, sarei venuto), för framtid i dåtid (Ha detto che sarebbe arrivato) och för uppgifter man inte står för (Secondo la stampa, il ministro avrebbe mentito)."
      }
    },
    notes: {
      "passato remoto|essere": "Helt oregelbundet: fui, fu, furono. Vanligt i historia: L'Italia fu unificata nel 1861.",
      "passato remoto|avere": "Oregelbundet i io, lui/lei och loro: ebbi, ebbe, ebbero.",
      "passato remoto|nascere": "Nacque (föddes) står i nästan varje biografi: Dante nacque a Firenze nel 1265.",
      "passato remoto|credere": "-ere-verb har två former: credé/credette, crederono/credettero.",
      "congiuntivo imperfetto|essere": "Helt oregelbundet: fossi, fosse, fossero.",
      "congiuntivo imperfetto|stare": "Stessi, inte *stassi.",
      "congiuntivo imperfetto|dare": "Dessi, inte *dassi.",
      "condizionale passato|venire": "Rörelseverb tar essere, och participet böjs: sarebbe venuta."
    }
  }
};
