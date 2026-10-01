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
2. Kontrollerar ordlistan (format, dubbletter), grammatikfrågorna (luckor, felalternativ, artiklar och kasus för tyskan), att id:n är unika inom varje innehållstyp, att varje post har de fält appen läser (`check_fields` med tabellen `CONTENT_FIELDS`: texternas rader och frågor, berättelsernas luckor mot `gaps`, frasernas felalternativ, uttalets ordpar, målen, regelsidorna, provuppgifternas `part`, skrivuppgifternas `need.tenses` mot kursens `tenseCheck`; varningar när en modelltext inte klarar uppgiftens ordgränser eller antal bindeord), `extends` (föräldern finns, ingen cirkel) och id-låsen (se nedan). Formaten står i `docs/spec/`, en fil per typ; kursens tillägg i `languages/<kod>/content/SPEC.md`.
   `lang.js` läses med en liten tokenizer (`parse_lang_js`, `js_tokens`), inte med reguljära uttryck: rena literaler (strängar med enkla eller dubbla citattecken, tal, listor, objekt) blir Python-värden och regex, funktioner och uttryck blir `JSExpr`. Kommentarer, radbrytningar och flera fält på en rad går bra. `storageKey`, `extends`, `inherit`, `nextCourse`, `step`, `level`, `name`, `title`, `course`, `inLang` och `tts` måste vara rena literaler; står de som uttryck, eller går filen inte att läsa (en sträng som inte slutar, `LANGUAGES.<kod>` som inte är mappens namn), stoppar bygget. `connectors` och namnen i `tenseCheck` läses med arvet (`resolve_field`, `tense_names`; för `tenseCheck: (() => {…})()` tas nycklarna ur `return {…}`).
3. Skriver
   - `dist/index.html`: appen och alla kursers `lang.js` (cirka 355 kB med 21 kurser; build.py varnar över 420 kB, så stora tabeller hör hemma i datafilen, som verbtabellerna i `verbs.json`). JavaScript och CSS minifieras (`minify_js`, `minify_css`: kommentarer och onödiga blanktecken bort; strängar, mallsträngar och reguljära uttryck orörda, och radbrytningar som kan betyda något för automatiska semikolon behålls). `python3 build.py --no-minify` ger läsbar kod för felsökning,
   - `dist/data/<kod>.json`: en fil per kurs med ord (`words`), innehåll (`content`), videor (`videos`) grammatikens områden och regler (`grammar`), studieplanen (`plan`), verbtabellerna (`verbTables`) och hur vanligt varje ord är i kursens egna texter (`freq`, `{ord-id: antal}`, räknas av `word_freq` i build.py: exempelmeningarna och målspråksfälten `fr`, `model`, `text` och `gloss.t` i content, utan Tatoeba; grundformen utan artikel), som appen hämtar först när kursen väljs. `pickNew` tar nya ord i avsnittens ordning (kapitlet eleven läser först) och de vanligaste först inom varje avsnitt,
   - `dist/data/<kod>-exam.json`: provträningen (hela `content.exam`, i tyskan runt 300 kB), bara för kurser med `content/exam.json`. Kursens egen fil har i stället ett index (`split_exam`): `content.exam = {lazy: true, name, level, pass, note, parts, …, tasks: [{id, part, teil, title, level, type, k, minWords, maxWords, time, prep, speak, sim, scale}]}`, där `k` är uppgiftens typ (som `exKind`),
   - `dist/data/lemma-<språk>.json` (`lemma-fr`, `lemma-de`, `lemma-it`, 200–280 kB): alla kursers ord i samma språk som `{words: [[ord, svenska, genus], …]}` (`lemma_files` i build.py; språket = de två första bokstäverna i `tts`). `lemmaOf` (03-lemma.js) hämtar filen första gången eleven trycker på ord i en text (`ensureLemmaAll`), så att Mina ord hittar grundformen även i en kurs i kedjan som inte har öppnats. Saknas filen (offline) används kursen, hämtade kurser och verbtabellerna som förut,
   - `dist/preview.html`: allt inbakat i en fil (`INLINE_DATA`, även `INLINE_DATA["<kod>-exam"]`), för att öppna lokalt och för testerna.

