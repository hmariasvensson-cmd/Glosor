# Transkription: transkription.json

Egen övningstyp (`src/kinds/54-transkription.js`, typ `ipa`, gruppen *Tala och skriva* bredvid uttal), som bara syns i menyn när filen finns (i dag `fru`). Allmänna regler: [allmant.md](allmant.md).

`transkription.json` = `[{id, sec, topic, fr, ipa, alt, ok?, why}]`:

- `fr`: ordet eller frasen. `ipa`: standarduttal på ordboksnivå (Larousse/TLFi) inom `/…/`, med `ʁ`, `ɡ` och nasalvokalerna `ɑ̃ ɛ̃ ɔ̃ œ̃`. Fraser skrivs med mellanslag mellan orden och `‿` för liaison; `.` får markera stavelser.
- `alt`: tre olika typiska fel som inte är facit (fel nasalvokal eller uttalad nasalkonsonant, uttalat e caduc, saknad eller förbjuden liaison, fel öppen/sluten vokal, uttalad stum slutkonsonant). Använd aldrig vanligt `r` eller `g` i ett felalternativ, eftersom rättningen räknar dem som `ʁ` och `ɡ`.
- `ok` (valfri): fler godkända uttal (t.ex. `[bʁɛ̃]` för *brun*, e caduc som behålls i *samedi*).
- `topic`: `nasal`, `ecaduc`, `liaison` (även enchaînement), `h`, `voy` (öppna/slutna), `yu` ([y] [u] [ø] [œ]), `semi` (halvvokaler), `graf` (grafem–fonem), `sv` (kontraster med svenskan). Namnen står i `IPA_TOPICS`.
- `why`: förklaring på svenska.
- Tre former, efter hur väl eleven kan posten (`S.ipa[id].s`): ord → välj IPA, IPA → välj ord, och skriv transkriptionen med en IPA-knapprad. Rättningen jämför bara ljuden: snedstreck, hakparenteser, mellanslag, `.` `·` `-` `‿` `_`, betonings- och längdtecken tas bort, och `r`/`ʀ` räknas som `ʁ`.
- Statistik i `S.ipa = {<id>: {s, last, r, n}}`, per moment.
