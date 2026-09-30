/* ---------- Språk ---------- */
// L är det valda språket (från languages/<kod>/lang.js). Allt nedan läser därifrån.
let L, SECTIONS, WORDS, byId, CONJ, CONJBY;
/* Arv mellan kurser. En kurs med extends: "<kod>" och inherit: [fält] får de fälten från den kursen, djupt
   sammanslagna med sina egna: vanliga objekt slås ihop nyckel för nyckel och kursens egna värden vinner; listor,
   regex och funktioner tas hela från kursen själv om den har dem. Två uttryckliga ändringar av förälderns värde:
   {$append: [...]} lägger till i förälderns lista, och {$remove: [nycklar]} i ett objekt tar bort nycklar.
   Körs en gång när sidan startar, så att varje kurs är ett vanligt objekt (inga getters) och ordningen mellan
   kurserna i index.html inte spelar någon roll. build.py kontrollerar att föräldern finns och att det inte blir en cirkel. */
const isPlainObj=v=>!!v&&typeof v==="object"&&Object.getPrototypeOf(v)===Object.prototype;
function mergeInherited(base,own){
  if(own===undefined) return base;
  if(isPlainObj(own)&&Array.isArray(own.$append)) return [...(Array.isArray(base)?base:[]),...own.$append];
  if(!isPlainObj(own)||!isPlainObj(base)) return own;
  const drop=new Set(own.$remove||[]), out={};
  Object.keys(base).forEach(k=>{ if(!drop.has(k)) out[k]=k in own?mergeInherited(base[k],own[k]):base[k]; });
  Object.keys(own).forEach(k=>{ if(k!=="$remove"&&!(k in out)) out[k]=own[k]; });
  return out;
}
function inheritCourses(langs){
  const done=new Set(), busy=new Set();
  const resolve=c=>{ if(done.has(c)) return; const x=langs[c], p=x.extends;
    if(p&&langs[p]&&!busy.has(c)){ busy.add(c); resolve(p); (x.inherit||[]).forEach(k=>{ x[k]=mergeInherited(langs[p][k],x[k]); }); }
    done.add(c); };
  Object.keys(langs).forEach(resolve);
}
inheritCourses(LANGUAGES);
/* Fel som appen klarar sig förbi (molnet, Claude, localStorage som är fullt) skrivs i konsolen med sammanhang, så att de
   syns vid felsökning och i testerna. Där ett fel är väntat och ofarligt (localStorage i privat läge, uppläsning som
   webbläsaren saknar, fokus på en ruta som redan är borta) står det en kommentar vid catch i stället. */
const warnErr=(where,e)=>{ try{ console.warn("Glosor: "+where,e); }catch(_){ /* ingen konsol */ } };
// Gränser som används på flera ställen
const LOG_MAX=1000;       // S.log kapas här; äldre poster sammanfattas i S.logOld (foldLog)
const MAX_RUN_SEC=3600;   // längsta tid (s) som räknas för en runda i loggen (dur), om appen har legat öppen
const UNSENT_MAX=50;      // Tyck till-meddelanden och felrapporter som väntar på att skickas (S.feedback, S.reports)
const runSecs=(start,now=Date.now())=>Math.min(MAX_RUN_SEC,Math.round((now-start)/1000));   // loggens dur för en runda som började start
const LANG_KEY = "glosor-sprak";
const ONLY_KEY = "glosor-bara";   // om man bara vill se en kurs (sparas bara i den här webbläsaren)
const onlyCourse=()=>{try{return localStorage.getItem(ONLY_KEY)||""}catch(e){return ""}};
// "Bara tyska" visar bara kurserna i samma språk som den sparade kursen (Tyska 4 och Tyska 5), och döljer väljaren om bara en är kvar
const sameLang=(a,b)=>!!LANGUAGES[a]&&!!LANGUAGES[b]&&LANGUAGES[a].name===LANGUAGES[b].name;
function setOnly(code){ try{ if(code) localStorage.setItem(ONLY_KEY,code); else localStorage.removeItem(ONLY_KEY); }catch(e){ /* privat läge: valet gäller bara nu */ } fillCourses(); }
// Steg: 1–7 (Moderna språk 1–7) eller "U" (universitet), fältet step i lang.js och upcoming.json.
// En universitetskurs kan ange stepAs (t.ex. 7 för Franska I): då står "motsvarar steg 7" i stället för "universitet"
const stepNum=s=>s==="U"?8:(+s||9);
const stepLabel=(s,as)=>s==="U"?(as?"motsvarar steg "+as:"universitet"):s?"steg "+s:"";
const examShort=e=>e&&e.name?e.name.replace(/\s*\(.*\)\s*$/,"").replace("-Zertifikat",""):"";
// "Franska 3 · steg 3 · A2 · mål DELF B1" (kursväljaren)
const courseLine=x=>[x.course||x.label||x.name,stepLabel(x.step,x.stepAs),x.level,x.exam?"mål "+examShort(x.exam):""].filter(Boolean).join(" · ");
// nextCourse kan vara en kod eller en lista med koder (två vägar, t.ex. Franska 5 eller Franska I); bara kurser som finns
const nextCourses=(x=L)=>[].concat((x&&x.nextCourse)||[]).filter(c=>LANGUAGES[c]);
// Kursväljaren: en grupp per språk, sorterad efter steg. Byggda kurser går att välja, kommande kurser
// (languages/upcoming.json) står på sin plats i stegordningen men går inte att välja än.
function fillCourses(){
  const only=onlyCourse(), sel=document.querySelector("#course"); if(!sel) return;
  const codes=Object.keys(LANGUAGES).filter(c=>!LANGUAGES[only]||sameLang(c,only));
  const items=codes.map(c=>({code:c,x:LANGUAGES[c]})).concat(LANGUAGES[only]?[]:(Array.isArray(UPCOMING)?UPCOMING:[])
    .filter(u=>u&&!LANGUAGES[u.code]).map(u=>({x:u,soon:true})));
  const langs=[]; items.forEach(i=>{ const n=i.x.name||""; if(!langs.includes(n)) langs.push(n); });
  const byStep=(a,b)=>stepNum(a.x.step)-stepNum(b.x.step)||(a.soon?1:0)-(b.soon?1:0)||String(a.x.course||a.x.label||"").localeCompare(String(b.x.course||b.x.label||""),"sv");
  const opt=i=>i.soon?`<option disabled class="soon">${esc(courseLine(i.x))} – kommer</option>`:`<option value="${esc(i.code)}">${esc(courseLine(i.x))}</option>`;
  sel.innerHTML=langs.map(n=>{ const g=items.filter(i=>(i.x.name||"")===n).sort(byStep).map(opt).join("");
    return n&&langs.length>1?`<optgroup label="${esc(n)}">${g}</optgroup>`:g; }).join("");
  if(L) sel.value=L.code;
  const p=document.querySelector(".coursepick"); if(p) p.hidden=!!LANGUAGES[only]&&codes.length<2;
}
// Texten under rubriken: "Franska 3 · steg 3 · nivå A2"
const courseChip=()=>[courseName(),stepLabel(L.step,L.stepAs),L.level?"nivå "+L.level:""].filter(Boolean).join(" · ");

// Luckan i exempelmeningen: [hakparentes] i words.txt, annars ordet självt om det står i meningen
function findGap(word, ex){
  const m=ex.match(/\[([^\]]+)\]/);
  if(m) return {pre:ex.slice(0,m.index), ans:m[1], post:ex.slice(m.index+m[0].length)};
  const base=word.replace(/\(.*?\)/g,"").replace(/…/g,"").replace(/ qch\b/,"").trim();
  const cands=[...new Set(base.split(/\s*=\s*/).flatMap(p=>p.split(/\s*,\s*/)).filter(p=>p&&!p.startsWith("-")))].sort((a,b)=>b.length-a.length);
  for(const c of cands){
    const r=ex.match(new RegExp("(^|[^\\p{L}])("+c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(?![\\p{L}])","iu"));
    if(r){const i=r.index+r[1].length; return {pre:ex.slice(0,i), ans:r[2], post:ex.slice(i+r[2].length)};}
  }
  return null;
}
function parseWords(raw){
  const sections=[], words=[]; let sec=null; const seen=new Set();
  raw.trim().split("\n").forEach(l=>{
    l=l.trim(); if(!l) return;
    if(l[0]==="#"){const [id,name,src]=l.slice(1).split("|"); sec={id,name,book:src==="bok"}; sections.push(sec); return;}
    const [t,sv,g,exRaw,exSv,ety,lit]=l.split("|");
    if(seen.has(t)) return; seen.add(t);
    words.push({id:t,sec:sec.id,t,sv,g:g||"",exT:exRaw.replace(/[\[\]]/g,""),exSv,ety,lit:lit||"",gap:findGap(t,exRaw)});
  });
  return {sections,words};
}
function buildConj(vb){
  const out=[]; if(!vb) return out;
  Object.entries(vb.tenses).forEach(([tense,o])=>Object.keys(o).filter(k=>k!=="rule").forEach(verb=>o[verb].forEach((f,i)=>{
    out.push({verb,tense,person:vb.persons[i],form:f,full:vb.prefix(i,f,vb.persons,tense)+f,rule:o.rule});
  })));
  return out;
}
const verbGames=()=>!L.verbs?[]:(L.verbs.games||[{id:"all",name:"Verbträning",sub:"",tenses:Object.keys(L.verbs.tenses)}]);
const ruleFor=c=>((L.verbs.notes||{})[c.tense+"|"+c.verb])||c.rule;

/* ---------- Sparat läge ---------- */
/* Nästa repetition, per steg. Steg 0–3 = lär sig, steg 4 och uppåt = kan.
   Steg 0 och 1 räknas i pass (nästa pass, om 3 pass), från steg 2 i dagar (3, 7, 20, 45, 90 dagar) och sparas i x.dd.
   x.due (pass) räknas fortfarande ut, för ord från före dagschemat och för statistiken. */
const INT=[1,3,7,20,40,80,160];
const DAYS=[0,0,3,7,20,45,90];
const DAY=864e5;
const dayStart=ts=>{const d=new Date(ts); d.setHours(0,0,0,0); return d.getTime();};
// Midnatt n kalenderdagar efter ts. Inte dayStart+n*DAY, som blir en timme fel över sommartidsskiftet.
const addDays=(ts,n)=>{const d=new Date(ts); d.setHours(0,0,0,0); d.setDate(d.getDate()+n); return d.getTime();};
const isDue=x=>x.dd?x.dd<=Date.now():x.due<=S.pass;
const MASTER=4, MAXDUE=40;   // MAXDUE = högst så många repetitioner per pass, resten väntar till nästa
/* S: det sparade läget för den valda kursen. Hela S ligger i localStorage under L.storageKey, och i molnet uppdelat
   (se "Sparat på claude.ai" nedan och docs/ARKITEKTUR.md, där samma lista finns som tabell). Fält:
     v          schemaversion = index i MIGRATIONS. Lägen utan v (från före 2026-09-28) räknas som version 0.
     pass       numret på nästa glospass (börjar på 1, ökar efter varje glospass som inte är extra)
     t          tid för senaste sparningen (ms), ökar alltid, även om en annan enhets klocka går före
     w          {<ord-id>: {s, due, dd, f, lp, ld, mp, md, lapses, mcR, mcW, tyR, tyW, clR, clW}}, se save() och schedule()
     newCount   antal nya ord per pass (0, 10, 15, 20)          mode  "mix" | "mc" | "type"
     src        "auto" eller avsnitts-id att lära nya ord från  chapter  bokkapitlet man läser (avsnitts-id)
     slow, listenFirst, goal   uppläsning långsam, lyssna först på nya ord, veckomål i minuter
     selfRate   true = eleven bedömer själv (Igen/Svårt/Bra/Lätt) efter rätt skrivet ord i glosquizet; saknas = av (05-words.js)
     log        [{p, d, dur, nNew, nRep, right, total, mcR, mcN, tyR, tyN, extra, kind, game, words}], högst 1 000 poster
                (kind "talk" har också wpm och rounds (4/3/2) eller chat: 1 (samtal med Claude))
     logOld     {dur, days, lastDay, n}: sammanfattning av poster som kapats bort ur log (foldLog)
     nLog       antal loggposter någonsin (poängen i molnet jämför den)
     run        pågående pass (snapRun), runs {<övning>: pass} ett påbörjat pass per övning (runKey); ett glospass kan ha
                rate {<ord-id>: "again"|"hard"|"easy"}, elevens bedömningar (Bra står inte med)
     dailyDay   dag då Dagens pass senast gjordes klart
     vt, vv     verbträning per tempus och per verb {r, n}
     mine       egna ord [{t, sv, g, ex, exSv, src, own, form}]; form = den böjda formen i texten när ordet sparades i
                grundform (03-lemma.js), t.ex. {t: "fahren", form: "fährt"}. Äldre ord saknar form och står som de sparades
     gi, gr, gt grammatik: per fråga {s, last, dd}, per regel och per område {r, n}
     ga         der/die/das och plural per ord-id {g, p, last}
     tr, ph, te översätta meningar, fraser, musikteori: per id {s, last, dd}
     dc, od     diktamen och ordföljd: per menings-id {s, last, dd}
                (s = rätt i rad, last = senast övad, dd = förfaller (ms); utan dd = förfallen. srsBump i 00-common.js)
     ipa, sa    transkription och satsanalys (universitetskursen): per id {s, last, dd, r, n}
     tx         läs- och hörtexter per id {r, n, best, last}    stb  berättelser: bästa antal rätt per id
     st         berättelsernas luckor {tempus, bindeord: {r, n}}
     cu, wr     kulturuppgifter och skrivuppgifter som är klara, per id
     ut         uttal: bästa procent per id                     mal  lärandemål som bockats av {"<id>|<nr>": tid}
     kt         kapitelprov per avsnitt {r, n, d, miss}         exam provträning {t: {<uppgift>: {pct, best, n, last}}, sims: [...], simRun}
                simRun = pågående provsimulering {ids, i, res, ends, start, seen, cur}, tas bort när den är klar (70-exam.js)
     drafts     utkast till texter per uppgift ("w:<id>" Skriv en text, "x:<id>" provet, "c:<id>" kultur)
     fb         Claudes kommentarer per uppgift (samma nycklar): {d, lv, words, pct, kriterier, helhet, bra, fel, nasta, niva, prov},
                äldre saknar lv, words, pct och (Skriv en text) kriterier, se fbNorm i 40-writing.js.
                Tala: "tt:<ämne>" senaste 4/3/2-kommentaren {d, r, helhet, bra, fel, flyt, nasta, niva}, "tc:<ämne>" samtalet
     talk       Tala (45-tala.js): {t: {<ämne>: {n, last, wpm: [ord/min per runda], best}}, c: {<ämne>: {n, last}}};
                ämne = "me" (presentation), "x:<provuppgift>", "w:<skrivuppgift>" eller "g:<n>". Saknas tills eleven talat
     wrSkip     måndagen ("ÅÅÅÅ-MM-DD") i veckan då kortet Veckans skrivuppgift stängdes; saknas = inte stängt (40-writing.js)
     feedback, reports   Tyck till-meddelanden och felrapporter som inte kunde skickas (högst 50)
   Nya fält läggs till här och i docs/ARKITEKTUR.md. Ett fält som byter form får en ny migrering i MIGRATIONS. */
let S;
function loadState(){
  S={pass:1,w:{},newCount:15,src:"auto",mode:"mix",log:[],vt:{},vv:{}};
  try{Object.assign(S,JSON.parse(localStorage.getItem(L.storageKey)||"{}"))}catch(e){ warnErr("sparat läge kunde inte läsas ("+L.storageKey+")",e); }
  normState();
}
/* Numrerade migreringar: MIGRATIONS[n] gör om ett läge från version n-1 till version n och körs en gång per läge.
   Lägg alltid till nya sist, ändra aldrig ordningen, och låt dem tåla fält som saknas. */
const MIGRATIONS=[
  null,             // 0: lägen från före S.v
  migrateRetired    // 1: ord med det gamla "kan för alltid" (due=1e9) får ett riktigt repetitionsdatum
];
const S_VERSION=MIGRATIONS.length-1;
function normState(){
  if(!Array.isArray(S.log))S.log=[]; S.w=S.w||{}; S.vt=S.vt||{}; S.vv=S.vv||{}; S.nLog=nLogOf(S);
  const v=Number.isInteger(S.v)&&S.v>0?S.v:0;
  for(let i=v+1;i<MIGRATIONS.length;i++) MIGRATIONS[i](S);
  S.v=Math.max(v,S_VERSION);   // ett läge från en nyare version av appen behåller sitt nummer
}
/* Migrering 1. Förr fick inlärda ord due=1e9 och kom aldrig tillbaka. Ge dem ett riktigt repetitionsdatum,
   utspritt över kommande pass så att de inte kommer alla på en gång. */
function migrateRetired(S){
  const old=Object.entries(S.w).filter(([,x])=>x&&x.due>=1e9).sort((a,b)=>(a[1].mp||0)-(b[1].mp||0));
  old.forEach(([,x],i)=>{ x.s=Math.max(x.s,MASTER); x.due=Math.max((x.mp||S.pass)+INT[MASTER],S.pass+1+Math.floor(i/8)); });
}

/* ---------- Sparat på claude.ai ----------
   Framstegen sparas i webbläsaren (hela S i localStorage) och i privata dokument per person och kurs på claude.ai.
   Ett dokument får vara högst 256 KiB, så molnkopian delas upp (se docs/ARKITEKTUR.md):
     data/users/<id>/<storageKey>        {v:2, head, score, parts:{<namn>: <rev>}, t}   huvuddokumentet (allt utom w och log)
     data/users/<id>/<storageKey>~w0 …   {rev, data:{<ord-id>: …}}                     orden, uppdelade efter ett hash av ord-id
     data/users/<id>/<storageKey>~log …  {rev, data:[…]}                               loggen (log, log1, … om den inte får plats)
     data/users/<id>/<storageKey>~f.<fält> {rev, data}                                 stora fält, bara om huvuddokumentet blir för stort
   rev är ett hash av bitens innehåll. Bitarna skrivs först och huvuddokumentet sist, och en läsare använder bara bitar
   vars rev stämmer med huvuddokumentet, så att bitar från olika sparningar aldrig blandas. Oförändrade bitar skrivs inte om.
   Bitar som inte längre finns i huvuddokumentets parts raderas efter sparningen (cloudPrune).
   Gamla dokument i formatet {state, t} läses som förut, och första sparningen skriver det nya formatet.
   Vid start vinner den version som kommit längst (pass, antal loggposter någonsin, antal ord; vid lika den senaste),
   så att en enhet med tomt minne aldrig skriver över framsteg som gjorts på en annan. */
const CLOUD={db:null,uid:null,user:null,ready:false,busy:false,pending:{},timer:null,unsub:null,known:{},stale:{},deferred:null,
  dead:false,noWrite:false,initing:false,attaching:false,seq:0,warn:"",bad:{},force:{}};
const DOC_MAX=256*1024-256, PART_MAX=200*1024, HEAD_MAX=160*1024, W_PER_PART=700;
// Antal loggposter någonsin. Loggen kapas vid 1 000 (foldLog), så räknaren S.nLog behövs för att jämföra.
const nLogOf=s=>Math.max(+(s&&s.nLog)||0,(+((s&&s.logOld)||{}).n||0)+(((s&&s.log)||[]).length));
const score=s=>[(s&&s.pass)||0,nLogOf(s),Object.keys((s&&s.w)||{}).length];
function cmpArr(x,y){x=Array.isArray(x)?x:[];y=Array.isArray(y)?y:[];for(let i=0;i<3;i++){const d=(+x[i]||0)-(+y[i]||0);if(d)return d}return 0}
function cmpScore(a,b){return cmpArr(score(a),score(b))}
// Vinner molnets version över den lokala? Längst kommen vinner, vid lika poäng den som sparades senast.
const remoteWins=(rs,rt,s)=>{const c=cmpArr(rs,score(s));return c>0||(c===0&&(+rt||0)>((s&&s.t)||0))};
const docFor=key=>CLOUD.db.doc(`data/users/${CLOUD.uid}/${key}`);
const bytes=s=>{try{return new TextEncoder().encode(s).length}catch(e){return unescape(encodeURIComponent(s)).length}};
function hash(s){let a=0x811c9dc5,b=0x9747b28c;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,0x5bd1e995);b^=b>>>13}
  return (a>>>0).toString(36)+"-"+(b>>>0).toString(36)+"-"+s.length.toString(36)}