`DATA_VERSION` är `{<kod>: hash, "<kod>-exam": hash}`, ett hash per datafil, och läggs i adressen till just den filen (`data/de.json?v=<hash>`, `data/de-exam.json?v=<hash>`). En ny version blandas aldrig med en gammal i webbläsarens cache, och en ändring i en kurs tvingar inte fram en ny hämtning av de andra.

### Provet hämtas vid behov

`ensureExam()` (app.js) hämtar `data/<kod>-exam.json` med samma mekanism som kursdatan (`fetchData`, relativ `fetch`, en hämtning delas av alla som väntar) och byter indexet mot hela provet; `examReady()` säger om det är gjort. I preview.html läggs provet in direkt i `addCourseData`. Skärmar som behöver uppgifternas innehåll (texter, frågor, facit, `task`) börjar med `if(examWait(fn)) return;` (70-exam.js): `openExam`, `examTask` (även skrivsidans och planens provuppgifter), `startExamSim`, `simResume` och `openTalk` (provets taluppgifter). Under hämtningen visas "Hämtar provuppgifterna …", och misslyckas den (offline) ett meddelande med Försök igen och Tillbaka. Startsidan, menyn, skrivsidans lista, veckans skrivuppgift, nivåmätaren och studieplanen läser bara indexet och hämtar ingenting. Ny kod som läser annat än indexets fält ur `EX().tasks` måste gå via `examWait`/`ensureExam`. När kursen släpps (`releaseCourse`) släpps provet också.

### Kursväljaren

`fillCourses` i `src/app.js`: en grupp (`<optgroup>`) per språk (`name`) i den ordning kurserna kommer i `LANGUAGES`, sorterad efter `step` ("U" sist). Texten är `courseLine`: "Franska 3 · steg 3 · A2 · mål DELF B1". Kommande kurser ur `languages/upcoming.json` (`{code, name, course, step, level}`) står på sin plats i stegordningen som ej valbara "– kommer"; build.py kontrollerar fälten och tar bort rader vars kurs redan finns. Rubrikens chip visar "Franska 3 · steg 3 · nivå A2" (`courseChip`). Förslaget att gå vidare (`nextPanel`) läser `nextCourses()`, som tar både en kod och en lista.

### Arv mellan kurser

En kurs kan ärva fält från en annan: `extends: "de"` och `inherit: ["connectors", "tenseCheck", "verbs"]` i `lang.js`. Eftersom `lang.js` innehåller regex och funktioner görs sammanslagningen i webbläsaren, en gång när sidan startar (`inheritCourses` i `src/app.js`), innan något läser `LANGUAGES`. Regler:

- Bara fälten i `inherit` ärvs (inte t.ex. `nextCourse`, `elective` eller `book`). `storageKey`, `words`, `content`, `videos` och `grammar` kan inte ärvas (build.py stoppar).
- Vanliga objekt slås ihop nyckel för nyckel, rekursivt; kursens egna värden vinner och förälderns ordning behålls. Listor, regex och funktioner tas hela från kursen själv om den har dem.
- `{$append: [...]}` lägger till i förälderns lista (fr4:s bindeord), `{$remove: ["Konjunktiv I"]}` tar bort nycklar ur förälderns objekt (de4:s verbtabeller).
- Resultatet är ett vanligt objekt (inga getters), så `L.verbs` är samma objekt vid varje åtkomst.
- Verbtabellerna (`sv`, `tenses`, `notes`) ligger inte i lang.js utan i `languages/<kod>/verbs.json` och följer med datafilen som `verbTables`, så att index.html hålls liten. build.py slår ihop arvet för dem med samma regler (`merge_inherited`, `resolve_verbs`), t.ex. `{"tenses": {"$remove": ["Konjunktiv I"]}}` i `de4/verbs.json`. `addCourseData` lägger in dem i ett nytt `L.verbs`-objekt (`withVerbTables`) när kursen hämtas; före det har `L.verbs` bara `persons`, `prefix` och `games`, och när kursen släpps återställs lang.js-delen (`LANG_VERBS`).

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

    {"data/fr.json": "dist/data/fr.json", "data/fr-exam.json": "dist/data/fr-exam.json", "data/de.json": "dist/data/de.json", ...}

