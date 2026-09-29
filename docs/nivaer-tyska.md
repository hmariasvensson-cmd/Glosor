# Nivåer i tyska: steg 1–7 och vad kurserna ska innehålla

Underlag för kedjan Tyska 1 → 7 i Glosor. Skrivet 2026-09-29. Bygger på `docs/kursmall.md` (avsnitt 2) och `docs/provformat.md`, och jämför de befintliga kurserna `de4` (Tyska 4), `de` (Tyska 5) och `de6` (Tyska 6) med vad proven och referenslistorna kräver.

**Kort sammanfattning**

1. De tre befintliga kurserna ligger på rätt nivå eller något över (bra för en elev som siktar på B2), och grammatiken i `de6` täcker nästan allt som B2 kräver.
2. Den stora luckan är **grunden**: inga av de vanligaste orden (sein, haben, gehen, der Tisch, heute, gut …) och ingen A1–A2-grammatik (presens, kasus, modalverb, perfekt) finns i någon kurs. Hälften av de 1 000 vanligaste innehållsorden i tyskan saknas. Tyska 1–3 måste bygga den grunden.
3. **Futur I och II** saknas helt som grammatikområde, och Tyska 4 saknar zu-infinitiv, Genitiv och verb med preposition.
4. Räcker 4 + 5 + 6 till B2? **Ja för grammatik och ordförråd på B2-teman, nej för allmänt ordförråd** så länge grunden saknas. Med Tyska 1–3 och en Tyska 7 som tränar långa texter, föreläsningar och TestDaF/C1-format blir kedjan komplett.

---

## 1. Vad krävs per nivå

### 1.1 Referenser

| Källa | Vad den är | Användning i Glosor |
|---|---|---|
| **Profile Deutsch** (Glaboniat, Müller, Rusch, Schmitz, Wertenschlag; Langenscheidt/Klett, 2005, ny utgåva) | Kannbeschreibungen, grammatik, ordförråd, texttyper och strategier för A1–C2, knutna till GERS. Underlaget för Goethe-Institutets ordlistor och prov. | Grammatikprogressionen och temana per nivå nedan följer Profile Deutsch i stora drag. |
| **Goethe-Institutets Wortlisten** A1 (Start Deutsch 1), A2, B1 | Ordlistor till proven. A1 ≈ **650** lexikala enheter (ungefär hälften ska kunnas aktivt), A2 ≈ **1 300**, B1 ≈ **2 400**. Listorna är kumulativa (B1 innehåller A1 och A2). Varje lista har en temalista (person, bostad, miljö, resor och trafik, mat, inköp, tjänster, hälsa, arbete, utbildning, fritid …), ordgrupper (siffror, tid, veckodagar, månader, länder, färger, mått) och en alfabetisk lista med exempelmeningar. Det finns ingen officiell B2-lista. | Använd storlekarna som **kontrollmått**: efter steg 2 ska eleven ha minst A1-listans ord, efter steg 4 A2-listans, efter steg 6 B1-listans. Listorna är upphovsrättsskyddade och ska inte kopieras in i appen; skriv egna ordlistor och egna exempel. |
| **Jones och Tschirner**, *A Frequency Dictionary of German* (Routledge 2006) | De **4 034** vanligaste lemmana, ur en korpus på 4,2 miljoner ord (lika delar tal, skönlitteratur och sakprosa), med exempelmening och 21 tematiska listor. Andra upplagan (Tschirner och Möhring 2019): 5 000 ord, korpus 20 miljoner ord. | Riktmärke för B2: ungefär de 4 000–5 000 vanligaste orden plus temaord. |
| **DeReWo** (IDS Mannheim) | Korpusbaserad grundformslista ur DeReKo (bl.a. 320 000 lemman med frekvensklass, 2012). Licens CC BY-NC, alltså fri för icke-kommersiellt bruk med källangivelse. Korpusen är tidningstung (ord som *Patentamt*, *Schilling* ligger högt). | Används nedan för att mäta hur många av de vanligaste orden kurserna har (avsnitt 3.2). Kan användas i ett byggtest. |

Ungefärliga storlekar för hela ordförrådet (receptivt), kumulativt: A1 650–1 000, A2 1 300–2 000, B1 2 400–3 000, B2 4 000–5 000, C1 6 000+. Se också Milton och Alexiou (2009) i `kursmall.md`.

### 1.2 Goethe-Zertifikat A1–C1

Kontrollerat mot Goethe-Institutets Durchführungsbestimmungen (stand 1 september 2025) och Modellsätze, se källor. A1 och A2 är **inte modulära** (hela provet görs på en gång); B1, B2 och C1 är modulära (varje modul kan göras och godkännas för sig).

