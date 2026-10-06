/* ---------- Kultur ----------
   content/culture.json = [{id, sec, title, lines, gloss, q: {q, opts, a, why}, ask, model, modelSv}]. Ingen quiz, en egen sida.
   Sparat: S.cu[id] = {q, words, last}, utkastet i S.drafts["c:<id>"] och en loggpost med kind "culture". */
function openCulture(){
  S.cu=S.cu||{};
  pickerScreen("Kultur",L.cultureIntro||"Läs en kort text, svara på en fråga och jämför med hur det är i Sverige.",
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
    <div class="opts">${optOrder(c.q.opts).map((i,n)=>`<button class="opt" data-i="${i}"><span class="k">${n+1}</span><span>${esc(c.q.opts[i])}</span></button>`).join("")}</div><div id="fb"></div></section>
  <section class="panel"><h2>Och i Sverige?</h2><p class="plan">${esc(c.ask)}</p>
    <textarea class="answer-in wtext" id="ctext" rows="4" ${lang()} autocapitalize="sentences" spellcheck="false" placeholder="Skriv här">${esc(S.drafts[dk]||"")}</textarea>
    ${accentKeys(L.accents)}
    <details class="more"><summary>Visa ett exempelsvar</summary><p class="ex-t" ${lang()}>${esc(c.model)}</p><p class="ex-sv">${esc(c.modelSv||"")}</p></details>
    <p class="foot" id="cmsg"></p>
    <button type="button" class="btn ghost" id="fbbtn">Få kommentarer av Claude</button><div id="fbout"></div>
    <div class="navrow"><button type="button" class="btn ghost" id="copy">Kopiera texten</button><button class="btn" id="done">Klar</button></div></section>
  <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(c.lines,r,highlightLine)); wireGloss(c); wireSvToggle();
  app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    if(qok!==null) return; const i=+b.dataset.i; qok=i===c.q.a;
    app.querySelectorAll(".opt").forEach(x=>{const k=+x.dataset.i; x.disabled=true; if(k===c.q.a)x.classList.add("right"); else if(k===i)x.classList.add("wrong");});
    $("#fb").innerHTML=`<div class="feedback ${qok?"ok":"bad"}"><strong>${qok?"Rätt!":"Inte riktigt."}</strong><p>${esc(c.q.why||"")}</p></div>`;
  });
  const ta=$("#ctext"); let tm=null; wireAccents(ta);
  wireFeedback(ta,dk,`${c.ask} (Kort svar, några meningar, efter att ha läst en text om "${c.title}".)`);
  const st=S; ta.oninput=()=>{clearTimeout(tm); tm=setTimeout(()=>{ if(S!==st) return; (S.drafts=S.drafts||{})[dk]=ta.value; save();},800);};   // inte i en annan kurs eller profil
  $("#copy").onclick=()=>copyText(ta,$("#cmsg"));
  $("#done").onclick=()=>{ S.drafts[dk]=ta.value; S.cu[id]={q:!!qok,words:tok(ta.value).length,last:Date.now()};
    S.log.push({kind:"culture",d:Date.now(),dur:runSecs(start),right:qok?1:0,total:1}); save(); boardPush(); backTo(openCulture)(); };
  $("#quit").onclick=backTo(openCulture);
  window.scrollTo(0,0);
}
defineKind("culture",{name:"Kultur",open:openCulture});
