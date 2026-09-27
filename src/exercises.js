/* =====================================================================
   Övningar utöver glosquizet. Varje övningstyp registrerar:
     MC[k] / TYPE[k]  frågan som flerval eller skrivfråga (se quizmotorn i app.js)
     RESTORE[k]       återskapar en fråga från dess ref när ett avbrutet pass fortsätts
     EFFECT[k]        vad ett första svar gör med sparad statistik
     RECAP[k]         text som visas i listan "titta på de här en gång till"
     AFTER[typ]       egen slutskärm (texter och berättelser)
   Frågornas id är "<typ>:<ref>", så att typerna kan blandas i Dagens pass.
   Innehållet (texter, berättelser, fraser …) ligger i languages/<kod>/content/*.json.
   ===================================================================== */
const C=()=>L.content||{};
const RESTORE={}, EFFECT={}, RECAP={}, AFTER={};
const KIND_NAMES={dict:"Diktamen",trans:"Översätt meningar",order:"Ordföljd",phr:"Samtalsfraser",story:"Berättelser",
  lq:"Hörförståelse",rq:"Läsförståelse",culture:"Kultur",write:"Skrivna texter"};
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const hasWord=(text,w)=>new RegExp("(^|[^\\p{L}])"+reEsc(w)+"(?![\\p{L}])","iu").test(text);

/* ---------- Ordlistan med Mina ord ---------- */
// Ord som eleven sparar från texterna läggs som ett eget avsnitt och repeteras som vanliga glosor
function rebuildWords(){
  const mine=(S.mine||[]).map(m=>({id:"mine:"+m.t,sec:"mine",t:m.t,sv:m.sv,g:m.g||"",exT:m.ex.replace(/[\[\]]/g,""),exSv:m.exSv||"",
    ety:m.src?`Sparat från texten <b>${esc(m.src)}</b>.`:"",gap:findGap(m.t,m.ex)}));
  WORDS=[...L.base.words,...mine];
  SECTIONS=mine.length?[...L.base.sections,{id:"mine",name:"Mina ord"}]:L.base.sections.slice();
  byId=Object.fromEntries(WORDS.map(w=>[w.id,w]));
}
const isMine=t=>(S.mine||[]).some(m=>m.t===t);
function addMine(g,surface,line,text){
  S.mine=S.mine||[]; if(isMine(g.t)) return;
  const i=line.fr.indexOf(surface);
  const ex=i<0?line.fr:line.fr.slice(0,i)+"["+surface+"]"+line.fr.slice(i+surface.length);
  S.mine.push({t:g.t,sv:g.sv,g:g.g||"",ex,exSv:line.sv||"",src:text.title});
  rebuildWords(); save();
}

