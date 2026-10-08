/* ---------- Förslag att repetera (förälderns önskemål 2026-10-08) ----------
   En ruta på startsidan, under Dagens pass, med högst fyra förslag som räknas fram ur elevens egna resultat:
   väntande repetitioner, de svåraste orden (isLeech), det svagaste grammatikområdet och kapitelprovet med flest
   missade ord. Utöver veckans glosförhör och det klassen jobbar med, som eleven själv vet bäst. Rutan syns inte när
   inget förslag finns, och inte för en helt ny elev. Inget sparas: knapparna startar vanliga övningar. */
const SUG_DUE=20, SUG_LEECH=3, SUG_LEECH_RUN=15, SUG_GRAM_PCT=75, SUG_GRAM_N=5, SUG_KT_PCT=80;
function suggestions(){
  const out=[], nd=dueCount();
  if(nd>=SUG_DUE) out.push({id:"due",title:`Repetera ord som väntar`,sub:`${nd} ord ska repeteras. Skriv svaren, så räknas orden som "kan".`,
    go:()=>startSession([],dueWords().slice(0,reviewRun()))});
  const lee=WORDS.filter(w=>isLeech(w)&&!isMastered(w));
  if(lee.length>=SUG_LEECH) out.push({id:"leech",title:`Dina svåraste ord`,sub:`${lee.length} ord som du har missat många gånger, t.ex. ${lee.slice(0,3).map(w=>w.t).join(", ")}.`,
    go:()=>startSession([],shuffle(lee).slice(0,SUG_LEECH_RUN))});
  if(hasGrammar()){ const gt=S.gt||{};
    const g=GR().topics.filter(t=>gt[t.id]&&gt[t.id].n>=SUG_GRAM_N).map(t=>({t,p:pct(gt[t.id].r,gt[t.id].n)}))
      .filter(x=>x.p<SUG_GRAM_PCT).sort((a,b)=>a.p-b.p)[0];
    if(g) out.push({id:"gram",title:`Grammatik: ${g.t.name}`,sub:`${g.p} % rätt hittills. Passet börjar med regeln i korthet.`,go:()=>gramIntro(g.t.id)}); }
  if(S.kt&&typeof ktChapters==="function"){
    const k=ktChapters().map(c=>({c,r:S.kt[c.id]})).filter(x=>x.r&&x.r.n&&Array.isArray(x.r.miss)&&x.r.miss.length&&100*x.r.r/x.r.n<SUG_KT_PCT)
      .sort((a,b)=>a.r.r/a.r.n-b.r.r/b.r.n)[0];
    if(k) out.push({id:"kt",title:`Kapitelprov: ${k.c.name}`,sub:`${k.r.r} av ${k.r.n} rätt senast. Öva på de ${k.r.miss.length} ord du missade.`,go:()=>startKtest(k.c.id,k.r.miss)}); }
  return out.slice(0,4);
}
function suggestPanel(){
  try{
    if(!(S.log||[]).length) return "";
    const s=suggestions(); if(!s.length) return "";
    return `<section class="panel" id="suggest"><span class="tab">Repetera</span><h2>Förslag att repetera</h2>
      <p class="plan">Utöver veckans glosförhör och det ni jobbar med i skolan. Förslagen bygger på dina egna resultat.</p>
      <div class="games">${s.map(x=>`<button class="game" data-sug="${esc(x.id)}"><span><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></span><span class="go" aria-hidden="true">›</span></button>`).join("")}</div></section>`;
  }catch(e){ warnErr("förslagen kunde inte visas",e); return ""; }
}
function wireSuggest(){
  app.querySelectorAll("[data-sug]").forEach(b=>b.onclick=()=>{ const x=suggestions().find(s=>s.id===b.dataset.sug); if(x) x.go(); });
}
