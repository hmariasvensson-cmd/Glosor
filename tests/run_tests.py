#!/usr/bin/env python3
"""Kör programmet i Chrome utan fönster och spelar igenom övningarna.

    python3 build.py && python3 tests/run_tests.py

Testet startar med sparat läge i samma format som en riktig elev har, och med en låtsad
claude.ai-lagring (window.claude). Varje rad i utskriften är ett påstående; FEL betyder att något gick sönder.
"""
import os, pathlib, subprocess, sys, tempfile, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SEED = r"""<script>
const now=Date.now();
function student(){const st={pass:5,newCount:10,src:"auto",mode:"mix",vt:{},vv:{},w:{},
  log:[{p:1,d:now-4*864e5,dur:300,nNew:15,nRep:0,right:12,total:15,mcR:12,mcN:15,tyR:0,tyN:0,extra:false}]};
  ["bienvenue à tous","désigner","de la main","balbutier","ordinateur","c'est tout","entendre","les autres","rire","rougir"].forEach((id,i)=>st.w[id]={s:i%3,due:3,f:"type",lp:1,ld:now-4*864e5});
  st.w["ancien mot"]={s:4,due:1e9,f:"type",lp:1,mp:2};   // pensionerat med gamla schemat
  return st}
window.__err=[];window.onerror=(m,s,l,c)=>{__err.push(m+" @"+l+":"+c)};
localStorage.clear();
window.__remote={"data/users/u_test/franska-glosor-v2":{state:student(),t:now-1000}};
const snap=p=>({exists:!!__remote[p],data:()=>__remote[p],metadata:{hasPendingWrites:false,fromCache:false}});
const mockDb={
  doc:p=>({get:async()=>snap(p),set:async b=>{__remote[p]=JSON.parse(JSON.stringify(b))},onSnapshot:n=>{setTimeout(()=>n(snap(p)),0);return()=>{}}}),
  collection:c=>{const docs=()=>Object.keys(__remote).filter(k=>k.startsWith(c+"/")).map(k=>({id:k.split("/")[1],exists:true,data:()=>__remote[k]}));
    return {onSnapshot:n=>{setTimeout(()=>n({docs:docs()}),0);return()=>{}},
      where:(f,op,v)=>({get:async()=>({docs:docs().filter(d=>d.data()[f]===v)})})};}};
window.__fbPrompt="";
const mockSample=Object.assign(async()=>({text:"x"}),{json:async p=>{if(p.includes("bedömare")) return {kriterier:[{namn:"A",poang:4,kommentar:"ok"},{namn:"B",poang:3,kommentar:"ok"}],helhet:"Godkänt.",fel:[]};
  window.__fbPrompt=p; return {helhet:"Bra jobbat.",bra:["Tydlig start"],fel:[{citat:"je suis allé",rattat:"je suis allée",varfor:"Kongruens"}],nasta:"Fler bindeord",niva:"A2+",prov:"Nästan B1"};}});
window.claude={use:async n=>n==="sample"?mockSample:n==="db"?mockDb:n==="user"?{id:async()=>"u_test",profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{name:""}]))}:null};
try{speechSynthesis.speak=()=>{}}catch(e){}
</script>"""

