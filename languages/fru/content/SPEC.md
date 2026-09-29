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

Formatet och reglerna är desamma som för Franska 3 och Franska 6 (`fr4`): se `languages/fr/content/SPEC.md`, `languages/fr/content/GRAMMATIK-SPEC.md`, `docs/REGLER-SPEC.md` och exemplen i `languages/fr4/content/*.json`. Observera:

- Grammatikområdena och regel-id:n står i `languages/fru/grammar.json`. Varje område har en egen fil, `grammar-<område>.json`, med id-prefixet `<område>-` och 25–30 frågor. Alla regler ingår i "Hitta felet", så felalternativen måste vara entydigt fel.
- `fonc` (satsanalys) är luckfrågor där luckan är termen, inte satsdelen. Till exempel `« Le jury a félicité la pianiste. » Ici, « la pianiste » est [complément d'objet direct (COD)].` med felalternativ som `COI`, `attribut du sujet`, `complément circonstanciel`. Terminologin följer den franska skolgrammatiken, och `why` ger den svenska termen.
- `psimple`: meningarna är litterära eller historiska (tredje person dominerar). Luckan är verbformen i passé simple eller, i `ps-imp`, valet mellan passé simple och imparfait.
- `listening.json` och `reading.json`: 2 hörtexter och 2 lästexter per kapitel u1–u8. Hörtexter 280–380 ord med 6–8 frågor (föreläsningsutdrag, radioreportage, intervju, seminariediskussion; `who` för talarna). Lästexter 400–600 ord med 7–8 frågor.
- **Upphovsrätt:** citera bara verk av författare som dog 1955 eller tidigare (Hugo, Baudelaire, Verlaine, Rimbaud, Maupassant, Flaubert, Zola, Apollinaire, Proust, Saint-Exupéry, Colette …), och bara kortare utdrag ur originaltexten. Nutida och skyddade verk (Camus, Sartre, Sagan, Prévert, Brel, Ernaux, Schmitt, Nothomb, Diome, Faye …) sammanfattas med egna ord, utan citat. Läroböckerna och kursplanerna citeras aldrig.
- `stories.json`: en berättelse per kapitel u1–u8, i litterär stil med passé simple som berättartempus. Luckor för tempus (passé simple/imparfait/plus-que-parfait/subjonctif/conditionnel) och bindeord.
- `culture.json`: 10 korta texter med kontrollerbara fakta (årtal, siffror och namn ska stämma).
- `phrases.json`: 45 fraser för akademiska och formella situationer (seminarium, föredrag, mejl till lärare, muntlig tenta).
- `mal.json`: kapitelmål formulerade som förväntade studieresultat ("Studenten ska kunna …" i jagform, som i de andra kurserna: "Jag kan …").
- `uttal.json`: ett fonetikmoment per kapitel, med ordpar som webbläsarens franska röster uttalar tydligt olika.
- `exam.json`: DELF B2 i samma format som `languages/fr4/content/exam.json`, med id:n `fru-…`.
- `prompts.json` (skrivuppgifter: résumé, textkommentar, formellt brev, argumenterande text) skrivs efter ordlistan.
- `transkription.json` och `satsanalys.json` hör till egna övningstyper, med format i deras källfiler i `src/kinds/`.
- Inga verkliga personnamn på studenter. Fakta i kultur- och historietexter ska gå att kontrollera.
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.

## Övningstyperna transkription och satsanalys

Två egna övningstyper, som bara syns i menyn när innehållsfilen finns (andra kurser får inga tomma knappar). build.py kontrollerar unika id, att `sec` finns, facit inom `opts`, en markerad del och tre felalternativ.

**Transkription** (`src/kinds/54-transkription.js`, typ `ipa`, gruppen *Tala och skriva* bredvid uttal). `transkription.json` = `[{id, sec, topic, fr, ipa, alt, ok?, why}]`:

- `ipa`: standarduttal på ordboksnivå (Larousse/TLFi) inom `/…/`, med `ʁ`, `ɡ` och nasalvokalerna `ɑ̃ ɛ̃ ɔ̃ œ̃`. Fraser skrivs med mellanslag mellan orden och `‿` för liaison; `.` får markera stavelser.
- `alt`: tre typiska fel (fel nasalvokal eller uttalad nasalkonsonant, uttalat e caduc, saknad eller förbjuden liaison, fel öppen/sluten vokal, uttalad stum slutkonsonant). Använd aldrig vanligt `r` eller `g` i ett felalternativ, eftersom rättningen räknar dem som `ʁ` och `ɡ`.
- `ok`: fler godkända uttal (t.ex. `[bʁɛ̃]` för *brun*, e caduc som behålls i *samedi*).
- `topic`: `nasal`, `ecaduc`, `liaison` (även enchaînement), `h`, `voy` (öppna/slutna), `yu` ([y] [u] [ø] [œ]), `semi` (halvvokaler), `graf` (grafem–fonem), `sv` (kontraster med svenskan). Namnen står i `IPA_TOPICS`.
- Tre former, efter hur väl eleven kan posten (`S.ipa[id].s`): ord → välj IPA, IPA → välj ord, och skriv transkriptionen med en IPA-knapprad. Rättningen jämför bara ljuden: snedstreck, hakparenteser, mellanslag, `.` `·` `-` `‿` `_`, betonings- och längdtecken tas bort, och `r`/`ʀ` räknas som `ʁ`.
- Statistik i `S.ipa = {<id>: {s, last, r, n}}`, i statistiken per moment.

**Satsanalys** (`src/kinds/62-satsanalys.js`, typ `sats`, gruppen *Grammatik*). `satsanalys.json` = `[{id, sec, lvl, t, fr, opts, a, why}]`:

- `fr`: meningen med exakt en markerad del `[[…]]`, som visas understruken.
- `t`: `fn` (satsdel eller ordets funktion: sujet, COD, COI, attribut du sujet/du COD, complément circonstanciel de temps/lieu/cause/manière/but/moyen/concession, complément du nom, épithète, apposition, complément d'agent …) eller `prop` (satstyp: proposition principale/indépendante, subordonnée relative/complétive/interrogative indirecte, circonstancielle de temps/cause/but/concession/condition/conséquence, infinitive, participiale).
- `lvl` 1–3 (lätt → svår). En runda tar det eleven inte kan först och visas från lätt till svår.
- `why` börjar med den franska termen och den svenska (`**COD** = direkt objekt …`) och förklarar sedan på svenska.
- Statistik i `S.sa = {<id>: {s, last, r, n}}`, i statistiken för satsdelar och satstyper.
