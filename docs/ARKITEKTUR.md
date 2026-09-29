# Arkitektur: var data ligger

Glosor har tre sorters data, och de hålls helt åtskilda.

| Sort | Var | Vem ändrar | I det publika repot? |
|---|---|---|---|
| **Kod** | `src/` (app.js, `kinds/*.js` med en fil per övningstyp, feedback.js, main.js, page.html, style.css), `build.py`, `tests/` | Claude | Ja |
| **Kursinnehåll** | `languages/<kod>/`: `lang.js` (inställningar), `grammar.json` (grammatikområden och regler), `words.txt`, `content/*.json`, `videos.json`, `ids.lock` (id-låset) | Claude (AI-skrivet, eget material) | Ja |
| **Bokmaterial** | `languages/<kod>/book/kapNN/` (foton, `words.txt`, `content/*.json`), `book/sidor.json` och `book/ids.lock` | Claude, från foton som föräldern skickar | **Nej** (`.gitignore`, eget lokalt git-repo) |
| **Elevernas data** | Artefaktens db: `data/users/<uid>/<storageKey>` (framsteg, privat för eleven), `board/<uid>` (topplista), `feedback/<uid>/msgs/<tid>` (Tyck till) och `reports/<uid>/items/<tid>` (fel i frågor), privata för eleven och läsbara för ägaren. Kopia av framstegen i elevens webbläsare (localStorage). | Eleverna, via appen | Nej |

## Från källor till app

`python3 build.py`:

1. Läser varje kurs: `lang.js`, `grammar.json`, sedan `words.txt` och `book/kapNN/words.txt`, sedan `content/*.json` och `book/kapNN/content/*.json`. Filer med samma namn slås ihop, så att bokens `reading.json` hamnar bland kursens lästexter. `grammar-*.json` blir en gemensam frågebank.
2. Kontrollerar ordlistan (format, dubbletter), grammatikfrågorna (luckor, felalternativ, artiklar och kasus för tyskan), att id:n är unika inom varje innehållstyp, `extends` (föräldern finns, ingen cirkel) och id-låsen (se nedan).
3. Skriver
   - `dist/index.html`: appen och alla kursers `lang.js` (cirka 380 kB med 8 kurser; build.py varnar över 450 kB, så håll stora tabeller som verb i lang.js små eller ärv dem),
   - `dist/data/<kod>.json`: en fil per kurs med ord (`words`), innehåll (`content`), videor (`videos`) och grammatikens områden och regler (`grammar`), som appen hämtar först när kursen väljs,
   - `dist/preview.html`: allt inbakat i en fil (`INLINE_DATA`), för att öppna lokalt och för testerna.

`DATA_VERSION` är `{<kod>: hash}`, ett hash per datafil, och läggs i adressen till just den kursens fil (`data/de.json?v=<hash>`). En ny version blandas aldrig med en gammal i webbläsarens cache, och en ändring i en kurs tvingar inte fram en ny hämtning av de andra.

### Kursväljaren

`fillCourses` i `src/app.js`: en grupp (`<optgroup>`) per språk (`name`) i den ordning kurserna kommer i `LANGUAGES`, sorterad efter `step` ("U" sist). Texten är `courseLine`: "Franska 3 · steg 3 · A2 · mål DELF B1". Kommande kurser ur `languages/upcoming.json` (`{code, name, course, step, level}`) står på sin plats i stegordningen som ej valbara "– kommer"; build.py kontrollerar fälten och tar bort rader vars kurs redan finns. Rubrikens chip visar "Franska 3 · steg 3 · nivå A2" (`courseChip`). Förslaget att gå vidare (`nextPanel`) läser `nextCourses()`, som tar både en kod och en lista.

### Arv mellan kurser

