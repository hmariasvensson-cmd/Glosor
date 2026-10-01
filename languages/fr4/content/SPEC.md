# Innehåll till övningarna i Franska 6 (koden `fr4`)

Franska 6 motsvarar Moderna språk 6 (steg 6, GERS B1.2; i Gy25 fördjupning, nivå 2). Kursen hette först Franska 4, men innehållet ligger på steg 6; koden `fr4` och `storageKey` är kvar så att framstegen inte försvinner. Kursen har ingen lärobok. Eleven är 17–18 år, har läst Franska 3–5 (`fr`, `frs4`, `frs5`), siktar på **DELF B1** och vill studera musik i Frankrike. Texterna ska vara på nivå **B1.2, men inte svårare**: naturlig, korrekt modern franska med alla tempus i text, subjonctif i vanliga fall, conditionnel passé, sammansatta relativpronomen, passiv, gérondif, indirekt tal och bindeord för argumentation. Texttyperna för steget: debattartikel, föredrag, formellt brev eller ansökan, reportage, porträtt av en författare och epok, dramatik och äldre litteratur (kort citerad). Läs `languages/fr4/words.txt` och använd kapitlets glosor.

Kapitel-id: q1 Études et avenir, q2 Médias et réseaux, q3 Environnement et société, q4 Arts, musique et spectacle, q5 Vivre et travailler ailleurs, q6 Histoire et mémoire, q7 Santé, sport et bien-être, q8 Éthique et francophonie, qr Expressions · Débattre et argumenter.

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`, grammatiken i `docs/spec/grammatik.md`); Franska 3:s tillägg i `languages/fr/content/SPEC.md` och exemplen i `languages/fr/content/*.json`. Observera:

- Grammatikområdena och regel-id:n står i `languages/fr4/grammar.json` (`topics` och `rules`). Varje område har en egen fil, `grammar-<område>.json`, med id-prefixet `<område>-`. Alla regler ingår i "Hitta felet", så felalternativen måste vara entydigt fel. Undantag: `style-reg` (vardagligt eller formellt ord, där felalternativen är korrekt talspråk) står i `ERR_SKIP` i `src/kinds/60-grammar.js`.
- `prompts.json`: `need.tenses` får innehålla `"présent"`, `"passé composé"`, `"imparfait"`, `"futur proche"`, `"conditionnel"` och `"subjonctif"` (se `tenseCheck` i `lang.js`). `need.connectors` räknar bindeorden i `connectors` i `lang.js` (Franska 3:s lista plus bindeord för argumentation). Skrivlängd 150–250 ord för de längre uppgifterna.
- Litteratur, sång och film: skriv aldrig av texter vars upphovsperson lever eller dog för mindre än 70 år sedan. Äldre verk (Molière, Hugo, Baudelaire …) får citeras kort.
- `exam.json`: DELF B1 i samma format som `languages/fr/content/exam.json`, med id:n `fr4-…`.
- Inga verkliga personnamn på elever. Fakta i kultur- och historietexter ska gå att kontrollera.
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"` och läs igenom texten en gång till innan du är klar.
