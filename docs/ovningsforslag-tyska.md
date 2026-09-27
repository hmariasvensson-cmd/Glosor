# Nya övningar i Glosor för att nå A i Tyska 5 och sikta mot B2

*Underlag för föräldern, september 2026. Siffror i hakparentes hänvisar till källorna längst ned.*

## 1. Vad krävs för A?

Kursen heter **Moderna språk 5** (Gy11) om eleven började gymnasiet före 1 juli 2025. Därefter heter den **Moderna språk – fördjupning, nivå 1** (Gy25) [1][2][3]. I Gy25 motsvarar betyget E på den nivån **B1.2** i den europeiska språkskalan (GERS/CEFR). Nivå 2 motsvarar B2.1 och nivå 3 B2.2 [2]. Skolverket placerade redan steg 5 på "B1 hög" [4]. Ett A i Tyska 5 ligger alltså i gränslandet B1+/B2. Målet B2 är rimligt, men det är ett steg längre än kursen kräver.

Skillnaden mellan C och A enligt betygskriterierna [1][2]:

| Område | C | A |
|---|---|---|
| Lyssna/läsa | förstår huvudinnehåll och *väsentliga detaljer* "välgrundat" | förstår "såväl helhet som detaljer", "välgrundat och *nyanserat*" |
| Använda källor | "relevant och effektivt" | "relevant, effektivt och *problematiserande*" |
| Tala/skriva | "med språklig säkerhet", "i huvudsak anpassat" | "med *god* språklig säkerhet" och anpassat till mottagare och sammanhang |
| Samtal | strategier som underlättar | underlättar och "för den framåt på ett konstruktivt sätt" |
| Kultur | diskuterar "utvecklat" | diskuterar "välutvecklat" |

Centralt innehåll nämner uttryckligen "grammatiska strukturer, meningsbyggnad och textbindning", bland annat ord som uttrycker orsak och motsats [2]. För ett A ska grammatiken alltså vara säker, eftersom det är den som gör texten tydlig och varierad. Den behöver inte vara felfri.

## 2. Tysk grammatik som svenskar har svårt med (B1→B2)

Explicit grammatikundervisning med övning ger tydlig effekt, särskilt när eleven själv måste producera formen [5][6]. Det som svenskar missar beror nästan alltid på att svenskan saknar eller gör annorlunda:

| Område | Varför svårt för svenskar | Exempel |
|---|---|---|
| **Kasus efter preposition, Wechselpräpositionen** | Svenskan har inga kasus på substantiv [7] | *Ich lege das Buch **auf den** Tisch* (vart?) / *Es liegt **auf dem** Tisch* (var?) |
| **Adjektivändelser** | Svenskan har bara *gul/gula/gult*. Tyskan böjer efter genus, kasus och artikeltyp [7] | *mit **einem** alt**en** Freund*, *gut**es** Wetter* |
| **n-deklination, genitiv** | Finns inte på svenska | *den Kolleg**en***, *wegen **des** schlecht**en** Wetter**s*** |
| **Verbet sist i bisats** | Svenska har V2 i huvudsats men inte verbet sist. Forskning visar att detta kommer sent [8] | *…, **weil** ich morgen arbeiten **muss**.* |
| **Omvänd ordföljd (V2)** | Samma regel som svenskan, men missas ofta efter *deshalb/trotzdem* | *Deshalb **bleibe** ich zu Hause.* |
| **Perfekt med sein** | Svenskan använder alltid *ha* | *Ich **bin** nach Berlin gefahren.* |
| **Passiv** | Svenskan har mest s-passiv. Tyskan har *werden* + particip, även med modalverb | *Das Haus **wurde** 1900 **gebaut**. Es **muss** renoviert **werden**.* |
| **Konjunktiv II / indirekt tal (Konjunktiv I)** | Svenskan har knappt konjunktiv. Konj. I är B2-stoff i nyhetstext [9] | *Wenn ich Zeit **hätte**, …* / *Er sagt, er **sei** müde.* |
| **Relativsatser** | Svenska *som* böjs aldrig och prepositionen hamnar sist | *der Mann, **mit dem** ich spreche* (mannen som jag pratar med) |
| **Verb med preposition, da-/wo-ord** | Svenskan säger "på det", tyskan *darauf* | *Ich freue mich **darauf**. **Worauf** wartest du?* |
| **Infinitiv med zu, um…zu/damit** | Liknar *att/för att*, men verbet står sist | *Ich lerne Deutsch, **um** in Wien **zu** studieren.* |

