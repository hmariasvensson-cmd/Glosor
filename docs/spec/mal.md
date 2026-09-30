# Kapitlets mål: mal.json

```json
[{"id": "mal-k1", "sec": "k1", "goals": ["Jag kan presentera mig själv och min familj.", "Jag kan böja regelbundna verb i presens."]}]
```

- En post per avsnitt (`sec`), med 3–6 mål i jagform ("Jag kan …", "Jag förstår …"), på svenska. Visas på startsidan, och eleven bockar av det hon eller han kan.
- **Nyckeln för elevens bock är målets plats i listan** (`S.mal["<id>|<nr>"]`). Nya mål läggs sist; flytta eller ta inte bort mål ur mitten (skriv hellre om texten på samma plats). Ändra aldrig `id`.
