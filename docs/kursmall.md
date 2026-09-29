# Kursmall: vad en kurs i Glosor ska ha

Backloggpunkten "Franska 3 som mall för de andra kurserna" (P1) och underlag för "Alla tre språken från steg 1 till steg 7" (P2).

Mallen bygger på hur läroboken i Franska 3 är uppbyggd (de sidor som är fotade: s. 8–69, 98–131, 148–153, 182–191 och minigrammatiken) och på det som finns i appen. Repot är publikt, så här återges **inga** av bokens texter, övningar eller meningar. Strukturen beskrivs med egna ord, och alla exempel är egna.

Siffrorna räknades 2026-09-27 ur `languages/*/words.txt`, `languages/*/content/*.json`, `languages/*/videos.json` och det privata bokmaterialet (`languages/fr/book/`).

---

## 1. Mallen: så är ett kapitel i läroboken uppbyggt

### 1.1 Kapitlets delar, i ordning

Boken har tolv tematiska kapitel på 12–18 sidor (i snitt ungefär 15), och sist en minigrammatik på ungefär 40 sidor. Ett fullständigt kapitel har följande delar:

1. **Öppningsuppslag:** en helsidesbild, kapitlets titel och en ruta med kapitelmål i tre delar:
   - *"I det här kapitlet ska jag utveckla förmågan att …"*: 2–3 kommunikativa mål. Ett av dem gäller läsa/lyssna, ett tala/diskutera och ett skriva, till exempel "berätta om en resa", "diskutera en samhällsfråga" eller "skriva en intervju".
   - *"… och lära mig"*: ett ordområde och 1–3 grammatikmoment.
   - *"… samt repetera"*: 1–3 moment från tidigare kapitel eller kurser.
2. **Huvudtext** (1–3 sidor): 250–600 ord, med glosruta i marginalen. Texttyperna varierar mellan kapitlen: berättelse i jagform, dialog, novell, resedagbok och reportage, porträtt av en person eller sakprosa om ett land eller en region.
3. **Övningar på texten:** frågor på texten (svara med hela meningar), *vrai ou faux*, sammanfatta med givna nyckelord och "skriv slutet på berättelsen".
4. **Ordförråd:** tematiska ordlistor med bilder (yrken, transportmedel, egenskaper, frukt och grönsaker …), översätt ord och uttryck och bilda egna meningar.
5. **Grammatikmoment** (rubriken *Grammaire*): en regelruta med tabell, och 2–4 slutna övningar (fyll i, översätt, gör om, stryk under formerna i texten), ofta med hänvisning till minigrammatiken.
6. **Hörövningar** (*Écoutez +* och *Écoutez ++*): två svårighetsnivåer. Uppgifterna är frågor under lyssningen, *sant eller falskt* om korta meddelanden, eller att följa en beskrivning på en karta.
7. **Muntligt** (*Parlez*, *Discutez*, *Parlez et communiquez*): parövningar, rollspel och improvisation (till exempel en scen i en biljettlucka), diskussionsfrågor och intervjuer.
8. **Skriva** (*Écrivez*): 2–5 uppgifter per kapitel, från korta (fem meningar med givna verb) till längre (en presentation, ett brev, en dagbok, en intervju, ett personligt brev till en arbetsgivare, en dikt).
9. **Uttal** (*Prononcez*, numrerat 1, 2, 3 … genom boken): ett uttalsmoment per kapitel.
10. **Utvärdering:** en ruta som speglar kapitelmålen, *"I det här kapitlet har jag utvecklat förmågan att …"* och *"… och lärt mig (eller repeterat)"*, med samma punkter som öppningsrutan.
11. **Plussidor efter utvärderingen:** 1–2 uppslag med kultur och fördjupning, till exempel sakprosa om en ort eller ett land, fransktalande länder i världen eller en högtid. Här ligger ofta också **litteratur och sång**: ett romanutdrag, en dikt, en sångtext (med en egen symbol för sång) eller en musikal, med frågor och en skrivuppgift.

Minigrammatiken har 34 avsnitt: artiklar, substantiv, adjektiv, komparation, räkneord och klockan, pronomen (personliga, possessiva, reflexiva, demonstrativa, interrogativa, relativa, *tout*, *y*, *en*), verbens temaformer, alla tempus från presens till konditionalis, imperativ och konjunktiv (bara formerna), reflexiva verb, participets böjning, gerundium, passiv, verbtabeller (cirka 40 oregelbundna verb), prepositioner och ordföljd (frågor, negation). Kapitlens grammatikrutor hänvisar dit. Se `languages/fr/book/minigrammatik/innehall.md` (privat).

### 1.2 Siffror ur boken (fotade kapitel)

Glosor är bokens glosrutor som de har förts in i appen (`words.txt` i kursen plus `book/kapNN/words.txt`). Texter är lästexter på franska i boken, utan sånger och dikter. Skriv/muntligt är öppna uppgifter (`prompts.json`, där parövningar har gjorts om till skrivuppgifter). Slutna är övningar av typen lucka och översätt (`grammar-bok.json`).

