# Provformat

Hur provträningen i appen (`content/exam.json`, `src/kinds/70-exam.js`) följer de riktiga proven, kontrollerat mot provgivarnas eget material.

## DELF B1 och B2 (France Éducation international)

Kontrollerat i september 2026 mot provgivarens egna exempelprov och beskrivningar (källor nedan). Kurserna `fr` och `fr4` tränar DELF B1 tout public, `fru` tränar DELF B2 tout public.

### Gemensamt

- Fyra delar på 25 poäng var: compréhension de l'oral (co), compréhension des écrits (ce), production écrite (pe) och production orale (po). Tre delar skrivs samtidigt i en sal, den muntliga delen görs enskilt inför två examinatorer.
- Godkänt: minst 50 av 100 poäng totalt och minst 5 av 25 i varje del (under 5 i en del = underkänt oavsett total). I appen: `pass: 50` (procent per uppgift och del).
- **Två format av hör- och läsförståelsen används parallellt** i de officiella sessionerna. Det äldre har öppna frågor och Vrai/Faux med citat som motivering. Det nya (infört från 2020, spritt i sessionerna 2024–2025) har bara slutna frågor: flerval med tre alternativ och, på B1-läsförståelsen, Vrai/Faux utan motivering. FEI skriver att inget av formaten ger en fördel. Provgivarens sida hade fortfarande båda formaten som exempel i juni 2026. Appen följer det **nya formatet**, eftersom det passar flervalsfrågor och är det som ersätter det gamla. Skriv- och taldelarna är desamma i båda formaten.

### DELF B1

| Del | Tid | Innehåll |
|---|---|---|
| Hörförståelse | ca 25 min | 3 övningar, 20 frågor, alla dokument hörs 2 gånger, flerval med 3 alternativ |
| Läsförståelse | 45 min | 3 övningar, 30 frågor |
| Skriva | 45 min | 1 text, minst 160 ord |
| Tala | 10 min förberedelse + ca 10–15 min | 3 delar |

Läs- och hörförståelse samt skriva tar tillsammans 1 h 55 min (läsförståelsen förlängdes 2020 från 35 till 45 minuter).

- **Hörförståelse.** Före varje uppspelning hörs en signal. Eleven läser frågorna, lyssnar och svarar.
  - Exercice 1: vardagsdialog mellan fransktalande (ca 1–1 min 40, 250–300 ord), 6 frågor (7 p).
  - Exercice 2: radiodokument (intervju, nyhetsinslag, krönika), ca 2 min, 300–350 ord, 7 frågor (9 p).
  - Exercice 3: radiodokument, gärna om arbete eller utbildning, ca 2 min, 300–350 ord, 7 frågor (9 p).
- **Läsförståelse.**
  - Exercice 1 (orientera sig): en situation med fyra krav och fyra korta informationstexter (annonser, broschyrer, ca 100 ord var). För varje text och krav kryssar man ja eller nej: 16 rutor à 0,5 p (8 p).
  - Exercice 2 och 3: var sin informerande tidningstext med åsikter (300–350 ord), 7 frågor: 4 flerval + 3 Vrai/Faux utan motivering (8 respektive 9 p).
- **Skriva.** En personlig ståndpunkt om ett allmänt ämne: brev/mejl, forumsinlägg, artikel eller essä. Minst 160 ord. Bedöms med en grid för uppgiften, sammanhang, ordförråd och grammatik.
- **Tala.** Eleven drar två ämnen till del 3 och väljer ett, och förbereder sig i 10 minuter. Sedan kommer de tre delarna i följd:
  1. Entretien dirigé (2–3 min, utan förberedelse): prata om sig själv, sitt liv, sina intressen, sitt förflutna och sina planer.
  2. Exercice en interaction (3–4 min, utan förberedelse): rollspel där examinatorn spelar en roll; man drar två situationer och väljer en.
  3. Expression d'un point de vue (5–7 min, med förberedelse): ta fram temat i ett kort dokument och ge sin egen åsikt i ett anförande på ca 3 minuter, sedan några frågor från examinatorn.

### DELF B2

| Del | Tid | Innehåll |
|---|---|---|
| Hörförståelse | ca 30 min | 3 övningar, 20 frågor, flerval med 3 alternativ |
| Läsförståelse | 1 h | 3 övningar, 20 frågor, flerval med 3 alternativ |
| Skriva | 1 h | 1 text, minst 250 ord |
| Tala | 30 min förberedelse + 20 min | anförande och debatt |

