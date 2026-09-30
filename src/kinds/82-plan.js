/* ---------- Studieplan för självstudier ----------
   languages/<kod>/plan.json (valfri, följer med kursens datafil som L.plan) = {title, intro, weeks: [{id, title,
     words: [{sec, part, of}], grammar: [område i grammar.json], do: [{k, id}], tip}]}.
   words: veckans ord är del `part` av `of` lika stora delar av avsnittet `sec` (i ordlistans ordning), så att nya ord
   som läggs till sist i ett avsnitt bara flyttar gränsen lite. do: k = lq, rq, write, culture, story, exam (id i
   respektive innehållsfil), ktest (id = avsnitt) eller examsim (hel provsimulering). build.py kontrollerar hänvisningarna.
   Sparat: S.plan = {start: "ÅÅÅÅ-MM-DD"}, första dagen i vecka 1. Aktuell vecka räknas fram ur startdatumet och dagens datum.
   Inget annat i S ändras av planen (utom S.src när eleven väljer "Ta nya ord från veckans avsnitt").
   Tillbaka: uppgifter och grammatik öppnas med openFrom(openPlan, …) (app.js), så att Tillbaka, Avbryt och slutskärmens
   knapp ("Till studieplanen") leder hit och inte till övningens lista. */
const hasPlan=()=>!!(L&&L.plan&&Array.isArray(L.plan.weeks)&&L.plan.weeks.length);
const PLAN_DAY=864e5;
let PLAN_OPEN=null;   // veckan där eleven senast öppnade en uppgift: den är öppen när eleven kommer tillbaka
const PLAN_BACK="Till studieplanen";   // etiketten på slutskärmens knapp när uppgiften öppnats från planen
function planDate(s){ const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(String(s||"")); return m?new Date(+m[1],m[2]-1,+m[3]):null; }
const planIso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const planToday=()=>{ const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),d.getDate()); };
const planStart=()=>planDate(S.plan&&typeof S.plan==="object"?S.plan.start:null);
// Index för aktuell vecka (0 = vecka 1), -1 före start, weeks.length efter sista veckan, null utan startdatum
function planWeekIdx(){
  const st=planStart(); if(!st) return null;
  const days=Math.round((planToday()-st)/PLAN_DAY), n=L.plan.weeks.length;
  return days<0?-1:Math.min(n,Math.floor(days/7));
}
function planSetStart(iso){ S.plan=Object.assign({},S.plan&&typeof S.plan==="object"?S.plan:{}); if(iso) S.plan.start=iso; else delete S.plan.start; save(); }
// Veckans ord: del part av of i avsnittet
function planWords(wk){
  const out=[];
  (wk.words||[]).forEach(r=>{ const all=((L.base&&L.base.words)||[]).filter(w=>w.sec===r.sec), of=r.of||1, p=r.part||1;
    out.push(...all.slice(Math.floor(all.length*(p-1)/of),Math.floor(all.length*p/of))); });
  return out;
}
function planProgress(wk){
  const ws_=planWords(wk); let known=0, started=0;
  ws_.forEach(w=>{ const x=ws(w.id); if(x){ started++; if(x.s>=MASTER) known++; } });
  return {n:ws_.length,known,started};
}
const planRange=r=>{ const s=SECTIONS.find(x=>x.id===r.sec), nm=s?s.name:r.sec; return (r.of||1)>1?`${nm} (del ${r.part} av ${r.of})`:nm; };
// Ett innehåll i planen: titel, klart eller inte, och hur det öppnas
function planItem(x){
  const c=C(), f=(k,id)=>(c[k]||[]).find(y=>y.id===id), ex=typeof hasExam==="function"&&hasExam()?EX():null;
  switch(x.k){
    case "lq": { const t=f("listening",x.id); return t&&{label:"Hörförståelse",title:t.title,done:!!(S.tx&&S.tx[x.id]),go:()=>listenIntro(x.id)}; }
    case "rq": { const t=f("reading",x.id); return t&&{label:"Läsa",title:t.title,done:!!(S.tx&&S.tx[x.id]),go:()=>readIntro(x.id)}; }
    case "write": { const t=f("prompts",x.id); return t&&{label:"Skriva",title:t.title,done:!!(S.wr&&S.wr[x.id]),go:()=>writeScreen(x.id)}; }
    case "culture": { const t=f("culture",x.id); return t&&{label:"Kultur",title:t.title,done:!!(S.cu&&S.cu[x.id]),go:()=>cultureScreen(x.id)}; }
    case "story": { const t=f("stories",x.id); return t&&{label:"Berättelse",title:t.title,done:!!(S.stb&&S.stb[x.id]!=null),go:()=>startStory(x.id)}; }
    case "exam": { const t=ex&&ex.tasks.find(y=>y.id===x.id), p=t&&ex.parts.find(y=>y.id===t.part);
      return t&&{label:`Provträning · ${p?p.sv:t.part}${t.teil?" "+t.teil.toLowerCase():""}`,title:t.title,done:!!(S.exam&&S.exam.t&&S.exam.t[x.id]),go:()=>examTask(x.id)}; }
    case "examsim": return ex&&{label:"Provträning",title:"Hel provsimulering med klocka",done:!!(S.exam&&(S.exam.sims||[]).length),go:()=>startExamSim()};
    case "ktest": { const s=SECTIONS.find(y=>y.id===x.id); return s&&{label:"Kapitelprov",title:s.name,done:!!(S.kt&&S.kt[x.id]),go:()=>startKtest(x.id)}; }
  }
  return null;
}
const planDates=i=>{ const st=planStart(); if(!st) return "";
  const a=new Date(st.getTime()+i*7*PLAN_DAY+3*36e5), b=new Date(a.getTime()+6*PLAN_DAY), o={day:"numeric",month:"short"};
  return `${a.toLocaleDateString("sv-SE",o)} – ${b.toLocaleDateString("sv-SE",o)}`; };