| Kap | Sidor (fotade) | Glosor | Texter (ord) | Sång/dikt/litteratur | Skriv/muntligt | Slutna övningar (frågor) | Högsta övningsnr |
|---|---|---|---|---|---|---|---|
| 1 | 8–21 (14, hela) | 156 | 2 (290, 350) | 1 sång | 10 | 2 (18) | 13 |
| 2 | 22–39 (18, hela) | 157 | 3 (460, 200, 250) | 1 sång | 12 | 6 (34) | 19 |
| 3 | 40–51 (12, hela) | 99 | 2 (385, 285) | – | 9 | 7 (54) | 18 |
| 4 | 52–67 (16, hela) | 70 | 5 (375, 100, 265, 135, 100) | 1 sång, 2 litterära utdrag | 9 | 11 (62) | 18 |
| 7 | 100–113 (14, hela) | 90 | 2 (530, 250) | 2 dikter | 13 | 6 (33) + 9 fraser | 18 |
| 8 | 114–131 (18, hela) | 123 | 4 (590, 450, 325, 240) | – | 8 | 8 (45) | 17 |
| 12 | 182–191 (10) | 95 | 1 (290) | 1 dikt, 1 sång, 1 musikal | 9 | 4 (21) | 21 |
| 5, 6, 10 | 2–6 sidor var | 20–58 | 0–1 | 2 romanutdrag (kap 6) | 0–6 | 0–8 | – |

**Per fullständigt kapitel (kap 1–4, 7, 8):**

- **Glosor:** 70–160, i snitt cirka **115**. Det blir ungefär 8 glosor per sida, alltså cirka **1 400 glosor för hela boken**. Många av dem är receptiva textglosor, och den aktiva kärnan är mindre.
- **Lästexter:** 2–5, i snitt cirka **3**. En huvudtext på 250–600 ord och 1–3 kortare texter på 100–300 ord. Till det kommer sång, dikt eller litteratur i 5 av 7 kapitel.
- **Hörövningar:** 1–3 per kapitel (Écoutez + och ++). Ljudet finns inte i appen.
- **Numrerade övningar:** 17–21 per kapitel. Av dem är cirka **10 skriv- eller muntliga uppgifter** och cirka **6–8 slutna övningar** (översätt, luckor) med 20–60 frågor.
- **Grammatik:** 1–3 nya moment per kapitel plus 1–3 som repeteras.
- **Uttal:** 1 moment.
- **Kapitelmål och utvärdering:** 1 av varje.

**Grammatik per kapitel** (enligt kapitelmålen, bokens övningar och `secs` i `languages/fr/grammar.json`):

| Kap | Tema (egna ord) | Grammatik |
|---|---|---|
| 1 | fritid, sport, att presentera sig | presens av regelbundna och reflexiva verb, räkneord, alfabetet (repetition) |
| 2 | ankomst till en storstad, resor, kollektivtrafik | passé composé (être/avoir), *venir de* + infinitiv, *ça fait … que* |
| 3 | arbete, egenskaper, anställningsintervju | adjektivens böjning, delningsartikel, negationer |
| 4 | Afrika, identitet, litteratur | objektspronomen, possessiva, stor eller liten bokstav, prepositioner med länder |
| 7 | kärlek och besvikelse, resa med tåg, jul | reflexivt "varandra", indirekt objekt, prepositioner för plats |
| 8 | resor och äventyr, miljöhot, Québec, franskan i världen | futur simple och futur proche, frågor (tre sätt), prepositioner med länder |
| 10 | djurens rättigheter, mat, demonstration | genitiv med *de*, aller-gruppen i passé composé, direkt objekt |
| 12 | den omöjliga kärleken, en klassisk författare | aktiv och passiv form |

**Texttyper i boken:** berättelse, dialog, novell, resedagbok, reportage, porträtt, sakprosa om land eller region, brev, sms, intervju, annonser och utrop (hörövning), dikt, sångtext, romanutdrag och musikal.

**Övningstyper i boken:** frågor på texten, vrai/faux, sammanfatta med nyckelord, skriv slutet, översätt ord och meningar, luckor (verbform, preposition, artikel, pronomen), gör om (till exempel aktiv till passiv, fråga på tre sätt), para ihop ord och bild, bilda meningar med givna ord, beskriv en bild, rollspel och improvisation, intervju, diskussion, presentation (land, person, sig själv), dikt och sångtext, hörövning i två nivåer och uttal.

### 1.3 Så är boken översatt till appen (Franska 3)

| Bokens del | I appen |
|---|---|
| Glosruta | `words.txt` (avsnitt per kapitel, med exempelmening, ursprung och ordagrant) → glosquiz, Meningar, Diktamen, Kapitelprov |
| Huvudtext och kortare texter | `reading.json`: flervalsfrågor (helhet/detalj/tolkning), Vrai/Faux, tryckbara glosor |
| Écoutez | `listening.json`: egen dialog med uppläsning och frågor |
| Plussidor (kultur) | `culture.json`: kort fakta, en fråga och jämförelse med Sverige, med Claudes kommentar |
| Écrivez, Parlez, frågor på texten | `prompts.json`: skrivuppgift med checklista (bindeord, kapitelord, tempus) och exempeltext |
| Grammaire | `grammar-*.json` (luckor och översätt) + `regler.json` (regelsida) + verbspel |
| Minigrammatik | `regler.json` (egna ord, med hänvisning till sidan) |
| Samtalsfraser, rollspel | `phrases.json` (situation → rätt replik) och Skugga |
| Litteratur och sång | `prompts.json` (sammanfattning med egna ord, uppmaning att lyssna eller läsa, frågor). Texten skrivs inte av |
| Berättelse med tempus | `stories.json` (välj tempus och bindeord i luckor) |
| **Uttal (Prononcez)** | **saknas.** Bara Skugga och uppläsning finns |
| **Kapitelmål och utvärdering** | **saknas** |
| Hörövning i två nivåer | saknas (alla hörtexter har en nivå) |

### 1.4 Checklista: det här ska en kurs ha

En kurs i appen har **8 tematiska kapitel och 1 fraskapitel**, som Tyska 4 och Italienska 1–2. Siffrorna gäller en hel kurs (100 poäng), på nivån för steg 3–4. Hur de skalas för andra steg står i avsnitt 2.