- **Hörförståelse.**
  - Exercice 1: radiodokument (nyhetsinslag, intervju, ställningstagande, krönika, debattutdrag) om ett samhällsämne, 2 min 30–3 min (500–600 ord), hörs **2 gånger**, 7 frågor (9 p).
  - Exercice 2: samma typ men om utbildning eller arbetsliv, hörs **2 gånger**, 7 frågor (9 p).
  - Exercice 3: **tre korta dokument** på 60–80 sekunder (220–250 ord var), t.ex. monolog, samtal, intervju eller inledning till en föreläsning, hörs **en gång**, 2 frågor per dokument = 6 frågor (7 p).
- **Läsförståelse.**
  - Exercice 1 och 2: var sin informerande eller argumenterande artikel (425–450 ord), 7 flervalsfrågor var (9 p). Ingen Vrai/Faux i det nya formatet.
  - Exercice 3: tre personers åsikter om samma ämne (100–120 ord var, t.ex. foruminlägg). Sex påståenden; för varje väljer man vem av de tre som har den åsikten (7 p).
- **Skriva.** Ett argumenterat ställningstagande: inlägg i en debatt på ett forum, formellt brev eller kritisk artikel. Minst 250 ord.
- **Tala.** Eleven drar två korta dokument och väljer ett, 30 minuters förberedelse. Sedan (20 min) ett monologue suivi på 5–7 min där man tar fram frågan dokumentet väcker och försvarar sin åsikt, och därefter en debatt med examinatorn (10–13 min) utan förberedelse.

### Så följer appen formatet

- `parts`: tiderna ovan (B1: 25/45/45/15 min, B2: 30/60/60/20 min). `pass: 50`.
- Hör- och läsuppgifterna har `teil` = `Exercice 1/2/3`. Varje uppgift motsvarar en övning, och antalet frågor följer provet (B1 hör: 6/7/7, B1 läs: 16/7/7, B2: 7/7/6 både hör och läs, utom B2 läs Exercice 3 som har 6). `plays` är 2 utom i B2 hör Exercice 3 (1).
- Skrivuppgifterna har `minWords` 160 (B1) eller 250 (B2) och `time` 45 respektive 60. Taluppgifterna har `prep` och `time` enligt tabellerna.
- Poängen per fråga varierar på provet (0,5–2,5 p); appen räknar procent rätt av frågorna.
- Provsimuleringen tar en uppgift per övning (Exercice 1–3) i hör- och läsförståelse plus skrivuppgiften, och klockan går för hela delen med provets tid (25/45/45 respektive 30/60/60 min). Delens resultat är andelen rätt av alla frågor i delen. Man kan också simulera en enda del.
- **Textlängder (rättade 2026-09-29):** `fr-co-1`–`3`, `fru-co-1`–`4` och `fr-ce-1` är förlängda och `fru-ce-1`–`4` kortade till intervallen ovan; `fr4-co-4` är nu en telefondialog.

### Ändringar vid kontrollen (september 2026)

- B1 hör: Vrai/Faux-frågor gjordes om till flerval med tre alternativ eller togs bort; Exercice 1 har 6 frågor (`fr-co-1`, `fr4-co-1`, `fr4-co-4` hade 7–8).
- B1 läs Exercice 1 (`fr-ce-1`, `fr4-ce-1`): fyra krav och 16 Oui/Non-frågor i stället för 6–7 frågor av typen "vilken annons …".
- B1 läs: `fr-ce-3` och `fr4-ce-4` blev Exercice 3 (provet har tre läsövningar). Exercice 2 och 3 har 4 flerval + 3 Vrai/Faux; instruktionen sade tidigare att Vrai/Faux ska motiveras med citat, vilket bara gäller det gamla formatet.
- B2 hör Exercice 1 (`fru-co-1`, `fru-co-3`): hörs två gånger, inte en. Vrai/Faux togs bort eller gjordes om; 7 frågor i Exercice 1–2 och 2 frågor per dokument (6) i Exercice 3.
- B2 läs: Vrai/Faux togs bort (7 frågor per artikel), och Exercice 3 (tre åsikter) lades till.
- Fler uppgifter, så att simuleringen inte upprepar sig: varje kurs har nu 3 uppgifter per övning i hör- och läsförståelse och 4 skrivuppgifter och 4 taluppgifter (26 uppgifter per kurs). De nya texterna är egna, med påhittade personer och orter.

### Källor

Provgivarens webbplats blockerar automatiska hämtningar, så sidorna lästes via Internet Archive (datum för kopian inom parentes).

