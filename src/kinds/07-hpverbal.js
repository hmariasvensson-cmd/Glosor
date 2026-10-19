/* ---------- Högskoleprovet: MEK, LÄS och ELF (resten av den verbala delen, föräldern 2026-10-19) ----------
   Bara kurser med innehållet (content/mek.json, las.json, elf.json; i dag Högskoleprovet ORD). Allt är egenskrivet.
   - MEK, meningskomplettering: content/mek.json = [{id, text, opts, a, why}]. Luckorna i text är "___"; varje
     alternativ har lika många delar som luckor, åtskilda av " – ". Fråge-id "mek:<id>". Sparat: S.mek[id] = {r, n, last}
     (r = rätt senast, 1/0; n = antal gånger). En runda tar MEK_RUN uppgifter: aldrig gjorda först, sedan de som var fel
     senast, sedan de som gjordes för längst sedan.
   - LÄS och ELF, läsförståelse på svenska och engelska: content/las.json och elf.json = [{id, title, text: [stycken],
     questions: [{q, opts, a, why}]}]. text och questions hämtas med texterna (LAZY_TEXTS i build.py, ensureTexts).
     Fråge-id "las:<id>:<nr>" och "elf:<id>:<nr>". Resultatet sparas i S.tx[id] = {r, n, best, last}, som Läsa texter. */
const MEK_RUN=10, MEK_SEP=" – ";
const HPV={las:{name:"LÄS",title:"Svensk läsförståelse",lang:"sv"},elf:{name:"ELF",title:"Engelsk läsförståelse",lang:"en"}};
const mekList=()=>C().mek||[];
const mekById=id=>mekList().find(x=>x.id===id);
const mekParts=o=>String(o).split(MEK_SEP);
// Meningen med luckorna; efter svaret fylls luckorna med det rätta alternativet
function mekHead(m){
  let i=0; const parts=mekParts(m.opts[m.a]);
  return `<p class="cloze mek">${esc(m.text).replace(/___/g,()=>`<span class="gap mekgap" data-gap="${i}" data-ans="${esc(parts[i++]||"")}">&nbsp;</span>`)}</p>`;
}
function mekPick(n=MEK_RUN){
  const st=S.mek||{}, all=mekList();
  const rank=m=>{ const o=st[m.id]; return !o?0:o.r?2:1; };
  return shuffle(all).sort((a,b)=>rank(a)-rank(b)||((st[a.id]||{}).last||0)-((st[b.id]||{}).last||0)).slice(0,n);
}
function startMek(){
  const items=mekPick().map(m=>({k:"mek",id:"mek:"+m.id,ref:m.id,t:"mc",noRetry:true}));
  $("#tabs").hidden=true; sess=null; beginQuiz("mek",items,{againFn:["mek"],label:"MEK: meningskomplettering"});
}
defineKind("mek",{name:"MEK",
  mc:c=>{ const m=mekById(c.ref), n=(m.text.match(/___/g)||[]).length;
    return {tab:"MEK", head:mekHead(m), ask:n>1?"Vilket alternativ passar bäst i luckorna?":"Vilket alternativ passar bäst i luckan?", letters:true,
      opts:m.opts.map((o,j)=>({label:o,ok:j===m.a})), explain:m.why?`<p>${esc(m.why)}</p>`:"",
      onAnswer:()=>app.querySelectorAll(".mekgap").forEach(g=>{ g.textContent=g.dataset.ans; g.classList.add("filled"); })}; },
  restore:ref=>mekById(ref)?{}:null,
  effect:(ref,ok)=>{ S.mek=S.mek||{}; const o=S.mek[ref]||{n:0}; S.mek[ref]={r:ok?1:0,n:(o.n||0)+1,last:Date.now()}; },
  recap:ref=>{ const m=mekById(ref); if(!m) return ""; let i=0; const p=mekParts(m.opts[m.a]); return m.text.replace(/___/g,()=>p[i++]||"___"); },
  open:startMek, again:startMek});

