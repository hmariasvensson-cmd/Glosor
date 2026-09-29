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

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i languages/fr/content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json.

  // Verbtabellerna från Franska 3, men bara présent, och fler vanliga verb på -er
  verbs: {
    sv: {aimer: "tycka om, älska", habiter: "bo", jouer: "spela, leka", regarder: "titta på", écouter: "lyssna på",
         travailler: "arbeta", chercher: "leta efter", arriver: "komma fram", adorer: "älska", détester: "avsky",
         manger: "äta", commencer: "börja", acheter: "köpa", préférer: "föredra"},
    games: [
      {id: "pres-irr", name: "Être, avoir, aller, faire", sub: "je suis, tu as, il va, nous faisons", tenses: ["présent"], verbs: ["être", "avoir", "aller", "faire"]},
      {id: "pres-er", name: "Verb på -er", sub: "je parle, tu aimes, nous habitons", tenses: ["présent"],
        verbs: ["parler", "aimer", "habiter", "jouer", "regarder", "écouter", "travailler", "chercher", "arriver", "adorer", "détester", "manger", "commencer", "acheter", "préférer"]},
      {id: "pres-alla", name: "Alla verb i kursen", sub: "Présent: blandat", tenses: ["présent"],
        verbs: ["être", "avoir", "aller", "faire", "parler", "aimer", "habiter", "jouer", "regarder", "écouter", "travailler", "manger", "acheter", "préférer"]}
    ],
    tenses: {
      $remove: ["imparfait", "passé composé", "plus-que-parfait", "futur simple", "conditionnel", "subjonctif"],
      "présent": {
        aimer: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
        habiter: ["habite", "habites", "habite", "habitons", "habitez", "habitent"],
        jouer: ["joue", "joues", "joue", "jouons", "jouez", "jouent"],
        regarder: ["regarde", "regardes", "regarde", "regardons", "regardez", "regardent"],
        écouter: ["écoute", "écoutes", "écoute", "écoutons", "écoutez", "écoutent"],
        travailler: ["travaille", "travailles", "travaille", "travaillons", "travaillez", "travaillent"],
        chercher: ["cherche", "cherches", "cherche", "cherchons", "cherchez", "cherchent"],
        arriver: ["arrive", "arrives", "arrive", "arrivons", "arrivez", "arrivent"],
        adorer: ["adore", "adores", "adore", "adorons", "adorez", "adorent"],
        détester: ["déteste", "détestes", "déteste", "détestons", "détestez", "détestent"],
        manger: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
        commencer: ["commence", "commences", "commence", "commençons", "commencez", "commencent"],
        acheter: ["achète", "achètes", "achète", "achetons", "achetez", "achètent"],
        préférer: ["préfère", "préfères", "préfère", "préférons", "préférez", "préfèrent"]
      }
    },
    notes: {
      "présent|parler": "Mönstret för alla verb på -er: ta bort -er och lägg till -e, -es, -e, -ons, -ez, -ent. Je parle, tu parles, il parle och ils parlent låter likadant.",
      "présent|aimer": "Je blir j' framför vokal: j'aime. J'aime + infinitiv = jag tycker om att: j'aime lire.",
      "présent|habiter": "H:et är stumt, så je blir j': j'habite. Nous habitons uttalas med bindning: nou-z-habitons.",
      "présent|écouter": "Je blir j' framför vokal: j'écoute. Écouter betyder lyssna på, utan preposition: j'écoute la radio.",
      "présent|regarder": "Regarder betyder titta på, utan preposition: je regarde la télé.",
      "présent|arriver": "Je blir j' framför vokal: j'arrive.",
      "présent|adorer": "Je blir j' framför vokal: j'adore.",
      "présent|manger": "Nous mangeons får ett extra e, så att g:et uttalas mjukt (som i jour).",
      "présent|commencer": "Nous commençons får ç, så att c:et uttalas som s.",
      "présent|acheter": "Får è i je, tu, il och ils: j'achète. Nous achetons och vous achetez har inget accenttecken.",
      "présent|préférer": "é blir è i je, tu, il och ils: je préfère. Nous préférons och vous préférez behåller é."
    }
  }
};