const bucketOf=id=>{let h=0x811c9dc5;for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),16777619);return h>>>0};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// Delar upp ett läge i huvuddel och bitar
function cloudSplit(st){
  const head={...st}, parts={}; delete head.w; delete head.log;
  const w=st.w||{}, ids=Object.keys(w).sort();
  let n=Math.max(1,Math.ceil(ids.length/W_PER_PART)), b;
  for(;;n++){ b=Array.from({length:n},()=>({})); ids.forEach(id=>{b[bucketOf(id)%n][id]=w[id]});
    if(n>=200||b.every(x=>bytes(JSON.stringify(x))<=PART_MAX)) break; }
  b.forEach((x,i)=>{parts["w"+i]=x});
  let cur=[], sz=2, k=0; const next=()=>{parts[k?"log"+k:"log"]=cur; k++; cur=[]; sz=2;};
  (st.log||[]).forEach(e=>{const s=bytes(JSON.stringify(e))+1; if(cur.length&&sz+s>PART_MAX) next(); cur.push(e); sz+=s;});
  if(cur.length||!k) next();
  let hs=bytes(JSON.stringify(head));
  if(hs>HEAD_MAX){
    const ks=Object.keys(head).filter(k=>/^[A-Za-z0-9_]+$/.test(k)&&head[k]!==undefined).map(k=>[k,bytes(JSON.stringify(head[k]))]).sort((x,y)=>y[1]-x[1]);
    for(const [k,s] of ks){ if(hs<=HEAD_MAX) break; parts["f."+k]=head[k]; delete head[k]; hs-=s; }
  }
  return {head,parts};
}
function cloudDocs(st){
  const {head,parts}=cloudSplit(st), docs={}, revs={};
  Object.entries(parts).forEach(([n,data])=>{const j=JSON.stringify(data), rev=hash(j); revs[n]=rev; docs[n]={rev,data,size:bytes(j)+rev.length+24};});
  const main={v:2,head,score:score(st),parts:revs,t:st.t||Date.now()};
  return {main,docs,size:bytes(JSON.stringify(main))};
}
const sameParts=(a,b)=>!!a&&!!b&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>a[k]===b[k]);
async function cloudWrite(key,st){
  const {main,docs,size}=cloudDocs(st);
  const big=Object.keys(docs).filter(n=>docs[n].size>DOC_MAX); if(size>DOC_MAX) big.push("huvud");
  if(big.length){ const e=new Error("för stort: "+big.join(", ")); e.code="too_big"; throw e; }
  // Har någon annan enhet sparat sedan sist? Är den längre kommen skriver vi inte över, och vi litar bara på
  // bitarna vi redan har skrivit om huvuddokumentet fortfarande är vårt.
  const cur=await docFor(key).get(), d=cur&&cur.exists?(cur.data()||{}):null;
  // force: vi har just lagat ett molnläge vars bitar inte stämde (cloudBad), då skrivs allt om även om poängen är lika
  if(!CLOUD.force[key]&&d&&(d.parts||d.state)&&remoteWins(d.parts?d.score:score(d.state),docT(d),st)) return {skipped:true,snap:cur};
  const known=d&&d.parts&&sameParts(d.parts,CLOUD.known[key])?CLOUD.known[key]:null;
  CLOUD.known[key]=null;
  for(const [n,x] of Object.entries(docs)) if(!known||known[n]!==x.rev) await docFor(key+"~"+n).set({rev:x.rev,data:x.data});
  await docFor(key).set(main);
  CLOUD.known[key]=main.parts; delete CLOUD.force[key];
  await cloudPrune(key,main.parts,[d&&d.parts,known,CLOUD.stale[key]]);
  return {written:true};
}
/* Gamla bitar (t.ex. ~log1 när loggen krympt, ~w5 när orden fått plats i färre bitar) tas bort efter en lyckad
   sparning av huvuddokumentet. Bara bitar som fanns i ett tidigare huvuddokument och inte finns i det nya raderas,
   och bara om huvuddokumentet fortfarande är vårt (har en annan enhet hunnit spara kan den använda bitarna).
   Misslyckas en radering gör det inget: biten ligger kvar oanvänd, och vi försöker igen vid nästa sparning (CLOUD.stale). */
async function cloudPrune(key,parts,olds){
  const gone=[...new Set(olds.filter(Boolean).flatMap(o=>Object.keys(o)))].filter(n=>!(n in parts));
  const done=[];
  if(gone.length) try{
    const cur=await docFor(key).get(), d=cur&&cur.exists?(cur.data()||{}):null;
    if(d&&sameParts(d.parts,parts))
      for(const n of gone){ const ref=docFor(key+"~"+n); if(typeof ref.delete!=="function") break; await ref.delete(); done.push(n); }
  }catch(e){ warnErr("gamla molnbitar kunde inte raderas, försöker igen nästa gång ("+key+")",e); }
  const left=gone.filter(n=>!done.includes(n));
  if(left.length) CLOUD.stale[key]=Object.fromEntries(left.map(n=>[n,1])); else delete CLOUD.stale[key];
  return done;
}
function cloudJoin(d,names,datas){
  const st=JSON.parse(JSON.stringify(d.head||{})), logs=[]; st.w={};
  names.forEach((n,i)=>{const x=datas[i];
    if(/^w\d+$/.test(n)) Object.assign(st.w,x||{});
    else if(/^log\d*$/.test(n)) logs.push([+(n.slice(3)||0),Array.isArray(x)?x:[]]);
    else if(n.startsWith("f.")) st[n.slice(2)]=x;});
  st.log=logs.sort((a,b)=>a[0]-b[0]).flatMap(x=>x[1]);
  return st;
}
/* Läser molnets läge: null om det inte finns, {state,t,parts} om det gick att läsa helt, {bad,score,t} om bitarna
   inte stämmer med huvuddokumentet (någon sparar just nu). Kastar vid nätverksfel. */
async function cloudRead(key,snap0){
  let last=null;
  for(let a=0;a<4;a++){
    const snap=a===0&&snap0?snap0:await docFor(key).get();
    if(!snap||!snap.exists) return null;
    const d=snap.data()||{};
    if(!d.parts||typeof d.parts!=="object") return d.state&&typeof d.state==="object"?{state:d.state,t:d.t||d.state.t||0,old:true}:null;
    const names=Object.keys(d.parts), got=await Promise.all(names.map(n=>docFor(key+"~"+n).get()));
    if(got.every((g,i)=>g&&g.exists&&(g.data()||{}).rev===d.parts[names[i]]))
      return {state:cloudJoin(d,names,got.map(g=>g.data().data)),t:d.t||0,parts:d.parts};
    last={bad:true,score:d.score,t:d.t||0,d,names,got};
    await sleep(300+Math.random()*500);
  }
  return last;
}
// Tid för ett molndokument; gamla {state, t} utan t använder lägets egen t (som cloudRead)
const docT=d=>d.parts?(d.t||0):(d.t||(d.state&&d.state.t)||0);
/* Molnläget går inte att läsa helt (en bit har en annan rev än huvuddokumentet). Oftast sparar någon just nu, men
   har en enhet skrivit en bit utan att hinna skriva huvuddokumentet stämmer det aldrig. Efter tre försök lagas läget:
   bitarna som stämmer används som de är, och i de andra slås molnets data ihop med det lokala (per ord den version som
   har flest svar, den längsta loggen, lokala fält som saknas), så att ingen statistik går förlorad. Sedan skrivs allt om. */
const BAD_TRIES=3;
function cloudSalvage(r,local){
  const nW=r.names.filter(n=>/^w\d+$/.test(n)).length||1, answers=x=>x?["mcR","mcW","tyR","tyW","clR","clW"].reduce((a,k)=>a+(+x[k]||0),0):-1;
  const datas=r.names.map((n,i)=>{ const g=r.got[i], gd=g&&g.exists?(g.data()||{}):{}, x=gd.data;
    if(gd.rev===r.d.parts[n]) return x;
    if(/^w\d+$/.test(n)){ const out={...(x&&typeof x==="object"?x:{})}, b=+n.slice(1);
      Object.entries((local&&local.w)||{}).forEach(([id,y])=>{ if(bucketOf(id)%nW===b&&answers(y)>answers(out[id])) out[id]=y; });
      return out; }
    if(/^log\d*$/.test(n)) return n==="log"&&local&&Array.isArray(local.log)&&local.log.length>(Array.isArray(x)?x.length:0)?local.log:x;
    if(n.startsWith("f.")) return x!==undefined?x:local&&local[n.slice(2)];
    return x; });
  return cloudJoin(r.d,r.names,datas);
}
// Efter tre försök: adopt:s svar (true, eller "later" mitt i ett pass). Annars false (försök igen senare).
function cloudBad(key,r){
  CLOUD.bad[key]=(CLOUD.bad[key]||0)+1;
  if(CLOUD.bad[key]<BAD_TRIES||!r.d||!r.names) return false;
  delete CLOUD.bad[key];
  const st=cloudSalvage(r,S);
  CLOUD.known[key]=null; CLOUD.force[key]=true;
  return adopt(st,key,true,r.t);   // old=true: skriver alla bitar på nytt när läget har tagits emot
}
function setSaveNote(){
  const n=$("#savenote"); if(!n) return;
  n.textContent=CLOUD.warn?"Framstegen sparas i den här webbläsaren, men kunde inte sparas på claude.ai (se varningen överst)."
    :CLOUD.ready?"Framstegen sparas på ditt claude.ai-konto efter varje svar och följer med mellan iPad, telefon och dator."
    :"Framstegen sparas i den här webbläsaren efter varje svar.";
}
// Tydlig varning överst på sidan när molnsparningen inte går (framstegen sparas ändå i webbläsaren)
function cloudWarn(msg){
  if(CLOUD.warn===msg) return; CLOUD.warn=msg;
  let b=document.getElementById("cloudwarn");
  if(!msg){ if(b) b.remove(); setSaveNote(); return; }
  if(!b){ b=document.createElement("div"); b.id="cloudwarn"; b.setAttribute("role","alert");
    b.style.cssText="margin:12px auto;max-width:720px;padding:12px 14px;border-radius:10px;background:#fff4e5;color:#6b3500;border:1px solid #e9a14b;font-size:15px;line-height:1.4";
    app.parentNode.insertBefore(b,app); }
  b.textContent=msg; setSaveNote();
}
async function cloudInit(){
  if(CLOUD.db||CLOUD.initing) return;
  CLOUD.initing=true;
  try{
    if(!window.claude||!window.claude.use) return;
    const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    if(!db||!user) return;
    const uid=await user.id(); if(!uid) return;
    CLOUD.db=db; CLOUD.uid=uid; CLOUD.user=user;
    boardSubscribe();
    if(L&&L.base) await cloudAttach();   // annars kopplas lagringen när kursens data har hämtats (useLang)
  }catch(e){ warnErr("claude.ai-lagringen kunde inte startas, försöker igen (cloudRetry)",e); }
  finally{ CLOUD.initing=false; }
}
// Gick starten eller hämtningen inte (dåligt nät, appen i bakgrunden)? Försök igen när appen syns eller nätet är tillbaka.
function cloudRetry(){
  if(document.visibilityState==="hidden") return;
  if(!CLOUD.db) cloudInit();
  else if(!CLOUD.ready&&!CLOUD.attaching&&!CLOUD.dead&&!CLOUD.noWrite&&L&&L.base) cloudAttach();
}
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") cloudFlush(); else cloudRetry(); });
window.addEventListener("online",cloudRetry);
window.addEventListener("pagehide",()=>cloudFlush());
// Byter till molnets läge. Mitt i ett pass väntar vi tills passet är slut (applyDeferred), och startsidan ritas
// bara om när den visas, så att eleven inte kastas ut från topplistan, Tyck till eller en resultatskärm.
function takeState(state,t){
  S=JSON.parse(JSON.stringify(state)); if(!(S.t>=t)) S.t=+t||S.t; normState(); rebuildWords();
  try{localStorage.setItem(L.storageKey,JSON.stringify(S))}catch(e){ warnErr("molnläget kunde inte sparas i webbläsaren ("+L.storageKey+")",e); }
}
function adopt(state,key,old,t){
  if(!L||(key&&key!==L.storageKey)) return false;
  key=L.storageKey;
  if(sess){ CLOUD.deferred={key,state,old,t}; return "later"; }
  CLOUD.deferred=null; takeState(state,t);
  if(curView==="ova"&&app.querySelector("#src")) renderStart(); else if(curView==="stats") renderStats();
  if(old) cloudSave(true);   // skriv om i det nya formatet
  return true;
}
function applyDeferred(render){
  const d=CLOUD.deferred; if(!d||sess) return;
  CLOUD.deferred=null;
  if(!L||d.key!==L.storageKey) return;
  if(remoteWins(score(d.state),Math.max(+d.t||0,d.state.t||0),S)){ if(render===false){ takeState(d.state,d.t); if(d.old) cloudSave(true); } else adopt(d.state,d.key,d.old,d.t); }
  else cloudSave(true);   // passet som just blev klart gjorde det lokala läget längre kommet
}
setInterval(()=>applyDeferred(),2000);
async function onRemote(key,s){   // ett nytt läge från en annan enhet
  if(!s||!s.exists||(s.metadata&&s.metadata.hasPendingWrites)||!L||key!==L.storageKey) return;
  const d=s.data()||{};
  if(!d.parts&&!d.state) return;
  if(!remoteWins(d.parts?d.score:score(d.state),docT(d),S)) return;
  let r; try{ r=d.parts?await cloudRead(key,s):{state:d.state,t:d.t||0,old:true}; }catch(e){ warnErr("molnläget kunde inte läsas ("+key+")",e); return; }
  if(r&&r.bad&&key===L.storageKey){ cloudBad(key,r); return; }
  if(!r||r.bad||key!==L.storageKey) return;
  if(r.parts) CLOUD.known[key]=r.parts; delete CLOUD.bad[key];
  if(remoteWins(score(r.state),r.t,S)) adopt(r.state,key,r.old,r.t);
}
async function cloudAttach(){   // vid start och vid byte av kurs
  if(!CLOUD.db||!L) return;
  const seq=++CLOUD.seq, key=L.storageKey;
  CLOUD.ready=false; CLOUD.attaching=true; setSaveNote();
  if(CLOUD.unsub){CLOUD.unsub();CLOUD.unsub=null}
  let r=null, got=false;
  for(let i=0;i<2&&!got;i++){ try{ r=await cloudRead(key); got=true; }catch(e){ await sleep(800+Math.random()*800); } }
  if(seq!==CLOUD.seq||key!==L.storageKey) return;
  CLOUD.attaching=false;
  if(!got){ setTimeout(cloudRetry,20000); return; }   // försöker också igen vid visibilitychange/online
  let push=!r;
  if(r&&r.bad){
    if(cmpArr(r.score,score(S))>0){   // går inte att läsa helt just nu, och är längre kommet: vänta, efter tre försök laga
      const a=cloudBad(key,r); if(!a){ setTimeout(cloudRetry,15000); return; }
      push=a===true;   // mitt i ett pass skrivs det lagade läget när passet är slut (applyDeferred)
    } else { CLOUD.known[key]=null; push=true; }   // vårt läge är minst lika långt: skriv alla bitar på nytt
  } else if(r){
    CLOUD.known[key]=r.parts||null; delete CLOUD.bad[key];
    if(remoteWins(score(r.state),r.t,S)){ if(adopt(r.state,key,false,r.t)===true) push=!!r.old; }
    else push=cmpScore(r.state,S)<0||(S.t||0)>(r.t||0)||!!r.old;
  }
  CLOUD.ready=true; setSaveNote();
  if(push) cloudSave(true);
  boardPush();
  CLOUD.unsub=docFor(key).onSnapshot(s=>{onRemote(key,s)},e=>warnErr("bevakningen av molnläget avbröts ("+key+")",e));
}
// En kö per kurs: byter eleven kurs medan något väntar sparas båda
function cloudSave(now){
  if(!CLOUD.db||!CLOUD.ready||!L) return;
  const key=L.storageKey;
  if(CLOUD.deferred&&CLOUD.deferred.key===key) return;   // ett längre kommet läge väntar på att passet ska bli klart
  CLOUD.pending[key]=S;
  clearTimeout(CLOUD.timer); CLOUD.timer=setTimeout(cloudFlush,now?0:1500);
}
async function cloudFlush(){
  clearTimeout(CLOUD.timer);
  if(CLOUD.busy||!CLOUD.db) return;
  const key=Object.keys(CLOUD.pending)[0]; if(!key) return;
  const st=JSON.parse(JSON.stringify(CLOUD.pending[key])); delete CLOUD.pending[key];
  CLOUD.busy=true; let wait=300;
  try{
    const r=await cloudWrite(key,st);
    if(r.skipped) onRemote(key,r.snap); else cloudWarn("");
  }catch(e){
    const c=e&&e.code;
    if(c==="too_big") cloudWarn("Framstegen är för stora för att sparas på claude.ai just nu. De sparas fortfarande i den här webbläsaren, så inget försvinner här, men de följer inte med till andra enheter. Säg till den som bygger appen.");
    else if(c==="revoked"||c==="not_granted"||c==="capability_disabled"||c==="capability_removed"){ CLOUD.ready=false; CLOUD.dead=true; setSaveNote(); }
    else if(c==="invalid_argument"||c==="transform_error"){ CLOUD.ready=false; CLOUD.noWrite=true; setSaveNote(); }
    else { if(!CLOUD.pending[key]) CLOUD.pending[key]=st; wait=3000; }
  }
  CLOUD.busy=false;
  if(Object.keys(CLOUD.pending).length) CLOUD.timer=setTimeout(cloudFlush,wait);
}
/* Per ord: s = steg (0–3, 4 = kan), due = pass då ordet ska repeteras, f = frågeform (mc/type),
   mcR/mcW = rätt/fel på flerval, tyR/tyW = rätt/fel på skriva, clR/clW = rätt/fel i meningar,
   lp/ld = lärt i pass/datum, mp/md = kan sedan pass/datum */
