# Ordtäckning i kursernas texter

Genererad 2026-09-29 med `python3 tools/tackning.py` (eller `python3 build.py --tackning`). Skriv inte i filen för hand; kör om verktyget.

Täckning = andel löpande ord i texten som eleven kan förväntas känna till: kursens ord + alla tidigare kurser i kedjan (`nextCourse` baklänges) + grammatikord och bindeord + textens glosor (`gloss`) + namn, siffror och internationella ord. Böjningsformer hanteras med en enkel lemmatisering (se kommentaren i `tools/tackning.py`), så siffrorna är en uppskattning. Gränserna kommer från `docs/nivaer.md` 3.2: **hörtexter minst 95 %**, **lästexter minst 98 %** (lästexter = reading, stories, culture och provets läsdel; hörtexter = listening och provets hördel).

Observera att kursens *alla* ord räknas som kända i alla kursens texter, även ord från senare kapitel.

## Sammanfattning

| Kurs | Tidigare kurser | Kända lemman | Hörtexter | Medel hör | Under 95 % | Lästexter | Medel läs | Under 98 % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| de1 | – | 1177 | 11 | 98,3 % | 2 | 23 | 98,2 % | 6 |
| de2 | de1 | 2227 | 15 | 95,7 % | 6 | 25 | 95,2 % | 19 |
| de3 | de1, de2 | 3585 | 20 | 92,4 % | 15 | 28 | 90,9 % | 27 |
| de4 | de1, de2, de3 | 4853 | 28 | 96,1 % | 7 | 42 | 95,1 % | 33 |
| de | de1, de2, de3, de4 | 8724 | 30 | 96,7 % | 7 | 51 | 95,9 % | 35 |
| de6 | de1, de2, de3, de4, de | 11061 | 28 | 96,0 % | 5 | 46 | 95,7 % | 43 |
| de7 | de1, de2, de3, de4, de, de6 | 12503 | 10 | 95,5 % | 4 | 18 | 94,3 % | 16 |
| fr1 | – | 981 | 13 | 95,6 % | 4 | 25 | 96,6 % | 12 |
| fr2 | fr1 | 1934 | 14 | 94,6 % | 6 | 27 | 94,4 % | 23 |
| fr | fr1, fr2 | 3760 | 24 | 96,4 % | 7 | 41 | 97,0 % | 18 |
| frs4 | fr1, fr2, fr | 5105 | 24 | 95,9 % | 6 | 34 | 94,8 % | 31 |
| frs5 | fr1, fr2, fr, frs4 | 6722 | 19 | 96,7 % | 3 | 27 | 96,5 % | 20 |
| fr4 | fr1, fr2, fr, frs4, frs5 | 8163 | 25 | 97,2 % | 3 | 43 | 96,8 % | 32 |
| fru | fr1, fr2, fr, frs4, frs5, fr4 | 10231 | 25 | 96,4 % | 7 | 43 | 96,6 % | 34 |
| it1 | – | 901 | 8 | 99,1 % | 0 | 27 | 96,8 % | 10 |
| it2 | it1 | 1782 | 8 | 97,4 % | 0 | 28 | 95,7 % | 19 |
| it3 | it1, it2 | 3031 | 16 | 96,4 % | 3 | 25 | 95,7 % | 19 |
| it4 | it1, it2, it3 | 4392 | 20 | 95,1 % | 12 | 32 | 94,4 % | 29 |
| it5 | it1, it2, it3, it4 | 6080 | 15 | 95,5 % | 6 | 26 | 94,8 % | 26 |
| it6 | it1, it2, it3, it4, it5 | 7678 | 19 | 94,0 % | 11 | 35 | 94,7 % | 32 |
| it7 | it1, it2, it3, it4, it5, it6 | 9299 | 11 | 94,1 % | 6 | 28 | 94,1 % | 27 |

## Ord som saknas i hela kedjan

Okända ord som förekommer i texterna i **flera kurser** i samma språk (antal kurser, antal förekomster totalt). Oftast vanliga småord (adverb, räkneord, vardagsord) som aldrig blivit kursord. De bör läggas in i den första kursen där de förekommer.

- **Franska:** encore (7, 84, först fr1), déjà (6, 76, först fr2), presque (6, 50, först fr2), tôt (6, 32, först fr2), longtemps (6, 27, först fr2), prochaine (6, 25, först fr2), appris (6, 24, först fr2), chacun (5, 27, först fr), devenu (5, 22, först fr), prochain (5, 18, först fr2), devenir (5, 17, först fr), attention (5, 16, först fr1), exactement (5, 16, först fr), possible (5, 16, först fr2), devenue (5, 13, först fr), apporter (5, 11, först fr2), dame (5, 11, först fr1), numéro (5, 9, först fr1), apporte (5, 7, först fr1), connaissais (5, 6, först fr), pourquoi (4, 29, först fr2), plutôt (4, 25, först frs4), milliers (4, 23, först frs4), atelier (4, 17, först fr2), suffit (4, 17, först fr), fallait (4, 15, först fr), faudrait (4, 15, först frs4), existe (4, 13, först frs4), pose (4, 10, först fr), rap (4, 10, först fr1), savent (4, 10, först frs4), autour (4, 9, först fr), jazz (4, 8, först frs4), sinon (4, 8, först frs4), ateliers (4, 7, först fr), impossible (4, 7, först fr), prof (4, 7, först fr), confirme (4, 6, först fr), connaissent (4, 6, först fr2), dort (4, 6, först frs4)
- **Tyska:** mehr (6, 170, först de2), also (6, 91, först de2), fast (6, 89, först de2), warum (6, 58, först de2), gilt (6, 29, först de2), gar (5, 56, först de2), mama (5, 11, först de1), sag (5, 10, först de2), sechzig (5, 7, först de2), nur (4, 113, först de1), dazu (4, 28, först de4), daran (4, 25, först de4), gesprochen (4, 17, först de4), darin (4, 14, först de4), wichtigste (4, 14, först de4), anmeldung (4, 13, först de3), nun (4, 13, först de1), beide (4, 12, först de4), dritten (4, 12, först de3), los (4, 11, först de2), zweitens (4, 11, först de3), drittens (4, 10, först de3), bekam (4, 9, först de3), chefin (4, 9, först de3), geholfen (4, 8, först de2), schönste (4, 8, först de3), dessen (4, 7, först de4), vergangenen (4, 7, först de4), hinein (4, 6, först de3), verloren (4, 6, först de3), geigerin (4, 5, först de3), hey (4, 5, först de2), halle (4, 4, först de3), moderatorin (3, 43, först de3), beiden (3, 15, först de4), bevor (3, 14, först de4), solche (3, 14, först de), sowie (3, 14, först de), begann (3, 10, först de), entschieden (3, 9, först de4)
- **Italienska:** qui (7, 42, först it1), poco (7, 25, först it1), quasi (6, 55, först it2), soprattutto (6, 48, först it2), alcuni (6, 43, först it2), pochi (6, 28, först it2), li (6, 22, först it2), troppo (6, 21, först it2), subito (6, 19, först it2), alcune (6, 18, först it2), qualcosa (6, 17, först it2), lì (6, 16, först it1), adesso (5, 29, först it1), esiste (5, 13, först it3), migliaia (5, 11, först it3), benissimo (5, 10, först it2), nemmeno (5, 8, först it3), ognuno (5, 8, först it1), qualcuno (4, 25, först it3), nessuno (4, 16, först it2), stanza (4, 15, först it4), soldi (4, 14, först it2), semplice (4, 8, först it2), qualsiasi (4, 7, först it4), dura (4, 6, först it3), esperti (4, 6, först it4), perfino (4, 6, först it3), poche (4, 6, först it4), conosciuto (4, 5, först it3), contro (4, 4, först it2), dappertutto (4, 4, först it1), tiene (4, 4, först it3), trasporti (4, 4, först it4), eppure (3, 12, först it4), ce (3, 7, först it2), mail (3, 7, först it5), tantissimo (3, 7, först it2), decine (3, 6, först it5), esattamente (3, 6, först it4), online (3, 6, först it3)

## Förslag: ord som borde bli kursord eller glosor

Okända ord som förekommer i **flera texter** i samma kurs bör bli **kursord** (words.txt, i kapitlet där texten ligger eller tidigare). Ord som bara finns i **en text** bör bli **glosor** i den texten (`gloss`). Listan tar med ord ur texter under gränsen. Kontrollera varje förslag: en del är böjningsformer som lemmatiseringen missat, namn i början av en mening eller ord som redan finns i en fras.

### de1

- **Kursord** (i flera texter): erdgeschoss (2), nur (2)
- **Glosor** (flera gånger i en text): nachricht (de1-hoe-3), hänschen (de1-r-lied-haenschen)

### de2

- **Kursord** (i flera texter): nur (9), erwachsenen (3), los (3), jacke (2), party (2), kleidung (2), eis (2), fast (2), gar (2), getrunken (2), krank (2), mehr (2), mo (2), nachricht (2), sag (2), sprich (2), steht (2)
- **Glosor** (flera gånger i en text): partenkirchen (de2-r-b7), geschäfte (de2-c-b2-ladenschluss), gleis (de2-hoe-2), mieten (de2-le-2), sportgeschäft (de2-le-2), umsteigen (de2-le-2)

### de3

- **Kursord** (i flera texter): nur (10), zuerst (10), mehr (7), sofort (5), fast (4), kaum (4), krank (4), stimmt (4), verspätung (3), also (3), band (3), davon (3), drittel (3), laut (3), meistens (3), nervös (3), obwohl (3), sogar (3), studieren (3), verdiene (3), warum (3), gleis (2), mauer (2), konzert (2), krankenhaus (2), anmeldung (2), ausruhen (2), damit (2), darüber (2), denken (2), drittens (2), dunkel (2), einige (2), ergebnis (2), fieber (2), gefeiert (2), geige (2), gestresst (2), gilt (2), grenze (2)
- **Glosor** (flera gånger i en text): moderatorin (de3-hoe-4), bäckerei (t3-r-t2), hubschrauber (t3-r-t4), kur (t3-c-kur), praxis (de3-hoe-1), regnet (t3-l-t6a)

### de4

- **Kursord** (i flera texter): nur (27), mehr (14), fast (13), also (9), sogar (8), ziemlich (6), gar (5), angst (5), damit (5), kostenlos (5), übrigens (5), bevor (4), einige (4), geholfen (4), orchester (3), daran (3), dritten (3), gewonnen (3), gilt (3), inzwischen (3), kaum (3), konzentrieren (3), nun (3), nötig (3), obwohl (3), schluss (3), warum (3), anmeldung (2), lehrkraft (2), chefin (2), daraus (2), dazu (2), sowieso (2), studieren (2), ausnahmsweise (2), betreuer (2), betreuerinnen (2), bewerbung (2), blick (2), böse (2)
- **Glosor** (flera gånger i en text): mama (de4-hoe-10), bestimmt (de4-hoe-10), bezahlung (de4-le-10), manche (de4-hoe-12), abschlusskonzert (de4-le-5), aßen (t4-r-lit-bremen), bewegen (de4-hoe-12), bewegung (de4-hoe-12), fußgängerzone (de4-le-9), gebühr (de4-le-5), genehmigung (de4-le-9), kündigung (de4-le-15), lehrkräfte (de4-le-2), mamas (de4-hoe-10), nachtruhe (de4-le-14), papa (de4-hoe-10), piano (de4-le-3), rasen (de4-le-8), regionalexpress (de4-hoe-5), ruhe (de4-le-13), studierende (de4-hoe-2), tanzstudio (de4-le-11), verstärker (de4-le-9), vorkenntnisse (de4-le-11)

### de

- **Kursord** (i flera texter): mehr (23), fast (16), warum (11), also (9), dazu (7), gar (7), gilt (6), wichtigste (6), solche (5), gesprochen (4), nun (4), woran (4), moderatorin (3), sowie (3), beiden (3), hin (3), beide (3), daran (3), davor (3), erstaunlich (3), forschung (3), hinzu (3), los (3), vergangenen (3), überschrift (3), rückmeldung (2), holz (2), agentur (2), anfassen (2), anmeldung (2), atmosphäre (2), begann (2), bruchrechnung (2), damen (2), darin (2), diskussion (2), dritten (2), drittens (2), entschieden (2), experimentieren (2)
- **Glosor** (flera gånger i en text): bewohner (de-le-15), bewohnerinnen (de-le-15), hülle (de-le-8), anspannung (de-le-6), apartment (de-le-1), bekam (s-d2), berner (r-d8), erlenkönig (r-lit-erlkoenig), ersatzteile (de-le-2), hausverwaltung (de-le-15), hochbeeten (de-le-9), kita (de-le-11), musizieren (de-hoe-8), schallplatte (de-le-8), schlief (s-d7), website (de-le-14), wohnheim (de-le-1)

### de6

- **Kursord** (i flera texter): mehr (25), warum (13), also (12), gar (11), fast (11), daran (8), beiden (7), gilt (7), darin (7), kolleginnen (5), bekam (5), bevor (5), dazu (5), profitieren (5), solche (5), entschieden (4), begann (4), darum (4), genannt (4), stammt (4), sowie (3), nutzung (3), beide (3), dessen (3), gezogen (3), greift (3), heraus (3), hinterher (3), ließen (3), schlicht (3), teurer (3), türkei (3), umgekehrt (3), überschrift (3), zauberflöte (2), bundesregierung (2), schriftzeichen (2), zog (2), abstimmen (2), all (2)
- **Glosor** (flera gånger i en text): moderatorin (de6-hoe-9), aufschieben (de6-le-11), lettern (de6-hoe-12), abmeldung (de6-le-15), anwohner (de6-le-13), dezibel (de6-hoe-11), geräusch (de6-hoe-11), heimweg (s-s7), japanisch (de6-le-7), locker (s-s2), niederländisch (de6-le-7), schienen (de6-le-9), schriften (de6-hoe-12), sowjetunion (c-s3-neutralitaet), unmündig (r-s7-kant), violoncello (r-s1-motivation), vorzubereiten (r-s6-probespiel), zurückkehren (de6-hoe-4), zuschreiben (de6-hoe-12)

### de7

- **Kursord** (i flera texter): mehr (11), gilt (3), fast (3), gar (3), musizieren (3), sowie (2), warum (2), befürworter (2), begann (2), bevor (2), daran (2), drittens (2), erkrankung (2), verwaltung (2), zweitens (2)
- **Glosor** (flera gånger i en text): künstlerin (r-s4-konzertvertrag), form (r-s1-studienordnung), höhe (r-s4-konzertvertrag), rednerin (r-s7-rede), schließung (r-s7-rede), untervermietung (de7-le-2), änderungen (r-s4-konzertvertrag)

### fr1

- **Kursord** (i flera texter): alors (4), demande (3), peu (3), répond (3), attention (2), désirez (2), puis (2), shirts (2), étage (2)
- **Glosor** (flera gånger i en text): dialogue (fr1-co-5), crêpes (fr1-ce-3), dame (fr1-s-e6), farine (fr1-ce-3)

### fr2

- **Kursord** (i flera texter): alors (10), abord (6), ensuite (6), déjà (5), veux (4), dois (4), encore (4), enfin (4), gens (4), peut (4), attention (3), gratuit (3), doit (3), faut (3), fois (3), foot (3), puis (3), rester (3), retard (2), triste (2), bar (2), buvez (2), certains (2), fraises (2), lendemain (2), numéro (2), plage (2), pourquoi (2), presque (2), prochaine (2), quelques (2), restez (2), région (2), savoir (2), site (2), surtout (2), tard (2)
- **Glosor** (flera gånger i en text): degrés (fr2-r-d4), atelier (fr2-ce-2), fenêtre (fr2-r-d2), frais (fr2-r-d5), horreur (fr2-s-d7), quatrième (fr2-l-d2)

### fr

- **Kursord** (i flera texter): déjà (6), association (5), chacun (5), demandé (4), prochaine (4), région (3), prochain (3), professionnels (3), attention (3), bénévoles (3), fallait (3), fin (3), lancé (3), lycéens (3), presque (3), site (3), tôt (3), vérifier (3), compris (2), adultes (2), disposition (2), pratique (2), suffit (2), acoustiques (2), adhésion (2), annuelle (2), appris (2), atelier (2), ateliers (2), autour (2), connaissais (2), créneau (2), demander (2), devenir (2), déranger (2), encore (2), environnement (2), envoie (2), fiche (2), fonctionne (2)
- **Glosor** (flera gånger i en text): réparer (fr-co-6), maître (fr-ce-9), violoncelle (fr-co-3), accordeur (fr-co-9), antivol (fr-co-4), cotisation (fr-ce-4), dons (fr-co-7), entraînements (fr-ce-4), entreprises (fr-ce-2), gymnase (fr-ce-4), habitudes (fr-ce-3), hébergement (fr-ce-1), membres (fr-ce-5), médiathèque (fr-co-7), objet (fr-co-6), objets (fr-co-6), parking (fr-ce-4), potager (fr-ce-6), récoltes (fr-ce-6), trimestre (fr-ce-5), tuteurs (fr-ce-8), visiteurs (fr-co-6), électriques (fr-co-6)

### frs4

- **Kursord** (i flera texter): alors (8), déjà (6), ensuite (5), pourquoi (5), encore (4), créé (3), autour (3), chacun (3), pourtant (3), suffit (3), voyait (3), objets (2), appris (2), dame (2), mail (2), possible (2), artistes (2), attention (2), devient (2), faudrait (2), festival (2), fr (2), identité (2), intérieur (2), milliers (2), nombre (2), nombreux (2), nourriture (2), permet (2), pleuvait (2), pose (2), protège (2), remarqué (2), récent (2), savais (2), savez (2), tôt (2)
- **Glosor** (flera gånger i en text): charges (frs4-ce-1), directeur (s-h6), cabane (s-h5), devenir (r-h1-cesure), envoie (l-h1-2), laïcité (c-h3), perceuse (frs4-ce-5), pompiers (s-h4), télévision (r-h6-pub)