const planBar=(r,n)=>`<div class="track" data-tip="${r} av ${n} ord kan du"><i style="width:${n?Math.round(100*r/n):0}%;background:var(--c2)"></i></div>`;

function planWeekHtml(wk,i,cur){
  const pr=planProgress(wk), items=(wk.do||[]).map((x,j)=>[j,planItem(x)]).filter(([,it])=>it);
  const gt=S.gt||{}, topics=(hasGrammar()?GR().topics:[]).filter(t=>(wk.grammar||[]).includes(t.id));
  const nDone=items.filter(([,it])=>it.done).length;
  const head=[`Vecka ${i+1}`,planDates(i),i===cur?"denna vecka":""].filter(Boolean).join(" · ");
  return `<details class="more planwk" data-wk="${i}" ${i===cur||i===PLAN_OPEN?"open":""} style="border-top:1px solid var(--line,#e5e2d9);padding-top:10px;margin-top:10px">
    <summary><b>${esc(head)}</b><br><span ${lang()}>${esc(wk.title)}</span><br><small>${pr.n?`${pr.known} av ${pr.n} ord kan du`:"Inga nya ord"}${items.length?` · ${nDone} av ${items.length} uppgifter klara`:""}</small></summary>
    ${pr.n?`<p class="foot">Ord: ${esc((wk.words||[]).map(planRange).join(", "))}. Du har börjat på ${pr.started} och kan ${pr.known} av ${pr.n}.</p>${planBar(pr.known,pr.n)}
      <button type="button" class="btn ghost" data-plansrc="${esc(wk.words[0].sec)}">Ta nya ord från ${esc(planRange({sec:wk.words[0].sec}))}</button>`:""}
    ${topics.length?`<p class="label" style="margin-top:12px">Grammatik</p><div class="games">${topics.map(t=>{const g=gt[t.id];
      return `<button class="game" data-plangram="${esc(t.id)}"><span><b>${esc(t.name)}</b><small>${g&&g.n?`${pct(g.r,g.n)} % rätt av ${g.n} svar`:"Inte övat än"}</small></span><span class="go" aria-hidden="true">›</span></button>`;}).join("")}</div>`:""}
    ${items.length?`<p class="label" style="margin-top:12px">Lyssna, läsa, skriva och prov</p><div class="games">${items.map(([j,it])=>
      `<button class="game" data-planitem="${i}|${j}"><span><b ${lang()}>${esc(it.title)}</b><small>${esc(it.label)}${it.done?" · klar":""}</small></span><span class="go" aria-hidden="true">${it.done?"✓":"›"}</span></button>`).join("")}</div>`:""}
    ${wk.tip?`<p class="plan">${esc(wk.tip)}</p>`:""}
  </details>`;
}

