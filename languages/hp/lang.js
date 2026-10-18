/* Högskoleprovet, delprovet ORD (svensk ordförståelse), för en gymnasieelev. Ersätter appen HP-akuten.
   Svenska → svenska: mono: true och kind: "hp" styr allt som skiljer kursen från språkkurserna (ingen uppläsning, inga
   skrivövningar på ett främmande språk, flerval med fem alternativ A–E, Provpass ORD, se src/kinds/06-hp.js och
   docs/ARKITEKTUR.md, Högskoleprovet ORD). Koden frågar efter fälten, aldrig efter kurskoden.
   Orden kommer från en upphovsrättsskyddad ordlista och ligger i den privata mappen book/ (gitignorerad, eget lokalt
   git-repo), se book/README.md. Utan orden byggs kursen inte och står som kommande i väljaren (upcoming.json). */
LANGUAGES.hp = {
  name: "Svenska",
  title: "Högskoleprovet ORD",
  course: "Högskoleprovet ORD",
  kind: "hp",                    // HP-flervalet, provpasset och HP-statistiken (06-hp.js)
  mono: true,                    // ord och betydelse på svenska: inga översättningar, ingen uppläsning, flerval räcker till "kan"
  inLang: "på svenska",
  tts: "sv-SE",
  htmlLang: "sv",
  etyLabel: "Förklaring",
  // Tredje fältet i words.txt är ordklassen (WORD_CLASSES i build.py); namnen visas på kortet
  genders: {subst: "substantiv", verb: "verb", adj: "adjektiv", adv: "adverb", uttr: "uttryck", prep: "preposition",
    konj: "konjunktion", pron: "pronomen", "räkn": "räkneord", interj: "interjektion", part: "partikel"},
  nextLabel: "Nästa ord i ordlistan",
  storageKey: "glosor-hp-v1",    // ÄNDRA ALDRIG: sparade framsteg ligger under den här nyckeln
};