- France Éducation international, DELF tout public – niveau B1, provbeskrivning (maj 2026): https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b1
- Exemples de sujets – niveau B1 (juni 2026), med två exempel på de skriftliga delarna, ett för vardera formatet, och den muntliga delen: https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b1/exemples-sujets (dokumenten `delf-b1-tp-candidat-coll-exemple1` = nytt format, `…-exemple2` = gammalt format, `delf-b1-tp-candidat-ind0`)
- DELF tout public – niveau B2 (april 2026) och Exemples de sujets – niveau B2 (maj 2026): https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b2/exemples-sujets (dokumenten `delf-b2-tp-candidat-coll-exemple1` = nytt format, `…-exemple2` = gammalt format, `delf-b2-tp-candidat-ind`)
- Évolution des épreuves du DELF et du DALF (FEI, version 24 juni 2024): https://www.france-education-international.fr/document/kit-evolutions-dd – antal övningar, frågor, textlängder, uppspelningar och poäng för det nya formatet, samt förlängningen av B1-läsförståelsen.

## Goethe-Zertifikat B2 och B1 (tyska)

Kontrollerat 2026-09-29 mot Goethe-Institutets egna material. Provträningen i `languages/de/` och `languages/de6/` (Tyska 5 och 6) följer B2, `languages/de4/` (Tyska 4) följer B1. Instruktionerna i appen är skrivna med egna ord, och alla texter är egna.

Källor:

- Goethe-Zertifikat B2, Modellsatz Erwachsene, 2:a upplagan augusti 2025: https://www.goethe.de/pro/relaunch/prf/materialien/B2/b2_modellsatz_erwachsene.pdf (enligt förordet samma uppgiftstyper, antal items och tider som det riktiga provet)
- Goethe-Zertifikat B2, Durchführungsbestimmungen, stand 1 september 2025: https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B2.pdf (tider, poäng, godkäntgräns, ca 5 minuter för att föra över svaren i Lesen och Hören)
- Goethe-Zertifikat B1, Modellsatz Erwachsene: https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf
- Goethe-Zertifikat B1, Übungssatz Erwachsene: https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf

Gemensamt för båda nivåerna: fyra moduler som kan göras var för sig. Varje modul ger högst 100 poäng och är godkänd från **60 poäng (60 %)** (`pass: 60`). Lesen och Hören har 30 items var (1 poäng per item, omräknat till 100). Skriv- och taluppgifter bedöms med kriterierna Erfüllung, Kohärenz (i Sprechen ibland Interaktion), Wortschatz och Strukturen, plus Aussprache i Sprechen (kan inte bedömas i appen). En skrivuppgift med mindre än hälften av det angivna antalet ord, eller som missar ämnet, ger 0 poäng. Ordantalet anges som **cirka**, inte minst (`approxWords: true` i exam.json, så att appen skriver ”cirka”).

### B2

| Modul, del | Uppgift | Items | Tid | Uppspelningar |
|---|---|---|---|---|
| Lesen (65 min) Teil 1 | Forum: fyra personers åsikter, vem säger vad (personerna kan väljas flera gånger) | 9 | 18 min | |
| Lesen Teil 2 | Artikel med 6 luckor, 8 meningar (2 blir över) | 6 | 12 min | |
| Lesen Teil 3 | Artikel, flerval a–c | 6 | 12 min | |
| Lesen Teil 4 | 8 korta åsiktstexter (a är exempel), vilken text passar till vilken rubrik, en text blir över | 6 | 12 min | |
| Lesen Teil 5 | Regler/ordning: exempelparagraf + 3 paragrafer, 8 rubriker (exemplets inräknad), 4 blir över | 3 | 6 min | |
| Hören (ca 40 min) Teil 1 | Fem korta samtal och meddelanden, per text Richtig/Falsch + flerval a–c | 10 | | 1 gång |
| Hören Teil 2 | Radiointervju, flerval a–c | 6 | | 2 gånger |
| Hören Teil 3 | Radiosamtal med moderator och två gäster, vem säger det (exemplet gäller moderatorn) | 6 | | 1 gång |
| Hören Teil 4 | Föredrag, flerval a–c | 8 | | 2 gånger |
| Schreiben (75 min) Teil 1 | Forumsinlägg, fyra innehållspunkter, inledning och avslutning | cirka 150 ord | 50 min | |
| Schreiben Teil 2 | Meddelande/mejl till t.ex. chef eller handledare, fyra punkter i valfri ordning, anrede och hälsning | cirka 100 ord | 25 min | |
| Sprechen (ca 15 min, 15 min förberedelse) Teil 1 | Föredrag i ett seminarium, välj ett av två ämnen, tre punkter (beskriva alternativ, en närmare, för- och nackdelar och värdera), sedan frågor | | ca 4 min per person | |
| Sprechen Teil 2 | Diskussion om en kontroversiell fråga, reagera på argument, sammanfatta till sist om man är för eller emot | | ca 5 min | |