En kurs kan ärva fält från en annan: `extends: "de"` och `inherit: ["connectors", "tenseCheck", "verbs"]` i `lang.js`. Eftersom `lang.js` innehåller regex och funktioner görs sammanslagningen i webbläsaren, en gång när sidan startar (`inheritCourses` i `src/app.js`), innan något läser `LANGUAGES`. Regler:

- Bara fälten i `inherit` ärvs (inte t.ex. `nextCourse`, `elective` eller `book`). `storageKey`, `words`, `content`, `videos` och `grammar` kan inte ärvas (build.py stoppar).
- Vanliga objekt slås ihop nyckel för nyckel, rekursivt; kursens egna värden vinner och förälderns ordning behålls. Listor, regex och funktioner tas hela från kursen själv om den har dem.
- `{$append: [...]}` lägger till i förälderns lista (fr4:s bindeord), `{$remove: ["Konjunktiv I"]}` tar bort nycklar ur förälderns objekt (de4:s verbtabeller).
- Resultatet är ett vanligt objekt (inga getters), så `L.verbs` är samma objekt vid varje åtkomst.

| Kurs | Ärver från | Fält |
|---|---|---|
| de4 | de | `connectors`, `tenseCheck`, `verbs` (utan Konjunktiv I, egna spel) |
| de6 | de | `connectors`, `tenseCheck`, `verbs` (egna spel) |
| fr4 | fr | `connectors` (+22 egna), `tenseCheck` (+conditionnel, subjonctif), `verbs` (egna spel) |
| fru | fr | `accents`, `verbAccents`, `articles`, `pronouns`, `genders`, `elision`, `connectors` (+37 egna), `tenseCheck` (+conditionnel, subjonctif, passé simple), `verbs` (+passé simple, egna spel) |
| it2 | it1 | `articles`, `hintStrip`, `pronouns`, `elision`, `connectors`, `tenseCheck` |

### Kursdata i minnet

Appen har högst `KEEP_COURSES` (3) kurser hämtade samtidigt. När eleven byter kurs och fler är hämtade släpps den som varit oanvänd längst: fälten från datafilen, `base` och uträknade listor (`_…`). Kursens inställningar från `lang.js` finns kvar, och datan hämtas igen om kursen väljs. Framstegen ligger i localStorage och i molnet och påverkas inte.

## Publicering

Publicera `dist/index.html` till samma URL och skicka med datafilerna i `files`:

    {"data/fr.json": "dist/data/fr.json", "data/de.json": "dist/data/de.json", ...}

Alla filer i `dist/data/` ska med vid varje publicering. `tests/run_tests.py` testar både preview-sidan och den publicerade sidan via en lokal webbserver.

## Lägga till mer

