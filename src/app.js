/* ---------- Språk ---------- */
// L är det valda språket (från languages/<kod>/lang.js). Allt nedan läser därifrån.
let L, SECTIONS, WORDS, byId, CONJ, CONJBY;
const LANG_KEY = "glosor-sprak";
const ONLY_KEY = "glosor-bara";   // om man bara vill se en kurs (sparas bara i den här webbläsaren)
const onlyCourse=()=>{try{return localStorage.getItem(ONLY_KEY)||""}catch(e){return ""}};
// "Bara tyska" visar bara kurserna i samma språk som den sparade kursen (Tyska 4 och Tyska 5), och döljer väljaren om bara en är kvar
const sameLang=(a,b)=>!!LANGUAGES[a]&&!!LANGUAGES[b]&&LANGUAGES[a].name===LANGUAGES[b].name;
function setOnly(code){ try{ if(code) localStorage.setItem(ONLY_KEY,code); else localStorage.removeItem(ONLY_KEY); }catch(e){} fillCourses(); }
// Kursväljaren: byggda kurser går att välja, kommande kurser visas men går inte att välja än
function fillCourses(){
  const only=onlyCourse(), sel=document.querySelector("#course"); if(!sel) return;
  const codes=Object.keys(LANGUAGES).filter(c=>!LANGUAGES[only]||sameLang(c,only))
    .sort((a,b)=>(LANGUAGES[a].course||a).localeCompare(LANGUAGES[b].course||b,"sv"));
  sel.innerHTML=codes.map(c=>`<option value="${c}">${esc(LANGUAGES[c].course||LANGUAGES[c].name)} · ${esc(LANGUAGES[c].level||"")}</option>`).join("")
    +(LANGUAGES[only]?[]:UPCOMING).map(u=>`<option disabled>${esc(u.label)} · ${esc(u.level||"")} (kommer ${esc(u.note||"senare")})</option>`).join("");
  if(L) sel.value=L.code;
  const p=document.querySelector(".coursepick"); if(p) p.hidden=!!LANGUAGES[only]&&codes.length<2;
}

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
const isDue=x=>x.dd?x.dd<=Date.now():x.due<=S.pass;
const MASTER=4, MAXDUE=40;   // MAXDUE = högst så många repetitioner per pass, resten väntar till nästa
let S;
function loadState(){
  S={pass:1,w:{},newCount:15,src:"auto",mode:"mix",log:[],vt:{},vv:{}};
  try{Object.assign(S,JSON.parse(localStorage.getItem(L.storageKey)||"{}"))}catch(e){}
  normState();
}
function normState(){ if(!Array.isArray(S.log))S.log=[]; S.w=S.w||{}; S.vt=S.vt||{}; S.vv=S.vv||{}; migrateRetired(); }
/* Förr fick inlärda ord due=1e9 och kom aldrig tillbaka. Ge dem ett riktigt repetitionsdatum,
   utspritt över kommande pass så att de inte kommer alla på en gång. */
function migrateRetired(){
  const old=Object.entries(S.w).filter(([,x])=>x&&x.due>=1e9).sort((a,b)=>(a[1].mp||0)-(b[1].mp||0));
  old.forEach(([,x],i)=>{ x.s=Math.max(x.s,MASTER); x.due=Math.max((x.mp||S.pass)+INT[MASTER],S.pass+1+Math.floor(i/8)); });
}

/* ---------- Sparat på claude.ai ----------
   Framstegen sparas i webbläsaren och i ett privat dokument per person och språk på claude.ai
   (data/users/<id>/<storageKey>). Vid start vinner den version som kommit längst, så att en
   enhet med tomt minne aldrig skriver över framsteg som gjorts på en annan. */
const CLOUD={db:null,uid:null,user:null,ready:false,busy:false,pending:null,timer:null,unsub:null};
const score=s=>[(s&&s.pass)||0,((s&&s.log)||[]).length,Object.keys((s&&s.w)||{}).length];
function cmpScore(a,b){const x=score(a),y=score(b);for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]-y[i];return 0}
const docFor=key=>CLOUD.db.doc(`data/users/${CLOUD.uid}/${key}`);
function setSaveNote(){
  const n=$("#savenote"); if(!n) return;
  n.textContent=CLOUD.ready?"Framstegen sparas på ditt claude.ai-konto efter varje svar och följer med mellan iPad, telefon och dator."
    :"Framstegen sparas i den här webbläsaren efter varje svar.";
}
async function cloudInit(){
  try{
    if(!window.claude||!window.claude.use) return;
    const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    if(!db||!user) return;
    const uid=await user.id(); if(!uid) return;
    CLOUD.db=db; CLOUD.uid=uid; CLOUD.user=user;
    boardSubscribe();
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")cloudFlush()});
    window.addEventListener("pagehide",cloudFlush);
    if(L&&L.base) await cloudAttach();   // annars kopplas lagringen när kursens data har hämtats (useLang)
  }catch(e){}
}
function adopt(state){
  S=JSON.parse(JSON.stringify(state)); normState(); rebuildWords();
  try{localStorage.setItem(L.storageKey,JSON.stringify(S))}catch(e){}
  if(!sess){ if(curView==="stats") renderStats(); else renderStart(); }
}
async function cloudAttach(){   // vid start och vid byte av språk
  if(!CLOUD.db) return;
  CLOUD.ready=false; setSaveNote();
  if(CLOUD.unsub){CLOUD.unsub();CLOUD.unsub=null}
  const key=L.storageKey;
  let snap=null;
  for(let i=0;i<2&&!snap;i++){ try{snap=await docFor(key).get()}catch(e){ await new Promise(r=>setTimeout(r,800+Math.random()*800)); } }
  if(!snap||key!==L.storageKey) return;
  const d=snap.exists?snap.data():null, remote=d&&d.state;
  const c=remote?cmpScore(remote,S):-1;
  if(remote&&(c>0||(c===0&&(d.t||0)>(S.t||0)))) adopt(remote);
  CLOUD.ready=true; setSaveNote();
  if(!remote||c<0||(c===0&&(S.t||0)>(d.t||0))) cloudSave(true);
  boardPush();
  CLOUD.unsub=docFor(key).onSnapshot(s=>{
    if(!s.exists||s.metadata.hasPendingWrites||key!==L.storageKey) return;
    const r=(s.data()||{}).state;
    if(r&&cmpScore(r,S)>0) adopt(r);   // framsteg från en annan enhet
  },()=>{});
}
function cloudSave(now){
  if(!CLOUD.db||!CLOUD.ready) return;
  CLOUD.pending={key:L.storageKey,body:{state:JSON.parse(JSON.stringify(S)),t:S.t||Date.now()}};
  clearTimeout(CLOUD.timer); CLOUD.timer=setTimeout(cloudFlush,now?0:1500);
}
async function cloudFlush(){
  clearTimeout(CLOUD.timer);
  if(CLOUD.busy||!CLOUD.pending) return;
  const p=CLOUD.pending; CLOUD.pending=null; CLOUD.busy=true;
  try{ await docFor(p.key).set(p.body); }
  catch(e){
    if(e&&(e.code==="invalid_argument"||e.code==="revoked"||e.code==="not_granted")){ CLOUD.ready=false; setSaveNote(); }
    else { if(!CLOUD.pending) CLOUD.pending=p; CLOUD.timer=setTimeout(cloudFlush,3000); }
  }
  CLOUD.busy=false;
  if(CLOUD.pending) CLOUD.timer=setTimeout(cloudFlush,300);
}
/* Per ord: s = steg (0–3, 4 = kan), due = pass då ordet ska repeteras, f = frågeform (mc/type),
   mcR/mcW = rätt/fel på flerval, tyR/tyW = rätt/fel på skriva, clR/clW = rätt/fel i meningar,
   lp/ld = lärt i pass/datum, mp/md = kan sedan pass/datum */
