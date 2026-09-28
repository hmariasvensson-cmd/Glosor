/* ---------- Dagens pass och den blandade rundan ---------- */
function dailyPanel(newW,due){
  const n=newW.length+due.length;
  const goal=S.goal||0, min=goal?myStats().min:0;
  return `<section class="panel daily"><h2>Dagens pass</h2>
    ${goal?`<div class="goal"><div class="meta"><span>Veckans mål</span><span>${min} av ${goal} min${min>=goal?" ✓":""}</span></div>
      <div class="bar"><i style="width:${Math.min(100,Math.round(100*min/goal))}%"></i></div></div>`:""}
    <p class="plan">${n?`Först glosorna (${n} frågor), sedan en blandad runda`:"En blandad runda"} med diktamen, verb, ordföljd, ${hasGrammar()?"grammatik, ":""}samtalsfraser och meningar. Ungefär 15 minuter.</p>
    <button class="btn" id="daily">Starta dagens pass</button></section>`;
}
function startDaily(newW,due){
  if(newW.length||due.length){ startSession(newW,due); sess.daily=true; snapRun(); }
  else startMix(true);
}
// daily===true: rundan hör till Dagens pass. Det skickas med till beginQuiz, så att det gäller även när eleven
// först får frågan om den påbörjade rundan och väljer "Börja om" (eller "Fortsätt").
// (Knappen efter glosorna anropar startMix med klickhändelsen, därför jämförs med true.)
function startMix(daily){
  daily=daily===true;
  const items=[], add=(arr,n)=>items.push(...shuffle(arr).slice(0,n));
  const sp=sentencePool().filter(w=>tok(w.exT).length>=3);
  add(sp.map(dictItem),3);
  const g=verbGames().find(x=>x.id==="tempus")||verbGames()[0]; if(g) add(verbItems(g,8),4);
  add(sp.filter(orderable).map(orderItem),2);
  if((C().phrases||[]).length) add(phraseItems(6),3);
  add(clozePool().map(clozeItem),3);
  if(hasGrammar()) add(gramItems("mix",6),3);
  if(!items.length) return renderStart();
  if(daily&&S.runs&&S.runs.mix) S.runs.mix.daily=true;
  $("#tabs").hidden=true; sess=null; beginQuiz("mix",shuffle(items),{againFn:["mix"],label:"Blandad runda",...(daily?{daily:true}:{})});
}
defineKind("mix",{name:"Blandad runda",again:startMix});   // frågorna har sina egna typer (k)