SCENARIO_DE = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
setTimeout(()=>{ try{
  useLang("de"); ok("tyska: kurs byts", q("#coursechip").textContent.includes("Tyska 5"));
  ok("tyska: rubrik för videor", !q("#app").textContent.includes("på franska"));
  ok("tyska: ingen bokpanel", !q("#chapter"));
  ok("tyska: fler än 800 ord", WORDS.length>800, WORDS.length);
  startDict(); let g=0; while(sess&&g++<80){ const c=sess.cur;
    if(c.t==="mc"){answerMC(sess.d.opts.findIndex(o=>o.ok)); q("#nx").click();} else {q("#ans").value=c.w.exT; q("#submit").click(); q("#submit").click();} }
  ok("tyska: diktamen", S.log[S.log.length-1].kind==="dict");
  { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id+": "+writeChecks(p,p.model).filter(c=>!c.ok).map(c=>c.label).join("; "));
    ok("tyska: modelltexterna klarar checklistan", (C().prompts||[]).length&&!bad.length, bad.join(" | ")); }
  const ansDe=()=>{ const c=sess.cur, d=sess.d;
    if(c.t==="mc"){answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return;}
    if(c.k==="shadow"){ q('[data-sh="1"]').click(); return; }
  if(d.render){ d.o.words.forEach(w=>[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w).click()); q("#submit").click(); q("#submit").click(); return; }
    q("#ans").value=c.k==="gram"?gramById(c.ref).ans.replace(" … "," "):c.w.exT; q("#submit").click(); q("#submit").click(); };
  const runDe=()=>{let g=0; while(sess&&g++<80) ansDe();};
  // Grammatik
  renderStart(); ok("tyska: knapp för grammatik", !!q('[data-ex="gram"]')); q('[data-ex="gram"]').click();
  ok("grammatik: ämnen att välja", document.querySelectorAll("[data-pick]").length>=5, document.querySelectorAll("[data-pick]").length);
  ok("adjektiv: substantiv ur ordlistan", adjNouns().length>200 && !adjNouns().some(n=>/Kollege|Angestellte|Studierende/.test(n.noun)), adjNouns().length);
  { const x=adjItem("adj|"+adjNouns().find(n=>n.g==="m").id+"|akk|indef|0|0"); ok("adjektiv: einen neuen", x.ans==="neuen"&&/einen/.test(x.p.parts[0]), x.p.parts.join("_")); }
  startGram("adj"); const first=sess.cur; sess.cur.t="type"; sess.d=TYPE.gram(sess.cur); renderType(sess.d);
  q("#ans").value="xyz"; q("#submit").click(); ok("grammatik: fel svar kommer tillbaka som flerval", sess.queue.some(x=>x.again&&x.t==="mc")); q("#submit").click();
  runDe(); ok("grammatik: runda loggad", S.log[S.log.length-1].kind==="gram" && S.gt.adj.n>=10, JSON.stringify(S.gt));
  { const x=Object.values(gramBank()).find(x=>x.topic==="passiv"&&x.p&&x.p.gaps.length>1); sess=null;
    beginQuiz("gram",[{k:"gram",id:"gram:"+x.id,ref:x.id,t:"type",canType:true}],{label:"t"}); q("#ans").value=x.p.gaps.join(" "); q("#submit").click(); }
  ok("grammatik: två luckor skrivs i ordning", q("#ans").classList.contains("right")); q("#submit").click(); runDe();
  startGram("bisatz"); ok("bisats: brickor", document.querySelectorAll("[data-t]").length>=5);
  { const x=Object.values(gramBank()).find(x=>x.type==="rw"&&(x.acc||[]).length&&tok(x.a).length===x.a.split(" ").length); sess=null;
    beginQuiz("gram",[{k:"gram",id:"gram:"+x.id,ref:x.id,t:"type",canType:true}],{label:"t"});
    tok(x.acc[0]).forEach(w=>{const b=[...document.querySelectorAll("[data-t]")].find(t=>tok(t.textContent)[0]===w); if(b) b.click();}); }
  q("#submit").click(); ok("bisats: bisatsen först godkänns", q("#built").classList.contains("right"), q("#built").textContent); q("#submit").click(); runDe();
  startGram("praep"); answerMC(0); q("[data-report]").click();
  setTimeout(()=>{},0);
  startGram("err"); ok("hitta felet: fyra val", sess.d.opts.length>=3 && sess.d.opts.filter(o=>o.ok).length===1); runDe();
  startGram("mix"); runDe(); ok("blandad grammatik", S.gt.mix&&S.gt.mix.n>0);
  startMix(); ok("blandad runda har grammatik", [sess.cur,...sess.queue].some(x=>x.k==="gram")); runDe();
  const pl=[["Konflikt","-e","Konflikte"],["Vorwurf","-würfe","Vorwürfe"],["Stiefvater","-väter","Stiefväter"],["Abschluss","-schlüsse","Abschlüsse"],
    ["Freundin","-nen","Freundinnen"],["Studium","Studien","Studien"],["Angst","Ängste","Ängste"],["Bankkonto","Konten","Bankkonten"],["Lehrer","-","Lehrer"],["Grenze","-n","Grenzen"]];
  const bad=pl.filter(([n,m,w])=>pluralOf(n,m)!==w).map(([n,m,w])=>n+"→"+pluralOf(n,m));
  ok("plural räknas fram rätt", !bad.length, bad.join(", "));
  ok("der/die/das: många substantiv", genderNouns().length>400, genderNouns().length+" / plural "+genderNouns().filter(n=>n.pl).length);
  renderStart(); q('[data-ex="gen"]').click(); ok("der/die/das: tre val", sess.d.opts?sess.d.opts.length>=3:true);
  { let g=0; while(sess&&g++<80){ const c=sess.cur, d=sess.d; if(c.t==="mc"){answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click();} else {q("#ans").value="die "+gnById(c.ref).pl; q("#submit").click(); q("#submit").click();} } }
  ok("der/die/das: loggad", S.log.some(l=>l.kind==="gen")&&Object.keys(S.ga||{}).length>=5);
  window.__plurals=genderNouns().filter(n=>n.pl).map(n=>n.w.t+" => "+n.pl).join("\n");
  setView("stats"); ok("statistik: grammatik", q("#app").textContent.includes("Adjektivändelser"));
  ok("rapport om fel facit sparas", Object.keys(__remote).some(k=>k.startsWith("reports/u_test-")), Object.keys(__remote).join());
  // Tyska 4: egen kurs med egen sparnyckel
  renderStart(); q('[data-only="1"]').click();
  ok("bara tyska: båda tyska kurserna i väljaren", !q(".coursepick").hidden&&[...q("#course").options].map(o=>o.value).join()==="de4,de", [...q("#course").options].map(o=>o.value).join());
  q('[data-only="0"]').click();
  useLang("de4"); ok("tyska 4: kurs byts", q("#coursechip").textContent.includes("Tyska 4")&&L.storageKey==="glosor-de4-v1");
  ok("tyska 4: egna framsteg", S.pass===1||!Object.keys(S.w).some(id=>LANGUAGES.de.base&&!byId[id]), S.pass);
  ok("tyska 4: fler än 400 ord", WORDS.length>400, WORDS.length);
  ok("tyska 4: grammatik", Object.keys(gramBank()).length>200, Object.keys(gramBank()).length);
  ok("tyska 4: verbspel utan Konjunktiv I", verbGames().length===3&&!L.verbs.tenses["Konjunktiv I"]&&CONJ.length>100);
  ok("tyska 4: lang-attribut", lang()==='lang="de"');
  { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id);
    ok("tyska 4: texter och modelltexter", (C().listening||[]).length>=8&&(C().culture||[]).length>=6&&(C().prompts||[]).length&&!bad.length, bad.join()); }
  ok("tyska 4: inget förslag om Tyska 5 än", !q("#nextc"));
  { const keep=S.w; S.w={}; WORDS.forEach(w=>S.w[w.id]={s:5,due:999}); renderStart();
    ok("tyska 4: förslag att gå vidare", !!q("#nextc")&&q("#nextc").textContent.includes("Tyska 5")); S.w=keep; }
  q("#nextc").click(); ok("tyska 4: går vidare till Tyska 5", L.code==="de"); useLang("de4");
  renderStart(); q('[data-ex="gram"]').click(); ok("tyska 4: grammatikämnen", document.querySelectorAll("[data-pick]").length>=9, document.querySelectorAll("[data-pick]").length);
  for(const t of ["reflexiv","komp","nebensatz","bisatz"]){ startGram(t); runDe(); }
  ok("tyska 4: grammatik loggad", ["reflexiv","komp","nebensatz"].every(t=>S.gt[t]&&S.gt[t].n>0), JSON.stringify(S.gt));
  { const n=S.log.length; startMix(); ok("tyska 4: blandad runda har grammatik", [sess.cur,...sess.queue].some(x=>x.k==="gram")); runDe();
    ok("tyska 4: blandad runda klar", !sess&&S.log.length>n); }
 }catch(e){ ok("undantag", false, e.message); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},1500);