/* LÄS och ELF: välj en text, läs den, svara på frågorna (texten finns kvar ovanför varje fråga) */
const hpvTexts=k=>C()[k]||[];
const hpvText=(k,id)=>hpvTexts(k).find(t=>t.id===id);
const hpvBody=(k,t)=>`<div class="reading hpread" lang="${HPV[k].lang}">${(t.text||[]).map(p=>`<p>${esc(p)}</p>`).join("")}</div>`;
function openHpv(k){
  const v=HPV[k];
  pickerScreen(`${v.name}: ${v.title}`,k==="las"
    ?"Läs en sakprosatext och svara på frågorna. På provet har du ungefär en minut per fråga, inklusive läsningen."
    :"Read a text in English and answer the questions. På provet har du ungefär en minut per fråga, inklusive läsningen.",
    hpvTexts(k).map(t=>({id:t.id,title:t.title,status:txStatus(t.id),tag:t.nq?t.nq+(t.nq===1?" fråga":" frågor"):""})),id=>hpvIntro(k,id));
}
function hpvIntro(k,id){
  if(textsWait(()=>hpvIntro(k,id),HPV[k].name)) return;
  const t=hpvText(k,id), v=HPV[k]; $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">${v.name}</span>
    <h2 lang="${v.lang}">${esc(t.title)}</h2>${hpvBody(k,t)}
    <button class="btn" id="toq">Till frågorna (${t.questions.length})</button></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  $("#toq").onclick=()=>startHpvQs(k,id); $("#quit").onclick=backTo(()=>openHpv(k)); window.scrollTo(0,0);
}
function startHpvQs(k,id){
  const t=hpvText(k,id);
  const items=t.questions.map((q,i)=>({k,id:`${k}:${id}:${i}`,ref:`${id}:${i}`,t:"mc",noRetry:true}));
  sess=null; beginQuiz(k,items,{ctx:{type:k,id},label:`${HPV[k].name}: ${t.title}`});
}
const hpvQ=(k,ref)=>{ const [id,i]=ref.split(":"), t=hpvText(k,id), q=t&&(t.questions||[])[+i]; return q&&Array.isArray(q.opts)?{t,q}:null; };
function hpvMC(c){
  const {t,q}=hpvQ(c.k,c.ref), v=HPV[c.k];
  return {tab:v.name, head:`<details class="more" open><summary>Texten: ${esc(t.title)}</summary>${hpvBody(c.k,t)}</details>`,
    ask:`<b lang="${v.lang}">${esc(q.q)}</b>`, letters:true,
    opts:q.opts.map((o,j)=>({label:o,ok:j===q.a})), explain:q.why?`<p>${esc(q.why)}</p>`:""};
}
function hpvAfter(ctx,right,total){
  const k=ctx.type, t=hpvText(k,ctx.id); if(!t) return renderStart(); S.tx=S.tx||{}; const o=S.tx[ctx.id]||{};
  S.tx[ctx.id]={r:right,n:total,best:Math.max(o.best||0,right),last:Date.now()}; save();
  app.innerHTML=`<section class="panel">${resultHead(`${HPV[k].name} klar`,right,total)}
    <p class="plan">${right===total?"Alla rätt!":"Läs texten igen och se var svaren finns."}</p>
    <details class="more"><summary>Texten</summary>${hpvBody(k,t)}</details>
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="more">Fler texter</button></div></section>`;
  $("#home").onclick=renderStart; $("#more").onclick=()=>openHpv(k); window.scrollTo(0,0);
}
["las","elf"].forEach(k=>defineKind(k,{name:HPV[k].name,mc:hpvMC,restore:ref=>hpvQ(k,ref)?{}:null,after:hpvAfter,open:()=>openHpv(k),
  recap:ref=>{ const x=hpvQ(k,ref); return x?x.q.q:""; }}));

/* Statistiken: hur det går i MEK, LÄS och ELF (i "Så förbättras du", 06-hp.js) */
function hpVerbalStats(){
  const rows=[];
  if(mekList().length){ const st=Object.entries(S.mek||{}).filter(([id])=>mekById(id)), r=st.filter(([,o])=>o.r).length;
    rows.push(["MEK",`${st.length} av ${mekList().length} uppgifter gjorda`,st.length?Math.round(100*r/st.length)+" % rätt senast":"–"]); }
  for(const k of ["las","elf"]){ const ts=hpvTexts(k); if(!ts.length) continue;
    const done=ts.map(t=>(S.tx||{})[t.id]).filter(Boolean), r=done.reduce((a,o)=>a+o.r,0), n=done.reduce((a,o)=>a+o.n,0);
    rows.push([HPV[k].name,`${done.length} av ${ts.length} texter gjorda`,n?Math.round(100*r/n)+" % rätt senast":"–"]); }
  if(!rows.length) return "";
  return `<h3>MEK, LÄS och ELF</h3><table class="hpv"><tbody>${rows.map(r=>`<tr><th>${r[0]}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table>`;
}