/* ---------- Hjälpare ---------- */
function curSec(){
  if(S.src!=="auto") return S.src;
  const n=pickNew()[0]; if(n) return n.sec;
  const l=WORDS.filter(isLearned).pop(); return (l||WORDS[0]||{}).sec;
}
// Meningar att öva på: exempelmeningarna för ord man har börjat lära sig, annars kapitlet man är på
function sentencePool(min=6){
  let p=WORDS.filter(isLearned);
  if(p.length<min){const s=curSec(); p=[...p,...WORDS.filter(w=>w.sec===s&&!p.includes(w))];}
  return p;
}
const clozePool=()=>WORDS.filter(w=>w.gap&&isLearned(w));
const tok=s=>s.toLowerCase().replace(/[’`´]/g,"'").replace(/[«»"“”!?.,;:…()\-–—]/g," ").replace(/\s+/g," ").trim().split(" ").filter(Boolean);

// Jämför elevens mening med facit ord för ord (tål skiljetecken och versaler)
function compareTokens(input,target){
  const a=tok(input), b=tok(target); if(!a.length) return {r:"empty"};
  const A=a.map(deacc), B=b.map(deacc), m=a.length, n=b.length;
  const D=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)D[i][j]=A[i]===B[j]?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
  const mark=new Array(n).fill("miss"); let i=0,j=0,extra=0,accent=0;
  while(i<m&&j<n){
    if(A[i]===B[j]){ if(a[i]===b[j]) mark[j]="ok"; else {mark[j]="acc"; accent++;} i++; j++; }
    else if(D[i+1][j]>=D[i][j+1]){extra++; i++;} else j++;
  }
  extra+=m-i;
  const miss=mark.filter(x=>x==="miss").length;
  const r=!miss&&!extra?(accent?"accent":"right"):(miss+extra<=1?"near":"wrong");
  const html=r==="right"?"":`<p class="diff" ${lang()}>${b.map((w,k)=>`<span class="${mark[k]}">${esc(w)}</span>`).join(" ")}</p>
    <p class="foot">${[miss?`<span class="miss">understruket</span> = saknas eller fel`:"",accent?`<span class="acc">gult</span> = accent`:"",extra?`${extra} ord för mycket`:""].filter(Boolean).join(" · ")}</p>`;
  return {r,html};
}

/* Uppläsning av flera repliker i rad, med olika röst eller tonhöjd för talare B */
let seqId=0;
function stopSpeech(){seqId++; try{speechSynthesis.cancel()}catch(e){}}
function speakSeq(lines,rate,onLine){
  stopSpeech(); const id=seqId;
  let vs=[]; try{vs=speechSynthesis.getVoices().filter(v=>(v.lang||"").toLowerCase().startsWith(L.tts.slice(0,2)))}catch(e){}
  const a=voice||vs[0]||null, b=vs.find(v=>v!==a)||a;
  let k=0;
  const next=()=>{
    if(id!==seqId) return;
    if(k>=lines.length){ if(onLine) onLine(-1); return; }
    const ln=lines[k]; if(onLine) onLine(k);
    try{
      const u=new SpeechSynthesisUtterance(cleanSay(ln.fr)); u.lang=L.tts;
      const isB=ln.who==="B"; const v=isB?b:a; if(v) u.voice=v; u.pitch=isB&&b===a?1.3:1; u.rate=rate||baseRate();
      u.onend=()=>{k++; setTimeout(next,300)}; u.onerror=()=>{if(id===seqId){k++; setTimeout(next,300)}};
      speechSynthesis.speak(u);
    }catch(e){}
  };
  next();
}
const playBar=(extra="")=>`<div class="listen"><button type="button" class="btn ghost" data-pl="1">${PLAY} Spela upp</button><button type="button" class="btn ghost" data-pl="slow">Långsamt</button>${extra}</div>`;
function wirePlay(fn){ app.querySelectorAll("[data-pl]").forEach(b=>b.onclick=()=>fn(b.dataset.pl==="slow"?.6:undefined)); }

/* Text där man kan trycka på ord för att se betydelsen (och spara dem i Mina ord) */
const glossKey=w=>{let k=w.toLowerCase().replace(/’/g,"'"); if(L.elision) k=k.replace(L.elision,""); return k;};
function tapText(lines,gloss,o={}){
  return lines.map((ln,i)=>`<p class="tl${ln.who&&ln.who!=="N"?" said":""}" data-line="${i}" ${lang()}>${ln.fr.split(/([\p{L}'’\-]+)/u).map(part=>{
      if(!/^[\p{L}'’\-]+$/u.test(part)) return esc(part);
      const k=glossKey(part); return gloss&&gloss[k]?`<span class="gl" data-k="${esc(k)}" data-i="${i}">${esc(part)}</span>`:esc(part);
    }).join("")}${o.lineSpeak?` <button type="button" class="speak xs" data-say="${esc(ln.fr)}" aria-label="Läs upp meningen">${SPK}</button>`:""}</p>
    ${o.sv?`<p class="tl-sv" hidden>${esc(ln.sv||"")}</p>`:""}`).join("");
}
function wireGloss(text){
  app.querySelectorAll(".gl").forEach(el=>el.onclick=()=>{
    const g=text.gloss[el.dataset.k], box=$("#gbox"), line=text.lines[+el.dataset.i]; if(!g||!box) return;
    const known=WORDS.find(w=>w.sec!=="mine"&&(w.t===g.t||variants(w.t).includes(norm(g.t))));
    box.hidden=false;
    box.innerHTML=`<p><b ${lang()}>${esc(g.t)}</b> ${gtag(g.g)} ${esc(g.sv)} <button type="button" class="speak xs" data-say="${esc(g.t)}" aria-label="Läs upp">${SPK}</button></p>
      ${known?`<p class="foot">${isLearned(known)?"Du övar redan på det här ordet.":"Ordet finns i ordlistan och kommer i quizet."}</p>`
        :isMine(g.t)?`<p class="foot">Sparat i Mina ord.</p>`:`<button type="button" class="btn ghost" id="addw">Spara i Mina ord</button>`}`;
    app.querySelectorAll(".gl.sel").forEach(x=>x.classList.remove("sel")); el.classList.add("sel");
    if($("#addw")) $("#addw").onclick=()=>{ addMine(g,el.textContent,line,text); el.classList.add("saved");
      $("#addw").outerHTML=`<p class="foot">Sparat i Mina ord. Det kommer med bland de nya orden i nästa pass.</p>`; };
  });
}
function wireSvToggle(){
  const b=$("#svt"); if(!b) return;
  b.onclick=()=>{const show=b.dataset.on!=="1"; b.dataset.on=show?"1":"0"; app.querySelectorAll(".tl-sv").forEach(p=>p.hidden=!show);
    b.textContent=show?"Dölj svensk översättning":"Visa svensk översättning";};
}
function highlightLine(i){ app.querySelectorAll(".tl").forEach(p=>p.classList.toggle("now",+p.dataset.line===i)); }
function wireAccents(el){
  app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
    const s=el.selectionStart??el.value.length, e=el.selectionEnd??el.value.length;
    el.value=el.value.slice(0,s)+b.dataset.c+el.value.slice(e); el.focus(); el.setSelectionRange(s+1,s+1); el.dispatchEvent(new Event("input"));
  });
}
function copyText(el,msgEl){
  const done=t=>{ if(msgEl) msgEl.textContent=t; };
  try{ navigator.clipboard.writeText(el.value).then(()=>done("Kopierat. Klistra in texten i ett mejl eller i skolans plattform."),()=>{el.select();done("Texten är markerad. Kopiera den med menyn eller Cmd/Ctrl+C.")}); }
  catch(e){ el.select(); done("Texten är markerad. Kopiera den med menyn eller Cmd/Ctrl+C."); }
}
// Lista att välja text/berättelse/uppgift från
function pickerScreen(title,intro,items,onPick){
  stopSpeech(); $("#tabs").hidden=true; sess=null; curView="ova";
  const cur=curSec();
  app.innerHTML=`<section class="panel"><h2>${esc(title)}</h2><p class="plan">${intro}</p>
    <div class="games">${items.map(it=>`<button class="game${it.sec===cur?" here":""}" data-pick="${esc(it.id)}"><span><b ${lang()}>${esc(it.title)}</b>
      <small>${esc([it.sec?secName(it.sec):"",it.sec===cur?"ditt kapitel just nu":"",it.status||""].filter(Boolean).join(" · "))}</small></span>
      <span class="go" aria-hidden="true">${it.status?"✓":"›"}</span></button>`).join("")}</div></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  app.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>onPick(b.dataset.pick));
  $("#quit").onclick=renderStart; window.scrollTo(0,0);
}
const resultHead=(label,right,total)=>`<span class="label">${esc(label)}</span>
  <div style="display:flex;align-items:baseline;gap:10px"><span class="big">${right}/${total}</span><span class="sub">rätt på första försöket</span></div>`;

/* ---------- Frågetyper som redan fanns: verb och meningar ---------- */
const verbItems=(g,n)=>shuffle(CONJ.filter(c=>g.tenses.includes(c.tense))).slice(0,n).map(c=>{
  const ref=c.verb+"|"+c.tense+"|"+c.person; return {k:"verbs",id:"verbs:"+ref,ref,c,w:{id:ref},t:"type",canType:true,tenses:g.tenses};});
RESTORE.verbs=ref=>CONJBY[ref]?{c:CONJBY[ref],w:{id:ref}}:null;
EFFECT.verbs=(ref,ok)=>{const c=CONJBY[ref]; if(!c) return;
  [[S.vt,c.tense],[S.vv,c.verb]].forEach(([o,k])=>{o[k]=o[k]||{r:0,n:0}; o[k].n++; if(ok) o[k].r++;});};
RECAP.verbs=ref=>CONJBY[ref]?CONJBY[ref].full:"";
const clozeItem=w=>({k:"cloze",id:"cloze:"+w.id,ref:w.id,w,t:"type",canType:true});
RESTORE.cloze=ref=>byId[ref]&&byId[ref].gap?{w:byId[ref]}:null;
EFFECT.cloze=(ref,ok)=>{const x=S.w[ref]; if(!x) return; x.clR=(x.clR||0)+(ok?1:0); x.clW=(x.clW||0)+(ok?0:1);};
RECAP.cloze=ref=>byId[ref]?byId[ref].exT:"";

/* ---------- Diktamen ---------- */
const dictItem=w=>({k:"dict",id:"dict:"+w.id,ref:w.id,w,t:"type",canType:true});
RESTORE.dict=RESTORE.trans=RESTORE.order=ref=>byId[ref]?{w:byId[ref]}:null;
function startDict(){
  const p=shuffle(sentencePool()).filter(w=>tok(w.exT).length>=3).slice(0,8);
  $("#tabs").hidden=true; sess=null; beginQuiz("dict",p.map(dictItem),{againFn:["dict"],label:"Diktamen"});
}
TYPE.dict=c=>{const w=c.w;return{tab:"Diktamen",
  head:`<p class="q-prompt" style="font-size:1.3rem">Lyssna och skriv</p>${playBar()}`,
  ask:"Skriv hela meningen du hör. Du kan lyssna så många gånger du vill.",placeholder:"Skriv meningen här",accents:L.accents,
  check:v=>compareTokens(v,w.exT),answer:esc(w.exT),explain:`<p class="ex-sv">${esc(w.exSv)}</p>`,wrongCard:studyCard(w),
  say:w.exT,wire:()=>wirePlay(r=>speak(w.exT,r)),autoplay:true}};
MC.dict=c=>{const w=c.w, others=shuffle(WORDS.filter(x=>x!==w&&x.exT!==w.exT&&x.sec===w.sec)).slice(0,3);
  return{tab:"Diktamen",head:playBar(),ask:"Vilken mening hörde du?",
    opts:shuffle([w,...others].map(x=>({label:x.exT,ok:x===w,lang:true}))),
    explain:`<p class="ex-sv">${esc(w.exSv)}</p>`,wrongCard:studyCard(w),say:w.exT,sayOnShow:true,wire:()=>wirePlay(r=>speak(w.exT,r))}};
EFFECT.dict=(ref,ok)=>{const x=S.w[ref]; if(x){x.dcR=(x.dcR||0)+(ok?1:0); x.dcW=(x.dcW||0)+(ok?0:1);}};
RECAP.dict=ref=>byId[ref]?byId[ref].exT:"";

/* ---------- Översätt hela meningar ---------- */
function startTrans(){
  S.tr=S.tr||{};
  const p=sentencePool().filter(w=>tok(w.exT).length>=3).map(w=>({w,s:(S.tr[w.id]||{}).s||0,l:(S.tr[w.id]||{}).last||0,r:Math.random()}))
    .sort((a,b)=>a.s-b.s||a.l-b.l||a.r-b.r).slice(0,6).map(x=>({k:"trans",id:"trans:"+x.w.id,ref:x.w.id,w:x.w,t:"type",canType:true}));
  $("#tabs").hidden=true; sess=null; beginQuiz("trans",p,{againFn:["trans"],label:"Översätt meningar"});
}
TYPE.trans=c=>{const w=c.w;return{tab:"Översätt",
  head:`<p class="q-prompt" style="font-size:1.35rem">${esc(w.exSv)}</p>`,
  ask:`Skriv meningen ${L.inLang}. Den innehåller <b ${lang()}>${esc(w.t)}</b>.`,placeholder:"Skriv meningen här",accents:L.accents,
  check:v=>compareTokens(v,w.exT),selfGrade:true,answer:esc(w.exT),explain:"",wrongCard:studyCard(w),say:w.exT}};
MC.trans=c=>{const w=c.w, others=shuffle(WORDS.filter(x=>x!==w&&x.exT!==w.exT&&x.sec===w.sec)).slice(0,3);
  return{tab:"Översätt",head:`<p class="q-prompt" style="font-size:1.35rem">${esc(w.exSv)}</p>`,ask:"Vilken är rätt översättning?",
    opts:shuffle([w,...others].map(x=>({label:x.exT,ok:x===w,lang:true}))),explain:"",wrongCard:studyCard(w),say:w.exT,sayOnAnswer:true}};
EFFECT.trans=(ref,ok)=>{S.tr=S.tr||{}; const x=S.tr[ref]||{s:0}; S.tr[ref]={s:ok?x.s+1:0,last:Date.now()};};
RECAP.trans=ref=>byId[ref]?byId[ref].exT:"";

/* ---------- Ordföljd med brickor ---------- */
const orderTokens=s=>{const t=s.replace(/[«»"“”]/g,"").replace(/\s+/g," ").trim(), m=t.match(/^(.*?)\s*([.!?…]+)?$/);
  return {words:m[1].split(" ").filter(Boolean),end:m[2]||""};};
const orderItem=w=>({k:"order",id:"order:"+w.id,ref:w.id,w,t:"type",canType:true});
const orderable=w=>{const n=orderTokens(w.exT).words.length; return n>=4&&n<=12;};
function startOrder(){
  const p=shuffle(sentencePool()).filter(orderable).slice(0,8);
  $("#tabs").hidden=true; sess=null; beginQuiz("order",p.map(orderItem),{againFn:["order"],label:"Ordföljd"});
}
TYPE.order=c=>{const w=c.w;return{tab:"Ordföljd",render:renderTiles,o:orderTokens(w.exT),w,answer:esc(w.exT),
  explain:`<p class="ex-sv">${esc(w.exSv)}</p>`,wrongCard:studyCard(w),say:w.exT}};
function renderTiles(d){
  const words=d.o.words; let order=shuffle(words.map((x,i)=>i));
  if(order.every((v,i)=>words[v]===words[i])) order=order.reverse();
  const built=[];
  app.innerHTML=`<section class="panel"><span class="tab">Ordföljd</span>${progressHead()}
    <p class="q-prompt" style="font-size:1.25rem">${esc(d.w.exSv)}</p>
    <p class="q-ask">Tryck på orden i rätt ordning. Tryck på ett ord i meningen för att ta bort det.</p>
    <div class="built" id="built" ${lang()}></div><div class="tiles" id="tiles" ${lang()}></div>
    <div id="fb"></div>
    <div class="navrow"><button type="button" class="btn ghost" id="clr">Börja om</button><button class="btn" id="submit" disabled>Svara</button></div></section>
    ${quitBtn()}`;
  const draw=()=>{
    $("#built").innerHTML=built.map((i,k)=>`<button type="button" class="tile on" data-b="${k}">${esc(words[i])}</button>`).join("")
      +(built.length===words.length&&d.o.end?`<span class="end">${esc(d.o.end)}</span>`:"");
    $("#tiles").innerHTML=order.map(i=>built.includes(i)?`<span class="tile used">${esc(words[i])}</span>`:`<button type="button" class="tile" data-t="${i}">${esc(words[i])}</button>`).join("");
    app.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{if(!sess.answered){built.push(+b.dataset.t);draw()}});
    app.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{if(!sess.answered){built.splice(+b.dataset.b,1);draw()}});
    if(!sess.answered) $("#submit").disabled=built.length!==words.length;
  };
  $("#clr").onclick=()=>{if(!sess.answered){built.length=0;draw()}};
  $("#submit").onclick=()=>{
    if(sess.answered) return nextQ();
    const ok=built.map(i=>words[i]).join(" ")===words.join(" ");
    sess.answered=true; $("#clr").hidden=true; $("#built").classList.add(ok?"right":"wrong");
    showTypeResult(d,{r:ok?"right":"wrong"},null); $("#submit").disabled=false;
  };
  $("#quit").onclick=quitSession; draw();
}
MC.order=c=>{const w=c.w, o=orderTokens(w.exT), right=o.words.join(" "), alts=new Set();
  for(let i=0;i<30&&alts.size<2;i++){const s=shuffle(o.words).join(" "); if(s!==right) alts.add(s);}
  return{tab:"Ordföljd",head:`<p class="q-prompt" style="font-size:1.25rem">${esc(w.exSv)}</p>`,ask:"Vilken mening har rätt ordföljd?",
    opts:shuffle([right,...alts].map(s=>({label:s+o.end,ok:s===right,lang:true}))),explain:"",wrongCard:studyCard(w),say:w.exT,sayOnAnswer:true}};
RECAP.order=ref=>byId[ref]?byId[ref].exT:"";

/* ---------- Samtalsfraser ---------- */
const phrById=id=>(C().phrases||[]).find(p=>p.id===id);
function phraseItems(n){
  S.ph=S.ph||{};
  return (C().phrases||[]).map(p=>({p,s:(S.ph[p.id]||{}).s||0,l:(S.ph[p.id]||{}).last||0,r:Math.random()}))
    .sort((a,b)=>a.s-b.s||a.l-b.l||a.r-b.r).slice(0,n)
    .map(x=>({k:"phr",id:"phr:"+x.p.id,ref:x.p.id,t:x.s>=1?"type":"mc",canType:true}));
}
function startPhrases(){ $("#tabs").hidden=true; sess=null; beginQuiz("phr",shuffle(phraseItems(8)),{againFn:["phr"],label:"Samtalsfraser"}); }
RESTORE.phr=ref=>phrById(ref)?{}:null;
MC.phr=c=>{const p=phrById(c.ref);return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,ask:"Vad säger du?",
  opts:shuffle([{label:p.fr,ok:true,lang:true},...p.alt.map(a=>({label:a,ok:false,lang:true}))]),
  explain:`<p>${esc(p.why)}</p>`,say:p.fr,sayOnAnswer:true}};
TYPE.phr=c=>{const p=phrById(c.ref), nm=s=>norm(s.replace(/,/g," "));return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,
  ask:`Skriv vad du säger ${L.inLang}.`,placeholder:"Skriv frasen",accents:L.accents,
  check:v=>({r:check(v.replace(/,/g," "),[nm(p.fr)])}),answer:esc(p.fr),explain:`<p>${esc(p.why)}</p>`,say:p.fr,override:true}};
EFFECT.phr=(ref,ok)=>{S.ph=S.ph||{}; const x=S.ph[ref]||{s:0}; S.ph[ref]={s:ok?x.s+1:0,last:Date.now()};};
RECAP.phr=ref=>(phrById(ref)||{}).fr||"";

/* ---------- Berättelser: tempus och bindeord ---------- */
const storyById=id=>(C().stories||[]).find(s=>s.id===id);
function parseStory(s){
  const parts=[], gaps=[]; let last=0;
  s.text.replace(/\[([^\]]+)\]/g,(m,inner,idx)=>{parts.push(s.text.slice(last,idx)); const opts=inner.split("|");
    gaps.push({ans:opts[0],opts,...((s.gaps||[])[gaps.length]||{})}); last=idx+m.length; return m;});
  parts.push(s.text.slice(last)); return {parts,gaps};
}
function openStories(){
  S.stb=S.stb||{};
  pickerScreen("Berättelser","Läs berättelsen och välj rätt form i varje lucka: imparfait eller passé composé, och rätt bindeord.",
    (C().stories||[]).map(s=>({id:s.id,title:s.title,sec:s.sec,status:S.stb[s.id]!==undefined?`bäst ${S.stb[s.id]}/${parseStory(s).gaps.length}`:""})),startStory);
}
function startStory(id){
  const s=storyById(id); if(!s) return openStories();
  const items=parseStory(s).gaps.map((g,i)=>({k:"story",id:`story:${id}:${i}`,ref:`${id}:${i}`,t:"mc",canType:false}));
  $("#tabs").hidden=true; sess=null; beginQuiz("story",items,{ctx:{type:"story",id},againFn:["story",id],label:`Berättelse: ${s.title}`});
}
RESTORE.story=ref=>storyById(ref.split(":")[0])?{}:null;
MC.story=c=>{
  const [id,gi]=c.ref.split(":"), s=storyById(id), p=parseStory(s), g=p.gaps[+gi];
  const html=p.parts.map((t,i)=>esc(t)+(i<p.gaps.length?(i<+gi?`<b class="sg done">${esc(p.gaps[i].ans)}</b>`
    :i===+gi?`<span class="sg cur" id="gap">&nbsp;</span>`:`<span class="sg">…</span>`):"")).join("");
  return{tab:"Berättelse",head:`<p class="story" ${lang()}>${html}</p>`,
    ask:g.cat==="bindeord"?"Vilket bindeord passar i den markerade luckan?":"Vilken form passar i den markerade luckan?",
    opts:shuffle(g.opts.map((o,i)=>({label:o,ok:i===0,lang:true}))),explain:g.why?`<p>${esc(g.why)}</p>`:"",
    wire:()=>{const e=$("#gap"); if(e&&e.scrollIntoView) e.scrollIntoView({block:"center"});},
    onAnswer:()=>{const e=$("#gap"); if(e){e.textContent=g.ans; e.classList.add("filled")}}};
};
EFFECT.story=(ref,ok)=>{const [id,i]=ref.split(":"), s=storyById(id); if(!s) return;
  const k=((s.gaps||[])[+i]||{}).cat==="bindeord"?"bindeord":"tempus"; S.st=S.st||{}; const o=S.st[k]||{r:0,n:0}; o.n++; if(ok)o.r++; S.st[k]=o;};
