# Nivåer: vad eleven ska kunna på steg 1–7, och vad som krävs

Underlag för backloggpunkten "Alla tre språken från steg 1 till steg 7" och för mallen i `docs/kursmall.md` (avsnitt 2). Dokumentet gäller alla språk. Franska, tyska och italienska tas upp språk för språk i egna dokument.

Datum: 2026-09-29. Allt från Skolverket är kontrollerat mot styrdokumenten samma dag. Citaten är korta och har källa. Resten är sammanfattat med egna ord.

---

## Sammanfattning

1. **Gy25 höjer GERS-nivåerna ett halvsteg.** Gy25 har samma sju nivåer och ungefär samma centrala innehåll som Gy11:s Moderna språk 1–7. Men betyget E är nu kopplat till nivåer som ligger ett halvsteg högre: nybörjare = **A1.2** (inte A1.1), och den sista nivån i fördjupning = **B2.2** (inte B2.1). Tabellen i `kursmall.md` 2.1 blandar Gy25:s kursnamn med Gy11:s GERS-nivåer. Den måste rättas (se 1.3).
2. **Förslaget i `kursmall.md` 3.7 om att sänka `level` bör inte genomföras.** Förslaget bygger på Gy11. Med Gy25 stämmer appens nuvarande nivåer oftast bättre, till exempel Italienska 2 = A2 och Tyska 4 = B1.
3. **Ordmålen i mallen går inte ihop.** Tabellen i 2.3 ger 5 400–6 900 ord efter steg 7, men texten ovanför säger cirka 3 000 efter steg 6. Forskningen talar för att eleven ska ha ungefär **1 000 ord efter steg 2, 2 000 efter steg 4, 3 000 efter steg 6 och 3 500–4 500 efter steg 7**. Då räcker 450–650 nya ord per kurs, eller något fler om det finns ett provmål.
4. **Välj ord efter frekvens och mät täckningen.** Den enskilt viktigaste regeln är att eleven ska kunna 95–98 % av orden i en text. Då kan eleven förstå texten och lära sig resten av sammanhanget. Detta går att kontrollera automatiskt i `build.py`.
5. **Övningstyperna är rätt valda.** Appen bygger på aktiv återkallning (retrieval practice) och repetition med ökande intervall (spaced repetition). Båda har mycket starkt stöd i forskningen. Det som saknas är **mängd**: mycket lättläst och lätthört material (extensiv läsning och lyssning), fler skrivuppgifter som bygger på en källa, respons på det eleven skriver, samt uttal.

---

## 1. Skolverket: vad gäller nu?

### 1.1 Två system samtidigt

- **Gy11, Moderna språk 1–7** (kurserna MODMOD01–07, 100 poäng var). Gäller elever som började gymnasiet före hösten 2025, tills de har gått ut.
- **Gy25** (SKOLFS 2024:326–328). Gäller elever som började gymnasiet från och med hösten 2025, och komvux på gymnasial nivå. Moderna språk är nu fyra separata ämnen, och varje språk är ett eget ämne. Eleven får ett **ämnesbetyg** per ämne, inte ett betyg per kurs. Inom fortsättning och fördjupning sätts betyget sammantaget för de nivåer eleven har läst.

| Gy25-ämne (kod) | Nivåer | Poäng | Motsvarar ungefär Gy11 |
|---|---|---|---|
| Moderna språk nybörjare (MODY) | nivå 1 | 100 | Moderna språk 1 |
| Moderna språk grund (MODG) | nivå 1 | 100 | Moderna språk 2 |
| Moderna språk fortsättning (MODO) | nivå 1–2 | 100 + 100 | Moderna språk 3–4 |
| Moderna språk fördjupning (MODF) | nivå 1–3 | 100 + 100 + 100 | Moderna språk 5–7 |

Kopplingen till grundskolan: den som har läst språket som **språkval** börjar på fortsättning nivå 1. Den som har läst det inom **skolans val** börjar på grund nivå 1 (kommentarmaterialet för Gy25, s. 3).

### 1.2 Centralt innehåll och betygskriterier i Gy25

