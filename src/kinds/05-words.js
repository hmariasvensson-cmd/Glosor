/* ---------- Glosquizet (typen "words") ----------
   Passet med nya ord och repetitioner: lärokorten (renderLearn), frågorna (flerval: ord → betydelse, skriva:
   betydelse → ord), kortet efter ett fel svar (studyCard, memoBox) och slutet av passet, där svaren förs in i
   repetitionsschemat (applyAnswer, schedule i app.js) och loggen (finishSession). Vilka ord som är nya (pickNew)
   och vilka som ska repeteras (dueWords) avgörs i app.js. */

/* Passet: nya ord först (lärokort), sedan quizet. o.daily: passet hör till Dagens pass. o.dp (gruppernas id) och
   o.mixIn (frågor av andra typer som blandas in i quizet): ett kort pass i Dagens pass (startDaily i 90-mix.js). */
function startSession(newW,due,o){
  $("#tabs").hidden=true;
  sess={newW,due,i:0,kind:"words",start:Date.now(),daily:!!(o&&o.daily)};
  if(o&&o.dp) Object.assign(sess,{dp:o.dp,mixIn:o.mixIn||[],label:"Dagens pass"});
  if(newW.length) renderLearn(); else startQuiz();
}
function renderLearn(){
  const w=sess.newW[sess.i], n=sess.newW.length;
  sess.shown=sess.shown||{};
  if(S.listenFirst&&!sess.shown[sess.i]){   // lyssna först: bara ljud tills eleven vill se ordet
    app.innerHTML=`<section class="panel">
      <div class="meta"><span>Nya ord · ${esc(secName(w.sec))}</span><span>${sess.i+1} / ${n}</span></div>
      <div class="bar"><i style="width:${(sess.i/n)*100}%"></i></div>
      <p class="q-ask">Lyssna på ordet och meningen. Försök uppfatta vad som sägs innan du tittar.</p>
      <div class="listen"><button class="btn ghost" id="lw">${PLAY} Ordet</button><button class="btn ghost" id="le">${PLAY} Meningen</button><button class="btn ghost" id="ls">Långsamt</button></div>
      <button class="btn" id="show">Visa ordet</button></section>
      <button class="quit" id="quit">Avbryt passet</button>`;
    $("#lw").onclick=()=>speak(w.t); $("#le").onclick=()=>speak(w.exT); $("#ls").onclick=()=>speak(w.exT,.6);
    $("#show").onclick=()=>{sess.shown[sess.i]=true;renderLearn()};
    $("#quit").onclick=pauseSession; snapRun(); speak(w.t); return;
  }
  app.innerHTML=`
  <section class="panel">
    <div class="meta"><span>Nya ord · ${esc(secName(w.sec))}</span><span>${sess.i+1} / ${n}</span></div>
    <div class="bar"><i style="width:${(sess.i/n)*100}%"></i></div>
    <div class="word">
      <div style="display:flex;flex-direction:column;gap:6px">
        <p class="t-big" ${lang()}>${esc(w.t)}</p>
        <p class="sv-big">${esc(w.sv)}</p>
        <div class="tags">${gtag(w.g)}</div>
      </div>
      <button class="speak" id="sp-w" aria-label="Läs upp ordet">${SPK}</button>
    </div>
    <div class="example">
      <div><p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p></div>
      <button class="speak sm" id="sp-e" aria-label="Läs upp meningen">${SPK}</button>
    </div>
    ${litHtml(w)}<p class="ety"><span class="label">${esc(L.etyLabel||"Ursprung")}</span><br>${safeHtml(w.ety)}</p>
    <div class="navrow">
      <button class="btn ghost" id="prev" ${sess.i?"":"disabled"}>Tillbaka</button>
      <button class="btn" id="next">${sess.i===n-1?"Till quizet":"Nästa ord"}</button>
    </div>
    <p class="kbd-hint">Tangentbord: mellanslag eller Enter = nästa, ← = tillbaka. I quizet: siffrorna väljer svar och Enter går vidare.</p>
  </section>
  <button class="quit" id="quit">Avbryt passet</button>`;
  $("#sp-w").onclick=()=>speak(w.t); $("#sp-e").onclick=()=>speak(w.exT);
  $("#prev").onclick=()=>{sess.i--;renderLearn()};
  $("#next").onclick=()=>{if(sess.i<n-1){sess.i++;renderLearn()}else startQuiz()};
  $("#quit").onclick=pauseSession;
  snapRun();
  if(!S.listenFirst) speak(w.t);
}
function qType(w,isNew){ if(S.mode==="mc")return"mc"; if(S.mode==="type")return"type"; return isNew?"mc":((ws(w.id)||{}).f||"mc"); }
function startQuiz(){
  const items=[...sess.newW.map(w=>({w,isNew:true,t:qType(w,true)})),...sess.due.map(w=>({w,isNew:false,t:qType(w,false)}))]
    .map(q=>({...q,canType:q.t==="type"}));
  // Quizet är en ny runda (nytt sess i beginQuiz); från lärokorten följer bara det här med
  const {newW,due,i,extra,daily,start,dp,label}=sess;
  if(dp) return beginQuiz("words",passInterleave(items,sess.mixIn||[]),{newW,due,i,extra,daily,start,dp,label});   // Dagens pass
  beginQuiz("words",shuffle(items),{newW,due,i,extra,daily,start});
}

