# Ordtäckning i kursernas texter

Genererad 2026-09-30 med `python3 tools/tackning.py` (eller `python3 build.py --tackning`). Skriv inte i filen för hand; kör om verktyget.

Täckning = andel löpande ord i texten som eleven kan förväntas känna till: kursens ord + alla tidigare kurser i kedjan (`nextCourse` baklänges) + grammatikord och bindeord (med arv) + textens glosor (`gloss`, bara i hör-, läs- och kulturtexter där appen visar dem; inte i berättelser och prov) + namn, siffror och internationella ord. Böjningsformer hanteras med en enkel lemmatisering (se kommentaren i `tools/tackning.py`), så siffrorna är en uppskattning. Gränserna kommer från `docs/nivaer.md` 3.2: **hörtexter minst 95 %**, **lästexter minst 98 %** (lästexter = reading, stories, culture och provets läsdel; hörtexter = listening och provets hördel).

Observera att kursens *alla* ord räknas som kända i alla kursens texter, även ord från senare kapitel.

## Sammanfattning

| Kurs | Tidigare kurser | Kända lemman | Hörtexter | Medel hör | Under 95 % | Lästexter | Medel läs | Under 98 % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| de1 | – | 1249 | 11 | 99,9 % | 0 | 23 | 99,6 % | 2 |
| de2 | de1 | 2391 | 15 | 99,0 % | 0 | 25 | 99,3 % | 3 |
| de3 | de1, de2 | 3905 | 20 | 97,6 % | 0 | 28 | 99,2 % | 4 |
| de4 | de1, de2, de3 | 5157 | 28 | 98,7 % | 0 | 42 | 98,7 % | 13 |
| de | de1, de2, de3, de4 | 8818 | 30 | 98,3 % | 0 | 51 | 97,6 % | 21 |
| de6 | de1, de2, de3, de4, de | 11274 | 28 | 97,9 % | 1 | 46 | 98,1 % | 15 |
| de7 | de1, de2, de3, de4, de, de6 | 12896 | 16 | 97,6 % | 1 | 36 | 96,9 % | 28 |
| fr1 | – | 1042 | 14 | 97,3 % | 4 | 26 | 98,1 % | 6 |
| fr2 | fr1 | 2044 | 14 | 98,4 % | 1 | 27 | 98,7 % | 8 |
| fr | fr1, fr2 | 3803 | 24 | 97,9 % | 5 | 41 | 97,9 % | 14 |
| frs4 | fr1, fr2, fr | 5207 | 24 | 98,3 % | 1 | 34 | 97,7 % | 11 |
| frs5 | fr1, fr2, fr, frs4 | 6824 | 19 | 98,7 % | 0 | 27 | 98,8 % | 8 |
| fr4 | fr1, fr2, fr, frs4, frs5 | 8333 | 25 | 99,2 % | 0 | 43 | 99,3 % | 5 |
| fru | fr1, fr2, fr, frs4, frs5, fr4 | 10418 | 25 | 98,8 % | 0 | 43 | 99,1 % | 8 |
| it1 | – | 919 | 8 | 99,5 % | 0 | 27 | 98,5 % | 7 |
| it2 | it1 | 1810 | 8 | 99,2 % | 0 | 31 | 97,2 % | 15 |
| it3 | it1, it2 | 3075 | 16 | 99,2 % | 0 | 25 | 98,1 % | 10 |
| it4 | it1, it2, it3 | 4459 | 20 | 98,4 % | 0 | 32 | 98,8 % | 6 |
| it5 | it1, it2, it3, it4 | 6167 | 15 | 97,9 % | 0 | 26 | 98,3 % | 9 |
| it6 | it1, it2, it3, it4, it5 | 7781 | 19 | 97,9 % | 0 | 35 | 98,4 % | 15 |
| it7 | it1, it2, it3, it4, it5, it6 | 9397 | 11 | 97,9 % | 0 | 28 | 99,0 % | 6 |

## Ord som saknas i hela kedjan

Okända ord som förekommer i texterna i **flera kurser** i samma språk (antal kurser, antal förekomster totalt). Oftast vanliga småord (adverb, räkneord, vardagsord) som aldrig blivit kursord. De bör läggas in i den första kursen där de förekommer.

- **Franska:** ri (4, 6, först frs4), fallu (3, 5, först fr), violoncelle (3, 5, först fr), menu (3, 4, först fr1), tel (3, 4, först fr), directrice (3, 3, först fr), ends (3, 3, först fr1), flûte (3, 3, först fr), grille (3, 3, först fr), possibilité (3, 3, först fr), présent (3, 3, först fr), rappelle (3, 3, först fr2), répète (3, 3, först fr), week (3, 3, först fr1)
- **Tyska:** sag (5, 10, först de2), sechzig (5, 8, först de2), dritten (4, 13, först de4), chefin (4, 10, först de3), geübt (4, 9, först de4), dessen (4, 8, först de4), übt (4, 7, först de4), hey (4, 5, först de2), halle (4, 4, först de3), moderatorin (3, 43, först de3), website (3, 7, först de), greift (3, 6, först de), teurer (3, 6, först de), vergangenen (3, 6, först de), fließt (3, 5, först de), holz (3, 5, först de4), anwohner (3, 4, först de4), fakten (3, 4, först de), fiel (3, 4, först de), lebendig (3, 4, först de), professorinnen (3, 4, först de4), teure (3, 4, först de4), dritter (3, 3, först de4), größeren (3, 3, först de), herum (3, 3, först de4), kürzere (3, 3, först de), leiterin (3, 3, först de4), mail (3, 3, först de1), umgehen (3, 3, först de), zitterten (3, 3, först de)
- **Italienska:** alcune (5, 12, först it2), conosciuto (4, 5, först it3), online (3, 6, först it3), glielo (3, 4, först it3), rapper (3, 4, först it4), ce (3, 3, först it2), considerata (3, 3, först it3), dura (3, 3, först it3), piaciuto (3, 3, först it3), promesso (3, 3, först it3), regalato (3, 3, först it3)

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