| Prov | Delar och tider | Poäng och godkänt |
|---|---|---|
| **A1 Start Deutsch 1** | Hören ca 20 min (3 delar, 15 items: korta samtal, utrop, telefonmeddelanden), Lesen 25 min (3 delar, 15 items: korta brev, annonser, skyltar), Schreiben 20 min (fylla i ett formulär + kort meddelande, ca 30 ord), Sprechen ca 15 min i grupp (presentera sig; fråga och svara om vardagsteman; be om något och reagera). | 100 poäng totalt (omräknat), godkänt från 60. |
| **A2** | Lesen 30 min (4 delar, 20 items), Hören ca 30 min (4 delar, 20 items), Schreiben 30 min (del 1 personligt meddelande, del 2 halvformellt meddelande, t.ex. till en lärare), Sprechen 15 min i par, utan förberedelse (3 delar: frågor om sig själv, berätta om sitt liv, planera något tillsammans). | 100 poäng: 75 skriftligt (Lesen 25, Hören 25, Schreiben 25), 25 muntligt. Godkänt: minst 60 totalt, varav minst 45 skriftligt och 15 muntligt. |
| **B1** | Lesen 65 min (5 delar, 30 items), Hören ca 40 min (4 delar, 30 items), Schreiben 60 min (personligt mejl ca 80 ord, forumsinlägg ca 80 ord, kort formellt mejl ca 40 ord), Sprechen ca 15 min i par (planera något, presentation, respons). Detaljer: `provformat.md`. | 100 poäng per modul, godkänt från 60. |
| **B2** | Lesen 65 min (5 delar, 30 items), Hören ca 40 min (4 delar, 30 items), Schreiben 75 min (forumsinlägg ca 150 ord, meddelande till chef/handledare ca 100 ord), Sprechen ca 15 min + 15 min förberedelse (föredrag, diskussion). Detaljer: `provformat.md`. | 100 poäng per modul, godkänt från 60. |
| **C1** | Lesen 65 min (30 items), Hören ca 40 min (30 items), Schreiben ca 80 min (en längre argumenterande text och en formell text), Sprechen ca 15 min i par + förberedelse (föredrag och diskussion). Skriftligt totalt ca 190 min. | 100 poäng per modul, godkänt från 60. Tiderna för C1 är tagna ur provgivarens översikt och bör kontrolleras mot Modellsatz innan provträning för C1 byggs. |

### 1.3 telc Deutsch B2 och TestDaF

| Prov | Delar och tider | Poäng och godkänt |
|---|---|---|
| **telc Deutsch B2** | Skriftligt: Leseverstehen (3 delar) + **Sprachbausteine** (2 delar, 20 luckor för ordförråd och grammatik) 90 min, Hörverstehen (3 delar) ca 20 min, Schriftlicher Ausdruck 30 min (ett halvformellt brev, välj mellan två). Muntligt: ca 15 min i par + 20 min förberedelse (presentera sig, diskutera ett ämne, planera något tillsammans). | 300 poäng: skriftligt 225 (Lesen 75, Sprachbausteine 30, Hören 75, Schreiben 45), muntligt 75. Godkänt: 60 % i **både** skriftligt och muntligt. Ej modulärt. |
| **Digitaler TestDaF** (g.a.s.t.) | Görs på dator. Lesen ca 55 min (7 uppgiftstyper, 34 items, bl.a. luckor och flerval), Hören ca 40 min (7 uppgiftstyper, 30 items, ljud och video, korta skrivna svar), Schreiben ca 60 min (argumenterande text, minst ca 200 ord, och en sammanfattning av text + grafik, 100–150 ord), Sprechen ca 35 min (7 uppgifter, 45 s–2,5 min per svar, spelas in). Akademiska ämnen: föreläsningar, seminarier, studieliv. | Resultat per del som TestDaF-Niveaustufe (TDN) 3, 4 eller 5 (ungefär B2 till C1). De flesta universitet kräver **TDN 4 i alla fyra delar**. Musikhögskolor kräver ofta mindre (B1/B2 eller TDN 3), men det varierar; kontrollera hos varje skola. |

**Skillnad mot Goethe B2:** telc har Sprachbausteine (grammatik i luckor, bra att träna i appen) och ett kortare prov. TestDaF ligger högre (B2–C1), är akademiskt och har uppgifter som saknas i Goethe: sammanfattning av grafik, korta skrivna svar på hörförståelse och talade svar på tid.

---

## 2. Steg 1–7 i tyska

Stegen enligt Skolverket (betyget E): 1 = A1.1, 2 = A1.2, 3 = A2.1, 4 = A2.2, 5 = B1.1, 6 = B1.2, 7 = B2.1. Antalet ord är **nya** ord per kurs, som i `kursmall.md` 2.3. Grammatiken nedan är tysk-specifik och följer Profile Deutsch; det som står i fetstil är det nya i steget.

### 2.1 Grammatik per steg