Alla filer i `dist/data/` ska med vid varje publicering, **även `<kod>-exam.json` och `lemma-<språk>.json`** (bygget skriver ut hur många filer det är). Saknas en provfil fungerar kursen, men provträningen, provsimuleringen och Tala visar "Provuppgifterna kunde inte hämtas". `tests/run_tests.py` testar både preview-sidan och den publicerade sidan via en lokal webbserver.

## Lägga till mer

- **Nytt bokkapitel:** skapa `languages/fr/book/kapNN/` enligt `book/README.md` och `book/SPEC-bok.md`, och uppdatera `book/sidor.json`. Inget i koden behöver ändras.
- **Nytt innehåll av en befintlig typ:** lägg till i `content/<typ>.json`, eller i en ny fil med samma namn i ett bokkapitel.
- **Ny kurs:** ny mapp `languages/<kod>/`. Koden är fri (den säger inget om steget); se `languages/it1/` och `languages/de4/` som mallar. Minimikrav för att bygget och testerna ska gå igenom:
  1. `lang.js` med `LANGUAGES.<kod> = {…}` och fälten `name` (språket, t.ex. `"Franska"`: samma namn = samma grupp i väljaren och i "Bara franska"), `title`, `course` (t.ex. `"Franska 5"`), `step` (1–7 = Moderna språk 1–7, `"U"` = universitet; sorterar väljaren), `level` (GERS enligt Skolverket och vart kursen leder, ska börja med stegets nivå: 1–2 A1, 3–4 A2, 5–6 B1, 7 B2, se `docs/kursmall.md` 2.1 och 3.7), `inLang` (`"på franska"`), `tts` (`"fr-FR"`) och en ny, unik `storageKey` som aldrig ändras. build.py stoppar om något av dem saknas.
  2. `words.txt` med minst ett avsnitt (`#id|Namn`) och ord i formatet ovan.
  3. Ta bort kursens rad i `languages/upcoming.json` (annars en varning; väljaren visar den ändå inte två gånger) och peka `nextCourse` i kursen före hit. `nextCourse` är en kod eller en lista (`["fr5", "fru"]`); med en lista erbjuder startsidan båda vägarna. Varje kod måste finnas.
  4. `python3 build.py` skapar `ids.lock`; checka in det.

  Allt annat är valfritt och övningen visas bara om innehållet finns: `content/*.json` (hör- och lästexter, berättelser, fraser, skrivuppgifter, kultur, `exam.json`, uttal, musikteori …), `grammar.json` + `content/grammar-*.json` (Grammatik och Hitta felet), `verbs` (verbträning), `genders`, `accents`, `connectors`, `tenseCheck`, `exam`, `plan.json`, `videos.json`, arv med `extends`/`inherit`. Utan content får kursen glosquiz, meningar, diktamen, översätt, ordföljd, skugga och kapitelprov ur ordlistans exempelmeningar. `test_minimal_course` i `tests/run_tests.py` bygger en sådan låtsaskurs (bara `lang.js` och 20 ord) i en temporär kopia och kör looparna "alla kurser" (`testCourses()`, `COURSES_UNDER_TEST`) på den. Testerna som går över alla kurser kräver bara det innehåll kursen har.
- **Ny innehållstyp eller övningstyp:** en ny fil i `src/kinds/` (se nedan), en knapp i `src/kinds/99-menu.js`, ett format i en ny fil i `docs/spec/` (och en rad i tabellen i `docs/spec/allmant.md`) och fälten i `CONTENT_FIELDS` i build.py.

