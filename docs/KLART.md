# Klart från backloggen

Punkter som har flyttats från [`BACKLOG.md`](BACKLOG.md) när de byggdes. **Referens** anger backloggens rubrik och prioritet. **Commit** anger var ändringen finns i git. **Publicerat** anger versionen av artefakten på https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP.

## 2026-09-28, del 4 (publicerat som version 24)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Färre men mer värdefulla övningar · *Ordning på nya ord* (delvis), förälderns beslut: "eleven ska välja musikteorin som område" | Musikteorins avsnitt (mt1–mt7) i Franska 3 och Tyska 5 är valfria (`elective` i `lang.js`). "Nästa ord i ordlistan" och Dagens pass tar inga nya ord därifrån. I "Nya ord från" ligger de i en egen grupp, "Musikteori · bara när du väljer det", och i kapitelkartan visas de sist och räknas inte in i "x av y kapitel klara" eller i förslaget att gå vidare till nästa kurs. Ord som redan är påbörjade repeteras som vanligt, och teoriprovet finns kvar. | se git log |

## 2026-09-28, del 3 (publicerat som version 23)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P2 *Alla tre språken från steg 1 till steg 7*: **Franska 4** | Ny kurs `fr4` (steg 6, B1, DELF B1), utan lärobok, efter kursmallen: 1 045 ord i 8 kapitel (Études et avenir, Médias, Environnement, Arts et musique, Vivre ailleurs, Histoire et mémoire, Santé et sport, Éthique et francophonie) och 69 fraser för att argumentera, utan ord från Franska 3 eller Escalade. 9 grammatikområden med 268 frågor och regelsidor (subjonctif, si-satser, futur antérieur, lequel/auquel/duquel, indirekt tal, mise en relief, gérondif, passiv, bindeord), 16 hörtexter, 16 lästexter, 8 berättelser, 10 kulturtexter, 24 skrivuppgifter, 45 samtalsfraser, kapitelmål, uttal, 3 verbspel och 15 DELF B1-uppgifter. Egen sparnyckel `glosor-fr4-v1`. | se nedan |
| Kurser · P2 *Alla tre språken från steg 1 till steg 7*: **Tyska 6** | Ny kurs `de6` (steg 6, B1 → B2, Goethe B2), med samma delar: 1 109 ord (Studium und Bewerbung, Wissenschaft, Politik und Geschichte, Literatur und Epochen, Arbeit, Musik und Bühne, Ethik, Stadt/Land/Migration) och 70 Redemittel, utan ord från Tyska 4 och 5. 10 grammatikområden med 309 frågor (Konjunktiv I och indirekt tal, Konjunktiv II i dåtid, passivomskrivningar, particip som attribut, nominalstil, Nomen-Verb-Verbindungen, genitivprepositioner, modalpartiklar, subjektiva modalverb, textbindning), 16 hörtexter, 14 lästexter, 8 berättelser, 9 kulturtexter, 24 skrivuppgifter (8 i Goethe B2-format), 45 fraser, kapitelmål, uttal, 3 verbspel och 15 Goethe B2-uppgifter. Tyska 5 föreslår Tyska 6 när den är klar. Egen sparnyckel `glosor-de6-v1`. | se nedan |
| Önskemål från föräldern: *granska övningarna* | En genomgång av alla cirka 20 övningar mot forskningen om inlärning. Förslagen står i BACKLOG.md under "Färre men mer värdefulla övningar" och väntar på förälderns svar. | – |

Italienska 3 står nu som kommande kurs. "Hitta felet" hoppar över tempusbyten i franskt indirekt tal, eftersom de går att försvara i talspråk. Testerna har 185 kontroller.