- **Nytt bokkapitel:** skapa `languages/fr/book/kapNN/` enligt `book/README.md` och `book/SPEC-bok.md`, och uppdatera `book/sidor.json`. Inget i koden behöver ändras.
- **Nytt innehåll av en befintlig typ:** lägg till i `content/<typ>.json`, eller i en ny fil med samma namn i ett bokkapitel.
- **Ny kurs:** ny mapp `languages/<kod>/`. Koden är fri (den säger inget om steget); se `languages/it1/` och `languages/de4/` som mallar. Minimikrav för att bygget och testerna ska gå igenom:
  1. `lang.js` med `LANGUAGES.<kod> = {…}` och fälten `name` (språket, t.ex. `"Franska"`: samma namn = samma grupp i väljaren och i "Bara franska"), `title`, `course` (t.ex. `"Franska 5"`), `step` (1–7 = Moderna språk 1–7, `"U"` = universitet; sorterar väljaren), `level` (GERS enligt Skolverket och vart kursen leder, ska börja med stegets nivå: 1–2 A1, 3–4 A2, 5–6 B1, 7 B2, se `docs/kursmall.md` 2.1 och 3.7), `inLang` (`"på franska"`), `tts` (`"fr-FR"`) och en ny, unik `storageKey` som aldrig ändras. build.py stoppar om något av dem saknas.
  2. `words.txt` med minst ett avsnitt (`#id|Namn`) och ord i formatet ovan.
  3. Ta bort kursens rad i `languages/upcoming.json` (annars en varning; väljaren visar den ändå inte två gånger) och peka `nextCourse` i kursen före hit. `nextCourse` är en kod eller en lista (`["fr5", "fru"]`); med en lista erbjuder startsidan båda vägarna. Varje kod måste finnas.
  4. `python3 build.py` skapar `ids.lock`; checka in det.

  Allt annat är valfritt och övningen visas bara om innehållet finns: `content/*.json` (hör- och lästexter, berättelser, fraser, skrivuppgifter, kultur, `exam.json`, uttal, musikteori …), `grammar.json` + `content/grammar-*.json` (Grammatik och Hitta felet), `verbs` (verbträning), `genders`, `accents`, `connectors`, `tenseCheck`, `exam`, `plan.json`, `videos.json`, arv med `extends`/`inherit`. Utan content får kursen glosquiz, meningar, diktamen, översätt, ordföljd, skugga och kapitelprov ur ordlistans exempelmeningar. `test_minimal_course` i `tests/run_tests.py` bygger en sådan låtsaskurs (bara `lang.js` och 20 ord) i en temporär kopia och kör looparna "alla kurser" (`testCourses()`, `COURSES_UNDER_TEST`) på den. Testerna som går över alla kurser kräver bara det innehåll kursen har.
- **Ny innehållstyp eller övningstyp:** en ny fil i `src/kinds/` (se nedan), en knapp i `src/kinds/99-menu.js` och ett format beskrivet i en SPEC-fil.

## Övningstyperna (`src/kinds/`)

Appens kod är `src/app.js` (språk, sparande, glosquiz och quizmotor), sedan filerna i `src/kinds/` i namnordning, sist `feedback.js` och `main.js`. build.py sätter ihop dem till ett enda skript i den ordningen; numret i filnamnet bestämmer ordningen, och en fil får bara använda det som redan är definierat när den läses in (funktioner med `function` går att använda från alla filer).

| Fil | Innehåll | Typer (`defineKind`) |
|---|---|---|
| `00-common.js` | Det som delas: `C()`, `tl()`, Mina ord, boken, meningspoolen, uppläsning (`speakSeq`), text att trycka på (`tapText`, `wireGloss`), väljarlistan, Claudes kommentarer (`wireFeedback`) och den gemensamma slutskärmen (`finishGeneric`) | – |
| `10-verbs.js` | Verbträning | `verbs` |
| `11-sentences.js` | Meningar (luckan), diktamen, översätt, ordföljd (`renderTiles`) | `cloze`, `dict`, `trans`, `order` |
| `12-shadow.js` | Skugga | `shadow` |
| `20-phrases.js` | Samtalsfraser | `phr` |
| `21-stories.js` | Berättelser | `story` |
| `30-texts.js`, `31-listening.js`, `32-reading.js` | Hör- och läsförståelse (det gemensamma, sedan var för sig) | `lq`, `rq` |
| `33-culture.js`, `40-writing.js` | Kultur och skrivuppgifter (egna sidor, ingen quiz) | `culture`, `write` |
| `50-ktest.js` | Kapitelprov | `ktest` |
| `51-goals.js` | Kapitlets mål på startsidan | – |
| `52-uttal.js`, `53-teori.js` | Uttal och teoriprovet | `utt`, `teori` |
| `54-transkription.js` | Transkription till och från IPA (`content/transkription.json`, bara i kurser som har filen, t.ex. `fru`): välj IPA, välj ord och skriv med IPA-knapprad; rättningen bortser från mellanslag, syllabering och länkning. Format i `languages/fru/content/SPEC.md` | `ipa` |
| `60-grammar.js`, `61-gender.js` | Grammatikövningar, der/die/das och plural | `gram`, `gen`, `plu` |
| `62-satsanalys.js` | Satsanalys med fransk terminologi (`content/satsanalys.json`, bara i kurser som har filen): funktionen eller satstypen för en markerad del `[[…]]` | `sats` |
| `70-exam.js` | Provträning och provsimulering | `exam` |
| `80-level.js` | Nivåmätaren "Var ligger jag?" i statistiken (`statsLevel`, `levelEstimate`): ordförråd över alla kurser i samma språk, grammatik och prov/Claudes bedömningar på GERS-skalan. Räknas ur befintliga fält, sparar inget | – |
| `82-plan.js` | Studieplan vecka för vecka (`languages/<kod>/plan.json` → `L.plan`, kontrolleras av `check_plan` i build.py): kort på startsidan med aktuell vecka och hur många av veckans ord eleven kan, en sida med alla veckor (ord, grammatik, texter, provuppgifter) och startdatum i `S.plan` | `plan` |
| `90-mix.js` | Dagens pass och den blandade rundan | `mix` |
| `99-menu.js` | Menyn med alla övningar och statistiken för dem | – |

