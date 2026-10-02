# Innehåll till övningarna i Italienska 4

Italienska 4 motsvarar Moderna språk 4 (steg 4, GERS A2.2 mot B1; i Gy25 fortsättning, nivå 2). Kursen har ingen lärobok (`selfStudy: true`): eleven har läst Italienska 1–3 (`it1`, `it2`, `it3`) och pluggar på egen hand, med **CELI 1 (A2)** som provmål (`exam` i `lang.js`). Kursen leder vidare till Italienska 5 (`it5`). Texterna ska vara på nivå **A2+ till låg B1**: naturlig, korrekt italienska med alla tempus i indikativ, trapassato prossimo, futuro anteriore, congiuntivo presente efter åsikt, vilja och känsla, si passivante, pronomi combinati, imperativ med Lei och sambandsord för att argumentera. Texttyperna för steget: reportage och tidningsartikel, insändare (lettera al direttore), blogg, novell (racconto), filmrecension, ansökan om praktikplats, radionyheter och intervju. Se `docs/nivaer-italienska.md` (steg 4) och `docs/kursmall.md`. Läs `languages/it4/words.txt` och använd kapitlets glosor.

Formaten och de allmänna reglerna står i `docs/spec/` (`docs/spec/allmant.md` och en fil per typ); det som gäller alla italienska kurser (fältet `fr`, nyckeln i `gloss`, tempusnamnen) står i `languages/it1/content/SPEC.md`. Artiklar, pronomen, elision, bindeord, tempusigenkänning och verbtabeller ärvs från Italienska 2 (`extends: "it2"` i `lang.js`, inte från Italienska 3); `verbs.json` lägger till trapassato prossimo, futuro anteriore och congiuntivo presente.

## Ordlistan (`words.txt`, format i `docs/spec/ordlista.md`)

Ungefär 90–110 ord per kapitel (A2–B1, exempelmeningar 5–12 ord) och cirka 60 fraser i Espressioni, sammanlagt cirka 830. Italienska 4 ska inte upprepa ord från Italienska 1–3 (kontrollera med skript). Oregelbundna verb har presens io-form och passato prossimo med hjälpverb i kommentaren.

### Kapitel (id ändras aldrig)

- `#c1|Kap 1 · Progetti per il futuro`: studier och yrken, praktikplats, konservatorium, drömmar och planer
- `#c2|Kap 2 · Questioni etiche`: mat och djur, slit-och-släng, dilemman, rätt och fel
- `#c3|Kap 3 · Tradizioni e feste`: nationella högtider, Palio di Siena, karnevalen i Venedig, jul i Sverige och Italien
- `#c4|Kap 4 · Come si vive`: boende och inneboende, familjen förr och nu, stad och landsbygd
- `#c5|Kap 5 · Cinema e letteratura`: film (neorealismen, Cinecittà), recension, böcker och bokklubb
- `#c6|Kap 6 · La società`: nyheter, volontärarbete, rösträtt, jämställdhet, författningen
- `#c7|Kap 7 · Sport e salute`: hos läkaren, motion, maraton, Giro d'Italia, damfotboll
- `#c8|Kap 8 · Regioni e dialetti`: regioner, dialekter, italienskans historia, emigration
- `#cr|Espressioni · Discutere e argomentare`: åsikt och motivering, hålla med och säga emot, nyansera, avsluta

## Innehåll per typ

| Fil | Antal | Längd och frågor |
|---|---|---|
| `listening.json` | 16 (två per kapitel, `it4-l-<kap>a` och `…b`) | 175–205 ord, 6 frågor (helhet, detalj, tolkning), dialog med `who`, nyheter, röstmeddelande, intervju |
| `reading.json` | 12 (1–2 per kapitel, `it4-r-<kap>` eller `…a`/`…b`) | 250–265 ord, 6 frågor |
| `stories.json` | 8 (en per kapitel, `it4-s-<kap>`) | 100–120 ord, 6–7 luckor, med `sv` |
| `culture.json` | 8 (en per kapitel, `it4-c-<kap>-<ämne>`) | 80–105 ord, fråga och jämförelse med Sverige |
| `prompts.json` | 24 (tre per kapitel, `it4-w-<kap>a`, `…b`, `…c`) | 80–150 ord |
| `phrases.json` | 31 | situation → replik |
| `mal.json` | 9 (`mal-<kap>`, även `mal-cr`) | kapitelmål i jagform |
| `uttal.json` | 8 (`utt4-…`, utan `sec`) | ordpar och Skugga |
| `videos.json` | 16 (1–3 per kapitel) | kontrollerade med oEmbed |
| `exam.json` | 18 uppgifter, id `it4-le-N`, `it4-as-N`, `it4-sc-N`, `it4-or-N` | CELI 1 i fyra delar: `lettura` (6, varav 2 para ihop), `ascolto` (4), `scrittura` (4), `orale` (4); format i `docs/spec/prov.md` |