- **Kursord** (i flera texter): daraus (2), chefin (2)
- **Glosor** (flera gånger i en text): fußgängerzone (de4-le-9), kündigung (de4-le-15), piano (de4-le-3), rasen (de4-le-8), tanzstudio (de4-le-11)

### de

- **Kursord** (i flera texter): sowie (3), vergangenen (3), überschrift (3), atmosphäre (2), davor (2), diskussion (2), genehmigung (2), hersteller (2), hinzu (2), lebendig (2), rentnerin (2), ungerecht (2), unrealistisch (2), unumstritten (2), vergeblich (2), verpflichtet (2), voraus (2)
- **Glosor** (flera gånger i en text): bewohner (de-le-15), bewohnerinnen (de-le-15), hülle (de-le-8), anspannung (de-le-6), apartment (de-le-1), erlenkönig (r-lit-erlkoenig), ersatzteile (de-le-2), hausverwaltung (de-le-15), hochbeeten (de-le-9), holz (r-d1-2), kita (de-le-11), schallplatte (de-le-8), website (de-le-14), wohnheim (de-le-1)

### de6

- **Kursord** (i flera texter): dessen (2), dritten (2), greift (2), teurer (2)
- **Glosor** (flera gånger i en text): aufschieben (de6-le-11), anwohner (de6-le-13), bundesregierung (de6-hoe-4)

### de7

- **Kursord** (i flera texter): musizieren (3), höhe (2), schließung (2), anlage (2), anzuzeigen (2), befürworter (2), beschreibung (2), bund (2), bundes (2), dar (2), dessen (2), dritten (2), erkrankung (2), ganztägig (2), greift (2), inhalt (2), jude (2), schallgedämmte (2), verwaltung (2), vorheriger (2)
- **Glosor** (flera gånger i en text): künstlerin (r-s4-konzertvertrag), mitarbeiterin (de7-hoe-3), auszug (r-s4-mietvertrag), inhalte (r-s7-desinformation), rednerin (r-s7-rede)

### fr1

- **Kursord** (i flera texter): fond (2), part (2)
- **Glosor** (flera gånger i en text): dialogue (fr1-co-5), crêpes (fr1-ce-3), farine (fr1-ce-3)

### fr2

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): horreur (fr2-s-d7)

### fr

- **Kursord** (i flera texter): association (5), bénévoles (3), lancé (3), lycéens (3), adultes (2), disposition (2), pratique (2), professionnels (2), acoustiques (2), adhésion (2), annuelle (2), autour (2), créneau (2), déranger (2), environnement (2), fiche (2), fin (2), fonctionne (2), honte (2), luthier (2), membre (2), municipal (2), progresser (2), répare (2), selon (2), situé (2), solution (2)
- **Glosor** (flera gånger i en text): réparer (fr-co-6), maître (fr-ce-9), accordeur (fr-co-9), cotisation (fr-ce-4), créé (fr-ce-6), dons (fr-co-7), entraînements (fr-ce-4), entreprises (fr-ce-2), gymnase (fr-ce-4), habitudes (fr-ce-3), hébergement (fr-ce-1), membres (fr-ce-5), médiathèque (fr-co-7), objet (fr-co-6), objets (fr-co-6), parking (fr-ce-4), récoltes (fr-ce-6), trimestre (fr-ce-5), tuteurs (fr-ce-8), visiteurs (fr-co-6), électriques (fr-co-6)

### frs4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): charges (frs4-ce-1), directeur (s-h6), cabane (s-h5), perceuse (frs4-ce-5), pompiers (s-h4)

### frs5

- **Kursord** (i flera texter): ri (2)
- **Glosor** (flera gånger i en text): supprimer (frs5-ce-3)

### fr4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): badge (fr4-ce-5), tram (fr4-ce-5)

### fru

- **Kursord** (i flera texter): mène (2), répandue (2)
- **Glosor** (flera gånger i en text): délivrent (fru-ce-1), protège (fru-ce-2)

### it1

- **Kursord** (i flera texter): chiede (4), arrivano (2), risponde (2)
- **Glosor** (flera gånger i en text): gruppo (it1-s-i3)

### it2

- **Kursord** (i flera texter): riso (3), trovato (3), alcuni (2), mare (2), soldi (2), zero (2)
- **Glosor** (flera gånger i en text): naso (it2-r-lit-pinocchio), avversari (it2-s-j2), cerimonia (it2-s-j7)

### it3

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): anatra (it3-s-k5), guasto (it3-s-k3), sud (it3-c-k1-regioni)

### it4

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): –

### it5

- **Kursord** (i flera texter): alcune (2)
- **Glosor** (flera gånger i en text): –

### it6

- **Kursord** (i flera texter): direttrice (2)
- **Glosor** (flera gånger i en text): alcune (it6-r-h1-2), portafoglio (it6-s-h7)

### it7

- **Kursord** (i flera texter): –
- **Glosor** (flera gånger i en text): alcune (it7-r-t7), fase (it7-r-t8)

## Texter under gränsen, per kurs

Sorterade med den lägsta täckningen först. Okända ord med antal förekomster i texten.

### de1: 2 av 34 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de1-r-e1` Mein Profil | lästext (läs) | 85 | 97,6 % | mail, ch |
| `de1-r-e6` Freizeit in Hamburg: Was ist los am Wochenende? | lästext (läs) | 96 | 97,9 % | tickets, norwegen |

### de2: 3 av 40 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de2-s-b4` Pech beim Handball | berättelse (läs) | 73 | 97,3 % | trainerin, sofa |
| `de2-s-b3` Der erste Schnee | berättelse (läs) | 75 | 97,3 % | angezogen, gebaut |
| `de2-s-b1` Ein verrückter Samstag | berättelse (läs) | 86 | 97,7 % | aufgewacht, frei |

