/* ---------- Dagens pass: korta pass, flera gånger om dagen ----------
   Föräldern 2026-10-01: "Man kommer vilja ha flera pass per dag", på tunnelbanan, på rasten. Ett pass är ETT flöde på
   ungefär fem minuter (15–20 frågor): först lärokorten för de nya orden, sedan ett quiz där glosorna (förfallna och
   nya, alltid med) blandas med frågor ur två av tre grupper (PASS_GROUPS): fraser och meningar, grammatik (tyska även
   der/die/das), verb/diktamen/ordföljd. Grupperna turas om: den som inte var med i förra passet kommer först i nästa
   (passOrder, räknat ur loggen). Finns det få glosor kommer alla tre grupperna med.
   Passet är ett glospass (sess.kind "words", sess.dp = gruppernas id), så repetitionsschemat sköts av finishSession
   som förut, och frågorna av andra typer (k) räknas där som i finishGeneric (kindsDone). Det sparas efter varje svar
   under S.runs["words|pass"] (runKey) och kan fortsättas från panelen. Loggposterna från ett pass har dp: 1 och samma
   d, så antalet pass i dag = antalet olika d bland dagens poster med dp (passesToday). Ingen gräns per dag.
   Provdatum (S.examDate, "ÅÅÅÅ-MM-DD", valfritt): de sista sex veckorna hälften så många nya ord och en provuppgift
   efter passet, de sista två veckorna inga nya ord. En kort text (läsa eller lyssna) föreslås efter vartannat pass. */
const PASS_KEY="words|pass";
const PASS_NEW=5, PASS_DUE=10, PASS_WORD_SEC=150;   // högst 5 nya ord och 10 repetitioner, glosorna ungefär halva passet (150 s av 300)
/* Lång repetitionskö (föräldern 2026-10-06: "de nya orden måste med, men bra om de gamla kommer också"): fler
   repetitioner per pass när många ord väntar, utan att de nya orden försvinner (minst PASS_NEW_MIN), och en knapp
   för en extra repetitionsrunda på startsidan (REVIEW_HINT, REVIEW_RUN). */
const PASS_NEW_MIN=3, REVIEW_HINT=40, REVIEW_RUN=20;
const dueCount=()=>WORDS.reduce((a,w)=>{ const x=ws(w.id); return a+(x&&isDue(x)?1:0); },0);
const passDueCap=n=>n>60?20:n>25?15:PASS_DUE;
// Knappen Repetera: elevens val (S.dueMax, 0 = alla) eller REVIEW_RUN
const reviewRun=()=>S.dueMax===0?Infinity:(S.dueMax>0?S.dueMax:REVIEW_RUN);
// Ungefärlig tid per fråga i sekunder: ett nytt ord = lärokort och fråga
const PASS_T={new:20,mc:8,type:12};
const gNouns=()=>L.genderGame?genderNouns():[];
// Grupperna: kinds = loggens typer (passKind), has = finns innehåll, items = fyra frågor (ungefär en minut per grupp,
// diktamen och ordföljd tar längre tid än en fras)
const PASS_GROUPS=[
  {id:"say",name:"fraser och meningar",kinds:["phr","cloze"],
    has:()=>!!((C().phrases||[]).length||clozePool().length),
    items:()=>passFill(4,[phraseItems(4),2],[passCloze(4),2])},
  {id:"gram",name:()=>hasGrammar()?(gNouns().length?"grammatik och "+Object.values(L.genderGame).join(", "):"grammatik"):Object.values(L.genderGame||{}).join(", "),kinds:["gram","gen","plu"],
    has:()=>hasGrammar()||gNouns().length>0,
    items:()=>passFill(4,[hasGrammar()?gramItems("mix",6):[],2],[passGender(4),2])},
  {id:"form",name:"verb, diktamen och ordföljd",kinds:["verbs","dict","order"],
    has:()=>verbGames().length>0||dictPool().length>0||orderPool().length>0,
    items:()=>{ const g=verbGames().find(x=>x.id==="tempus")||verbGames()[0];
      return passFill(4,[g?verbItems(g,2):[],2],[weakestFirst(dictPool(),"dc",{due:true}).slice(0,3).map(dictItem),1],[weakestFirst(orderPool(),"od",{due:true}).slice(0,3).map(orderItem),1]); }}
];
const passName=g=>typeof g.name==="function"?g.name():g.name;
// n frågor: först kvoten ur varje källa, sedan fylls det på ur det som blev över (i källornas ordning)
function passFill(n,...src){
  const out=[], rest=[];
  src.forEach(([a,k])=>{ out.push(...a.slice(0,k)); rest.push(...a.slice(k)); });
  return out.concat(rest).slice(0,n);
}
const passCloze=n=>{ const p=clozePool(); return [...shuffle(p.filter(w=>!isMastered(w))),...shuffle(p.filter(isMastered))].slice(0,n).map(clozeItem); };
function passGender(n){
  if(!L.genderGame) return [];
  const sec=curSec(), pool=gNouns().filter(x=>isLearned(x.w)||x.w.sec===sec);
  return weakestFirst(pool,"ga",{id:x=>x.w.id,key:(x,st)=>st?(st.g||0)+(st.p||0):0}).slice(0,n).map(x=>({k:"gen",id:"gen:"+x.w.id,ref:x.w.id,t:"mc",canType:false}));
}
// Loggpostens typ (verb och meningar har verb: true och cloze: true i stället för kind)
const passKind=e=>e.verb?"verbs":e.cloze?"cloze":e.kind;
/* Gruppernas ordning i nästa pass: den som var med för längst sedan först (aldrig = först), vid lika den som varit
   med i färre pass, sedan PASS_GROUPS-ordningen. Så kommer gruppen som inte var med i förra passet alltid först. */
