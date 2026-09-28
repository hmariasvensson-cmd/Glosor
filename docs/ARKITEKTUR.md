# Arkitektur: var data ligger

Glosor har tre sorters data, och de hålls helt åtskilda.

| Sort | Var | Vem ändrar | I det publika repot? |
|---|---|---|---|
| **Kod** | `src/` (app.js, exercises.js, grammar.js, exam.js, feedback.js, main.js, page.html, style.css), `build.py`, `tests/` | Claude | Ja |
| **Kursinnehåll** | `languages/<kod>/`: `lang.js` (inställningar), `words.txt`, `content/*.json`, `videos.json` | Claude (AI-skrivet, eget material) | Ja |
| **Bokmaterial** | `languages/<kod>/book/kapNN/` (foton, `words.txt`, `content/*.json`) och `book/sidor.json` | Claude, från foton som föräldern skickar | **Nej** (`.gitignore`, eget lokalt git-repo) |
| **Elevernas data** | Artefaktens db: `data/users/<uid>/<storageKey>` (framsteg, privat för eleven), `board/<uid>` (topplista), `feedback/<uid>/msgs/<tid>` (Tyck till) och `reports/<uid>/items/<tid>` (fel i frågor), privata för eleven och läsbara för ägaren. Kopia av framstegen i elevens webbläsare (localStorage). | Eleverna, via appen | Nej |

## Från källor till app

`python3 build.py`:

1. Läser varje kurs: `lang.js`, sedan `words.txt` och `book/kapNN/words.txt`, sedan `content/*.json` och `book/kapNN/content/*.json`. Filer med samma namn slås ihop, så att bokens `reading.json` hamnar bland kursens lästexter. `grammar-*.json` blir en gemensam frågebank.
2. Kontrollerar ordlistan (format, dubbletter), grammatikfrågorna (luckor, felalternativ, artiklar och kasus för tyskan) och att id:n är unika inom varje innehållstyp.
3. Skriver
   - `dist/index.html`: appen och alla kursers `lang.js` (cirka 270 kB),
   - `dist/data/<kod>.json`: en fil per kurs med ord, innehåll och videor, som appen hämtar först när kursen väljs,
   - `dist/preview.html`: allt inbakat i en fil, för att öppna lokalt och för testerna.

`DATA_VERSION` (ett hash av all data) läggs i adressen till datafilerna, så att en ny version aldrig blandas med en gammal i webbläsarens cache.

## Publicering

Publicera `dist/index.html` till samma URL och skicka med datafilerna i `files`:

    {"data/fr.json": "dist/data/fr.json", "data/de.json": "dist/data/de.json", ...}

Alla filer i `dist/data/` ska med vid varje publicering. `tests/run_tests.py` testar både preview-sidan och den publicerade sidan via en lokal webbserver.

## Lägga till mer

- **Nytt bokkapitel:** skapa `languages/fr/book/kapNN/` enligt `book/README.md` och `book/SPEC-bok.md`, och uppdatera `book/sidor.json`. Inget i koden behöver ändras.
- **Nytt innehåll av en befintlig typ:** lägg till i `content/<typ>.json`, eller i en ny fil med samma namn i ett bokkapitel.
- **Ny kurs:** ny mapp `languages/<kod>/` med `lang.js` (egen `storageKey` som aldrig ändras), `words.txt` och `content/`. Se `languages/de4/` och `languages/it1/` som mallar.
- **Ny innehållstyp:** kräver kod i `src/` och ett format beskrivet i en SPEC-fil.

## Framstegen i molnet (db)

Ett dokument i artefaktens db får vara **högst 256 KiB** (plattformens gräns, större `set` avvisas med `invalid_argument`). Ett ord i `S.w` är 150–200 byte och en loggpost cirka 180 byte, så en flitig elev i Tyska 5 (2 000+ ord och 1 000 loggposter) får inte plats i ett dokument. I localStorage ligger hela `S` som förut. I db delas det upp (`cloudSplit`, `cloudWrite`, `cloudRead` i `src/app.js`):

| Dokument | Innehåll |
|---|---|
| `data/users/<uid>/<storageKey>` | Huvuddokumentet `{v: 2, head, score: [pass, nLog, antal ord], parts: {<namn>: <rev>}, t}`. `head` är `S` utom `w` och `log`. |
| `…/<storageKey>~w0`, `~w1`, … | `{rev, data: {<ord-id>: …}}`. Orden fördelas efter ett hash av ord-id, cirka 700 ord per bit och högst 200 KiB. |
| `…/<storageKey>~log` (`~log1`, …) | `{rev, data: [...]}`, loggen i ordning. |
| `…/<storageKey>~f.<fält>` | Bara om `head` blir större än 160 KiB: de största fälten flyttas ut, ett dokument per fält. |

- `rev` är ett hash av bitens innehåll. Bitarna skrivs först och huvuddokumentet sist. En läsare använder bara bitar vars `rev` stämmer med `parts` i huvuddokumentet; stämmer de inte (någon sparar just nu) försöker den igen och blandar aldrig bitar från olika sparningar.
- Bara ändrade bitar skrivs. Före varje sparning läses huvuddokumentet: har en annan enhet sparat ett läge som kommit längre skrivs ingenting över (det läget tas emot i stället), och har någon annan skrivit sedan sist skrivs alla bitar om.
- Storleken mäts före `set`. Blir något ändå för stort visas en varning överst i appen, och framstegen sparas bara i webbläsaren tills det går igen.
- Gamla dokument i formatet `{state, t}` läses som förut, och första sparningen skriver det nya formatet. `head` heter inte `state`, så en äldre version av appen som fortfarande är öppen på någon enhet ser inget läge i det nya dokumentet och kan inte ta emot ett läge utan ord.
- Vem som vinner: högst `pass`, sedan `nLog` (antal loggposter någonsin, stannar inte på 1 000), sedan antal ord, och vid lika det senaste `t`. `S.t` ökar alltid vid sparning, även om en annan enhets klocka går före.
- Sparningar köas per kurs (`CLOUD.pending[storageKey]`), så att ett kursbyte inte slänger den förra kursens sparning. Går anslutningen inte vid start försöker appen igen när den syns igen (`visibilitychange`) eller när nätet är tillbaka (`online`).
- Varje elev har cirka 6 dokument per kurs. Artefaktens db rymmer högst 5 000 dokument totalt.

## Regler som skyddar elevernas framsteg

- `storageKey` i `lang.js` ändras aldrig.
- Ordets första fält i `words.txt` och avsnittens id är nycklar för framstegen. Ändra dem inte.
- Id:n i `content/*.json` används för statistik (lästa texter, grammatikfrågor). Ändra dem inte i efterhand.
