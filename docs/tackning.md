# Ordtäckning i kursernas texter

Genererad 2026-10-02 med `python3 tools/tackning.py` (eller `python3 build.py --tackning`). Skriv inte i filen för hand; kör om verktyget.

Täckning = andel löpande ord i texten som eleven kan förväntas känna till: kursens ord + alla tidigare kurser i kedjan (`nextCourse` baklänges) + grammatikord och bindeord (med arv) + textens glosor (`gloss`, bara i hör-, läs- och kulturtexter där appen visar dem; inte i berättelser och prov) + namn, siffror och internationella ord. Böjningsformer hanteras med en enkel lemmatisering (se kommentaren i `tools/tackning.py`), så siffrorna är en uppskattning. Gränserna kommer från `docs/nivaer.md` 3.2: **hörtexter minst 95 %**, **lästexter minst 98 %** (lästexter = reading, stories, culture och provets läsdel; hörtexter = listening och provets hördel).

Observera att kursens *alla* ord räknas som kända i alla kursens texter, även ord från senare kapitel.

## Sammanfattning

| Kurs | Tidigare kurser | Kända lemman | Hörtexter | Medel hör | Under 95 % | Lästexter | Medel läs | Under 98 % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| de1 | – | 1249 | 11 | 99,9 % | 0 | 23 | 99,6 % | 2 |
| de2 | de1 | 2391 | 15 | 99,1 % | 0 | 25 | 99,6 % | 1 |
| de3 | de1, de2 | 3905 | 20 | 98,3 % | 0 | 36 | 99,4 % | 1 |
| de4 | de1, de2, de3 | 5551 | 28 | 99,0 % | 0 | 42 | 98,8 % | 13 |
| de | de1, de2, de3, de4 | 9778 | 30 | 99,3 % | 0 | 51 | 99,5 % | 5 |
| de6 | de1, de2, de3, de4, de | 12189 | 28 | 98,6 % | 0 | 46 | 98,8 % | 8 |
| de7 | de1, de2, de3, de4, de, de6 | 14198 | 20 | 99,6 % | 0 | 36 | 99,4 % | 1 |
| fr1 | – | 1042 | 14 | 97,3 % | 4 | 26 | 98,1 % | 6 |
| fr2 | fr1 | 2043 | 14 | 98,5 % | 1 | 27 | 98,7 % | 8 |
| fr | fr1, fr2 | 3876 | 24 | 98,4 % | 2 | 41 | 98,9 % | 10 |
| frs4 | fr1, fr2, fr | 5249 | 24 | 98,5 % | 1 | 34 | 97,8 % | 11 |
| frs5 | fr1, fr2, fr, frs4 | 6856 | 19 | 98,8 % | 0 | 35 | 99,4 % | 0 |
| fr4 | fr1, fr2, fr, frs4, frs5 | 8355 | 25 | 99,3 % | 0 | 43 | 99,3 % | 5 |
| fru | fr1, fr2, fr, frs4, frs5, fr4 | 10437 | 25 | 98,8 % | 0 | 43 | 99,1 % | 8 |
| it1 | – | 937 | 8 | 99,5 % | 0 | 29 | 99,4 % | 3 |
| it2 | it1 | 1860 | 8 | 99,2 % | 0 | 31 | 99,0 % | 5 |
| it3 | it1, it2 | 3142 | 16 | 99,5 % | 0 | 25 | 99,2 % | 3 |
| it4 | it1, it2, it3 | 4523 | 20 | 99,4 % | 0 | 32 | 99,5 % | 1 |
| it5 | it1, it2, it3, it4 | 6365 | 15 | 98,9 % | 0 | 26 | 99,4 % | 0 |
| it6 | it1, it2, it3, it4, it5 | 8154 | 19 | 98,3 % | 0 | 35 | 98,9 % | 4 |
| it7 | it1, it2, it3, it4, it5, it6 | 9867 | 11 | 98,3 % | 0 | 28 | 99,3 % | 2 |

## Ord som saknas i hela kedjan

Okända ord som förekommer i texterna i **flera kurser** i samma språk (antal kurser, antal förekomster totalt). Oftast vanliga småord (adverb, räkneord, vardagsord) som aldrig blivit kursord. De bör läggas in i den första kursen där de förekommer.

