/* ---------- Hörförståelse: lyssna utan texten, svara på frågorna, läs sedan texten ---------- */
function openListening(){
  pickerScreen("Hörförståelse","Lyssna på en dialog eller berättelse utan att se texten. Svara på frågorna, och läs sedan texten medan du lyssnar igen.",
    (C().listening||[]).map(t=>({id:t.id,title:t.title,sec:t.sec,status:txStatus(t.id)})),listenIntro);
}
function listenIntro(id){
  const t=textById("lq",id); stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Lyssna</span><span class="label">${esc(secName(t.sec))}</span>
    <h2 ${lang()}>${esc(t.title)}</h2>
    <p class="plan">Lyssna utan att läsa. Efteråt kommer ${t.questions.length} frågor, och du kan lyssna igen medan du svarar. Sist får du se texten.</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <button class="btn" id="toq">Till frågorna</button></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(t.lines,r)); $("#stop").onclick=stopSpeech;
  $("#toq").onclick=()=>{stopSpeech(); startTextQs("lq",id)}; $("#quit").onclick=openListening;
}
defineKind("lq",{name:"Hörförståelse",mc:textQ,restore:ref=>textQById("lq",ref)?{}:null,after:textAfter,open:openListening});
