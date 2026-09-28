# Grammatikövningar för tyska: format för meningsbankerna

Eleven läser Tyska 5 (Moderna språk 5, B1 → B2) och är en svensk gymnasieelev, 17–18 år. Meningarna ska vara naturlig och korrekt standardtyska på nivå B1/B1+. Använd gärna teman och ord från ordlistan i `languages/de/words.txt`: identitet och relationer, utbildning och arbete, medier, miljö, samhälle och politik, kultur, hälsa samt Tyskland, Österrike och Schweiz. Förklaringarna och översättningarna skrivs på naturlig svenska för en tonåring.

Meningsbankerna ligger i `languages/de/content/grammar-*.json`. `build.py` slår ihop dem och kontrollerar dem. Varje fil är en JSON-lista med frågor.

## Två typer av frågor

### Lucka (standard)

```json
{"id": "praep-001", "topic": "praep", "rule": "wechsel-dat",
 "q": "Das Buch liegt auf [dem] Tisch.",
 "alt": ["den", "der", "das"],
 "why": "Var ligger boken? Befintlighet (liegen) ger dativ efter auf.",
 "sv": "Boken ligger på bordet.",
 "meta": {"prep": "auf", "case": "dat", "g": "m", "art": "def"}}
```

- `id`: unik och ändras aldrig. Prefix = topic, följt av löpnummer.
- `q`: meningen med rätt svar inom hakparentes. Oftast en lucka. En lucka kan innehålla flera ord (`[mit der]`).
  Flera luckor är tillåtna när formen är delad: `Die Schule [wird] gerade [renoviert].`
- `alt`: 2–4 **felaktiga** svar som eleven kan förväxla. Vid flera luckor skrivs varje alternativ med ` … ` mellan delarna, lika många delar som luckor: `"wurde … renovieren"`. Alternativen ska vara tydligt fel i just den meningen, aldrig ett annat godtagbart svar.
- `acc` (valfri): andra svar som också är rätt, t.ex. `["ins"]` om både `in das` och `ins` går.
- `why`: kort förklaring på svenska, 1–2 meningar, som visas efter svaret. Nämn regeln och varför de andra alternativen är fel.
- `sv`: svensk översättning av hela meningen.
- `meta`: bara där det står nedan, för maskinkontroll.

### Sätt ihop två meningar (`"type": "rw"`)

```json
{"id": "bisatz-001", "topic": "bisatz", "rule": "bs-sub", "type": "rw",
 "q": "Ich bleibe heute zu Hause. Ich bin krank.", "cue": "weil",
 "a": "Ich bleibe heute zu Hause, weil ich krank bin.",
 "acc": ["Weil ich krank bin, bleibe ich heute zu Hause."],
 "alt": ["Ich bleibe heute zu Hause, weil ich bin krank.", "Ich bleibe heute zu Hause, weil bin ich krank."],
 "why": "Weil är en subjunktion: verbet ställs sist i bisatsen.",
 "sv": "Jag stannar hemma i dag eftersom jag är sjuk."}
```

- Eleven bygger svaret av ordbrickor från `a`, så **alla meningar i `acc` måste bestå av exakt samma ord som `a`** (bara ordningen, stor bokstav och kommatecken får skilja sig).
- `a`: 5–14 ord. `alt`: 2–3 felaktiga meningar med vanliga fel (fel ordföljd), med samma ord.
- `cue`: bindeordet eller konstruktionen som ska användas.

## Ämnen och regler

Använd bara dessa `topic` och `rule`. Siffran anger ungefär hur många frågor som behövs.

| topic | antal | rule | innehåll |
|---|---|---|---|
| `praep` | 70 | `wechsel-dat`, `wechsel-akk`, `dat-prep`, `akk-prep`, `gen-prep` | Kasus efter preposition. Luckan är artikeln (eller sammandragningen, se nedan). Blanda bestämd artikel, obestämd artikel och possessiva. Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen) i ungefär hälften, med par av typen *liegen/legen, stehen/stellen, sein/gehen*. |
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

### Sammandragningar i `praep`

Där tyskan normalt drar ihop (im, ins, am, ans, zum, zur, vom, beim) ska luckan innehålla sammandragningen, t.ex. `Ich bin [im] Kino.` med `"meta": {"prep": "in", "case": "dat", "g": "n", "art": "def"}` och alt `["in das", "ins", "in die"]`. Använd `acc` om både sammandragen och full form är naturliga.

## Maskinkontroll (`meta`)

- `praep`: `{"prep", "case": "nom|akk|dat|gen", "g": "m|f|n|pl", "art": "def|indef|poss|kein"}`. Vid `poss` och `kein` lägg till `"stem"`, t.ex. `"mein"`. Skriptet räknar fram den rätta artikeln och jämför med luckan (efter att ha tagit bort en preposition i början av luckan).
- `relativ`: `{"g": "m|f|n|pl", "case": "nom|akk|dat|gen"}` (vid `rel-was` utelämnas meta). Skriptet kontrollerar pronomenet (sista ordet i luckan).
- Andra ämnen har ingen `meta`.

## Kvalitet

- Varje mening ska vara grammatiskt helt korrekt och låta naturlig. Undvik konstlade meningar som bara finns för att testa en regel.
- Variera personer, tempus, ämnen och meningslängd (6–18 ord). Ingen mening får förekomma två gånger.
- Svaret ska vara entydigt. Om två svar är rätt ska båda finnas med (`acc`) eller så ska meningen skrivas om.
- Kontrollera filen innan du är klar: validera JSON med `python3 -c "import json;json.load(open('FIL'))"` och läs igenom alla meningar en gång till, med extra fokus på kasus, genus och ordföljd.
