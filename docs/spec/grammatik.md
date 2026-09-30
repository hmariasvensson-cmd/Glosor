# Grammatikövningar: grammar.json och grammar-*.json

Allmänna regler: [allmant.md](allmant.md). Regelsidorna: [regler.md](regler.md). Kursens områden (`topic`), regler (`rule`), antal frågor och nivå står i kursens `content/SPEC.md` och i `languages/<kod>/grammar.json`.

## grammar.json

`{"topics": [{"id", "name", "secs": [avsnitt där området kommer först], …}], "rules": {<rule>: "namn"}}`, för tyskan också `adj`. Områdes-id och regelnamn låses i `ids.lock`. build.py stoppar om en fråga har ett `topic` eller `rule` som inte finns här, eller om `secs` pekar på ett avsnitt som inte finns.

## Meningsbankerna: content/grammar-*.json

Varje fil är en JSON-lista med frågor. build.py slår ihop alla filer till en bank och kontrollerar dem (`check_grammar`). Kurser med många områden har en fil per område, `grammar-<område>.json`, med id-prefixet `<område>-`.

### Lucka (standard)

```json
{"id": "praep-001", "topic": "praep", "rule": "wechsel-dat",
 "q": "Das Buch liegt auf [dem] Tisch.",
 "alt": ["den", "der", "das"],
 "why": "Var ligger boken? Befintlighet (liegen) ger dativ efter auf.",
 "sv": "Boken ligger på bordet.",
 "meta": {"prep": "auf", "case": "dat", "g": "m", "art": "def"}}
```

- `id`: unik och ändras aldrig. Prefix = topic, följt av ett tresiffrigt löpnummer (`reflexiv-001`).
- `q`: meningen med rätt svar inom hakparentes. Oftast en lucka, som kan innehålla flera ord (`[mit der]`). Flera luckor är tillåtna när formen är delad: `Die Schule [wird] gerade [renoviert].` Efter en elision skrivs hela formen i luckan: `Je [l'ai] vu hier.`
- `alt`: 2–4 **felaktiga** svar som eleven kan förväxla. Vid flera luckor skrivs varje alternativ med ` … ` mellan delarna, lika många delar som luckor: `"wurde … renovieren"`. Alternativen ska vara tydligt fel i just den meningen, aldrig ett annat godtagbart svar.
- `acc` (valfri): andra svar som också är rätt, t.ex. `["ins"]` om både `in das` och `ins` går.
- `why`: kort förklaring på svenska, 1–2 meningar. Nämn regeln och varför de andra alternativen är fel.
- `sv`: svensk översättning av hela meningen.
- `meta`: bara i tyskans `praep` och `relativ`, se nedan.

### Sätt ihop eller skriv om (`"type": "rw"`)

```json
{"id": "bisatz-001", "topic": "bisatz", "rule": "bs-sub", "type": "rw",
 "q": "Ich bleibe heute zu Hause. Ich bin krank.", "cue": "weil",
 "a": "Ich bleibe heute zu Hause, weil ich krank bin.",
 "acc": ["Weil ich krank bin, bleibe ich heute zu Hause."],
 "alt": ["Ich bleibe heute zu Hause, weil ich bin krank.", "Ich bleibe heute zu Hause, weil bin ich krank."],
 "why": "Weil är en subjunktion: verbet ställs sist i bisatsen.",
 "sv": "Jag stannar hemma i dag eftersom jag är sjuk."}
```

- Eleven bygger svaret av ordbrickor från `a`, så **`acc` och `alt` måste bestå av exakt samma ord som `a`** (bara ordningen, stor bokstav och kommatecken får skilja sig; build.py kontrollerar). Programmet delar vid mellanslag, så `habites-tu` blir en bricka.
- `a`: 5–14 ord. `alt`: 2–3 felaktiga meningar med vanliga fel. `cue`: bindeordet, konstruktionen eller typen (`"weil"`, `"ne … jamais"`, `"inversion"`, `"Partizip II"`).

### Hitta felet

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka: ett felalternativ sätts in i meningen. Därför måste alla felalternativ vara **tydligt fel**, även i talspråk. Regler där felalternativen går att försvara i talspråk undantas i `ERR_SKIP` i `src/kinds/60-grammar.js` (t.ex. tempusreglerna i franskan, `k1-rede`).

### Maskinkontroll i tyskan (`meta`)

- `praep`: `{"prep", "case": "nom|akk|dat|gen", "g": "m|f|n|pl", "art": "def|indef|poss|kein"}`. Vid `poss` och `kein` läggs `"stem"` till, t.ex. `"mein"`. build.py räknar fram den rätta artikeln och jämför med luckan (efter en preposition i början av luckan).
- Sammandragningar: där tyskan normalt drar ihop (im, ins, am, ans, zum, zur, vom, beim) innehåller luckan sammandragningen, `Ich bin [im] Kino.` med `"meta": {"prep": "in", "case": "dat", "g": "n", "art": "def"}` och alt `["in das", "ins", "in die"]`. Använd `acc` om båda är naturliga.
- `relativ`: `{"g": "m|f|n|pl", "case": "nom|akk|dat|gen"}` (utelämnas vid `rel-was`). build.py kontrollerar pronomenet (sista ordet i luckan).

## Kvalitet

- Varje mening ska vara grammatiskt helt korrekt och låta naturlig, på kursens nivå. Undvik konstlade meningar som bara finns för att testa en regel.
- Variera personer, tempus, ämnen och meningslängd. Ingen mening får förekomma två gånger, inte heller i en annan kurs i samma språk.
- Svaret ska vara entydigt. Om två svar är rätt ska båda finnas med (`acc`), eller så skrivs meningen om.
- Felalternativen ska vara typiska fel en svensk elev gör.
