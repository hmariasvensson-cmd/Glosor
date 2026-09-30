# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Tyck till från eleverna

- **Löpande (prioriteras först):** läs nya meddelanden i `feedback/<uid>/msgs` för varje uid i `board` (ArtifactData, `status: "ny"`), för in önskemålen här, och sätt `status` och `reply` i dokumentet så att eleven ser vad som hände (se CLAUDE.md). Elevernas önskemål går före annat i backloggen.

## Färre men mer värdefulla övningar (granskning 2026-09-28)

Föräldern: "Vi vill inte ha för många övningar men vi vill ha övningar som är så värdefulla som möjligt." Granskningen jämförde alla cirka 20 övningar med forskningen om inlärning (testeffekt, utspridd repetition, egen produktion, begriplig input, återkoppling). Slutsats: Dagens pass är nästan bara drill, lyssning, läsning, tal och skrivande ingår inte, och flera övningar gör samma sak med samma meningar.

- **P1 (föräldern har inte bestämt sig än): Dagens pass som ett enda flöde:** glosor 6–7 min, fraser och meningar 3, grammatik 3 (tyska även der/die/das), hör- eller lästext varannan dag 4–5, tal 1–2. Klart först när allt är gjort. Provdatum i inställningarna ändrar viktningen (fler provuppgifter och färre nya ord närmare provet, inga nya ord de sista två veckorna). `dailyPanel`, `startDaily`, `startMix`, `finishSession`.
- **P1 (föräldern har inte bestämt sig än): Tyska: dölj genus i skrivfrågan** (`TYPE.words` visar "(maskulinum)"), så att eleven själv måste minnas der/die/das. Visa genus efter svaret.
- **P2: Ny övning Tala:** diktering med tangentbordets mikrofon i ett textfält, Claude kommenterar, timer för 4/3/2 med ämnen från proven. Skugga flyttas hit. Återanvänd `examText`/`examPrompt`.
- **P2 (vänta, föräldern 2026-09-28): Färre menyval (cirka 20 → 11):** Meningar, Diktamen och Översätt blir en övning som går från lucka till översättning till diktamen. Ordföljd tas bort som egen övning (behövs kvar för grammatikens `rw`-frågor). Verbspelen blir ett. Kultur in i Läsa, Berättelser in i Grammatik, Uttal göms under Tala. **Fråga föräldern innan något tas bort.**
- **P2: Ordning på nya ord:** vanligaste orden först, och franskan får ett avsnitt med vanliga ord. `pickNew`. (Musikteorin som eget val är byggd, se KLART.md.)
- **P2: Bara skrivna svar gör att ett ord räknas som "kan"**; flerval räcker till steg 2. `applyAnswer`, `schedule`.
- **P2: Slå ihop Skriv en text och provets skrivuppgifter** med samma bedömning av Claude, med påminnelse en gång i veckan.
- **P3: Äkta ljud:** veckans tips med nyheter i långsam takt (RFI Journal en français facile, DW Langsam gesprochene Nachrichten) att läsa medan man lyssnar.
- **P3: Tidsbaserad repetition även i fraser, meningar och grammatik** (i dag bara "svagast först").

## Språkprov (det verkliga målet)

- **P2: Musikteori i fler kurser och granskning:** musikteoriord och teoriprov finns i Franska 3 och Tyska 5. Termer att kontrollera med en musiklärare: franska omvändningsnamn (sixte sensible, accord de triton), cadence parfaite/imparfaite, tyska Gegenklang och verkürzter Dominantseptakkord. Tyska 4 kan få en lättare variant. Fler uppgifter finns i generatorn (57 tyska till).


Båda eleverna ska söka musikutbildning utomlands. Eleven i franska behöver visa **B1 i franska** (DELF B1) för Frankrike, och eleven i tyska behöver visa **B2 i tyska** för Tyskland. Musikhögskolorna godtar oftast Goethe-Zertifikat B2, telc B2 eller TestDaF, men kontrollera vad just deras skolor kräver. Betyg i kursen spelar mindre roll.

- **P2: Muntlig förberedelse:** presentera sig själv och sin musik, med skuggning och Claude som samtalspartner (text).

## Repetition och inlärning

