# Glosor

Glosprogram för en elev i Franska 3 (mål A och B1) och en elev i Tyska 5 (mål B2). Används dagligen på iPad och telefon. Allt användargränssnitt och all dokumentation är på svenska.

## Den publicerade länken

- Live: https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP
- Länken måste alltid fungera. Publicera alltid till **samma** URL (`url`-parametern), aldrig som en ny artefakt.
- Framstegen ligger i artefaktens db och i `localStorage` på artefaktens origin. Båda hör till just den här artefakten, så en ny URL betyder att framstegen försvinner.

## Lagring och kapabiliteter

Publicera alltid med de här kapabiliteterna (utelämna `capabilities` vid ompublicering för att behålla dem):

    {"db": {"rules": [{"path": "board", "read": "view", "write": "admin"},
                      {"path": "board/{self}", "write": "interact"}]},
     "user": {"scopes": ["profile"]}}

- Framsteg: localStorage (cache) + `data/users/<uid>/<storageKey>` i db, `{state, t}`. Vid start vinner den version som kommit längst (pass, antal loggposter, antal ord), inte den senaste tidsstämpeln.
- Pågående pass sparas i `S.run` efter varje svar, så att det går att fortsätta.
- Topplista: `board/<uid>` = `{nick, langs: {<kod>: {week, min, q, days, streak, last, learned, mastered}}, t}`.
- Den som ska spara måste vara inloggad på claude.ai och ha skrivrätt (Contributor inom organisationen, eller Editor inbjuden via e-post när artefakten inte delas via länk).

## Saker som aldrig får ändras

- `storageKey` i `languages/*/lang.js` (`franska-glosor-v2`, `glosor-de-v1`).
- Formatet på sparat läge: `{pass, w:{<ord-id>:{s,due}}, newCount, src, mode}`. Steg `s` 0–3 = lär sig, 4 och uppåt = kan (se `INT` och `schedule` i app.js).
- Ord-id är ordets form i målspråket (första fältet i words.txt), och avsnitts-id används i `S.src`. Att ändra dem nollställer framstegen för de orden.

## Struktur

- `src/app.js`: språk, sparande (lokalt och claude.ai), glosquiz, quizmotor, statistik, topplista.
- `src/exercises.js`: alla övningar utöver glosquizet. Varje typ registrerar `MC`/`TYPE` (frågor), `RESTORE` (återuppta), `EFFECT` (statistik) och `RECAP`. Fråge-id är `<typ>:<ref>`, så typerna kan blandas i Dagens pass.
- `src/grammar.js`: grammatikövningar (tyska just nu), der/die/das och plural. Frågorna ligger i `languages/<kod>/content/grammar-*.json` (format i `languages/de/content/GRAMMATIK-SPEC.md`). `build.py` slår ihop och kontrollerar dem.
- `src/main.js`: start och kursväljare (körs sist).
- `languages/<kod>/lang.js`: kursinställningar (course, level, storageKey, accenter, verbspel, bindeord, tempusigenkänning).
- `languages/<kod>/words.txt`: ordlistan. `content/*.json` innehåller hörtexter, lästexter, berättelser, fraser, skrivuppgifter och kultur. `videos.json` innehåller YouTube-klipp (kontrollerade med oEmbed).
- `languages/upcoming.json`: kommande kurser som visas men inte går att välja.
- `docs/BACKLOG.md`: allt som inte är byggt. När något byggs flyttas punkten till `docs/KLART.md` med referens till backloggpunkten och commit.

## Arbetsflöde

1. Ändra i `languages/<kod>/words.txt`, `lang.js` eller `src/`.
2. `python3 build.py` (bara Pythons standardbibliotek, Node finns inte på datorn).
3. `python3 tests/run_tests.py`: spelar igenom alla övningar i Chrome utan fönster, med sparad data och en låtsad claude.ai-lagring. Allt ska vara OK innan du publicerar.
4. Publicera `dist/index.html` till URL:en ovan. Läs först live-versionen med Artifact `action: "read"`. Om den har ändrats utanför projektet (t.ex. i claude.ai-chatten) ska de ändringarna föras in i källfilerna innan du publicerar, så att inget skrivs över.

`dist/` genereras och är inte versionshanterad.