| Steg | Verb och tempus | Kasus, nominalfras | Satser och ordföljd |
|---|---|---|---|
| **1 (A1.1)** | **Presens** av regelbundna verb, sein, haben, vanliga starka verb (fahren, essen, lesen, sprechen); *ich möchte* som fras; *es gibt* | **Genus och artiklar** (der/die/das, ein/eine), **plural** (mönstren), **nominativ och ackusativ** (einen, keinen), personliga pronomen i nominativ, **possessiv** mein/dein/sein/ihr (nom., ack.), nicht och kein | **V2-ordföljd** (verbet på andra plats, även efter tidsuttryck), ja/nej-frågor, **W-frågor**, und/aber/oder |
| **2 (A1.2)** | **Modalverb** (können, müssen, wollen, dürfen, sollen, mögen) med satsram, **delbara verb** (aufstehen, anrufen), **imperativ** (du, ihr, Sie), **perfekt** med haben och sein (vanliga verb), präteritum av war och hatte | **Dativ** efter mit, bei, von, zu, nach, aus, seit; pronomen mir/dir/ihm; tidsprepositioner (am, um, im, von … bis); lokala prepositioner som fraser (in der Schule, nach Hause) | **Satsram** (Ich kann heute nicht kommen; Ich stehe um 7 Uhr auf), denn, deshalb (början), jämförelse med *als* och *wie* (början) |
| **3 (A2.1)** | Perfekt för alla vanliga verb (även trenn- och untrennbar: aufgestanden, besucht), **präteritum av modalverb**, **reflexiva verb** (sich freuen, sich waschen), framtid med presens + tidsuttryck, verb med dativ (helfen, gefallen, gehören) | **Växelprepositioner** (wo? dativ / wohin? ackusativ, liegen/legen, stehen/stellen), **adjektivändelser** efter bestämd artikel (början), **komparativ och superlativ**, ordningstal och datum, man, jemand, niemand | **Bisatser**: weil, dass, wenn, **verbet sist**; indirekta frågor med ob och W-ord (början); trotzdem, deshalb |
| **4 (A2.2)** | **Präteritum** av vanliga starka verb (för läsning och berättelser), **konjunktiv II** i artighet och önskan (würde, hätte, wäre, könnte), **Futur I** (werden + infinitiv), **passiv presens** (igenkänning), reflexiva verb med dativ (Ich wasche mir die Hände) | **Alla adjektivändelser** (bestämd, obestämd, utan artikel), pronomen i dativ och ackusativ i ordning, **genitiv** (igenkänning: das Auto meines Vaters, wegen) | **als/wenn**, ob, **relativsatser** (nom., ack., dativ), **zu-infinitiv** och **um … zu**, verb med preposition + da-/wo- (början) |
| **5 (B1.1)** | **Pluskvamperfekt**, **passiv** i presens, präteritum och med modalverb, **konjunktiv II i villkor** (irreala om-satser), konjunktiv I (igenkänning i nyhetstext) | **Genitiv och n-deklination**, relativsats med preposition (mit dem, über das), **verb med preposition** (warten auf, sich interessieren für) + darauf/worauf, **particip som adjektiv** | **Tidssatser** nachdem, bevor, während, seit, bis; **obwohl**/trotzdem; **damit**/um … zu; ohne … zu, statt … zu; **tvådelade bindeord** (sowohl … als auch, weder … noch, je … desto) |
| **6 (B1.2 → B2)** | **Konjunktiv I** i indirekt tal, **konjunktiv II i dåtid** (hätte gemacht, wäre gegangen), **Futur I och II** som förmodan (Er wird krank sein; Sie wird es vergessen haben), **Zustandspassiv** (ist geöffnet), **passiversättning** (sich lassen, sein + zu, -bar), **subjektiva modalverb** (Er soll reich sein; Das muss ein Fehler sein) | **Utbyggda participattribut** (die seit Jahren steigenden Preise), **nominalisering**, **Nomen-Verb-Verbindungen** (eine Entscheidung treffen), **prepositioner med genitiv** (aufgrund, angesichts, innerhalb) | **als ob** (irreal jämförelse), **so dass/sodass**, **indem/dadurch dass**, modalpartiklar (doch, ja, eben, halt, mal), konnektorer för textbindning |
| **7 (B2.1 → C1)** | Alla tempus och modus i längre text, **modalverb i perfekt** (hat kommen müssen; hätte kommen müssen), passiv i alla former inklusive med modalverb i perfekt, konjunktiv I i längre referat | **Nominalstil ⇄ verbalstil** (omskrivning åt båda hållen), **ordbildning** (prefixverb, suffix -ung, -heit, -keit, -bar, -los, -lich, sammansättningar), **adjektiv med preposition** (stolz auf, abhängig von), funktionsverb | **Komplexa meningar** med flera bisatser, **mittfältets ordföljd** (tid-orsak-sätt-plats, pronomen före substantiv), konnektorer i akademisk text (einerseits … andererseits, zwar … aber, insofern, demzufolge), stilnivåer och retoriska grepp, referat med källa |

### 2.2 Teman, texttyper, ord och prov per steg