### frs5

- **Kursord** (i flera texter): encore (7), déjà (6), pourquoi (4), faudrait (3), reçoivent (2), utilisation (2), vêtement (2), ainsi (2), apporter (2), appris (2), ateliers (2), cesse (2), confirme (2), maximum (2), milliers (2), presque (2), promis (2), préparation (2), ri (2), sinon (2), tôt (2)
- **Glosor** (flera gånger i en text): db (r-v4-manuel), shirt (r-v8-vulga), supprimer (frs5-ce-3)

### fr4

- **Kursord** (i flera texter): encore (13), déjà (10), presque (10), tôt (8), nombreux (6), chacun (6), prochaine (6), devient (4), croit (4), fallait (4), longtemps (4), appris (4), dizaines (4), plutôt (3), possible (3), existe (3), nombreuses (3), pose (3), savent (3), souvient (3), tellement (3), transformé (3), vide (3), atelier (2), lors (2), milliers (2), précieux (2), reçoivent (2), éducation (2), apporté (2), ateliers (2), autour (2), boit (2), combats (2), comparer (2), connaissent (2), dame (2), danger (2), dessous (2), devait (2)
- **Glosor** (flera gånger i en text): participation (fr4-ce-1), badge (fr4-ce-5), bat (r-q7-trac), garage (r-q3-reportage), immense (r-q6-hugo), intérieur (r-q3-reportage), minimum (r-q2-debat), prof (r-q4-scene), savons (r-q3-conf), tram (fr4-ce-5)

### fru

- **Kursord** (i flera texter): encore (16), déjà (10), plutôt (9), presque (9), longtemps (8), milliers (8), suffit (7), devenu (7), tôt (7), notamment (5), appris (5), cesse (5), existent (5), applique (4), chacun (4), concrètement (4), devenir (4), devenue (4), existe (4), fallait (4), manière (4), régulièrement (4), sinon (4), devient (3), apparaît (3), aube (3), construite (3), dizaines (3), faudrait (3), jazz (3), mène (3), précisément (3), refaire (3), savent (3), sert (3), transformé (3), utile (3), rap (2), atelier (2), affirme (2)
- **Glosor** (flera gånger i en text): quotas (fru-co-2), altiste (fru-co-4), armée (r-u2-dreyfus), citadins (fru-ce-3), délivrent (fru-ce-1), fabricants (fru-co-5), kilomètres (r-u1-mosaique), pluriactivité (fru-ce-6), protège (fru-ce-2)

### it1

- **Kursord** (i flera texter): chiede (4), qui (2), adesso (2), arrivano (2), risponde (2)
- **Glosor** (flera gånger i en text): dan (it1-r-lit-framartino), din (it1-r-lit-framartino), don (it1-r-lit-framartino), gruppo (it1-s-i3)

### it2

- **Kursord** (i flera texter): detto (4), già (4), trovato (4), li (3), subito (3), adesso (3), mare (3), quasi (3), quindi (3), riso (3), insieme (2), alcuni (2), lì (2), nessuno (2), qualcosa (2), qui (2), scrivetemi (2), siccome (2), soldi (2), zero (2)
- **Glosor** (flera gånger i en text): naso (it2-r-lit-pinocchio), avversari (it2-s-j2), cerimonia (it2-s-j7)

### it3

- **Kursord** (i flera texter): adesso (7), soprattutto (7), troppo (4), qualcuno (4), quasi (4), qui (3), alcuni (3), esiste (3), li (3), lì (3), quindi (3), tantissimo (3), senza (2), incredibile (2), intorno (2), nessuno (2), nord (2), pochi (2), poco (2), professoressa (2), semplice (2), strano (2), subito (2)
- **Glosor** (flera gånger i en text): anatra (it3-s-k5), guasto (it3-s-k3), sud (it3-c-k1-regioni)

### it4

- **Kursord** (i flera texter): soprattutto (8), nessuno (8), quasi (7), qui (7), vinto (6), adesso (5), alcuni (5), ce (5), qualcuno (4), pochi (4), poco (4), qualcosa (4), troppo (4), li (3), alcune (3), gratuito (3), lì (3), migliaia (3), qualsiasi (3), scoperto (3), soldi (3), stanza (2), allenatrice (2), dura (2), femminile (2), amano (2), benissimo (2), bici (2), cause (2), disperata (2), fondata (2), funziona (2), gliel (2), gliela (2), glielo (2), lenzuola (2), maglia (2), meteo (2), persona (2), professionisti (2)
- **Glosor** (flera gånger i en text): bisnonno (it4-s-c8), chiedetevi (it4-r-c1), corridori (it4-c-c7-giro), laboratorio (it4-r-c3), veneziani (it4-r-c3)

### it5

- **Kursord** (i flera texter): alcuni (7), soprattutto (7), quasi (5), adesso (5), alcune (5), affinché (4), poco (4), ognuno (3), online (3), qui (3), semplice (2), arance (2), benché (2), brutte (2), complimenti (2), costruire (2), esattamente (2), esperti (2), li (2), mail (2), nemmeno (2), nessuno (2), poche (2), rende (2), sentirmi (2), stabili (2), subito (2), sufficiente (2), umanità (2), vendere (2), vendiamo (2), zucche (2)
- **Glosor** (flera gånger i en text): –

### it6

- **Kursord** (i flera texter): alcuni (10), qualcuno (9), quasi (7), pochi (6), soprattutto (6), poco (6), soldi (5), eppure (5), migliaia (5), troppo (5), alcune (4), visitatori (4), decine (4), li (4), qualcosa (4), qui (4), centinaia (3), cominciò (3), dovette (3), mail (3), moltissimo (3), subito (3), soltanto (2), agire (2), azione (2), chiamò (2), conosciuto (2), contengono (2), continuamente (2), costruita (2), direttrice (2), disagio (2), documento (2), esiste (2), esisteva (2), esperti (2), finché (2), gran (2), indica (2), limiti (2)
- **Glosor** (flera gånger i en text): agenti (it6-l-h3-2), borbonico (it6-r-h3-1), costruire (it6-l-h6-1), palermitani (it6-l-h3-2), portafoglio (it6-s-h7), situazione (it6-r-h7-2), terreni (it6-l-h3-2), ucciso (it6-l-h3-2), vendere (it6-r-h8-1), veneziani (it6-r-h6-1), vigna (it6-as-2)

### it7

- **Kursord** (i flera texter): alcuni (6), esiste (6), quasi (5), pochi (5), soprattutto (5), qualcuno (4), ricevette (4), eppure (3), qui (3), divenne (3), subito (3), stanza (2), alcune (2), trasferì (2), ama (2), arrese (2), conquistò (2), credibile (2), creò (2), debolezza (2), denaro (2), dettaglio (2), fondamentale (2), nazione (2), ognuno (2), ottengono (2), particolare (2), poche (2), qualcosa (2), scoprì (2), spettacolari (2), tipo (2), troppo (2)
- **Glosor** (flera gånger i en text): conduttrice (it7-r-t3), sospeso (it7-ex-asc-3), alba (it7-r-t8-2), convinse (it7-r-t2), cosiddetto (it7-l-t1), dedicarsi (it7-r-t2), fase (it7-r-t8), intorno (it7-c-t2-galileo), iscritta (it7-r-t3)

## Texter under gränsen, per kurs

Sorterade med den lägsta täckningen först. Okända ord med antal förekomster i texten.

### de1: 8 av 34 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de1-hoe-2` Durchsagen | prov (hör) | 54 | 90,7 % | erdgeschoss ×2, achtung, gemüse, nur |
| `de1-r-lied-haenschen` Lied: Hänschen klein | lästext (läs) | 58 | 91,4 % | hänschen ×2, mama, nun, nur |
| `de1-hoe-3` Nachrichten am Telefon | prov (hör) | 58 | 93,1 % | nachricht ×3, regnet |
| `de1-le-3` Schilder | prov (läs) | 46 | 93,5 % | erdgeschoss, kasse, leine |
| `de1-le-1` Eine E-Mail von Sara | prov (läs) | 62 | 93,5 % | party, saft, genug, grüße |
| `de1-le-2` Anzeigen | prov (läs) | 79 | 93,7 % | offen, verkaufen, reparatur, stadtbibliothek, erwachsene |
| `de1-r-e1` Mein Profil | lästext (läs) | 85 | 97,6 % | mail, ch |
| `de1-r-e6` Freizeit in Hamburg: Was ist los am Wochenende? | lästext (läs) | 96 | 97,9 % | tickets, norwegen |

### de2: 25 av 40 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de2-le-2` Im Internet | prov (läs) | 97 | 83,5 % | sportgeschäft ×2, mieten ×2, umsteigen ×2, mo, fr, notdienst, apotheke, secondhand |
| `de2-le-3` Schilder und Zettel | prov (läs) | 70 | 87,1 % | arztpraxis, mo, do, nur, erwachsenen, umkleidekabinen, maximal, teile |
| `de2-s-b4` Pech beim Handball | berättelse (läs) | 73 | 89,0 % | handballtraining, fuß, mehr, laufen, trainerin, sofa, schlimm, nachrichten |
| `de2-hoe-2` Durchsagen | prov (hör) | 76 | 89,5 % | gleis ×2, angebot, gilt, nur, achtung, fahrgäste, schließt |
| `de2-le-1` Eine E-Mail von Ben | prov (läs) | 75 | 90,7 % | party ×2, krank, fieber, backt, grillen, geschenk |
| `de2-s-b6` Silvester in Berlin | berättelse (läs) | 69 | 91,3 % | silvester, gefeiert, überall, feuerwerk, erwachsenen, getrunken |
| `de2-l-b5` Streit mit der besten Freundin | hörtext (hör) | 104 | 92,3 % | hey, los, mehr, bestimmt, nachricht, nur, sprich, sag |
| `de2-s-b2` Die neue Jacke | berättelse (läs) | 81 | 92,6 % | jacke ×3, besetzt, eng, steht |
| `de2-s-b3` Der erste Schnee | berättelse (läs) | 75 | 93,3 % | geschneit, angezogen, geschienen, gebaut, getrunken |
| `de2-c-b2-ladenschluss` Sonntags ist alles zu | kultur (läs) | 92 | 93,5 % | geschäfte ×3, steht, kleidergeschäfte, nur |
| `de2-hoe-3` Nachrichten am Telefon | prov (hör) | 111 | 93,7 % | fußballtraining, praxis, termin, mama, jacke, vergessen, los |
| `de2-l-b6` Einladung zur Geburtstagsparty | hörtext (hör) | 98 | 93,9 % | party ×2, glaube, warum, regnet, laune |
| `de2-l-b2b` Interview: Wo kaufst du deine Kleidung? | hörtext (hör) | 103 | 94,2 % | kleidung ×2, schuhe, trägst, sachen, nur |
| `de2-l-b1b` Eine Nachricht auf der Mailbox | hörtext (hör) | 95 | 94,7 % | fangen, also, brettspiel, dunkel, nachricht |
| `de2-s-b7` Camping in Österreich | berättelse (läs) | 71 | 95,8 % | geschwommen, geregnet, gar |
| `de2-r-b7` Fahrplan: Mit dem Zug in die Berge | lästext (läs) | 121 | 95,9 % | partenkirchen ×4, hin |
| `de2-r-b5` Im Forum: Hilfe, meine beste Freundin hat einen Freund! | lästext (läs) | 129 | 96,1 % | sprich, sag, gar, nur, eis |
| `de2-s-b5` Die neue Mitschülerin | berättelse (läs) | 81 | 96,3 % | schüchtern, eis, geschenkt |
| `de2-s-b1` Ein verrückter Samstag | berättelse (läs) | 86 | 96,5 % | aufgewacht, frei, nur |
| `de2-r-b2` Sommerschlussverkauf im Kaufhaus Weber | lästext (läs) | 116 | 96,6 % | nur ×4 |
| `de2-c-b4-krankenkasse` Zum Arzt in Deutschland | kultur (läs) | 90 | 96,7 % | meistens, zuerst, krank |
| `de2-c-b5-duzen` Du oder Sie? | kultur (läs) | 100 | 97,0 % | anderen, fast, reformen |
| `de2-c-b6-weihnachtsmarkt` Auf dem Weihnachtsmarkt | kultur (läs) | 79 | 97,5 % | fast, erwachsenen |
| `de2-r-b6` Eine Einladung zum Laternenumzug | lästext (läs) | 125 | 97,6 % | los, ziehen, freuen |
| `de2-c-b6-karneval` Karneval, Fasching, Fastnacht | kultur (läs) | 90 | 97,8 % | feiert, fest |

### de3: 42 av 48 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `t3-c-bahn` Pünktlich wie die Bahn? | kultur (läs) | 87 | 83,9 % | denken, stimmt, nur, drittel, fernzüge, gilt, sogar, verspätung |
| `t3-c-pfand` Pfand und Mülltrennung | kultur (läs) | 79 | 84,8 % | trennt, müll, genau, plastikflaschen, pfand, manche, sammeln, pfandflaschen |
| `t3-s-t4` Krank vor dem Konzert | berättelse (läs) | 73 | 86,3 % | schulkonzert, krank, fieber, halsschmerzen, kaum, unmöglich, sofort, ausruhen |
| `t3-l-t5b` Müll trennen in der WG | hörtext (hör) | 132 | 86,4 % | sag, warum, pizzaschachtel, papiermüll, fettig, restmüll, nur, trennen |
| `t3-s-t6` Mein erstes Konzert | berättelse (läs) | 83 | 86,7 % | konzert ×2, lieblingsband, halle, band, bühne, geschrien, gesungen, kaum |
| `de3-le-2` Informationstafel: Stadtbibliothek | prov (läs) | 38 | 86,8 % | erdgeschoss, anmeldung, zeitschriften, gesundheit, jugendbibliothek |
| `t3-r-t5` Der Schwarzwald (Sachtext) | lästext (läs) | 162 | 87,0 % | bundesland, württemberg, mittelgebirge, dunklen, römer, dunkel, nannten, höchste |
| `t3-l-t1b` Durchsage und Sprachnachricht | hörtext (hör) | 132 | 87,1 % | gleis ×2, verspätung ×2, grund, störung, gültig, mama, stehe, also |
| `t3-r-t4` Das Unglück am Skilift (Erzählung) | lästext (läs) | 190 | 87,4 % | hubschrauber ×2, krankenhaus ×2, dritten, frischer, unbedingt, obwohl, steil, kurve |
| `t3-s-t8` Die Nacht, als die Mauer fiel | berättelse (läs) | 79 | 88,6 % | ost, damals, obwohl, grenze, sofort, mauer, gelaufen, gefeiert |
| `t3-l-t6a` Ins Konzert oder ins Museum? | hörtext (hör) | 123 | 88,6 % | regnet ×2, warum, open, konzert, band, klingt, wetterbericht, stimmt |
| `t3-c-ausbildung` Die duale Ausbildung | kultur (läs) | 94 | 89,4 % | nennt, betrieb, berufsschule, meistens, ausbildungsberufe, mechatronikerin, friseurin, sogar |
| `de3-le-4` Anzeigen: Freizeit und Kurse | prov (läs) | 105 | 89,5 % | jugendzentrum, reparierst, kostenlos, gitarrenkurs, termine, kreuz, bescheinigung, tandem |
| `t3-s-t2` Ein Tag im Krankenhaus | berättelse (läs) | 79 | 89,9 % | praktikum, krankenhaus, nervös, patienten, krankenpflegerin, zuerst, laut, stolz |
| `t3-s-t5` Das Gewitter in den Bergen | berättelse (läs) | 71 | 90,1 % | alpen, plötzlich, dunkel, felsen, gewitter, zuerst, wetterbericht |
| `t3-l-t4b` Tipps gegen Stress | hörtext (hör) | 115 | 90,4 % | prüfungen, gestresst, psychologin, konzentrieren, zweitens, bewegen, luft, drittens |
| `t3-r-t3` Jugendliche und Nachrichten (Nachricht) | lästext (läs) | 157 | 90,4 % | nur ×2, kaum, studie, informieren, ergebnis, soziale, regelmäßig, drittel |
| `de3-hoe-1` Fünf kurze Texte | prov (hör) | 127 | 90,6 % | gleis ×2, praxis ×2, beachten, änderung, sonnig, dringenden, preis, angebot |
| `t3-l-t4a` Beim Arzt | hörtext (hör) | 128 | 90,6 % | halsschmerzen, husten, fieber, fast, kopfschmerzen, hals, erkältung, grippe |
| `t3-r-t6` Wolfgang Amadeus Mozart (Porträt) | lästext (läs) | 161 | 90,7 % | komponisten, klavier, geige, königen, kaisern, kutschen, unbequem, krank |
| `t3-l-t6b` Eine Musikerin erzählt | hörtext (hör) | 128 | 91,4 % | sendung, geigerin, studiert, geige, üben, jugendorchester, schönste, aufnahmeprüfung |
| `t3-l-t8b` Eine Stadtführung in Berlin | hörtext (hör) | 128 | 91,4 % | mauer ×3, stehen, ost, grenze, gefeiert, mauerfall, künstler, bemalt |
| `t3-c-kur` Zur Kur fahren | kultur (läs) | 82 | 91,5 % | kur ×2, krank, gestresst, erde, spazieren, kaiserin |
| `t3-s-t7` Die Prüfung | berättelse (läs) | 71 | 91,5 % | prüfung, nervös, kaum, zuerst, zukunftspläne, studieren |
| `t3-l-t7a` Was machst du nach dem Abi? | hörtext (hör) | 120 | 91,7 % | sofort, studiere, medizin, zuerst, südamerika, mechatroniker, firma, studieren |
| `de3-hoe-4` Radiointerview: Ein Jahr ohne Auto | prov (hör) | 100 | 92,0 % | moderatorin ×3, warum, kaputt, nur, fuß, leihen |
| `t3-r-t7` Ein Jahr in Kanada (Erzählung) | lästext (läs) | 176 | 92,0 % | davon, zuerst, dagegen, heimweh, clubs, schulband, witze, sogar |
| `de3-hoe-2` Gespräch: Was macht Jonas in den Ferien? | prov (hör) | 63 | 92,1 % | angeln, zahnarzt, verdiene, band, party |
| `t3-l-t3a` Zu viel am Handy? | hörtext (hör) | 127 | 92,1 % | nur ×2, party, meiste, bio, vokabeln, soziale, stimmt, versprochen |
| `t3-c-datenschutz` Datenschutz ist wichtig | kultur (läs) | 93 | 92,5 % | vorsichtig, manche, nazizeit, staat, gesammelt, strenge, regeln |
| `t3-l-t3b` Nachrichten aus der Schule | hörtext (hör) | 108 | 92,6 % | lehrkraft, zweitens, fake, news, erklären, erkennt, drittens, darüber |
| `t3-r-t2` Mein erster Arbeitstag (Forum) | lästext (läs) | 180 | 93,3 % | bäckerei ×2, nur ×2, davon, innenstadt, zuerst, packen, schwieriger, peinlich |
| `t3-c-kaffeehaus` Das Wiener Kaffeehaus | kultur (läs) | 75 | 93,3 % | kulturerbe, nur, schriftsteller, diskutiert, milchschaum |
| `t3-c-schule` Schule in Deutschland | kultur (läs) | 90 | 93,3 % | zuerst, schulform, wählen, studieren, noten, ungenügend |
| `de3-le-1` Zeitungstext: Schüler bauen ein Solarboot | prov (läs) | 106 | 93,4 % | solarboot, gymnasiums, nur, physiklehrer, jugendlichen, solarzellen, wettbewerb |
| `t3-c-dach` Deutsch in vier Ländern | kultur (läs) | 78 | 93,6 % | südtirol, unterschiede, nennt, plurizentrisch, mehrere |
| `t3-s-t3` Das verlorene Handy | berättelse (läs) | 80 | 93,8 % | sofort ×2, verloren, verzweifelt, geschenkt |
| `t3-l-t2b` Radio: Jobs für Jugendliche | hörtext (hör) | 117 | 94,0 % | verdienen, höchstens, mehr, meistens, regale, kasse, verdient |
| `t3-r-t1` Mit dem Zug durch die Alpen (Reisebericht) | lästext (läs) | 206 | 94,2 % | fast ×3, damit, jugendherberge, schönste, verspätung, anschluss, verpasst, zuerst |
| `t3-r-t8` Die Schweiz: ein Land, vier Sprachen (Sachtext) | lästext (läs) | 158 | 94,3 % | fast, hauptstadt, rätoromanisch, alltag, berndeutsch, meistens, einige, ss |
| `t3-l-t2a` Mein Schülerpraktikum | hörtext (hör) | 123 | 94,3 % | ziemlich, käfige, füttern, untersuchungen, gebrochenen, mehr, chefin |
| `t3-s-t1` Die verpasste Fähre | berättelse (läs) | 83 | 97,6 % | hafen, zuerst |

