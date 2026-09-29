/* ---------- Meningar: luckan, diktamen, översätt och ordföljd ----------
   Bygger på ordlistans exempelmeningar (och Tatoeba-meningarna i XS). Fråge-id "<typ>:<ord-id>". */

/* ---------- Meningar (luckan i exempelmeningen) ---------- */
const clozeItem=w=>({k:"cloze",id:"cloze:"+w.id,ref:w.id,w,t:"type",canType:true});
const clozeHead=w=>`<p class="cloze" ${lang()}>${esc(w.gap.pre)}<span class="gap" id="gap">&nbsp;</span>${esc(w.gap.post)}</p><p class="ex-sv">${esc(w.exSv)}</p>`;
const fillGap=w=>()=>{const g=$("#gap");if(g){g.textContent=w.gap.ans;g.classList.add("filled")}};
function clozeHint(w){
  const bare=s=>L.hintStrip?s.replace(L.hintStrip,""):s;
  const same=variants(w.t).map(bare).includes(bare(norm(w.gap.ans)));
  return `Ordet betyder <b>${esc(w.sv)}</b>${same?"":`. Grundform: <b ${lang()}>${esc(w.t)}</b>`}`;
}
function startCloze(){
  $("#tabs").hidden=true;
  // Ord som inte sitter än först, sedan resten, blandat inom varje grupp
  const pool=clozePool(), rest=pool.filter(w=>!isMastered(w)), done=pool.filter(isMastered);
  const q=[...shuffle(rest),...shuffle(done)].slice(0,10).map(clozeItem);
  sess=null;
  beginQuiz("cloze",shuffle(q),{againFn:["cloze"],label:"Meningar"});
}
defineKind("cloze",{name:"Meningar",
  mc:c=>{const w=c.w, a=norm(w.gap.ans), seen=new Set([a]), picks=[];
    const others=[...shuffle(WORDS.filter(x=>x.gap&&x.sec===w.sec)),...shuffle(WORDS.filter(x=>x.gap&&x.sec!==w.sec))];
    for(const x of others){ if(picks.length>=4)break; const k=norm(x.gap.ans); if(!seen.has(k)){seen.add(k);picks.push(x.gap.ans)} }
    return{tab:"Mening", head:clozeHead(w), ask:`Vilket ord passar i luckan? ${clozeHint(w)}.`,
      opts:shuffle([{label:w.gap.ans,ok:true,lang:true},...picks.map(p=>({label:p,ok:false,lang:true}))]),
      explain:"", wrongCard:studyCard(w), say:w.exT, sayOnAnswer:true, onAnswer:fillGap(w)}},
  type:c=>{const w=c.w;return{tab:"Mening", head:clozeHead(w),
    ask:`${clozeHint(w)}. Skriv ordet som saknas.`, placeholder:"Skriv det som saknas", accents:L.accents,
    // Står artikeln redan före luckan (Die [Beziehung]) räknas svaret också rätt om eleven skriver den igen (die Beziehung)
    check:v=>({r:check(L.hintStrip&&!L.hintStrip.test(w.gap.ans)?v.trim().replace(new RegExp(L.hintStrip.source,"i"),""):v,[norm(w.gap.ans)])}),
    answer:w.gap.ans, explain:"", wrongCard:studyCard(w), say:w.exT, override:true, onAnswer:fillGap(w)}},
  restore:ref=>byId[ref]&&byId[ref].gap?{w:byId[ref]}:null,
  effect:(ref,ok)=>{const x=S.w[ref]; if(!x) return; x.clR=(x.clR||0)+(ok?1:0); x.clW=(x.clW||0)+(ok?0:1);},
  recap:ref=>byId[ref]?byId[ref].exT:"",
  log:e=>{e.cloze=true;},   // loggposten har cloze:true i stället för kind (så har det alltid varit)
  open:startCloze, again:startCloze});


