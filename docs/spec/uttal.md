# Uttal: uttal.json

```json
[{"id": "utt-u", "sec": "k1", "title": "u, ou eller eu?",
  "tip": "**u** uttalas som svenskt **y** (tu, rue). **ou** låter som svenskt **o** i sol (tout, roue).",
  "pairs": [["tu", "tout"], ["vu", "vous", "veut"], ["rue", "roue"]]}]
```

- `id`, `title` och `pairs` är obligatoriska; `sec` och `tip` är valfria. `tip` får ha `**fetstil**`.
- `pairs`: grupper om två eller tre **olika** ord som låter nästan lika. Ett av orden läses upp av webbläsarens röst och eleven väljer vilket det var, så välj ord som rösterna uttalar tydligt olika.
- Fråge-id är `utt:<id>|<par>|<ord>`: lägg nya par sist.