- **Franska:** violoncelle (3, 6, först fr), fallu (3, 5, först fr), lève (3, 4, först fr), menu (3, 4, först fr1), ri (3, 4, först frs4), ends (3, 3, först fr1), flûte (3, 3, först fr), grille (3, 3, först fr), répète (3, 3, först fr), week (3, 3, först fr1)
- **Tyska:** sag (5, 9, först de2), geübt (4, 9, först de4), übt (4, 7, först de4), dritten (3, 9, först de4), website (3, 5, först de), fiel (3, 4, först de), hey (3, 4, först de2), teure (3, 4, först de4), mail (3, 3, först de1)
- **Italienska:** alcune (5, 14, först it2), ce (4, 5, först it2), conosciuto (4, 5, först it3), online (3, 6, först it3), promesso (3, 4, först it3), rapper (3, 4, först it4), glielo (3, 3, först it3), piaciuto (3, 3, först it3)

## Förslag: ord som borde bli kursord eller glosor

Okända ord som förekommer i **flera texter** i samma kurs bör bli **kursord** (words.txt, i kapitlet där texten ligger eller tidigare). Ord som bara finns i **en text** bör bli **glosor** i den texten (`gloss`). Listan tar med ord ur texter under gränsen. Kontrollera varje förslag: en del är böjningsformer som lemmatiseringen missat, namn i början av en mening eller ord som redan finns i en fras.

### de1

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### de2

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### de3

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### de4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): fußgängerzone (de4-le-9), kündigung (de4-le-15), rasen (de4-le-8), tanzstudio (de4-le-11)

### de

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): apartment (de-le-1)

### de6

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### de7

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### fr1

- **Kursord** (i flera texter): fond (2), part (2)
- **Glosor** (flera gånger i en text): dialogue (fr1-co-5), crêpes (fr1-ce-3), farine (fr1-ce-3)

### fr2

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): horreur (fr2-s-d7)

### fr

- **Kursord** (i flera texter): professionnels (2), bénévoles (2), fonctionne (2), honte (2), lancé (2), lycéens (2)
- **Glosor** (flera gånger i en text): accordeur (fr-co-9), créé (fr-ce-6), hébergement (fr-ce-1), récoltes (fr-ce-6), tuteurs (fr-ce-8)

### frs4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): charges (frs4-ce-1), proviseur (s-h6), cabane (s-h5), perceuse (frs4-ce-5), pompiers (s-h4)

### fr4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): badge (fr4-ce-5), tram (fr4-ce-5)

### fru

- **Kursord** (i flera texter): mène (2), répandue (2)
- **Glosor** (flera gånger i en text): délivrent (fru-ce-1), protège (fru-ce-2)

### it1

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): gruppo (it1-s-i3)

### it2

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### it3

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): guasto (it3-s-k3)

### it4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### it6

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### it7

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

## Texter under gränsen, per kurs

Sorterade med den lägsta täckningen först. Okända ord med antal förekomster i texten.

### de1: 2 av 34 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de1-r-e1` Mein Profil | lästext (läs) | 85 | 97,6 % | mail, ch |
| `de1-r-e6` Freizeit in Hamburg: Was ist los am Wochenende? | lästext (läs) | 98 | 98,0 % | tickets, norwegen |

### de2: 1 av 40 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de2-s-b3` Der erste Schnee | berättelse (läs) | 75 | 97,3 % | angezogen, gebaut |

### de3: 1 av 56 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `t3-s-t3` Das verlorene Handy | berättelse (läs) | 80 | 97,5 % | verloren, verzweifelt |

