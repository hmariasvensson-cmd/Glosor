# Innehåll till nya övningar i Glosor (franska)

Eleven: svensk gymnasieelev i Franska 3 (Moderna språk 3), mål betyget A (nära B1). Texterna ska vara på nivå A2 till låg B1: korta meningar, vanliga ord, men med passé composé, imparfait, futur proche och bindeord. De ska vara naturlig, korrekt franska (stavning, accenter, kongruens, genus). Läs först `languages/fr/words.txt`. Där finns kapitlen (rader som börjar med #, t.ex. `#k2|Kap 2 · Arrivée à Paris`) och glosorna. Använd kapitlets glosor i texterna.

Kapitel-id och teman:
- k1: Vie et loisirs (fritid, sport, klättring, träning, beskriva personer)
- k1e: Zinédine et Zlatan (fotboll, kändisar, självförtroende)
- k1b: Ma vie au soleil (flytta till Nice, strand, vardag, "métro, boulot, dodo")
- k2: Arrivée à Paris (flygplats, tull, bagage, strejk, brevvän, RER)
- k2b: Le métro de Paris (metrons historia, stationer, pendla)
- k2c: Aux Champs-Élysées (Joe Dassins sång, promenera, möta någon)
- k3: Trouver un travail (anställningsintervju, sommarjobb, skidort)
- aller: passé composé med être (aller, venir, arriver, partir, tomber, naître, mourir …)

Formaten och de allmänna reglerna (JSON, apostrof, `gloss`, flervalsfrågor) står i `docs/spec/` (`docs/spec/allmant.md` och en fil per typ). Här står bara det som gäller Franska 3 och som de andra franska kurserna hänvisar till:

- `prompts.json`: `need.tenses` får innehålla `"présent"`, `"passé composé"`, `"imparfait"` och `"futur proche"` (`tenseCheck` i `languages/fr/lang.js`); `need.connectors` räknar bindeorden i `connectors` i samma fil.
- `stories.json`: `gaps[i].cat` är `"tempus"` (passé composé/imparfait, être/avoir, kongruens) eller `"bindeord"`.

## Grammatikområden (`grammar-*.json`, format i `docs/spec/grammatik.md`)

Meningarna ska vara naturlig och korrekt franska på nivå A2/B1, med vardagliga teman och gärna ord från `languages/fr/words.txt`. Franskan har ingen `meta`.

| topic | antal | rule | innehåll |
|---|---|---|---|
| `pron` | 50 | `pron-cod`, `pron-coi`, `pron-y`, `pron-en`, `pron-pc` | Objektspronomen: le/la/les (direkt objekt), lui/leur (indirekt objekt), y och en. Platsen före verbet, även i passé composé (`Je l'ai vue.`) och med infinitiv (`Je vais le faire.`). `pron-pc`: pronomen i passé composé, inklusive kongruens (`Les photos ? Je les ai prises.`). |
| `pc` | 45 | `pc-etre`, `pc-avoir`, `pc-accord`, `pc-refl` | Passé composé: être eller avoir (luckan är hjälpverbet i rätt form), kongruens med être (`Elle est [partie].`) och reflexiva verb (`Nous nous [sommes] levés tôt.`). |
| `art` | 35 | `art-part`, `art-neg`, `art-qte` | Delningsartikel du/de la/de l'/des, de efter negation (`Je n'ai pas [de] frères.`) och efter mängdord (`beaucoup [de] monde`, `un kilo [de] pommes`). |
| `prep` | 30 | `prep-pays`, `prep-ville`, `prep-a-de` | Prepositioner med länder och städer: en France, au Portugal, aux États-Unis, à Paris. Sammandragningar: au, aux, du, des (`Je vais [au] cinéma.`, `Il revient [du] travail.`). |
| `rel` | 30 | `rel-qui`, `rel-que`, `rel-ou`, `rel-dont` | Relativpronomen qui, que (qu'), où och dont. |
| `subj` | 30 | `subj-faut`, `subj-vouloir`, `subj-sent`, `subj-ind` | Subjonctif efter il faut que, je veux que, känslouttryck (je suis content que) och bien que/pour que. `subj-ind`: fall där man INTE ska ha subjonctif (`Je pense qu'il [est] malade.`, `Je sais que tu [as] raison.`). Luckan är verbformen. |
| `si` | 25 | `si-pres`, `si-imp` | Si-satser: `Si tu viens, on [ira] au cinéma.` (présent → futur) och `Si j'avais de l'argent, je [voyagerais].` (imparfait → conditionnel). Luckan kan ligga i si-satsen eller i huvudsatsen. |
| `comp` | 25 | `comp-adj`, `comp-meilleur`, `comp-sup` | Komparativ och superlativ: plus … que, aussi … que, meilleur/mieux, le plus/la plus. |
| `neg` | 25 | `neg-ordf`, `neg-typ` | Alla av typen `"rw"`: gör meningen negerad med ne … pas / jamais / rien / personne / plus, även i passé composé och med pronomen (`Je ne l'ai jamais vu.`). `cue` är negationen, till exempel `"ne … jamais"`. `q` är den jakande meningen. |
| `quest` | 20 | `q-inv`, `q-est-ce` | Alla av typen `"rw"`: gör en fråga med inversion eller est-ce que av ett påstående. `cue` anger typen, till exempel `"inversion"` eller `"est-ce que"`, och ett frågeord om det behövs (`"où + inversion"`). |
| `fut` | 35 | `fut-proche`, `fut-reg`, `fut-irr`, `fut-quand`, `fut-byt` | Futur proche och futur simple, oregelbundna stammar, quand + futur (svenskan har presens). `fut-byt` är rw: byt mellan futur proche och futur simple. |
| `cond` | 25 | `cond-form`, `cond-poli`, `cond-conseil`, `cond-souhait`, `cond-si`, `cond-rai` | Conditionnel: bildning, artighet (je voudrais), råd (tu devrais), önskningar (j'aimerais) och skillnaden -rai/-rais. |
| `tps` | 40 | `tps-bakgrund`, `tps-vana`, `tps-handelse`, `tps-avbrott`, `tps-signal` | Imparfait eller passé composé i en berättelse. Luckan är verbformen. |
| `pqp` | 25 | `pqp-avoir`, `pqp-etre`, `venir-de`, `en-train` | Plus-que-parfait, venir de + infinitiv och être en train de. |
| `pton` | 25 | `pton-prep`, `pton-comp`, `pton-cest`, `pton-bet`, `pton-a` | Betonade pronomen: moi, toi, lui, elle, nous, vous, eux, elles. |
| `imper` | 25 | `imp-form`, `imp-irr`, `imp-neg`, `imp-pron`, `imp-negpron` | Imperativ, även nekad och med pronomen. `imp-negpron` är rw. |
| `refl` | 20 | `refl-pres`, `refl-inf`, `refl-neg`, `refl-sens` | Reflexiva verb i presens, med infinitiv och negation, och verb som är reflexiva på franska men inte på svenska. |

För `rw` gäller samma regel som i tyskan: `a`, `acc` och `alt` ska bestå av exakt samma ord. Vid inversion skrivs bindestrecket som i vanlig franska (`Où habites-tu ?`). Programmet delar orden vid mellanslag, så `habites-tu` blir en bricka.

Tempusreglerna och `cond-poli`, `cond-rai` och `fut-reg` är undantagna från "Hitta felet" (`ERR_SKIP` i src/kinds/60-grammar.js), eftersom felalternativen där ofta går att försvara i talspråk.