Glosquizet (`words`) registreras i `app.js`. `defineKind(namn, {name, mc, type, restore, effect, recap, after, again, open, log})` fyller i registret `KINDS` (fälten beskrivs i kommentaren i app.js). Quizmotorn slår upp frågans typ i registret: `k` i frågan, annars passets `kind`. `MC`, `TYPE`, `RESTORE`, `EFFECT`, `RECAP`, `AFTER`, `AGAIN` och `KIND_NAMES` finns kvar som vyer över registret (bara för läsning). Fel i en registrering stoppar inte appen men hamnar i `KIND_ERRORS`, och testet `SCENARIO_KINDS` i `tests/run_tests.py` kontrollerar att listan är tom och att varje typ har det den behöver (namn, frågor eller `open`, `restore` om frågorna kan pausas, `recap` eller `after`).

Typnamnen är nycklar i elevernas sparade data: fråge-id `<typ>:<ref>` i `S.run`/`S.runs` och `firstTry`, `S.runs`-nycklarna (`dict`, `verbs|<spel>`, `story|<id>`, `lq|<id>`, `ktest|<kapitel>`, `mix` …) och `kind` i loggen. De får inte bytas.

**Fältet `fr`:** texten på målspråket heter `fr` i alla datafiler (`lines[].fr`, `phrases[].fr`, `ex[].fr` i regler.json), även i tyska och italienska kurser, eftersom appen först byggdes för franska. Datafilerna behåller namnet; koden läser det bara via `tl(x)` och skapar rader med `tlLine(text)` (`00-common.js`).

## Framstegen i molnet (db)

Ett dokument i artefaktens db får vara **högst 256 KiB** (plattformens gräns, större `set` avvisas med `invalid_argument`). Ett ord i `S.w` är 150–200 byte och en loggpost cirka 180 byte, så en flitig elev i Tyska 5 (2 000+ ord och 1 000 loggposter) får inte plats i ett dokument. I localStorage ligger hela `S` som förut. I db delas det upp (`cloudSplit`, `cloudWrite`, `cloudRead` i `src/app.js`):

| Dokument | Innehåll |
|---|---|
| `data/users/<uid>/<storageKey>` | Huvuddokumentet `{v: 2, head, score: [pass, nLog, antal ord], parts: {<namn>: <rev>}, t}`. `head` är `S` utom `w` och `log`. |
| `…/<storageKey>~w0`, `~w1`, … | `{rev, data: {<ord-id>: …}}`. Orden fördelas efter ett hash av ord-id, cirka 700 ord per bit och högst 200 KiB. |
| `…/<storageKey>~log` (`~log1`, …) | `{rev, data: [...]}`, loggen i ordning. |
| `…/<storageKey>~f.<fält>` | Bara om `head` blir större än 160 KiB: de största fälten flyttas ut, ett dokument per fält. |

