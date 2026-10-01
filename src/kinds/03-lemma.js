/* ---------- Grundformen till böjda former (Mina ord) ----------
   Ett ord som eleven sparar från en text utan glosa sparas i grundform när grundformen finns i kursens ordlista, i någon
   annan kurs i samma språk (kedjan: data/lemma-<språk>.json, se ensureLemmaAll; innan den har hämtats bara redan
   hämtade kurser) eller i verbtabellerna (L.verbs): "fährt" → "fahren", "belles" → "beau, belle". Former i verbtabellerna slås upp
   direkt, tyska pluraler tas ur ordlistans "(-en)", "(-gänge)", "(Zäune)", och annars prövas enkla ändelseregler per
   språk (plural, femininum, komparation, verbändelser). En regel räknas bara om resultatet finns i ordlistan eller
   verbtabellerna, så ett ord som inte känns igen sparas som det står, som förut.
   lemmaOf(form) → {t, sv, g} (grundformen, med betydelse och genus om de är kända) eller null. */
const LEMMA_RULES={
  fr:[["eaux","eau"],["aux","al"],["euses","eux"],["euse","eux"],["euses","eur"],["euse","eur"],["ives","if"],["ive","if"],["elles","el"],["elle","el"],
    ["ennes","en"],["enne","en"],["onnes","on"],["onne","on"],["ettes","et"],["ette","et"],["ères","er"],["ère","er"],["trices","teur"],["trice","teur"],
    ["ées","é"],["ée","é"],["és","é"],["es",""],["s",""],["x",""],["e",""],
    ["issaient","ir"],["issons","ir"],["issez","ir"],["issent","ir"],["issait","ir"],["issais","ir"],["èrent","er"],["aient","er"],["erons","er"],["eront","er"],
    ["erais","er"],["erait","er"],["erez","er"],["erai","er"],["eras","er"],["era","er"],["ions","er"],["iez","er"],["ais","er"],["ait","er"],["ant","er"],
    ["ent","er"],["ons","er"],["ez","er"],["ées","er"],["ée","er"],["és","er"],["é","er"],["es","er"],["e","er"],
    ["is","ir"],["it","ir"],["ie","ir"],["i","ir"],["dent","dre"],["dons","dre"],["dez","dre"],["ds","dre"],["due","dre"],["du","dre"]],   // -re bara för -dre (attendre, perdre)
  de:[["esten",""],["sten",""],["stes",""],["ster",""],["stem",""],["ste",""],["eren",""],["erer",""],["eres",""],["erem",""],["ere",""],["er",""],
    ["nen",""],["en",""],["em",""],["es",""],["e",""],["s",""],["n",""],
    ["test","en"],["tet","en"],["ten","en"],["te","en"],["est","en"],["et","en"],["st","en"],["t","en"],["e","en"],["t","n"],["st","n"],["e","n"]],
  it:[["he","a"],["hi","o"],["ie","ia"],["i","o"],["i","e"],["e","a"],["a","o"],["e","o"],
    ["iscono","ire"],["isco","ire"],["isci","ire"],["isce","ire"],["iamo","are"],["iamo","ere"],["iamo","ire"],["ano","are"],["ono","ere"],["ono","ire"],
    ["ato","are"],["ata","are"],["ati","are"],["ate","are"],["uto","ere"],["uta","ere"],["ito","ire"],["ita","ire"],["ete","ere"],["ite","ire"],
    ["ava","are"],["eva","ere"],["iva","ire"],["avo","are"],["evo","ere"],["ivo","ire"],
    ["o","are"],["i","are"],["a","are"],["o","ere"],["i","ere"],["e","ere"],["o","ire"],["i","ire"],["e","ire"]]
};
Object.values(LEMMA_RULES).forEach(r=>r.sort((a,b)=>b[0].length-a[0].length));   // längsta ändelsen först
const LEMMA_IRREG={fr:{bel:"beau",belle:"beau",belles:"beau",beaux:"beau",nouvel:"nouveau",nouvelle:"nouveau",nouvelles:"nouveau",nouveaux:"nouveau",
  vieil:"vieux",vieille:"vieux",vieilles:"vieux",folle:"fou",folles:"fou",molle:"mou",blanche:"blanc",blanches:"blanc",franche:"franc",sèche:"sec",
  fraîche:"frais",fraîches:"frais",douce:"doux",douces:"doux",fausse:"faux",grosse:"gros",grosses:"gros",longue:"long",longues:"long",
  gentille:"gentil",gentilles:"gentil",publique:"public",grecque:"grec",favorite:"favori"}};
