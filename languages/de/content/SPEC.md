# Innehåll till övningarna i Glosor (tyska)

Eleven läser Tyska 5 (Moderna språk 5), är 17–18 år och siktar på betyget A och på B2. Texterna ska vara på nivå B1 till B1+: naturlig, korrekt standardtyska med bisatser, Perfekt och Präteritum, Konjunktiv II, passiv och bindeord, men utan onödigt svåra ord. Läs först `languages/de/words.txt`. Där finns kapitlen (rader som börjar med #) och glosorna. Använd kapitlets glosor i texterna.

Kapitel-id och teman:
- d1: Identität und Beziehungen (familj, vänskap, kärlek, konflikter, grupptryck)
- d2: Bildung und Arbeitswelt (skola, praktik, Ausbildung, studier, CV, jobbintervju)
- d3: Medien und digitale Welt (sociala medier, nyheter, fake news, skärmtid)
- d4: Umwelt und Nachhaltigkeit (klimat, energi, konsumtion, återvinning)
- d5: Gesellschaft und Politik (demokrati, val, migration, jämställdhet, EU)
- d6: Kultur, Kunst und Literatur (böcker, film, musik, museer, teater)
- d7: Gesundheit und Lebensstil (sport, mat, stress, sömn)
- d8: Deutschland, Österreich, Schweiz (historia, städer, dialekter, traditioner)
- dr: Redemittel (diskutera och argumentera)
- dv: Verben mit Präpositionen

Formatet är detsamma som för franskan. Se exemplen i `languages/fr/content/*.json` och de allmänna reglerna i `languages/fr/content/SPEC.md`. Observera:

- Fältet för texten på målspråket heter **`fr`** även för tyska (i `lines`, `phrases` och liknande). Programmet läser det fältet för alla språk.
- `gloss`: nyckeln är ordet exakt som det står i texten, med små bokstäver och utan skiljetecken (tyska har ingen elision). Värdet är `{"t": grundform, "sv": betydelse, "g": "m"|"f"|"n"|"pl"|""}`. Substantiv har artikel i grundformen (`"der Bahnhof"`), verb står i infinitiv, separabla verb som helhet (`"aufstehen"`). Ta med 15–35 ord per text.
- `stories.json`: luckorna skrivs `[rätt|fel|fel]` med det rätta alternativet först. `gaps[i].cat` är `"tempus"` (verbform: Präteritum/Perfekt, haben/sein, Konjunktiv II, rätt person) eller `"bindeord"` (bindeord där ordföljden i meningen avgör, t.ex. `[Trotzdem|Obwohl|Denn]`). `why` förklarar på svenska.
- `prompts.json`: `need.tenses` får bara innehålla `"Präsens"`, `"Perfekt"`, `"Präteritum"`, `"Konjunktiv II"` och `"Passiv"`. `need.connectors` räknar bindeorden i `connectors` i `languages/de/lang.js`.
- `culture.json`: fakta om Tyskland, Österrike och Schweiz som går att kontrollera. Frågan `ask` handlar om hur det är i Sverige.
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"` och läs igenom texten en gång till innan du är klar.