### de3: 4 av 48 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `t3-s-t6` Mein erstes Konzert | berättelse (läs) | 83 | 95,2 % | lieblingsband, halle, geschrien, mitgesungen |
| `de3-le-4` Anzeigen: Freizeit und Kurse | prov (läs) | 105 | 95,2 % | kreuz, bescheinigung, tandem, ca, km |
| `de3-le-1` Zeitungstext: Schüler bauen ein Solarboot | prov (läs) | 106 | 97,2 % | solarboot, physiklehrer, solarzellen |
| `t3-s-t3` Das verlorene Handy | berättelse (läs) | 80 | 97,5 % | verloren, verzweifelt |

### de4: 13 av 70 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de4-le-8` Zwei Zeitungsartikel: Ein Schulgarten und eine Lesenacht | prov (läs) | 443 | 95,7 % | rasen ×2, daraus ×2, kräuter, dreizehnjährige, schulleitung, lösung, beete, gefressen |
| `de4-le-3` Anzeigen: Musik in der Freizeit | prov (läs) | 238 | 95,8 % | piano ×2, m², schallisoliert, zustand, abholung, mischung, harmonielehre, gehörbildung |
| `t4-s-t3` Papas Geburtstag im Restaurant | berättelse (läs) | 127 | 96,1 % | meeresfrüchten, tomatensoße, umgeworfen, papas, lieblingsdessert |
| `de4-le-15` Kursbedingungen: Musikschule Klangraum | prov (läs) | 256 | 96,1 % | kündigung ×2, unterrichtsbedingungen, anmeldeformular, zusätzliche, ersatztermin, vertretung, gekündigt, beträgt |
| `de4-le-14` Hausordnung: Jugendherberge am Tannensee | prov (läs) | 273 | 96,3 % | bezugsfertig, beziehen, mahlzeiten, speisesaal, lunchpaket, speisen, spülen, lebensmittel |
| `de4-le-2` Zwei Zeitungsartikel: Musikschulen und Instrumente aus Müll | prov (läs) | 331 | 96,7 % | angaben, tuba, hauptgrund, leiterin, rohren, dessen, daraus, fünfzehnjährige |
| `de4-le-4` Leserbriefe: Ein Instrument für jedes Kind? | prov (läs) | 307 | 96,7 % | verpflichtend, vorgeschlagen, überhaupt, übt, verbessern, pflichten, erfindet, big |
| `de4-le-10` Anzeigen: Jobs für die Ferien | prov (läs) | 353 | 96,9 % | voraussetzung, rettungsschwimmabzeichen, schichten, abzeichen, betreuerinnen, betreuer, kräftig, kurzfristig |
| `de4-le-6` Jonas' Blog: Meine erste Woche im Musikgeschäft | prov (läs) | 262 | 96,9 % | firmen, beworben, entschieden, entfernt, enttäuscht, chefin, zieht, vorbereiten |
| `de4-le-9` Zwei Zeitungsartikel: Fahrradwerkstatt und Regeln für Straßenmusik | prov (läs) | 440 | 97,0 % | fußgängerzone ×2, quietschende, sechzehnjährige, gespendet, leitet, mut, anwohner, beschwert |
| `t4-s-t2` Mein Umzug in die WG | berättelse (läs) | 135 | 97,8 % | gezogen, begrüßung, wohl |
| `de4-le-12` Leserbriefe: Handys im Unterricht? | prov (läs) | 361 | 97,8 % | lebendiger, sinnvoll, umzugehen, netzwerken, recherchen, unfair, stören, teures |
| `de4-le-11` Anzeigen: Kurse für die Freizeit | prov (läs) | 332 | 97,9 % | tanzstudio ×2, jeweils, ideal, einmaliger, teure, matte |

### de: 21 av 81 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de-le-15` Hausordnung eines Studentenwohnheims | prov (läs) | 245 | 87,3 % | bewohnerinnen ×4, bewohner ×4, sowie ×2, hausverwaltung ×2, studentenwohnheims, überschrift, geltungsbereich, wohnheims |
| `de-le-14` Teilnahmebedingungen eines Musikwettbewerbs | prov (läs) | 245 | 91,4 % | sowie ×2, website ×2, überschrift, solistinnen, formular, beizufügen, unvollständige, absenden |
| `de-le-2` Reparieren statt wegwerfen | prov (läs) | 231 | 91,8 % | ersatzteile ×2, gemeindezentrum, toastern, anpacken, repair, größeren, stammt, erfolgsquote |
| `de-le-8` Die Rückkehr der Schallplatte | prov (läs) | 298 | 91,9 % | hülle ×3, schallplatte ×2, betritt, durchdrängeln, inhaber, auslaufmodell, plattenfirmen, vergangenen |
| `de-le-9` Gemüse vom Parkplatz: Gemeinschaftsgärten in der Stadt | prov (läs) | 309 | 92,2 % | hochbeeten ×2, verwilderter, hölzernen, bewirtschaftet, gärtnerische, vergangenen, brachflächen, parzelle |
| `de-le-10` Gemeinsam singen, gemeinsam atmen | prov (läs) | 488 | 94,5 % | nordhessen, halbkreis, schütteln, chorleiterin, guttut, jeher, phänomen, forschende |
| `de-le-5` Übungsraumordnung einer Musikhochschule | prov (läs) | 183 | 94,5 % | überschrift, sowie, genehmigung, studiensekretariats, portal, frühestens, voraus, buchung |
| `de-le-3` Freitags bleibt das Büro zu | prov (läs) | 379 | 95,0 % | mittelständisches, finanziellen, geschäftsführerin, vergeblich, abheben, verpflichtet, beantwortet, umstellung |
| `de-le-13` Hunde am Arbeitsplatz – gute Idee? | prov (läs) | 422 | 95,5 % | grafikdesignerin, agentur, atmosphäre, abgabe, kraule, abteilungsleiter, anspringt, durchbeißt |
| `de-le-6` Lampenfieber – wie gehen Sie damit um? | prov (läs) | 550 | 95,8 % | anspannung ×2, unzählige, zitterten, herausbekam, aufregung, leichtathletin, davor, verkrampft |
| `de-le-1` Wohnen im Studium | prov (läs) | 402 | 96,0 % | wohnheim ×2, apartment ×2, studentenwohnheim, schallgedämmten, irgendwer, knüpft, ignoriert, lehramt |
| `de-le-11` Mit mehreren Sprachen groß werden | prov (läs) | 455 | 96,3 % | kita ×2, sechsjährige, brocken, mischt, beunruhigt, hartnäckig, sprachwissenschaftlerin, erwerben |
| `de-le-4` Ein Pflichtjahr für alle? | prov (läs) | 376 | 96,3 % | pflegeheim, motiviert, gezwungen, darunter, zivildienst, ökonomin, betreut, finanziell |
| `de-le-7` Urlaub mit gutem Gewissen? | prov (läs) | 541 | 96,7 % | anzukommen, voraus, steigungen, sechzig, vollbepackten, scheune, aufzog, pauschalreise |
| `de-le-12` Sollen Hausaufgaben abgeschafft werden? | prov (läs) | 428 | 97,2 % | bruchrechnung, verdorben, bildungsforscherin, greift, mechanisch, rückmeldung, abschaffung, ungerecht |
| `r-lit-erlkoenig` Erlkönig (Johann Wolfgang von Goethe, 1782) | lästext (läs) | 225 | 97,8 % | erlenkönig ×2, wohl, feiner, not |
| `r-d6` Rezension: „Tschick“ von Wolfgang Herrndorf | lästext (läs) | 283 | 97,9 % | vierzehnjährigen, villa, walachei, ungewöhnliche, zueinander, unrealistisch |
| `r-d1-2` Erzählung (utdrag): Der Koffer | lästext (läs) | 336 | 97,9 % | holz ×2, lachend, klopfte, anzusehen, all, unwichtig |
| `s-d3` Die Falschmeldung | berättelse (läs) | 145 | 97,9 % | heraus, meldung, erfunden |
| `s-d5` Kampf um das Jugendzentrum | berättelse (läs) | 145 | 97,9 % | unterschriften, lokalzeitung, geschwiegen |
| `r-d6-2` Recension: Große Gefühle mit der Jungen Philharmonie | lästext (läs) | 298 | 98,0 % | siebzehnjährige, mittelteil, tempi, dunkle, profis, lebendig |