- `prompts.json`: `need.tenses` får bara innehålla `"presente"`, `"passato prossimo"`, `"imperfetto"` och `"futuro"`, eftersom tempusigenkänningen ärvs från Italienska 2 (Italienska 4 har ingen igenkänning för condizionale eller congiuntivo). `need.connectors` är 3 och räknar bindeorden i `connectors` (Italienska 1:s lista plus de som läggs till i `lang.js`), `need.chapterWords` är 3.
- `stories.json`: `gaps[i].cat` är `"tempus"` (trapassato, futuro anteriore, congiuntivo eller indikativ, hjälpverb) eller `"bindeord"`.
- Litteratur och film: novellerna i `reading.json` (`it4-r-c2b`, `it4-r-c5b`) är egna texter. Filmer och böcker av upphovspersoner som lever eller dog 1956 eller senare (t.ex. « Ladri di biciclette », 1948) recenseras och sammanfattas med egna ord, utan citat ur manus eller text.

## Grammatikområden (`grammar-a.json`, format i `docs/spec/grammatik.md`)

Alla frågor ligger i `grammar-a.json`. Områdena och regelnamnen står i `languages/it4/grammar.json`; `secs` anger kapitlet där området kommer först. Meningarna är på nivå A2–B1, 5–14 ord.

| topic | antal | rule | innehåll |
|---|---|---|---|
| `ripasso` | 20 | `pron`, `ci-ne`, `tempi` | repetition: objektspronomen, ci och ne, alla tempus i indikativ (c1) |
| `fut-ant` | 20 | `fa-forme`, `fa-uso`, `fa-ipotesi` | futuro anteriore: avrò finito, sarà già partito (c1) |
| `se-reale` | 20 | `se-pres`, `se-fut`, `se-imp` | verkliga om-satser: se piove, restiamo a casa (c1) |
| `congiuntivo` | 25 | `cong-forme`, `cong-opinione`, `cong-volonta`, `cong-imp`, `cong-o-ind` | congiuntivo presente efter åsikt, vilja och känsla, bisogna che, och när det ska vara indikativ (c2) |
| `si-pass` | 20 | `si-sing`, `si-plur`, `si-imp` | si passivante: si vende, si vendono (c3) |
| `combinati` | 22 | `comb-me`, `comb-glie`, `comb-pp`, `comb-ce` | pronomi combinati: me lo, glielo, ce l'ho (c4) |
| `trapassato` | 19 | `trap-forme`, `trap-uso` | trapassato prossimo (c5) |
| `relativi` | 20 | `rel-chi`, `rel-quello`, `rel-quale`, `rel-cui` | chi, quello che, il quale, cui (c5) |
| `connettivi` | 19 | `conn-cons`, `conn-contr`, `conn-causa`, `conn-conc` | quindi, perciò, invece, mentre, siccome, anche se (c6) |
| `imp-lei` | 20 | `lei-forme`, `lei-pron`, `lei-neg` | imperativ med Lei: mi dica, si accomodi (c7) |
| `pron-verbi` | 20 | `pv-andarsene`, `pv-farcela`, `pv-metterci` | pronominella verb: andarsene, farcela, metterci, volerci (c8) |

`id`-prefixet är topic och löpnumret tresiffrigt. Regelsidor (`regler.json`) finns för alla områden utom `pron-verbi`.

"Hitta felet" (`err`, `secs: ["c8"]`) byggs automatiskt av luckfrågor med en lucka, så alla felalternativ måste vara **entydigt fel**. Undantagna (`ERR_SKIP` i `src/kinds/60-grammar.js`) är `fa-uso`, `fa-ipotesi` och `trap-uso`, där felalternativet (futuro, passato prossimo) ofta går att försvara i vardagligt tal.

## Övrigt

- Inga verkliga personnamn på elever. Fakta i kultur- och samhällstexterna (årtal, siffror, namn) ska gå att kontrollera.
- Täckningen mäts med `python3 tools/tackning.py it4` (mål: läs- och provtexter minst 97–98 %, hörtexter minst 95 %).
- Validera JSON med `python3 -c "import json;json.load(open('FIL'))"`, kör `python3 build.py` och läs igenom texten en gång till innan du är klar.