I Lesen ingår ca 5 minuter för att föra över svaren, därför blir delarnas tider tillsammans 60 av 65 minuter. I Hören får man läsa frågorna före varje del (60–90 sekunder) och har 5 minuter i slutet för att föra över svaren.

### B1

| Modul, del | Uppgift | Items | Tid | Uppspelningar |
|---|---|---|---|---|
| Lesen (65 min) Teil 1 | Blogg/privat text, Richtig/Falsch | 6 | 10 min | |
| Lesen Teil 2 | Två tidningstexter, flerval a–c (3 + 3) | 6 | 20 min | |
| Lesen Teil 3 | 7 situationer, 10 annonser, en situation saknar annons (”0”) | 7 | 10 min | |
| Lesen Teil 4 | 7 läsarbrev: är personen för? Ja/Nein | 7 | 15 min | |
| Lesen Teil 5 | Regler/instruktioner, flerval a–c | 4 | 10 min | |
| Hören (ca 40 min) Teil 1 | Fem korta texter, per text Richtig/Falsch + flerval a–c | 10 | | 2 gånger |
| Hören Teil 2 | En person informerar (guidning, kursstart), flerval a–c | 5 | | 1 gång |
| Hören Teil 3 | Vardagssamtal, Richtig/Falsch | 7 | | 1 gång |
| Hören Teil 4 | Radiodiskussion, vem säger vad (moderator + två gäster) | 8 | | 2 gånger |
| Schreiben (60 min) Aufgabe 1 | Personligt mejl, tre punkter | cirka 80 ord | 20 min | |
| Schreiben Aufgabe 2 | Åsikt i ett gästforum, med en given kommentar | cirka 80 ord | 25 min | |
| Schreiben Aufgabe 3 | Kort formellt mejl (be om ursäkt, be om något) | cirka 40 ord | 15 min | |
| Sprechen (ca 15 min, 15 min förberedelse) Teil 1 | Planera något tillsammans, fyra stödpunkter + ”…” | | ca 3 min | |
| Sprechen Teil 2 | Presentera ett av två ämnen med fem ”Folien” | | ca 3 min | |
| Sprechen Teil 3 | Respons och en fråga på partnerns presentation, svara på en fråga | | ca 2 min | |

Kriterier i Sprechen B1: Teil 1 Erfüllung, Interaktion, Wortschatz, Strukturen; Teil 2 Erfüllung, Kohärenz, Wortschatz, Strukturen; Teil 3 bara Erfüllung; Aussprache för hela prestationen.

### Rättat i appen (2026-09-29)

B2 (de, de6):

- Hören Teil 1 hördes två gånger i appen, ska vara **en gång** (`plays: 1`). de-hoe-1 hade 8 items, har nu 10 (en flervalsfråga till för text 4 och 5).
- Hören Teil 2 och Teil 4 hördes en gång, ska vara **två gånger** (`plays: 2`).
- Hören Teil 3 hade 7 items, ska vara **6**: det första påståendet (programledarens inledning) motsvarar provets exempel och är borttaget.
- Lesen Teil 3: 15 → **12 minuter**. Lesen Teil 5: 8 → **6 minuter**.
- Lesen Teil 4 var omvänd (kommentar → rubrik, 8 rubriker). Nu som på provet: rubrikerna är items, man väljer bland **7 kommentarer**, och en kommentar blir över (en ny kommentar tillagd i de-le-4 och de6-le-4).
- Lesen Teil 5 hade 5 paragrafer och 7 rubriker med 2 över. Nu: **§ 1 som exempel + 3 paragrafer**, 7 rubriker att välja bland och **4 över** (§ 5 borttagen, en ny rubrik tillagd).
- Schreiben: ”mindestens/minst” → **”circa/ungefär”** 150 och 100 ord, med provets upplysning om vad som bedöms. Teil 2 säger att man själv väljer ordning på punkterna.
- Sprechen Teil 1: sammanhanget (seminarium) och att både partner och examinator ställer frågor. Teil 2 slutar med att man **sammanfattar om man är för eller emot**, inte med en gemensam slutsats. Kriterierna är nu provets (Teil 1 Kohärenz, Teil 2 Interaktion).

B1 (de4):

