/* Inställningar för Tyska 6 (Moderna språk 6, steg 6, B1.2 mot B2). Orden ligger i words.txt och videorna i videos.json.
   Verb, bindeord och tempusigenkänning hämtas från Tyska 5 (languages/de/lang.js), som laddas före den här filen. */
LANGUAGES.de6 = {
  name: "Tyska",
  title: "Tyska glosor",
  course: "Tyska 6",
  courseGy25: "Moderna språk – fördjupning, nivå 2",
  level: "B1 → B2",           // steg 6 ≈ B1.2 enligt Skolverket, provmålet B2 står i exam
  inLang: "på tyska",
  tts: "de-DE",
  htmlLang: "de",
  etyLabel: "Kommentar",
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-de6-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln

  accents: "ä ö ü ß",
  verbAccents: "ä ö ü ß",
  articles: [],
  hintStrip: /^(der|die|das|den|dem|des) /,
  // Mellanslag krävs efter pronomenet, så att "sieht", "wird" och "esse" inte klipps till "ht", "d" och "se"
  pronouns: /^(?:er\/sie\/es|sie\/sie|ich|du|er|sie|es|wir|ihr) /,
  genders: {m: "maskulinum", f: "femininum", n: "neutrum", pl: "plural"},
  selfStudy: true,             // eleven pluggar på egen hand, utan lärare och lärobok
  exam: {name: "Goethe-Zertifikat B2 (eller telc B2/TestDaF)", level: "B2"},   // språkprovet eleven siktar på
  nounCaps: true,
  genderGame: {m: "der", f: "die", n: "das"},

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus (Präteritum, Plusquamperfekt, Konjunktiv I eller II) och ett bindeord som passar både betydelsen och ordföljden.",
  cultureIntro: "Läs en text om Tyskland, Österrike eller Schweiz, svara på en fråga och jämför med hur det är i Sverige.",
  get connectors() { return LANGUAGES.de.connectors; },
  get tenseCheck() { return LANGUAGES.de.tenseCheck; },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se languages/de/content/GRAMMATIK-SPEC.md och content/SPEC.md).
  // Områdena bygger vidare på Tyska 5 och upprepar inte dess områden rakt av.
  grammar: {
    topics: [
      // secs: kapitel där området tas upp. När eleven läser det kapitlet kommer området först.
      {id: "k1", name: "Indirekt tal (Konjunktiv I)", sub: "Sie sagt, sie habe keine Zeit gehabt. Er fragt, ob …", secs: ["s2", "s3"]},
      {id: "k2verg", name: "Konjunktiv II i dåtid", sub: "hätte … gemacht, wäre … gegangen, hätte … machen müssen", secs: ["s4", "s7"]},
      {id: "passersatz", name: "Passiversatz", sub: "Das lässt sich lösen. Das ist machbar. Das ist zu klären.", secs: ["s2", "s5"]},
      {id: "partattr", name: "Utbyggda particip-attribut", sub: "die von der Jury ausgewählten Stücke, die zu lösende Aufgabe", secs: ["s2", "s4"]},
      {id: "nominal", name: "Nominalstil och verbalstil", sub: "nachdem er angekommen war → nach seiner Ankunft", secs: ["s1", "s5"]},
      {id: "nvv", name: "Nomen-Verb-Verbindungen", sub: "eine Entscheidung treffen, in Frage kommen, zur Verfügung stehen", secs: ["s1", "s5"]},
      {id: "genprep", name: "Prepositioner med genitiv", sub: "aufgrund, infolge, hinsichtlich, innerhalb, trotz, wegen", secs: ["s3", "s8"]},
      {id: "partikel", name: "Modalpartiklar", sub: "doch, ja, eben, halt, wohl, mal, denn", secs: ["s6", "sr"]},
      {id: "modsubj", name: "Modalverb som bedömning", sub: "Er soll reich sein. Sie will es gewusst haben. Das dürfte stimmen.", secs: ["s3", "s7"]},
      {id: "textbind", name: "Konnektorer och textbindning", sub: "während, wohingegen, folglich, sofern, indem, es sei denn", secs: ["s7", "s8", "sr"]},
      {id: "err", name: "Hitta felet", sub: "En mening har ett fel. Vilket ord?"}
    ],
    rules: {
      "k1-rede": "Konjunktiv I i indirekt tal", "k1-ersatz": "Konjunktiv II som ersättning", "k1-verg": "Indirekt tal i dåtid", "k1-frage": "Indirekta frågor och uppmaningar",
      "k2p-wenn": "Overkligt villkor i dåtid", "k2p-wunsch": "Önskan och ånger i dåtid", "k2p-modal": "Konjunktiv II i dåtid med modalverb", "k2p-als": "als ob och fast",
      "pe-lassen": "sich lassen + infinitiv", "pe-bar": "Adjektiv på -bar och -lich", "pe-seinzu": "sein + zu + infinitiv", "pe-man": "man och reflexiv form",
      "pat-endung": "Ändelse på participet", "pat-bau": "Ordningen i ett långt attribut", "pat-zu": "Gerundiv: die zu lösende Aufgabe", "pat-rel": "Relativsats → particip-attribut",
      "nom-bildung": "Substantiv av verb och adjektiv", "nom-prep": "Bisats → preposition + substantiv", "nom-gen": "Genitivattribut i nominalstil", "nom-verbal": "Nominalstil → verbalstil",
      "nvv-verb": "Vilket verb hör till substantivet?", "nvv-prep": "Preposition och artikel i fasta uttryck", "nvv-passiv": "Uttryck med passiv betydelse",
      "gp-grund": "Orsak: aufgrund, infolge, angesichts, wegen", "gp-gegen": "Motsats: trotz, ungeachtet, statt", "gp-raum": "Tid och plats: innerhalb, außerhalb, während", "gp-bezug": "hinsichtlich, bezüglich, anlässlich, zugunsten",
      "mp-doch": "doch", "mp-ja": "ja", "mp-eben": "eben och halt", "mp-wohl": "wohl och schon", "mp-mal": "mal, denn och bloß",
      "ms-sollen": "sollen: det sägs att", "ms-wollen": "wollen: påstår sig", "ms-vermutung": "muss, dürfte, kann: hur säker?", "ms-verg": "Bedömning av något som har hänt",
      "tb-kontrast": "Kontrast: während, wohingegen, dagegen", "tb-folge": "Följd: folglich, somit, sodass", "tb-konzess": "Medgivande: dennoch, obgleich, zwar", "tb-bedingung": "Villkor: sofern, falls, es sei denn", "tb-mittel": "Sätt: indem, dadurch dass"
    }
  },

  // Samma verbtabeller som Tyska 5, men verbspelen övar konjunktiven och alla tempus blandat
  get verbs() {
    return {...LANGUAGES.de.verbs, games: [
      {id: "k1", name: "Konjunktiv I", sub: "Indirekt tal: er sei, sie habe, man könne", tenses: ["Konjunktiv I"]},
      {id: "k2", name: "Konjunktiv II", sub: "wäre, hätte, käme, wüsste, müsste", tenses: ["Konjunktiv II"]},
      {id: "alla", name: "Alla tempus", sub: "Präteritum, Perfekt, Konjunktiv I och II blandat", tenses: ["Präteritum", "Perfekt", "Konjunktiv I", "Konjunktiv II"]}
    ]};
  }
};
