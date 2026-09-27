# Innehåll till nya övningar i Glosor (franska)

Eleven: Oscar, svensk gymnasieelev i Franska 3 (Moderna språk 3), mål betyget A (nära B1). Texterna ska vara på nivå A2 till låg B1: korta meningar, vanliga ord, men med passé composé, imparfait, futur proche och bindeord. De ska vara naturlig, korrekt franska (stavning, accenter, kongruens, genus). Läs först `/Users/maria/Glosor/languages/fr/words.txt`. Där finns kapitlen (rader som börjar med #, t.ex. `#k2|Kap 2 · Arrivée à Paris`) och glosorna. Använd kapitlets glosor i texterna.

Kapitel-id och teman:
- k1: Vie et loisirs (fritid, sport, klättring, träning, beskriva personer)
- k1e: Zinédine et Zlatan (fotboll, kändisar, självförtroende)
- k1b: Ma vie au soleil (flytta till Nice, strand, vardag, "métro, boulot, dodo")
- k2: Arrivée à Paris (flygplats, tull, bagage, strejk, brevvän, RER)
- k2b: Le métro de Paris (metrons historia, stationer, pendla)
- k2c: Aux Champs-Élysées (Joe Dassins sång, promenera, möta någon)
- k3: Trouver un travail (anställningsintervju, sommarjobb, skidort)
- aller: passé composé med être (aller, venir, arriver, partir, tomber, naître, mourir …)

## Allmänna regler
- Skriv giltig JSON (UTF-8, dubbla citattecken, inga kommentarer, inga avslutande kommatecken). Använd typografiska apostrofer ’ ALDRIG, bara vanlig apostrof '. Använd « » runt citat om det behövs.
- Svenska texter (frågor, förklaringar, översättningar) ska vara naturlig svenska, skrivna för en 16–17-åring.
- "gloss" är en ordlista för att trycka på ord: nyckeln är ordet EXAKT som det står i texten men med små bokstäver och utan skiljetecken (t.ex. "trompée", "l'ascenseur" → använd "ascenseur", ta bort elision l'/d'/j'/qu'/n'/s'/c'), värdet är {"t": grundform (substantiv med artikel: "le quai"), "sv": svensk betydelse, "g": "m"/"f"/""}. Ta med 15–35 ord per text: ord som en A2-elev troligen inte kan eller som är kapitelglosor. Ta inte med de allra vanligaste orden (le, et, être, avoir, je, dans …).
- Flervalsfrågor: 4 alternativ, exakt ett rätt, "a" = index (0–3) för rätt svar. Blanda var det rätta svaret står. Felaktiga alternativ ska vara rimliga men tydligt fel enligt texten.
- Kontrollera hela filen innan du är klar: läs igenom den, rätta fel och validera JSON med `python3 -c "import json;json.load(open('FIL'))"`.
