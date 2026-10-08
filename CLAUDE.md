# Glosor

Glosprogram för en elev i Franska 3 och en elev som pluggar tyska på egen hand (Tyska 4 och Tyska 5). Det verkliga målet är språkprov för att studera musik utomlands: **DELF B1** (Frankrike) och **B2 i tyska** (Goethe-Zertifikat B2, telc B2 eller TestDaF, för Tyskland). Provet anges i `exam` i `lang.js`. Målet (musikstudier) står i det valfria fältet `goal` i `lang.js` (fr, fr4, fru, de4, de, de6) och nämns bara då i Claudes bedömning; bedömningens nivå (A1–C1) tas från uppgiften, provet eller kursen. Används dagligen på iPad och telefon. Allt användargränssnitt och all dokumentation är på svenska.

## Den publicerade länken

- Live: https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP
- Länken måste alltid fungera. Publicera alltid till **samma** URL (`url`-parametern), aldrig som en ny artefakt.
- Framstegen ligger i artefaktens db och i `localStorage` på artefaktens origin. Båda hör till just den här artefakten, så en ny URL betyder att framstegen försvinner.

## Lagring och kapabiliteter

Publicera alltid med de här kapabiliteterna (utelämna `capabilities` vid ompublicering för att behålla dem):

    {"db": {"rules": [{"path": "board", "read": "view", "write": "admin"},
                      {"path": "board/{self}", "write": "interact"},
                      {"path": "feedback", "read": "admin", "write": "admin"},
                      {"path": "feedback/{self}", "read": "interact", "write": "interact"},
                      {"path": "reports", "read": "admin", "write": "admin"},
                      {"path": "reports/{self}", "read": "interact", "write": "interact"},
                      {"path": "summary", "read": "admin", "write": "admin"},
                      {"path": "summary/{self}", "read": "interact", "write": "interact"}]},
     "user": {"scopes": ["profile"]},
     "sample": {}}

- Framsteg: localStorage (hela `S`) + db under `data/users/<uid>/<storageKey>`. Ett db-dokument får vara högst 256 KiB, så molnkopian är uppdelad: huvuddokumentet `<storageKey>` = `{v:2, head, score, parts, t}` (allt utom `w` och `log`) plus `<storageKey>~w0`, `~w1`, … (orden), `~log` (loggen) och vid behov `~f.<fält>`, se `docs/ARKITEKTUR.md`. Bitar som inte längre används raderas efter en lyckad sparning. Gamla dokument `{state, t}` läses fortfarande. Den version som kommit längst vinner (pass, antal loggposter någonsin `S.nLog`, antal ord; vid lika den senaste `t`). Ett molnläge som kommer mitt i ett pass tas emot först när passet är slut.
- Pågående pass sparas i `S.run` efter varje svar, så att det går att fortsätta. Varje övning har också en egen plats i `S.runs` (glospasset `words`, extraövningen `words|extra`, Dagens pass `words|pass`).
- Dagens pass (`90-mix.js`) är korta pass på ungefär fem minuter, flera om dagen: glosorna (alltid med) blandade med två av tre grupper som turas om (fraser och meningar, grammatik/der-die-das, verb/diktamen/ordföljd). Antalet pass i dag räknas ur loggposterna med `dp: 1`. Valfritt provdatum `S.examDate` ger färre nya ord och en provuppgift de sista veckorna. Se `docs/ARKITEKTUR.md` (Dagens pass).
- Topplista: `board/<uid>` = `{nick, langs: {<kod>: {week, min, q, days, streak, last, learned, mastered}}, t}`. Andra profiler än standardprofilen (se nedan) står i samma dokument under `profiles: {<profil-id>: {nick, name, langs}}`; fältet finns bara när kontot har flera profiler. Topplistan visar en rad per konto och profil.
- Vem övar? (profiler): flera personer på samma konto och enhet. Listan `{list: [{id, name, t, gone}], cur}` ligger i localStorage (`glosor-profiles`) och `list` speglas till `data/users/<uid>/profiles`. Standardprofilen (id `""`, namnet "Jag" om inget annat valts) använder exakt kursens `storageKey`; en annan profil använder `<storageKey>@<id>` (id: a–z, 0–9) lokalt och i molnet. Byte bara när inget pass pågår (`profSwitch`). Att ta bort en profil tar bara bort den ur listan (`gone: true`), aldrig framstegen. Se `docs/ARKITEKTUR.md` (Vem övar?).
- Föräldravyn: varje elevs app skriver en sammanfattning i `summary/<uid>` = `{v: 1, t, profiles: {<"_" eller profil-id>: {name, t, courses: {<kod>: {…}}}}}` (ord, minuter, dagar, prov, grammatik, skrivuppgifter, studieplan; `src/kinds/95-parent.js`). Bara ägaren (`user.isOwner()`) ser knappen Öppna föräldravyn under Topplista. Eleverna får veta vad som delas under Tyck till.
- `sample`: "Få kommentarer av Claude" på skrivuppgifter och kultursvar, kommentarer efter varje runda i Tala och Claude som samtalspartner (`45-tala.js`). Den som använder funktionen betalar med sin egen Claude-användning och godkänner det första gången. Kommentarerna sparas i `S.fb`.
- Tyck till: `feedback/<uid>/msgs/<tid>` = `{uid, kind, text, lang, course, t, status, reply, profile}` (`profile` = profilens namn, bara när kontot har flera profiler; samma fält i felrapporterna). Bara eleven själv och ägaren (admin) kan läsa dem. Claude läser dem med ArtifactData: lista `board` för att få elevernas uid, sedan `feedback/<uid>/msgs` (och felrapporterna i `reports/<uid>/items`; en ny felrapport har **inget** `status`-fält, så lista alla och ta dem utan `status`, inte bara `status: "ny"`), för in önskemålen i `docs/BACKLOG.md` och sätter `status` (`ny`, `last`, `backlogg`, `byggt`, `nej`) och `reply`, som eleven ser under fliken Tyck till. Mejla bara en sammanfattning (Gmail) om föräldern ber om det.
- Den som ska spara måste vara inloggad på claude.ai och ha skrivrätt (Contributor inom organisationen, eller Editor inbjuden via e-post när artefakten inte delas via länk).

