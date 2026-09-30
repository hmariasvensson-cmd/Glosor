# Samtalsfraser: phrases.json

Allmänna regler: [allmant.md](allmant.md).

```json
[{"id": "p-1", "cat": "förstå", "sit": "Du förstod inte vad läraren sa.", "fr": "Pardon, vous pouvez répéter ?",
  "alt": ["Pardon, vous pouvez répétez ?", "Pardon, tu peux répéter vous ?"], "why": "Efter pouvoir kommer infinitiv: répéter."}]
```

- `sit`: situationen på svenska. `fr`: frasen på målspråket (facit; kan också skrivas in, då rättas den utan hänsyn till kommatecken).
- `alt`: felalternativ, typiska fel en svensk elev gör. De får inte vara exakt samma som `fr` (en skillnad i stor/liten bokstav räcker, om det är felet som övas).
- `why`: kort förklaring på svenska. `cat`: kategori (t.ex. `förstå`, `åsikt`, `artighet`, `formellt`), för att hålla ordning i filen.