| Steg | Teman (exempel för tyska) | Texttyper (nya i steget) | Nya ord per kurs (kumulativt) | Hör- / lästext (ord) | Skrivlängd | Provformat i appen |
|---|---|---|---|---|---|---|
| **1** | hälsa och presentera sig, familj, skola, fritid och hobbyer, siffror, tid och veckodagar, mat och dryck, färger och kläder, D-A-CH på kartan | presentation, dialog, vykort, sms och meddelande, skylt och annons, formulär, sång | 450–550 (≈ 500; A1-listans kärna) | 60–100 / 80–120 | 30–60 | Goethe **A1** (Start Deutsch 1), i liten skala: kort Lesen och Hören, formulär + meddelande |
| **2** | vardag och klockan, bostad och rum, handla och priser, staden och vägen, väder och årstider, kropp och hälsa (början), födelsedagar och högtider, helgen (perfekt) | + intervju, tidtabell, notis, inbjudan, mejl, dikt | 500–600 (≈ 1 050; hela A1-listan) | 100–150 / 120–180 | 40–100 | Goethe **A1** fullständigt |
| **3** | resor och trafik, semester (i dåtid), mat och restaurang, kläder och shopping, skola och schema, medier och mobilen, traditioner i D-A-CH, dialekter och regional variation (Moin, Grüezi, Servus) | + enkel nyhet, berättelse i dåtid, faktatext om en plats eller person, forumsinlägg, diskussion | 700–900 (≈ 1 850; A2-listans kärna) | 150–200 / 200–300 | 60–140 | Goethe **A2** |
| **4** | (befintlig `de4`) vardag, bo, mat och pengar, resor, skola och framtid, musik och sport, hälsa, fester | + reportage, tidningsartikel, insändare, novell- eller romanutdrag, film | 800–900 (≈ 2 700; hela A2 + del av B1) | 180–230 / 250–350 | 80–150 | Goethe **B1** (delmål), gärna också A2 för repetition |
| **5** | (befintlig `de`) identitet, utbildning och arbete, medier, miljö, samhälle och politik, kultur, hälsa, D-A-CH | + populärvetenskap, manual, recension, formellt mejl, radioinslag | 1 000–1 200 (≈ 3 800; B1-listan) | 200–250 / 250–400 | 120–200 | Goethe **B2** (och B1 för den som behöver) |
| **6** | (befintlig `de6`) studier och ansökan, vetenskap, politik och historia, litteratur och epoker, arbete och ekonomi, musik och scen, etik, migration | + debatt, föredrag, formellt brev och ansökan, dramatik, äldre litteratur | 1 000–1 200 (≈ 4 900) | 250–350 / 350–550 | 150–250 | Goethe **B2**, **telc B2** (Sprachbausteine) |
| **7** | se avsnitt 4.2 | + föreläsning, utredande text, avtal och villkor, grafik med kommentar, retoriska texter | 1 000–1 500 (≈ 6 000; B2 → C1) | 300–450 / 450–700 | 200–350 | **TestDaF** och Goethe **C1** (B2 som repetition) |

Kumulativa tal räknar med mitten av intervallet. Det viktiga är inte exakta tal utan att **grunden är täckt**: de vanligaste 2 000 orden ska finnas i steg 1–4.

---

## 3. Granskning av Tyska 4, 5 och 6

### 3.1 Siffror (räknat i kursfilerna 2026-09-29)

| | Tyska 4 (`de4`) | Tyska 5 (`de`) | Tyska 6 (`de6`) |
|---|---|---|---|
| Steg / GERS enligt Skolverket | 4 / A2.2 | 5 / B1.1 | 6 / B1.2 |
| `level` i lang.js | A2 → B1 | B1 → B2 | B1 → B2 |
| Ord i `words.txt` | 711 (8 kapitel à 75–89 + 54 fraser) | 2 087, varav 1 635 utan musikteori (8 kapitel à 82–96, fraser 67, verb med prep. 51, ordbildning 100, fasta uttryck 100, allmänt B1–B2 300, frekvensord 300, musik 66) + 452 musikteori | 1 109 (8 kapitel à 127–133 + 70 fraser) |
| Överlapp med andra kurser | 0 | 0 | 0 |
| Lästexter (snitt ord, frågor) | 11 (252, 6) inkl. 3 litteratur | 15 (249, 6) inkl. 3 litteratur | 14 (424, 7–8) |
| Hörtexter | 16 (194 ord) | 18 (217) | 16 (280) |
| Berättelser / kultur | 8 (148) / 8 (112) | 8 (178) / 13 (125) | 8 (267) / 9 (162) |
| Skrivuppgifter (längd) | 25 (60–150) | 25 (90–250) | 24 (100–250) |
| Grammatikområden (frågor) | 10 + err (270) | 13 + err (470) | 10 + err (309) |
| `secs` (grammatik per kapitel) | saknas | saknas | finns |
| Provträning | Goethe B1, 51 uppgifter | Goethe B2, 43 uppgifter | Goethe B2, 43 uppgifter |

### 3.2 Ordförråd: frekvensmätning mot DeReWo

Enordsposterna i de tre kurserna (utan musikteori, ca 3 100 lemman) jämförda med DeReWo:s vanligaste lemman (bara innehållsord: artiklar, pronomen, prepositioner och konjunktioner borträknade, eftersom de lärs via grammatiken). Fraser och flerordsuttryck är inte med, så täckningen är något underskattad.

| DeReWo, de N vanligaste | Innehållsord | Finns i de4 + de + de6 | Andel |
|---|---|---|---|
| 1 000 | 886 | 393 | 44 % |
| 2 000 | 1 850 | 810 | 44 % |
| 4 000 | 3 788 | 1 354 | 36 % |
| 5 000 | 4 764 | 1 538 | 32 % |