### de4: 13 av 70 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `t4-s-t3` Papas Geburtstag im Restaurant | berättelse (läs) | 127 | 96,1 % | meeresfrüchten, tomatensoße, umgeworfen, papas, lieblingsdessert |
| `de4-le-15` Kursbedingungen: Musikschule Klangraum | prov (läs) | 256 | 96,1 % | kündigung ×2, unterrichtsbedingungen, anmeldeformular, zusätzliche, ersatztermin, vertretung, gekündigt, beträgt |
| `de4-le-14` Hausordnung: Jugendherberge am Tannensee | prov (läs) | 273 | 96,3 % | bezugsfertig, beziehen, mahlzeiten, speisesaal, lunchpaket, speisen, spülen, lebensmittel |
| `de4-le-8` Zwei Zeitungsartikel: Ein Schulgarten und eine Lesenacht | prov (läs) | 443 | 96,4 % | rasen ×2, kräuter, dreizehnjährige, schulleitung, lösung, beete, gefressen, hochbeete |
| `de4-le-10` Anzeigen: Jobs für die Ferien | prov (läs) | 353 | 96,9 % | voraussetzung, rettungsschwimmabzeichen, schichten, abzeichen, betreuerinnen, betreuer, kräftig, kurzfristig |
| `de4-le-4` Leserbriefe: Ein Instrument für jedes Kind? | prov (läs) | 307 | 97,1 % | verpflichtend, überhaupt, übt, verbessern, pflichten, erfindet, big, zwingen |
| `de4-le-9` Zwei Zeitungsartikel: Fahrradwerkstatt und Regeln für Straßenmusik | prov (läs) | 440 | 97,3 % | fußgängerzone ×2, quietschende, sechzehnjährige, gespendet, leitet, mut, anwohner, beschwert |
| `de4-le-6` Jonas' Blog: Meine erste Woche im Musikgeschäft | prov (läs) | 262 | 97,3 % | firmen, beworben, entschieden, entfernt, enttäuscht, zieht, vorbereiten |
| `de4-le-3` Anzeigen: Musik in der Freizeit | prov (läs) | 238 | 97,5 % | m², schallisoliert, zustand, abholung, mischung, open |
| `de4-le-2` Zwei Zeitungsartikel: Musikschulen und Instrumente aus Müll | prov (läs) | 331 | 97,6 % | angaben, hauptgrund, leiterin, rohren, fünfzehnjährige, gebrummt, tritt, gewonnen |
| `t4-s-t2` Mein Umzug in die WG | berättelse (läs) | 135 | 97,8 % | gezogen, begrüßung, wohl |
| `de4-le-12` Leserbriefe: Handys im Unterricht? | prov (läs) | 361 | 97,8 % | lebendiger, sinnvoll, umzugehen, netzwerken, recherchen, unfair, stören, teures |
| `de4-le-11` Anzeigen: Kurse für die Freizeit | prov (läs) | 332 | 97,9 % | tanzstudio ×2, jeweils, ideal, einmaliger, teure, matte |

### de: 5 av 81 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de-le-4` Ein Pflichtjahr für alle? | prov (läs) | 376 | 97,3 % | motiviert, gezwungen, zivildienst, ökonomin, betreut, finanziell, ungerecht, zielstrebiger |
| `de-le-11` Mit mehreren Sprachen groß werden | prov (läs) | 455 | 97,6 % | sechsjährige, brocken, mischt, hartnäckig, erwerben, einsprachige, mischen, verwirrung |
| `de-le-9` Gemüse vom Parkplatz: Gemeinschaftsgärten in der Stadt | prov (läs) | 309 | 97,7 % | verwilderter, bewirtschaftet, gärtnerische, vergangenen, ließe, vergeblich, unversiegeltem |
| `de-le-1` Wohnen im Studium | prov (läs) | 402 | 97,8 % | apartment ×2, schallgedämmten, knüpft, kommilitonen, finanzieren, empfinde, verlorene, bereue |
| `s-d5` Kampf um das Jugendzentrum | berättelse (läs) | 145 | 97,9 % | unterschriften, lokalzeitung, geschwiegen |