Varje nivå har samma tre rubriker: **Kommunikationens innehåll**, **Reception** (förstå tal och text) och **Produktion och interaktion** (tala, skriva, samtala). Innehållet per nivå är i stort sett detsamma som Gy11:s steg 1–7, som sammanfattas i `kursmall.md` 2.2. Tabellen där gäller därför fortfarande. Det här är nytt eller tydligare i Gy25:

- **Källor redan på nybörjarnivå.** Kriteriet för E på nybörjarnivå är att eleven "hittar enkel information i anvisade muntliga och skriftliga källor" och använder den i sin egen produktion (MODY). Uppgiften "läs eller lyssna, och använd det sedan i en egen text" ska alltså finnas från steg 1.
- **Uttal, grammatik och stavning** nämns uttryckligen på alla nivåer, både i det eleven möter och i det eleven själv producerar.
- **Strategier** finns på alla nivåer: för att förstå (förförståelse, bilder, betydelsebärande ord) och för att hålla igång ett samtal (omformulera, fråga).
- **Kultur.** Eleven ska kommentera förhållanden där språket talas, på målspråket.

**Betygskriterierna** är skrivna så att de stiger från E till C till A. Värdeorden är i stort sett desamma på alla nivåer:

| | E | C | A |
|---|---|---|---|
| Förstå | "huvudsakligt innehåll och tydliga detaljer" (på nybörjarnivå: vanliga ord och enkla fraser) | + "på ett välgrundat sätt" | "välgrundat och nyanserat", "såväl helhet som detaljer" |
| Använda källor | "delvis relevant" | "relevant" | "relevant och effektivt" |
| Tala och skriva | "enkelt och i någon mån fungerande" | "i huvudsak fungerande", viss anpassning | "fungerande", anpassat efter syfte och mottagare |

(Formuleringarna gäller fortsättning nivå 2 och är hämtade ur MODO. Övriga nivåer följer samma mönster med andra ord för textens svårighet och tempo.)

### 1.3 Steg och GERS: Gy11 jämfört med Gy25

Båda Skolverkets kommentarmaterial säger att två svenska steg ryms inom en GERS-nivå. Kopplingen gäller **betyget E**. Gy25 har flyttat hela skalan ett halvsteg uppåt. Detta står i varje nivå i ämnesplanerna: "Innehållet och kriterierna för betyget E på denna nivå relaterar till …".

| Steg i appen | Gy11-kurs | GERS för E, Gy11 | Gy25-nivå | GERS för E, **Gy25** |
|---|---|---|---|---|
| 1 | Moderna språk 1 | A1.1 | nybörjare, nivå 1 | **A1.2** |
| 2 | Moderna språk 2 | A1.2 | grund, nivå 1 | **A2.1** |
| 3 | Moderna språk 3 | A2.1 | fortsättning, nivå 1 | **A2.2** |
| 4 | Moderna språk 4 | A2.2 | fortsättning, nivå 2 | **B1.1** |
| 5 | Moderna språk 5 | B1.1 | fördjupning, nivå 1 | **B1.2** |
| 6 | Moderna språk 6 | B1.2 | fördjupning, nivå 2 | **B2.1** |
| 7 | Moderna språk 7 | B2.1 | fördjupning, nivå 3 | **B2.2** |

Kommentarmaterialet för Gy25 påpekar att nivåangivelsen inte ska användas för betygssättning eller för att jämföra i detalj med internationella språkprov. Den är en riktning, inte en provgräns. Elever med C eller A ligger normalt högre än nivån i tabellen.

**Följder för appen**

- Stegen 1–7 fungerar fortfarande som axel i appen, eftersom innehållet per steg är detsamma i båda systemen.
- `level` bör följa **Gy25**, som gäller för alla nya elever. Då är förslagen i `kursmall.md` 3.7 inaktuella. Med Gy25 blir det: Italienska 1 = A1 (A1.2), Italienska 2 = A2 (A2.1), Franska 3 = A2 (A2.2), Tyska 4 = B1 (B1.1), Tyska 5 = B1 (B1.2), Franska 6 (`fr4`) och Tyska 6 = B2 (B2.1). De nuvarande värdena `A2` för it2, `B1` för de4 och `B1 → B2` för de stämmer alltså.
- Visas steget i kursväljaren kan båda namnen stå där, till exempel "Steg 4 · fortsättning nivå 2 (Moderna språk 4) · B1".
- Rätta tabellen i `kursmall.md` 2.1 så att den har två GERS-kolumner som ovan.