### de6: 16 av 74 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de6-hoe-4` Vortrag: „Gastarbeiter“ in der Bundesrepublik | prov (hör) | 424 | 94,1 % | bundesregierung ×2, dritten, anwerbung, ausländischer, fünfziger, sechzigerjahren, anwerbeabkommen, griechenland |
| `de6-le-11` Morgen fange ich an – ganz bestimmt | prov (läs) | 455 | 94,9 % | aufschieben ×4, lehramtsstudentin, dritten, prokrastination, disziplin, psychologischen, prokrastiniert, untätig |
| `de6-le-8` Zwei Räder, die die Welt bewegten | prov (läs) | 370 | 95,4 % | badische, holz, lenkbares, stieß, abwechselnd, erschreckten, tüftler, tretkurbeln |
| `de6-le-5` Benutzungsordnung der Universitätsbibliothek | prov (läs) | 183 | 95,6 % | benutzungsordnung, personalausweises, verlängert, medium, speisen, verschließbaren, unbesetzt, maximal |
| `de6-le-6` Zeit ohne Smartphone | prov (läs) | 579 | 95,7 % | verlängertes, holzkiste, verschlossen, unruhig, vibriere, wozu, auszukommen, schublade |
| `de6-le-14` Nutzungsordnung des Tonstudios | prov (läs) | 261 | 95,8 % | studiozeiten, wochenkontingent, dreimaligem, mischpult, vermerkt, tontechnikerin, bzw, studioserver |
| `de6-le-10` Wer verdient am Streaming? | prov (läs) | 477 | 96,4 % | zigtausendmal, schallplatten, visitenkarte, verteilungsprinzip, titel, vertriebe, jeweiligen, ungerechtigkeit |
| `de6-le-2` Forschen ohne Doktortitel | prov (läs) | 262 | 96,6 % | amseln, meisen, spatzen, meldungen, expertinnen, rotkehlchen, zaunkönig, datensammler |
| `s-s4` Der Brief im Antiquariat | berättelse (läs) | 233 | 96,6 % | stöberte, germanistik, vergilbter, herausfiel, brüchig, weberei, stadtarchiv, umzog |
| `de6-le-15` Teilnahmebedingungen für den Internationalen Sommerkurs | prov (läs) | 263 | 96,6 % | vierwöchige, berufstätige, dessen, kursleitung, abzüglich, bearbeitungsgebühr, erstattung, vorzeitiger |
| `de6-le-13` Autofreie Innenstadt – ja oder nein? | prov (läs) | 465 | 97,0 % | anwohner ×2, inhaber, umliegenden, all, stadtplanerin, sperrt, verlagert, angrenzenden |
| `de6-le-3` Klassik um zehn | prov (läs) | 419 | 97,1 % | intendantin, worauf, langjährige, regulären, kürzerer, drumherum, musiksoziologen, gemischten |
| `s-s1` Die Aufnahmeprüfung | berättelse (läs) | 235 | 97,4 % | geübt, zitterten, professorinnen, notizen, fiel, gerissene |
| `de6-le-9` Die Rückkehr der Nachtzüge | prov (läs) | 367 | 97,8 % | bundesbahnen, verdanken, jüngere, boom, teurer, verkehrsforscherin, zukunftsmodell, niedrigere |
| `de6-le-12` Handys im Konzertsaal verbieten? | prov (läs) | 475 | 97,9 % | leuchtete, dunklen, rechteck, aufregung, auszuschalten, bonbonpapier, unarten, musikpädagogin |
| `de6-le-4` Wählen ab 16? | prov (läs) | 390 | 97,9 % | parolen, politische, einzuplanen, kommunalwahl, kandidatinnen, politikwissenschaftlerin, deuten, kommunalwahlen |