### de6: 8 av 74 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de6-le-14` Nutzungsordnung des Tonstudios | prov (läs) | 261 | 96,6 % | studiozeiten, wochenkontingent, dreimaligem, mischpult, vermerkt, bzw, studioserver, sticks |
| `s-s4` Der Brief im Antiquariat | berättelse (läs) | 233 | 96,6 % | stöberte, germanistik, vergilbter, herausfiel, brüchig, weberei, stadtarchiv, umzog |
| `de6-le-11` Morgen fange ich an – ganz bestimmt | prov (läs) | 455 | 96,7 % | dritten, prokrastination, disziplin, psychologischen, prokrastiniert, untätig, zeitmanagement, empfindungen |
| `de6-le-8` Zwei Räder, die die Welt bewegten | prov (läs) | 370 | 96,8 % | badische, lenkbares, stieß, abwechselnd, erschreckten, tüftler, tretkurbeln, befestigen |
| `de6-le-6` Zeit ohne Smartphone | prov (läs) | 579 | 97,2 % | verlängertes, verschlossen, unruhig, vibriere, auszukommen, schublade, teure, retreats |
| `de6-le-5` Benutzungsordnung der Universitätsbibliothek | prov (läs) | 183 | 97,3 % | verlängert, speisen, verschließbaren, unbesetzt, maximal |
| `de6-le-15` Teilnahmebedingungen für den Internationalen Sommerkurs | prov (läs) | 263 | 97,3 % | vierwöchige, berufstätige, abzüglich, bearbeitungsgebühr, erstattung, vorzeitiger, ersatzperson |
| `de6-le-10` Wer verdient am Streaming? | prov (läs) | 477 | 97,5 % | zigtausendmal, visitenkarte, verteilungsprinzip, vertriebe, jeweiligen, ungerechtigkeit, musikwirtschaftlerin, plädiert |

### de7: 1 av 56 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `c-s8-9november` Der 9. November – ein deutscher Schicksalstag | kultur (läs) | 74 | 95,9 % | abdankung, verkündet, fiel |

### fr1: 10 av 40 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr1-ce-3` La recette des crêpes | prov (läs) | 65 | 81,5 % | farine ×2, crêpes ×2, faut, grammes, litre, bol, ajoutez, cuire |
| `fr1-co-5` Au café | prov (hör) | 49 | 89,8 % | dialogue ×4, fond |
| `fr1-co-4` Au magasin | prov (hör) | 41 | 90,2 % | bienvenue, shirts, rayon, étage |
| `fr1-ce-bild-1` Une carte de Tom | prov (läs) | 52 | 92,3 % | plage, part, pique, nique |
| `fr1-co-3` À la gare | prov (hör) | 44 | 93,2 % | part, retard, voyage |
| `fr1-co-bild-1` Cinq petits dialogues | prov (hör) | 56 | 94,6 % | veux, fond, couloir |
| `fr1-ce-5` Le programme du cinéma | prov (läs) | 55 | 96,4 % | vacances, horreur |
| `fr1-s-e2` La famille de Hugo | berättelse (läs) | 75 | 97,3 % | week, ends |
| `fr1-s-e8` La semaine de Nathan | berättelse (läs) | 84 | 97,6 % | chargée, lèves |
| `fr1-ce-2` Un message de Hugo | prov (läs) | 43 | 97,7 % | rendez |

### fr2: 9 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr2-co-4` Une publicité à la radio | prov (hör) | 58 | 94,8 % | kayak, paient, fr |
| `fr2-s-d7` Le film d'horreur | berättelse (läs) | 95 | 95,8 % | horreur ×2, proposé, téléphoné |
| `fr2-ce-3` Une affiche à la pharmacie | prov (läs) | 59 | 96,6 % | savon, coude |
| `fr2-ce-1` Un message de ta famille d'accueil | prov (läs) | 63 | 96,8 % | quiche, bisous |
| `fr2-s-d3` Lucas est malade | berättelse (läs) | 97 | 96,9 % | angine, sourit, repose |
| `fr2-s-d5` Un gâteau pour mamie | berättelse (läs) | 100 | 97,0 % | recette, farine, mamie |
| `fr2-s-d6` La fête de Nina | berättelse (läs) | 103 | 97,1 % | offert, collier, pleuvoir |
| `fr2-ce-2` Petites annonces | prov (läs) | 80 | 97,5 % | surf, refuge |
| `fr2-r-d1` Votre billet de train | lästext (läs) | 149 | 98,0 % | date, maximum, bar |

