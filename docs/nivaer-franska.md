# Franska steg 1–7: nivåer, innehåll och granskning

Underlag för att bygga franska från steg 1 till steg 7 (Moderna språk 1–7) och för att kontrollera de kurser som finns: Franska 3 (`fr`), Franska 4 (`fr4`) och Franska I på universitetet (`fru`). Kompletterar `docs/kursmall.md` (avsnitt 2, steg och GERS) och `docs/provformat.md` (DELF B1 och B2 i detalj). Skrivet 2026-09-29.

**Beslut 2026-09-29 (föräldern):** "Gör franska 4, 5 och 6 på rätt nivå, och franska för universitetet också på rätt nivå. Det blir överlapp, men det är ok. Det viktiga är att eleven vet vilken nivå de pluggar." Genomfört: kursen `fr4` heter nu **Franska 6** (`step: 6`, `level: "B1"`; koden och `storageKey` är kvar), nya Franska 4 och 5 har koderna `frs4` och `frs5`, och Franska I (`fru`) har `level: "B2"` och visas som "motsvarar steg 7". Kedjan: fr1 → fr2 → fr → frs4 → frs5 → fr4 → fru, ingen Franska 7. `fr4` fick egna områden för conditionnel passé, subjonctif passé och passé simple (känna igen), och `fru` fick nominalisering och stilnivåer samt medgivande. Namnet "Franska 4 (`fr4`)" nedan avser alltså dagens Franska 6. Övriga brister står i `docs/BACKLOG.md`.

## 1. Slutsatser i korthet

1. **Franska 4 (`fr4`) ligger på steg 6, inte steg 4.** Kursen är byggd för B1.2 (Moderna språk 6) enligt `lang.js` och `content/SPEC.md`. Namnet "Franska 4" betyder i skolan Moderna språk 4 (steg 4, A2.2). Kedjan i appen går alltså **steg 3 → steg 6**, och steg 4 och 5 saknas. En elev som går från Franska 3 till Franska 4 i appen hoppar över ungefär ett års progression (ca 1 000 ord och bl.a. subjonctif i vanliga fall, dubbla pronomen och si-satser).
2. **Franska 3 (`fr`) ligger på rätt nivå** (steg 3, A2.1) i ord, texter och skrivuppgifter. Grammatiken går längre än steget (subjonctif, si-satser och conditionnel finns redan, som förhandsvisning), vilket är bra för provmålet. Men **provträningen är DELF B1**, två steg över kursen: provtexterna är nästan dubbelt så långa som kursens lästexter. En mellannivå med DELF A2 saknas.
3. **Franska I (`fru`) motsvarar steg 7 (B2.1)** och fungerar som steg 7 i kedjan, med universitetsinriktning (litteratur, historia, terminologi). Ett separat gymnasialt steg 7 behövs bara om man vill ha en B2-kurs utan universitetsinnehåll.
4. **Det som behöver byggas:** Franska 1 (A1.1), Franska 2 (A1.2), ett riktigt steg 4 (A2.2) och steg 5 (B1.1). Fyra kurser, inte fem, om `fru` räknas som steg 7.
5. **Grammatik som i dag bara finns i `fru` men hör hemma tidigare:** dubbla pronomen (`me le`, `le lui`) och participets kongruens med avoir (steg 4–5), passiv (finns även i `fr4`) och verb + à/de + infinitiv (steg 4–5).

## 2. Vad krävs på varje GERS-nivå i franska

### 2.1 Källorna

- **CECR/GERS** (Europarådet 2001, *Volume complémentaire* 2020) beskriver vad man kan göra på varje nivå, men inte vilken grammatik eller vilka ord.
- **Référentiels** (Beacco m.fl., *Niveau A1 / A2 / B1 / B2 pour le français*, Didier 2004–2011) översätter GERS till franska: funktioner (*saluer, demander, exprimer son opinion*), allmänna begrepp, grammatik, ord och socialt språkbruk per nivå. Grammatiken nedan följer i huvudsak dem.
- **DELF/DALF** (France Éducation international) är de prov som mäter nivåerna.
- **Frekvensordlistor**: Lonsdale och Le Bras (2009), 5 000 vanligaste lemman ur en korpus på 23 miljoner ord, talad och skriven franska; Lexique 3 (New och Pallier), frekvenser ur filmundertexter och böcker; FLElex (François m.fl. 2014), ord per GERS-nivå ur läromedel i franska som främmande språk.

