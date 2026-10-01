/* ---------- Provträning: uppgifter i språkprovets format (DELF A1–B2, Goethe A1–C1 m.fl.) ----------
   Uppgifterna ligger i languages/<kod>/content/exam.json. Läs- och höruppgifter rättas direkt, skriv- och
   taluppgifter bedöms av Claude (sample) efter provets kriterier. Resultaten sparas i S.exam:
   {t: {<uppgift>: {pct, best, n, last}}, sims: [{d, parts: {<del>: pct}, tasks: {<uppgift>: pct}, min}], simRun}
   (tasks och min finns i simuleringar från och med hela-provet-simuleringen, september 2026).
   Provsimuleringen tar en uppgift per övning/Teil (fältet teil) i läsa, lyssna och skriva, och klockan går
   för hela delen med provets tid (parts[].time), som på provet.
   S.exam.simRun = den pågående simuleringen, så att den överlever en omladdning (hela provet tar upp till tre timmar):
   {ids, i, res: {<uppgift>: {pct, r, n}}, ends: {<del>: tid}, start, seen, cur: {id, ans}, code, lv?}. seen = senast
   eleven var i simuleringen (sparas efter varje steg och en gång i minuten). När simuleringen återupptas flyttas
   ends och start fram med tiden appen var stängd, så att klockan fortsätter med den tid som var kvar. cur = svaren
   i uppgiften som pågår. Fältet tas bort när simuleringen är klar eller avbruten. Gamla S.exam utan fältet fungerar.

   SPEC för uppgiftstyperna (fältet type; exempel och regler i docs/provformat.md, "Uppgiftstyper i exam.json"):
     (utan type)   qs → flerval ("mc"), minWords → skriva ("write"), annars tala ("speak")
     type "match"  Para ihop: items [{q, sv?, a, why?}] paras ihop med opts [{fr, sv?} eller "text"], som visas som
                   A, B, C … a = index i opts, eller -1 för "0: inget passar" när uppgiften har none (texten för
                   det valet, "" = standardtext). Fler opts än items. reuse: true om samma alternativ får vara
                   facit flera gånger (annars högst en gång, build.py kontrollerar).
     type "gaps"   Lucktext med flerval per lucka (Sprachbausteine, CELI "competenza linguistica"): lines med
                   markörerna {1}, {2} … i fr (i ordning), och gaps [{opts, a, why?}]. Med bank (en lista ord)
                   väljer alla luckor ur banken och gaps [{a, why?}] pekar in i den.
     type "short"  Kortsvar: items [{q, a: [godkända svar], why?}], svaret skrivs med 1–3 ord (maxWords, standard 3).
                   Rättningen struntar i versaler, accenter, ß/ss, skiljetecken och extra mellanslag (exNorm), men
                   stavningen i övrigt räknas. Skriv alla godkända varianter i a ("15. März", "fünfzehnten März").
     type "pick"   Bildval (DELF A1/A2, CELI): items [{q, sv?, opts: [ikonnycklar ur EX_ICONS], a, why?}], a = index i
                   opts. Bilderna är emoji ur den inbyggda uppsättningen EX_ICONS (väder, transport, mat, klockslag,
                   skyltar …), eftersom bilder inte kan hämtas utifrån. Klockslagen heter kl1 … kl12 och kl1.30 … kl12.30.
     type "chart"  Grafikbeskrivning (TestDaF Schreiben): chart {kind: "bar"|"line", title, unit?, labels, series:
                   [{name, values}] (1–3 serier, lika många värden som labels), source?} ritas som SVG, och eleven skriver
                   task med minWords–maxWords ord. Bedöms av Claude som en skrivuppgift (siffrorna ingår i prompten).
     type "timed"  Talat svar på tid (TestDaF Sprechen): task, prep och speak i SEKUNDER. Först förberedelse, sedan
                   taltid med klocka; eleven skriver eller dikterar svaret och kan få Claudes kommentar (nivåstyrd).
                   En vanlig taluppgift (utan type) får samma timer med fältet speak; då är även prep i sekunder.
   Alla typer kan ha lines (text att läsa, eller att lyssna på: plays eller en hördel) och sim: false = extrauppgift
   utanför provets format (t.ex. telc i en Goethe-kurs), som finns i listan men inte i simuleringen. Resultatet
   sparas som för flerval (andel rätt av alla items), så simuleringen och nivåmätaren fungerar som förut.
   Tala (speak, timed) ingår aldrig i simuleringen.

   NIVÅER: en kurs kan ha provdelar på flera nivåer (Franska 3: DELF B1 och delar med level "A2"). Uppgiftens nivå
   = uppgiftens level, delens level, annars provets (exMainLv). "Hela provet" erbjuds en gång per nivå och tar bara
   uppgifter på den nivån (EXSIM.lv och sims[].lv, valfria fält). Nivåmätaren (80-level.js) räknar varje del mot sin nivå.
   SKALA: resultatet visas också i provets egen skala (scale i uppgiften, delen eller exam.json, annars ur provets
   namn): "delf" = poäng av 25 per del, "tdn" = TestDaF-nivå TDN 3/4/5 (ungefärligt ur andel rätt), "pct" = procent
   (Goethe, CELI, telc). Det som sparas är alltid procent. */
const EX=()=>C().exam;
const hasExam=()=>!!(EX()&&(EX().tasks||[]).length);
const exTask=id=>(EX().tasks||[]).find(t=>t.id===id);
const exPart=id=>(EX().parts||[]).find(p=>p.id===id)||{id,name:id,sv:id};
const EX_TYPES=["match","gaps","short","pick","chart","timed"];
// k = typen, räknad av build.py i indexet (uppgiften utan qs, lines …) innan provfilen är hämtad
const exKind=t=>t.k||(EX_TYPES.includes(t.type)?t.type:t.qs?"mc":t.minWords?"write":"speak");
/* Provfilen (data/<kod>-exam.json, se ensureExam i app.js) hämtas första gången en skärm behöver uppgifternas innehåll.
   examWait(fn): är provet redan hämtat returneras false och anroparen fortsätter; annars visas "Hämtar provuppgifterna",
   fn körs när filen kommit (om eleven fortfarande väntar på samma kurs) och true returneras. Går hämtningen inte
   (offline) visas ett meddelande med Försök igen. Används först i openExam, examTask, startExamSim, simResume och openTalk. */