function save(){
  S.t=Date.now();
  if(S.log.length>1000) foldLog();   // håller dokumentet under lagringsgränsen
  try{localStorage.setItem(L.storageKey,JSON.stringify(S))}catch(e){}
  cloudSave();
}
// De äldsta loggposterna sammanfattas i S.logOld, så att total tid och antal dagar finns kvar
function foldLog(){
  const cut=S.log.length-1000, o=S.logOld||{dur:0,days:0,lastDay:""};
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
/* Rätt: ett steg upp. Fel: ett steg ned, och ett ord man kunde går tillbaka till steg 2. */
function schedule(x,ok,p,now){
  if(ok){ x.s=Math.min(x.s+1,INT.length-1); if(x.s>=MASTER&&!x.mp){x.mp=p;x.md=now;} }
  else { x.s=x.s>=MASTER?2:Math.max(0,x.s-1); delete x.mp; delete x.md; x.lapses=(x.lapses||0)+1; }
  x.due=p+INT[x.s];
  if(DAYS[x.s]) x.dd=dayStart(now)+DAYS[x.s]*DAY; else delete x.dd;
}

/* ---------- Uppläsning ---------- */
let voice=null;
function pickVoice(){try{
  const vs=speechSynthesis.getVoices(), code=L.tts.replace("-","[-_]"), base=L.tts.split("-")[0];
  voice=vs.find(v=>new RegExp("^"+code,"i").test(v.lang))||vs.find(v=>new RegExp("^"+base,"i").test(v.lang))||null;
}catch(e){}}
try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
const cleanSay=t=>t.replace(/\(.*?\)/g,"").replace(/,\s*-\w+/g,"").replace(/[…«»\[\]]/g,"").replace(/\//g,", ");
const baseRate=()=>S&&S.slow?.7:.9;
// Ljud av/på (knappen i sidhuvudet). Gäller alla kurser och sparas i webbläsaren.
const SOUND_KEY="glosor-ljud";
let SOUND=(()=>{try{return localStorage.getItem(SOUND_KEY)!=="av"}catch(e){return true}})();
function setSound(on){ SOUND=on; try{localStorage.setItem(SOUND_KEY,on?"på":"av")}catch(e){}
  if(!on) try{speechSynthesis.cancel()}catch(e){}
  const b=document.querySelector("#sound"); if(b){ b.setAttribute("aria-pressed",String(!on)); b.textContent=on?"Ljud på":"Ljud av"; } }
function speak(t,rate){if(!SOUND)return;try{
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(cleanSay(t));u.lang=L.tts;if(voice)u.voice=voice;u.rate=rate||baseRate();speechSynthesis.speak(u);
}catch(e){}}

/* ---------- Rättning ---------- */
const deacc=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae");
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
  const parts=base.split(/\s*,\s*/);
  if(parts.length===2) parts.forEach(p=>{if(!p.startsWith("-")) add(p)});
  if(parts.length===2&&parts[1].startsWith("-")) add(parts[0]);
  return [...out];
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
  if(accepted.includes(a)) return "right";
  if(accepted.some(x=>deacc(x)===deacc(a))) return "accent";
  if(accepted.some(x=>x.length>4&&lev(deacc(x),deacc(a))<=1)) return "near";
  return "wrong";
}

/* ---------- Hjälpare ---------- */
const $=s=>document.querySelector(s);
const app=$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SPK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const secName=id=>(SECTIONS.find(s=>s.id===id)||{}).name||"";
const gtag=g=>g?`<span class="tag ${g[0]}">${L.genders[g]||g}</span>`:"";
const accentKeys=list=>`<div class="accents">${list.split(" ").map(c=>`<button type="button" data-c="${c}">${c}</button>`).join("")}</div>`;
const lang=()=>`lang="${L.htmlLang||L.code}"`;

function pickNew(){
  // Egna ord från texterna först, sedan kapitlet klassen läser (om boken finns), sedan resten i ordning
  const rank=w=>w.sec==="mine"?0:S.chapter&&sameChapter(w.sec,S.chapter)?1:2;
  const fresh=WORDS.filter(w=>!isLearned(w)).sort((a,b)=>rank(a)-rank(b));
  const pool=S.src==="auto"?fresh:fresh.filter(w=>w.sec===S.src);
  return pool.slice(0,S.newCount);
}

/* ---------- Startsida ---------- */
// Förslag att gå vidare till nästa kurs (Tyska 4 → Tyska 5) när nästan alla ord är påbörjade och hälften sitter
function nextPanel(learned,mastered){
  const nx=LANGUAGES[L.nextCourse];
  if(!nx||!WORDS.length||learned<WORDS.length*0.9||mastered<WORDS.length*0.5) return "";
  return `<section class="panel"><h2>Redo för ${esc(nx.course)}?</h2>
    <p class="plan">Du har övat på ${learned} av ${WORDS.length} ord i ${esc(L.course)}, och ${mastered} kan du redan. Du kan fortsätta repetera här och samtidigt börja på ${esc(nx.course)}. Framstegen sparas separat i varje kurs.</p>
    <button class="btn" id="nextc">Gå till ${esc(nx.course)}</button></section>`;
}
function renderStart(){
  document.body.classList.remove("has-tray");
  sess=null;
  curView="ova";
  $("#tabs").hidden=false; tabSel("ova");
  const newW=pickNew(), due=dueWords();
  const learned=WORDS.filter(isLearned).length, mastered=WORDS.filter(isMastered).length;
  const secOpt=s=>{const n=WORDS.filter(w=>w.sec===s.id&&!isLearned(w)).length;
    return `<option value="${s.id}" ${n?"":"disabled"}>${esc(s.name)} (${n} kvar)</option>`;};
  const bookSecs=SECTIONS.filter(s=>s.book), otherSecs=SECTIONS.filter(s=>!s.book);
  const opts=`<option value="auto">${hasBook()?"Kapitlet ni läser, sedan resten":L.nextLabel||"Nästa ord i ordlistan"}</option>`+(bookSecs.length
    ?`<optgroup label="Boken: ${esc(L.book?L.book.title:"")}">${bookSecs.map(secOpt).join("")}</optgroup><optgroup label="Allmänt">${otherSecs.map(secOpt).join("")}</optgroup>`
    :SECTIONS.map(secOpt).join(""));
  const nothing=!newW.length&&!due.length;
  app.innerHTML=`
  ${S.run||S.dailyDay===dayKey(Date.now())?"":dailyPanel(newW,due)}
  ${S.run?`<section class="panel"><h2>Fortsätt där du slutade</h2><p class="plan">${esc(runLabel(S.run))}</p>
    <div class="navrow"><button class="btn ghost" id="run-drop">Släng</button><button class="btn" id="run-go">Fortsätt</button></div></section>`:""}
  ${hasBook()?bookPanel():""}
  ${nextPanel(learned,mastered)}
  <section class="panel">
    <div class="meta"><span class="label">Pass ${S.pass}</span></div>
    <div class="stats">
      <div class="stat"><b>${due.length}</b><span>att repetera</span></div>
      <div class="stat"><b>${learned-mastered}</b><span>på väg</span></div>
      <div class="stat"><b>${mastered}</b><span>kan</span></div>
    </div>
    <div class="field"><span class="label">Nya ord från</span><select id="src">${opts}</select></div>
    <div class="field"><span class="label">Antal nya ord</span>
      <div class="seg" role="group" aria-label="Antal nya ord">${[0,10,15,20].map(n=>`<button data-n="${n}" aria-pressed="${S.newCount===n}">${n||"Inga"}</button>`).join("")}</div></div>
    <div class="field"><span class="label">Quizet</span>
      <div class="seg" role="group" aria-label="Frågetyp">
        <button data-m="mix" aria-pressed="${S.mode==="mix"}">Anpassat</button>
        <button data-m="mc" aria-pressed="${S.mode==="mc"}">Flerval</button>
        <button data-m="type" aria-pressed="${S.mode==="type"}">Skriva</button></div></div>
    <details class="more settings" id="setd" ${SET_OPEN?"open":""}><summary>Fler inställningar</summary>
    <div class="row2b">
      <div class="field"><span class="label">Uppläsning</span>
        <div class="seg" role="group" aria-label="Uppläsning"><button data-slow="0" aria-pressed="${!S.slow}">Normal</button><button data-slow="1" aria-pressed="${!!S.slow}">Långsam</button></div></div>
      <div class="field"><span class="label">Nya ord</span>
        <div class="seg" role="group" aria-label="Nya ord"><button data-lf="0" aria-pressed="${!S.listenFirst}">Visa direkt</button><button data-lf="1" aria-pressed="${!!S.listenFirst}">Lyssna först</button></div></div>
    </div>
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
  $("#src").value=S.src; if(!$("#src").selectedOptions[0]||$("#src").selectedOptions[0].disabled){S.src="auto";$("#src").value="auto"}
  $("#src").onchange=e=>{S.src=e.target.value;save();renderStart()};
  wireBookPanel();
  if($("#nextc")) $("#nextc").onclick=()=>useLang(L.nextCourse);
  app.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{S.newCount=+b.dataset.n;save();renderStart()});
  app.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;save();renderStart()});
  app.querySelectorAll("[data-slow]").forEach(b=>b.onclick=()=>{S.slow=b.dataset.slow==="1";save();renderStart()});
  app.querySelectorAll("[data-lf]").forEach(b=>b.onclick=()=>{S.listenFirst=b.dataset.lf==="1";save();renderStart()});
  $("#setd").ontoggle=()=>{SET_OPEN=$("#setd").open};
  app.querySelectorAll("[data-only]").forEach(b=>b.onclick=()=>{setOnly(b.dataset.only==="1"?L.code:"");renderStart()});
  app.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{S.goal=+b.dataset.goal;save();boardPush();renderStart()});
  app.querySelectorAll("[data-gy]").forEach(b=>b.onclick=()=>{S.gy25=b.dataset.gy==="1";save();$("#coursechip").textContent=`${courseName()} · nivå ${L.level||""}`;renderStart()});
  if($("#daily")) $("#daily").onclick=()=>startDaily(newW,due);
  $("#go").onclick=()=>startSession(newW,due);
  if(S.run){ $("#run-go").onclick=resumeRun; $("#run-drop").onclick=quitSession; }
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

/* ---------- Topplista ----------
   Varje person skriver en sammanfattning per språk i board/<sitt id> (bara den egna går att ändra).
   Alla som har tillgång till programmet ser allas sammanfattningar. */
const BOARD={docs:{},mine:null,unsub:null,timer:null};
function boardKeepMine(){ const u=CLOUD.uid, m=BOARD.mine; if(m&&(!BOARD.docs[u]||(BOARD.docs[u].t||0)<m.t)) BOARD.docs[u]=m; }
function weekStart(ts){const d=new Date(ts);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()}
const dayKey=ts=>new Date(ts).toDateString();
function isoWeek(d){ const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); const day=t.getUTCDay()||7;
  t.setUTCDate(t.getUTCDate()+4-day); const y0=new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil(((t-y0)/864e5+1)/7); }
function streakAlive(last){const d=new Date();if(dayKey(last)===dayKey(d))return true;d.setDate(d.getDate()-1);return dayKey(last)===dayKey(d)}
function myStats(){
  const w0=weekStart(Date.now()), wk=S.log.filter(l=>l.d>=w0), days=new Set(S.log.map(l=>dayKey(l.d)));
  let streak=0; const d=new Date(); d.setHours(12,0,0,0); if(!days.has(dayKey(d))) d.setDate(d.getDate()-1);
  while(days.has(dayKey(d))){streak++; d.setDate(d.getDate()-1)}
  const pw=weekStart(w0-3*864e5), pk=S.log.filter(l=>l.d>=pw&&l.d<w0);   // förra veckan
  return {week:w0, min:Math.round(wk.reduce((a,l)=>a+(l.dur||0),0)/60), q:wk.reduce((a,l)=>a+(l.total||0),0), goal:S.goal||0,
    prev:{week:pw, min:Math.round(pk.reduce((a,l)=>a+(l.dur||0),0)/60), q:pk.reduce((a,l)=>a+(l.total||0),0)},
    hist:weekHistory(w0),
    days:new Set(wk.map(l=>dayKey(l.d))).size, streak, last:S.log.length?S.log[S.log.length-1].d:0,
    learned:WORDS.filter(isLearned).length, mastered:WORDS.filter(isMastered).length};
}
// Minuter per vecka de sex senaste hela veckorna: {veckostart: minuter}
function weekHistory(w0){
  const out={}; let w=w0;
  for(let i=0;i<6;i++){ const p=weekStart(w-3*864e5), m=Math.round(S.log.filter(l=>l.d>=p&&l.d<w).reduce((a,l)=>a+(l.dur||0),0)/60); if(m) out[p]=m; w=p; }
  return out;
}
function boardSubscribe(){
  if(!CLOUD.db||BOARD.unsub) return;
  BOARD.unsub=CLOUD.db.collection("board").onSnapshot(s=>{
    BOARD.docs={}; s.docs.forEach(d=>{if(d.exists)BOARD.docs[d.id]=d.data()}); boardKeepMine();
    if(curView==="board"&&!sess) renderBoard();
  },()=>{});
}
function boardPush(nick){
  if(!CLOUD.db||!CLOUD.uid) return;
  const code=L.code, stats=myStats();
  clearTimeout(BOARD.timer);
  BOARD.timer=setTimeout(async()=>{
    const ref=CLOUD.db.doc("board/"+CLOUD.uid);
    try{
      const cur=await ref.get(), old=(cur.exists&&cur.data())||{};
      const body={nick:nick!==undefined?nick:(old.nick||""), langs:{...(old.langs||{}),[code]:stats}, t:Date.now()};
      await ref.set(body); BOARD.mine=body; boardKeepMine();
      if(curView==="board"&&!sess) renderBoard();
    }catch(e){}
  },nick!==undefined?0:1000);
}
async function renderBoard(){
  if(!CLOUD.db||!CLOUD.uid){
    app.innerHTML=`<section class="panel"><h2>Topplista</h2><p class="plan">Topplistan fungerar när du är inloggad på claude.ai och har fått tillgång till glosprogrammet. Då sparas också alla dina framsteg på ditt konto.</p></section>`;
    return;
  }
  const w0=weekStart(Date.now()), pw=weekStart(w0-3*864e5);
  const rows=Object.entries(BOARD.docs).map(([id,d])=>{
    const r={id,nick:d.nick||"",min:0,q:0,days:0,streak:0,langs:[],prev:0,goals:[]};
    Object.entries(d.langs||{}).forEach(([k,x])=>{
      if(x.week===w0){r.min+=x.min||0; r.q+=x.q||0; r.days=Math.max(r.days,x.days||0); if(x.goal) r.goals.push(x.min>=x.goal);}
      // Förra veckans minuter: från förra veckans rad om personen inte har övat den här veckan än, annars från prev
      if(x.week===pw) r.prev+=x.min||0; else if(x.prev&&x.prev.week===pw) r.prev+=x.prev.min||0;
      if(x.last&&streakAlive(x.last)) r.streak=Math.max(r.streak,x.streak||0);
      r.langs.push((LANGUAGES[k]||{}).course||(LANGUAGES[k]||{}).name||k);
    });
    return r;
  }).sort((a,b)=>b.min-a.min||b.q-a.q||b.streak-a.streak);
  let ps={}; try{ps=await CLOUD.user.profiles(rows.map(r=>r.id))}catch(e){}
  if(curView!=="board"||sess) return;
  const mine=BOARD.docs[CLOUD.uid]||{};
  const nameOf=r=>r.nick||(ps[r.id]&&ps[r.id].name)||"Någon";
  const win=rows.filter(r=>r.prev>0).sort((a,b)=>b.prev-a.prev)[0];
  // Tidigare veckors vinnare, från varje persons veckohistorik (alla språk ihop)
  const byWeek={};
  Object.entries(BOARD.docs).forEach(([id,d])=>Object.values(d.langs||{}).forEach(x=>Object.entries(x.hist||{}).forEach(([wk,m])=>{
    if(+wk>=pw) return; const o=byWeek[wk]=byWeek[wk]||{}; o[id]=(o[id]||0)+m;})));
  const hist=Object.keys(byWeek).map(Number).sort((a,b)=>b-a).slice(0,5).map(wk=>{
    const [id,m]=Object.entries(byWeek[wk]).sort((a,b)=>b[1]-a[1])[0]; return {wk,id,m};});
  const wkLabel=wk=>{const d=new Date(wk); return `v. ${isoWeek(d)}`;};
  app.innerHTML=`<section class="panel"><h2>Topplista den här veckan</h2>
    <p class="plan">Minuter och frågor sedan måndag, i alla språk. Dagar i rad räknas om man övar varje dag.</p>
    ${win?`<p class="winner">Förra veckan vann <b>${esc(nameOf(win))}</b> med ${win.prev} minuter.</p>`:""}
    ${rows.length?`<ol class="board">${rows.map((r,i)=>`<li class="brow${r.id===CLOUD.uid?" me":""}">
      <span class="rank">${i+1}</span>
      <span class="who"><b>${esc(nameOf(r))}${r.id===CLOUD.uid?" (du)":""}</b><small>${esc(r.langs.join(", "))}${r.goals.length&&r.goals.every(Boolean)?" · veckomålet klart ✓":""}</small></span>
      <span class="num"><b>${r.min}</b><small>min</small></span>
      <span class="num"><b>${r.q}</b><small>frågor</small></span>
      <span class="num"><b>${r.streak}</b><small>dagar i rad</small></span></li>`).join("")}</ol>`
      :`<p class="plan">Ingen har övat än den här veckan.</p>`}
  </section>
  ${hist.length?`<section class="panel"><h2>Tidigare veckor</h2><ul class="missed">${hist.map(h=>`<li><span>${wkLabel(h.wk)}</span><span><b>${esc(nameOf({id:h.id,nick:(BOARD.docs[h.id]||{}).nick}))}</b> · ${h.m} min</span></li>`).join("")}</ul></section>`:""}
  <section class="panel"><h2>Ditt namn i topplistan</h2>
    <form id="nickf" class="nick" autocomplete="off"><input class="search" id="nick" maxlength="24" placeholder="Till exempel Oscar" value="${esc(mine.nick||"")}"><button class="btn" style="width:auto">Spara</button></form>
    <p class="foot" id="nickmsg">Namnet syns för alla som har tillgång till glosprogrammet.</p></section>`;
  $("#nickf").onsubmit=e=>{e.preventDefault(); boardPush($("#nick").value.trim().slice(0,24)); $("#nickmsg").textContent="Sparat.";};
}

/* ---------- Pass: lära ---------- */
let sess=null, curView="ova", SET_OPEN=false;

/* Ett pågående pass sparas efter varje svar, så att det går att fortsätta om appen stängs */
function snapRun(){
  if(!sess) return;
  const it=q=>({k:q.k,id:q.id,ref:q.ref||q.w.id,w:q.w&&q.w.id,t:q.t,isNew:q.isNew,again:!!q.again,canType:!!q.canType,noRetry:!!q.noRetry,tenses:q.tenses});
  const pending=sess.cur&&!sess.answered?[sess.cur]:[];
  S.run={kind:sess.kind,learn:!sess.queue,i:sess.i||0,
    newW:(sess.newW||[]).map(w=>w.id),due:(sess.due||[]).map(w=>w.id),extra:!!sess.extra,game:sess.game?sess.game.id:null,
    queue:sess.queue?[...pending,...sess.queue].map(it):null,total:sess.total||0,done:sess.done||0,
    firstTry:sess.firstTry||{},firstType:sess.firstType||{},tries:sess.tries||{},start:sess.start,
    ctx:sess.ctx||null,againFn:sess.againFn||null,label:sess.label||"",daily:!!sess.daily};
  const k=runKey(sess); if(k){ S.runs=S.runs||{}; S.runs[k]=S.run; }
  save();
}
// Varje övning har sin egen påbörjade runda, så man kan välja att fortsätta eller börja om när man öppnar den igen
const runKey=r=>r&&r.kind!=="words"?(r.againFn?r.againFn.join("|"):r.kind+"|"+((r.ctx&&r.ctx.id)||"")):null;
function dropRun(r){ const k=runKey(r); if(k&&S.runs) delete S.runs[k]; }
function quitSession(){ dropRun(S.run); sess=null; delete S.run; save(); renderStart(); }
// Avbryt mitt i en övning: rundan sparas och kan fortsättas senare
function pauseSession(){ stopSpeech(); sess=null; renderStart(); }
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
    if(RESTORE[k]){const x=RESTORE[k](q.ref); return x?{...q,...x,k}:null}
    const w=byId[q.w]; return w?{...q,w}:null;
  };
  $("#tabs").hidden=true;
  sess={kind:r.kind,i:r.i,newW:r.newW.map(id=>byId[id]).filter(Boolean),due:r.due.map(id=>byId[id]).filter(Boolean),extra:r.extra,start:r.start||Date.now(),
    ctx:r.ctx||null,againFn:r.againFn||null,label:r.label||"",daily:!!r.daily};
  if(r.kind==="verbs"){const g=verbGames().find(x=>x.id===r.game)||verbGames()[0]; Object.assign(sess,{game:g,tenses:g.tenses});}
  if(r.learn){ if(!sess.newW.length) return quitSession(); sess.i=Math.min(sess.i,sess.newW.length-1); return renderLearn(); }
  Object.assign(sess,{queue:(r.queue||[]).map(item).filter(Boolean),total:r.total,done:r.done,firstTry:r.firstTry||{},firstType:r.firstType||{},tries:r.tries||{}});
  nextQ();
}
function startSession(newW,due){
  $("#tabs").hidden=true;
  sess={newW,due,i:0,kind:"words",start:Date.now()};
  if(newW.length) renderLearn(); else startQuiz();
}
function renderLearn(){
  const w=sess.newW[sess.i], n=sess.newW.length;
  sess.shown=sess.shown||{};
  if(S.listenFirst&&!sess.shown[sess.i]){   // lyssna först: bara ljud tills eleven vill se ordet
    app.innerHTML=`<section class="panel">
      <div class="meta"><span>Nya ord · ${esc(secName(w.sec))}</span><span>${sess.i+1} / ${n}</span></div>
      <div class="bar"><i style="width:${(sess.i/n)*100}%"></i></div>
      <p class="q-ask">Lyssna på ordet och meningen. Försök uppfatta vad som sägs innan du tittar.</p>
      <div class="listen"><button class="btn ghost" id="lw">${PLAY} Ordet</button><button class="btn ghost" id="le">${PLAY} Meningen</button><button class="btn ghost" id="ls">Långsamt</button></div>
      <button class="btn" id="show">Visa ordet</button></section>
      <button class="quit" id="quit">Avbryt passet</button>`;
    $("#lw").onclick=()=>speak(w.t); $("#le").onclick=()=>speak(w.exT); $("#ls").onclick=()=>speak(w.exT,.6);
    $("#show").onclick=()=>{sess.shown[sess.i]=true;renderLearn()};
    $("#quit").onclick=pauseSession; snapRun(); speak(w.t); return;
  }
  app.innerHTML=`
  <section class="panel">
    <div class="meta"><span>Nya ord · ${esc(secName(w.sec))}</span><span>${sess.i+1} / ${n}</span></div>
    <div class="bar"><i style="width:${(sess.i/n)*100}%"></i></div>
    <div class="word">
      <div style="display:flex;flex-direction:column;gap:6px">
        <p class="t-big" ${lang()}>${esc(w.t)}</p>
        <p class="sv-big">${esc(w.sv)}</p>
        <div class="tags">${gtag(w.g)}</div>
      </div>
      <button class="speak" id="sp-w" aria-label="Läs upp ordet">${SPK}</button>
    </div>
    <div class="example">
      <div><p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p></div>
      <button class="speak sm" id="sp-e" aria-label="Läs upp meningen">${SPK}</button>
    </div>
    ${litHtml(w)}<p class="ety"><span class="label">${L.etyLabel||"Ursprung"}</span><br>${w.ety}</p>
    <div class="navrow">
      <button class="btn ghost" id="prev" ${sess.i?"":"disabled"}>Tillbaka</button>
      <button class="btn" id="next">${sess.i===n-1?"Till quizet":"Nästa ord"}</button>
    </div>
    <p class="kbd-hint">Tangentbord: mellanslag eller Enter = nästa, ← = tillbaka. I quizet: siffrorna väljer svar och Enter går vidare.</p>
  </section>
  <button class="quit" id="quit">Avbryt passet</button>`;
  $("#sp-w").onclick=()=>speak(w.t); $("#sp-e").onclick=()=>speak(w.exT);
  $("#prev").onclick=()=>{sess.i--;renderLearn()};
  $("#next").onclick=()=>{if(sess.i<n-1){sess.i++;renderLearn()}else startQuiz()};
  $("#quit").onclick=pauseSession;
  snapRun();
  if(!S.listenFirst) speak(w.t);
}

/* ---------- Quizmotor (ord, verb och meningar) ----------
   Varje fråga är flerval (t:"mc") eller skriva (t:"type").
   Fel svar: frågan kommer tillbaka som flerval i slutet av övningen.
   Rätt på det flervalet: tillbaka som skrivfråga igen, om frågan var en skrivfråga från början (canType).
   Bara första svaret per ord räknas för repetitionsschemat och statistiken. */
const MAX_AGAIN=4;   // max antal extra frågor per ord och övning
function beginQuiz(kind,items,extra){
  const k=runKey({kind,...(extra||{})}), old=k&&S.runs&&S.runs[k];
  if(old&&!(extra&&extra.fresh)&&old.done<old.total){
    sess=null; $("#tabs").hidden=true;
    app.innerHTML=`<section class="panel"><h2>${esc(old.label||"Övningen")}</h2>
      <p class="plan">Du har en påbörjad runda: ${old.done} av ${old.total} frågor klara.</p>
      <button class="btn" id="rcont">Fortsätt där du slutade</button><button class="btn ghost" id="rnew">Börja om från början</button></section>
      <button class="quit" id="quit">Tillbaka</button>`;
    $("#rcont").onclick=()=>{S.run=old; resumeRun();};
    $("#rnew").onclick=()=>{delete S.runs[k]; beginQuiz(kind,items,{...extra,fresh:true});};
    $("#quit").onclick=renderStart; return;
  }
  sess=Object.assign(sess||{},{kind,queue:items,total:items.length,done:0,firstTry:{},firstType:{},tries:{}},extra||{});
  sess.start=sess.start||Date.now();
  nextQ();
}
function qType(w,isNew){ if(S.mode==="mc")return"mc"; if(S.mode==="type")return"type"; return isNew?"mc":((ws(w.id)||{}).f||"mc"); }
function startQuiz(){
  const items=[...sess.newW.map(w=>({w,isNew:true,t:qType(w,true)})),...sess.due.map(w=>({w,isNew:false,t:qType(w,false)}))]
    .map(q=>({...q,canType:q.t==="type"}));
  beginQuiz("words",shuffle(items));
}
function nextQ(){
  sess.cur=sess.queue.shift();
  if(!sess.cur) return sess.kind==="words"?finishSession():finishGeneric();
  sess.answered=false;
  const d=(sess.cur.t==="mc"?MC:TYPE)[sess.cur.k||sess.kind](sess.cur);
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
  app.innerHTML=`<section class="panel">${d.tab?`<span class="tab">${d.tab}</span>`:""}${progressHead()}
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
  app.innerHTML=`<section class="panel">${d.tab?`<span class="tab">${d.tab}</span>`:""}${progressHead()}
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
  const inp=$("#ans"); setTimeout(()=>{try{inp.focus()}catch(e){}},50);
  $("#f").onsubmit=e=>{e.preventDefault(); if(!sess.answered) onSubmit(); else nextQ();};
  const hideAcc=()=>{if(sess&&sess.answered){const a=app.querySelector(".accents");if(a)a.hidden=true}};
  $("#f").addEventListener("submit",hideAcc); $("#submit").addEventListener("click",hideAcc);
  $("#submit").onclick=()=>{ if(!sess.answered) onSubmit(); else nextQ(); };
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
// Svar som inte kan rättas automatiskt: eleven jämför med facit och bedömer själv
function selfGrade(d,res,inp){
  $("#submit").hidden=true; const a=app.querySelector(".accents"); if(a) a.hidden=true;
  $("#fb").innerHTML=`<div class="feedback near"><strong>Jämför med facit</strong>
    <p>Facit: <b ${lang()}>${d.answer}</b></p>${res.html||""}
    <p>Hur nära var du? Små skillnader i ordval kan också vara rätt.</p>
    <div class="grade"><button type="button" class="btn ghost" data-gr="wrong">Fel</button><button type="button" class="btn ghost" data-gr="near">Nästan</button><button type="button" class="btn" data-gr="right">Rätt</button></div></div>`;
  speak(d.say);
  app.querySelectorAll("[data-gr]").forEach(b=>b.onclick=()=>{ $("#submit").hidden=false;
    showTypeResult(d,{r:b.dataset.gr==="right"?"right":"wrong",self:b.dataset.gr,html:res.html},inp); });
}
function showTypeResult(d,res,inp){
  const r=res.r, ok=r==="right"||r==="accent";
  if(inp) inp.classList.add(ok?"right":"wrong");
  const back=record(ok); sess.done++; snapRun();
  const msg=res.self?{right:"Bra!",near:"Nästan. Den kommer tillbaka så att du får öva mer.",wrong:"Den kommer tillbaka så att du får öva mer."}[res.self]
    :{right:"Rätt!",accent:"Rätt, men titta på accenterna.",near:d.nearMsg||"Nästan! Ett stavfel.",wrong:"Inte riktigt."}[r];
  $("#fb").innerHTML=`<div class="feedback ${r==="right"?"ok":r==="wrong"&&res.self!=="near"?"bad":"near"}"><strong>${msg}</strong>
    ${(r==="right"&&!d.alwaysAnswer)||res.self?"":`<p>Rätt svar: <b ${lang()}>${d.answer}</b></p>`}${res.self?"":res.html||""}${backMsg(ok,back)}${!ok&&d.wrongCard?d.wrongCard:d.explain}
    ${!ok&&d.override&&!res.self?`<button class="override" id="ovr">Jag hade rätt</button>`:""}${reportBtn()}</div>`;
  $("#submit").textContent="Nästa"; $("#submit").focus();
  if(d.onAnswer) d.onAnswer(ok);
  if(!res.self) speak(d.say);
  if($("#ovr")) $("#ovr").onclick=()=>{unrecord();snapRun();if($("#back"))$("#back").remove();$("#ovr").outerHTML="<p><b>Okej, räknas som rätt.</b></p>";inp.classList.remove("wrong");inp.classList.add("right")};
}
/* "Fel i frågan?": eleven kan rapportera ett felaktigt facit eller en konstig mening.
   Rapporterna sparas i reports/<id> i artefaktens db (läses av föräldern eller Claude), annars i S.reports. */
const reportBtn=()=>`<button type="button" class="override" data-report>Fel i frågan? Rapportera</button>`;
async function sendReport(btn){
  const c=sess&&sess.cur, d=sess&&sess.d; if(!c||btn.disabled) return;
  const r={lang:L.code,id:itemId(c),kind:c.k||sess.kind,t:c.t,answer:String((d&&d.answer)||"").replace(/<[^>]+>/g,""),d:Date.now(),pass:S.pass};
  btn.disabled=true; btn.textContent="Skickar …";
  let ok=false;
  if(CLOUD.db&&CLOUD.uid){ try{ await CLOUD.db.doc(`reports/${CLOUD.uid}-${r.d}`).set({...r,uid:CLOUD.uid}); ok=true; }catch(e){} }
  if(!ok){ S.reports=(S.reports||[]).slice(-49); S.reports.push(r); save(); }
  btn.textContent="Tack! Frågan är rapporterad och blir kontrollerad.";
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-report]"); if(b) sendReport(b);});
/* Tangentbordet: siffror väljer svar i flerval (och Fel/Nästan/Rätt vid självbedömning), mellanslag eller
   Enter går till nästa ord när man lär sig nya ord, pilarna bläddrar, och Enter går alltid vidare efter ett svar. */
document.addEventListener("keydown",e=>{
  const tg=e.target&&e.target.matches?e.target:document.body;
  if(e.ctrlKey||e.metaKey||e.altKey||tg.matches("input,textarea,select")) return;
  const click=sel=>{const b=app.querySelector(sel); if(b&&!b.disabled&&!b.hidden&&b.offsetParent!==null){e.preventDefault(); b.click(); return true;} return false;};
  const n=+e.key;
  if(n>=1&&n<=9){
    if(sess&&sess.cur&&sess.d&&sess.cur.t==="mc"&&!sess.answered&&n<=sess.d.opts.length){ e.preventDefault(); answerMC(n-1); return; }
    const gr=app.querySelectorAll("[data-gr],[data-sh]"); if(gr[n-1]){ e.preventDefault(); gr[n-1].click(); return; }
    return;
  }
  const onBtn=tg.matches("button,a,summary");
  if(e.key===" "&&!onBtn){ click("#next"); return; }
  if(e.key==="ArrowRight"){ click("#next"); return; }
  if(e.key==="ArrowLeft"){ click("#prev"); return; }
  if(e.key==="Enter"&&!onBtn) click("#next")||click("#nx")||(sess&&sess.answered&&click("#submit"))||click("#exnext");
});

/* Frågorna för varje övning: MC = flerval, TYPE = skriva */
function mcOptions(w){
  const same=shuffle(WORDS.filter(x=>x.sec===w.sec&&x.sv!==w.sv));
  const other=shuffle(WORDS.filter(x=>x.sec!==w.sec&&x.sv!==w.sv));
  const picks=[];
  for(const x of same.concat(other)){ if(picks.length>=4)break; if(!picks.some(p=>p.sv===x.sv)) picks.push(x); }
  return shuffle([w,...picks]);
}
const explain=w=>`<p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p>${(ws(w.id)||{}).memo?`<p class="foot">Din minnesregel: ${esc(ws(w.id).memo)}</p>`:""}`;
// Lärokortet igen efter ett fel svar: ord, översättning, genus, exempel med uppläsning och ursprung
const studyCard=w=>`<div class="recap">
  <div class="word" style="padding-top:0"><div><p class="recap-t" ${lang()}>${esc(w.t)}</p><p class="recap-sv">${esc(w.sv)}</p><div class="tags">${gtag(w.g)}</div></div>
    <button type="button" class="speak sm" data-say="${esc(w.t)}" aria-label="Läs upp ordet">${SPK}</button></div>
  <div class="example"><div><p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p></div>
    <button type="button" class="speak sm" data-say="${esc(w.exT)}" aria-label="Läs upp meningen">${SPK}</button></div>
  ${litHtml(w)}${w.ety?`<p class="ety"><span class="label">${L.etyLabel||"Ursprung"}</span><br>${w.ety}</p>`:""}
  ${memoBox(w)}</div>`;
// Fraser och talesätt: vad varje ord betyder ordagrant (sjunde fältet i words.txt), t.ex. "avoir – ha · le cafard – kackerlackan"
function litHtml(w){ return w.lit?`<p class="ety lit"><span class="label">Ordagrant</span><br>${w.lit}</p>`:""; }
// Egen minnesregel: visas om den finns, och kan skrivas för ord man ofta glömmer
function memoBox(w){
  const x=ws(w.id)||{}, m=x.memo||"";
  if(!m&&!isLeech(w)) return "";
  return `<div class="memo"><span class="label">${m?"Din minnesregel":"Svårt ord"}</span>
    ${m?`<p class="ety">${esc(m)}</p>`:`<p class="ety">Det här ordet har du glömt flera gånger. Hitta på en egen minnesregel, till exempel en bild, ett ord det låter som eller en mening om något du själv har varit med om.</p>`}
    ${ws(w.id)?`<form class="memof" data-memo="${esc(w.id)}" autocomplete="off"><input class="search" maxlength="160" placeholder="${m?"Ändra din minnesregel":"Skriv din minnesregel"}" value="${esc(m)}"><button class="btn ghost" style="width:auto">Spara</button></form>`:""}</div>`;
}
document.addEventListener("submit",e=>{const f=e.target.closest&&e.target.closest("[data-memo]"); if(!f) return; e.preventDefault();
  const x=ws(f.dataset.memo); if(!x) return; const v=f.querySelector("input").value.trim();
  if(v) x.memo=v.slice(0,160); else delete x.memo; save();
  f.outerHTML=`<p class="foot">Sparat. Minnesregeln visas nästa gång ordet kommer.</p>`;});
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-say]"); if(b) speak(b.dataset.say);});
const verbHead=c=>`<p class="q-prompt" ${lang()}>${esc(c.verb)} <span class="sub" style="font-family:var(--sans);font-weight:400">(${esc(L.verbs.sv[c.verb]||"")})</span></p>`;
const clozeHead=w=>`<p class="cloze" ${lang()}>${esc(w.gap.pre)}<span class="gap" id="gap">&nbsp;</span>${esc(w.gap.post)}</p><p class="ex-sv">${esc(w.exSv)}</p>`;
const fillGap=w=>()=>{const g=$("#gap");if(g){g.textContent=w.gap.ans;g.classList.add("filled")}};
function clozeHint(w){
  const bare=s=>L.hintStrip?s.replace(L.hintStrip,""):s;
  const same=variants(w.t).map(bare).includes(bare(norm(w.gap.ans)));
  return `Ordet betyder <b>${esc(w.sv)}</b>${same?"":`. Grundform: <b ${lang()}>${esc(w.t)}</b>`}`;
}
const MC={
  words:c=>{const w=c.w;return{
    head:`<div class="word"><p class="q-prompt" ${lang()}>${esc(w.t)}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div>`,
    ask:"Vad betyder det?",
    opts:mcOptions(w).map(o=>({label:o.sv,ok:o.id===w.id})),
    wrongCard:studyCard(w),
    explain:explain(w), say:w.t, sayOnShow:true}},
  verbs:c=>{const x=c.c;
    const tn=c.tenses||sess.tenses||[x.tense];
    const pool=[...new Set(CONJ.filter(y=>y.verb===x.verb&&tn.includes(y.tense)&&(y.tense===x.tense||y.person===x.person)).map(y=>y.form))].filter(f=>f!==x.form);
    return{tab:"Verb", head:verbHead(x),
      ask:`Välj rätt form: <b>${esc(x.person)}</b> · ${esc(x.tense)}`,
      opts:shuffle([{label:x.form,ok:true,lang:true},...shuffle(pool).slice(0,4).map(f=>({label:f,ok:false,lang:true}))]),
      explain:`<p>Rätt svar: <b ${lang()}>${esc(x.full)}</b></p><p>${esc(ruleFor(x))}</p>`, say:x.full, sayOnAnswer:true}},
  cloze:c=>{const w=c.w, a=norm(w.gap.ans), seen=new Set([a]), picks=[];
    const others=[...shuffle(WORDS.filter(x=>x.gap&&x.sec===w.sec)),...shuffle(WORDS.filter(x=>x.gap&&x.sec!==w.sec))];
    for(const x of others){ if(picks.length>=4)break; const k=norm(x.gap.ans); if(!seen.has(k)){seen.add(k);picks.push(x.gap.ans)} }
    return{tab:"Mening", head:clozeHead(w), ask:`Vilket ord passar i luckan? ${clozeHint(w)}.`,
      opts:shuffle([{label:w.gap.ans,ok:true,lang:true},...picks.map(p=>({label:p,ok:false,lang:true}))]),
      explain:"", wrongCard:studyCard(w), say:w.exT, sayOnAnswer:true, onAnswer:fillGap(w)}}
};
const TYPE={
  words:c=>{const w=c.w;return{
    head:`<p class="q-prompt">${esc(w.sv)}</p>`,
    ask:`Skriv ${L.inLang} ${w.g?`(${L.genders[w.g]||w.g})`:""}`, placeholder:"Skriv här", accents:L.accents,
    accepted:variants(w.t), answer:esc(w.t), explain:explain(w), wrongCard:studyCard(w), say:w.t, override:true}},
  verbs:c=>{const x=c.c;return{tab:"Verb", head:verbHead(x),
    ask:`<b>${esc(x.person)}</b> · ${esc(x.tense)}`, placeholder:"Skriv verbformen", accents:L.verbAccents||L.accents,
    accepted:conjVariants(x), strip:true, answer:esc(x.full), alwaysAnswer:true, nearMsg:"Nästan!",
    explain:`<p>${esc(ruleFor(x))}</p>`, say:x.full}},
  cloze:c=>{const w=c.w;return{tab:"Mening", head:clozeHead(w),
    ask:`${clozeHint(w)}. Skriv ordet som saknas.`, placeholder:"Skriv det som saknas", accents:L.accents,
    accepted:[norm(w.gap.ans)], answer:esc(w.gap.ans), explain:"", wrongCard:studyCard(w), say:w.exT, override:true, onAnswer:fillGap(w)}}
};

/* ---------- Pass klart: schemaläggning ---------- */
function applyAnswer(x,id){
  const t=sess.firstType[id]||"mc", ok=sess.firstTry[id]!==false;
  x.mcR=x.mcR||0;x.mcW=x.mcW||0;x.tyR=x.tyR||0;x.tyW=x.tyW||0;
  if(t==="mc"){ ok?x.mcR++:x.mcW++; if(ok) x.f="type"; else x.f="mc"; }
  else { ok?x.tyR++:x.tyW++; x.f = ok?"type":"mc"; }
  return {t,ok};
}
function tally(E,r){ if(r.ok)E.right++; if(r.t==="mc"){E.mcN++; if(r.ok)E.mcR++;} else {E.tyN++; if(r.ok)E.tyR++;} }
function finishSession(){
  const p=S.pass, now=Date.now();
  const extra=!!sess.extra;
  const ids=[...sess.newW,...sess.due].map(w=>w.id);
  const E={p,d:now,dur:Math.min(3600,Math.round((now-sess.start)/1000)),nNew:sess.newW.length,nRep:sess.due.length,right:0,total:ids.length,mcR:0,mcN:0,tyR:0,tyN:0,extra};
  sess.newW.forEach(w=>{const x={s:0,due:p+INT[0],lp:p,ld:now}; const r=applyAnswer(x,w.id); S.w[w.id]=x; tally(E,r);});
  let newlyMastered=0;
  sess.due.forEach(w=>{
    const x=S.w[w.id]; const r=applyAnswer(x,w.id); tally(E,r);
    if(extra) return;               // extraövning flyttar inte schemat
    const was=x.s; schedule(x,r.ok,p,now); if(r.ok&&was<MASTER&&x.s>=MASTER) newlyMastered++;
  });
  S.log.push(E); if(!extra) S.pass++; delete S.run; save();
  const right=ids.filter(id=>sess.firstTry[id]!==false).length;
  const missed=ids.filter(id=>sess.firstTry[id]===false).map(id=>byId[id]);
  const mastered=extra?0:newlyMastered;
  app.innerHTML=`<section class="panel">
    <span class="label">${extra?"Extraövning klar":`Pass ${p} klart`}</span>
    <div style="display:flex;align-items:baseline;gap:10px"><span class="big">${right}/${ids.length}</span><span class="sub">rätt på första försöket</span></div>
    <p class="plan">${extra?"Extraövningen påverkar inte när orden kommer tillbaka, men den räknas i statistiken.":""}${sess.newW.length?`De ${sess.newW.length} nya orden kommer tillbaka i nästa pass.`:""}
      ${mastered?` ${mastered} ord är nu inlärda. De kommer tillbaka då och då, med allt längre mellanrum.`:""}
      ${missed.length&&!extra?" Orden du missade flyttas ned ett steg och kommer tillbaka snart.":""}</p>
    ${missed.length?`<div class="field"><span class="label">Öva lite extra på</span><ul class="missed">${missed.map(w=>`<li><span class="t" ${lang()}>${esc(w.t)}</span><span class="sv">${esc(w.sv)}</span></li>`).join("")}</ul></div>`:""}
    ${sess.daily?`<button class="btn" id="mix">Fortsätt dagens pass: blandade övningar</button>`:""}
    <div class="navrow"><button class="btn ghost" id="st">Statistik</button><button class="btn ${sess.daily?"ghost":""}" id="home">Till startsidan</button></div></section>`;
  const daily=sess.daily; if(daily){ S.dailyDay=dayKey(Date.now()); save(); }
  sess=null; boardPush(); $("#home").onclick=renderStart; $("#st").onclick=()=>setView("stats"); renderList();
  if(daily) $("#mix").onclick=startMix;
}

/* ---------- Verbträning ---------- */
function startVerbs(gid){
  const g=verbGames().find(x=>x.id===gid)||verbGames()[0];
  $("#tabs").hidden=true;
  const q=verbItems(g,12);
  sess=null;
  beginQuiz("verbs",q,{game:g,tenses:g.tenses,againFn:["verbs",g.id],label:`Verb: ${g.name}`});
}
/* ---------- Meningar ---------- */
function startCloze(){
  $("#tabs").hidden=true;
  // Ord som inte sitter än först, sedan resten, blandat inom varje grupp
  const pool=clozePool(), rest=pool.filter(w=>!isMastered(w)), done=pool.filter(isMastered);
  const q=[...shuffle(rest),...shuffle(done)].slice(0,10).map(clozeItem);
  sess=null;
  beginQuiz("cloze",shuffle(q),{againFn:["cloze"],label:"Meningar"});
}
/* ---------- Ordlista ---------- */
/* Prognos: hur många ord som ska repeteras i nästa pass och de kommande dagarna */
function statsForecast(){
  const t0=dayStart(Date.now()), xs=WORDS.map(w=>ws(w.id)).filter(Boolean);
  const rows=[{l:"nästa",n:xs.filter(isDue).length}];
  for(let i=1;i<=6;i++) rows.push({l:i===1?"i morgon":"+"+i+" d",n:xs.filter(x=>x.dd&&x.dd>=t0+i*DAY&&x.dd<t0+(i+1)*DAY).length});
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
      <button class="btn" id="go1">Kör första passet</button></section>`;
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
  const secRows=SECTIONS.map(s=>{const ws_=WORDS.filter(w=>w.sec===s.id);const k=ws_.filter(isMastered).length,l=ws_.filter(isLearned).length;
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
    <div class="games">${verbGames().map(g=>`<button class="btn ghost" data-g="${g.id}">Kör ${esc(g.name.toLowerCase())}</button>`).join("")}</div>
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
function loadCourse(code){
  return LOADING[code]=LOADING[code]||fetch(`data/${code}.json?v=${DATA_VERSION}`).then(r=>{if(!r.ok) throw new Error(r.status); return r.json();})
    .then(d=>{Object.assign(LANGUAGES[code],d); return LANGUAGES[code];})
    .catch(e=>{delete LOADING[code]; throw e;});
}
function useLang(code){
  if(LANGUAGES[code].words==null){
    app.innerHTML=`<section class="panel"><p class="plan">Hämtar ${esc(LANGUAGES[code].course||LANGUAGES[code].name)} …</p></section>`;
    loadCourse(code).then(()=>useLang(code)).catch(()=>{
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
  try{localStorage.setItem(LANG_KEY,code)}catch(e){}
  $("#title").textContent=L.title;
  $("#search").value="";
  $("#search").placeholder=`Sök ${L.inLang} eller svenska`;
  $("#course").value=code;
  $("#coursechip").textContent=`${courseName()} · nivå ${L.level||""}`;
  setView("ova");
  setSaveNote();
  cloudAttach();
}