function save(){
  S.t=Math.max(Date.now(),(S.t||0)+1); S.nLog=nLogOf(S);   // alltid senare än läget vi utgick från, även om en annan enhets klocka går före
  if(S.log.length>LOG_MAX) foldLog();   // håller dokumentet under lagringsgränsen
  try{localStorage.setItem(L.storageKey,JSON.stringify(S))}catch(e){ warnErr("kunde inte spara i webbläsaren (fullt eller privat läge), bara i molnet",e); }
  cloudSave();
  renderStreak();
}
// De äldsta loggposterna sammanfattas i S.logOld, så att total tid och antal dagar finns kvar
function foldLog(){
  const cut=S.log.length-LOG_MAX, o=S.logOld||{dur:0,days:0,lastDay:""};
  o.n=(+o.n||0)+cut;   // antal sammanfattade poster (för S.nLog)
  S.log.slice(0,cut).forEach(l=>{o.dur+=l.dur||0; const k=new Date(l.d).toDateString(); if(k!==o.lastDay){o.days++; o.lastDay=k;}});
  S.logOld=o; S.log=S.log.slice(cut);
}
const ws=id=>S.w[id];
const isLearned=w=>!!ws(w.id);
const isMastered=w=>ws(w.id)&&ws(w.id).s>=4;
// "Igelord" (leech i Anki): ord som man har glömt många gånger och som behöver extra stöd
const isLeech=w=>{const x=w&&ws(w.id); if(!x) return false; const err=(x.mcW||0)+(x.tyW||0);
  return (x.lapses||0)>=3||(err>=5&&err/(err+(x.mcR||0)+(x.tyR||0))>.4);};
const dueWords=()=>WORDS.filter(w=>{const x=ws(w.id);return x&&isDue(x)})
  .sort((a,b)=>(ws(a.id).s>=MASTER)-(ws(b.id).s>=MASTER)||ws(a.id).due-ws(b.id).due).slice(0,MAXDUE);
/* Rätt: ett steg upp. Fel: ett steg ned, och ett ord man kunde går tillbaka till steg 2.
   t = frågeformen ("mc" eller "type"). Rätt på flerval räcker bara upp till steg MC_MAX (2, lär sig): ett ord räknas
   som "kan" först när man har skrivit det rätt. Ett ord som redan har högre steg sänks inte av ett rätt flerval.
   g = elevens egen bedömning efter ett rätt skrivet svar (S.selfRate, 05-words.js): "hard" (Svårt) = stannar på
   samma steg (kortare intervall än Bra), "easy" (Lätt) = två steg upp. Utan g (Bra) ett steg; gäller inte flerval. */
const MC_MAX=2;
function schedule(x,ok,p,now,t,g){
  const up=t==="mc"?1:g==="hard"?0:g==="easy"?2:1;
  if(ok){ x.s=Math.min(x.s+up,INT.length-1,t==="mc"?Math.max(x.s,MC_MAX):INT.length-1); if(x.s>=MASTER&&!x.mp){x.mp=p;x.md=now;} }
  else { x.s=x.s>=MASTER?2:Math.max(0,x.s-1); delete x.mp; delete x.md; x.lapses=(x.lapses||0)+1; }
  x.due=p+INT[x.s];
  if(DAYS[x.s]) x.dd=addDays(now,DAYS[x.s]); else delete x.dd;
}

/* ---------- Uppläsning ----------
   Uppläsningen (speechSynthesis) saknas eller kastar fel i en del webbläsare och i testerna. Då blir det bara tyst,
   medvetet utan varning: appen fungerar utan ljud, och en varning per ord skulle dränka konsolen. */