### fr: 12 av 65 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr-co-9` Accordeur de pianos | prov (hör) | 325 | 94,2 % | accordeur ×2, consiste, régler, intérieur, touche, fonctionne, concertiste, spécialisée |
| `fr-co-2` Un festival dans les vignes | prov (hör) | 334 | 94,3 % | fondateurs, particularité, fonctionne, bénévoles, nettoyage, lycéens, assister, organisateurs |
| `fr-ce-6` Des légumes sur les toits | prov (läs) | 326 | 94,5 % | créé ×2, récoltes ×2, m², fallu, propriétaire, solide, collecte, employés |
| `fr-ce-8` Un coup de pouce pour la première année | prov (läs) | 318 | 95,0 % | tuteurs ×2, choc, amphithéâtres, personnel, lancé, tutorat, révision, méthodes |
| `s-k2b` La naissance du métro | berättelse (läs) | 108 | 95,4 % | terrible, creuser, époque, dangereux, indispensable |
| `fr-ce-7` Un lycée qui se réveille plus tard | prov (läs) | 315 | 95,6 % | proviseure, enquête, délégués, lycéens, interrogés, terminale, adolescence, tendance |
| `fr-ce-2` Un orchestre au collège | prov (läs) | 334 | 95,8 % | ressemble, trompettes, touché, lancé, emporter, trompette, dépassent, absents |
| `fr-ce-1` Un stage de musique pour l'été | prov (läs) | 355 | 96,6 % | professionnels ×2, hébergement ×2, académie, individuels, adapté, dispose, guitaristes, jam |
| `s-k1b` Notre nouvelle vie à Nice | berättelse (läs) | 108 | 97,2 % | week, ends, nageais |
| `s-k1e` Le jour où j'ai rencontré Zidane | berättelse (läs) | 115 | 97,4 % | excité, tiré, talent |
| `fr-ce-9` Apprendre à nager à quarante ans | prov (läs) | 337 | 97,9 % | adultes, honte, technique, loisir, sécurité, liberté, kayak |
| `s-aller` Le voyage de Julie et Emma | berättelse (läs) | 98 | 98,0 % | debout, heureusement |

### frs4: 12 av 58 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `frs4-ce-8` Comment trier ses déchets | prov (läs) | 85 | 89,4 % | tri, emballages, inutile, conteneur, bouchon, épluchures, marc, usés |
| `frs4-ce-1` Petites annonces : logement | prov (läs) | 57 | 89,5 % | charges ×3, fumeur, colocataire, m² |
| `s-h6` La fausse nouvelle | berättelse (läs) | 80 | 90,0 % | proviseur ×3, récré, annonçait, détail, lèvres, source |
| `frs4-ce-6` Article : des lycéens contre le gaspillage | prov (läs) | 131 | 93,1 % | agir, balance, pèse, possibilité, reprendre, gaspillage, bio, terminale |
| `frs4-co-4` Annonce à la radio : un festival de cinéma | prov (hör) | 85 | 94,1 % | métrages, version, séance, lycéens, professionnelle |
| `s-h5` Le déménagement | berättelse (läs) | 84 | 95,2 % | cabane ×2, pleuvait, propriétaires |
| `frs4-ce-5` Article : la bibliothèque qui prête tout | prov (läs) | 127 | 96,9 % | perceuse ×2, coudre, utilisatrice |
| `s-h1` La réponse | berättelse (läs) | 98 | 96,9 % | césure, échoué, ému |
| `s-h8` Le train de nuit | berättelse (läs) | 99 | 97,0 % | compartiment, vieil, endormis |
| `frs4-ce-7` Règlement de l'auberge de jeunesse | prov (läs) | 113 | 97,3 % | prévenez, libérées, serviettes |
| `frs4-ce-2` Affiches au lycée | prov (läs) | 82 | 97,6 % | auprès, scolaire |
| `s-h4` Le 14 juillet | berättelse (läs) | 98 | 98,0 % | pompiers ×2 |

### frs5: 0 av 54 texter under gränsen

Alla texter når gränsen.

### fr4: 5 av 68 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr4-ce-6` Un job d'été en France | prov (läs) | 368 | 96,5 % | atlantique, réceptionnistes, vacanciers, home, navette, cueilleurs, vergers, récolte |
| `fr4-ce-5` Un studio pour répéter | prov (läs) | 388 | 96,6 % | tram ×2, badge ×2, insonorisées, casiers, pupitres, écart, entrepôt, abrite |
| `s-q3` Le jardin partagé | berättelse (läs) | 132 | 97,7 % | terrain, jardinier, récupérateur |
| `s-q1` La lettre du conservatoire | berättelse (läs) | 134 | 97,8 % | facteur, enveloppe, réessaierai |
| `fr4-ce-4` Les vérificateurs du lycée | prov (läs) | 342 | 98,0 % | résonne, circulent, documentaliste, semé, affirmait, webradio, prudent |