### de4: 40 av 70 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de4-le-5` Teilnahmebedingungen: Sommercamp des Jugendorchesters | prov (läs) | 157 | 82,8 % | anmeldung ×3, gebühr ×2, nur ×2, abschlusskonzert ×2, teilnahmebedingungen, sommercamp, landesjugendorchesters, erfolgt |
| `de4-le-9` Zwei Zeitungsartikel: Fahrradwerkstatt und Regeln für Straßenmusik | prov (läs) | 436 | 89,4 % | nur ×7, fußgängerzone ×2, genehmigung ×2, verstärker ×2, quietschende, jugendzentrum, werkstattleiter, ersatzteile |
| `de4-hoe-2` Führung: Tag der offenen Tür an der Musikhochschule | prov (hör) | 218 | 89,4 % | studierende ×2, studiere, semester, eingangshalle, gebäude, studierendensekretariat, bewerbung, frist |
| `de4-le-8` Zwei Zeitungsartikel: Ein Schulgarten und eine Lesenacht | prov (läs) | 441 | 90,5 % | rasen ×2, nur ×2, daraus ×2, kräuter, ernährung, gesprochen, dreizehnjährige, schulleitung |
| `de4-le-15` Kursbedingungen: Musikschule Klangraum | prov (läs) | 256 | 90,6 % | lehrkraft ×3, anmeldung ×2, kündigung ×2, unterrichtsbedingungen, bevor, kostenlose, gültig, anmeldeformular |
| `de4-le-2` Zwei Zeitungsartikel: Musikschulen und Instrumente aus Müll | prov (läs) | 331 | 90,6 % | orchester ×3, lehrkräfte ×2, nur ×2, angaben, wartelisten, tuba, hauptgrund, stundenweise |
| `de4-hoe-12` Radiodiskussion: Mehr Sport in der Schule? | prov (hör) | 566 | 91,3 % | mehr ×4, manche ×3, bewegen ×2, bewegung ×2, warum, praxis, sportvereine, verein |
| `de4-le-10` Anzeigen: Jobs für die Ferien | prov (läs) | 347 | 91,4 % | bezahlung ×3, erfahrung, nötig, bewerbung, anzahl, voraussetzung, gültiges, rettungsschwimmabzeichen |
| `de4-le-6` Jonas' Blog: Meine erste Woche im Musikgeschäft | prov (läs) | 262 | 92,4 % | nur ×3, firmen, beworben, entschieden, entfernt, ziemlich, enttäuscht, beraten |
| `t4-s-t3` Papas Geburtstag im Restaurant | berättelse (läs) | 127 | 92,9 % | unbedingt, meeresfrüchten, ziemlich, tomatensoße, umgeworfen, papas, lieblingsdessert, obwohl |
| `de4-hoe-5` Fünf kurze Texte: Alltag in der Stadt | prov (hör) | 339 | 92,9 % | regionalexpress ×2, vorne, abholschein, grund, störung, gilt, ausnahmsweise, nun |
| `de4-hoe-10` Gespräch: Ein Geschenk für Mama | prov (hör) | 435 | 93,1 % | mama ×7, nur ×3, bestimmt ×3, mamas ×2, papa ×2, sowieso ×2, dazu ×2, mindestens |
| `de4-le-3` Anzeigen: Musik in der Freizeit | prov (läs) | 238 | 93,3 % | piano ×2, jugendzentrum, m², schallisoliert, verstärkern, stundenweise, zustand, nur |
| `t4-s-t2` Mein Umzug in die WG | berättelse (läs) | 135 | 93,3 % | gezogen, studieren, geholfen, hochgetragen, begrüßung, sogar, geschirr, obwohl |
| `de4-hoe-3` Gespräch: Pläne für den Sommer | prov (hör) | 285 | 93,3 % | nur ×4, chefin ×2, hey, sogar, unglaublich, blick, fast, davor |
| `de4-le-12` Leserbriefe: Handys im Unterricht? | prov (läs) | 361 | 93,4 % | mehr ×2, nur ×2, manchen, damit, lebendiger, sinnvoll, umzugehen, gar |
| `de4-le-7` E-Mail von Emma: Mein Austauschjahr in Österreich | prov (läs) | 258 | 93,4 % | entschuldige, komisch, aufzustehen, inzwischen, daran, nur, ziemlich, kaum |
| `de4-le-4` Leserbriefe: Ein Instrument für jedes Kind? | prov (läs) | 307 | 93,5 % | nur ×2, verpflichtend, vorgeschlagen, überhaupt, übt, ziel, mehr, freiwillig |
| `de4-le-1` Leas Blog: Der Wettbewerb in Dresden | prov (läs) | 247 | 93,5 % | orchester ×3, fast ×2, jugendorchester, angst, verpasst, gerannt, böse, überraschung |
| `de4-hoe-8` Führung: Im Konzerthaus am Fluss | prov (hör) | 371 | 93,5 % | nur ×3, ziemlich ×2, orchester ×2, damen, eröffnet, stolz, architektin, rund |
| `t4-s-t6` Mein erstes Solo | berättelse (läs) | 125 | 93,6 % | solo, geübt, geholfen, schiefgegangen, schreckliches, sogar, obwohl, schönste |
| `t4-r-lit-bremen` Die Bremer Stadtmusikanten (fritt efter bröderna Grimm, 1819) | lästext (läs) | 256 | 94,1 % | mehr ×2, aßen ×2, dunklen, tranken, sprang, flog, bekamen, angst |
| `de4-le-11` Anzeigen: Kurse für die Freizeit | prov (läs) | 332 | 94,3 % | vorkenntnisse ×2, tanzstudio ×2, nur ×2, höchstens, jeweils, ideal, vorbereitung, einzelanmeldungen |
| `de4-hoe-1` Fünf kurze Texte | prov (hör) | 287 | 94,4 % | denk, daran, mitzubringen, ersatzbusse, hauptausgang, messehalle, gilt, veranstalter |
| `de4-le-14` Hausordnung: Jugendherberge am Tannensee | prov (läs) | 273 | 94,5 % | nachtruhe ×2, bezugsfertig, beziehen, mahlzeiten, speisesaal, lunchpaket, speisen, nur |
| `t4-r-lit-busch` Max und Moritz, fjärde busstrecket (Wilhelm Busch, 1865) – utdrag | lästext (läs) | 111 | 94,6 % | also, abc, beiden, darum, nun, müh |
| `de4-le-13` Leserbriefe: Einkaufen am Sonntag? | prov (läs) | 394 | 94,7 % | nur ×3, ruhe ×2, mehr ×2, einige, einzige, kaum, schichtdienst, schaffe |
| `t4-r-t6` Ein Tag bei „Jugend musiziert“ | lästext (läs) | 302 | 94,7 % | tragen, regionalwettbewerb, sogar, bundeswettbewerb, fünfzehnjährige, schreckliches, ziemlich, geholfen |
| `t4-s-t5` Drei Wochen in Hamburg | berättelse (läs) | 130 | 95,4 % | sogar ×2, fast, mehr, dritten, geflogen |
| `t4-r-t5` Meine Bewerbung an der Musikhochschule | lästext (läs) | 317 | 95,6 % | studieren ×2, nur ×2, also, geflogen, kaum, schluss, warum, bestimmten |
| `t4-s-t7` Pech beim Fußball | berättelse (läs) | 115 | 95,7 % | furchtbar, fast, gebrochen, übrigens, gewonnen |
| `t4-r-t3` Wie ich sparen gelernt habe | lästext (läs) | 271 | 96,3 % | fast ×2, gar ×2, nur ×2, mehr, also, schock, übe |
| `t4-r-t4` Mit dem Zug durch Österreich | lästext (läs) | 296 | 97,0 % | beide, dritten, dabei, völlig, geholfen, staatsoper, nur, ziemlich |
| `t4-c-vereine` Mitglied im Verein | kultur (läs) | 107 | 97,2 % | mehr ×2, fast |
| `t4-r-t7` Krank im Ausland | lästext (läs) | 268 | 97,4 % | dritten, fast, damit, nur, sogar, hab, angst |
| `t4-s-t1` Ein chaotischer Montag | berättelse (läs) | 115 | 97,4 % | nur, böse, bevor |
| `t4-r-t8` Weihnachten bei uns | lästext (läs) | 270 | 97,4 % | also, mehr, dahinter, darin, wichtigste, übrigens, for |
| `t4-c-weihnachtsmarkt` Auf dem Weihnachtsmarkt | kultur (läs) | 120 | 97,5 % | fast, also, christkindlmarkt |
| `t4-s-t8` Die Überraschungsparty | berättelse (läs) | 121 | 97,5 % | überraschung, freude, schönste |
| `t4-c-deutschlandticket` Mit einem Ticket durch ganz Deutschland | kultur (läs) | 131 | 97,7 % | damit, nur, also |

### de: 42 av 81 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de-le-15` Hausordnung eines Studentenwohnheims | prov (läs) | 245 | 85,7 % | bewohnerinnen ×4, bewohner ×4, gilt ×2, sowie ×2, hausverwaltung ×2, studentenwohnheims, überschrift, geltungsbereich |
| `de-le-2` Reparieren statt wegwerfen | prov (läs) | 231 | 90,0 % | ersatzteile ×2, gemeindezentrum, toastern, anpacken, repair, fast, größeren, stammt |
| `de-le-8` Die Rückkehr der Schallplatte | prov (läs) | 298 | 90,9 % | hülle ×3, schallplatte ×2, betritt, durchdrängeln, inhaber, galt, auslaufmodell, verschwanden |
| `de-le-14` Teilnahmebedingungen eines Musikwettbewerbs | prov (läs) | 245 | 91,0 % | sowie ×2, website ×2, überschrift, solistinnen, formular, beizufügen, unvollständige, absenden |
| `de-le-9` Gemüse vom Parkplatz: Gemeinschaftsgärten in der Stadt | prov (läs) | 309 | 91,3 % | hochbeeten ×2, verwilderter, hölzernen, bewirtschaftet, gärtnerische, vergangenen, brachflächen, parzelle |
| `r-lit-rilke` Herbsttag (Rainer Maria Rilke, 1902) | lästext (läs) | 87 | 92,0 % | hin ×2, leg, los, gib, mehr, her |
| `de-hoe-11` Vortrag: Was passiert im Gehirn, wenn wir Musik hören? | prov (hör) | 549 | 92,3 % | also ×4, fast ×2, warum ×2, mehr ×2, damen, forschung, neurowissenschaftlerin, nirgendwo |
| `de-le-3` Freitags bleibt das Büro zu | prov (läs) | 379 | 92,6 % | mittelständisches, beschloss, hielten, finanziellen, geschäftsführerin, vergeblich, abheben, verpflichtet |
| `de-le-10` Gemeinsam singen, gemeinsam atmen | prov (läs) | 488 | 92,8 % | nordhessen, halbkreis, schütteln, chorleiterin, guttut, jeher, phänomen, forschende |
| `de-hoe-8` Interview: Wenn Musik wehtut | prov (hör) | 592 | 92,9 % | moderatorin ×8, gar ×3, musizieren ×2, warum ×2, mehr ×2, wichtigste ×2, spezialisiert, gilt |
| `de-le-5` Übungsraumordnung einer Musikhochschule | prov (läs) | 183 | 93,4 % | überschrift, sowie, genehmigung, studiensekretariats, portal, frühestens, voraus, buchung |
| `s-d2` Mein erstes Vorstellungsgespräch | berättelse (läs) | 169 | 93,5 % | bekam ×2, bewarb, lud, übte, ankam, chefin, bot, warum |
| `de-hoe-12` Vortrag: Lesen auf Papier oder am Bildschirm? | prov (hör) | 554 | 93,7 % | also ×3, dazu ×2, einzusetzen, gestritten, darin, forschung, vorweg, gegner |
| `de-hoe-7` Interview: Beruf Klavierbauerin | prov (hör) | 713 | 93,7 % | moderatorin ×9, also ×4, mehr ×3, klavierbaumeisterin, gar, dazu, umwege, infrage |
| `s-d5` Kampf um das Jugendzentrum | berättelse (läs) | 145 | 93,8 % | mehr ×2, schock, beschlossen, unterschriften, also, lokalzeitung, lud, geschwiegen |
| `de-le-13` Hunde am Arbeitsplatz – gute Idee? | prov (läs) | 422 | 93,8 % | also ×2, mehr ×2, grafikdesignerin, agentur, atmosphäre, abgabe, kraule, abteilungsleiter |
| `de-le-6` Lampenfieber – wie gehen Sie damit um? | prov (läs) | 550 | 94,2 % | mehr ×5, anspannung ×2, unzählige, verschwunden, zitterten, herausbekam, aufregung, geholfen |
| `de-hoe-3` Radiodiskussion: Soziale Medien erst ab 16? | prov (hör) | 452 | 94,5 % | moderatorin ×5, warum ×2, medienpädagoge, landesschülervertretung, dranbleibt, jüngere, wehren, umgehen |
| `de-hoe-4` Vortrag: Schlafen, um zu lernen | prov (hör) | 522 | 94,6 % | mehr ×3, damen, psychologin, warum, verarbeitet, sortiert, stapel, liste |
| `de-le-4` Ein Pflichtjahr für alle? | prov (läs) | 376 | 94,7 % | mehr ×2, pflegeheim, wichtigste, motiviert, entschieden, gezwungen, darunter, zivildienst |
| `de-le-11` Mit mehreren Sprachen groß werden | prov (läs) | 455 | 94,7 % | kita ×2, mehr ×2, solche ×2, sechsjährige, brocken, mischt, gezogen, beunruhigt |
| `de-hoe-9` Radiodiskussion: Schule ohne Noten? | prov (hör) | 588 | 94,9 % | mehr ×3, rückmeldung ×3, warum ×2, dazu ×2, diskussionssendung, experimentieren, leiter, schülersprecherin |
| `r-d1-2` Erzählung (utdrag): Der Koffer | lästext (läs) | 336 | 94,9 % | holz ×2, fast, begann, nannte, gesprochen, wirfst, beide, lachend |
| `de-le-1` Wohnen im Studium | prov (läs) | 402 | 95,0 % | wohnheim ×2, apartment ×2, studentenwohnheim, schallgedämmten, meiste, irgendwer, knüpft, gezogen |
| `s-d7` Zu viel Stress | berättelse (läs) | 162 | 95,1 % | schlief ×2, hing, aß, hinsetzen, mehr, schwerfiel, hielt |
| `de-le-7` Urlaub mit gutem Gewissen? | prov (läs) | 541 | 95,2 % | anzukommen, mehr, voraus, los, steigungen, sechzig, schönste, vollbepackten |
| `c-d4-energiewende` Die Energiewende | kultur (läs) | 109 | 95,4 % | mehr ×2, hin, wichtigste, hohe |
| `r-d3` Erst denken, dann teilen | lästext (läs) | 231 | 96,1 % | of, also, autor, zweitens, drittens, presse, agentur, wichtigste |
| `de-le-12` Sollen Hausaufgaben abgeschafft werden? | prov (läs) | 428 | 96,3 % | fast ×2, mehr, bruchrechnung, verdorben, bildungsforscherin, greift, mechanisch, rückmeldung |
| `s-d4` Eine Woche ohne Plastik | berättelse (läs) | 164 | 96,3 % | verpackt, dritten, vergaß, wogen, fast, weggeworfen |
| `r-lit-erlkoenig` Erlkönig (Johann Wolfgang von Goethe, 1782) | lästext (läs) | 225 | 96,4 % | erlenkönig ×2, wohl, geh, gar, feiner, seh, not |
| `r-d6` Rezension: „Tschick“ von Wolfgang Herrndorf | lästext (läs) | 283 | 96,5 % | beiden ×2, vierzehnjährigen, villa, los, walachei, ungewöhnliche, dazugehören, zueinander |
| `c-d6-grimm` Es war einmal: die Brüder Grimm | kultur (läs) | 121 | 96,7 % | beiden, hänsel, gretel, mehr |
| `r-d3-2` Debattartikel: KI gehört in den Unterricht | lästext (läs) | 305 | 96,7 % | komplett, zweitens, solchen, drittens, wichtigste, fakten, kolleginnen, mehr |
| `s-d8` Klassenfahrt nach Berlin | berättelse (läs) | 155 | 96,8 % | trafen, mauerbau, geflohen, fast, fiel |
| `r-d8` Grüezi aus Bern! | lästext (läs) | 263 | 97,0 % | berner ×2, gar, gesprochen, fließt, mehrmals, schockiert, mehr |
| `r-d6-2` Recension: Große Gefühle mit der Jungen Philharmonie | lästext (läs) | 298 | 97,3 % | begann, siebzehnjährige, mittelteil, tempi, dunkle, fast, profis, lebendig |
| `c-d4-pfand` Flaschen zurück: das Pfandsystem | kultur (läs) | 115 | 97,4 % | fast ×2, fünfzigmal |
| `r-d5-2` Reportage: Ein Samstag bei der Tafel | lästext (läs) | 351 | 97,4 % | mehr ×3, hinein, warum, geholfen, fast, sortiert, gar |
| `c-d8-oktoberfest` O'zapft is! Das Oktoberfest | kultur (läs) | 124 | 97,6 % | hildburghausen, zapft, is |
| `r-d4` Leserbrief: Autofreie Innenstadt? Ja, bitte! | lästext (läs) | 233 | 97,9 % | mehr ×2, darin, warum, günstigere |
| `s-d3` Die Falschmeldung | berättelse (läs) | 145 | 97,9 % | heraus, meldung, erfunden |