// Separabla prefix i tyskan: "eingekauft" → "einkauft", "aufzustehen" → "aufstehen"
const LEMMA_DE_PFX=["zurück","nach","fest","dar","hin","her","los","weg","mit","aus","auf","ein","vor","an","ab","zu","um"];
let LEMMA=null;
const lemmaLang=()=>(L.tts||L.code||"").slice(0,2).toLowerCase();
function lemmaKey(s){ s=norm(s); if(L.hintStrip) s=s.replace(L.hintStrip,""); return s.replace(/^sich /,"").replace(/^(se |s')/,"").trim(); }
// Tysk plural ur ordlistans notation: "der Hund (-e)" → Hunde, "der Übergang (-gänge)" → Übergänge, "der Zaun (Zäune)" → Zäune
function dePlural(t){
  const m=t.match(/\(([^)]*)\)/); if(!m||/[+.]/.test(m[1])) return null;
  const n=lemmaKey(t.replace(/\(.*?\)/g,"")), p=m[1].trim(), fold=s=>s.replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u");
  if(!n||/\s/.test(n)) return null;
  if(p==="-") return n;
  if(/^\p{Lu}/u.test(p)) return p.toLowerCase();
  if(p[0]!=="-") return null;
  const x=p.slice(1).toLowerCase();
  if(x.length>=3) for(let k=0;k<=n.length-2;k++) if(fold(x).startsWith(fold(n.slice(k)))) return n.slice(0,k)+x;   // "-gänge": sista ledet byts
  return n+x;
}
/* Hela språkets ord: data/lemma-<språk>.json (build.py, lemma_files) = {words: [[ord, svenska, genus], …]} för alla
   kurser i samma språk, så att grundformen hittas även i en kurs i kedjan som inte har öppnats (it2 "verso" → verso ur
   it3, inte versare). Filen hämtas första gången lemmaIndex behövs (wireGloss ber om den när en text visas). Tills den
   har kommit, eller om den inte går att hämta (offline), används kursen, hämtade kurser och verbtabellerna som förut;
   ett misslyckat försök görs om tidigast efter LEMMA_RETRY ms. */
const LEMMA_ALL={}, LEMMA_FAIL={}, LEMMA_RETRY=60000;
function ensureLemmaAll(){
  const lg=lemmaLang(), name="lemma-"+lg;
  if(LEMMA_ALL[lg]) return Promise.resolve(LEMMA_ALL[lg]);
  if(INLINE_DATA[name]) return Promise.resolve(LEMMA_ALL[lg]=INLINE_DATA[name].words||[]);   // preview.html
  if(!DATA_VERSION||typeof DATA_VERSION!=="object"||!DATA_VERSION[name]||Date.now()-(LEMMA_FAIL[lg]||0)<LEMMA_RETRY) return Promise.resolve(null);
  return fetchData(name).then(d=>LEMMA_ALL[lg]=(d&&d.words)||[])
    .catch(e=>{ LEMMA_FAIL[lg]=Date.now(); warnErr("grundformerna ("+name+") kunde inte hämtas, bara kursens ord används",e); return null; });
}
function lemmaIndex(){
  const lg=lemmaLang(); if(!LEMMA_ALL[lg]) ensureLemmaAll();   // i preview.html finns filen direkt, annars hämtas den
  const all=LEMMA_ALL[lg];
  // Med hela språkets fil behövs inte de hämtade kurserna (de finns i filen)
  const others=all?[]:Object.keys(LANGUAGES).filter(c=>c!==L.code&&sameLang(c,L.code)&&LANGUAGES[c].words!=null);
  const sig=L.code+"|"+WORDS.length+"|"+others.join()+"|"+(all?all.length:"-");
  if(LEMMA&&LEMMA.sig===sig) return LEMMA;
  const words=new Map(), forms=new Map(), infs=new Map(), de=lemmaLang()==="de";
  const addW=w=>{ variants(w.t).forEach(v=>{const k=lemmaKey(v); if(k&&!words.has(k)) words.set(k,w);});
    if(de&&w.g){ const p=dePlural(w.t); if(p){ [p,/[ns]$/.test(p)?p:p+"n"].forEach(k=>{if(!words.has(k)) words.set(k,w);}); } } };
  WORDS.filter(w=>w.sec!=="mine").forEach(addW);
  others.forEach(c=>{ const x=LANGUAGES[c]; try{ (x.base||parseWords(x.words)).words.forEach(addW); }catch(e){} });
  if(all) all.forEach(([t,sv,g])=>addW({t,sv:sv||"",g:g||""}));   // kursens egna ord står först och vinner
  const vb=L.verbs||{}, sv=vb.sv||{};
  Object.values(vb.tenses||{}).forEach(tt=>Object.entries(tt||{}).forEach(([inf,fs])=>{
    infs.set(inf.toLowerCase(),inf);
    (Array.isArray(fs)?fs:[]).forEach(f=>String(f||"").split("/").forEach(one=>{
      // "bin gefahren", "ai parlé", "stehe auf": det längsta ordet är verbformen
      const tok=one.trim().toLowerCase().split(/\s+/).sort((a,b)=>b.length-a.length)[0];
      if(tok&&!forms.has(tok)) forms.set(tok,inf);
    }));
  }));
  return LEMMA={sig,words,forms,infs,sv};
}
/* Formen själv vinner alltid om den finns i ordlistan (med eller utan artikel/elision): "verso" → verso, "été" →
   l'été. Verbtabellerna och reglerna prövas först därefter. Står en artikel framför i texten (l'été, l'universo) är
   ordet ett substantiv: då räknas bara ordlistan, aldrig verbtabellerna, och en regel bara om den ger ett ord med
   genus, så "l'été" blir aldrig être (finns inget substantiv sparas ordet som det står). */
function lemmaOf(form){
  const raw=apos(String(form||"")).trim(), art=/^(l|dell|all|dall|nell|sull|un|quell)'/i.test(raw);
  const s=(L.elision?raw.replace(L.elision,""):raw).toLowerCase(); if(s.length<2||/\s/.test(s)) return null;
  const X=lemmaIndex(), lg=lemmaLang();
  // Tyskan: ett ord med liten bokstav är inget substantiv ("gefahren" är fahren, inte die Gefahr (-en); "etwas" inte etwa+s)
  const low=lg==="de"&&!/^\p{Lu}/u.test(String(form).trim());
  const word=k=>{ const w=X.words.get(lemmaKey(k)); return w&&!(low&&w.g)?{t:w.t,sv:w.sv,g:w.g||""}:null; };
  const verb=inf=>word(inf)||{t:inf,sv:X.sv[inf]||"",g:""};
  const hit=k=>{ const w=word(k); if(w) return w; if(art) return null; const inf=X.forms.get(k)||X.infs.get(k); return inf?verb(inf):null; };
  let r=hit(s); if(r) return r;
  const irr=(LEMMA_IRREG[lg]||{})[s]; if(irr&&(r=word(irr))) return r;
  if(s.length<4) return null;
  const stems=[s];
  if(lg==="de"){
    if(/^ge.{3,}/.test(s)) stems.push(s.slice(2));
    LEMMA_DE_PFX.forEach(p=>{ ["ge","zu"].forEach(i=>{ if(s.startsWith(p+i)&&s.length>p.length+4) stems.push(p+s.slice(p.length+2)); }); });
  }
  for(const st of stems){
    if(st!==s&&(r=hit(st))) return r;
    for(const [end,rep] of LEMMA_RULES[lg]||[]){
      if(!st.endsWith(end)||st.length-end.length<2||(low&&end==="s")) continue;
      const c=st.slice(0,st.length-end.length)+rep;
      if(c!==s&&(r=hit(c))&&!(art&&!r.g)) return r;
    }
  }
  return null;
}
