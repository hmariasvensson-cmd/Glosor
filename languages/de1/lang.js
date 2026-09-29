/* Inställningar för Tyska 1 (A1, nybörjare, steg 1). Orden ligger i words.txt och videorna i videos.json.
   Kapitel och grammatik följer docs/nivaer-tyska.md (4.2) och docs/kursmall.md. Bindeord, tempusigenkänning och
   verbtabeller ärvs från Tyska 5 (languages/de/lang.js), men verben filtreras till presens och kursens verb. */
LANGUAGES.de1 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 1",
  courseGy25: "Moderna språk – nybörjare, nivå 1",
  step: 1,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1",                   // steg 1 ≈ A1.1 (Gy11) / A1.2 (Gy25)
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de1-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "de",                 // fälten i inherit hämtas från Tyska 5 och slås ihop med fälten här (egna fält vinner)
  inherit: ["connectors", "tenseCheck", "verbs"],
  nextCourse: "de2",            // kursen man går vidare till när den här är klar

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,               // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat A1: Start Deutsch 1 (liten skala)", level: "A1"},
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt verbform i presens och ett bindeord som passar.",
  cultureIntro: "Läs en kort text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json, områdena (topics, secs) och regelnamnen i grammar.json.

  // Verbtabellerna från Tyska 5, men bara presens, utan modalverb (de kommer i Tyska 2) och med kursens vanliga verb
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "pres-reg", name: "Regelbundna verb", sub: "ich wohne, du spielst, er macht, wir lernen", tenses: ["Präsens"],
       verbs: ["wohnen", "heißen", "kommen", "spielen", "lernen", "machen", "hören", "sagen", "kaufen", "trinken", "gehen", "arbeiten",
               "lieben", "kennen", "leben", "zeigen", "brauchen", "schreiben", "finden", "bleiben", "zahlen", "rechnen", "erzählen", "öffnen", "sitzen", "liegen"]},
      {id: "pres-irr", name: "sein, haben och starka verb", sub: "ich bin, du hast, er fährt, sie isst, du liest", tenses: ["Präsens"],
       verbs: ["sein", "haben", "fahren", "lesen", "sprechen", "nehmen", "geben", "sehen", "laufen", "helfen", "essen", "schlafen", "mögen", "möchten"]},
      {id: "pres-alla", name: "Alla verb i presens", sub: "blandat: regelbundna, sein, haben och starka verb", tenses: ["Präsens"]}
    ]
  }
};
