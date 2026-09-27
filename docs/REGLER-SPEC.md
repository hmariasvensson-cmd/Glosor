# Grammatikregler: content/regler.json

Varje grammatikområde i kursen (`grammar.topics` i `languages/<kod>/lang.js`, utom `err`, `mix` och `bok`) får en regelsida. Den visas innan eleven övar och går att öppna efter varje svar. Filen är ett JSON-objekt med områdets id som nyckel:

```json
{"praep": {
  "title": "Prepositioner och kasus",
  "intro": "En eller två meningar om vad regeln handlar om och varför den är viktig.",
  "parts": [
    {"h": "Wechselpräpositionen: var eller vart?",
     "t": "Förklaring på svenska. **Fetstil** markeras med dubbla stjärnor. Radbrytning med \\n.",
     "table": {"head": ["", "maskulinum", "femininum", "neutrum", "plural"],
               "rows": [["dativ", "dem", "der", "dem", "den"], ["ackusativ", "den", "die", "das", "die"]]},
     "ex": [{"fr": "Das Buch liegt auf **dem** Tisch.", "sv": "Boken ligger på bordet."}],
     "tip": "Minnesregel eller vanligt fel att se upp med."}
  ]}}
```

- Allt utom exemplen skrivs på enkel, tydlig svenska för en tonåring. Exemplen (`fr`, fältet heter så för alla språk) är på målspråket och ska vara korrekta och naturliga.
- 2–5 delar per område, med 2–4 exempel per del. Tabeller där de hjälper (böjningar, artiklar, pronomen). Ett tips per område räcker.
- Förklara det som frågorna i `content/grammar-*.json` övar, med samma regler som i `grammar.rules`. Jämför gärna med svenskan, och nämn de vanligaste felen svenskar gör.
- Nivån ska passa kursen: kort och konkret i nybörjarkurser, mer utförligt i Tyska 5.