## 2026-09-28, del 2 (publicerat som version 22)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *statistik per dag* | Statistiken har en ny panel, "Dag för dag": minuter, frågor, rätt och nya ord i dag, dagar i rad, ett stapeldiagram över minuter per dag de senaste 28 dagarna (med detaljer vid hovring) och en tabell. | `0c239ea` |
| Önskemål från föräldern: *hur långt man kommit i kapitlen* | Rullistorna "Nya ord från" och "Vi läser nu" visar hur långt man har kommit i varje kapitel (▰▰▱▱▱ 40 %, ord kvar, ✓ klart). Under listan finns "Hur långt har jag kommit?", en kapitelkarta med en stapel per kapitel (kan, på väg, kvar). Kapitlet man läser är markerat, och man väljer ett kapitel genom att trycka på det. | `0c239ea` |
| Önskemål från föräldern: *musikteori till det skriftliga teoriprovet* (Språkprov · P1) | Sju nya avsnitt (mt1–mt7) med musikteori på målspråket: 396 ord i franskan och 392 i Tyska 5. Orden bygger på riktiga antagningsprov (CNSMD Paris och Lyon; HfM Weimar, Karlsruhe, Folkwang och UdK Berlin) och omfattar noter, rytm, intervall, skalor, ackord, harmonik, form, föredragsbeteckningar och provinstruktioner. Ny övning, "Teoriprovet": 100 uppgifter per språk i provets form ("Bestimmen Sie das Intervall e–b", "Quelle est la sensible en ré mineur ?"). | `002027c` |
| Kurser · kursmallen paket 18 | Tyska 5: genitiv och n-deklination, particip som adjektiv och tvådelade bindeord, sammanlagt 80 frågor med regelsidor. | `002027c` |
| Kurser · kursmallen paket 12 och 19 | Tyska 4: 7 nya hörtexter (telefonsamtal, utrop, radioinslag, intervju), 160 nya ord (711 totalt) och provträning för Goethe-Zertifikat B1 (15 uppgifter i provets format). | `002027c` |
| Kurser · kursmallen paket 11 | Litteratur i alla kurser (16 inslag). Fria dikter och sagor återges i sin helhet, bland andra Apollinaire, La Fontaine, Verlaine, Goethe, Rilke, Kafka, Busch, Grimm och Collodi, och är kontrollerade mot Wikisource. Nutida sånger blir skrivuppgifter utan sångtext. | `002027c` |

## 2026-09-28 (publicerat som version 21)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Rapport från eleven i tyska: *luckan med Beziehung* | I luckövningen räknas svaret som rätt även när eleven skriver artikeln en gång till ("die Beziehung" när artikeln redan står före luckan). | `df9a802` |
| Kurser · P2 *Grammatikområden från bokens minigrammatik* (första delen) | Sju nya områden i franskan, med regelsidor som hänvisar till bokens sidor: futur (35 frågor), conditionnel (25), imparfait eller passé composé (40), plus-que-parfait och venir de (25), betonade pronomen (25), imperativ (25) och reflexiva verb (20). Franskan har nu 20 områden och 907 grammatikfrågor. Tempusfrågor där felet kan försvaras i talspråk visas inte i "Hitta felet". | `df9a802` |
| Kurser · P1 *Franska 3 som mall* | `docs/kursmall.md`: hur ett kapitel i Escalade är uppbyggt (utan bokens text), en checklista för kurser, nivåer steg 1–7 enligt Skolverket och en jämförelse per kurs. Utfyllt enligt mallen: Tyska 4 (17 skrivuppgifter, 2 lästexter, 2 berättelser, 1 kulturtext), Tyska 5 (15 skrivuppgifter i Goethe B2-format, 3 kulturtexter, 4 hörtexter som inte är dialoger, 4 lästexter av nya typer), Italienska 1 (3 lästexter, 4 berättelser, 3 kulturtexter, 10 skrivuppgifter, grammatik för subjektspronomen och questo/quello) och Italienska 2 (2 lästexter, 3 berättelser, 4 kulturtexter, 11 skrivuppgifter). | `df9a802` |
| Kursmallen · *kapitelmål* | Ny innehållstyp `mal.json`: 3–5 mål per kapitel ("Jag kan …") i alla fem kurser, sammanlagt 220 mål. De visas på startsidan för kapitlet man är på och kan bockas av (`S.mal`). | `df9a802` |
| Kursmallen · *uttal* | Ny övning "Uttal: lyssna och välj" (`uttal.json`): ord som låter nästan lika, 33 set i fem kurser. Ett ord läses upp och man väljer vilket det var. | `df9a802` |
| Kursmallen · *nivåer* | Nivåerna följer Skolverkets ungefärliga GERS-nivåer: Franska 3 A2 (provmålet B1 står kvar), Tyska 4 A2 → B1, Italienska 2 A1 → A2, Franska 4 A2 → B1, Tyska 6 B1 → B2. | `df9a802` |