### de6: 48 av 74 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de6-hoe-4` Vortrag: „Gastarbeiter“ in der Bundesrepublik | prov (hör) | 424 | 90,3 % | kolleginnen ×2, bundesregierung ×2, zurückkehren ×2, dritten, anwerbung, ausländischer, fünfziger, sechzigerjahren |
| `de6-le-2` Forschen ohne Doktortitel | prov (läs) | 260 | 90,8 % | amseln, meisen, spatzen, solchen, entziffern, handschriften, sortieren, beantworten |
| `de6-hoe-11` Vortrag: Lärm und Gesundheit | prov (hör) | 565 | 91,9 % | mehr ×2, dezibel ×2, geräusch ×2, also ×2, daran ×2, besonderheit, gewissermaßen, knacken |
| `de6-hoe-12` Vortrag: Gutenberg und der Buchdruck | prov (hör) | 572 | 92,0 % | lettern ×4, zuschreiben ×2, schriftzeichen ×2, schriften ×2, mehr ×2, gesprochen, erfunden, warum |
| `de6-le-11` Morgen fange ich an – ganz bestimmt | prov (läs) | 455 | 92,1 % | aufschieben ×4, lehramtsstudentin, dritten, beantwortet, prokrastination, galt, faulheit, disziplin |
| `de6-le-9` Die Rückkehr der Nachtzüge | prov (läs) | 359 | 92,2 % | nutzung ×2, schienen ×2, abstellt, allzu, auslaufmodell, galten, boten, quer |
| `de6-le-14` Nutzungsordnung des Tonstudios | prov (läs) | 261 | 92,7 % | nutzungsordnung, überschrift, nutzungsberechtigte, sowie, studiozeiten, frühestens, wochenkontingent, dreimaligem |
| `de6-le-6` Zeit ohne Smartphone | prov (läs) | 579 | 93,4 % | also ×2, mehr ×2, verlängertes, holzkiste, verschlossen, unruhig, mehrmals, vibriere |
| `de6-le-5` Benutzungsordnung der Universitätsbibliothek | prov (läs) | 183 | 93,4 % | benutzungsordnung, überschrift, nutzung, personalausweises, ausgeliehen, verlängert, medium, speisen |
| `de6-le-8` Zwei Räder, die die Welt bewegten | prov (läs) | 370 | 93,5 % | badische, gilt, holz, lenkbares, stieß, abwechselnd, nannte, empfanden |
| `de6-hoe-9` Radiodiskussion: Braucht jede Stadt ein Konzerthaus? | prov (hör) | 621 | 93,9 % | moderatorin ×6, gar ×2, gestritten, befürworter, leuchtturmprojekt, geldverschwendung, dazu, großprojekten |
| `de6-le-15` Teilnahmebedingungen für den Internationalen Sommerkurs | prov (läs) | 263 | 93,9 % | abmeldung ×3, überschrift, vierwöchige, berufstätige, dessen, kursleitung, abzüglich, bearbeitungsgebühr |
| `s-s7` Die Geldbörse im Park | berättelse (läs) | 241 | 94,2 % | fast ×2, mehr ×2, heimweg ×2, darin, personalausweis, gezögert, brach, tränen |
| `s-s4` Der Brief im Antiquariat | berättelse (läs) | 233 | 94,4 % | stöberte, germanistik, darin, vergilbter, herausfiel, brüchig, entziffern, weberei |
| `de6-le-3` Klassik um zehn | prov (läs) | 419 | 94,5 % | stammt, intendantin, warum, häufigste, dazuzugehören, angezogen, worauf, drittel |
| `de6-hoe-3` Radiodiskussion: Komponiert bald die Maschine? | prov (hör) | 436 | 94,7 % | mehr ×2, gar ×2, komponistin, muster, berechnen, warum, kolleginnen, stammt |
| `c-s3-neutralitaet` Frei und neutral: Österreich 1955 | kultur (läs) | 157 | 94,9 % | sowjetunion ×2, großbritannien, verließen, beschloss, militärischen, trat, finnland |
| `r-s3-weisse-rose` Porträt: Die Weiße Rose | lästext (läs) | 410 | 95,1 % | sowie ×2, maximilians, davor, nationalsozialistische, darunter, jüngere, darin, riefen |
| `r-s6-kritik` Kritik: „Die Zauberflöte“ im Stadttheater | lästext (läs) | 418 | 95,2 % | zauberflöte ×3, erfunden, eröffnet, saison, also, hohen, gläserner, clubszene |
| `de6-le-10` Wer verdient am Streaming? | prov (läs) | 477 | 95,4 % | zigtausendmal, schallplatten, visitenkarte, warum, verteilungsprinzip, abgezogen, titel, vertriebe |
| `r-s7-ki-debatte` Kommentar: Darf eine KI komponieren? | lästext (läs) | 395 | 95,4 % | also ×2, mehr, schöpfer, nutzung, solcher, umgekehrt, geistige, stammt |
| `de6-le-12` Handys im Konzertsaal verbieten? | prov (läs) | 475 | 95,6 % | leuchtete, dunklen, rechteck, aufregung, gar, mehr, fast, darum |
| `s-s2` Das gescheiterte Experiment | berättelse (läs) | 251 | 95,6 % | gar ×2, locker ×2, kappe, hirnaktivität, fiel, also, erstaunlich, mehr |
| `r-s2-vortrag` Vortrag: Was Musik im Gehirn bewirkt | lästext (läs) | 482 | 95,6 % | also ×3, erschienen, ansprechen, hörkortex, emotionen, areale, wippen, reaktion |
| `s-s6` Premiere mit Hindernissen | berättelse (läs) | 231 | 95,7 % | zauberflöte, verlief, begann, mehr, schalteten, richteten, fast, applaudierte |
| `r-s3-kommentar` Kommentar: Wählen mit 16 – auch im Bund | lästext (läs) | 417 | 95,7 % | daran ×2, gilt ×2, mehr, kommunalwahlen, abgeben, warum, also, ließen |
| `de6-le-13` Autofreie Innenstadt – ja oder nein? | prov (läs) | 465 | 95,9 % | mehr ×3, anwohner ×2, inhaber, umliegenden, all, stadtplanerin, sperrt, verlagert |
| `de6-le-7` Sprachen lernen als Erwachsene | prov (läs) | 580 | 96,0 % | mehr ×3, niederländisch ×2, japanisch ×2, dazu, dranzubleiben, fast, abzeichen, ranglisten |
| `r-s5-debatte` Pro und Contra: Vier-Tage-Woche für alle? | lästext (läs) | 386 | 96,1 % | mehr ×3, unternehmerin, ökonomen, höher, gesunken, form, ließen, also |
| `r-s8-gastarbeiter` Gekommen, um zu bleiben: die Gastarbeiter | lästext (läs) | 417 | 96,2 % | wuchs, bau, griechenland, türkei, jugoslawien, genannt, de, deutz |
| `s-s1` Die Aufnahmeprüfung | berättelse (läs) | 235 | 96,2 % | geübt, zitterten, betrat, professorinnen, notizen, riss, fiel, rief |
| `r-s6-probespiel` Das Probespiel im Orchester | lästext (läs) | 445 | 96,2 % | vorzubereiten ×2, entschieden ×2, solche, fast, portalen, tabellarischer, angaben, kandidatinnen |
| `s-s5` Mein erster Tag im Konzerthaus | berättelse (läs) | 237 | 96,2 % | kulturmanagement, chefin, künstlerin, ankam, sortierte, beantwortete, umgeht, heraus |
| `r-s1-erfahrung` Blog: Mein erstes Semester in Wien | lästext (läs) | 463 | 96,3 % | gezogen, darin, mail, bekam, geschrien, begann, schwierigere, gilt |
| `c-s7-direktdemokratie` Das Volk hat das letzte Wort: direkte Demokratie in der Schweiz | kultur (läs) | 167 | 96,4 % | bundesverfassung, referendum, verfassungsänderung, gar, erhielten, versammeln |
| `de6-le-4` Wählen ab 16? | prov (läs) | 390 | 96,4 % | abstimmen, profitieren, parolen, mehr, politische, einzuplanen, kommunalwahl, kandidatinnen |
| `r-s5-reportage` Unterwegs mit einer freischaffenden Musikerin | lästext (läs) | 495 | 96,6 % | fast ×2, neukölln, solche, belegtes, darunter, zwölfjährige, beiden, haltung |
| `r-s4-goethe` Porträt: Johann Wolfgang von Goethe – vom Sturm und Drang zur Klassik | lästext (läs) | 473 | 96,6 % | verbunden, galt, literarischen, genannt, heraus, kleideten, warfen, straßenbau |
| `c-s2-mp3` Erfunden in Erlangen: das MP3 | kultur (läs) | 179 | 96,6 % | integrierte, schaltungen, psychoakustik, bekam, mp3, musikstreaming |
| `s-s3` Die Nacht, in der die Mauer fiel | berättelse (läs) | 244 | 96,7 % | ost, pressekonferenz, zogen, beiden, versammelt, riefen, kehrten, wiedervereinigt |
| `r-s7-kant` Immanuel Kant und der Mut zum eigenen Denken | lästext (läs) | 429 | 96,7 % | unmündig ×2, also ×2, fast, unternommen, russland, beantwortung, formuliert, römischen |
| `r-s1-motivation` Motivationsschreiben: Bewerbung an einer Musikhochschule | lästext (läs) | 388 | 96,9 % | violoncello ×2, sowie ×2, begonnen, diszipliniert, leite, vergangenen, bietet, warum |
| `de6-le-1` Stadt oder Land? | prov (läs) | 441 | 97,1 % | gezogen, gar, also, clubs, jam, sessions, mehr, stadtplanerin |
| `c-s8-ruhrgebiet` Vom Kohlenpott zur Kulturregion: das Ruhrgebiet | kultur (läs) | 173 | 97,1 % | westfalen, preußens, türkei, mehr, steinkohlenzeche |
| `r-s4-woyzeck` Szene: Zwei Tage vor der Premiere | lästext (läs) | 381 | 97,4 % | hab, darum, hinterher, hinabsieht, gar, klügste, mehr, regieassistentin |
| `c-s4-weimar` Weimar: Klassik, Republik und Bauhaus | kultur (läs) | 157 | 97,5 % | zog ×2, beiden ×2 |
| `c-s3-grundgesetz` Das Grundgesetz und das Gericht in Karlsruhe | kultur (läs) | 162 | 97,5 % | dessen, nannte, wiedervereinigt, gilt |
| `s-s8` Vom Dorf in die Großstadt | berättelse (läs) | 237 | 97,9 % | dahin, reederei, geflohen, umgezogen, beiden |

### de7: 20 av 28 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `de7-le-2` Hausordnung des Studierendenwohnheims | prov (läs) | 106 | 88,7 % | sowie ×2, untervermietung ×2, ganztägig, einzuhalten, musizieren, schallgedämmte, hausverwaltung, buchung |
| `r-s4-konzertvertrag` Auszug aus einem Konzertvertrag | lästext (läs) | 231 | 89,2 % | künstlerin ×8, änderungen ×2, höhe ×2, anlage, beider, ordnungsgemäßen, gesondertes, ersatzbesetzung |
| `r-s2-rezension` Konzertkritik: Brahms ohne Pathos | lästext (läs) | 266 | 91,0 % | mehr ×2, bekam, irritiert, sechzig, ließ, stützt, bevorzugte, üppigen |
| `r-s8-stolpersteine` Kleine Steine, große Erinnerung: die Stolpersteine | lästext (läs) | 260 | 91,9 % | gehweg, jg, mehr, gilt, dezentrale, bevor, archive, angehörige |
| `s-s8` Der Stein vor dem Haus | berättelse (läs) | 116 | 92,2 % | messingstein, beschloss, stadtarchiv, nachzufragen, erfuhr, jude, verloren, las |
| `de7-hoe-1` Vorlesungsausschnitt: Das Konzertpublikum im 19. Jahrhundert | prov (hör) | 143 | 92,3 % | applaudieren, unterhielt, aß, trank, gefiel, applaudiert, galt, andächtig |
| `l-s3-radiodebatte` Radiodebatte: Wie viel Wissenschaft steckt in Studien über Musik? | hörtext (hör) | 216 | 93,1 % | lindert, musikpsychologin, warum, solche, fast, berührt, mehrfach, zugespitzte |
| `l-s8-vortrag` Vortrag: Musik im Exil | hörtext (hör) | 252 | 93,3 % | mehr ×3, nationalsozialisten, begann, entschied, musizieren, wuchs, vereinigten, großbritannien |
| `de7-le-1` Künstliche Intelligenz im Kompositionsunterricht | prov (läs) | 165 | 93,3 % | harmonisierungen, befürworter, bedrohung, gar, mehr, erlernen, abnimmt, erarbeitet |
| `c-s4-gema` Die GEMA | kultur (läs) | 76 | 93,4 % | mechanische, vervielfältigungsrechte, pflichtig, mehr, schwesterorganisation |
| `s-s7` Die Rede | berättelse (läs) | 96 | 93,8 % | gesprochen, trat, zitterten, mehr, gar, bedacht |
| `r-s1-studienordnung` Auszug aus einer Studien- und Prüfungsordnung | lästext (läs) | 256 | 94,1 % | sowie ×2, gilt ×2, form ×2, mehr, notenverbesserung, anzuzeigen, vorzulegen, chronischen |
| `r-s5-kommentar` Kommentar: Kultur ist keine Subvention, sondern eine Investition | lästext (läs) | 287 | 94,4 % | warum ×2, ansetzt, bezuschusst, kassiererin, greift, zweitens, gewerbeflächen, drittens |
| `l-s6-nachrichten` Nachrichten und Kommentar: Streit um das Kulturfördergesetz | hörtext (hör) | 178 | 94,9 % | hitzigen, mindestanteil, erhielten, greife, krise, mehr, fonds, ärmere |
| `r-s6-foederalismus` Sechzehn Wege zur Musikschule: Föderalismus im Alltag | lästext (läs) | 266 | 95,1 % | ebenso, bemängeln, bildungschancen, beraten, mehr, daran, bund, machtlos |
| `r-s7-rede` Analyse einer Rede: „Wir sind das Publikum“ | lästext (läs) | 295 | 95,3 % | schließung ×2, rednerin ×2, eröffnungsrede, neunjährige, ethos, einsparung, fakten, defensive |
| `r-s3-studie` Macht Musik schlau? Was eine neue Studie wirklich zeigt | lästext (läs) | 263 | 95,8 % | vergangenen, nüchterneren, nahezu, mehr, bildungsnahen, hohen, nutzlos, feinmotorik |
| `s-s1` Das erste Semester | berättelse (läs) | 137 | 97,1 % | begrüßung, zurechtzufinden, begann, dozentin |
| `c-s8-9november` Der 9. November – ein deutscher Schicksalstag | kultur (läs) | 72 | 97,2 % | juden, fiel |
| `s-s4` Der Vertrag | berättelse (läs) | 111 | 97,3 % | rief, verschoben, riet |