let EXWAIT=0;
function examWait(fn){
  if(examReady()) return false;
  const code=L.code, n=++EXWAIT, back=RETURN_TO||renderStart;
  const page=body=>{ app.innerHTML=`<section class="panel" id="exwait">${body}</section><button class="quit" id="quit">Tillbaka</button>`;
    $("#quit").onclick=()=>{ EXWAIT++; back(); }; };
  const here=()=>n===EXWAIT&&L.code===code&&!!$("#exwait");
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  page(`<span class="tab">Prov</span><p class="plan">Hämtar provuppgifterna …</p>`);
  ensureExam().then(()=>{ if(here()) fn(); }).catch(()=>{ if(!here()) return;
    page(`<span class="tab">Prov</span><h2>Provuppgifterna kunde inte hämtas</h2><p class="plan">Kontrollera internetanslutningen och försök igen. Övningarna som redan är hämtade fungerar som vanligt.</p><button class="btn" id="exretry">Försök igen</button>`);
    $("#exretry").onclick=()=>{ if(!examWait(fn)) fn(); }; });
  return true;
}
// Antal poäng (items) i en läs- eller höruppgift
const exItems=t=>{const k=exKind(t); return ((k==="mc"?t.qs:k==="gaps"?t.gaps:["match","short","pick"].includes(k)?t.items:null)||[]).length;};
const exSpoken=t=>{const k=exKind(t); return k==="speak"||k==="timed";};
// Ingår i simuleringen: allt utom tala och extrauppgifter (sim: false)
const simOk=t=>!exSpoken(t)&&t.sim!==false;
// Nivåer (se NIVÅER ovan): provets huvudnivå, delens och uppgiftens
const exMainLv=()=>cefrOf(EX().level)||cefrOf(EX().name)||cefrOf(L.exam&&L.exam.level)||courseLevel();
const exPartLv=pid=>cefrOf(exPart(pid).level)||exMainLv();
const exTaskLv=t=>cefrOf(t.level)||exPartLv(t.part);
// Nivåerna som går att simulera, provets huvudnivå först, sedan fallande (B1, A2)
const simLvs=()=>{ const m=exMainLv(); return [...new Set(EX().tasks.filter(simOk).map(exTaskLv))].sort((a,b)=>(b===m)-(a===m)||b.localeCompare(a)); };
// Provets namn på en viss nivå: "DELF B1" → "DELF A2"
const exNameLv=lv=>{ const n=EX().name||"", m=cefrOf(n); return !lv||lv===m?n:m?n.replace(/[ABC][12]/,lv):`${n} ${lv}`; };
// Skalan (se SKALA ovan) för en uppgift eller en del
function exScaleOf(t,pid){
  const s=(t&&t.scale)||exPart(pid||(t&&t.part)).scale||EX().scale; if(s) return s;
  const n=String(EX().name||""); return /\b(DELF|DALF)\b/.test(n)?"delf":/^TestDaF/i.test(n)?"tdn":"pct";
}
// TestDaF-nivå ur andel rätt (ungefärligt: TDN 5 ≥ 80 %, TDN 4 ≥ 60 %, TDN 3 ≥ 40 %)
const exTdn=p=>p>=80?"TDN 5":p>=60?"TDN 4":p>=40?"TDN 3":"under TDN 3";
const exScaleText=(p,sc)=>p==null?"":sc==="delf"?`${String(Math.round(p/2)/2).replace(".",",")}/25 p`:sc==="tdn"?exTdn(p):"";
// Sekunder som text: 90 → "1 min 30 s"
const exSecs=s=>{ s=Math.max(0,Math.round(+s||0)); const m=Math.floor(s/60), r=s%60; return m?`${m} min${r?` ${r} s`:""}`:`${r} s`; };
// Taluppgift på tid (type "timed", eller tala med speak): prep och speak i sekunder
const exTimed=t=>exSpoken(t)&&+t.speak>0;
// Ordgränsen: "minst" (DELF) eller "cirka" när provet anger ungefärligt antal ord (Goethe: approxWords i exam.json)
const exWords=()=>EX().approxWords?"cirka":"minst";
const exState=()=>(S.exam=S.exam||{t:{},sims:[]});
let EXSIM=null;      // pågående provsimulering, samma objekt som S.exam.simRun (se ovan)
let EXCLOCK=null;

function exClock(min,label){
  clearInterval(EXCLOCK);
  let end=Date.now()+min*60000;
  // I simuleringen gäller delens tid för alla övningar i delen: klockan fortsätter från förra övningen
  if(EXSIM){ const p=exPart(exTask(EXSIM.ids[EXSIM.i]).part);
    end=EXSIM.ends[p.id]=EXSIM.ends[p.id]||Date.now()+(+p.time||min)*60000; label=`${p.sv}, tid kvar`; }
  const tick=()=>{ const el=$("#exclock"); if(!el){ clearInterval(EXCLOCK); return; }
    if(EXSIM&&Date.now()-(EXSIM.seen||0)>60000) simStore();   // en gång i minuten: tiden räknas bara när appen är öppen
    const s=Math.round((end-Date.now())/1000), a=Math.abs(s);
    el.textContent=`${label} ${s<0?"−":""}${Math.floor(a/60)}:${String(a%60).padStart(2,"0")}`;
    el.classList.toggle("over",s<0); };
  tick(); EXCLOCK=setInterval(tick,1000);
}
const exPct=(r,n)=>n?Math.round(100*r/n):0;
const passTag=(p,sc)=>{ if(p==null) return "–"; const x=exScaleText(p,sc); return `<b class="${p>=EX().pass?"pass":"fail"}">${p} %</b>${x?` <small class="exsc">${x}</small>`:""}`; };

function exSave(t,pct,start,right,total){
  const st=exState(), o=st.t[t.id]||{};
  st.t[t.id]={pct,best:Math.max(o.best||0,pct),n:(o.n||0)+1,last:Date.now()};
  S.log.push({kind:"exam",d:Date.now(),dur:Math.min(5400,Math.round((Date.now()-start)/1000)),right:right||0,total:total||0});
  save(); boardPush();
}

function openExam(){
  stopSpeech(); clearInterval(EXCLOCK); EXSIM=null; RETURN_TO=null; $("#tabs").hidden=true; sess=null;
  if(examWait(openExam)) return;
  const e=EX(), st=exState();
  const row=t=>{const o=st.t[t.id]; return `<button class="game" data-xt="${esc(t.id)}"><span><b>${esc(t.teil?t.teil+": ":"")}${esc(t.title)}</b>
    <small>${exTimed(t)?`${exSecs(t.prep)} förberedelse + ${exSecs(t.speak)} tal`:`${(t.prep||0)+(t.time||0)} min`}${t.minWords?` · ${t.maxWords?`${t.minWords}–${t.maxWords}`:`${exWords()} ${t.minWords}`} ord`:""}${o&&o.pct!=null?` · senast ${o.pct} %, bäst ${o.best} %`:""}</small></span><span class="go" aria-hidden="true">›</span></button>`;};
  const sims=(st.sims||[]).slice(-5).reverse(), run=simSaved(), lvs=simLvs(), multi=lvs.length>1;
  const sc=exScaleOf(null,(e.parts[0]||{}).id), scNote=sc==="delf"?" Resultatet visas också i provets poäng (av 25 per del).":sc==="tdn"?" Resultatet visas också som TestDaF-nivå (TDN 3–5, ungefärligt).":"";
  // En knapp för hela provet per nivå (Franska 3: DELF B1 och DELF A2), huvudnivån först
  const simBtn=(lv,i)=>`<button class="btn${i?" ghost":""}" ${i?`data-simlv="${esc(lv)}"`:`id="sim"`}>Provsimulering${multi?` ${esc(exNameLv(lv))} ·`:":"} hela provet (${simMinutes(null,lv)} minuter)</button>`;
  const partsOf=lv=>e.parts.filter(p=>simPart(p.id,lv));
  app.innerHTML=`${run?simCard(run):""}<section class="panel"><span class="tab">Prov</span><h2>Provträning: ${esc(e.name)}</h2>
    <p class="plan">Uppgifter i samma format och med samma tider som på provet. Läsa och lyssna rättas direkt. Skriva och tala bedöms av Claude efter provets kriterier. Gränsen för godkänt är <b>${e.pass} %</b>.${scNote}</p>
    ${e.note?`<p class="foot">${esc(e.note)}</p>`:""}
    ${lvs.map(simBtn).join("")}
    <p class="foot">En uppgift för varje övning i ${partsOf(lvs[0]).map(p=>esc(p.sv.toLowerCase())).join(", ").replace(/, ([^,]*)$/," och $1")}, med provets tid för varje del.${multi?` Varje nivå simuleras för sig: ${lvs.map(lv=>esc(exNameLv(lv))).join(" och ")} tar bara delarna på sin nivå.`:""} Den muntliga delen ingår inte. Vill du bara göra en del:</p>
    <div class="games">${e.parts.filter(p=>simPart(p.id)).map(p=>`<button class="btn ghost" data-simp="${esc(p.id)}">${esc(p.sv)} (${p.time} min)</button>`).join("")}</div>
    ${sims.length?`<div class="exgroup"><span class="label">Tidigare simuleringar</span><table class="tbl"><tr><th>Datum</th>${e.parts.filter(p=>simPart(p.id)).map(p=>`<th>${esc(p.sv)}</th>`).join("")}</tr>
      ${sims.map(s=>`<tr><td>${new Date(s.d).toLocaleDateString("sv-SE")}</td>${e.parts.filter(p=>simPart(p.id)).map(p=>`<td>${passTag(s.parts[p.id])}</td>`).join("")}</tr>`).join("")}</table></div>`:""}
  </section>
  ${e.parts.map(p=>{const ts=e.tasks.filter(t=>t.part===p.id); return ts.length?`<section class="panel"><h2>${esc(p.name)}</h2>
    <p class="plan">${esc(p.sv)} · ${p.time} minuter på provet</p><div class="games">${ts.map(row).join("")}</div></section>`:"";}).join("")}
  <button class="quit" id="quit">Tillbaka</button>`;
  app.querySelectorAll("[data-xt]").forEach(b=>b.onclick=()=>examTask(b.dataset.xt));
  $("#sim").onclick=()=>startExamSim(); $("#quit").onclick=renderStart; simCardWire();
  app.querySelectorAll("[data-simp]").forEach(b=>b.onclick=()=>startExamSim([b.dataset.simp]));
  app.querySelectorAll("[data-simlv]").forEach(b=>b.onclick=()=>startExamSim(null,b.dataset.simlv));
  window.scrollTo(0,0);
}

