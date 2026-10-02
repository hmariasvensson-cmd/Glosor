# Innehåll till övningarna i Italienska 3

Italienska 3 motsvarar Moderna språk 3 (steg 3, GERS A2.1; i Gy25 fortsättning, nivå 1). Eleverna är svenska gymnasie- eller vuxenelever som har läst Italienska 1 och 2 (`it1`, `it2`). Kursen leder vidare till Italienska 4 (`it4`, mot CELI 1). Texterna ska vara på nivå **A2**: naturlig, korrekt italienska med passato prossimo och imperfetto i berättelser, futuro (även som gissning), condizionale för råd och önskan, objektspronomen (även i passato prossimo och med modalverb), si opersonligt och enkla relativsatser med che och cui. Texttyperna för steget: berättelse i dåtid, enkel nyhet, blogg, mejl, forum, sakprosa om en plats eller person, diskussion, folkvisa. Se `docs/nivaer-italienska.md` (steg 3) och `docs/kursmall.md`. Läs `languages/it3/words.txt` och använd kapitlets glosor.

Formaten och de allmänna reglerna står i `docs/spec/` (`docs/spec/allmant.md` och en fil per typ); det som gäller alla italienska kurser (fältet `fr`, nyckeln i `gloss`, tempusnamnen) står i `languages/it1/content/SPEC.md`. Artiklar, pronomen, elision, bindeord, tempusigenkänning och verbtabeller ärvs från Italienska 2 (`extends: "it2"` i `lang.js`).

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Ungefär 80–110 ord per kapitel (A2, exempelmeningar 5–12 ord) och 60–65 fraser i Espressioni, sammanlagt cirka 790. Italienska 3 ska inte upprepa ord från Italienska 1 och 2 (kontrollera med skript). Oregelbundna verb har presens io-form och passato prossimo i kommentaren.

### Kapitel (id ändras aldrig)

- `#k1|Kap 1 · Ricordi di viaggio`: semesterminnen, Italiens regioner, resa med tåg och färja, berätta i dåtid
- `#k2|Kap 2 · Studiare e lavorare`: skola och maturità, universitet, sommarjobb, anställningsintervju
- `#k3|Kap 3 · Media e notizie`: tidningar, radio och tv, sociala medier, falska nyheter
- `#k4|Kap 4 · Salute e sport`: kroppen, läkaren, sömn och stress, träning och tävling
- `#k5|Kap 5 · Natura e ambiente`: vulkaner och nationalparker, djur och växter, sopsortering, plast
- `#k6|Kap 6 · Città o campagna?`: stadsdel och piazza, borghi, bostad, för- och nackdelar
- `#k7|Kap 7 · Arte e musica`: museum, konsert, opera och Verdi, Sanremo och cantautori
- `#k8|Kap 8 · Relazioni ed emozioni`: vänskap, kärlek, gräl och försoning, familj, känslor
- `#kr|Espressioni · Discutere e reagire`: säga sin åsikt, hålla med och säga emot, reagera, be om ursäkt

## Innehåll per typ

| Fil | Antal | Längd och frågor |
|---|---|---|
| `listening.json` | 16 (två per kapitel, id `it3-l-<kap>` och `it3-l-<kap>b`) | 150–175 ord, 6–7 frågor (helhet, detalj, tolkning), dialog med `who`, radionyhet eller meddelande |
| `reading.json` | 8 (en per kapitel, `it3-r-<kap>`) + 1 visa (`it3-r-lit-lavanderina`) | 215–300 ord, 6–7 frågor; visan är kort med 4 frågor |
| `stories.json` | 8 (en per kapitel, `it3-s-<kap>`) | 130–160 ord, 13–15 luckor, med `sv` |
| `culture.json` | 8 (en per kapitel, `it3-c-<kap>-<ämne>`) | 100–125 ord, fråga och jämförelse med Sverige |
| `prompts.json` | 24 (tre per kapitel: `it3-w-<kap>`, `…b`, `…c`) | kort 60–80 ord, mellan 80–110 ord, friare 100–140 ord |
| `phrases.json` | 42 (`it3-pNN`) | situation → replik |
| `mal.json` | 9 (`mal-<kap>`, även `mal-kr`) | kapitelmål i jagform |
| `uttal.json` | 8 moment (`sec` k1–k7, två i k2) | ordpar och Skugga |
| `videos.json` | 16 (två per kapitel) | kontrollerade med oEmbed |

Kursen har inget språkprov (`exam.json`); provträningen börjar i Italienska 4 (CELI 1).

