# Kultur: culture.json

Allmänna regler (gloss, flervalsfrågor, fakta): [allmant.md](allmant.md).

```json
[{"id": "c-k2b", "sec": "k2b", "title": "Le métro de Paris a plus de cent ans",
  "lines": [{"fr": "En 1900, Paris a accueilli une grande exposition universelle.", "sv": "År 1900 tog Paris emot en stor världsutställning."}],
  "gloss": {"exposition": {"t": "l'exposition", "sv": "utställning", "g": "f"}},
  "q": {"q": "När öppnade den första metrolinjen?", "opts": ["1900", "1889", "1937", "1968"], "a": 0, "why": "Den öppnade den 19 juli 1900."},
  "ask": "Hur tar man sig fram i en svensk stad? Skriv några meningar.",
  "model": "À Stockholm, il y a aussi un métro …", "modelSv": "I Stockholm finns det också en tunnelbana …"}]
```

- `id`, `sec`, `title`, `lines` (rader `{fr, sv}`), `q` (en flervalsfråga om texten), `ask` och `model` är obligatoriska; `gloss` och `modelSv` är valfria.
- Texten innehåller fakta som går att kontrollera. `ask` (på svenska) handlar om hur det är i Sverige, och `model` är ett exempelsvar på målspråket.
