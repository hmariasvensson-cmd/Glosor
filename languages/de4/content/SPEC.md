# Innehåll till övningarna i Tyska 4

Eleven är 18 år, har läst Tyska 3 och repeterar Tyska 4 (nivå B1) på egen hand innan Tyska 5 (mot B2). Hon ska söka musikutbildning i Tyskland. Texterna ska vara på nivå **A2+ till B1**: naturlig, korrekt standardtyska, huvudsakligen korta meningar, Präsens, Perfekt och Präteritum av sein/haben/modalverb, enkla bisatser (weil, dass, wenn, als), Konjunktiv II i artighetsfraser. Läs `languages/de4/words.txt` och använd kapitlets glosor.

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`). Det som gäller alla tyska kurser (tempusnamnen i `need.tenses`, berättelsernas luckor, kulturen) står i `languages/de/content/SPEC.md`. Fältet med tysk text heter `fr`. I `prompts.json` räknas bindeord mot listan i `languages/de/lang.js` (ärvd).

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Välj **vanliga ord på nivå A2–B1** som man behöver i vardagen, på resa och i samtal: kärnordförrådet som Tyska 5 bygger vidare på. Undvik ord som redan finns i `languages/de/words.txt` (Tyska 5); kontrollera med skript innan du är klar. Exempelmeningarna ska vara enkla (A2–B1, 5–12 ord).

### Kapitel (id ändras aldrig)

- `#t1|Kap 1 · Alltag und Freizeit`: dagsrutiner, tid och klockan, veckodagar som uttryck, fritid, vänner, träffas
- `#t2|Kap 2 · Wohnen und Zusammenleben`: bostad, rum och möbler, hushållssysslor, grannar, stad och land, flytta
- `#t3|Kap 3 · Essen, Einkaufen und Geld`: mat och dryck, restaurang, affär, kläder, pengar, betala
- `#t4|Kap 4 · Reisen und Verkehr`: resa, tåg, flyg, hotell, vägbeskrivning, semester, väder
- `#t5|Kap 5 · Schule, Sprachen und Zukunft`: skola, ämnen, prov, språk, planer, sommarjobb
- `#t6|Kap 6 · Musik, Sport und Hobbys`: instrument, spela, öva, konsert, band, kör, sport, klubbar (eleven ska söka musikutbildning, så musikorden är viktiga)
- `#t7|Kap 7 · Körper und Gesundheit`: kroppsdelar, sjukdomar, läkare, apotek, må bra
- `#t8|Kap 8 · Feste, Feiern und Jahreszeiten`: högtider, födelsedag, bjuda in, presenter, årstider, traditioner
- `#tr|Redemittel · Im Gespräch`: vardagsfraser, säga sin åsikt enkelt, hålla med, be om hjälp, reagera, känslor

Ungefär 60 ord per kapitel och 50 i Redemittel.

## Grammatikområden (`grammar-*.json`, format i `docs/spec/grammatik.md`)

Nivån är **A2–B1**, meningar på 5–14 ord med vardagliga teman ur `languages/de4/words.txt` (vardag, boende, mat, resor, skola, musik och sport, hälsa, högtider). Ingen mening får finnas med i Tyska 5:s banker (`languages/de/content/grammar-*.json`).

| topic | antal | rule | innehåll |
|---|---|---|---|
| `praep` | 40 | `wechsel-dat`, `wechsel-akk`, `dat-prep`, `akk-prep` | Luckan är artikeln eller sammandragningen, med `meta` som i Tyska 5. Mest bestämd och obestämd artikel, några possessiva. |
| `perfekt` | 40 | `pf-sein`, `pf-haben`, `prt-hilf` | Hjälpverbet i perfekt (bin/hat …), vanliga verb. `prt-hilf`: Präteritum av sein, haben och modalverben (war, hatte, musste, konnte, wollte, durfte, sollte). |
| `nebensatz` | 30 | `ns-alswenn`, `ns-dassob`, `ns-grund` | Luckan är subjunktionen. als (en gång i dåtid) mot wenn (upprepat eller nu/framtid) mot wann (fråga); dass mot ob; weil, obwohl, damit. |
| `bisatz` | 25 | `bs-sub`, `bs-inv`, `bs-konj`, `bs-first` | Bara `rw`. Samma regler som i Tyska 5, enklare meningar. |
| `relativ` | 30 | `rel-nom`, `rel-akk`, `rel-dat`, `rel-prep` | Med `meta` `{g, case}` som i Tyska 5. |
| `reflexiv` | 25 | `refl-akk`, `refl-dat` | Luckan är reflexivpronomenet: *Ich freue [mich].*, *Ich wasche [mir] die Hände.*, *Wir treffen [uns].* |
| `konj` | 30 | `k2-wunsch`, `k2-wenn`, `k2-rat` | *Ich [hätte] gern …*, *[Könnten] Sie …?*, *Wenn ich Zeit [hätte], [würde] ich …*, *An deiner Stelle [würde] ich …* |
| `passiv` | 25 | `pa-praes`, `pa-praet` | *Das Brot [wird] jeden Morgen [gebacken].* och *Das Haus [wurde] 1990 [gebaut].* |
| `komp` | 25 | `komp`, `sup`, `komp-wie` | *größer, am größten, besser, lieber, mehr*; *so groß [wie]* mot *größer [als]*. |

`id`-prefixet är topic, och löpnumret är tresiffrigt (`reflexiv-001`). Ingen mening får finnas med i Tyska 5:s banker (`languages/de/content/grammar-*.json`).