- `prompts.json`: `need.tenses` får innehålla `"presente"`, `"passato prossimo"`, `"imperfetto"`, `"futuro"` och `"condizionale"` (`tenseCheck` i `languages/it3/lang.js` lägger till condizionale till det som ärvs). `need.connectors` (2 för korta, 3 för längre uppgifter) räknar bindeorden i `connectors` (Italienska 1:s lista plus de som läggs till i `lang.js`).
- `stories.json`: `gaps[i].cat` är `"tempus"` (passato prossimo eller imperfetto, essere eller avere, futuro, condizionale, pronomen) eller `"bindeord"`.
- Sång och litteratur: två skrivuppgifter utgår från sånger (`it3-w-k1c` om « Funiculì, funiculà » från 1880, `it3-w-k7c` om Lucio Dallas « Caruso », som bara sammanfattas med egna ord eftersom texten är skyddad). Folkvisan « La bella lavanderina » står i `reading.json`. Citera bara texter av upphovspersoner som dog före 1956.

## Grammatikområden (`grammar-*.json`, format i `docs/spec/grammatik.md`)

Områdena och regelnamnen står i `languages/it3/grammar.json`; `secs` anger kapitlet där området kommer först. Meningarna är på nivå A2, 5–14 ord, med vardagliga teman ur `words.txt`.

| topic | fil | antal | rule | innehåll |
|---|---|---|---|---|
| `pp-imp` | grammar-a | 25 | `ppi-evento`, `ppi-sfondo`, `ppi-abitudine`, `ppi-mentre`, `ppi-verbi` | passato prossimo eller imperfetto (k1) |
| `pron-ton` | grammar-a | 25 | `ton-prep`, `ton-enfasi`, `ton-vs-atono` | betonade pronomen: con me, per te, a lui piace (k2) |
| `futuro` | grammar-a | 25 | `fut-forme`, `fut-quando`, `fut-ipotesi` | futurots former, quando/se + futuro, gissning: sarà stanco (k2) |
| `pron-pp` | grammar-a | 25 | `pp-lo-la`, `pp-li-le`, `pp-ne`, `pp-ind` | pronomen i passato prossimo och participets böjning: l'ho vista, ne ho letti due (k3) |
| `pron-pos` | grammar-a | 25 | `pos-modale`, `pos-inf`, `pos-imper`, `pos-imper-mono` | pronomenets plats: devo farlo, lo devo fare, dimmi (k4) |
| `piacere-pp` | grammar-a | 25 | `piac-pp`, `piac-imp`, `piac-pron` | piacere i dåtid: mi è piaciuto, ti sono piaciute (k7) |
| `si-imp` | grammar-b | 22 | `si-imp`, `si-pass`, `si-rifl` | si opersonligt: si dice, si vendono, ci si diverte (k3) |
| `cond` | grammar-b | 25 | `cond-forme`, `cond-consiglio`, `cond-desiderio` | condizionale: former, råd och artighet (k4) |
| `indef` | grammar-b | 25 | `ind-qualche`, `ind-nessuno`, `ind-ogni`, `ind-qualcosa` | qualche, alcuni, nessuno, niente, ognuno, qualcosa di bello (k5) |
| `comp` | grammar-b | 25 | `comp-piu`, `comp-irr`, `superl-rel`, `superl-ass` | komparation: più … di/che, migliore, meglio, -issimo (k6) |
| `rel` | grammar-b | 25 | `rel-che`, `rel-cui` | che och preposition + cui (k7) |
| `stare-per` | grammar-b | 20 | `stare-per`, `stare-ger` | stare per + infinitiv och stare + gerundium (k8) |

`id`-prefixet är topic och löpnumret tresiffrigt. Regelsidor (`regler.json`) finns för alla områden utom `rel` och `stare-per`.

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka, så alla felalternativ måste vara **entydigt fel**. Undantagna (`ERR_SKIP` i `src/kinds/60-grammar.js`) är `ppi-evento`, `ppi-sfondo`, `ppi-abitudine` och `ppi-mentre`, eftersom valet mellan passato prossimo och imperfetto ofta går att försvara i ett annat sammanhang.

## Övrigt

- Inga verkliga personnamn på elever. Fakta i kulturtexterna (årtal, siffror, namn) ska gå att kontrollera.
- Täckningen mäts med `python3 tools/tackning.py it3` (mål: berättelser och lästexter minst 97–98 %, hörtexter minst 95 %; ord som inte finns i kedjan it1–it3 läggs in som glosor eller kursord).
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.
