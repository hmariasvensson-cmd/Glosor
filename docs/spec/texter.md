# Hör- och lästexter: listening.json och reading.json

Allmänna regler (gloss, flervalsfrågor, upphovsrätt): [allmant.md](allmant.md). Längd och antal frågor per steg: `docs/kursmall.md` och kursens `content/SPEC.md`.

```json
[{"id": "l-k2-1", "sec": "k2", "title": "À l'aéroport",
  "lines": [{"who": "Agent", "fr": "Bonjour, votre passeport, s'il vous plaît.", "sv": "Hej, ert pass, tack."}],
  "gloss": {"passeport": {"t": "le passeport", "sv": "pass", "g": "m"}},
  "questions": [{"type": "detalj", "q": "Vad frågar tjänstemannen efter?", "opts": ["Passet", "Biljetten", "Väskan", "Adressen"], "a": 0, "why": "Han säger « votre passeport »."}]}]
```

| Fält | Krav |
|---|---|
| `id`, `sec`, `title` | Obligatoriska. `title` på målspråket. |
| `lines` | Obligatorisk lista med rader `{fr, sv}` (båda obligatoriska). Hörtexter har `who` (talaren) när flera talar. Hörtexten läses upp rad för rad. |
| `gloss` | Valfri, se allmant.md. |
| `questions` | Obligatorisk lista med flervalsfrågor `{type, q, opts, a, why}`. `type` är `helhet`, `detalj` eller `tolkning` (visas som etikett; annat ger en varning). Frågor och alternativ på svenska. |

Fråge-id i appen är `lq:<id>:<nr>` och `rq:<id>:<nr>`, så frågor läggs bara till sist och flyttas inte.
