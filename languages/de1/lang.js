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
    sv: {wohnen: "bo", heißen: "heta", kommen: "komma", spielen: "spela", lernen: "lära sig, plugga", machen: "göra",
         hören: "höra, lyssna", sagen: "säga", kaufen: "köpa", trinken: "dricka", gehen: "gå", lieben: "älska",
         kennen: "känna", leben: "leva, bo", zeigen: "visa", brauchen: "behöva", schreiben: "skriva", finden: "hitta, tycka",
         bleiben: "stanna", zahlen: "betala", möchten: "vilja ha, skulle vilja", tanzen: "dansa", rechnen: "räkna",
         buchstabieren: "stava", erzählen: "berätta", öffnen: "öppna", legen: "lägga", stellen: "ställa", sitzen: "sitta",
         liegen: "ligga", schauen: "titta", gucken: "titta", lachen: "skratta", beginnen: "börja", dauern: "ta (tid), vara"},
    games: [
      {id: "pres-reg", name: "Regelbundna verb", sub: "ich wohne, du spielst, er macht, wir lernen", tenses: ["Präsens"],
       verbs: ["wohnen", "heißen", "kommen", "spielen", "lernen", "machen", "hören", "sagen", "kaufen", "trinken", "gehen", "arbeiten",
               "lieben", "kennen", "leben", "zeigen", "brauchen", "schreiben", "finden", "bleiben", "zahlen", "rechnen", "erzählen", "öffnen", "sitzen", "liegen"]},
      {id: "pres-irr", name: "sein, haben och starka verb", sub: "ich bin, du hast, er fährt, sie isst, du liest", tenses: ["Präsens"],
       verbs: ["sein", "haben", "fahren", "lesen", "sprechen", "nehmen", "geben", "sehen", "laufen", "helfen", "essen", "schlafen", "mögen", "möchten"]},
      {id: "pres-alla", name: "Alla verb i presens", sub: "blandat: regelbundna, sein, haben och starka verb", tenses: ["Präsens"]}
    ],
    tenses: {
      $remove: ["Präteritum", "Perfekt", "Konjunktiv II", "Konjunktiv I"],
      "Präsens": {
        $remove: ["werden", "wissen", "können", "müssen", "dürfen", "wollen", "sollen", "tragen", "treffen", "vergessen", "halten", "lassen", "empfehlen"],
        wohnen: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"],
        heißen: ["heiße", "heißt", "heißt", "heißen", "heißt", "heißen"],
        kommen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"],
        spielen: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"],
        lernen: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"],
        machen: ["mache", "machst", "macht", "machen", "macht", "machen"],
        hören: ["höre", "hörst", "hört", "hören", "hört", "hören"],
        sagen: ["sage", "sagst", "sagt", "sagen", "sagt", "sagen"],
        kaufen: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"],
        trinken: ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"],
        gehen: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
        lieben: ["liebe", "liebst", "liebt", "lieben", "liebt", "lieben"],
        kennen: ["kenne", "kennst", "kennt", "kennen", "kennt", "kennen"],
        leben: ["lebe", "lebst", "lebt", "leben", "lebt", "leben"],
        zeigen: ["zeige", "zeigst", "zeigt", "zeigen", "zeigt", "zeigen"],
        brauchen: ["brauche", "brauchst", "braucht", "brauchen", "braucht", "brauchen"],
        schreiben: ["schreibe", "schreibst", "schreibt", "schreiben", "schreibt", "schreiben"],
        finden: ["finde", "findest", "findet", "finden", "findet", "finden"],
        bleiben: ["bleibe", "bleibst", "bleibt", "bleiben", "bleibt", "bleiben"],
        zahlen: ["zahle", "zahlst", "zahlt", "zahlen", "zahlt", "zahlen"],
        rechnen: ["rechne", "rechnest", "rechnet", "rechnen", "rechnet", "rechnen"],
        erzählen: ["erzähle", "erzählst", "erzählt", "erzählen", "erzählt", "erzählen"],
        öffnen: ["öffne", "öffnest", "öffnet", "öffnen", "öffnet", "öffnen"],
        sitzen: ["sitze", "sitzt", "sitzt", "sitzen", "sitzt", "sitzen"],
        liegen: ["liege", "liegst", "liegt", "liegen", "liegt", "liegen"],
        möchten: ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"],
        rule: "Ta bort -en och lägg till ändelsen: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Slutar stammen på -t, -d eller -n efter konsonant får du och er en extra e (du arbeitest, er findet). Starka verb byter vokal i du och er/sie/es: du fährst, du isst, du liest."
      }
    },
    notes: {
      "Präsens|heißen": "Stammen slutar på ß, så du-formen får bara -t: du heißt (inte heißst).",
      "Präsens|sitzen": "Stammen slutar på z, så du-formen får bara -t: du sitzt.",
      "Präsens|finden": "Stammen slutar på d, så du och er får ett extra e: du findest, er findet.",
      "Präsens|rechnen": "Stammen slutar på n efter konsonant, så du och er får ett extra e: du rechnest, er rechnet.",
      "Präsens|öffnen": "Stammen slutar på n efter konsonant, så du och er får ett extra e: du öffnest, er öffnet.",
      "Präsens|möchten": "Egentligen en form av mögen. Ich och er har samma form: ich möchte, er möchte.",
      "Präsens|mögen": "Ich och er har samma form: ich mag, er mag. Ich mag Pizza = jag tycker om pizza."
    }
  }
};
