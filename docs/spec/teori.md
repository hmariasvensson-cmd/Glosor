# Teoriprovet: teori.json

Flervalsfrågor på målspråket, som på ett teoriprov (t.ex. musikteori till en antagning).

```json
[{"id": "mt1-01", "sec": "mt1", "q": "Wie heißt im deutschen System der Stammton zwischen **A** und **C**?",
  "sv": "Vad heter i det tyska systemet stamtonen mellan A och C?",
  "opts": ["H", "B", "Cis", "Bes"], "a": 0, "why": "Stamtonen mellan a och c heter **H** …"}]
```

- `id`, `sec`, `q` (på målspråket, `**fetstil**` tillåten), `opts`, `a` (index) och `why` (svenska) är obligatoriska; `sv` (översättning av frågan) är valfri men önskad.
- Frågor man missat eller inte sett kommer först (`S.te[id]`).