---

## 2. GERS: vad eleven ska kunna

GERS har sex huvudnivåer och "plusnivåer" (A2+, B1+, B2+). De svenska halvstegen (A1.1, A1.2 …) är Skolverkets egen indelning. Ungefär gäller att **x.1 = den nedre halvan av nivån** och **x.2 = den övre halvan, eller plusnivån**. Så blir A2.2 ≈ A2+, B1.2 ≈ B1+ och B2.2 ≈ B2+. Beskrivningarna nedan är egna sammanfattningar av Companion Volume (2020).

| Nivå | Lyssna | Läsa | Tala (sammanhängande) | Samtala (interaktion) | Skriva |
|---|---|---|---|---|---|
| **A1.1** | enstaka ord och mycket korta fraser om sig själv, om de sägs långsamt och tydligt | namn, välbekanta ord, skyltar och enkla formulär | säga några ord om sig själv (namn, ålder, bostad) med inövade fraser | hälsa, tacka, svara på enkla frågor om motparten hjälper till | enstaka ord, sitt namn och ett formulär |
| **A1.2** | korta enkla instruktioner och siffror, priser och tider | mycket korta texter med bild, vykort, enkla meddelanden | beskriva sig själv, sin familj och sin bostad med enkla meningar | ställa och besvara enkla frågor om nära behov | korta meddelanden, vykort, enkla meningar med *och*, *men* |
| **A2.1** | fraser och vanliga ord om familj, köp, skola och närmiljö. Uppfattar vad korta tydliga meddelanden handlar om | korta, enkla texter med vanliga ord: annonser, menyer, tidtabeller, personliga brev | beskriva vardag, människor och platser med en serie enkla meningar | klara enkla utbyten i vardagen (butik, resa), men sällan hålla igång ett samtal själv | korta anteckningar och meddelanden, ett enkelt tackbrev |
| **A2.2** (A2+) | det viktigaste i korta, tydliga inslag om bekanta ämnen | korta texter om konkreta ämnen, enkla berättelser | berätta om händelser och erfarenheter i dåtid med enkla bindeord | delta i korta samtal om bekanta ämnen och säga vad man tycker | sammanhängande enkla texter om händelser och upplevelser |
| **B1.1** | huvudpunkterna i tydligt standardspråk om bekanta ämnen (skola, fritid, arbete) | raka sakprosatexter och personliga brev om bekanta ämnen | berätta en historia eller återge en film eller bok, och motivera en åsikt kort | klara de flesta situationer på en resa och delta utan förberedelse i samtal om bekanta ämnen | enkla sammanhängande texter om bekanta ämnen, och brev om upplevelser och känslor |
| **B1.2** (B1+) | huvudpunkterna i radio- och tv-inslag om aktuella ämnen, i tydligt tal | längre sakprosa, enkla argumenterande texter och enkla noveller | presentera ett ämne tydligt och svara på följdfrågor | byta information om bekanta och mindre vanliga ämnen, framföra och försvara en åsikt | sammanfatta, rapportera och ge sin åsikt om faktainformation |
| **B2.1** | längre föredrag och nyheter, och följa en argumentation om ämnet är ganska bekant. Standardspråk i normalt tempo | artiklar och rapporter där skribenten tar ställning. Modern prosa | tydliga, detaljerade beskrivningar och argumentation med för- och nackdelar | samtala spontant och ledigt med infödda talare, och argumentera i en diskussion | tydliga, detaljerade texter: uppsats, rapport, argumenterande brev |
| **B2.2** (B2+) | det mesta i tv, film och föreläsningar, även med viss dialekt | långa och komplexa texter, snabbt, med ordbok för de svåraste orden | utveckla ett resonemang systematiskt och lyfta fram det viktigaste | anpassa stil och register, och hantera oenighet | sammanställa information och argument ur flera källor |
| *C1 (utblick)* | *långa, ostrukturerade framställningar och underförstådda betydelser* | *långa, komplexa sakprosatexter och skönlitteratur, stilskillnader* | *flytande, välstrukturerat tal om komplexa ämnen* | *använda språket flexibelt i socialt liv, studier och arbete* | *välstrukturerade texter om komplexa ämnen, med väl valt register* |