## 2026-09-27, del 12 (publicerat som version 20)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till (eleven i franska): *tangentbordet* | Mellanslag eller Enter går till nästa ord när man lär sig nya ord, ← går tillbaka. Siffrorna väljer svar i flerval och Fel/Nästan/Rätt vid självbedömning. Enter går alltid vidare efter ett svar. En rad om tangentbordet visas på datorer. | `0310185` |
| Tyck till (eleven i franska): *repetition i dagar* (ersätter P2 *FSRS*, som nu är P3) | Nytt schema: nästa pass, efter 3 pass, sedan efter 3, 7 och 20 dagar, och ord man kan efter 45 och 90 dagar (`x.dd`). Ord i det gamla schemat går över när de repeteras nästa gång. Prognosen i statistiken visar dagar. | `0310185` |
| Tyck till (eleven i franska): *kapitelprov* | Fler övningar → Kapitelprov: alla glosor i ett kapitel (alla avsnitt k3, k3b, k3x …) en gång, skriva eller flerval, utan omtag. Resultatet sparas i `S.kt` och påverkar inte schemat. Efteråt kan man öva på de missade orden (med omtag) eller göra om provet. | `0310185` |
| Tyck till (eleven i franska): *ursprung på svenska och ordagranna fraser* (Ord · P1) | Alla främmande ord i ursprungsfältet har fått svensk betydelse (ca 1 100 tillägg i alla kurser). Nytt sjunde fält i words.txt, "Ordagrant", för 535 fraser och talesätt (ordet för ordet med svensk betydelse), som visas på lärokortet och när man svarar fel. | `0310185` (och bokrepot) |
| Kurser · P1 *Escalade*: fler sidor | s. 26–37 (kap 2), s. 114–127 (kap 8, "Voyager dans le monde"), s. 148–153 (antaget kap 10) och s. 182–191 (kap 12). Franska 3 har nu 976 ord, 29 lästexter, 88 skrivuppgifter och 310 av bokens övningar. "Chanson simple" och "Être aimé" är skrivuppgifter, inte avskrivna. | `0310185` (och bokrepot) |
| Kurser · *bokens minigrammatik* | s. 194–199 och 202–237 fotade och sammanfattade (privat). Reglerna i `fr/content/regler.json` hänvisar till bokens sidor, använder bokens termer och har rättats på några punkter (mon/ma framför adjektiv, kongruens i reflexiva verb, betonade tips som inte syntes). Saknade grammatikområden ligger i backloggen. | `0310185` |

## 2026-09-27, del 11 (publicerat som version 19)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P1 *Escalade*: fler kapitel (foton från föräldern) | 21 nya uppslag inlagda i den privata bokmappen: kap 1 (s. 8–21), kap 2 (s. 22–25, 38–39), kap 5 (s. 68–69), kap 6 (s. 98–99), kap 7 (s. 100–113) och kap 8 (s. 128–131; kapitelnumret är antaget). Franska 3 har nu 687 ord, 22 lästexter, 58 skrivuppgifter och 173 av bokens övningar. Sångtexter, dikter och längre romanutdrag skrivs inte av (upphovsrätt). De blir skrivuppgifter med bokens frågor och en uppmaning att lyssna på sången eller läsa i boken, och sångtexten i kap 4 är ersatt på samma sätt. Grammatikområdena är kopplade till kapitlen, och Bokens övningar visar bara övningarna i kapitlet eleven läser (fältet `kap` kommer från mappen). | `a878194` (och det privata bokrepot) |

