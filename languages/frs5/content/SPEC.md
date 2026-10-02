# Innehåll till övningarna i Franska 5 (`frs5`)

Franska 5 motsvarar Moderna språk 5 (steg 5, GERS B1.1; i Gy25 fördjupning, nivå 1). Kursen har ingen lärobok (`selfStudy: true`): eleven har läst Franska 3 och 4 (`fr`, `frs4`), pluggar på egen hand, siktar på **DELF B1** (`exam` i `lang.js`) och vill studera musik i Frankrike (`goal`). Kedjan är fr1 → fr2 → fr → frs4 → **frs5** → fr4 (Franska 6) → fru. Texterna ska vara på nivå **B1**: naturlig, korrekt modern franska med alla vanliga tempus i text, subjonctif i vanliga fall, conditionnel passé, si + plus-que-parfait, gérondif, passiv, participets kongruens med avoir, indirekt tal i dåtid (tempusföljd) och bindeord för mål, motsats och medgivande. Texttyperna för steget: populärvetenskap (vulgarisation), bruksanvisning, recension av bok och konsert, porträtt, reportage, guide, forum, formellt mejl och ansökan, novell (egen text). Se `docs/nivaer-franska.md` (steg 5) och `docs/kursmall.md`. Läs `languages/frs5/words.txt` och använd kapitlets glosor.

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`, en fil per typ); Franska 3:s tillägg i `languages/fr/content/SPEC.md` och exemplen i `languages/fr4/content/*.json`. Bindeord, tempusigenkänning och verbtabeller ärvs från Franska 6 (`extends: "fr4"` och `inherit` i `lang.js`), som i sin tur ärver från Franska 3; accenter, artiklar, pronomen, genus och elision står i kursens egen `lang.js`.

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Ungefär 100–130 ord per kapitel (B1, exempelmeningar 6–14 ord) och cirka 65 uttryck i Expressions, sammanlagt cirka 1 020. Franska 5 ska inte upprepa ord från fr1, fr2, fr och frs4 (och inte heller från fr4 och fru, som bygger vidare); kontrollera med skript. Oregelbundna verb och oregelbunden plural står i kommentaren.

### Kapitel (id ändras aldrig)

- `#v1|Kap 1 · Travail et société`: sommarjobb, ansökan, arbetstid (35 timmar, fyradagarsvecka), yrkesbyte
- `#v2|Kap 2 · Étudier à l'étranger`: utbytesår, Erasmus+, antagning, bostad, relations internationales
- `#v3|Kap 3 · Sciences et techniques`: AI, uppfinningar, Marie Curie, musik och hjärnan, teknik som går sönder
- `#v4|Kap 4 · Santé et bien-être`: sömn, stress och nervositet, hörselskydd, idrott och humör, sjukförsäkringen
- `#v5|Kap 5 · La francophonie et le français`: franskan i världen, Québec, Dakar, Belgien och Schweiz (septante), Senghor
- `#v6|Kap 6 · La fiction : histoires et formes`: roman, novell, serier, recension, bokklubb, prix Goncourt
- `#v7|Kap 7 · Musique et arts`: konsert, konservatorium, Fête de la musique, museum, Édith Piaf
- `#v8|Kap 8 · Consommer autrement`: second hand, reparation, snabbmode, reklamation, lagen mot slöseri
- `#vr|Expressions · Nuancer, résumer, réagir`: nyansera, sammanfatta, återge, reagera

## Innehåll per typ

| Fil | Antal | Längd och frågor |
|---|---|---|
| `listening.json` | 16 (två per kapitel, `l-<kap>-1` och `-2`) | 205–245 ord, 6 frågor (helhet, detalj, tolkning), dialog eller intervju med `who`, radioinslag, meddelande |
| `reading.json` | 16 (två per kapitel, `r-<kap>-<texttyp>`) | den första 285–315 ord med 7 frågor, den andra 260–290 ord med 6 frågor |
| `stories.json` | 8 (en per kapitel, `s-<kap>`) | 80–110 ord, 6–7 luckor, med `sv` |
| `culture.json` | 8 (en per kapitel, `c-<kap>`) | 105–140 ord, fråga och jämförelse med Sverige |
| `prompts.json` | 24 (tre per kapitel, `w-<kap>-<typ>`) | mejl, brev, blogg, recension och berättelse 120–200 ord; debattinlägg (`-asikt`, `-forum`) 150–220 ord; medling (`w-<kap>-medling`): en svensk text i `task` sammanfattas på franska i 120–150 ord |
| `phrases.json` | 24 | situation → replik |
| `mal.json` | 9 (`mal-<kap>`, även `mal-vr`) | kapitelmål i jagform |
| `uttal.json` | 8 (ett moment per kapitel v1–v8) | ordpar och Skugga |
| `videos.json` | 28 (3–4 per kapitel) | kontrollerade med oEmbed |
| `exam.json` | 12 uppgifter, id `frs5-co-N`, `frs5-ce-N`, `frs5-pe-N`, `frs5-po-N` | DELF B1 i fyra delar (3 uppgifter var): `co`, `ce`, `pe`, `po`; format i `docs/spec/prov.md` och `languages/fr4/content/exam.json` |

- `prompts.json`: `need.tenses` får innehålla `"présent"`, `"passé composé"`, `"imparfait"`, `"futur proche"`, `"conditionnel"` och `"subjonctif"` (`tenseCheck` ärvs från `languages/fr4/lang.js`). `need.connectors` (3–6) räknar bindeorden i `connectors` (Franska 3:s och 6:s listor plus de för mål, motsats och medgivande som läggs till i `lang.js`).
- `stories.json`: `gaps[i].cat` är `"tempus"` (passé composé, imparfait, plus-que-parfait, conditionnel, subjonctif, gérondif) eller `"bindeord"`.
- Litteratur och sång: novellen `r-v6-nouvelle` och romanen i `r-v6-critique` är egna texter. Senghor (d. 2001) och Piaf (d. 1963) presenteras med egna ord, utan citat. Citera bara verk av upphovspersoner som dog före 1956.

## Grammatikområden (`grammar-<område>.json`, format i `docs/spec/grammatik.md`)

Varje område har en egen fil, `grammar-<område>.json`, med id-prefixet `<område>-` och 20–22 frågor. Områdena och regelnamnen står i `languages/frs5/grammar.json`; `secs` anger kapitlen där området övas. Meningarna är på nivå B1, 6–16 ord, och franskan har ingen `meta`.

| topic | rule | innehåll |
|---|---|---|
| `subj` | `subj-falloir`, `subj-vol`, `subj-emo`, `subj-conj`, `subj-form`, `subj-ind`, `subj-inf` | subjonctif efter il faut que, vilja, känslor, pour que/avant que/bien que; indikativ efter penser que, espérer que, après que; infinitiv vid samma subjekt (v1, v4) |
| `condp` | `condp-form`, `condp-regret`, `condp-etre`, `condp-info` | conditionnel passé: bildning, ånger och förebråelse, med être, obekräftad uppgift i nyheter (v2, v8) |
| `sipqp` | `sipqp-form`, `sipqp-mix`, `sipqp-temps` | si + plus-que-parfait → conditionnel passé, blandade si-satser (v2, v6) |
| `ger` | `ger-form`, `ger-irr`, `ger-sens`, `ger-tout` | gérondif: bildning, en étant/ayant/sachant, betydelsen, tout en (v4, v7) |
| `pass` | `pass-pres`, `pass-pc`, `pass-temps`, `pass-accord`, `pass-par`, `pass-on` | passiv i olika tempus, kongruens, par eller de, on i stället för passiv (v3, v7) |
| `accord` | `accord-pron`, `accord-que`, `accord-apres`, `accord-q`, `accord-en` | participets kongruens med avoir: objektspronomen, relativt que, frågor, ingen kongruens med en (v5, v6) |
| `disc` | `disc-imp`, `disc-pqp`, `disc-cond`, `disc-q`, `disc-imper`, `disc-pron` | indirekt tal i dåtid: tempusföljd, indirekta frågor, uppmaningar, byte av pronomen (v5, v6) |
| `conn` | `conn-but`, `conn-opp`, `conn-conc`, `conn-prep` | bindeord för mål, motsats och medgivande; bindeord eller preposition (malgré, au lieu de) (v1, v8) |

Regelsidor (`regler.json`) finns för alla åtta områdena.

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka, så alla felalternativ måste vara **entydigt fel**. Undantagna (`ERR_SKIP` i `src/kinds/60-grammar.js`) är `disc-imp`, `disc-pqp` och `disc-cond`, eftersom tempusföljden i indirekt tal ofta inte följs i talspråk (il a dit qu'il est fatigué).

## Övrigt

- Inga verkliga personnamn på elever. Fakta i kultur- och porträttexterna (årtal, siffror, namn) ska gå att kontrollera.
- Täckningen mäts med `python3 tools/tackning.py frs5` (mål: berättelser, läs- och provtexter minst 97–98 %, hörtexter minst 95 %; kedjan är fr1, fr2, fr, frs4 och frs5).
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.