Companion Volume har också nya skalor för **medling** (att förmedla innehåll till någon annan, till exempel sammanfatta en text på svenska eller på målspråket) och för **interaktion på nätet**. Båda motsvarar Skolverkets "använda källor i egen produktion" och "digital interaktion", och båda passar bra som skrivuppgifter i appen.

---

## 3. Forskning: vad krävs för att nå nivåerna?

### 3.1 Ordförråd per GERS-nivå

Milton och Alexiou (2009) testade över 500 elever med X-Lex, ett ja/nej-test av de 5 000 vanligaste lemmana i språket. Siffrorna gäller alltså **receptiva** ord bland de 5 000 vanligaste, och de är medelvärden med stor spridning. Urvalen för franska var små.

| GERS | Engelska (Grekland) | Engelska (Ungern) | Franska (Spanien) | Franska (Grekland) | Grekiska |
|---|---|---|---|---|---|
| A1 | 1 477 | – | 894 | 1 125 | 1 492 |
| A2 | 2 156 | – | 1 700 | 1 756 | 2 237 |
| B1 | 3 263 | 3 135 | 2 194 | 2 422 | 3 338 |
| B2 | 3 304 | 3 668 | 2 450 (en elev) | 2 630 | 4 012 |
| C1 | 3 690 | 4 340 | – | 3 212 | – |

Källa: Milton (2010), tabell 6, som redovisar Milton och Alexiou (2009). Kolumnernas ordning är tolkad ur tabellen. Kontrollera mot originalet innan siffrorna används i appen.

Så här kan siffrorna läsas:

- **Ungefär 2 000 ord behövs för A2** i alla de språk som testades. Cirka **3 000** behövs för att bli en självständig språkanvändare (B1) i engelska. För franska räcker det med färre, men här är underlaget litet.
- För franska ligger siffrorna lägre. En förklaring är att de vanligaste franska orden täcker mer av texterna. Cobb och Horst (2004) fann att de 2 000 vanligaste franska orden täcker nästan 89 % av akademiska texter. På engelska krävs 2 000 vanliga ord plus en särskild akademisk ordlista för samma täckning.
- Mer än 60 % av skillnaderna i GERS-nivå kunde förklaras av ordförrådets storlek. Ordförrådet är alltså en mycket bra, men inte fullständig, indikator på nivån.
- Receptivt ordförråd (förstå ett ord) är större än produktivt (kunna använda det själv). Appen tränar båda, och därför behövs det en viss marginal.

### 3.2 Täckning: hur många av orden i en text måste eleven kunna?

| Rön | Källa |
|---|---|
| **98 %** kända ord krävs för att läsa en skönlitterär text utan hjälp. Vid 95 % förstår de flesta bara delvis. | Hu och Nation (2000) |
| 98 % täckning av vanlig skriven engelska kräver 8 000–9 000 ordfamiljer, och talad engelska 6 000–7 000. | Nation (2006) |
| 95 % är en *minimigräns* (4 000–5 000 ordfamiljer), och 98 % är *optimalt* (cirka 8 000). | Laufer och Ravenhorst-Kalovski (2010) |
| För **hörförståelse** kan 95 % räcka, vilket motsvarar ungefär 2 000–3 000 ordfamiljer. | van Zeeland och Schmitt (2013) |

**Följd för appen:** texterna ska skrivas utifrån ordlistorna, inte tvärtom. I en lästext på steg *n* bör minst 95 % (helst 98 %) av de löpande orden finnas i orden för steg 1 till *n*, eller vara namn, internationella ord eller ord som förklaras i en glosruta. 98 % betyder högst ett okänt ord på 50. För hörtexter räcker 95 %.

### 3.3 Studietid per nivå

| Nivå (totalt från noll) | Cambridge (engelska) | Goethe-Institut (tyska) | Fransk språkskola (franska, CECRL) |
|---|---|---|---|
| A1 | – | 60–150 h | 80–100 h |
| A2 | 180–200 h | 150–260 h | ~180–220 h (+100–120) |
| B1 | 350–400 h | 260–490 h | ~380–470 h (+200–250) |
| B2 | 500–600 h | 450–600 h | ~580–720 h (+200–250) |
| C1 | 700–800 h | 600–750 h | – |