### 2.2 Nivåerna

| Nivå | Kan göra (GERS, förkortat) | Grammatik (Beacco, förenklat) | Ordförråd, ungefär |
|---|---|---|---|
| **A1** | presentera sig, fråga och svara om sig själv, förstå mycket enkla texter om välbekanta saker | présent av *être, avoir, aller, faire*, verb på -er; artiklar, genus och plural; adjektivets kongruens; possessiva (*mon, ma, mes*); *ne … pas*; frågor med intonation, *est-ce que* och frågeord; *il y a*; *je voudrais*; futur proche; tal, klockan, datum | 500–800 ord |
| **A2** | vardagliga transaktioner, berätta om erfarenheter i dåtid, enkla brev och meddelanden | passé composé (avoir/être) och imparfait (beskrivning); objektspronomen *le, lui*, *y, en*; betonade pronomen; *qui, que, où*; jämförelser; reflexiva verb; imperativ; *ne … jamais/rien/plus/personne*; conditionnel som artighet; *venir de, être en train de*; *depuis, il y a, pendant* | 1 000–2 000 |
| **B1** | klara det mesta på resa, berätta sammanhängande, ge och motivera åsikter, skriva personliga brev och enkla argumenterande texter | imparfait/passé composé i berättelse; plus-que-parfait; futur simple; conditionnel (önskan, råd, hypotes); *si* + imparfait → conditionnel; subjonctif présent i vanliga fall (*il faut que, vouloir que*, känslor); *dont, ce qui, ce que*; dubbla pronomen; gérondif; indirekt tal i presens; passiv (förstå); orsak, följd, mål, motsats | 2 000–3 000 |
| **B2** | förstå huvudinnehållet i komplexa texter, argumentera och nyansera, tala flytande med modersmålstalare | conditionnel passé, *si* + plus-que-parfait; subjonctif efter konjunktioner (*bien que, pour que, avant que, à moins que*) och subjonctif passé; *lequel, auquel, duquel*; tempusföljd och indirekt tal i dåtid; passiv och *se faire*; participe présent; futur antérieur; nominalisering; medgivande (*avoir beau, quand bien même*); framhävning; stilnivåer | 3 500–4 500 |
| **C1** | förstå långa, krävande texter och implicita betydelser, uttrycka sig flytande och precist i studier och arbete | allt ovan säkert i text; passé simple och subjonctif imparfait i läsning; finare modala nyanser; stil och retorik; textbindning i långa texter | 5 000+ |

Ordförrådet är ungefärligt: varken GERS eller Beacco anger antal. Siffrorna bygger på Milton och Alexiou (2009, se kursmall.md) och är justerade för franska. Enligt frekvensforskningen täcker de 1 000–2 000 vanligaste lemmana ungefär 80–85 % av orden i vanlig text, så **de vanligaste 2 000 orden bör sitta efter steg 4**, oavsett tema.

### 2.3 Proven

