# Frekvenstäckning i kurskedjorna

Genererad 2026-10-05 med `python3 tools/frekvens.py`. Skriv inte i filen för hand; kör om verktyget.

Hur många av språkets vanligaste lemman eleven har mött när kursen är klar, räknat **kumulativt** längs kedjan (`nextCourse`). Ett lemma räknas som täckt om grundformen står i någon `words.txt` (även bokens ord och ord i en fras), bland verbspelens verb (`verbs.json`) eller bland bindeorden i kursen eller en tidigare kurs. Grammatikord (artiklar, pronomen, prepositioner, konjunktioner, hjälpverb, räkneord: `FUNCTION` i `tools/tackning.py`) räknas inte, och inte heller namn, förkortningar, grova ord och listornas egenheter (`SKIP` i `tools/frekvens.py`). *Topp 1 000* är alltså de 1 000 vanligaste lemmana som återstår. Jämförelsen är på grundformen, så siffrorna är en uppskattning.

Källor (utdrag med rang i `tools/data/frekvens-<språk>.tsv`, källa och licens överst i filerna):

- Tyska: DeReWo v-ww-bll-320000g-2012-12-31-1.0 (© Institut für Deutsche Sprache, Mannheim; CC BY-NC 3.0), tidningsdominerad korpus.
- Franska: Lexique 3.83 (New m.fl. 2004, www.lexique.org; CC BY-SA 4.0), rang efter medelfrekvensen i filmtextning och böcker.
- Italienska: Kelly-listan för italienska (Kilgarriff m.fl. 2014, ssharoff.github.io/kelly; CC BY-NC-SA 2.0), webbkorpusen itWaC.

Målet i backloggen: hela kedjan ska täcka de 2 000 vanligaste lemmana så långt det är rimligt för en elev. Tumregel (`docs/nivaer.md`): ca 1 000 ord per steg, A2 ≈ 2 000 ord och B1 ≈ 3 000 ord.

Tolkning: de låga siffrorna i de första stegen är delvis avsiktliga. Tyska 1–3 tar inte med ord som redan finns i Tyska 4–6, och Franska 2 inte ord som finns i Franska 3, så ett vanligt ord kan komma först i ett senare steg. DeReWo bygger mest på tidningstext och Kelly-listan på webbtext, så de saknade orden är ofta nyhets-, sport- eller förvaltningsord; Lexique bygger på filmtextning och romaner (därav tuer, arme, cadavre). Avsnitten med vanliga ord (`#vanliga2` i Franska 3, `#ev`/`#dv`/`#hv` i fr1/fr2/frs4, `#ev`/`#bv`/`#tv`/`#sv` i de1–de6 och `#iv`/`#jv`/`#kv`/`#cv` i it1–it4) fyllde luckorna 2026-10-05.

## Sammanfattning

| Kurs | Kod | Kända lemman (kumulativt) | Topp 1 000 | Topp 2 000 |
|---|---|---:|---:|---:|
| Tyska 1 | de1 | 1256 | 28,0 % | 18,9 % |
| Tyska 2 | de2 | 2423 | 33,6 % | 25,2 % |
| Tyska 3 | de3 | 4062 | 50,0 % | 41,0 % |
| Tyska 4 | de4 | 5901 | 61,2 % | 55,0 % |
| Tyska 5 | de | 10128 | 94,0 % | 87,7 % |
| Tyska 6 | de6 | 12599 | 98,4 % | 94,8 % |
| Tyska 7 | de7 | 14608 | 99,6 % | 97,0 % |
| Franska 1 | fr1 | 1065 | 27,7 % | 18,9 % |
| Franska 2 | fr2 | 2092 | 48,4 % | 34,3 % |
| Franska 3 | fr | 4177 | 80,9 % | 63,6 % |
| Franska 4 | frs4 | 5722 | 90,2 % | 79,4 % |
| Franska 5 | frs5 | 7330 | 93,6 % | 85,2 % |
| Franska 6 | fr4 | 8839 | 97,4 % | 89,9 % |
| Franska I (universitet) | fru | 10922 | 99,3 % | 93,0 % |
| Italienska 1 | it1 | 977 | 21,1 % | 15,8 % |
| Italienska 2 | it2 | 2001 | 36,6 % | 29,0 % |
| Italienska 3 | it3 | 3458 | 55,6 % | 49,9 % |
| Italienska 4 | it4 | 5009 | 75,3 % | 66,0 % |
| Italienska 5 | it5 | 6861 | 84,3 % | 76,0 % |
| Italienska 6 | it6 | 8656 | 91,7 % | 83,4 % |
| Italienska 7 | it7 | 10372 | 96,5 % | 90,1 % |