| # | Del | Per kapitel | Per kurs (steg 3–4) | Fil |
|---|---|---|---|---|
| 1 | **Kapitelmål och utvärdering**: 2–3 "förmågan att …", ordområde, 1–3 grammatikmoment, repetition | 1 | 8 | ny typ (kräver kod) |
| 2 | **Glosor** med exempel, ursprung och ordagrant för fraser | 80–100 | 700–900 | `words.txt` |
| 3 | **Hörtexter** (dialog, intervju, meddelande) med 4–6 frågor | 2 | 16 | `listening.json` |
| 4 | **Lästexter** med 5–8 frågor och glosor, minst 4 olika texttyper per kurs | 1–2 | 10–12 | `reading.json` |
| 5 | **Kulturtext** (plussida) med fråga och jämförelse med Sverige | 1 | 8–10 | `culture.json` |
| 6 | **Berättelse** med luckor för tempus och bindeord | 1 | 8 | `stories.json` |
| 7 | **Litteratur, sång eller dikt**: länk och sammanfattning, eller egen text om upphovsrätten tillåter | – | 3–4 | `prompts.json` / `reading.json` |
| 8 | **Skrivuppgifter**: en kort (meningar med givna ord), en mellan (berätta, beskriva), en friare (brev, intervju, slutet på en text, åsikt) | 3 | 24 | `prompts.json` |
| 9 | **Muntligt**: samtalsfraser (situation → replik), skugga, rollspel som skrivuppgift | – | 40–50 fraser | `phrases.json` |
| 10 | **Grammatikområden** med luckor och översätt, kopplade till kapitel (`secs`) | 1–2 nya | 10–14 områden à 20–30 frågor (250–400) | `grammar-*.json`, `grammar.json` |
| 11 | **Regelsida** per grammatikområde | – | lika många som områdena | `regler.json` |
| 12 | **Verbspel** i 2–3 nivåer (tempus för steget) | – | 2–3 | `lang.js` |
| 13 | **Uttal**: ett ljud eller mönster per kapitel, med ordpar och Skugga | 1 | 8 | ny typ (kräver kod) |
| 14 | **Videor** (kontrollerade) | 2–3 | 16–24 | `videos.json` |
| 15 | **Språkprov** i provets format, från steg 4–5 | – | 15–20 uppgifter | `exam.json` |

Mängden skrivuppgifter är lägre än i boken (cirka 10 per kapitel), eftersom många av bokens uppgifter är muntliga parövningar som ersätts av fraser, Skugga och Claude som samtalspartner.

---

## 2. Nivåanpassning: steg 1–7

### 2.1 Steg, Gy25-kurs och GERS

Skolverkets kommentarmaterial jämför stegen med GERS för betyget E: steg 1 = A1.1, 2 = A1.2, 3 = A2.1, 4 = A2.2, 5 = B1.1, 6 = B1.2 och 7 = B2.1. Två steg motsvarar alltså en GERS-nivå. Elever med högre betyg kan ligga högre.

| Steg | Gy11 | Gy25 | GERS (E) | Kurs i appen |
|---|---|---|---|---|
| 1 | Moderna språk 1 | nybörjare, nivå 1 | A1.1 | Italienska 1 |
| 2 | Moderna språk 2 | grund, nivå 1 | A1.2 | Italienska 2 |
| 3 | Moderna språk 3 | fortsättning, nivå 1 | A2.1 | Franska 3 |
| 4 | Moderna språk 4 | fortsättning, nivå 2 | A2.2 | Tyska 4, Franska 4 (`frs4`) |
| 5 | Moderna språk 5 | fördjupning, nivå 1 | B1.1 | Tyska 5 |
| 6 | Moderna språk 6 | fördjupning, nivå 2 | B1.2 | Tyska 6, Franska 6 (koden `fr4`) |
| 7 | Moderna språk 7 | fördjupning, nivå 3 | B2.1 | Franska I (universitet, `fru`, `stepAs: 7`) |

### 2.2 Centralt innehåll per steg, kort (Gy11)

| Steg | Ämnen | Texttyper, reception | Produktion och interaktion |
|---|---|---|---|
| 1 | välbekanta ämnen, vardag, intressen, personer, platser, åsikter och känslor | enkla instruerande, beskrivande och kontaktskapande texter; dialoger; berättelser och sånger; skyltar och reklam | presentationer, instruktioner, meddelanden, berättelser och beskrivningar; omformulera, gester, frågor |
| 2 | + aktiviteter och händelser, erfarenheter, sociala relationer, språkets utbredning i världen | + intervjuer; sånger och dikter; reklam, tidtabeller och notiser; att inleda och avsluta | + *sammanhängande* tal och skrift; tilltalsord; anpassa till syfte och mottagare; även digital interaktion |
| 3 | bekanta ämnen, aktuella händelser, kulturella företeelser | + regional variation; informerande, berättande och diskuterande texter; enkla nyheter; fiktion, sånger och dikter | samtal, **diskussion**; ge bekräftelse, lyssna aktivt, avsluta artigt; variera |
| 4 | + framtidsplaner, relationer, **etiska frågor**, traditioner, levnadsvillkor | + sociolektal variation; **argumenterande** texter; reportage och tidningsartiklar; **skönlitteratur**, även film | berätta, beskriva, instruera och **motivera åsikter**; följdfrågor, nya infallsvinklar; **sambandsord** för sammanhängande text |
| 5 | + samhälls- och arbetsliv, egen utbildning; innehåll och form i fiktion; målspråkets ställning i världen | varierande tempo, dialekter; rapporterande texter; intervjuer, reportage, manualer, enkel populärvetenskap; källkritik; kollokationer | även **formella** sammanhang: återge, förklara, värdera och diskutera; textbindning och struktur |
| 6 | + konkreta och abstrakta ämnen, etiska och existentiella frågor; film och litteratur, **författarskap och epok**; politik och historia | relativt snabbt tal; komplexa och formella texter; föredrag, debatter, **formella brev**; dikter och dramatik, även äldre verk | resonera, argumentera, **ansöka**, återge och sammanfatta; debatt; anpassa efter genre |
| 7 | teoretiska och komplexa ämnen, vetenskapliga inslag, fördjupningsområde; kulturyttringar i samtid och historia | snabbt tal; föreläsningar, avtalstexter, texter för högre studier; litteratur i olika genrer; retorik | utreda, förhandla; framställning inom fördjupningsområdet med källor; leda samtal; stil och retorik |