| Prov | Hörförståelse | Läsförståelse | Skriva | Tala | Totalt skriftligt |
|---|---|---|---|---|---|
| **DELF A1** | ca 20 min, 4 övningar, korta inspelningar, hörs 2 gånger | 30 min, 4 övningar (annonser, meddelanden, instruktioner) | 30 min: fylla i ett formulär + skriva korta meningar (vykort, meddelande), ca 40 ord | 5–7 min + 10 min förberedelse: entretien dirigé, échange d'informations, dialogue simulé | 1 h 20 |
| **DELF A2** | ca 25 min, 4 övningar | 30 min, 4 övningar | 45 min: 2 texter, minst 60 ord var (berätta om en händelse, svara på en inbjudan) | 6–8 min + 10 min förberedelse: entretien dirigé, monologue suivi, exercice en interaction | 1 h 40 |
| **DELF B1** | ca 25 min, 3 övningar, 20 frågor | 45 min, 3 övningar | 45 min: 1 text, minst 160 ord, egen ståndpunkt | 10–15 min + 10 min förberedelse (bara del 3): entretien dirigé, exercice en interaction, expression d'un point de vue | 1 h 55 |
| **DELF B2** | ca 30 min, 3 övningar | 1 h, 3 övningar | 1 h: argumenterande text, minst 250 ord | 20 min + 30 min förberedelse: anförande och debatt | 2 h 30 |
| **DALF C1** | ca 40 min | 50 min | 2 h 30: sammanfattning av två texter (ca 220 ord) + argumenterande essä (ca 250 ord) | 30 min + 1 h förberedelse: anförande utifrån flera dokument och diskussion | ca 4 h |

Gemensamt för alla: fyra delar på 25 poäng, **godkänt = minst 50 av 100 och minst 5 av 25 i varje del**. Hör- och läsförståelse har i det nya formatet (infört 2020–2024) bara slutna frågor. B1 och B2 är kontrollerade i detalj i `docs/provformat.md`. A1, A2 och C1 bygger på FEI:s beskrivningar och sekundärkällor, eftersom FEI:s webbplats blockerar automatisk hämtning; kontrollera antal övningar och frågor mot *Kit évolutions DELF-DALF* innan provuppgifter skrivs.

## 3. Spec per steg

### 3.1 Grammatik

Fet stil = nytt och centralt på steget. Kursiv = bara förstå (reception), inte använda själv.