### fr1: 16 av 38 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr1-ce-3` La recette des crêpes | prov (läs) | 65 | 80,0 % | farine ×2, crêpes ×2, faut, grammes, litre, peu, bol, ajoutez |
| `fr1-co-3` À la gare | prov (hör) | 44 | 86,4 % | mesdames, messieurs, attention, part, retard, voyage |
| `fr1-co-5` Au café | prov (hör) | 49 | 87,8 % | dialogue ×4, désirez, fond |
| `fr1-co-4` Au magasin | prov (hör) | 41 | 87,8 % | bienvenue, shirts, rayon, étage, attention |
| `fr1-s-e5` Au café | berättelse (läs) | 65 | 89,2 % | arrive, désirez, alors, boivent, puis, demande, répond |
| `fr1-s-e6` Où est le musée ? | berättelse (läs) | 67 | 91,0 % | dame ×2, monde, demande, répond, puis |
| `fr1-s-e8` La semaine de Nathan | berättelse (läs) | 84 | 91,7 % | chargée, alors, reste, lit, demande, lèves, répond |
| `fr1-co-1` Un message de Léa | prov (hör) | 48 | 93,8 % | anniversaire, apportes, numéro |
| `fr1-ce-2` Un message de Hugo | prov (läs) | 43 | 95,3 % | rendez, apporte |
| `fr1-c-metro` Le métro de Paris | kultur (läs) | 81 | 96,3 % | date, utilise, pratique |
| `fr1-ce-5` Le programme du cinéma | prov (läs) | 55 | 96,4 % | vacances, horreur |
| `fr1-r-e7` Grandes soldes ! | lästext (läs) | 99 | 97,0 % | shirts, encore, étage |
| `fr1-s-e1` La nouvelle élève | berättelse (läs) | 68 | 97,1 % | peu, alors |
| `fr1-s-e2` La famille de Hugo | berättelse (läs) | 75 | 97,3 % | week, ends |
| `fr1-r-e5` Le Café des Amis | lästext (läs) | 118 | 97,5 % | croque, tarte, menu |
| `fr1-r-e1` Salut tout le monde ! | lästext (läs) | 96 | 97,9 % | peu, alors |

### fr2: 29 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr2-co-2` À la gare | prov (hör) | 53 | 84,9 % | retard ×2, mesdames, messieurs, attention, numéro, prévu, bar |
| `fr2-s-d7` Le film d'horreur | berättelse (läs) | 95 | 89,5 % | horreur ×2, longtemps, proposé, finalement, lendemain, téléphoné, prochaine, fois |
| `fr2-ce-2` Petites annonces | prov (läs) | 80 | 90,0 % | atelier ×2, surf, faut, savoir, apprenez, refuge, compris |
| `fr2-co-1` Un message sur le répondeur | prov (hör) | 54 | 90,7 % | veux, apporte, apporter, rappelle, numéro |
| `fr2-c-d5-marche` Au marché | kultur (läs) | 132 | 90,9 % | presque, tôt, connaissent, demande, pâté, savoir, veux, chose |
| `fr2-s-d6` La fête de Nina | berättelse (läs) | 104 | 91,3 % | abord, ensuite, offert, collier, pleuvoir, alors, enfin, tard |
| `fr2-s-d8` Mon année à Dakar | berättelse (läs) | 94 | 91,5 % | abord, peur, gens, ensuite, appris, quelques, prochaine, montrer |
| `fr2-l-d2` Enfin ma chambre ! | hörtext (hör) | 153 | 91,5 % | quatrième ×2, veux ×2, alors, enfin, déjà, encore, abord, dois |
| `fr2-ce-3` Une affiche à la pharmacie | prov (läs) | 59 | 91,5 % | savon, coude, restez, buvez, possible |
| `fr2-s-d3` Lucas est malade | berättelse (läs) | 97 | 91,8 % | ensuite, reste, angine, fois, triste, foot, sourit, repose |
| `fr2-s-d5` Un gâteau pour mamie | berättelse (läs) | 101 | 92,1 % | alors, abord, ensuite, déjà, recette, faut, farine, mamie |
| `fr2-c-d3-pharmacie` La pharmacie et le médecin | kultur (läs) | 114 | 92,1 % | presque, donne, peut, proposer, adulte, puis, sécurité, montre |
| `fr2-s-d2` Le grand ménage | berättelse (läs) | 95 | 92,6 % | doit, abord, ensuite, alors, encore, fois, parfaite |
| `fr2-co-4` Une publicité à la radio | prov (hör) | 58 | 93,1 % | kayak, paient, site, fr |
| `fr2-r-d5` Le marché du village | lästext (läs) | 163 | 93,3 % | gratuit ×2, frais ×2, fraises, fromagerie, saucisses, paiement, apportez, donnons |
| `fr2-ce-1` Un message de ta famille d'accueil | prov (läs) | 63 | 93,7 % | tard, quiche, donner, bisous |
| `fr2-l-d6` L'anniversaire de Karim | hörtext (hör) | 146 | 93,8 % | pourquoi, alors, gens, pizzas, foot, suite, puis, enfin |
| `fr2-r-d3` Un message de l'infirmière | lästext (läs) | 165 | 93,9 % | quelques, rester, surtout, important, buvez, restez, demandez, bâtiment |
| `fr2-r-d4` La météo du week-end | lästext (läs) | 171 | 94,2 % | degrés ×3, attention ×2, km, mètres, plage, rester, région |
| `fr2-l-d3` Chez le médecin | hörtext (hör) | 138 | 94,2 % | surtout, alors, ouvre, dois, rester, foot, normalement, choses |
| `fr2-s-d1` Départ pour la Provence | berättelse (läs) | 94 | 94,7 % | abord, ensuite, déjà, retard, alors |
| `fr2-r-d2` Notre nouvel appartement | lästext (läs) | 173 | 94,8 % | fenêtre ×2, nouvel, enfin, déjà, dois, doit, veux, grosses |
| `fr2-r-d1` Votre billet de train | lästext (läs) | 149 | 96,0 % | date, importantes, maximum, site, bar, gratuit |
| `fr2-c-d7-bise` La bise, tu ou vous ? | kultur (läs) | 130 | 96,2 % | puis, région, parfois, peut, alors |
| `fr2-ce-4` Un courriel d'une correspondante | prov (läs) | 81 | 96,3 % | encore, plage, prochain |
| `fr2-r-d7` Forum : ma meilleure amie a changé | lästext (läs) | 168 | 96,4 % | triste ×2, dois, calmement, peut, pourquoi |
| `fr2-c-d1-train` En train et en vacances | kultur (läs) | 124 | 96,8 % | gens, faut, alors, certains |
| `fr2-c-d2-appartement` Habiter en appartement | kultur (läs) | 108 | 97,2 % | attention, certains, code |
| `fr2-r-d6` Une invitation et une réponse | lästext (läs) | 186 | 97,3 % | voulez, répondez, tarte, fraises, déjà |

### fr: 25 av 65 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fr-ce-6` Des légumes sur les toits | prov (läs) | 328 | 87,8 % | association ×4, potager ×2, récoltes ×2, milieu, mètres, carrés, créé, moyenne |
| `fr-co-6` Un café pour réparer | prov (hör) | 322 | 87,9 % | réparer ×5, objets ×2, objet ×2, visiteurs ×2, électriques ×2, prochain ×2, émission, consommation |
| `fr-ce-4` Un sport pour Clara | prov (läs) | 402 | 88,8 % | entraînements ×2, gymnase ×2, cotisation ×2, parking ×2, rejoignez, section, accueillons, conviviale |
| `fr-ce-3` Une étudiante chez Madeleine | prov (läs) | 336 | 89,0 % | association ×5, habitudes ×2, exploit, loyers, élevés, disparaissent, lyrique, solution |
| `fr-ce-5` Un piano pour s'entraîner | prov (läs) | 403 | 89,8 % | trimestre ×2, pratique ×2, disposition ×2, association ×2, membres ×2, suffit ×2, insonorisés, acoustiques |
| `fr-ce-9` Apprendre à nager à quarante ans | prov (läs) | 338 | 90,5 % | maître ×3, adultes ×2, municipale, savait, honte, évitent, salaire, chacun |
| `fr-co-2` Un festival dans les vignes | prov (hör) | 334 | 91,0 % | région ×2, souvient, fondateurs, demandé, suivante, accueille, particularité, fonctionne |
| `fr-co-7` Emprunter une guitare à la médiathèque | prov (hör) | 320 | 92,2 % | médiathèque ×2, dons ×2, soixantaine, plupart, lancé, apporté, luthier, région |
| `fr-co-9` Accordeur de pianos | prov (hör) | 325 | 92,3 % | accordeur ×2, consiste, régler, répare, intérieur, touche, fonctionne, devenir |
| `s-k2b` La naissance du métro | berättelse (läs) | 108 | 92,6 % | fin, terrible, fallait, creuser, époque, dangereux, devenu, indispensable |
| `fr-co-5` Une salle pour répéter | prov (hör) | 264 | 92,8 % | plaints, bruit, solution, insonorisées, répète, chacun, raisonnable, matériel |
| `fr-ce-2` Un orchestre au collège | prov (läs) | 334 | 93,1 % | association ×2, entreprises ×2, ressemble, trompettes, touché, lancé, voulais, emporter |
| `fr-ce-1` Un stage de musique pour l'été | prov (läs) | 355 | 93,2 % | compris ×5, professionnels ×2, région ×2, hébergement ×2, académie, rejoignez, individuels, adapté |
| `fr-co-4` Un vélo d'occasion | prov (hör) | 270 | 93,3 % | déjà ×2, antivol ×2, internet, occasion, encore, atelier, appris, vérifier |
| `fr-ce-8` Un coup de pouce pour la première année | prov (läs) | 318 | 93,4 % | tuteurs ×2, choc, amphithéâtres, personnel, lancé, tutorat, chacun, révision |
| `fr-ce-7` Un lycée qui se réveille plus tard | prov (läs) | 315 | 94,3 % | directrice, enquête, délégués, lycéens, interrogés, terminale, adolescence, tendance |
| `fr-co-3` Étudier la musique en France | prov (hör) | 333 | 94,3 % | violoncelle ×3, pourquoi, actuelle, plu, fallait, comprenais, progrès, rapport |
| `s-k1` Mon premier cours d'escalade | berättelse (läs) | 101 | 96,0 % | longtemps, montré, abdos, fin |
| `s-k1b` Notre nouvelle vie à Nice | berättelse (läs) | 108 | 96,3 % | connaissais, week, ends, nageais |
| `r-k3` Une saison d'hiver à Val-d'Isère | lästext (läs) | 249 | 96,8 % | déjà ×2, patient, demandé, pourquoi, fallait, prochaine, prochain |
| `s-k3` Mon entretien d'embauche | berättelse (läs) | 125 | 96,8 % | tôt, nerveux, prenait, fin |
| `s-k4` Le voyage de mon grand-père | berättelse (läs) | 130 | 96,9 % | voulait, connaissait, usine, suivait |
| `s-k1e` Le jour où j'ai rencontré Zidane | berättelse (läs) | 115 | 97,4 % | excité, tiré, talent |
| `s-k2` Arrivée à Roissy | berättelse (läs) | 98 | 98,0 % | aperçu, rapide |
| `s-aller` Le voyage de Julie et Emma | berättelse (läs) | 98 | 98,0 % | debout, heureusement |

### frs4: 37 av 58 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `s-h6` La fausse nouvelle | berättelse (läs) | 80 | 83,8 % | directeur ×3, récré, voyait, annonçait, déjà, remarqué, détail, lèvres |
| `frs4-ce-1` Petites annonces : logement | prov (läs) | 57 | 84,2 % | charges ×3, possible, fumeur, colocation, quatrième, colocataire, m² |
| `frs4-ce-8` Comment trier ses déchets | prov (läs) | 85 | 84,7 % | tri, emballages, inutile, suffit, vider, conteneur, bouchon, épluchures |
| `frs4-ce-6` Article : des lycéens contre le gaspillage | prov (läs) | 131 | 90,1 % | remarqué, nourriture, agir, balance, pèse, ensuite, possibilité, reprendre |
| `l-h1-2` Un stage à la radio | hörtext (hör) | 188 | 91,0 % | déjà ×2, envoie ×2, prochaine, créé, profs, texte, faudrait, mail |
| `frs4-co-4` Annonce à la radio : un festival de cinéma | prov (hör) | 85 | 91,8 % | revient, métrages, version, séance, lycéens, recevra, professionnelle |
| `frs4-co-1` Messages sur le répondeur | prov (hör) | 116 | 92,2 % | possible ×2, apporter, copie, identité, rappelez, cabinet, déplacé, secrétariat |
| `s-h1` La réponse | berättelse (läs) | 97 | 92,8 % | mail ×2, césure, échoué, pourtant, voyait, ému |
| `c-h5` Les HLM et la banlieue | kultur (läs) | 94 | 93,6 % | autour, habitations, pourtant, artistes, nombreux, essaient |
| `frs4-ce-5` Article : la bibliothèque qui prête tout | prov (läs) | 127 | 93,7 % | objets ×3, perceuse ×2, coudre, membres, utilisatrice |
| `s-h5` Le déménagement | berättelse (läs) | 84 | 94,0 % | cabane ×2, pleuvait, devais, propriétaires |
| `frs4-co-6` Préparer une fête d'anniversaire | prov (hör) | 101 | 94,1 % | alors, plaignent, trentaine, chacun, festival, attention |
| `frs4-co-3` Annonce à la radio : la Fête des voisins | prov (hör) | 105 | 94,3 % | permet, autour, chacun, apporte, suffit, amateurs |
| `c-h8` Les parcs nationaux | kultur (läs) | 91 | 94,5 % | créé ×2, presque, récent, protège |
| `r-h3-debat` Manger moins de viande ? | lästext (läs) | 285 | 94,7 % | scolaires, menu, encore, débat, faudrait, alors, appris, lasagnes |
| `r-h1-cesure` L'année de césure : une pause utile ? | lästext (läs) | 268 | 94,8 % | appris ×2, devenir ×2, utile, nordiques, encore, permet, savais, licence |
| `r-h4-lumieres` Reportage : la Fête des Lumières à Lyon | lästext (läs) | 268 | 94,8 % | soudain, crient, autour, visiteurs, artistes, transforment, devait, statue |
| `c-h3` La laïcité | kultur (läs) | 96 | 94,8 % | laïcité ×2, chacun, publique, protège |
| `l-h6-2` Vrai ou faux ? Un atelier au lycée | hörtext (hör) | 177 | 94,9 % | exactement, croyez, ensuite, existe, déjà, ailleurs, alors, pourquoi |
| `c-h1` Parcoursup : choisir son avenir à 17 ans | kultur (läs) | 83 | 95,2 % | supérieures, art, envoient, bac |
| `r-h6-pub` Les enfants face à la publicité | lästext (läs) | 265 | 95,5 % | télévision ×2, milliers, normale, savent, nourriture, programmes, oblige, suffit |
| `s-h2` Le message | berättelse (läs) | 113 | 95,6 % | comprenait, alors, connaissais, ri, finalement |
| `s-h3` Le portefeuille | berättelse (läs) | 96 | 95,8 % | intérieur, identité, commissariat, dame |
| `s-h4` Le 14 juillet | berättelse (läs) | 98 | 95,9 % | pompiers ×2, voyait, alors |
| `s-h8` Le train de nuit | berättelse (läs) | 99 | 96,0 % | compartiment, vieil, tôt, endormis |
| `c-h2` La bise | kultur (läs) | 106 | 96,2 % | pose, nombre, contexte, plutôt |
| `frs4-ce-2` Affiches au lycée | prov (läs) | 82 | 96,3 % | auprès, objets, scolaire |
| `s-h7` Le livre oublié | berättelse (läs) | 84 | 96,4 % | encore, tôt, longtemps |
| `c-h4` La Chandeleur et la galette des rois | kultur (läs) | 90 | 96,7 % | devenues, intérieur, devient |
| `frs4-ce-3` Un mail d'invitation | prov (läs) | 125 | 96,8 % | ensuite, kilomètres, alors, financer |
| `r-h5-coloc` Une étudiante chez une retraitée | lästext (läs) | 278 | 97,1 % | impossible, présent, pourquoi, associations, milliers, déjà, ainsi, nombre |
| `r-h3-courrier` Courrier des lecteurs : faut-il un uniforme à l'école ? | lästext (läs) | 279 | 97,1 % | nombreux, paient, ensuite, pose, vêtement, horrible, fr, prochain |
| `c-h7` Le Festival de Cannes | kultur (läs) | 106 | 97,2 % | devient, créé, professionnels |
| `r-h8-quebec` Carnet de voyage : trois semaines au Québec | lästext (läs) | 252 | 97,2 % | festival, jazz, ensuite, pollution, uniquement, apprenez, québécoises |
| `r-h7-roman` La lettre (extrait de roman) | lästext (läs) | 260 | 97,3 % | pleuvait, reviens, croyais, promis, pourquoi, fragile, posé |
| `frs4-ce-7` Règlement de l'auberge de jeunesse | prov (läs) | 113 | 97,3 % | prévenez, libérées, serviettes |
| `r-h2-nouvelle` Le banc (nouvelle) | lästext (läs) | 279 | 97,5 % | dame ×2, pourtant, connaissez, savez, crié, savais |

