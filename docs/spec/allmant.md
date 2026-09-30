# Kursinnehåll: allmänna regler och formaten

Formaten för allt kursinnehåll i `languages/<kod>/`, en fil per typ. Formaten är desamma i alla kurser och språk. Det som skiljer en kurs från en annan (nivå, elev, kapitel-id och teman, tempusnamn, grammatikområden, provet) står i kursens egen `languages/<kod>/content/SPEC.md`, som bara innehåller sådana tillägg.

| Fil i kursen | Övning (`src/kinds/`) | Format |
|---|---|---|
| `words.txt` | glosquiz, meningar, diktamen … | [ordlista.md](ordlista.md) |
| `content/listening.json`, `content/reading.json` | Hör- och läsförståelse (`30`–`32`) | [texter.md](texter.md) |
| `content/stories.json` | Berättelser (`21-stories.js`) | [berattelser.md](berattelser.md) |
| `content/phrases.json` | Samtalsfraser (`20-phrases.js`) | [fraser.md](fraser.md) |
| `content/prompts.json` | Skriv en text (`40-writing.js`) | [skrivuppgifter.md](skrivuppgifter.md) |
| `content/culture.json` | Kultur (`33-culture.js`) | [kultur.md](kultur.md) |
| `content/mal.json` | Kapitlets mål (`51-goals.js`) | [mal.md](mal.md) |
| `content/uttal.json` | Uttal (`52-uttal.js`) | [uttal.md](uttal.md) |
| `content/teori.json` | Teoriprovet (`53-teori.js`) | [teori.md](teori.md) |
| `content/transkription.json` | Transkription (`54-transkription.js`) | [transkription.md](transkription.md) |
| `content/satsanalys.json` | Satsanalys (`62-satsanalys.js`) | [satsanalys.md](satsanalys.md) |
| `grammar.json`, `content/grammar-*.json` | Grammatik och Hitta felet (`60-grammar.js`) | [grammatik.md](grammatik.md) |
| `content/regler.json` | Regelsidorna i grammatiken | [regler.md](regler.md) |
| `content/exam.json` | Provträning (`70-exam.js`) | [prov.md](prov.md) |
| `plan.json` | Studieplan (`82-plan.js`) | `check_plan` i `build.py` |

Bokens material (`languages/<kod>/book/`, privat) följer samma format, plus `book/SPEC-bok.md` i bokens repo.

## Allmänna regler

- Skriv giltig JSON (UTF-8, dubbla citattecken, inga kommentarer, inga avslutande kommatecken). Använd vanlig apostrof `'`, aldrig den typografiska `’`. Använd « » runt citat i franska texter om det behövs.
- **Fältet `fr`** är texten på målspråket i alla datafiler (`lines[].fr`, `phrases[].fr`, `ex[].fr` i regler.json …), även i tyska och italienska kurser. Appen läser det bara via `tl(x)`.
- `id` är unika inom varje typ och ändras aldrig (framstegen och id-låset hänger på dem, se CLAUDE.md). `sec` är ett avsnitts-id ur kursens `words.txt`.
- Svenska texter (frågor, förklaringar, översättningar) ska vara naturlig svenska för kursens elev (se kursens SPEC.md). Texterna på målspråket ska vara naturliga och korrekta (stavning, accenter, kongruens, genus, kasus) och på kursens nivå. Använd kapitlets glosor.
- **`gloss`** (texter och kultur): en ordlista för att trycka på ord. Nyckeln är ordet exakt som det står i texten, med små bokstäver och utan skiljetecken, och utan elision i franska och italienska (`l'ascenseur` → `ascenseur`, `l'amica` → `amica`). Värdet är `{"t": grundform, "sv": betydelse, "g": "m"|"f"|"n"|"pl"|""}`. Substantiv har artikel i grundformen (`"le quai"`, `"der Bahnhof"`), verb står i infinitiv (tyska separabla verb som helhet, `"aufstehen"`). 15–35 ord per text: ord som eleven troligen inte kan eller som är kapitelglosor, inte de allra vanligaste orden. build.py stoppar om en nyckel inte finns i texten.
- **Flervalsfrågor** `{q, opts, a, why}`: 4 alternativ, exakt ett rätt, `a` = index för rätt svar (0–3). Blanda var det rätta svaret står. Felalternativen ska vara rimliga men tydligt fel enligt texten.
- **Upphovsrätt:** citera bara verk av upphovspersoner som dog för mer än 70 år sedan, och bara korta utdrag. Nutida och skyddade verk sammanfattas med egna ord. Läroböcker och kursplaner citeras aldrig.
- Inga verkliga personnamn på elever. Fakta i kultur- och historietexter ska gå att kontrollera.
- Kontrollera hela filen innan du är klar: validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till.

## Det som build.py kontrollerar

`python3 build.py` stoppar med filen och id:t när något av detta inte stämmer (`check_fields`, `check_content`, `check_grammar`, `check_exam_task`, `check_grammar_refs`, `check_plan`):

- varje post har de fält appen läser (tabellen `CONTENT_FIELDS`), med rätt typ och inte tomma,
- id är unika, `sec` finns i `words.txt`, facit `a` finns bland alternativen och glosorna finns i texten,
- texternas rader har `fr` och `sv`, berättelsernas luckor stämmer med `gaps`, frasernas felalternativ är inte frasen själv, uttalets ordpar har minst två olika ord, regelsidornas delar är inte tomma, provuppgifternas `part` finns,
- skrivuppgifternas `need.tenses` finns i kursens `tenseCheck` (med arvet).

Varningar (bygget går igenom): en modelltext som inte klarar uppgiftens ordgränser eller antal bindeord, en fråga med okänd `type`, en berättelselucka med annan `cat` än `tempus`/`bindeord`.
