# Ordlistan: words.txt

Allmänna regler: [allmant.md](allmant.md). Kursens kapitel-id, teman, nivå och antal ord står i `languages/<kod>/content/SPEC.md`.

## Format

En rad per ord, sex eller sju fält åtskilda av `|`:

    ord|svenska|genus|exempelmening|exempelmeningen på svenska|ursprung/kommentar|ordagrant

- **Avsnitt:** `#id|Namn` (eller `#id|Namn|bok` för ett kapitel ur läroboken). Avsnitts-id ändras aldrig. Rader som börjar med `//` är kommentarer.
- **Ord** (första fältet) är ordets id: framstegen hänger på det, så det får inte förekomma två gånger och ändras aldrig.
- **Genus:** `m`, `f`, `n`, `pl` (bara plural), `mpl`, `fpl`, `npl`, eller tomt (verb, adjektiv, uttryck).
- **Exempelmeningen:** naturlig och på kursens nivå (A1: 4–10 ord, A2: 5–12, B1/B2: 6–14). Markera ordet med **en** hakparentes runt exakt den form som står i meningen, utan artikel för substantiv: `Wir müssen die [Umwelt] besser schützen.`, `Ho comprato un [libro] nuovo.`
- **Kommentar** (1–2 korta meningar på svenska): oregelbundna former först (stamformer, plural), sedan en koppling till svenska eller säker etymologi med `<b>fetstil</b>`, eller ett användningstips. Främmande ord i ursprunget har svensk betydelse. Aldrig osäker eller påhittad etymologi. Bara `b`, `i`, `em`, `strong`, `br`, `sup`, `sub` och `span` med class släpps igenom.
- **Ordagrant** (valfritt sjunde fält): ordagrann översättning, gärna för fraser.
- Förbjudet: `|` utom som avgränsare, backtick, fler hakparenteser än luckan, radbrytning inne i en rad, tomma fält utom genus (och de valfria sista fälten). build.py stoppar på format, antal fält, okänt genus, dubbletter och fel antal luckor.

## Per språk

- **Tyska:** substantiv med bestämd artikel och plural inom parentes: `die Umwelt`, `der Bahnhof (-höfe)`, `die Erfahrung (-en)`. Verb i infinitiv, reflexiva med sich, styrning inom parentes: `sich beschweren (über + Akk.)`. Skriv inte ", dass" eller ", ob" i uppslagsformen. Delbara verb: skriv exempelmeningen så att verbet står samlat (bisats, perfekt, infinitiv). Starka och oregelbundna verb har alltid stamformerna först i kommentaren (`Starkt verb: nahm, hat genommen.`). Korrekt genus, plural, kasus och ß.
- **Franska:** substantiv med bestämd artikel (`le quai`, `l'ascenseur`, genus i genusfältet), verb i infinitiv (reflexiva med se/s'). Oregelbundna verb och oregelbunden plural i kommentaren.
- **Italienska:** substantiv med bestämd artikel (`il libro`, `lo zaino`, `l'amica`), genus `m`/`f` (`mpl`/`fpl` för ord som bara finns i plural). Pluralen först i kommentaren (`Plural: i libri.`), oregelbunden plural markeras (`l'uomo – gli uomini`). Verb i infinitiv, reflexiva med -si (`alzarsi`); oregelbundna verb med presens io-form först (`Oregelbundet: vado, vai, va …`), från Italienska 2 även particip och hjälpverb (`Passato prossimo: sono andato/andata.`). Adjektiv i grundform, femininum i kommentaren om den inte är självklar.
- En kurs ska inte upprepa ord från kursen före (kontrollera med skript).