/* ---------- Diktamen ---------- */
const dictItem=w=>({k:"dict",id:"dict:"+w.id,ref:w.id,w,t:"type",canType:true});
// Meningar ur ordlistan eller från Tatoeba (sentById)
const sentRestore=ref=>sentById(ref)?{w:sentById(ref)}:null, sentRecap=ref=>sentById(ref)?sentById(ref).exT:"";
function startDict(){
  const p=shuffle(sentencePool()).filter(w=>tok(w.exT).length>=3).slice(0,8);
  $("#tabs").hidden=true; sess=null; beginQuiz("dict",p.map(dictItem),{againFn:["dict"],label:"Diktamen"});
}
const dictType=c=>{const w=c.w;return{tab:"Diktamen",
  head:`<p class="q-prompt" style="font-size:1.3rem">Lyssna och skriv</p>${playBar()}`,
  ask:"Skriv hela meningen du hör. Du kan lyssna så många gånger du vill.",placeholder:"Skriv meningen här",accents:L.accents,
  check:v=>compareTokens(v,w.exT),answer:w.exT,explain:`<p class="ex-sv">${esc(w.exSv)}</p>${tatoebaNote(w)}`,wrongCard:studyCard(w)+tatoebaNote(w),
  say:w.exT,wire:()=>wirePlay(r=>speak(w.exT,r)),autoplay:true}};
// Andra meningar ur samma avsnitt som felalternativ, utan dubbletter (två ord kan ha samma exempelmening)
const sameText=(a,b)=>tok(a).join(" ")===tok(b).join(" ");
function otherSentences(w,n){
  const out=[];
  for(const x of shuffle(WORDS.filter(x=>x!==w&&x.sec===w.sec&&x.exT))){
    if(out.length>=n) break;
    if(!sameText(x.exT,w.exT)&&!out.some(o=>sameText(o.exT,x.exT))) out.push(x);
  }
  return out;
}
const dictMC=c=>{const w=c.w, others=otherSentences(w,3);
  return{tab:"Diktamen",head:playBar(),ask:"Vilken mening hörde du?",
    opts:shuffle([w,...others].map(x=>({label:x.exT,ok:x===w,lang:true}))),
    explain:`<p class="ex-sv">${esc(w.exSv)}</p>`,wrongCard:studyCard(w),say:w.exT,sayOnShow:true,wire:()=>wirePlay(r=>speak(w.exT,r))}};
defineKind("dict",{name:"Diktamen",mc:dictMC,type:dictType,restore:sentRestore,recap:sentRecap,
  effect:(ref,ok)=>{const x=S.w[ref]; if(x){x.dcR=(x.dcR||0)+(ok?1:0); x.dcW=(x.dcW||0)+(ok?0:1);}},
  open:startDict, again:startDict});

/* ---------- Översätt hela meningar ---------- */
function startTrans(){
  S.tr=S.tr||{};
  const p=sentencePool().filter(w=>tok(w.exT).length>=3).map(w=>({w,s:(S.tr[w.id]||{}).s||0,l:(S.tr[w.id]||{}).last||0,r:Math.random()}))
    .sort((a,b)=>a.s-b.s||a.l-b.l||a.r-b.r).slice(0,6).map(x=>({k:"trans",id:"trans:"+x.w.id,ref:x.w.id,w:x.w,t:"type",canType:true}));
  $("#tabs").hidden=true; sess=null; beginQuiz("trans",p,{againFn:["trans"],label:"Översätt meningar"});
}
const transType=c=>{const w=c.w;return{tab:"Översätt",
  head:`<p class="q-prompt" style="font-size:1.35rem">${esc(w.exSv)}</p>`,
  ask:`Skriv meningen ${L.inLang}. Den innehåller <b ${lang()}>${esc(w.t)}</b>.`,placeholder:"Skriv meningen här",accents:L.accents,
  check:v=>compareTokens(v,w.exT),selfGrade:true,answer:w.exT,explain:tatoebaNote(w),wrongCard:studyCard(w)+tatoebaNote(w),say:w.exT}};
