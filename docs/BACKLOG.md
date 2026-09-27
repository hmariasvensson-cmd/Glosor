# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Repetition och inlärning

- **P1: Inlärda ord kommer aldrig tillbaka.** Ett ord som klarats fyra gånger får `due=1e9` och pensioneras, och ett enda fel skickar ordet till steg 0. Låt inlärda ord komma tillbaka med långa intervall, och låt ett fel flytta ordet ett eller två steg ned i stället för till 0. Sparformatet `{s,due}` kan behållas. (Källa: ideer-fran-andra-projekt.md, punkt 1)
- **P2: Byt schemaläggare till FSRS** (ts-fsrs, MIT, finns som UMD på jsDelivr). Räkna i dagar i stället för pass, med retention 0,9. Lägg kortdata i ett nytt fält och behåll `s`/`due` för statistik och topplista.
- **P2: Markera "igel"-ord** (ord med många fel, "leech" i Anki) och ge dem extra stöd, till exempel en ny exempelmening eller en minnesregel.
- **P3: Självbedömning i fyra steg** (Igen/Svårt/Bra/Lätt) i skrivfrågor, och en prognos i statistiken över kommande repetitioner.
- **P3: Mina ord:** gå att ta bort ett sparat ord, lägga till egna ord för hand och koppla böjda former till grundformen (som Lutes "parent terms").
- **P3: Färgmarkera kända och okända ord** i läs- och hörtexterna (som LWT/Lute).

## Tyska (Tyska 5, mot B2)

- **P1: Grammatikövningar för tyska** enligt `docs/ovningsforslag-tyska.md`, i prioritetsordning:
  1. Adjektivändelser (genereras ur en tabell och ordlistans genus)
  2. Kasus efter preposition, inklusive var/vart (Wechselpräpositionen)
  3. Bisatsordföljd: slå ihop meningar med weil/deshalb/denn (bygger på ordbrickorna)
  4. Relativsatser, även med preposition samt dessen/deren
  5. Verb med preposition och da-/wo-ord (bygger på kapitlet dv)
  6. Konjunktiv II och indirekt tal (Konjunktiv I)
  7. Passiv i olika tempus och med modalverb, samt Zustandspassiv
  8. Hitta felet (ett skript lägger in typiska fel i korrekta meningar)
  9. Bindeord med rätt ordföljd
  10. zu-infinitiv, um…zu och damit
  11. Perfekt med haben eller sein, plus pluskvamperfekt
- **P1: Innehåll till de nya övningstyperna på tyska.** I dag har bara franskan hörtexter, lästexter, berättelser, fraser, skrivuppgifter och kultur. Tyskan får automatiskt meningar, diktamen, översättning och ordföljd. Behövs: `languages/de/content/*.json` i samma format som franskan. Berättelserna bör gälla Präteritum/Perfekt och bindeord.
- **P2: Större ordförråd.** 829 ord nu. B2 kräver ungefär 3 000–4 000 ord eller fler. Nästa steg:
  - ett frekvensordnat avsnitt med allmänna ord (FrequencyWords CC BY-SA 4.0 eller kaikki/Wiktionary CC BY-SA 4.0, med källhänvisning)
  - ordbildning (-ung, -keit, -lich, un-)
  - fasta verbfraser
  - Goethes listor är upphovsrättsskyddade och får inte kopieras
- **P2: Spel för der/die/das och plural** med data ur ordlistan (eller kaikki).
- **P2: Fler verb i de tyska verbspelen**, datadrivet (starka verb från Wiktionary/kaikki).
- **P2: Videor till det nya kapitlet dv** (Verben mit Präpositionen). Kontrollera länkarna med oEmbed.
- **P3: Om flickvännens lärobok fotas:** lägg in bokens kapitel och ordlistor och markera vilka ord som kommer från boken.

## Franska (Franska 3, mot A och B1)

- **P2: Fler verb och tempus** inför B1: futur simple, conditionnel och fler oregelbundna verb, datadrivet (verbecc, LGPL-3.0).
- **P2: Tatoeba-meningar** (CC BY 2.0 FR, källhänvisning krävs) som extra exempel- och luckmeningar.
- **P3: Granskning av innehållet** (hörtexter, lästexter, berättelser, fraser, kultur) av läraren eller en fransktalande. Allt är AI-skrivet och har bara kontrollerats med stickprov.

## Kurser och nivåer

- **P2: Franska 4 och Tyska 6** som egna kurser (egen mapp i `languages/`, egen `storageKey`). De visas redan som "kommer" i kursväljaren (`languages/upcoming.json`).
- **P3: Gy25-kursnamn.** Franska 3 heter "Moderna språk – fortsättning, nivå 1" och Tyska 5 heter "Moderna språk – fördjupning, nivå 1" för den som började gymnasiet efter juli 2025. Visa rätt namn.
- **P3: Välja vilka kurser man ser**, till exempel att flickvännen bara ser tyska.

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.
- **P2: Flera personer på samma konto.** Om två använder samma claude.ai-konto delar de framsteg per kurs, och topplistan kan inte skilja dem åt. Lägg till en profilväljare ("Vem övar?") om det behövs.
- **P2: Publicera helst när ingen övar.** En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.
- **P3: Loggen kapas vid 1 000 poster** så att dokumentet håller sig under 256 kB. Sammanfatta äldre poster i stället, så att statistiken över totalt antal minuter blir kvar.
- **P3: Topplista:** veckans vinnare, historik och mål per vecka.
- **P3: En föräldravy** där föräldern kan se barnens framsteg. Privata framsteg syns inte ens för ägaren, så det kräver att eleven själv delar en sammanfattning, som topplistan redan gör delvis.

## Teknik

- **P2: GitHub.** Skapa repot `hmariasvensson-cmd/glosor` (publikt) och ge datorn åtkomst: lägg till den publika SSH-nyckeln i GitHub, eller installera `gh` och logga in. Pusha sedan.
- **P3: Talövning** saknas eftersom artefakter inte får använda mikrofonen. Alternativ: ett skuggningsläge (lyssna, säg efter högt, bedöm själv).