### de7: 29 av 52 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `r-s4-konzertvertrag` Auszug aus einem Konzertvertrag | lästext (läs) | 231 | 90,9 % | künstlerin ×8, höhe ×2, anlage, ordnungsgemäßen, gesondertes, ersatzbesetzung, erkrankung, vorherigen |
| `de7-hoe-3` Im Studierendensekretariat | prov (hör) | 127 | 92,9 % | mitarbeiterin ×6, übersetzung, abschicken, pförtner |
| `de7-le-2` Hausordnung des Studierendenwohnheims | prov (läs) | 106 | 93,4 % | ganztägig, einzuhalten, musizieren, schallgedämmte, hausverwaltung, verwaltung, vorheriger |
| `r-s8-stolpersteine` Kleine Steine, große Erinnerung: die Stolpersteine | lästext (läs) | 260 | 93,5 % | gehweg, jg, dezentrale, archive, angehörige, verlegung, unumstritten, damalige |
| `r-s4-mietvertrag` Auszug aus einem Mietvertrag mit Hausordnung | lästext (läs) | 497 | 93,8 % | auszug ×3, musizieren ×3, höhe ×2, bestehend, wohnfläche, ca, m², dritten |
| `r-s2-rezension` Konzertkritik: Brahms ohne Pathos | lästext (läs) | 266 | 94,4 % | irritiert, sechzig, stützt, üppigen, verblüffend, farbtupfer, zügig, verweilen |
| `c-s4-gema` Die GEMA | kultur (läs) | 76 | 94,7 % | mechanische, vervielfältigungsrechte, pflichtig, schwesterorganisation |
| `r-s7-rede` Analyse einer Rede: „Wir sind das Publikum“ | lästext (läs) | 295 | 95,6 % | schließung ×2, rednerin ×2, eröffnungsrede, neunjährige, ethos, einsparung, fakten, defensive |
| `de7-le-1` Künstliche Intelligenz im Kompositionsunterricht | prov (läs) | 165 | 95,8 % | harmonisierungen, befürworter, bedrohung, erlernen, abnimmt, erarbeitet, ungeklärt |
| `c-s3-maxplanck` Die Max-Planck-Gesellschaft | kultur (läs) | 96 | 95,8 % | betreibt, unmittelbaren, bund, ästhetik |
| `r-s5-freiberuflich` Ratgeber: Freiberuflich als Musikerin | lästext (läs) | 458 | 96,1 % | erfassung, mitzuteilen, sorgfältig, aufzubewahren, publizisten, versichert, versicherten, bundes |
| `s-s6` Das Bürgerbegehren | berättelse (läs) | 112 | 96,4 % | schließung, empört, sprecherin, erzwingen |
| `s-s8` Der Stein vor dem Haus | berättelse (läs) | 116 | 96,6 % | messingstein, stadtarchiv, nachzufragen, jude |
| `r-s2-hoffmann` Literatur: E. T. A. Hoffmann hört Beethoven | lästext (läs) | 461 | 96,7 % | begründung, dar, widersprach, inhalt, erweckt, unendliche, derjenige, verwirklicht |
| `r-s7-desinformation` Sachtext: Wie Desinformation wirkt | lästext (läs) | 468 | 96,8 % | inhalte ×3, anzuzeigen, kommunikationswissenschaft, neigen, darstellungen, dargestellt, verdacht, täuschend |
| `r-s5-kommentar` Kommentar: Kultur ist keine Subvention, sondern eine Investition | lästext (läs) | 287 | 96,9 % | ansetzt, bezuschusst, kassiererin, greift, gewerbeflächen, musizieren, teure, kooperationen |
| `r-s1-studienordnung` Auszug aus einer Studien- und Prüfungsordnung | lästext (läs) | 256 | 96,9 % | notenverbesserung, anzuzeigen, vorzulegen, chronischen, erkrankung, abzulegen, erbracht, anrechnung |
| `r-s1-essay` Essay: Bildung oder Ausbildung? | lästext (läs) | 486 | 96,9 % | seither, eile, umwege, nachzuhängen, umrechnen, nichtakademischen, jeher, übt |
| `r-s8-zweig` Literatur: Stefan Zweig, Die Welt von Gestern | lästext (läs) | 490 | 97,1 % | brasilianischen, europäers, dutzende, jude, sammler, besaß, schöpferischen, sammlung |
| `c-s8-9november` Der 9. November – ein deutscher Schicksalstag | kultur (läs) | 72 | 97,2 % | juden, fiel |
| `de7-le-4` Neues Probenzentrum eröffnet | prov (läs) | 72 | 97,2 % | schallgedämmte, hohen |
| `s-s3` Das Experiment | berättelse (läs) | 113 | 97,3 % | musikpsychologie, leiterin, größeren |
| `r-s3-lampenfieber` Text mit Grafik: Auftrittsangst bei Musikstudierenden | lästext (läs) | 494 | 97,4 % | umgehen, niedriger, musikpädagogik, hinweg, dar, hörbar, beruht, psychologische |
| `r-s6-foederalismus` Sechzehn Wege zur Musikschule: Föderalismus im Alltag | lästext (läs) | 266 | 97,4 % | bemängeln, bund, beauftragte, nationaler, kulturministerium, bundes, zentralistischen |
| `c-s7-unwort` Das Unwort des Jahres | kultur (läs) | 89 | 97,8 % | formulierungen, diskriminieren |
| `c-s5-orchesterlandschaft` Die deutsche Orchesterlandschaft | kultur (läs) | 90 | 97,8 % | bundesweite, verzeichnis |
| `de7-le-3` Anfrage wegen eines Übungsraums | prov (läs) | 91 | 97,8 % | website, dritten |
| `s-s1` Das erste Semester | berättelse (läs) | 137 | 97,8 % | begrüßung, zurechtzufinden, dozentin |
| `s-s7` Die Rede | berättelse (läs) | 96 | 97,9 % | zitterten, bedacht |

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