- **P3: Byt schemaläggare till FSRS** (eleven önskade 2026-09-27 ett fast schema: nästa pass, efter 3 pass, sedan 3, 7 och 20 dagar, vilket är byggt; FSRS bara om han vill) (ts-fsrs, MIT, finns som UMD på jsDelivr). Räkna i dagar i stället för pass, med retention 0,9. Lägg kortdata i ett nytt fält och behåll `s`/`due` för statistik och topplista. Det enklare stegschemat (se KLART.md) löser det värsta, så detta är mindre brådskande.
- **P3: Självbedömning i fyra steg** (Igen/Svårt/Bra/Lätt) i skrivfrågor.
- **P3: Mina ord:** koppla böjda former till grundformen (som Lutes "parent terms"). Ord med glosa sparas redan i grundform, men ord utan glosa sparas som de står i texten.
- **P3: Tatoeba-meningar även för tyska** (`python3 tools/tatoeba.py de`) och fler franska ord (i dag har 136 av 258 ord minst en mening).

## Italienska 1 och 2

- **P2: Granskning av italienskan** (1 067 ord, 527 grammatikfrågor, regler och texter, allt AI-skrivet) av en lärare eller italiensktalande, åtminstone ett stickprov.
- **P3: Kapitelord i skrivchecklistan** känner inte igen italienska böjda former (curiosa, tifosi). Gör `usesWord` språkmedveten. Omvänt matchar franska verb på stammen, så *danser* räknas i varje text med *dans* (i).

## Tyska 4 (B1)

- **P2: Granskning av innehållet i Tyska 4** (551 ord, 270 grammatikfrågor och alla texter är AI-skrivna). Stickprov av en tysktalande, särskilt siffrorna i kulturtexterna.

## Tyska (Tyska 5, mot B2)

Emma pluggar på egen hand, utan kurs, lärare och lärobok. Tyskan bygger därför helt på kursplanen och det allmänna spåret.

- **P3: Studieplan:** "Tillbaka" från en uppgift som öppnats i planen leder till övningens lista, inte till planen. Planer för fler kurser (lägg `plan.json` i kursmappen).

- **P2: Större ordförråd, steg 3.** 1 629 ord nu. B2 kräver ungefär 3 000–4 000 ord. Fortsätt FrequencyWords från rang 2010 (CC BY-SA 4.0), eller använd kaikki/Wiktionary. Goethes listor är upphovsrättsskyddade och får inte kopieras.
- **P2: Granskning av grammatikfrågorna** (390 tyska, 322 franska) av en lärare eller modersmålstalare, åtminstone ett stickprov på 10 %. Gå också igenom elevernas rapporter i `reports/<uid>/items` (läs dem med ArtifactData) och rätta i källfilerna.
- **P3: Verbdata från Wiktionary/kaikki** i stället för handskrivna verbtabeller.

## Franska (Franska 3, mot A och B1)

- **P3: Fler verb i verbspelen**, datadrivet (verbecc, LGPL-3.0).
- **P3: Granskning av innehållet** (hörtexter, lästexter, berättelser, fraser, kultur) av läraren eller en fransktalande. Allt är AI-skrivet och har bara kontrollerats med stickprov.

## Kurser och nivåer

- **P2: Resten av kursmallen** (`docs/kursmall.md`, avsnitt 4). Byggt: paket 1–8, 10 och 13–16 samt nivåerna. Kvar:
  - Paket 9 (grammatiken kopplad till kapitel) gör bara nytta i kurser med lärobok, så det väntar.
  - Lyssna igenom uttalsövningarna med en riktig röst. Vissa par kan låta lika i vissa webbläsare, till exempel é/è i franska och enkelt/dubbelt s i italienska. Sällsynta ord bör bytas ut.
- **P3: Fler grammatikområden ur bokens minigrammatik:** prepositioner för tid och plats, räkneord och klockan, oregelbundna verb i presens (verbspelen täcker en del), demonstrativa pronomen, quel/lequel, tout, gérondif och passiv form. Minigrammatiken s. 200–201 och sidorna före s. 194 saknas.

