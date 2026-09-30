# Innehåll till övningarna i Glosor (tyska)

Eleven läser Tyska 5 (Moderna språk 5), är 17–18 år och siktar på betyget A och på B2. Texterna ska vara på nivå B1 till B1+: naturlig, korrekt standardtyska med bisatser, Perfekt och Präteritum, Konjunktiv II, passiv och bindeord, men utan onödigt svåra ord. Läs först `languages/de/words.txt`. Där finns kapitlen (rader som börjar med #) och glosorna. Använd kapitlets glosor i texterna.

Kapitel-id och teman:
- d1: Identität und Beziehungen (familj, vänskap, kärlek, konflikter, grupptryck)
- d2: Bildung und Arbeitswelt (skola, praktik, Ausbildung, studier, CV, jobbintervju)
- d3: Medien und digitale Welt (sociala medier, nyheter, fake news, skärmtid)
- d4: Umwelt und Nachhaltigkeit (klimat, energi, konsumtion, återvinning)
- d5: Gesellschaft und Politik (demokrati, val, migration, jämställdhet, EU)
- d6: Kultur, Kunst und Literatur (böcker, film, musik, museer, teater)
- d7: Gesundheit und Lebensstil (sport, mat, stress, sömn)
- d8: Deutschland, Österreich, Schweiz (historia, städer, dialekter, traditioner)
- dr: Redemittel (diskutera och argumentera)
- dv: Verben mit Präpositionen

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`, en fil per typ). Här står bara det som gäller Tyska 5:

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Välj ord som en elev på B1 behöver för att nå B2: inte nybörjarord, utan ord för att läsa tidningstext, diskutera och argumentera. Blanda substantiv, verb (särskilt verb med prepositioner och fast kasus), adjektiv och fasta uttryck. Exempelmeningar på B1/B2, 6–14 ord.

## Innehållet

- `stories.json`: `gaps[i].cat` är `"tempus"` (verbform: Präteritum/Perfekt, haben/sein, Konjunktiv II, rätt person) eller `"bindeord"` (bindeord där ordföljden i meningen avgör, t.ex. `[Trotzdem|Obwohl|Denn]`).
- `prompts.json`: `need.tenses` får bara innehålla `"Präsens"`, `"Perfekt"`, `"Präteritum"`, `"Konjunktiv II"` och `"Passiv"` (`tenseCheck` i `languages/de/lang.js`). `need.connectors` räknar bindeorden i `connectors` i samma fil.
- `culture.json`: fakta om Tyskland, Österrike och Schweiz som går att kontrollera. Frågan `ask` handlar om hur det är i Sverige.

## Grammatikområden (`grammar-*.json`)

Meningarna ska vara naturlig och korrekt standardtyska på nivå B1/B1+, 6–18 ord, med teman och ord från ordlistan. Använd bara dessa `topic` och `rule`. Siffran anger ungefär hur många frågor som behövs.

| topic | antal | rule | innehåll |
|---|---|---|---|
| `praep` | 70 | `wechsel-dat`, `wechsel-akk`, `dat-prep`, `akk-prep`, `gen-prep` | Kasus efter preposition. Luckan är artikeln (eller sammandragningen, se `docs/spec/grammatik.md`). Blanda bestämd artikel, obestämd artikel och possessiva. Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen) i ungefär hälften, med par av typen *liegen/legen, stehen/stellen, sein/gehen*. |
| `relativ` | 45 | `rel-nom`, `rel-akk`, `rel-dat`, `rel-gen`, `rel-prep`, `rel-was` | Relativpronomen. Luckan är pronomenet, eller preposition + pronomen (`[mit der]`). `rel-gen`: dessen/deren. `rel-was`: was/wo efter alles, etwas, nichts, das Beste och ortsnamn. |
| `verbprep` | 50 | `vp-prep`, `vp-kasus`, `vp-da`, `vp-wo` | Verb med preposition (sich freuen auf/über, warten auf, sich interessieren für, teilnehmen an …). `vp-prep`: luckan är prepositionen. `vp-kasus`: artikeln efter prepositionen. `vp-da`: da-ord i svar (*Ja, ich freue mich [darauf].*). `vp-wo`: frågeord (*[Worauf] wartest du?*). Om en person avses används preposition + pronomen, inte da-/wo-ord – ta med några sådana (*Auf wen wartest du?*). |
| `perfekt` | 45 | `pf-sein`, `pf-haben`, `plq` | Perfekt med haben eller sein (luckan är hjälpverbet i rätt form), inklusive knepiga fall: bleiben, passieren, werden, sein; fahren med och utan objekt; einschlafen, aufwachen, umziehen. `plq`: pluskvamperfekt med nachdem (*Nachdem ich gegessen [hatte], …*). |
| `bisatz` | 30 | `bs-sub`, `bs-inv`, `bs-konj`, `bs-first` | Alla av typen `rw`. `bs-sub`: weil, dass, obwohl, wenn, als, ob, nachdem, bevor, während, damit (verbet sist). `bs-inv`: deshalb, trotzdem, dann, außerdem, deswegen, sonst (verbet direkt efter). `bs-konj`: denn, aber, und, oder, sondern (ingen ändring). `bs-first`: bisatsen först, så huvudsatsen börjar med verbet. Blanda typerna så att eleven måste tänka. |
| `konj` | 45 | `k2-wenn`, `k2-wunsch`, `k2-verg`, `k1-rede` | Konjunktiv II i villkorssatser (*Wenn ich mehr Zeit [hätte], [würde] ich öfter Sport machen.*), önskningar och artighet (*[Könnten] Sie mir helfen?*, *Ich [hätte] gern …*), dåtid (*Wenn ich das gewusst [hätte], [wäre] ich gekommen.*) och Konjunktiv I i indirekt tal från nyheter (*Die Ministerin sagt, die Lage [sei] ernst.*, *habe, werde, könne, müsse*). |
| `passiv` | 40 | `pa-praes`, `pa-praet`, `pa-perf`, `pa-modal`, `pa-zustand` | Vorgangspassiv i presens, preteritum och perfekt (*ist … gebaut worden*), med modalverb (*muss … renoviert werden*), och Zustandspassiv (*Das Geschäft [ist] geschlossen.* mot *[wird] um 18 Uhr geschlossen*). Använd flera luckor där formen är delad. Teman: miljö, samhälle, historia, teknik. |
| `zuinf` | 30 | `zu-inf`, `umzu`, `damit`, `ohne-statt` | Infinitiv med zu efter verb och uttryck (*Ich habe vor, im Sommer [zu] arbeiten.*, *aufzustehen*), um … zu mot damit (samma eller olika subjekt), ohne/statt … zu. Separabla verb: *anzurufen*. |
| `bindeord` | 35 | `bi-grund`, `bi-kontrast`, `bi-folge`, `bi-tillagg` | Välj bindeordet som passar **både** betydelsen och ordföljden i meningen: *Es regnet. [Trotzdem] gehen wir spazieren.* med alt `["Obwohl", "Denn", "Weil"]` (obwohl/weil kräver verbet sist, denn kräver rak ordföljd). Förklara i `why` både betydelse och ordföljd. Gärna argumenterande meningar om samhällsfrågor. |
| `gen` | 30 | `gn-art`, `gn-prep`, `gn-ndekl` | I `grammar-b2.json`. Genitivartiklar med -s/-es (*die Qualität [des Unterrichts]*, namn utan apostrof), prepositioner med genitiv (wegen, trotz, während, statt, innerhalb; luckan är artikel + substantiv eller prepositionen) och n-deklination (*den [Kollegen]*, *dem [Studenten]*, *[Herrn] Weber*, *des Namens*), plus några vanliga maskulina som inte är svaga (*den Lehrer*). Undvik dativ som felalternativ efter wegen/trotz/während, eftersom det förekommer i talspråk. |
| `partizip` | 25 | `pz-1`, `pz-2`, `pz-erw`, `pz-rel` | I `grammar-b2.json`. Partizip I och II som attribut med adjektivändelse (*die [steigenden] Preise*, *die [renovierte] Stadthalle*), utbyggda attribut (*der seit Jahren [geplante] Umbau*, *[Die] von der Stadt finanzierten Kurse*). `pz-rel` är `rw`: relativsatsen i `q` görs om till ett particip-attribut, `cue` = `Partizip I` eller `Partizip II`. |
| `zweiteilig` | 25 | `zt-par`, `zt-kontrast`, `zt-je` | I `grammar-b2.json`. Tvådelade bindeord: sowohl … als auch, weder … noch, entweder … oder, nicht nur … sondern auch (`zt-par`), zwar … aber, einerseits … andererseits (`zt-kontrast`), je … desto/umso (`zt-je`: je + bisats, desto + omvänd ordföljd). Blanda luckor och `rw` med `cue` = paret. Lägg alla korrekta ordföljder i `acc`. |

Se också `meta` och sammandragningarna i `docs/spec/grammatik.md`.
