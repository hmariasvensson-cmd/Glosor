# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Språkprov (det verkliga målet)

Båda eleverna ska söka musikutbildning utomlands. Oscar behöver visa **B1 i franska** (DELF B1) för Frankrike, och Emma behöver visa **B2 i tyska** för Tyskland. Musikhögskolorna godtar oftast Goethe-Zertifikat B2, telc B2 eller TestDaF, men kontrollera vad just deras skolor kräver. Betyg i kursen spelar mindre roll.

- **P1: Provövningar i provets format.** Tyska B2 (Goethe): Lesen, Hören, Schreiben (Forumsbeitrag och formellt mejl) och Sprechen (presentation och diskussion). DELF B1: compréhension orale, compréhension écrite, production écrite (160 ord, brev eller forum) och production orale (entretien, exercice en interaction, expression d'un point de vue). Skriv uppgifter i samma format, med tidtagning och poäng som i provet.
- **P1: Provsimulering:** ett helt delprov med klocka, poäng mot provets gräns (60 %) och Claudes bedömning av skrivdelen enligt provets kriterier.
- **P1: Musikordförråd** för båda språken: Musikhochschule, Aufnahmeprüfung, Vorspiel, Hauptfach, Stimmlage … och conservatoire, audition, concours d'entrée, solfège … Också fraser för intervju och samtal på antagningsprovet.
- **P2: Muntlig förberedelse:** presentera sig själv och sin musik, med skuggning och Claude som samtalspartner (text).
- **P2: Nivåmätare:** uppskatta var eleven ligger mot B1/B2 utifrån ordförråd, grammatikresultat och Claudes bedömningar, och visa det i statistiken.

## Repetition och inlärning

- **P2: Byt schemaläggare till FSRS** (ts-fsrs, MIT, finns som UMD på jsDelivr). Räkna i dagar i stället för pass, med retention 0,9. Lägg kortdata i ett nytt fält och behåll `s`/`due` för statistik och topplista. Det enklare stegschemat (se KLART.md) löser det värsta, så detta är mindre brådskande.
- **P3: Självbedömning i fyra steg** (Igen/Svårt/Bra/Lätt) i skrivfrågor.
- **P3: Mina ord:** koppla böjda former till grundformen (som Lutes "parent terms"). Ord med glosa sparas redan i grundform, men ord utan glosa sparas som de står i texten.
- **P3: Tatoeba-meningar även för tyska** (`python3 tools/tatoeba.py de`) och fler franska ord (i dag har 136 av 258 ord minst en mening).

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

- **P1: Nästa kapitel i Escalade** (kap 5, från s. 68): fota sidorna och för in dem enligt `docs/BOK.md`. Sidorna 47, 53 och 59 saknades bland bilderna till kap 3–4 och kan fotas i efterhand.
- **P2: Säkerhetskopiera `languages/*/book/`** som ett privat git-repo. Mappen finns bara på den här datorn.
- **P3: Välja bok per elev**, om flera elever med olika böcker ska använda samma kurs.
- **P2: Franska 4 och Tyska 6** som egna kurser (egen mapp i `languages/`, egen `storageKey`). De visas redan som "kommer" i kursväljaren (`languages/upcoming.json`).

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Behövs bara om två personer övar på *samma* språk med samma claude.ai-konto. Lägg då till en profilväljare ("Vem övar?").
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.