</script>"""

SCENARIO = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
function answerRight(){
  const c=sess.cur, d=sess.d, k=c.k||sess.kind;
  if(c.t==="mc"){answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return;}
  if(c.k==="shadow"){ q('[data-sh="1"]').click(); return; }
  if(d.render){ d.o.words.forEach(w=>[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w).click()); q("#submit").click(); q("#submit").click(); return; }
  let v; if(k==="verbs") v=c.c.full; else if(k==="cloze") v=c.w.gap.ans; else if(k==="dict"||k==="trans") v=c.w.exT;
  else if(k==="phr") v=phrById(c.ref).fr; else v=c.w.t.replace(/\(.*?\)/g,"").split(/\s*[,=]\s*/)[0];
  q("#ans").value=v; q("#submit").click(); q("#submit").click();
}
const runAll=()=>{let g=0; while(sess&&g++<80) answerRight();};
const lastLog=()=>S.log[S.log.length-1];
setTimeout(async()=>{ try{
  ok("molnets framsteg hämtas", S.pass===5);
  ok("pensionerat ord får ett repetitionsdatum", S.w["ancien mot"].due<1e9 && S.w["ancien mot"].s===4, JSON.stringify(S.w["ancien mot"]));
  { const x={s:3,due:0}; schedule(x,true,10,now); const k=x.s===4&&x.due===10+INT[4]&&x.mp===10;
    schedule(x,true,50,now); const k2=x.s===5&&x.due===50+INT[5];
    schedule(x,false,60,now); ok("schema: upp ett steg vid rätt, kan-ord tillbaka till steg 2 vid fel", k&&k2&&x.s===2&&!x.mp&&x.lapses===1, JSON.stringify(x));
    const y={s:1,due:0}; schedule(y,false,5,now); ok("schema: fel på steg 1 ger steg 0", y.s===0&&y.due===6); }
  ok("högst MAXDUE repetitioner per pass", dueWords().length<=MAXDUE);
  { const w=byId["rire"]; S.w["rire"].lapses=3; document.body.insertAdjacentHTML("beforeend","<div id=mt>"+studyCard(w)+"</div>");
    const f=q("#mt [data-memo]"); ok("svårt ord: fält för minnesregel", !!f); f.querySelector("input").value="Rire låter som ridikyl";
    f.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})); ok("minnesregeln sparas", S.w["rire"].memo==="Rire låter som ridikyl");
    ok("minnesregeln visas", studyCard(w).includes("Rire låter som ridikyl")&&explain(w).includes("ridikyl")); q("#mt").remove(); delete S.w["rire"].lapses; delete S.w["rire"].memo; }
  { const f=(v,t,i)=>CONJ.find(c=>c.verb===v&&c.tense===t&&c.person===L.verbs.persons[i]).full;
    ok("verb: subjonctif med que", f("avoir","subjonctif",0)==="que j'aie"&&f("avoir","subjonctif",2)==="qu'il/elle ait"&&f("parler","futur simple",3)==="nous parlerons", f("avoir","subjonctif",0)+" | "+f("avoir","subjonctif",2));
    ok("verb: que je tas bort vid rättning", check("que je fasse",["fasse"],true)==="right"); }
  ok("kurs och nivå visas", q("#coursechip").textContent.includes("Franska 3"), q("#coursechip").textContent);
  ok("kommande kurs går inte att välja", [...q("#course").options].some(o=>o.disabled&&o.text.includes("Franska 4")));
  ok("dagens pass finns", !!q("#daily"));
  ok("bokpanel med kapitel", !!q("#chapter")&&q(".book").textContent.includes("Escalade"));
  q("#chapter").value="k2"; q("#chapter").dispatchEvent(new Event("change"));
  ok("kapitlet ni läser kommer först", S.chapter==="k2"&&pickNew().filter(w=>w.sec!=="mine")[0].sec==="k2"&&curSec()==="k2", pickNew().slice(0,3).map(w=>w.sec).join());
  ok("nya ord grupperade efter bok och allmänt", !!q('#src optgroup[label^="Boken"]'));
  q("#chapter").value="k4"; q("#chapter").dispatchEvent(new Event("change"));
  ok("kapitlets grammatik kommer först", chapterTopics().includes("pron")&&!chapterTopics().includes("subj"), chapterTopics().join());
  { const g=gramItems("mix",10).map(x=>gramById(x.ref).topic); ok("blandad grammatik tar hälften från kapitlet", g.filter(t=>chapterTopics().includes(t)).length>=4, g.join()); }
  q("#chapter").value=""; q("#chapter").dispatchEvent(new Event("change")); ok("inget kapitel valt", !S.chapter);
  { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id+": "+writeChecks(p,p.model).filter(c=>!c.ok).map(c=>c.label).join("; "));
    ok("franska: modelltexterna klarar checklistan", !bad.length, bad.join(" | ")); }
  ok("övningsgrupper", document.querySelectorAll(".exgroup").length===5, document.querySelectorAll(".exgroup").length);

  { const ex=Object.values(XS)[0]; ok("Tatoeba-meningar finns", !!ex&&ex.tatoeba&&sentencePool().length>0, Object.keys(XS).length);
    if(ex){ ok("Tatoeba-mening återställs", RESTORE.dict(ex.id).w===ex); ok("Tatoeba har källhänvisning", tatoebaNote(ex).includes("CC BY 2.0 FR")); } }
  // Diktamen: fel svar ger jämförelse ord för ord, sedan flerval, sedan skriva igen
  startDict(); q("#ans").value="n'importe quoi"; q("#submit").click();
  ok("diktamen visar skillnader", !!q(".diff .miss")); q("#submit").click();
  runAll(); ok("diktamen klar och loggad", lastLog().kind==="dict", JSON.stringify(lastLog()));

  // Översätt: ej exakt svar ger självbedömning
  startTrans(); q("#ans").value="je ne sais pas"; q("#submit").click();
  ok("översätt visar självbedömning", !!q("[data-gr]")); q('[data-gr="near"]').click();
  ok("nästan räknas som fel och kommer tillbaka", sess.queue.some(x=>x.again&&x.t==="mc")); q("#submit").click();
  runAll(); ok("översätt loggad", lastLog().kind==="trans");

  startOrder(); ok("ordföljd har brickor", document.querySelectorAll("[data-t]").length>=4); runAll();
  ok("ordföljd loggad", lastLog().kind==="order");

  startPhrases(); runAll(); ok("fraser loggade", lastLog().kind==="phr");
  startShadow(); ok("skugga visar mening och knappar", !!q("[data-sh]")&&!!q("[data-pl]")); runAll(); ok("skugga loggad", lastLog().kind==="shadow");

  openStories(); q("[data-pick]").click(); ok("berättelse visar lucka", !!q(".sg.cur")); runAll();
  ok("berättelse slutskärm", q("#app").textContent.includes("Fler berättelser")); ok("tempusstatistik", !!(S.st&&S.st.tempus));

  openListening(); q("[data-pick]").click(); q("#toq").click(); runAll();
  ok("hörförståelse visar texten efteråt", document.querySelectorAll(".tl").length>3);
  { const tw=q(".tw"); tw.click(); ok("ord markeras när man trycker", tw.classList.contains("sel")&&!q("#gbox").hidden);
    tw.click(); ok("ett tryck till tar bort markeringen", !tw.classList.contains("sel")&&q("#gbox").hidden);
    // ett ord med glosa som inte redan finns
    for(const gl of document.querySelectorAll(".tw.gl")){ gl.click(); if(!q("#addsel").disabled) break; gl.click(); }
    // ett ord utan glosa: betydelsen skrivs själv
    const plain=[...document.querySelectorAll(".tw:not(.gl)")].find(x=>x.textContent.length>4&&!listWord(x.textContent)); plain.click();
    ok("valda ord listas under texten", document.querySelectorAll(".picked li").length===2);
    const inp=q(".psv-in:not([disabled])"); inp.value="testbetydelse"; inp.dispatchEvent(new Event("input"));
    ok("knappen räknar orden", q("#addsel").textContent.includes("2 ord"), q("#addsel").textContent);
    q("#addsel").click(); }
  ok("ord sparas i Mina ord", (S.mine||[]).length===2 && WORDS.filter(w=>w.sec==="mine").length===2 && S.mine.some(m=>m.sv==="testbetydelse"), (S.mine||[]).map(m=>m.t+"="+m.sv).join());
  ok("Mina ord kommer först bland nya ord", pickNew()[0] && pickNew()[0].sec==="mine");

  ok("eget ord sparas", addOwnWord("la randonnée","vandring","Nous avons fait une randonnée en montagne.")==="" && byId["mine:la randonnée"].gap.ans==="randonnée", JSON.stringify(byId["mine:la randonnée"]&&byId["mine:la randonnée"].gap));
  ok("samma ord två gånger stoppas", addOwnWord("la randonnée","vandring","")!=="");
  q("#list").open=true; renderList(); const rm=q('[data-rm="mine:la randonnée"]'); rm.click(); q('[data-rm="mine:la randonnée"]').click();
  ok("eget ord tas bort efter två tryck", !byId["mine:la randonnée"]&&!(S.mine||[]).some(m=>m.t==="la randonnée")); q("#list").open=false;
  openReading(); q("[data-pick]").click(); ok("lästext har ord att trycka på", document.querySelectorAll(".gl").length>10);
  q("#toq").click(); runAll(); ok("läsförståelse sparad", Object.keys(S.tx||{}).length===2);

  openCulture(); q("[data-pick]").click(); q(".opt").click(); q("#ctext").value="En Suède, je prends le bus."; q("#ctext").dispatchEvent(new Event("input")); q("#done").click();
  ok("kultur loggad", lastLog().kind==="culture");

  openWriting(); q("[data-pick]").click();
  q("#wtext").value="Hier, je suis allé à Paris avec ma correspondante. D'abord, nous avons pris le RER, puis nous étions fatigués mais contents."; q("#wtext").dispatchEvent(new Event("input"));
  ok("skrivchecklista", document.querySelectorAll("#checks li.ok").length>=2, [...document.querySelectorAll("#checks li")].map(l=>(l.className?"✓":"○")+l.textContent).join(" | "));
  q("#fbbtn").click();
  await new Promise(r=>setTimeout(r,50));
  ok("Claude kommenterar texten", q("#fbout").textContent.includes("Att rätta")&&q("#fbout").textContent.includes("je suis allée")&&S.fb&&Object.keys(S.fb).length===1, q("#fbout").textContent.slice(0,80));
  ok("kommentaren bedöms mot provet", __fbPrompt.includes("DELF B1")&&__fbPrompt.includes("<<<"));
  q("#done").click(); ok("skrivning loggad", lastLog().kind==="write");

  // Provträning
  renderStart(); q('[data-ex="exam"]').click(); ok("provträning: uppgifter", document.querySelectorAll("[data-xt]").length>=10, document.querySelectorAll("[data-xt]").length);
  { const t=EX().tasks.find(t=>t.qs); examTask(t.id); ok("provträning: klocka", /\d:\d\d/.test(q("#exclock").textContent));
    t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click();
    ok("provträning: läsuppgift rättas", S.exam.t[t.id].pct===100&&q("#exres").textContent.includes("100 %"), JSON.stringify(S.exam.t[t.id])); }
  { const t=EX().tasks.find(t=>t.minWords); examTask(t.id); q("#xtext").value="Bonjour, je m'appelle Oscar et je joue du piano depuis dix ans. J'aimerais beaucoup étudier au conservatoire de Lyon l'année prochaine."; q("#xtext").dispatchEvent(new Event("input"));
    q("#exdone").click(); await new Promise(r=>setTimeout(r,50));
    ok("provträning: skrivuppgift bedöms", S.exam.t[t.id].pct===70&&q("#exres").textContent.includes("70 %"), JSON.stringify(S.exam.t[t.id])); }
  { const t=EX().tasks.find(t=>!t.qs&&!t.minWords); examTask(t.id); ok("provträning: taluppgift", !!q("#talk")&&!!q("#xtext")); }
  openExam(); q("#sim").click(); let guard=0;
  while(EXSIM&&guard++<6){ const t=exTask(EXSIM.ids[EXSIM.i]);
    if(t.qs){ t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click(); q("#exnext").click(); }
    else { q("#xtext").value="Bonjour, je vous écris parce que je voudrais participer au festival de musique cet été avec mon groupe."; q("#exdone").click(); await new Promise(r=>setTimeout(r,50)); q("#exnext").click(); } }
  ok("provsimulering sparas", S.exam.sims.length===1&&Object.values(S.exam.sims[0].parts).every(v=>v>=50), JSON.stringify(S.exam.sims));
  ok("provsimulering: resultat", q("#app").textContent.includes("Resultat av simuleringen"));
  openExam(); ok("provträning: tidigare simuleringar", q("#app").textContent.includes("Tidigare simuleringar"));

  // Blandad runda, avbruten och fortsatt
  renderStart(); startMix(); const kinds=[...new Set([sess.cur,...sess.queue].map(x=>x.k))];
  ok("blandad runda har flera typer", kinds.length>=4, kinds.join());
  answerRight(); answerRight(); const done=sess.done;
  sess=null; loadState(); rebuildWords(); renderStart(); q("#run-go").click();
  ok("blandad runda fortsätter", sess&&sess.done===done, sess&&sess.done+" vs "+done); runAll();

  // Dagens pass: glosor först, sedan knapp till blandad runda
  renderStart(); q("#daily").click(); while(sess&&!sess.queue) q("#next").click(); runAll();
  ok("dagens pass erbjuder blandad runda", !!q("#mix")); q("#mix").click(); runAll();

  setView("stats"); ok("statistik visar övningar", q("#app").textContent.includes("Diktamen"));
  ok("prognos över repetitioner", !!q(".fc"));
  { const keep=S.log.slice(); for(let i=0;i<1100;i++) S.log.push({d:Date.now()-i*1000,dur:10,right:1,total:1,kind:"dict"}); save();
    ok("gammal logg sammanfattas", S.log.length===1000&&S.logOld&&S.logOld.dur>0, S.log.length+" "+JSON.stringify(S.logOld)); S.log=keep; delete S.logOld; save(); }
  renderStart(); q('[data-gy="1"]').click(); ok("Gy25-namn", q("#coursechip").textContent.includes("fortsättning, nivå 1")); q('[data-gy="0"]').click();
  renderStart(); q('[data-only="1"]').click(); ok("bara en kurs döljer kursväljaren", q(".coursepick").hidden&&onlyCourse()==="fr"); q('[data-only="0"]').click();
  ok("visa alla kurser igen", !q(".coursepick").hidden&&!onlyCourse());
  setView("fb"); ok("tyck till: flik", q("#tab-fb").getAttribute("aria-selected")==="true"&&!!q("#fbtext"));
  q("#fbsend").click(); ok("tyck till: tomt meddelande skickas inte", !Object.keys(__remote).some(k=>k.startsWith("feedback/")));
  q('[data-fbk="hard"]').click(); q("#fbtext").value="Jag vill kunna öva på musikord"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click();
  await new Promise(r=>setTimeout(r,50));
  { const k=Object.keys(__remote).find(k=>k.startsWith("feedback/u_test-")), f=k&&__remote[k];
    ok("tyck till: sparas i db", f&&f.kind==="hard"&&f.text.includes("musikord")&&f.uid==="u_test"&&f.status==="ny"&&f.course==="Franska 3", JSON.stringify(f));
    f.status="backlogg"; f.reply="Musikord kommer i nästa version."; }
  setView("fb"); await new Promise(r=>setTimeout(r,50));
  ok("tyck till: status och svar visas", q("#fblist").textContent.includes("Tillagt i backloggen")&&q("#fblist").textContent.includes("Musikord kommer"), q("#fblist").textContent.slice(0,120));
  renderStart(); q('[data-goal="90"]').click(); ok("veckomål visas i dagens pass", q(".daily").textContent.includes("av 90 min"));
  { const w0=weekStart(Date.now()), w1=weekStart(w0-3*864e5), w2=weekStart(w1-3*864e5);
    BOARD.docs["u_other"]={nick:"Kompis",langs:{fr:{week:w1,min:42,q:100,days:3,streak:0,last:0,hist:{[w1]:42,[w2]:17}}},t:1}; }
  setView("board"); setTimeout(()=>{ ok("topplista", !!q(".brow")); ok("förra veckans vinnare", (q(".winner")||{}).textContent==="Förra veckan vann Kompis med 42 minuter.", (q(".winner")||{}).textContent);
    ok("tidigare veckor", q("#app").textContent.includes("Tidigare veckor")&&q("#app").textContent.includes("17 min"));
    ok("veckomål i topplistan", q(".brow.me").textContent.includes("veckomålet")===(myStats().min>=90)); finish(); },600);
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); finish(); }
},1500);
function finish(){ ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
  document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>"); }
</script>"""