- `rev` är ett hash av bitens innehåll. Bitarna skrivs först och huvuddokumentet sist. En läsare använder bara bitar vars `rev` stämmer med `parts` i huvuddokumentet; stämmer de inte (någon sparar just nu) försöker den igen och blandar aldrig bitar från olika sparningar.
- Bara ändrade bitar skrivs. Efter en lyckad sparning av huvuddokumentet raderas bitar som fanns i det förra huvuddokumentet men inte i det nya (t.ex. `~log1` när loggen krympt, `~w5` när orden får plats i färre bitar), men bara om huvuddokumentet fortfarande är vårt. En radering som misslyckas görs om vid nästa sparning (`cloudPrune`).
- Före varje sparning läses huvuddokumentet: har en annan enhet sparat ett läge som kommit längre skrivs ingenting över (det läget tas emot i stället), och har någon annan skrivit sedan sist skrivs alla bitar om.
- Storleken mäts före `set`. Blir något ändå för stort visas en varning överst i appen, och framstegen sparas bara i webbläsaren tills det går igen.
- Gamla dokument i formatet `{state, t}` läses som förut, och första sparningen skriver det nya formatet. `head` heter inte `state`, så en äldre version av appen som fortfarande är öppen på någon enhet ser inget läge i det nya dokumentet och kan inte ta emot ett läge utan ord.
- Vem som vinner: högst `pass`, sedan `nLog` (antal loggposter någonsin, stannar inte på 1 000), sedan antal ord, och vid lika det senaste `t`. `S.t` ökar alltid vid sparning, även om en annan enhets klocka går före.
- Sparningar köas per kurs (`CLOUD.pending[storageKey]`), så att ett kursbyte inte slänger den förra kursens sparning. Går anslutningen inte vid start försöker appen igen när den syns igen (`visibilitychange`) eller när nätet är tillbaka (`online`).
- Varje elev har cirka 6 dokument per kurs. Artefaktens db rymmer högst 5 000 dokument totalt.

## Regler som skyddar elevernas framsteg

- `storageKey` i `lang.js` ändras aldrig.
- Ordets första fält i `words.txt` och avsnittens id är nycklar för framstegen. Ändra dem inte.
- Id:n i `content/*.json` används för statistik (lästa texter, grammatikfrågor). Ändra dem inte i efterhand.
- **Id-låset** `languages/<kod>/ids.lock` (incheckat, JSON med en sorterad lista per typ: `ord`, `avsnitt`, `innehåll/<typ>`, `prov`, `grammatikområden`, `grammatikregler`, samt `storageKey`) skrivs av build.py. Bygget stoppar om ett id i låset saknas, om `storageKey` ändrats eller om två kurser har samma `storageKey`. Nya id läggs till automatiskt. En avsiktlig borttagning godkänns med `python3 build.py --allow-removed <kod>:<typ>|<id>` (eller `<kod>:<id>`) eller en rad `<typ>|<id>` i `languages/<kod>/ids.removed`. Id från boken låses i `book/ids.lock` (och godkänns i `book/ids.removed`), så att det publika repot inte avslöjar bokinnehåll. Saknas bokmappen hoppas bokens lås över.

## Sparat läge (`S`)

`S` är det sparade läget för en kurs, i localStorage under `storageKey` och i molnet uppdelat enligt ovan (`w` i `~w0…`, `log` i `~log…`, resten i `head`). Samma lista finns som kommentar ovanför `loadState` i `src/app.js`.