### 2.3 Mallen per steg

Antalet ord är nya ord i kursens `words.txt`, inte ackumulerat. Forskning om ordförråd och GERS (Milton och Alexiou 2009) anger ungefär 1 500–2 500 ord för A2 och 2 750–3 250 för B1 i engelska som främmande språk, och något färre för franska. För B2 räknas ofta 3 500–4 000 (jfr backloggen). Ackumulerat bör en elev alltså ha ungefär 1 000 ord efter steg 2, 2 000 efter steg 4 och 3 000+ efter steg 6.

| | Steg 1 (A1.1) | Steg 2 (A1.2) | Steg 3 (A2.1) | Steg 4 (A2.2) | Steg 5 (B1.1) | Steg 6 (B1.2) | Steg 7 (B2.1) |
|---|---|---|---|---|---|---|---|
| Nya ord per kurs | 450–550 | 500–600 | 700–900 | 800–900 | 1 000–1 200 | 1 000–1 200 | 1 000–1 500 |
| Ord per kapitel | 55–65 | 60–70 | 80–100 | 90–100 | 100–120 | 110–130 | 110–150 |
| Hörtext (ord) | 60–100 | 100–150 | 150–200 | 180–230 | 200–250 | 250–350 | 300–450 |
| Lästext (ord) | 80–120 | 120–180 | 200–300 | 250–350 | 250–400 | 350–550 | 450–700 |
| Frågor per text | 3–4 | 4 | 4–6 | 6 | 6 | 6–8 | 8 |
| Hörtexter per kapitel | 1 | 1–2 | 2 | 2 | 2 | 2 | 2 |
| Lästexter per kapitel | 1 | 1 | 1–2 | 1–2 | 1–2 | 2 | 2 |
| Skrivuppgifter per kapitel | 2 | 2–3 | 3 | 3 | 3 | 3 | 3 |
| Skrivlängd (ord, min–max) | 30–60 | 40–100 | 60–140 | 80–150 | 120–200 | 150–250 | 200–350 |
| Checklista i skrivuppgift | kapitelord | + 1 bindeord | + tempus | + 2–3 bindeord | + åsikt och motivering | + struktur (inledning, avslutning) | + källa, stilnivå |
| Litteratur/sång per kurs | 2 sånger | 2 sånger, 1 dikt | 3–4 (sång, dikt, kort utdrag) | 3–4 + film | 4 (fiktion, recension) | 4–5 (författare och epok, dramatik) | 4–5 (olika genrer, retorik) |
| Språkprov | – | – | – | Goethe/DELF A2–B1 (valfritt) | B1 | B1–B2 | B2 |

**Texttyper som tillkommer per steg** (varje kurs bör ha minst fyra olika):

- 1: presentation, dialog, vykort, meddelande, skylt eller annons, sång.
- 2: + intervju, tidtabell, notis, dikt, mejl.
- 3: + enkel nyhet, berättelse i dåtid, sakprosa om en plats eller person, diskussion.
- 4: + reportage, tidningsartikel, insändare, novell eller romanutdrag, film.
- 5: + populärvetenskap, manual, recension, formellt mejl.
- 6: + debatt, föredrag, formellt brev eller ansökan, dramatik, äldre litteratur.
- 7: + föreläsning, utredande text, avtal, retoriska texter.

**Grammatikprogression** (gemensam kärna; språkspecifikt i kursens plan):

| Steg | Kärna |
|---|---|
| 1 | presens (regelbundna och de vanligaste oregelbundna verben), vara och ha, artiklar och genus, plural, adjektivets kongruens eller ändelse, possessiva, frågeord, negation, *jag skulle vilja* som fras |
| 2 | perfekt eller passé composé/passato prossimo, modalverb, reflexiva verb, objektspronomen (början), imperativ, prepositioner för tid och plats, jämförelser |
| 3 | imperfekt/preteritum mot perfekt, futurum, objektspronomen och pronominella adverb (*y, en; ne, ci*), relativpronomen (enkla), bisatsordföljd |
| 4 | konditionalis och konjunktiv II i artighet och önskan, pluskvamperfekt, passiv (enkel), fler relativpronomen, sambandsord |
| 5 | konditionalis i villkor (om-satser), konjunktiv/subjonctif/congiuntivo (vanliga fall), passiv, indirekt tal (början), infinitivkonstruktioner |
| 6 | alla tempus i text, indirekt tal, participkonstruktioner, nominalisering, stilnivå |
| 7 | textbindning, komplex meningsbyggnad, ordbildning, stilistiska grepp |

---

## 3. Jämförelse per kurs

### 3.1 Siffror

Texternas längd är ord på målspråket, i snitt (min–max). Kapitel = tematiska avsnitt (utan fraskapitlet och tilläggsavsnitt).

