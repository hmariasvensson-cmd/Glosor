# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Tyck till från eleverna

- **Löpande (prioriteras först):** läs nya meddelanden i `feedback/` (ArtifactData, `status: "ny"`), för in önskemålen här, och sätt `status` och `reply` i dokumentet så att eleven ser vad som hände (se CLAUDE.md). Elevernas önskemål går före annat i backloggen.

## Språkprov (det verkliga målet)

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
- **P3: Tyska 4: hörtexter och fler ord** (kursmallen, paket 12): 7 hörtexter och cirka 160 nya ord, eftersom 558 ord är lågt för steg 4. Provträning för Goethe B1 (paket 19).

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
  - Litteratur, sång eller dikt i varje kurs (paket 11): 2–4 uppgifter per kurs.
  - Tre grammatikområden mot B2 i Tyska 5 (paket 18): genitiv och n-deklination, particip som adjektiv, tvådelade bindeord.
  - Paket 9 (grammatiken kopplad till kapitel) gör bara nytta i kurser med lärobok, så det väntar.
  - Lyssna igenom uttalsövningarna med en riktig röst. Vissa par kan låta lika i vissa webbläsare, till exempel é/è i franska och enkelt/dubbelt s i italienska. Sällsynta ord bör bytas ut.
- **P3: Fler grammatikområden ur bokens minigrammatik:** prepositioner för tid och plats, räkneord och klockan, oregelbundna verb i presens (verbspelen täcker en del), demonstrativa pronomen, quel/lequel, tout, gérondif och passiv form. Minigrammatiken s. 200–201 och sidorna före s. 194 saknas.

- **P1: Fler sidor ur Escalade.** Inlagda: s. 8–69, 98–131, 148–153, 182–191 och minigrammatiken s. 196–199 och 202–237 (se `languages/fr/book/sidor.json`). Saknas: s. 70–97, 132–147, 154–181, 192–195 och 200–201. Fota också om s. 101, där högerkanten saknas. Kapitelnumret för s. 148–153 (antaget kap 10) och s. 182–191 och titeln på kap 6 behöver bekräftas.
- **P2: Säkerhetskopiera bokmappen** till ett privat repo på GitHub (`languages/fr/book/` är redan ett eget lokalt git-repo). Kräver att föräldern godkänner att ett privat repo skapas.
- **P3: Välja bok per elev**, om flera elever med olika böcker ska använda samma kurs.
- **P2: Alla tre språken från steg 1 till steg 7** (franska, tyska och italienska, Moderna språk 1–7). I dag finns Franska 3, Tyska 4 och 5 och Italienska 1 och 2. Det saknas Franska 1, 2 och 4–7, Tyska 1–3, 6 och 7, och Italienska 3–7, alltså 15 kurser.
  - Varje kurs får en egen mapp i `languages/` och en egen `storageKey`. Bygg efter kursmallen (punkten ovan) och Skolverkets centrala innehåll för steget. Nivån ungefär enligt Skolverket: steg 1 A1.1, 2 A1.2, 3 A2.1, 4 A2.2, 5 B1.1, 6 B1.2, 7 B2.1. Stäm av nivåerna som redan står i Tyska 4 (B1) och Tyska 5 (mot B2) mot detta.
  - Varje kurs ska bygga vidare på den förra utan att orden överlappar (som Italienska 2 och 1), och ha `nextCourse` till nästa steg.
  - Ordning: först kurserna närmast eleverna, alltså Franska 4 (efter Franska 3) och Tyska 6 (efter Tyska 5). Därefter Italienska 3, sedan de lägre stegen (1–2 i franska, 1–3 i tyska) och sist steg 7.
  - Lägg de kommande kurserna i `languages/upcoming.json`, så att de syns som "kommer" i kursväljaren.
  - Innehållet är AI-skrivet och behöver granskas med stickprov, som de andra kurserna.

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Behövs bara om två personer övar på *samma* språk med samma claude.ai-konto. Lägg då till en profilväljare ("Vem övar?").
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.