## Övningstyperna (`src/kinds/`)

Appens kod är `src/app.js` (språk, sparande, quizmotor och register), sedan filerna i `src/kinds/` i namnordning, sist `feedback.js` och `main.js`. build.py sätter ihop dem till ett enda skript i den ordningen; numret i filnamnet bestämmer ordningen, och en fil får bara använda det som redan är definierat när den läses in (funktioner med `function` går att använda från alla filer).

| Fil | Innehåll | Typer (`defineKind`) |
|---|---|---|
| `00-common.js` | Det som delas: `C()`, `tl()`, Mina ord, boken, meningspoolen, uppläsning (`speakSeq`), text att trycka på (`tapText`, `wireGloss`), väljarlistan, Claudes kommentarer (`wireFeedback`) och den gemensamma slutskärmen (`finishGeneric`) | – |
| `05-words.js` | Glosquizet: passet med lärokort (`startSession`, `renderLearn`), frågorna (`qType`, `startQuiz`, `mcOptions`), kortet efter fel svar (`explain`, `studyCard`, `memoBox`) och slutet av passet (`applyAnswer`, `tally`, `finishSession`). Vilka ord som är nya (`pickNew`) och schemat (`schedule`, `MC_MAX`: flerval räcker till steg 2, skrivet rätt behövs för "kan") ligger i app.js | `words` |
| `10-verbs.js` | Verbträning | `verbs` |
| `11-sentences.js` | Meningar (luckan), diktamen, översätt, ordföljd (`renderTiles`) | `cloze`, `dict`, `trans`, `order` |
| `12-shadow.js` | Skugga (knappen finns under Tala, `45-tala.js`) | `shadow` |
| `20-phrases.js` | Samtalsfraser | `phr` |
| `21-stories.js` | Berättelser | `story` |
| `30-texts.js`, `31-listening.js`, `32-reading.js` | Hör- och läsförståelse (det gemensamma, sedan var för sig) | `lq`, `rq` |
| `33-culture.js`, `40-writing.js` | Kultur och skrivuppgifter (egna sidor, ingen quiz). Skrivsidan visar kapitlets uppgifter (`prompts.json`) och provets skrivuppgifter (`exam.json`, märkta "Provuppgift · DELF B1 · 45 min") med filter; en provuppgift öppnas i provträningen och Tillbaka leder till skrivsidan (`openFrom`, se `82-plan.js`). Båda bedöms med samma prompt (`writePrompt`, nivå ur `LEVEL_GUIDE`, 0–5 per kriterium, provets `criteria` om de finns; `examPrompt` i `70-exam.js` anropar den) och sparas i samma format i `S.fb` (`fbStamp`, `fbNorm` läser äldre format, `renderWriteFb`). Kortet Veckans skrivuppgift på startsidan (`writeNagPanel`, stängt för veckan i `S.wrSkip`). | `culture`, `write` |
| `45-tala.js` | Tala: eleven dikterar med tangentbordets mikrofon (artefakter får inte använda mikrofonen) i ett textfält. Ämnen ur provets taluppgifter (`exKind(t) === "speak"`), skrivuppgifterna (`prompts.json`) och, i kurser med `goal`, "Presentera dig själv och din musik" (Muntlig förberedelse); kurser med färre än tre ämnen får tre allmänna. **4/3/2**: samma ämne tre gånger med 4, 3 och 2 minuter (A1/A2: 2, 1,5 och 1), ord per minut per runda (ord efter att tiden gått ut räknas inte), och efter varje runda kommenterar Claude transkriptionen (`talkPrompt`: ordförråd, grammatik, sammanhang, flyt, inte uttal; nivån ur `LEVEL_GUIDE` och `studentDesc`). **Samtal med Claude**: Claude svarar kort på målspråket och ställer följdfrågor, 6 svar från eleven, sedan kommentarer på svenska (`chatPrompt`). Utan `sample` fungerar klockan och ord per minut. Knappen till Skugga finns här. Sparar i `S.talk`, `S.fb["tt:…"]`/`["tc:…"]` och loggen (`kind: "talk"`) | `talk` |
| `46-akta-ljud.js` | Veckans äkta ljud: ett kort på Tala-sidan och under Hörförståelse med en länk (ny flik, inget inbäddat) till nyheter i långsam takt, bara från rätt steg: RFI Journal en français facile (fr, steg 4+), DW Langsam gesprochene Nachrichten (de, steg 5+), News in Slow Italian (it, steg 4+). Veckans tips om hur man lyssnar byts varje måndag. Sparar inget (`REAL_AUDIO`, `realAudioPanel`) | – |
| `50-ktest.js` | Kapitelprov | `ktest` |
| `51-goals.js` | Kapitlets mål på startsidan | – |
| `52-uttal.js`, `53-teori.js` | Uttal och teoriprovet | `utt`, `teori` |
| `54-transkription.js` | Transkription till och från IPA (`content/transkription.json`, bara i kurser som har filen, t.ex. `fru`): välj IPA, välj ord och skriv med IPA-knapprad; rättningen bortser från mellanslag, syllabering och länkning. Format i `docs/spec/transkription.md` | `ipa` |
| `60-grammar.js`, `61-gender.js` | Grammatikövningar, der/die/das och plural | `gram`, `gen`, `plu` |
| `62-satsanalys.js` | Satsanalys med fransk terminologi (`content/satsanalys.json`, bara i kurser som har filen): funktionen eller satstypen för en markerad del `[[…]]`. Format i `docs/spec/satsanalys.md` | `sats` |
| `70-exam.js` | Provträning och provsimulering. Uppgiftstyperna flerval, skriva, tala, para ihop (`match`), lucktext med flerval (`gaps`) och kortsvar (`short`), format i SPEC-kommentaren överst och i `docs/provformat.md`; `build.py` kontrollerar dem (`check_exam_task`) | `exam` |
| `80-level.js` | Nivåmätaren "Var ligger jag?" i statistiken (`statsLevel`, `levelEstimate`): ordförråd över alla kurser i samma språk, grammatik och prov/Claudes bedömningar på GERS-skalan. Räknas ur befintliga fält, sparar inget | – |
| `82-plan.js` | Studieplan vecka för vecka (`languages/<kod>/plan.json` → `L.plan`, kontrolleras av `check_plan` i build.py): kort på startsidan med aktuell vecka och hur många av veckans ord eleven kan, en sida med alla veckor (ord, grammatik, texter, provuppgifter) och startdatum i `S.plan`. Planer finns för de, fr (bara publika texter; bokens kapitel-id för orden), frs4, frs5, fr4, de4 och de6. Uppgifterna öppnas med `openFrom(openPlan, …)` (app.js): `RETURN_TO` gör att Tillbaka (`backTo(listan)`), Avbryt (`pauseSession`) och slutskärmens knapp (`backHome`, "Till studieplanen") leder tillbaka till planen i stället för till övningens lista; den nollställs på startsidan och på listorna (`pickerScreen`, `openWriting`, `openExam`). Skrivsidans provuppgifter använder samma mekanism | `plan` |
| `90-mix.js` | Dagens pass och den blandade rundan | `mix` |
| `99-menu.js` | Menyn med alla övningar och statistiken för dem | – |

