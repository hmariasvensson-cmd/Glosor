# Berättelser: stories.json

Allmänna regler: [allmant.md](allmant.md). Kursens tempus och bindeord: kursens `content/SPEC.md`.

```json
[{"id": "s-k2", "sec": "k2", "title": "Un voyage compliqué",
  "text": "Quand nous [sommes arrivés|avons arrivé|arrivions] à Paris, il [pleuvait|a plu|pleut]. [Pourtant|Parce que|Donc] nous étions contents.",
  "gaps": [{"cat": "tempus", "why": "Arriver bildar passé composé med être."},
           {"cat": "tempus", "why": "Bakgrund i dåtid: imparfait."},
           {"cat": "bindeord", "why": "Pourtant = ändå; motsats till regnet."}],
  "sv": "När vi kom fram till Paris regnade det. Ändå var vi glada."}]
```

- `text`: berättelsen med luckorna `[rätt|fel|fel]`, det **rätta alternativet först** (appen blandar). Minst två olika alternativ per lucka, inga tomma.
- `gaps`: en post per lucka, i samma ordning som i texten. `cat` är `"tempus"` (verbform: tempus, modus, hjälpverb, person) eller `"bindeord"` (bindeord där betydelsen eller ordföljden avgör). Statistiken räknar allt som inte är `bindeord` som tempus. `why` förklarar på svenska.
- `sv`: svensk översättning av hela texten (valfri men önskad). `gloss` är valfri.
- Fråge-id är `story:<id>:<lucka>`: lägg inte till eller ta bort luckor mitt i en befintlig berättelse.