| | Franska 3 (fr, app) | Tyska 4 (de4) | Tyska 5 (de) | Italienska 1 (it1) | Italienska 2 (it2) |
|---|---|---|---|---|---|
| Steg / GERS enligt Skolverket | 3 / A2.1 | 4 / A2.2 | 5 / B1.1 | 1 / A1.1 | 2 / A1.2 |
| `level` i lang.js | A2 → B1 | B1 | B1 → B2 | A1 | A2 |
| Ord totalt | 326 (+ 650 i bokens kapitel) | 551 | 1 695 | 536 | 531 |
| Ord per kapitel | 16–46 per avsnitt | 55–69 (t1–t8), fraser 54 | 82–96 (d1–d8), fraser 67, + dv 51, dw 100, df 100, dg 300, dh 300, dm 66 | 57–63, fraser 54 | 58–62, fraser 49 |
| Hörtexter | 15 (166 ord, 4 frågor) | 9 (200 ord, 6 frågor) | 14 (197 ord, 6 frågor) | 8 (79 ord, 3–4 frågor) | 8 (125 ord, 4 frågor) |
| Lästexter | 8 (218 ord) + 21 ur boken | 6 (285 ord, 6 frågor) | 8 (253 ord, 6 frågor) | 5 (108 ord, 3 frågor) | 6 (164 ord, 3 frågor) |
| Berättelser | 9 (102 ord) | 6 (121 ord) | 8 (154 ord) | 4 (77 ord) | 5 (87 ord) |
| Kulturtexter | 12 (111 ord) | 7 (116 ord) | 10 (119 ord) | 6 (89 ord) | 6 (105 ord) |
| Skrivuppgifter | 10 (80–150 ord) + 88 ur boken | 7 (80–150) | 9 (120–200) | 6 (40–80) | 6 (60–100) |
| Samtalsfraser | 40 | 40 | 40 | 35 | 35 |
| Grammatikområden (frågor) | 13 (402) + bokens (310) | 9 + adj (270) | 9 + adj (390) | 12 (242) | 14 (285) |
| Regelsidor | 13 | 10 | 10 | 12 | 14 |
| `secs` (grammatik kopplad till kapitel) | ja | nej | nej | nej | nej |
| Verbspel | ja | 3 | 3 | 3 | 5 |
| Språkprov | DELF B1, 14 uppgifter | – | Goethe B2, 16 uppgifter | – | – |
| Videor | 23 (2–3 per avsnitt) | 23 | 30 | 24 | 22 |
| Uttal, kapitelmål, utvärdering | – | – | – | – | – |
| Litteratur, sång, dikt | via boken (7) | – | 1 recension (d6) | – | – |

**Innehåll per kapitel** (✓ = finns, – = saknas):

| Kurs | Kap | Hör | Läs | Berättelse | Kultur | Skriv |
|---|---|---|---|---|---|---|
| de4 | t1 Alltag | ✓ | – | ✓ | ✓ | ✓ |
| | t2 Wohnen | ✓ | ✓ | – | ✓ | – |
| | t3 Essen, Geld | ✓ | ✓ | ✓ | ✓ | – |
| | t4 Reisen | ✓ | ✓ | ✓ | ✓ | ✓ |
| | t5 Schule, Zukunft | ✓ | ✓ | – | ✓ | ✓ |
| | t6 Musik, Sport | ✓✓ | – | ✓ | ✓ | ✓✓ |
| | t7 Gesundheit | ✓ | ✓ | ✓ | – | ✓ |
| | t8 Feste | ✓ | ✓ | ✓ | ✓ | ✓ |
| de | d1 Identität | ✓✓ | ✓ | ✓ | – | ✓ |
| | d2 Bildung, Arbeit | ✓✓ | ✓ | ✓ | ✓ | ✓ |
| | d3 Medien | ✓✓ | ✓ | ✓ | – | ✓ |
| | d4 Umwelt | ✓ | ✓ | ✓ | ✓✓ | ✓ |
| | d5 Gesellschaft | ✓ | ✓ | ✓ | ✓ | ✓ |
| | d6 Kultur | ✓ | ✓ | ✓ | ✓✓ | ✓ |
| | d7 Gesundheit | ✓✓ | ✓ | ✓ | – | ✓ |
| | d8 D-A-CH | ✓ | ✓ | ✓ | ✓✓✓✓ | ✓ |
| it1 | i1 Ciao | ✓ | ✓ | – | – | ✓ |
| | i2 Famiglia | ✓ | – | ✓ | ✓ | ✓ |
| | i3 Scuola | ✓ | ✓ | – | ✓✓ | ✓ |
| | i4 Giornata | ✓ | – | ✓ | ✓ | ✓ |
| | i5 Bar | ✓ | ✓ | ✓ | ✓ | – |
| | i6 Città | ✓ | – | – | ✓ | – |
| | i7 Casa | ✓ | ✓ | – | – | ✓ |
| | i8 Vestiti, tempo | ✓ | ✓ | ✓ | – | ✓ |
| it2 | j1 Di nuovo | ✓ | ✓ | – | ✓ | ✓ |
| | j2 Fine settimana | ✓ | ✓ | ✓ | ✓ | ✓ |
| | j3 Viaggio | ✓ | ✓ | ✓ | ✓ | ✓ |
| | j4 Da piccolo | ✓ | ✓ | ✓ | – | ✓ |
| | j5 Spesa, cucina | ✓ | – | – | ✓ | – |
| | j6 Salute | ✓ | ✓ | ✓ | – | – |
| | j7 Feste | ✓ | – | ✓ | ✓✓ | ✓ |
| | j8 Lavoro | ✓ | ✓ | – | – | ✓ |