function openPlan(){
  if(!hasPlan()) return renderStart();
  if(RETURN_TO!==openPlan) PLAN_OPEN=null;   // öppnad från startsidan, inte på väg tillbaka från en uppgift
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  const P=L.plan, n=P.weeks.length, cur=planWeekIdx(), st=planStart();
  const status=cur===null?"Välj när du började (eller vilken vecka du är på), så visas veckan du ska vara på."
    :cur<0?`Planen börjar ${st.toLocaleDateString("sv-SE",{day:"numeric",month:"long"})}.`
    :cur>=n?"Alla veckor i planen har gått. Bra jobbat! Fortsätt med repetitionerna, eller gå vidare till nästa kurs."
    :`Du är på vecka ${cur+1} av ${n}.`;
  app.innerHTML=`<section class="panel" id="planp"><h2>${esc(P.title||"Studieplan")}</h2><p class="plan">${esc(P.intro||"")}</p>
    <div class="field"><label class="label" for="plan-start">Första dagen i vecka 1</label>
      <input type="date" id="plan-start" class="answer-in" value="${st?planIso(st):""}"></div>
    <div class="field" style="margin-top:8px"><label class="label" for="plan-wk">Eller: jag är på vecka</label>
      <select id="plan-wk" class="answer-in"><option value="">Välj vecka</option>${P.weeks.map((w,i)=>`<option value="${i}" ${i===cur?"selected":""}>Vecka ${i+1}</option>`).join("")}</select></div>
    <p class="insight" id="plan-status">${esc(status)}</p>
    ${P.weeks.map((w,i)=>planWeekHtml(w,i,cur)).join("")}
  </section><button class="quit" id="quit">Tillbaka</button>`;
  $("#plan-start").onchange=e=>{ planSetStart(planDate(e.target.value)?e.target.value:null); openPlan(); };
  $("#plan-wk").onchange=e=>{ if(e.target.value==="") return; const t=planToday();
    // Vecka k i dag: starten blir måndagen den här veckan, minus k-1 veckor
    const mon=new Date(t.getFullYear(),t.getMonth(),t.getDate()-((t.getDay()+6)%7)-7*(+e.target.value));
    planSetStart(planIso(mon)); openPlan(); };
  app.querySelectorAll("[data-plansrc]").forEach(b=>b.onclick=()=>{ S.src=b.dataset.plansrc; save(); renderStart(); });
  // Uppgifterna öppnas med openFrom (app.js): Tillbaka, Avbryt och slutskärmens knapp leder tillbaka hit
  app.querySelectorAll("[data-plangram]").forEach(b=>b.onclick=()=>{ PLAN_OPEN=+b.closest(".planwk").dataset.wk; openFrom(openPlan,()=>startGram(b.dataset.plangram),PLAN_BACK); });
  app.querySelectorAll("[data-planitem]").forEach(b=>b.onclick=()=>{ const [i,j]=b.dataset.planitem.split("|").map(Number);
    const it=planItem(P.weeks[i].do[j]); PLAN_OPEN=i; if(it) openFrom(openPlan,it.go,PLAN_BACK); });
  $("#quit").onclick=renderStart;
  const open=app.querySelector(PLAN_OPEN!=null?`.planwk[data-wk="${PLAN_OPEN}"]`:".planwk[open]");
  if(open&&(cur>0||PLAN_OPEN!=null)) open.scrollIntoView({block:"start"}); else window.scrollTo(0,0);
}
// Kortet på startsidan (ovanför Fler övningar): aktuell vecka och hur många av veckans ord eleven kan
function planCard(){
  if(!hasPlan()) return "";
  const n=L.plan.weeks.length, cur=planWeekIdx(), wk=cur!=null&&cur>=0&&cur<n?L.plan.weeks[cur]:null, pr=wk&&planProgress(wk);
  const sub=cur===null?"Ett förslag vecka för vecka. Tryck för att välja när du börjar."
    :cur<0?"Planen har inte börjat än.":!wk?"Alla veckor är klara.":`${wk.title}${pr.n?` · ${pr.known} av ${pr.n} ord`:""}`;
  return `<section class="panel"><div class="games"><button class="game" data-ex="plan" id="plancard"><span><b>${wk?`Studieplan · vecka ${cur+1} av ${n}`:"Studieplan"}</b>
    <small ${wk?lang():""}>${esc(sub)}</small></span><span class="go" aria-hidden="true">›</span></button></div></section>`;
}
defineKind("plan",{name:"Studieplan",open:openPlan});
