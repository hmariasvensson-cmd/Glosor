/* Inställningar för Italienska 3 (A2.1). Artiklar, pronomen, bindeord, tempusigenkänning och verbtabellerna hämtas från
   Italienska 2 (languages/it2/lang.js, som i sin tur ärver från Italienska 1), se extends och inherit nedan.
   Se docs/nivaer-italienska.md (steg 3). */
LANGUAGES.it3 = {
  name: "Italienska",
  title: "Italienska glosor",
  course: "Italienska 3",
  courseGy25: "Moderna språk – fortsättning, nivå 1",
  step: 3,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A2",                   // steg 3 ≈ A2.1 enligt Skolverket
  inLang: "på italienska",
  tts: "it-IT",
  htmlLang: "it",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-it3-v1",   // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "it4",            // förslaget att gå vidare till Italienska 4
  extends: "it2",                // fälten i inherit hämtas från Italienska 2 (egna fält vinner)
  inherit: ["articles", "hintStrip", "pronouns", "elision", "connectors", "tenseCheck", "verbs"],

  accents: "à è é ì ò ù",
  verbAccents: "à è é ì ò ù",
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: passato prossimo eller imperfetto, rätt pronomen, futuro eller condizionale, och rätt bindeord.",
  cultureIntro: "Läs en kort text om Italien, svara på en fråga och jämför med hur det är i Sverige.",

  // Bindeord i skrivchecklistan: Italienska 1:s lista plus några nya för att diskutera och berätta sammanhängande
  connectors: {$append: ["anche se", "infatti", "comunque", "cioè", "insomma", "per questo", "a mio parere", "prima di tutto"]},
  // Tempusigenkänning: som i Italienska 1 och 2, plus condizionale (vorrei, dovresti, sarebbe …)
  tenseCheck: {
    "condizionale": t => /(^|[^\p{L}])\p{L}+(rei|resti|rebbe|remmo|reste|rebbero)(?![\p{L}])/iu.test(t)
  },

  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Verbtabellerna (presens, passato prossimo, imperfetto, futuro, condizionale) ärvs från Italienska 2; bara spelen är egna.
  verbs: {
    games: [
      {id: "racconto", name: "Berätta i dåtid", sub: "passato prossimo och imperfetto blandat: sono andato, andavo", tenses: ["passato prossimo", "imperfetto"]},
      {id: "fut-cond", name: "Futuro och condizionale", sub: "farò – farei, sarà – sarebbe", tenses: ["futuro semplice", "condizionale"]},
      {id: "tutti", name: "Alla tempus", sub: "presens, dåtid, futuro och condizionale blandat", tenses: ["presente", "passato prossimo", "imperfetto", "futuro semplice", "condizionale"]}
    ]
  }
};
