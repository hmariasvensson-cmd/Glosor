/* ---------- Hörförståelse och läsförståelse: det som båda delar ----------
   content/listening.json och content/reading.json = [{id, sec, title, lines: [{who, fr, sv}], gloss, questions: [{q, opts, a, type, why}]}]
   (fr = texten på målspråket, se tl). Fråge-id "lq:<id>:<nr>" och "rq:<id>:<nr>". Sparat: S.tx[id] = {r, n, best, last}. */
const textById=(k,id)=>(C()[k==="lq"?"listening":"reading"]||[]).find(t=>t.id===id);
const txStatus=id=>{const o=(S.tx||{})[id]; return o?`${o.best}/${o.n} rätt`:"";};
function startTextQs(k,id){
  const t=textById(k,id);
  const items=t.questions.map((q,i)=>({k,id:`${k}:${id}:${i}`,ref:`${id}:${i}`,t:"mc",noRetry:true}));
  sess=null; beginQuiz(k,items,{ctx:{type:k,id},label:(k==="lq"?"Hörförståelse: ":"Läsförståelse: ")+t.title});
}
const textQById=(k,ref)=>{const [id,i]=ref.split(":"), t=textById(k,id), q=t&&(t.questions||[])[+i]; return q&&Array.isArray(q.opts)?q:null;};
function textQ(c){
  const k=c.k, [id,i]=c.ref.split(":"), t=textById(k,id), q=t.questions[+i];
  const kind={helhet:"Helheten",detalj:"Detaljer",tolkning:"Tolka"}[q.type]||"";
  return{tab:k==="lq"?"Lyssna":"Läsa",
    head:k==="lq"?playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)
      :`<details class="more"><summary>Visa texten igen</summary><div class="reading">${tapText(t.lines,null)}</div></details>`,
    ask:`${kind?`<span class="label">${kind}</span><br>`:""}<b>${esc(q.q)}</b>`,
    opts:optOrder(q.opts).map(j=>({label:q.opts[j],ok:j===q.a})),explain:q.why?`<p>${esc(q.why)}</p>`:"",
    wire:k==="lq"?()=>{wirePlay(r=>speakSeq(t.lines,r)); $("#stop").onclick=stopSpeech;}:null};
}
function textAfter(ctx,right,total){
  const k=ctx.type, t=textById(k,ctx.id); if(!t) return renderStart(); S.tx=S.tx||{}; const o=S.tx[ctx.id]||{};
  S.tx[ctx.id]={r:right,n:total,best:Math.max(o.best||0,right),last:Date.now()}; save();
  app.innerHTML=`<section class="panel">${resultHead(k==="lq"?"Hörförståelse klar":"Läsförståelse klar",right,total)}
    <p class="plan">${k==="lq"?"Här är texten. Lyssna en gång till medan du läser. Tryck på ord du vill spara, så samlas de under texten."
      :"Bra jobbat! Ord du sparade finns under Mina ord och kommer med i nästa pass."}</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <div class="reading">${tapText(t.lines,t.gloss,{sv:true,lineSpeak:true})}</div>
    <div class="glossbox" id="gbox" hidden></div>
    <button type="button" class="btn ghost" id="svt">Visa svensk översättning</button>
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="more">${k==="lq"?"Fler hörövningar":"Fler texter"}</button></div></section>`;
  wirePlay(r=>speakSeq(t.lines,r,highlightLine)); $("#stop").onclick=stopSpeech; wireGloss(t); wireSvToggle();
  $("#home").onclick=()=>{stopSpeech();renderStart()}; $("#more").onclick=()=>{stopSpeech();(k==="lq"?openListening:openReading)()};
  window.scrollTo(0,0);
}
