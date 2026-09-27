# Klart från backloggen

Punkter som har flyttats från [`BACKLOG.md`](BACKLOG.md) när de byggdes. **Referens** anger backloggens rubrik och prioritet. **Commit** anger var ändringen finns i git. **Publicerat** anger versionen av artefakten på https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP.

## 2026-09-27, del 3 (publicerat som version 10)

| Referens | Vad som byggdes | Commit |
|---|---|---|
| Önskemål från föräldern: *två lägen, bok och utan bok* (ersätter Tyska · P3 *Om flickvännens lärobok fotas* som arbetssätt) | Kapitel kan märkas som bokkapitel (`#id|Namn|bok`). Franska 3 är kopplad till *Escalade*. Startsidan har panelen **Boken → Vi läser nu**, där eleven väljer kapitlet klassen läser. Nya ord, texter och övningar tas då först från det kapitlet, och appen föreslår nästa kapitel när alla ord är påbörjade. "Nya ord från" är uppdelat i Boken och Allmänt. Bokmaterial kan ligga i en privat mapp `languages/<kod>/book/` som byggs in men inte hamnar i det publika repot. Arbetssättet för att fota och föra in kapitel står i `docs/BOK.md`. | se nedan |

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