### frs5: 23 av 46 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `r-v4-manuel` Protections auditives sur mesure : mode d'emploi | lästext (läs) | 321 | 90,7 % | db ×3, utilisation ×2, spécialement, volume, sonore, déformation, attentivement, convient |
| `frs5-ce-3` Faut-il noter les élèves ? | prov (läs) | 261 | 92,3 % | supprimer ×3, reçoivent ×2, urgent, décourager, comparer, connaissent, système, scolaire |
| `frs5-co-2` Les jeunes et la seconde main | prov (hör) | 187 | 94,1 % | malin, cesse, vêtement, pourquoi, conscients, originalité, uniques, clics |
| `r-v8-vulga` Le vrai prix d'un tee-shirt | lästext (läs) | 307 | 94,1 % | shirt ×3, déjà ×2, vêtement ×2, boit, chimiques, encore, teint, parcouru |
| `frs5-co-1` Un message du conservatoire | prov (hör) | 196 | 94,4 % | flûte, traversière, sinon, rappelle, maximum, présent, apporter, exemplaires |
| `frs5-co-3` Faut-il apprendre plusieurs langues ? | prov (hör) | 215 | 94,4 % | encore, évidemment, sérieusement, manière, changeait, pourquoi, faudrait, tôt |
| `c-v8` La loi anti-gaspillage | kultur (läs) | 108 | 94,4 % | devenue, nourriture, encore, sinon, indique, rapides |
| `s-v8` Le jean de trop | berättelse (läs) | 97 | 94,8 % | déjà, faudrait, réfléchisses, ajouté, presque |
| `r-v3-vulga` Pourquoi la musique nous donne des frissons | lästext (läs) | 315 | 94,9 % | soudain, volontaires, apporter, substance, encore, apparaissent, soudainement, cesse |
| `r-v6-critique` Critique : « La Maison des hirondelles » | lästext (läs) | 304 | 95,7 % | confirme, classiques, provoque, chacun, réussite, particulièrement, détails, suffisent |
| `frs5-ce-1` Un stage de musique pour l'été | prov (läs) | 211 | 95,7 % | altistes, individuels, violoncelles, encadré, ateliers, apprenez, fest, noz |
| `frs5-ce-2` Une bibliothèque où l'on peut faire du bruit | prov (läs) | 266 | 95,9 % | chuchoter, directrice, bricolage, maximum, rap, silencieuse, aménagée, nombre |
| `s-v5` Un malentendu à Bruxelles | berättelse (läs) | 98 | 95,9 % | ri, déjà, appris, carnet |
| `s-v4` Un concert malgré tout | berättelse (läs) | 100 | 96,0 % | fallait, magnifique, encore, promis |
| `c-v6` Le prix Goncourt | kultur (läs) | 127 | 96,1 % | rapporte, milliers, nombreux, existe, sélection |
| `r-v1-mail` Candidature pour un stage d'été | lästext (läs) | 295 | 96,3 % | filière, violoncelle, impressionnée, pourquoi, préparation, encore, déjà, type |
| `s-v6` Le manuscrit perdu | berättelse (läs) | 100 | 97,0 % | dedans, répète, devenu |
| `r-v7-critique` Concert : une jeune pianiste qui ose tout | lästext (läs) | 304 | 97,0 % | franco, déjà, réputation, confirmée, longtemps, prenait, clarté, interrogé |
| `c-v1` Les 35 heures | kultur (läs) | 123 | 97,6 % | delà, repos, reçoivent |
| `s-v3` L'appli qui écoutait trop bien | berättelse (läs) | 84 | 97,6 % | conversations, utilisation |
| `s-v2` La lettre d'admission | berättelse (läs) | 86 | 97,7 % | postulais, ri |
| `c-v7` Édith Piaf, la môme de Paris | kultur (läs) | 134 | 97,8 % | boxeur, dizaines, milliers |
| `s-v7` La chorale du quartier | berättelse (läs) | 99 | 98,0 % | appris, tôt |

### fr4: 35 av 68 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `r-q7-trac` Le trac : ennemi ou allié des musiciens ? | lästext (läs) | 512 | 91,6 % | bat ×2, devient ×2, précieux ×2, longtemps ×2, vide, nombreux, connaissent, met |
| `s-q3` Le jardin partagé | berättelse (läs) | 132 | 92,4 % | terrain, vide, transformé, croyaient, trentaine, jardinier, appris, fallait |
| `fr4-ce-1` Une mission de bénévolat pour l'été | prov (läs) | 351 | 93,7 % | participation ×4, chantier, tailleurs, maçons, mortier, reconstruire, abbayes, plantation |
| `s-q1` La lettre du conservatoire | berättelse (läs) | 134 | 94,0 % | facteur, apporté, enveloppe, réessaierai, prochaine, tôt, tellement, possible |
| `fr4-ce-8` Commencer les cours à neuf heures | prov (läs) | 328 | 94,2 % | retentit, proviseur, fallu, négocier, modifier, scolaires, réorganiser, raccourcie |
| `fr4-co-7` Réparer au lieu de jeter | prov (hör) | 306 | 94,4 % | grille, chauffe, freins, apportent, prochaine, chacun, sert, couturière |
| `fr4-ce-5` Un studio pour répéter | prov (läs) | 388 | 94,6 % | tram ×2, badge ×2, insonorisées, unique, casiers, espérons, prochaine, pupitres |
| `fr4-co-8` Apprentie luthière | prov (hör) | 337 | 94,7 % | atelier ×4, recevons, apprentie, lutherie, violoncelles, hasard, apporté, luthier |
| `fr4-co-6` Un piano dans la gare | prov (hör) | 308 | 94,8 % | plutôt ×2, chacun, asseoir, dessus, accordeur, presque, plaignaient, appris |
| `r-q6-hugo` Victor Hugo, un géant dans son siècle | lästext (läs) | 484 | 95,0 % | presque ×3, devient ×2, croit ×2, immense ×2, combats, rapidement, libérer, provoque |
| `r-q3-conf` Le climat, ce que nous pouvons encore changer | lästext (läs) | 489 | 95,1 % | déjà ×3, encore ×2, savons ×2, possible ×2, conférence, chacun, visibles, fréquentes |
| `fr4-ce-4` Les vérificateurs du lycée | prov (läs) | 342 | 95,6 % | résonne, circulent, documentaliste, semé, affirmait, dizaines, souvient, fallait |
| `fr4-ce-6` Un job d'été en France | prov (läs) | 368 | 95,7 % | atlantique, réceptionnistes, vacanciers, home, navette, cueilleurs, vergers, éviter |
| `r-q3-reportage` À Ploumoren, une deuxième vie pour les objets et pour les gens | lästext (läs) | 497 | 95,8 % | atelier ×4, garage ×2, intérieur ×2, milliers, transformé, longtemps, appris, revendus |
| `r-q2-reportage` La Loupe : une journée avec les chasseurs de fausses nouvelles | lästext (läs) | 489 | 95,9 % | milliers ×2, déjà, autour, possible, fact, checking, comparer, suffit |
| `fr4-ce-2` Un violon, un écran et deux cents kilomètres | prov (läs) | 367 | 95,9 % | kilomètres, failli, souvient, trentaine, réécouter, remarque, détails, présentiel |
| `s-q6` Le carnet de mon arrière-grand-père | berättelse (läs) | 123 | 95,9 % | carnet, construit, libéré, encore, poserais |
| `s-q8` Un débat sur l'intelligence artificielle | berättelse (läs) | 135 | 96,3 % | chacun, longtemps, manière, réfléchissions, conclu |
| `s-q5` Premier hiver à Montréal | berättelse (läs) | 136 | 96,3 % | comprenait, devait, tôt, espère, prochain |
| `r-q5-lettre` Demande de restitution du dépôt de garantie | lästext (läs) | 436 | 96,3 % | lors ×2, locative, signature, savez, présence, apparaître, indique, effectué |
| `r-q7-debat` Et si le sport devenait une matière aussi importante que les maths ? | lästext (läs) | 548 | 96,4 % | éducation ×2, devenait, nombreuses, ennemi, nombreux, apprennent, endort, précieux |
| `r-q6-reportage` Sur les plages du Débarquement, une classe face à l'histoire | lästext (läs) | 522 | 96,7 % | nombreux ×2, combats, terribles, rappelle, notamment, nazie, situé, connaissais |
| `fr4-ce-9` Sans voiture à la campagne | prov (läs) | 340 | 96,8 % | reçoivent ×2, devient, réagir, devait, mitigé, inscrits, encore, élus |
| `r-q2-debat` Réseaux sociaux : protéger les ados sans les priver de liberté | lästext (läs) | 475 | 96,8 % | minimum ×2, scolaire, quatrième, discussion, violentes, cesse, suffisent, suffit |
| `fr4-ce-7` Un frigo pour tout le quartier | prov (läs) | 328 | 97,0 % | réfrigérateur, déposez, voyais, paraissait, déposer, déposent, vide, craignent |
| `r-q1-debat` Faut-il tout décider à dix-sept ans ? | lästext (läs) | 447 | 97,1 % | chacun, croit, poser, sache, déjà, connaissent, pression, savent |
| `c-q1` Le bac, de Napoléon à Parcoursup | kultur (läs) | 139 | 97,1 % | existe, technologique, reçoivent, tôt |
| `r-q5-reportage` Lyon, ville d'adoption : trois jeunes Européens racontent | lästext (läs) | 545 | 97,4 % | encore ×2, fallait ×2, autour, polonais, souvient, dizaines, lyonnais, déjà |
| `fr4-ce-3` Les voix de la mémoire | prov (läs) | 370 | 97,6 % | tracts, clandestins, mène, appris, interrompre, déjà, disponibles, inscrit |
| `s-q7` Le semi-marathon de Léa | berättelse (läs) | 125 | 97,6 % | semi, fallait, étirements |
| `r-q4-moliere` Molière, un homme de théâtre et son siècle | lästext (läs) | 515 | 97,7 % | revient, mener, apprenant, fallu, bourgeois, maître, normalement, remarquez |
| `r-q4-scene` Dans les coulisses | lästext (läs) | 520 | 97,7 % | encore ×2, prof ×2, croyais, pose, assoit, devais, tellement, lève |
| `s-q2` La vidéo qui n'était pas vraie | berättelse (läs) | 130 | 97,7 % | voyait, tôt, circulé |
| `c-q3` L'Accord de Paris sur le climat | kultur (läs) | 131 | 97,7 % | presque, dessous, rapport |
| `c-q2` La liberté de la presse en France | kultur (läs) | 135 | 97,8 % | déjà, communication, nombreuses |

### fru: 41 av 68 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `fru-co-2` Des quotas de chansons françaises à la radio ? | prov (hör) | 529 | 92,6 % | quotas ×7, rap ×4, encore ×2, suffit ×2, compliquent, pop, pèsent, soumis |
| `fru-ce-3` Le grand retour à la campagne n'a pas (vraiment) eu lieu | prov (läs) | 457 | 93,4 % | citadins ×2, plutôt ×2, confinement, citadines, submergées, annonçait, bondés, repeupler |
| `fru-ce-6` Musicien : un métier, plusieurs vies | prov (läs) | 459 | 93,7 % | pluriactivité ×2, permanent, unique, assemblage, trompettiste, type, associative, jazz |
| `fru-co-7` Changer de métier en cours de route | prov (hör) | 542 | 93,7 % | encore ×2, dizaine, emblée, connaissez, trompeur, changeait, plutôt, reconstruire |
| `fru-ce-2` La laïcité, une liberté avant d'être une interdiction | prov (läs) | 465 | 93,8 % | protège ×2, invoquée, brandie, rempart, devenue, anodin, chacun, représentent |
| `fru-ce-5` Le sommeil des adolescents, une affaire collective | prov (läs) | 451 | 93,8 % | encore, couette, horloge, décale, tôt, accumule, suffit, évidemment |
| `fru-co-9` Trois courts documents : nuit noire, sédentarité, lutherie | prov (hör) | 715 | 93,8 % | tôt ×2, plutôt ×2, atelier ×2, lampadaires, éteignent, financières, devenu, chauves |
| `fru-co-4` Trois courts documents | prov (hör) | 659 | 93,9 % | altiste ×2, bitume, profit, fontaines, baptisé, îlots, fraîcheur, fréquentes |
| `fru-co-6` Le trac, une fatalité pour les musiciens ? | prov (hör) | 545 | 93,9 % | devient ×2, déjà ×2, utile, tel, empêche, archet, intensément, compétitif |
| `fru-co-3` Bienvenue en licence | prov (hör) | 551 | 94,4 % | fameux, faudra, regroupés, types, applique, présence, évaluation, suffit |
| `s-u3` La nuit du 10 mai | berättelse (läs) | 180 | 94,4 % | déjà ×2, encore ×2, téléviseur, bond, fallait, pleuve, milliers, représentait |
| `s-u7` Le pianiste de Montmartre | berättelse (läs) | 172 | 94,8 % | devenir, fallait, buvaient, griffonnait, connaissait, lut, circula, devenu |
| `fru-ce-4` Étudier à l'étranger : et si l'on descendait de l'avion ? | prov (läs) | 451 | 94,9 % | milliers, songerait, formidable, posée, bas, accusation, émetteurs, existent |
| `s-u2` Août 1944 | berättelse (läs) | 199 | 95,0 % | prisonnier, cachette, police, commençait, combats, enfermé, mirent, répandue |
| `fru-co-5` Réparer plutôt que jeter | prov (hör) | 578 | 95,0 % | fabricants ×2, apportent, hasard, grille, dessoudé, devait, concrètement, reviennent |
| `r-u6-parure` Analyse d'un incipit : « La Parure » de Maupassant | lästext (läs) | 565 | 95,0 % | presque ×2, brève, construite, inattendue, cesse, frustrations, croit, typique |
| `s-u6` L'héritage | berättelse (läs) | 174 | 95,4 % | fermier, vache, maigre, accoururent, fouillèrent, tôt, hospice, ri |
| `s-u5` Un hiver à Montréal | berättelse (läs) | 153 | 95,4 % | appris, faudra, comprenait, jam, tut, jazz, deviendrait |
| `r-u7-classicisme` Le théâtre classique et ses règles | lästext (läs) | 564 | 95,6 % | notamment ×2, clarté, grecs, théoriciens, réflexion, maximum, endroit, paraisse |
| `fru-ce-8` Étudiant chez une personne âgée : la bonne formule ? | prov (läs) | 323 | 95,7 % | impossible, appris, week, ends, évite, veuf, devenue, silencieuse |
| `s-u4` Le concours | berättelse (läs) | 171 | 95,9 % | remarqua, connût, portail, promit, reviendrait, sachent, existait |
| `r-u2-dreyfus` L'affaire Dreyfus : quand un article fit trembler la République | lästext (läs) | 491 | 95,9 % | armée ×2, rapidement, capitaine, sinon, ressemblance, criait, cessé, innocence |
| `r-u4-banlieue` Banlieue : sortir des clichés | lästext (läs) | 491 | 95,9 % | suffit ×2, construite, soumis, ban, applique, résidentiels, entourent, construits |
| `s-u8` Angoulême, en janvier | berättelse (läs) | 173 | 96,0 % | déjà, tôt, fallait, dédicace, stand, parut, remarquée |
| `r-u3-laicite` La laïcité, une exception française ? | lästext (läs) | 465 | 96,1 % | revient, royal, affirme, restrictions, poser, chacun, favorise, plutôt |
| `r-u4-grandes-ecoles` Les grandes écoles et l'égalité des chances | lästext (läs) | 480 | 96,2 % | encore ×2, particularité, existe, succèdent, nettement, sociologue, sache, existent |
| `r-u2-revolution` De la Révolution à la Troisième République | lästext (läs) | 481 | 96,3 % | connut, presque, affirme, naissent, disparut, milliers, encore, désastre |
| `s-u1` La route du Sud | berättelse (läs) | 161 | 96,3 % | cédaient, aube, sinon, atteignit, aperçut, tôt |
| `fru-ce-1` Étudier la musique en France : plusieurs portes d'entrée | prov (läs) | 458 | 96,3 % | délivrent ×2, longtemps, ignorés, quinzaine, multiplient, décisif, disciplines, particularité |
| `r-u8-langue` Le français, une langue qui bouge | lästext (läs) | 577 | 96,4 % | encore ×2, longtemps ×2, romaine, transformé, gaulois, germaniques, considère, distingue |
| `c-u4` Le Panthéon, « aux grands hommes » | kultur (läs) | 165 | 96,4 % | devait, transformé, immense, longtemps, presque, devenue |
| `r-u1-occitanie` L'Occitanie, entre métropoles et campagnes | lästext (läs) | 583 | 96,6 % | encore ×2, surnom, référence, milliers, techniciens, connaissais, repartirais, toulousaine |
| `r-u8-bd` La bande dessinée franco-belge, un neuvième art | lästext (läs) | 586 | 96,6 % | encore ×2, considérée, divertissement, déjà, bruxellois, deviendra, reconnaissable, multiplient |
| `fru-ce-9` Un centre-ville sans voitures ? | prov (läs) | 330 | 97,0 % | alentour, précipitation, appartient, endroit, presque, opposés, piéton, bancs |
| `r-u3-institutions` Les institutions de la Ve République | lästext (läs) | 484 | 97,1 % | contexte, instabilité, dizaines, milliers, approuvée, longtemps, appliqué, armées |
| `fru-ce-7` Apprendre la musique : faut-il commencer par le solfège ? | prov (läs) | 346 | 97,1 % | tutoriels, incapable, entière, prof, mâche, appris, reproduisant, inscrits |
| `r-u7-verlaine` Verlaine, « Chanson d'automne » : de la musique avant toute chose | lästext (läs) | 527 | 97,3 % | devenu ×2, savent, encore, déjà, appliquer, obtient, lons, multiplie |
| `r-u1-mosaique` La France, un territoire en mosaïque | lästext (läs) | 628 | 97,5 % | kilomètres ×2, parcourt, rejoint, fréquentes, deviennent, bénéficie, chacun, numéro |
| `r-u5-francophonie` Qu'est-ce que la francophonie ? | lästext (läs) | 611 | 97,5 % | plutôt ×2, appris, devenir, représentants, actuelle, devenu, apprennent, encore |
| `r-u5-petit-pays` Gaël Faye, « Petit pays » : une enfance rattrapée par l'Histoire | lästext (läs) | 530 | 97,5 % | traduit, rwandaise, refaire, assassiné, milliers, revient, impossible, grecque |
| `c-u7` La Comédie-Française, la maison de Molière | kultur (läs) | 148 | 98,0 % | tôt, encore, presque |