Timmarna är *guided learning hours*, alltså lärarledd tid. Eget arbete kommer till utöver dem. Ett gymnasieämne på 100 poäng ger ungefär 80–100 timmar lärarledd tid. Det är en egen uppskattning utifrån den garanterade undervisningstiden. Sju nivåer blir då cirka 600–700 timmar, vilket stämmer väl med att Gy25 slutar på B2.2.

För appen betyder det att en kurs motsvarar ungefär en termins arbete, cirka 80–100 timmar inklusive lektioner. Om appen står för 15–30 minuter om dagen blir det 30–60 timmar per termin. Här är en grov egen beräkning: ett ord behöver cirka 6–10 lyckade repetitioner à 10–20 sekunder, och det blir 1–3 minuter per ord. **500 nya ord kostar då cirka 10–25 timmar och 1 000 ord cirka 20–50 timmar.** Med 1 000–1 200 nya ord per kurs, som mallen nu säger för steg 5–7, går nästan all apptid åt till glosor.

### 3.4 Vilka övningar ger mest?

| Övning | Stöd i forskningen | Källor | I appen |
|---|---|---|---|
| **Aktiv återkallning** (att ta fram svaret själv, inte läsa det igen) | Mycket starkt. Ger bättre minne på lång sikt än att läsa om. | Roediger och Karpicke (2006); Karpicke och Roediger (2008); Dunlosky m.fl. (2013) | ja (glosquiz, grammatik) |
| **Spridd repetition** (spaced repetition) | Mycket starkt, också för andraspråk. Längre intervall ger bättre minne på sikt. Ökande och jämna intervall ger ungefär samma resultat. | Cepeda m.fl. (2006); Kim och Webb (2022) | ja (`INT`, `DAYS`) |
| **Ordkort och ordlistor** med återkallning | Effektivt. Eleverna minns cirka 60 % direkt men bara cirka 25–40 % senare, så repetition behövs. Att skriva ordet på målspråket (form recall) är svårast och ger mest produktiv kunskap. | Webb, Yanagisawa och Uchihara (2020); Nakata (2011) | ja. Se till att båda riktningarna tränas och att eleven skriver ordet på målspråket |
| **Många möten med ordet i text** | Sannolikheten att lära sig ett ord ökar tydligt med antalet möten. Ofta krävs 8–10 möten eller fler. | Webb (2007); Uchihara, Webb och Yanagisawa (2019) | delvis. Kapitelorden bör återkomma i flera texter |
| **Extensiv läsning och lyssning** (mycket lätt text) | Positiva effekter på läsförmåga och ordförråd, men bara när texten är lätt nog (se 3.2) och mängden stor. | Jeon och Day (2016); Nation (2014) | saknas i stort sett |
| **De fyra delarna** (innehåll via input, egen output, språkfokus, flyt): ungefär lika mycket tid åt var och en | Allmänt accepterad ram. Appen är starkast på språkfokus. | Nation (2007) | obalanserat |
| **Output** (skriva och tala själv) | Att producera språk får eleven att märka vad hen inte kan, och det befäster strukturer. | Swain (1985, 2005) | skrivuppgifter finns, men för få (`kursmall.md` 3.2) |
| **Återkoppling på skrivande** | Skriftlig korrigerande återkoppling ger bättre korrekthet i senare texter. | Kang och Han (2015) | ja ("Få kommentarer av Claude") |
| **Diktamen och skuggning** | Mindre forskning, men stöd för att det tränar koppling mellan ljud och skrift (diktamen) och uttal och flyt (skuggning). | Hamada (2016) om skuggning | uttal saknas |

---

## 4. Jämförelse med mallen i `kursmall.md` 2.3, och ändringar

### 4.1 Ord per kurs

Mallens tabell ger ackumulerat cirka 2 450–2 950 ord efter steg 4, 4 450–5 350 efter steg 6 och 5 450–6 850 efter steg 7. Det är betydligt mer än både texten i mallen och forskningen i 3.1 anger. Det är också mer än vad apptiden räcker till (3.3).

**Förslag: mål som ackumulerade tal, med nya ord per kurs som följd.**

