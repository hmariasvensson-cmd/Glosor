# Innehåll till övningarna i Franska 4 (`frs4`)

Franska 4 motsvarar Moderna språk 4 (steg 4, GERS A2.2 mot B1; i Gy25 fortsättning, nivå 2). Kursen har ingen lärobok (`selfStudy: true`): eleven är 17–18 år, har läst Franska 3 (`fr`, med lärobok) och pluggar på egen hand, med **DELF A2** som provmål i kursen (`exam` i `lang.js`) och DELF B1 längre fram. Kedjan är fr1 → fr2 → fr → **frs4** → frs5 → fr4 (Franska 6) → fru; koden `frs4` valdes eftersom `fr4` redan är Franska 6. Texterna ska vara på nivå **A2+ till låg B1**: naturlig, korrekt modern franska med imparfait och passé composé i berättelser, plus-que-parfait, conditionnel présent (artighet, råd, önskan), si-satser (si + présent och si + imparfait), dubbla pronomen, dont/ce qui/ce que, indirekt tal i presens och il faut que + subjonctif. Texttyperna för steget: reportage, tidningsartikel, insändare (courrier des lecteurs), novell och romanutdrag (egna texter), filmrecension, resedagbok, annonser och formellt mejl. Se `docs/nivaer-franska.md` (steg 4) och `docs/kursmall.md`. Läs `languages/frs4/words.txt` och använd kapitlets glosor.

Formaten står i `docs/spec/` (allmänna regler i `docs/spec/allmant.md`, en fil per typ); Franska 3:s tillägg i `languages/fr/content/SPEC.md` och exemplen i `languages/fr/content/*.json`. Accenter, artiklar, pronomen, genus, elision, bindeord, tempusigenkänning och verbtabeller ärvs från Franska 3 (`extends: "fr"` i `lang.js`).

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Ungefär 95–115 ord per kapitel (A2–B1, exempelmeningar 5–12 ord) och cirka 45 uttryck i Expressions, sammanlagt cirka 870. Franska 4 ska inte upprepa ord från fr1, fr2 och fr (och inte heller från frs5, fr4 och fru, som bygger vidare); kontrollera med skript. Oregelbundna verb och oregelbunden plural står i kommentaren.

### Kapitel (id ändras aldrig)

- `#h1|Kap 1 · Projets d'avenir`: studier efter gymnasiet, Parcoursup, sabbatsår, praktik, drömyrken
- `#h2|Kap 2 · Amitié et relations`: vänskap, gräl och försoning, familj (även ombildad), känslor, la bise
- `#h3|Kap 3 · Questions de société`: skoluniform, mobilen i skolan, köttkonsumtion, volontärarbete, laïcité
- `#h4|Kap 4 · Fêtes et traditions`: jul, 14 juillet, Fête des Lumières, bröllop på mairie, Chandeleur
- `#h5|Kap 5 · Logement et conditions de vie`: hyra bostad, annonser, kollektiv, stad och landsbygd, HLM och banlieue
- `#h6|Kap 6 · Médias et publicité`: nyheter och falska nyheter, influencers, reklam och barn, pressen
- `#h7|Kap 7 · Cinéma et littérature`: film, recension, roman och novell, Cannesfestivalen
- `#h8|Kap 8 · Environnement et voyages`: resa utan flyg, nattåg, Québec, miljö, nationalparker
- `#hr|Expressions · Discuter et convaincre`: åsikt, argument och motargument, hålla med, övertyga

## Innehåll per typ

| Fil | Antal | Längd och frågor |
|---|---|---|
| `listening.json` | 16 (två per kapitel, `l-<kap>-1` och `-2`) | 185–225 ord, 6 frågor (helhet och detalj, ibland tolkning), dialog eller intervju med `who`, radioinslag |
| `reading.json` | 10 (1–2 per kapitel, `r-<kap>-<ämne>`) | 260–285 ord, 6 frågor |
| `stories.json` | 8 (en per kapitel, `s-<kap>`) | 80–105 ord, 7–8 luckor, med `sv` |
| `culture.json` | 8 (en per kapitel, `c-<kap>`) | 80–105 ord, fråga och jämförelse med Sverige |
| `prompts.json` | 24 (tre per kapitel: `w-<kap>-kort`, en källuppgift `w-<kap>-kalla`/`-mejl`/`-insandare` och `w-<kap>-lang`) | kort 80–110 ord, källuppgift 80–160 ord (utgår från en hör- eller lästext i samma kapitel och återger den med egna ord), lång 120–180 ord |
| `phrases.json` | 38 | situation → replik |
| `mal.json` | 9 (`mal-<kap>`, även `mal-hr`) | kapitelmål i jagform |
| `uttal.json` | 8 (ett moment per kapitel h1–h8) | ordpar och Skugga |
| `videos.json` | 33 (3–5 per kapitel) | kontrollerade med oEmbed |
| `exam.json` | 24 uppgifter, id `frs4-co-N`, `frs4-ce-N`, `frs4-pe-N`, `frs4-po-N` | DELF A2 i fyra delar: `co` (8), `ce` (8), `pe` (4), `po` (4); format i `docs/spec/prov.md` och `languages/fr/content/exam.json` |

