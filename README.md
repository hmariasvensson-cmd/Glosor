# Glosor

Glosprogram med repetition i rätt takt, quiz och verbträning. Det körs som en artefakt på claude.ai:

**https://claude.ai/artifact/YBQv8j4qXQQLuPwLAWt5mP**

Länken ändras aldrig. Nya versioner publiceras till samma adress.

Framstegen sparas efter varje svar, både i webbläsaren och på den inloggades claude.ai-konto, så de följer med mellan iPad, telefon och dator. Ett avbrutet pass kan fortsättas. Fliken Topplista visar hur mycket var och en har övat den här veckan.

## Övningar

- Glosquiz med repetition i rätt takt (flerval och skriva). Fel på en skrivfråga ger samma ord som flerval senare i övningen, och klarar man det kommer det tillbaka som skrivfråga. Vid fel visas hela lärokortet igen.
- Meningar: fyll i luckan i exempelmeningarna för ord man har lärt sig.
- Verb: personböjning och tempus, som två separata spel.
- Klipp på YouTube med enkel franska/tyska till varje kapitel.
- Diktamen, översätt hela meningar, ordföljd med brickor.
- Hörförståelse och lästexter med frågor. I texterna kan man trycka på ord och spara dem i Mina ord.
- Berättelser där man väljer rätt tempus och bindeord, samtalsfraser, skrivuppgifter med checklista, kulturtexter.
- Dagens pass: glosorna och sedan en blandad runda.
- Kursväljare med nivå (Franska 3 · A2 → B1, Tyska 5 · B1 → B2). Kommande kurser visas men går inte att välja.

Förslag på fler övningar finns i `docs/ovningsforslag.md`.

## Så är projektet uppbyggt

```
languages/
  fr/           franska (Franska 3)
    words.txt   ordlistan (en rad per ord)
    lang.js     inställningar: röst, accenttangenter, artiklar, genus, verbspel
    videos.json klipp per kapitel
  de/           tyska (Tyska 5, byggd på kursplanen, inte på en specifik bok)
src/
  page.html     sidans stomme
  style.css     utseendet
  app.js        glosquiz, sparande, statistik, topplista
  exercises.js  övriga övningar (diktamen, översättning, ordföljd, texter, berättelser …)
  grammar.js    grammatikövningar, der/die/das och plural
  main.js       start och kursväljare
tests/
  run_tests.py  spelar igenom alla övningar i Chrome
docs/
  BACKLOG.md    det som inte är byggt än
build.py        sätter ihop allt till dist/index.html
```

## Lägga till ord

Öppna `languages/fr/words.txt` och lägg till rader i formatet

```
franska|svenska|genus|exempel på franska|exempel på svenska|ursprung
```

Markera ordet i exempelmeningen med hakparentes, `Nous [rions] beaucoup ensemble.`, så blir det luckan i meningsövningen.

Ett nytt avsnitt börjar med en rad som `#k4|Kap 4 · Titel`. Ändra inte ett ords franska form eller ett avsnitts id i efterhand, eftersom de används för att spara vad som är inlärt.

Kör sedan:

```
python3 build.py
```

Skriptet säger till om en rad har fel antal fält, okänt genus eller dubbletter. Öppna `dist/preview.html` i webbläsaren för att prova lokalt.

## Lägga till ett språk

1. Kopiera mappen `languages/fr` till exempelvis `languages/de`.
2. Ändra i `lang.js`: `LANGUAGES.fr` blir `LANGUAGES.de`, och byt namn, röst (`de-DE`), accenter, artiklar och genus. Ge språket en **egen** `storageKey`, till exempel `"glosor-de-v1"`.
3. Ta bort `verbs` om språket inte ska ha verbträning ännu.
4. Byt ut orden i `words.txt` och kör `python3 build.py`.

När det finns mer än ett språk visas en språkväljare överst, och varje språk sparar sina framsteg för sig.

## Publicera

Publiceringen görs från Claude Code: be Claude publicera `dist/index.html` till artefaktlänken ovan. Se `CLAUDE.md`.
