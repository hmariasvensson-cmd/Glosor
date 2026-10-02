/* Inställningar för tyska (Tyska 5, mot B2). Orden ligger i words.txt och videorna i videos.json. */
LANGUAGES.de = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 5",          // kursen som ordlistan hör till
  courseGy25: "Moderna språk – fördjupning, nivå 1",   // samma kurs i Gy25 (gymnasiet från juli 2025)
  step: 5,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "B1 → B2",           // steg 5 ≈ B1.1 enligt Skolverket, kursen för mot B2 (provmålet B2 står i exam)
  inLang: "på tyska",
  tts: "de-DE",
  etyLabel: "Kommentar",               // rubrik för sjätte fältet i words.txt
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  // Valfria avsnitt: ord härifrån kommer bara när eleven själv väljer avsnittet under "Nya ord från"
  elective: {test: /^mt\d$/, label: "Musikteori · bara när du väljer det"},
  nextCourse: "de6",          // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  // Artikeln är en del av svaret på tyska, så inget tas bort före rättningen
  articles: [],
  // Tas bort när luckan i en mening jämförs med grundformen (för ledtråden)
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,
  exam: {name: "Goethe-Zertifikat B2 (eller telc B2/TestDaF)", level: "B2"},   // språkprovet eleven siktar på            // eleven pluggar på egen hand, utan lärare och lärobok (påverkar texterna i appen)
  goal: "att klara språkprovet för att få studera musik utomlands (i Tyskland)",   // valfritt: elevens mål, nämns i Claudes bedömning
  nounCaps: true,             // substantiv skrivs med stor bokstav (ord man sparar från texter behåller sin stavning)
  genderGame: {m: "der", f: "die", n: "das"},   // spelet der, die, das och plural

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i Präteritum eller Perfekt, och ett bindeord som passar ordföljden.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeord som räknas i skrivchecklistan. Ord med andra vanliga betydelser (da, als, damit, auch) är inte med.
  connectors: ["zuerst","dann","danach","schließlich","zum Schluss","aber","jedoch","trotzdem","dennoch","obwohl","weil","denn",
    "deshalb","deswegen","daher","außerdem","zudem","darüber hinaus","sondern","während","wenn","falls","nachdem","bevor",
    "sodass","einerseits","andererseits","zum Beispiel","meiner Meinung nach","im Gegensatz","nicht nur","zusammenfassend"],
  // Enkel igenkänning av tempus i elevens text (för checklistan, inte för rättning)
  // Perfekt och Passiv: hjälpverbet och ett particip i samma mening, efter hjälpverbet (inom 80 tecken) eller precis före
  // (…, dass ich es gesehen habe; …, wenn es finanziert wird). Particip skrivs med liten bokstav (Gesellschaft, Gedanken och
  // Erfahrungen är substantiv), och ord som ser ut som particip räknas inte: gegen, erst, geht, beiden, bekannt, bereit,
  // un- (ungerecht), infinitiv (ich werde … gehen, angeben) och zu-infinitiv (zu bezahlen, anzubieten). Passiv tar inte
  // be-/ver-/er-ord på -en, eftersom de oftast är infinitiv i futurum (wird … verlieren). Testas i tests/run_tests.py.
  tenseCheck: (() => {
    const notPart = new RegExp("^(gegen|dagegen|entgegen|geht|angeht|erst|erste|ersten|erster|erstes|überhaupt|beide|beiden|eigenen|bereit|bewusst|ernst|beste|besten|besseren|bestimmt|bestimmten|bekannt|berühmt|beliebt|begabt|erwachsen|verwandt|befreundet|verschieden|verschiedenen|vergangenen|sogenannten|gemeinsamen|gesetzlichen|insgesamt|übermorgen|kompliziert|gezielt|gegenteiligen|bekommt|besteht|entscheidet|gehörten|genießen|gehören|gelten|geschehen|gelingen|gestehen|gebrauchen|gewöhnen|gestalten|genehmigen|gefährden|gedenken|gewinnen)$"
      + "|^(ab|an|auf|aus|bei|ein|fest|her|hin|mit|nach|vor|weg|zu|zurück|zusammen|um|durch|weiter|vorbei|heraus|hinaus)?(gehen|geben)$|^un(?!ter)|sten$", "u");   // -sten: superlativ (bekanntesten)
    const zuInf = /^(ab|an|auf|aus|bei|ein|fest|her|hin|los|mit|nach|vor|weg|zu|zurück|zusammen|entgegen|teil|statt|frei|kennen|dar|um|durch|wieder)zu\p{Ll}+en$/u;
    // Finns hjälpverbet (aux, ett ord) och ett ord som klarar ok efter det (inom 80 tecken) eller precis före, i samma sats
    // (meningen delad vid . ! ? , ; : och tankstreck, så att "Wer verreist, hat …" och "wird, beginnt …" inte räknas)?
    const near = (aux, ok) => t => t.split(/[.!?,;:–—]/).some(s => {
      const ws = [...s.matchAll(/\p{L}+/gu)], good = i => i >= 0 && i < ws.length && ok(ws[i][0]) && !notPart.test(ws[i][0])
        && !zuInf.test(ws[i][0]) && !(i > 0 && ws[i - 1][0] === "zu");
      return ws.some((a, i) => aux.test(a[0]) && (good(i - 1) || ws.some((w, j) => j > i && w.index - a.index - a[0].length <= 81 && good(j)))); });
    const part = /^(\p{Ll}*ge\p{Ll}+(t|en)|\p{Ll}+iert|(ver|be|er|ent|zer|über)\p{Ll}+(t|en))$/u;
    return {
    "Präsens": t => t.trim().length > 0,
    "Perfekt": near(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)$/i, w => part.test(w)),
    "Präteritum": t => /(^|[^\p{L}])(war|warst|waren|wart|hatte|hatten|hattest|ging|gingen|kam|kamen|wurde|wurden|machte|machten|sagte|sagten|fuhr|fuhren|sah|sahen|gab|gaben|nahm|nahmen|dachte|dachten|konnte|konnten|musste|mussten|wollte|wollten|durfte|durften|fand|fanden|lebte|lebten|wohnte|wohnten|arbeitete|arbeiteten)(?![\p{L}])/iu.test(t),
    "Konjunktiv II": t => /(^|[^\p{L}])(würde|würdest|würden|würdet|hätte|hättest|hätten|wäre|wärst|wären|könnte|könnten|müsste|müssten|dürfte|sollte|sollten)(?![\p{L}])/iu.test(t),
    // Passiv: be-/ver-/er-ord på -en bara för vanliga starka particip (verboten, beschrieben), annars är de oftast infinitiv
    "Passiv": near(/^(wird|werden|wurde|wurden|worden)$/i, w => /^(\p{Ll}*ge\p{Ll}+(t|en)|\p{Ll}+iert|(ver|be|er|ent|zer|über)\p{Ll}+t)$/u.test(w)
      || /^(ver|be|er|ent|zer|über|emp)\p{Ll}*(boten|loren|standen|schrieben|schieden|schienen|schoben|gonnen|sprochen|troffen|funden|bunden|glichen|fohlen|zogen|nommen|worfen|wiesen|blieben|stiegen)$/u.test(w))
    };
  })(),

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Adjektivändelser skapas i programmet av ordlistans substantiv och tabellen i src/kinds/60-grammar.js.
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    persons: ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"],
    prefix: (i, form, persons) => persons[i] + " ",

    games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "tempus", name: "Tempus", sub: "Präteritum, Perfekt och Konjunktiv II", tenses: ["Präteritum", "Perfekt", "Konjunktiv II"]},
      {id: "b2", name: "Mot B2: konjunktiv", sub: "Konjunktiv I för indirekt tal och Konjunktiv II", tenses: ["Konjunktiv I", "Konjunktiv II"]}
    ]
  }
};