## Tyska: de1 → de2 → de3 → de4 → de → de6 → de7

Saknas efter hela kedjan: 4 av topp 1 000 och 60 av topp 2 000. Rangen (listans) står inom parentes.

**Topp 1–1000** (4): jährig (213), Vorstand (744), Liga (962), her (1062).

**Topp 1001–2000** (56): verloren (1342), stellvertretend (1346), bestehend (1386), aufs (1392), Bischof (1443), Ausbau (1454), Senior (1468), fällen (1561), olympisch (1562), Amerikaner (1569), gebären (1591), israelisch (1610), Tote (1634), Beschäftigte (1643), bekennen (1709), ausbauen (1744), Außenminister (1757), Coach (1801), Ortsteil (1809), Papst (1825), Graf (1864), General (1881), Cup (1887), fürs (1902), Russland (1903), Betroffene (1944), stehend (1953), Forum (1974), Regierungschef (1984), fügen (2018), Weltmeister (2028), Oberbürgermeister (2050), entschieden (2070), Spieltag (2081), Heimspiel (2093), Weltmeisterschaft (2108), Stürmer (2109), Landrat (2110), Bundeswehr (2119), bessern (2133), scheiden (2169), Formel (2175), sexuell (2183), Finanzminister (2185), diesjährig (2222), Sparkasse (2224), Junior (2237), Sängerin (2260), Koblenzer (2269), Kirchengemeinde (2277), Vereinigung (2283), Innenminister (2293), Kader (2304), Begriffsklärung (2309), Plus (2311), Duell (2313).

Var lemmana i topp 2 000 kommer första gången: de1 377, de2 127, de3 316, de4 279, de 654, de6 142, de7 45.

## Franska: fr1 → fr2 → fr → frs4 → frs5 → fr4 → fru

Saknas efter hela kedjan: 7 av topp 1 000 och 140 av topp 2 000. Rangen (listans) står inom parentes.

**Topp 1–1000** (7): arme (495), armée (645), dollar (999), sein (1137), fatiguer (1157), prisonnier (1160), toile (1178).

**Topp 1001–2000** (133): patte (1227), dresser (1240), mine (1279), vache (1284), balancer (1339), amant (1364), fusil (1366), sort (1373), enfuir (1387), cadavre (1393), pendre (1399), vierge (1404), caresser (1416), monstre (1430), prêtre (1449), attaque (1450), vaisseau (1466), bombe (1473), abattre (1484), cuir (1491), britannique (1508), enterrer (1517), laisse (1520), crâne (1554), claquer (1555), aise (1566), assassin (1588), détacher (1625), tombe (1635), fantôme (1640), creux (1646), rat (1652), cuisse (1661), comité (1662), fesse (1673), recouvrir (1692), commissaire (1694), grec (1710), précipiter (1717), obscur (1723), brave (1749), tueur (1759), chasseur (1760), soupirer (1785), coupe (1787), secrétaire (1793), fiancé (1801), allée (1802), sorcier (1805), cracher (1815), hausser (1816), communiste (1823), redresser (1825), contempler (1829), navire (1843), foncer (1845), sueur (1846), figurer (1854), vêtir (1858), péché (1859), noble (1860), criminel (1861), lueur (1868), veuf (1887), retomber (1888), étaler (1889), coffre (1900), paupière (1912), commandement (1922), bénir (1923), marin (1934), vieillard (1938), cool (1940), sexuel (1942), menton (1946), boulevard (1960), avenue (1973), race (1974), central (1993), bourgeois (1994), grand-chose (2005), pointer (2006), obscurité (2014), frotter (2033), chrétien (2036), créature (2039), statue (2044), longuement (2047), soie (2055), exprès (2060), rage (2067), cogner (2068), paradis (2069), jouir (2070), repasser (2074), auto (2076), talon (2079), pilote (2080), cage (2096), débarquer (2102), guetter (2118), regagner (2120), embarquer (2124), barrer (2129), nuque (2143), user (2149), mouiller (2157), armer (2160), singe (2163), épée (2166), infini (2168), moustache (2171), doré (2172), percer (2173), semblant (2177), ordure (2180), gendarme (2184), raide (2185), incliner (2186), division (2208), vaguement (2209), enfiler (2217), flot (2218), emplir (2221), bloc (2224), revolver (2230), whisky (2239), porc (2244), redevenir (2246), culotte (2247), pourvoir (2257), gaffe (2259), veine (2260).

