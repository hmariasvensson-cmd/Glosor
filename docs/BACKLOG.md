# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Repetition och inlärning

- **P2: Byt schemaläggare till FSRS** (ts-fsrs, MIT, finns som UMD på jsDelivr). Räkna i dagar i stället för pass, med retention 0,9. Lägg kortdata i ett nytt fält och behåll `s`/`due` för statistik och topplista. Det enklare stegschemat (se KLART.md) löser det värsta, så detta är mindre brådskande.
- **P3: Självbedömning i fyra steg** (Igen/Svårt/Bra/Lätt) i skrivfrågor.
- **P3: Mina ord:** koppla böjda former till grundformen (som Lutes "parent terms").
- **P3: Egen minnesregel per svårt ord**, som eleven skriver själv och som visas på lärokortet.

## Tyska (Tyska 5, mot B2)

- **P2: Större ordförråd, steg 2.** 1 329 ord nu. B2 kräver ungefär 3 000–4 000 ord. Nästa steg är ett frekvensordnat avsnitt från FrequencyWords (CC BY-SA 4.0) eller kaikki/Wiktionary (CC BY-SA 4.0), med källhänvisning. Goethes listor är upphovsrättsskyddade och får inte kopieras.
- **P2: Granskning av grammatikfrågorna** (390 st.) av en lärare eller tysktalande, åtminstone ett stickprov på 10 %. Lägg gärna till en knapp för att rapportera fel facit.
- **P3: Verbdata från Wiktionary/kaikki** i stället för handskrivna verbtabeller.
- **P3: Om flickvännens lärobok fotas:** lägg in bokens kapitel och ordlistor och markera vilka ord som kommer från boken.

## Franska (Franska 3, mot A och B1)

- **P2: Tatoeba-meningar** (CC BY 2.0 FR, källhänvisning krävs) som extra exempel- och luckmeningar.
- **P2: Grammatikövningar för franska** med samma motor som tyskan (`src/grammar.js`): pronomen (le/la/lui/y/en), passé composé med être och kongruens, subjonctif efter il faut que.
- **P3: Fler verb i verbspelen**, datadrivet (verbecc, LGPL-3.0).
- **P3: Granskning av innehållet** (hörtexter, lästexter, berättelser, fraser, kultur) av läraren eller en fransktalande. Allt är AI-skrivet och har bara kontrollerats med stickprov.

## Kurser och nivåer

- **P2: Franska 4 och Tyska 6** som egna kurser (egen mapp i `languages/`, egen `storageKey`). De visas redan som "kommer" i kursväljaren (`languages/upcoming.json`).

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Behövs bara om två personer övar på *samma* språk med samma claude.ai-konto. Lägg då till en profilväljare ("Vem övar?").
- **P3: Topplista med längre historik** (vinnare per vecka bakåt i tiden).
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.
