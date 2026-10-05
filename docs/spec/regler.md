# Grammatikregler: content/regler.json

Allmänna regler: [allmant.md](allmant.md). Grammatikfrågorna: [grammatik.md](grammatik.md).

Varje grammatikområde i kursen (`topics` i `languages/<kod>/grammar.json`, utom `err`, `mix` och `bok`) får en regelsida. Varje pass med området börjar med en kort ruta, "Regeln i korthet" (fältet `kort`, med hela regeln i en utfällning), och under passet finns knappen Regeln ovanför varje fråga med samma innehåll. Hela regeln går också att öppna efter varje svar. Filen är ett JSON-objekt med områdets id som nyckel:

```json
{"praep": {
  "title": "Prepositioner och kasus",
  "kort": "Efter **an, auf, in** … (Wechselpräpositionen): **dativ** när något är på ett ställe (wo?).\n**Ackusativ** när något rör sig dit (wohin?).\nEfter **mit, bei, von, zu** … alltid dativ.",
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

- `kort` (valfritt men önskat): regeln i korthet, 2–5 korta rader som eleven läser på några sekunder innan passet och kan öppna under passet. En sträng med `\n` mellan raderna eller en lista med strängar; `**fetstil**` fungerar som i resten av filen. Skriv det viktigaste, inte en sammanfattning av alla delar: vad formen är, hur den bildas och den vanligaste fällan. Saknas `kort` visas `intro`, och saknas även den första delens `t`. build.py stoppar om `kort` inte är en sträng eller en lista med strängar, och varnar vid fler än 6 rader.
- Allt utom exemplen skrivs på enkel, tydlig svenska för en tonåring. Exemplen (`fr`, fältet heter så för alla språk) är på målspråket och ska vara korrekta och naturliga.
- 2–5 delar per område, med 2–4 exempel per del. Tabeller där de hjälper (böjningar, artiklar, pronomen). Ett tips per område räcker.
- Förklara det som frågorna i `content/grammar-*.json` övar, med samma regler som i `grammar.rules`. Jämför gärna med svenskan, och nämn de vanligaste felen svenskar gör.
- Nivån ska passa kursen: kort och konkret i nybörjarkurser, mer utförligt i Tyska 5.
- build.py stoppar om en nyckel inte är ett område i `grammar.json`, om `title` eller `parts` saknas, om en del är tom (varken `h`, `t`, `table` eller `ex`), om `ex` inte är en lista med `{fr, sv}` eller om `table` inte är `{head, rows}`.
