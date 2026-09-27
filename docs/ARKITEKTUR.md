# Arkitektur: var data ligger

Glosor har tre sorters data, och de hålls helt åtskilda.

| Sort | Var | Vem ändrar | I det publika repot? |
|---|---|---|---|
| **Kod** | `src/` (app.js, exercises.js, grammar.js, exam.js, feedback.js, main.js, page.html, style.css), `build.py`, `tests/` | Claude | Ja |
| **Kursinnehåll** | `languages/<kod>/`: `lang.js` (inställningar), `words.txt`, `content/*.json`, `videos.json` | Claude (AI-skrivet, eget material) | Ja |
| **Bokmaterial** | `languages/<kod>/book/kapNN/` (foton, `words.txt`, `content/*.json`) och `book/sidor.json` | Claude, från foton som föräldern skickar | **Nej** (`.gitignore`, eget lokalt git-repo) |
| **Elevernas data** | Artefaktens db: `data/users/<uid>/<storageKey>` (framsteg, privat för eleven), `board/<uid>` (topplista), `feedback/` (Tyck till), `reports/` (fel i frågor). Kopia av framstegen i elevens webbläsare (localStorage). | Eleverna, via appen | Nej |

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

## Regler som skyddar elevernas framsteg

- `storageKey` i `lang.js` ändras aldrig.
- Ordets första fält i `words.txt` och avsnittens id är nycklar för framstegen. Ändra dem inte.
- Id:n i `content/*.json` används för statistik (lästa texter, grammatikfrågor). Ändra dem inte i efterhand.
