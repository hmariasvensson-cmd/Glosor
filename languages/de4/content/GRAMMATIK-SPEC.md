# Grammatikövningar för Tyska 4

Formatet är exakt detsamma som i `languages/de/content/GRAMMATIK-SPEC.md` (lucka eller `"type": "rw"`, fälten id, topic, rule, q, alt, why, sv, acc, meta). Nivån är lägre: **A2–B1**, meningar på 5–14 ord med vardagliga teman ur `languages/de4/words.txt` (vardag, boende, mat, resor, skola, musik och sport, hälsa, högtider).

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
