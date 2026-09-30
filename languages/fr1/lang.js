/* Inställningar för Franska 1 (Moderna språk 1, steg 1, A1.1), för nybörjare som pluggar på egen hand.
   Orden ligger i words.txt. Kapitel och grammatik följer docs/nivaer-franska.md (steg 1) och docs/kursmall.md.
   Accenter, artiklar, pronomen, elision, genus, bindeord, tempusigenkänning och verbtabeller ärvs från
   Franska 3 (languages/fr/lang.js), se extends och inherit nedan. Verbtabellen har bara présent. */
LANGUAGES.fr1 = {
  name: "Franska",            // samma språk som Franska 3 och 4 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 1",
  courseGy25: "Moderna språk – nybörjare, nivå 1",   // steg 1 i Gy25 (se docs/kursmall.md 2.1)
  step: 1,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A1",
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-fr1-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "fr2",           // kursen man går vidare till när den här är klar (Franska 2)
  extends: "fr",               // fälten i inherit hämtas från Franska 3 och slås ihop med fälten här (egna fält vinner)
  inherit: ["accents", "verbAccents", "articles", "pronouns", "genders", "elision", "connectors", "tenseCheck", "verbs"],

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt form av verbet i presens och ett litet ord som passar (et, mais, parce que …).",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna från Franska 3, men bara présent, och fler vanliga verb på -er
  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    games: [
      {id: "pres-irr", name: "Être, avoir, aller, faire", sub: "je suis, tu as, il va, nous faisons", tenses: ["présent"], verbs: ["être", "avoir", "aller", "faire"]},
      {id: "pres-er", name: "Verb på -er", sub: "je parle, tu aimes, nous habitons", tenses: ["présent"],
        verbs: ["parler", "aimer", "habiter", "jouer", "regarder", "écouter", "travailler", "chercher", "arriver", "adorer", "détester", "manger", "commencer", "acheter", "préférer"]},
      {id: "pres-alla", name: "Alla verb i kursen", sub: "Présent: blandat", tenses: ["présent"],
        verbs: ["être", "avoir", "aller", "faire", "parler", "aimer", "habiter", "jouer", "regarder", "écouter", "travailler", "manger", "acheter", "préférer"]}
    ]
  }
};