Övrigt att repetera: reflexiva och separabla verb, pluskvamperfekt, futurum och particip som adjektiv (*die **steigenden** Preise*).

## 3. Föreslagna nya övningar, rangordnade

Ordningen följer väntad nytta mot A per minut. Alla övningar ska ge en kort förklaring på svenska vid fel. De ska också märka varje fråga med en *regel* (t.ex. `dat-wechsel`), så att appen kan repetera de regler hon missar, precis som med glosorna.

**1. Adjektivändelser (Endungs-Blitz)**
- *Gör:* ser *Ich wohne in einer klein__ Stadt.* och väljer bland ‑e/‑en/‑er/‑es/‑em (eller skriver). Svar: *kleinen*.
- *Mål:* god språklig säkerhet i skrift. Det är det vanligaste felet i svenska elevtexter.
- *Varför:* kort, snabb, många repetitioner per minut. Blandade kasus tvingar fram rätt analys [10].
- *Rättning:* helt automatisk. *Innehåll:* genereras av en tabell (artikeltyp × genus × kasus) och ordlistans substantiv, som redan har genus. Blir rätt per konstruktion och behöver ingen granskning.

**2. Kasus efter preposition (Wo? / Wohin?)**
- *Gör:* *Wir fahren morgen in __ Berge.* → väljer *die/den/der*. Ibland tolkningsfråga: "var eller vart?".
- *Mål:* prepositioner och Wechselpräpositionen, grund för allt annat.
- *Rättning:* automatisk. *Innehåll:* 150–200 meningar i JSON med fält för preposition, kasus och regel. Claude skriver dem, och ett skript kontrollerar mot en tabell över prepositionernas kasus. Wechselpräpositionen stickprovas av läraren.

**3. Bisats: sätt ihop två meningar**
- *Gör:* *Ich bleibe zu Hause. Ich bin krank.* + **weil** → lägger brickor: *Ich bleibe zu Hause, weil ich krank bin.* Varvas med *deshalb* (inversion) och *denn* (ingen ändring).
- *Mål:* "meningsbyggnad och textbindning", tydliga och sammanhängande texter [2].
- *Varför:* tvingar fram skillnaden mellan de tre typerna av bindeord, just det som kommer sent [8].
- *Rättning:* automatisk med befintlig brickmotor. Det behövs en lista med godkända varianter (t.ex. bisatsen först: *Weil ich krank bin, bleibe ich…*).

**4. Relativsatser**
- *Gör:* *Das ist die Freundin. Ich habe **mit ihr** telefoniert.* → *Das ist die Freundin, __ __ ich telefoniert habe.* Svar: *mit der*. Även *dessen/deren*.
- *Mål:* variation och komplexa meningar, B2-krav [9].
- *Rättning:* automatisk (ett eller två ord). *Innehåll:* 80–100 par, taggade med genus, kasus och preposition. Formen följer en tabell och kan kontrolleras av ett skript.

**5. Verb med preposition, da-/wo-ord**
- *Gör:* *Ich interessiere mich __ Politik.* → *für*. Steg två: *Interessierst du dich für Politik? – Ja, ich interessiere mich __.* → *dafür*.
- *Mål:* ordförråd plus grammatik. Täcker appens avsnitt med verb med preposition.
- *Rättning:* automatisk. *Innehåll:* finns delvis redan: ordlistan har *(über + Akk.)*-taggar. Kontrolleras mot DWDS eller Duden.

**6. Konjunktiv II och indirekt tal**
- *Gör:* (a) *Ich habe keine Zeit. Ich komme nicht.* → *Wenn ich Zeit **hätte**, **würde** ich **kommen**.* (b) Nyhetscitat: *Der Minister sagt: „Die Lage ist ernst."* → *Der Minister sagt, die Lage **sei** ernst.*
- *Mål:* nyanserat uttryck (önskan, hypotes, artighet), att återge källor ("använda det valda materialet").
- *Rättning:* skriv verbformerna i 1–2 luckor, automatisk. Hela meningen ger självbedömning. Konj. I-former genereras ur verbtabellen som redan finns i böjningsspelen.