- **P1: Fler sidor ur Escalade.** Inlagda: s. 8–69, 98–131, 148–153, 182–191 och minigrammatiken s. 196–199 och 202–237 (se `languages/fr/book/sidor.json`). Saknas: s. 70–97, 132–147, 154–181, 192–195 och 200–201. Fota också om s. 101, där högerkanten saknas. Kapitelnumret för s. 148–153 (antaget kap 10) och s. 182–191 och titeln på kap 6 behöver bekräftas.
- **P2: Säkerhetskopiera bokmappen** till ett privat repo på GitHub (`languages/fr/book/` är redan ett eget lokalt git-repo). Kräver att föräldern godkänner att ett privat repo skapas.
- **P3: Välja bok per elev**, om flera elever med olika böcker ska använda samma kurs.
- **P2: De nya kurserna (2026-09-29): fyll på och granska.** Allt AI-skrivet och bara testat maskinellt. Kvar enligt rapporterna: kortare texter än specen i de1–de3, it3, it5, frs5 (hör- och lästexter), 1 lästext per kapitel i de7 och frs5, de7 har 8 skrivuppgifter och 4 kultur/berättelser, it4 saknar glosor i texterna, ordantal under spec i de7 (700) och it5–it7 (ca 900–980). Överlapp mellan kurser är tillåtet men kan minskas (t.ex. frs5 och fr4 delar 245 ord, de2 och de3 några, it4–it6 sju). Kör en frekvenstäckningsmätning (DeReWo/Lexique/De Mauro). Videor: A1-förrådet saknar skola och kläder (fr1 e3, e7), B2-förrådet musik (it7), juridik (de7 s4, it7).
- **P2: Fler provuppgiftstyper** (kräver kod): bildval (DELF A1/A2, CELI), TestDaF-grafik (diagram), talade svar på tid, TDN-skala. Para ihop, lucktext och kortsvar finns sedan version 31.
  - Varje kurs får en egen mapp i `languages/` och en egen `storageKey`. Bygg efter kursmallen (`docs/kursmall.md`) och Skolverkets centrala innehåll för steget. Nivån ungefär enligt Skolverket: steg 1 A1.1, 2 A1.2, 3 A2.1, 4 A2.2, 5 B1.1, 6 B1.2, 7 B2.1.
  - Varje kurs ska bygga vidare på den förra utan att orden överlappar, och ha `nextCourse` till nästa steg.
  - Ordning: Italienska 3 (står som kommande i `languages/upcoming.json`), sedan de lägre stegen (1–2 i franska, 1–3 i tyska) och sist steg 7 och Franska 5.
  - Arbetssätt som fungerade för Franska 6 (fr4) och Tyska 6: glosorna i två halvor av två agenter (med dubblettkontroll mot tidigare kurser och mot varandra), allt övrigt innehåll av en tredje. Modelltexterna i skrivuppgifterna ska skrivas **efter** ordlistan, annars saknar de kapitelord.
  - Innehållet är AI-skrivet och behöver granskas med stickprov, som de andra kurserna.