## Saker som aldrig får ändras

- `storageKey` i `languages/*/lang.js` (`franska-glosor-v2`, `glosor-fr4-v1`, `glosor-fru-v1`, `glosor-de-v1`, `glosor-de4-v1`, `glosor-de6-v1`, `glosor-it1-v1`, `glosor-it2-v1`, `glosor-fr1-v1`, `glosor-fr2-v1`, `glosor-frs4-v1`, `glosor-frs5-v1`, `glosor-de1-v1`, `glosor-de2-v1`, `glosor-de3-v1`, `glosor-de7-v1`, `glosor-it3-v1`, `glosor-it4-v1`, `glosor-it5-v1`, `glosor-it6-v1`, `glosor-it7-v1`).
- Formatet på sparat läge: `{v, pass, w:{<ord-id>:{s,due}}, newCount, src, mode, log, nLog, t}` (`v` = schemaversion, `nLog` = antal loggposter någonsin, räknas fram för gamla lägen; `log` kapas vid 1 000 och resten sammanfattas i `logOld`). Formatet i localStorage är oförändrat; bara molnkopian delas upp. Steg `s` 0–3 = lär sig, 4 och uppåt = kan. Bara skrivna svar tar ett ord till "kan": rätt på flerval räcker till steg 2 (`MC_MAX`), och ett ord med högre steg sänks inte av ett rätt flerval. Steg 0–1 repeteras efter pass (`due`), från steg 2 efter dagar (`dd`, tidsstämpel): nästa pass, 3 pass, 3, 7, 20, 45, 90 dagar (se `INT`, `DAYS` och `schedule` i app.js). Kapitelprovets resultat ligger i `S.kt`.
- Profilernas nycklar: `glosor-profiles`, `data/users/<uid>/profiles`, `<storageKey>@<profil-id>` och att standardprofilen (id `""`) använder kursens `storageKey` utan tillägg. Ett profil-id byts aldrig.
- Ord-id är ordets form i målspråket (första fältet i words.txt), och avsnitts-id används i `S.src`. Att ändra dem nollställer framstegen för de orden.
- `S` har en schemaversion `S.v`. Ändras formen på ett fält läggs en ny migrering **sist** i `MIGRATIONS` i app.js (index = version); ändra aldrig en gammal. Alla fält i `S` står i kommentaren ovanför `loadState` och i `docs/ARKITEKTUR.md`.