| Steg | GERS | Verb och tempus | Pronomen | Övrigt |
|---|---|---|---|---|
| 1 | A1.1 | **présent**: *être, avoir, aller, faire*, verb på -er, *s'appeler*; *je voudrais*, *j'aime + infinitiv* | subjektspronomen, *on*; *moi, toi* i korta svar | **artiklar och genus**, plural, adjektivets kongruens (*petit/petite*), *mon/ma/mes*, *ne … pas*, frågor (intonation, *est-ce que*, *où, quand, comment, combien, qu'est-ce que*), *il y a*, tal 0–100, klockan, datum |
| 2 | A1.2 | **futur proche**, **passé composé** med avoir och de vanligaste verben med être; présent av *pouvoir, vouloir, devoir, prendre, venir*, verb på -ir/-re; **reflexiva verb** i présent; **imperativ** | **betonade pronomen**; *le, la, les* (början) | **partitiv** (*du, de la, des*, *pas de*), *ce/cet/cette/ces*, prepositioner med städer och länder (*à Paris, en France, au Canada*), jämförelser (*plus … que*), *très, trop, beaucoup de* |
| 3 (`fr`) | A2.1 | **imparfait mot passé composé**, être-verben (aller-gruppen) med kongruens, **futur simple**, *venir de*, *être en train de*; *conditionnel* som artighet | **le/la/les, lui/leur, y, en**, pronomenets plats | **qui, que, où**, superlativ, *ne … jamais/rien/personne/plus*, *depuis, il y a, pendant*, possessiva pronomen (*le mien*) |
| 4 | A2.2 | **plus-que-parfait** i berättelse, **conditionnel présent** (önskan, råd), **si + présent/imparfait**, reflexiva verb i passé composé; *subjonctif efter il faut que* (början) | **dubbla pronomen** (*je te le donne, il le lui dit*), pronomen med imperativ (*donne-le-moi*) | **dont, ce qui, ce que**, adverb på -ment, verb + *à/de* + infinitiv, indirekt tal i presens (*il dit que …*), bindeord för orsak och följd (*parce que, comme, donc, alors*) |
| 5 | B1.1 | **subjonctif présent** i vanliga fall (*il faut que, vouloir que, avoir peur que, pour que, avant que, bien que*); **conditionnel passé**; **si + plus-que-parfait**; **gérondif**; *futur antérieur*; *passiv* | *lequel* (fråga) | **participets kongruens med avoir** (*je les ai vues*), indirekt tal i dåtid (början), bindeord för mål, motsats och medgivande (*pour, afin de, pourtant, cependant, alors que*) |
| 6 (`fr4`) | B1.2 | alla tempus i text, **tempusföljd**, subjonctif passé, **passiv** aktivt, participe présent, *passé simple* (känna igen) | **lequel, auquel, duquel**, *ce dont* | **indirekt tal och tidsuttryck** (*la veille, le lendemain*), **framhävning** (*c'est … qui, ce qui … c'est*), bindeord för argumentation, nominalisering (början), formell stil |
| 7 (`fru`) | B2.1 | subjonctif i alla fall, *passé simple* i läsning, participe passé composé (*ayant fini*), futur antérieur och conditionnel passé säkert | pronomenens ordning i alla kombinationer | **medgivande och hypotes** (*avoir beau, quand bien même, à condition que, pourvu que*), **nominalisering**, inversion, stilnivåer (*registre familier/courant/soutenu*), textbindning |

### 3.2 Teman, texttyper, ord och prov

| Steg | Teman (förslag på kapitel) | Texttyper (utöver tidigare steg) | Nya ord i kursen | Lästext / hörtext (ord) | Skrivuppgift (ord) | Prov i appen |
|---|---|---|---|---|---|---|
| 1 | jag och familjen, skolan, fritid och intressen, mat och café, staden, veckan och klockan, kläder och färger, djur | presentation, dialog, vykort, sms, skylt, annons, sång | 450–550, **nästan bara de 800 vanligaste orden** | 80–120 / 60–100 | 30–60 | DELF A1-övningar |
| 2 | vardagen och dagsrutiner, boende, resa och transport, handla, väder och årstider, fest och traditioner, helgen som var, kroppen och hälsa | + intervju, tidtabell, meny, notis, mejl, dikt | 500–600 (ackumulerat ca 1 000) | 120–180 / 100–150 | 40–100 | DELF A1 (helt prov) och A2 (enstaka) |
| 3 (`fr`) | fritid, Paris och storstaden, arbete och sommarjobb, resor, idrott, media (följer Escalade 3) | + enkel nyhet, berättelse i dåtid, porträtt, sakprosa om en plats | 700–900 | 200–300 / 150–200 | 60–140 | **DELF A2**, med B1 som mål |
| 4 | framtid och drömmar, vänskap och relationer, miljö i vardagen, skolan i Frankrike, film och musik, frankofonin (en region), traditioner | + reportage, tidningsartikel, insändare, novellutdrag, film | 800–900 (ackumulerat ca 2 000) | 250–350 / 180–230 | 80–150 | **DELF A2** (helt prov), B1 (enstaka) |
| 5 | utbildning och arbetsliv, samhälle och medier, konst och litteratur, resa och bo utomlands, vetenskap och teknik, hälsa | + populärvetenskap, recension, formellt mejl, manual, intervju | 1 000–1 200 | 250–400 / 200–250 | 120–200 | **DELF B1** |
| 6 (`fr4`) | studier och framtid, medier, miljö, konst och musik, historia och minne, etik, frankofonin | + debattartikel, föredrag, formellt brev och ansökan, dramatik, äldre litteratur | 1 000–1 200 (ackumulerat ca 3 000) | 350–550 / 250–350 | 150–250 | **DELF B1** (helt prov) |
| 7 (`fru`) | Frankrikes geografi, historia och politik, dagens samhälle, frankofonin, litteratur och film, språket | + föreläsning, utredande text, textkommentar, sammanfattning (résumé), retorik | 1 000–1 500 (ackumulerat ca 4 000) | 450–700 / 300–450 | 200–350 | **DELF B2**, några DALF C1-inspirerade uppgifter (sammanfattning) |

**Ordförrådet i steg 1–2** bör väljas i frekvensordning: ta de 1 000 vanligaste lemmana i Lonsdale och Le Bras (eller Lexique 3, kolumnen för filmundertexter, som ligger närmast talspråk) och fördela dem på kapitlen efter tema. Allt som inte passar ett tema läggs i ett avsnitt "Vanliga ord" (jfr tyskans *Häufige Wörter*). FLElex visar på vilken GERS-nivå ett ord brukar komma i läromedel och kan användas för att kontrollera att ett ord inte ligger för högt.

**Provuppgifter för A1 och A2** (behöver en ny variant i `70-exam.js`, eller samma motor med andra `parts` och tider):

- A1: `parts` co 20 / ce 30 / pe 30 / po 7 min. Hör och läs: korta dokument (20–60 ord), flerval med bilder eller tre alternativ. Skriva: formulär + ca 40 ord. Tala: presentation, frågor med kort som stöd, rollspel i en butik.
- A2: `parts` co 25 / ce 30 / pe 45 / po 8 min. Hör: meddelanden på telefonsvarare, korta radioinslag. Läs: annonser, mejl, korta artiklar. Skriva: två texter om minst 60 ord. Tala: presentation, monolog om ett vardagsämne (t.ex. *votre meilleur souvenir de vacances*), rollspel.

## 4. Granskning av de kurser som finns

Mätt i källfilerna 2026-09-29. "Ord" i texter = bara de franska raderna.

| | `fr` Franska 3 | `fr4` Franska 4 | `fru` Franska I |
|---|---|---|---|
| Nivå enligt `lang.js` | steg 3, A2 | steg 6, B1 (B1.2) | B1 → B2 |
| Nivå enligt innehållet | A2.1, grammatik upp mot B1 | B1.2 | B2.1, universitetsinriktad |
| Ord (words.txt) | 258 publika bokord + ca 500 i privata `book/` + 475 musikteori ≈ 1 230 | 1 051 (8 kapitel à ca 120 + 69 fraser) | 1 252 (8 kapitel à ca 125 + terminologi och fraser) |
| Mål enligt spec ovan | 700–900 | 1 000–1 200 | 1 000–1 500 |
| Grammatikområden | 20 (597 frågor) | 9 (268 frågor) | 12 (360 frågor) |
| Lästexter (ord, snitt) | 11 st, 45–251 (177) | 16 st, 393–526 (469) | 16 st, 445–593 (513) |
| Hörtexter (ord, snitt) | 15 st, 138–199 (154) | 16 st, 308–337 (325) | 16 st, 300–349 (327) |
| Skrivuppgifter | 11 st, 80–150 ord | 24 st, 80–250 ord | 24 st, 100–300 ord |
| Prov | DELF B1, 26 uppgifter | DELF B1, 26 uppgifter | DELF B2, 26 uppgifter |

### 4.1 Franska 3 (`fr`)

Stämmer:

- Ord, lästexter, hörtexter och skrivlängd ligger inom målen för steg 3.
- Grammatiken täcker allt för steg 3 och mycket av steg 4–5 (conditionnel, si-satser, subjonctif, plus-que-parfait, *dont*). Det är rimligt eftersom eleven siktar på DELF B1.

Brister:

- **Provet ligger två steg över kursen.** DELF B1-texterna i `exam.json` är 260–380 ord (hör) och 305–385 ord (läs) mot kursens 154 och 177 i snitt. Lägg till DELF A2-uppgifter som ett mellansteg (t.ex. `exam` kvar som B1, men en egen övningsnivå A2), eller låt steg 4-kursen ta A2.
- **Inget avsnitt med vanliga ord.** Utanför boken och musikteorin finns bara ett avsnitt (`fm`). Backloggen har redan punkten "vanligaste orden först" (P2). En kontroll mot de 2 000 vanligaste lemmana i Lonsdale och Le Bras eller Lexique skulle visa vilka vanliga ord som saknas i hela kedjan.
- Sju grammatikområden saknar kapitel (`secs: null`): `rel`, `subj`, `si`, `comp`, `quest`, `cond`, `imper`. Det är ok, men i en kedja bör `subj` och `si` flyttas eller märkas som "förhandsvisning" när steg 4 och 5 finns.
- Saknas som eget område: *depuis / il y a / pendant* och *venir de / être en train de* (finns delvis i `pqp`).

### 4.2 Franska 4 (`fr4`)

Stämmer:

- Innehållet passar steg 6 mycket väl: subjonctif i fler fall, alla tre si-satserna (inklusive conditionnel passé), *lequel/auquel/duquel*, indirekt tal och tempusföljd, gérondif, passiv, futur antérieur, framhävning och argumenterande bindeord. Texttyperna (ansökan, debatt, porträtt av författare, dramatik, historia) följer steg 6.
- DELF B1-uppgifterna följer det nya formatet (se `provformat.md`).

Brister:

- **Namnet.** "Franska 4" är i skolan steg 4 (A2.2). Kursen är steg 6. Eleven som läser Franska 4 i skolan får en app-kurs två steg för svår, och steg 4–5 hoppas över i kedjan. `docs/KLART.md` (rad om nivåer) säger fortfarande "Franska 4 A2 → B1", vilket inte stämmer med `lang.js`.
- **Mellan `fr` och `fr4` (löst 2026-10-01):** dubbla pronomen (`dpron`) och verb + à/de + infinitiv (`prepinf`) finns i `frs4`, participets kongruens med avoir (`accord`) i `frs5`. `subj` och `si` i `fr` är märkta som förhandsvisning (`preview: "frs4"`).
- Conditionnel passé och subjonctif passé har inget eget område (de ingår i `hyp` och `subj2`). Det räcker, men regelsidorna bör nämna dem uttryckligen.
- *Passé simple* att känna igen finns i `fr4` (`psimp`, kapitel q4 och q6) och i `fru`. Äldre texter i `fr4` (Hugo, Molière) använder inte passé simple (kontrollerat 2026-10-01).

### 4.3 Franska I (`fru`)

Stämmer:

- Nivån B2.1 med DELF B2 som prov, 1 252 ord, texter och skrivlängder inom målen för steg 7. Texttyperna (föreläsning, textkommentar, résumé, litteraturanalys) täcker steg 7 och går delvis mot C1.

Brister:

- **Inget eget område för nominalisering och stilnivåer**, som hör till B2 enligt Beacco och steg 7 enligt Skolverket. Medgivande (*avoir beau, quand bien même*) ligger troligen i `subj3`, men bör ha egna frågor.
- `level: "B1 → B2"` men kursen förutsätter B1.2 (`fr4`). Som steg 7 i kedjan borde den heta B2 (B2.1).
- DELF B2-provets sammanfattningsförmåga är bra förberedelse, men om kursen ska leda mot universitetets krav kan några DALF C1-lika uppgifter (sammanfattning av två texter) vara värda att lägga till.

## 5. Förslag till kedjan

| Steg | GERS | Kurs | Status | Prov i appen | `nextCourse` |
|---|---|---|---|---|---|
| 1 | A1.1 | **Franska 1** (ny, t.ex. `fr1`) | bygga | DELF A1 | `fr2` |
| 2 | A1.2 | **Franska 2** (ny, `fr2`, ärver från `fr1`) | bygga | DELF A1 → A2 | `fr` |
| 3 | A2.1 | Franska 3 (`fr`) | finns | DELF A2 (lägg till) + B1 | steg 4 |
| 4 | A2.2 | **Franska 4** (ny kod, t.ex. `fr4a`; `fr4` är upptagen) | bygga | DELF A2 | `fr5` |
| 5 | B1.1 | **Franska 5** (ny, `fr5`) | bygga | DELF B1 | `fr4` |
| 6 | B1.2 | `fr4`, **byt visningsnamn till "Franska 6"** | finns | DELF B1 | `fru` |
| 7 | B2.1 | Franska I, universitet (`fru`), fungerar som steg 7 | finns | DELF B2 | – |

- Att byta `course` i `fr4/lang.js` från "Franska 4" till "Franska 6" påverkar inte framstegen: `storageKey` (`glosor-fr4-v1`) och koden `fr4` ändras inte. Topplistan visar det nya namnet. Det behöver föräldern godkänna, eftersom eleven känner kursen som "Franska 4".
- Om bara en kurs ska byggas mellan `fr` och `fr4`: en kurs för steg 4–5 (A2.2 → B1.1, ca 1 500 ord, DELF A2 och B1) med grammatiken i steg 4 och 5 ovan. Det är det som gör mest nytta för eleven, som går från Franska 3 och siktar på DELF B1.
- Ett gymnasialt **Franska 7** behövs inte så länge `fru` finns. Bygg det bara om någon vill ha steg 7 utan universitetsinnehåll (litteraturhistoria, terminologi).
- Ordning (förslag): 1) steg 4–5 (störst lucka, närmast eleven), 2) byt namn på `fr4`, 3) Franska 1 och 2 (ärver accenter, artiklar och pronomen från `fr`), 4) DELF A1/A2-provformat i `70-exam.js`.
- Alla nya kurser: inga ord som redan finns i andra franska kurser (dubblettkontroll mot `fr`, bokorden, `fr4` och `fru`), ord i frekvensordning i steg 1–2, och samma arbetssätt som för `fr4` (se BACKLOG).