### 3.2 Gemensamt för alla fyra kurserna

1. **Skrivuppgifter:** 6–9 per kurs mot mallens 16–24. Det är den största skillnaden mot boken, som har cirka 10 per kapitel. Det saknas särskilt korta uppgifter (meningar med givna ord), uppgifter på en text (sammanfatta, skriv slutet, svara på frågor) och kreativa uppgifter (dikt, dialog, dagbok).
2. **Kapitelmål och utvärdering** finns inte i någon kurs. Det kräver en ny innehållstyp: `goals` per avsnitt, som visas när kapitlet väljs och som en självbedömning ("Det här kan jag nu") efter kapitelprovet.
3. **Uttal** saknas. Förslag: `pron.json` med ett moment per kapitel (ljud, regel på svenska, 6–10 ord eller ordpar, en mening att skugga), och en övning "Lyssna och välj" (minimala par) plus Skugga.
4. **Grammatik kopplad till kapitel** (`secs` i `grammar.json`) finns bara i franskan. Lägg in den i de4, de, it1 och it2 enligt planerna, så att kapitlets grammatik kommer först.
5. **Litteratur, sång och dikt** saknas nästan helt, trots att Skolverket har det i alla steg (sånger från steg 1, dikter från steg 2, skönlitteratur från steg 4). Använd upphovsrättsfria texter (upphovspersonen död för mer än 70 år sedan) och citera dem, eller skriv en uppgift med länk och sammanfattning för moderna verk (se `SPEC-bok.md`).
6. **Texttypernas variation:** alla lästexter är prosa i jagform eller mejl, och alla hörtexter är dialoger. Det saknas intervju, notis eller nyhet, annons eller tidtabell, insändare och reportage (de har några).

### 3.3 Tyska 4 (de4, steg 4, A2.2)

I prioritetsordning:

1. **Skrivuppgifter: +17**, så att varje kapitel får 3. Först t2 (till exempel ett mejl till en ny rumskamrat om regler i lägenheten) och t3 (en recension av en restaurang), sedan en kort uppgift (5 meningar med kapitelord) och en textuppgift (sammanfatta eller skriv slutet på kapitlets lästext) i t1–t8. Längd 80–150 ord.
2. **Lästexter: +2 (t1, t6)**, som i backloggen, gärna av nya texttyper: t1 en intervju eller enkätsvar om fritid, t6 ett reportage från en musiktävling. 250–350 ord, 6 frågor. Därefter en andra lästext i t4, t5 och t8 (notis, annons eller tidtabell, insändare).
3. **Berättelser: +2 (t2, t5)**, med Perfekt/Präteritum och bindeord.
4. **Kulturtext: +1 (t7)**, till exempel Krankenversicherung och Apotheke, eller Kur och Wellness i Tyskland.
5. **Hörtexter: +7** (en andra till t1–t5, t7 och t8), av annan typ än dialog: telefonmeddelande, utrop på en station, radionotis, intervju.
6. **Ord: +20 per kapitel** (från cirka 60 till 80), alltså cirka +160, mot 700–800 för steg 4. Välj frekventa ord inom kapitlets tema som inte finns i de (Tyska 5), så att de inte överlappar.
7. **`secs`** för de 10 grammatikområdena (t.ex. perfekt → t1, t4; reflexiv → t1, t7; komp → t3; konj → t3, t5; passiv → t8; relativ → t2).
8. **Litteratur och sång: 3 uppgifter**: en dikt ur allmän egendom (t.ex. Heine eller Goethe, kort) och en sång eller film med länk och frågor (t6, t8).
9. **Provträning: Goethe-Zertifikat B1** (`exam.json`, cirka 15 uppgifter), som i backloggen.
10. **Grammatik:** områdena räcker för steget. Möjliga tillägg: Futur I och werden, Genitiv (enkla fall), zu-infinitiv (början).

### 3.4 Tyska 5 (de, steg 5, B1.1 mot B2)

1. **Skrivuppgifter: +15**: formellt mejl eller ansökan (d2), insändare eller argumenterande text (d4, d5), sammanfattning av en lästext (alla kapitel), recension av film eller bok (d6), personligt brev (d1), forumsinlägg (d3, d7). 120–200 ord, några 200–250 för B2-provets Schreiben.
2. **Kulturtexter: +3 (d1, d3, d7)**, till exempel Jugendweihe och Konfirmation (d1), öffentlich-rechtlicher Rundfunk (d3) och Krankenkasse eller Vereinssport (d7).
3. **Lästexter av nya typer: +4–8**: populärvetenskap (d4, d7), reportage (d5), intervju (d2), manual eller instruktion (d3), en andra text per kapitel på 300–400 ord.
4. **Hörtexter: +4 (d4, d5, d6, d8)**: föredrag eller radioinslag, inte bara dialog (förberedelse för B2 Hören).
5. **Litteratur: 4 uppgifter**: en kort text ur allmän egendom (Kafka, Rilke, Heine, Grimm; Brecht blir fri först 2027) med frågor, en författare och epok (steg 6 förbereds), film (d6).
6. **`secs`** för de 10 grammatikområdena.
7. **Grammatik mot B2: +3–4 områden**: Genitiv och n-Deklination, Partizip I/II som adjektiv, tvådelade bindeord (sowohl … als auch, je … desto, weder … noch), Nominalisierung (Nomen-Verb-Verbindungen finns redan som ord i `df`).
8. **Provträning:** fler Goethe B2-uppgifter (backloggen, P2).
9. **Ord:** 1 695 räcker för steg 5. Målet B2 (3 000–4 000) står redan i backloggen.

### 3.5 Italienska 1 (it1, steg 1, A1.1)

