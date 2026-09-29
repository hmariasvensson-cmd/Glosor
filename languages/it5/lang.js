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
    sv: {comprare: "köpa"},
    games: [
      {id: "cong", name: "Congiuntivo presente", sub: "che io sia, abbia, faccia, vada, possa", tenses: ["congiuntivo presente"]},
      {id: "congpass", name: "Congiuntivo passato", sub: "che abbia fatto, che sia partito/partita", tenses: ["congiuntivo passato"]},
      {id: "congimp", name: "Congiuntivo imperfetto", sub: "se avessi, se fossi, vorrei che tu venissi", tenses: ["congiuntivo imperfetto"]},
      {id: "condpass", name: "Condizionale passato", sub: "avrei voluto, sarei venuto/venuta", tenses: ["condizionale passato"]},
      {id: "mix5", name: "Blandat för B1", sub: "congiuntivo, condizionale och condizionale passato", tenses: ["congiuntivo presente", "congiuntivo imperfetto", "condizionale", "condizionale passato"]}
    ],
    tenses: {
      "congiuntivo presente": {
        essere: ["sia", "sia", "sia", "siamo", "siate", "siano"],
        avere: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"],
        fare: ["faccia", "faccia", "faccia", "facciamo", "facciate", "facciano"],
        andare: ["vada", "vada", "vada", "andiamo", "andiate", "vadano"],
        venire: ["venga", "venga", "venga", "veniamo", "veniate", "vengano"],
        stare: ["stia", "stia", "stia", "stiamo", "stiate", "stiano"],
        dire: ["dica", "dica", "dica", "diciamo", "diciate", "dicano"],
        sapere: ["sappia", "sappia", "sappia", "sappiamo", "sappiate", "sappiano"],
        volere: ["voglia", "voglia", "voglia", "vogliamo", "vogliate", "vogliano"],
        potere: ["possa", "possa", "possa", "possiamo", "possiate", "possano"],
        dovere: ["debba", "debba", "debba", "dobbiamo", "dobbiate", "debbano"],
        uscire: ["esca", "esca", "esca", "usciamo", "usciate", "escano"],
        parlare: ["parli", "parli", "parli", "parliamo", "parliate", "parlino"],
        prendere: ["prenda", "prenda", "prenda", "prendiamo", "prendiate", "prendano"],
        partire: ["parta", "parta", "parta", "partiamo", "partiate", "partano"],
        finire: ["finisca", "finisca", "finisca", "finiamo", "finiate", "finiscano"],
        capire: ["capisca", "capisca", "capisca", "capiamo", "capiate", "capiscano"],
        rule: "Används efter uttryck för åsikt, vilja, känsla och tvivel (penso che, voglio che, sono contento che, dubito che) och efter benché, affinché, prima che, a patto che, senza che. -are får -i (parli), -ere och -ire får -a (prenda, parta). Io, tu och lui/lei har samma form."
      },
      "congiuntivo passato": {
        fare: ["abbia fatto", "abbia fatto", "abbia fatto", "abbiamo fatto", "abbiate fatto", "abbiano fatto"],
        capire: ["abbia capito", "abbia capito", "abbia capito", "abbiamo capito", "abbiate capito", "abbiano capito"],
        dire: ["abbia detto", "abbia detto", "abbia detto", "abbiamo detto", "abbiate detto", "abbiano detto"],
        vedere: ["abbia visto", "abbia visto", "abbia visto", "abbiamo visto", "abbiate visto", "abbiano visto"],
        leggere: ["abbia letto", "abbia letto", "abbia letto", "abbiamo letto", "abbiate letto", "abbiano letto"],
        scrivere: ["abbia scritto", "abbia scritto", "abbia scritto", "abbiamo scritto", "abbiate scritto", "abbiano scritto"],
        essere: ["sia stato/sia stata", "sia stato/sia stata", "sia stato/sia stata", "siamo stati/siamo state", "siate stati/siate state", "siano stati/siano state"],
        andare: ["sia andato/sia andata", "sia andato/sia andata", "sia andato/sia andata", "siamo andati/siamo andate", "siate andati/siate andate", "siano andati/siano andate"],
        partire: ["sia partito/sia partita", "sia partito/sia partita", "sia partito/sia partita", "siamo partiti/siamo partite", "siate partiti/siate partite", "siano partiti/siano partite"],
        uscire: ["sia uscito/sia uscita", "sia uscito/sia uscita", "sia uscito/sia uscita", "siamo usciti/siamo uscite", "siate usciti/siate uscite", "siano usciti/siano uscite"],
        rule: "Congiuntivo presente av avere eller essere + particip: che abbia fatto, che sia partito/partita. Används när det man tycker eller känner något om redan har hänt: Penso che Marco abbia già capito. Samma hjälpverb och kongruens som i passato prossimo."
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
        andare: ["andassi", "andassi", "andasse", "andassimo", "andaste", "andassero"],
        potere: ["potessi", "potessi", "potesse", "potessimo", "poteste", "potessero"],
        volere: ["volessi", "volessi", "volesse", "volessimo", "voleste", "volessero"],
        sapere: ["sapessi", "sapessi", "sapesse", "sapessimo", "sapeste", "sapessero"],
        venire: ["venissi", "venissi", "venisse", "venissimo", "veniste", "venissero"],
        partire: ["partissi", "partissi", "partisse", "partissimo", "partiste", "partissero"],
        rule: "Ta bort -re i infinitiven och lägg till -ssi, -ssi, -sse, -ssimo, -ste, -ssero: parla-ssi, pote-ssi, veni-ssi. Essere (fossi), dare (dessi) och stare (stessi) är oregelbundna; fare, dire och bere bygger på de gamla stammarna (facessi, dicessi, bevessi). Används efter se i möjliga om-satser (Se avessi tempo, viaggerei) och efter vorrei che."
      },
      "condizionale passato": {
        volere: ["avrei voluto", "avresti voluto", "avrebbe voluto", "avremmo voluto", "avreste voluto", "avrebbero voluto"],
        potere: ["avrei potuto", "avresti potuto", "avrebbe potuto", "avremmo potuto", "avreste potuto", "avrebbero potuto"],
        dovere: ["avrei dovuto", "avresti dovuto", "avrebbe dovuto", "avremmo dovuto", "avreste dovuto", "avrebbero dovuto"],
        fare: ["avrei fatto", "avresti fatto", "avrebbe fatto", "avremmo fatto", "avreste fatto", "avrebbero fatto"],
        dire: ["avrei detto", "avresti detto", "avrebbe detto", "avremmo detto", "avreste detto", "avrebbero detto"],
        comprare: ["avrei comprato", "avresti comprato", "avrebbe comprato", "avremmo comprato", "avreste comprato", "avrebbero comprato"],
        venire: ["sarei venuto/sarei venuta", "saresti venuto/saresti venuta", "sarebbe venuto/sarebbe venuta", "saremmo venuti/saremmo venute", "sareste venuti/sareste venute", "sarebbero venuti/sarebbero venute"],
        andare: ["sarei andato/sarei andata", "saresti andato/saresti andata", "sarebbe andato/sarebbe andata", "saremmo andati/saremmo andate", "sareste andati/sareste andate", "sarebbero andati/sarebbero andate"],
        partire: ["sarei partito/sarei partita", "saresti partito/saresti partita", "sarebbe partito/sarebbe partita", "saremmo partiti/saremmo partite", "sareste partiti/sareste partite", "sarebbero partiti/sarebbero partite"],
        rule: "Condizionale av avere eller essere + particip: avrei voluto, sarei venuto/venuta. Används för det som skulle ha hänt men inte hände (Avrei voluto aiutarti) och för framtid i dåtid: Ha detto che sarebbe venuto (han sa att han skulle komma)."
      }
    },
    notes: {
      "congiuntivo presente|essere": "Helt oregelbundet: sia, siamo, siate, siano.",
      "congiuntivo presente|andare": "Stammen från io vado: vada. Noi och voi: andiamo, andiate.",
      "congiuntivo presente|uscire": "Stammen från io esco: esca, escano. Noi och voi: usciamo, usciate.",
      "congiuntivo imperfetto|essere": "Helt oregelbundet: fossi, fosse, fossimo, foste, fossero.",
      "congiuntivo imperfetto|fare": "Bygger på den gamla stammen face-: facessi (som imperfetto facevo).",
      "congiuntivo imperfetto|dare": "Oregelbundet: dessi, desse (inte dassi).",
      "congiuntivo imperfetto|stare": "Oregelbundet: stessi, stesse (inte stassi).",
      "condizionale passato|venire": "Rörelseverb tar essere, och participet böjs: sarebbe venuta.",
      "condizionale passato|volere": "Avrei voluto + infinitiv = jag skulle ha velat: Avrei voluto studiare musica."
    }
  }
};