## 2026-09-27, del 10 (publicerat som version 18)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *arkitektgenomgång, data separat* (ersätter Kurser · P2 *Säkerhetskopiera book/* delvis) | Kursernas data ligger nu i egna filer, `data/<kod>.json`, som publiceras bredvid sidan och hämtas först när kursen väljs. Sidan har krympt från 2,8 MB till 270 kB plus den kurs man använder. Bokmaterialet ligger i en mapp per kapitel (`book/kapNN/` med foton, glosor och övningar) och har en sidförteckning, `book/sidor.json`. Bokmappen är ett eget lokalt git-repo. Bygget kontrollerar att id:n är unika inom varje innehållstyp. Testerna kör också den publicerade sidan via en lokal webbserver. Översikten finns i `docs/ARKITEKTUR.md`. | `4ff611c` |

## 2026-09-27, del 9 (publicerat som version 17)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *Italienska 1 och 2* | Två nya kurser, `languages/it1/` (A1, Moderna språk 1 / nybörjare nivå 1) och `languages/it2/` (A2, Moderna språk 2 / grund nivå 1), med egna sparnycklar `glosor-it1-v1` och `glosor-it2-v1`. Underlaget i `docs/italienska-plan.md` bygger på Skolverkets kursplaner, teman och progression i svenska läromedel (Ciao, Prego, Adesso sì, Comunicare, Allora, Digilär) och italienska nivåbeskrivningar. Italienska 1: 536 ord i 8 kapitel och fraser, 242 grammatikfrågor i 12 områden och verbspel i presens. Italienska 2: 531 nya ord, 285 grammatikfrågor i 14 områden och verbspel i passato prossimo, imperfetto, futuro och condizionale. Båda har hörtexter, lästexter, kultur, berättelser, fraser, skrivuppgifter och videor. Artikeln behövs inte i svaret. | `be8241e` |
| Önskemål från föräldern: *grammatikregler före övningarna* | Varje grammatikområde har en regelsida (`content/regler.json`, format i `docs/REGLER-SPEC.md`) med förklaring, tabeller, exempel och tips. Den visas när man väljer området och går att öppna efter varje svar. Finns för alla kurser. | `be8241e` |
| Önskemål från föräldern: *Dagens pass försvinner när det är gjort* | Rutan Dagens pass visas inte när dagens pass är gjort. Den kommer tillbaka nästa dag. | `be8241e` |
| Önskemål från föräldern: *kontrollfrågor i Tyck till* | Om ett meddelande är otydligt ställer Claude 1–3 ja/nej-frågor innan det skickas. Svaren sparas med meddelandet (`qa`). Tydliga meddelanden skickas direkt. | `be8241e` |
| Önskemål från föräldern: *fortsätta eller börja om* | Varje övning sparar sin påbörjade runda (`S.runs`). Den som avbryter och sedan öppnar övningen igen får välja "Fortsätt där du slutade" eller "Börja om från början". | `be8241e` |
| Tyck till: önskemål från eleven i Franska 3, *ljud av/på* | Knappen "Ljud på / Ljud av" i sidhuvudet syns på alla sidor och stänger av all uppläsning. Valet sparas i webbläsaren. | `be8241e` |