- `prompts.json`: `need.tenses` får innehålla `"présent"`, `"passé composé"`, `"imparfait"`, `"futur proche"` (ärvt från Franska 3) och `"conditionnel"` (`tenseCheck` i `languages/frs4/lang.js`). `need.connectors` (2–4) räknar bindeorden i `connectors` (Franska 3:s lista plus de för orsak, följd och åsikt som läggs till i `lang.js`).
- `stories.json`: `gaps[i].cat` är `"tempus"` (imparfait, passé composé, plus-que-parfait, conditionnel, être eller avoir) eller `"bindeord"`.
- Litteratur och film: novellen `r-h2-nouvelle` och romanutdraget `r-h7-roman` är egna texter, liksom filmen i `r-h7-critique`. Citera bara verk av författare som dog före 1956; nyare verk sammanfattas med egna ord.

## Grammatikområden (`grammar-<område>.json`, format i `docs/spec/grammatik.md`)

Varje område har en egen fil, `grammar-<område>.json`, med id-prefixet `<område>-` och 22 frågor. Områdena och regelnamnen står i `languages/frs4/grammar.json`; `secs` anger kapitlen där området övas. Meningarna är på nivå A2–B1, 5–14 ord, och franskan har ingen `meta`.

| topic | rule | innehåll |
|---|---|---|
| `pqp` | `pqp-avoir`, `pqp-etre`, `pqp-recit` | plus-que-parfait med avoir och être, och i berättelse (h1, h4) |
| `cond` | `cond-form`, `cond-irr`, `cond-poli`, `cond-conseil` | conditionnel présent: bildning, oregelbundna stammar, artighet och råd (h1, h2) |
| `si` | `si-pres`, `si-imp` | si + présent → futur/présent/imperativ, si + imparfait → conditionnel (h2, h8) |
| `dpron` | `dpron-ordre`, `dpron-lui`, `dpron-en`, `dpron-pc`, `dpron-imper` | dubbla pronomen: je te le donne, il le lui a dit, donne-le-moi (h2, h6) |
| `rel2` | `rel-dont`, `rel-cequi`, `rel-ceque`, `rel-mix` | dont, ce qui, ce que (h3, h7) |
| `prepinf` | `pi-de`, `pi-a`, `pi-zero` | verb + de/à + infinitiv eller utan preposition (h1, h5) |
| `disc` | `disc-que`, `disc-si`, `disc-q`, `disc-pron`, `disc-imper` | indirekt tal i presens: il dit que, elle demande si, dire de + infinitiv (h6, h7) |
| `subj` | `subj-reg`, `subj-irr`, `subj-inf` | il faut que + subjonctif, eller il faut + infinitiv (h5, h8) |
| `conn` | `conn-cause`, `conn-cons`, `conn-opp`, `conn-temps` | bindeord för orsak, följd, motsats och tid (h3, hr) |

Regelsidor (`regler.json`) finns för alla nio områdena.

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka, så alla felalternativ måste vara **entydigt fel**. Undantagna (`ERR_SKIP` i `src/kinds/60-grammar.js`) är `pqp-avoir`, `pqp-etre` och `cond-poli`, där felalternativet (passé composé, présent eller imparfait) ofta går att försvara i ett annat sammanhang.

## Övrigt

- Inga verkliga personnamn på elever. Fakta i kulturtexterna (årtal, siffror, namn) ska gå att kontrollera.
- Täckningen mäts med `python3 tools/tackning.py frs4` (mål: berättelser, läs- och provtexter minst 97–98 %, hörtexter minst 95 %; kedjan är fr1, fr2, fr och frs4).
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.