### it1: 10 av 35 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it1-r-lit-framartino` Fra Martino (folkvisa) | lästext (läs) | 19 | 68,4 % | din ×2, don ×2, dan ×2 |
| `it1-s-i6` Dov'è la gelateria? | berättelse (läs) | 85 | 91,8 % | sa, chiede, qui, verso, arrivano, risponde, altra |
| `it1-s-i8` Il compleanno di Sofia | berättelse (läs) | 97 | 92,8 % | festa, arrivano, gridano, apre, regali, chiede, risponde |
| `it1-s-i4` Un lunedì difficile | berättelse (läs) | 71 | 93,0 % | ancora, fretta, corre, arriva, ritardo |
| `it1-s-i1` Il primo giorno di corso | berättelse (läs) | 78 | 94,9 % | corso, chiede, adesso, pronti |
| `it1-s-i5` Una pizza per tutti | berättelse (läs) | 74 | 95,9 % | chiede ×2, ognuno |
| `it1-s-i2` La nuova compagna di classe | berättelse (läs) | 75 | 96,0 % | curiosa, animali, adesso |
| `it1-s-i3` Il sabato di Luca | berättelse (läs) | 80 | 96,2 % | gruppo ×2, insieme |
| `it1-s-i7` La camera di Paolo | berättelse (läs) | 88 | 96,6 % | terzo, dipingere, dappertutto |
| `it1-r-i8` Una cartolina da Roma | lästext (läs) | 91 | 96,7 % | qui ×2, già |

### it2: 19 av 36 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it2-s-j1` Una nuova amica | berättelse (läs) | 89 | 88,8 % | nessuno, sederti, qui, sorriso, scoperto, seguivamo, disegnatori, stupidaggine |
| `it2-s-j7` Il matrimonio della zia | berättelse (läs) | 93 | 90,3 % | cerimonia ×2, collina, tirato, riso, bellissimo, durato, infine, felicità |
| `it2-s-j8` Un progetto per il futuro | berättelse (läs) | 90 | 91,1 % | architettura, tantissimo, siccome, impegno, capo, quindi, lì, soldi |
| `it2-s-j4` Gli occhiali del nonno | berättelse (läs) | 104 | 91,3 % | li ×2, campagna, galline, burro, nascosto, trovati, arrabbiato, riso |
| `it2-s-j2` Un sabato sfortunato | berättelse (läs) | 89 | 92,1 % | avversari ×2, rigore, arrabbiati, zero, portafoglio, trovato |
| `it2-s-j5` La lezione di cucina | berättelse (läs) | 89 | 93,3 % | detto ×3, già, adesso, insieme |
| `it2-r-lit-pinocchio` Il naso di Pinocchio (fritt efter Carlo Collodi, 1883) | lästext (läs) | 181 | 93,9 % | naso ×4, detto ×2, subito ×2, poco, pochi, già |
| `it2-s-j3` Due sorelle a Roma | berättelse (läs) | 99 | 93,9 % | caldissimo, metro, stradine, trovato, buonissimo, quindi |
| `it2-r-j6` Una brutta caduta | lästext (läs) | 160 | 94,4 % | vincevamo, zero, palla, fortissimo, subito, alcuni, contro, adesso |
| `it2-r-j4` Il mio paesino | lästext (läs) | 188 | 95,2 % | quindi, luce, durante, usavamo, soprattutto, tablet, sanno, sapevo |
| `it2-r-j7` Una festa a sorpresa | lästext (läs) | 169 | 95,3 % | insieme ×2, top, secret, lì, qualcosa, rispondete, abbraccio |
| `it2-r-j8` Il mio primo lavoro | lästext (läs) | 151 | 95,4 % | mare, trovato, internet, subito, riso, soldi, computer |
| `it2-s-j6` Una settimana a letto | berättelse (läs) | 91 | 95,6 % | forte, siccome, detto, rimasta |
| `it2-c-j3-ferragosto` Ferragosto | kultur (läs) | 95 | 95,8 % | cattolica, vacanza, quasi, mare |
| `it2-r-j1` Due parole su di me | lästext (läs) | 164 | 96,3 % | qui, tantissimi, li, scrivetemi, raccontatemi, qualcosa |
| `it2-c-j7-carnevale` Il Carnevale di Venezia | kultur (läs) | 110 | 96,4 % | già, nessuno, sapeva, quasi |
| `it2-c-j8-maturita` La maturità e il primo lavoro | kultur (läs) | 139 | 96,4 % | famosa, trovare, circa, quasi, alcuni |
| `it2-r-j3` Saluti dalla Puglia | lästext (läs) | 167 | 97,0 % | buonissima, lunghissima, mare, trovato, già |
| `it2-r-j5` La pasta alla Norma | lästext (läs) | 212 | 97,6 % | proprio, mettetele, cuocete, usate, scrivetemi |

### it3: 22 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it3-s-k5` Una giornata al lago | berättelse (läs) | 134 | 88,1 % | anatra ×3, dappertutto, ognuno, paio, alcuni, rotti, nessuno, qualcuno |
| `it3-s-k3` Una notizia falsa | berättelse (läs) | 163 | 90,8 % | guasto ×2, strano, causa, subito, condiviso, pochi, convinto, nessuno |
| `it3-s-k7` Il mio primo concerto | berättelse (läs) | 137 | 92,0 % | li, regalati, tantissima, piaciuta, piaciute, tantissimo, intera, piaciuto |
| `it3-l-k7` Il concerto di ieri sera | hörtext (hör) | 115 | 93,0 % | tantissimo, soprattutto, bravissimo, incredibile, troppo, terza, vicinissimi, pochissimo |
| `it3-r-k5` Un paese della Liguria dice addio alla plastica | lästext (läs) | 163 | 93,3 % | usare, soprattutto, professoressa, scienze, iniziativa, alcuni, prodotti, adesso |
| `it3-s-k6` Dalla città alla campagna | berättelse (läs) | 139 | 93,5 % | quindi, tristissima, adesso, grandissima, conosciuto, simpaticissima, lì, qualcuno |
| `it3-s-k1` Un'estate in Puglia | berättelse (läs) | 143 | 93,7 % | qualcosa, riuscivamo, barche, pescatori, pescatore, regalato, enorme, scoppiata |
| `it3-s-k4` Troppo stress | berättelse (läs) | 145 | 93,8 % | poco, siccome, allenatrice, ammetterlo, dammi, ridò, sbuffato, gliel |
| `it3-s-k2` Un lavoro per l'estate | berättelse (läs) | 140 | 94,3 % | terzo, disastro, rotto, adorava, mancia, ricchissimo, adesso, aprirò |
| `it3-l-k6` Città o campagna? | hörtext (hör) | 129 | 94,6 % | adesso, soprattutto, qui, nemmeno, quindi, tornerai, lì |
| `it3-l-k4` Dal medico sportivo | hörtext (hör) | 113 | 94,7 % | troppo ×2, quindicesimo, mah, adesso, ascoltarmi |
| `it3-r-k7` Giuseppe Verdi, il musicista di un paese | lästext (läs) | 204 | 95,1 % | semplice, amava, troppo, modo, strano, continuato, amate, poveri |
| `it3-c-k1-regioni` Venti regioni, venti Italie | kultur (läs) | 125 | 95,2 % | sud ×2, nord, soprattutto, intorno, quasi |
| `it3-c-k7-sanremo` Il Festival di Sanremo e i cantautori | kultur (läs) | 111 | 95,5 % | esiste, dura, normali, parole, perfino |
| `it3-s-k8` Una lite tra amiche | berättelse (läs) | 158 | 95,6 % | tantissimo, vederti, riso, lite, stupida, dirò, promesso |
| `it3-c-k6-piazza` La piazza e i borghi | kultur (läs) | 115 | 95,7 % | soprattutto, bellissimi, alcuni, vendono, promette |
| `it3-c-k8-famiglia` La famiglia e i «mammoni» | kultur (läs) | 103 | 96,1 % | qualcuno, li, troppo, inoltre |
| `it3-r-k4` Una mail da Sofia: ho cominciato a correre! | lästext (läs) | 159 | 96,2 % | scusami, terribili, continua, adesso, senza, fermarmi |
| `it3-c-k3-media` Giornali, TV e telegiornale | kultur (läs) | 108 | 96,3 % | esiste, soprattutto, fake, news |
| `it3-r-k8` La lettera nel cassetto | lästext (läs) | 192 | 96,9 % | conosciuti, pochi, quasi, tiene, li, qualcuno |
| `it3-r-k2` Il blog di Elsa: il mio anno a Bologna | lästext (läs) | 169 | 97,0 % | qui ×2, nord, trovarmi, scrivetemi |
| `it3-r-k1` Il treno perso | lästext (läs) | 193 | 97,4 % | senza ×2, semplice, quasi, farmi |

### it4: 41 av 52 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it4-c-c7-giro` Il Giro d'Italia | kultur (läs) | 94 | 87,2 % | dura ×2, corridori ×2, ciclistiche, leader, maglia, migliaia, passaggio, pochi |
| `it4-r-c3` Venezia, il Carnevale dietro la maschera | lästext (läs) | 260 | 90,8 % | veneziani ×2, laboratorio ×2, piume, veneziano, risalgono, secoli, qualcun, ricco |
| `it4-l-c4a` Cercasi stanza a Bologna | hörtext (hör) | 182 | 91,2 % | stanza ×4, gas, sessantina, mmh, centralizzato, rispettino, nessun, documento |
| `it4-r-c7` Il calcio non è solo per maschi | lästext (läs) | 253 | 91,3 % | allenatrice ×2, femminile ×2, qui ×2, maglia, grida, ce, esisteva, maschi |
| `it4-c-c2-slow` Slow Food | kultur (läs) | 93 | 91,4 % | aprì, fast, food, protestarono, fondò, difende, biodiversità, chiocciola |
| `it4-c-c1-uni` L'università in Italia | kultur (läs) | 105 | 91,4 % | quasi, gratuite, universitarie, triennale, dura, magistrale, occidentale, fondata |
| `it4-r-c5a` Recensione: «Ladri di biciclette» (1948) | lästext (läs) | 252 | 92,1 % | appartiene, categoria, nessuno, alcuni, lucidi, semplicissima, manifesti, vende |
| `it4-c-c6-costituzione` La Costituzione italiana | kultur (läs) | 78 | 92,3 % | vigore, fondata, distinzione, sesso, razza, ripudia |
| `it4-l-c3b` Natale in Svezia, Natale in Italia | hörtext (hör) | 189 | 92,6 % | li ×3, aringhe, salmone, polpette, cresciuto, baccalà, vongole, aprivamo |
| `it4-c-c5-cinema` Cinecittà e il cinema italiano | kultur (läs) | 102 | 93,1 % | cinematografici, inaugurata, qui, vinto, qualsiasi, soprattutto, televisive |
| `it4-l-c5b` Il club del libro | hörtext (hör) | 192 | 93,2 % | club, cupo, legno, promesse, mantiene, guai, addirittura, prigione |
| `it4-r-c4b` Due città, due vite | lästext (läs) | 258 | 93,4 % | qui ×2, quasi ×2, confronto, ovviamente, invernale, dappertutto, chiudono, mys |
| `it4-r-c8a` Parlare in dialetto: vergogna o ricchezza? | lästext (läs) | 260 | 93,5 % | soprattutto ×2, pochi, considerato, istruite, situazione, televisive, rapper, riconosciuto |
| `it4-l-c2b` Il telefono trovato | hörtext (hör) | 188 | 93,6 % | tasca, sceso, dirmi, tesoro, tiene, stupidaggini, squillato, gliel |
| `it4-r-c5b` L'ultima pagina (racconto) | lästext (läs) | 254 | 93,7 % | polverosa, quasi, soprattutto, persona, barone, rampante, altezza, vetrina |
| `it4-r-c2a` Lettera al direttore: basta con la moda usa e getta | lästext (läs) | 272 | 93,8 % | studentessa, abbigliamento, cosiddetto, scoperto, produrre, cotone, indossa, discarica |
| `it4-le-2` Messaggi e annunci | prov (läs) | 113 | 93,8 % | causa, affittasi, comprese, annullato, validi, urgenze, limitati |
| `it4-l-c7b` La mia prima maratona | hörtext (hör) | 178 | 93,8 % | nemmeno, smesso, seduta, iscrivermi, ce, fermarmi, gridava, arrendermi |
| `it4-r-c1` Che cosa farò da grande? Il blog di Martina | lästext (läs) | 259 | 93,8 % | chiedetevi ×2, toglie, chiarissime, adesso, nessuno, qui, incontro, risolvere |
| `it4-s-c6` Il consiglio dei ragazzi | berättelse (läs) | 99 | 93,9 % | qualcosa, nessuno, riunione, proposto, alcuni, vederlo |
| `it4-l-c8a` Ma come parli? | hörtext (hör) | 183 | 94,0 % | quasi ×4, benissimo, disperata, alcuni, pochi, soprattutto, lì, qualcosa |
| `it4-c-c8-lingua` Come è nato l'italiano | kultur (läs) | 100 | 94,0 % | diventò, modello, sciacquare, panni, promessi, militare |
| `it4-s-c8` La valigia del bisnonno | berättelse (läs) | 117 | 94,0 % | bisnonno ×2, bisnonna, nessuno, tradurle, soldi, chiudere |
| `it4-l-c5a` Che film guardiamo? | hörtext (hör) | 184 | 94,0 % | qualcosa, ce, tristissima, gliela, ritrova, professionisti, vendeva, vedrai |
| `it4-l-c6a` Il notiziario | hörtext (hör) | 204 | 94,1 % | migliaia, investimenti, trasporti, organizzatori, contro, troppo, cause, femminile |
| `it4-l-c1b` Un messaggio vocale | hörtext (hör) | 188 | 94,1 % | vocale, troppo, vinto, lì, felicissima, aiutarmi, videochiamata, chiamami |
| `it4-l-c3a` Il Palio di Siena alla radio | hörtext (hör) | 198 | 94,4 % | risalgono, divisa, ognuna, oca, tartaruga, brevissima, sella, vinto |
| `it4-s-c4` La nuova coinquilina | berättelse (läs) | 108 | 94,4 % | nessuno, stanza, lenzuola, gliel, regalata, adesso |
| `it4-r-c4a` Trent'anni e ancora a casa con mamma | lästext (läs) | 254 | 94,5 % | amano, cause, soprattutto, call, center, soldi, poco, rari |
| `it4-r-c8b` Lettera da Melbourne | lästext (läs) | 262 | 94,7 % | qui ×2, raccontarti, arrugginito, durato, duri, fabbrica, mattoni, poco |
| `it4-as-2` Annunci e messaggi | prov (hör) | 117 | 94,9 % | disagio, chiuderà, meteo, qui, archeologico, gratuito |
| `it4-l-c7a` Dal medico | hörtext (hör) | 179 | 95,0 % | tolga, qui, lì, tantissimo, rotta, tenga, ricominciare, troppo |
| `it4-le-3` Tre brevi testi sul tempo libero | prov (läs) | 166 | 95,2 % | li, adesso, nessuno, lamentati, compenso, durerà, regalato, troppo |
| `it4-s-c2` Il cane abbandonato | berättelse (läs) | 114 | 95,6 % | bici, qualcuno, terribile, crimine, amano |
| `it4-s-c5` Il cinema del paese | berättelse (läs) | 106 | 96,2 % | proiettore, nessuno, scoperto, scatola |
| `it4-s-c7` La finale | berättelse (läs) | 108 | 96,3 % | stanchissima, allenatrice, ce, vinto |
| `it4-le-4` Una giornata diversa | prov (läs) | 125 | 96,8 % | professoressa, iniziativa, soprattutto, promesso |
| `it4-r-c6` Il voto a sedici anni: due opinioni | lästext (läs) | 252 | 97,2 % | soprattutto ×2, abbassare, eppure, diventeremmo, stupidi, funziona |
| `it4-r-c2b` Il dilemma di Lorenzo (racconto) | lästext (läs) | 263 | 97,3 % | qualcuno ×2, acceso, stimava, aprire, accorto, guardò |
| `it4-s-c3` Il primo Palio | berättelse (läs) | 119 | 97,5 % | li, ama, vinto |
| `it4-le-1` Avvisi e cartelli | prov (läs) | 128 | 97,7 % | gratuito, frigo, scaldarla |

