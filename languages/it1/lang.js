/* Inställningar för Italienska 1 (A1, nybörjare). Orden ligger i words.txt och videorna i videos.json.
   Kapitel och grammatik följer kursplanen och vanliga läromedel, se docs/italienska-plan.md. */
LANGUAGES.it1 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 1",
  courseGy25: "Moderna språk – nybörjare, nivå 1",
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

  // VERB-BÖRJAN (tabellerna skrivs mellan markeringarna)
  verbs: {
    persons: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
    // Pronomenet skrivs framför verbformen (reflexiva former har redan mi, ti, si … i svaret)
    prefix: (i, form, persons) => persons[i] + " ",
    sv: {parlare: "tala, prata", abitare: "bo", lavorare: "arbeta", studiare: "studera, plugga", mangiare: "äta", cercare: "leta efter, söka", pagare: "betala", prendere: "ta", leggere: "läsa", scrivere: "skriva", vedere: "se", vivere: "leva, bo", dormire: "sova", partire: "åka iväg, resa", sentire: "höra, känna", aprire: "öppna", finire: "sluta, avsluta", capire: "förstå", preferire: "föredra", essere: "vara", avere: "ha", fare: "göra", andare: "gå, åka", venire: "komma", stare: "stå, må, vara", uscire: "gå ut", dare: "ge", dire: "säga", bere: "dricka", sapere: "veta, kunna", rimanere: "stanna, bli kvar", volere: "vilja", potere: "kunna, få", dovere: "måste, behöva", chiamarsi: "heta", alzarsi: "stiga upp", svegliarsi: "vakna", lavarsi: "tvätta sig", vestirsi: "klä på sig", divertirsi: "ha roligt"},

    // Varje spel övar ett urval tempus (och i Italienska 1 ett urval verb). Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres-reg", name: "Regelbundna verb", sub: "parlo, prendi, dorme, finisco", tenses: ["presente"], verbs: ["parlare", "abitare", "lavorare", "studiare", "mangiare", "cercare", "pagare", "prendere", "leggere", "scrivere", "vedere", "vivere", "dormire", "partire", "sentire", "aprire", "finire", "capire", "preferire"]},
      {id: "pres-irr", name: "Oregelbundna verb", sub: "sono, ho, faccio, vado, vengo", tenses: ["presente"], verbs: ["essere", "avere", "fare", "andare", "venire", "stare", "uscire", "dare", "dire", "bere", "sapere", "rimanere"]},
      {id: "pres-mod-rifl", name: "Modala och reflexiva verb", sub: "voglio, posso, devo, mi alzo, ti chiami", tenses: ["presente"], verbs: ["volere", "potere", "dovere", "chiamarsi", "alzarsi", "svegliarsi", "lavarsi", "vestirsi", "divertirsi"]}
    ],

    tenses: {
      "presente": {
        parlare: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"],
        abitare: ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"],
        lavorare: ["lavoro", "lavori", "lavora", "lavoriamo", "lavorate", "lavorano"],
        studiare: ["studio", "studi", "studia", "studiamo", "studiate", "studiano"],
        mangiare: ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"],
        cercare: ["cerco", "cerchi", "cerca", "cerchiamo", "cercate", "cercano"],
        pagare: ["pago", "paghi", "paga", "paghiamo", "pagate", "pagano"],
        prendere: ["prendo", "prendi", "prende", "prendiamo", "prendete", "prendono"],
        leggere: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"],
        scrivere: ["scrivo", "scrivi", "scrive", "scriviamo", "scrivete", "scrivono"],
        vedere: ["vedo", "vedi", "vede", "vediamo", "vedete", "vedono"],
        vivere: ["vivo", "vivi", "vive", "viviamo", "vivete", "vivono"],
        dormire: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"],
        partire: ["parto", "parti", "parte", "partiamo", "partite", "partono"],
        sentire: ["sento", "senti", "sente", "sentiamo", "sentite", "sentono"],
        aprire: ["apro", "apri", "apre", "apriamo", "aprite", "aprono"],
        finire: ["finisco", "finisci", "finisce", "finiamo", "finite", "finiscono"],
        capire: ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"],
        preferire: ["preferisco", "preferisci", "preferisce", "preferiamo", "preferite", "preferiscono"],
        essere: ["sono", "sei", "è", "siamo", "siete", "sono"],
        avere: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
        fare: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
        andare: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
        venire: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"],
        stare: ["sto", "stai", "sta", "stiamo", "state", "stanno"],
        uscire: ["esco", "esci", "esce", "usciamo", "uscite", "escono"],
        dare: ["do", "dai", "dà", "diamo", "date", "danno"],
        dire: ["dico", "dici", "dice", "diciamo", "dite", "dicono"],
        bere: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"],
        sapere: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"],
        rimanere: ["rimango", "rimani", "rimane", "rimaniamo", "rimanete", "rimangono"],
        volere: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
        potere: ["posso", "puoi", "può", "possiamo", "potete", "possono"],
        dovere: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"],
        chiamarsi: ["mi chiamo", "ti chiami", "si chiama", "ci chiamiamo", "vi chiamate", "si chiamano"],
        alzarsi: ["mi alzo", "ti alzi", "si alza", "ci alziamo", "vi alzate", "si alzano"],
        svegliarsi: ["mi sveglio", "ti svegli", "si sveglia", "ci svegliamo", "vi svegliate", "si svegliano"],
        lavarsi: ["mi lavo", "ti lavi", "si lava", "ci laviamo", "vi lavate", "si lavano"],
        vestirsi: ["mi vesto", "ti vesti", "si veste", "ci vestiamo", "vi vestite", "si vestono"],
        divertirsi: ["mi diverto", "ti diverti", "si diverte", "ci divertiamo", "vi divertite", "si divertono"],
        rule: "Ta bort -are, -ere eller -ire och lägg till ändelsen: -o, -i, -a/-e, -iamo, -ate/-ete/-ite, -ano/-ono. Vissa -ire-verb får -isc- (finisco). -care/-gare får h före i (cerchi, paghi). Lei (ni) har samma form som lui/lei. Reflexiva verb har mi, ti, si, ci, vi, si framför: mi alzo."
      }
    },

    notes: {
      "presente|essere": "Helt oregelbundet. Obs: io sono och loro sono har samma form, och è har accent (e utan accent betyder 'och').",
      "presente|avere": "Oregelbundet. H:et uttalas inte: ho, hai, ha, hanno. Abbiamo har dubbel-b.",
      "presente|fare": "Oregelbundet: faccio, facciamo med dubbel-c. Voi fate.",
      "presente|andare": "Oregelbundet: vado, vai, va, vanno – men noi andiamo och voi andate är regelbundna.",
      "presente|venire": "Oregelbundet: vengo och vengono får -g-, vieni och viene får -ie-.",
      "presente|uscire": "Oregelbundet: stammen blir esc- (esco, esci, esce, escono) men usc- i noi och voi.",
      "presente|dare": "Lui/lei dà har accent så att det inte blandas ihop med prepositionen da.",
      "presente|dire": "Stammen blir dic-: dico, dici, dice. Obs: voi dite.",
      "presente|bere": "Stammen är bev- (från latinets bibere): bevo, bevi, beve.",
      "presente|sapere": "Oregelbundet: so, sai, sa, sappiamo, sapete, sanno.",
      "presente|rimanere": "Rimango och rimangono får -g-, precis som vengo.",
      "presente|volere": "Oregelbundet: voglio, vuoi, vuole, vogliamo, volete, vogliono. Artigt: vorrei (jag skulle vilja).",
      "presente|potere": "Oregelbundet: posso, puoi, può, possiamo. Può har accent.",
      "presente|dovere": "Oregelbundet: devo, devi, deve, dobbiamo, dovete, devono.",
      "presente|studiare": "Stammen slutar på i, så tu-formen får bara ett i: tu studi.",
      "presente|mangiare": "Stammen slutar på i, så tu-formen får bara ett i: tu mangi.",
      "presente|cercare": "-care får h före i så att k-ljudet behålls: cerchi, cerchiamo.",
      "presente|pagare": "-gare får h före i så att g-ljudet behålls: paghi, paghiamo.",
      "presente|finire": "Får -isc- i io, tu, lui/lei och loro: finisco, finisci, finisce, finiscono.",
      "presente|capire": "Får -isc- i io, tu, lui/lei och loro: capisco, capisci, capisce, capiscono.",
      "presente|preferire": "Får -isc- i io, tu, lui/lei och loro: preferisco, preferiscono.",
      "presente|chiamarsi": "Reflexivt: mi chiamo, ti chiami, si chiama. Obs: ci chiamiamo, vi chiamate."
    }
  }
  // VERB-SLUT
};