1. **Skrivuppgifter: +10**, så att varje kapitel får 2. Först i5 (beställ på kafé, skriv en dialog) och i6 (beskriv vägen från stationen till ditt hem), sedan en kort uppgift per kapitel (5 meningar med kapitelord, ett vykort eller sms). 30–60 ord.
2. **Lästexter: +3 (i2, i4, i6)**: i2 en presentation av en familj (sociala medier), i4 ett schema med kort text om en dag, i6 en skylt, affisch eller karta med text ("c'è/ci sono"). 80–120 ord, 3–4 frågor.
3. **Berättelser: +4 (i1, i3, i6, i7)**, i presens (luckor för verbform, artikel och preposition i stället för tempus).
4. **Kulturtexter: +3 (i1, i7, i8)**: i1 hälsningar och gester (*ciao*, *Lei*, kindpussar), i7 hur italienare bor (lägenhet i stan, balkong, *condominio*), i8 italienskt mode eller klimatet i norr och söder.
5. **Grammatik: +2 områden ur planen** som inte byggdes: `pron-sogg` (subjektspronomen, tu/Lei) och `quest-quel` (questo/quello), plus regelsidor.
6. **Sång: 2 uppgifter** (Skolverket: sånger i steg 1), till exempel en känd italiensk sång med länk och några ord att lyssna efter.
7. **`secs`** för de 12 grammatikområdena (enligt tabellen i `italienska-plan.md`).
8. **Hörtexter:** en per kapitel räcker för steg 1. Senare: ett meddelande (röstmeddelande, utrop) i i5 och i6.

### 3.6 Italienska 2 (it2, steg 2, A1.2)

1. **Skrivuppgifter: +10–12**: j5 (skriv ett recept eller en inköpslista med mängder), j6 (skriv till en kompis att du är sjuk och ge råd), och sedan en kort och en friare uppgift per kapitel (mejl, dagbok, inbjudan, svar på inbjudan). 40–100 ord.
2. **Berättelser: +3 (j1, j5, j8)**: j5 med imperativ (ett recept), j8 med futuro.
3. **Lästexter: +2 (j5, j7)**: j5 ett recept (instruerande text), j7 en notis eller inbjudan (texttyper i steg 2). Dessutom en tidtabell eller annons (j3), som Skolverket nämner.
4. **Kulturtexter: +3 (j4, j6, j8)**: j4 skolan och barndomen förr (*grembiule*), j6 *la farmacia* och *il medico di base*, j8 *la maturità* och ungdomsarbetslöshet. Dessutom **italienskan i världen** (Schweiz, San Marino, emigrationen till Amerika), som Skolverket tar upp i steg 2.
5. **Hörtexter:** en **intervju** (j1 eller j8) och ett meddelande (j3, station eller flygplats), som komplement.
6. **Sång och dikt: 3 uppgifter** (steg 2: sånger och dikter), till exempel en kort dikt ur allmän egendom och en sång med länk.
7. **`secs`** för de 14 grammatikområdena.

### 3.7 Nivåerna i appen

Skolverket placerar Tyska 4 på A2.2 och Tyska 5 på B1.1 (betyget E), men appen skriver `B1` och `B1 → B2`. Italienska 2 är steg 2 = A1.2, men appen skriver `A2`. Innehållet i Italienska 2 (passato prossimo, imperfetto, futuro, condizionale) ligger på A2 enligt Profilo della lingua italiana. Det är ambitiöst men rimligt för en snabb elev. Franska 3 skriver `A2 → B1`, men steg 3 är A2.1.

Förslag: `level` anger **kursens nivå enligt Skolverket (betyget E) och vart den leder**, och målet ligger kvar i `exam`:

| Kurs | Nu | Förslag till `level` | Kommentar |
|---|---|---|---|
| Italienska 1 | A1 | `A1` | stämmer (A1.1) |
| Italienska 2 | A2 | `A1 → A2` | steg 2 = A1.2, innehållet når A2 |
| Franska 3 | A2 → B1 | `A2` | steg 3 = A2.1. B1 är provmålet (DELF B1), som redan står i `exam` |
| Tyska 4 | B1 | `A2 → B1` | steg 4 = A2.2, kursen repeterar och för mot B1 |
| Tyska 5 | B1 → B2 | `B1 → B2` | steg 5 = B1.1, provmålet B2 står i `exam`. Behåll |
| Franska 4 (`frs4`) | – | `A2 → B1` | steg 4 = A2.2. (Den tidigare "Franska 4", koden `fr4`, heter nu Franska 6: `B1`, steg 6) |
| Tyska 6 (planerad) | B2 (upcoming.json) | `B1 → B2` | steg 6 = B1.2 |

**Genomfört 2026-09-29:** `step` (1–7, eller `"U"` för universitetet) finns i varje `lang.js` och i `languages/upcoming.json`, och kursväljaren visar "Tyska 4 · steg 4 · A2 → B1 · mål Goethe B1", grupperat per språk och sorterat efter steg. Kursen `fr4` heter sedan 2026-09-29 **Franska 6** (`step: 6`, `level: "B1"`), eftersom innehållet ligger på steg 6; det nya steg 4 och 5 är `frs4` och `frs5`, och Franska I (`fru`) har `level: "B2"` och visas som "motsvarar steg 7" (se `docs/nivaer-franska.md`). build.py varnar om `level` inte börjar med stegets nivå (1–2 A1, 3–4 A2, 5–6 B1, 7 B2). Texten "B1" för Tyska 4 i `CLAUDE.md` och `italienska-plan.md` (Italienska 1 = A1.2, Italienska 2 = A2.1 i planens tabell) bör rättas samtidigt. Planens tabell förskjuter nivån ett halvsteg jämfört med kommentarmaterialet.