// Delar som ingår i simuleringen: läsa, lyssna och skriva (tala kräver en samtalspartner; sim: false = extrauppgift).
// lv = bara uppgifter på den nivån (utelämnat = alla nivåer)
const simTaskOk=(t,lv)=>simOk(t)&&(!lv||exTaskLv(t)===lv);
const simPart=(pid,lv)=>EX().tasks.some(t=>t.part===pid&&simTaskOk(t,lv));
// Övningarna (teil: Exercice 1–3, Teil 1–5, Aufgabe 1–3) i en del, i samma ordning som i exam.json
const simTeile=(pid,lv)=>[...new Set(EX().tasks.filter(t=>t.part===pid&&simTaskOk(t,lv)).map(t=>t.teil||""))];
// Hela provet på en nivå (parts utelämnat) eller bara vissa delar: en uppgift per övning/Teil, helst en som eleven inte har gjort
function simPlan(parts,lv){
  const st=exState();
  if(!parts&&!lv) lv=simLvs()[0];   // hela provet = provets huvudnivå, om inget annat anges
  return EX().parts.filter(p=>simPart(p.id,lv)&&(!parts||parts.includes(p.id))).flatMap(p=>simTeile(p.id,lv).map(te=>{
    const ts=shuffle(EX().tasks.filter(t=>t.part===p.id&&(t.teil||"")===te&&simTaskOk(t,lv)));
    return (ts.find(t=>!st.t[t.id])||ts[0]).id; }));
}
const simMinutes=(parts,lv)=>{ if(!parts&&!lv) lv=simLvs()[0]; return EX().parts.filter(p=>simPart(p.id,lv)&&(!parts||parts.includes(p.id))).reduce((a,p)=>a+(+p.time||0),0); };
function startExamSim(parts,lv){
  if(examWait(()=>startExamSim(parts,lv))) return;
  if(!parts&&!lv) lv=simLvs()[0];
  const ids=simPlan(parts,lv);
  if(!ids.length) return;
  // res: {<uppgift>: {pct, r, n}}; ends: {<del>: tidpunkt då delens tid tar slut}; lv = nivån (hela provet). En ny simulering ersätter en sparad.
  EXSIM={ids,i:0,res:{},ends:{},start:Date.now(),code:L.code};
  if(!parts&&lv) EXSIM.lv=lv;
  simStore(); examTask(ids[0]);
}
/* Den pågående simuleringen sparas i S.exam.simRun (se överst), så att den går att fortsätta efter en omladdning. */
function simStore(){
  if(!EXSIM||EXSIM.code!==L.code) return;   // en simulering hör till en kurs
  EXSIM.seen=Date.now(); exState().simRun=EXSIM; save();
}
function simDrop(){ EXSIM=null; if(S.exam&&S.exam.simRun){ delete S.exam.simRun; save(); } }
// Den sparade simuleringen, om den går att fortsätta (alla uppgifter finns kvar i kursen), annars null
function simSaved(){
  const r=hasExam()&&S.exam&&S.exam.simRun;
  if(!r||typeof r!=="object"||!Array.isArray(r.ids)||!r.ids.length||!r.ids.every(exTask)||!(r.i>=0&&r.i<r.ids.length)) return null;
  return r;
}
// Tid kvar (ms) i den del som pågår, räknat från när eleven senast var i simuleringen
function simLeft(r){
  const p=exPart(exTask(r.ids[r.i]).part), end=(r.ends||{})[p.id];
  return end?end-(+r.seen||Date.now()):(+p.time||0)*60000;
}
function simCard(r){
  const t=exTask(r.ids[r.i]), m=Math.round(simLeft(r)/60000);
  return `<section class="panel" id="simrun"><h2>Fortsätt provsimuleringen</h2>
    <p class="plan">Uppgift ${r.i+1} av ${r.ids.length}: ${esc(exPart(t.part).sv)}${t.teil?", "+esc(t.teil):""}. ${m>=0?`${m} ${m===1?"minut":"minuter"} kvar av delen.`:`Tiden för delen är slut (${-m} min över).`} Klockan står still medan appen är stängd.</p>
    <div class="navrow"><button class="btn ghost" id="simdrop">Avbryt simuleringen</button><button class="btn" id="simgo">Fortsätt</button></div></section>`;
}
function simCardWire(){
  if($("#simgo")) $("#simgo").onclick=simResume;
  if($("#simdrop")) $("#simdrop").onclick=()=>{ simDrop(); openExam(); };
}
// Kortet på startsidan (gamesPanel i 99-menu.js)
function examSimCard(){ const r=simSaved(); return r?simCard(r):""; }
function simResume(){
  if(examWait(simResume)) return;
  const r=simSaved(); if(!r) return openExam();
  // Tiden appen var stängd räknas inte: delarnas sluttider och starten flyttas fram lika mycket
  const gap=Math.max(0,Date.now()-(+r.seen||Date.now()));
  r.ends=r.ends||{}; Object.keys(r.ends).forEach(k=>r.ends[k]=(+r.ends[k]||0)+gap); r.start=(+r.start||Date.now())+gap; r.res=r.res||{};
  EXSIM=r; EXSIM.code=L.code;
  // Uppgiften var redan inlämnad (resultatet sparat) men eleven hann inte gå vidare
  const done=EXSIM.res[EXSIM.ids[EXSIM.i]];
  if(done) return simNext(done.pct,done.r,done.n);
  simStore(); examTask(EXSIM.ids[EXSIM.i]);
}
// Resultatet sparas direkt när uppgiften lämnas in, så att en omladdning före "Nästa" inte tappar det
function simRecord(pct,r,n){
  if(!EXSIM) return;
  EXSIM.res[EXSIM.ids[EXSIM.i]]={pct:pct==null?null:pct,r:r||0,n:n||0}; delete EXSIM.cur; simStore();
}
// Svaren i uppgiften som pågår sparas (simAns) och läses tillbaka efter en omladdning (simCur)
function simAns(t,ans){ if(!EXSIM) return; EXSIM.cur={id:t.id,ans}; simStore(); }
const simCur=t=>EXSIM&&EXSIM.cur&&EXSIM.cur.id===t.id&&EXSIM.cur.ans&&typeof EXSIM.cur.ans==="object"?EXSIM.cur.ans:null;
// Delens resultat: läsa och lyssna = andel rätt av alla frågor i delen (som poängen på provet), skriva = medel av
// uppgifterna. En uppgift utan bedömning gör att delen saknar resultat (null).
function simPartRes(pid){
  const rs=EXSIM.ids.map(exTask).filter(t=>t.part===pid).map(t=>EXSIM.res[t.id]||{pct:null});
  if(!rs.length||rs.some(x=>x.pct==null)) return null;
  if(rs.every(x=>x.n)) return exPct(rs.reduce((a,x)=>a+x.r,0),rs.reduce((a,x)=>a+x.n,0));
  return Math.round(rs.reduce((a,x)=>a+x.pct,0)/rs.length);
}
// Knappen efter en uppgift: nästa övning i samma del, nästa del eller resultatet
function simNextLabel(){
  const a=exTask(EXSIM.ids[EXSIM.i]), b=EXSIM.ids[EXSIM.i+1]&&exTask(EXSIM.ids[EXSIM.i+1]);
  return !b?"Se resultatet":b.part===a.part?"Nästa övning":`Nästa del: ${esc(exPart(b.part).sv)}`;
}
function simNext(pct,r,n){
  const t=exTask(EXSIM.ids[EXSIM.i]); EXSIM.res[t.id]={pct:pct==null?null:pct,r:r||0,n:n||0}; EXSIM.i++; delete EXSIM.cur;
  if(EXSIM.i<EXSIM.ids.length){ simStore(); return examTask(EXSIM.ids[EXSIM.i]); }
  clearInterval(EXCLOCK);
  const e=EX(), pids=[...new Set(EXSIM.ids.map(id=>exTask(id).part))], res={}, tasks={};
  pids.forEach(p=>res[p]=simPartRes(p));
  EXSIM.ids.forEach(id=>tasks[id]=EXSIM.res[id]?EXSIM.res[id].pct:null);
  const st=exState(); st.sims=(st.sims||[]).slice(-19); delete st.simRun;
  st.sims.push({d:Date.now(),parts:res,tasks,min:Math.round((Date.now()-EXSIM.start)/60000),...(EXSIM.lv?{lv:EXSIM.lv}:{})}); save();
  // Delar utan resultat (skrivdelen utan bedömning från Claude) räknas inte som godkända eller underkända
  const vals=Object.values(res).filter(v=>v!=null), ok=vals.length&&vals.every(v=>v>=e.pass);
  const skipped=Object.entries(res).filter(([,v])=>v==null).map(([p])=>exPart(p).name);
  const msg=!skipped.length?(ok?`Alla delar över ${e.pass} %. Det hade räckt för godkänt på de här delarna.`:`Gränsen är ${e.pass} % i varje del. Öva mer på delarna under gränsen.`)
    :`${skipped.join(" och ")} blev inte ${skipped.length===1?"bedömd":"bedömda"}, så simuleringen visar inte om du hade klarat provet. `
      +(!vals.length?"":ok?`De bedömda delarna är över ${e.pass} %.`:`Gränsen är ${e.pass} % i varje del. Öva mer på delarna under gränsen.`);
  const rows=pids.map(p=>`<tr><td><b>${esc(exPart(p).name)}</b></td><td>${passTag(res[p],exScaleOf(null,p))}</td></tr>`
    +EXSIM.ids.map(exTask).filter(t=>t.part===p&&t.teil&&simTeile(p).length>1).map(t=>{ const x=exScaleText(tasks[t.id],exScaleOf(t));
      return `<tr><td style="padding-left:1.5em">${esc(t.teil)}</td><td>${tasks[t.id]==null?"–":tasks[t.id]+" %"+(x?` <small class="exsc">${x}</small>`:"")}</td></tr>`; }).join("")).join("");
  // DELF: summan av delarna av 100 poäng, som på provet (godkänt från 50 och minst 5 av 25 i varje del)
  const delf=vals.length===pids.length&&pids.every(p=>exScaleOf(null,p)==="delf")?pids.reduce((a,p)=>a+Math.round(res[p]/2)/2,0):null;
  app.innerHTML=`<section class="panel"><span class="tab">Prov</span><h2>Resultat av simuleringen${EXSIM.lv&&simLvs().length>1?`: ${esc(exNameLv(EXSIM.lv))}`:""}</h2>
    <table class="tbl"><tr><th>Del</th><th>Resultat</th></tr>${rows}</table>
    ${delf!=null?`<p class="plan">Sammanlagt ${String(delf).replace(".",",")} av ${pids.length*25} poäng i de här delarna (på provet ${pids.length*25<100?"räknas även den muntliga delen, ":""}krävs 50 av 100 och minst 5 av 25 i varje del).</p>`:""}
    <p class="plan">${msg}</p>
    <p class="foot">Det tog ${Math.max(1,Math.round((Date.now()-EXSIM.start)/60000))} minuter. Den muntliga delen ingår inte. Öva den under Tala i provträningen.</p>
    <button class="btn" id="back">${RETURN_TO?esc(RETURN_LABEL):"Till provträningen"}</button></section>`;
  EXSIM=null; $("#back").onclick=backTo(openExam); window.scrollTo(0,0);
}

