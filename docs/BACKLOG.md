# Backlogg

Allt som har diskuterats men inte är byggt ännu. Prioritet: **P1** = gör snart, **P2** = viktigt, **P3** = bra att ha.
Det som är byggt flyttas till [`KLART.md`](KLART.md), med referens till punkten här och till commit.
Underlag finns i `docs/ovningsforslag.md` (franska), `docs/ovningsforslag-tyska.md` (tyska) och `docs/ideer-fran-andra-projekt.md`.

## Tyck till från eleverna

- **Löpande (prioriteras först):** läs nya meddelanden i `feedback/<uid>/msgs` för varje uid i `board` (ArtifactData, `status: "ny"`), för in önskemålen här, och sätt `status` och `reply` i dokumentet så att eleven ser vad som hände (se CLAUDE.md). Elevernas önskemål går före annat i backloggen.

## Färre men mer värdefulla övningar (granskning 2026-09-28)

Beslut 2026-10-01: menyn behålls som den är (inga färre menyval). Genus visas som förut i tyskans skrivfrågor (döljs inte). Granskningen görs av AI-agenter, inte av människor (föräldern: "Det funkar inte att få en människa att göra det").

Föräldern: "Vi vill inte ha för många övningar men vi vill ha övningar som är så värdefulla som möjligt." Granskningen jämförde alla cirka 20 övningar med forskningen om inlärning (testeffekt, utspridd repetition, egen produktion, begriplig input, återkoppling). Slutsats: Dagens pass är nästan bara drill, lyssning, läsning, tal och skrivande ingår inte, och flera övningar gör samma sak med samma meningar.

## Språkprov (det verkliga målet)



Båda eleverna ska söka musikutbildning utomlands. Eleven i franska behöver visa **B1 i franska** (DELF B1) för Frankrike, och eleven i tyska behöver visa **B2 i tyska** för Tyskland. Musikhögskolorna godtar oftast Goethe-Zertifikat B2, telc B2 eller TestDaF, men kontrollera vad just deras skolor kräver. Betyg i kursen spelar mindre roll.


## Repetition och inlärning

- **P3: Byt schemaläggare till FSRS** (eleven önskade 2026-09-27 ett fast schema: nästa pass, efter 3 pass, sedan 3, 7 och 20 dagar, vilket är byggt; FSRS bara om han vill) (ts-fsrs, MIT, finns som UMD på jsDelivr). Räkna i dagar i stället för pass, med retention 0,9. Lägg kortdata i ett nytt fält och behåll `s`/`due` för statistik och topplista. Det enklare stegschemat (se KLART.md) löser det värsta, så detta är mindre brådskande.

## Italienska 1 och 2

## Tyska 4 (B1)

## Tyska (Tyska 5, mot B2)

Emma pluggar på egen hand, utan kurs, lärare och lärobok. Tyskan bygger därför helt på kursplanen och det allmänna spåret.



## Franska (Franska 3, mot A och B1)

## Kurser och nivåer

- **P2: Resten av kursmallen** (`docs/kursmall.md`, avsnitt 4). Byggt: paket 1–8, 10 och 13–16 samt nivåerna. Kvar:
  - Paket 9 (grammatiken kopplad till kapitel) gör bara nytta i kurser med lärobok, så det väntar.
  - Lyssna igenom uttalsövningarna med en riktig röst. Vissa par kan låta lika i vissa webbläsare, till exempel é/è i franska och enkelt/dubbelt s i italienska. Sällsynta ord bör bytas ut.
- **P1: Fler sidor ur Escalade.** Inlagda: s. 8–69, 98–131, 148–153, 182–191 och minigrammatiken s. 196–199 och 202–237 (se `languages/fr/book/sidor.json`). Saknas: s. 70–97, 132–147, 154–181, 192–195 och 200–201. Fota också om s. 101, där högerkanten saknas. Kapitelnumret för s. 148–153 (antaget kap 10) och s. 182–191 och titeln på kap 6 behöver bekräftas.
- **P2: Säkerhetskopiera bokmappen** till ett privat repo på GitHub (`languages/fr/book/` är redan ett eget lokalt git-repo). Kräver att föräldern godkänner att ett privat repo skapas.
- **P3: Välja bok per elev**, om flera elever med olika böcker ska använda samma kurs.
- **P2: De nya kurserna (2026-09-29): fyll på.** Granskade av AI-agenter 2026-10-01. Textlängder, glosor och ordantal är åtgärdade 2026-10-01 (se KLART.md, version 35). Överlapp mellan kurser är tillåtet men kan minskas (se "Öppet efter 2026-10-01"). Frekvenstäckning och videor gjorda 2026-10-05 (version 40–41).
  - Varje kurs får en egen mapp i `languages/` och en egen `storageKey`. Bygg efter kursmallen (`docs/kursmall.md`) och Skolverkets centrala innehåll för steget. Nivån ungefär enligt Skolverket: steg 1 A1.1, 2 A1.2, 3 A2.1, 4 A2.2, 5 B1.1, 6 B1.2, 7 B2.1.
  - Varje kurs ska bygga vidare på den förra utan att orden överlappar, och ha `nextCourse` till nästa steg.
  - Ordning: Italienska 3 (står som kommande i `languages/upcoming.json`), sedan de lägre stegen (1–2 i franska, 1–3 i tyska) och sist steg 7 och Franska 5.
  - Arbetssätt som fungerade för Franska 6 (fr4) och Tyska 6: glosorna i två halvor av två agenter (med dubblettkontroll mot tidigare kurser och mot varandra), allt övrigt innehåll av en tredje. Modelltexterna i skrivuppgifterna ska skrivas **efter** ordlistan, annars saknar de kapitelord.
  - Innehållet är AI-skrivet och behöver granskas med stickprov, som de andra kurserna.