## Källor

- Europarådet, *Common European Framework of Reference for Languages: Companion volume* (2020): https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4 . Fransk version (*CECR, Volume complémentaire*): https://rm.coe.int/cadre-europeen-commun-de-reference-pour-les-langues-apprendre-enseigner/16809ea0d5
- Europarådet, *Reference Level Descriptions* (RLD, bl.a. de franska referentiels): https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions
- Beacco, J.-C. m.fl., *Niveau A1 pour le français* (2007), *Niveau A2 pour le français* (2008), *Niveau B1 pour le français* (2011), *Niveau B2 pour le français* (2004), Didier. Förlagets sida för A2: https://eboutique.didierfle.com/fr/US/products/niveau-a2-pour-le-francais-un-referentiel . Inledningar: A1 https://www.academia.edu/37662131/Niveau_A1_pour_le_francais_Introduction , B1 https://www.academia.edu/36555446/Niveau_B1_pour_le_fran%C3%A7ais_Pr%C3%A9face_introduction_et_chapitre_1 , B2 https://academia.edu/38045307/Niveau_B2_pour_le_fran%C3%A7ais._Un_r%C3%A9f%C3%A9rentiel._Pr%C3%A9sentation
- France Éducation international, DELF tout public, nivåsidor: https://www.france-education-international.fr/diplome/delf-tout-public/niveau-a1 (samt `niveau-a2`, `niveau-b1`, `niveau-b2`), DALF C1: https://www.france-education-international.fr/diplome/dalf/niveau-c1 , *Manuel du candidat DALF C1*: https://www.france-education-international.fr/document/manuel-candidat-dalf-c1 , *Kit évolutions DELF-DALF* (nya formatet): https://www.france-education-international.fr/document/kit-evolutions-dd . Sidorna blockerar automatisk hämtning; A1-, A2- och C1-uppgifterna ovan är kontrollerade mot sekundärkällor: https://global-exam.com/blog/fr/delf-a2-introduction/ , https://www.francepodcasts.com/2019/08/03/delf-a1-presentation/ , https://communfrancais.com/2017/07/17/production-ecrite-du-dalf-c1/ , https://communfrancais.com/2019/12/06/les-epreuves-du-delf-vont-changer/
- Lonsdale, D. och Le Bras, Y. (2009), *A Frequency Dictionary of French: Core Vocabulary for Learners*, Routledge: https://resourcecentre.routledge.com/books/9780415775311
- New, B. och Pallier, C., *Lexique 3/4* (frekvenser för franska ord ur böcker och filmundertexter, fri databas): http://www.lexique.org/
- François, T. m.fl. (2014), *FLELex: a graded lexical resource for French foreign learners* (ord per GERS-nivå): https://cental.uclouvain.be/cefrlex/flelex/
- Skolverket och Milton/Alexiou: se `docs/kursmall.md`. DELF B1 och B2 i detalj: `docs/provformat.md`.
