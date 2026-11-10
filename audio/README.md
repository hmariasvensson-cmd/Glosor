# Inspelningar till uttalsövningarna

Orden i `languages/*/content/uttal.json` läses av riktiga röster när det finns en inspelning. Inspelningarna kommer från
[Lingua Libre](https://lingualibre.org) på Wikimedia Commons och har fria licenser (CC0 eller CC BY-SA). De är
konverterade till AAC (mono, 32 kbit/s, `.m4a`) så att de spelas även på iPad och iPhone.

- `audio/<språk>/index.json`: `{<ord>: {f: filnamn, by: talare, lic: licens, src: filsidan på Commons}}`.
- `audio/<språk>/<fil>.m4a`: själva ljudet.

`build.py` lägger in inspelningarna för varje kurs i `dist/data/<kod>-audio.json` (base64) och sätter `content.recN`.
Appen hämtar filen när Uttal öppnas, spelar inspelningen i `speak` och visar talare, licens och länk under frågan
(CC BY-SA kräver det). Ord utan inspelning läses av datorrösten som förut.

Hämtade med ett skript (Commons API: `list=allimages` för de talare som har flest av orden, sedan `prop=videoinfo` för
licens och mp3-version, `afconvert` för konverteringen), november 2026. Ändra eller ta inte bort en fil utan att ändra
`index.json`; licensuppgifterna måste följa med.
