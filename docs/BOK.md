# Innehåll från elevens lärobok

Varje kurs har två spår:

- **Boken:** kapitel ur elevens lärobok, markerade `#id|Namn|bok` i ordlistan. Franska 3 följer *Escalade* (Waagaard, Rödemark, Jonchère och Sandberg).
- **Allmänt:** allt som bygger på kursplanen och fungerar för alla: grammatik, vanliga ord, hörtexter, kultur och annat. Tyska 5 har bara det här spåret, eftersom eleven pluggar på egen hand utan lärobok.

I appen väljer eleven under **Boken → Vi läser nu** vilket kapitel klassen läser. Nya ord, texter och övningar tas då först från det kapitlet, och resten kommer i ordning efteråt. När alla ord i kapitlet är påbörjade föreslår appen nästa kapitel. Kurser utan bokkapitel visar ingen bokpanel.

## Var materialet ligger

| Vad | Var | I det publika repot? |
|---|---|---|
| Ordlistor, bokens texter och övningar, foton | `languages/<kod>/book/kapNN/` (`words.txt`, `content/*.json`, `foton/`) och `book/sidor.json` | **Nej.** Mappen `book/` står i `.gitignore`. |
| Egna övningar och texter på bokens tema | `languages/<kod>/words.txt` och `languages/<kod>/content/` | Ja |

Bokens texter, ordlistor och övningar är upphovsrättsskyddade och får inte ligga i det publika repot. `build.py` läser `book/` om mappen finns och bygger in den i appen, som bara de inbjudna ser.

Mappen `book/` finns bara på den här datorn. Den är ett eget lokalt git-repo (versionshanterad, men inte säkerhetskopierad). Koppla den till ett **privat** repo på GitHub (till exempel `glosor-bok`) för säkerhetskopiering.

De franska kapitlen k1–k3 och aller låg i ordlistan innan det här upplägget fanns, och de ligger kvar i `words.txt`. Varje rad består av ord, översättning och egna exempel och kommentarer. Nya kapitel från boken läggs i `book/`.

## Så förs ett nytt kapitel in

1. Fota sidorna: glosorna, texten och gärna övningarna. Rakt ovanifrån och i bra ljus räcker.
2. Dra in bilderna i Claude Code och skriv till exempel "Escalade kapitel 4, sidorna 52–61".
3. Claude
   - läser av glosorna och skriver dem till `book/kapNN/words.txt` under `#k4|Kap 4 · <titel>|bok`, med exempelmeningar och kommentarer i samma format som resten (se `languages/fr/content/SPEC.md`)
   - sparar fotona i `book/kapNN/foton/`, för in sidorna i `book/sidor.json` och bokens egna texter och övningar i `book/kapNN/content/` enligt `book/SPEC-bok.md` och `book/README.md` (också privata): texterna som lästexter med glosor och frågor, bokens öppna frågor och skrivuppgifter som skrivuppgifter med Claudes kommentarer, och översättnings- och luckövningar under Grammatik → Bokens övningar
   - skriver *egna* övningar på kapitlets tema: luckmeningar, en hörtext, en lästext med frågor, en berättelse och en skrivuppgift, med kapitlets ord och grammatik. Egna övningar läggs i `content/` (publikt).
   - kör `build.py` och testerna och publicerar.
4. Oscar väljer det nya kapitlet under **Vi läser nu**.

## Om en annan elev har en annan bok

Lägg bokens kapitel i en egen mapp och ge dem egna avsnitts-id (till exempel `e1`, `e2` …). Ange boken i `lang.js` (`book: {title, authors}`). En kurs kan i dag bara ha en bok. Om flera elever med olika böcker ska använda samma kurs behövs en inställning för val av bok (se BACKLOG.md).
