/* Inställningar för franska. Orden ligger i words.txt och videorna i videos.json i samma mapp. */
LANGUAGES.fr = {
  name: "Franska",            // visas i språkväljaren
  title: "Franska glosor",    // rubrik på sidan
  course: "Franska 3",         // kursen som ordlistan hör till
  exam: {name: "DELF B1", level: "B1"},   // språkprovet eleven siktar på
  goal: "att klara språkprovet för att få studera musik utomlands (i Frankrike)",   // valfritt: elevens mål, nämns i Claudes bedömning
  courseGy25: "Moderna språk – fortsättning, nivå 1",   // samma kurs i Gy25 (gymnasiet från juli 2025)
  // Elevens lärobok. Kapitel märkta #id|Namn|bok i words.txt kommer från boken (se docs/BOK.md).
  book: {title: "Escalade", authors: "Waagaard, Rödemark, Jonchère och Sandberg"},
  step: 3,                       // steg 1–7 (Moderna språk 1–7), "U" = universitet; sorterar kursväljaren
  level: "A2",                // ungefärlig GERS-nivå: steg 3 ≈ A2.1 enligt Skolverket (provmålet B1 står i exam)
  inLang: "på franska",       // "Skriv på franska"
  tts: "fr-FR",               // röst för uppläsning
  storageKey: "franska-glosor-v2", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  nextCourse: "frs4",         // kursen man går vidare till när den här är klar (Franska 4, steg 4)
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
    // Hjälpverbet, ev. ett eller två adverb (je n'ai pas mangé, il est déjà parti) och ett particip. Ord som slutar som ett
    // particip men inte är det räknas inte: c'est aussi, c'est vrai, il y a du, c'est petit, il est beau, il a peu, magnifique.
    "passé composé": t => [...t.matchAll(/(^|[^\p{L}])(ai|as|a|avons|avez|ont|suis|es|est|sommes|êtes|sont)((\s+(pas|plus|jamais|rien|déjà|aussi|bien|beaucoup|toujours|souvent|encore|vraiment|enfin|même|tout|trop|mal|presque|longtemps)){0,2})\s+(\p{L}+(é|ée|és|ées|i|ie|is|ies|u|ue|us|ues|û|it|ert|ort))(?![\p{L}])/giu)]
      .some(m => !/^(aussi|ainsi|ici|parmi|si|ni|midi|lundi|mardi|mercredi|jeudi|vendredi|samedi|joli|jolie|ami|amie|envie|vie|pluie|compagnie|folie|série|plus|vous|nous|tous|dessus|dessous|jus|bus|virus|campus|bonus|refus|paris|avis|souris|tapis|au|tu|du|qu|gratuit|huit|petit|nuit|lit|fruit|bruit|esprit|crédit|appétit|circuit|profit|fort|vert|tort|port|désert|concert|transport|effort|sport|confort)$|(ai|oi)s?$|ui$|oit$|.(eu|au)$|(que|ques|gue|gues)$|(erie|gie|phie)$/i.test(m[6])),
    // -ais/-ait/-aient: alla ord utom vanliga ord som inte är imparfait (mais, français, je connais, il fait …),
    // conditionnel (je parlerais, je voudrais) och presens av verb på -ayer/-oyer/-uyer (ils essaient, ils paient).
    // -ions/-iez räknas bara efter nous/vous ("nous parlions"), och inte presens av verb på -ier (nous étudions).
    "imparfait": t => (t.match(/(^|[^\p{L}])(\p{L}{2,}(ais|ait|aient))(?![\p{L}])/giu)||[])
      .some(m => !/^(mais|jamais|désormais|vrais|frais|épais|mauvais|niais|biais|palais|balais|relais|délais|essais|rabais|marais|dais|laquais|anglais|français|irlandais|écossais|japonais|polonais|portugais|néerlandais|sénégalais|congolais|libanais|maltais|marseillais|lyonnais|bordelais|lait|souhait|trait|extrait|portrait|retrait|abstrait|distrait|attrait|vais|nais|tais)$|fai[st]$|^(re)?connai[st]$|^(ap|dis|com|re)?parai[st]$|^(dé|com)?plai[st]$|erai(s|t|ent)$|^(voudr|pourr|devr|aur|ir|viendr|reviendr|deviendr|tiendr|saur|faudr|verr|enverr|courr|mourr|recevr|vaudr)ai(s|t|ent)$|^(pa|essa|bala|effra|pa|appu|ennu|envo|nett)ient$/i
        .test(m.replace(/^[^\p{L}]+/u, "")))
      || (t.match(/(^|[^\p{L}])(nous|vous)\s+(\p{L}{2,}(ions|iez))(?![\p{L}])/giu)||[])
        .some(m => !/^(étud|oubl|remerc|appréc|vérif|cop|cr|sk|conf|mar|pr|env|sour|r|pl|publ|expéd|modif|identif|justif|simplif|qualif|assoc|négoc|var|sacrif|certif|rel|photograph|l|n|suppl|all|inject)i(ons|ez)$/i
          .test(m.replace(/^[^\p{L}]*(nous|vous)\s+/iu, ""))),
    // Ev. adverb före infinitiven (va encore augmenter, ne vais pas rester), men inte ça va encore, il va contre, ils vont
    // notre … (ord på -er/-ir/-re som inte är infinitiv)
    "futur proche": t => [...t.matchAll(/(^|[^\p{L}])(vais|vas|va|allons|allez|vont)((\s+(pas|plus|jamais|encore|bientôt|aussi|bien|vraiment|enfin|même|tout|sûrement|certainement|probablement|peut-être|sans doute|donc|alors)){0,2})\s+(\p{L}+(er|ir|re))(?![\p{L}])/giu)]
      .some(m => !/^(encore|entre|contre|notre|votre|autre|hier|super|dernier|premier|cher|mer|hiver|soir|plaisir|désir|loisir|cuir|avenir)$/i.test(m[6])),
    "présent": t => t.trim().length > 0
  },

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i docs/spec/grammatik.md, områdena i grammar.json).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  verbs: {
    // Verbtabellerna (sv, tenses, notes) ligger i verbs.json, som build.py lägger i kursens datafil (ärvda tabeller slås ihop där).
    persons: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
    // Pronomen som skrivs framför verbformen (je blir j' framför vokal, subjonctif får que framför)
    prefix: (i, form, persons, tense) => {
      const p = (i === 0 && /^[aeéêiou]/.test(form)) ? "j'" : persons[i] + " ";
      return tense === "subjonctif" ? (/^[aeiou]/.test(p) ? "qu'" : "que ") + p : p;
    },

    // Varje spel övar ett urval tempus. Statistiken sparas per tempus och per verb.
    games: [
      {id: "pres", name: "Personböjning", sub: "Présent: je, tu, il, nous, vous, ils", tenses: ["présent"]},
      {id: "tempus", name: "Tempus", sub: "Imparfait, passé composé och plus-que-parfait", tenses: ["imparfait", "passé composé", "plus-que-parfait"]},
      {id: "b1", name: "Mot B1", sub: "Futur simple, conditionnel och subjonctif", tenses: ["futur simple", "conditionnel", "subjonctif"]}
    ]
  }
};