- Formatet stämde. Sprechen Teil 1 har nu fyra stödpunkter + ”…” som på provet, och kriterierna i Sprechen är provets (Teil 1 Interaktion, Teil 3 bara Erfüllung). Ordantalet visas som ”cirka”.

## Uppgiftstyper i exam.json

Varje uppgift i `tasks` har `id`, `part`, `teil`, `title`, `time` (minuter) och `instr`. Typen avgörs av fältet `type`, eller för de gamla uppgifterna av innehållet. Samma format står i SPEC-kommentaren överst i `src/kinds/70-exam.js`, och `build.py` (`check_exam_task`) stoppar bygget om en uppgift inte följer det.

| Typ | Fält | Provuppgifter |
|---|---|---|
| flerval (utan `type`) | `lines`, `qs: [{q, opts, a, why}]` | nästan all läs- och hörförståelse |
| skriva (utan `type`) | `task`, `minWords`, `model`, `criteria` | skrivdelarna |
| tala (utan `type`) | `task`, `prep`, `phrases` | muntliga delar (ingår inte i simuleringen) |
| `match`: para ihop | `items: [{q, sv, a, why}]`, `opts: [{fr, sv}]` (visas som A, B, C …), valfritt `none`, `reuse`, `lines` | DELF A1/A2 (annonser, skyltar), CELI 1 A.3, Goethe B1 Lesen Teil 3, B2 Lesen Teil 4 |
| `gaps`: lucktext med flerval per lucka | `lines` med `{1}`, `{2}` … i `fr`, `gaps: [{opts, a, why}]`, eller `bank` (en ordlista för alla luckor) och `gaps: [{a, why}]` | telc Sprachbausteine Teil 1 (a–c per lucka) och Teil 2 (ordbank), CELI competenza linguistica |
| `short`: kortsvar | `items: [{q, a: [godkända svar], why}]`, `maxWords` (standard 3), oftast `lines` + `plays` | TestDaF Hörverstehen, CELI, Goethe C1 Hören (anteckningar) |

- **Para ihop.** `a` är index i `opts`, eller `-1` när inget alternativ passar och uppgiften har `none` (texten för valet "0", tom = "inget passar"; Goethe B1 Lesen Teil 3). Det ska finnas fler `opts` än `items`, så att några blir över. Utan `reuse: true` får varje alternativ vara facit högst en gång. Varje item väljs i en lista (`<select>`), så uppgiften går att göra med tangentbordet och får plats på 320 px.
- **Lucktext.** Markörerna `{n}` ska komma i ordning och motsvara `gaps` (en per lucka). Luckorna visas som listor mitt i texten. Med `bank` får varje ord vara facit i högst en lucka.
- **Kortsvar.** Rättningen struntar i versaler, accenter, ß/ss, skiljetecken och extra mellanslag, men stavningen i övrigt räknas. Skriv alla godkända varianter i `a`, även siffror och bokstäver (`"20 Minuten"`, `"zwanzig Minuten"`). Det första svaret visas som facit.
- **Alla typer.** `lines` med `plays` (eller en hördel, `hoeren`/`co`) blir en höruppgift där texten visas först efter inlämningen. `sim: false` = extrauppgift utanför provets format (t.ex. telc-uppgifter i en Goethe-kurs): den finns i listan men tas inte med i provsimuleringen. Resultatet är andelen rätt av alla items, och sparas och räknas i simuleringen och nivåmätaren som flervalsuppgifterna.

Exempel (oktober 2026): para ihop i `fr2` (`fr2-ce-5` annonser, `fr2-ce-6` skyltar) och `it4` (`it4-le-5` annonser, `it4-le-6` frågor och svar, teil A.3); lucktext i `it7` (`it7-ex-cl-4`, `-5`, competenza linguistica Prova 1) och `de7` (`de7-le-3` a–c per lucka, `de7-le-4` ordbank, telc Sprachbausteine, `sim: false`); kortsvar i `de7` (`de7-hoe-3`, `-4`, Hören Teil 3 som TestDaF Hörverstehen, hörs en respektive två gånger).

### Pågående provsimulering

Simuleringen sparas i `S.exam.simRun` efter varje steg, varje svar och en gång i minuten, så att den överlever en omladdning (hela provet tar upp till tre timmar). Startsidan och provträningen visar då "Fortsätt provsimuleringen" med uppgift och tid kvar. Klockan står still medan appen är stängd: när simuleringen återupptas fortsätter den med den tid som var kvar. En inlämnad uppgift räknas även om eleven laddar om innan hon eller han går vidare. `simRun` tas bort när simuleringen är klar eller avbruten.