function passOrder(){
  const h={};
  S.log.forEach(e=>{ if(!e.dp) return; const g=PASS_GROUPS.find(g=>g.kinds.includes(passKind(e))); if(!g) return;
    const x=h[g.id]=h[g.id]||{last:0,ds:new Set()}; x.ds.add(e.d); x.last=Math.max(x.last,e.d); });
  const at=g=>h[g.id]||{last:0,ds:new Set()};
  return PASS_GROUPS.filter(g=>g.has()).map((g,i)=>({g,i,...at(g)})).sort((a,b)=>a.last-b.last||a.ds.size-b.ds.size||a.i-b.i).map(x=>x.g);
}
// Antal pass i dag: olika d bland dagens loggposter med dp (ett pass skriver flera poster med samma d)
function passesToday(){
  const t=dayKey(Date.now()), ds=new Set();
  S.log.forEach(e=>{ if(e.dp&&dayKey(e.d)===t) ds.add(e.d); });
  return ds.size||(S.dailyDay===t?1:0);   // dailyDay: Dagens pass gjort med en äldre version i dag
}
// Dagar kvar till provet (S.examDate), null utan datum. planDate/planToday i 82-plan.js.
function examDaysLeft(){ const d=planDate(S.examDate); return d?Math.round((d-planToday())/864e5):null; }
// 0 = vanligt, 1 = högst sex veckor kvar (hälften så många nya ord, provuppgift), 2 = högst två veckor (inga nya ord)
function examPhase(){ const n=examDaysLeft(); return n==null||n<0?0:n<=14?2:n<=42?1:0; }
// Glosorna i nästa pass: alla förfallna först (högst PASS_DUE), nya ord så länge det finns tid (högst PASS_NEW)
function passWords(){
  const ph=examPhase(); let cap=Math.min(S.newCount||0,PASS_NEW); if(ph===1) cap=Math.ceil(cap/2); if(ph===2) cap=0;
  const due=dueWords().slice(0,passDueCap(dueCount())), tDue=due.reduce((a,w)=>a+(qType(w,false)==="type"?PASS_T.type:PASS_T.mc),0);
  const n=Math.min(cap,Math.max(Math.min(cap,PASS_NEW_MIN),Math.floor((PASS_WORD_SEC-tDue)/PASS_T.new)));
  const newW=pickNew().slice(0,n);
  return {newW,due,sec:newW.length*PASS_T.new+tDue};
}
// Grupperna i nästa pass: två, eller alla tre när glosorna tar mindre än en tredjedel av tiden
const passGroups=sec=>{ const o=passOrder(); return o.slice(0,sec<100?o.length:2); };
const andList=a=>a.length>1?a.slice(0,-1).join(", ")+" och "+a[a.length-1]:a[0]||"";
function dailyPanel(){
  const goal=S.goal||0, min=goal?myStats().min:0, n=passesToday(), pr=S.runs&&S.runs[PASS_KEY];
  const {newW,due,sec}=passWords(), gs=passGroups(sec), days=examDaysLeft(), ph=examPhase();
  const nd=dueCount();
  const words=[newW.length?`${newW.length} nya ord`:"",due.length?`${due.length} ${due.length===1?"repetition":"repetitioner"}`:""].filter(Boolean);
  const what=words.length?andList(words)+(gs.length?" blandat med "+gs.map(passName).join(", "):""):gs.map(passName).join(", ");
  return `<section class="panel daily"><h2>Dagens pass</h2>
    ${goal?`<div class="goal"><div class="meta"><span>Veckans mål</span><span>${min} av ${goal} min${min>=goal?" ✓":""}</span></div>
      <div class="bar"><i style="width:${Math.min(100,Math.round(100*min/goal))}%"></i></div></div>`:""}
    <p class="plan" id="passn">${n?`<b>Pass ${n+1} i dag – kör ett till!</b> Du har gjort ${n} pass i dag.`:"Ett kort pass på ungefär fem minuter. Kör gärna flera om dagen, på bussen eller på rasten."}</p>
    ${what&&!pr?`<p class="plan">Nästa pass: ${esc(what)}. Övningarna turas om från pass till pass.</p>`:""}
    ${days!=null&&days>=0?`<p class="foot" id="examnote">Provet om ${days} ${days===1?"dag":"dagar"}.${ph===2?" Inga nya ord nu, bara repetition och provuppgifter.":ph===1?" Färre nya ord och en provuppgift efter passet.":""}</p>`:""}
    ${pr?`<p class="plan">Du har ett påbörjat pass: ${esc(runLabel(pr))}</p><button class="btn" id="daily-go">Fortsätt passet</button>`:""}
    <button class="btn${pr?" ghost":""}" id="daily">${pr?"Starta ett nytt pass":"Starta pass"}</button>
    ${nd>=REVIEW_HINT?`<p class="plan" id="reviewhint"><b>${nd} ord väntar på repetition.</b> Dagens pass tar ${due.length} åt gången, och nya ord kommer som vanligt. Vill du komma ikapp snabbare kan du köra en extra runda med bara repetition. Skriv svaren när du kan: ett ord räknas som "kan" först när du har skrivit det rätt några gånger.</p>
      <button class="btn ghost" id="review-go">${reviewRun()>=nd?`Repetera alla ${nd} ord`:`Repetera ${reviewRun()} ord`}</button>`:""}</section>`;
}
function wireDaily(){
  if($("#daily")) $("#daily").onclick=()=>startDaily();
  if($("#daily-go")) $("#daily-go").onclick=()=>{ S.run=S.runs[PASS_KEY]; resumeRun(); };
  if($("#review-go")) $("#review-go").onclick=()=>startSession([],dueWords().slice(0,reviewRun()));
}
// Ett nytt pass (ett påbörjat pass slängs). Argumenten från den gamla versionen (nya ord, repetitioner) används inte.
function startDaily(){
  if(S.runs) delete S.runs[PASS_KEY];
  if(S.run&&runKey(S.run)===PASS_KEY) delete S.run;
  const {newW,due,sec}=passWords(), gs=[];
  let mixIn=[];
  // En grupp utan frågor (t.ex. inga meningar än) hoppas över, och nästa grupp tar dess plats
  const want=passGroups(sec).length;
  passOrder().forEach(g=>{ if(gs.length>=want) return; const it=g.items(); if(it.length){ gs.push(g.id); mixIn=mixIn.concat(it); } });
  startSession(newW,due,{daily:true,dp:gs.length?gs:["words"],mixIn});
}
// Glosorna och de andra frågorna jämnt blandade, så att passet växlar mellan typerna
function passInterleave(a,b){
  a=shuffle(a); b=shuffle(b); const out=[]; let i=0, j=0;
  while(i<a.length||j<b.length){ if(j>=b.length||(i<a.length&&(i+1)/(a.length+1)<=(j+1)/(b.length+1))) out.push(a[i++]); else out.push(b[j++]); }
  return out;
}
// Efter passet: en kort text att läsa eller lyssna på (oläst, i kapitlet eleven är på, kortast först)
function dailyText(){
  const c=C(), sec=curSec(), tx=S.tx||{};
  const all=[...(c.reading||[]).map(t=>({k:"rq",t})),...(c.listening||[]).map(t=>({k:"lq",t}))].filter(x=>(x.t.questions||[]).length);
  const len=x=>(x.t.lines||[]).reduce((a,l)=>a+tl(l).length,0), here=x=>sameChapter(x.t.sec,sec)?0:1;
  return all.sort((a,b)=>(!!tx[a.t.id])-(!!tx[b.t.id])||here(a)-here(b)||((tx[a.t.id]||{}).last||0)-((tx[b.t.id]||{}).last||0)||len(a)-len(b))[0]||null;
}
// Provuppgift efter passet när provet närmar sig: en som rättas direkt, högst 20 minuter, den som gjorts för längst sedan.
// Läser bara indexet (k, time); innehållet hämtas när uppgiften öppnas (examTask → examWait).
function dailyExamTask(){
  if(!examPhase()||!hasExam()) return null;
  const st=(S.exam&&S.exam.t)||{}, ok=t=>["mc","match","gaps","short","pick"].includes(exKind(t))&&(+t.time||0)<=20;
  return EX().tasks.filter(ok).sort((a,b)=>((st[a.id]||{}).last||0)-((st[b.id]||{}).last||0))[0]||null;
}
// Knapparna efter passet (finishSession): ett pass till, dagens text varannan gång, provuppgiften
function dailyAfter(n){
  const t=n%2?dailyText():null, x=dailyExamTask();
  return `<button class="btn" id="again">Kör ett pass till</button>
    ${x?`<button class="btn ghost" id="dexam">Provuppgift: ${esc(x.title)} (${(+x.time||0)||"några"} min)</button>`:""}
    ${t?`<button class="btn ghost" id="dtext">${t.k==="lq"?"Lyssna på dagens text":"Läs dagens text"}: ${esc(t.t.title)}</button>`:""}`;
}
function wireDailyAfter(n){
  const t=n%2?dailyText():null, x=dailyExamTask();
  if($("#again")) $("#again").onclick=()=>startDaily();
  if(t&&$("#dtext")) $("#dtext").onclick=()=>openFrom(renderStart,()=>(t.k==="lq"?listenIntro:readIntro)(t.t.id),"Till startsidan");
  if(x&&$("#dexam")) $("#dexam").onclick=()=>openFrom(renderStart,()=>examTask(x.id),"Till startsidan");
}
/* Den blandade rundan (före oktober 2026 andra halvan av Dagens pass). Finns kvar för "En runda till" och för
   rundor som sparats med den gamla versionen; Dagens pass blandar nu in frågorna själv (startDaily).
   opts.daily: rundan hör till Dagens pass. Det skickas med till beginQuiz, så att det gäller även när eleven
   först får frågan om den påbörjade rundan och väljer "Börja om" (eller "Fortsätt").
   startMix(true) betyder detsamma (det gamla anropet, finns kvar för testerna); allt annat, även en klickhändelse, är en vanlig runda. */
function startMix(opts){
  const daily=opts===true||!!(opts&&typeof opts==="object"&&opts.daily===true);
  const items=[], add=(arr,n)=>items.push(...shuffle(arr).slice(0,n));
  // Diktamen och ordföljd: slumpat bland de förfallna och svagaste (tidsbaserad repetition, weakestFirst i 00-common.js)
  add(weakestFirst(dictPool(),"dc",{due:true}).slice(0,6).map(dictItem),3);
  const g=verbGames().find(x=>x.id==="tempus")||verbGames()[0]; if(g) add(verbItems(g,8),4);
  add(weakestFirst(orderPool(),"od",{due:true}).slice(0,4).map(orderItem),2);
  if((C().phrases||[]).length) add(phraseItems(6),3);
  add(clozePool().map(clozeItem),3);
  if(hasGrammar()) add(gramItems("mix",6),3);
  if(!items.length) return renderStart();
  if(daily&&S.runs&&S.runs.mix) S.runs.mix.daily=true;
  $("#tabs").hidden=true; sess=null; beginQuiz("mix",shuffle(items),{againFn:["mix"],label:"Blandad runda",daily});
}
defineKind("mix",{name:"Blandad runda",again:()=>startMix()});   // frågorna har sina egna typer (k)
