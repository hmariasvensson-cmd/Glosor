/* Inställningar för franska. Orden ligger i words.txt och videorna i videos.json i samma mapp. */
LANGUAGES.fr = {
  name: "Franska",            // visas i språkväljaren
  title: "Franska glosor",    // rubrik på sidan
  course: "Franska 3",          // kursen som ordlistan hör till
  level: "A2 → B1",           // ungefärlig nivå i europeiska språkskalan (GERS/CEFR)
  inLang: "på franska",       // "Skriv på franska"
  tts: "fr-FR",               // röst för uppläsning
  storageKey: "franska-glosor-v2", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln

  accents: "é è ê à â ç ô î û ù ë ï œ",
  verbAccents: "é è ê à â ç ô î û",
  // Tas bort från början av svaret innan det rättas (i den här ordningen)
  articles: [/^(le|la|les|un|une|des) /, /^l'/],
  // Tas bort från början av svaret i verbträningen
  pronouns: /^(il\/elle|ils\/elles|je|j'|tu|il|elle|on|nous|vous|ils|elles) ?/,
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
    "imparfait": t => (t.match(/(^|[^\p{L}])(\p{L}{2,}(ais|ait|aient|ions|iez))(?![\p{L}])/giu)||[])
      .some(m => !/(mais|jamais|vais|fais|sais|frais|anglais|français|palais|mauvais|épais|lait|fait|avions|attentions|questions|émissions|stations|ions)$/i.test(m.trim())),
    "futur proche": t => /(^|[^\p{L}])(vais|vas|va|allons|allez|vont)\s+\p{L}+(er|ir|re)(?![\p{L}])/iu.test(t),
    "présent": t => t.trim().length > 0
  },

  verbs: {
    persons: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
    // Pronomen som skrivs framför verbformen (je blir j' framför vokal)
    prefix: (i, form, persons) => (i === 0 && /^[aeéêiou]/.test(form)) ? "j'" : persons[i] + " ",
    sv: {parler: "tala", finir: "sluta", vendre: "sälja", tomber: "falla",
         être: "vara", avoir: "ha", aller: "gå, åka", faire: "göra", venir: "komma",
         pouvoir: "kunna", vouloir: "vilja", devoir: "måste", prendre: "ta", dire: "säga"},

    // Varje spel övar ett urval tempus. Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres", name: "Personböjning", sub: "Présent: je, tu, il, nous, vous, ils", tenses: ["présent"]},
      {id: "tempus", name: "Tempus", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]}
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
      "passé composé|venir": "Venir tar être, och participet böjs efter subjektet: elles sont venues."
    }
  }
};