- **P2: Franska I (universitet): granskning.** Allt AI-skrivet. IPA och satsanalys är granskade av AI (2026-09-29) men bör ses av en lärare. Kontrollera siffror som åldras i exemplen (statsskuld, asylsökande, fattigdom, valresultat 2024–2026), citaten (Zola, Maupassant, Verlaine, Boileau, Baudelaire) mot originalen, och uttalsparen saule/sole, nuée/nouer, enfui/enfoui med en riktig röst. AI-granskning 2026-09-29 (se KLART.md): ord från rad 636, grammatik, hörtexter, kultur och 12 av 16 lästexter; kvar: words.txt rad 1–635 (om den delen inte hann klart), lästexterna r-u7-classicisme, r-u8-bd, r-u8-langue och r-u7-verlaine utöver dikten. Normfrågor att avgöra: inv-017, subj3-007–009, subj3-026. Ordposter: Dorine "suivante", l'arriviste/l'éditorialiste genus, le voisement "tonalitet". Barthes "écriture blanche" (död 1980) i r-u6-etranger: begrepp, inte citat — bekräfta.
- **P2: Franska 6 (fr4) och Tyska 6: granskning.** Båda kurserna (2026-09-28) är AI-skrivna (videor finns sedan 2026-09-29). Kontrollera särskilt uttalsparen cote/côte och Paul/pôle (fr4) och wanke/zanke, Suhle/Kuhle (de6) med en riktig röst, modalpartiklarna i Hitta felet (de6) och faktauppgifterna i kultur- och historietexterna. Franska 4 har musikteori bara i Franska 3; Tyska 6 har den bara i Tyska 5. AI-granskning 2026-09-29 gjord (se KLART.md). Kvar för modersmålstalare: fr4 "nocif, -ve" i ord-id:t (borde vara -ive, kräver id-lås), sakuppgifter om dödshjälp i Frankrike (lag 2025–2026), «L'État, c'est moi», fr4 subj2-028/029, pass-028, disc-018; de6 k1-008/k1-012 (indikativ i indirekt tal räknas som fel), p34 dativ/ackusativ, s-s2 kabelkontrollen; de4 konj-007/029, passiv-024, t4-p23; de passiv-040; pantbelopp i c-d4-pfand. Skriv- och taluppgifternas modelltexter i exam.json är bara översiktligt granskade.
- **P2: Franska: brister från nivågranskningen** (`docs/nivaer-franska.md`, avsnitt 4; beslutet om nivåerna är genomfört 2026-09-29):
  - **Franska 3 (`fr`) saknar DELF A2 som mellansteg.** Provträningen är DELF B1, två steg över kursen (provtexterna 260–385 ord mot kursens snitt 154–177). Lägg till DELF A2-uppgifter som egen övningsnivå (eller hänvisa till Franska 4, `frs4`, som har DELF A2). Kräver A2-varianten av provformatet i `70-exam.js` (`parts` co 25 / ce 30 / pe 45 / po 8 min), samma motor behövs för DELF A1 i Franska 1–2.
  - **Franska 3: inget avsnitt med vanliga ord** utanför boken och musikteorin (bara `fm`). Kontrollera hela kedjan mot de 2 000 vanligaste lemmana (Lonsdale och Le Bras eller Lexique 3) och fyll luckorna.
  - **Franska 3: `subj` och `si` (och `rel`, `comp`, `quest`, `cond`, `imper`) saknar kapitel** (`secs: null`). Märk `subj` och `si` som förhandsvisning nu när Franska 4 och 5 finns. Saknas som egna områden: *depuis / il y a / pendant* och *venir de / être en train de*.
  - **Franska 6 (`fr4`): grammatik från steg 4–5 som inte övas i kedjan före fr4** förrän `frs4`/`frs5` är klara: dubbla pronomen, participets kongruens med avoir, verb + à/de + infinitiv (finns bara i `fru`: `pronord`, `accord`, `prepinf`). Kontrollera att frs4 och frs5 täcker dem.
  - **Franska 6 (`fr4`): äldre texter (Hugo, Molière) med passé simple** bör länka till det nya området `psimp` eller undvika passé simple. Nominalisering (början) och formell stil saknar eget område på steg 6.
  - **Franska 6 (`fr4`): ordmängden** 1 045 ord mot målet 1 000–1 200 per steg; tillsammans med frs4/frs5 ska kedjan nå ca 3 000 ord. Dubblettkontroll mellan frs4/frs5 och fr4 behövs (överlapp är godkänt av föräldern, men bör hållas litet).
  - **Franska I (`fru`): några DALF C1-lika uppgifter** (sammanfattning av två texter) om kursen ska leda mot universitetets krav.
  - **Franska I (`fru`): de nya områdena `nomin` och `conces`** (2026-09-29) är AI-skrivna; `nomin-reg` och `nomin-titre` är undantagna från Hitta felet. Granska stilnivåexemplen (familier/soutenu) med en fransktalande.

## Arkitektur (granskning 2026-09-29)

Granskning av `src/app.js`, `src/kinds/`, arvet i `lang.js`, `build.py`, testerna och kursmapparna. Punkterna från granskningen 2026-09-28 är byggda (se KLART.md, 2026-09-28 del 6). Rättat direkt 2026-09-29, bara i build.py och testerna: bygget gick inte igenom utan den privata bokmappen (`check_content` stoppade på `sec: "k4"` …, nu en varning), nya kontroller i `check_grammar_refs` (grammatikfrågans `topic`/`rule` finns i grammar.json, områdenas `secs` finns i words.txt, nycklarna i regler.json är områden) och i `check_extends` (varje fält i `inherit` finns hos föräldern, `nextCourse` finns), ett begripligt fel när en bokfil är lista och kursens objekt (eller tvärtom), och storleksvarningar (`MAX_PAGE_KB`, `MAX_DATA_KB`). Testerna finns i `test_build_checks` i `tests/run_tests.py`.

