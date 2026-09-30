# Satsanalys: satsanalys.json

Egen övningstyp (`src/kinds/62-satsanalys.js`, typ `sats`, gruppen *Grammatik*), som bara syns i menyn när filen finns (i dag `fru`). Allmänna regler: [allmant.md](allmant.md).

`satsanalys.json` = `[{id, sec, lvl, t, fr, opts, a, why}]`:

- `fr`: meningen med exakt en markerad del `[[…]]`, som visas understruken.
- `t`: `fn` (satsdel eller ordets funktion: sujet, COD, COI, attribut du sujet/du COD, complément circonstanciel de temps/lieu/cause/manière/but/moyen/concession, complément du nom, épithète, apposition, complément d'agent …) eller `prop` (satstyp: proposition principale/indépendante, subordonnée relative/complétive/interrogative indirecte, circonstancielle de temps/cause/but/concession/condition/conséquence, infinitive, participiale).
- `opts` och `a`: alternativen och index för rätt svar.
- `lvl` 1–3 (lätt → svår). En runda tar det eleven inte kan först och visas från lätt till svår.
- `why` börjar med den franska termen och den svenska (`**COD** = direkt objekt …`) och förklarar sedan på svenska.
- Statistik i `S.sa = {<id>: {s, last, r, n}}`, för satsdelar och satstyper.