## 2026-09-27, del 8 (publicerat som version 16)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyck till · P1 *Tydligare gruppering av övningarna* (önskemål från eleven i Franska 3) | "Fler övningar" på startsidan visar fem knappar: Ord och meningar, Lyssna och läsa, Grammatik, Språkprov och Tala och skriva. Varje knapp öppnar en egen sida med gruppens övningar. Eleven har fått svar i Tyck till. | `961594f` |
| Önskemål från föräldern: *bokens egna texter och övningar* (Kurser · P1 *Escalade*) | Fotona av s. 40–67 är sparade i den privata mappen `languages/fr/book/foton/`. Bokens texter och övningar är inskrivna i `book/content/`, som inte finns i det publika repot. Det blev 8 lästexter med svensk översättning, glosor och frågor (bokens Vrai ou faux där det finns), 17 skrivuppgifter av bokens öppna frågor och diskussionsfrågor (med Claudes kommentarer) och 116 frågor under Grammatik → Bokens övningar (översätt, fyll i, stor bokstav, à + le, possessiva). Bokens övningar kommer först när kapitel 3 eller 4 är valt. Hörövningar som kräver bokens ljud och övningar som bara går att göra i par är inte med. Arbetssättet står i `docs/BOK.md`. | `1e550a2` |

## 2026-09-27, del 7 (publicerat som version 15)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Språkprov · P1 *Provövningar i provets format* | Provträning under "Fler övningar → Språkprov". Uppgifterna ligger i `content/exam.json` och är skrivna för appen i provets stil, inte officiellt material. **Goethe B2** (Tyska 5) har 16 uppgifter: Lesen Teil 1–5, Hören Teil 1–4, Schreiben med Forumsbeitrag och formellt mejl, och Sprechen med Vortrag och Diskussion. **DELF B1** (Franska 3) har 14 uppgifter: compréhension orale och écrite, production écrite och production orale. Läsa och lyssna visar alla frågor på en gång, med klocka och provets tid. Hörtexten får spelas så många gånger som på provet och visas först efteråt. Skriv- och taluppgifterna bedöms av Claude med provets kriterier (0–5 poäng per kriterium) och räknas om till procent mot gränsen för godkänt. Varje uppgift har ett exempelsvar som går att lyssna på. | `46d8855`, `2bd61c1` |
| Språkprov · P1 *Provsimulering* | En uppgift i läsa, lyssna och skriva efter varandra, med klocka. Resultatet jämförs med gränsen för godkänt (60 % för Goethe, 50 % för DELF) och sparas under "Tidigare simuleringar". Den muntliga delen ingår inte i simuleringen. | `46d8855` |
| Språkprov · P1 *Musikordförråd* | Franska: avsnittet *Musique et conservatoire* (68 ord och fraser, bland annat conservatoire, concours d'entrée, audition, solfège, le trac och 11 meningar för antagningsintervjun). Tyska 5: *Musik und Aufnahmeprüfung* (66, bland annat Vorspiel, Pflichtstück, Gehörbildung, Stimmlage, Eignungsprüfung och 10 intervjumeningar). Tyska 4 har grundläggande musikord i kapitel 6. | `46d8855` |

## 2026-09-27, del 6 (publicerat som version 14)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Nästa att bygga · P1 *Kursen Tyska 4* | Ny kurs `languages/de4/` med egen sparnyckel `glosor-de4-v1`, så att framstegen i Tyska 5 inte påverkas. 551 vanliga ord på nivå A2–B1 i 8 kapitel plus Redemittel, utan ord som redan finns i Tyska 5. Kapitel 6 har många musikord. 270 grammatikfrågor (prepositioner, perfekt och präteritum, als/wenn/dass/ob, ordföljd, relativsatser, reflexiva verb, Konjunktiv II, passiv, jämförelser) och adjektivändelser. 9 hörtexter, 6 lästexter (en om antagning till en Musikhochschule), 7 kulturtexter, 6 berättelser, 40 fraser, 7 skrivuppgifter och 23 videor. Verbspelen delar verb med Tyska 5 men saknar Konjunktiv I. Kursväljaren visar Tyska 4 före Tyska 5, och "Bara tyska" (tidigare "Bara Tyska 5") visar båda de tyska kurserna. Topplistan visar kursnamnet. När nästan alla ord i Tyska 4 är påbörjade och hälften sitter föreslår appen att gå vidare till Tyska 5. | `bc7c24a`, `e7d50ec` |
| Nästa att bygga · P1 *Feedback från eleverna* | Fliken **Tyck till**, där eleven väljer Önskemål, Krångligt, Något är fel eller Annat och skriver fritt. Meddelandet sparas i `feedback/<uid>-<tid>` i artefaktens db. Claude läser meddelandena och sätter status (Läst, Tillagt i backloggen, Byggt, Inte just nu) och ett svar, som eleven ser i samma flik. Mejl skickas bara om föräldern ber om det. | `bc7c24a` |

## 2026-09-27, del 5 (publicerat som version 13)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P1 *Nästa kapitel i Escalade* (kap 3–4, s. 40–67) | Glosor ur boken i den privata mappen `languages/fr/book/words.txt`: 57 nya ord till kap 3 (`k3x`) och 70 ord till kap 4 "L'Afrique et l'avenir" (`k4`), med sidnummer. Egna övningar till kap 4 (publika, inte avskrivna från boken): lästexten "Aminata Sow", hörtexten "Tu l'as lu ?", kulturtexterna "Le français en Afrique" och "L'île de Gorée", en berättelse, en skrivuppgift och 80 grammatikfrågor (possessiva pronomen, adjektivens böjning, stor/liten bokstav). Grammatikområdena är kopplade till bokens kapitel (`secs` i lang.js). När eleven läser kap 4 kommer pronomen, possessiva, stor bokstav och à + artikel först, och Blandad grammatik tar hälften av frågorna därifrån. | `a6a4ab4`, `6689292` |

## 2026-09-27, del 4 (publicerat som version 12)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *Claude kommenterar texterna* (ersätter Tyska · P2 *Återkoppling på skrivna texter utan lärare*) | Knappen "Få kommentarer av Claude" i skrivuppgifterna och i kultursvaren. Claude svarar på svenska med helhetsintryck, styrkor, de viktigaste felen (citat → rättning + regel), nästa steg, ungefärlig GERS-nivå och en bedömning mot språkprovet (DELF B1 respektive Goethe B2). Kommentaren sparas. Kapabiliteten `sample` är tillagd, och den som använder funktionen betalar med sin egen Claude-användning. | `485d3ff` |

## 2026-09-27, del 3 (publicerat som version 10)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *två lägen, bok och utan bok* (ersätter Tyska · P3 *Om flickvännens lärobok fotas* som arbetssätt) | Kapitel kan märkas som bokkapitel (`#id|Namn|bok`). Franska 3 är kopplad till *Escalade*. Startsidan har panelen **Boken → Vi läser nu**, där eleven väljer kapitlet klassen läser. Nya ord, texter och övningar tas då först från det kapitlet, och appen föreslår nästa kapitel när alla ord är påbörjade. "Nya ord från" är uppdelat i Boken och Allmänt. Bokmaterial kan ligga i en privat mapp `languages/<kod>/book/` som byggs in men inte hamnar i det publika repot. Arbetssättet för att fota och föra in kapitel står i `docs/BOK.md`. | `536499b` |

## 2026-09-27, del 2 (publicerat som version 8)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *välja alla ord i en text* (hör också till Repetition · P3 *Mina ord*) | I läs-, hör- och kulturtexterna går alla ord att trycka på, inte bara de som har en färdig översättning. Ett tryck till tar bort markeringen. De valda orden samlas i en lista längst ned på skärmen med grundform, betydelse och status ("Finns redan i Mina ord", "Du övar redan på ordet"). För ord utan översättning skriver man betydelsen själv. Sedan läggs alla till i Mina ord på en gång. Listan går att fälla ihop. | `0398a77` |
| Franska · P2 *Grammatikövningar för franska* | 322 frågor i `languages/fr/content/grammar-*.json` (format i `languages/fr/content/GRAMMATIK-SPEC.md`): objektspronomen, passé composé med être/avoir och kongruens, du/de la/de, prepositioner med länder och städer, qui/que/où/dont, subjonctif, si-satser, jämförelser, negation och frågor (de två sista med ordbrickor). Hitta felet och Blandad grammatik fungerar också. | `0398a77`, `75eea14` |
| Franska · P2 *Tatoeba-meningar* | `tools/tatoeba.py` hämtar upp till två korta meningar med svensk översättning per ord. Just nu finns 248 meningar till 136 ord. De används i diktamen, översättning och ordföljd, med källhänvisning (Tatoeba-id, användare, CC BY 2.0 FR). | `0398a77`, `a1e0679` |
| Tyska · P2 *Granskning av grammatikfrågorna* (delvis) | Knappen "Fel i frågan? Rapportera" finns efter varje svar. Rapporterna sparas i `reports/` i artefaktens db, där Claude kan läsa dem med ArtifactData. Själva granskningen av en lärare återstår. | `786f8cc` |
| Tyska · P2 *Större ordförråd, steg 2* (delvis) | Avsnittet Häufige Wörter: 300 vanliga ord som saknades, i frekvensordning (rang 301–2010 i FrequencyWords, CC BY-SA 4.0, med källhänvisning i words.txt). Ordlistan har nu 1 629 ord. | `d30137b` |
| Repetition · P3 *Egen minnesregel per svårt ord* | På lärokortet för ett svårt ord kan man skriva en egen minnesregel. Den visas sedan varje gång ordet kommer tillbaka. | `29a04f6` |
| Konton · P3 *Topplista med längre historik* | Vinnarna de fem senaste veckorna visas under "Tidigare veckor". | `75eea14` |

## 2026-09-27 (publicerat som version 6 och 7)

### Repetition och inlärning

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Repetition · P1 *Inlärda ord kommer aldrig tillbaka* | Steg 0–3 = lär sig, steg 4 och uppåt = kan. Ord man kan kommer tillbaka efter 40, 80 och 160 pass. Ett fel flyttar ordet ett steg ned, och ett ord man kunde går tillbaka till steg 2. Gamla ord med `due=1e9` får ett repetitionsdatum och sprids ut över kommande pass (`migrateRetired`). Högst 40 repetitioner per pass. Sparformatet `{s, due}` är detsamma. | `cb8f32e`, `99e8074` |
| Repetition · P2 *Markera "igel"-ord* | Ord med minst tre återfall (`lapses`), eller många fel, får märket "svårt ord" i quizet och ett tips på lärokortet (`isLeech`). | `0b135b8` |
| Repetition · P3 *prognos i statistiken* | Statistiken visar hur många ord som ska repeteras i de kommande sju passen. Självbedömning i fyra steg är **inte** byggd och ligger kvar i backloggen. | `fba307a` |
| Repetition · P3 *Mina ord* | Man kan lägga till egna ord under "Alla ord" och ta bort ord ur Mina ord (två tryck). Koppling mellan böjda former och grundformen är **inte** byggd. | `fba307a` |
| Repetition · P3 *Färgmarkera kända och okända ord* | I läs-, hör- och kulturtexterna är ord man redan övar på gröna, och sparade ord har heldragen understrykning. | `63a49b6` |

### Tyska

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Tyska · P1 *Grammatikövningar för tyska*, punkt 1–11 | Grammatikmotor (`src/grammar.js`) och 390 frågor i `languages/de/content/grammar-*.json`, med formatet beskrivet i `GRAMMATIK-SPEC.md`. `build.py` kontrollerar artiklar och relativpronomen mot tabeller. Områden: adjektivändelser (skapas ur ordlistans substantiv), kasus efter preposition, bisatsordföljd med ordbrickor, relativsatser, verb med preposition och da-/wo-ord, Konjunktiv II och indirekt tal, passiv, zu-infinitiv, perfekt med haben/sein och pluskvamperfekt, bindeord, samt Hitta felet och Blandad grammatik. Statistiken visar resultat per område och de regler man missar mest. Grammatik ingår också i Dagens pass. | `0b135b8`, `fba307a`, `2f3bc85` |
| Tyska · P1 *Innehåll till de nya övningstyperna* | 14 hörtexter, 8 lästexter, 10 kulturtexter, 8 berättelser (Präteritum/Perfekt och bindeord), 40 samtalsfraser och 9 skrivuppgifter. Dessutom tyska bindeord och tempusigenkänning för skrivchecklistan. | `664bda1`, `4ae527d` |
| Tyska · P2 *Större ordförråd* | Tre nya avsnitt: Allgemeiner Wortschatz B1–B2 (300 ord), Wortbildung (100) och Feste Verbindungen (100). Ordlistan har nu 1 329 ord. Ett frekvensordnat avsnitt från öppna källor (FrequencyWords, kaikki) är **inte** gjort och ligger kvar i backloggen. | `01466c0`, `9a1de2d` |
| Tyska · P2 *Spel för der/die/das och plural* | Spelet "der, die, das" med genus som flerval och plural som skrivfråga. Pluralen räknas fram ur ordlistans markeringar (`pluralOf`). Tumregler för genus visas efter svaret. | `0b135b8` |
| Tyska · P2 *Fler verb i de tyska verbspelen* | 12 fler verb i Präsens, 11 i Präteritum, 10 i Perfekt och 5 i Konjunktiv II, plus ett nytt spel "Mot B2: konjunktiv" med Konjunktiv I. Verben är handskrivna, inte hämtade från Wiktionary. | `a337a0f` |
| Tyska · P2 *Videor till kapitlet dv* | 4 klipp om verb med preposition och da-/wo-ord, kontrollerade med oEmbed. | `95dba3b` |

### Franska

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Franska · P2 *Fler verb och tempus inför B1* | Futur simple, conditionnel och subjonctif för 13 verb, i ett nytt verbspel "Mot B1". I subjonctif skrivs "que je …", och svaret godkänns både med och utan "que". | `cebc901` |

### Kurser, konton och topplista

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Kurser · P3 *Gy25-kursnamn* | Under Fler inställningar kan man välja läroplan (Gy11/Gy25). Kursnamnet visas därefter. | `fba307a` |
| Kurser · P3 *Välja vilka kurser man ser* | Inställningen "Bara Tyska 5" (eller Franska 3) döljer kursväljaren. Den sparas i webbläsaren. | `8fc1f96` |
| Konton · P3 *Loggen kapas vid 1 000 poster* | Äldre poster sammanfattas i `S.logOld`, så att total övningstid och antal dagar finns kvar. | `fba307a` |
| Konton · P3 *Topplista: veckans vinnare, historik och mål* | Förra veckans vinnare visas överst. Man kan sätta ett veckomål (60–150 minuter) som visas i Dagens pass och som "veckomålet klart ✓" i topplistan. Längre historik är **inte** byggd. | `f4b156a` |
| Teknik · P2 *GitHub* | Repot finns på https://github.com/hmariasvensson-cmd/glosor. | `6105b6a` |
| Teknik · P3 *Talövning* | Skuggning: lyssna, säg meningen högt samtidigt och bedöm själv. | `2f3bc85` |

### Övrigt som ändrades på vägen

- Introtexterna till berättelser och kultur hämtas från `lang.js`, så tyskan inte längre säger "Frankrike".
- Checklistan för skrivuppgifter känner igen kapitelord utan artikel, i plural och i böjd verbform. Den känner också igen Perfekt med particip utan ge- (studiert, verstanden, teilgenommen). Ett test kontrollerar att alla modelltexter klarar sin egen checklista.
- Sällan ändrade inställningar ligger under "Fler inställningar".
- Testerna har 73 kontroller.

### Att granska

Allt tyskt innehåll (grammatikfrågor, texter och nya ord) är skrivet av AI. Det har kontrollerats med skript och stickprov, och några tvetydiga felalternativ har rättats (till exempel indikativ i indirekt tal). En lärare eller tysktalande bör ändå läsa ett urval.
