# Innehåll till övningarna i Italienska 1 och 2

Eleverna är svenska och läser italienska från början: Italienska 1 ≈ A1 (presens, vardag), Italienska 2 ≈ A2 (passato prossimo, imperfetto, futuro, planer och upplevelser). Se `docs/italienska-plan.md`. Läs kursens `words.txt` och använd kapitlets glosor.

Formaten och de allmänna reglerna står i `docs/spec/` (`docs/spec/allmant.md` och en fil per typ); exempel i `languages/fr/content/*.json`. Fältet med text på målspråket heter `fr` även för italienska. `gloss`: nyckeln är ordet som det står i texten, med små bokstäver och utan elision (`l'amica` → nyckel `amica`). I `prompts.json` får `need.tenses` bara innehålla `"presente"`, `"passato prossimo"`, `"imperfetto"` och `"futuro"`, och bindeorden räknas mot `connectors` i `languages/it1/lang.js`. `stories.json`: gap-kategorierna är `"tempus"` och `"bindeord"`.

Texterna ska vara korta och enkla: A1 med korta meningar i presens, A2 med dåtid och enkla bisatser.

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Eleverna börjar från noll. Exempelmeningar: A1 4–10 ord, A2 5–12 ord. Italienska 2 ska inte upprepa ord från Italienska 1 (kontrollera med skript).

### Kapitel-id
- Italienska 1 (`languages/it1/words.txt`): `#i1|Kap 1 · Ciao, piacere!`, `#i2|Kap 2 · La mia famiglia`, `#i3|Kap 3 · Scuola e tempo libero`, `#i4|Kap 4 · La mia giornata`, `#i5|Kap 5 · Al bar e al ristorante`, `#i6|Kap 6 · In città`, `#i7|Kap 7 · A casa mia`, `#i8|Kap 8 · Vestiti, stagioni e tempo`, `#ir|Espressioni · Frasi utili`
- Italienska 2 (`languages/it2/words.txt`): `#j1|Kap 1 · Di nuovo insieme`, `#j2|Kap 2 · Il fine settimana scorso`, `#j3|Kap 3 · In viaggio`, `#j4|Kap 4 · Quando ero piccolo`, `#j5|Kap 5 · Fare la spesa e cucinare`, `#j6|Kap 6 · Il corpo e la salute`, `#j7|Kap 7 · Feste e tradizioni`, `#j8|Kap 8 · Lavoro e progetti`, `#jr|Espressioni · In conversazione`

Ungefär 60 ord per kapitel och 50 fraser i Espressioni. Italienska 2 ska inte upprepa ord från Italienska 1 (kontrollera med skript).
