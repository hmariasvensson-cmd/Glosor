# Klart från backloggen

Punkter som har flyttats från [`BACKLOG.md`](BACKLOG.md) när de byggdes. **Referens** anger backloggens rubrik och prioritet. **Commit** anger var ändringen finns i git. **Publicerat** anger versionen av artefakten på https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP.

## 2026-09-27, del 7 (publicerat som version 15)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Språkprov · P1 *Provövningar i provets format* | Provträning under "Fler övningar → Språkprov". Uppgifterna ligger i `content/exam.json` och är skrivna för appen i provets stil, inte officiellt material. **Goethe B2** (Tyska 5) har 16 uppgifter: Lesen Teil 1–5, Hören Teil 1–4, Schreiben med Forumsbeitrag och formellt mejl, och Sprechen med Vortrag och Diskussion. **DELF B1** (Franska 3) har 14 uppgifter: compréhension orale och écrite, production écrite och production orale. Läsa och lyssna visar alla frågor på en gång, med klocka och provets tid. Hörtexten får spelas så många gånger som på provet och visas först efteråt. Skriv- och taluppgifterna bedöms av Claude med provets kriterier (0–5 poäng per kriterium) och räknas om till procent mot gränsen för godkänt. Varje uppgift har ett exempelsvar som går att lyssna på. | `46d8855`, se nästa rad |
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
