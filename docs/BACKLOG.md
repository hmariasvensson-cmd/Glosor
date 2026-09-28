# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Tyck till från eleverna

- **Löpande (prioriteras först):** läs nya meddelanden i `feedback/` (ArtifactData, `status: "ny"`), för in önskemålen här, och sätt `status` och `reply` i dokumentet så att eleven ser vad som hände (se CLAUDE.md). Elevernas önskemål går före annat i backloggen.

## Färre men mer värdefulla övningar (granskning 2026-09-28)

Föräldern: "Vi vill inte ha för många övningar men vi vill ha övningar som är så värdefulla som möjligt." Granskningen jämförde alla cirka 20 övningar med forskningen om inlärning (testeffekt, utspridd repetition, egen produktion, begriplig input, återkoppling). Slutsats: Dagens pass är nästan bara drill, lyssning, läsning, tal och skrivande ingår inte, och flera övningar gör samma sak med samma meningar.

- **P1: Dagens pass som ett enda flöde:** glosor 6–7 min, fraser och meningar 3, grammatik 3 (tyska även der/die/das), hör- eller lästext varannan dag 4–5, tal 1–2. Klart först när allt är gjort. Provdatum i inställningarna ändrar viktningen (fler provuppgifter och färre nya ord närmare provet, inga nya ord de sista två veckorna). `dailyPanel`, `startDaily`, `startMix`, `finishSession`.
- **P1: Tyska: dölj genus i skrivfrågan** (`TYPE.words` visar "(maskulinum)"), så att eleven själv måste minnas der/die/das. Visa genus efter svaret.
- **P2: Ny övning Tala:** diktering med tangentbordets mikrofon i ett textfält, Claude kommenterar, timer för 4/3/2 med ämnen från proven. Skugga flyttas hit. Återanvänd `examText`/`examPrompt`.
- **P2: Färre menyval (cirka 20 → 11):** Meningar, Diktamen och Översätt blir en övning som går från lucka till översättning till diktamen. Ordföljd tas bort som egen övning (behövs kvar för grammatikens `rw`-frågor). Verbspelen blir ett. Kultur in i Läsa, Berättelser in i Grammatik, Uttal göms under Tala. **Fråga föräldern innan något tas bort.**
- **P2: Ordning på nya ord:** vanligaste orden först, musikteoriorden bara när eleven väljer dem (i dag i samma kö som vardagsorden), franskan får ett avsnitt med vanliga ord. `pickNew`.
- **P2: Bara skrivna svar gör att ett ord räknas som "kan"**; flerval räcker till steg 2. `applyAnswer`, `schedule`.
- **P2: Slå ihop Skriv en text och provets skrivuppgifter** med samma bedömning av Claude, med påminnelse en gång i veckan.
- **P3: Äkta ljud:** veckans tips med nyheter i långsam takt (RFI Journal en français facile, DW Langsam gesprochene Nachrichten) att läsa medan man lyssnar.
- **P3: Tidsbaserad repetition även i fraser, meningar och grammatik** (i dag bara "svagast först").

## Språkprov (det verkliga målet)

- **P2: Musikteori i fler kurser och granskning:** musikteoriord och teoriprov finns i Franska 3 och Tyska 5. Termer att kontrollera med en musiklärare: franska omvändningsnamn (sixte sensible, accord de triton), cadence parfaite/imparfaite, tyska Gegenklang och verkürzter Dominantseptakkord. Tyska 4 kan få en lättare variant. Fler uppgifter finns i generatorn (57 tyska till).


Båda eleverna ska söka musikutbildning utomlands. Eleven i franska behöver visa **B1 i franska** (DELF B1) för Frankrike, och eleven i tyska behöver visa **B2 i tyska** för Tyskland. Musikhögskolorna godtar oftast Goethe-Zertifikat B2, telc B2 eller TestDaF, men kontrollera vad just deras skolor kräver. Betyg i kursen spelar mindre roll.

- **P2: Kontrollera provformaten** mot provgivarnas egna exempelprov (Goethe Modellsatz B2, DELF B1 sujets démo): antal frågor per Teil/exercice, tider och exakt formulering av uppgifterna. Uppgifterna i appen är skrivna efter minnet av formatet.
- **P2: Fler provuppgifter**, så att provsimuleringen inte upprepar sig (i dag 16 tyska och 14 franska uppgifter). Tyska 4 har ingen provträning, eftersom Goethe B2 är för svårt där. Ett B1-prov (Goethe B1) kan läggas till.
- **P2: Muntlig förberedelse:** presentera sig själv och sin musik, med skuggning och Claude som samtalspartner (text).
- **P2: Nivåmätare:** uppskatta var eleven ligger mot B1/B2 utifrån ordförråd, grammatikresultat och Claudes bedömningar, och visa det i statistiken.

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

- **P2: Studieplan för självstudier:** ett förslag på vilket kapitel och vilka grammatikområden per vecka, så att hela Tyska 5 täcks på en termin.

- **P2: Större ordförråd, steg 3.** 1 629 ord nu. B2 kräver ungefär 3 000–4 000 ord. Fortsätt FrequencyWords från rang 2010 (CC BY-SA 4.0), eller använd kaikki/Wiktionary. Goethes listor är upphovsrättsskyddade och får inte kopieras.
- **P2: Granskning av grammatikfrågorna** (390 tyska, 322 franska) av en lärare eller modersmålstalare, åtminstone ett stickprov på 10 %. Gå också igenom elevernas rapporter i `reports/` (läs dem med ArtifactData) och rätta i källfilerna.
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
- **P2: Alla tre språken från steg 1 till steg 7** (franska, tyska och italienska, Moderna språk 1–7). I dag finns Franska 3 och 4, Tyska 4, 5 och 6 och Italienska 1 och 2. Det saknas Franska 1, 2 och 5–7, Tyska 1–3 och 7, och Italienska 3–7, alltså 13 kurser.
  - Varje kurs får en egen mapp i `languages/` och en egen `storageKey`. Bygg efter kursmallen (`docs/kursmall.md`) och Skolverkets centrala innehåll för steget. Nivån ungefär enligt Skolverket: steg 1 A1.1, 2 A1.2, 3 A2.1, 4 A2.2, 5 B1.1, 6 B1.2, 7 B2.1.
  - Varje kurs ska bygga vidare på den förra utan att orden överlappar, och ha `nextCourse` till nästa steg.
  - Ordning: Italienska 3 (står som kommande i `languages/upcoming.json`), sedan de lägre stegen (1–2 i franska, 1–3 i tyska) och sist steg 7 och Franska 5.
  - Arbetssätt som fungerade för Franska 4 och Tyska 6: glosorna i två halvor av två agenter (med dubblettkontroll mot tidigare kurser och mot varandra), allt övrigt innehåll av en tredje. Modelltexterna i skrivuppgifterna ska skrivas **efter** ordlistan, annars saknar de kapitelord.
  - Innehållet är AI-skrivet och behöver granskas med stickprov, som de andra kurserna.
- **P2: Franska 4 och Tyska 6: granskning och videor.** Båda kurserna (2026-09-28) är AI-skrivna och har inga videor (`videos.json` är tom). Kontrollera särskilt uttalsparen cote/côte och Paul/pôle (fr4) och wanke/zanke, Suhle/Kuhle (de6) med en riktig röst, modalpartiklarna i Hitta felet (de6) och faktauppgifterna i kultur- och historietexterna. Franska 4 har musikteori bara i Franska 3; Tyska 6 har den bara i Tyska 5.

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Behövs bara om två personer övar på *samma* språk med samma claude.ai-konto. Lägg då till en profilväljare ("Vem övar?").
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.
