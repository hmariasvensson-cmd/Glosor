/* Inställningar för Franska I på universitetet (1–30 hp, B1 → B2). Orden ligger i words.txt och videorna i videos.json.
   Kursen följer de fyra blocken i svenska universitets Franska I (grammatik, fonetik, litteratur, kultur och samhälle),
   se docs/franska-universitet.md. Ingen lärobok. Accenter, artiklar, pronomen, elision, genus, bindeord,
   tempusigenkänning och verbtabeller ärvs från Franska 3 (languages/fr/lang.js), se extends och inherit nedan. */
LANGUAGES.fru = {
  name: "Franska",            // samma språk som Franska 3 och 4 (visas i "Bara franska")
  title: "Franska glosor",
  course: "Franska I (universitet)",
  // Ingen courseGy25: kursen är en universitetskurs och har inget Gy25-namn, så växlingen Gy11/Gy25 visas inte
  level: "B1 → B2",
  // DELF B2: Franska 4 tränar redan DELF B1 i appen, kursen slutar på B1–B2 (GU anger B1–B2), och franska
  // universitet och många konservatorier kräver B2 för utländska studenter (se docs/franska-universitet.md, avsnitt 3)
  exam: {name: "DELF B2", level: "B2"},
  inLang: "på franska",
  tts: "fr-FR",
  htmlLang: "fr",
  storageKey: "glosor-fru-v1", // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
  extends: "fr",               // fälten i inherit hämtas från Franska 3 och slås ihop med fälten här (egna fält vinner)
  inherit: ["accents", "verbAccents", "articles", "pronouns", "genders", "elision", "connectors", "tenseCheck", "verbs"],

  storyIntro: "Läs berättelsen och välj rätt form i varje lucka: rätt tempus eller modus (passé simple, imparfait, plus-que-parfait, subjonctif, conditionnel …) och ett bindeord som passar sammanhanget. Berättelserna är skrivna i litterär stil, med passé simple som berättartempus.",
  cultureIntro: "Läs en kort text om Frankrikes geografi, historia, samhälle eller den fransktalande världen, svara på en fråga och jämför med Sverige.",
  // Bindeorden från Franska 3, samma tillägg som i Franska 4, och bindeord för akademisk text (résumé, commentaire, exposé)
  connectors: {$append: ["tout d'abord", "d'une part", "d'autre part", "en effet", "de plus", "d'ailleurs", "puisque", "grâce à",
      "à cause de", "c'est pourquoi", "par conséquent", "alors que", "tandis que", "bien que", "malgré", "en revanche", "néanmoins",
      "afin de", "afin que", "pour que", "en conclusion", "pour conclure",
      "en outre", "or", "ainsi", "toutefois", "en somme", "certes", "quant à", "dans la mesure où", "en ce qui concerne",
      "non seulement", "de même", "au contraire", "c'est-à-dire", "autrement dit", "en guise de conclusion"]},
  // Tempusigenkänningen från Franska 3, plus conditionnel och subjonctif (som i Franska 4) och passé simple
  // (enkel igenkänning för checklistan, inte för rättning)
  tenseCheck: (() => {
    const w = "(?![\\p{L}])", b = "(^|[^\\p{L}])";
    const cond = new RegExp(b + "(\\p{L}*(er|ir|dr|vr|rr|ur|ttr|oir)(ais|ait|ions|iez|aient))" + w, "giu");
    // Imparfait av verb vars stam slutar som ett conditionnel (tirer → tirait, éclairer → éclairait, espérer → espérait)
    const notCond = /^(vrais|(tir|attir|retir|admir|respir|inspir|expir|soupir|transpir|conspir|vir|chavir|délir|désir|éclair|dur|assur|rassur|jur|mesur|figur|murmur|demeur|satur|tortur|captur|pleur|cour|parcour|secour|mour|ouvr|couvr|découvr|offr|souffr)(ais|ait|ions|iez|aient))$|ér(ais|ait|ions|iez|aient)$/i;
    return {
      "conditionnel": t => (t.match(cond) || []).some(m => !notCond.test(m.replace(/^[^\p{L}]+/u, ""))),
      "subjonctif": t => new RegExp(b + "(sois|soit|soient|soyons|soyez|aie|aies|ait|ayons|ayez|aient|fass\\p{L}*|puiss\\p{L}*|aill(e|es|ent)|sach(e|es|ions|iez|ent)|veuill\\p{L}*|vienn(e|es|ent)|prenn(e|es|ent)|doiv(e|es|ent))" + w, "iu").test(t)
        || new RegExp(b + "(que|qu')\\s*(je|j'|tu|il|elle|on|nous|vous|ils|elles)\\s*\\p{L}+(isse|isses|issent|ions|iez)" + w, "iu").test(t),
      // Tredje person av de vanligaste verben i passé simple, och pluraländelserna -èrent/-irent/-urent/-inrent
      "passé simple": t => new RegExp(b + "(fut|furent|eut|eurent|fit|firent|vint|vinrent|prit|prirent|put|purent|dut|durent|sut|surent|voulut|voulurent|naquit|mourut|parut|mit|mirent|vit|virent|\\p{L}{2,}(èrent|irent|urent))" + w, "iu").test(t)
    };
  })(),

  // Grammatikövningar. Frågorna ligger i content/grammar-*.json (format i languages/fr/content/GRAMMATIK-SPEC.md).
  // Områden (topics; secs = kapitel där området kommer först) och regelnamn ligger i grammar.json, som build.py lägger i kursens datafil (L.grammar).

  // Verbtabellerna från Franska 3 plus passé simple (att känna igen i litterära texter), med spel för universitetsnivå
  verbs: {
    tenses: {
      "passé simple": {
        parler: ["parlai","parlas","parla","parlâmes","parlâtes","parlèrent"],
        finir: ["finis","finis","finit","finîmes","finîtes","finirent"],
        vendre: ["vendis","vendis","vendit","vendîmes","vendîtes","vendirent"],
        tomber: ["tombai","tombas","tomba","tombâmes","tombâtes","tombèrent"],
        être: ["fus","fus","fut","fûmes","fûtes","furent"],
        avoir: ["eus","eus","eut","eûmes","eûtes","eurent"],
        aller: ["allai","allas","alla","allâmes","allâtes","allèrent"],
        faire: ["fis","fis","fit","fîmes","fîtes","firent"],
        venir: ["vins","vins","vint","vînmes","vîntes","vinrent"],
        pouvoir: ["pus","pus","put","pûmes","pûtes","purent"],
        vouloir: ["voulus","voulus","voulut","voulûmes","voulûtes","voulurent"],
        devoir: ["dus","dus","dut","dûmes","dûtes","durent"],
        prendre: ["pris","pris","prit","prîmes","prîtes","prirent"],
        dire: ["dis","dis","dit","dîmes","dîtes","dirent"],
        rule: "Passé simple är berättartempus i litteratur och historisk text (motsvarar passé composé i tal). Tre typer av ändelser: -er-verb -ai, -as, -a, -âmes, -âtes, -èrent (il parla); de flesta -ir- och -re-verb -is, -is, -it, -îmes, -îtes, -irent (il finit); många oregelbundna -us, -us, -ut, -ûmes, -ûtes, -urent (il fut, il put). Oftast möter man tredje person: il/elle och ils/elles."
      }
    },
    notes: {
      "passé simple|être": "Stammen f-: il fut, ils furent. Förväxla inte med futur (il sera) eller med imparfait (il était).",
      "passé simple|avoir": "Stammen e- (uttalas [y]): il eut, ils eurent.",
      "passé simple|aller": "Aller är regelbundet i passé simple: il alla, ils allèrent.",
      "passé simple|faire": "Stammen f-: il fit, ils firent. Förväxla inte il fit (gjorde) med il fait (gör).",
      "passé simple|venir": "Egen typ med -in-: je vins, il vint, ils vinrent, nous vînmes.",
      "passé simple|prendre": "Samma som participet pris: il prit, ils prirent.",
      "passé simple|dire": "Singularformerna är samma som i presens (je dis, il dit). Plural skiljer: nous dîmes, ils dirent.",
      "passé simple|finir": "Singularformerna är samma som i presens (je finis, il finit). Plural skiljer: ils finirent (presens: ils finissent).",
      "passé simple|pouvoir": "Stammen p-: il put, ils purent.",
      "passé simple|devoir": "Stammen d-: il dut, ils durent. Nous dûmes har cirkumflex.",
      "passé simple|vouloir": "Il voulut, ils voulurent."
    },
    games: [
      {id: "ps", name: "Passé simple", sub: "il fut, elle prit, ils vinrent: berättartempus i litteraturen", tenses: ["passé simple"]},
      {id: "subj", name: "Subjonctif och conditionnel", sub: "que je sois, qu'il fasse, je voudrais, nous pourrions", tenses: ["subjonctif", "conditionnel"]},
      {id: "alla", name: "Alla tempus", sub: "Présent, alla dåtider, futur, conditionnel och subjonctif blandat", tenses: ["présent", "imparfait", "passé composé", "plus-que-parfait", "passé simple", "futur simple", "conditionnel", "subjonctif"]}
    ]
  }
};