### fr: 19 av 65 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr-ce-3` Une étudiante chez Madeleine | prov (läs) | 336 | 89,9 % | association ×5, habitudes ×2, exploit, loyers, élevés, disparaissent, lyrique, solution |
| `fr-ce-4` Un sport pour Clara | prov (läs) | 402 | 90,0 % | entraînements ×2, gymnase ×2, cotisation ×2, parking ×2, section, accueillons, conviviale, entraîneurs |
| `fr-co-6` Un café pour réparer | prov (hör) | 322 | 90,1 % | réparer ×5, objets ×2, objet ×2, visiteurs ×2, électriques ×2, émission, consommation, environnement |
| `fr-ce-5` Un piano pour s'entraîner | prov (läs) | 403 | 91,3 % | trimestre ×2, pratique ×2, disposition ×2, association ×2, membres ×2, insonorisés, acoustiques, situé |
| `fr-ce-9` Apprendre à nager à quarante ans | prov (läs) | 338 | 91,4 % | maître ×3, adultes ×2, municipale, honte, évitent, salaire, progresser, séances |
| `fr-ce-6` Des légumes sur les toits | prov (läs) | 326 | 92,9 % | association ×4, créé ×2, récoltes ×2, m², moyenne, fallu, propriétaire, solide |
| `fr-co-9` Accordeur de pianos | prov (hör) | 325 | 93,2 % | accordeur ×2, consiste, régler, répare, intérieur, touche, fonctionne, concertiste |
| `fr-co-2` Un festival dans les vignes | prov (hör) | 334 | 93,7 % | fondateurs, suivante, accueille, particularité, fonctionne, bénévoles, nettoyage, lycéens |
| `fr-co-7` Emprunter une guitare à la médiathèque | prov (hör) | 320 | 94,1 % | médiathèque ×2, dons ×2, soixantaine, plupart, lancé, luthier, vérifiés, réparés |
| `fr-ce-2` Un orchestre au collège | prov (läs) | 334 | 94,3 % | association ×2, entreprises ×2, ressemble, trompettes, touché, lancé, emporter, trompette |
| `s-k2b` La naissance du métro | berättelse (läs) | 108 | 94,4 % | fin, terrible, creuser, époque, dangereux, indispensable |
| `fr-ce-8` Un coup de pouce pour la première année | prov (läs) | 318 | 94,7 % | tuteurs ×2, choc, amphithéâtres, personnel, lancé, tutorat, révision, méthodes |
| `fr-co-5` Une salle pour répéter | prov (hör) | 264 | 94,7 % | plaints, bruit, solution, insonorisées, répète, raisonnable, matériel, amplis |
| `fr-ce-7` Un lycée qui se réveille plus tard | prov (läs) | 315 | 95,2 % | directrice, enquête, délégués, lycéens, interrogés, terminale, adolescence, tendance |
| `fr-ce-1` Un stage de musique pour l'été | prov (läs) | 355 | 96,3 % | professionnels ×2, hébergement ×2, académie, individuels, adapté, dispose, guitaristes, actuelles |
| `s-k1` Mon premier cours d'escalade | berättelse (läs) | 101 | 97,0 % | montré, abdos, fin |
| `s-k1b` Notre nouvelle vie à Nice | berättelse (läs) | 108 | 97,2 % | week, ends, nageais |
| `s-k1e` Le jour où j'ai rencontré Zidane | berättelse (läs) | 115 | 97,4 % | excité, tiré, talent |
| `s-aller` Le voyage de Julie et Emma | berättelse (läs) | 98 | 98,0 % | debout, heureusement |

### frs4: 12 av 58 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `frs4-ce-1` Petites annonces : logement | prov (läs) | 57 | 87,7 % | charges ×3, fumeur, quatrième, colocataire, m² |
| `frs4-ce-8` Comment trier ses déchets | prov (läs) | 85 | 88,2 % | tri, emballages, inutile, vider, conteneur, bouchon, épluchures, marc |
| `s-h6` La fausse nouvelle | berättelse (läs) | 80 | 90,0 % | directeur ×3, récré, annonçait, détail, lèvres, source |
| `frs4-ce-6` Article : des lycéens contre le gaspillage | prov (läs) | 131 | 93,1 % | agir, balance, pèse, possibilité, reprendre, gaspillage, bio, terminale |
| `frs4-co-4` Annonce à la radio : un festival de cinéma | prov (hör) | 85 | 94,1 % | métrages, version, séance, lycéens, professionnelle |
| `s-h5` Le déménagement | berättelse (läs) | 84 | 95,2 % | cabane ×2, pleuvait, propriétaires |
| `frs4-ce-5` Article : la bibliothèque qui prête tout | prov (läs) | 127 | 96,1 % | perceuse ×2, coudre, membres, utilisatrice |
| `s-h1` La réponse | berättelse (läs) | 97 | 96,9 % | césure, échoué, ému |
| `s-h8` Le train de nuit | berättelse (läs) | 99 | 97,0 % | compartiment, vieil, endormis |
| `frs4-ce-7` Règlement de l'auberge de jeunesse | prov (läs) | 113 | 97,3 % | prévenez, libérées, serviettes |
| `frs4-ce-2` Affiches au lycée | prov (läs) | 82 | 97,6 % | auprès, scolaire |
| `s-h4` Le 14 juillet | berättelse (läs) | 98 | 98,0 % | pompiers ×2 |