Glosquizet (`words`) registreras i `05-words.js`. `defineKind(namn, {name, mc, type, restore, effect, recap, after, again, open, log})` fyller i registret `KINDS` (fälten beskrivs i kommentaren i app.js). Quizmotorn slår upp frågans typ i registret: `k` i frågan, annars passets `kind`. Läs registret direkt (`KINDS.dict.mc`, `KINDS.gram.type`); de gamla vyerna `MC`, `TYPE`, `RESTORE` … togs bort i oktober 2026. Fel i en registrering stoppar inte appen men hamnar i `KIND_ERRORS`, och testet `SCENARIO_KINDS` i `tests/run_tests.py` kontrollerar att listan är tom och att varje typ har det den behöver (namn, frågor eller `open`, `restore` om frågorna kan pausas, `recap` eller `after`).

Typnamnen är nycklar i elevernas sparade data: fråge-id `<typ>:<ref>` i `S.run`/`S.runs` och `firstTry`, `S.runs`-nycklarna (`dict`, `verbs|<spel>`, `story|<id>`, `lq|<id>`, `ktest|<kapitel>`, `mix` …) och `kind` i loggen. De får inte bytas.

**Passläget:** `beginQuiz(typ, frågor, opts)` skapar alltid ett nytt `sess`; inget följer med från förra rundan. Det som ska följa med står i `opts` (`label`, `ctx`, `againFn`, `daily` = rundan hör till Dagens pass, `gramMix` = blandad grammatik som räknas i `S.gt.mix`, verbens `game`/`tenses`, och glosquizets `newW`, `due`, `i`, `extra`, `start` från lärokorten, se `startQuiz`). `daily` och `gramMix` sparas i `S.run` (en blandad grammatikrunda sparad före `gramMix` känns igen på `againFn` i `resumeRun`). `startSession(nya, repetitioner, {daily})` och `startMix({daily})` tar samma fält; `startMix()` utan det (knappen efter glosorna, "En runda till") är en vanlig runda.

