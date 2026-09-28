/* Inställningar för franska. Orden ligger i words.txt och videorna i videos.json i samma mapp. */
LANGUAGES.fr = {
  name: "Franska",            // visas i språkväljaren
  title: "Franska glosor",    // rubrik på sidan
  course: "Franska 3",         // kursen som ordlistan hör till
  exam: {name: "DELF B1", level: "B1"},   // språkprovet eleven siktar på
  courseGy25: "Moderna språk – fortsättning, nivå 1",   // samma kurs i Gy25 (gymnasiet från juli 2025)
  // Elevens lärobok. Kapitel märkta #id|Namn|bok i words.txt kommer från boken (se docs/BOK.md).
  book: {title: "Escalade", authors: "Waagaard, Rödemark, Jonchère och Sandberg"},
  level: "A2",                // ungefärlig GERS-nivå: steg 3 ≈ A2.1 enligt Skolverket (provmålet B1 står i exam)
  inLang: "på franska",       // "Skriv på franska"
  tts: "fr-FR",               // röst för uppläsning
  storageKey: "franska-glosor-v2", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  // Valfria avsnitt: ord härifrån kommer bara när eleven själv väljer avsnittet under "Nya ord från"
  elective: {test: /^mt\d$/, label: "Musikteori · bara när du väljer det"},

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  // Tas bort från början av svaret innan det rättas (i den här ordningen)
  articles: [/^(le|la|les|un|une|des) /, /^l'/],
  // Tas bort från början av svaret i verbträningen
  // Längre former först, och mellanslag efter pronomenet (utom j' och qu'), så att "ont", "tues" och "ils sont" inte klipps fel
  pronouns: /^(?:(?:que |qu')?(?:il\/elle|ils\/elles|elles|elle|ils|il|nous|vous|on|tu|je) |(?:que )?j')/,
  genders: {m: "maskulinum", f: "femininum", mpl: "mask. plural", fpl: "fem. plural"},
  // l', d', j' … tas bort när ett ord i en text slås upp i ordlistan
  elision: /^(l|d|j|qu|n|s|c|m|t|jusqu|lorsqu|puisqu)'/i,
  // Bindeord som räknas i skrivuppgifternas checklista
  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: imparfait eller passé composé, och rätt bindeord.",
  cultureIntro: "Läs en kort text om Frankrike, svara på en fråga och jämför med hur det är i Sverige.",
  connectors: ["d'abord","ensuite","puis","enfin","finalement","mais","pourtant","cependant","par contre","parce que","car","donc","alors",
    "quand","pendant que","après","avant de","comme","aussi","en plus","d'un côté","de l'autre côté","par exemple","à mon avis","bref","même si","si"],
  // Enkel igenkänning av tempus i elevens text (för checklistan, inte för rättning)
  tenseCheck: {
    "passé composé": t => /(^|[^\p{L}])(ai|as|a|avons|avez|ont|suis|es|est|sommes|êtes|sont)\s+(\p{L}+(é|ée|és|ées|i|ie|is|ies|u|ue|us|ues|it|ert|ort))(?![\p{L}])/iu.test(t),
    // -ais/-ait/-aient: alla ord utom vanliga ord som inte är imparfait (mais, français, je connais, il fait …),
    // conditionnel (je parlerais, je voudrais) och presens av verb på -ayer/-oyer/-uyer (ils essaient, ils paient).
    // -ions/-iez räknas bara efter nous/vous ("nous parlions"), och inte presens av verb på -ier (nous étudions).
    "imparfait": t => (t.match(/(^|[^\p{L}])(\p{L}{2,}(ais|ait|aient))(?![\p{L}])/giu)||[])
      .some(m => !/^(mais|jamais|désormais|vrais|frais|épais|mauvais|niais|biais|palais|balais|relais|délais|essais|rabais|marais|dais|laquais|anglais|français|irlandais|écossais|japonais|polonais|portugais|néerlandais|sénégalais|congolais|libanais|maltais|marseillais|lyonnais|bordelais|lait|souhait|trait|extrait|portrait|retrait|abstrait|distrait|attrait|vais|nais|tais)$|fai[st]$|^(re)?connai[st]$|^(ap|dis|com|re)?parai[st]$|^(dé|com)?plai[st]$|erai(s|t|ent)$|^(voudr|pourr|devr|aur|ir|viendr|reviendr|deviendr|tiendr|saur|faudr|verr|enverr|courr|mourr|recevr|vaudr)ai(s|t|ent)$|^(pa|essa|bala|effra|pa|appu|ennu|envo|nett)ient$/i
        .test(m.replace(/^[^\p{L}]+/u, "")))
      || (t.match(/(^|[^\p{L}])(nous|vous)\s+(\p{L}{2,}(ions|iez))(?![\p{L}])/giu)||[])
        .some(m => !/^(étud|oubl|remerc|appréc|vérif|cop|cr|sk|conf|mar|pr|env|sour|r|pl|publ|expéd|modif|identif|justif|simplif|qualif|assoc|négoc|var|sacrif|certif|rel|photograph|l|n|suppl|all|inject)i(ons|ez)$/i
          .test(m.replace(/^[^\p{L}]*(nous|vous)\s+/iu, ""))),
    "futur proche": t => /(^|[^\p{L}])(vais|vas|va|allons|allez|vont)\s+\p{L}+(er|ir|re)(?![\p{L}])/iu.test(t),
    "présent": t => t.trim().length > 0
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (se content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  verbs: {
    persons: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
    // Pronomen som skrivs framför verbformen (je blir j' framför vokal, subjonctif får que framför)
    prefix: (i, form, persons, tense) => {
      const p = (i === 0 && /^[aeéêiou]/.test(form)) ? "j'" : persons[i] + " ";
      return tense === "subjonctif" ? (/^[aeiou]/.test(p) ? "qu'" : "que ") + p : p;
    },
    sv: {parler: "tala", finir: "sluta", vendre: "sälja", tomber: "falla",
         être: "vara", avoir: "ha", aller: "gå, åka", faire: "göra", venir: "komma",
         pouvoir: "kunna", vouloir: "vilja", devoir: "måste", prendre: "ta", dire: "säga"},

    // Varje spel övar ett urval tempus. Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres", name: "Personböjning", sub: "Présent: je, tu, il, nous, vous, ils", tenses: ["présent"]},
      {id: "tempus", name: "Tempus", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]},
      {id: "b1", name: "Mot B1", sub: "Futur simple, conditionnel och subjonctif", tenses: ["futur simple", "conditionnel", "subjonctif"]}
    ],

    tenses: {
      "présent": {
        parler: ["parle","parles","parle","parlons","parlez","parlent"],
        finir: ["finis","finis","finit","finissons","finissez","finissent"],
        vendre: ["vends","vends","vend","vendons","vendez","vendent"],
        être: ["suis","es","est","sommes","êtes","sont"],
        avoir: ["ai","as","a","avons","avez","ont"],
        aller: ["vais","vas","va","allons","allez","vont"],
        faire: ["fais","fais","fait","faisons","faites","font"],
        venir: ["viens","viens","vient","venons","venez","viennent"],
        pouvoir: ["peux","peux","peut","pouvons","pouvez","peuvent"],
        vouloir: ["veux","veux","veut","voulons","voulez","veulent"],
        devoir: ["dois","dois","doit","devons","devez","doivent"],
        prendre: ["prends","prends","prend","prenons","prenez","prennent"],
        dire: ["dis","dis","dit","disons","dites","disent"],
        rule: "Presens bildas på fjärde temaformen (je parle, je finis, je vends). Plural bildas oftast på andra temaformen: finiss-ons, vend-ons."
      },
      "imparfait": {
        parler: ["parlais","parlais","parlait","parlions","parliez","parlaient"],
        finir: ["finissais","finissais","finissait","finissions","finissiez","finissaient"],
        vendre: ["vendais","vendais","vendait","vendions","vendiez","vendaient"],
        être: ["étais","étais","était","étions","étiez","étaient"],
        avoir: ["avais","avais","avait","avions","aviez","avaient"],
        aller: ["allais","allais","allait","allions","alliez","allaient"],
        faire: ["faisais","faisais","faisait","faisions","faisiez","faisaient"],
        rule: "Stammen från andra temaformen (parl-, finiss-, vend-) + -ais, -ais, -ait, -ions, -iez, -aient."
      },
      "passé composé": {
        parler: ["ai parlé","as parlé","a parlé","avons parlé","avez parlé","ont parlé"],
        finir: ["ai fini","as fini","a fini","avons fini","avez fini","ont fini"],
        vendre: ["ai vendu","as vendu","a vendu","avons vendu","avez vendu","ont vendu"],
        tomber: ["suis tombé(e)","es tombé(e)","est tombé/tombée","sommes tombé(e)s","êtes tombé(e)(s)","sont tombés/tombées"],
        être: ["ai été","as été","a été","avons été","avez été","ont été"],
        avoir: ["ai eu","as eu","a eu","avons eu","avez eu","ont eu"],
        faire: ["ai fait","as fait","a fait","avons fait","avez fait","ont fait"],
        prendre: ["ai pris","as pris","a pris","avons pris","avez pris","ont pris"],
        aller: ["suis allé(e)","es allé(e)","est allé/allée","sommes allé(e)s","êtes allé(e)(s)","sont allés/allées"],
        venir: ["suis venu(e)","es venu(e)","est venu/venue","sommes venu(e)s","êtes venu(e)(s)","sont venus/venues"],
        rule: "Avoir eller être i presens + participe passé. Aller-gruppen och reflexiva verb tar être, och då böjs participet efter subjektet."
      },
      "plus-que-parfait": {
        parler: ["avais parlé","avais parlé","avait parlé","avions parlé","aviez parlé","avaient parlé"],
        finir: ["avais fini","avais fini","avait fini","avions fini","aviez fini","avaient fini"],
        vendre: ["avais vendu","avais vendu","avait vendu","avions vendu","aviez vendu","avaient vendu"],
        tomber: ["étais tombé(e)","étais tombé(e)","était tombé/tombée","étions tombé(e)s","étiez tombé(e)(s)","étaient tombés/tombées"],
        rule: "Avoir eller être i imparfait + participe passé."
      },
      "futur simple": {
        parler: ["parlerai","parleras","parlera","parlerons","parlerez","parleront"],
        finir: ["finirai","finiras","finira","finirons","finirez","finiront"],
        vendre: ["vendrai","vendras","vendra","vendrons","vendrez","vendront"],
        être: ["serai","seras","sera","serons","serez","seront"],
        avoir: ["aurai","auras","aura","aurons","aurez","auront"],
        aller: ["irai","iras","ira","irons","irez","iront"],
        faire: ["ferai","feras","fera","ferons","ferez","feront"],
        venir: ["viendrai","viendras","viendra","viendrons","viendrez","viendront"],
        pouvoir: ["pourrai","pourras","pourra","pourrons","pourrez","pourront"],
        vouloir: ["voudrai","voudras","voudra","voudrons","voudrez","voudront"],
        devoir: ["devrai","devras","devra","devrons","devrez","devront"],
        prendre: ["prendrai","prendras","prendra","prendrons","prendrez","prendront"],
        dire: ["dirai","diras","dira","dirons","direz","diront"],
        rule: "Infinitivet (utan -e för verb på -re) + -ai, -as, -a, -ons, -ez, -ont: je parlerai, je vendrai. Ändelserna är presens av avoir."
      },
      "conditionnel": {
        parler: ["parlerais","parlerais","parlerait","parlerions","parleriez","parleraient"],
        finir: ["finirais","finirais","finirait","finirions","finiriez","finiraient"],
        vendre: ["vendrais","vendrais","vendrait","vendrions","vendriez","vendraient"],
        être: ["serais","serais","serait","serions","seriez","seraient"],
        avoir: ["aurais","aurais","aurait","aurions","auriez","auraient"],
        aller: ["irais","irais","irait","irions","iriez","iraient"],
        faire: ["ferais","ferais","ferait","ferions","feriez","feraient"],
        venir: ["viendrais","viendrais","viendrait","viendrions","viendriez","viendraient"],
        pouvoir: ["pourrais","pourrais","pourrait","pourrions","pourriez","pourraient"],
        vouloir: ["voudrais","voudrais","voudrait","voudrions","voudriez","voudraient"],
        devoir: ["devrais","devrais","devrait","devrions","devriez","devraient"],
        prendre: ["prendrais","prendrais","prendrait","prendrions","prendriez","prendraient"],
        dire: ["dirais","dirais","dirait","dirions","diriez","diraient"],
        rule: "Samma stam som futur simple + imparfait-ändelserna -ais, -ais, -ait, -ions, -iez, -aient: je voudrais, on pourrait. Används för artighet, önskningar och si-satser: Si j'avais le temps, je viendrais."
      },
      "subjonctif": {
        parler: ["parle","parles","parle","parlions","parliez","parlent"],
        finir: ["finisse","finisses","finisse","finissions","finissiez","finissent"],
        vendre: ["vende","vendes","vende","vendions","vendiez","vendent"],
        être: ["sois","sois","soit","soyons","soyez","soient"],
        avoir: ["aie","aies","ait","ayons","ayez","aient"],
        aller: ["aille","ailles","aille","allions","alliez","aillent"],
        faire: ["fasse","fasses","fasse","fassions","fassiez","fassent"],
        venir: ["vienne","viennes","vienne","venions","veniez","viennent"],
        pouvoir: ["puisse","puisses","puisse","puissions","puissiez","puissent"],
        vouloir: ["veuille","veuilles","veuille","voulions","vouliez","veuillent"],
        devoir: ["doive","doives","doive","devions","deviez","doivent"],
        prendre: ["prenne","prennes","prenne","prenions","preniez","prennent"],
        dire: ["dise","dises","dise","disions","disiez","disent"],
        rule: "Subjonctif présent: stammen från ils i presens (ils finissent → finiss-) + -e, -es, -e, -ions, -iez, -ent. Används efter il faut que, je veux que, bien que och uttryck för känslor: Il faut que tu viennes."
      }
    },

    // Förklaringar som ersätter tempusregeln för ett visst verb ("tempus|verb")
    notes: {
      "présent|être": "Oregelbundet och det viktigaste verbet av alla. Lär dig formerna utantill.",
      "présent|avoir": "Oregelbundet. Används också som hjälpverb i passé composé: j'ai parlé.",
      "présent|aller": "Oregelbundet. Används i futur proche: je vais manger.",
      "présent|faire": "Oregelbundet. Obs: vous faites, inte vous faisez.",
      "présent|venir": "Oregelbundet. Stammen blir vien- i singular och vienn- i ils viennent.",
      "présent|pouvoir": "Oregelbundet. Singular slutar på -x: je peux, tu peux.",
      "présent|vouloir": "Oregelbundet. Singular slutar på -x: je veux, tu veux.",
      "présent|devoir": "Oregelbundet. Stammen byts: je dois, nous devons, ils doivent.",
      "présent|prendre": "Oregelbundet. Obs: ils prennent med två n.",
      "présent|dire": "Oregelbundet. Obs: vous dites, inte vous disez.",
      "imparfait|être": "Être har en egen stam i imparfait: ét-.",
      "passé composé|être": "Être tar avoir i passé composé: j'ai été.",
      "passé composé|avoir": "Participet av avoir är eu: j'ai eu.",
      "passé composé|faire": "Participet av faire är fait: j'ai fait.",
      "passé composé|prendre": "Participet av prendre är pris: j'ai pris.",
      "passé composé|aller": "Aller tar être, och participet böjs efter subjektet: elle est allée.",
      "passé composé|venir": "Venir tar être, och participet böjs efter subjektet: elles sont venues.",
      "futur simple|être": "Oregelbunden stam: ser-. Je serai, nous serons.",
      "futur simple|avoir": "Oregelbunden stam: aur-. J'aurai, ils auront.",
      "futur simple|aller": "Oregelbunden stam: ir-. J'irai, nous irons.",
      "futur simple|faire": "Oregelbunden stam: fer-. Je ferai.",
      "futur simple|venir": "Oregelbunden stam: viendr-. Je viendrai.",
      "futur simple|pouvoir": "Oregelbunden stam med två r: pourr-. Je pourrai.",
      "futur simple|vouloir": "Oregelbunden stam: voudr-. Je voudrai.",
      "futur simple|devoir": "Oregelbunden stam: devr-. Je devrai.",
      "conditionnel|vouloir": "Je voudrais är det artiga sättet att säga vad man vill ha.",
      "conditionnel|pouvoir": "Tu pourrais … ? är ett artigt sätt att be om något.",
      "conditionnel|devoir": "Tu devrais = du borde. Används för att ge råd.",
      "subjonctif|être": "Helt oregelbundet: que je sois, que nous soyons.",
      "subjonctif|avoir": "Helt oregelbundet: que j'aie, qu'il ait, que nous ayons.",
      "subjonctif|aller": "Två stammar: aill- (je, tu, il, ils) och all- (nous, vous).",
      "subjonctif|faire": "Oregelbunden stam: fass-. Il faut que je fasse mes devoirs.",
      "subjonctif|pouvoir": "Oregelbunden stam: puiss-. Bien que je puisse …",
      "subjonctif|vouloir": "Två stammar: veuill- och voul- (nous, vous).",
      "subjonctif|venir": "Två stammar: vienn- och ven- (nous, vous), som i presens.",
      "subjonctif|devoir": "Två stammar: doiv- och dev- (nous, vous), som i presens.",
      "subjonctif|prendre": "Två stammar: prenn- och pren- (nous, vous), som i presens."
    }
  }
};
