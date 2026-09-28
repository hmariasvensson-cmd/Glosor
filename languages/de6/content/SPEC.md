# Innehåll till övningarna i Tyska 6

Eleven är 18 år, har läst Tyska 5 på egen hand och läser nu Tyska 6 (Moderna språk 6, steg 6, GERS B1.2 mot B2). Målet är ett B2-prov (Goethe-Zertifikat B2, telc B2 eller TestDaF) och en ansökan till en musikhögskola i Tyskland. Texterna ska vara på nivå **B1+ till B2**: naturlig, korrekt standardtyska med alla tempus, Konjunktiv I och II, passiv och Passiversatz, particip-attribut, nominalstil där den passar (formella texter, föredrag) och varierade bindeord. Läs `languages/de6/words.txt` och använd kapitlets glosor.

Kapitel-id och teman:
- s1: Studium und Bewerbung (ansökan till musikhögskola, Motivationsschreiben, studiefinansiering, studentliv)
- s2: Wissenschaft und Technik (forskning, AI, medicin, musik och hjärnan)
- s3: Politik und Geschichte (demokrati, Grundgesetz, 1900-talets historia, EU, indirekt tal i nyheter)
- s4: Literatur und Epochen (Aufklärung, Sturm und Drang, Klassik, Romantik, Vormärz, moderna författare)
- s5: Arbeit und Wirtschaft (arbetsmarknad, frilansande musiker, fackförbund, hållbar ekonomi)
- s6: Musik und Bühne (orkester, opera, teater, provspelning, recensioner)
- s7: Ethik und Philosophie (Kant, ansvar, AI-etik, djurrätt, existentiella frågor)
- s8: Stadt, Land, Migration (urbanisering, landsbygd, Gastarbeiter, integration, identitet)
- sr: Redemittel · Präsentieren und Diskutieren

Enligt kursmallen (`docs/kursmall.md`, steg 6): hörtexter 250–350 ord, lästexter 350–550 ord, 6–8 frågor per text, skrivuppgifter 150–250 ord med struktur (inledning, avslutning), 4–5 uppgifter med litteratur, dramatik, film eller musik (författare och epok). Texttyper som tillkommer i steg 6: debatt, föredrag, formellt brev eller ansökan, dramatik, äldre litteratur.

Formatet och reglerna är desamma som för Tyska 5: se `languages/de/content/SPEC.md`, `languages/de/content/GRAMMATIK-SPEC.md` och exemplen i `languages/de/content/*.json`. Fältet med tysk text heter `fr`. I `prompts.json` räknas bindeord mot listan i `languages/de/lang.js`, och `need.tenses` får bara innehålla `Präsens`, `Perfekt`, `Präteritum`, `Konjunktiv II` och `Passiv`.

Grammatikområdena i Tyska 6 (topic och rule står i `languages/de6/grammar.json`):

| topic | fil | innehåll |
|---|---|---|
| `k1` | grammar-a | Konjunktiv I i indirekt tal (`k1-rede`), Konjunktiv II som ersättning när Konjunktiv I är lika med indikativ (`k1-ersatz`), dåtid: *habe gemacht, sei gegangen* (`k1-verg`), indirekta frågor och uppmaningar: *ob, sollen, mögen* (`k1-frage`) |
| `k2verg` | grammar-a | *hätte … gemacht, wäre … gegangen* i villkor (`k2p-wenn`), önskan och ånger (`k2p-wunsch`), med modalverb: *hätte … machen müssen* (`k2p-modal`), *als ob* och *fast* (`k2p-als`) |
| `passersatz` | grammar-a | *sich lassen* (`pe-lassen`), *-bar/-lich* (`pe-bar`), *sein + zu* (`pe-seinzu`), *man* och reflexiv form (`pe-man`) |
| `partattr` | grammar-a | ändelse på participet i långa attribut (`pat-endung`), ordningen (`pat-bau`), gerundiv *die zu lösende Aufgabe* (`pat-zu`), relativsats → attribut, `rw` (`pat-rel`) |
| `nominal` | grammar-a | substantiv av verb (`nom-bildung`), bisats → preposition + substantiv (`nom-prep`), genitivattribut (`nom-gen`), nominalstil → verbalstil, `rw` (`nom-verbal`) |
| `nvv` | grammar-b | Nomen-Verb-Verbindungen: verbet (`nvv-verb`), prepositionen och artikeln (`nvv-prep`), passiv betydelse: *zur Diskussion stehen, Anwendung finden* (`nvv-passiv`) |
| `genprep` | grammar-b | prepositioner med genitiv utöver Tyska 5: orsak (`gp-grund`), motsats (`gp-gegen`), tid och plats (`gp-raum`), hänsyn och syfte (`gp-bezug`) |
| `partikel` | grammar-b | modalpartiklar *doch, ja, eben, halt, wohl, schon, mal, denn, bloß* (`mp-*`) |
| `modsubj` | grammar-b | subjektiva modalverb: *soll* (`ms-sollen`), *will* (`ms-wollen`), *muss, dürfte, kann, könnte* (`ms-vermutung`), dåtid: *soll … gewesen sein* (`ms-verg`) |
| `textbind` | grammar-b | konnektorer för textbindning: kontrast, följd, medgivande, villkor och sätt (`tb-*`) |

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka. Därför måste alla felalternativ vara **tydligt fel** i meningen, även i talspråk. Bara `k1-rede` undantas (där indikativ går i vardagligt tal).