function examTask(id){
  if(examWait(()=>examTask(id))) return;
  const t=exTask(id); stopSpeech(); $("#tabs").hidden=true; sess=null;
  ({mc:examMC,write:examWrite,speak:examSpeak,match:examItems,gaps:examItems,short:examItems,pick:examItems,chart:examWrite,timed:examSpeak})[exKind(t)](t);
  window.scrollTo(0,0);
}
const exHead=(t,tab)=>`<span class="tab">${tab}</span><div class="meta"><span class="label">${esc(exPart(t.part).name)}${t.teil?" · "+esc(t.teil):""}${EXSIM?` · uppgift ${EXSIM.i+1} av ${EXSIM.ids.length}`:""}</span><span class="clock" id="exclock"></span></div>
  <h2 ${lang()}>${esc(t.title)}</h2>${t.instr?`<p class="plan">${esc(t.instr)}</p>`:""}`;
const exQuit=()=>`<button class="quit" id="quit">${EXSIM?"Avbryt simuleringen":"Tillbaka"}</button>`;
// Tillbaka, eller i simuleringen: avbryt den (och ta bort den sparade)
const exQuitGo=()=>{ stopSpeech(); const back=RETURN_TO||openExam; if(EXSIM) simDrop(); back(); };   // RETURN_TO: öppnad från skrivsidan eller planen (openFrom)
const exLines=t=>`<div class="reading">${t.lines.map(l=>`<p class="tl" ${lang()}>${esc(tl(l))}</p><p class="tl-sv" hidden>${esc(l.sv||"")}</p>`).join("")}</div>`;

const exListen=t=>/^(hoeren|co)$/.test(t.part)||!!t.plays;
// Texten att läsa, eller uppspelningen i en höruppgift (texten visas först efter inlämningen)
const exSource=(t,body)=>exListen(t)?`<div class="listen"><button type="button" class="btn ghost" id="explay">${PLAY} Spela upp</button><button type="button" class="btn ghost" id="stop">Stoppa</button></div>
      <p class="foot" id="plays">${SOUND?"":"Ljudet är avstängt. Det slås på när du trycker på Spela upp. "}${t.plays?`På provet hör du texten ${t.plays===1?"en gång":t.plays+" gånger"}.`:""}</p><div id="lines" hidden>${body}</div>`:body;
function exWireListen(t){
  if(!exListen(t)) return; let plays=0;
  // Hörtexten går inte att höra med ljudet av: då slås ljudet på (som i uttalsövningen), så att uppspelningen räknas rätt
  $("#explay").onclick=()=>{ if(!SOUND) setSound(true); plays++; speakSeq(t.lines||[],undefined);
    $("#plays").textContent=t.plays?`Uppspelad ${plays} ${plays===1?"gång":"gånger"}. På provet hör du texten ${t.plays===1?"en gång":t.plays+" gånger"}.`:""; };
  $("#stop").onclick=stopSpeech;
}
// Resultatet efter inlämningen, lika för alla läs- och höruppgifter
function exResult(t,r,n,start){
  const pct=exPct(r,n), listen=!!$("#lines"), x=exScaleText(pct,exScaleOf(t)); exSave(t,pct,start,r,n); simRecord(pct,r,n);
  if(listen) $("#lines").hidden=false;
  $("#exres").innerHTML=`<div class="feedback ${pct>=EX().pass?"ok":"bad"}"><strong>${r} av ${n} rätt · ${pct} %${x?` · ${x}`:""}</strong>
      <p>${pct>=EX().pass?`Över gränsen för godkänt (${EX().pass} %).`:`Gränsen för godkänt är ${EX().pass} %.`}${listen?" Texten visas nu ovanför. Lyssna igen medan du läser.":""}</p></div>
      <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button>
      <button class="btn" id="exnext">${EXSIM?simNextLabel():RETURN_TO?esc(RETURN_LABEL):"Till provträningen"}</button>`;
  $("#svt").onclick=()=>app.querySelectorAll(".tl-sv").forEach(p=>p.hidden=!p.hidden);
  $("#exnext").onclick=()=>EXSIM?simNext(pct,r,n):backTo(openExam)();
}