Bland de 1 000 vanligaste saknas 493 innehållsord, till exempel *sein, haben, können, müssen, geben, sagen, kommen, gehen, machen, sehen, finden, bleiben, liegen, nehmen, bringen, sprechen, wohnen, das Jahr, die Zeit, das Kind, die Frau, der Mann, die Stadt, das Haus, die Woche, die Frage, die Arbeit, das Geld, die Schule, die Familie, heute, gestern, jetzt, groß, klein, jung, wichtig, schnell, einfach, schwer*, veckodagar, månader och räkneord. Bland ord 1 000–3 000 saknas bland annat *der Tisch, der Baum, der Hund, der Brief, die Farbe, heiß, langsam, der Verkehr, das Fernsehen*.

Slutsats: Tyska 4 förutsätter A1–A2-grunden (det står också i kommentaren i `de4/words.txt`), men **ingen kurs lär ut den**. En elev som börjar i Tyska 4 utan grund har luckor i de allra vanligaste orden, och ingen övning i appen fångar det. De ord som finns är väl valda för B1–B2-teman, och `de` har redan 300 frekvensord (`dh`), men de ligger mest i intervallet 1 000–5 000.

### 3.3 Nivå per kurs

**Tyska 4 (`de4`): rätt nivå, lite över A2.2.** Teman, texttyper och textlängder stämmer med steg 4 (lästext 252 ord, hörtext 194, skriv 80–150). Grammatiken går något över steg 4 (passiv, relativsatser, konjunktiv II), vilket passar provmålet B1.

Brister:

1. **Grammatik som saknas:** Futur I, zu-infinitiv och um … zu, genitiv (igenkänning), verb med preposition, präteritum av starka verb (bara war/hatte/musste övas). Både Goethe A2 och B1 förutsätter dessa.
2. **`secs` saknas** i `grammar.json` (kursmall paket 9).
3. **Grunden (A1–A2)** repeteras inte: ingen övning på presens, kasus med artiklar, modalverb, delbara verb eller V2/satsram. En diagnostisk repetition i början (eller Tyska 1–3) behövs.
4. **Ord:** 711 är inom mallen för steg 4 (800–900 med fraser är målet), men se 3.2.
5. **Provet:** Goethe B1 med 51 uppgifter är bra. Ett **Goethe A2-prov** saknas för den som vill kontrollera grunden först.

**Tyska 5 (`de`): rätt nivå (B1.1 → B2).** Texter (250 ord läs, 217 hör), skriv (120–250) och grammatik (13 områden, inklusive genitiv, particip och tvådelade bindeord) ligger rätt.

Brister:

1. **Grammatik:** Futur I/II saknas. Konjunktiv I ligger ihop med konjunktiv II i ett område (`konj`); det räcker för igenkänning i steg 5.
2. **`secs` saknas.**
3. **Ordlistans upplägg:** 1 635 ord är över mallen (1 000–1 200), vilket är bra för B2-målet. Men 452 musikteoriord ligger i samma kurs; de är värdefulla för elevens mål men är inte allmänt ordförråd och bör inte räknas som steg 5-ord.
4. **Provet:** bara Goethe B2. **Goethe B1** hade passat bättre som första prov i steg 5 (B1.1), med B2 som mål.

**Tyska 6 (`de6`): rätt nivå, i överkant (B1.2 → B2).** Lästexter på 424 ord och hörtexter på 280 ord ligger mitt i mallen för steg 6. Grammatiken (Konjunktiv I, K II i dåtid, passiversättning, participattribut, nominalstil, NVV, genitivprepositioner, modalpartiklar, subjektiva modalverb, textbindning) är **B2-grammatik** och täcker det mesta av Profile Deutsch B2.

Brister:

1. **Futur II** (förmodan) och **Zustandspassiv** saknas som egna områden (ett par frågor om als ob och modalverb i perfekt finns).
2. **Provet** är samma format som i `de` (Goethe B2, 43 uppgifter). Här borde **telc B2** (Sprachbausteine) eller en första **TestDaF**-del läggas till, så att eleven kan välja prov.
3. **Ord:** 1 109 är inom mallen, men allmänt ordförråd (DeReWo 2 000–5 000) täcks bara till cirka en tredjedel.

### 3.4 Räcker Tyska 4 + 5 + 6 till B2?

| Område | Räcker? | Motivering |
|---|---|---|
| Grammatik | **Ja, nästan** | B1- och B2-grammatiken finns (utom Futur I/II, Zustandspassiv). A1–A2-grammatiken förutsätts men övas inte. |
| Ordförråd, B2-teman | **Ja** | ca 3 100 enord + ca 400 fraser på teman som motsvarar Goethe B2 (studier, arbete, medier, miljö, samhälle, kultur). |
| Ordförråd, allmänt | **Nej** | bara 44 % av de 1 000 och 36 % av de 4 000 vanligaste innehållsorden. B2 kräver att grunden sitter. |
| Läsa och lyssna | **Ja för Goethe B2**, delvis för TestDaF | textlängderna i `de6` motsvarar B2-provets. Det saknas föreläsningar på 3–5 minuter, grafik och akademiska texter (TestDaF). |
| Skriva | **Ja för Goethe B2** | 150- och 100-ordsuppgifter finns. TestDaF:s 200+ ord och sammanfattning av grafik saknas. |
| Tala | **Delvis** | talövningarna finns i provträningen, men appen kan inte bedöma uttal och flyt. |

