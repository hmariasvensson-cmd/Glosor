# Så skrivs italienska ord till words.txt (Italienska 1 och 2)

Eleverna är svenska och börjar från noll. Italienska 1 ≈ A1, Italienska 2 ≈ A2. Kapitel, teman och grammatik: se `docs/italienska-plan.md`.

## Format (exakt, en rad per ord, sex fält åtskilda av |)
    italienska|svenska|genus|exempelmening på italienska|exempelmeningen på svenska|kommentar

- **Substantiv** med bestämd artikel: `il libro`, `lo zaino`, `l'amica`, `la casa`. Genus `m` eller `f` (`mpl`/`fpl` för ord som bara finns i plural). Pluralen skrivs först i kommentaren: `Plural: i libri.` Oregelbunden plural markeras (`l'uomo – gli uomini`, `la mano – le mani`, `la città – le città`).
- **Verb** i infinitiv, reflexiva med -si (`alzarsi`). Genus tomt. Oregelbundna verb: presens io-form först i kommentaren (`Oregelbundet: vado, vai, va …`). I Italienska 2 även particip och hjälpverb (`Passato prossimo: sono andato/andata.`).
- **Adjektiv**: grundform (`alto`), genus tomt, femininum i kommentaren om den inte är självklar.
- **Fraser**: hela frasen som uppslagsord, genus tomt.
- **Exempelmening**: naturlig, enkel italienska (A1: 4–10 ord, A2: 5–12 ord). EN hakparentes runt exakt den form av ordet som står i meningen, utan artikel för substantiv: `Ho comprato un [libro] nuovo.`
- **Kommentar** (1–2 korta meningar på svenska): plural/oregelbundna former först, sedan en koppling till svenska eller latin med <b>fetstil</b> om den är säker (`<b>libro</b> från latin liber, jämför librär`), annars ett användningstips. Aldrig påhittad etymologi.
- Förbjudet: | utom som avgränsare, backtick, fler hakparenteser än luckan, radbrytning i en rad, tomma fält utom genus.
- Uppslagsordet (första fältet) är nyckel för elevens framsteg och får inte förekomma två gånger i samma fil.

## Kapitel-id
- Italienska 1 (`languages/it1/words.txt`): `#i1|Kap 1 · Ciao, piacere!`, `#i2|Kap 2 · La mia famiglia`, `#i3|Kap 3 · Scuola e tempo libero`, `#i4|Kap 4 · La mia giornata`, `#i5|Kap 5 · Al bar e al ristorante`, `#i6|Kap 6 · In città`, `#i7|Kap 7 · A casa mia`, `#i8|Kap 8 · Vestiti, stagioni e tempo`, `#ir|Espressioni · Frasi utili`
- Italienska 2 (`languages/it2/words.txt`): `#j1|Kap 1 · Di nuovo insieme`, `#j2|Kap 2 · Il fine settimana scorso`, `#j3|Kap 3 · In viaggio`, `#j4|Kap 4 · Quando ero piccolo`, `#j5|Kap 5 · Fare la spesa e cucinare`, `#j6|Kap 6 · Il corpo e la salute`, `#j7|Kap 7 · Feste e tradizioni`, `#j8|Kap 8 · Lavoro e progetti`, `#jr|Espressioni · In conversazione`

Ungefär 60 ord per kapitel och 50 fraser i Espressioni. Italienska 2 ska inte upprepa ord från Italienska 1 (kontrollera med skript).