/* Läsa och lyssna: alla frågor på en gång, som på provet */
function examMC(t){
  const start=Date.now(), listen=exListen(t);
  const ans={...(simCur(t)||{})};   // svar som sparats i en pågående simulering
  app.innerHTML=`<section class="panel">${exHead(t,listen?"Lyssna":"Läsa")}
    ${exSource(t,exLines(t))}
  </section>
  <section class="panel"><div class="exqs">${t.qs.map((q,i)=>`<div class="exq" data-q="${i}"><p class="q-ask"><b>${i+1}.</b> <span ${lang()}>${esc(q.q)}</span></p>
    <div class="opts">${optOrder(q.opts).map((j,n)=>`<button class="opt" data-o="${j}"><span class="k">${String.fromCharCode(97+n)}</span><span ${lang()}>${esc(q.opts[j])}</span></button>`).join("")}</div><div class="exwhy"></div></div>`).join("")}</div>
    <button class="btn" id="exdone">Lämna in</button><div id="exres"></div></section>${exQuit()}`;
  exClock(t.time||10,"Tid kvar"); exWireListen(t);
  app.querySelectorAll(".exq").forEach(qe=>qe.querySelectorAll(".opt").forEach(b=>{
    if(ans[qe.dataset.q]===+b.dataset.o) b.classList.add("on");
    b.onclick=()=>{ if($("#exdone").disabled) return; ans[qe.dataset.q]=+b.dataset.o; simAns(t,ans);
      qe.querySelectorAll(".opt").forEach(x=>x.classList.toggle("on",x===b)); }; }));
  $("#exdone").onclick=()=>{
    stopSpeech(); clearInterval(EXCLOCK); $("#exdone").disabled=true;
    let r=0; t.qs.forEach((q,i)=>{ const qe=app.querySelector(`.exq[data-q="${i}"]`), a=ans[i], ok=a===q.a; if(ok) r++;
      qe.querySelectorAll(".opt").forEach(x=>{const j=+x.dataset.o; x.disabled=true; x.classList.remove("on"); if(j===q.a)x.classList.add("right"); else if(j===a)x.classList.add("wrong");});
      qe.querySelector(".exwhy").innerHTML=q.why?`<p class="foot">${esc(q.why)}</p>`:""; });
    exResult(t,r,t.qs.length,start);
  };
  $("#quit").onclick=exQuitGo;
}

/* Skriva: bedöms av Claude med provets kriterier, 0–5 poäng per kriterium */
// Provets nivå: uppgiftens level, provdelens level, exam.json:s level, nivån i provets namn, lang.js exam.level, kursens nivå
const examLevel=t=>cefrOf(t&&t.level)||cefrOf(t&&exPart(t.part).level)||cefrOf(EX().level)||cefrOf(EX().name)||cefrOf(L.exam&&L.exam.level)||courseLevel();
// Samma prompt som Skriv en text (writePrompt i 40-writing.js), med provets namn, nivå, kriterier och ordgräns.
// Grafikuppgiften får grafikens siffror med i uppgiften, talat svar på tid förberedelse- och taltiden.
function examPrompt(t,text,speak){
  const task=t.task+(t.chart?"\n"+exChartText(t.chart)+"\nBedöm särskilt om texten beskriver grafikens viktigaste uppgifter korrekt (siffror, trender och jämförelser) och inte hittar på siffror.":"")
    +(exTimed(t)?`\nEleven hade ${exSecs(t.prep)} att förbereda sig och ${exSecs(t.speak)} att tala, som på provet. Bedöm också om svaret är lagom långt och täcker uppgiften för den taltiden.`:"");
  return writePrompt({exam:EX().name,lv:examLevel(t),where:exPart(t.part).name+(t.teil?", "+t.teil:""),task,criteria:t.criteria,speak,
    words:t.maxWords?`${t.minWords}–${t.maxWords} ord.`:EX().approxWords?`Cirka ${t.minWords} ord (en text med mindre än hälften så många ord ger 0 poäng på provet).`:`Minst ${t.minWords} ord.`},text);
}
// Procent av kriteriernas poäng, eller null när svaret saknar kriterier (då sparas inget resultat)
const exScore=f=>{const k=(f&&f.kriterier)||[]; const n=k.length*5, r=k.reduce((a,x)=>a+Math.max(0,Math.min(5,+x.poang||0)),0); return n?exPct(r,n):null;};
// Samma som i Skriv en text, med provets gräns och (om provet har en egen skala) resultatet i den skalan
const renderExamFb=(f,t)=>{ const h=renderWriteFb(f,EX().pass), x=f&&t?exScaleText(fbPct(fbNorm(f)),exScaleOf(t)):"";
  return x?h.replace(/(Sammanlagt [\s\S]*?)\.<\/p>/,`$1 · ${x}.</p>`):h; };