def run(scenario):
    page = (ROOT / "dist" / "preview.html").read_text(encoding="utf-8")
    html = page.replace("<title>", SEED + "<title>", 1).replace("</body></html>", scenario + "</body></html>")
    with tempfile.TemporaryDirectory() as tmp:
        f = pathlib.Path(tmp) / "test.html"; f.write_text(html, encoding="utf-8")
        dump = pathlib.Path(tmp) / "dump.html"
        # Utdata till fil: Chromes hjälpprocesser håller annars en pipe öppen och Python väntar för evigt
        with open(dump, "w") as fh:
            p = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={tmp}/c", "--dump-dom",
                                  "--virtual-time-budget=5000", f.as_uri()], stdout=fh, stderr=subprocess.DEVNULL)
            # Chrome skriver ut sidan men avslutar inte alltid själv, så vi väntar på resultatet och stänger sedan
            import time
            for _ in range(180):
                time.sleep(0.5)
                if "</html>" in dump.read_text(encoding="utf-8", errors="replace") or p.poll() is not None:
                    break
            p.kill()
        out = dump.read_text(encoding="utf-8", errors="replace")
    m = re.search(r'<pre id="out">(.*?)</pre>', out, re.S)
    return m.group(1).replace("&lt;", "<").replace("&amp;", "&") if m else "FEL  hittade inget testresultat i sidan"


def main():
    text = run(SCENARIO) + "\n" + run(SCENARIO_DE)
    print(text)
    sys.exit(1 if "FEL  " in text else 0)


if __name__ == "__main__":
    main()