/* Glosquizets frågor (flerval och skriva) och kortet som visas efter ett fel svar */
// Felalternativ: fyra ord med olika betydelse, först ur samma avsnitt, sedan ur resten (pickSome blandar bara så långt det behövs)
function mcOptions(w){
  // Inte samma betydelse som rätt svar eller ett annat alternativ (synonymer, alsoRight i 00-common.js)
  const ok=(x,picks)=>!alsoRight(x,w)&&!picks.some(p=>p.sv===x.sv||svOverlap(p.sv,x.sv));
  const picks=pickSome(secWords(w.sec),4,ok);
  if(picks.length<4) pickSome(WORDS,4,(x,p)=>x.sec!==w.sec&&ok(x,p),picks);
  return shuffle([w,...picks]);
}
const explain=w=>`<p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p>${(ws(w.id)||{}).memo?`<p class="foot">Din minnesregel: ${esc(ws(w.id).memo)}</p>`:""}`;
// Lärokortet igen efter ett fel svar: ord, översättning, genus, exempel med uppläsning och ursprung
const studyCard=w=>`<div class="recap">
  <div class="word" style="padding-top:0"><div><p class="recap-t" ${lang()}>${esc(w.t)}</p><p class="recap-sv">${esc(w.sv)}</p><div class="tags">${gtag(w.g)}</div></div>
    <button type="button" class="speak sm" data-say="${esc(w.t)}" aria-label="Läs upp ordet">${SPK}</button></div>
  <div class="example"><div><p class="ex-t" ${lang()}>${esc(w.exT)}</p><p class="ex-sv">${esc(w.exSv)}</p></div>
    <button type="button" class="speak sm" data-say="${esc(w.exT)}" aria-label="Läs upp meningen">${SPK}</button></div>
  ${litHtml(w)}${w.ety?`<p class="ety"><span class="label">${esc(L.etyLabel||"Ursprung")}</span><br>${safeHtml(w.ety)}</p>`:""}
  ${memoBox(w)}</div>`;
// Fraser och talesätt: vad varje ord betyder ordagrant (sjunde fältet i words.txt), t.ex. "avoir – ha · le cafard – kackerlackan"
function litHtml(w){ return w.lit?`<p class="ety lit"><span class="label">Ordagrant</span><br>${safeHtml(w.lit)}</p>`:""; }
// Egen minnesregel: visas om den finns, och kan skrivas för ord man ofta glömmer
function memoBox(w){
  const x=ws(w.id)||{}, m=x.memo||"";
  if(!m&&!isLeech(w)) return "";
  return `<div class="memo"><span class="label">${m?"Din minnesregel":"Svårt ord"}</span>
    ${m?`<p class="ety">${esc(m)}</p>`:`<p class="ety">Det här ordet har du glömt flera gånger. Hitta på en egen minnesregel, till exempel en bild, ett ord det låter som eller en mening om något du själv har varit med om.</p>`}
    ${ws(w.id)?`<form class="memof" data-memo="${esc(w.id)}" autocomplete="off"><input class="search" maxlength="160" placeholder="${m?"Ändra din minnesregel":"Skriv din minnesregel"}" value="${esc(m)}"><button class="btn ghost" style="width:auto">Spara</button></form>`:""}</div>`;
}
document.addEventListener("submit",e=>{const f=e.target.closest&&e.target.closest("[data-memo]"); if(!f) return; e.preventDefault();
  const x=ws(f.dataset.memo); if(!x) return; const v=f.querySelector("input").value.trim();
  if(v) x.memo=v.slice(0,160); else delete x.memo; save();
  f.outerHTML=`<p class="foot">Sparat. Minnesregeln visas nästa gång ordet kommer.</p>`;});

