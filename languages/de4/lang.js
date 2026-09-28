/* Inställningar för Tyska 4 (B1, repetition före Tyska 5). Orden ligger i words.txt och videorna i videos.json.
   Verb, bindeord och tempusigenkänning hämtas från Tyska 5 (languages/de/lang.js), som laddas före den här filen. */
LANGUAGES.de4 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 4",
  courseGy25: "Moderna språk – fortsättning, nivå 2",
  level: "A2 → B1",           // steg 4 ≈ A2.2 enligt Skolverket
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de4-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "de",            // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  pronouns: /^(er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) ?/,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat B1 (delmål mot B2)", level: "B1"},   // språkprovet eleven tränar på i Tyska 4 (B2 i Tyska 5)
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i Präteritum eller Perfekt, och ett bindeord som passar ordföljden.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",
  get connectors() { return LANGUAGES.de.connectors; },
  get tenseCheck() { return LANGUAGES.de.tenseCheck; },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se content/GRAMMATIK-SPEC.md).
  grammar: {
    topics: [
      {id: "adj", name: "Adjektivändelser", sub: "ein neues Fahrrad, mit dem neuen Fahrrad …"},
      {id: "praep", name: "Prepositioner och kasus", sub: "Wo? eller wohin? mit, bei, für, ohne …"},
      {id: "perfekt", name: "Perfekt och Präteritum", sub: "Ich bin gefahren. Ich war, ich hatte, ich musste."},
      {id: "nebensatz", name: "als, wenn, dass, ob", sub: "Välj rätt subjunktion."},
      {id: "bisatz", name: "Ordföljd", sub: "Sätt ihop meningar med weil, dass, deshalb och denn."},
      {id: "relativ", name: "Relativsatser", sub: "der Freund, den ich getroffen habe"},
      {id: "reflexiv", name: "Reflexiva verb", sub: "Ich freue mich. Ich wasche mir die Hände."},
      {id: "konj", name: "Konjunktiv II", sub: "Ich hätte gern … Könnten Sie …? Wenn ich Zeit hätte …"},
      {id: "passiv", name: "Passiv", sub: "Das Essen wird gekocht."},
      {id: "komp", name: "Jämförelser", sub: "größer als, so groß wie, am größten"},
      {id: "err", name: "Hitta felet", sub: "En mening har ett fel. Vilket ord?"}
    ],
    rules: {
      "adj-def": "Adjektiv efter der/die/das", "adj-indef": "Adjektiv efter ein/kein",
      "wechsel-dat": "Wechselpräposition: var? → dativ", "wechsel-akk": "Wechselpräposition: vart? → ackusativ",
      "dat-prep": "Prepositioner med dativ", "akk-prep": "Prepositioner med ackusativ",
      "pf-sein": "Perfekt med sein", "pf-haben": "Perfekt med haben", "prt-hilf": "Präteritum av sein, haben och modalverb",
      "ns-alswenn": "als eller wenn", "ns-dassob": "dass eller ob", "ns-grund": "weil, obwohl, damit",
      "bs-sub": "Subjunktion: verbet sist", "bs-inv": "Adverb: verbet direkt efter", "bs-konj": "Konjunktion: ingen ändring", "bs-first": "Bisatsen först",
      "rel-nom": "Relativpronomen i nominativ", "rel-akk": "Relativpronomen i ackusativ", "rel-dat": "Relativpronomen i dativ", "rel-prep": "Preposition + relativpronomen",
      "refl-akk": "Reflexivpronomen i ackusativ", "refl-dat": "Reflexivpronomen i dativ",
      "k2-wunsch": "Konjunktiv II: önskan och artighet", "k2-wenn": "Konjunktiv II i villkor", "k2-rat": "Konjunktiv II: råd",
      "pa-praes": "Passiv i presens", "pa-praet": "Passiv i preteritum",
      "komp": "Komparativ", "sup": "Superlativ", "komp-wie": "als eller wie"
    },
    adj: {
      adjectives: ["neu", "alt", "schön", "klein", "groß", "gut", "billig"],
      frames: {
        nom: ["{A} {ADJ} {N} ist hier.", "Das ist {A} {ADJ} {N}."],
        akk: ["Ich suche {A} {ADJ} {N}.", "Wir brauchen {A} {ADJ} {N}."],
        dat: ["Ich komme mit {A} {ADJ} {N}.", "Was machst du mit {A} {ADJ} {N}?"]
      }
    }
  },

  // Samma verbtabeller som Tyska 5, men utan Konjunktiv I
  get verbs() {
    const {"Konjunktiv I": _, ...tenses} = LANGUAGES.de.verbs.tenses;
    return {...LANGUAGES.de.verbs, tenses, games: [
      {id: "pres", name: "Personböjning", sub: "Präsens: starka verb med vokalväxling och modalverb", tenses: ["Präsens"]},
      {id: "tempus", name: "Dåtid", sub: "Präteritum och Perfekt", tenses: ["Präteritum", "Perfekt"]},
      {id: "k2", name: "Konjunktiv II", sub: "hätte, wäre, würde, könnte", tenses: ["Konjunktiv II"]}
    ]};
  }
};
