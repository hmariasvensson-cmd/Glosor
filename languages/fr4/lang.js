/* Inställningar för Franska 4 (Moderna språk 6, steg 6, B1.2). Orden ligger i words.txt och videorna i videos.json.
   Kursen har ingen lärobok. Bindeord, tempusigenkänning och verbtabeller hämtas från Franska 3
   (languages/fr/lang.js), som laddas före den här filen (build.py sorterar koderna: fr före fr4). */
LANGUAGES.fr4 = {
  name: "Franska",            // samma språk som Franska 3 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska 4",
  courseGy25: "Moderna språk – fördjupning, nivå 2",   // steg 6 i Gy25 (se docs/kursmall.md 2.1)
  level: "B1",                // steg 6 ≈ B1.2 enligt Skolverket (provmålet DELF B1 står i exam)
  exam: {name: "DELF B1", level: "B1"},
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-fr4-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  articles: [/^(le|la|les|un|une|des) /, /^l'/],
  // Längre former först, och mellanslag efter pronomenet (utom j' och qu'), så att "ont", "tues" och "ils sont" inte klipps fel
  pronouns: /^(?:(?:que |qu')?(?:il\/elle|ils\/elles|elles|elle|ils|il|nous|vous|on|tu|je) |(?:que )?j')/,
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},
  elision: /^(l|d|j|qu|n|s|c|m|t|jusqu|lorsqu|puisqu)'/i,

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus eller modus (imparfait, passé composé, plus-que-parfait, conditionnel, subjonctif …) och ett bindeord som passar sammanhanget.",
  cultureIntro: "Läs en kort text om Frankrike eller den fransktalande världen, svara på en fråga och jämför med hur det är i Sverige.",
  // Bindeorden från Franska 3 plus bindeord för argumenterande text på B1-nivå
  get connectors() {
    return [...LANGUAGES.fr.connectors, "tout d'abord", "d'une part", "d'autre part", "en effet", "de plus", "d'ailleurs", "puisque", "grâce à",
      "à cause de", "c'est pourquoi", "par conséquent", "alors que", "tandis que", "bien que", "malgré", "en revanche", "néanmoins",
      "afin de", "afin que", "pour que", "en conclusion", "pour conclure"];
  },
  // Tempusigenkänningen från Franska 3, plus conditionnel och subjonctif (enkel igenkänning för checklistan, inte för rättning)
  get tenseCheck() {
    const w = "(?![\\p{L}])", b = "(^|[^\\p{L}])";
    const cond = new RegExp(b + "(\\p{L}*(er|ir|dr|vr|rr|ur|ttr|oir)(ais|ait|ions|iez|aient))" + w, "giu");
    // Imparfait av verb vars stam slutar som ett conditionnel (tirer → tirait, éclairer → éclairait, espérer → espérait)
    const notCond = /^(vrais|(tir|attir|retir|admir|respir|inspir|expir|soupir|transpir|conspir|vir|chavir|délir|désir|éclair|dur|assur|rassur|jur|mesur|figur|murmur|demeur|satur|tortur|captur|pleur|cour|parcour|secour|mour|ouvr|couvr|découvr|offr|souffr)(ais|ait|ions|iez|aient))$|ér(ais|ait|ions|iez|aient)$/i;
    return {...LANGUAGES.fr.tenseCheck,
      "conditionnel": t => (t.match(cond) || []).some(m => !notCond.test(m.replace(/^[^\p{L}]+/u, ""))),
      "subjonctif": t => new RegExp(b + "(sois|soit|soient|soyons|soyez|aie|aies|ait|ayons|ayez|aient|fass\\p{L}*|puiss\\p{L}*|aill(e|es|ent)|sach(e|es|ions|iez|ent)|veuill\\p{L}*|vienn(e|es|ent)|prenn(e|es|ent)|doiv(e|es|ent))" + w, "iu").test(t)
        || new RegExp(b + "(que|qu')\\s*(je|j'|tu|il|elle|on|nous|vous|ils|elles)\\s*\\p{L}+(isse|isses|issent|ions|iez)" + w, "iu").test(t)
    };
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i languages/fr/content/GRAMMATIK-SPEC.md).
  grammar: {
    topics: [
      // secs: kapitel där området tas upp. När eleven läser det kapitlet kommer området först.
      {id: "subj2", name: "Subjonctif: fler fall", sub: "bien que, avant que, pour que, je doute que, je suis ravi que", secs: ["q7", "q8"]},
      {id: "hyp", name: "Si-satser: alla tre typerna", sub: "Si tu viens … Si j'avais … Si j'avais su, je serais venu.", secs: ["q1", "q5"]},
      {id: "relc", name: "Lequel, auquel, duquel och dont", sub: "la raison pour laquelle, le projet auquel je pense", secs: ["q2", "q4"]},
      {id: "disc", name: "Indirekt tal och tidsföljd", sub: "Il a dit qu'il viendrait. Elle m'a demandé si j'avais fini.", secs: ["q2", "q6"]},
      {id: "ger", name: "Gérondif och participe présent", sub: "en travaillant, tout en sachant, ayant fini", secs: ["q7", "q4"]},
      {id: "pass", name: "Passiv", sub: "La loi a été votée. Le château sera restauré.", secs: ["q3", "q6"]},
      {id: "futant", name: "Futur antérieur", sub: "Quand j'aurai fini le bac, je partirai.", secs: ["q1", "q5"]},
      {id: "relief", name: "Framhävning: c'est … qui, ce qui, ce que", sub: "C'est elle qui a raison. Ce qui compte, c'est …", secs: ["q4", "qr"]},
      {id: "conn", name: "Bindeord i argumentation", sub: "puisque, par conséquent, alors que, afin que, malgré", secs: ["q3", "q8", "qr"]},
      {id: "err", name: "Hitta felet", sub: "En mening har ett fel. Vilket ord?"}
    ],
    rules: {
      "subj2-conj": "Subjonctif efter bien que, pour que, avant que", "subj2-emo": "Subjonctif efter känslor", "subj2-doute": "Subjonctif efter tvivel och möjlighet",
      "subj2-vol": "Subjonctif efter vilja och nödvändighet", "subj2-ind": "Indikativ, inte subjonctif", "subj2-inf": "Infinitiv när subjektet är detsamma",
      "hyp-1": "Si + présent → futur", "hyp-2": "Si + imparfait → conditionnel", "hyp-3": "Si + plus-que-parfait → conditionnel passé", "hyp-cp": "Conditionnel passé: ånger och förebråelse",
      "relc-lequel": "Preposition + lequel", "relc-auquel": "auquel, à laquelle, auxquels", "relc-duquel": "duquel, de laquelle", "relc-qui": "Preposition + qui om personer", "relc-dont": "dont",
      "disc-pres": "Indirekt tal utan tempusbyte", "disc-imp": "présent → imparfait", "disc-pqp": "passé composé → plus-que-parfait", "disc-cond": "futur → conditionnel",
      "disc-q": "Indirekta frågor: si, ce que, ce qui", "disc-imper": "Imperativ → de + infinitiv", "disc-tps": "Tidsuttryck: la veille, le lendemain",
      "ger-form": "Gérondif: bildning", "ger-sens": "Gérondif: samtidigt, sätt, villkor", "ger-tout": "tout en + gérondif", "ger-pp": "Participe présent", "ger-passe": "ayant/étant + participe passé",
      "pass-pres": "Passiv i presens", "pass-pc": "Passiv i passé composé", "pass-temps": "Passiv i andra tempus", "pass-accord": "Kongruens i passiv", "pass-par": "par eller de", "pass-on": "on och se i stället för passiv",
      "futant-form": "Futur antérieur: bildning", "futant-quand": "quand, dès que + futur antérieur", "futant-avant": "Klart före en tidpunkt", "futant-accord": "Futur antérieur med être", "futant-sup": "Antagande: il aura oublié",
      "relief-qui": "C'est … qui", "relief-que": "C'est … que", "relief-ce": "Ce qui, ce que, ce dont", "relief-tout": "Tout ce qui, tout ce que", "relief-accord": "C'est moi qui suis …",
      "conn-cause": "Orsak", "conn-cons": "Följd", "conn-opp": "Motsats och medgivande", "conn-but": "Syfte", "conn-prep": "Bindeord eller preposition"
    }
  },

  // Samma verbtabeller som Franska 3, med spel för steg 6
  get verbs() {
    return {...LANGUAGES.fr.verbs, games: [
      {id: "subj", name: "Subjonctif", sub: "que je sois, qu'il fasse, que nous puissions", tenses: ["subjonctif"]},
      {id: "hyp", name: "Framtid och villkor", sub: "Futur simple och conditionnel", tenses: ["futur simple", "conditionnel"]},
      {id: "recit", name: "Berätta i dåtid", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]}
    ]};
  }
};
