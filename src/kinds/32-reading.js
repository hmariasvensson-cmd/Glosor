/* ---------- Läsförståelse: läs texten, spara ord i Mina ord, svara på frågorna ---------- */
function openReading(){
  pickerScreen("Läsa texter","Läs en längre text. Tryck på ord du inte kan för att se vad de betyder och spara dem i Mina ord. Sist kommer några frågor.",
    (C().reading||[]).map(t=>({id:t.id,title:t.title,sec:t.sec,status:txStatus(t.id)})),readIntro);
}
function readIntro(id){
  const t=textById("rq",id); stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Läsa</span><span class="label">${esc(secName(t.sec))}</span>
    <h2 ${lang()}>${esc(t.title)}</h2>
    <p class="plan">Tryck på ord du inte kan, och tryck igen för att ta bort markeringen. De valda orden samlas under texten, där du kan lägga till dem i Mina ord. Understrukna ord har en färdig översättning. <span class="gl known">Gröna ord</span> övar du redan på.</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <div class="reading">${tapText(t.lines,t.gloss,{sv:true})}</div>
    <div class="glossbox" id="gbox" hidden></div>
    <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button>
    <button class="btn" id="toq">Till frågorna</button></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  wirePlay(r=>speakSeq(t.lines,r,highlightLine)); $("#stop").onclick=stopSpeech; wireGloss(t); wireSvToggle();
  $("#toq").onclick=()=>{stopSpeech(); startTextQs("rq",id)}; $("#quit").onclick=()=>{stopSpeech();openReading()};
}
defineKind("rq",{name:"Läsförståelse",mc:textQ,restore:ref=>textQById("rq",ref)?{}:null,after:textAfter,open:openReading});