const transMC=c=>{const w=c.w, others=otherSentences(w,3);
  return{tab:"Översätt",head:`<p class="q-prompt" style="font-size:1.35rem">${esc(w.exSv)}</p>`,ask:"Vilken är rätt översättning?",
    opts:shuffle([w,...others].map(x=>({label:x.exT,ok:x===w,lang:true}))),explain:"",wrongCard:studyCard(w),say:w.exT,sayOnAnswer:true}};
defineKind("trans",{name:"Översätt meningar",mc:transMC,type:transType,restore:sentRestore,recap:sentRecap,
  effect:(ref,ok)=>{S.tr=S.tr||{}; const x=S.tr[ref]||{s:0}; S.tr[ref]={s:ok?x.s+1:0,last:Date.now()};},
  open:startTrans, again:startTrans});

/* ---------- Ordföljd med brickor ---------- */
const orderTokens=s=>{const t=s.replace(/[«»"“”]/g,"").replace(/\s+/g," ").trim(), m=t.match(/^(.*?)\s*([.!?…]+)?$/);
  return {words:m[1].split(" ").filter(Boolean),end:m[2]||""};};
const orderItem=w=>({k:"order",id:"order:"+w.id,ref:w.id,w,t:"type",canType:true});
const orderable=w=>{const n=orderTokens(w.exT).words.length; return n>=4&&n<=12;};
function startOrder(){
  const p=shuffle(sentencePool()).filter(orderable).slice(0,8);
  $("#tabs").hidden=true; sess=null; beginQuiz("order",p.map(orderItem),{againFn:["order"],label:"Ordföljd"});
}
const orderType=c=>{const w=c.w;return{tab:"Ordföljd",render:renderTiles,o:orderTokens(w.exT),w,answer:w.exT,
  explain:`<p class="ex-sv">${esc(w.exSv)}</p>${tatoebaNote(w)}`,wrongCard:studyCard(w)+tatoebaNote(w),say:w.exT}};
function renderTiles(d){
  const words=d.o.words; let order=shuffle(words.map((x,i)=>i));
  if(order.every((v,i)=>words[v]===words[i])) order=order.reverse();
  const built=[];
  app.innerHTML=`<section class="panel"><span class="tab">${esc(d.tab||"Ordföljd")}</span>${progressHead()}
    ${d.prompt||`<p class="q-prompt" style="font-size:1.25rem">${esc(d.w.exSv)}</p>`}
    <p class="q-ask">${d.ask||""} Tryck på orden i rätt ordning. Tryck på ett ord i meningen för att ta bort det.</p>
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
    const b=built.map(i=>words[i]).join(" ");   // d.accept: godkända meningar, jämförs utan versaler och skiljetecken
    const ok=d.accept?d.accept.includes(tok(b).join(" ")):b===words.join(" ");
    sess.answered=true; $("#clr").hidden=true; $("#built").classList.add(ok?"right":"wrong");
    showTypeResult(d,{r:ok?"right":"wrong"},null); $("#submit").disabled=false;
  };
  $("#quit").onclick=pauseSession; draw();   // Avbryt sparar rundan (även Dagens pass), som i de andra frågorna
}
const orderMC=c=>{const w=c.w, o=orderTokens(w.exT), right=o.words.join(" "), alts=new Set();
  for(let i=0;i<30&&alts.size<2;i++){const s=shuffle(o.words).join(" "); if(s!==right) alts.add(s);}
  return{tab:"Ordföljd",head:`<p class="q-prompt" style="font-size:1.25rem">${esc(w.exSv)}</p>`,ask:"Vilken mening har rätt ordföljd?",
    opts:shuffle([right,...alts].map(s=>({label:s+o.end,ok:s===right,lang:true}))),explain:"",wrongCard:studyCard(w),say:w.exT,sayOnAnswer:true}};
defineKind("order",{name:"Ordföljd",mc:orderMC,type:orderType,restore:sentRestore,recap:sentRecap,
  open:startOrder, again:startOrder});