### fru: 8 av 68 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fru-ce-5` Le sommeil des adolescents, une affaire collective | prov (läs) | 451 | 95,8 % | couette, horloge, décale, accumule, évidemment, répandue, conversation, coéquipiers |
| `s-u6` L'héritage | berättelse (läs) | 174 | 96,0 % | fermier, vache, maigre, accoururent, fouillèrent, hospice, ri |
| `s-u2` Août 1944 | berättelse (läs) | 198 | 96,5 % | prisonnier, cachette, commençait, enfermé, mirent, répandue, descendirent |
| `fru-ce-4` Étudier à l'étranger : et si l'on descendait de l'avion ? | prov (läs) | 451 | 96,7 % | songerait, formidable, accusation, émetteurs, encourage, financier, aériennes, intervenir |
| `fru-ce-2` La laïcité, une liberté avant d'être une interdiction | prov (läs) | 465 | 96,8 % | protège ×2, invoquée, brandie, rempart, anodin, représentent, convictions, constitue |
| `fru-ce-1` Étudier la musique en France : plusieurs portes d'entrée | prov (läs) | 458 | 97,2 % | délivrent ×2, ignorés, multiplient, décisif, disciplines, médiation, mènent, acrobatiques |
| `s-u3` La nuit du 10 mai | berättelse (läs) | 180 | 97,8 % | téléviseur, bond, pleuve, représentait |
| `fru-ce-9` Un centre-ville sans voitures ? | prov (läs) | 330 | 97,9 % | alentour, précipitation, endroit, opposés, piéton, bancs, crains |

### it1: 3 av 37 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it1-s-i2` La nuova compagna di classe | berättelse (läs) | 75 | 97,3 % | curiosa, animali |
| `it1-s-i3` Il sabato di Luca | berättelse (läs) | 80 | 97,5 % | gruppo ×2 |
| `it1-le-1` Piccoli testi | prov (läs) | 49 | 98,0 % | aula |

### it2: 5 av 39 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it2-s-j8` Un progetto per il futuro | berättelse (läs) | 90 | 95,6 % | architettura, impegno, capo, soldi |
| `it2-s-j4` Gli occhiali del nonno | berättelse (läs) | 104 | 96,2 % | campagna, galline, trovati, arrabbiato |
| `it2-s-j1` Una nuova amica | berättelse (läs) | 89 | 96,6 % | sorriso, seguivamo, disegnatori |
| `it2-s-j3` Due sorelle a Roma | berättelse (läs) | 99 | 97,0 % | metro, stradine, trovato |
| `it2-s-j6` Una settimana a letto | berättelse (läs) | 91 | 97,8 % | forte, rimasta |

### it3: 3 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it3-s-k3` Una notizia falsa | berättelse (läs) | 163 | 96,9 % | guasto ×2, causa, condiviso, convinto |
| `it3-s-k7` Il mio primo concerto | berättelse (läs) | 137 | 97,1 % | piaciuta, piaciute, piaciuto, chitarrista |
| `it3-s-k2` Un lavoro per l'estate | berättelse (läs) | 140 | 97,1 % | disastro, adorava, mancia, ricchissimo |

### it4: 1 av 52 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it4-le-2` Messaggi e annunci | prov (läs) | 111 | 97,3 % | comprese, validi, urgenze |

### it5: 0 av 41 texter under gränsen

Alla texter når gränsen.

### it6: 4 av 54 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it6-s-h2` La notizia falsa | berättelse (läs) | 74 | 97,3 % | chat, chiusura |
| `it6-s-h5` Il provino | berättelse (läs) | 75 | 97,3 % | provino, terminata |
| `it6-le-1` Annunci: corsi estivi | prov (läs) | 125 | 97,6 % | meritevoli, spiagge, vitto |
| `it6-s-h6` Il restauro | berättelse (läs) | 86 | 97,7 % | impalcatura, scuro |

### it7: 2 av 39 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it7-c-t8-verdi` Verdi, voce di una nazione | kultur (läs) | 122 | 97,5 % | omaggio, salma, riempirono |
| `it7-ex-let-3` Due opinioni sul numero chiuso | prov (läs) | 86 | 97,7 % | tipo, valutare |