RECAP.story=ref=>{const [id,i]=ref.split(":"), s=storyById(id); if(!s) return ""; const g=parseStory(s).gaps[+i]; return g?g.ans:"";};
AFTER.story=(ctx,right,total)=>{
  const s=storyById(ctx.id), p=parseStory(s); S.stb=S.stb||{}; S.stb[ctx.id]=Math.max(S.stb[ctx.id]||0,right); save();
  const full=p.parts.map((t,i)=>t+(i<p.gaps.length?p.gaps[i].ans:"")).join("");
  app.innerHTML=`<section class="panel">${resultHead(`Berättelse: ${s.title}`,right,total)}
    <p class="story" ${lang()}>${p.parts.map((t,i)=>esc(t)+(i<p.gaps.length?`<b class="sg done">${esc(p.gaps[i].ans)}</b>`:"")).join("")}</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <details class="more"><summary>Visa svensk översättning</summary><p class="ex-sv">${esc(s.sv||"")}</p></details>
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="more">Fler berättelser</button></div></section>`;
  wirePlay(r=>speak(full,r)); $("#stop").onclick=stopSpeech;
  $("#home").onclick=()=>{stopSpeech();renderStart()}; $("#more").onclick=()=>{stopSpeech();openStories()};
};

/* ---------- Hörförståelse och läsförståelse ---------- */
const textById=(k,id)=>(C()[k==="lq"?"listening":"reading"]||[]).find(t=>t.id===id);
const txStatus=id=>{const o=(S.tx||{})[id]; return o?`${o.best}/${o.n} rätt`:"";};
function openListening(){
  pickerScreen("Hörförståelse","Lyssna på en dialog eller berättelse utan att se texten. Svara på frågorna, och läs sedan texten medan du lyssnar igen.",
    (C().listening||[]).map(t=>({id:t.id,title:t.title,sec:t.sec,status:txStatus(t.id)})),listenIntro);
}
function listenIntro(id){
  const t=textById("lq",id); stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Lyssna</span><span class="label">${esc(secName(t.sec))}</span>
    <h2 ${lang()}>${esc(t.title)}</h2>
    <p class="plan">Lyssna utan att läsa. Efteråt kommer ${t.questions.length} frågor, och du kan lyssna igen medan du svarar. Sist får du se texten.</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <button class="btn" id="toq">Till frågorna</button></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(t.lines,r)); $("#stop").onclick=stopSpeech;
  $("#toq").onclick=()=>{stopSpeech(); startTextQs("lq",id)}; $("#quit").onclick=openListening;
}
function openReading(){
  pickerScreen("Läsa texter","Läs en längre text. Tryck på ord du inte kan för att se vad de betyder och spara dem i Mina ord. Sist kommer några frågor.",
    (C().reading||[]).map(t=>({id:t.id,title:t.title,sec:t.sec,status:txStatus(t.id)})),readIntro);
}
function readIntro(id){
  const t=textById("rq",id); stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Läsa</span><span class="label">${esc(secName(t.sec))}</span>
    <h2 ${lang()}>${esc(t.title)}</h2>
    <p class="plan">Tryck på ett understruket ord för att se vad det betyder.</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <div class="reading">${tapText(t.lines,t.gloss,{sv:true})}</div>
    <div class="glossbox" id="gbox" hidden></div>
    <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button>
    <button class="btn" id="toq">Till frågorna</button></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(t.lines,r,highlightLine)); $("#stop").onclick=stopSpeech; wireGloss(t); wireSvToggle();
  $("#toq").onclick=()=>{stopSpeech(); startTextQs("rq",id)}; $("#quit").onclick=()=>{stopSpeech();openReading()};
}
function startTextQs(k,id){
  const t=textById(k,id);
  const items=t.questions.map((q,i)=>({k,id:`${k}:${id}:${i}`,ref:`${id}:${i}`,t:"mc",noRetry:true}));
  sess=null; beginQuiz(k,items,{ctx:{type:k,id},label:(k==="lq"?"Hörförståelse: ":"Läsförståelse: ")+t.title});
}
RESTORE.lq=ref=>textById("lq",ref.split(":")[0])?{}:null;
RESTORE.rq=ref=>textById("rq",ref.split(":")[0])?{}:null;
function textQ(c){
  const k=c.k, [id,i]=c.ref.split(":"), t=textById(k,id), q=t.questions[+i];
  const kind={helhet:"Helheten",detalj:"Detaljer",tolkning:"Tolka"}[q.type]||"";
  return{tab:k==="lq"?"Lyssna":"Läsa",
    head:k==="lq"?playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)
      :`<details class="more"><summary>Visa texten igen</summary><div class="reading">${tapText(t.lines,null)}</div></details>`,
    ask:`${kind?`<span class="label">${kind}</span><br>`:""}<b>${esc(q.q)}</b>`,
    opts:q.opts.map((o,j)=>({label:o,ok:j===q.a})),explain:q.why?`<p>${esc(q.why)}</p>`:"",
    wire:k==="lq"?()=>{wirePlay(r=>speakSeq(t.lines,r)); $("#stop").onclick=stopSpeech;}:null};
}
MC.lq=MC.rq=textQ;
AFTER.lq=AFTER.rq=(ctx,right,total)=>{
  const k=ctx.type, t=textById(k,ctx.id); S.tx=S.tx||{}; const o=S.tx[ctx.id]||{};
  S.tx[ctx.id]={r:right,n:total,best:Math.max(o.best||0,right),last:Date.now()}; save();
  app.innerHTML=`<section class="panel">${resultHead(k==="lq"?"Hörförståelse klar":"Läsförståelse klar",right,total)}
    <p class="plan">${k==="lq"?"Här är texten. Lyssna en gång till medan du läser. Tryck på understrukna ord för att se vad de betyder."
      :"Bra jobbat! Ord du sparade finns under Mina ord och kommer med i nästa pass."}</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <div class="reading">${tapText(t.lines,t.gloss,{sv:true,lineSpeak:true})}</div>
    <div class="glossbox" id="gbox" hidden></div>
    <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button>
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="more">${k==="lq"?"Fler hörövningar":"Fler texter"}</button></div></section>`;
  wirePlay(r=>speakSeq(t.lines,r,highlightLine)); $("#stop").onclick=stopSpeech; wireGloss(t); wireSvToggle();
  $("#home").onclick=()=>{stopSpeech();renderStart()}; $("#more").onclick=()=>{stopSpeech();(k==="lq"?openListening:openReading)()};
  window.scrollTo(0,0);
};