### Id-låsen

`build.py` kontrollerar `languages/<kod>/ids.lock` (incheckad): alla ord-id, avsnitts-id, id i varje innehållstyp (även grammatikfrågorna), provuppgifter, grammatikområden och regelnamn, samt `storageKey`. Bygget **stoppar** om ett id i låset har försvunnit (t.ex. ett ord som bytt stavning), om `storageKey` ändrats eller om två kurser har samma `storageKey`. Nya id läggs till i låset automatiskt; checka in låset tillsammans med ändringen. Bokens id låses i `languages/<kod>/book/ids.lock` (i bokens privata repo), så att det publika låset inte avslöjar bokinnehåll.

Ta aldrig bort rader ur låset för hand. Är en borttagning verkligen meningen (eleverna förlorar framstegen för just det id:t), godkänn den med

    python3 build.py --allow-removed <kod>:<typ>|<id>      (t.ex. de:ord|die Persönlichkeit (-en), eller <kod>:<id> för alla typer)

eller en rad `<typ>|<id>` i `languages/<kod>/ids.removed` (`book/ids.removed` för bokens id). Id:t tas då bort ur låset.

Ett felaktigt ord-id rättas utan att framstegen försvinner med en rad `ord|<gammalt id>|<nytt id>` i `languages/<kod>/ids.renamed`: låset uppdateras, datafilen får `renames` och appen flyttar elevernas framsteg till det nya id:t (`applyRenames`, se `docs/ARKITEKTUR.md`). Ta aldrig bort en rad ur `ids.renamed`.

## Struktur

Översikt över var data ligger: `docs/ARKITEKTUR.md`.