### frs5: 8 av 46 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `frs5-ce-3` Faut-il noter les élèves ? | prov (läs) | 261 | 95,8 % | supprimer ×3, urgent, décourager, système, scolaire, refaire, étape, sanction |
| `frs5-ce-1` Un stage de musique pour l'été | prov (läs) | 211 | 96,7 % | altistes, individuels, violoncelles, encadré, fest, noz, pension |
| `s-v2` La lettre d'admission | berättelse (läs) | 86 | 97,7 % | postulais, ri |
| `frs5-ce-2` Une bibliothèque où l'on peut faire du bruit | prov (läs) | 266 | 97,7 % | chuchoter, directrice, bricolage, silencieuse, aménagée, incompatibles |
| `r-v4-manuel` Protections auditives sur mesure : mode d'emploi | lästext (läs) | 321 | 97,8 % | volume, rock, index, extérieur, provoquer, usage, couverts |
| `s-v8` Le jean de trop | berättelse (läs) | 97 | 97,9 % | réfléchisses, ajouté |
| `s-v5` Un malentendu à Bruxelles | berättelse (läs) | 98 | 98,0 % | ri, carnet |
| `r-v1-mail` Candidature pour un stage d'été | lästext (läs) | 295 | 98,0 % | filière, violoncelle, impressionnée, type, termine, salutations |

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
| `fru-ce-2` La laïcité, une liberté avant d'être une interdiction | prov (läs) | 465 | 96,6 % | protège ×2, invoquée, brandie, rempart, anodin, représentent, convictions, constitue |
| `fru-ce-4` Étudier à l'étranger : et si l'on descendait de l'avion ? | prov (läs) | 451 | 96,7 % | songerait, formidable, accusation, émetteurs, encourage, financier, aériennes, intervenir |
| `fru-ce-1` Étudier la musique en France : plusieurs portes d'entrée | prov (läs) | 458 | 97,2 % | délivrent ×2, ignorés, multiplient, décisif, disciplines, médiation, mènent, acrobatiques |
| `s-u3` La nuit du 10 mai | berättelse (läs) | 180 | 97,8 % | téléviseur, bond, pleuve, représentait |
| `fru-ce-9` Un centre-ville sans voitures ? | prov (läs) | 330 | 97,9 % | alentour, précipitation, endroit, opposés, piéton, bancs, crains |

### it1: 7 av 35 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it1-s-i8` Il compleanno di Sofia | berättelse (läs) | 97 | 92,8 % | festa, arrivano, gridano, apre, regali, chiede, risponde |
| `it1-s-i6` Dov'è la gelateria? | berättelse (läs) | 85 | 92,9 % | sa, chiede, verso, arrivano, risponde, altra |
| `it1-s-i4` Un lunedì difficile | berättelse (läs) | 71 | 94,4 % | ancora, corre, arriva, ritardo |
| `it1-s-i1` Il primo giorno di corso | berättelse (läs) | 78 | 96,2 % | corso, chiede, pronti |
| `it1-s-i5` Una pizza per tutti | berättelse (läs) | 74 | 97,3 % | chiede ×2 |
| `it1-s-i2` La nuova compagna di classe | berättelse (läs) | 75 | 97,3 % | curiosa, animali |
| `it1-s-i3` Il sabato di Luca | berättelse (läs) | 80 | 97,5 % | gruppo ×2 |

### it2: 15 av 39 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it2-le-1` Cartelli e avvisi | prov (läs) | 48 | 89,6 % | riapriamo, vietato, lettura, frigo, scaldarla |
| `it2-s-j2` Un sabato sfortunato | berättelse (läs) | 89 | 92,1 % | avversari ×2, rigore, arrabbiati, zero, portafoglio, trovato |
| `it2-s-j7` Il matrimonio della zia | berättelse (läs) | 93 | 92,5 % | cerimonia ×2, collina, tirato, riso, durato, felicità |
| `it2-s-j1` Una nuova amica | berättelse (läs) | 89 | 93,3 % | sederti, sorriso, seguivamo, disegnatori, stupidaggine, inseparabili |
| `it2-s-j4` Gli occhiali del nonno | berättelse (läs) | 104 | 94,2 % | campagna, galline, burro, trovati, arrabbiato, riso |
| `it2-s-j8` Un progetto per il futuro | berättelse (läs) | 90 | 95,6 % | architettura, impegno, capo, soldi |
| `it2-r-j8` Il mio primo lavoro | lästext (läs) | 151 | 96,0 % | mare, trovato, internet, riso, soldi, computer |
| `it2-r-j6` Una brutta caduta | lästext (läs) | 160 | 96,2 % | vincevamo, zero, palla, fortissimo, alcuni, contro |
| `it2-r-j4` Il mio paesino | lästext (läs) | 188 | 96,3 % | luce, durante, usavamo, soprattutto, tablet, sanno, sapevo |
| `it2-c-j3-ferragosto` Ferragosto | kultur (läs) | 95 | 96,8 % | cattolica, vacanza, mare |
| `it2-s-j3` Due sorelle a Roma | berättelse (läs) | 99 | 97,0 % | metro, stradine, trovato |
| `it2-c-j8-maturita` La maturità e il primo lavoro | kultur (läs) | 139 | 97,1 % | famosa, trovare, circa, alcuni |
| `it2-le-2` Un messaggio di Giulia | prov (läs) | 74 | 97,3 % | regalo, bacio |
| `it2-r-lit-pinocchio` Il naso di Pinocchio (fritt efter Carlo Collodi, 1883) | lästext (läs) | 181 | 97,8 % | naso ×4 |
| `it2-s-j6` Una settimana a letto | berättelse (läs) | 91 | 97,8 % | forte, rimasta |

### it3: 10 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it3-s-k5` Una giornata al lago | berättelse (läs) | 134 | 94,0 % | anatra ×3, paio, zampa, povera, riempito, borraccia |
| `it3-s-k1` Un'estate in Puglia | berättelse (läs) | 143 | 95,1 % | riuscivamo, barche, pescatori, pescatore, regalato, enorme, scoppiata |
| `it3-s-k7` Il mio primo concerto | berättelse (läs) | 137 | 95,6 % | regalati, piaciuta, piaciute, intera, piaciuto, chitarrista |
| `it3-s-k3` Una notizia falsa | berättelse (läs) | 163 | 96,3 % | guasto ×2, causa, condiviso, convinto, incontrato |
| `it3-s-k2` Un lavoro per l'estate | berättelse (läs) | 140 | 96,4 % | disastro, adorava, mancia, ricchissimo, aprirò |
| `it3-r-k5` Un paese della Liguria dice addio alla plastica | lästext (läs) | 163 | 96,9 % | usare, scienze, iniziativa, prodotti, usano |
| `it3-s-k4` Troppo stress | berättelse (läs) | 145 | 97,2 % | allenatrice, ammetterlo, sbuffato, gliel |
| `it3-s-k8` Una lite tra amiche | berättelse (läs) | 158 | 97,5 % | riso, lite, stupida, promesso |
| `it3-r-k7` Giuseppe Verdi, il musicista di un paese | lästext (läs) | 204 | 97,5 % | amava, modo, continuato, amate, poveri |
| `it3-c-k1-regioni` Venti regioni, venti Italie | kultur (läs) | 125 | 97,6 % | sud ×2, nord |