| Steg (Gy25 GERS) | 1 (A1.2) | 2 (A2.1) | 3 (A2.2) | 4 (B1.1) | 5 (B1.2) | 6 (B2.1) | 7 (B2.2) |
|---|---|---|---|---|---|---|---|
| Ackumulerat mål | 500 | 1 000 | 1 500 | 2 000 | 2 500 | 3 000–3 300 | 3 500–4 500 |
| Nya ord per kurs, nu | 450–550 | 500–600 | 700–900 | 800–900 | 1 000–1 200 | 1 000–1 200 | 1 000–1 500 |
| **Nya ord per kurs, förslag** | **450–550** | **450–550** | **450–600** | **450–600** | **500–650** | **500–650** | **500–1 000** |
| Ord per kapitel (8 kap.) | 55–65 | 55–70 | 55–75 | 55–75 | 60–80 | 60–80 | 60–120 |

- Övre gränsen gäller när kursen har ett provmål (DELF, Goethe) som ligger över Skolverkets E-nivå. Så är det för Franska 3 → DELF B1 och Tyska 5/6 → Goethe B2. Provmålet styr då, inte steget.
- **Frekvens först.** Minst 80 % av orden i steg 1–4 bör höra till de 2 000 vanligaste i språket. Resten får vara ord som behövs för kapitlets tema. Använd en frekvensordbok (Routledge *A Frequency Dictionary of …* finns för franska, tyska och italienska) och notera frekvensbandet i ordlistan. Språkagenterna tar fram källorna per språk.
- Räkna bara ord som är nya för eleven. Ord som redan finns i en tidigare kurs i kedjan räknas som repetition.

### 4.2 Texter

| | Steg 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Lästext, nu | 80–120 | 120–180 | 200–300 | 250–350 | 250–400 | 350–550 | 450–700 |
| **Lästext, förslag** | 60–120 | 100–200 | 150–300 | 250–400 | 300–500 | 400–700 | 500–900 |
| Hörtext, nu | 60–100 | 100–150 | 150–200 | 180–230 | 200–250 | 250–350 | 300–450 |
| **Hörtext, förslag** | 40–100 | 80–150 | 120–220 | 180–300 | 250–400 | 300–500 | 400–700 |

- Längderna i mallen är i stort sett rimliga för steg 1–4. På steg 5–7 (B1.2–B2.2) läser eleven artiklar och följer föredrag. Då behövs längre texter, och de bör vara av olika typer (inte bara dialog). Kortare texter behövs också på låga steg: skyltar, sms, annonser.
- **Nytt krav på alla texter: täckning.** Minst 95 % (lästext helst 98 %) av orden ska vara kända, se 3.2. Förslag: `build.py` räknar ut täckningen per text mot orden i kursen och i tidigare kurser, och varnar under en viss gräns.
- **Nytt: extensivt spår.** Lägg till korta lättlästa berättelser utan frågor, bara för mängd, per steg med ≥ 98 % täckning. Kapitlets ord ska återkomma i flera texter (3.4).

### 4.3 Skrivande

| | Steg 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Skrivlängd, nu | 30–60 | 40–100 | 60–140 | 80–150 | 120–200 | 150–250 | 200–350 |
| **Förslag** | 20–60 | 40–100 | 60–140 | 80–180 | 120–220 | 160–280 | 200–350 |

- Längderna är rimliga. Steg 4–6 höjs något så att de räcker för provuppgifter på B1 och B2, där längre texter krävs. Språkagenterna kontrollerar de exakta ordgränserna för DELF, Goethe och CILS/CELI.
- **Källbaserad uppgift från steg 1** (Gy25:s kriterium): minst en uppgift per kapitel där eleven först läser eller lyssnar och sedan använder informationen, till exempel "svara på annonsen", "sammanfatta" eller "skriv till en kompis om det du läst". Från steg 5 även medling: sammanfatta en svensk text på målspråket.
- **Kulturkommentar:** en kort skrivuppgift efter kulturtexten ("jämför med Sverige"). Det motsvarar kriteriet att eleven kommenterar förhållanden där språket används.

### 4.4 Grammatik

Grammatikprogressionen i mallen stämmer med GERS och Skolverket. Två justeringar:

- Gy25 ligger ett halvsteg högre än Gy11. Därför bör **dåtid (perfekt / passé composé / passato prossimo) finnas i steg 2 i alla språk**, vilket den redan gör, och **konditionalis som artighet redan i steg 3**. A2.2 kräver att eleven kan berätta om erfarenheter och uttrycka önskningar.
- Grammatiken ska övas med **återkallning i sammanhang** (skriv formen i en mening), inte bara flerval. Det gör appen redan till stor del.

### 4.5 Övrigt

- **Uttal** (Gy25 nämner det på alla nivåer): paketen `uttal-kod` och `uttal-innehåll` i `kursmall.md` 4 bör upp i prioritet. Lägg till diktamen (lyssna och skriv) som en billig övning som använder hörtexterna som redan finns.
- **Interaktionsstrategier:** några fraser per steg för att be om förtydligande, omformulera och hålla igång ett samtal. De kan ligga i samtalsfraserna.
- **`level` och `step`:** följ Gy25 (se 1.3), och ersätt förslaget i `kursmall.md` 3.7.

---

## Källor

**Skolverket**

- Ämnesplan Moderna språk nybörjare (MODY), Gy25, SKOLFS 2024:328: https://syllabuswebb.skolverket.se/subject/MODY/1/pdf
- Ämnesplan Moderna språk grund (MODG), Gy25: https://syllabuswebb.skolverket.se/subject/MODG/1/pdf
- Ämnesplan Moderna språk fortsättning (MODO), Gy25: https://syllabuswebb.skolverket.se/subject/MODO/1/pdf
- Ämnesplan Moderna språk fördjupning (MODF), Gy25, SKOLFS 2024:326: https://syllabuswebb.skolverket.se/subject/MODF/1/pdf
- Kommentarmaterial till moderna språk (Gy25), 2025, tabell 1 "Relationen mellan GERS och moderna språk": https://www.skolverket.se/download/18.5e8cb66197a1e39a7028e9d/1756109633861/Kommentarmaterial%20till%20moderna%20spr%C3%A5k%20(Gy25).pdf
- Kommentarmaterial till ämnesplanerna i moderna språk och engelska (Gy11), 2022: https://www.skolverket.se/download/18.29f46a199c90154403582/1760094575803/Kommentarmaterial%20gymnasieskolan%20moderna%20spr%C3%A5k.pdf
- Ämnesplan Moderna språk (Gy11), kurs 1–7: https://syllabuswebb.skolverket.se/subject/MOD/4/pdf
- Gy25, ämnesbetyg: https://www.skolverket.se/styrning-och-ansvar/forandringar-inom-skolomradet/gy25----amnesbetyg-pa-gymnasial-niva
- Kommentarmaterial för gymnasieskolan (översikt): https://www.skolverket.se/undervisning/gymnasieskolan/kommentarmaterial-till-gymnasieskolan

**GERS**

- Council of Europe (2020), *CEFR Companion Volume*: https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4
- Skolverket om GERS: https://www.skolverket.se/kompetensutveckling/stod-i-arbetet/gemensam-europeisk-referensram-for-sprak-gers

**Ordförråd och täckning**