**7. Passiv-omvandling**
- *Gör:* *Man renoviert die Schule.* → *Die Schule **wird** renoviert.* Därefter ändrar hon tempus: *wurde renoviert / ist renoviert worden*, med modalverb: *muss renoviert werden*. Ibland *ist geschlossen* (tillstånd) mot *wird geschlossen* (process).
- *Mål:* saklig stil i miljö- och samhällstexter.
- *Rättning:* luckor för *werden*-form + particip, automatisk. Particip hämtas ur befintlig verbdata.

**8. Hitta felet**
- *Gör:* ser *Gestern ich bin mit meinem Bruder ins Kino gegangen.* och trycker på felet, sedan på rätt plats för verbet.
- *Mål:* att rätta sin egen text, vilket är avgörande i skrivuppgifter.
- *Varför:* tränar granskningen som skrivuppgifterna kräver [11].
- *Rättning:* automatisk (vilket ord). *Innehåll:* korrekta meningar från banken ovan, där ett skript lägger in *ett* typiskt fel per mening (fel kasus, fel ordföljd, *haben/sein*). Eftersom felet skapas maskinellt är facit känt.

**9. Bindeord för argumentation**
- *Gör:* väljer mellan *obwohl / trotzdem / deshalb / während / außerdem* i en kort argumenterande text om t.ex. flygskatt, och ordföljden måste stämma.
- *Mål:* "strukturerat", "problematiserande" resonemang.
- *Rättning:* automatisk. Kan byggas på befintliga argumentationsfraser.

**10. zu-infinitiv, um…zu / damit**
- *Gör:* *Ich spare Geld. Ich will reisen.* → *um … zu reisen*. Men om subjektet byts: *damit meine Schwester reisen kann*.
- *Rättning:* automatisk via brickor/luckor.

**11. Perfekt: haben eller sein? + pluskvamperfekt**
- *Gör:* snabbval *Ich __ eingeschlafen* → *bin*. Sedan *Nachdem ich gegessen __, …* → *hatte*.
- Liten insats, eftersom perfektspelen redan finns. Lägg in det som en blandad runda.

**Blandad grammatikdag:** när reglerna är inövade var för sig ger ett pass som blandar 1–7 mer än block för block [10].

**Så tas innehållet fram:** Claude skriver meningsbanker i JSON med taggar (`kasus`, `genus`, `regel`, `godkända svar`). Ett Python-skript i `build.py` kontrollerar allt som följer av tabeller (ändelser, prepositionskasus, relativpronomen). Läraren eller en tysktalande läser ett stickprov på cirka 10 % och alla meningar med fri formulering. Fel som eleven rapporterar med en "fel facit?"-knapp rättas i källan.

## 4. Hur stort ordförråd behövs?

- Goethe-Institutets ordlista för **B1** omfattar cirka **2 400** ord och fraser [12].
- Mätningar för andra europeiska språk visar ungefär **2 750–3 250 ord för B1 och 3 250–3 750 för B2** [13]. För tyska är siffran troligen högre eftersom sammansatta ord räknas som egna ord. En rimlig uppskattning är **4 000 ord eller fler för B2**.
- **750 ord räcker alltså inte för B2**, men är ett bra *tematiskt påbyggnadslager* ovanpå det hon redan kan från grundskolan och Tyska 1–4 (sannolikt 1 500–2 000 ord).

**Prioritera härnäst:**
1. **Högfrekventa "allmänna" ord** som saknas: *allerdings, bereits, eher, jedoch, offenbar, zunehmend, betreffen, erfordern*. Ta dem från Goethes B1-lista och DWDS B2-nivåer [12].
2. **Ordbildning**: *-ung, -heit, -keit, -lich, -bar, un-*, och sammansättningar (*Klimawandel* = *Klima* + *Wandel*). Ett mönster låser upp många ord.
3. **Fasta verbfraser** (*eine Entscheidung treffen, Kritik üben, in Frage kommen*).
4. **Plural och genus för varje substantiv**, eftersom övning 1–2 bygger på dem.

