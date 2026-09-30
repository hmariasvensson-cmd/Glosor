# Provträning: exam.json

Formatet (delarna `parts`, uppgifterna `tasks` och uppgiftstyperna flerval, skriva, tala, para ihop, lucktext och kortsvar) står i `docs/provformat.md` ("Uppgiftstyper i exam.json") och i SPEC-kommentaren överst i `src/kinds/70-exam.js`. Kursens prov (namn, nivå, delar och id-prefix) står i kursens `content/SPEC.md` och i `exam` i `lang.js`. Allmänna regler: [allmant.md](allmant.md).

build.py kontrollerar (`check_fields`, `check_exam_task`): varje uppgift har `id`, `part` (som finns i `parts`), `title` och `instr`; flervalsfrågorna har `q` och facit inom alternativen; skriv- och taluppgifter har `task`; `lines` är rader med `fr`; para ihop, lucktext och kortsvar har rätt form. En modelltext i en skrivuppgift som är kortare än `minWords` ger en varning.