- `src/app.js`: språk, sparande (lokalt och claude.ai), vilka ord som är nya (`pickNew`: vanligast först inom avsnittet, efter `freq` som build.py räknar ur kursens texter) och repetitionsschemat, quizmotor, registret över övningstyper (`defineKind`, `KINDS`), statistik, topplista. Text från datafilerna läggs alltid in med `esc` (ren text) eller `safeHtml` (ursprung och ordagrant i words.txt: bara `b`, `i`, `em`, `strong`, `br`, `sup`, `sub` och `span` med class släpps igenom). Facit `d.answer` är ren text och escapas i quizmotorn (`answerHtml`); en typ som vill visa formaterat facit sätter `d.answerHtml`.
- `src/kinds/*.js`: en fil per övningstyp eller grupp, som build.py läser i namnordning mellan `app.js` och `feedback.js` (numret i filnamnet bestämmer ordningen). Varje typ registrerar sig med `defineKind(namn, {name, mc, type, restore, effect, recap, after, again, open, log})`, se kommentaren i app.js. Koden och testerna läser registret direkt (`KINDS.dict.mc`, `KINDS.gram.type` …); de gamla vyerna `MC`, `TYPE`, `RESTORE` … är borttagna. Fråge-id är `<typ>:<ref>`, så typerna kan blandas i Dagens pass; typnamnen är nycklar i `S.run`, `S.runs` och loggen och får inte bytas. Glosquizet (`words`) ligger i `05-words.js`. `00-common.js` har det som delas (bl.a. `tl(x)`, texten på målspråket: fältet heter `fr` i alla datafiler, även tyska och italienska, och läses bara via `tl`). Grammatiken (`60-grammar.js`, frågorna i `content/grammar-*.json`, format i `docs/spec/grammatik.md`), der/die/das och plural (`61-gender.js`) och provträningen (`70-exam.js`, `content/exam.json`, resultat i `S.exam`) ligger också här. En ny övningstyp = en ny fil i `src/kinds/` och en knapp i `99-menu.js`; testet i `tests/run_tests.py` (`SCENARIO_KINDS`) kontrollerar att typen har det den behöver.
- `src/feedback.js`: fliken Tyck till.
- `src/main.js`: start (körs sist). Kursväljaren är `fillCourses` i app.js: en grupp per språk (`name`), sorterad efter `step`, med texten "Franska 3 · steg 3 · A2 · mål DELF B1" (`courseLine`), och kommande kurser ur `upcoming.json` som ej valbara "– kommer".
- Arv mellan kurser: `extends: "<kod>"` och `inherit: ["connectors", "tenseCheck", "verbs", …]` i `lang.js`. De fälten slås ihop djupt med kursens egna när sidan startar (`inheritCourses` i app.js); kursens egna fält vinner, `{$append: [...]}` lägger till i förälderns lista och `{$remove: [nycklar]}` tar bort nycklar ur förälderns objekt. Bara fälten i `inherit` ärvs. Ordningen mellan kurserna spelar ingen roll, och build.py kontrollerar att föräldern finns.
- `languages/de4/`: Tyska 4 (steg 4, A2 → B1). Ärver verb (utan Konjunktiv I), bindeord och tempusigenkänning från `de`. `nextCourse` ger förslaget att gå vidare till Tyska 5.
- `languages/fr4/` och `languages/de6/`: **Franska 6** (koden `fr4` av historiska skäl: kursen hette först Franska 4; koden och `storageKey` ändras inte) (steg 6, B1, provmål DELF B1, se `docs/nivaer-franska.md`) och Tyska 6 (steg 6, B1 → B2), utan lärobok. Ärver bindeord, tempusigenkänning och verb från `fr` respektive `de` (fr4 lägger till egna bindeord och conditionnel/subjonctif, och har passé simple att känna igen). Tyska 5 har `nextCourse: "de6"`.
- `languages/fru/`: Franska I på universitetet (1–30 hp, `step: "U"`, `stepAs: 7`, level B2, provmål DELF B2), toppen av den franska kedjan; väljaren visar "motsvarar steg 7". Underlag i `docs/franska-universitet.md`. Ärver accenter, artiklar, pronomen, bindeord, tempusigenkänning och verb från `fr` och lägger till passé simple. Kedjan via `nextCourse`: fr1 → fr2 → fr (Franska 3) → frs4 (Franska 4) → frs5 (Franska 5) → fr4 (Franska 6) → fru. Ingen Franska 7.
- `languages/it1/`, `languages/it2/`: Italienska 1 (A1) och 2 (A1 → A2), plan i `docs/italienska-plan.md`. it2 ärver artiklar, pronomen, bindeord m.m. från it1.
- `content/regler.json`: grammatikregler per område (format i `docs/spec/regler.md`).
- `docs/spec/`: formaten för allt kursinnehåll, en fil per typ (`allmant.md` har de allmänna reglerna och en tabell över filerna). `languages/<kod>/content/SPEC.md` har bara kursens tillägg (elev och nivå, kapitel-id och teman, tempusnamn, grammatikområden, provet). build.py kontrollerar att varje post har de fält appen läser (`check_fields`, `CONTENT_FIELDS`).
- `languages/<kod>/lang.js`: kursinställningar (course, `step`, level, storageKey, accenter, verbspel (`persons`, `prefix`, `games`), bindeord, tempusigenkänning, valbara avsnitt `elective`: `{test: /regex/, label}` eller en lista med sådana, en grupp per post, se `docs/ARKITEKTUR.md`). `step` är 1–7 (Moderna språk 1–7) eller `"U"` (universitet) och styr sorteringen i väljaren; koden säger ingenting om steget (`fr4` är Franska 6). En universitetskurs kan ange `stepAs` (steget den motsvarar), som visas som "motsvarar steg 7". `level` = GERS-nivån enligt Skolverket (betyget E) och vart kursen leder, och ska börja med stegets nivå (1–2 A1, 3–4 A2, 5–6 B1, 7 B2), se `docs/kursmall.md` 2.1 och 3.7; provmålet står i `exam`. `nextCourse` är en kod eller en lista (`["fr", "fr4"]`) när det finns två vägar vidare; varje kod måste finnas. build.py läser filen med en liten tokenizer (`parse_lang_js`), så enkla eller dubbla citattecken, kommentarer och radbrytningar går bra, men `storageKey`, `extends`, `inherit`, `nextCourse`, `step`, `level` och namnfälten måste vara rena literaler (inga uttryck); annars stoppar bygget.
- `languages/<kod>/grammar.json`: grammatikens områden (`topics`, där `secs` = kapitel där området kommer först), regelnamn (`rules`) och för tyskan `adj`. Följer med kursens datafil (`L.grammar` finns först när kursen är hämtad), inte index.html.
- `languages/<kod>/verbs.json`: verbtabellerna (`sv`, `tenses`, `notes`). Följer med kursens datafil som `verbTables`, med arvet (`extends`/`inherit: ["verbs"]`) redan ihopslaget av build.py (`resolve_verbs`), och läggs in i `L.verbs` när kursen hämtats (`addCourseData`), inte i index.html. build.py stoppar om `tenses`/`notes` står i lang.js.
- `languages/<kod>/ids.lock`: id-låset, skrivs av build.py (se ovan).
- `languages/<kod>/words.txt`: ordlistan, `ord|svenska|genus|exempel|exempel sv|ursprung|ordagrant`. Främmande ord i ursprunget ska ha svensk betydelse, och fraser får gärna det sjunde fältet med ordagrann översättning. `content/*.json` innehåller hörtexter, lästexter, berättelser, fraser, skrivuppgifter och kultur. `videos.json` innehåller YouTube-klipp (kontrollerade med oEmbed).
- `languages/upcoming.json`: kommande kurser `{code, name, course, step, level}` som visas i väljaren men inte går att välja. När kursen byggs tas raden bort (bygget varnar annars, och väljaren visar den inte två gånger).
- `languages/<kod>/book/kapNN/`: material från elevens lärobok per kapitel, plus `book/sidor.json` (privat, i `.gitignore`, eget lokalt git-repo, byggs in om mappen finns). Kapitel ur boken markeras `#id|Namn|bok`. Se `docs/BOK.md`.
- `tools/`: `tackning.py` (andel kända ord per text, `docs/tackning.md`), `tatoeba.py` (exempelmeningar), `plan.py` + `plan_tips.py` (studieplaner, kör efter bygget när en kurs ändras).
- `docs/BACKLOG.md`: allt som inte är byggt. När något byggs flyttas punkten till `docs/KLART.md` med referens till backloggpunkten och commit.