## 5. Vanor utanför appen

1. **Läs högt och skugga**: läs appens meningar högt efter uppläsningen. Det tränar uttal och bisatsordföljd utan mikrofon.
2. **En kort text i veckan** (150–200 ord) till läraren, med önskan om kommentarer på *en* grammatisk sak, t.ex. adjektivändelser. Använd sedan checklistan i appen [11].
3. **Tysk inmatning för nöjes skull**, 15 minuter några gånger i veckan: *Nachrichtenleicht*, *Deutsche Welle – Langsam gesprochene Nachrichten*, *Easy German* på YouTube med tyska undertexter [14].
4. **Samtal en gång i veckan** med en klasskamrat eller en tysktalande på nätet, och öva medvetet fraser som för samtalet framåt (*Was meinst du damit? Das sehe ich anders, weil …*).
5. **Fråga läraren vilka bedömningstillfällen som ger underlag för A** och öva just den typen av uppgift.

## Källor

1. Skolverket, ämnesplan Moderna språk (Gy11), kurs 5 med kunskapskrav: https://syllabuswebb.skolverket.se/subject/MOD/4/pdf, sammanställt på https://www.betygskriterier.se/skola/amne/MOD/kurs/MODXXX05/
2. Moderna språk – fördjupning (Gy25), betygskriterier, centralt innehåll och GERS-nivåer återgivna från Skolverket: https://gy25.se/gy25/modf/
3. Motsvarande nivåer Gy11–Gy25 (Stockholms stad): https://vuxenutbildning.stockholm/gymnasial-komvux/motsvarande-nivaer-i-nya-laroplanen-gy25/
4. Skolverket, *Kommentarmaterial till ämnesplanerna i moderna språk*: https://www.skolverket.se/download/18.29f46a199c90154403582/1760094575803/Kommentarmaterial%20gymnasieskolan%20moderna%20spr%C3%A5k.pdf och Skolverket om GERS: https://www.skolverket.se/kompetensutveckling/stod-i-arbetet/gemensam-europeisk-referensram-for-sprak-gers
5. Norris & Ortega (2000), *Effectiveness of L2 Instruction: A Research Synthesis and Quantitative Meta-analysis*, Language Learning 50(3): https://doi.org/10.1111/0023-8333.00136
6. Spada & Tomita (2010), *Interactions Between Type of Instruction and Type of Language Feature: A Meta-Analysis*, Language Learning 60(2): https://doi.org/10.1111/j.1467-9922.2010.00562.x
7. Tysk grammatik (översikt av kasus och adjektivböjning): https://sv.wikipedia.org/wiki/Tysk_grammatik
8. Baten & Håkansson (2015), *The Development of Subordinate Clauses in German and Swedish as L2s*, Studies in Second Language Acquisition: https://eric.ed.gov/?id=EJ1072084
9. Goethe-Institut, *Deutsch Online B2.1 – Übersicht Redemittel und Grammatik*: https://lernen.goethe.de/deutschonline/B2/PDF/DT-online_B2.1_K01-06_GR-RM_Rueckschau_de.pdf och Konjunktiv I/II i indirekt tal (B2): https://grammatiktraining.de/indirekterede/grammatikmenue-indirekte-rede.html
10. Brunmair & Richter (2019), *Similarity matters: A meta-analysis of interleaved learning*: https://www.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf
11. Kang & Han (2015), *The Efficacy of Written Corrective Feedback*: https://eric.ed.gov/?id=EJ1059618
12. Goethe-Institut, *Goethe-Zertifikat B1 Wortliste* (ca 2 400 enheter): https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf och DWDS ordlistor per nivå: https://www.dwds.de/lemma/wortschatz-goethe-zertifikat/B1
13. Milton & Alexiou (2009), *Vocabulary size and the Common European Framework of Reference for Languages*: https://www.researchgate.net/publication/312063998_Vocabulary_size_and_the_common_European_framework_of_reference_for_languages
14. Montero Perez m.fl. (2013), *Captioned video for L2 listening and vocabulary learning: A meta-analysis*: https://www.sciencedirect.com/science/article/abs/pii/S0346251X13001012
