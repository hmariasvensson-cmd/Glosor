/* ---------- Sammanfattning till föräldern och Föräldravyn ----------
   Framstegen i data/users/<uid>/… är privata, även för ägaren. Därför skriver varje elevs app en liten sammanfattning i
   summary/<uid> (ett dokument per konto; reglerna: summary läses och skrivs bara av admin, summary/{self} av eleven själv):
     {v: 1, t, profiles: {<profil>: {name, t, courses: {<kod>: {...}}}}}
   <profil> = "_" för standardprofilen (id "" i PROF), annars profilens id. Per kurs (summaryOf):
     course, level, t, words: {n, started, known, due}, min7, min30, q7, q30, days14 (minuter per dag, äldst först, i dag
     sist), active14 (dagar med någon övning av de 14), streak, last, goal, week (minuter den här veckan), writing (klara skrivuppgifter),
     exam: {name, pass, parts: [{id, sv}], sims: [{d, parts: {<del>: pct}, lv}]} (de tre senaste simuleringarna),
     gram: [{name, pct, n}] (de tre svagaste grammatikområdena), plan: {week, of, title, known, n, next},
     prep: {lv, goal, appH, h, ms: [{id, name, date, days, proj, status, needW}], parts: [{sv, pts}], tot, iv: {done, n}, week: {ok, n, phase},
     schools: [{name, prio, level, when, status, proj}], x (nivån som tal), T (målet), top (skolornas högsta krav),
     hist: [{d, x}] (nivån per dag, prepHist; läggs till i summaryFlush ur dokumentets förra version)}
     (Mot målet, prepSummary i 84-prep.js; när eleven har lagt in datum eller kursen har skolor).
   Skrivs med en fördröjning (som topplistan) från boardPush: efter varje avslutat pass, när kursen kopplas till molnet
   (start och kursbyte) och när veckomålet ändras. En kurs utan övning skrivs inte. Andra kurser och profiler i
   dokumentet ligger kvar som de var. Föräldravyn (renderParent) visas bara för ägaren (CLOUD.owner = user.isOwner()). */
