# Klart från backloggen

Punkter som har flyttats från [`BACKLOG.md`](BACKLOG.md) när de byggdes. **Referens** anger backloggens rubrik och prioritet. **Commit** anger var ändringen finns i git. **Publicerat** anger versionen av artefakten på https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP.

## 2026-10-02 (publicerat som version 37)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Öppet v36 · P2 *Fel i ord-id* (föräldern godkände 2026-10-01) | `languages/<kod>/ids.renamed` (`ord|gammalt|nytt`); build.py godkänner bytet i låset och lägger `renames` i datafilen; `applyRenames` i app.js flyttar elevens framsteg vid varje inläsning (lokalt och moln): `S.w`, `S.ga`, `S.dc`/`S.od`/`S.tr` (även Tatoeba-id), Mina ord, kapitelprov, sparade rundor, felrapporter; sammanslagning behåller det bästa. 22 id rättade: fr «prendre sa retraite», «ne manquer de rien», «sois-en sûr»; fr4 «nocif, -ive»; frs5 -ive/-euse (6); frs4 «le savoir-faire»; fr2 «le coucher du soleil» (sammanslaget); it4 «lo spazio personale», «il prestito linguistico»; it6 «spettabile», «la Repubblica di Salò», «I promessi sposi», «La dolce vita»; it7 «l'Illuminismo», «l'Umanesimo»; de7 «die Dritten», «das Erstsemester». | se git log |
| Öppet v36 · P2 *tools/tatoeba.py matchar för löst* | Partikel krävs för tyska delbara verb, versal för substantiv, homografer hoppas över, franska reflexiva verb kräver pronomen, substantiv/verb skiljs åt, italienska verb matchar bara verbändelser. `--check` och `--fix`; felkopplade meningar blir `null` på sin plats så att `<ord>#<n>` inte flyttas. 261 meningar borttagna. | se git log |

## 2026-10-01, del 3 (publicerat som version 36)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Färre övningar · P1 *Dagens pass som ett flöde* (beslut 2026-10-01: korta pass, flera per dag) | Pass på ca 5 min (ca 20 frågor) i ett flöde: förfallna och nya glosor (högst 10 + 5, inom ca 150 s) blandade med två av tre grupper (fraser/meningar, grammatik + der/die/das, verb/diktamen/ordföljd) som roterar (`PASS_GROUPS`, `passOrder`). "Pass N i dag – kör ett till", inget lås; loggposter får `dp: 1`. Avbrutet pass sparas i `S.runs["words|pass"]` och kan fortsättas. Efter varannat pass förslag på dagens text. Valfritt provdatum (`S.examDate`): sista sex veckorna hälften så många nya ord och en provuppgift efter passet, sista två veckorna inga nya ord. | se git log |
| Granskning (beslut 2026-10-01: AI-agenter granskar, inte människor) | 15 agenter granskade alla 21 kurser rad för rad mot språkens regler (genus, böjning, kasus, accenter, prepositioner, ordföljd, översättningar, sakuppgifter, upphovsrätt) och rättade i källfilerna utan att ändra id: ca 2 000 rättelser, flest felalternativ som också var korrekta (Hitta felet), sedan sakfel (t.ex. bokbålen 1933, Jugend musiziert, WHO-rekommendationen, CELI-gränsen 60 %), översättningar ("på fjärde våningen" → "fyra trappor upp"), uttalspar som var homofoner, upphovsrätt (Max Frisch, MLK, Calvino borttagna). Backloggens alla tveksamma fall avgjorda. | se git log |
| Granskningen · svarsalternativ | Facit stod oftast på plats 2 i texternas och provets flerval; `optOrder` blandar visningsordningen (inte vid två alternativ eller bokstavsetiketter). `ERR_SKIP` utökad med regler där felalternativ kan vara talspråkligt korrekta (it: cisi, cpa-fut, di-pass, trap-uso, ppi-*, fa-uso/ipotesi, cong-ind, cong-sup, se-parl; de: kr-rede, mf-tekamolo, mp-*, mv-val). | se git log |

## 2026-10-01, del 2 (publicerat som version 35)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Arkitektur · P3 *Död kod* | Borttaget: `dayStart`, `kindView` och vyerna `MC`, `TYPE`, `RESTORE`, `EFFECT`, `RECAP`, `AFTER`, `AGAIN`, `KIND_NAMES` (testerna använder `KINDS[...]`), `ktKey`, alltid sanna `typeof`-kontroller. `DAY` och `ktestd` är kvar (används; `ktestd` är en nyckel i sparat läge). Rubrikkommentarerna flyttade. | se git log |
| Arkitektur · P3 *Sparning vid varje svar* | `save(true)` från `snapRun` skriver localStorage efter 300 ms (`LOCAL_WAIT`, `flushLocal` vid dold/stängd sida, kursbyte och molnläge); `cloudSplit` serialiserar varje bit en gång och `REV_CACHE` återanvänder hashen; `pickSome` (delvis blandning) i flervalet; uppslagstabell i `listWord`. Ca 15 ms → 6 ms per fråga (Tyska 5, 2 200 ord). | se git log |
| Öppet v33 · P3 *Mina ord: grundform i ohämtade kurser* | build.py skriver `dist/data/lemma-<språk>.json` (alla ord i språket); `03-lemma.js` hämtar filen när en text öppnas (`ensureLemmaAll`), kursens egna ord vinner. **Publicera med 44 filer.** | se git log |
| Färre övningar · P3 *Äkta ljud* | `46-akta-ljud.js`: kortet "Veckans äkta ljud" på Tala och Hörförståelse, bara länkar: RFI Journal en français facile (fr, steg 4+), DW Langsam gesprochene Nachrichten (de, steg 5+), News in Slow Italian (it, steg 4+). | se git log |
| Franska · P2 *Franska 3: subj/si utan kapitel, depuis/il y a, venir de* + P3 *minigrammatikens områden* | Fältet `preview: "<kurs>"` på grammatikområden (etikett "Förhandsvisning – övas mer i Franska 4", sorteras sist); `subj`, `si` → frs4, nya `ger` → frs5. Sju nya områden i fr, 168 frågor: `tid` (depuis/il y a/pendant/dans/en), `proche` (venir de/en train de/aller + inf), `nombre` (tal, datum, klockan), `dem`, `quel`, `tout`, `ger`. Passiv hoppas över (finns i frs5). | se git log |
| Franska · P2 *Franska 6: steg 4–5-grammatik, passé simple, nominalisering, formell stil* | Kontrollerat: `dpron`, `prepinf` (frs4) och `accord` (frs5) finns; fr4:s äldre texter använder inte passé simple. Nya områden i fr4: `nomi` (25) och `style` (25). | se git log |
| Franska · P2 *Franska I: DALF C1-lika uppgifter* | Tre syntesuppgifter (`fru-pe-syn-1..3`, två texter + syntes ~220 ord, `sim:false`, C1). | se git log |
| Kurser · P2 *De nya kurserna: fyll på* + Öppet v33 · P3 *Täckning, rester* | Tyska 7: ord 784 → 1 000, 4 nya hörtexter, 11 hörtexter och 8 lästexter förlängda, täckning 99 %. Tyska 5: 7 ofta glosade ord blev kursord (wohl, Dame, spüren …); provtexterna de-le-2/10 ≥ 99 %. Franska 5: 7 texter höjda, 0 av 54 under gränsen; Franska 3:s provtexter fr-ce-3/4/5/9 och fr-co-6 96–99 %. Italienska: it3 och it5 texter förlängda till specen, it4 fick ca 280 glosor, it5–it7 1 050–1 070 ord, 48 saknade grundord i it1–it3. de1–de3 och frs5 hade redan rätt textlängd. | se git log |

## 2026-10-01 (publicerat som version 34)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till · elevens önskemål 2026-09-30 (*Tillbaka-knapp som alltid syns*) | Knappen "← Tillbaka" (`#topback`) ligger klistrig uppe till vänster på alla sidor utom startsidan och flikvyerna (syns när `#tabs` är dold). Den trycker på sidans egen knapp (`#quit`, `#back`, `#home`, `#kthome`), så ett pass pausas och sparas som vanligt. Test `SCENARIO_TOPBACK`. | se git log |