## Ny kurs

Se checklistan i `docs/ARKITEKTUR.md` (Lägga till mer). Kort: `languages/<kod>/lang.js` med `name`, `title`, `course`, `step`, `level`, `inLang`, `tts` och en ny `storageKey` (lägg till den i listan ovan), `words.txt` med minst ett avsnitt, ta bort raden i `upcoming.json` och peka `nextCourse` i kursen före hit. Allt annat (content, grammatik, verb, prov, plan) är valfritt; testet `test_minimal_course` bygger en sådan låtsaskurs och spelar igenom den.

## Arbetsflöde

1. Ändra i `languages/<kod>/words.txt`, `lang.js` eller `src/`.
2. `python3 build.py` (bara Pythons standardbibliotek, Node finns inte på datorn). Stoppar om ett låst id har försvunnit (se Id-låsen); checka in ändrade `ids.lock`.
3. `python3 tests/run_tests.py`: spelar igenom alla övningar i Chrome utan fönster, med sparad data och en låtsad claude.ai-lagring. Allt ska vara OK innan du publicerar.
4. Publicera `dist/index.html` till URL:en ovan **med alla filer i `dist/data/` i `files`**, även provfilerna `<kod>-exam.json` och grundformerna `lemma-fr.json`, `lemma-de.json`, `lemma-it.json` (`{"data/fr.json": "dist/data/fr.json", "data/fr-exam.json": "dist/data/fr-exam.json", …}`), se `docs/ARKITEKTUR.md`. Provträningen hämtas först när den behövs (`ensureExam`), så en saknad provfil märks inte förrän eleven öppnar provet. Läs först live-versionen med Artifact `action: "read"`. Om den har ändrats utanför projektet (t.ex. i claude.ai-chatten) ska de ändringarna föras in i källfilerna innan du publicerar, så att inget skrivs över.

`dist/` genereras och är inte versionshanterad.