function examWrite(t){ examText(t,false); }
function examSpeak(t){ examText(t,true); }
function examText(t,speak){
  S.drafts=S.drafts||{}; S.fb=S.fb||{};
  const dk="x:"+t.id, start=Date.now(), timed=exTimed(t); let ctl=null, graded=null; const low=()=>/^A/.test(examLevel(t));
  const phrases=(t.phrases||[]).length?`<details class="more"><summary>Bra fraser</summary><ul class="checklist">${t.phrases.map(p=>`<li ${lang()}>${esc(p)}</li>`).join("")}</ul></details>`:"";
  app.innerHTML=`<section class="panel">${exHead(t,speak?"Tala":"Skriva")}
    ${t.chart?exChart(t.chart):""}
    <div class="extask" ${lang()}>${esc(t.task).replace(/\n/g,"<br>")}</div>
    ${timed?`<p class="plan">Som på provet: ${t.prep?`${exSecs(t.prep)} att förbereda dig, sedan `:""}${exSecs(t.speak)} att tala. Säg svaret högt, gärna inspelat med mobilen. Klockan byter själv till taltiden. Skriv eller diktera sedan det du sa nedanför (mikrofonen på tangentbordet), så kan Claude kommentera.</p>
      ${phrases}
      <div class="extimer"><p class="exphase" id="tphase" aria-live="polite">Tryck på Starta när du har läst uppgiften.</p>
        <div class="navrow"><button type="button" class="btn" id="tstart">${t.prep?"Starta förberedelsen":"Börja tala"}</button><button type="button" class="btn ghost" id="tskip" hidden>Börja tala nu</button></div></div>`
    :speak?`<p class="plan">${t.prep?`Förbered dig i ${t.prep} minuter och tala sedan`:"På provet finns ingen förberedelsetid här. Tala"} i ungefär ${t.time} minuter. Säg det högt, gärna inspelat med mobilen, så att du hör dig själv. Skriv sedan stödord eller det du sa nedanför, så kan Claude kommentera.</p>
      ${phrases}
      <button type="button" class="btn ghost" id="talk">Starta taltiden (${t.time} min)</button>`:""}
    <textarea class="answer-in wtext" id="xtext" rows="${speak?6:12}" ${lang()} autocapitalize="sentences" spellcheck="false" placeholder="${timed?"Skriv eller diktera det du sa":speak?"Stödord eller det du sa":"Skriv din text här"}">${esc(S.drafts[dk]||"")}</textarea>
    ${accentKeys(L.accents)}
    <p class="foot" id="xcount"></p>
    <button class="btn" id="exdone">${speak?"Få kommentarer av Claude":"Lämna in och få bedömning av Claude"}</button><div id="exres">${renderExamFb(S.fb[dk],t)}</div>
    <details class="more"><summary>Visa ett exempelsvar</summary>${t.model?`<button type="button" class="btn ghost" id="mplay">${PLAY} Lyssna</button>`:""}<p class="ex-t" ${lang()}>${esc(t.model||"")}</p><p class="ex-sv">${esc(t.modelSv||"")}</p></details>
    ${EXSIM?`<button class="btn ghost" id="exnext">${simNextLabel()}</button>`:""}</section>${exQuit()}`;
  if(timed) exTimerWire(t);
  else { exClock(speak?(t.prep||t.time):t.time,speak?(t.prep?"Förberedelse":"Taltid"):"Tid kvar");
    if(speak) $("#talk").onclick=()=>exClock(t.time,"Taltid"); }
  const ta=$("#xtext"); let tm=null; wireAccents(ta);
  const count=()=>{const n=tok(ta.value).length; $("#xcount").textContent=speak?"":`${n} ord${t.maxWords?` (${t.minWords}–${t.maxWords})${n>t.maxWords?" – för långt":""}`:t.minWords?` av ${exWords()} ${t.minWords}`:""}`;};
  const st=S; ta.oninput=()=>{count(); clearTimeout(tm); tm=setTimeout(()=>{ if(S!==st) return; (S.drafts=S.drafts||{})[dk]=ta.value; save();},800);}; count();   // inte i en annan kurs S
  if($("#mplay")) $("#mplay").onclick=()=>speakSeq([tlLine(t.model)]);
  $("#exdone").onclick=async()=>{
    const out=$("#exres"), btn=$("#exdone");
    if(ctl){ ctl.abort(); return; }
    const text=ta.value.trim();
    const need=speak?(low()?5:15):minForFeedback(t.minWords);   // A1-formulär: färre ord
    if(tok(text).length<need){ out.innerHTML=`<p class="foot">Skriv minst ${need} ord först.</p>`; return; }
    if(!SAMPLE){ out.innerHTML=`<p class="foot">Bedömningen fungerar när appen är öppnad på claude.ai.</p>`; return; }
    S.drafts[dk]=ta.value; ctl=new AbortController(); btn.textContent="Stoppa";
    out.innerHTML=`<p class="foot">Claude bedömer din text … Det brukar ta 10–40 sekunder.</p>`;
    try{
      const f=await SAMPLE.json(examPrompt(t,text,speak),{signal:ctl.signal,cache:false});
      if(!f||typeof f!=="object") throw {code:"invalid_json"};
      fbStamp(f,examLevel(t),text); S.fb[dk]=f; graded=exScore(f);   // sparformatet i 40-writing.js
      // Utan poäng (inga kriterier i svaret) sparas inget resultat, så att det inte blir "null %"
      if(graded==null){ save(); out.innerHTML=renderExamFb(f,t)+`<p class="foot">Bedömningen saknade poäng. Försök igen.</p>`; return; }
      exSave(t,graded,start); simRecord(graded); out.innerHTML=renderExamFb(f,t);
      clearInterval(EXCLOCK);
    }catch(e){ out.innerHTML=renderExamFb(S.fb[dk],t)+(e&&e.code==="cancelled"?"":`<p class="foot">Bedömningen misslyckades. Försök igen om en stund.</p>`); }
    finally{ ctl=null; btn.textContent=speak?"Få kommentarer av Claude":"Lämna in och få bedömning av Claude"; }
  };
  if($("#exnext")) $("#exnext").onclick=()=>{stopSpeech(); simNext(graded);};
  $("#quit").onclick=exQuitGo;
}
/* Talat svar på tid (exTimed): förberedelse och taltid i sekunder, klockan byter själv från förberedelse till tal.
   Klockan är EXCLOCK, så den stoppas när eleven lämnar sidan (openExam, exQuitGo). */