### it4: 6 av 52 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it4-c-c5-cinema` Cinecittà e il cinema italiano | kultur (läs) | 102 | 97,1 % | cinematografici, inaugurata, televisive |
| `it4-s-c4` La nuova coinquilina | berättelse (läs) | 108 | 97,2 % | lenzuola, gliel, regalata |
| `it4-r-c4b` Due città, due vite | lästext (läs) | 257 | 97,3 % | confronto, ovviamente, invernale, mys, funziona, destinazione, residenza |
| `it4-le-2` Messaggi e annunci | prov (läs) | 111 | 97,3 % | comprese, validi, urgenze |
| `it4-r-c8b` Lettera da Melbourne | lästext (läs) | 262 | 97,3 % | arrugginito, fabbrica, mattoni, conosciuto, impresa, edile, destino |
| `it4-le-3` Tre brevi testi sul tempo libero | prov (läs) | 166 | 97,6 % | lamentati, compenso, durerà, regalato |

### it5: 9 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it5-le-2` Lo spreco alimentare | prov (läs) | 167 | 97,0 % | tonnellate, avviene, confondono, dicitura, indica |
| `it5-s-m1` Il nuovo lavoro | berättelse (läs) | 67 | 97,0 % | promesso, continuato |
| `it5-r-m6` Recensione: «Il fu Mattia Pascal» | lästext (läs) | 288 | 97,2 % | infelice, grossa, liberarsene, impossibile, riflette, sorprendentemente, romana, ricominciare |
| `it5-c-m8-slowfood` Slow Food e la cucina povera | kultur (läs) | 114 | 97,4 % | aprì, fast, fagioli |
| `it5-r-m7` Cremona, la città dei violini | lästext (läs) | 275 | 97,5 % | considerato, certezza, eccezionale, giappone, superiore, riconosciuto, umanità |
| `it5-r-m5` Una lingua, tanti italiani | lästext (läs) | 294 | 97,6 % | pescatore, secoli, interna, comunicare, alcune, zitto, sorprendente |
| `it5-c-m2-bologna` L'Università di Bologna | kultur (läs) | 90 | 97,8 % | considerata, occidentale |
| `it5-c-m4-ssn` Il Servizio Sanitario Nazionale | kultur (läs) | 94 | 97,9 % | riconoscibili, alcune |
| `it5-s-m6` Il burattino | berättelse (läs) | 47 | 97,9 % | regalò |

### it6: 15 av 54 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it6-c-h6` L'articolo 9 | kultur (läs) | 71 | 97,2 % | artistico, continue |
| `it6-s-h2` La notizia falsa | berättelse (läs) | 74 | 97,3 % | chat, chiusura |
| `it6-s-h5` Il provino | berättelse (läs) | 75 | 97,3 % | provino, terminata |
| `it6-s-h4` Una notte con Dante | berättelse (läs) | 76 | 97,4 % | quinto, avvicinò |
| `it6-r-h4-2` Dante: l'inizio della Commedia | lästext (läs) | 235 | 97,4 % | ritrovai, durasse, verbo, indica, confusione, trapassato |
| `it6-s-h7` Il portafoglio | berättelse (läs) | 80 | 97,5 % | portafoglio ×2 |
| `it6-le-1` Annunci: corsi estivi | prov (läs) | 125 | 97,6 % | meritevoli, spiagge, vitto |
| `it6-r-h6-2` Caravaggio: il pittore della luce | lästext (läs) | 383 | 97,7 % | illumina, violenta, prigione, uccise, continuando, colte, giace, accecato |
| `it6-r-h1-2` Inchiesta: i giovani e il lavoro all'estero | lästext (läs) | 386 | 97,7 % | alcune ×2, termine, conosciuto, vizioso, interviene, svuotarsi, introdotto, continuerà |
| `it6-r-h8-1` Reportage: case a un euro | lästext (läs) | 301 | 97,7 % | gran, avverte, trasformi, risolto, barista, capivamo, riportare |
| `it6-s-h6` Il restauro | berättelse (läs) | 86 | 97,7 % | impalcatura, scuro |
| `it6-r-h1-1` Lettera di candidatura: un tirocinio al festival | lästext (läs) | 304 | 97,7 % | spett, proporre, dedicare, contribuire, riteniate, videochiamata, direttrice |
| `it6-c-h2` La RAI e il canone | kultur (läs) | 89 | 97,8 % | radiotelevisivo, contribuì |
| `it6-r-h8-2` Lettera al giornale: il mio dialetto non è una vergogna | lästext (läs) | 380 | 97,9 % | contengono, termini, tipi, diversamente, rapper, consideri, incontri, raccogliere |
| `it6-s-h1` Il colloquio | berättelse (läs) | 97 | 97,9 % | tremavano, direttrice |

### it7: 6 av 39 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it7-c-t7-bologna` L'università più antica del mondo occidentale | kultur (läs) | 103 | 97,1 % | considerata, occidentale, superiore |
| `it7-r-t8` Ammissione al conservatorio: informazioni per candidati stranieri | lästext (läs) | 366 | 97,3 % | fase ×2, riconosciuta, possiede, chiaramente, presenza, pianista, accompagnatore, assegnati |
| `it7-r-t7` Come funziona l'università in Italia: guida per studenti stranieri | lästext (läs) | 363 | 97,5 % | alcune ×2, durano, riservato, eccellenti, particolarità, rigide, esprime, indossano |
| `it7-ex-let-1` Il ritorno dei borghi | prov (läs) | 127 | 97,6 % | sparse, ristrutturi, urbanista |
| `it7-ex-let-3` Due opinioni sul numero chiuso | prov (läs) | 86 | 97,7 % | tipo, valutare |
| `it7-r-t1` Saggio: l'elogio del dubbio | lästext (läs) | 378 | 97,9 % | cartesio, apparisse, confonde, difendere, disposto, sensazionale, rotonda, espresso |

