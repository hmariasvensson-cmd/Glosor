/* Inställningar för tyska (Tyska 5, mot B2). Orden ligger i words.txt och videorna i videos.json. */
LANGUAGES.de = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 5",          // kursen som ordlistan hör till
  level: "B1 → B2",           // ungefärlig nivå i europeiska språkskalan (GERS/CEFR)
  inLang: "på tyska",
  tts: "de-DE",
  etyLabel: "Kommentar",               // rubrik för sjätte fältet i words.txt
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  // Artikeln är en del av svaret på tyska, så inget tas bort före rättningen
  articles: [],
  // Tas bort när luckan i en mening jämförs med grundformen (för ledtråden)
  hintStrip: /^(der|die|das|den|dem|des) /,
  pronouns: /^(er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) ?/,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  genderGame: {m: "der", f: "die", n: "das"},   // spelet der, die, das och plural

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i Präteritum eller Perfekt, och ett bindeord som passar ordföljden.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",
  connectors: ["zuerst","dann","danach","schließlich","zum Schluss","aber","jedoch","trotzdem","obwohl","weil","denn","da",
    "deshalb","deswegen","daher","also","außerdem","zudem","auch","sondern","während","wenn","als","nachdem","bevor","dass","ob",
    "damit","sodass","einerseits","andererseits","zum Beispiel","meiner Meinung nach","im Gegensatz dazu","nicht nur","sowohl"],
  // Enkel igenkänning av tempus i elevens text (för checklistan, inte för rättning)
  tenseCheck: {
    "Präsens": t => t.trim().length > 0,
    "Perfekt": t => /(^|[^\p{L}])(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)(?![\p{L}])[^.!?]{0,80}[^\p{L}]ge\p{L}+(t|en)(?![\p{L}])/iu.test(t),
    "Präteritum": t => /(^|[^\p{L}])(war|warst|waren|wart|hatte|hatten|hattest|ging|gingen|kam|kamen|wurde|wurden|machte|machten|sagte|sagten|fuhr|fuhren|sah|sahen|gab|gaben|nahm|nahmen|dachte|dachten|konnte|konnten|musste|mussten|wollte|wollten|durfte|durften|fand|fanden|lebte|lebten|wohnte|wohnten|arbeitete|arbeiteten)(?![\p{L}])/iu.test(t),
    "Konjunktiv II": t => /(^|[^\p{L}])(würde|würdest|würden|würdet|hätte|hättest|hätten|wäre|wärst|wären|könnte|könnten|müsste|müssten|dürfte|sollte|sollten)(?![\p{L}])/iu.test(t),
    "Passiv": t => /(^|[^\p{L}])(wird|werden|wurde|wurden|worden)(?![\p{L}])[^.!?]{0,80}[^\p{L}]ge\p{L}+(t|en)(?![\p{L}])/iu.test(t)
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se content/GRAMMATIK-SPEC.md).
  // Adjektivändelser skapas i programmet av ordlistans substantiv och tabellen i src/grammar.js.
  grammar: {
    topics: [
      {id: "adj", name: "Adjektivändelser", sub: "einen neuen Plan, mit dem neuen Plan …"},
      {id: "praep", name: "Kasus efter preposition", sub: "Wo? eller wohin? Dativ eller ackusativ."},
      {id: "bisatz", name: "Bisatsordföljd", sub: "Sätt ihop meningar med weil, deshalb och denn."},
      {id: "relativ", name: "Relativsatser", sub: "der Mann, mit dem ich spreche"},
      {id: "verbprep", name: "Verb med preposition", sub: "warten auf, sich freuen über – darauf, worauf"},
      {id: "konj", name: "Konjunktiv", sub: "Wenn ich Zeit hätte … och indirekt tal: Er sagt, er sei müde."},
      {id: "passiv", name: "Passiv", sub: "wird gebaut, wurde gebaut, muss gebaut werden"},
      {id: "zuinf", name: "zu-infinitiv", sub: "um … zu, damit, ohne … zu"},
      {id: "perfekt", name: "Perfekt: haben eller sein?", sub: "Ich bin eingeschlafen. Nachdem ich gegessen hatte …"},
      {id: "bindeord", name: "Bindeord och ordföljd", sub: "obwohl, trotzdem, deshalb, denn"},
      {id: "err", name: "Hitta felet", sub: "En mening har ett fel. Vilket ord?"}
    ],
    rules: {
      "adj-def": "Adjektiv efter der/die/das", "adj-indef": "Adjektiv efter ein/kein",
      "wechsel-dat": "Wechselpräposition: var? → dativ", "wechsel-akk": "Wechselpräposition: vart? → ackusativ",
      "dat-prep": "Prepositioner med dativ", "akk-prep": "Prepositioner med ackusativ", "gen-prep": "Prepositioner med genitiv",
      "rel-nom": "Relativpronomen i nominativ", "rel-akk": "Relativpronomen i ackusativ", "rel-dat": "Relativpronomen i dativ",
      "rel-gen": "dessen och deren", "rel-prep": "Preposition + relativpronomen", "rel-was": "was och wo",
      "vp-prep": "Vilken preposition hör till verbet?", "vp-kasus": "Kasus efter verbets preposition", "vp-da": "da-ord", "vp-wo": "wo-ord",
      "pf-sein": "Perfekt med sein", "pf-haben": "Perfekt med haben", "plq": "Pluskvamperfekt",
      "bs-sub": "Subjunktion: verbet sist", "bs-inv": "Adverb: verbet direkt efter", "bs-konj": "Konjunktion: ingen ändring", "bs-first": "Bisatsen först",
      "k2-wenn": "Konjunktiv II i villkor", "k2-wunsch": "Konjunktiv II: önskan och artighet", "k2-verg": "Konjunktiv II i dåtid", "k1-rede": "Indirekt tal (Konjunktiv I)",
      "pa-praes": "Passiv i presens", "pa-praet": "Passiv i preteritum", "pa-perf": "Passiv i perfekt", "pa-modal": "Passiv med modalverb", "pa-zustand": "Tillståndspassiv",
      "zu-inf": "Infinitiv med zu", "umzu": "um … zu", "damit": "damit", "ohne-statt": "ohne … zu, statt … zu",
      "bi-grund": "Orsak: weil, denn, deshalb", "bi-kontrast": "Motsats: obwohl, trotzdem, aber", "bi-folge": "Följd: deshalb, sodass", "bi-tillagg": "Tillägg: außerdem, zudem"
    },
    adj: {
      adjectives: ["neu", "wichtig", "bekannt", "typisch", "groß", "aktuell", "gut"],
      frames: {
        nom: ["{A} {ADJ} {N} ist wichtig.", "Das ist {A} {ADJ} {N}."],
        akk: ["Wir sprechen über {A} {ADJ} {N}.", "Es geht um {A} {ADJ} {N}."],
        dat: ["Das hat mit {A} {ADJ} {N} zu tun.", "Wir beginnen mit {A} {ADJ} {N}."]
      }
    }
  },

  verbs: {
    persons: ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"],
    prefix: (i, form, persons) => persons[i] + " ",
    sv: {sein: "vara", haben: "ha", werden: "bli", wissen: "veta", fahren: "åka", lesen: "läsa",
         sprechen: "tala", nehmen: "ta", geben: "ge", sehen: "se", können: "kunna", müssen: "måste",
         dürfen: "få", wollen: "vilja", arbeiten: "arbeta", gehen: "gå", denken: "tänka",
         bleiben: "stanna", schreiben: "skriva"},

    games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "tempus", name: "Tempus", sub: "Präteritum, Perfekt och Konjunktiv II", tenses: ["Präteritum", "Perfekt", "Konjunktiv II"]}
    ],

    tenses: {
      "Präsens": {
        sein: ["bin","bist","ist","sind","seid","sind"],
        haben: ["habe","hast","hat","haben","habt","haben"],
        werden: ["werde","wirst","wird","werden","werdet","werden"],
        wissen: ["weiß","weißt","weiß","wissen","wisst","wissen"],
        fahren: ["fahre","fährst","fährt","fahren","fahrt","fahren"],
        lesen: ["lese","liest","liest","lesen","lest","lesen"],
        sprechen: ["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],
        nehmen: ["nehme","nimmst","nimmt","nehmen","nehmt","nehmen"],
        geben: ["gebe","gibst","gibt","geben","gebt","geben"],
        sehen: ["sehe","siehst","sieht","sehen","seht","sehen"],
        können: ["kann","kannst","kann","können","könnt","können"],
        müssen: ["muss","musst","muss","müssen","müsst","müssen"],
        dürfen: ["darf","darfst","darf","dürfen","dürft","dürfen"],
        wollen: ["will","willst","will","wollen","wollt","wollen"],
        arbeiten: ["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"],
        rule: "Starka verb byter ofta vokal i du och er/sie/es: fahren – du fährst, sprechen – du sprichst. Wir och sie/Sie har alltid infinitivformen."
      },
      "Präteritum": {
        sein: ["war","warst","war","waren","wart","waren"],
        haben: ["hatte","hattest","hatte","hatten","hattet","hatten"],
        werden: ["wurde","wurdest","wurde","wurden","wurdet","wurden"],
        fahren: ["fuhr","fuhrst","fuhr","fuhren","fuhrt","fuhren"],
        sprechen: ["sprach","sprachst","sprach","sprachen","spracht","sprachen"],
        nehmen: ["nahm","nahmst","nahm","nahmen","nahmt","nahmen"],
        gehen: ["ging","gingst","ging","gingen","gingt","gingen"],
        denken: ["dachte","dachtest","dachte","dachten","dachtet","dachten"],
        können: ["konnte","konntest","konnte","konnten","konntet","konnten"],
        arbeiten: ["arbeitete","arbeitetest","arbeitete","arbeiteten","arbeitetet","arbeiteten"],
        rule: "Svaga verb: stam + -te (arbeitete). Starka verb byter vokal och har ingen ändelse i ich och er/sie/es: ich fuhr, er nahm."
      },
      "Perfekt": {
        fahren: ["bin gefahren","bist gefahren","ist gefahren","sind gefahren","seid gefahren","sind gefahren"],
        gehen: ["bin gegangen","bist gegangen","ist gegangen","sind gegangen","seid gegangen","sind gegangen"],
        bleiben: ["bin geblieben","bist geblieben","ist geblieben","sind geblieben","seid geblieben","sind geblieben"],
        nehmen: ["habe genommen","hast genommen","hat genommen","haben genommen","habt genommen","haben genommen"],
        schreiben: ["habe geschrieben","hast geschrieben","hat geschrieben","haben geschrieben","habt geschrieben","haben geschrieben"],
        denken: ["habe gedacht","hast gedacht","hat gedacht","haben gedacht","habt gedacht","haben gedacht"],
        arbeiten: ["habe gearbeitet","hast gearbeitet","hat gearbeitet","haben gearbeitet","habt gearbeitet","haben gearbeitet"],
        rule: "Haben eller sein i presens + perfekt particip. Verb som betyder förflyttning eller förändring (fahren, gehen) och bleiben tar sein."
      },
      "Konjunktiv II": {
        sein: ["wäre","wärst/wärest","wäre","wären","wärt/wäret","wären"],
        haben: ["hätte","hättest","hätte","hätten","hättet","hätten"],
        werden: ["würde","würdest","würde","würden","würdet","würden"],
        können: ["könnte","könntest","könnte","könnten","könntet","könnten"],
        müssen: ["müsste","müsstest","müsste","müssten","müsstet","müssten"],
        rule: "Konjunktiv II uttrycker önskningar, artighet och villkor: Wenn ich Zeit hätte, würde ich kommen. Bildas av preteritum med omljud: hatte – hätte."
      }
    },

    notes: {
      "Präsens|sein": "Helt oregelbundet. Lär dig formerna utantill.",
      "Präsens|haben": "Oregelbundet i du hast och er hat.",
      "Präsens|werden": "Oregelbundet: du wirst, er wird. Används också för futurum och passiv.",
      "Präsens|wissen": "Böjs som ett modalverb: ich weiß och er weiß är lika.",
      "Präsens|lesen": "Du liest och er liest är lika, eftersom s-ljudet redan finns i stammen.",
      "Präsens|können": "Modalverb: ich och er/sie/es har samma form och ingen ändelse.",
      "Präsens|müssen": "Modalverb: ich och er/sie/es har samma form och ingen ändelse.",
      "Präsens|dürfen": "Modalverb: ich och er/sie/es har samma form och ingen ändelse.",
      "Präsens|wollen": "Modalverb: ich och er/sie/es har samma form och ingen ändelse.",
      "Präsens|arbeiten": "Stammen slutar på -t, så ett e skjuts in: du arbeitest, er arbeitet.",
      "Präteritum|denken": "Blandat verb: vokalbyte och -te-ändelse: denken – dachte – gedacht.",
      "Präteritum|werden": "Wurde används också i passiv: Das Haus wurde gebaut.",
      "Konjunktiv II|werden": "Würde + infinitiv är det vanligaste sättet att bilda konjunktiv II: ich würde gern reisen."
    }
  }
};
