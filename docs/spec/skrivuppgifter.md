# Skrivuppgifter: prompts.json

Allmänna regler: [allmant.md](allmant.md). Kursens tempusnamn och bindeord: kursens `content/SPEC.md` och `tenseCheck`/`connectors` i `lang.js`.

```json
[{"id": "w-k1b", "sec": "k1b", "title": "Ett nytt liv i solen",
  "task": "Tänk dig att du har flyttat till Nice. Skriv 80–120 ord om hur ditt liv var förut och hur det är nu.",
  "min": 80, "max": 120,
  "need": {"connectors": 3, "chapterWords": 3, "tenses": ["imparfait", "présent"]},
  "model": "Avant, j'habitais à Stockholm. …", "modelSv": "Förut bodde jag i Stockholm. …"}]
```

- `id`, `title`, `task` (uppgiften på svenska), `min`, `max` (heltal, 0 < min ≤ max) och `model` är obligatoriska. `sec` är kapitlet, eller `""` för en allmän uppgift. `level` (valfri, t.ex. `"B1"`) styr nivån i Claudes bedömning.
- `need` (valfri) blir checklistan medan eleven skriver:
  - `connectors`: antal olika bindeord ur kursens `connectors` (med arvet),
  - `chapterWords`: antal ord ur kapitlets ordlista,
  - `tenses`: tempus som ska finnas med. Namnen måste finnas i kursens `tenseCheck` (med arvet); build.py stoppar annars, eftersom appen tyst hoppar över ett okänt namn.
- `model`: en exempeltext på målspråket som själv klarar uppgiften: antal ord inom `min`–`max` och minst `need.connectors` bindeord ur kursens lista (build.py varnar annars). `modelSv`: översättning.