**Kapitel:** `chapterKey(avsnitt)` (00-common.js) är det enda som avgör vilket kapitel ett avsnitt hör till: `k3`, `k3b`, `k3x` → `k3`, ett bokavsnitt med namnet "Kap 3 · …" → `k3`, annars avsnittet självt. Nyckeln är nyckeln i `S.kt`. `chapters()` ger kapitlen i ordning (`{id, name, ids, book, words}`); kapitelkartan visar dem utom Mina ord och kapitelprovet (`ktChapters`) dem med minst fyra ord. `sameChapter` bygger på `chapterKey`.

**En uträkning per rendering:** startsidan (`renderStart`) räknar nya ord (`pickNew`), framsteg per avsnitt (`secProg`, `wordCounts`), kapitlen och meningspoolerna en gång per rendering: `perRender(namn, f)` i app.js cachar medan sidan byggs (`inRender`) och räknar om varje gång utanför. `secWords(avsnitt)` är ett index avsnitt → ord som byggs om när `WORDS` byts. `myStats` går igenom loggen en gång, och `peekState` (80-level.js) tolkar en annan kurs localStorage bara när texten har ändrats.

**Fel och gränser:** fel som appen klarar sig förbi skrivs med `warnErr(sammanhang, fel)` (`console.warn`); där tystnad är avsiktlig (localStorage i privat läge, uppläsning som saknas) står en kommentar vid `catch`. Gränser som används på flera ställen är namngivna i app.js: `LOG_MAX` (1 000 loggposter), `MAX_RUN_SEC` (3 600 s per runda, `runSecs(start)`), `UNSENT_MAX` (50 osända meddelanden och felrapporter), och i 00-common.js `FB_MIN_WORDS` (15 ord innan Claude kommenterar).

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
- Varje bit serialiseras en gång per sparning (`cloudSplit` ger JSON-texten, som mäts, hashas och skrivs), synkront innan något väntar på nätet, så att läget inte behöver kopieras i förväg. `rev` för en bit vars text är oförändrad tas ur `REV_CACHE`.
- I webbläsaren skriver `save()` direkt, men `save(true)` (från `snapRun`, efter varje svar) väntar `LOCAL_WAIT` (300 ms). Den väntande skrivningen görs alltid: vid nästa vanliga `save()`, när sidan döljs eller stängs (`visibilitychange`, `pagehide`, `beforeunload`), i `loadState` (kursbyte) och i `takeState` (`flushLocal`).
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
| `selfRate` | `true` = eleven bedömer själv efter ett rätt skrivet ord i glosquizet: Igen/Svårt/Bra/Lätt (tangenterna 1–4, Bra förvalt, Enter går vidare). Svårt = samma steg, Lätt = två steg, Igen = fel (`schedule(…, g)`, `rateBox` i `05-words.js`). Saknas = av. |
| `log` | Loggposter `{p, d, dur, nNew, nRep, right, total, mcR, mcN, tyR, tyN, extra, kind, game, words}`, högst 1 000. Tala (`kind: "talk"`) har också `wpm` (ord per minut i senaste rundan) och `rounds` (4/3/2, en post som uppdateras efter varje runda) eller `chat: 1` (samtal med Claude). |
| `logOld` | `{dur, days, lastDay, n}`: sammanfattning av poster som kapats ur `log`. |
| `nLog` | Antal loggposter någonsin (molnets poäng jämför den). |
| `run`, `runs` | Pågående pass (`snapRun`) och ett påbörjat pass per övning (`runKey`: `words`, `words\|extra`, `<typ>\|<id>` …). Ett glospass kan ha `rate: {<ord-id>: "again"\|"hard"\|"easy"}` (elevens bedömningar, Bra står inte med). |
| `dailyDay` | Dagen då Dagens pass senast gjordes klart. |
| `vt`, `vv` | Verbträning per tempus och per verb `{r, n}`. |
| `mine` | Egna ord `[{t, sv, g, ex, exSv, src, own, form}]`. Ord utan glosa som sparas från en text får grundformen i `t` när den finns i kursens ordlista, någon kurs i samma språk (`data/lemma-<språk>.json`) eller verbtabellerna (`lemmaOf` i `src/kinds/03-lemma.js`), och den böjda formen i `form` (`{t: "fahren", form: "fährt"}`, visas som "fährt (av fahren)"). Äldre ord saknar `form` och behåller sin form och sitt id. |
| `gi`, `gr`, `gt` | Grammatik per fråga `{s, last, dd}`, per regel och per område `{r, n}`. |
| `ga` | der/die/das och plural per ord-id `{g, p, last}`. |
| `tr`, `ph`, `te` | Översätta meningar, fraser, musikteori: per id `{s, last, dd}`. |
| `dc`, `od` | Diktamen och ordföljd per menings-id (ord-id eller Tatoeba-id `<ord-id>#<n>`) `{s, last, dd}`. Saknas tills eleven gjort övningen (från 2026-09-30). Poängen `{s, last, dd}` skrivs av `srsBump` (`00-common.js`): `s` = rätt i rad (0 efter ett fel), `last` = senast övad (ms), `dd` = förfaller (midnatt, ms), 1, 3, 7, 20, 45 och 90 dagar efter rätt svar nummer 1, 2, 3 … (`SRS_DAYS`). En post utan `dd` (sparad före 2026-09-30 eller missad senast) räknas som förfallen; ingen migrering. Fraser, meningar (översätt, diktamen, ordföljd) och grammatik väljer med `weakestFirst(items, fält, {due: true})`: förfallna först, sedan nya, sedan resten, svagast först inom varje grupp; teori, transkription, satsanalys och der/die/das bara svagast först. Antalet förfallna visas på övningarnas knappar och i grammatikens väljare. |
| `ipa`, `sa` | Transkription och satsanalys (universitetskursen): per id `{s, last, dd, r, n}`. |
| `tx`, `stb`, `st` | Läs- och hörtexter `{r, n, best, last}`, berättelsernas bästa resultat, berättelsernas luckor `{tempus, bindeord}`. |
| `cu`, `wr`, `ut`, `mal`, `kt` | Klara kulturuppgifter och skrivuppgifter, bästa uttalsresultat, avbockade lärandemål (`"<id>\|<nr>"`), kapitelprov `{r, n, d, miss}`. |
| `exam` | Provträning `{t: {<uppgift>: {pct, best, n, last}}, sims: [{d, parts, tasks, min}], simRun}` (`tasks` = resultat per uppgift och `min` = minuter, i simuleringar från september 2026). `simRun` = pågående provsimulering `{ids, i, res: {<uppgift>: {pct, r, n}}, ends: {<del>: tid}, start, seen, cur: {id, ans}, code}`, sparad efter varje steg och en gång i minuten så att den överlever en omladdning; när den återupptas flyttas `ends` och `start` fram med tiden sedan `seen` (klockan står still medan appen är stängd). Tas bort när simuleringen är klar eller avbruten. Saknas i äldre lägen. Valfritt `lv` (i `simRun` och `sims`, från oktober 2026) = nivån när hela provet simulerades i en kurs med delar på flera nivåer (Franska 3: `"B1"` eller `"A2"`); saknas i äldre simuleringar och vid simulering av en enda del. |
| `drafts`, `fb` | Utkast och Claudes kommentarer per uppgift. Nycklar: `"w:<id>"` Skriv en text, `"x:<id>"` provuppgift, `"c:<id>"` kultur. En kommentar till en skriv- eller provuppgift är `{d, lv, words, pct, kriterier: [{namn, poang, kommentar}], helhet, bra, fel: [{citat, rattat, varfor}], nasta, niva, prov}` (`lv` = nivån texten bedömdes mot, `words` = antal ord i texten, `pct` = kriteriernas poäng i procent). Kommentarer från före 2026-09-30 saknar `lv`, `words` och `pct` och i Skriv en text också `kriterier`; de läses som förut (`fbNorm` i `40-writing.js`, även en kommentar som bara är en sträng). Tala (`45-tala.js`): `"tt:<ämne>"` = Claudes senaste kommentar till en 4/3/2-runda `{d, r, helhet, bra, fel, flyt, nasta, niva}` (`r` = rundan), `"tc:<ämne>"` = kommentarerna efter ett samtal med Claude `{d, helhet, bra, fel, nasta, niva}`. |
| `talk` | Tala (`45-tala.js`): `{t: {<ämne>: {n, last, wpm: [ord/min per runda senast], best}}, c: {<ämne>: {n, last}}}`: 4/3/2 (antal gånger, senaste rundornas ord per minut, bästa) och samtal med Claude per ämne. Ämne = `"me"` (Presentera dig själv och din musik), `"x:<provuppgift>"`, `"w:<skrivuppgift>"` eller `"g:<n>"` (allmänt ämne). Saknas tills eleven har talat. |
| `wrSkip` | Måndagen (`"ÅÅÅÅ-MM-DD"`) i veckan då eleven stängde kortet Veckans skrivuppgift; kortet visas igen från nästa måndag. Kortet visas när eleven inte har skrivit någon text (Skriv en text eller provuppgift) på 7 dagar. Saknas i gamla lägen (= inte stängt). |
| `plan` | Studieplanen: `{start: "ÅÅÅÅ-MM-DD"}`, första dagen i vecka 1 (aktuell vecka räknas fram). Saknas i gamla lägen. |
| `feedback`, `reports` | Tyck till-meddelanden och felrapporter som inte kunde skickas (högst 50). |

**Migreringar.** `normState` kör `MIGRATIONS[n]` för varje version n som är högre än lägets `v` och sätter sedan `v` till senaste versionen. Nya migreringar läggs alltid sist; en gammal ändras aldrig. Ett läge från en nyare version av appen behåller sitt nummer.

| Version | Migrering |
|---|---|
| 1 | `migrateRetired`: ord med det gamla "kan för alltid" (`due` = 1e9) får ett riktigt repetitionsdatum, utspritt över kommande pass. |

**Molnformatet** (se ovan): huvuddokumentet `{v: 2, head, score, parts, t}` (där `v: 2` är molnformatets version, inte `S.v`), bitarna `{rev, data}`. Gamla dokument `{state, t}` läses fortfarande.
