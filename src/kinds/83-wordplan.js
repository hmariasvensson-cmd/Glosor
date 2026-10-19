/* ---------- Ordplan fram till provet (föräldern 2026-10-18: "räkna ut hur många dagar det är till nästa hp hela tiden
   och se till att man tills den tiden har hunnit lära sig alla ord") ----------
   Bara kurser med L.examDates (Högskoleprovet ORD). Provdatumet är elevens eget (S.examDate) eller annars nästa datum i
   L.examDates efter i dag. Orden som är kvar delas jämnt på dagarna fram till två veckor före provet (WP_BUFFER); de
   sista två veckorna är för repetition (examPhase 2 i 90-mix.js ger inga nya ord då). Dagens kvot räknas om varje dag
   ur hur många ord som är kvar, så en missad dag fördelas på resten. S.newCount = WP_PLAN (-1) betyder "enligt plan":
   pickNew och Dagens pass tar då dagens återstående kvot (newCountNow). Inget nytt sparas utom valet i S.newCount. */
const WP_PLAN=-1, WP_BUFFER=14, WP_PASS_MAX=25;
const hasWordPlan=()=>Array.isArray(L.examDates)&&L.examDates.length>0;
// Nästa provdag: elevens eget datum om det inte har passerat, annars första datumet i L.examDates efter i dag
function wpExamDate(){
  const t=planToday(), own=planDate(S.examDate);
  if(own&&own>=t) return own;
  if(!hasWordPlan()) return null;
  return L.examDates.map(planDate).filter(d=>d&&d>t).sort((a,b)=>a-b)[0]||null;
}
const wpDaysLeft=()=>{ const d=wpExamDate(); return d?Math.round((d-planToday())/864e5):null; };
// Nya ord i dag: summan av nNew i dagens loggposter
function wpLearnedToday(){
  const t0=+planToday(); return (S.log||[]).reduce((a,l)=>a+(l&&l.d>=t0?(l.nNew||0):0),0);
}
function wordPlan(){
  if(!hasWordPlan()) return null;
  const date=wpExamDate(), days=wpDaysLeft(); if(!date) return null;
  const left=WORDS.filter(w=>!isLearned(w)&&!isElective(w.sec)).length, today=wpLearnedToday();
  const learnDays=days-WP_BUFFER, stop=new Date(+date-WP_BUFFER*864e5);
  // Kvoten räknas på morgonens läge (orden som var kvar när dagen började), så den ändras inte under dagen
  const perDay=learnDays>0?Math.ceil((left+today)/learnDays):0;
  return {date,days,left,today,perDay,todayLeft:Math.max(0,perDay-today),stop,learnDays,total:WORDS.length};
}
// Antal nya ord att ta nu: elevens val, eller dagens återstående kvot när planen är vald
function newCountNow(){
  if(S.newCount!==WP_PLAN) return S.newCount||0;
  const p=wordPlan(); return p?Math.min(p.todayLeft,WP_PASS_MAX):0;
}
const wpWhen=d=>d.toLocaleDateString("sv-SE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
function wordPlanPanel(){
  try{
    const p=wordPlan(); if(!p) return "";
    const name=L.examName||"provet", on=S.newCount===WP_PLAN;
    const head=`<div class="meta"><span class="label">Nedräkning</span><span>${p.days===0?"i dag":p.days+(p.days===1?" dag":" dagar")} kvar</span></div>`;
    let body;
    if(!p.left) body=`<p class="plan">Du har lärt dig alla ${p.total} ord. Fram till ${esc(name)} ${esc(wpWhen(p.date))} gäller det att repetera, så att orden sitter.</p>`;
    else if(p.learnDays<=0) body=`<p class="plan">Nästa ${esc(name)} är ${esc(wpWhen(p.date))}. Nu är det mindre än två veckor kvar, så Dagens pass tar bara repetitioner. ${p.left} ord är kvar att lära; de tas efter provet.</p>`;
    else{
      const pc=Math.round(100*(p.total-p.left)/p.total), done=p.todayLeft===0;
      body=`<p class="plan">Nästa ${esc(name)} är <b>${esc(wpWhen(p.date))}</b>. ${p.left} av ${p.total} ord är kvar att lära. För att hinna alla behöver du <b>${p.perDay} nya ord om dagen</b> fram till ${esc(p.stop.toLocaleDateString("sv-SE",{day:"numeric",month:"long"}))}; de sista två veckorna är för repetition.</p>
      <div class="bar" role="img" aria-label="${pc} procent av orden inlärda"><i style="width:${pc}%"></i></div>
      <p class="foot">${done?`Dagens ${p.perDay} nya ord är klara. Bra! Repetera gärna, eller ta fler nya ord om du vill ligga före.`:`I dag: ${p.today} av ${p.perDay} nya ord. ${p.todayLeft} kvar.`}${on?"":` Välj <b>Plan</b> under Antal nya ord, så tar passen dagens ord.`}</p>`;
    }
    return `<section class="panel" id="wordplan">${head}${body}</section>`;
  }catch(e){ warnErr("nedräkningen kunde inte visas",e); return ""; }
}
