/* ---------- Skugga: tala utan mikrofon ----------
   Artefakter får inte använda mikrofonen. I stället lyssnar eleven, säger meningen högt samtidigt
   som uppläsningen och bedömer själv hur det gick. */
function startShadow(){
  const p=shuffle(sentencePool()).filter(w=>tok(w.exT).length>=4).slice(0,6)
    .map(w=>({k:"shadow",id:"shadow:"+w.id,ref:w.id,w,t:"type",noRetry:true}));
  $("#tabs").hidden=true; sess=null; beginQuiz("shadow",p,{againFn:["shadow"],label:"Skugga"});
}
function renderShadow(d){
  const w=d.w;
  app.innerHTML=`<section class="panel"><span class="tab">Skugga</span>${progressHead()}
    <p class="q-prompt" style="font-size:1.3rem" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p>
    ${playBar()}
    <p class="q-ask">Lyssna först. Spela sedan upp igen och säg meningen högt samtidigt som rösten, med samma rytm och melodi. Gör det två eller tre gånger, gärna långsamt först.</p>
    <div class="grade"><button type="button" class="btn ghost" data-sh="0">Svårt</button><button type="button" class="btn ghost" data-sh="half">Nästan</button><button type="button" class="btn" data-sh="1">Det gick bra</button></div></section>
    ${quitBtn()}`;
  wirePlay(r=>speak(w.exT,r)); $("#quit").onclick=pauseSession; speak(w.exT);
  app.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>{ if(sess.answered) return; sess.answered=true;
    record(b.dataset.sh==="1"); sess.done++; snapRun(); nextQ(); });
}
defineKind("shadow",{name:"Skugga",
  type:c=>({tab:"Skugga",render:renderShadow,w:c.w,answer:c.w.exT,explain:"",say:c.w.exT}),
  restore:ref=>sentById(ref)?{w:sentById(ref)}:null,
  recap:ref=>sentById(ref)?sentById(ref).exT:"",
  open:startShadow, again:startShadow});