## 2026-09-30, del 2 (publicerat som version 33)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Övningar · P2 *Ny övning Tala* + Språkprov · P2 *Muntlig förberedelse* | `45-tala.js` (typ `talk`): 4/3/2 med timer (kortare på A1/A2), diktering via tangentbordet, ord per minut, Claudes nivåstyrda kommentar per runda, "Presentera dig själv och din musik" (kurser med `goal`), samtal med Claude på målspråket (6 repliker + kommentar), Skugga flyttad hit. `S.talk`, `S.fb["tt:…"/"tc:…"]`. | se git log |
| Övningar · P2 *Slå ihop Skriv en text och provets skrivuppgifter* | En bedömning (`writePrompt`, `fbStamp`, `renderWriteFb`) för båda, kriterier och poäng 0–5; skrivsidan visar kapitlets och provets uppgifter med filter; kortet "Veckans skrivuppgift" efter 7 dagar utan text (`S.wrSkip`). | se git log |
| Övningar · P2 *Ordning på nya ord* + *Bara skrivna svar gör "kan"* | Glosquizet flyttat till `05-words.js`; `pickNew` tar vanligaste först inom avsnittet (`freq` räknas av build.py ur kursens texter); avsnittet "Vanliga ord" (104 ord) i Franska 3; flerval räcker till steg 2 (`MC_MAX`), bara rätt skrivet svar ger "kan". | se git log |
| Repetition · P3 *Självbedömning i fyra steg* + *Mina ord: grundform* | Val "Bedöm själv hur svårt det var" (av som standard): Igen/Svårt/Bra/Lätt efter rätt skrivet svar, Enter = Bra. `03-lemma.js`: sparade ord får grundformen (fährt → fahren) när den finns i ordlistan eller verbtabellerna; ett ord som finns i ordlistan vinner alltid. | se git log |
| Repetition · P3 *Tidsbaserad repetition även i fraser, meningar och grammatik* + Arkitektur · P2 *Gemensamma hjälpfunktioner* | `srsBump`, `weakestFirst`, `srsDue` i 00-common.js; fraser, översätt, diktamen, ordföljd och grammatik repeteras efter 1, 3, 7, 20, 45, 90 dagar (förfallna → nya → resten); "N att repetera i dag" på knapparna. Nya fält `S.dc`, `S.od`. | se git log |
| Språkprov · *två nivåer, skala, nya uppgiftstyper* | Franska 3: simulering per nivå (DELF B1 / A2), nivåmätaren räknar varje del mot sin nivå; provets egen skala (DELF /25, TestDaF TDN, annars %); nya typer `chart` (grafik som SVG + text), `timed` (förberedelse- och taltid), `pick` (bildval med emoji). Italienska 1 fick CELI Impatto. | se git log |
| Arkitektur | Provet laddas vid behov (`<kod>-exam.json`, `ensureExam`), minifiering i bygget (`--no-minify`), index.html 470 → 364 kB; startsidan 3–5 gånger snabbare (en uträkning per rendering); `beginQuiz` börjar alltid rent; ett kapitelbegrepp (`chapterKey`, `chapters()`); `warnErr` i stället för tomma catch; namngivna konstanter; build.py läser lang.js med en tokenizer och kontrollerar innehållets fält per typ (`check_fields`); specfilerna samlade i `docs/spec/`. | se git log |
| Innehåll | Täckning ≥ 95 % hör / ≥ 97 % läs i nästan alla kurser (tools/tackning.py förbättrat för oregelbundna former); Tyska 5 +429 ord (B2-ordförråd); texter förlängda i de1–de3, frs4, frs5 (+16 lästexter); 67 modelltexter klarar sin checklista i alla kurser (nytt test); ca 7 500 Tatoeba-meningar för tyska och fler för franska/italienska (`tools/tatoeba.py`); studieplaner för fr, frs4, frs5, fr4, de4, de6 (`tools/plan.py`), Tillbaka leder till planen; musikteori i Tyska 4 (179 termer, 59 uppgifter) och 58 nya i Tyska 5; språkmedveten kapitelordskontroll (`usesWord`). | se git log |
| Granskning | Nya kurser (fr1, fr2, frs4, frs5, de1–de3, it3–it7, de7): ca 160 tvetydiga grammatikfrågor rättade, sakfel (Loreley, reklamförbud 2018, Québec, McDonald's i Rom, Deledda 1926/1927, Casals svit nr 2, Orfeo, Inferno 34 sånger), tyska våningar, citat kontrollerade. Franska musiktermer kontrollerade (6 rättelser). | se git log |

Testerna har 1 941 kontroller.

## 2026-09-30 (publicerat som version 32)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till från eleven (2026-09-30) *Flamma för sviten* | En flamma uppe till höger i sidhuvudet med antal dagar i rad (samma räkning som statistiken, per kurs). Urblekt tills dagens första pass är gjort, tänds direkt när passet sparas (`renderStreak` anropas från `save` och `renderStart`), dold utan svit. Test `SCENARIO_STREAK`. | se git log |

Testerna har 1 499 kontroller.

## 2026-09-29, del 4 (publicerat som version 31)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Arkitektur (granskning 2026-09-29) · P1 *Oescapad text från datafilerna i HTML* | `safeHtml` (vitlista b, i, em, strong, br, sup, sub, span med class) för ursprung och ordagrant, `esc` för all annan data (avsnitts-id, verbspelens id, Tatoeba-id, flikar, genus, accentknappar). `d.answer` är ren text i alla typer och escapas på ett ställe i quizmotorn (`answerHtml`; IPA använder `d.answerHtml`). Test `SCENARIO_ESC` med `<script>`, `<img onerror>` och `a < b` i ett ord. | se git log |
| Arkitektur · P2 *index.html är 456 kB* | Verbtabellerna (`sv`, `tenses`, `notes`) flyttade från lang.js till `languages/<kod>/verbs.json` och kursens datafil (`verbTables`), med arvet ihopslaget av build.py; index.html 456 → 389 kB (med dagens övriga kod). Byggkontroller för tabeller i lang.js och okända fält i verbs.json. | se git log |
| Språkprov · P2 *Nya provuppgiftstyper* | Para ihop (`match`), lucktext med flerval per lucka/Sprachbausteine (`gaps`, även med ordbank) och kortsvar (`short`, tål accenter/versaler/ß) i 70-exam.js, med simulering och nivåmätare; `sim: false` för extrauppgifter; byggkontroll `check_exam_task`. Exempel i fr2, it4, it7 och de7. | se git log |
| Språkprov · P2 *Spara en pågående provsimulering* | `S.exam.simRun` sparas vid start, svar, inlämning och varje minut; kortet "Fortsätt provsimuleringen" på startsidan; klockan står still när appen är stängd. | se git log |
| Nivåresearch · *täckning* | `tools/tackning.py` (och `build.py --tackning`) mäter andelen kända ord per text och kurs (kedjan bakåt, glosor, enkel lemmatisering) → `docs/tackning.md`. Täckningen höjd i fr1, fr2, frs4, frs5, de1–de3 (de3 läs 91 → 99 %), it1, it3, it4 med ca 330 nya grundord (encore, déjà, mehr, nur, sofort, obwohl, qui, quasi, subito …) och ca 460 nya glosor; några provtexter förenklade. | se git log |
| Tyska · *grammatikluckor* | Tyska 4: futur I, präteritum, zu-infinitiv/um … zu, verb med preposition, genitiv (111 frågor). Tyska 5: futur I/II (23). Tyska 6: futur I/II med antagande, tillståndspassiv (45). `secs` på alla områden i de4 och de. | se git log |
| Tyska 7 · *påfyllning* | Lästexter 8 → 16 (bl.a. E. T. A. Hoffmann och Stefan Zweig), skrivuppgifter 8 → 24, kultur och berättelser 4 → 8, hörtexter 8 → 12, ord 700 → 784. | se git log |
| Franska 3 och Italienska 2 | Franska 3: 13 DELF A2-uppgifter som mellansteg i egna delar (nivå A2). Italienska 2: områdena piacere i dåtid, betonade pronomen, indefinita pronomen, pronomenets plats (80 frågor), ett CELI Impatto-prov (A1) och en fjärde fråga i alla lästexter. | se git log |

Testerna har 1 492 kontroller (testet för mörkt läge sätter nu ljust läge uttryckligen, så det inte beror på datorns inställning).

## 2026-09-29, del 3 (publicerat som version 30)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P2 *Alla tre språken från steg 1 till steg 7* | 13 nya kurser, så att franska, tyska och italienska täcker steg 1–7: **Franska 1** (fr1, 533 ord, DELF A1), **Franska 2** (fr2, 517, DELF A1), **Franska 4** (frs4, 839, DELF A2), **Franska 5** (frs5, 1 008, DELF B1), **Tyska 1** (de1, 584, Goethe A1), **Tyska 2** (de2, 519, Goethe A1), **Tyska 3** (de3, 701, Goethe A2), **Tyska 7** (de7, 700, Goethe C1/TestDaF), **Italienska 3–7** (it3 757, it4 807 CELI 1, it5 955 CELI 2, it6 911 CELI 2, it7 984 CELI 3). Varje kurs har kapitel, grammatik med regelsidor, hör- och lästexter, berättelser, kultur, skrivuppgifter, fraser, mål, uttal och videor. Kedjor: fr1→fr2→fr→frs4→frs5→fr4→fru, de1→de2→de3→de4→de→de6→de7, it1→…→it7. | se git log |
| Föräldern: *rätt nivå på franskan* | Kursen som hette Franska 4 (fr4) låg på steg 6 och heter nu **Franska 6** (kod och sparnyckel oförändrade), med nya områden conditionnel passé, subjonctif passé och passé simple (igenkänning). **Franska I** visas som "motsvarar steg 7 · B2" och fick områdena nominalisering/stilnivå och medgivande. | se git log |
| Kursväljaren | Grupperad per språk och sorterad efter `step` ("Franska 3 · steg 3 · A2 · mål DELF B1"), kommande kurser i stegordning, `nextCourse` kan vara en lista (två vägar vidare), byggkontroller för `step`/`level`/upcoming, arv i kedja, testet `test_minimal_course`. | se git log |
| Nivåresearch | `docs/nivaer.md` (Skolverket Gy11/Gy25, GERS, forskning om ordförråd, täckning och studietid), `docs/nivaer-franska.md`, `nivaer-tyska.md`, `nivaer-italienska.md` (krav per nivå, provformat, granskning av befintliga kurser). | se git log |
| Videor | 6 videor per kapitel i alla befintliga kurser (fr, fr4, fru, de4, de, de6, it1, it2; 222 nya) och videoförråd per språk och nivå A1–B2 (`docs/videopool-*.json`, ca 470 videor), alla kontrollerade med oEmbed. Nya kurser har 16–38 videor var. | se git log |
| Provbedömning | Claudes bedömning av skriv- och provuppgifter följer uppgiftens/kursens nivå A1–C1 (`LEVEL_GUIDE`, `examLevel`, `studentDesc`); målet musikstudier nämns bara när kursen har `goal`. | se git log |

Testerna har 1 357 kontroller.

## 2026-09-29, del 2 (publicerat som version 29)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Språkprov · P2 *Provsimuleringen som hela provet* | Simuleringen tar en uppgift per övning/Teil (DELF 7 uppgifter, Goethe B2 11, Goethe B1 12) med provets tider per del (klockan fortsätter mellan övningarna i samma del). Resultat per del med en rad per övning och minuter; knapp för hela provet och en per del. `simTeile`, `simPlan`, `simPartRes`, `simNextLabel` i 70-exam.js; `S.exam.sims[]` får valfria `tasks` och `min`. Textlängder rättade (fr-co-1–3, fru-co-1–4, fru-ce-1–4, fr-ce-1, fr4-co-1–3, fr4-ce-1), fr4-co-4 är en telefondialog, Venedig och valdeltagande uppdaterade, alla citat i förklaringarna automatkontrollerade. | se git log |
| Tyska 5 · P2 *Studieplan för självstudier* | 20 veckor i `languages/de/plan.json` (kapitel 1–8 två veckor var, övriga ordlistor utspridda, grammatik i ordning, texter och en provuppgift per vecka, repetition och helt prov på slutet). Täcker alla 1 695 ord utom musikteorin, alla 14 grammatikområden och alla 43 provuppgifter. Kort på startsidan och egen sida (`82-plan.js`) med startdatum eller vald vecka, framsteg per vecka och direktlänkar. Nytt fält `S.plan`. Generellt: en kurs får en plan genom en `plan.json`. `check_plan` i build.py. | se git log |
| Buggar | Enter under självbedömningen (Översätt meningar) hoppade över frågan; Avbryt i Ordföljd och Skugga kastade rundan; molnet kunde fastna när en bit hade annan rev än huvuddokumentet (lagas nu efter tre försök genom sammanslagning per ord och omskrivning av alla bitar, `cloudSalvage`); tid i gamla `{state,t}`-dokument (`docT`); tomma rundor visar ett meddelande i stället för "0/0 klar"; Lyssna först reagerar på mellanslag och Enter; der/die/das tar med nya Mina ord utan omladdning. | se git log |
| Arkitektur | Nya byggkontroller: grammatikfrågornas `topic`/`rule` mot grammar.json, `inherit`-fält och `nextCourse`, bokfilernas typ, storleksvarningar, bygget går utan bokmappen. Ny prioriterad lista i BACKLOG.md. | se git log |
| Granskning av språket | Tyska 4/5/6: ca 50 rättelser (felalternativ som också var rätt, sakfel som arians längd och Jugend musiziert-poängen, översättningar), inget facit eller genus var fel. Franska 4 och Franska I: ca 40 rättelser (sakfel om Code civil, Vél d'Hiv, Simenon, Hernani, tvetydiga grammatikfrågor, svenska termer, heterodiegetisk ≠ allvetande). Italienska: stickprov 10 %, inga fel. | se git log |

Testerna har 734 kontroller.

## 2026-09-29 (publicerat som version 28)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Språkprov · P2 *Kontrollera provformaten* | Formatet jämfört med provgivarnas officiella material (Goethe B2 Modellsatz 2025 och Durchführungsbestimmungen, B1 Modellsatz; France Éducation international: sujets démo och "Évolution des épreuves" 2024) och rättat. Goethe B2: Hören Teil 1 hörs en gång, Teil 2 och 4 två gånger, Teil 3 har 6 frågor, Lesen Teil 4 med rubrikerna som frågor, Teil 5 med § 1 som exempel, tider, "circa" i stället för "minst" (nytt fält `approxWords`), provets bedömningskriterier. DELF: inga Vrai/Faux i hörförståelsen, läsning Exercice 1 med 16 Oui/Non, tre läsövningar, B2 Exercice 3 (vem tycker vad) tillagd, uppspelningar. Allt dokumenterat med källor i `docs/provformat.md`. | se git log |
| Språkprov · P2 *Fler provuppgifter* | Tyska 5: 16 → 43, Tyska 6: 15 → 43, Tyska 4 (Goethe B1): 15 → 51, Franska 3, Franska 4 och Franska I: 14–15 → 26 var. Minst 3 uppgifter per del i läsa och höra och 4 i skriva och tala. | se git log |
| Språkprov · P2 *Nivåmätare* | Panelen "Var ligger jag?" i statistiken: en uppskattning på skalan A2–B1–B2 med osäkerhetsband, byggd av ordförråd (ord som eleven kan i alla kurser i samma språk, mot riktvärden efter Milton & Alexiou 2009), grammatik (senaste svaren per område) och prov (senaste resultaten per del och Claudes nivåbedömningar av texter). Visar "för lite data" och vad som drar ner mest. Räknas ur befintliga data, inget nytt sparas. | se git log |
| Kurser · *granskning och videor* | 78 videor (3 per kapitel) i Franska 4, Tyska 6 och Franska I, alla kontrollerade med oEmbed. Franska I:s 148 transkriptioner och 148 satsanalyser granskade mot Wiktionnaire, Grevisse och Riegel: inget facit var fel, 17 tvetydiga felalternativ eller förklaringar rättade. | se git log |

Testerna har 617 kontroller.

## 2026-09-28, del 7 (publicerat som version 27)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *Franska 1 på universitetsnivå* | Ny kurs `fru`, **Franska I (universitet, 1–30 hp)**, byggd efter kursplanerna vid SU, UU, LU, GU, LNU och UmU (underlag i `docs/franska-universitet.md`). 1 245 ord: åtta kapitel (geografi och regioner, historia 1789–1968, institutioner och politik, dagens samhälle, frankofonin, roman och novell, poesi/teater/chanson, medier/film/serier/språket) och tre avsnitt med grammatisk terminologi på franska (109), fonetisk terminologi med IPA (68) och akademiska fraser (69). Inga ord från Franska 3, Escalade eller Franska 4. 12 grammatikområden (360 frågor, bl.a. passé simple, participets kongruens, tempusföljd, satsfunktioner, inversion) med regelsidor, 16 hörtexter, 16 lästexter, 8 berättelser i passé simple, 10 kulturtexter, 24 skrivuppgifter (résumé, textkommentar, formellt mejl), 45 fraser, kapitelmål, uttal, 14 DELF B2-uppgifter och 3 verbspel (passé simple är tillagt i franskans verbdata). Egen sparnyckel `glosor-fru-v1`. Franska 3 föreslår Franska 4, och Franska 4 föreslår Franska I. | se git log |
| Franska I: nya övningstyper | **Transkription** (148 uppgifter): ord → IPA, IPA → ord och att skriva IPA med en knapprad; rättningen tål mellanslag, syllabering och länkning. **Satsanalys** (148 uppgifter): välj satsdelens funktion (sujet, COD, COI, attribut …) eller satsens typ (relative, complétive, circonstancielle …). Knapparna visas bara i kurser som har innehållet. | se git log |

Testerna har 600 kontroller.

## 2026-09-28, del 6 (publicerat som version 26)

Arkitekturpunkterna från granskningen 2026-09-28 (BACKLOG, *Arkitektur (granskning 2026-09-28)*).

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Arkitektur · P2 *Id-lås i build.py* | `build.py` skriver och kontrollerar `languages/<kod>/ids.lock` (incheckad, en sorterad lista per typ: ord, avsnitt, varje innehållstyp inklusive grammatik, provuppgifter, grammatikområden och regler, samt `storageKey`). Bygget stoppar om ett låst id försvinner, om `storageKey` ändras eller om två kurser har samma `storageKey`. Nya id läggs till automatiskt. En borttagning godkänns med `python3 build.py --allow-removed <kod>:<typ>\|<id>` eller en rad i `ids.removed`. Bokens id låses i `book/ids.lock` (privata repot). | se git log |
| Arkitektur · P2 *Arv mellan kurser* | `extends: "<kod>"` och `inherit: [fält]` i `lang.js` i stället för getters (de4, de6 från de, fr4 från fr, it2 från it1). Sammanslagningen görs en gång vid start (`inheritCourses` i app.js, eftersom lang.js har regex och funktioner): djup sammanslagning där kursens egna fält vinner, `{$append: [...]}` och `{$remove: [...]}` för uttryckliga ändringar (fr4:s extra bindeord, de4:s verb utan Konjunktiv I). Ordningen mellan kurserna spelar inte längre någon roll. Resultatet är identiskt med förut (testat per kurs). | se git log |
| Arkitektur · P2 *Grammatikens områden och regler i datafilen* | `topics`, `rules` (och tyskans `adj`) ligger i `languages/<kod>/grammar.json` och följer med `dist/data/<kod>.json` i stället för index.html (index.html 330 → cirka 310 kB). | se git log |
| Arkitektur · P3 *`DATA_VERSION` per kurs* | `DATA_VERSION` är `{<kod>: hash}` och varje datafil hämtas med sitt eget hash, så en ändring i en kurs tvingar inte fram nya hämtningar av de andra. | se git log |
| Arkitektur · P3 *Schemaversion och migreringar* | `S.v` och `MIGRATIONS` i `normState` (index = version, `migrateRetired` är migrering 1). Lägen utan `S.v` migreras. Alla fält i `S` är dokumenterade i app.js och i `docs/ARKITEKTUR.md`. | se git log |
| Arkitektur · P3 *Minne* | Högst tre hämtade kurser (`KEEP_COURSES`). Den som varit oanvänd längst släpps (ord, innehåll, grammatik, uträknade listor) och hämtas igen vid behov. Framstegen påverkas inte. | se git log |
| Sparande | Molnbitar som inte längre används (`~log1` när loggen krympt, `~w5` när orden får plats i färre bitar) raderas efter en lyckad sparning, bara om huvuddokumentet fortfarande är vårt (`cloudPrune`). | se git log |
| Arkitektur · P2 *Ett register per övningstyp* | `defineKind(namn, {name, mc, type, restore, effect, recap, after, again, open, log})` fyller i registret `KINDS` (app.js). Quizmotorn, slutskärmen, "En runda till", menyn och statistiken slår upp i registret; `MC`, `TYPE`, `RESTORE`, `EFFECT`, `RECAP`, `AFTER`, `AGAIN` och `KIND_NAMES` finns kvar som vyer (bara läsning). Fel i en registrering hamnar i `KIND_ERRORS` i stället för att stoppa appen. `exercises.js`, `grammar.js` och `exam.js` är uppdelade i `src/kinds/00-common.js` … `99-menu.js` (en fil per typ eller grupp), som build.py läser i namnordning. Fråge-id, `S.run`/`S.runs`-nycklar, loggposter och sparat läge är oförändrade (testat). | se git log |
| Arkitektur · P3 *Fältet `.fr`* | Datafilerna behåller fältnamnet. Koden läser målspråkets text bara via `tl(x)` och skapar rader med `tlLine(text)` (`src/kinds/00-common.js`, med en kommentar om varför fältet heter `fr`). | se git log |
| Arkitektur · P3 *Tester* | Nytt block `SCENARIO_KINDS` i `tests/run_tests.py`: registret (varje typ har namn, frågor eller `open`, `restore`, `recap`/`after`), fråge-id och `S.runs`-nycklar som förut, `tl`, synk mellan två enheter (eget `S`, egen localStorage och egna kända bitar mot samma låtsaslagring: ny enhet, ta emot, den som kommit längst vinner, ingen överskrivning), och **alla kurser** i en loop över `Object.keys(LANGUAGES)`: glosquiz, blandad runda, verb och varje övning i menyn (meningar, diktamen, översätt, ordföljd, kapitelprov, der/die/das, hörtext, lästext, kultur, grammatik, berättelse, provträning, teoriprov, fraser, uttal, skugga, skriva), med rätt svar på första försöket och inga JavaScript-fel. Fasta väntetider (1 500, 600, 50 ms …) är ersatta med `until(villkor)` / `appReady()` (i `SEED`) där det finns något att vänta på. | se git log |
| Rättning (granskning) | Komma i facit: "moniteur, monitrice de ski" godkänner "moniteur de ski" och "monitrice de ski". Regel i `variants`: två delar godkänns var för sig om orden som står mot varandra är former av samma ord (`sameForm`: minst halva det kortare ordet lika från början); har första delen färre ord hör resten av andra delen till båda. En fras med komma ("ich habe dieses Thema gewählt, weil", "ce qui me plaît, c'est") delas aldrig, och "Madame, Monsieur" godkänner inte längre bara "Monsieur". Testet går igenom alla 240 ord med komma i alla kurser och kontrollerar att inget facit blir ett enstaka bindeord eller en bit av en fras. | se git log |

## 2026-09-28, del 5 (publicerat som version 25)

Önskemål från föräldern: *gå igenom och hitta buggar, kolla arkitekturen*. Tre granskningar (sparande och rättning, övningarna, arkitekturen) och rättelser. Testerna har 291 kontroller.

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Sparande | Molnkopian delas upp i flera dokument (`<storageKey>`, `~w0…`, `~log`), eftersom ett dokument får vara högst 256 KiB och en elev med alla ord i Tyska 5 annars skulle slå i taket (synken slutade då tyst). Gamla dokument läses som förut. Bara ändrade delar skrivs. En tydlig varning visas om något ändå inte går att spara. | se git log |
| Sparande | Den som kommit längst vinner även när loggen är full (ny räknare `nLog`), vid lika vinner den senaste. Ett läge från en annan enhet tas inte emot mitt i ett pass. Sparningar köas per kurs, och appen ansluter igen efter nätverksfel. Sen kursfil byter inte kurs mitt i ett pass. Topplistans uppdateringar tappas inte vid kursbyte. | se git log |
| Rättning | Verbträningen godkänner "ils sont", "ont", "sieht", "wird" m.fl. (pronomen kräver mellanslag). Facit med komma delas bara när det är två former av samma ord. "ss" godkänns för "ß". Typografisk apostrof (’ från iPad) godkänns i grammatiken och i skrivchecklistan. Italienska artiklar tas bara bort när de står som eget ord. | se git log |
| Övningar | Ett avbrutet glospass går att fortsätta efter en annan övning. Pass som återupptas efter att innehållet ändrats kraschar inte. Dagens pass syns efter "Avbryt". Hitta felet visar inga ihopklistrade ord och har alltid minst tre alternativ. Skrivuppgifter loggas en gång per text. Provsimuleringen visar aldrig "null %". Hörprov med ljudet av slår på ljudet. Bindeord räknas inte dubbelt ("même si" ≠ "si"). Repetitionsdatum räknas i kalenderdagar (sommartid). | se git log |
| Säkerhet | Topplistan tvingar fram tal och escapar allt från databasen (XSS). Tyck till och felrapporter ligger under `feedback/<uid>/msgs` och `reports/<uid>/items` och kan bara läsas av eleven själv och föräldern (nya åtkomstregler). De 6 befintliga meddelandena och 1 rapporten är flyttade. | se git log |
| build.py | Stoppar vid facit utanför alternativen, okänt kapitel, glosor som inte finns i texten och dubblettord i words.txt. | se git log |

## 2026-09-28, del 4 (publicerat som version 24)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Färre men mer värdefulla övningar · *Ordning på nya ord* (delvis), förälderns beslut: "eleven ska välja musikteorin som område" | Musikteorins avsnitt (mt1–mt7) i Franska 3 och Tyska 5 är valfria (`elective` i `lang.js`). "Nästa ord i ordlistan" och Dagens pass tar inga nya ord därifrån. I "Nya ord från" ligger de i en egen grupp, "Musikteori · bara när du väljer det", och i kapitelkartan visas de sist och räknas inte in i "x av y kapitel klara" eller i förslaget att gå vidare till nästa kurs. Ord som redan är påbörjade repeteras som vanligt, och teoriprovet finns kvar. | se git log |

## 2026-09-28, del 3 (publicerat som version 23)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P2 *Alla tre språken från steg 1 till steg 7*: **Franska 4** | Ny kurs `fr4` (steg 6, B1, DELF B1), utan lärobok, efter kursmallen: 1 045 ord i 8 kapitel (Études et avenir, Médias, Environnement, Arts et musique, Vivre ailleurs, Histoire et mémoire, Santé et sport, Éthique et francophonie) och 69 fraser för att argumentera, utan ord från Franska 3 eller Escalade. 9 grammatikområden med 268 frågor och regelsidor (subjonctif, si-satser, futur antérieur, lequel/auquel/duquel, indirekt tal, mise en relief, gérondif, passiv, bindeord), 16 hörtexter, 16 lästexter, 8 berättelser, 10 kulturtexter, 24 skrivuppgifter, 45 samtalsfraser, kapitelmål, uttal, 3 verbspel och 15 DELF B1-uppgifter. Egen sparnyckel `glosor-fr4-v1`. | se nedan |
| Kurser · P2 *Alla tre språken från steg 1 till steg 7*: **Tyska 6** | Ny kurs `de6` (steg 6, B1 → B2, Goethe B2), med samma delar: 1 109 ord (Studium und Bewerbung, Wissenschaft, Politik und Geschichte, Literatur und Epochen, Arbeit, Musik und Bühne, Ethik, Stadt/Land/Migration) och 70 Redemittel, utan ord från Tyska 4 och 5. 10 grammatikområden med 309 frågor (Konjunktiv I och indirekt tal, Konjunktiv II i dåtid, passivomskrivningar, particip som attribut, nominalstil, Nomen-Verb-Verbindungen, genitivprepositioner, modalpartiklar, subjektiva modalverb, textbindning), 16 hörtexter, 14 lästexter, 8 berättelser, 9 kulturtexter, 24 skrivuppgifter (8 i Goethe B2-format), 45 fraser, kapitelmål, uttal, 3 verbspel och 15 Goethe B2-uppgifter. Tyska 5 föreslår Tyska 6 när den är klar. Egen sparnyckel `glosor-de6-v1`. | se nedan |
| Önskemål från föräldern: *granska övningarna* | En genomgång av alla cirka 20 övningar mot forskningen om inlärning. Förslagen står i BACKLOG.md under "Färre men mer värdefulla övningar" och väntar på förälderns svar. | se git log |

Italienska 3 står nu som kommande kurs. "Hitta felet" hoppar över tempusbyten i franskt indirekt tal, eftersom de går att försvara i talspråk. Testerna har 185 kontroller.

## 2026-09-28, del 2 (publicerat som version 22)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *statistik per dag* | Statistiken har en ny panel, "Dag för dag": minuter, frågor, rätt och nya ord i dag, dagar i rad, ett stapeldiagram över minuter per dag de senaste 28 dagarna (med detaljer vid hovring) och en tabell. | `0c239ea` |
| Önskemål från föräldern: *hur långt man kommit i kapitlen* | Rullistorna "Nya ord från" och "Vi läser nu" visar hur långt man har kommit i varje kapitel (▰▰▱▱▱ 40 %, ord kvar, ✓ klart). Under listan finns "Hur långt har jag kommit?", en kapitelkarta med en stapel per kapitel (kan, på väg, kvar). Kapitlet man läser är markerat, och man väljer ett kapitel genom att trycka på det. | `0c239ea` |
| Önskemål från föräldern: *musikteori till det skriftliga teoriprovet* (Språkprov · P1) | Sju nya avsnitt (mt1–mt7) med musikteori på målspråket: 396 ord i franskan och 392 i Tyska 5. Orden bygger på riktiga antagningsprov (CNSMD Paris och Lyon; HfM Weimar, Karlsruhe, Folkwang och UdK Berlin) och omfattar noter, rytm, intervall, skalor, ackord, harmonik, form, föredragsbeteckningar och provinstruktioner. Ny övning, "Teoriprovet": 100 uppgifter per språk i provets form ("Bestimmen Sie das Intervall e–b", "Quelle est la sensible en ré mineur ?"). | `002027c` |
| Kurser · kursmallen paket 18 | Tyska 5: genitiv och n-deklination, particip som adjektiv och tvådelade bindeord, sammanlagt 80 frågor med regelsidor. | `002027c` |
| Kurser · kursmallen paket 12 och 19 | Tyska 4: 7 nya hörtexter (telefonsamtal, utrop, radioinslag, intervju), 160 nya ord (711 totalt) och provträning för Goethe-Zertifikat B1 (15 uppgifter i provets format). | `002027c` |
| Kurser · kursmallen paket 11 | Litteratur i alla kurser (16 inslag). Fria dikter och sagor återges i sin helhet, bland andra Apollinaire, La Fontaine, Verlaine, Goethe, Rilke, Kafka, Busch, Grimm och Collodi, och är kontrollerade mot Wikisource. Nutida sånger blir skrivuppgifter utan sångtext. | `002027c` |

## 2026-09-28 (publicerat som version 21)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Rapport från eleven i tyska: *luckan med Beziehung* | I luckövningen räknas svaret som rätt även när eleven skriver artikeln en gång till ("die Beziehung" när artikeln redan står före luckan). | `df9a802` |
| Kurser · P2 *Grammatikområden från bokens minigrammatik* (första delen) | Sju nya områden i franskan, med regelsidor som hänvisar till bokens sidor: futur (35 frågor), conditionnel (25), imparfait eller passé composé (40), plus-que-parfait och venir de (25), betonade pronomen (25), imperativ (25) och reflexiva verb (20). Franskan har nu 20 områden och 907 grammatikfrågor. Tempusfrågor där felet kan försvaras i talspråk visas inte i "Hitta felet". | `df9a802` |
| Kurser · P1 *Franska 3 som mall* | `docs/kursmall.md`: hur ett kapitel i Escalade är uppbyggt (utan bokens text), en checklista för kurser, nivåer steg 1–7 enligt Skolverket och en jämförelse per kurs. Utfyllt enligt mallen: Tyska 4 (17 skrivuppgifter, 2 lästexter, 2 berättelser, 1 kulturtext), Tyska 5 (15 skrivuppgifter i Goethe B2-format, 3 kulturtexter, 4 hörtexter som inte är dialoger, 4 lästexter av nya typer), Italienska 1 (3 lästexter, 4 berättelser, 3 kulturtexter, 10 skrivuppgifter, grammatik för subjektspronomen och questo/quello) och Italienska 2 (2 lästexter, 3 berättelser, 4 kulturtexter, 11 skrivuppgifter). | `df9a802` |
| Kursmallen · *kapitelmål* | Ny innehållstyp `mal.json`: 3–5 mål per kapitel ("Jag kan …") i alla fem kurser, sammanlagt 220 mål. De visas på startsidan för kapitlet man är på och kan bockas av (`S.mal`). | `df9a802` |
| Kursmallen · *uttal* | Ny övning "Uttal: lyssna och välj" (`uttal.json`): ord som låter nästan lika, 33 set i fem kurser. Ett ord läses upp och man väljer vilket det var. | `df9a802` |
| Kursmallen · *nivåer* | Nivåerna följer Skolverkets ungefärliga GERS-nivåer: Franska 3 A2 (provmålet B1 står kvar), Tyska 4 A2 → B1, Italienska 2 A1 → A2, Franska 4 A2 → B1, Tyska 6 B1 → B2. | `df9a802` |

## 2026-09-27, del 12 (publicerat som version 20)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till (eleven i franska): *tangentbordet* | Mellanslag eller Enter går till nästa ord när man lär sig nya ord, ← går tillbaka. Siffrorna väljer svar i flerval och Fel/Nästan/Rätt vid självbedömning. Enter går alltid vidare efter ett svar. En rad om tangentbordet visas på datorer. | `0310185` |
| Tyck till (eleven i franska): *repetition i dagar* (ersätter P2 *FSRS*, som nu är P3) | Nytt schema: nästa pass, efter 3 pass, sedan efter 3, 7 och 20 dagar, och ord man kan efter 45 och 90 dagar (`x.dd`). Ord i det gamla schemat går över när de repeteras nästa gång. Prognosen i statistiken visar dagar. | `0310185` |
| Tyck till (eleven i franska): *kapitelprov* | Fler övningar → Kapitelprov: alla glosor i ett kapitel (alla avsnitt k3, k3b, k3x …) en gång, skriva eller flerval, utan omtag. Resultatet sparas i `S.kt` och påverkar inte schemat. Efteråt kan man öva på de missade orden (med omtag) eller göra om provet. | `0310185` |
| Tyck till (eleven i franska): *ursprung på svenska och ordagranna fraser* (Ord · P1) | Alla främmande ord i ursprungsfältet har fått svensk betydelse (ca 1 100 tillägg i alla kurser). Nytt sjunde fält i words.txt, "Ordagrant", för 535 fraser och talesätt (ordet för ordet med svensk betydelse), som visas på lärokortet och när man svarar fel. | `0310185` (och bokrepot) |
| Kurser · P1 *Escalade*: fler sidor | s. 26–37 (kap 2), s. 114–127 (kap 8, "Voyager dans le monde"), s. 148–153 (antaget kap 10) och s. 182–191 (kap 12). Franska 3 har nu 976 ord, 29 lästexter, 88 skrivuppgifter och 310 av bokens övningar. "Chanson simple" och "Être aimé" är skrivuppgifter, inte avskrivna. | `0310185` (och bokrepot) |
| Kurser · *bokens minigrammatik* | s. 194–199 och 202–237 fotade och sammanfattade (privat). Reglerna i `fr/content/regler.json` hänvisar till bokens sidor, använder bokens termer och har rättats på några punkter (mon/ma framför adjektiv, kongruens i reflexiva verb, betonade tips som inte syntes). Saknade grammatikområden ligger i backloggen. | `0310185` |

## 2026-09-27, del 11 (publicerat som version 19)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P1 *Escalade*: fler kapitel (foton från föräldern) | 21 nya uppslag inlagda i den privata bokmappen: kap 1 (s. 8–21), kap 2 (s. 22–25, 38–39), kap 5 (s. 68–69), kap 6 (s. 98–99), kap 7 (s. 100–113) och kap 8 (s. 128–131; kapitelnumret är antaget). Franska 3 har nu 687 ord, 22 lästexter, 58 skrivuppgifter och 173 av bokens övningar. Sångtexter, dikter och längre romanutdrag skrivs inte av (upphovsrätt). De blir skrivuppgifter med bokens frågor och en uppmaning att lyssna på sången eller läsa i boken, och sångtexten i kap 4 är ersatt på samma sätt. Grammatikområdena är kopplade till kapitlen, och Bokens övningar visar bara övningarna i kapitlet eleven läser (fältet `kap` kommer från mappen). | `a878194` (och det privata bokrepot) |

## 2026-09-27, del 10 (publicerat som version 18)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *arkitektgenomgång, data separat* (ersätter Kurser · P2 *Säkerhetskopiera book/* delvis) | Kursernas data ligger nu i egna filer, `data/<kod>.json`, som publiceras bredvid sidan och hämtas först när kursen väljs. Sidan har krympt från 2,8 MB till 270 kB plus den kurs man använder. Bokmaterialet ligger i en mapp per kapitel (`book/kapNN/` med foton, glosor och övningar) och har en sidförteckning, `book/sidor.json`. Bokmappen är ett eget lokalt git-repo. Bygget kontrollerar att id:n är unika inom varje innehållstyp. Testerna kör också den publicerade sidan via en lokal webbserver. Översikten finns i `docs/ARKITEKTUR.md`. | `4ff611c` |

## 2026-09-27, del 9 (publicerat som version 17)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *Italienska 1 och 2* | Två nya kurser, `languages/it1/` (A1, Moderna språk 1 / nybörjare nivå 1) och `languages/it2/` (A2, Moderna språk 2 / grund nivå 1), med egna sparnycklar `glosor-it1-v1` och `glosor-it2-v1`. Underlaget i `docs/italienska-plan.md` bygger på Skolverkets kursplaner, teman och progression i svenska läromedel (Ciao, Prego, Adesso sì, Comunicare, Allora, Digilär) och italienska nivåbeskrivningar. Italienska 1: 536 ord i 8 kapitel och fraser, 242 grammatikfrågor i 12 områden och verbspel i presens. Italienska 2: 531 nya ord, 285 grammatikfrågor i 14 områden och verbspel i passato prossimo, imperfetto, futuro och condizionale. Båda har hörtexter, lästexter, kultur, berättelser, fraser, skrivuppgifter och videor. Artikeln behövs inte i svaret. | `be8241e` |
| Önskemål från föräldern: *grammatikregler före övningarna* | Varje grammatikområde har en regelsida (`content/regler.json`, format i `docs/REGLER-SPEC.md`) med förklaring, tabeller, exempel och tips. Den visas när man väljer området och går att öppna efter varje svar. Finns för alla kurser. | `be8241e` |
| Önskemål från föräldern: *Dagens pass försvinner när det är gjort* | Rutan Dagens pass visas inte när dagens pass är gjort. Den kommer tillbaka nästa dag. | `be8241e` |
| Önskemål från föräldern: *kontrollfrågor i Tyck till* | Om ett meddelande är otydligt ställer Claude 1–3 ja/nej-frågor innan det skickas. Svaren sparas med meddelandet (`qa`). Tydliga meddelanden skickas direkt. | `be8241e` |
| Önskemål från föräldern: *fortsätta eller börja om* | Varje övning sparar sin påbörjade runda (`S.runs`). Den som avbryter och sedan öppnar övningen igen får välja "Fortsätt där du slutade" eller "Börja om från början". | `be8241e` |
| Tyck till: önskemål från eleven i Franska 3, *ljud av/på* | Knappen "Ljud på / Ljud av" i sidhuvudet syns på alla sidor och stänger av all uppläsning. Valet sparas i webbläsaren. | `be8241e` |

## 2026-09-27, del 8 (publicerat som version 16)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till · P1 *Tydligare gruppering av övningarna* (önskemål från eleven i Franska 3) | "Fler övningar" på startsidan visar fem knappar: Ord och meningar, Lyssna och läsa, Grammatik, Språkprov och Tala och skriva. Varje knapp öppnar en egen sida med gruppens övningar. Eleven har fått svar i Tyck till. | `961594f` |
| Önskemål från föräldern: *bokens egna texter och övningar* (Kurser · P1 *Escalade*) | Fotona av s. 40–67 är sparade i den privata mappen `languages/fr/book/foton/`. Bokens texter och övningar är inskrivna i `book/content/`, som inte finns i det publika repot. Det blev 8 lästexter med svensk översättning, glosor och frågor (bokens Vrai ou faux där det finns), 17 skrivuppgifter av bokens öppna frågor och diskussionsfrågor (med Claudes kommentarer) och 116 frågor under Grammatik → Bokens övningar (översätt, fyll i, stor bokstav, à + le, possessiva). Bokens övningar kommer först när kapitel 3 eller 4 är valt. Hörövningar som kräver bokens ljud och övningar som bara går att göra i par är inte med. Arbetssättet står i `docs/BOK.md`. | `1e550a2` |

## 2026-09-27, del 7 (publicerat som version 15)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Språkprov · P1 *Provövningar i provets format* | Provträning under "Fler övningar → Språkprov". Uppgifterna ligger i `content/exam.json` och är skrivna för appen i provets stil, inte officiellt material. **Goethe B2** (Tyska 5) har 16 uppgifter: Lesen Teil 1–5, Hören Teil 1–4, Schreiben med Forumsbeitrag och formellt mejl, och Sprechen med Vortrag och Diskussion. **DELF B1** (Franska 3) har 14 uppgifter: compréhension orale och écrite, production écrite och production orale. Läsa och lyssna visar alla frågor på en gång, med klocka och provets tid. Hörtexten får spelas så många gånger som på provet och visas först efteråt. Skriv- och taluppgifterna bedöms av Claude med provets kriterier (0–5 poäng per kriterium) och räknas om till procent mot gränsen för godkänt. Varje uppgift har ett exempelsvar som går att lyssna på. | `46d8855`, `2bd61c1` |
| Språkprov · P1 *Provsimulering* | En uppgift i läsa, lyssna och skriva efter varandra, med klocka. Resultatet jämförs med gränsen för godkänt (60 % för Goethe, 50 % för DELF) och sparas under "Tidigare simuleringar". Den muntliga delen ingår inte i simuleringen. | `46d8855` |
| Språkprov · P1 *Musikordförråd* | Franska: avsnittet *Musique et conservatoire* (68 ord och fraser, bland annat conservatoire, concours d'entrée, audition, solfège, le trac och 11 meningar för antagningsintervjun). Tyska 5: *Musik und Aufnahmeprüfung* (66, bland annat Vorspiel, Pflichtstück, Gehörbildung, Stimmlage, Eignungsprüfung och 10 intervjumeningar). Tyska 4 har grundläggande musikord i kapitel 6. | `46d8855` |

## 2026-09-27, del 6 (publicerat som version 14)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Nästa att bygga · P1 *Kursen Tyska 4* | Ny kurs `languages/de4/` med egen sparnyckel `glosor-de4-v1`, så att framstegen i Tyska 5 inte påverkas. 551 vanliga ord på nivå A2–B1 i 8 kapitel plus Redemittel, utan ord som redan finns i Tyska 5. Kapitel 6 har många musikord. 270 grammatikfrågor (prepositioner, perfekt och präteritum, als/wenn/dass/ob, ordföljd, relativsatser, reflexiva verb, Konjunktiv II, passiv, jämförelser) och adjektivändelser. 9 hörtexter, 6 lästexter (en om antagning till en Musikhochschule), 7 kulturtexter, 6 berättelser, 40 fraser, 7 skrivuppgifter och 23 videor. Verbspelen delar verb med Tyska 5 men saknar Konjunktiv I. Kursväljaren visar Tyska 4 före Tyska 5, och "Bara tyska" (tidigare "Bara Tyska 5") visar båda de tyska kurserna. Topplistan visar kursnamnet. När nästan alla ord i Tyska 4 är påbörjade och hälften sitter föreslår appen att gå vidare till Tyska 5. | `bc7c24a`, `e7d50ec` |
| Nästa att bygga · P1 *Feedback från eleverna* | Fliken **Tyck till**, där eleven väljer Önskemål, Krångligt, Något är fel eller Annat och skriver fritt. Meddelandet sparas i `feedback/<uid>-<tid>` i artefaktens db. Claude läser meddelandena och sätter status (Läst, Tillagt i backloggen, Byggt, Inte just nu) och ett svar, som eleven ser i samma flik. Mejl skickas bara om föräldern ber om det. | `bc7c24a` |

## 2026-09-27, del 5 (publicerat som version 13)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P1 *Nästa kapitel i Escalade* (kap 3–4, s. 40–67) | Glosor ur boken i den privata mappen `languages/fr/book/words.txt`: 57 nya ord till kap 3 (`k3x`) och 70 ord till kap 4 "L'Afrique et l'avenir" (`k4`), med sidnummer. Egna övningar till kap 4 (publika, inte avskrivna från boken): lästexten "Aminata Sow", hörtexten "Tu l'as lu ?", kulturtexterna "Le français en Afrique" och "L'île de Gorée", en berättelse, en skrivuppgift och 80 grammatikfrågor (possessiva pronomen, adjektivens böjning, stor/liten bokstav). Grammatikområdena är kopplade till bokens kapitel (`secs` i lang.js). När eleven läser kap 4 kommer pronomen, possessiva, stor bokstav och à + artikel först, och Blandad grammatik tar hälften av frågorna därifrån. | `a6a4ab4`, `6689292` |

## 2026-09-27, del 4 (publicerat som version 12)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *Claude kommenterar texterna* (ersätter Tyska · P2 *Återkoppling på skrivna texter utan lärare*) | Knappen "Få kommentarer av Claude" i skrivuppgifterna och i kultursvaren. Claude svarar på svenska med helhetsintryck, styrkor, de viktigaste felen (citat → rättning + regel), nästa steg, ungefärlig GERS-nivå och en bedömning mot språkprovet (DELF B1 respektive Goethe B2). Kommentaren sparas. Kapabiliteten `sample` är tillagd, och den som använder funktionen betalar med sin egen Claude-användning. | `485d3ff` |

## 2026-09-27, del 3 (publicerat som version 10)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *två lägen, bok och utan bok* (ersätter Tyska · P3 *Om flickvännens lärobok fotas* som arbetssätt) | Kapitel kan märkas som bokkapitel (`#id|Namn|bok`). Franska 3 är kopplad till *Escalade*. Startsidan har panelen **Boken → Vi läser nu**, där eleven väljer kapitlet klassen läser. Nya ord, texter och övningar tas då först från det kapitlet, och appen föreslår nästa kapitel när alla ord är påbörjade. "Nya ord från" är uppdelat i Boken och Allmänt. Bokmaterial kan ligga i en privat mapp `languages/<kod>/book/` som byggs in men inte hamnar i det publika repot. Arbetssättet för att fota och föra in kapitel står i `docs/BOK.md`. | `536499b` |

## 2026-09-27, del 2 (publicerat som version 8)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *välja alla ord i en text* (hör också till Repetition · P3 *Mina ord*) | I läs-, hör- och kulturtexterna går alla ord att trycka på, inte bara de som har en färdig översättning. Ett tryck till tar bort markeringen. De valda orden samlas i en lista längst ned på skärmen med grundform, betydelse och status ("Finns redan i Mina ord", "Du övar redan på ordet"). För ord utan översättning skriver man betydelsen själv. Sedan läggs alla till i Mina ord på en gång. Listan går att fälla ihop. | `0398a77` |
| Franska · P2 *Grammatikövningar för franska* | 322 frågor i `languages/fr/content/grammar-*.json` (format i `languages/fr/content/GRAMMATIK-SPEC.md`): objektspronomen, passé composé med être/avoir och kongruens, du/de la/de, prepositioner med länder och städer, qui/que/où/dont, subjonctif, si-satser, jämförelser, negation och frågor (de två sista med ordbrickor). Hitta felet och Blandad grammatik fungerar också. | `0398a77`, `75eea14` |
| Franska · P2 *Tatoeba-meningar* | `tools/tatoeba.py` hämtar upp till två korta meningar med svensk översättning per ord. Just nu finns 248 meningar till 136 ord. De används i diktamen, översättning och ordföljd, med källhänvisning (Tatoeba-id, användare, CC BY 2.0 FR). | `0398a77`, `a1e0679` |
| Tyska · P2 *Granskning av grammatikfrågorna* (delvis) | Knappen "Fel i frågan? Rapportera" finns efter varje svar. Rapporterna sparas i `reports/` i artefaktens db, där Claude kan läsa dem med ArtifactData. Själva granskningen av en lärare återstår. | `786f8cc` |
| Tyska · P2 *Större ordförråd, steg 2* (delvis) | Avsnittet Häufige Wörter: 300 vanliga ord som saknades, i frekvensordning (rang 301–2010 i FrequencyWords, CC BY-SA 4.0, med källhänvisning i words.txt). Ordlistan har nu 1 629 ord. | `d30137b` |
| Repetition · P3 *Egen minnesregel per svårt ord* | På lärokortet för ett svårt ord kan man skriva en egen minnesregel. Den visas sedan varje gång ordet kommer tillbaka. | `29a04f6` |
| Konton · P3 *Topplista med längre historik* | Vinnarna de fem senaste veckorna visas under "Tidigare veckor". | `75eea14` |

## 2026-09-27 (publicerat som version 6 och 7)

### Repetition och inlärning

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Repetition · P1 *Inlärda ord kommer aldrig tillbaka* | Steg 0–3 = lär sig, steg 4 och uppåt = kan. Ord man kan kommer tillbaka efter 40, 80 och 160 pass. Ett fel flyttar ordet ett steg ned, och ett ord man kunde går tillbaka till steg 2. Gamla ord med `due=1e9` får ett repetitionsdatum och sprids ut över kommande pass (`migrateRetired`). Högst 40 repetitioner per pass. Sparformatet `{s, due}` är detsamma. | `cb8f32e`, `99e8074` |
| Repetition · P2 *Markera "igel"-ord* | Ord med minst tre återfall (`lapses`), eller många fel, får märket "svårt ord" i quizet och ett tips på lärokortet (`isLeech`). | `0b135b8` |
| Repetition · P3 *prognos i statistiken* | Statistiken visar hur många ord som ska repeteras i de kommande sju passen. Självbedömning i fyra steg är **inte** byggd och ligger kvar i backloggen. | `fba307a` |
| Repetition · P3 *Mina ord* | Man kan lägga till egna ord under "Alla ord" och ta bort ord ur Mina ord (två tryck). Koppling mellan böjda former och grundformen är **inte** byggd. | `fba307a` |
| Repetition · P3 *Färgmarkera kända och okända ord* | I läs-, hör- och kulturtexterna är ord man redan övar på gröna, och sparade ord har heldragen understrykning. | `63a49b6` |

### Tyska

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyska · P1 *Grammatikövningar för tyska*, punkt 1–11 | Grammatikmotor (`src/grammar.js`) och 390 frågor i `languages/de/content/grammar-*.json`, med formatet beskrivet i `GRAMMATIK-SPEC.md`. `build.py` kontrollerar artiklar och relativpronomen mot tabeller. Områden: adjektivändelser (skapas ur ordlistans substantiv), kasus efter preposition, bisatsordföljd med ordbrickor, relativsatser, verb med preposition och da-/wo-ord, Konjunktiv II och indirekt tal, passiv, zu-infinitiv, perfekt med haben/sein och pluskvamperfekt, bindeord, samt Hitta felet och Blandad grammatik. Statistiken visar resultat per område och de regler man missar mest. Grammatik ingår också i Dagens pass. | `0b135b8`, `fba307a`, `2f3bc85` |
| Tyska · P1 *Innehåll till de nya övningstyperna* | 14 hörtexter, 8 lästexter, 10 kulturtexter, 8 berättelser (Präteritum/Perfekt och bindeord), 40 samtalsfraser och 9 skrivuppgifter. Dessutom tyska bindeord och tempusigenkänning för skrivchecklistan. | `664bda1`, `4ae527d` |
| Tyska · P2 *Större ordförråd* | Tre nya avsnitt: Allgemeiner Wortschatz B1–B2 (300 ord), Wortbildung (100) och Feste Verbindungen (100). Ordlistan har nu 1 329 ord. Ett frekvensordnat avsnitt från öppna källor (FrequencyWords, kaikki) är **inte** gjort och ligger kvar i backloggen. | `01466c0`, `9a1de2d` |
| Tyska · P2 *Spel för der/die/das och plural* | Spelet "der, die, das" med genus som flerval och plural som skrivfråga. Pluralen räknas fram ur ordlistans markeringar (`pluralOf`). Tumregler för genus visas efter svaret. | `0b135b8` |
| Tyska · P2 *Fler verb i de tyska verbspelen* | 12 fler verb i Präsens, 11 i Präteritum, 10 i Perfekt och 5 i Konjunktiv II, plus ett nytt spel "Mot B2: konjunktiv" med Konjunktiv I. Verben är handskrivna, inte hämtade från Wiktionary. | `a337a0f` |
| Tyska · P2 *Videor till kapitlet dv* | 4 klipp om verb med preposition och da-/wo-ord, kontrollerade med oEmbed. | `95dba3b` |

### Franska

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Franska · P2 *Fler verb och tempus inför B1* | Futur simple, conditionnel och subjonctif för 13 verb, i ett nytt verbspel "Mot B1". I subjonctif skrivs "que je …", och svaret godkänns både med och utan "que". | `cebc901` |

### Kurser, konton och topplista

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P3 *Gy25-kursnamn* | Under Fler inställningar kan man välja läroplan (Gy11/Gy25). Kursnamnet visas därefter. | `fba307a` |
| Kurser · P3 *Välja vilka kurser man ser* | Inställningen "Bara Tyska 5" (eller Franska 3) döljer kursväljaren. Den sparas i webbläsaren. | `8fc1f96` |
| Konton · P3 *Loggen kapas vid 1 000 poster* | Äldre poster sammanfattas i `S.logOld`, så att total övningstid och antal dagar finns kvar. | `fba307a` |
| Konton · P3 *Topplista: veckans vinnare, historik och mål* | Förra veckans vinnare visas överst. Man kan sätta ett veckomål (60–150 minuter) som visas i Dagens pass och som "veckomålet klart ✓" i topplistan. Längre historik är **inte** byggd. | `f4b156a` |
| Teknik · P2 *GitHub* | Repot finns på https://github.com/hmariasvensson-cmd/glosor. | `6105b6a` |
| Teknik · P3 *Talövning* | Skuggning: lyssna, säg meningen högt samtidigt och bedöm själv. | `2f3bc85` |

### Övrigt som ändrades på vägen

- Introtexterna till berättelser och kultur hämtas från `lang.js`, så tyskan inte längre säger "Frankrike".
- Checklistan för skrivuppgifter känner igen kapitelord utan artikel, i plural och i böjd verbform. Den känner också igen Perfekt med particip utan ge- (studiert, verstanden, teilgenommen). Ett test kontrollerar att alla modelltexter klarar sin egen checklista.
- Sällan ändrade inställningar ligger under "Fler inställningar".
- Testerna har 73 kontroller.

### Att granska

Allt tyskt innehåll (grammatikfrågor, texter och nya ord) är skrivet av AI. Det har kontrollerats med skript och stickprov, och några tvetydiga felalternativ har rättats (till exempel indikativ i indirekt tal). En lärare eller tysktalande bör ändå läsa ett urval.