---

## 4. Plan för utfyllnad

En rad per paket, i den ordning de bör göras. Varje innehållspaket följer formaten i kursens `content/SPEC.md` och `GRAMMATIK-SPEC.md`, ändrar inga befintliga id:n, och avslutas med `python3 build.py` och `python3 tests/run_tests.py`.

1. **de4-skriv:** 17 nya skrivuppgifter i `languages/de4/content/prompts.json`, 3 per kapitel t1–t8 (t2 och t3 först; kort/mellan/fri), 80–150 ord, med `need` och exempeltext.
2. **de4-texter:** lästexter t1 (intervju) och t6 (reportage), berättelser t2 och t5, kulturtext t7 (`reading.json`, `stories.json`, `culture.json`).
3. **it1-texter:** lästexter i2, i4, i6; berättelser i presens i1, i3, i6, i7; kulturtexter i1, i7, i8.
4. **it1-skriv:** 10 skrivuppgifter (i5 och i6 först, sedan en kort per kapitel), 30–60 ord.
5. **it2-texter:** lästexter j5 (recept) och j7 (notis eller inbjudan); berättelser j1, j5, j8; kulturtexter j4, j6, j8 och "l'italiano nel mondo".
6. **it2-skriv:** 10–12 skrivuppgifter (j5 och j6 först), 40–100 ord.
7. **de-skriv:** 15 skrivuppgifter för Tyska 5 (formellt mejl, insändare, sammanfattning, recension), 120–250 ord.
8. **de-texter:** kulturtexter d1, d3, d7; hörtexter d4, d5, d6, d8 (föredrag eller radio); 4 lästexter av nya typer (populärvetenskap, reportage, intervju, instruktion).
9. **secs:** koppla grammatikområdena till kapitel i `grammar.json` för de4, de, it1 och it2 (bara `secs`-fält, inga nya id).
10. **it1-grammatik:** områdena `pron-sogg` och `quest-quel` (20 frågor var) med regelsidor.
11. **litteratur:** 2–4 uppgifter per kurs med sång, dikt eller kort text (allmän egendom citeras, moderna verk som länk och sammanfattning) i `prompts.json` eller `reading.json`.
12. **de4-hör och ord:** 7 hörtexter av annan typ än dialog, och cirka 160 nya ord (20 per kapitel) utan överlapp med `de`.
13. **mål-kod:** ny innehållstyp `goals` (kapitelmål "förmågan att / lära mig / repetera"), visad vid kapitelval och som självbedömning efter kapitelprovet. Kod i `src/`, SPEC-fil och test.
14. **mål-innehåll:** skriv `goals` för alla kapitel i fr, de4, de, it1 och it2 (egna formuleringar).
15. **uttal-kod:** ny innehållstyp `pron` (ljud, regel, ordpar, skuggmening) och en övning "Lyssna och välj". Kod, SPEC och test.
16. **uttal-innehåll:** ett uttalsmoment per kapitel i alla fem kurser.
17. **nivåer:** uppdatera `level` i `lang.js` och `upcoming.json` enligt 3.7 (fältet påverkar inte sparat läge), eventuellt ett nytt fält `step`, och rätta nivåerna i `CLAUDE.md` och `italienska-plan.md`.
18. **de-grammatik B2:** områdena Genitiv/n-Deklination, Partizip som adjektiv och tvådelade bindeord (25 frågor var) med regelsidor.
19. **de4-prov:** Goethe-Zertifikat B1 i `languages/de4/content/exam.json`.

Paket 1–12 och 14, 16–19 är rent innehåll och kan göras parallellt av olika agenter, eftersom de rör olika filer. Undantaget är 9 och 17, som båda ändrar `lang.js` och därför bör göras i tur och ordning. Paket 13 och 15 kräver kod och ska göras före 14 och 16.

---

## Källor

- Skolverket, *Moderna språk* (Gy11), ämnesplan med centralt innehåll för kurs 1–7: https://syllabuswebb.skolverket.se/subject/MOD/4/pdf
- Skolverket, *Kommentarmaterial till ämnesplanerna i moderna språk och engelska* (2022), avsnittet "Språkstegen i olika skolformer i jämförelse med nivåer i GERS": https://www.skolverket.se/download/18.29f46a199c90154403582/1760094575803/Kommentarmaterial%20gymnasieskolan%20moderna%20spr%C3%A5k.pdf
- Skolverket, *Gemensam europeisk referensram för språk, GERS*: https://www.skolverket.se/kompetensutveckling/stod-i-arbetet/gemensam-europeisk-referensram-for-sprak-gers
- Gy25, kursnamnen (nybörjare, grund, fortsättning, fördjupning): se källorna i `docs/italienska-plan.md`.
- Milton, J. och Alexiou, T. (2009), "Vocabulary size and the Common European Framework of Reference for Languages", i Richards m.fl. (red.), *Vocabulary Studies in First and Second Language Acquisition*, Palgrave Macmillan: https://link.springer.com/chapter/10.1057/9780230242258_12 . Se också Milton (2010), "The development of vocabulary breadth across the CEFR levels", EUROSLA Monographs 1: https://www.eurosla.org/monographs/EM01/211-232Milton.pdf
- Università per Stranieri di Perugia, *Profilo della lingua italiana* (verb A1 och A2): https://www.unistrapg.it/profilo_lingua_italiana/site/gram_verbi_a2.html
- Läroboken i Franska 3 (Waagaard, Rödemark, Jonchère och Sandberg), privat material i `languages/fr/book/`. Bara strukturen beskrivs här.