### it5: 32 av 41 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it5-s-m1` Il nuovo lavoro | berättelse (läs) | 67 | 91,0 % | mail, cominciasse, benché, felicissimo, promesso, continuato |
| `it5-s-m6` Il burattino | berättelse (läs) | 47 | 91,5 % | regalò, costruire, chiamò, scappò |
| `it5-l-m3-b` Istruzioni per la stampante | hörtext (hör) | 156 | 91,7 % | adesso ×2, riesco, accesa, finché, apra, scelga, apparire, wi |
| `it5-r-m7` Cremona, la città dei violini | lästext (läs) | 275 | 92,4 % | alcuni ×2, particolare, costruiscono, considerato, soprattutto, intorno, costruì, esistono |
| `it5-l-m8` Il mercato contadino | hörtext (hör) | 148 | 92,6 % | qui, adesso, brutte, ce, vendete, arance, zucche, vendiamo |
| `it5-s-m2` L'esame di ammissione | berättelse (läs) | 58 | 93,1 % | affinché, chiamasse, complimenti, ottimo |
| `it5-s-m4` Se avessi più tempo | berättelse (läs) | 61 | 93,4 % | poco, sebbene, adesso, bici |
| `it5-r-m4` Il segreto dei centenari sardi | lästext (läs) | 290 | 93,4 % | quasi ×3, semplice ×2, soprattutto ×2, alcuni, poche, pochi, decenni, uomini |
| `it5-l-m1-b` Notizie dal mondo del lavoro | hörtext (hör) | 169 | 93,5 % | trasporti, contro, trasporto, sceso, soprattutto, dichiarato, presenterà, stabili |
| `it5-r-m8` Lettera al giornale: basta con la frutta perfetta | lästext (läs) | 282 | 93,6 % | poco, vendiamo, ridicoli, soprattutto, nemmeno, alcuni, vendere, brutte |
| `it5-le-3` Una lettera dal passato | prov (läs) | 94 | 93,6 % | lunghissimo, poco, righe, soldi, subito, qui |
| `it5-c-m8-slowfood` Slow Food e la cucina povera | kultur (läs) | 114 | 93,9 % | aprì, fast, organizzò, pericolo, alcuni, fagioli, nemmeno |
| `it5-l-m5-b` Un'intervista sul dialetto | hörtext (hör) | 169 | 94,1 % | rapper, qualsiasi, portassi, vendere, tradotti, alcuni, perfino, esattamente |
| `it5-r-m5` Una lingua, tanti italiani | lästext (läs) | 294 | 94,2 % | soprattutto ×2, pescatore, esisteva, secoli, insegnò, interna, comunicare, quasi |
| `it5-l-m6` Com'era il film? | hörtext (hör) | 169 | 94,7 % | piaciuto, sinceramente, bellissima, bravissimo, troppe, coraggiosa, online, dispiaciuto |
| `it5-l-m8-b` Il gruppo di acquisto | hörtext (hör) | 152 | 94,7 % | online, alcune, esattamente, zucche, arance, conoscevamo, mail, ognuno |
| `it5-s-m3` Il robot della nonna | berättelse (läs) | 59 | 94,9 % | aspirapolvere, regalato, adesso |
| `it5-r-m2` Mail alla segreteria del conservatorio | lästext (läs) | 262 | 95,0 % | oggetto, iscrivermi, triennio, presso, alcune, aiutarmi, valido, rivolgermi |
| `it5-r-m1` Giovani e lavoro: restare o partire? | lästext (läs) | 305 | 95,1 % | continuano, chiedermi, simile, quasi, poco, decine, migliaia, semplice |
| `it5-r-m6` Recensione: «Il fu Mattia Pascal» | lästext (läs) | 288 | 95,1 % | quasi ×2, nessuno, infelice, grossa, documenti, esistere, ognuno, liberarsene |
| `it5-le-2` Lo spreco alimentare | prov (läs) | 167 | 95,2 % | tonnellate, avviene, confondono, dicitura, indica, rende, oltre, esperti |
| `it5-s-m7` Il violino | berättelse (läs) | 63 | 95,2 % | adesso, sentirmi, fiero |
| `it5-s-m8` Niente sprechi | berättelse (läs) | 69 | 95,7 % | siede, frittate, polpette |
| `it5-c-m4-ssn` Il Servizio Sanitario Nazionale | kultur (läs) | 94 | 95,7 % | ognuno, gratuite, riconoscibili, alcune |
| `it5-c-m1-costituzione` Una Repubblica fondata sul lavoro | kultur (läs) | 97 | 95,9 % | sufficiente, tiene, promesse, valgano |
| `it5-le-1` Un anno in un conservatorio italiano | prov (läs) | 197 | 95,9 % | sentirmi, pensassi, affinché, complimenti, qui, esigente, online, poche |
| `it5-le-4` L'intelligenza artificiale a scuola | prov (läs) | 126 | 96,0 % | alcuni ×2, professoressa, diventino, piuttosto |
| `it5-c-m7-opera` L'opera, un'invenzione italiana | kultur (läs) | 102 | 96,1 % | intellettuali, greco, umanità, composizione |
| `it5-r-m3` Perché dimentichiamo? | lästext (läs) | 289 | 96,2 % | stanza, riuscirebbe, alcune, soprattutto, conferma, obbliga, rende, inutili |
| `it5-s-m5` La promessa | berättelse (läs) | 62 | 96,8 % | duro, ricevette |
| `it5-c-m5-emigrazione` Un popolo di emigranti | kultur (läs) | 110 | 97,3 % | soprattutto, quasi, residenti |
| `it5-c-m2-bologna` L'Università di Bologna | kultur (läs) | 90 | 97,8 % | considerata, occidentale |

### it6: 43 av 54 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it6-l-h3-2` Guida al museo: Falcone e Borsellino | hörtext (hör) | 241 | 86,7 % | palermitani ×2, alcuni ×2, ucciso ×2, agenti ×2, terreni ×2, dedicata, contro, cresciuti |
| `it6-s-h2` La notizia falsa | berättelse (läs) | 74 | 87,8 % | centinaia, mandò, subito, chat, dichiarò, chiusura, qualcuno, vergognò |
| `it6-le-3` Lettera: una lamentela formale | prov (läs) | 109 | 88,1 % | spett, esprimere, disappunto, trascorso, presso, struttura, assegnata, stanza |
| `it6-l-h6-1` Visita guidata: la cupola di Brunelleschi | hörtext (hör) | 256 | 89,1 % | costruire ×2, vedete, costruita, coprirla, chiudere, metri, esistevano, costruzione |
| `it6-r-h3-1` Storia: la spedizione dei Mille | lästext (läs) | 326 | 89,9 % | quasi ×2, borbonico ×2, bordo, poco, li, combattuto, romana, esisteva |
| `it6-s-h1` Il colloquio | berättelse (läs) | 95 | 90,5 % | benché, tremavano, direttrice, domandarono, troppo, perfezionista, uscii, ricevetti |
| `it6-s-h4` Una notte con Dante | berättelse (läs) | 76 | 90,8 % | quinto, addormentò, avvicinò, ammise, quasi, cominciò, svegliò |
| `it6-as-1` Messaggi in segreteria | prov (hör) | 103 | 91,3 % | documento, inviarcela, mail, altrimenti, inserirla, trasporti, domicilio, sospeso |
| `it6-s-h6` Il restauro | berättelse (läs) | 84 | 91,7 % | impalcatura, pochi, scuro, notò, nascosta, invisibile, comparve |
| `it6-as-3` Annuncio in stazione e in museo | prov (hör) | 84 | 91,7 % | anziché, disagio, visitatori, chiuderà, dirigervi, prorogata, gratuito |
| `it6-as-2` Intervista radiofonica: un giovane viticoltore | prov (hör) | 122 | 91,8 % | vigna ×2, ammalato, venduta, difficilissimo, quasi, enologia, sospetto, vendo |
| `it6-s-h7` Il portafoglio | berättelse (läs) | 80 | 92,5 % | portafoglio ×2, trovò, documento, chiamò, soldi |
| `it6-r-h3-2` La Costituzione: i primi articoli | lästext (läs) | 187 | 92,5 % | contengono, fondamentali, alcuni, appartiene, limiti, ciascuno, netta, distinzione |
| `it6-c-h1` Il concorso pubblico | kultur (läs) | 89 | 93,3 % | ottengono, inserito, migliaia, poche, decine, soprattutto |
| `it6-r-h6-2` Caravaggio: il pittore della luce | lästext (läs) | 383 | 93,5 % | quasi ×3, soldi ×2, poco, pochi, diventò, discusso, alcuni, stanze |
| `it6-l-h4-1` Podcast: perché leggere ancora Dante? | hörtext (hör) | 279 | 93,5 % | bentornati, tasca, scelse, perfino, costargli, rende, quinto, li |
| `it6-l-h7-2` Conferenza: che cos'è una vita buona? | hörtext (hör) | 237 | 93,7 % | soldi ×2, davano, consisteva, eppure, centinaia, relazioni, contino, oltre |
| `it6-r-h2-1` Opinione: elogio del giornalismo lento | lästext (läs) | 289 | 93,8 % | pochi ×3, decine, moltissimo, eppure, qualcuno, chiedesse, semplice, alcune |
| `it6-r-h4-1` Leopardi: L'infinito | lästext (läs) | 264 | 93,9 % | monte, profondissima, ove, poco, comparando, evidente, limite, stimolo |
| `it6-r-h8-1` Reportage: case a un euro | lästext (läs) | 301 | 94,0 % | vendere ×2, poco, qui, gran, centinaia, impegnassero, migliaia, mail |
| `it6-l-h5-1` Radio: cento anni di Sei personaggi | hörtext (hör) | 269 | 94,1 % | pochi ×2, gridava, dovette, li, qualcuno, discussione, reale, ricevette |
| `it6-l-h5-2` Recensione radio: un film da vedere | hörtext (hör) | 226 | 94,2 % | quasi ×2, amanti, finché, bravissimi, soprattutto, menzione, sorprendente, sottotitolati |
| `it6-c-h6` L'articolo 9 | kultur (läs) | 71 | 94,4 % | artistico, nazione, qualsiasi, continue |
| `it6-r-h7-2` Filosofia per ragazzi: si può mentire a fin di bene? | lästext (läs) | 362 | 94,5 % | situazione ×2, ve, felicissima, rispondete, direbbe, qualcuno, chiara, agire |
| `it6-l-h8-2` Radio: il turismo delle radici | hörtext (hör) | 225 | 94,7 % | visitatori ×2, migliaia, normali, alcuni, perfino, dedicati, numerose, alcune |
| `it6-s-h5` Il provino | berättelse (läs) | 75 | 94,7 % | presentò, provino, terminata, sebbene |
| `it6-r-h6-1` Dibattito: Venezia a pagamento? | lästext (läs) | 283 | 94,7 % | veneziani ×2, alcune, diviso, esperti, chiudono, aprono, risolverà, preoccupazione |
| `it6-l-h6-2` Podcast: il Bosco verticale | hörtext (hör) | 214 | 94,9 % | completate, progettisti, riduce, moltissimo, percezione, alcuni, quindicesimo, qualcuno |
| `it6-r-h8-2` Lettera al giornale: il mio dialetto non è una vergogna | lästext (läs) | 380 | 95,5 % | soltanto ×2, rendo, contengono, termini, tipi, diversamente, alcuni, eppure |
| `it6-r-h2-2` Intervista: il mestiere del giornalista oggi | lästext (läs) | 360 | 95,6 % | pochi, continuamente, network, pericolo, soprattutto, qualcuno, soldi, permetterselo |
| `it6-s-h8` L'estate dal nonno | berättelse (läs) | 68 | 95,6 % | cominciai, imparassi, ripartii |
| `it6-c-h3` Il 25 aprile | kultur (läs) | 93 | 95,7 % | proclamò, probabilmente, soprattutto, alcuni |
| `it6-r-h1-2` Inchiesta: i giovani e il lavoro all'estero | lästext (läs) | 386 | 95,9 % | soprattutto ×2, alcune ×2, termine, conosciuto, vizioso, interviene, subito, svuotarsi |
| `it6-r-h7-1` Un classico: Beccaria contro la pena di morte | lästext (läs) | 291 | 95,9 % | semplice, uomini, criminale, moderata, terribile, uccide, commettessero, tradotto |
| `it6-le-1` Annunci: corsi estivi | prov (läs) | 125 | 96,0 % | strumentisti, meritevoli, spiagge, vitto, gratuiti |
| `it6-r-h4-2` Dante: l'inizio della Commedia | lästext (läs) | 235 | 96,2 % | quasi, li, ritrovai, durasse, verbo, indica, confusione, trapassato |
| `it6-le-2` Articolo: la biblioteca aperta di notte | prov (läs) | 144 | 96,5 % | chiudesse, presenze, alcuni, troppo, poco |
| `it6-c-h2` La RAI e il canone | kultur (läs) | 89 | 96,6 % | radiotelevisivo, cominciò, contribuì |
| `it6-r-h5-1` Teatro: La maschera (scena originale) | lästext (läs) | 308 | 97,1 % | vederla, glielo, ammalò, dovette, credette, logiche, saprei, bruciato |
| `it6-r-h1-1` Lettera di candidatura: un tirocinio al festival | lästext (läs) | 304 | 97,4 % | spett, proporre, dedicare, particolare, contribuire, riteniate, videochiamata, direttrice |
| `it6-s-h3` La nonna e il referendum | berättelse (läs) | 76 | 97,4 % | unì, monarchico |
| `it6-c-h5` Il neorealismo | kultur (läs) | 86 | 97,7 % | alcuni, indiano |
| `it6-c-h7` Il liceo e la filosofia | kultur (läs) | 86 | 97,7 % | porsi, troppo |

### it7: 33 av 39 texter under gränsen

| Text | Typ | Ord | Täckning | Vanligaste okända ord |
|---|---|---:|---:|---|
| `it7-s-t7` Il primo esame | berättelse (läs) | 54 | 87,0 % | svegliò, domandò, aggiunse, dettaglio, annuì, chiamò, subito |
| `it7-ex-asc-3` Radio: il caffè sospeso | prov (hör) | 72 | 87,5 % | sospeso ×3, esiste, permetterselo, quasi, scomparsa, esistono, sospesa |
| `it7-s-t3` Il contratto | berättelse (läs) | 65 | 90,8 % | cercò, subito, stanza, scoprì, cifra, tipo |
| `it7-ex-let-1` Il ritorno dei borghi | prov (läs) | 127 | 91,3 % | alcuni ×2, trasformato, sparse, vendono, ristrutturi, esperti, trasporti, vendere |
| `it7-r-t2` Rita Levi-Montalcini, una vita per la ricerca | lästext (läs) | 367 | 91,6 % | convinse ×2, trasferì ×2, dedicarsi ×2, ebrea, studiassero, laureò, arrese, nascosto |
| `it7-s-t5` Il discorso | berättelse (läs) | 60 | 91,7 % | salì, cominciò, conoscesse, ognuno, sembrò |
| `it7-r-t3` Contratto di locazione per studenti (estratto) | lästext (läs) | 418 | 91,9 % | conduttrice ×11, stanza ×5, iscritta ×2, concede, tacitamente, mensile, restituito, dandone |
| `it7-l-t8` Lezione: la nascita dell'opera | hörtext (hör) | 264 | 92,0 % | pochi ×2, divenne ×2, cosiddetta, greca, interamente, aprì, chiunque, pagasse |
| `it7-l-t1` Lezione: che cos'è una buona argomentazione? | hörtext (hör) | 299 | 92,6 % | qualcuno ×2, cosiddetto ×2, logica, distinguere, particolare, osservò, qualcosa, supponiamo |
| `it7-ex-let-2` Leggere in digitale | prov (läs) | 97 | 92,8 % | suggerisce, informativi, superficialità, scorrere, curiosamente, ottengono, profonda |
| `it7-l-t7` Benvenuto alle matricole | hörtext (hör) | 280 | 92,9 % | qui ×3, lì, chiudono, dirvi, qualcosa, insegnò, intera, esclusivamente |
| `it7-s-t4` La fabbrica | berättelse (läs) | 58 | 93,1 % | eppure, partecipò, cambiasse, fabbrica |
| `it7-l-t6` Podcast: Deledda, la Sardegna e il Nobel | hörtext (hör) | 283 | 93,3 % | quasi ×3, eppure ×2, pochissimo, frequentò, reagì, scrittura, trasferì, espiare |
| `it7-s-t8` La prima alla Scala | berättelse (läs) | 62 | 93,5 % | tremavano, rumoreggiava, alzò, esistesse |
| `it7-s-t2` La scoperta di Anna | berättelse (läs) | 66 | 93,9 % | notò, strano, arrese, uscì |
| `it7-s-t6` Il ritratto | berättelse (läs) | 66 | 93,9 % | ricco, accettò, consegnasse, esista |
| `it7-l-t2` Lezione: correlazione e causalità | hörtext (hör) | 265 | 94,0 % | renda, probabilmente, esiste, ricchi, alcuni, cardiache, conclusero, opposto |
| `it7-ex-let-3` Due opinioni sul numero chiuso | prov (läs) | 84 | 94,0 % | bravissimi, esclusi, frustrazione, tipo, valutare |
| `it7-c-t2-galileo` Galileo e il metodo scientifico | kultur (läs) | 101 | 94,1 % | intorno ×2, costruì, considerava, dovette, passò |
| `it7-c-t7-bologna` L'università più antica del mondo occidentale | kultur (läs) | 103 | 94,2 % | considerata, occidentale, nazioni, qui, creò, superiore |
| `it7-r-t8-2` Puccini e la Tosca: il verismo in musica | lästext (läs) | 364 | 94,2 % | alba ×2, qualcuno, esplose, troppo, violenta, lottò, ama, fuggire |
| `it7-r-t6` Pirandello e il fu Mattia Pascal | lästext (läs) | 418 | 94,3 % | poche, frase, nemmeno, ama, fugge, grossa, documenti, esistere |
| `it7-r-t4` Il divario tra Nord e Sud: un'analisi | lästext (läs) | 366 | 94,3 % | quasi ×2, alcuni ×2, diviso, discusse, economisti, infrastrutture, istituzioni, decine |
| `it7-r-t5` Anatomia di un discorso politico | lästext (läs) | 355 | 94,9 % | rende, considera, logicamente, promise, sudore, rassicurare, conquistò, nazione |
| `it7-r-t1` Saggio: l'elogio del dubbio | lästext (läs) | 378 | 95,0 % | eppure ×2, cartesio, apparisse, qualcuno, agisce, confonde, difendere, disposto |
| `it7-c-t8-verdi` Verdi, voce di una nazione | kultur (läs) | 104 | 95,2 % | presentò, privatamente, ebrei, divenne, muri |
| `it7-c-t3-costituzione` La Costituzione italiana | kultur (läs) | 96 | 95,8 % | eletta, nazione, modificare, ciascuna |
| `it7-r-t7` Come funziona l'università in Italia: guida per studenti stranieri | lästext (läs) | 363 | 95,9 % | alcune ×2, alcuni, durano, esiste, soprattutto, riservato, eccellenti, particolarità |
| `it7-r-t8` Ammissione al conservatorio: informazioni per candidati stranieri | lästext (läs) | 366 | 95,9 % | fase ×2, documento, riconosciuta, possiede, chiaramente, presenza, pianista, accompagnatore |
| `it7-c-t4-miracolo` Il miracolo economico | kultur (läs) | 105 | 96,2 % | gran, pochi, automobile, costruite |
| `it7-c-t1-machiavelli` Machiavelli e il realismo politico | kultur (läs) | 117 | 96,6 % | conquista, considerato, amato, aggettivo |
| `it7-s-t1` Il filosofo e il mercante | berättelse (läs) | 59 | 96,6 % | denaro, guardò |
| `it7-c-t6-pirandello` Pirandello e le maschere | kultur (läs) | 108 | 97,2 % | ricevette, ognuno, pochi |