| Fält | Innehåll |
|---|---|
| `v` | Schemaversion = index i `MIGRATIONS`. Saknas i lägen från före 2026-09-28 (räknas som 0). |
| `pass` | Numret på nästa glospass (börjar på 1, ökar efter varje glospass som inte är extra). |
| `t` | Tid för senaste sparningen (ms). Ökar alltid, även om en annan enhets klocka går före. |
| `w` | `{<ord-id>: {s, due, dd, f, lp, ld, mp, md, lapses, mcR, mcW, tyR, tyW, clR, clW}}`: steg (0–3 lär sig, 4+ kan), repetition i pass (`due`) och dag (`dd`), frågeform (`f`: mc/type), lärt i pass/datum (`lp`/`ld`), kan sedan pass/datum (`mp`/`md`), antal gånger nedflyttat (`lapses`), rätt/fel på flerval, skriva och meningar. |
| `newCount`, `mode`, `src`, `chapter` | Nya ord per pass, frågeform (`mix`/`mc`/`type`), avsnitt att lära från (`auto` eller avsnitts-id), bokkapitel man läser. |
| `slow`, `listenFirst`, `goal` | Långsam uppläsning, lyssna först på nya ord, veckomål i minuter. |
| `log` | Loggposter `{p, d, dur, nNew, nRep, right, total, mcR, mcN, tyR, tyN, extra, kind, game, words}`, högst 1 000. |
| `logOld` | `{dur, days, lastDay, n}`: sammanfattning av poster som kapats ur `log`. |
| `nLog` | Antal loggposter någonsin (molnets poäng jämför den). |
| `run`, `runs` | Pågående pass (`snapRun`) och ett påbörjat pass per övning (`runKey`: `words`, `words\|extra`, `<typ>\|<id>` …). |
| `dailyDay` | Dagen då Dagens pass senast gjordes klart. |
| `vt`, `vv` | Verbträning per tempus och per verb `{r, n}`. |
| `mine` | Egna ord `[{t, sv, g, ex, exSv, …}]`. |
| `gi`, `gr`, `gt` | Grammatik per fråga `{s, last}`, per regel och per område `{r, n}`. |
| `ga` | der/die/das och plural per ord-id `{g, p, last}`. |
| `tr`, `ph`, `te` | Översätta meningar, fraser, musikteori: per id `{s, last}`. |
| `ipa`, `sa` | Transkription och satsanalys (universitetskursen): per id `{s, last, r, n}`. |
| `tx`, `stb`, `st` | Läs- och hörtexter `{r, n, best, last}`, berättelsernas bästa resultat, berättelsernas luckor `{tempus, bindeord}`. |
| `cu`, `wr`, `ut`, `mal`, `kt` | Klara kulturuppgifter och skrivuppgifter, bästa uttalsresultat, avbockade lärandemål (`"<id>\|<nr>"`), kapitelprov `{r, n, d, miss}`. |
| `exam` | Provträning `{t: {<uppgift>: {pct, best, n, last}}, sims: [{d, parts, tasks, min}]}` (`tasks` = resultat per uppgift och `min` = minuter, i simuleringar från september 2026). |
| `drafts`, `fb` | Utkast och Claudes kommentarer per uppgift. |
| `plan` | Studieplanen: `{start: "ÅÅÅÅ-MM-DD"}`, första dagen i vecka 1 (aktuell vecka räknas fram). Saknas i gamla lägen. |
| `feedback`, `reports` | Tyck till-meddelanden och felrapporter som inte kunde skickas (högst 50). |

**Migreringar.** `normState` kör `MIGRATIONS[n]` för varje version n som är högre än lägets `v` och sätter sedan `v` till senaste versionen. Nya migreringar läggs alltid sist; en gammal ändras aldrig. Ett läge från en nyare version av appen behåller sitt nummer.

| Version | Migrering |
|---|---|
| 1 | `migrateRetired`: ord med det gamla "kan för alltid" (`due` = 1e9) får ett riktigt repetitionsdatum, utspritt över kommande pass. |

**Molnformatet** (se ovan): huvuddokumentet `{v: 2, head, score, parts, t}` (där `v: 2` är molnformatets version, inte `S.v`), bitarna `{rev, data}`. Gamla dokument `{state, t}` läses fortfarande.
