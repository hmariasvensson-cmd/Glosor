# Idéer från andra öppna projekt

Genomgång i september 2026 av öppen källkod och öppna data som är relevanta för Glosor. Licenserna är kontrollerade mot respektive README- eller licenssida. Kontrollera dem igen innan data faktiskt importeras.

**Viktigt att veta om vår nuvarande schemaläggare** (`src/app.js`, `INT=[1,3,7,20]`): ett ord som besvarats rätt fyra gånger får `due=1e9` och kommer aldrig tillbaka, och ett fel nollställer ordet till steg 0. Det är de två största svagheterna, och flera av idéerna nedan tar sikte på dem.

## Projekt

### 1. Anki
[github.com/ankitects/anki](https://github.com/ankitects/anki) · AGPL-3.0
Den stora SRS-appen. Har SM-2 och sedan 23.10 även FSRS inbyggt.
- **Leech-hantering:** ett kort som glömts ≥8 gånger märks som "leech" och lyfts ut. Vi kan flagga ord med många fel och visa dem med exempelmening eller minnesregel. *Lätt.*
- **Prognos i statistiken:** stapel över hur många repetitioner som väntar kommande pass. *Lätt.*
- **"Bury siblings":** ett ord ska inte visas i två riktningar i samma pass. *Lätt.*

### 2. FSRS / fsrs4anki
[github.com/open-spaced-repetition/fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki) · MIT
FSRS består av en schemaläggare och en optimerare som anpassar parametrarna efter användarens historik. Benchmarken [srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark) (~727 miljoner repetitioner från 10 000 Anki-användare) visar att FSRS förutsäger glömska klart bättre än SM-2 och fasta intervall.
- **Önskad retention** (t.ex. 0,9) i stället för fasta steg. *Kommer med ts-fsrs.*
- **Svårighet per ord:** svåra ord får kortare intervall och lätta ord längre. *Kommer med ts-fsrs.*

### 3. ts-fsrs
[github.com/open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) · MIT
FSRS i TypeScript med ESM-, CJS- och UMD-bygge. Senaste stabila version är 5.4.2, och `https://cdn.jsdelivr.net/npm/ts-fsrs@5.4.2/dist/index.umd.js` svarar 200. API: `createEmptyCard()`, `fsrs({request_retention})`, `f.next(card, now, Rating.Good)`, `Rating.Again/Hard/Good/Easy`.
- **Ersätt `INT`-stegen** (se rangordningen nedan). *Medel.*

### 4. Mnemosyne
[github.com/mnemosyne-proj/mnemosyne](https://github.com/mnemosyne-proj/mnemosyne) · AGPL-3.0 (synkklienten LGPL-3.0)
Flashcards med graderingen 0–5 och ett forskningsfokus: anonymiserade loggar samlas in för att studera minne.
- **Självgradering i fler steg** (vet inte / svårt / bra / lätt) vid meningsöversättning, vilket passar direkt in på FSRS fyra betyg. *Lätt.*

### 5. LibreLingo
[github.com/LibreLingo/LibreLingo](https://github.com/LibreLingo/LibreLingo) · AGPL-3.0 (kursinnehållet ofta CC)
Öppet Duolingo-liknande system (Svelte + PouchDB) där kurserna skrivs i YAML och exporteras till JSON.
- **Deklarativt kursformat:** färdigheter med ord, fraser och "mini-ordbok" (hovra eller tryck på ett ord i en övningsmening för att se översättningen). Tryck-för-översättning kan läggas till i våra luckmeningar och meningsöversättningar. *Lätt–medel.*

### 6. LWT – Learning With Texts (community-fork)
[github.com/HugoFara/lwt](https://github.com/HugoFara/lwt) · Unlicense (public domain)
Läsapp: tryck på okända ord, ordstatus, TTS, Anki-export och Wiktionary-definitioner.
- **Färgmarkera ord i läs- och hörtexter** efter status (okänd, lär mig, kan). Eleven ser direkt hur stor del av texten hen redan kan. *Lätt–medel.*
- **Flerordsuttryck** ("il y a", "sich freuen auf") ska gå att spara som en enhet. *Medel.*

### 7. Lute v3
[github.com/LuteOrg/lute-v3](https://github.com/LuteOrg/lute-v3) · MIT
Modern efterföljare till LWT (Python/Flask) med termstatus 1–5 och "parent terms".
- **Parent terms:** koppla böjda former till grundformen ("ging" → "gehen", "yeux" → "œil"), så att ett tryck i en text uppdaterar rätt glosa. *Medel.*

### 8. Lector
[github.com/heuwels/lector](https://github.com/heuwels/lector) · AGPL-3.0
Öppet alternativ till LingQ och Clozemaster. Har luckövningar med meningar sorterade efter frekvens och mastery-nivåer, och hämtar meningar från Tatoeba (CC BY 2.0 FR) och ordböcker från kaikki.org.
- **Mastery-trappa per luckmening:** först flerval, sedan skriva själv, sedan längre intervall. *Medel.*
- **Frekvensordnade meningar:** meningar vars övriga ord eleven redan kan väljs först (i+1). *Medel.*

### 9. ClozeQuizMaker
[github.com/jestasgameland/clozequizmaker](https://github.com/jestasgameland/clozequizmaker)
Genererar luckövningar automatiskt ur Tatoeba. Vi har inte kunnat bekräfta någon licens, så det är bara idén vi tar.
- **Generera luckmeningar automatiskt** med ett byggskript i `build.py`: hitta meningar som innehåller glosan, med 5–12 ord. *Medel.*

### 10. Verbecc
[github.com/bretttolbert/verbecc](https://github.com/bretttolbert/verbecc) · LGPL-3.0
Konjugator för franska och andra romanska språk med XML-mallar som bygger på Verbiste. Stöder inte tyska.
- **Generera franska böjningstabeller** vid bygget i stället för att skriva in dem för hand. Då följer också mallgruppen med ("som *venir*"), så att eleven lär sig mönster och inte enskilda verb. *Medel.*

### 11. Tyska verb från Wiktionary: german-verbs-database och wiktextract/kaikki
[github.com/viorelsfetea/german-verbs-database](https://github.com/viorelsfetea/german-verbs-database) (ingen licensfil i repot, men datan kommer från Wiktionary) · [github.com/tatuylonen/wiktextract](https://github.com/tatuylonen/wiktextract), data på [kaikki.org](https://kaikki.org) (Wiktionary-innehåll: CC BY-SA 4.0)
- **Starka och oregelbundna verb** (Präteritum, Partizip II, haben/sein) som eget spel för tyska, med data från kaikki. *Medel.*
- **Genus och plural** för tyska substantiv från kaikki, som ett "der/die/das"-snabbspel. *Lätt–medel.*

### 12. FrequencyWords
[github.com/hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords) · kod MIT, listor CC BY-SA 4.0
Frekvenslistor (bl.a. `de`, `fr`) byggda på OpenSubtitles, alltså vardagligt talspråk.
- **Prioritera nya tyska ord efter frekvens** mot B2 (se nedan). *Lätt.*

### 13. Tatoeba
[github.com/Tatoeba/tatoeba2](https://github.com/Tatoeba/tatoeba2) (koden: AGPL-3.0) · data: [tatoeba.org/downloads](https://tatoeba.org/en/downloads)
Miljontals meningar med översättningar. De flesta meningar är CC BY 2.0 FR och en del är CC0. Ljudet har en licens per bidragsgivare, och ljud utan angiven licens får inte användas utanför Tatoeba. Vi behöver inte ljudet eftersom vi använder speechSynthesis.
- **Exempelmening till varje glosa** och fler luckmeningar och översättningsmeningar. *Medel.*

## Juridik: kan vi använda Tatoeba och frekvenslistor för tyska mot B2?

**Ja, med villkor.**
- **Tatoeba, CC BY 2.0 FR:** fri användning, även bearbetning, så länge vi anger källan. Licensen kräver inte att vi delar vidare på samma villkor. Vi behöver en rad i appen, t.ex. under "Om": "Exempelmeningar från Tatoeba (tatoeba.org), CC BY 2.0 FR", och helst mening-id och användarnamn i datafilen. Den som vill slippa krav på källhänvisning kan filtrera fram CC0-meningarna, men de är färre. Kvaliteten varierar, så filtrera på meningar med svensk (eller engelsk) översättning och gärna på användare med modersmålsnivå.
- **FrequencyWords, CC BY-SA 4.0:** vi får använda listan, men en fil som härleds ur den (t.ex. `words.txt` med frekvensrang) bör också märkas CC BY-SA och ange källan. Använder vi rangen bara för att *välja* ord och själva skriver översättningarna blir risken minimal. Ordet "Haus" kan ingen ha upphovsrätt till. Undertextkorpusen innehåller egennamn och svordomar, så listan behöver tvättas.
- **kaikki/Wiktionary, CC BY-SA 4.0:** samma villkor som ovan för genus, plural och verbformer.
- **Goethe-institutets B2-ordlistor och läroböckernas listor är upphovsrättsskyddade.** De kan användas som kontroll men inte kopieras in i appen.

**Förslag:** ta de ca 4 000–5 000 vanligaste tyska lemmana ur FrequencyWords och lemmatisera dem med kaikki. Ta bort ord som redan finns i `words.txt` och lägg till svensk översättning (egen eller granskad maskinöversättning) och en Tatoeba-mening. Lägg in dem som ett eget avsnitt ("Frekvensord B1–B2"), så att läroboksavsnitten och deras ord-id inte påverkas.

## Är FSRS värt det? Hur?

**Ja, men i två steg.** Den största vinsten ligger inte i FSRS precision utan i att ord som räknas som inlärda i dag aldrig repeteras igen. För Tyska 5 mot B2 betyder det att tidigare glosor glöms utan att någon märker det.

1. **Snabbfix (lätt):** förläng stegen till t.ex. `[1,3,7,20,50,120]` och låt "mastered" fortfarande få glesa repetitioner. Vid fel ska ordet gå ned ett eller två steg, inte ända till 0. Formatet `{s,due}` behålls.
2. **FSRS (medel):**
   - Ladda `ts-fsrs@5.4.2` (UMD, pinnad version) från jsDelivr. Lägg en reserv till den nuvarande logiken om skriptet inte laddas.
   - Lägg FSRS-kortet som ett nytt fält per ord, `w[id].f = {due, stability, difficulty, reps, lapses, state, last_review}`. Behåll `s` och `due`, som statistiken och topplistan läser, så att sparformatet fortfarande är kompatibelt. Befintliga ord migreras genom att startstabiliteten sätts ungefär till det nuvarande intervallet.
   - FSRS räknar i **dagar**, inte pass. Ordet ska repeteras när `f.due <= nu`, och det fungerar bra eftersom appen används dagligen.
   - Betygen: fel → `Again`, rätt flerval → `Good`, rätt skrivning → `Good` eller `Easy`, självgradering → alla fyra. `request_retention` sätts till 0,9, eventuellt lägre inför en rimlig mängd dagliga repetitioner.
   - Optimeraren behövs inte. Standardparametrarna räcker för två användare.

## Rangordning: de 10 bästa idéerna

| # | Idé | Effekt | Insats | Motivering |
|---|-----|--------|--------|------------|
| 1 | Sluta pensionera inlärda ord och mjuka upp felhanteringen | Hög | Låg | Täpper till den största läckan i dag |
| 2 | FSRS via ts-fsrs | Hög | Medel | Rätt ord vid rätt tid, anpassat efter hur svårt varje ord är |
| 3 | Tatoeba-meningar som exempel och för luckövningar | Hög | Medel | Ord i sammanhang, i stort sett obegränsat antal meningar, fri licens med källhänvisning |
| 4 | Frekvensordnat B1–B2-avsnitt för tyska (FrequencyWords + kaikki) | Hög | Medel | Går direkt mot målet B2 och prioriterar de ord som ger mest |
| 5 | Leech-flagga och extra stöd för ord med många fel | Medel | Låg | Mycket tid går till ett fåtal svåra ord |
| 6 | Färgmarkera kända och okända ord i läs- och hörtexter (LWT/Lute) | Medel | Låg–medel | Motiverar och kopplar läsningen till glosorna |
| 7 | Grundformer och flerordsuttryck när ord sparas från texter (Lute) | Medel | Medel | Böjda former hamnar på rätt glosa |
| 8 | Datadrivna verbspel: tyska starka verb från kaikki, franska mönstergrupper från verbecc | Medel | Medel | Täcker fler verb och lär ut mönster |
| 9 | der/die/das- och pluralspel för tyska | Medel | Låg–medel | Genus är ett typiskt hinder på vägen mot B2 |
| 10 | Självgradering i fyra steg och en repetitionsprognos i statistiken | Låg–medel | Låg | Ger FSRS bättre underlag och eleven bättre överblick |
