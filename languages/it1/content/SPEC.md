# Innehåll till övningarna i Italienska 1 och 2

Eleverna är svenska och läser italienska från början: Italienska 1 ≈ A1 (presens, vardag), Italienska 2 ≈ A2 (passato prossimo, imperfetto, futuro, planer och upplevelser). Se `docs/italienska-plan.md`. Läs kursens `words.txt` och använd kapitlets glosor.

Formatet och reglerna är desamma som för franskan: se `languages/fr/content/SPEC.md` och exemplen i `languages/fr/content/*.json`. Fältet med text på målspråket heter `fr` även för italienska. `gloss`: nyckeln är ordet som det står i texten, med små bokstäver och utan elision (`l'amica` → nyckel `amica`). I `prompts.json` får `need.tenses` bara innehålla `"presente"`, `"passato prossimo"`, `"imperfetto"` och `"futuro"`, och bindeorden räknas mot `connectors` i `languages/it1/lang.js`. `stories.json`: gap-kategorierna är `"tempus"` och `"bindeord"`.

Texterna ska vara korta och enkla: A1 med korta meningar i presens, A2 med dåtid och enkla bisatser.