let voice=null;
function pickVoice(){try{
  const vs=speechSynthesis.getVoices(), code=L.tts.replace("-","[-_]"), base=L.tts.split("-")[0];
  voice=vs.find(v=>new RegExp("^"+code,"i").test(v.lang))||vs.find(v=>new RegExp("^"+base,"i").test(v.lang))||null;
}catch(e){ /* ingen uppläsning, se ovan */ }}
try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){ /* ingen uppläsning */ }
const cleanSay=t=>t.replace(/\(.*?\)/g,"").replace(/,\s*-\w+/g,"").replace(/[…«»\[\]]/g,"").replace(/\//g,", ");
const baseRate=()=>S&&S.slow?.7:.9;
// Ljud av/på (knappen i sidhuvudet). Gäller alla kurser och sparas i webbläsaren.
const SOUND_KEY="glosor-ljud";
let SOUND=(()=>{try{return localStorage.getItem(SOUND_KEY)!=="av"}catch(e){return true}})();
function setSound(on){ SOUND=on; try{localStorage.setItem(SOUND_KEY,on?"på":"av")}catch(e){ /* privat läge: gäller bara nu */ }
  if(!on) try{speechSynthesis.cancel()}catch(e){ /* ingen uppläsning */ }
  const b=document.querySelector("#sound"); if(b){ b.setAttribute("aria-pressed",String(!on)); b.textContent=on?"Ljud på":"Ljud av"; } }
function speak(t,rate){if(!SOUND)return;try{
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(cleanSay(t));u.lang=L.tts;if(voice)u.voice=voice;u.rate=rate||baseRate();speechSynthesis.speak(u);
}catch(e){ /* ingen uppläsning */ }}

/* ---------- Rättning ---------- */
const deacc=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/ß/g,"ss");
const noSz=s=>s.replace(/ß/g,"ss");   // "Strasse" räknas som rätt stavat "Straße" (så skriver man i Schweiz)
function norm(s){
  s=s.toLowerCase().replace(/[’`´]/g,"'").replace(/[«»"!?.;:…]/g," ").replace(/\s+/g," ").trim();
  (L.articles||[]).forEach(re=>{s=s.replace(re,"")});
  return s;
}
function variants(word){
  const out=new Set();
  const base=word.replace(/\(.*?\)/g,"").replace(/…/g,"").trim();
  const add=s=>{s=norm(s);if(s)out.add(s)};
  add(base); add(word.replace(/[()]/g,""));
  base.split(/\s*=\s*/).forEach(add);
  // Två former av samma ord med komma emellan godkänns också var för sig:
  //   "correspondant, -e" (ändelse): den första formen
  //   "fier, fière", "le mélomane, la mélomane", "l'envoyé spécial, l'envoyée spéciale": lika många ord
  //   "moniteur, monitrice de ski": färre ord i den första delen, och resten av den andra delen ("de ski") hör till
  //     båda formerna, så "moniteur de ski" och "monitrice de ski" godkänns
  // Villkoret är att de ord som står mot varandra är två former av samma ord (samma början, sameForm). Därför delas
  // en fras med komma aldrig: "ich habe dieses Thema gewählt, weil" godkänner inte "weil", och "Madame, Monsieur"
  // inte bara "Monsieur". Testet i tests/run_tests.py (SCENARIO_KINDS) går igenom alla ord med komma i alla kurser.
  const parts=base.split(/\s*,\s*/);
  if(parts.length===2&&parts[0]&&parts[1]){
    const [a,b]=parts;
    if(b.startsWith("-")) add(a);
    else { const A=a.split(/\s+/), B=b.split(/\s+/), n=A.length;
      if(n<=B.length&&sameForm(A[n-1],B[n-1])){ add(b); add([...A,...B.slice(n)].join(" ")); } }
  }
  return [...out];
}
// Två former av samma ord: minst hälften av det kortare ordet (och minst två bokstäver) är lika från början,
// utan accenter och versaler (moniteur/monitrice, vif/vive, cher/chère, l'abonné/l'abonnée, men inte Madame/Monsieur)
function sameForm(a,b){
  a=deacc(a.toLowerCase()); b=deacc(b.toLowerCase());
  let k=0; while(k<a.length&&k<b.length&&a[k]===b[k]) k++;
  return k>=Math.max(2,Math.ceil(Math.min(a.length,b.length)/2));
}
function conjVariants(c){
  const out=new Set();
  c.form.split("/").forEach(f=>{
    f=f.trim();
    const opts=f.includes("(")?[f.replace(/\([^)]*\)/g,""),f.replace(/[()]/g,""),f.replace(/\(e\)\(s\)/,"e").replace(/\(e\)/,"e"),f.replace(/\(e\)\(s\)/,"s"),f.replace(/\(e\)s/,"es")]:[f];
    opts.forEach(o=>{out.add(norm(o));});
  });
  return [...out];
}
function lev(a,b){const m=a.length,n=b.length;const d=Array.from({length:m+1},(_,i)=>[i]);for(let j=1;j<=n;j++)d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function check(input,accepted,stripPron){
  let a=norm(input); if(stripPron&&L.pronouns) a=a.replace(L.pronouns,"");
  if(!a) return "empty";
  if(accepted.includes(a)||accepted.some(x=>noSz(x)===noSz(a))) return "right";
  if(accepted.some(x=>deacc(x)===deacc(a))) return "accent";
  if(accepted.some(x=>x.length>4&&lev(deacc(x),deacc(a))<=1)) return "near";
  return "wrong";
}

/* ---------- Hjälpare ---------- */
const $=s=>document.querySelector(s);
const app=$("#app");
// Text från datafilerna läggs alltid in i sidan med esc (ren text) eller safeHtml (text med lite formatering).
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* Fält som får innehålla lite HTML (ursprung och ordagrant i words.txt, t.ex. <b>accentus</b>): bara taggarna
   b, i, em, strong, br, sup, sub och span släpps igenom, utan andra attribut än class på span. Allt annat blir text,
   så att "a < b" syns som det står och <script> eller <img onerror> aldrig körs. Entiteter som &nbsp; behålls. */
const SAFE_TAG=/^<(\/?)(b|i|em|strong|br|sup|sub|span)\b([^<>]*)>$/i;
function safeHtml(s){
  return String(s??"").split(/(<[^<>]*>)/).map(p=>{
    const m=p[0]==="<"&&p.match(SAFE_TAG);
    if(!m) return esc(p).replace(/&amp;(#\d+|#x[0-9a-f]+|[a-z]+);/gi,"&$1;");
    const tag=m[2].toLowerCase(), cls=!m[1]&&tag==="span"&&m[3].match(/(?:^|\s)class="([\w -]*)"/);
    return m[1]?`</${tag}>`:`<${tag}${cls?` class="${cls[1]}"`:""}>`;
  }).join("");
}
const SPK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const secName=id=>(SECTIONS.find(s=>s.id===id)||{}).name||"";
// Genusnamn om kursen inte har egna (genders i lang.js), så att en ny kurs fungerar med bara de fält den måste ha
const GENDER_NAMES={m:"maskulinum",f:"femininum",n:"neutrum",pl:"plural",mpl:"mask. plural",fpl:"fem. plural",npl:"neutr. plural"};
const genderName=g=>(L.genders||GENDER_NAMES)[g]||g;
const gtag=g=>g?`<span class="tag ${esc(g[0])}">${esc(genderName(g))}</span>`:"";
const accentKeys=list=>list?`<div class="accents">${String(list).split(" ").filter(Boolean).map(c=>`<button type="button" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>`:"";
const lang=()=>`lang="${esc(L.htmlLang||L.code)}"`;

// Valfria avsnitt (L.elective, t.ex. musikteorin) tas bara med när eleven väljer dem själv
const isElective=id=>!!(L.elective&&L.elective.test.test(id||""));
const coreWords=()=>WORDS.filter(w=>!isElective(w.sec));

/* ---------- Samma uträkning en gång per rendering ----------
   Startsidan och statistiken frågar efter samma sak från flera paneler (nya ord via curSec i målen, kapitelkartan,
   skrivförslaget; framsteg per avsnitt i rullistorna och kapitelkartan). inRender(fn) kör fn med en tom cache, och
   perRender(namn, f) räknar då f bara en gång. Utanför en rendering räknas f varje gång, så att inget blir inaktuellt
   när S ändras. Cachen gäller bara medan sidan byggs, inte i klickhändelserna. */
let RCACHE=null;
function inRender(fn){ if(RCACHE) return fn(); RCACHE=new Map(); try{ return fn(); } finally{ RCACHE=null; } }
const perRender=(k,f)=>{ if(!RCACHE) return f(); if(!RCACHE.has(k)) RCACHE.set(k,f()); return RCACHE.get(k); };
// Orden per avsnitt ({avsnitts-id: [ord]}), räknas om när WORDS byts (rebuildWords)
let SEC_IX={words:null,by:{}};
function secWords(id){
  if(SEC_IX.words!==WORDS){ const by={}; WORDS.forEach(w=>(by[w.sec]=by[w.sec]||[]).push(w)); SEC_IX={words:WORDS,by}; }
  return SEC_IX.by[id]||[];
}
function pickNew(){ return perRender("pickNew",pickNewNow); }
function pickNewNow(){
  // Egna ord från texterna först, sedan kapitlet klassen läser (om boken finns), sedan resten avsnitt för avsnitt.
  // Inom varje avsnitt (även kapitlets, k2, k2b …) kommer de vanligaste orden först: L.freq = hur ofta ordet står i
  // kursens egna texter (räknas av build.py, word_freq), vid lika i ordlistans ordning.
  const inCh=new Set(S.chapter?SECTIONS.filter(s=>sameChapter(s.id,S.chapter)).map(s=>s.id).concat(S.chapter):[]);
  const rk={}; SECTIONS.forEach(s=>rk[s.id]=s.id==="mine"?0:inCh.has(s.id)?1:2);
  const rank=w=>rk[w.sec]??(w.sec==="mine"?0:inCh.has(w.sec)?1:2);
  const fq=L.freq||{}, secIx={}, pos=new Map();
  SECTIONS.forEach((s,i)=>secIx[s.id]=i); WORDS.forEach((w,i)=>pos.set(w,i));
  const fresh=WORDS.filter(w=>!isLearned(w)).sort((a,b)=>rank(a)-rank(b)||(rank(a)?secIx[a.sec]-secIx[b.sec]:0)
    ||(fq[b.id]||0)-(fq[a.id]||0)||pos.get(a)-pos.get(b));
  const pool=S.src==="auto"?fresh.filter(w=>!isElective(w.sec)):fresh.filter(w=>w.sec===S.src);
  return pool.slice(0,S.newCount);
}

/* ---------- Startsida ---------- */
// Förslag att gå vidare till nästa kurs (Tyska 4 → Tyska 5) när nästan alla ord är påbörjade och hälften sitter.
// Med en lista i nextCourse (t.ex. ["fr5","fru"]) erbjuds båda vägarna.
function nextPanel(){
  const nx=nextCourses().map(c=>LANGUAGES[c]), core=coreWords(), learned=core.filter(isLearned).length, mastered=core.filter(isMastered).length;
  if(!nx.length||!core.length||learned<core.length*0.9||mastered<core.length*0.5) return "";
  const names=nx.map(x=>x.course||x.name), which=names.length>1?names.slice(0,-1).join(", ")+" eller "+names[names.length-1]:names[0];
  return `<section class="panel"><h2>Redo för ${esc(which)}?</h2>
    <p class="plan">Du har övat på ${learned} av ${core.length} ord i ${esc(L.course)}, och ${mastered} kan du redan. Du kan fortsätta repetera här och samtidigt börja på ${esc(names.length>1?"nästa kurs":names[0])}. Framstegen sparas separat i varje kurs.</p>
    ${nx.length>1?`<div class="nextc">${nextCourses().map(c=>`<button class="btn" data-nextc="${esc(c)}">${esc(LANGUAGES[c].course||LANGUAGES[c].name)}<span class="sub">${esc([stepLabel(LANGUAGES[c].step,LANGUAGES[c].stepAs),LANGUAGES[c].level].filter(Boolean).join(" · "))}</span></button>`).join("")}</div>`
      :`<button class="btn" id="nextc" data-nextc="${esc(nextCourses()[0])}">Gå till ${esc(names[0])}</button>`}</section>`;
}
function renderStart(){
  renderStreak();
  document.body.classList.remove("has-tray");
  sess=null; RETURN_TO=null;
  applyDeferred(false);   // ett molnläge som kom mitt i ett pass
  curView="ova";
  $("#tabs").hidden=false; tabSel("ova");
  // Som inRender (se pickNew), utan att flytta in sidan i en funktion: cachen gäller tills app.innerHTML är satt
  let newW, due; const top=!RCACHE; if(top) RCACHE=new Map();
  try{
  newW=pickNew(); due=dueWords();
  const {learned,mastered}=wordCounts();
  const secOpt=s=>{const n=secProg([s.id]).rest;
    return `<option value="${esc(s.id)}" ${n?"":"disabled"}>${esc(s.name)} · ${progLabel([s.id])}</option>`;};
  const elSecs=SECTIONS.filter(s=>isElective(s.id)), bookSecs=SECTIONS.filter(s=>s.book&&!isElective(s.id)), otherSecs=SECTIONS.filter(s=>!s.book&&!isElective(s.id));
  const opts=`<option value="auto">${hasBook()?"Kapitlet ni läser, sedan resten":L.nextLabel||"Nästa ord i ordlistan"}</option>`+(bookSecs.length
    ?`<optgroup label="Boken: ${esc(L.book?L.book.title:"")}">${bookSecs.map(secOpt).join("")}</optgroup><optgroup label="Allmänt">${otherSecs.map(secOpt).join("")}</optgroup>`
    :otherSecs.map(secOpt).join(""))+(elSecs.length?`<optgroup label="${esc(L.elective.label)}">${elSecs.map(secOpt).join("")}</optgroup>`:"");
  const nothing=!newW.length&&!due.length;
  app.innerHTML=`
  ${(S.run&&S.run.daily)||S.dailyDay===dayKey(Date.now())?"":dailyPanel(newW,due)}
  ${S.run?`<section class="panel"><h2>Fortsätt där du slutade</h2><p class="plan">${esc(runLabel(S.run))}</p>
    <div class="navrow"><button class="btn ghost" id="run-drop">Släng</button><button class="btn" id="run-go">Fortsätt</button></div></section>`:""}
  ${Object.entries(S.runs||{}).filter(([k,r])=>k.startsWith("words")&&r&&k!==runKey(S.run)).map(([k,r])=>`<section class="panel"><h2>Fortsätt glospasset</h2><p class="plan">${esc(runLabel(r))}</p>
    <div class="navrow"><button class="btn ghost" data-wdrop="${esc(k)}">Släng</button><button class="btn" data-wgo="${esc(k)}">Fortsätt</button></div></section>`).join("")}
  ${hasBook()?bookPanel():""}
  ${goalsPanel()}
  ${writeNagPanel()}
  ${nextPanel()}
  <section class="panel">
    <div class="meta"><span class="label">Pass ${S.pass}</span></div>
    <div class="stats">
      <div class="stat"><b>${due.length}</b><span>att repetera</span></div>
      <div class="stat"><b>${learned-mastered}</b><span>på väg</span></div>
      <div class="stat"><b>${mastered}</b><span>kan</span></div>
    </div>
    <div class="field"><span class="label">Nya ord från</span><select id="src">${opts}</select></div>
    ${chapterMap()}
    <div class="field"><span class="label">Antal nya ord</span>
      <div class="seg" role="group" aria-label="Antal nya ord">${[0,10,15,20].map(n=>`<button data-n="${n}" aria-pressed="${S.newCount===n}">${n||"Inga"}</button>`).join("")}</div></div>
    <div class="field"><span class="label">Quizet</span>
      <div class="seg" role="group" aria-label="Frågetyp">
        <button data-m="mix" aria-pressed="${S.mode==="mix"}">Anpassat</button>
        <button data-m="mc" aria-pressed="${S.mode==="mc"}">Flerval</button>
        <button data-m="type" aria-pressed="${S.mode==="type"}">Skriva</button></div>
      ${S.mode==="type"?"":`<p class="foot" id="mc-note">Ett ord räknas som <b>kan</b> först när du har skrivit det rätt. Flerval räcker till <b>lär sig</b>.</p>`}</div>
    <details class="more settings" id="setd" ${SET_OPEN?"open":""}><summary>Fler inställningar</summary>
    <div class="row2b">
      <div class="field"><span class="label">Uppläsning</span>
        <div class="seg" role="group" aria-label="Uppläsning"><button data-slow="0" aria-pressed="${!S.slow}">Normal</button><button data-slow="1" aria-pressed="${!!S.slow}">Långsam</button></div></div>
      <div class="field"><span class="label">Nya ord</span>
        <div class="seg" role="group" aria-label="Nya ord"><button data-lf="0" aria-pressed="${!S.listenFirst}">Visa direkt</button><button data-lf="1" aria-pressed="${!!S.listenFirst}">Lyssna först</button></div></div>
    </div>
    <div class="field"><span class="label">Bedöm själv hur svårt det var</span>
      <div class="seg" role="group" aria-label="Bedöm själv hur svårt det var"><button data-sr="0" aria-pressed="${!S.selfRate}">Av</button><button data-sr="1" aria-pressed="${!!S.selfRate}">På</button></div>
      <p class="foot">Efter ett rätt skrivet ord i glosquizet väljer du Igen, Svårt, Bra eller Lätt (tangenterna 1–4; Enter eller mellanslag = Bra). Svårt kommer tillbaka tidigare, Lätt senare.</p></div>
    ${Object.keys(LANGUAGES).length>1?`<div class="field"><span class="label">Kurser</span>
      <div class="seg" role="group" aria-label="Kurser"><button data-only="0" aria-pressed="${!onlyCourse()}">Visa alla</button><button data-only="1" aria-pressed="${sameLang(onlyCourse(),L.code)}">Bara ${esc(L.name.toLowerCase())}</button></div></div>`:""}
    <div class="field"><span class="label">Veckomål</span>
      <div class="seg" role="group" aria-label="Veckomål">${[0,60,90,120,150].map(n=>`<button data-goal="${n}" aria-pressed="${(S.goal||0)===n}">${n?n+" min":"Inget"}</button>`).join("")}</div></div>
    ${L.courseGy25?`<div class="field"><span class="label">Läroplan</span>
      <div class="seg" role="group" aria-label="Läroplan"><button data-gy="0" aria-pressed="${!S.gy25}">Gy11 (${esc(L.course)})</button><button data-gy="1" aria-pressed="${!!S.gy25}">Gy25</button></div>
      <p class="foot">Gy25 gäller den som började gymnasiet efter 1 juli 2025. Där heter kursen ${esc(L.courseGy25)}.</p></div>`:""}
    </details>
    <p class="plan">${nothing?"Inget att öva just nu. Välj ett annat avsnitt eller fler nya ord."
      :`Du lär dig <b>${newW.length} nya ord</b> och repeterar <b>${due.length}</b>. Quizet får ${newW.length+due.length} frågor.`}
      ${S.mode==="mix"&&!nothing?` ${(()=>{const t=due.filter(w=>ws(w.id).f==="type").length;return `${newW.length+due.length-t} frågor med flerval och ${t} där du skriver ${L.inLang}.`})()} Klarar du flerval blir det skriva nästa gång. Missar du när du skriver blir det flerval igen.`:""}</p>
    <button class="btn ${S.run?"":"ghost"}" id="go" ${nothing?"disabled":""}>${newW.length?"Bara glosorna: börja med de nya orden":"Bara glosorna: starta quizet"}</button>
  </section>
  ${gamesPanel()}
  ${videosPanel(S.src!=="auto"?S.src:(newW[0]||WORDS.filter(isLearned).pop()||WORDS[0]||{}).sec)}`;
  } finally{ if(top) RCACHE=null; }
  $("#src").value=S.src; if(!$("#src").selectedOptions[0]||$("#src").selectedOptions[0].disabled){S.src="auto";$("#src").value="auto"}
  $("#src").onchange=e=>{S.src=e.target.value;save();renderStart()};
  wireBookPanel(); wireChapterMap(); wireWriteNag();
  app.querySelectorAll("[data-nextc]").forEach(b=>b.onclick=()=>useLang(b.dataset.nextc));
  app.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{S.newCount=+b.dataset.n;save();renderStart()});
  app.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;save();renderStart()});
  app.querySelectorAll("[data-slow]").forEach(b=>b.onclick=()=>{S.slow=b.dataset.slow==="1";save();renderStart()});
  app.querySelectorAll("[data-lf]").forEach(b=>b.onclick=()=>{S.listenFirst=b.dataset.lf==="1";save();renderStart()});
  app.querySelectorAll("[data-sr]").forEach(b=>b.onclick=()=>{S.selfRate=b.dataset.sr==="1";save();renderStart()});
  $("#setd").ontoggle=()=>{SET_OPEN=$("#setd").open};
  app.querySelectorAll("[data-only]").forEach(b=>b.onclick=()=>{setOnly(b.dataset.only==="1"?L.code:"");renderStart()});
  app.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{S.goal=+b.dataset.goal;save();boardPush();renderStart()});
  app.querySelectorAll("[data-gy]").forEach(b=>b.onclick=()=>{S.gy25=b.dataset.gy==="1";save();$("#coursechip").textContent=courseChip();renderStart()});
  if($("#daily")) $("#daily").onclick=()=>startDaily(newW,due);
  $("#go").onclick=()=>startSession(newW,due);
  if(S.run){ $("#run-go").onclick=resumeRun; $("#run-drop").onclick=quitSession; }
  app.querySelectorAll("[data-wgo]").forEach(b=>b.onclick=()=>{S.run=S.runs[b.dataset.wgo]; resumeRun();});
  app.querySelectorAll("[data-wdrop]").forEach(b=>b.onclick=()=>{delete S.runs[b.dataset.wdrop]; save(); renderStart();});
  wireGames();
  renderList();
}

/* Videor till kapitlet */
const vidItem=v=>`<li><a class="vid" href="${esc(v.url)}" target="_blank" rel="noopener"><span class="play">${PLAY}</span><b>${esc(v.title)}</b><span>${esc([v.channel,v.level,v.sv].filter(Boolean).join(" · "))}</span></a></li>`;
function videosPanel(secId){
  const V=L.videos||{}, secs=SECTIONS.filter(s=>(V[s.id]||[]).length);
  if(!secs.length) return "";
  const cur=(V[secId]||[]).length?secId:null;
  return `<section class="panel"><h2>Lyssna på ${L.name.toLowerCase()}</h2>
    ${cur?`<p class="plan">Klipp som hör till <b>${esc(secName(cur))}</b>. Slå på ${L.name.toLowerCase()} undertexter om de finns.</p><ul class="vids">${V[cur].map(vidItem).join("")}</ul>`
      :`<p class="plan">Klipp med enkel ${L.name.toLowerCase()} som hör till kapitlen.</p>`}
    <details class="more" ${cur?"":"open"}><summary>${cur?"Klipp till alla kapitel":"Visa klippen"}</summary>
      ${secs.filter(s=>s.id!==cur).map(s=>`<div class="vsec">${esc(s.name)}</div><ul class="vids">${V[s.id].map(vidItem).join("")}</ul>`).join("")}
    </details></section>`;
}

/* ---------- Hur långt man har kommit i varje kapitel ----------
   Används i rullistorna (text) och i kapitelkartan under "Nya ord från" (staplar). "Kan" = steg 4 eller mer,
   "på väg" = påbörjat, "kvar" = inte påbörjat. */
function secProg(ids){
  let tot=0,k=0,l=0;
  ids.forEach(id=>{ const c=perRender("sec:"+id,()=>{ const ws_=secWords(id); return {tot:ws_.length,k:ws_.filter(isMastered).length,l:ws_.filter(isLearned).length}; });
    tot+=c.tot; k+=c.k; l+=c.l; });
  return {tot,k,v:l-k,rest:tot-l,pct:tot?Math.round(100*l/tot):0};
}
// Antal påbörjade och kunna ord i hela kursen (startsidan, myStats)
const wordCounts=()=>perRender("wc",()=>{ let learned=0,mastered=0; WORDS.forEach(w=>{ if(isLearned(w)){ learned++; if(isMastered(w)) mastered++; } }); return {learned,mastered}; });
const bar5=p=>"▰".repeat(Math.round(p/20))+"▱".repeat(5-Math.round(p/20));
function progLabel(ids){ const p=secProg(ids);
  return p.rest?`${bar5(p.pct)} ${p.pct} % (${p.rest} ord kvar)`:`✓ klart${p.k<p.tot?` (${p.tot-p.k} ord på väg)`:""}`; }
let CHMAP_OPEN=false;
function chapterMap(){
  const all=chapters().filter(c=>c.id!=="mine"); if(all.length<2) return "";   // kapitlen i ordning (00-common.js), utan Mina ord
  const cur=hasBook()&&S.chapter?S.chapter:(S.src!=="auto"?S.src:curSec());
  // Valfria avsnitt visas sist och räknas inte in i "x av y kapitel klara"
  const gs=all.filter(g=>!isElective(g.ids[0])), el=all.filter(g=>isElective(g.ids[0]));
  const done=gs.filter(g=>!secProg(g.ids).rest).length;
  return `<details class="more chmap" id="chmap" ${CHMAP_OPEN?"open":""}><summary>Hur långt har jag kommit? ${done} av ${gs.length} kapitel klara</summary>
    <div class="legend"><span><i class="sw" style="background:var(--c2)"></i>Kan</span><span><i class="sw" style="background:var(--c1)"></i>På väg</span><span><i class="sw" style="background:var(--grid)"></i>Kvar</span></div>
    <div class="chlist">${[...gs,...el].map((g,i)=>{const p=secProg(g.ids), here=g.ids.includes(cur);
      return (el.length&&i===gs.length?`<div class="vsec">${esc(L.elective.label)}</div>`:"")+`<button type="button" class="chrow${here?" here":""}" data-chmap="${esc(g.id)}" aria-label="${esc(g.name)}: ${p.k} kan, ${p.v} på väg, ${p.rest} kvar. Välj kapitlet.">
        <span class="chtop"><span class="chname">${esc(g.name)}${here?' <span class="pill new">nu</span>':""}</span><span class="chnum">${p.rest?p.pct+" %":"✓"}</span></span>
        <span class="track" data-tip="${esc(g.name)}: ${p.k} kan, ${p.v} på väg, ${p.rest} kvar av ${p.tot}">${p.k?`<i style="width:${100*p.k/p.tot}%;background:var(--c2)"></i>`:""}${p.v?`<i style="width:${100*p.v/p.tot}%;background:var(--c1)"></i>`:""}</span></button>`;}).join("")}</div>
    <p class="foot">Tryck på ett kapitel för att ta nya ord därifrån.</p></details>`;
}
function wireChapterMap(){
  const d=$("#chmap"); if(!d) return; d.ontoggle=()=>{CHMAP_OPEN=d.open};
  d.querySelectorAll("[data-chmap]").forEach(b=>b.onclick=()=>{
    const g=chapters().find(x=>x.id===b.dataset.chmap&&x.id!=="mine"); if(!g) return;
    const first=g.ids.find(id=>secWords(id).some(w=>!isLearned(w)))||g.ids[0];
    if(g.book){ S.chapter=g.ids[0]; S.src="auto"; } else S.src=first;
    save(); renderStart(); const m=$("#chmap"); if(m) m.scrollIntoView({block:"nearest"}); });
}

/* ---------- Statistik per dag ---------- */
const dayIso=ts=>{const d=new Date(ts); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
function dayStats(){
  const by={};
  S.log.forEach(l=>{const k=dayIso(l.d), o=by[k]=by[k]||{sec:0,q:0,r:0,nw:0,ex:0,wr:0};
    o.sec+=l.dur||0; o.q+=l.total||0; o.r+=l.right||0; o.nw+=l.nNew||0; if(l.kind||l.verb||l.cloze) o.ex++; if(l.kind==="write") o.wr+=l.words||0;});
  return by;
}
function statsDaily(){
  const by=dayStats(); if(!Object.keys(by).length) return "";
  const today=new Date(); today.setHours(12,0,0,0);
  const days=[]; for(let i=27;i>=0;i--){const d=new Date(today); d.setDate(d.getDate()-i); const k=dayIso(d); days.push({d,k,o:by[k]||{sec:0,q:0,r:0,nw:0,ex:0,wr:0}});}
  const t=days[days.length-1].o, min=o=>Math.round(o.sec/60), active=days.filter(x=>x.o.sec>0||x.o.q>0);
  const wd=d=>d.toLocaleDateString("sv-SE",{weekday:"short"}), dm=d=>`${d.getDate()}/${d.getMonth()+1}`;
  const W=600,H=220,ml=40,mr=8,mt=14,mb=34,iw=W-ml-mr,ih=H-mt-mb,n=days.length, ymax=niceMax(Math.max(10,...days.map(x=>min(x.o))));
  const y=v=>mt+ih-(v/ymax)*ih, bw=iw/n-2;
  let g=""; [0,ymax/2,ymax].forEach(v=>g+=`<line class="gl" x1="${ml}" x2="${W-mr}" y1="${y(v)}" y2="${y(v)}"/><text x="${ml-8}" y="${y(v)+6}" text-anchor="end">${Math.round(v)}</text>`);
  days.forEach((x,i)=>{const cx=ml+i*iw/n+1, m=min(x.o), h=m?Math.max(3,ih*m/ymax):0, top=mt+ih-h, r=Math.min(4,bw/2,h);
    if(h) g+=`<path d="M${cx},${mt+ih} V${top+r} Q${cx},${top} ${cx+r},${top} H${cx+bw-r} Q${cx+bw},${top} ${cx+bw},${top+r} V${mt+ih} Z" fill="var(--c2)"/>`;
    const tip=`${wd(x.d)} ${dm(x.d)}: ${m} min${x.o.q?`, ${x.o.q} frågor (${pct(x.o.r,x.o.q)} % rätt)`:""}${x.o.nw?`, ${x.o.nw} nya ord`:""}${x.o.ex?`, ${x.o.ex} övningar`:""}${!m&&!x.o.q?" (ingen övning)":""}`;
    g+=`<rect x="${ml+i*iw/n}" y="${mt}" width="${iw/n}" height="${ih}" fill="transparent" data-tip="${esc(tip)}"/>`;
    if(i===n-1) g+=`<text x="${cx+bw/2}" y="${H-8}" text-anchor="end">i dag</text>`;
    else if((n-1-i)%7===0) g+=`<text x="${cx+bw/2}" y="${H-8}" text-anchor="middle">${dm(x.d)}</text>`;});
  const avg=active.length?Math.round(active.reduce((a,x)=>a+x.o.sec,0)/60/active.length):0;
  const st=myStats();
  return `<section class="panel"><h2>Dag för dag</h2>
    <div class="stats4">
      <div class="stat"><b>${min(t)}</b><span>minuter i dag</span></div>
      <div class="stat"><b>${t.q}</b><span>frågor i dag${t.q?` · ${pct(t.r,t.q)} % rätt`:""}</span></div>
      <div class="stat"><b>${t.nw}</b><span>nya ord i dag</span></div>
      <div class="stat"><b>${st.streak}</b><span>dagar i rad</span></div>
    </div>
    <span class="label">Minuter per dag, de senaste fyra veckorna</span>
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Minuter per dag de senaste 28 dagarna">${g}</svg>
    <p class="plan">Du har övat ${active.length} av de senaste 28 dagarna${active.length?`, i snitt ${avg} minuter de dagar du övade`:""}.</p>
    <details class="tv"><summary>Visa som tabell</summary><div class="tblwrap"><table class="tbl">
      <tr><th>Dag</th><th>Minuter</th><th>Frågor</th><th>Rätt</th><th>Nya ord</th><th>Övningar</th></tr>
      ${days.slice().reverse().filter(x=>x.o.sec||x.o.q).map(x=>`<tr><td>${wd(x.d)} ${dm(x.d)}</td><td>${min(x.o)}</td><td>${x.o.q}</td><td>${x.o.q?pct(x.o.r,x.o.q)+" %":"–"}</td><td>${x.o.nw}</td><td>${x.o.ex}</td></tr>`).join("")}
    </table></div></details></section>`;
}

/* ---------- Topplista ----------
   Varje person skriver en sammanfattning per språk i board/<sitt id> (bara den egna går att ändra).
   Alla som har tillgång till programmet ser allas sammanfattningar. */
const BOARD={docs:{},mine:null,unsub:null,timer:null,pend:{},nick:undefined,wait:[],busy:false,msg:""};
function boardKeepMine(){ const u=CLOUD.uid, m=BOARD.mine; if(m&&(!BOARD.docs[u]||(BOARD.docs[u].t||0)<m.t)) BOARD.docs[u]=m; }
function weekStart(ts){const d=new Date(ts);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()}
const dayKey=ts=>new Date(ts).toDateString();
function isoWeek(d){ const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); const day=t.getUTCDay()||7;
  t.setUTCDate(t.getUTCDate()+4-day); const y0=new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil(((t-y0)/864e5+1)/7); }
// Flamman i sidhuvudet: antal dagar i rad (samma som statistiken). Urblekt om dagens pass inte är gjort, dold utan svit.
function renderStreak(){
  const el=document.querySelector("#streak"); if(!el) return;
  const days=new Set(S.log.map(l=>dayKey(l.d))), d=new Date(); d.setHours(12,0,0,0);
  const today=days.has(dayKey(d)); if(!today) d.setDate(d.getDate()-1);
  let n=0; while(days.has(dayKey(d))){n++; d.setDate(d.getDate()-1)}   // samma räkning som myStats
  el.hidden=!n; if(!n) return;
  el.classList.toggle("cold",!today);
  el.title=today?`${n} dagar i rad`:`${n} dagar i rad – gör ett pass i dag för att hålla flamman vid liv`;
  el.setAttribute("aria-label",el.title);
  el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#F27A1A" d="M12 2c1 3.5-1.5 5.2-2.8 7.1C7.7 11.3 7 13 7 15a5 5 0 0 0 10 0c0-2.6-1.3-4.3-2.3-5.6-.3 1.5-1 2.4-2 2.8.6-3.4-.2-7.1-.7-10.2z"/><path fill="#FFC53D" d="M12 21a3 3 0 0 1-3-3c0-1.6 1.1-2.7 2-3.8.2 1 .8 1.6 1.5 1.8-.1-.9.2-1.9.8-2.6.9 1.2 1.7 2.5 1.7 4.6a3 3 0 0 1-3 3z"/></svg>${n}`;
}
function streakAlive(last){const d=new Date();if(dayKey(last)===dayKey(d))return true;d.setDate(d.getDate()-1);return dayKey(last)===dayKey(d)}
const HIST_WEEKS=6;   // veckorna bakåt i topplistans historik (hist)
// Veckans siffror för topplistan och veckomålet. Går igenom loggen en gång: veckostarterna b[0] = den här veckan,
// b[1] = förra veckan … b[HIST_WEEKS], och varje post läggs i sin vecka.
function myStats(){
  const w0=weekStart(Date.now()), b=[w0]; for(let i=0;i<HIST_WEEKS;i++) b.push(weekStart(b[i]-3*864e5));
  const sec=b.map(()=>0), q=b.map(()=>0), days=new Set(), wkDays=new Set();
  S.log.forEach(l=>{ const k=dayKey(l.d); days.add(k);
    if(l.d>=w0){ wkDays.add(k); sec[0]+=l.dur||0; q[0]+=l.total||0; return; }
    for(let i=1;i<b.length;i++) if(l.d>=b[i]){ sec[i]+=l.dur||0; q[i]+=l.total||0; break; } });
  let streak=0; const d=new Date(); d.setHours(12,0,0,0); if(!days.has(dayKey(d))) d.setDate(d.getDate()-1);
  while(days.has(dayKey(d))){streak++; d.setDate(d.getDate()-1)}
  // hist: minuter per vecka de sex senaste hela veckorna, {veckostart: minuter}, bara veckor med minuter
  const min=i=>Math.round(sec[i]/60), hist={}; for(let i=1;i<b.length;i++) if(min(i)) hist[b[i]]=min(i);
  const {learned,mastered}=wordCounts();
  return {week:w0, min:min(0), q:q[0], goal:S.goal||0, prev:{week:b[1], min:min(1), q:q[1]}, hist,
    days:wkDays.size, streak, last:S.log.length?S.log[S.log.length-1].d:0, learned, mastered};
}
function boardSubscribe(){
  if(!CLOUD.db||BOARD.unsub) return;
  BOARD.unsub=CLOUD.db.collection("board").onSnapshot(s=>{
    BOARD.docs={}; s.docs.forEach(d=>{if(d.exists)BOARD.docs[d.id]=d.data()}); boardKeepMine();
    if(curView==="board"&&!sess) renderBoard();
  },e=>warnErr("topplistan kunde inte bevakas",e));
}
/* Väntande uppdateringar samlas per kurs, så att ett kursbyte inte tappar den förra kursens siffror.
   Ger ett löfte om true när det är sparat, false om det inte gick. */
function boardPush(nick){
  if(!CLOUD.db||!CLOUD.uid||!L) return Promise.resolve(false);
  BOARD.pend[L.code]=myStats(); if(nick!==undefined) BOARD.nick=nick;
  return new Promise(res=>{ BOARD.wait.push(res); clearTimeout(BOARD.timer); BOARD.timer=setTimeout(boardFlush,nick!==undefined?0:1000); });
}
async function boardFlush(){
  clearTimeout(BOARD.timer);
  if(BOARD.busy) return;   // körs igen när den pågående är klar
  const pend=BOARD.pend, nick=BOARD.nick, wait=BOARD.wait;
  BOARD.pend={}; BOARD.nick=undefined; BOARD.wait=[];
  if(!Object.keys(pend).length&&nick===undefined){ wait.forEach(f=>f(true)); return; }
  BOARD.busy=true; let ok=false;
  try{
    const ref=CLOUD.db.doc("board/"+CLOUD.uid), cur=await ref.get(), old=(cur.exists&&cur.data())||{};
    const langs=old.langs&&typeof old.langs==="object"?old.langs:{};
    const body={nick:nick!==undefined?nick:(typeof old.nick==="string"?old.nick:""), langs:{...langs,...pend}, t:Date.now()};
    await ref.set(body); BOARD.mine=body; boardKeepMine(); ok=true;
  }catch(e){ BOARD.pend={...pend,...BOARD.pend}; }   // försöker igen vid nästa uppdatering
  BOARD.busy=false; wait.forEach(f=>f(ok));
  if(ok&&curView==="board"&&!sess) renderBoard();
  if(BOARD.wait.length) BOARD.timer=setTimeout(boardFlush,300);
}
async function renderBoard(){
  if(!CLOUD.db||!CLOUD.uid){
    app.innerHTML=`<section class="panel"><h2>Topplista</h2><p class="plan">Topplistan fungerar när du är inloggad på claude.ai och har fått tillgång till glosprogrammet. Då sparas också alla dina framsteg på ditt konto.</p></section>`;
    return;
  }
  const w0=weekStart(Date.now()), pw=weekStart(w0-3*864e5);
  // Allt här kommer från andras dokument: bara tal (num) och text genom esc()
  const num=v=>{const x=+v; return Number.isFinite(x)?x:0;}, obj=v=>v&&typeof v==="object"?v:{};
  const nickOf=d=>typeof d.nick==="string"?d.nick.trim().slice(0,24):"";
  const rows=Object.entries(BOARD.docs).map(([id,d])=>{
    d=obj(d); const r={id,nick:nickOf(d),min:0,q:0,days:0,streak:0,langs:[],prev:0,goals:[]};
    Object.entries(obj(d.langs)).forEach(([k,x])=>{
      if(!x||typeof x!=="object") return;
      const wk=num(x.week);
      if(wk===w0){r.min+=num(x.min); r.q+=num(x.q); r.days=Math.max(r.days,num(x.days)); if(num(x.goal)) r.goals.push(num(x.min)>=num(x.goal));}
      // Förra veckans minuter: från förra veckans rad om personen inte har övat den här veckan än, annars från prev
      if(wk===pw) r.prev+=num(x.min); else if(x.prev&&num(x.prev.week)===pw) r.prev+=num(x.prev.min);
      if(x.last&&streakAlive(num(x.last))) r.streak=Math.max(r.streak,num(x.streak));
      r.langs.push(String((LANGUAGES[k]||{}).course||(LANGUAGES[k]||{}).name||k));
    });
    return r;
  }).sort((a,b)=>b.min-a.min||b.q-a.q||b.streak-a.streak);
  let ps={}; try{ps=await CLOUD.user.profiles(rows.map(r=>r.id))}catch(e){ warnErr("namnen i topplistan kunde inte hämtas",e); }
  if(curView!=="board"||sess) return;
  const mine=obj(BOARD.docs[CLOUD.uid]);
  const nameOf=r=>r.nick||(ps[r.id]&&ps[r.id].name)||"Någon";
  const win=rows.filter(r=>r.prev>0).sort((a,b)=>b.prev-a.prev)[0];
  // Tidigare veckors vinnare, från varje persons veckohistorik (alla språk ihop)
  const byWeek={};
  Object.entries(BOARD.docs).forEach(([id,d])=>Object.values(obj(obj(d).langs)).forEach(x=>Object.entries(obj(obj(x).hist)).forEach(([wk,m])=>{
    if(!Number.isFinite(+wk)||+wk>=pw||!num(m)) return; const o=byWeek[+wk]=byWeek[+wk]||{}; o[id]=(o[id]||0)+num(m);})));
  const hist=Object.keys(byWeek).map(Number).sort((a,b)=>b-a).slice(0,5).map(wk=>{
    const [id,m]=Object.entries(byWeek[wk]).sort((a,b)=>b[1]-a[1])[0]; return {wk,id,m};});
  const wkLabel=wk=>{const d=new Date(wk); return `v. ${isoWeek(d)}`;};
  app.innerHTML=`<section class="panel"><h2>Topplista den här veckan</h2>
    <p class="plan">Minuter och frågor sedan måndag, i alla språk. Dagar i rad räknas om man övar varje dag.</p>
    ${win?`<p class="winner">Förra veckan vann <b>${esc(nameOf(win))}</b> med ${esc(win.prev)} minuter.</p>`:""}
    ${rows.length?`<ol class="board">${rows.map((r,i)=>`<li class="brow${r.id===CLOUD.uid?" me":""}">
      <span class="rank">${i+1}</span>
      <span class="who"><b>${esc(nameOf(r))}${r.id===CLOUD.uid?" (du)":""}</b><small>${esc(r.langs.join(", "))}${r.goals.length&&r.goals.every(Boolean)?" · veckomålet klart ✓":""}</small></span>
      <span class="num"><b>${esc(r.min)}</b><small>min</small></span>
      <span class="num"><b>${esc(r.q)}</b><small>frågor</small></span>
      <span class="num"><b>${esc(r.streak)}</b><small>dagar i rad</small></span></li>`).join("")}</ol>`
      :`<p class="plan">Ingen har övat än den här veckan.</p>`}
  </section>
  ${hist.length?`<section class="panel"><h2>Tidigare veckor</h2><ul class="missed">${hist.map(h=>`<li><span>${esc(wkLabel(h.wk))}</span><span><b>${esc(nameOf({id:h.id,nick:nickOf(obj(BOARD.docs[h.id]))}))}</b> · ${esc(h.m)} min</span></li>`).join("")}</ul></section>`:""}
  <section class="panel"><h2>Ditt namn i topplistan</h2>
    <form id="nickf" class="nick" autocomplete="off"><input class="search" id="nick" maxlength="24" placeholder="Till exempel Kalle" value="${esc(nickOf(mine))}"><button class="btn" style="width:auto">Spara</button></form>
    <p class="foot" id="nickmsg">${esc(BOARD.msg||"Namnet syns för alla som har tillgång till glosprogrammet.")}</p></section>`;
  // "Sparat." bara när sparningen faktiskt gick
  $("#nickf").onsubmit=e=>{e.preventDefault(); $("#nickmsg").textContent="Sparar …";
    boardPush($("#nick").value.trim().slice(0,24)).then(ok=>{ BOARD.msg=ok?"Sparat.":"Namnet kunde inte sparas. Kontrollera att du är inloggad och försök igen.";
      const m=$("#nickmsg"); if(m) m.textContent=BOARD.msg; });};
}

/* ---------- Pass: lära ---------- */
let sess=null, curView="ova", SET_OPEN=false;
/* Tillbaka till sidan man kom ifrån: en övning som öppnas från en annan sida än sin egen lista (studieplanen, en
   provuppgift från skrivsidan) öppnas med openFrom(sida, öppna, etikett). Då leder Tillbaka i övningen (backTo(listan)),
   Avbryt i ett pass (pauseSession) och slutskärmens Startsidan-knapp (backHome, med etiketten) dit i stället.
   Nollställs på startsidan och på övningarnas listor (pickerScreen, openWriting, openExam). */
let RETURN_TO=null, RETURN_LABEL="";
function openFrom(page,go,label){ RETURN_TO=page; RETURN_LABEL=label||"Tillbaka"; go(); }
const backTo=fb=>()=>{ stopSpeech(); (RETURN_TO||fb)(); };
function backHome(){ const f=RETURN_TO, b=f&&app.querySelector("#home,#kthome"); if(b){ b.textContent=RETURN_LABEL; b.onclick=()=>{ stopSpeech(); f(); }; } }

/* Ett pågående pass sparas efter varje svar, så att det går att fortsätta om appen stängs */
function snapRun(){
  if(!sess) return;
  const it=q=>({k:q.k,id:q.id,ref:q.ref||q.w.id,w:q.w&&q.w.id,t:q.t,isNew:q.isNew,again:!!q.again,canType:!!q.canType,noRetry:!!q.noRetry,tenses:q.tenses});
  const pending=sess.cur&&!sess.answered?[sess.cur]:[];
  S.run={kind:sess.kind,learn:!sess.queue,i:sess.i||0,
    newW:(sess.newW||[]).map(w=>w.id),due:(sess.due||[]).map(w=>w.id),extra:!!sess.extra,game:sess.game?sess.game.id:null,
    queue:sess.queue?[...pending,...sess.queue].map(it):null,total:sess.total||0,done:sess.done||0,
    firstTry:sess.firstTry||{},firstType:sess.firstType||{},tries:sess.tries||{},start:sess.start,
    ...(sess.rate&&Object.keys(sess.rate).length?{rate:sess.rate}:{}),
    ctx:sess.ctx||null,againFn:sess.againFn||null,label:sess.label||"",daily:!!sess.daily,gramMix:!!sess.gramMix};
  const k=runKey(sess); if(k){ S.runs=S.runs||{}; S.runs[k]=S.run; }
  save();
}
// Varje övning har sin egen påbörjade runda, så man kan välja att fortsätta eller börja om när man öppnar den igen.
// Glospasset har också en egen plats ("words", extraövningen "words|extra"), så att det finns kvar efter en annan övning.
const runKey=r=>!r?null:r.kind==="words"?(r.extra?"words|extra":"words"):(r.againFn?r.againFn.join("|"):r.kind+"|"+((r.ctx&&r.ctx.id)||""));
function dropRun(r){ const k=runKey(r); if(k&&S.runs) delete S.runs[k]; }
function quitSession(){ dropRun(S.run); sess=null; delete S.run; save(); renderStart(); }
// Avbryt mitt i en övning: rundan sparas och kan fortsättas senare
function pauseSession(){ stopSpeech(); sess=null; (RETURN_TO||renderStart)(); }
function runLabel(r){
  if(r.label) return `${r.label}, ${r.done} av ${r.total} frågor klara.`;
  if(r.kind==="verbs"){const g=verbGames().find(x=>x.id===r.game);return `Verb: ${g?g.name:""}, ${r.done} av ${r.total} frågor klara.`}
  if(r.kind==="cloze") return `Meningar, ${r.done} av ${r.total} klara.`;
  if(r.learn) return `Nya ord, du var på ord ${r.i+1} av ${r.newW.length}.`;
  return `${r.extra?"Extraövning":`Pass ${S.pass}`}, ${r.done} av ${r.total} frågor klara.`;
}
function resumeRun(){
  const r=S.run; if(!r) return;
  const item=q=>{
    const k=q.k||r.kind;
    const K=KINDS[k]; if(K&&K.restore){const x=K.restore(q.ref); return x?{...q,...x,k}:null}
    const w=byId[q.w]; return w?{...q,w}:null;
  };
  $("#tabs").hidden=true;
  sess={kind:r.kind,i:r.i,newW:r.newW.map(id=>byId[id]).filter(Boolean),due:r.due.map(id=>byId[id]).filter(Boolean),extra:r.extra,start:r.start||Date.now(),
    ctx:r.ctx||null,againFn:r.againFn||null,label:r.label||"",daily:!!r.daily,
    // gramMix finns i S.run sedan 2026-09-30; en blandad grammatikrunda sparad före det känns igen på againFn
    gramMix:!!r.gramMix||(r.kind==="gram"&&!!r.againFn&&r.againFn[1]==="mix")};
  if(r.kind==="verbs"){const g=verbGames().find(x=>x.id===r.game)||verbGames()[0]; Object.assign(sess,{game:g,tenses:g.tenses});}
  if(r.learn){ if(!sess.newW.length) return quitSession(); sess.i=Math.min(sess.i,sess.newW.length-1); return renderLearn(); }
  Object.assign(sess,{queue:(r.queue||[]).map(item).filter(Boolean),total:r.total,done:r.done,firstTry:r.firstTry||{},firstType:r.firstType||{},tries:r.tries||{},rate:r.rate||{}});
  nextQ();
}
/* Glosquizet (startSession, renderLearn, startQuiz, finishSession …) ligger i src/kinds/05-words.js */

/* ---------- Quizmotor (ord, verb och meningar) ----------
   Varje fråga är flerval (t:"mc") eller skriva (t:"type").
   Fel svar: frågan kommer tillbaka som flerval i slutet av övningen.
   Rätt på det flervalet: tillbaka som skrivfråga igen, om frågan var en skrivfråga från början (canType).
   Bara första svaret per ord räknas för repetitionsschemat och statistiken. */
const MAX_AGAIN=4;   // max antal extra frågor per ord och övning
/* beginQuiz(typ, frågor, opts) startar en ny runda med ett nytt sess. Allt som rundan ska ha med sig står i opts:
   label, ctx, againFn, daily (rundan hör till Dagens pass), gramMix (blandad grammatik, räknas i S.gt.mix),
   game/tenses (verben), och för glosquizet newW, due, i, extra och start (från lärokorten, se startQuiz).
   fresh = börja om fast det finns en påbörjad runda. Inget tas med från ett tidigare sess. */
function beginQuiz(kind,items,extra){
  const k=runKey({kind,...(extra||{})}), old=kind!=="words"&&k&&S.runs&&S.runs[k];
  if(old&&!(extra&&extra.fresh)&&old.done<old.total){
    sess=null; $("#tabs").hidden=true;
    app.innerHTML=`<section class="panel"><h2>${esc(old.label||"Övningen")}</h2>
      <p class="plan">Du har en påbörjad runda: ${old.done} av ${old.total} frågor klara.</p>
      <button class="btn" id="rcont">Fortsätt där du slutade</button><button class="btn ghost" id="rnew">Börja om från början</button></section>
      <button class="quit" id="quit">Tillbaka</button>`;
    $("#rcont").onclick=()=>{S.run=old; resumeRun();};
    $("#rnew").onclick=()=>{delete S.runs[k]; beginQuiz(kind,items,{...extra,fresh:true});};
    $("#quit").onclick=backTo(renderStart); return;
  }
  if(!items.length){   // t.ex. diktamen eller ordföljd innan eleven har lärt sig några ord: ingen tom "0/0 klar"
    sess=null; $("#tabs").hidden=true;
    app.innerHTML=`<section class="panel"><h2>${esc((extra&&extra.label)||"Övningen")}</h2>
      <p class="plan" id="empty">Det finns inga frågor här än. Lär dig några ord i glosquizet först, så kommer det meningar och frågor att öva på.</p></section>
      <button class="quit" id="quit">Tillbaka</button>`;
    $("#quit").onclick=backTo(renderStart); return;
  }
  const {fresh,...opts}=extra||{};
  sess={...opts,kind,queue:items,total:items.length,done:0,firstTry:{},firstType:{},tries:{},start:opts.start||Date.now(),daily:!!opts.daily,gramMix:!!opts.gramMix};
  nextQ();
}
function nextQ(){
  sess.cur=sess.queue.shift();
  if(!sess.cur) return sess.kind==="words"?finishSession():finishGeneric();
  sess.answered=false;
  const K=KINDS[sess.cur.k||sess.kind], d=(sess.cur.t==="mc"?K.mc:K.type)(sess.cur);
  sess.d=d;
  if(sess.cur.t==="mc") renderMC(d); else if(d.render) d.render(d); else renderType(d);
  snapRun();
}
function progressHead(){
  const c=sess.cur;
  const pill=(c.again?'<span class="pill again">igen</span>':c.isNew===undefined?"":c.isNew?'<span class="pill new">nytt ord</span>':'<span class="pill rep">repetition</span>')
    +(c.isNew===false&&isLeech(c.w)?' <span class="pill again">svårt ord</span>':"");
  return `<div class="meta"><span>Quiz ${pill}</span><span>${Math.min(sess.done+1,sess.total)} / ${sess.total}</span></div>
    <div class="bar"><i style="width:${(sess.done/sess.total)*100}%"></i></div>`;
}
const quitBtn=()=>`<button class="quit" id="quit">${sess.kind==="words"?"Avbryt passet":"Avbryt"}</button>`;
const itemId=c=>c.id||c.w.id;
function record(ok){
  const c=sess.cur, id=itemId(c);
  if(!(id in sess.firstTry)){ sess.firstTry[id]=ok; sess.firstType[id]=c.t; }
  const next=c.noRetry?null:!ok?"mc":(c.again&&c.t==="mc"&&c.canType)?"type":null;
  if(next&&(sess.tries[id]||0)<MAX_AGAIN){
    sess.tries[id]=(sess.tries[id]||0)+1; sess.queue.push({...c,t:next,again:true}); sess.total++;
    return next;
  }
  return null;
}
function unrecord(){ // "Jag hade rätt"
  const c=sess.cur, id=itemId(c);
  if(!c.again) sess.firstTry[id]=true;
  const k=sess.queue.findIndex(q=>itemId(q)===id);
  if(k>=0){sess.queue.splice(k,1);sess.total--;}
}
const backMsg=(ok,back)=>!back?"":`<p id="back">${ok
  ?"Bra! Nu kommer det tillbaka som skrivfråga i slutet."
  :"Det kommer tillbaka som flerval i slutet."}</p>`;

function renderMC(d){
  app.innerHTML=`<section class="panel">${d.tab?`<span class="tab">${esc(d.tab)}</span>`:""}${progressHead()}
    ${d.head}
    <p class="q-ask">${d.ask}</p>
    <div class="opts">${d.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span ${o.lang?lang():""}>${esc(o.label)}</span></button>`).join("")}</div>
    <div id="fb"></div></section>
    ${quitBtn()}`;
  if($("#sp")) $("#sp").onclick=()=>speak(d.say);
  if(d.wire) d.wire(d);
  app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answerMC(+b.dataset.i));
  $("#quit").onclick=pauseSession;
  if(d.sayOnShow) speak(d.say);
}
function answerMC(i){
  if(sess.answered) return; sess.answered=true;
  const d=sess.d, ok=d.opts[i].ok;
  app.querySelectorAll(".opt").forEach((b,k)=>{b.disabled=true; if(d.opts[k].ok)b.classList.add("right"); else if(k===i)b.classList.add("wrong");});
  const back=record(ok); sess.done++; snapRun();
  $("#fb").innerHTML=`<div class="feedback ${ok?"ok":"bad"}"><strong>${ok?"Rätt!":"Inte riktigt."}</strong>
    ${backMsg(ok,back)}${!ok&&d.wrongCard?d.wrongCard:d.explain}${reportBtn()}</div>
    <button class="btn" id="nx" style="margin-top:12px">Nästa</button>`;
  if(d.onAnswer) d.onAnswer(ok);
  if(d.sayOnAnswer) speak(d.say);
  $("#nx").onclick=nextQ; $("#nx").focus();
}
function renderType(d){
  app.innerHTML=`<section class="panel">${d.tab?`<span class="tab">${esc(d.tab)}</span>`:""}${progressHead()}
    ${d.head}
    <p class="q-ask">${d.ask}</p>
    <form id="f" autocomplete="off"><input class="answer-in" id="ans" ${lang()} autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${d.placeholder}"></form>
    ${accentKeys(d.accents)}
    <div id="fb"></div>
    <button class="btn" id="submit">Svara</button></section>
    ${quitBtn()}`;
  $("#quit").onclick=pauseSession;
  wireTyping(answerType);
  if(d.wire) d.wire(d);
  if(d.autoplay) speak(d.say);
}
function wireTyping(onSubmit){
  const inp=$("#ans"); setTimeout(()=>{try{inp.focus()}catch(e){ /* rutan kan redan vara borta */ }},50);
  // Medan eleven bedömer sig själv (selfGrade) går Enter inte vidare, annars hoppas frågan över utan att räknas
  $("#f").onsubmit=e=>{e.preventDefault(); if(sess.grading) return; if(!sess.answered) onSubmit(); else nextQ();};
  const hideAcc=()=>{if(sess&&sess.answered){const a=app.querySelector(".accents");if(a)a.hidden=true}};
  $("#f").addEventListener("submit",hideAcc); $("#submit").addEventListener("click",hideAcc);
  $("#submit").onclick=()=>{ if(sess.grading) return; if(!sess.answered) onSubmit(); else nextQ(); };
  app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
    const s=inp.selectionStart??inp.value.length, e2=inp.selectionEnd??inp.value.length;
    inp.value=inp.value.slice(0,s)+b.dataset.c+inp.value.slice(e2); inp.focus(); inp.setSelectionRange(s+1,s+1);
  });
}
function answerType(){
  const d=sess.d, inp=$("#ans"), res=d.check?d.check(inp.value):{r:check(inp.value,d.accepted,d.strip)};
  if(res.r==="empty") return;
  sess.answered=true; inp.readOnly=true;
  if(d.selfGrade&&res.r!=="right"&&res.r!=="accent") return selfGrade(d,res,inp);
  showTypeResult(d,res,inp);
}
// Facit: d.answer är alltid ren text och escapas här, på ett ställe. En typ som vill visa facit med formatering
// (t.ex. IPA i en egen stil) sätter dessutom d.answerHtml och ansvarar själv för att den är escapad.
const answerHtml=d=>d.answerHtml!=null?d.answerHtml:esc(d.answer);
// Svar som inte kan rättas automatiskt: eleven jämför med facit och bedömer själv
function selfGrade(d,res,inp){
  sess.grading=true; try{inp.blur()}catch(e){ /* rutan kan redan vara borta */ }   // siffrorna 1–3 väljer Fel/Nästan/Rätt (tangenterna gäller inte i textrutan)
  $("#submit").hidden=true; const a=app.querySelector(".accents"); if(a) a.hidden=true;
  $("#fb").innerHTML=`<div class="feedback near"><strong>Jämför med facit</strong>
    <p>Facit: <b ${lang()}>${answerHtml(d)}</b></p>${res.html||""}
    <p>Hur nära var du? Små skillnader i ordval kan också vara rätt.</p>
    <div class="grade"><button type="button" class="btn ghost" data-gr="wrong">Fel</button><button type="button" class="btn ghost" data-gr="near">Nästan</button><button type="button" class="btn" data-gr="right">Rätt</button></div></div>`;
  speak(d.say);
  app.querySelectorAll("[data-gr]").forEach(b=>b.onclick=()=>{ $("#submit").hidden=false;
    showTypeResult(d,{r:b.dataset.gr==="right"?"right":"wrong",self:b.dataset.gr,html:res.html},inp); });
}
function showTypeResult(d,res,inp){
  const r=res.r, ok=r==="right"||r==="accent";
  sess.grading=false;
  if(inp) inp.classList.add(ok?"right":"wrong");
  const back=record(ok); sess.done++; snapRun();
  const msg=res.self?{right:"Bra!",near:"Nästan. Den kommer tillbaka så att du får öva mer.",wrong:"Den kommer tillbaka så att du får öva mer."}[res.self]
    :{right:"Rätt!",accent:"Rätt, men titta på accenterna.",near:d.nearMsg||"Nästan! Ett stavfel.",wrong:"Inte riktigt."}[r];
  $("#fb").innerHTML=`<div class="feedback ${r==="right"?"ok":r==="wrong"&&res.self!=="near"?"bad":"near"}"><strong>${msg}</strong>
    ${(r==="right"&&!d.alwaysAnswer)||res.self?"":`<p>Rätt svar: <b ${lang()}>${answerHtml(d)}</b></p>`}${res.self?"":res.html||""}${backMsg(ok,back)}${!ok&&d.wrongCard?d.wrongCard:d.explain}
    ${!ok&&d.override&&!res.self?`<button class="override" id="ovr">Jag hade rätt</button>`:""}${reportBtn()}</div>`;
  $("#submit").textContent="Nästa"; $("#submit").focus();
  if(d.onAnswer) d.onAnswer(ok);
  if(!res.self) speak(d.say);
  if($("#ovr")) $("#ovr").onclick=()=>{unrecord();snapRun();if($("#back"))$("#back").remove();$("#ovr").outerHTML="<p><b>Okej, räknas som rätt.</b></p>";inp.classList.remove("wrong");inp.classList.add("right")};
}
/* "Fel i frågan?": eleven kan rapportera ett felaktigt facit eller en konstig mening.
   Rapporterna sparas i reports/<uid>/items/<tid> i artefaktens db (privat för eleven, läses av föräldern) (läses av föräldern eller Claude), annars i S.reports. */
const reportBtn=()=>`<button type="button" class="override" data-report>Fel i frågan? Rapportera</button>`;
async function sendReport(btn){
  const c=sess&&sess.cur, d=sess&&sess.d; if(!c||btn.disabled) return;
  const r={lang:L.code,id:itemId(c),kind:c.k||sess.kind,t:c.t,answer:String((d&&d.answer)||""),d:Date.now(),pass:S.pass};
  btn.disabled=true; btn.textContent="Skickar …";
  let ok=false;
  if(CLOUD.db&&CLOUD.uid){ try{ await CLOUD.db.doc(`reports/${CLOUD.uid}/items/${r.d}`).set({...r,uid:CLOUD.uid}); ok=true; }catch(e){ warnErr("felrapporten kunde inte skickas, sparas till senare",e); } }
  if(!ok){ S.reports=(S.reports||[]).slice(-(UNSENT_MAX-1)); S.reports.push(r); save(); }
  btn.textContent="Tack! Frågan är rapporterad och blir kontrollerad.";
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-report]"); if(b) sendReport(b);});
/* Tangentbordet: siffror väljer svar i flerval (och Fel/Nästan/Rätt vid självbedömning, Igen/Svårt/Bra/Lätt i
   glosquizet när S.selfRate är på), mellanslag eller
   Enter går till nästa ord när man lär sig nya ord, pilarna bläddrar, och Enter går alltid vidare efter ett svar. */
document.addEventListener("keydown",e=>{
  const tg=e.target&&e.target.matches?e.target:document.body;
  if(e.ctrlKey||e.metaKey||e.altKey||tg.matches("input,textarea,select")) return;
  const click=sel=>{const b=app.querySelector(sel); if(b&&!b.disabled&&!b.hidden&&b.offsetParent!==null){e.preventDefault(); b.click(); return true;} return false;};
  const n=+e.key;
  if(n>=1&&n<=9){
    if(sess&&sess.cur&&sess.d&&sess.cur.t==="mc"&&!sess.answered&&n<=sess.d.opts.length){ e.preventDefault(); answerMC(n-1); return; }
    const gr=app.querySelectorAll("[data-gr],[data-sh],[data-rate]"); if(gr[n-1]){ e.preventDefault(); gr[n-1].click(); return; }
    return;
  }
  const onBtn=tg.matches("button,a,summary");
  if(e.key===" "&&!onBtn){ click("#next")||click("#show"); return; }   // #show: "Lyssna först" visar ordet
  if(e.key==="ArrowRight"){ click("#next"); return; }
  if(e.key==="ArrowLeft"){ click("#prev"); return; }
  if(e.key==="Enter"&&!onBtn) click("#next")||click("#show")||click("#nx")||(sess&&sess.answered&&click("#submit"))||click("#exnext");
});

document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-say]"); if(b) speak(b.dataset.say);});
/* ---------- Övningstyperna: ett register ----------
   Varje typ av fråga eller övning registrerar sig med defineKind(namn, {...}) i src/kinds/*.js
   (glosquizet i 05-words.js). Quizmotorn slår upp typen i KINDS med frågans k (eller passets kind). Fälten (alla valfria utom name):
     name     namnet i statistiken
     mc       c => flervalsfrågan {head, ask, opts, explain, …} (se renderMC)
     type     c => skrivfrågan {head, ask, accepted | check, answer, …}, eller {render} för en egen vy (se renderType)
     restore  ref => fälten som frågan behöver när ett avbrutet pass fortsätts, eller null om frågan inte finns längre
              (glosquizet återskapas direkt ur ordlistan i resumeRun)
     effect   (ref, ok) => vad första svaret gör med sparad statistik
     recap    ref => texten i listan "Titta på de här en gång till"
     after    (ctx, right, total, miss) => egen slutskärm, när passets ctx.type är typens namn
     again    (arg) => "En runda till" (passets againFn = [namn, arg])
     open     () => öppnar övningen från menyn (knappen data-ex="<namn>")
     log      (e, sess) => egna fält i loggposten; utan log får posten kind: namn
   Fråge-id är "<typ>:<ref>", så att typerna kan blandas i Dagens pass. Namnen är nycklar i sparade pass (S.run,
   S.runs) och i loggen, så de får inte bytas. */
const KINDS={}, KIND_FIELDS=["name","mc","type","restore","effect","recap","after","again","open","log"], KIND_ERRORS=[];
function defineKind(name,def){
  // Fel här stoppar inte appen (eleverna ska kunna öva ändå), men testerna kräver att KIND_ERRORS är tom
  const k=KINDS[name]||(KINDS[name]={});
  Object.keys(def).forEach(f=>{
    if(!KIND_FIELDS.includes(f)) KIND_ERRORS.push(`${name}: okänt fält ${f}`);
    else if(f in k) KIND_ERRORS.push(`${name}: ${f} finns redan`);
    else if(f==="name"?typeof def[f]!=="string":typeof def[f]!=="function") KIND_ERRORS.push(`${name}: ${f} har fel typ`);
    else k[f]=def[f];
  });
  return k;
}
// MC, TYPE, RESTORE … som före registret: vyer över KINDS, bara för läsning (MC.dict är KINDS.dict.mc)
const kindView=f=>new Proxy({},{get:(_,n)=>KINDS[n]?KINDS[n][f]:undefined,has:(_,n)=>!!(KINDS[n]&&KINDS[n][f]),
  ownKeys:()=>Object.keys(KINDS).filter(n=>KINDS[n][f]),
  getOwnPropertyDescriptor:(_,n)=>KINDS[n]&&KINDS[n][f]?{value:KINDS[n][f],enumerable:true,configurable:true}:undefined,
  set:(_,n)=>{KIND_ERRORS.push(`${f}.${String(n)} sattes direkt, använd defineKind`); return true;}});
const MC=kindView("mc"), TYPE=kindView("type"), RESTORE=kindView("restore"), EFFECT=kindView("effect"), RECAP=kindView("recap"),
  AFTER=kindView("after"), AGAIN=kindView("again"), KIND_NAMES=kindView("name");

/* Glosquizet (startSession, renderLearn, finishSession …) finns i src/kinds/05-words.js, verbträning (startVerbs) och
   meningar (startCloze) i src/kinds/10-verbs.js och 11-sentences.js */
/* ---------- Ordlista ---------- */
/* Prognos: hur många ord som ska repeteras i nästa pass och de kommande dagarna */
function statsForecast(){
  const t0=Date.now(), xs=WORDS.map(w=>ws(w.id)).filter(Boolean);
  const rows=[{l:"nästa",n:xs.filter(isDue).length}];
  for(let i=1;i<=6;i++){ const a=addDays(t0,i), b=addDays(t0,i+1); rows.push({l:i===1?"i morgon":"+"+i+" d",n:xs.filter(x=>x.dd&&x.dd>=a&&x.dd<b).length}); }
  const soon=xs.filter(x=>!x.dd&&x.due>S.pass).length;
  if(!rows.some(r=>r.n)&&!soon) return "";
  const max=Math.max(...rows.map(r=>r.n),1);
  return `<section class="panel"><h2>Kommande repetitioner</h2>
    <div class="fc">${rows.map(r=>`<div class="fc-col"><span class="fc-n">${r.n}</span><span class="fc-bar" style="height:${Math.round(4+56*r.n/max)}px"></span><span class="fc-l">${r.l}</span></div>`).join("")}</div>
    <p class="plan">Nya ord kommer tillbaka nästa pass och sedan efter tre pass${soon?` (${soon} ord väntar på det)`:""}. Därefter efter 3, 7 och 20 dagar, och ord du kan efter 45 och 90 dagar. Högst ${MAXDUE} repetitioner per pass, resten väntar till passet efter.</p></section>`;
}
const courseName=()=>S&&S.gy25&&L.courseGy25?L.courseGy25:(L.course||L.name);
function renderList(){
  const q=($("#search").value||"").toLowerCase().trim();
  $("#list-count").textContent=`${WORDS.length} ord`;
  if(!$("#list").open) return;
  let html="";
  SECTIONS.forEach(s=>{
    const rows=WORDS.filter(w=>w.sec===s.id&&(!q||w.t.toLowerCase().includes(q)||w.sv.toLowerCase().includes(q)));
    if(!rows.length)return;
    html+=`<div class="sec">${esc(s.name)}</div>`+rows.map(w=>{
      const x=ws(w.id); const st=x?(x.s>=4?4:x.s+1):0;
      const lab=!x?"Inte lärt än":x.s>=4?"Kan":`Steg ${x.s+1} av 4`;
      return `<div class="lrow"><span class="t" ${lang()}>${esc(w.t)}</span><span class="sv">${esc(w.sv)}</span><span class="dots ${x&&x.s>=4?"done":""}" title="${lab}" aria-label="${lab}">${[1,2,3,4].map(i=>`<i class="${i<=st?"on":""}"></i>`).join("")}</span>${w.sec==="mine"?`<button type="button" class="rm" data-rm="${esc(w.id)}" aria-label="Ta bort ${esc(w.t)} från Mina ord">Ta bort</button>`:""}</div>`;
    }).join("");
  });
  $("#rows").innerHTML=html||`<p class="foot">Inga ord matchar "${esc(q)}".</p>`;
  // Två tryck för att ta bort, så att ingen tar bort ett ord av misstag
  $("#rows").querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{
    if(b.dataset.sure){ removeMine(b.dataset.rm); renderList(); } else { b.dataset.sure="1"; b.textContent="Säker?"; b.classList.add("sure"); }
  });
}
$("#search").addEventListener("input",renderList);
$("#list").addEventListener("toggle",renderList);

/* ---------- Vyer ---------- */
const tabSel=v=>["ova","stats","board","fb"].forEach(t=>$("#tab-"+t).setAttribute("aria-selected",t===v));
function setView(v){
  curView=["stats","board","fb"].includes(v)?v:"ova";
  $("#tabs").hidden=false;
  tabSel(curView);
  if(curView==="board") BOARD.msg="";
  if(curView==="stats") renderStats(); else if(curView==="board") renderBoard(); else if(curView==="fb") renderTyckTill(); else renderStart();
  window.scrollTo(0,0);
}
$("#tab-ova").onclick=()=>setView("ova");
$("#tab-stats").onclick=()=>setView("stats");
$("#tab-board").onclick=()=>setView("board");
$("#tab-fb").onclick=()=>setView("fb");

/* ---------- Statistik ---------- */
const pct=(r,n)=>n?Math.round(100*r/n):null;
const fmtMin=s=>s<3600?`${Math.max(1,Math.round(s/60))} min`:`${Math.floor(s/3600)} h ${Math.round((s%3600)/60)} min`;
function niceMax(v){if(v<=5)return 5;const p=Math.pow(10,Math.floor(Math.log10(v)));for(const m of [1,1.5,2,2.5,3,4,5,6,8,10])if(m*p>=v)return m*p;return v}

function lineChart(labels,series,yMax){
  const W=600,H=280,ml=48,mr=130,mt=16,mb=38,iw=W-ml-mr,ih=H-mt-mb,n=labels.length;
  yMax=niceMax(yMax||1);
  const x=i=>ml+(n===1?iw/2:i*iw/(n-1)), y=v=>mt+ih-(v/yMax)*ih;
  let g="";
  for(let k=0;k<=4;k++){const v=yMax*k/4, yy=y(v);g+=`<line class="gl" x1="${ml}" x2="${W-mr}" y1="${yy}" y2="${yy}"/><text x="${ml-10}" y="${yy+6}" text-anchor="end">${Math.round(v)}</text>`;}
  const step=Math.max(1,Math.ceil(n/6));
  labels.forEach((l,i)=>{if(i%step===0||i===n-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle">${l}</text>`});
  series.forEach(s=>{
    const pts=s.values.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
    g+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    const li=n-1, lv=s.values[li];
    g+=`<circle cx="${x(li)}" cy="${y(lv)}" r="4.5" fill="${s.color}" stroke="var(--surface)" stroke-width="2"/>`;
  });
  // direkta etiketter vid slutpunkterna, isärflyttade om de krockar
  const ends=series.map(s=>({s,yy:y(s.values[n-1])})).sort((a,b)=>a.yy-b.yy);
  for(let i=1;i<ends.length;i++) if(ends[i].yy-ends[i-1].yy<24) ends[i].yy=ends[i-1].yy+24;
  ends.forEach(e=>g+=`<text x="${x(n-1)+10}" y="${e.yy+4}" style="fill:var(--ink);font-weight:600">${e.s.values[n-1]} ${e.s.short}</text>`);
  // hover-kolumner
  labels.forEach((l,i)=>{const w=n===1?iw:iw/(n-1);
    g+=`<rect x="${x(i)-w/2}" y="${mt}" width="${w}" height="${ih}" fill="transparent" data-tip="Pass ${l}: ${series.map(s=>`${s.values[i]} ${s.name.toLowerCase()}`).join(", ")}"/>`});
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Linjediagram">${g}</svg>`;
}
function barChart(items){ // items: {label, value(0-100), tip}
  const W=600,H=240,ml=62,mr=8,mt=14,mb=36,iw=W-ml-mr,ih=H-mt-mb,n=items.length;
  const bw=Math.min(36,iw/n-4), y=v=>mt+ih-(v/100)*ih;
  let g="";
  [0,50,100].forEach(v=>g+=`<line class="gl" x1="${ml}" x2="${W-mr}" y1="${y(v)}" y2="${y(v)}"/><text x="${ml-10}" y="${y(v)+6}" text-anchor="end">${v}%</text>`);
  const step=Math.max(1,Math.ceil(n/8));
  items.forEach((it,i)=>{
    const cx=ml+(i+.5)*iw/n, h=Math.max(2,ih*it.value/100), top=mt+ih-h, r=Math.min(4,bw/2,h);
    g+=`<path d="M${cx-bw/2},${mt+ih} V${top+r} Q${cx-bw/2},${top} ${cx-bw/2+r},${top} H${cx+bw/2-r} Q${cx+bw/2},${top} ${cx+bw/2},${top+r} V${mt+ih} Z" fill="var(--c2)"/>`;
    g+=`<rect x="${cx-iw/n/2}" y="${mt}" width="${iw/n}" height="${ih}" fill="transparent" data-tip="${esc(it.tip)}"/>`;
    if(i%step===0||i===n-1) g+=`<text x="${cx}" y="${H-8}" text-anchor="middle">${it.label}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Stapeldiagram">${g}</svg>`;
}
function meter(label,r,n,color){
  const p=pct(r,n);
  return `<div class="meter"><div class="meter-top"><span>${label}</span><span>${p===null?"inga svar än":`${p}% · ${r} av ${n}`}</span></div>
    <div class="track" data-tip="${esc(label)}: ${p===null?"inga svar":p+"% rätt"}"><i style="width:${p||0}%;background:${color||"var(--c2)"}"></i></div></div>`;
}

function renderStats(){
  const logs=S.log, wl=logs.filter(l=>!l.verb&&!l.cloze&&!l.kind), passes=wl.filter(l=>!l.extra), vl=logs.filter(l=>l.verb), cl=logs.filter(l=>l.cloze);
  if(!logs.length){
    app.innerHTML=`<section class="panel"><h2>Statistik</h2><p class="sub">Här ser du hur det går när du har kört ditt första pass: hur många ord du lärt dig, hur snabbt det går, om du kan orden åt båda hållen och vilka ord som behöver mer övning.</p>
      <button class="btn" id="go1">Kör första passet</button></section>${statsLevel()}`;
    $("#go1").onclick=()=>setView("ova"); return;
  }
  const old=S.logOld||{dur:0,days:0,lastDay:""};
  const time=logs.reduce((a,l)=>a+(l.dur||0),0)+old.dur;
  const learned=WORDS.filter(isLearned), mastered=WORDS.filter(isMastered);
  const R=wl.reduce((a,l)=>a+l.right,0), N=wl.reduce((a,l)=>a+l.total,0);
  const daySet=new Set(logs.map(l=>new Date(l.d).toDateString())), days=daySet.size+old.days-(daySet.has(old.lastDay)?1:0);
  const week=Date.now()-7*864e5;
  const newWeek=learned.filter(w=>(ws(w.id).ld||0)>=week).length;
  const avgNew=passes.length?passes.reduce((a,l)=>a+l.nNew,0)/passes.length:0;
  const avgMin=passes.length?passes.reduce((a,l)=>a+l.dur,0)/passes.length/60:0;
  const mp=mastered.map(w=>ws(w.id)).filter(x=>x.mp&&x.lp).map(x=>x.mp-x.lp);
  const avgToMaster=mp.length?(mp.reduce((a,b)=>a+b,0)/mp.length):null;

  // Riktning
  let mcR=0,mcN=0,tyR=0,tyN=0; learned.forEach(w=>{const x=ws(w.id);mcR+=x.mcR||0;mcN+=(x.mcR||0)+(x.mcW||0);tyR+=x.tyR||0;tyN+=(x.tyR||0)+(x.tyW||0)});
  const clR=cl.reduce((a,l)=>a+l.right,0), clN=cl.reduce((a,l)=>a+l.total,0);
  const onMc=learned.filter(w=>!isMastered(w)&&(ws(w.id).f||"mc")==="mc").length;
  const onTy=learned.filter(w=>!isMastered(w)&&ws(w.id).f==="type").length;
  const pm=pct(mcR,mcN), pt=pct(tyR,tyN);
  let dirInsight="";
  if(pm!==null&&pt!==null){
    dirInsight = pm-pt>=15?`Du känner igen orden mycket bättre än du kan skriva dem (${pm}% mot ${pt}%). Lägg extra tid på att skriva orden ${L.inLang}.`
      : pt-pm>=10?`Du skriver orden bra. Flervalsfrågorna går sämre, så läs exempelmeningarna noga.`
      : `Du kan orden ungefär lika bra åt båda hållen.`;
  } else if(pm!==null) dirInsight="Du har bara svarat på flervalsfrågor än. Ord du klarar kommer tillbaka som skrivfrågor.";

  // Kurvor
  const P=S.pass-1, labels=[], started=[], done=[];
  for(let p=1;p<=P;p++){labels.push(p);started.push(learned.filter(w=>ws(w.id).lp<=p).length);done.push(mastered.filter(w=>(ws(w.id).mp||1e9)<=p).length);}
  const recent=passes.slice(-20);

  // Svåra ord
  const hard=learned.map(w=>{const x=ws(w.id);return {w,x,err:(x.mcW||0)+(x.tyW||0)+(x.clW||0),tot:(x.mcR||0)+(x.mcW||0)+(x.tyR||0)+(x.tyW||0)+(x.clR||0)+(x.clW||0)}})
    .filter(h=>h.err>0).sort((a,b)=>b.err-a.err||(b.err/b.tot)-(a.err/a.tot)).slice(0,10);

  // Avsnitt
  const secRows=SECTIONS.map(s=>{const ws_=secWords(s.id);const k=ws_.filter(isMastered).length,l=ws_.filter(isLearned).length;
    let r=0,n=0;ws_.filter(isLearned).forEach(w=>{const x=ws(w.id);r+=(x.mcR||0)+(x.tyR||0);n+=(x.mcR||0)+(x.mcW||0)+(x.tyR||0)+(x.tyW||0)});
    return {s,tot:ws_.length,k,v:l-k,rest:ws_.length-l,acc:pct(r,n)}});

  const tenses=L.verbs?Object.keys(L.verbs.tenses).filter(k=>S.vt[k]):[];
  const extraRuns=[vl.length?`kört verbträningen ${vl.length} ${vl.length===1?"gång":"gånger"}`:"",cl.length?`fyllt i meningar ${cl.length} ${cl.length===1?"gång":"gånger"}`:""].filter(Boolean).join(" och ");
  app.innerHTML=`
  <section class="panel">
    <h2>Så långt</h2>
    <div class="stats4">
      <div class="stat"><b>${passes.length}</b><span>pass körda</span></div>
      <div class="stat"><b>${fmtMin(time)}</b><span>övningstid</span></div>
      <div class="stat"><b>${learned.length}</b><span>ord påbörjade av ${WORDS.length}</span></div>
      <div class="stat"><b>${pct(R,N)??"–"}%</b><span>rätt direkt</span></div>
    </div>
    <p class="plan">Du har övat ${days} ${days===1?"dag":"dagar"}${extraRuns?` och ${extraRuns}`:""}${logs.some(l=>l.kind)?` och gjort ${logs.filter(l=>l.kind).length} andra övningar`:""}. <b>${mastered.length}</b> ord räknas som inlärda.</p>
  </section>

  ${statsDaily()}
  ${statsLevel()}

  <section class="panel">
    <h2>Hur fort det går</h2>
    <div class="stats4">
      <div class="stat"><b>${newWeek}</b><span>nya ord senaste 7 dagarna</span></div>
      <div class="stat"><b>${avgNew?avgNew.toFixed(0):"–"}</b><span>nya ord per pass</span></div>
      <div class="stat"><b>${avgMin?Math.max(1,Math.round(avgMin)):"–"}</b><span>minuter per pass</span></div>
      <div class="stat"><b>${avgToMaster!==null?Math.round(avgToMaster):"–"}</b><span>pass tills ett ord sitter</span></div>
    </div>
    ${P>=1?`<div class="legend"><span><i class="sw" style="background:var(--c1)"></i>Påbörjade ord</span><span><i class="sw" style="background:var(--c2)"></i>Inlärda ord</span></div>
    ${lineChart(labels,[{name:"Påbörjade",short:"påbörjade",color:"var(--c1)",values:started},{name:"Inlärda",short:"inlärda",color:"var(--c2)",values:done}],Math.max(...started,1))}
    <p class="foot">Ett ord räknas som inlärt när du har klarat det i fyra repetitioner i rad (nästa pass, efter 3 pass, efter 3 dagar och efter 7 dagar). Därför dröjer den gröna linjen.</p>`:""}
  </section>

  <section class="panel">
    <h2>Åt vilket håll kan du orden?</h2>
    ${meter(`Förstå: ${L.name.toLowerCase()} → svenska (flerval)`,mcR,mcN,"var(--c1)")}
    ${meter(`Skriva: svenska → ${L.name.toLowerCase()}`,tyR,tyN,"var(--c2)")}
    ${meter("Använda: fylla i meningar",clR,clN,"var(--c2)")}
    ${dirInsight?`<p class="insight">${dirInsight}</p>`:""}
    <p class="plan">Just nu övar du <b>${onMc}</b> ord med flerval och <b>${onTy}</b> ord där du skriver själv.</p>
  </section>

  ${recent.length?`<section class="panel">
    <h2>Rätt direkt, pass för pass</h2>
    ${barChart(recent.map(l=>({label:l.p,value:pct(l.right,l.total)||0,tip:`Pass ${l.p}: ${l.right} av ${l.total} rätt direkt (${pct(l.right,l.total)}%), ${fmtMin(l.dur)}`})))}
    <details class="tv"><summary>Visa som tabell</summary><div class="tblwrap"><table class="tbl">
      <tr><th>Pass</th><th>Datum</th><th>Nya</th><th>Repetition</th><th>Rätt</th><th>Tid</th></tr>
      ${passes.slice().reverse().map(l=>`<tr><td>${l.p}</td><td>${new Date(l.d).toLocaleDateString("sv-SE")}</td><td>${l.nNew}</td><td>${l.nRep}</td><td>${pct(l.right,l.total)}%</td><td>${fmtMin(l.dur)}</td></tr>`).join("")}
    </table></div></details>
  </section>`:""}

  <section class="panel">
    <h2>Behöver mer övning</h2>
    ${hard.length?`<div class="hard">${hard.map(h=>{
      const bits=[]; if(h.x.mcW)bits.push(`fel på flerval ${h.x.mcW} ${h.x.mcW===1?"gång":"gånger"}`); if(h.x.tyW)bits.push(`fel när du skrev ${h.x.tyW} ${h.x.tyW===1?"gång":"gånger"}`); if(h.x.clW)bits.push(`fel i meningar ${h.x.clW} ${h.x.clW===1?"gång":"gånger"}`);
      return `<div class="hrow"><span><span class="t" ${lang()}>${esc(h.w.t)}</span> <span class="sub">${esc(h.w.sv)}</span></span><span class="n">${h.err} fel</span><span class="why">${bits.join(" · ")} · ${h.tot} svar totalt</span></div>`}).join("")}</div>
      <button class="btn" id="drill">Öva extra på de här ${hard.length} orden</button>`
    :`<p class="plan">Inga fel än. Snyggt!</p>`}
  </section>

  <section class="panel">
    <h2>Per avsnitt</h2>
    <div class="legend"><span><i class="sw" style="background:var(--c2)"></i>Inlärda</span><span><i class="sw" style="background:var(--c1)"></i>På väg</span><span><i class="sw" style="background:var(--grid)"></i>Inte påbörjade</span></div>
    ${secRows.map(r=>`<div class="meter"><div class="meter-top"><span>${esc(r.s.name)}</span><span>${r.acc===null?"":`${r.acc}% rätt · `}${r.k+r.v}/${r.tot}</span></div>
      <div class="track" data-tip="${esc(r.s.name)}: ${r.k} inlärda, ${r.v} på väg, ${r.rest} inte påbörjade">${r.k?`<i style="width:${100*r.k/r.tot}%;background:var(--c2)"></i>`:""}${r.v?`<i style="width:${100*r.v/r.tot}%;background:var(--c1)"></i>`:""}</div></div>`).join("")}
  </section>

  ${statsForecast()}
  ${statsExercises()}
  ${statsGrammar()}

  ${L.verbs?`<section class="panel">
    <h2>Verbböjning</h2>
    ${tenses.length?tenses.map(k=>meter(k,S.vt[k].r,S.vt[k].n)).join("")+
      `<p class="plan">Per verb: ${Object.keys(S.vv).map(v=>`${v} ${pct(S.vv[v].r,S.vv[v].n)}%`).join(" · ")}</p>`
      :`<p class="plan">Du har inte kört verbträningen än.</p>`}
    <div class="games">${verbGames().map(g=>`<button class="btn ghost" data-g="${esc(g.id)}">Kör ${esc(g.name.toLowerCase())}</button>`).join("")}</div>
  </section>`:""}`;
  if($("#drill")) $("#drill").onclick=()=>{
    $("#tabs").hidden=true;
    sess={newW:[],due:hard.map(h=>h.w),i:0,kind:"words",extra:true,start:Date.now()}; startQuiz();
  };
  app.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>startVerbs(b.dataset.g));
}

/* ---------- Tooltip ---------- */
(function(){
  const tip=$("#tip");
  const show=(el,x,y)=>{tip.textContent=el.dataset.tip;tip.hidden=false;
    const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.min(window.innerWidth-w-8,Math.max(8,x-w/2))+"px";tip.style.top=Math.max(8,y-h-12)+"px";};
  document.addEventListener("pointermove",e=>{const el=e.target.closest&&e.target.closest("[data-tip]");if(el)show(el,e.clientX,e.clientY);else tip.hidden=true});
  document.addEventListener("pointerdown",e=>{const el=e.target.closest&&e.target.closest("[data-tip]");if(el)show(el,e.clientX,e.clientY);else tip.hidden=true});
  window.addEventListener("scroll",()=>tip.hidden=true,{passive:true});
})();

/* ---------- Start ---------- */
/* Kursens ord och innehåll ligger i en egen fil, data/<kod>.json, som hämtas första gången kursen väljs.
   I preview.html (och testerna) är datan inbakad, och då startar kursen direkt. */
const LOADING={};
// Datafilen innehåller words, content, videos, grammar (områden och regler), plan och verbTables. DATA_VERSION har ett
// hash per kurs, så att en ny version av en kurs inte tvingar fram en ny hämtning av de andra kursernas filer.
// verbTables = verbtabellerna {sv, tenses, notes} ur languages/<kod>/verbs.json, där build.py redan har slagit ihop arvet
// (extends/inherit). De läggs till i L.verbs (persons, prefix och games från lang.js) som ett nytt objekt, så att en
// förälder som delar samma verbs-objekt inte ändras. LANG_VERBS har kvar lang.js-delen tills kursen släpps.
const DATA_KEYS={}, LANG_VERBS={};
const withVerbTables=(verbs,tables)=>tables?Object.assign({},verbs,tables):verbs;
function addCourseData(code,d){
  const x=LANGUAGES[code], {verbTables,...rest}=d;
  DATA_KEYS[code]=Object.keys(rest); Object.assign(x,rest);
  if(verbTables){ if(!(code in LANG_VERBS)) LANG_VERBS[code]=x.verbs; x.verbs=withVerbTables(LANG_VERBS[code],verbTables); }
  if(INLINE_DATA[code+"-exam"]) addExamData(code,INLINE_DATA[code+"-exam"]);   // preview.html: provet är inbakat
  return x;
}
// Hämtar data/<namn>.json (namn = kod eller <kod>-exam) med filens hash ur DATA_VERSION; samma hämtning delas av alla som väntar
function fetchData(name){
  const v=(DATA_VERSION&&typeof DATA_VERSION==="object"?DATA_VERSION[name]:DATA_VERSION)||"";
  return LOADING[name]=LOADING[name]||fetch(`data/${name}.json?v=${v}`).then(r=>{if(!r.ok) throw new Error(r.status); return r.json();})
    .catch(e=>{delete LOADING[name]; throw e;});
}
function loadCourse(code){
  if(INLINE_DATA[code]) return Promise.resolve(addCourseData(code,INLINE_DATA[code]));
  return fetchData(code).then(d=>addCourseData(code,d));
}
/* Provträningen (content.exam) ligger i en egen fil, data/<kod>-exam.json, som hämtas först när något behöver provets
   uppgifter (ensureExam). Kursens datafil har bara ett index: content.exam = {lazy: true, name, level, pass, parts, …,
   tasks: [{id, part, teil, title, level, type, k, minWords, maxWords, time, prep, speak, sim}]} (k = exKind, räknad av
   build.py), så att startsidan, menyn, skrivsidans lista, nivåmätaren och planen kan visas direkt. Texter, frågor och
   facit (lines, qs, items, task …) finns först när ensureExam() är klar; examReady() säger om de finns. */
const examReady=()=>{ const e=L&&L.content&&L.content.exam; return !e||!e.lazy; };
function addExamData(code,d){
  const c=LANGUAGES[code].content; if(c&&c.exam&&c.exam.lazy) c.exam=d;
  return d;
}
function ensureExam(){
  const code=L.code; if(examReady()) return Promise.resolve(L.content.exam);
  if(INLINE_DATA[code+"-exam"]) return Promise.resolve(addExamData(code,INLINE_DATA[code+"-exam"]));
  return fetchData(code+"-exam").then(d=>addExamData(code,d));
}
/* Minne: hämtade kurser ligger kvar så att det går snabbt att byta tillbaka, men högst KEEP_COURSES stycken.
   Den kurs som varit oanvänd längst släpps (ord, innehåll, grammatik, verbtabeller och det som räknats fram ur dem) och hämtas
   igen om eleven väljer den. Framstegen påverkas inte: de ligger i localStorage och i molnet, inte i LANGUAGES. */
const KEEP_COURSES=3, USED_COURSES=[];
function releaseCourse(code){
  const x=LANGUAGES[code]; if(!x||x===L) return;
  (DATA_KEYS[code]||["words","content","videos","grammar"]).forEach(k=>{ delete x[k]; });
  if(code in LANG_VERBS){ x.verbs=LANG_VERBS[code]; delete LANG_VERBS[code]; }
  delete x.base; Object.keys(x).filter(k=>k[0]==="_").forEach(k=>{ delete x[k]; });
  delete LOADING[code]; delete LOADING[code+"-exam"]; delete DATA_KEYS[code];
}
function trimCourses(code){
  const i=USED_COURSES.indexOf(code); if(i>=0) USED_COURSES.splice(i,1); USED_COURSES.push(code);
  let loaded=Object.keys(LANGUAGES).filter(c=>LANGUAGES[c].words!=null);
  while(loaded.length>KEEP_COURSES){
    // den som använts längst sedan (eller aldrig, t.ex. inbakad i preview.html) släpps först
    const old=loaded.filter(c=>c!==code).sort((a,b)=>USED_COURSES.indexOf(a)-USED_COURSES.indexOf(b))[0];
    if(!old) break;
    releaseCourse(old); loaded=loaded.filter(c=>c!==old);
  }
}
let WANT_LANG=null;   // den kurs eleven senast valde; en kurs som blir klar senare aktiveras bara om den fortfarande är vald
function useLang(code){
  WANT_LANG=code;
  if(LANGUAGES[code].words==null&&INLINE_DATA[code]&&!LOADING[code]) addCourseData(code,INLINE_DATA[code]);   // preview.html: datan är inbakad
  if(LANGUAGES[code].words==null){
    try{ $("#course").value=code; }catch(e){ /* väljaren finns inte (t.ex. bara en kurs) */ }
    app.innerHTML=`<section class="panel"><p class="plan">Hämtar ${esc(LANGUAGES[code].course||LANGUAGES[code].name)} …</p></section>`;
    loadCourse(code).then(()=>{ if(WANT_LANG===code) useLang(code); }).catch(()=>{
      if(WANT_LANG!==code) return;
      app.innerHTML=`<section class="panel"><h2>Kursen kunde inte hämtas</h2><p class="plan">Kontrollera internetanslutningen och försök igen.</p><button class="btn" id="retry">Försök igen</button></section>`;
      $("#retry").onclick=()=>useLang(code); });
    return;
  }
  L=LANGUAGES[code]; L.code=code;
  L.base=L.base||parseWords(L.words);
  CONJ=buildConj(L.verbs);
  CONJBY=Object.fromEntries(CONJ.map(c=>[c.verb+"|"+c.tense+"|"+c.person,c]));
  cloudFlush();
  loadState(); rebuildWords(); sess=null; pickVoice();
  try{localStorage.setItem(LANG_KEY,code)}catch(e){ /* privat läge: kursvalet sparas inte */ }
  $("#title").textContent=L.title;
  $("#search").value="";
  $("#search").placeholder=`Sök ${L.inLang} eller svenska`;
  $("#course").value=code;
  $("#coursechip").textContent=courseChip();
  setView("ova");
  setSaveNote();
  cloudAttach();
  trimCourses(code);
}
