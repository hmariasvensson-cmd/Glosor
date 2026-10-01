# Innehåll till övningarna i Franska I (universitet)

Franska I motsvarar den första terminen (1–30 hp) i franska vid ett svenskt universitet, se `docs/franska-universitet.md`. Kursen har ingen lärobok och följer universitetens fyra block: grammatik och skriftlig färdighet, fonetik och muntlig franska, litteratur, och kultur och samhälle. Eleven har läst Franska 3–6 (Franska 6 = koden `fr4`), siktar på **DELF B2** (provet i `lang.js`; Franska 4 tränar redan DELF B1) och vill studera musik i Frankrike.

Nivån är **B1 → B2**: texterna ska vara på B1+/B2, naturlig och korrekt modern franska, med alla tempus (även passé simple i litterära och historiska texter), subjonctif, sammansatta relativpronomen, passiv, dubbla pronomen, indirekt tal med tempusföljd och bindeord för akademisk text. Förklaringar och frågor skrivs på svenska för en vuxen student, med **både svensk och fransk terminologi** (direkt objekt / COD, bisats / proposition subordonnée …). Texttyperna är universitetets: föreläsningsutdrag, seminariediskussion, radioreportage, intervju, sakprosa om geografi, historia och politik, porträtt av författare och epoker, och analys av dikter och romanutdrag.

## Kapitel

| id | tema | grammatik (grammar.json) | fonetik |
|---|---|---|---|
| u1 | La France : géographie et régions | `det` (artiklar, prepositioner med geografiska namn) | vokalsystemet, öppna och slutna vokaler |
| u2 | Histoire de France (1789–1968) | `psimple` | nasalvokaler |
| u3 | Institutions et vie politique | `passif`, `prepinf` | e caduc |
| u4 | La société française aujourd'hui | `subj3`, `adjpos` | liaison |
| u5 | La francophonie | `pronord`, `det` | enchaînement, rytmgrupper |
| u6 | Le roman et la nouvelle | `relpro`, `psimple`, `adjpos` | [y] / [u] / [ø] |
| u7 | Poésie, théâtre et chanson | `accord` | e caduc i vers, intonation |
| u8 | Médias, cinéma, BD et langue | `concord`, `inv` | intonation och variation |
| ug | Terminologie · Grammaire | `fonc`, `inv` | – |
| uf | Terminologie · Phonétique | – | termer och IPA |
| ur | Expressions · Études universitaires | `prepinf` | – |

## Format

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`, en fil per typ); Franska 3:s tillägg i `languages/fr/content/SPEC.md` och exemplen i `languages/fr4/content/*.json`. Observera:

- Grammatikområdena och regel-id:n står i `languages/fru/grammar.json`. Varje område har en egen fil, `grammar-<område>.json`, med id-prefixet `<område>-` och 25–30 frågor. Alla regler ingår i "Hitta felet", så felalternativen måste vara entydigt fel.
- `fonc` (satsanalys) är luckfrågor där luckan är termen, inte satsdelen. Till exempel `« Le jury a félicité la pianiste. » Ici, « la pianiste » est [complément d'objet direct (COD)].` med felalternativ som `COI`, `attribut du sujet`, `complément circonstanciel`. Terminologin följer den franska skolgrammatiken, och `why` ger den svenska termen.
- `psimple`: meningarna är litterära eller historiska (tredje person dominerar). Luckan är verbformen i passé simple eller, i `ps-imp`, valet mellan passé simple och imparfait.
- `listening.json` och `reading.json`: 2 hörtexter och 2 lästexter per kapitel u1–u8. Hörtexter 280–380 ord med 6–8 frågor (föreläsningsutdrag, radioreportage, intervju, seminariediskussion; `who` för talarna). Lästexter 400–600 ord med 7–8 frågor.
- **Upphovsrätt** (se `docs/spec/allmant.md`): citera bara verk av författare som dog 1955 eller tidigare (Hugo, Baudelaire, Verlaine, Rimbaud, Maupassant, Flaubert, Zola, Apollinaire, Proust, Saint-Exupéry, Colette …), och bara kortare utdrag ur originaltexten. Nutida och skyddade verk (Camus, Sartre, Sagan, Prévert, Brel, Ernaux, Schmitt, Nothomb, Diome, Faye …) sammanfattas med egna ord, utan citat. Läroböckerna och kursplanerna citeras aldrig.
- `stories.json`: en berättelse per kapitel u1–u8, i litterär stil med passé simple som berättartempus. Luckor för tempus (passé simple/imparfait/plus-que-parfait/subjonctif/conditionnel) och bindeord.
- `culture.json`: 10 korta texter med kontrollerbara fakta (årtal, siffror och namn ska stämma).
- `phrases.json`: 45 fraser för akademiska och formella situationer (seminarium, föredrag, mejl till lärare, muntlig tenta).
- `mal.json`: kapitelmål formulerade som förväntade studieresultat ("Studenten ska kunna …" i jagform, som i de andra kurserna: "Jag kan …").
- `uttal.json`: ett fonetikmoment per kapitel, med ordpar som webbläsarens franska röster uttalar tydligt olika.
- `exam.json`: DELF B2 i samma format som `languages/fr4/content/exam.json`, med id:n `fru-…`. Extrauppgifterna `fru-pe-syn-1` … `-3` är DALF C1-lika synteser (`level: "C1"`, `sim: false`, 200–240 ord): två egna texter på 250–350 ord står i `task` efter instruktionen, eftersom skrivvyn visar `task` men inte `lines`, och Claude får då texterna i bedömningen.
- `prompts.json` (skrivuppgifter: résumé, textkommentar, formellt brev, argumenterande text) skrivs efter ordlistan.
- `transkription.json` och `satsanalys.json` hör till egna övningstyper, med format i `docs/spec/transkription.md` och `docs/spec/satsanalys.md`.
- Inga verkliga personnamn på studenter. Fakta i kultur- och historietexter ska gå att kontrollera.
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.

## Övningstyperna transkription och satsanalys

Två egna övningstyper, som bara syns i menyn när innehållsfilen finns (andra kurser får inga tomma knappar). Formaten står i `docs/spec/transkription.md` och `docs/spec/satsanalys.md`.