- Milton, J. och Alexiou, T. (2009), "Vocabulary size and the Common European Framework of Reference for Languages", i Richards m.fl. (red.), *Vocabulary Studies in First and Second Language Acquisition*, Palgrave: https://link.springer.com/chapter/10.1057/9780230242258_12
- Milton, J. (2010), "The development of vocabulary breadth across the CEFR levels", EUROSLA Monographs 1, s. 211–232: https://www.eurosla.org/monographs/EM01/211-232Milton.pdf
- Cobb, T. och Horst, M. (2004), "Is there room for an academic word list in French?", i Bogaards och Laufer (red.), *Vocabulary in a Second Language*, Benjamins (citerad i Milton 2010).
- Hu, M. och Nation, P. (2000), "Unknown vocabulary density and reading comprehension", *Reading in a Foreign Language* 13(1), 403–430 (tidskriftens arkiv: https://nflrc.hawaii.edu/rfl/)
- Nation, P. (2006), "How large a vocabulary is needed for reading and listening?", *Canadian Modern Language Review* 63(1): https://doi.org/10.3138/cmlr.63.1.59
- Laufer, B. och Ravenhorst-Kalovski, G. C. (2010), "Lexical threshold revisited", *Reading in a Foreign Language* 22(1), 15–30 (arkiv: https://nflrc.hawaii.edu/rfl/)
- van Zeeland, H. och Schmitt, N. (2013), "Lexical coverage in L1 and L2 listening comprehension", *Applied Linguistics* 34(4): https://doi.org/10.1093/applin/ams074
- Tracy-Ventura, N. m.fl., LANGSNAP (fransk och spansk inlärarkorpus, ordförrådets utveckling under utlandsstudier), för franska: https://benjamins.com/catalog/scl.78.05tra och https://www.sciencedirect.com/science/article/abs/pii/S0346251X17308217

**Studietid**

- Cambridge English, *Guided learning hours*: https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours
- Goethe-Institut, *Niveaustufen* (timmar per nivå, bl.a. Goethe-Institut London): https://www.goethe.de/ins/gb/de/sta/lon/kur/faq.html och https://www.goethe.de/ins/de/de/kur/kuv/stu.html
- CIA France, *Volume d'heures théorique nécessaire pour passer d'un niveau du CECR à un autre*: https://www.cia-france.com/media-file/2241/cefr-volume-hours-fr.pdf

**Övningstyper**

- Roediger, H. L. och Karpicke, J. D. (2006), "Test-enhanced learning", *Psychological Science* 17(3): https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Karpicke, J. D. och Roediger, H. L. (2008), "The critical importance of retrieval for learning", *Science* 319: https://doi.org/10.1126/science.1152408
- Dunlosky, J. m.fl. (2013), "Improving students' learning with effective learning techniques", *Psychological Science in the Public Interest* 14(1): https://doi.org/10.1177/1529100612453266
- Cepeda, N. J. m.fl. (2006), "Distributed practice in verbal recall tasks", *Psychological Bulletin* 132(3): https://doi.org/10.1037/0033-2909.132.3.354
- Kim, S. K. och Webb, S. (2022), "The effects of spaced practice on second language learning: A meta-analysis", *Language Learning* 72(1): https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479
- Webb, S., Yanagisawa, A. och Uchihara, T. (2020), "How effective are intentional vocabulary-learning activities? A meta-analysis", *Modern Language Journal* 104(4): https://onlinelibrary.wiley.com/doi/abs/10.1111/modl.12671
- Nakata, T. (2011), "Computer-assisted second language vocabulary learning in a paired-associate paradigm", *Computer Assisted Language Learning* 24(1): https://doi.org/10.1080/09588221.2010.520675
- Webb, S. (2007), "The effects of repetition on vocabulary knowledge", *Applied Linguistics* 28(1): https://doi.org/10.1093/applin/aml048
- Uchihara, T., Webb, S. och Yanagisawa, A. (2019), "The effects of repetition on incidental vocabulary learning: A meta-analysis", *Language Learning* 69(3): https://doi.org/10.1111/lang.12343
- Jeon, E.-Y. och Day, R. R. (2016), "The effectiveness of ER on reading proficiency: A meta-analysis", *Reading in a Foreign Language* 28(2), 246–265 (arkiv: https://nflrc.hawaii.edu/rfl/)
- Nation, P. (2014), "How much input do you need to learn the most frequent 9,000 words?", *Reading in a Foreign Language* 26(2), 1–16 (arkiv: https://nflrc.hawaii.edu/rfl/)
- Nation, P. (2007), "The four strands", *Innovation in Language Learning and Teaching* 1(1): https://doi.org/10.2167/illt039.0
- Swain, M. (2005), "The output hypothesis: Theory and research", i Hinkel (red.), *Handbook of Research in Second Language Teaching and Learning*, Routledge.
- Kang, E. och Han, Z. (2015), "The efficacy of written corrective feedback in improving L2 written accuracy: A meta-analysis", *Modern Language Journal* 99(1): https://doi.org/10.1111/modl.12189
- Hamada, Y. (2016), "Shadowing: Who benefits and how? Uncovering a booming EFL teaching technique for listening comprehension", *Language Teaching Research* 20(1): https://doi.org/10.1177/1362168815597504