**Slutsats:** Med grunden på plats (Tyska 1–3, eller en snabbrepetition av A1–A2 för den som redan kan) räcker kedjan till **Goethe B2 och telc B2**. För **TestDaF TDN 4** behövs Tyska 7.

---

## 4. Förslag: kedjan Tyska 1 → 7

### 4.1 Kedjan

| Kurs | Kod | Steg | `level` | Provträning | `nextCourse` | Viktigast |
|---|---|---|---|---|---|---|
| Tyska 1 | `de1` | 1 | A1 | Goethe A1 (liten) | de2 | presens, kasus nom./ack., V2, 500 vanligaste orden |
| Tyska 2 | `de2` | 2 | A1 → A2 | Goethe A1 | de3 | modalverb, delbara verb, dativ, perfekt |
| Tyska 3 | `de3` | 3 | A2 | Goethe A2 | de4 | växelprepositioner, bisatser, adjektiv, dåtid i text |
| Tyska 4 | `de4` | 4 | A2 → B1 | Goethe B1 (+ A2) | de | finns |
| Tyska 5 | `de` | 5 | B1 → B2 | Goethe B1 och B2 | de6 | finns |
| Tyska 6 | `de6` | 6 | B1 → B2 | Goethe B2, telc B2 | de7 | finns |
| Tyska 7 | `de7` | 7 | B2 → C1 | TestDaF, Goethe C1 | – | se 4.2 |

Principer för de nya kurserna:

- **Inga ord dubbelt:** de nya kurserna får inte ha ord som redan finns i `de4`, `de` eller `de6` (samma princip som i dag, där överlappet är 0). Ett byggtest som varnar för dubbletter mellan tyska kurser vore bra.
- **Frekvens först:** Tyska 1–3 ska tillsammans täcka i stort sett alla innehållsord bland DeReWo:s (eller Jones och Tschirners) 1 000–1 500 vanligaste, plus A1–A2-temaord. Mät täckningen i ett skript (DeReWo är CC BY-NC och får användas med källangivelse).
- **Arv:** Tyska 1–3 ärver bindeord, verb och tempusigenkänning från `de` (som `de4` gör), men med filter: bara presens i Tyska 1, + perfekt i Tyska 2, + präteritum av sein/haben/modalverb i Tyska 3.
- Kapitelstruktur enligt `kursmall.md`: 8 kapitel + ett fraskapitel, `secs` från början, uttal och kapitelmål.

### 4.2 Spec per ny kurs

#### Tyska 1 (`de1`, steg 1, A1.1)

| | Innehåll |
|---|---|
| Kapitel | 1 Hallo! (hälsa, presentera sig, alfabetet, siffror 0–20) · 2 Familie und Freunde · 3 Schule und Unterricht · 4 Mein Tag (klockan, veckodagar) · 5 Essen und Trinken · 6 Freizeit und Hobbys · 7 Kleidung und Farben · 8 Deutschland, Österreich, Schweiz (länder, språk, städer) · Redemittel |
| Ord | 450–550 (55–65 per kapitel), de vanligaste verben, substantiven och adjektiven. Genus och plural på alla substantiv (redan stöd i `61-gender.js`). |
| Grammatikområden | presens regelbundna; sein och haben; starka verb (e → i, a → ä); artikel och genus; plural; nominativ och ackusativ (ein/einen/kein); possessiv (mein, dein); nicht eller kein; W-frågor; V2-ordföljd |
| Texter | 8 hörtexter (60–100 ord, dialoger och meddelanden), 5–8 lästexter (80–120 ord: profil, skylt, annons, schema, vykort), 4–6 berättelser i presens, 6 kulturtexter (du och Sie, skolan i Tyskland, Brot und Brötchen, D-A-CH) |
| Skriv | 16 uppgifter, 30–60 ord: presentera dig, vykort, sms, formulär, beskriv din familj |
| Sång | 2 sånger (folkvisor ur allmän egendom, t.ex. *Alle Vögel sind schon da*) |
| Prov | Goethe A1: Lesen och Hören i liten skala (1 uppgift per del), formulär + kort meddelande, Sprechen del 1 |

#### Tyska 2 (`de2`, steg 2, A1.2)