const SUM={pend:{},timer:null,busy:false,again:false,unsub:null,docs:{}};
const SUM_DAYS=14, SUM_MAX=200*1024;
const sumKey=id=>id||"_";
function summaryOf(){
  const now=Date.now(), DAYMS=864e5, idx={}, days=new Array(SUM_DAYS).fill(0), act=new Array(SUM_DAYS).fill(0);
  for(let i=0;i<SUM_DAYS;i++) idx[dayIso(addDays(now,-(SUM_DAYS-1-i)))]=i;
  let s7=0,s30=0,q7=0,q30=0;
  (S.log||[]).forEach(l=>{ const d=+l.d||0, age=now-d, sec=+l.dur||0, q=+l.total||0;
    if(age<=7*DAYMS){ s7+=sec; q7+=q; } if(age<=30*DAYMS){ s30+=sec; q30+=q; }
    const i=idx[dayIso(d)]; if(i!=null){ days[i]+=sec; act[i]=1; } });
  const xs=Object.values(S.w||{}).filter(x=>x&&typeof x==="object"), st=myStats(), m=v=>Math.round(v/60);
  const out={course:courseName(),level:L.level||"",t:now,
    words:{n:WORDS.length,started:xs.length,known:xs.filter(x=>x.s>=MASTER).length,due:xs.filter(isDue).length},
    min7:m(s7),min30:m(s30),q7,q30,days14:days.map(m),active14:act.filter(Boolean).length,
    streak:st.streak,last:st.last,goal:S.goal||0,week:st.min,writing:Object.keys(S.wr||{}).length};
  const e=C().exam, sims=((S.exam&&S.exam.sims)||[]).slice(-3);
  if(e&&Array.isArray(e.parts)&&sims.length) out.exam={name:e.name||"",pass:+e.pass||0,parts:e.parts.map(p=>({id:p.id,sv:p.sv||p.id})),
    sims:sims.map(s=>{ const parts={}; Object.entries(s.parts||{}).forEach(([k,v])=>{ if(Number.isFinite(v)) parts[k]=v; });
      return {d:s.d,parts,...(s.lv?{lv:s.lv}:{})}; })};
  if(hasGrammar()){ const gt=S.gt||{};
    const g=GR().topics.filter(t=>gt[t.id]&&gt[t.id].n>=3).map(t=>({name:t.name,pct:pct(gt[t.id].r,gt[t.id].n),n:gt[t.id].n}))
      .sort((a,b)=>a.pct-b.pct).slice(0,3);
    if(g.length) out.gram=g; }
  const pr=prepSummary(); if(pr) out.prep=pr;   // Mot målet: nivå, datum, prognos och veckans plan (84-prep.js)
  const hp=isHp()&&hpBoard(); if(hp) out.hp=hp;   // Högskoleprovet ORD: provpassen {n, best, last, of, d}
  if(hasPlan()){ const i=planWeekIdx(), W=L.plan.weeks;
    if(i!=null&&i>=0&&i<W.length){ const p=planProgress(W[i]); out.plan={week:i+1,of:W.length,title:W[i].title||"",known:p.known,n:p.n,next:(W[i+1]||{}).title||""}; } }
  return out;
}
function summaryPush(){
  if(!CLOUD.db||!CLOUD.uid||!L||!L.base||!S) return;
  if(!(S.log||[]).length&&!Object.keys(S.w||{}).length) return;   // kursen är inte påbörjad
  const k=sumKey(PROF.cur); SUM.pend[k]={...(SUM.pend[k]||{}),[L.code]:summaryOf()};
  clearTimeout(SUM.timer); SUM.timer=setTimeout(summaryFlush,1500);
}
// Nivån över tid i föräldravyn: en punkt per dag {d: "ÅÅÅÅ-MM-DD", x: nivå}, de senaste PREP_HIST dagarna med en
// sammanfattning. Historiken finns bara i sammanfattningen (inte i S) och följer med från förra versionen av dokumentet.
const PREP_HIST=120;
function prepHist(old,cur){
  const h=(old&&Array.isArray(old.hist)?old.hist:[]).filter(p=>p&&typeof p.d==="string"&&Number.isFinite(+p.x)).slice(-PREP_HIST);
  if(!Number.isFinite(+cur.x)) return h;
  const d=dayIso(Date.now()), last=h[h.length-1];
  if(last&&last.d===d) last.x=+cur.x; else h.push({d,x:+cur.x});
  return h.slice(-PREP_HIST);
}
async function summaryFlush(){
  clearTimeout(SUM.timer);
  if(SUM.busy){ SUM.again=true; return; }
  const pend=SUM.pend; SUM.pend={};
  if(!Object.keys(pend).length||!CLOUD.db||!CLOUD.uid) return;
  SUM.busy=true;
  try{
    const ref=CLOUD.db.doc("summary/"+CLOUD.uid), cur=await ref.get(), old=(cur&&cur.exists&&cur.data())||{};
    const profs={}; Object.entries(boardObj(old.profiles)).forEach(([k,x])=>{ if((k==="_"||PROF_ID.test(k))&&x&&typeof x==="object") profs[k]=x; });
    Object.entries(pend).forEach(([k,c])=>{ const x=boardObj(profs[k]), oc=boardObj(x.courses);
      Object.entries(c).forEach(([code,cs])=>{ if(cs&&cs.prep) cs.prep.hist=prepHist(boardObj(oc[code]).prep,cs.prep); });
      profs[k]={...x,t:Date.now(),courses:{...oc,...c}}; });
    profLive().forEach(p=>{ const k=sumKey(p.id); if(profs[k]) profs[k].name=p.name; });
    const body={v:1,t:Date.now(),profiles:profs};
    if(bytes(JSON.stringify(body))>SUM_MAX) warnErr("sammanfattningen till föräldern blev för stor och skrevs inte",new Error("för stor"));
    else { await ref.set(body); SUM.docs[CLOUD.uid]=body; }
  }catch(e){ Object.entries(pend).forEach(([k,c])=>{ SUM.pend[k]={...c,...(SUM.pend[k]||{})}; }); warnErr("sammanfattningen till föräldern kunde inte sparas, försöker igen",e); }
  SUM.busy=false;
  if(SUM.again||Object.keys(SUM.pend).length){ SUM.again=false; SUM.timer=setTimeout(summaryFlush,3000); }
}