/* Glosquizet: ord → betydelse (flerval) och betydelse → ord (skriva) */
defineKind("words",{name:"Glosor",
  mc:c=>{const w=c.w;return{
    head:`<div class="word"><p class="q-prompt" ${lang()}>${esc(w.t)}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div>`,
    ask:"Vad betyder det?",
    opts:mcOptions(w).map(o=>({label:o.sv,ok:o.id===w.id})),
    wrongCard:studyCard(w),
    explain:explain(w), say:w.t, sayOnShow:true}},
  type:c=>{const w=c.w;return{
    head:`<p class="q-prompt">${esc(w.sv)}</p>`,
    ask:`Skriv ${L.inLang} ${w.g?`(${genderName(w.g)})`:""}`, placeholder:"Skriv här", accents:L.accents,
    accepted:variants(w.t), answer:w.t, explain:explain(w), wrongCard:studyCard(w), say:w.t, override:true, onAnswer:rateBox}}});

/* Självbedömning i fyra steg (S.selfRate, av som standard): efter ett rätt skrivet svar på första försöket väljer
   eleven Igen/Svårt/Bra/Lätt (tangenterna 1–4). Bra är förvalt, så Enter, mellanslag och Nästa går vidare som
   vanligt. Fel svar är alltid Igen. Bedömningen sparas i sess.rate (och S.run.rate) och används av schedule i
   finishSession: Svårt = samma steg (kommer tillbaka tidigare), Lätt = två steg upp. Igen räknas som fel svar.
   Bara skrivna svar kan bedömas, så flerval räcker fortfarande bara till steg MC_MAX. Extraövningen visar inga knappar
   (den flyttar inte schemat). */
const RATES=[["again","Igen"],["hard","Svårt"],["good","Bra"],["easy","Lätt"]];
function rateBox(ok){
  const c=sess&&sess.cur; if(!ok||!S.selfRate||!c||sess.kind!=="words"||sess.extra||c.again||c.t!=="type"||(c.k&&c.k!=="words")) return;
  const id=itemId(c), fb=app.querySelector("#fb .feedback"); if(!fb||sess.firstTry[id]!==true) return;
  sess.rate=sess.rate||{};
  fb.insertAdjacentHTML("beforeend",`<div class="rate" id="rate"><span class="label">Hur svårt var det?</span>
    <div class="grade">${RATES.map(([k,n])=>`<button type="button" class="btn ${k==="good"?"":"ghost"}" data-rate="${k}" aria-pressed="${k==="good"}">${n}</button>`).join("")}</div>
    <p class="foot">Tangenterna 1–4. Bra är förvalt: Enter eller Nästa går vidare.</p></div>`);
  fb.querySelectorAll("[data-rate]").forEach(b=>b.onclick=()=>rateWord(b.dataset.rate));
}
function rateWord(k){
  const c=sess&&sess.cur; if(!c||!sess.answered) return;
  const id=itemId(c); sess.rate=sess.rate||{};
  if(k==="good") delete sess.rate[id]; else sess.rate[id]=k;
  if(k==="again"){   // "Jag chansade": räknas som fel och kommer tillbaka som flerval, som ett fel svar
    sess.firstTry[id]=false;
    if(!sess.queue.some(q=>itemId(q)===id)&&(sess.tries[id]||0)<MAX_AGAIN){ sess.tries[id]=(sess.tries[id]||0)+1; sess.queue.push({...c,t:"mc",again:true}); sess.total++; }
  }
  nextQ();
}