function exPhase(sec,label,done){
  clearInterval(EXCLOCK); const end=Date.now()+sec*1000;
  const tick=()=>{ const el=$("#exclock"); if(!el){ clearInterval(EXCLOCK); return; }
    const s=Math.max(0,Math.ceil((end-Date.now())/1000)); el.textContent=`${label} ${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
    if(s<=0){ clearInterval(EXCLOCK); done(); } };
  tick(); EXCLOCK=setInterval(tick,250);
}
function exTimerWire(t){
  const ph=$("#tphase"), go=$("#tstart"), skip=$("#tskip");
  $("#exclock").textContent=`${t.prep?"Förberedelse "+exSecs(t.prep)+" · ":""}Taltid ${exSecs(t.speak)}`;
  const buzz=()=>{ try{ navigator.vibrate&&navigator.vibrate(200); }catch(e){ /* vibration finns inte (iPad): bara tyst */ } };
  const talk=()=>{ skip.hidden=true; buzz(); ph.textContent=`Tala nu! Du har ${exSecs(t.speak)}.`; ph.dataset.phase="speak";
    exPhase(+t.speak,"Taltid",()=>{ buzz(); ph.textContent="Tiden är slut. Skriv eller diktera det du sa nedanför, så kan Claude kommentera."; ph.dataset.phase="done";
      go.textContent="Börja om"; go.hidden=false; }); };
  go.onclick=()=>{ go.hidden=true;
    if(+t.prep>0){ skip.hidden=false; ph.textContent=`Förbered dig. Efter ${exSecs(t.prep)} börjar taltiden.`; ph.dataset.phase="prep"; exPhase(+t.prep,"Förberedelse",talk); }
    else talk(); };
  skip.onclick=talk;
}

/* Grafikbeskrivning (type "chart"): stapel- eller linjediagram som SVG ur exam.json, i temats färger (--c1, --c2,
   --amber; ljust och mörkt läge), med förklaring, siffror i en tabell och data-tip per värde. Skalar till 320 px. */
const EX_CHART_COL=["var(--c1)","var(--c2)","var(--amber)"];
const exNum=v=>String(v).replace(".",",");
function exChart(c){
  const labels=c.labels||[], ser=(c.series||[]).slice(0,3), n=labels.length, ns=ser.length, unit=c.unit?" "+c.unit:"";
  const W=360,H=230,ml=40,mr=12,mt=24,mb=28,iw=W-ml-mr,ih=H-mt-mb;
  const max=Math.max(1,...ser.flatMap(s=>s.values.map(Number))), yMax=niceMax(max), y=v=>mt+ih-(v/yMax)*ih;
  const tip=(i,s)=>esc(`${labels[i]}, ${s.name}: ${exNum(s.values[i])}${unit}`);
  let g="";
  for(let k=0;k<=4;k++){ const v=yMax*k/4, yy=y(v).toFixed(1); g+=`<line class="gl" x1="${ml}" x2="${W-mr}" y1="${yy}" y2="${yy}"/><text x="${ml-6}" y="${+yy+5}" text-anchor="end" style="font-size:14px">${exNum(+v.toFixed(1))}</text>`; }
  const step=Math.max(1,Math.ceil(n/6)), cx=i=>ml+(i+.5)*iw/n;
  labels.forEach((l,i)=>{ if(i%step===0||i===n-1) g+=`<text x="${cx(i).toFixed(1)}" y="${H-8}" text-anchor="middle" style="font-size:14px">${esc(l)}</text>`; });
  if(c.kind==="line"){
    ser.forEach((s,k)=>{ const col=EX_CHART_COL[k];
      g+=`<polyline points="${s.values.map((v,i)=>`${cx(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${col};stroke-width:2;stroke-linejoin:round;stroke-linecap:round"/>`;
      s.values.forEach((v,i)=>g+=`<circle cx="${cx(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" style="fill:${col};stroke:var(--surface);stroke-width:2"><title>${tip(i,s)}</title></circle>`); });
    labels.forEach((l,i)=>g+=`<rect x="${(cx(i)-iw/n/2).toFixed(1)}" y="${mt}" width="${(iw/n).toFixed(1)}" height="${ih}" fill="transparent" data-tip="${esc(`${l}: `+ser.map(s=>`${s.name} ${exNum(s.values[i])}${unit}`).join(", "))}"/>`);
  } else {
    const gw=iw/n, bw=Math.min(26,(gw-8)/ns-2);
    ser.forEach((s,k)=>s.values.forEach((v,i)=>{ const x0=cx(i)-(ns*(bw+2)-2)/2+k*(bw+2), h=Math.max(1,ih*v/yMax), top=mt+ih-h, r=Math.min(4,bw/2,h);
      g+=`<path d="M${x0.toFixed(1)},${mt+ih} V${(top+r).toFixed(1)} Q${x0.toFixed(1)},${top.toFixed(1)} ${(x0+r).toFixed(1)},${top.toFixed(1)} H${(x0+bw-r).toFixed(1)} Q${(x0+bw).toFixed(1)},${top.toFixed(1)} ${(x0+bw).toFixed(1)},${(top+r).toFixed(1)} V${mt+ih} Z" style="fill:${EX_CHART_COL[k]}" data-tip="${tip(i,s)}"><title>${tip(i,s)}</title></path>`;
      if(n*ns<=12) g+=`<text x="${(x0+bw/2).toFixed(1)}" y="${(top-5).toFixed(1)}" text-anchor="middle" style="font-size:12px;fill:var(--ink)">${exNum(v)}</text>`; }));
  }
  const aria=`${c.kind==="line"?"Linjediagram":"Stapeldiagram"}: ${c.title||""}`;
  return `<figure class="exchart"><figcaption ${lang()}><b>${esc(c.title||"")}</b>${c.unit?` <small>(${esc(c.unit)})</small>`:""}</figcaption>
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aria)}">${g}</svg>
    ${ns>1?`<div class="legend" ${lang()}>${ser.map((s,k)=>`<span><i class="sw" style="background:${EX_CHART_COL[k]}"></i>${esc(s.name)}</span>`).join("")}</div>`:""}
    ${c.source?`<p class="foot" ${lang()}>${esc(c.source)}</p>`:""}
    <details class="more"><summary>Visa siffrorna som tabell</summary><div class="tblwrap"><table class="tbl" ${lang()}><tr><th></th>${ser.map(s=>`<th>${esc(s.name)}</th>`).join("")}</tr>
      ${labels.map((l,i)=>`<tr><td>${esc(l)}</td>${ser.map(s=>`<td>${exNum(s.values[i])}</td>`).join("")}</tr>`).join("")}</table></div></details></figure>`;
}
// Grafiken som text till Claudes bedömning
const exChartText=c=>`Grafiken (${c.kind==="line"?"linjediagram":"stapeldiagram"}): ${c.title||""}${c.unit?` (${c.unit})`:""}. `
  +(c.series||[]).map(s=>`${s.name}: ${(c.labels||[]).map((l,i)=>`${l} = ${s.values[i]}`).join(", ")}`).join("; ")+(c.source?`. ${c.source}`:"");

/* Bildval (type "pick"): bilderna är emoji ur en liten inbyggd uppsättning (bilder kan inte hämtas utifrån).
   Nyckel → [emoji, svensk beskrivning (skärmläsare och facit)]. build.py (check_exam_task) läser nycklarna här;
   klockslagen kl1 … kl12 och kl1.30 … kl12.30 skapas nedanför och godkänns av build.py med ett mönster. */
const EX_ICONS={
  sol:["☀️","sol"], molnigt:["☁️","moln"], halvklart:["⛅","sol och moln"], regn:["🌧️","regn"], sno:["❄️","snö"], aska:["⛈️","åska"], vind:["💨","blåst"], dimma:["🌫️","dimma"], paraply:["☂️","paraply"], varmt:["🌡️","termometer"],
  tag:["🚆","tåg"], buss:["🚌","buss"], bil:["🚗","bil"], cykel:["🚲","cykel"], flyg:["✈️","flygplan"], bat:["⛴️","båt"], tunnelbana:["🚇","tunnelbana"], sparvagn:["🚊","spårvagn"], taxi:["🚕","taxi"], gang:["🚶","till fots"], moped:["🛵","moped"],
  brod:["🥖","bröd"], croissant:["🥐","croissant"], ost:["🧀","ost"], apple:["🍎","äpple"], banan:["🍌","banan"], kaffe:["☕","kaffe"], te:["🍵","te"], pizza:["🍕","pizza"], pasta:["🍝","pasta"], fisk:["🐟","fisk"], kott:["🥩","kött"], glass:["🍦","glass"], tarta:["🍰","tårta"], vatten:["💧","vatten"], juice:["🧃","juice"], mjolk:["🥛","mjölk"], sallad:["🥗","sallad"], agg:["🥚","ägg"], vin:["🍷","vin"],
  parkering:["🅿️","parkering"], forbud:["⛔","förbjudet"], rokfritt:["🚭","rökning förbjuden"], mobilfritt:["📵","inga mobiler"], toalett:["🚻","toalett"], info:["ℹ️","information"], varning:["⚠️","varning"], sjukhus:["🏥","sjukhus"], apotek:["💊","apotek"], wifi:["📶","wifi"], rullstol:["♿","rullstol"], hund:["🐕","hund"], ingang:["🚪","dörr"], hiss:["🛗","hiss"],
  skola:["🏫","skola"], bank:["🏦","bank"], post:["🏤","post"], hotell:["🏨","hotell"], butik:["🏬","varuhus"], strand:["🏖️","strand"], berg:["⛰️","berg"], kyrka:["⛪","kyrka"], museum:["🏛️","museum"], bio:["🎬","bio"], teater:["🎭","teater"],
  fotboll:["⚽","fotboll"], tennis:["🎾","tennis"], simning:["🏊","simning"], musik:["🎵","musik"], piano:["🎹","piano"], gitarr:["🎸","gitarr"], bok:["📚","böcker"], dator:["💻","dator"], telefon:["📱","mobiltelefon"], foto:["📷","kamera"], sova:["😴","sova"], laga:["🍳","laga mat"]
};
// Klockslagen: 🕐 … 🕛 (hela timmar) och 🕜 … 🕧 (halvtimmar)
for(let h=1;h<=12;h++){ EX_ICONS["kl"+h]=[String.fromCodePoint(0x1F54F+h),`klockan ${h}`]; EX_ICONS[`kl${h}.30`]=[String.fromCodePoint(0x1F55B+h),`halv ${h===12?1:h+1} (${h}.30)`]; }
const exIcon=k=>EX_ICONS[k]||["?",String(k)];

/* Para ihop, lucktext med flerval och kortsvar (type i exam.json, se SPEC överst). Alla items på en sida, med
   <select> och textfält, så att uppgifterna går att göra med tangentbordet och får plats på en smal skärm (320 px). */
// Kortsvar: versaler, accenter, ß/ss, apostrofer, skiljetecken och extra mellanslag spelar ingen roll
const exNorm=s=>deacc(String(s||"").toLowerCase()).replace(/[’`´]/g,"'").replace(/[«»"“”„!?.,;:…()\[\]\-–—\/]/g," ").replace(/\s+/g," ").trim();
const exShortOk=(it,v)=>{ const n=exNorm(v); return !!n&&[].concat(it.a||[]).some(a=>exNorm(a)===n); };
const exOptText=o=>typeof o==="string"?o:tl(o)||"";
const exLetter=i=>String.fromCharCode(65+i);
function examItems(t){
  const k=exKind(t), start=Date.now(), listen=exListen(t), ans={...(simCur(t)||{})};
  const optsOf=i=>t.bank||(t.gaps[i]||{}).opts||[];
  const sel=(i,list,label,id)=>`<select class="exsel${k==="gaps"?" gapsel":""}"${id?` id="${id}"`:""} data-i="${i}" aria-label="${esc(label)}"><option value="">${k==="gaps"?`(${i+1}) …`:"–"}</option>${list.map(([v,txt])=>`<option value="${v}">${esc(txt)}</option>`).join("")}</select>`;
  let body="", qs="";
  if(k==="match"){
    const opts=t.opts.map((o,j)=>[j,`${exLetter(j)}: ${exOptText(o).length>50?exOptText(o).slice(0,48)+"…":exOptText(o)}`]).concat(t.none!=null?[[-1,`0: ${t.none||"inget passar"}`]]:[]);
    body=`<ol class="exopts">${t.opts.map((o,j)=>`<li><b class="k">${exLetter(j)}</b><div><p class="tl" ${lang()}>${esc(exOptText(o))}</p>${o.sv?`<p class="tl-sv" hidden>${esc(o.sv)}</p>`:""}</div></li>`).join("")}</ol>`;
    qs=`<p class="foot">${t.reuse?"Samma alternativ kan passa flera gånger.":"Varje alternativ passar högst en gång."}${t.none!=null?" Välj 0 om inget alternativ passar.":""}</p>`
      +t.items.map((it,i)=>`<div class="exq" data-q="${i}"><label for="exs${i}" class="q-ask"><b>${i+1}.</b> <span ${lang()}>${esc(it.q)}</span></label>${it.sv?`<p class="tl-sv" hidden>${esc(it.sv)}</p>`:""}
        ${sel(i,opts,"Svar på "+(i+1),"exs"+i)}<div class="exwhy"></div></div>`).join("");
  } else if(k==="gaps"){
    body=`<div class="reading exgaps">${t.lines.map(l=>`<p class="tl" ${lang()}>${esc(tl(l)).replace(/\{(\d+)\}/g,(m,d)=>sel(+d-1,optsOf(+d-1).map((o,j)=>[j,o]),"Lucka "+d))}</p><p class="tl-sv" hidden>${esc(l.sv||"")}</p>`).join("")}</div>
      ${t.bank?`<p class="foot">Orden i listan passar högst en gång var, och några blir över.</p>`:""}`;
    qs=`<div id="gapwhy"></div>`;
  } else if(k==="pick"){
    // Bildval: en grupp radioknappar per fråga (tangentbord: Tab till gruppen, piltangenterna mellan bilderna)
    qs=t.items.map((it,i)=>`<fieldset class="exq expick" data-q="${i}" data-i="${i}"><legend class="q-ask"><b>${i+1}.</b> <span ${lang()}>${esc(it.q)}</span></legend>${it.sv?`<p class="tl-sv" hidden>${esc(it.sv)}</p>`:""}
      <div class="pickrow">${it.opts.map((o,j)=>`<label class="pickopt"><input type="radio" name="exp${i}" value="${j}"><span class="ico" role="img" aria-label="${esc(exIcon(o)[1])}">${exIcon(o)[0]}</span><span class="k">${exLetter(j)}</span></label>`).join("")}</div><div class="exwhy"></div></fieldset>`).join("");
  } else {
    const mw=+t.maxWords||3;
    qs=`<p class="foot">Svara med ${mw===1?"ett ord":"högst "+mw+" ord"}. Stavningen räknas, men inte versaler och accenter.</p>`
      +t.items.map((it,i)=>`<div class="exq" data-q="${i}"><label for="exs${i}" class="q-ask"><b>${i+1}.</b> <span ${lang()}>${esc(it.q)}</span></label>
        <input class="answer-in exshort" id="exs${i}" data-i="${i}" ${lang()} autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next"><div class="exwhy"></div></div>`).join("")
      +accentKeys(L.accents);
  }
  // Texten (lines) göms i en höruppgift, men alternativen att para ihop och lucktexten syns alltid
  const src=k!=="gaps"&&(t.lines||[]).length?exSource(t,exLines(t)):"";
  app.innerHTML=`<section class="panel">${exHead(t,listen?"Lyssna":"Läsa")}
    ${src}${body}
  </section>
  <section class="panel"><div class="exqs">${qs}</div>
    <button class="btn" id="exdone">Lämna in</button><div id="exres"></div></section>${exQuit()}`;
  exClock(t.time||10,"Tid kvar"); if(src) exWireListen(t);
  const fields=[...app.querySelectorAll(".exsel,.exshort,.expick")];
  // Värdet i ett fält; för bildval den valda radioknappen ("" = inget valt)
  const val=f=>k==="pick"?((f.querySelector("input:checked")||{}).value??""):f.value;
  const mark=f=>{ if(k==="pick") f.querySelectorAll(".pickopt").forEach(l=>l.classList.toggle("on",l.querySelector("input").checked)); };
  fields.forEach(f=>{ const i=f.dataset.i;
    if(ans[i]!=null){ if(k==="pick"){ const r=f.querySelector(`input[value="${ans[i]}"]`); if(r) r.checked=true; mark(f); } else f.value=ans[i]; }
    f.onchange=()=>{ ans[i]=val(f); mark(f); simAns(t,ans); };
    // Enter i ett kortsvar går till nästa fält
    if(k==="short") f.onkeydown=e=>{ if(e.key==="Enter"){ e.preventDefault(); const nx=fields[fields.indexOf(f)+1]; (nx||$("#exdone")).focus(); } }; });
  if(k==="short"){ let last=fields[0];   // accentknapparna skriver i det fält man senast var i
    fields.forEach(f=>f.addEventListener("focus",()=>last=f));
    app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ const el=last; if(!el||el.disabled) return; const a=el.selectionStart??el.value.length, z=el.selectionEnd??el.value.length;
      el.value=el.value.slice(0,a)+b.dataset.c+el.value.slice(z); el.focus(); el.setSelectionRange(a+1,a+1); el.dispatchEvent(new Event("change")); }); }
  $("#exdone").onclick=()=>{
    stopSpeech(); clearInterval(EXCLOCK); $("#exdone").disabled=true;
    let r=0; const why=[];
    fields.forEach(f=>{ const i=+f.dataset.i, v=val(f), w=(k==="gaps"?t.gaps[i]:t.items[i])||{}; let ok, right;
      if(k==="short"){ ok=exShortOk(w,v); right=[].concat(w.a)[0]; }
      else if(k==="match"){ ok=v!==""&&+v===w.a; right=w.a<0?"0":exLetter(w.a); }
      else if(k==="pick"){ ok=v!==""&&+v===w.a; right=`${exLetter(w.a)} (${exIcon(w.opts[w.a])[1]})`;
        f.querySelectorAll(".pickopt").forEach((l,j)=>{ l.classList.remove("on"); if(j===w.a) l.classList.add("right"); else if(String(j)===v) l.classList.add("wrong"); }); }
      else { ok=v!==""&&+v===w.a; right=optsOf(i)[w.a]; }
      if(ok) r++; f.disabled=true; f.classList.add(ok?"right":"wrong");
      const msg=`${ok?"":`Rätt: <b ${k==="pick"?"":lang()}>${esc(String(right))}</b>. `}${w.why?esc(w.why):""}`;
      if(k==="gaps"){ if(msg) why.push(`<li><b>(${i+1})</b> ${ok?"Rätt. ":""}${msg}</li>`); }
      else f.closest(".exq").querySelector(".exwhy").innerHTML=msg?`<p class="foot">${msg}</p>`:""; });
    if(k==="gaps") $("#gapwhy").innerHTML=why.length?`<ul class="checklist">${why.join("")}</ul>`:"";
    exResult(t,r,exItems(t),start);
  };
  $("#quit").onclick=exQuitGo;
}
// Ingen quiz: egna sidor för läsa/lyssna, skriva och tala. Loggposterna har kind "exam".
defineKind("exam",{name:"Provträning",open:openExam});