| | Innehåll |
|---|---|
| Kapitel | 1 Wieder da! (helgen, vad jag gjorde: perfekt) · 2 Wohnen (rum, möbler) · 3 Einkaufen (priser, mängder) · 4 In der Stadt (vägen, trafikmedel) · 5 Wetter und Jahreszeiten · 6 Körper und Gesundheit (hos läkaren) · 7 Feste und Geburtstage · 8 Ferienpläne · Redemittel |
| Ord | 500–600 (60–70 per kapitel), så att A1-listans ca 650 enheter är täckta efter kursen |
| Grammatikområden | modalverb; delbara verb; imperativ; perfekt med haben och sein; präteritum war/hatte; dativ efter mit, bei, von, zu, nach, aus, seit; personliga pronomen i dativ; tids- och platsprepositioner som fraser; denn och deshalb; jämförelse (början) |
| Texter | 8–12 hörtexter (100–150 ord: intervju, utrop på stationen, telefonmeddelande), 6–8 lästexter (120–180 ord: tidtabell, inbjudan, mejl, notis, recept), 5 berättelser (perfekt), 6 kulturtexter (Karneval, Weihnachtsmarkt, Mülltrennung, tyskan i världen) |
| Skriv | 16–20 uppgifter, 40–100 ord: mejl, inbjudan och svar, beskriv vägen, ursäkt |
| Sång och dikt | 2 sånger och 1 dikt (allmän egendom, kort) |
| Prov | Goethe A1 fullständigt (3 delar per modul, Schreiben, Sprechen) |

#### Tyska 3 (`de3`, steg 3, A2.1)

| | Innehåll |
|---|---|
| Kapitel | 1 Erinnerungen (barndom, präteritum av modalverb) · 2 Reisen (planera, boka, problem) · 3 Im Restaurant und in der Küche · 4 Mode und Einkaufen · 5 Schule, Sprachen, Zukunftspläne · 6 Medien und Handy · 7 Traditionen in D-A-CH · 8 Dialekte und Regionen · Redemittel |
| Ord | 700–900 (80–100 per kapitel), så att A2-listans kärna (ca 1 300) nås tillsammans med Tyska 1–2, och helst 80 % av DeReWo:s 1 000 vanligaste innehållsord |
| Grammatikområden | perfekt (alla vanliga verb, även trenn-/untrennbar); präteritum av modalverb; reflexiva verb; verb med dativ; växelprepositioner; adjektivändelser (början: bestämd artikel); komparativ och superlativ; bisatser med weil, dass, wenn; indirekta frågor (ob, W-ord); datum och ordningstal |
| Texter | 12–16 hörtexter (150–200 ord, två per kapitel, en inte-dialog: radionotis, röstmeddelande), 8–12 lästexter (200–300 ord: enkel nyhet, forumsinlägg, faktatext om en stad, berättelse i dåtid), 6–8 berättelser, 8 kulturtexter (Schweizerdeutsch, österrikiska ord, Mauerfall kort) |
| Skriv | 24 uppgifter, 60–140 ord: berättelse i dåtid, forumsinlägg, halvformellt mejl (till en lärare), restaurangrecension |
| Litteratur | 3–4 uppgifter: sång, dikt, kort utdrag (Grimm, allmän egendom) |
| Prov | **Goethe A2** i appens provformat: Lesen 4 delar (20 items, 30 min), Hören 4 delar (20 items, ca 30 min), Schreiben 2 delar (personligt och halvformellt meddelande), Sprechen 3 delar. `pass: 60`. Krav 45 + 15 i skriftligt och muntligt kan visas som information. |

#### Tyska 7 (`de7`, steg 7, B2.1 mot C1)

Mål: att eleven klarar **Goethe B2 säkert** och kan ta **TestDaF (TDN 4)** eller börja mot **Goethe C1**, och att hon kan studera på tyska vid en musikhögskola (föreläsningar, seminarier, mejl till lärare, studieordningar och avtal).

| | Innehåll |
|---|---|
| Kapitel | 1 Studieren in Deutschland (Hochschulsystem, Studienordnung, Immatrikulation) · 2 Vorlesung und Seminar (anteckna, referat, Hausarbeit) · 3 Musikwissenschaft und Interpretation (analys, epoker, kritik) · 4 Kulturpolitik und Förderung (stipendier, stiftelser, orkestrarnas ekonomi) · 5 Wissenschaft und Gesellschaft (studier, grafik, statistik) · 6 Recht und Verträge (hyresavtal, arbetsavtal, konsertavtal, GEMA och upphovsrätt) · 7 Sprache und Rhetorik (tal, debatt, argumentation) · 8 Zeitgeschichte und Erinnerungskultur · Redemittel für die Hochschule |
| Ord | 1 000–1 500 (110–150 per kapitel): akademiskt ordförråd (Wissenschaftssprache: untersuchen, belegen, darstellen, die Hypothese), Nomen-Verb-Verbindungen, fasta uttryck, **frekvensord 3 000–6 000** som saknas i tidigare kurser (mät mot DeReWo eller Jones och Tschirner) |
| Grammatikområden | nominalstil ⇄ verbalstil (omskrivning); modalverb i perfekt och Doppelinfinitiv; Futur II (förmodan); passiv i alla former inklusive Zustandspassiv och med modalverb; konjunktiv I i referat; ordbildning (prefix och suffix); adjektiv med preposition; mittfältets ordföljd; konnektorer i akademisk text; stilnivå (formellt, neutralt, vardagligt) |
| Texter | 16 hörtexter (300–450 ord), varav minst 6 **föreläsningar eller föredrag** (3–5 min) och 4 seminariediskussioner; 16 lästexter (450–700 ord): populärvetenskaplig artikel, utredande text, avtal och villkor, text med grafik, kommentar, recension; litteratur i olika genrer (Kafka, Rilke, Heine, Büchner, Schnitzler, Th. Mann bara som länk) |
| Skriv | 24 uppgifter, 200–350 ord: argumenterande text (TestDaF, minst 200 ord), **sammanfattning av grafik** (100–150 ord), formellt brev (ansökan, klagomål), referat med källa, Stellungnahme (C1) |
| Nya övningstyper (kod) | **Sprachbausteine** (lucktext med flerval, telc), **grafikbeskrivning** (bild eller tabell + skrivuppgift), **kortsvar** på hörförståelse (skriv 1–3 ord, TestDaF), talade svar med tidsgräns (inspelning utan bedömning) |
| Prov | **TestDaF** (4 delar, TDN-skala visas som 3/4/5 utifrån andel rätt) och **Goethe C1** (Lesen, Hören, Schreiben, Sprechen), med Goethe B2 och telc B2 ärvda från `de6` som repetition |

