/* ---------- Kapitelprov ----------
   Alla glosor i ett kapitel (alla avsnitt k3, k3b, k3x … räknas till kapitel 3), en gång var och utan omtag, som ett prov.
   Provet flyttar inte repetitionsschemat. Resultatet sparas i S.kt[kapitel] = {r, n, d, miss}, och efteråt kan man öva på
   de missade orden (då med omtag, som i quizet) tills alla sitter. */
// Kapitlen (chapters och chapterKey i 00-common.js, samma som kapitelkartan) med minst fyra ord
const ktChapters=()=>chapters().filter(c=>c.words.length>=4);
const KT={mode:"type"};
function openKtest(){
  $("#tabs").hidden=true; sess=null; S.kt=S.kt||{};
  const chs=ktChapters();
  app.innerHTML=`<section class="panel"><h2>Kapitelprov</h2>
    <p class="plan">Välj ett kapitel. Du får alla glosor en gång, i blandad ordning, och ser resultatet i slutet. Sedan kan du öva på de ord du missade. Provet ändrar inte när orden kommer tillbaka i passen.</p>
    <div class="field"><span class="label">Svara genom att</span>
      <div class="seg" role="group" aria-label="Svarssätt"><button data-ktm="type" aria-pressed="${KT.mode==="type"}">Skriva ${esc(L.inLang)}</button><button data-ktm="mc" aria-pressed="${KT.mode==="mc"}">Flerval</button></div></div>
    <div class="games">${chs.map(c=>{const r=S.kt[c.id];
      return `<button class="game" data-kt="${esc(c.id)}"><span><b>${esc(c.name)}</b><small>${c.words.length} ord${r?` · senast ${r.r}/${r.n} rätt (${new Date(r.d).toLocaleDateString("sv-SE")})`:""}</small></span><span class="go" aria-hidden="true">›</span></button>`}).join("")}</div></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  app.querySelectorAll("[data-ktm]").forEach(b=>b.onclick=()=>{KT.mode=b.dataset.ktm;
    app.querySelectorAll("[data-ktm]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  app.querySelectorAll("[data-kt]").forEach(b=>b.onclick=()=>startKtest(b.dataset.kt));
  $("#quit").onclick=renderStart; window.scrollTo(0,0);
}
function startKtest(cid,only){
  const c=ktChapters().find(x=>x.id===cid); if(!c) return openKtest();
  const words=only?c.words.filter(w=>only.includes(w.id)):c.words, drill=!!only;
  const q=shuffle(words).map(w=>({k:"ktest",id:"ktest:"+w.id,w,t:drill?"mc":KT.mode,canType:true,noRetry:!drill}));
  sess=null; $("#tabs").hidden=true;
  beginQuiz(drill?"ktestd":"ktest",q,{label:drill?`Öva: ${c.name}`:`Kapitelprov: ${c.name}`,ctx:{type:"ktest",id:cid,drill}});
}
function ktestAfter(ctx,right,total,miss){
  const c=ktChapters().find(x=>x.id===ctx.id)||{name:"",words:[]}; S.kt=S.kt||{};
  if(!ctx.drill){ S.kt[ctx.id]={r:right,n:total,d:Date.now(),miss}; save(); }
  const pc=total?Math.round(100*right/total):0;
  app.innerHTML=`<section class="panel">${resultHead(ctx.drill?`Övning klar: ${c.name}`:`Kapitelprov: ${c.name}`,right,total)}
    ${ctx.drill?"":`<p class="plan">${pc}% rätt. ${pc>=90?"Mycket bra, kapitlet sitter!":pc>=70?"Bra! Öva på de ord du missade, så sitter kapitlet.":"Öva på de ord du missade och gör provet igen om några dagar."}</p>`}
    ${miss.length?`<div class="field"><span class="label">${ctx.drill?"Missade första gången":"Ord du missade"}</span><ul class="missed">${miss.map(id=>byId[id]).filter(Boolean).map(w=>`<li><span class="t" ${lang()}>${esc(w.t)}</span><span class="sv">${esc(w.sv)}</span></li>`).join("")}</ul></div>
      <button class="btn" id="ktdrill">Öva på ${miss.length===1?"ordet":`de ${miss.length} orden`}</button>`:`<p class="plan">Inga fel!</p>`}
    <div class="navrow"><button class="btn ghost" id="kthome">Startsidan</button><button class="btn ghost" id="ktagain">Gör provet igen</button></div></section>`;
  if($("#ktdrill")) $("#ktdrill").onclick=()=>startKtest(ctx.id,miss);
  $("#kthome").onclick=renderStart; $("#ktagain").onclick=()=>startKtest(ctx.id);
  window.scrollTo(0,0); renderList();
}
// Frågorna är glosquizets (KINDS.words). Övningen på de missade orden har sess.kind "ktestd", men frågorna har k "ktest".
defineKind("ktest",{name:"Kapitelprov",
  mc:c=>({...KINDS.words.mc(c),tab:"Kapitelprov"}),
  type:c=>({...KINDS.words.type(c),tab:"Kapitelprov"}),
  restore:ref=>byId[ref]?{w:byId[ref]}:null,
  recap:ref=>byId[ref]?byId[ref].t:"",
  after:ktestAfter, open:openKtest});