/* ---------- Pass klart: schemaläggning ---------- */
function applyAnswer(x,id){
  const t=sess.firstType[id]||"mc", ok=sess.firstTry[id]!==false;
  x.mcR=x.mcR||0;x.mcW=x.mcW||0;x.tyR=x.tyR||0;x.tyW=x.tyW||0;
  if(t==="mc"){ ok?x.mcR++:x.mcW++; if(ok) x.f="type"; else x.f="mc"; }
  else { ok?x.tyR++:x.tyW++; x.f = ok?"type":"mc"; }
  return {t,ok};
}
function tally(E,r){ if(r.ok)E.right++; if(r.t==="mc"){E.mcN++; if(r.ok)E.mcR++;} else {E.tyN++; if(r.ok)E.tyR++;} }
function finishSession(){
  const p=S.pass, now=Date.now();
  const extra=!!sess.extra, dp=!!sess.dp;
  const ids=[...sess.newW,...sess.due].map(w=>w.id);
  // Dagens pass: frågorna av andra typer (fraser, grammatik, verb …) räknas som i finishGeneric, och tiden delas efter antal frågor
  const wid=new Set(ids), other=dp?Object.keys(sess.firstTry).filter(id=>!wid.has(id)):[];
  const dur=runSecs(sess.start,now), part=n=>Math.round(dur*n/Math.max(1,ids.length+other.length));
  const E={p,d:now,dur:other.length?part(ids.length):dur,nNew:sess.newW.length,nRep:sess.due.length,right:0,total:ids.length,mcR:0,mcN:0,tyR:0,tyN:0,extra};
  if(dp) E.dp=1;
  const rate=id=>{const r=(sess.rate||{})[id]; return r==="hard"||r==="easy"?r:undefined;};
  sess.newW.forEach(w=>{const x={s:0,due:p+INT[0],lp:p,ld:now}; const r=applyAnswer(x,w.id); S.w[w.id]=x; tally(E,r);
    if(!extra&&r.ok&&r.t==="type"&&rate(w.id)==="easy"){ x.s=1; x.due=p+INT[1]; }});   // Lätt: ett nytt ord hoppar över nästa pass
  let newlyMastered=0;
  sess.due.forEach(w=>{
    const x=S.w[w.id]; const r=applyAnswer(x,w.id); tally(E,r);
    if(extra) return;               // extraövning flyttar inte schemat
    const was=x.s; schedule(x,r.ok,p,now,r.t,r.ok&&r.t==="type"?rate(w.id):undefined); if(r.ok&&was<MASTER&&x.s>=MASTER) newlyMastered++;
  });
  // Ett pass i Dagens pass utan glosor (inget att repetera, inga nya ord) räknas inte som glospass
  if(ids.length||!dp){ S.log.push(E); if(!extra) S.pass++; }
  if(other.length) kindsDone(other,part(other.length),now,{dp:1});
  const daily=sess.daily; if(daily) S.dailyDay=dayKey(now);
  dropRun(sess); delete S.run; save();
  const right=ids.filter(id=>sess.firstTry[id]!==false).length+other.filter(id=>sess.firstTry[id]).length, total=ids.length+other.length;
  const missed=ids.filter(id=>sess.firstTry[id]===false).map(id=>byId[id]);
  const recap=other.filter(id=>!sess.firstTry[id]).map(id=>{const i=id.indexOf(":"), K=KINDS[id.slice(0,i)]; return K&&K.recap?K.recap(id.slice(i+1)):"";}).filter(Boolean);
  const mastered=extra?0:newlyMastered, n=dp?passesToday():0;
  app.innerHTML=`<section class="panel">
    <span class="label">${extra?"Extraövning klar":dp?`Pass ${n} i dag klart`:`Pass ${p} klart`}</span>
    <div style="display:flex;align-items:baseline;gap:10px"><span class="big">${right}/${total}</span><span class="sub">rätt på första försöket</span></div>
    <p class="plan">${extra?"Extraövningen påverkar inte när orden kommer tillbaka, men den räknas i statistiken.":""}${sess.newW.length?`De ${sess.newW.length} nya orden kommer tillbaka i nästa pass.`:""}
      ${mastered?` ${mastered} ord är nu inlärda. De kommer tillbaka då och då, med allt längre mellanrum.`:""}
      ${missed.length&&!extra?" Orden du missade flyttas ned ett steg och kommer tillbaka snart.":""}</p>
    ${missed.length?`<div class="field"><span class="label">Öva lite extra på</span><ul class="missed">${missed.map(w=>`<li><span class="t" ${lang()}>${esc(w.t)}</span><span class="sv">${esc(w.sv)}</span></li>`).join("")}</ul></div>`:""}
    ${recap.length?`<div class="field"><span class="label">Titta på de här en gång till</span><ul class="missed">${recap.map(m=>`<li><span ${lang()}>${esc(m)}</span><button type="button" class="speak xs" data-say="${esc(m)}" aria-label="Läs upp">${SPK}</button></li>`).join("")}</ul></div>`:""}
    ${dp?dailyAfter(n):""}
    <div class="navrow"><button class="btn ghost" id="st">Statistik</button><button class="btn ${dp?"ghost":""}" id="home">Till startsidan</button></div></section>`;
  sess=null; boardPush(); $("#home").onclick=renderStart; $("#st").onclick=()=>setView("stats"); renderList();
  if(dp) wireDailyAfter(n);
}