### 4.3 Ändringar i de befintliga kurserna (i prioritetsordning)

1. **Nytt grammatikområde Futur I och II**: Futur I i `de4`, Futur II (förmodan) i `de6`.
2. **`de4`:** områdena zu-infinitiv/um … zu, verb med preposition (början) och genitiv (igenkänning); präteritum av starka verb i tempusövningen; en **A1–A2-repetition** (presens, kasus med artiklar, modalverb, delbara verb, satsram) för den som börjar i Tyska 4.
3. **`secs`** i `de4` och `de` (finns redan i `de6`).
4. **`de6`:** Zustandspassiv som eget område (eller i `passiv`); **telc B2** i `exam.json` (Sprachbausteine är den del som skiljer sig).
5. **`de`:** Goethe B1 som första prov (kan ärvas från `de4`), Goethe B2 som mål.
6. **Ordtäckning:** ett skript som mäter täckningen mot DeReWo (1 000/2 000/4 000 vanligaste) för alla tyska kurser, och fyller luckorna i rätt steg: 1–1 000 i Tyska 1–3, 1 000–3 000 i Tyska 3–5, 3 000–5 000 i Tyska 5–7.
7. **Musikteoriorden** i `de` (452 ord) kan på sikt flyttas till en egen tilläggsdel som inte räknas in i steg 5 (kräver `--allow-removed`, eleven förlorar framstegen, så gör det bara om det verkligen behövs; alternativt låt dem ligga kvar och räkna bort dem i statistiken).

---

## Källor

- Goethe-Institut, *Goethe-Zertifikat A1: Start Deutsch 1, Durchführungsbestimmungen* (stand 1 september 2025): https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_A1_Start_Deutsch_1.pdf och Modellsatz: https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf
- Goethe-Institut, *Goethe-Zertifikat A2 und A2 Fit in Deutsch, Durchführungsbestimmungen* (stand 1 september 2025): https://www.goethe.de/pro/relaunch/prf/lv/Durchfuehrungsbestimmungen_A2.pdf
- Goethe-Institut, B1 och B2: se källorna i `docs/provformat.md` (Modellsätze och Durchführungsbestimmungen B2, stand 1 september 2025).
- Goethe-Institut, *Goethe-Zertifikat C1, Durchführungsbestimmungen*: https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C1.pdf , Modellsatz: https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf , Prüfungsziele und Testbeschreibung: https://www.goethe.de/pro/relaunch/prf/en/Handbuch_Pruefungsziele_Testbeschreibung_C1.pdf
- Goethe-Institut, Wortlisten: A1 https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf , A2 https://www.goethe.de/pro/relaunch/prf/da/Goethe-Zertifikat_A2_Wortliste.pdf , B1 https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf (storlekar ur förorden; listorna är inte kopierade)
- Glaboniat, M., Müller, M., Rusch, P., Schmitz, H. och Wertenschlag, L., *Profile deutsch. Lernzielbestimmungen, Kannbeschreibungen und kommunikative Mittel für die Niveaustufen A1–C2*, Langenscheidt 2005 / Klett: https://www.klett-sprachen.de/profile-deutsch/t-1/9783126065184
- telc gGmbH, *Handbuch Deutsch B2*: https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf
- g.a.s.t., *Aufbau des digitalen TestDaF*: https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/ och *TestDaF-Niveaustufen*: https://www.testdaf.de/de/teilnehmende/warum-testdaf/testdaf-niveaus-tdn/
- Jones, R. L. och Tschirner, E., *A Frequency Dictionary of German: Core Vocabulary for Learners*, Routledge 2006; 2:a uppl. Tschirner och Möhring 2019: https://www.routledge.com/A-Frequency-Dictionary-of-German-Core-Vocabulary-for-Learners/Tschirner-Mohring/p/book/9781138659780
- Institut für Deutsche Sprache, *DeReWo – Korpusbasierte Grund-/Wortformenlisten* (version 2012-12-31, 320 000 grundformer, CC BY-NC): https://www.ids-mannheim.de/digspra/pb-s1/projekte/methoden-neu/derewo/
- Skolverket och Milton och Alexiou: se källorna i `docs/kursmall.md`.