- **P2: Startsidan räknar om allt vid varje klick.** `renderStart` kör `pickNew` flera gånger (via `goalsPanel` och `chapterMap`), `pickNew` gör `SECTIONS.find` per ord, `secProg` är avsnitt × ord (`secOpt`, `progLabel`, `chapterMap` två gånger per grupp) och `dailyPanel` → `myStats` går igenom loggen cirka tio gånger (`weekHistory`). Räkna ett index avsnitt → ord en gång per `useLang`/`rebuildWords` och ett resultat per rendering. Samma sak i `renderStats` (pass × ord, `secRows`) och `levelVocab` (80-level.js), som gör `JSON.parse` på de andra kursernas hela localStorage vid varje rendering (cacha per `storageKey` och `t`).
- **P2: Gemensamma hjälpfunktioner i 00-common.js för det som upprepas i typerna:** `weakestFirst(items, fält)` för "svagast först" (`startTrans`, `phraseItems`, `startTeori`, `ipaItems`, `startSats`, `startGender`, varianten i `bankIds`), `srsBump(fält, id, rätt)` för `{s, last, r, n}` (11-sentences, 20-phrases, `teoriEffect`, `ipaEffect`, `satsEffect`, `gramEffect`), `groupMeters` i stället för de nästan identiska `ipaStats` och `satsStats`, en väljare "Blandat · k av n" (`openIpa`, `openSats`) och `startRound(kind, items)` för `$("#tabs").hidden=true; sess=null; beginQuiz(...)` (cirka 19 ställen). `finishGeneric` kan få en krok för egen sammanfattning, så att `ipaAfter` och `uttAfter` bara sparar. `apos` och `gapos` gör samma sak, och `rmark` (60-grammar.js) används redan av 52–62 och hör hemma i 00-common.js. Kräver att ingen annan ändrar i `src/kinds/` samtidigt; fråge-id och `S`-fält ändras inte.
- **P2: Flytta typspecifik kod ur app.js:** glosquizet (`renderLearn`, `qType`, `startQuiz`, `mcOptions`, `explain`, `studyCard`, `memoBox`, `defineKind("words")`, `applyAnswer`, `tally`, `finishSession`) till en ny `05-words.js`, verben (`buildConj`, `verbGames`, `ruleFor`, `conjVariants`, `CONJ`/`CONJBY` i `useLang`, verbgrenarna i `runLabel`/`resumeRun`, blocket Verbböjning i `renderStats`) till 10-verbs.js, och Dagens pass (`dailyPanel`, dagdelen av `finishSession`) till 90-mix.js. Lägg ett fält `stats` i `KIND_FIELDS`, så att `renderStats` och 99-menu.js inte behöver anropa `statsExercises`, `statsGrammar`, `ipaStats` och `satsStats` med namn. app.js blir då språk, sparande, quizmotor och register.
- **P2: Bräckligt passläge.** `beginQuiz` gör `Object.assign(sess||{}, …)`, så ett anrop som glömmer `sess=null` tar med sig fält från förra rundan (`startDaily` bygger på det). `startMix` jämför `daily===true` eftersom klickhändelsen kommer som argument, `gramEffect` tittar på `sess.againFn[1]==="mix"`, och kapitelprovet har `sess.kind` `ktestd` men frågorna `k: "ktest"`. Ge `beginQuiz` ett uttryckligt `opts.daily`/`opts.mix` och skapa alltid ett nytt `sess`.
- **P2: Italienska 1 saknar provträning** (it2 har CELI Impatto sedan version 31). Lägg ett kort CELI Impatto/A1-prov i it1.
- **P2: Datafilerna är stora för en telefon:** 0,3–1,4 MB okomprimerat (100–470 kB gzip), och provträningen är största delen i tyskan (`content.exam` 301 kB i de, varav hörtexterna `lines` 154 kB). Dela ut `exam` (och `tatoeba` i fr) i en egen fil `data/<kod>-exam.json` som hämtas när provträningen öppnas, med eget hash i `DATA_VERSION`. build.py varnar nu över 1 600 kB per fil och 450 kB för index.html (360 kB i dag).
- **P2: Build-kontroll av innehållets fält per typ.** build.py kontrollerar id, facit och `sec`, men inte att t.ex. en hörtext har `lines` och `questions`, en berättelse sina luckor eller en skrivuppgift (`prompts`) `task` och modelltext. Ett saknat fält syns först som ett fel i appen. Lägg en tabell `REQUIRED = {"listening": ["id", "lines", "questions"], …}` enligt SPEC-filerna i `check_content`.
- **P3: Död kod:** `DAY` och `dayStart` (app.js, bara en kommentar nämner dem), vyn `EFFECT`, och `MC`, `TYPE`, `RESTORE`, `RECAP`, `AFTER`, `AGAIN` och `KIND_NAMES`, som bara testerna använder (skriv om testerna till `KINDS[...]` och ta bort vyerna). Kontrollerna `typeof X==="function"` för `ktKey`, `sameChapter`, `genderNouns`, `hasGrammar` och `hasExam` är alltid sanna eftersom allt byggs till ett skript. Gamla rubrikkommentarer i 00-common.js ("Meningar att öva på") och app.js ("Ordlista" ovanför `statsForecast`).
- **P3: Tre sorters "kapitel":** `chapterKey` (00-common.js, efter namn), `ktKey` (50-ktest.js, efter id) och `chapterGroups` (app.js); `ktChapters` gör samma sak som `chapterGroups`. Behåll en.
- **P3: Sparning vid varje svar:** `snapRun` → `save()` gör `JSON.stringify` på hela `S`, och `cloudDocs` hashar om alla bitar vid varje sparning. Spara `S.run` separat eller vänta några hundra ms, och hasha bara bitar som ändrats. `mcOptions` och flervalet i `cloze` blandar hela `WORDS` två gånger per fråga, och `listWord` kör `variants()` över hela ordlistan vid varje ritning.
- **P3: 23 tomma `catch(e){}`,** bland annat i `cloudPrune`, `cloudInit` och uppstarten av `SAMPLE`. Skriv åtminstone `console.warn`, så att fel syns i testerna. `setInterval(applyDeferred, 2000)` går hela tiden och kan ersättas av anrop när ett pass slutar.
- **P3: Namngivna konstanter** för 3600 s (längsta passtid), 1 000 loggposter, 15 ord (minsta text för Claudes kommentar) och 50 osända rapporter, i stället för siffror på flera ställen.
- **P3: build.py läser lang.js med reguljära uttryck** (`storageKey`, `extends`, `inherit`, `nextCourse`, `title`), så enkla citattecken eller en kommentar i fel läge gör att en kontroll hoppas över. Skriv kraven i ARKITEKTUR.md (dubbla citattecken, ett fält per rad) eller lägg en kontroll som stoppar när `storageKey`/`extends` står i en form som inte känns igen. Kontrollen av dubblerade id görs två gånger (en för allt utom grammar, en för grammar) och kan slås ihop.
- **P3: Specfilerna ligger utspridda och saknas i flera kurser:** `SPEC-ordlista.md` finns i de, de4 och it1 men inte i fr, fr4, fru, de6 och it2, och `GRAMMATIK-SPEC.md` bara i de, de4 och fr. Flytta de gemensamma till `docs/` och låt kursmappen bara ha det som skiljer.

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Behövs bara om två personer övar på *samma* språk med samma claude.ai-konto. Lägg då till en profilväljare ("Vem övar?").
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.

- **P2: Provträning med två nivåer i samma kurs** (Franska 3 har B1 och A2-delar): provsimuleringen "hela provet" tar med båda nivåerna, och nivåmätaren räknar A2-delar mot B1. Låt simuleringen och `80-level.js` läsa delens `level`.
- **P2: Täckning, fortsättning:** it5–it7 och resten av it4 behöver glosor per text; fr, fr4, fru, de4, de, de6 är inte behandlade. Verktyget missar oregelbundna former (starka particip, imperativ, passato remoto, ärvda bindeord) — förbättra lemmatiseringen i `tools/tackning.py`. Provtexter och berättelser saknar glosor och behöver förenklas.
