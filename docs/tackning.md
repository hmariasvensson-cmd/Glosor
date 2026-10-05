# Ordtäckning i kursernas texter

Genererad 2026-10-02 med `python3 tools/tackning.py` (eller `python3 build.py --tackning`). Skriv inte i filen för hand; kör om verktyget.

Täckning = andel löpande ord i texten som eleven kan förväntas känna till: kursens ord + alla tidigare kurser i kedjan (`nextCourse` baklänges) + grammatikord och bindeord (med arv) + textens glosor (`gloss`, bara i hör-, läs- och kulturtexter där appen visar dem; inte i berättelser och prov) + namn, siffror och internationella ord. Böjningsformer hanteras med en enkel lemmatisering (se kommentaren i `tools/tackning.py`), så siffrorna är en uppskattning. Gränserna kommer från `docs/nivaer.md` 3.2: **hörtexter minst 95 %**, **lästexter minst 98 %** (lästexter = reading, stories, culture och provets läsdel; hörtexter = listening och provets hördel).

Observera att kursens *alla* ord räknas som kända i alla kursens texter, även ord från senare kapitel.

## Sammanfattning

| Kurs | Tidigare kurser | Kända lemman | Hörtexter | Medel hör | Under 95 % | Lästexter | Medel läs | Under 98 % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| de1 | – | 1256 | 11 | 99,9 % | 0 | 23 | 99,7 % | 0 |
| de2 | de1 | 2423 | 15 | 99,1 % | 0 | 25 | 99,6 % | 0 |
| de3 | de1, de2 | 4062 | 20 | 98,3 % | 0 | 36 | 99,4 % | 0 |
| de4 | de1, de2, de3 | 5901 | 28 | 99,2 % | 0 | 42 | 99,3 % | 0 |
| de | de1, de2, de3, de4 | 10124 | 30 | 99,4 % | 0 | 51 | 99,6 % | 0 |
| de6 | de1, de2, de3, de4, de | 12595 | 28 | 98,9 % | 0 | 46 | 99,2 % | 0 |
| de7 | de1, de2, de3, de4, de, de6 | 14604 | 20 | 99,7 % | 0 | 36 | 99,7 % | 0 |
| fr1 | – | 1063 | 14 | 99,4 % | 0 | 26 | 99,4 % | 0 |
| fr2 | fr1 | 2090 | 14 | 98,8 % | 0 | 27 | 99,4 % | 0 |
| fr | fr1, fr2 | 4173 | 24 | 98,7 % | 0 | 41 | 99,6 % | 0 |
| frs4 | fr1, fr2, fr | 5714 | 24 | 98,8 % | 0 | 34 | 99,3 % | 0 |
| frs5 | fr1, fr2, fr, frs4 | 7321 | 19 | 99,2 % | 0 | 35 | 99,6 % | 0 |
| fr4 | fr1, fr2, fr, frs4, frs5 | 8820 | 25 | 99,4 % | 0 | 43 | 99,6 % | 0 |
| fru | fr1, fr2, fr, frs4, frs5, fr4 | 10901 | 25 | 99,1 % | 0 | 43 | 99,6 % | 0 |
| it1 | – | 960 | 8 | 99,5 % | 0 | 29 | 99,6 % | 0 |
| it2 | it1 | 1962 | 8 | 99,2 % | 0 | 31 | 99,4 % | 0 |
| it3 | it1, it2 | 3406 | 16 | 99,6 % | 0 | 25 | 99,5 % | 0 |
| it4 | it1, it2, it3 | 4942 | 20 | 99,4 % | 0 | 32 | 99,6 % | 0 |
| it5 | it1, it2, it3, it4 | 6784 | 15 | 99,0 % | 0 | 26 | 99,4 % | 0 |
| it6 | it1, it2, it3, it4, it5 | 8573 | 19 | 98,8 % | 0 | 35 | 99,4 % | 0 |
| it7 | it1, it2, it3, it4, it5, it6 | 10286 | 11 | 98,7 % | 0 | 28 | 99,5 % | 0 |

## Ord som saknas i hela kedjan

Okända ord som förekommer i texterna i **flera kurser** i samma språk (antal kurser, antal förekomster totalt). Oftast vanliga småord (adverb, räkneord, vardagsord) som aldrig blivit kursord. De bör läggas in i den första kursen där de förekommer.

- **Franska:** ri (3, 4, först frs4), répète (3, 3, först fr)
- **Tyska:** geübt (4, 9, först de4), übt (4, 7, först de4), hey (3, 4, först de2), teure (3, 4, först de4)
- **Italienska:** alcune (5, 14, först it2), ce (4, 5, först it2), conosciuto (4, 5, först it3), online (3, 6, först it3), promesso (3, 4, först it3), rapper (3, 4, först it4), glielo (3, 3, först it3)

## Förslag: ord som borde bli kursord eller glosor

Okända ord som förekommer i **flera texter** i samma kurs bör bli **kursord** (words.txt, i kapitlet där texten ligger eller tidigare). Ord som bara finns i **en text** bör bli **glosor** i den texten (`gloss`). Listan tar med ord ur texter under gränsen. Kontrollera varje förslag: en del är böjningsformer som lemmatiseringen missat, namn i början av en mening eller ord som redan finns i en fras.

## Texter under gränsen, per kurs

Sorterade med den lägsta täckningen först. Okända ord med antal förekomster i texten.

### de1: 0 av 34 texter under gränsen

Alla texter når gränsen.

### de2: 0 av 40 texter under gränsen

Alla texter når gränsen.

### de3: 0 av 56 texter under gränsen

Alla texter når gränsen.

### de4: 0 av 70 texter under gränsen

Alla texter når gränsen.

### de: 0 av 81 texter under gränsen

Alla texter når gränsen.

### de6: 0 av 74 texter under gränsen

Alla texter når gränsen.

### de7: 0 av 56 texter under gränsen

Alla texter når gränsen.

### fr1: 0 av 40 texter under gränsen

Alla texter når gränsen.

### fr2: 0 av 41 texter under gränsen

Alla texter når gränsen.

### fr: 0 av 65 texter under gränsen

Alla texter når gränsen.

### frs4: 0 av 58 texter under gränsen

Alla texter når gränsen.

### frs5: 0 av 54 texter under gränsen

Alla texter når gränsen.

### fr4: 0 av 68 texter under gränsen

Alla texter når gränsen.

### fru: 0 av 68 texter under gränsen

Alla texter når gränsen.

### it1: 0 av 37 texter under gränsen

Alla texter når gränsen.

### it2: 0 av 39 texter under gränsen

Alla texter når gränsen.

### it3: 0 av 41 texter under gränsen

Alla texter når gränsen.

### it4: 0 av 52 texter under gränsen

Alla texter når gränsen.

### it5: 0 av 41 texter under gränsen

Alla texter når gränsen.

### it6: 0 av 54 texter under gränsen

Alla texter når gränsen.

### it7: 0 av 39 texter under gränsen

Alla texter når gränsen.

