# Innehåll till övningarna i Tyska 7

Eleven är 18–19 år, har läst Tyska 4–6 på egen hand och läser nu Tyska 7 (Moderna språk 7, steg 7, GERS B2.1 mot C1). Målet är att studera musik i Tyskland: Goethe B2 säkert, TestDaF (TDN 4) eller Goethe C1 som utblick, och att klara föreläsningar, seminarier, mejl till lärare, studieordningar och avtal. Texterna ska vara på nivå **B2+ till C1**: korrekt, idiomatisk standardtyska med nominalstil där den passar (vetenskap, avtal, föreläsningar), passiv i alla former, Konjunktiv I i referat, particip-attribut, modalverb i perfekt, Futur II och varierade konnektorer. Allt är eget, AI-skrivet material; inga upphovsrättsskyddade texter.

Kapitel-id och teman:
- s1: Studieren in Deutschland (Hochschulsystem, Bewerbung und Zulassung, Immatrikulation, Studienordnung, Vorlesung, Seminar, Prüfungen)
- s2: Musikwissenschaft und Konzertleben (Analyse, Epochen, Interpretation, Aufführungspraxis, Kritik, Konzertbetrieb)
- s3: Wissenschaft und Forschung (Methoden, Studien, Statistik, Grafiken beschreiben, Hypothesen, Forschungsethik)
- s4: Recht und Verträge (Mietvertrag, Arbeitsvertrag, Konzertvertrag, Urheberrecht, GEMA, Haftung)
- s5: Wirtschaft und Arbeitsmarkt (Konjunktur, Kulturförderung, Stiftungen, Orchesterfinanzierung, Selbstständigkeit, Steuern)
- s6: Politik und Gesellschaft (Föderalismus, Parteien, Gesetzgebung, Bürgerbeteiligung, soziale Ungleichheit)
- s7: Medien und Rhetorik (Presse, Öffentlichkeit, Desinformation, Rede, Debatte, Argumentation, Stilmittel)
- s8: Geschichte und Erinnerungskultur (Weimarer Republik, NS-Zeit und Aufarbeitung, Teilung und Wiedervereinigung, Gedenkstätten, Stolpersteine)
- sr: Redemittel für Referat, Seminar und Hausarbeit

Enligt kursmallen (`docs/kursmall.md`, steg 7): hörtexter 300–600 ord (föreläsningsutdrag, radiodebatt, seminarium), lästexter 450–800 ord (vetenskaplig text, kommentar, avtalsutdrag, essä, text med grafik beskriven i ord), 8 frågor per text, skrivuppgifter 200–350 ord med källa och stilnivå (Erörterung, Zusammenfassung, grafikbeskrivning, formellt brev), 4–5 uppgifter med litteratur i olika genrer och retorik.

Formatet och reglerna är desamma som för Tyska 5 och 6: se `languages/de/content/SPEC.md`, `languages/de/content/GRAMMATIK-SPEC.md` och exemplen i `languages/de6/content/*.json`. Fältet med tysk text heter `fr`. I `prompts.json` räknas bindeord mot listan i `languages/de/lang.js`, och `need.tenses` får bara innehålla `Präsens`, `Perfekt`, `Präteritum`, `Konjunktiv II` och `Passiv`.

Citat ur litteratur får bara komma från författare som dog före 1956 (fri text i Tyskland 70 år efter dödsåret), t.ex. Kafka (d. 1924), Rilke (d. 1926), Schnitzler (d. 1931), Zweig (d. 1942), Th. Mann (d. 1955), Heine (d. 1856), Büchner (d. 1837). Brecht (d. 1956) och senare är inte fria.

Grammatikområdena i Tyska 7 (topic och rule står i `languages/de7/grammar.json`):

| topic | fil | innehåll |
|---|---|---|
| `nomverb` | grammar-a | verbalstil → nominalstil (`nv-nom`), nominalstil → verbalstil, `rw` (`nv-verb`), prepositionen i nominalstil (`nv-prep`), Funktionsverbgefüge (`nv-fvg`) |
| `fut2` | grammar-a | bildning (`f2-bildung`), avslutat i framtiden (`f2-zukunft`), förmodan (`f2-vermutung`) |
| `modperf` | grammar-b | *hat üben müssen* (`mpf-perf`), *dass sie hat üben müssen* (`mpf-neben`), *hätte fragen sollen* (`mpf-k2`), *hat ihn kommen lassen/hören* (`mpf-lassen`) |
| `modsubj` | grammar-b | *soll* (`msu-sollen`), *will* (`msu-wollen`), *muss, dürfte, kann, könnte* (`msu-grad`), dåtid *soll … gewesen sein* (`msu-verg`) |
| `passiv` | grammar-c | alla tempus (`pa-tempus`), med modalverb även i perfekt och Konjunktiv II (`pa-modal`), Zustandspassiv (`pa-zustand`), von/durch (`pa-von`), opersonligt passiv (`pa-unpers`) |
| `passersatz` | grammar-c | *sich lassen* (`pe-lassen`), *-bar/-lich/-fähig* (`pe-bar`), *sein + zu* (`pe-seinzu`), *Anwendung finden, bekommen* (`pe-fvg`) |
| `partattr` | grammar-c | ändelse (`pat-endung`), ordning (`pat-bau`), gerundiv (`pat-zu`), relativsats ⇄ attribut, `rw` (`pat-rel`) |
| `wortbild` | grammar-d | prefix (`wb-prefix`), substantivsuffix (`wb-subst`), adjektivsuffix (`wb-adj`), sammansättningar och Fugen-s (`wb-komp`) |
| `mittelfeld` | grammar-d | pronomen före substantiv (`mf-pron`), te-ka-mo-lo (`mf-tekamolo`), nicht (`mf-nicht`), sich tidigt (`mf-reflex`) |
| `k1ref` | grammar-d | Konjunktiv I i referat (`kr-rede`), Konjunktiv II som ersättning (`kr-ersatz`), dåtid (`kr-verg`), källan: *laut, zufolge, wie … betont* (`kr-einl`) |

"Hitta felet" (`err`) byggs automatiskt av luckfrågor med en lucka. Därför måste alla felalternativ vara **tydligt fel** i meningen, även i talspråk. Bara `kr-rede` undantas (där indikativ går i vardagligt tal).