Var lemmana i topp 2 000 kommer första gången: fr1 378, fr2 308, fr 587, frs4 315, frs5 116, fr4 94, fru 62.

## Italienska: it1 → it2 → it3 → it4 → it5 → it6 → it7

Saknas efter hela kedjan: 35 av topp 1 000 och 198 av topp 2 000. Rangen (listans) står inom parentes.

**Topp 1–1000** (35): previsto (194), finanziario (534), riportare (541), destinare (555), provvedimento (571), amministrativo (612), realizzazione (616), legislativo (654), attuazione (774), unito (789), operativo (832), basare (836), componente (844), provinciale (856), utilizzo (860), attribuire (867), caratterizzare (891), sottoporre (892), apposito (914), militare (943), operatore (951), in particolare (988), rendiconto (992), pigliare (1007), territoriale (1021), evidenziare (1057), produttivo (1088), concernere (1089), istituzionale (1120), arma (1121), prestazione (1134), regime (1145), istituire (1162), compreso (1172), esclusivamente (1174).

**Topp 1001–2000** (163): elevato (1195), approvazione (1200), estendere (1206), comunitario (1207), organismo (1215), autorizzare (1221), supporto (1228), programmazione (1231), effettivo (1243), coordinamento (1245), procedimento (1279), manifestare (1284), acquisire (1287), attivare (1296), trarre (1311), normativo (1312), presidenza (1316), autorizzazione (1318), intesa (1319), permanente (1324), vigente (1328), organizzativo (1333), didattico (1337), possesso (1354), dotare (1370), informativo (1380), attuare (1387), finanza (1395), annuale (1407), giunta (1410), statale (1417), ricorrere (1449), assessore (1472), migliaio (1473), rilievo (1485), ordinamento (1500), collocare (1503), elaborare (1513), consistere (1515), funzionamento (1527), analogo (1534), modificazione (1554), titolare (1558), predisporre (1559), sorgere (1571), adozione (1578), copertura (1581), sindacale (1596), carica (1604), connesso (1613), accertare (1621), concessione (1625), relativamente (1655), concordare (1656), socio (1667), rispettivo (1672), occidentale (1674), monte (1676), formulare (1681), effettivamente (1692), rispettivamente (1710), funzionale (1712), importo (1715), alternativo (1737), strategico (1741), testimonianza (1744), parziale (1746), cooperazione (1750), primario (1753), pervenire (1761), imposta (1764), elaborazione (1776), affermazione (1783), mirare (1792), armato (1802), variazione (1805), indurre (1809), altrettanto (1815), aderire (1817), esclusione (1818), importare (1820), individuazione (1822), risoluzione (1826), legislazione (1833), fortemente (1836), incidere (1849), dettare (1861), accertamento (1870), conferire (1871), nomina (1875), preventivo (1883), avvio (1884), parametro (1890), volgere (1903), educativo (1907), estremamente (1908), perseguire (1910), progettazione (1918), emettere (1919), privare (1939), percepire (1946), comparire (1950), esclusivo (1953), rimettere (1961), delibera (1974), concorrere (1975), sigaro (1987), fata (2009), piccino (2022), flessione (2029), interrogatorio (2035), separatamente (2039), armare (2041), raggruppamento (2046), bandito (2050), indirizzare (2056), consultazione (2059), orientare (2060), maggiormente (2061), dollaro (2065), adesione (2072), specificare (2083), originario (2088), assieme (2111), delegare (2132), papa (2134), unitario (2138), opporre (2146), supportare (2148), situare (2153), blocco (2156), consulenza (2159), scenario (2161), aggiuntivo (2166), sostanziale (2170), ministeriale (2172), intraprendere (2180), divisione (2185), sesso (2190), continuità (2191), congresso (2196), portata (2202), denominare (2203), sostanzialmente (2211), attestare (2212), valorizzazione (2213), evidentemente (2227), sospensione (2229), efficienza (2246), monitoraggio (2249), conservazione (2256), funzionario (2258), intento (2266), adeguare (2269), organico (2270), assegnazione (2273), senatore (2275), ulteriormente (2277), tematica (2289), convocare (2292), telefonico (2295), articolare (2296), vigilanza (2299).

Var lemmana i topp 2 000 kommer första gången: it1 315, it2 265, it3 418, it4 323, it5 198, it6 149, it7 134.