/* ---------- Kultur ---------- */
function openCulture(){
  S.cu=S.cu||{};
  pickerScreen("Kultur","Läs en kort text om Frankrike, svara på en fråga och jämför med hur det är i Sverige.",
    (C().culture||[]).map(c=>({id:c.id,title:c.title,sec:c.sec,status:S.cu[c.id]?"klar":""})),cultureScreen);
}
function cultureScreen(id){
  const c=(C().culture||[]).find(x=>x.id===id); S.drafts=S.drafts||{}; S.cu=S.cu||{};
  const dk="c:"+id, start=Date.now(); let qok=null;
  $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Kultur</span><span class="label">${esc(secName(c.sec))}</span>
    <h2 ${lang()}>${esc(c.title)}</h2>${playBar()}
    <div class="reading">${tapText(c.lines,c.gloss,{sv:true})}</div><div class="glossbox" id="gbox" hidden></div>
    <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button></section>
  <section class="panel"><p class="q-ask"><b>${esc(c.q.q)}</b></p>
    <div class="opts">${c.q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="fb"></div></section>
  <section class="panel"><h2>Och i Sverige?</h2><p class="plan">${esc(c.ask)}</p>
    <textarea class="answer-in wtext" id="ctext" rows="4" ${lang()} autocapitalize="sentences" spellcheck="false" placeholder="Skriv här">${esc(S.drafts[dk]||"")}</textarea>
    ${accentKeys(L.accents)}
    <details class="more"><summary>Visa ett exempelsvar</summary><p class="ex-t" ${lang()}>${esc(c.model)}</p><p class="ex-sv">${esc(c.modelSv||"")}</p></details>
    <p class="foot" id="cmsg"></p>
    <div class="navrow"><button type="button" class="btn ghost" id="copy">Kopiera texten</button><button class="btn" id="done">Klar</button></div></section>
  <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(c.lines,r,highlightLine)); wireGloss(c); wireSvToggle();
  app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    if(qok!==null) return; const i=+b.dataset.i; qok=i===c.q.a;
    app.querySelectorAll(".opt").forEach((x,k)=>{x.disabled=true; if(k===c.q.a)x.classList.add("right"); else if(k===i)x.classList.add("wrong");});
    $("#fb").innerHTML=`<div class="feedback ${qok?"ok":"bad"}"><strong>${qok?"Rätt!":"Inte riktigt."}</strong><p>${esc(c.q.why||"")}</p></div>`;
  });
  const ta=$("#ctext"); let tm=null; wireAccents(ta);
  ta.oninput=()=>{clearTimeout(tm); tm=setTimeout(()=>{S.drafts[dk]=ta.value; save();},800);};
  $("#copy").onclick=()=>copyText(ta,$("#cmsg"));
  $("#done").onclick=()=>{ S.drafts[dk]=ta.value; S.cu[id]={q:!!qok,words:tok(ta.value).length,last:Date.now()};
    S.log.push({kind:"culture",d:Date.now(),dur:Math.min(3600,Math.round((Date.now()-start)/1000)),right:qok?1:0,total:1}); save(); boardPush(); openCulture(); };
  $("#quit").onclick=()=>{stopSpeech();openCulture()};
  window.scrollTo(0,0);
}