// Föräldravyn hämtas först när ägaren öppnar den (data/code-parent.js, se lazyRun i app.js); sammanfattningen ovan skrivs alltid
// @lazy parent
/* Föräldravyn: ett kort per konto och profil med siffror per kurs. Bara läsning. Allt kommer från elevernas dokument,
   så bara tal (num) och text genom esc(). Namn: user.profiles(ids) vid varje rendering, "Elev" om namnet saknas, och
   profilens namn för andra profiler än standardprofilen. */
function parentSubscribe(){
  if(!CLOUD.db||SUM.unsub) return;
  try{ SUM.unsub=CLOUD.db.collection("summary").onSnapshot(s=>{
    SUM.docs={}; s.docs.forEach(d=>{ if(d.exists) SUM.docs[d.id]=d.data(); });
    if(curView==="parent"&&!sess) renderParent();
  },e=>warnErr("sammanfattningarna kunde inte bevakas",e)); }catch(e){ warnErr("sammanfattningarna kunde inte bevakas",e); }
}
const pNum=v=>{ const x=+v; return Number.isFinite(x)?x:0; };
function pAgo(ts){
  ts=pNum(ts); if(!ts) return "aldrig";
  const d=Math.round((addDays(Date.now(),0)-addDays(ts,0))/864e5);
  return d<=0?"i dag":d===1?"i går":d<14?`för ${d} dagar sedan`:new Date(ts).toLocaleDateString("sv-SE");
}
// Minuter per dag de senaste 14 dagarna som staplar (inline SVG, temafärgerna, läsbar i mörkt läge)
function pSpark(days){
  const v=(Array.isArray(days)?days:[]).slice(-SUM_DAYS).map(pNum); while(v.length<SUM_DAYS) v.unshift(0);
  const W=280,H=64,mb=14,ih=H-mb-4,bw=W/SUM_DAYS, max=Math.max(10,...v);
  const today=new Date(); let g="";
  v.forEach((m,i)=>{ const h=m?Math.max(3,ih*m/max):2, x=i*bw+2, d=new Date(today); d.setDate(d.getDate()-(SUM_DAYS-1-i));
    g+=`<rect x="${x.toFixed(1)}" y="${(4+ih-h).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${m?"var(--c2)":"var(--grid)"}" data-tip="${esc(`${d.getDate()}/${d.getMonth()+1}: ${m} min`)}"/>`; });
  g+=`<text x="2" y="${H-2}">för 14 dagar sedan</text><text x="${W-2}" y="${H-2}" text-anchor="end">i dag</text>`;
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Minuter per dag de senaste 14 dagarna: ${esc(v.join(", "))}">${g}</svg>`;
}
// Mot målet (84-prep.js): nivå nu, varje datum med prognos, provdelarna och veckans plan. Allt är elevens egen data, så
// varje fält escapas och kontrolleras.
const PREP_TXT={ok:"rätt spår",near:"nära, behöver öka lite",far:"behöver mer tid"};
// Stapel från A1 till målet (eller skolornas högsta krav): var eleven ligger nu och strecken för B1 och B2
function pLvBar(x){
  const v=+x.x; if(!Number.isFinite(v)) return "";
  const hi=Math.max(3,Math.ceil(Math.max(+x.T||3,+x.top||0))), lo=1, pc=n=>Math.max(0,Math.min(100,100*(n-lo)/(hi-lo)));
  const ticks=[]; for(let n=lo;n<=hi;n++) ticks.push(n);
  return `<div class="plvbar" role="img" aria-label="Nivå ungefär ${esc(String(x.lv||""))} på skalan A1 till ${esc(LV_NAMES[hi]||"")}">
    <div class="plvtrack"><i style="width:${pc(v).toFixed(1)}%"></i>${ticks.map(n=>`<span class="plvtick${n===Math.round(+x.T)?" goal":""}" style="left:${pc(n).toFixed(1)}%"></span>`).join("")}${Number.isFinite(+x.top)&&+x.top>0?`<span class="plvreq" style="left:${pc(+x.top).toFixed(1)}%"></span>`:""}</div>
    <div class="plvlabels">${ticks.map(n=>`<span style="left:${pc(n).toFixed(1)}%">${esc(LV_NAMES[n]||"")}</span>`).join("")}</div>
    <p class="foot">Stapeln: nivån nu. Tjockt streck: målet (${esc(String(x.goal||""))}).${Number.isFinite(+x.top)&&+x.top>0?` Rött streck: skolornas högsta krav (${esc(lvShort(+x.top))}).`:""}</p></div>`;
}
// Nivån över tid (prep.hist): en linje med en punkt per dag
function pLvHist(x){
  const h=(Array.isArray(x.hist)?x.hist:[]).filter(p=>p&&typeof p.d==="string"&&Number.isFinite(+p.x));
  if(h.length<2) return `<p class="foot">Kurvan över nivån visas när det finns sammanfattningar från minst två dagar.</p>`;
  const W=300,H=80,pad=18, xs=h.map(p=>+new Date(p.d)), t0=Math.min(...xs), t1=Math.max(...xs)||t0+1, vs=h.map(p=>+p.x);
  const lo=Math.floor(Math.min(...vs)*2)/2, hi=Math.max(lo+.5,Math.ceil(Math.max(...vs)*2)/2);
  const X=t=>pad+(W-2*pad)*(t-t0)/Math.max(1,t1-t0), Y=v=>H-pad-(H-2*pad)*(v-lo)/(hi-lo);
  const pts=h.map((p,i)=>`${X(xs[i]).toFixed(1)},${Y(vs[i]).toFixed(1)}`).join(" ");
  return `<svg class="plvhist" viewBox="0 0 ${W} ${H}" role="img" aria-label="Nivån över tid, från ${esc(h[0].d)} till ${esc(h[h.length-1].d)}">
    <line class="gl" x1="${pad}" x2="${W-pad}" y1="${Y(lo)}" y2="${Y(lo)}"/><line class="gl" x1="${pad}" x2="${W-pad}" y1="${Y(hi)}" y2="${Y(hi)}"/>
    <text x="2" y="${Y(hi)+4}">${esc(lvShort(hi))}</text><text x="2" y="${Y(lo)+4}">${esc(lvShort(lo))}</text>
    <polyline points="${pts}" fill="none"/>${h.map((p,i)=>`<circle cx="${X(xs[i]).toFixed(1)}" cy="${Y(vs[i]).toFixed(1)}" r="3"><title>${esc(p.d)}: ${esc(lvShort(vs[i]))}</title></circle>`).join("")}</svg>`;
}
function pPrep(x){
  if(!x||typeof x!=="object") return "";
  const ms=(Array.isArray(x.ms)?x.ms:[]).filter(m=>m&&typeof m==="object"), sc=(Array.isArray(x.schools)?x.schools:[]).filter(m=>m&&typeof m==="object");
  if(!ms.length&&!sc.length) return "";
  const parts=(Array.isArray(x.parts)?x.parts:[]).filter(p=>p&&typeof p==="object");
  const w=x.week&&typeof x.week==="object"?x.week:null, iv=x.iv&&typeof x.iv==="object"?x.iv:null;
  return `<div class="pexam" data-prep><span class="label">Mot målet · nu ungefär ${esc(String(x.lv||"?"))}${x.goal?`, mål ${esc(String(x.goal))}`:""}</span>
    ${pLvBar(x)}${pLvHist(x)}
    ${ms.length?`<ul class="prepms">${ms.map(m=>`<li><span><b>${esc(String(m.name||""))}</b><small>${esc(String(m.date||""))} · ${esc(pNum(m.days))} dagar · med nuvarande takt ungefär ${esc(String(m.proj||"?"))}${m.status!=="ok"&&pNum(m.needW)?`; behöver ungefär ${esc(String(m.needW).replace(".",","))} h i veckan`:""}</small></span><span class="prepst ${m.status==="ok"?"ok":m.status==="near"?"near":"far"}">${esc(PREP_TXT[m.status]||"")}</span></li>`).join("")}</ul>`:""}
    ${sc.length?`<p class="plan" data-schools>Skolornas krav: ${sc.map(r=>`${esc(String(r.name||""))} ${r.status==="none"?"inget krav":`${esc(String(r.level||""))} (${esc(PREP_TXT[r.status]||"")})`}`).join(", ")}.</p>`:""}
    <p class="plan">${parts.length?`Provdelarna: ${parts.map(p=>`${esc(String(p.sv||""))} ${p.pts==null?"inte gjord":esc(pNum(p.pts))+"/25"}`).join(", ")}${x.tot!=null?` (ungefär ${esc(pNum(x.tot))}/100)`:""}. `:""}Övar ${esc(String(x.appH==null?"?":x.appH).replace(".",","))} h i veckan i appen${pNum(x.h)?` och ${esc(String(x.h).replace(".",","))} h på lektioner`:""}.${iv?` Intervjufrågor med eget svar: ${esc(pNum(iv.done))} av ${esc(pNum(iv.n))}.`:""}${w?` Veckans plan (${esc(String(w.phase||""))}): ${esc(pNum(w.ok))} av ${esc(pNum(w.n))} klara.`:""}</p></div>`;
}
function pCourse(code,c){
  const o=v=>v&&typeof v==="object"?v:{}, w=o(c.words), ex=o(c.exam), pass=pNum(ex.pass);
  const name=String(c.course||(LANGUAGES[code]||{}).course||code);
  const exParts=(Array.isArray(ex.parts)?ex.parts:[]).filter(p=>p&&typeof p==="object");
  const sims=(Array.isArray(ex.sims)?ex.sims:[]).filter(s=>s&&typeof s==="object").slice(-3).reverse();
  const tag=v=>v==null||!Number.isFinite(+v)?"–":`<b class="${pass&&+v>=pass?"pass":"fail"}">${esc(Math.round(+v))} %</b>`;
  const gram=(Array.isArray(c.gram)?c.gram:[]).filter(x=>x&&typeof x==="object");
  const plan=c.plan&&typeof c.plan==="object"?c.plan:null, goal=pNum(c.goal);
  return `<div class="pcourse"><h3>${esc(name)}${c.level?` · ${esc(c.level)}`:""}</h3>
    <div class="stats4">
      <div class="stat"><b>${esc(pNum(w.known))}</b><span>ord kan</span></div>
      <div class="stat"><b>${esc(pNum(w.started))}</b><span>ord påbörjade${pNum(w.n)?` av ${esc(pNum(w.n))}`:""}</span></div>
      <div class="stat"><b>${esc(pNum(w.due))}</b><span>att repetera nu</span></div>
      <div class="stat"><b>${esc(pNum(c.min7))}</b><span>minuter senaste 7 dagarna</span></div>
    </div>
    ${pSpark(c.days14)}
    <p class="plan">Senaste 30 dagarna ${esc(pNum(c.min30))} minuter och ${esc(pNum(c.q30))} frågor (7 dagar: ${esc(pNum(c.q7))} frågor). Övat ${esc(pNum(c.active14))} av 14 dagar, ${esc(pNum(c.streak))} dagar i rad. Senast aktiv ${esc(pAgo(c.last))}.${goal?` Veckomål ${esc(goal)} min: ${esc(pNum(c.week))} min den här veckan${pNum(c.week)>=goal?" ✓":""}.`:""}</p>
    ${sims.length&&exParts.length?`<div class="pexam"><span class="label">Provsimulering${ex.name?` · ${esc(ex.name)}`:""}${pass?` · godkänt från ${esc(pass)} %`:""}</span>
      <div class="tblwrap"><table class="tbl"><tr><th>Datum</th>${exParts.map(p=>`<th>${esc(p.sv||p.id)}</th>`).join("")}</tr>
      ${sims.map(s=>`<tr><td>${esc(new Date(pNum(s.d)).toLocaleDateString("sv-SE"))}${s.lv?` (${esc(s.lv)})`:""}</td>${exParts.map(p=>`<td>${tag(o(s.parts)[p.id])}</td>`).join("")}</tr>`).join("")}</table></div></div>`:""}
    ${pPrep(c.prep)}
    ${gram.length?`<p class="plan">Svagast i grammatik: ${gram.map(g=>`${esc(g.name)} (${esc(pNum(g.pct))} %)`).join(", ")}.</p>`:""}
    ${o(c.hp).n?`<p class="plan" data-hp>Provpass ORD: ${esc(pNum(o(c.hp).n))} st, bästa ${esc(pNum(o(c.hp).best))}/${esc(pNum(o(c.hp).of)||10)}, senaste ${esc(pNum(o(c.hp).last))}/${esc(pNum(o(c.hp).of)||10)}.</p>`:""}
    <p class="plan">Skrivuppgifter klara: ${esc(pNum(c.writing))}.${plan?` Studieplan: vecka ${esc(pNum(plan.week))} av ${esc(pNum(plan.of))}${plan.title?` (${esc(plan.title)})`:""}, ${esc(pNum(plan.known))} av ${esc(pNum(plan.n))} av veckans ord kan.${plan.next?` Nästa vecka: ${esc(plan.next)}.`:""}`:""}</p></div>`;
}
async function renderParent(){
  curView="parent"; $("#tabs").hidden=false; tabSel("board");
  if(!CLOUD.owner||!CLOUD.db){ renderBoard(); return; }
  parentSubscribe();
  const o=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
  const cards=[];
  Object.entries(SUM.docs).forEach(([uid,d])=>Object.entries(o(o(d).profiles)).forEach(([k,p])=>{
    p=o(p); const cs=Object.entries(o(p.courses)).filter(([,c])=>c&&typeof c==="object")
      .sort((a,b)=>pNum(b[1].last)-pNum(a[1].last));
    if(cs.length) cards.push({uid,k,name:k==="_"?"":(typeof p.name==="string"?p.name.trim().slice(0,24):""),cs,last:Math.max(0,...cs.map(([,c])=>pNum(c.last)))}); }));
  cards.sort((a,b)=>b.last-a.last);
  let ps={}; try{ ps=await CLOUD.user.profiles([...new Set(cards.map(c=>c.uid))]); }catch(e){ warnErr("namnen i föräldravyn kunde inte hämtas",e); }
  if(curView!=="parent"||sess) return;
  const acc=c=>(ps[c.uid]&&ps[c.uid].name)||"Elev";
  app.innerHTML=`<section class="panel"><h2>Föräldravy</h2>
    <p class="plan">En sammanfattning som varje elevs app skickar efter varje pass. Bara du som äger appen ser den. Eleverna ser själva vad som delas under Tyck till.</p>
    <button class="btn ghost" id="parentback">Tillbaka till topplistan</button></section>
  ${cards.length?cards.map(c=>`<section class="panel pcard"><h2>${esc(c.name||acc(c))}${c.name?` <small>${esc(acc(c))}</small>`:""}</h2>
    <p class="foot">Senast aktiv ${esc(pAgo(c.last))}</p>
    ${c.cs.map(([code,x])=>pCourse(code,x)).join("")}</section>`).join("")
    :`<section class="panel"><p class="plan">Inga sammanfattningar än. De kommer när eleverna har övat med den nya versionen av appen.</p></section>`}`;
  $("#parentback").onclick=()=>setView("board");
}