- **P2: Franska: brister från nivågranskningen** (`docs/nivaer-franska.md`, avsnitt 4; beslutet om nivåerna är genomfört 2026-09-29):
  - **Franska 6 (`fr4`): ordmängden** 1 045 ord mot målet 1 000–1 200 per steg; tillsammans med frs4/frs5 ska kedjan nå ca 3 000 ord. Dubblettkontroll mellan frs4/frs5 och fr4 behövs (överlapp är godkänt av föräldern, men bör hållas litet).
  - **Franska I (`fru`): de nya områdena `nomin` och `conces`** (2026-09-29) är AI-skrivna; `nomin-reg` och `nomin-titre` är undantagna från Hitta felet. Granska stilnivåexemplen (familier/soutenu) med en fransktalande.

## Arkitektur (granskning 2026-09-29)

Granskning av `src/app.js`, `src/kinds/`, arvet i `lang.js`, `build.py`, testerna och kursmapparna. Punkterna från granskningen 2026-09-28 är byggda (se KLART.md, 2026-09-28 del 6). Rättat direkt 2026-09-29, bara i build.py och testerna: bygget gick inte igenom utan den privata bokmappen (`check_content` stoppade på `sec: "k4"` …, nu en varning), nya kontroller i `check_grammar_refs` (grammatikfrågans `topic`/`rule` finns i grammar.json, områdenas `secs` finns i words.txt, nycklarna i regler.json är områden) och i `check_extends` (varje fält i `inherit` finns hos föräldern, `nextCourse` finns), ett begripligt fel när en bokfil är lista och kursens objekt (eller tvärtom), och storleksvarningar (`MAX_PAGE_KB`, `MAX_DATA_KB`). Testerna finns i `test_build_checks` i `tests/run_tests.py`.

## Konton, sparande och topplista

- **P1: Bjud in eleven och flickvännen** som Redigerare via e-post i Dela-menyn, med egna claude.ai-konton. Görs av föräldern. Kontrollera att gratiskonton fungerar, vilket inte är testat.

## Arbetssätt

- Publicera helst när ingen övar. En ny version laddas in hos den som har sidan öppen. Pågående pass sparas och kan fortsättas, men det som visas på skärmen byts ut.

## Öppet efter 2026-09-30 (version 33)

- **P3: TDN-gränserna** (80/60/40 %) är uppskattningar, inte TestDaF:s egna.
- **P3: Planerna genereras av `tools/plan.py`** — kör om när en kurs får nya avsnitt eller texter (bygget varnar).

## Öppet efter 2026-10-02 (version 38)

- **P3: Uttalspar med samma stavning** (it3 pèsca/pésca, àncora/ancòra) fungerar bara om rösten läser accenterna.

## Öppet efter 2026-10-01 (version 36)

- **P3: Dubbletter mellan kurser** (godkänt överlapp, inget att göra): it2/it1 «la mezzanotte», «in bocca al lupo»; it3/it1 «già»; de/de6 «die Überschrift»; 58 ord i både de1 och de3 m.fl.
## Öppet efter 2026-10-01 (version 35)

Granskningspunkterna nedan är avgjorda av granskningsagenterna 2026-10-01 (version 36).

- **P3: Dubbletter:** frs5 och fr4 delar 245 ord (förslag: ta bort ur frs5, inte fr4, listan i agentens arbetsfil); "die Überschrift (-en)" finns i både de och de6; it5–it6 sju ord; il Parlamento/il parlamento. Ändra bara med `ids.removed` och förälderns godkännande.

## Öppet efter 2026-10-05 (version 40)

- **P3: Kvar i frekvenslistorna** (`docs/frekvens.md`): Franska 3 når 80,9 % av topp 1000; A1-orden ligger i fr1/fr2, som eleven i Franska 3 inte ser. Kan läggas till i `vanliga2` om överlapp önskas.
- **P3: Musiktermerna** kan fortfarande kontrolleras med en musiklärare (franska 3, Tyska 4, Tyska 5).
- **P3: Tyska 5:s datafil** är 1 593 kB, nära varningsgränsen `MAX_DATA_KB` (1 600 kB, en egen varning, ingen teknisk gräns). Största delen är Tatoeba-meningarna (294 kB); de kan hämtas separat som provfilen (`ensureExam`) om filen växer mer, men meningsövningarna, Dagens pass och återupptagna pass måste då vänta på dem.
- **P3: Sidans storlek:** `dist/index.html` är 415 kB, nära varningsgränsen `MAX_PAGE_KB` (420 kB) efter profiler och föräldravy.