/* ---------- Skriv en text till läraren ---------- */
function openWriting(){
  S.wr=S.wr||{};
  pickerScreen("Skriv en text","Välj en skrivuppgift. Checklistan visar hur det går medan du skriver. Kopiera texten och skicka den till din lärare för kommentarer.",
    (C().prompts||[]).map(p=>({id:p.id,title:p.title,sec:p.sec,status:S.wr[p.id]?`${S.wr[p.id].words} ord`:""})),writeScreen);
}
function writeChecks(p,text){
  const n=tok(text).length, need=p.need||{}, out=[];
  out.push({ok:n>=p.min&&n<=p.max,label:`Antal ord: ${n} (mål ${p.min}–${p.max})`});
  if(need.connectors){const f=(L.connectors||[]).filter(c=>hasWord(text,c)); out.push({ok:f.length>=need.connectors,label:`Bindeord: ${f.length} av ${need.connectors}${f.length?` (${f.join(", ")})`:""}`});}
  if(need.chapterWords&&p.sec){const f=WORDS.filter(w=>w.sec===p.sec&&variants(w.t).some(v=>v.length>2&&hasWord(text,v))).map(w=>w.t);
    out.push({ok:f.length>=need.chapterWords,label:`Ord från kapitlet: ${f.length} av ${need.chapterWords}${f.length?` (${f.slice(0,5).join(", ")})`:""}`});}
  (need.tenses||[]).forEach(t=>{const rx=(L.tenseCheck||{})[t]; if(rx) out.push({ok:rx(text),label:`${t[0].toUpperCase()+t.slice(1)} verkar finnas med`});});
  return out;
}
function writeScreen(id){
  const p=(C().prompts||[]).find(x=>x.id===id); S.drafts=S.drafts||{}; S.wr=S.wr||{};
  const dk="w:"+id, start=Date.now();
  $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Skriva</span>${p.sec?`<span class="label">${esc(secName(p.sec))}</span>`:""}
    <h2>${esc(p.title)}</h2><p class="plan">${esc(p.task)}</p>
    <ul class="checklist" id="checks"></ul>
    <textarea class="answer-in wtext" id="wtext" rows="10" ${lang()} autocapitalize="sentences" spellcheck="false" placeholder="Skriv din text här">${esc(S.drafts[dk]||"")}</textarea>
    ${accentKeys(L.accents)}
    <p class="foot" id="wmsg">Texten sparas medan du skriver.</p>
    <div class="navrow"><button type="button" class="btn ghost" id="copy">Kopiera texten</button><button class="btn" id="done">Klar</button></div>
    <details class="more"><summary>Visa en exempeltext</summary><p class="ex-t" ${lang()}>${esc(p.model||"")}</p><p class="ex-sv">${esc(p.modelSv||"")}</p></details></section>
  <button class="quit" id="quit">Tillbaka</button>`;
  const ta=$("#wtext"); let tm=null; wireAccents(ta);
  const draw=()=>{$("#checks").innerHTML=writeChecks(p,ta.value).map(c=>`<li class="${c.ok?"ok":""}">${esc(c.label)}</li>`).join("");};
  ta.oninput=()=>{draw(); clearTimeout(tm); tm=setTimeout(()=>{S.drafts[dk]=ta.value; save(); $("#wmsg").textContent="Sparat.";},800);};
  draw();
  $("#copy").onclick=()=>copyText(ta,$("#wmsg"));
  $("#done").onclick=()=>{ const n=tok(ta.value).length; if(!n) return;
    S.drafts[dk]=ta.value; S.wr[id]={words:n,last:Date.now()};
    S.log.push({kind:"write",d:Date.now(),dur:Math.min(3600,Math.round((Date.now()-start)/1000)),right:0,total:0,words:n}); save(); boardPush();
    $("#wmsg").textContent="Klart! Glöm inte att kopiera texten och skicka den till din lärare."; };
  $("#quit").onclick=openWriting;
  window.scrollTo(0,0);
}

/* ---------- Dagens pass och den blandade rundan ---------- */
function dailyPanel(newW,due){
  const n=newW.length+due.length;
  return `<section class="panel daily"><h2>Dagens pass</h2>
    <p class="plan">${n?`Först glosorna (${n} frågor), sedan en blandad runda`:"En blandad runda"} med diktamen, verb, ordföljd, samtalsfraser och meningar. Ungefär 15 minuter.</p>
    <button class="btn" id="daily">Starta dagens pass</button></section>`;
}
function startDaily(newW,due){
  if(newW.length||due.length){ startSession(newW,due); sess.daily=true; snapRun(); }
  else startMix();
}
function startMix(){
  const items=[], add=(arr,n)=>items.push(...shuffle(arr).slice(0,n));
  const sp=sentencePool().filter(w=>tok(w.exT).length>=3);
  add(sp.map(dictItem),3);
  const g=verbGames().find(x=>x.id==="tempus")||verbGames()[0]; if(g) add(verbItems(g,8),4);
  add(sp.filter(orderable).map(orderItem),2);
  if((C().phrases||[]).length) add(phraseItems(6),3);
  add(clozePool().map(clozeItem),3);
  if(!items.length) return renderStart();
  $("#tabs").hidden=true; sess=null; beginQuiz("mix",shuffle(items),{againFn:["mix"],label:"Blandad runda"});
}

/* ---------- Gemensam slutskärm för alla övningar utom glosquizet ---------- */
const AGAIN={verbs:startVerbs,cloze:startCloze,dict:startDict,trans:startTrans,order:startOrder,phr:startPhrases,mix:startMix,story:startStory};
function finishGeneric(){
  const now=Date.now(), ids=Object.keys(sess.firstTry), dur=Math.min(3600,Math.round((now-sess.start)/1000)), by={};
  ids.forEach(id=>{const i=id.indexOf(":"), k=id.slice(0,i), ref=id.slice(i+1), ok=!!sess.firstTry[id];
    (by[k]=by[k]||[]).push({ref,ok}); if(EFFECT[k]) EFFECT[k](ref,ok);});
  Object.entries(by).forEach(([k,a])=>{
    const e={d:now,dur:Math.round(dur*a.length/Math.max(1,ids.length)),right:a.filter(x=>x.ok).length,total:a.length};
    if(k==="verbs"){e.verb=true; e.game=sess.game?sess.game.id:"mix";} else if(k==="cloze") e.cloze=true; else e.kind=k;
    S.log.push(e);
  });
  delete S.run; save(); boardPush();
  const right=ids.filter(id=>sess.firstTry[id]).length, ctx=sess.ctx, againFn=sess.againFn, label=sess.label||"Övningen";
  const missed=ids.filter(id=>!sess.firstTry[id]).map(id=>{const i=id.indexOf(":"),k=id.slice(0,i);return RECAP[k]?RECAP[k](id.slice(i+1)):""}).filter(Boolean);
  sess=null;
  if(ctx&&AFTER[ctx.type]) return AFTER[ctx.type](ctx,right,ids.length);
  app.innerHTML=`<section class="panel">${resultHead(`${label} klar`,right,ids.length)}
    ${missed.length?`<div class="field"><span class="label">Titta på de här en gång till</span><ul class="missed">${missed.map(m=>`<li><span ${lang()}>${esc(m)}</span><button type="button" class="speak xs" data-say="${esc(m)}" aria-label="Läs upp">${SPK}</button></li>`).join("")}</ul></div>`:""}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button>${againFn?`<button class="btn" id="again">En runda till</button>`:""}</div>
    <button class="btn ghost" id="st">Se statistik</button></section>`;
  $("#home").onclick=renderStart; $("#st").onclick=()=>setView("stats");
  if(againFn) $("#again").onclick=()=>AGAIN[againFn[0]](againFn[1]);
  renderList();
}

/* ---------- Startsidans panel med alla övningar ---------- */
function gamesPanel(){
  const c=C(), n=clozePool().length, lname=L.name.toLowerCase();
  const g=(id,title,sub,dis)=>`<button class="game" data-ex="${id}" ${dis?"disabled":""}><span><b>${title}</b><small>${sub}</small></span><span class="go" aria-hidden="true">›</span></button>`;
  const groups=[
    ["Ord och meningar",[
      g("cloze","Meningar",n<4?"Lär dig några ord i quizet först.":"Fyll i luckan i en mening.",n<4),
      g("dict","Diktamen","Lyssna på en mening och skriv den."),
      g("trans","Översätt meningar",`Från svenska till ${lname}, hela meningar.`),
      g("order","Ordföljd","Bygg meningen i rätt ordning.")]],
    ["Lyssna och läsa",[
      c.listening&&g("lq","Hörförståelse","Lyssna på en dialog och svara på frågor."),
      c.reading&&g("rq","Läsa texter","Tryck på okända ord och spara dem i Mina ord."),
      c.culture&&g("culture","Kultur","Kort fakta, en fråga och en jämförelse med Sverige.")]],
    ["Grammatik",[
      ...verbGames().map(v=>`<button class="game" data-g="${v.id}"><span><b>Verb: ${esc(v.name)}</b><small>${esc(v.sub||"")}</small></span><span class="go" aria-hidden="true">›</span></button>`),
      c.stories&&g("story","Berättelser","Välj rätt tempus och bindeord i en berättelse.")]],
    ["Tala och skriva",[
      c.phrases&&g("phr","Samtalsfraser","Vad man säger när man inte förstår, vill säga sin åsikt …"),
      c.prompts&&g("write","Skriv en text","Skrivuppgift med checklista, att skicka till läraren.")]]
  ];
  return `<section class="panel"><h2>Fler övningar</h2>${groups.map(([t,items])=>{items=items.filter(Boolean);
    return items.length?`<div class="exgroup"><span class="label">${t}</span><div class="games">${items.join("")}</div></div>`:"";}).join("")}</section>`;
}
function wireGames(){
  const F={cloze:startCloze,dict:startDict,trans:startTrans,order:startOrder,lq:openListening,rq:openReading,culture:openCulture,story:openStories,phr:startPhrases,write:openWriting};
  app.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>F[b.dataset.ex]());
  app.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>startVerbs(b.dataset.g));
}

/* ---------- Statistik för övningarna ---------- */
function statsExercises(){
  const logs=S.log.filter(l=>l.kind); if(!logs.length) return "";
  const agg={}; logs.forEach(l=>{const a=agg[l.kind]=agg[l.kind]||{r:0,n:0,c:0,w:0}; a.r+=l.right||0; a.n+=l.total||0; a.c++; a.w+=l.words||0;});
  const rows=Object.entries(agg).filter(([k])=>k!=="write").map(([k,a])=>meter(`${KIND_NAMES[k]||k} · ${a.c} ${a.c===1?"gång":"gånger"}`,a.r,a.n)).join("");
  const st=S.st||{}, t=st.tempus||{}, b=st.bindeord||{};
  return `<section class="panel"><h2>Övningar</h2>${rows}
    ${t.n||b.n?`<p class="plan">I berättelserna: tempus ${pct(t.r,t.n)??"–"}% rätt, bindeord ${pct(b.r,b.n)??"–"}% rätt.</p>`:""}
    ${agg.write?`<p class="plan">Du har skrivit ${agg.write.c} ${agg.write.c===1?"text":"texter"}, sammanlagt ${agg.write.w} ord.</p>`:""}
    ${(S.mine||[]).length?`<p class="plan">${S.mine.length} ord sparade från texterna i Mina ord.</p>`:""}</section>`;
}
