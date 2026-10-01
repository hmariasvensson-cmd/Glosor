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
// Kurserna som looparna "alla kurser" går igenom. test_minimal_course sätter COURSES_UNDER_TEST till låtsaskursen.
window.testCourses=()=>window.COURSES_UNDER_TEST||Object.keys(LANGUAGES);
// Väntar tills cond() gäller (högst ms) i stället för en fast väntetid. appReady: kursen är vald och molnet anslutet och klart.
window.until=(cond,ms=5000)=>new Promise(r=>{const t0=Date.now();(function p(){let v=false;try{v=cond()}catch(e){} if(v||Date.now()-t0>ms) r(!!v); else setTimeout(p,20);})();});
window.appReady=()=>until(()=>typeof CLOUD!=="undefined"&&CLOUD.ready&&!CLOUD.busy&&!Object.keys(CLOUD.pending).length&&typeof L!=="undefined"&&!!L&&!!L.base);
window.__remote={"data/users/u_test/franska-glosor-v2":{state:student(),t:now-1000}};
const snap=p=>({exists:!!__remote[p],data:()=>__remote[p],metadata:{hasPendingWrites:false,fromCache:false}});
const mockDb={
  doc:p=>({get:async()=>snap(p),delete:async()=>{delete __remote[p]},set:async b=>{const j=JSON.stringify(b); if(new TextEncoder().encode(j).length>262144) throw {code:"invalid_argument",message:"document over 256 KiB"}; __remote[p]=JSON.parse(j)},onSnapshot:n=>{setTimeout(()=>n(snap(p)),0);return()=>{}}}),
  collection:c=>{const docs=()=>Object.keys(__remote).filter(k=>k.startsWith(c+"/")&&!k.slice(c.length+1).includes("/")).map(k=>({id:k.slice(c.length+1),exists:true,data:()=>__remote[k]}));
    return {get:async()=>({docs:docs()}),onSnapshot:n=>{setTimeout(()=>n({docs:docs()}),0);return()=>{}},
      where:(f,op,v)=>({get:async()=>({docs:docs().filter(d=>d.data()[f]===v)})})};}};
window.__fbPrompt="";
const mockSample=Object.assign(async()=>({text:"x"}),{json:async p=>{if(p.includes("samla in önskemål")) return p.includes("otydligt")?{tydligt:false,fragor:["Menar du ljudet?","Gäller det alla övningar?"]}:{tydligt:true,fragor:[]};
  if(p.includes("bedömare")) return {kriterier:[{namn:"A",poang:4,kommentar:"ok"},{namn:"B",poang:3,kommentar:"ok"}],helhet:"Godkänt.",fel:[]};
  window.__fbPrompt=p; return {helhet:"Bra jobbat.",bra:["Tydlig start"],fel:[{citat:"je suis allé",rattat:"je suis allée",varfor:"Kongruens"}],nasta:"Fler bindeord",niva:"A2+",prov:"Nästan B1"};}});
window.claude={use:async n=>n==="sample"?mockSample:n==="db"?mockDb:n==="user"?{id:async()=>"u_test",profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{name:""}]))}:null};
try{speechSynthesis.speak=()=>{}}catch(e){}
</script>"""

SCENARIO_DE = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const exClick=id=>{renderStart(); const g=exGroups().find(g=>g.items.some(h=>h.includes('data-ex="'+id+'"'))); openExGroup(g.id); q('[data-ex="'+id+'"]').click();};

appReady().then(()=>{ try{
  useLang("de"); ok("tyska: kurs byts", q("#coursechip").textContent.includes("Tyska 5"));
  ok("tyska: rubrik för videor", !q("#app").textContent.includes("på franska"));
  ok("tyska: ingen bokpanel", !q("#chapter"));
  { const w=byId["die Beziehung (-en)"], d=KINDS.cloze.type({w});
    ok("tyska: luckan godtar artikeln en gång till", d.check("die Beziehung").r==="right"&&d.check("Beziehung").r==="right"&&d.check("Verhältnis").r==="wrong"); }
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
  renderStart(); ok("tyska: grupp för grammatik", !!q('[data-grp="gram"]')); exClick("gram");
  ok("grammatik: ämnen att välja", document.querySelectorAll("[data-pick]").length>=5, document.querySelectorAll("[data-pick]").length);
  q('[data-pick="praep"]').click(); ok("grammatik: regelsida före övningarna", !!q("#rgo")&&q(".rpart")&&q("#app").textContent.includes("Kasus")===true||!!q("#rgo"), q("#app").textContent.slice(0,80));
  if(q("#rgo")){ q("#rgo").click(); answerMC(0); ok("grammatik: regeln går att läsa efter svaret", !!q("details.rule")); quitSession(); }
  exClick("gram");
  ok("adjektiv: substantiv ur ordlistan", adjNouns().length>200 && !adjNouns().some(n=>/Kollege|Angestellte|Studierende/.test(n.noun)), adjNouns().length);
  { const x=adjItem("adj|"+adjNouns().find(n=>n.g==="m").id+"|akk|indef|0|0"); ok("adjektiv: einen neuen", x.ans==="neuen"&&/einen/.test(x.p.parts[0]), x.p.parts.join("_")); }
  startGram("adj"); const first=sess.cur; sess.cur.t="type"; sess.d=KINDS.gram.type(sess.cur); renderType(sess.d);
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
  exClick("gen"); ok("der/die/das: tre val", sess.d.opts?sess.d.opts.length>=3:true);
  { let g=0; while(sess&&g++<80){ const c=sess.cur, d=sess.d; if(c.t==="mc"){answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click();} else {q("#ans").value="die "+gnById(c.ref).pl; q("#submit").click(); q("#submit").click();} } }
  ok("der/die/das: loggad", S.log.some(l=>l.kind==="gen")&&Object.keys(S.ga||{}).length>=5);
  window.__plurals=genderNouns().filter(n=>n.pl).map(n=>n.w.t+" => "+n.pl).join("\n");
  setView("stats"); ok("statistik: grammatik", q("#app").textContent.includes("Adjektivändelser"));
  ok("rapport om fel facit sparas", Object.keys(__remote).some(k=>k.startsWith("reports/u_test/items/")), Object.keys(__remote).join());
  exClick("exam"); ok("tyska: provträning Goethe B2", document.querySelectorAll("[data-xt]").length>=15&&q("#app").textContent.includes("Goethe"));
  { const t=EX().tasks.find(t=>t.part==="hoeren"); examTask(t.id); ok("tyska: hörprov döljer texten", !!q("#explay")&&q("#lines").hidden); }
  // Tyska 4: egen kurs med egen sparnyckel
  renderStart(); q('[data-only="1"]').click();
  { const got=[...q("#course").options].map(o=>o.value), want=Object.keys(LANGUAGES).filter(c=>LANGUAGES[c].name==="Tyska"), sub=got.filter(c=>["de4","de","de6"].includes(c)).join();
    ok("bara tyska: alla tyska kurser i väljaren, efter steg", !q(".coursepick").hidden&&got.length===want.length&&want.every(c=>got.includes(c))&&sub==="de4,de,de6", got.join()); }
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
  exClick("gram"); ok("tyska 4: grammatikämnen", document.querySelectorAll("[data-pick]").length>=9, document.querySelectorAll("[data-pick]").length);
  for(const t of ["reflexiv","komp","nebensatz","bisatz"]){ startGram(t); runDe(); }
  ok("tyska 4: grammatik loggad", ["reflexiv","komp","nebensatz"].every(t=>S.gt[t]&&S.gt[t].n>0), JSON.stringify(S.gt));
  // Italienska 1 och 2
  for(const c of ["it1","it2"]){ useLang(c);
    ok(c+": kurs och ord", q("#coursechip").textContent.includes(L.course)&&WORDS.length>400&&lang()==='lang="it"', WORDS.length);
    ok(c+": grammatik och verb", Object.keys(gramBank()).length>150&&verbGames().length>=3&&CONJ.length>100, Object.keys(gramBank()).length+" / "+CONJ.length);
    ok(c+": artikeln behövs inte i svaret", (()=>{const w=WORDS.find(w=>/^(il|la|lo) /.test(w.t)); return !w||check(w.t.replace(/^\S+ /,""),variants(w.t))==="right";})());
    startGram("mix"); runDe(); ok(c+": blandad grammatik", S.gt.mix&&S.gt.mix.n>0);
    { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id);
      ok(c+": texter och modelltexter", (C().listening||[]).length>=5&&(C().reading||[]).length>=4&&!bad.length, bad.join()); }
    startMix(); runDe(); ok(c+": blandad runda", !sess); }
  // Franska 6 (koden fr4), Tyska 6 (steg 6) och Franska I (universitet)
  ok("tyska 5 föreslår tyska 6", LANGUAGES.de.nextCourse==="de6");
  for(const [c,key] of [["fr4","glosor-fr4-v1"],["de6","glosor-de6-v1"],["fru","glosor-fru-v1"]]){ useLang(c);
    ok(c+": egen sparnyckel och ord", L.storageKey===key&&q("#coursechip").textContent.includes(L.course)&&WORDS.length>900, WORDS.length);
    ok(c+": grammatik", Object.keys(gramBank()).length>200&&verbGames().length>=2, Object.keys(gramBank()).length+" / "+verbGames().length);
    ok(c+": artikeln behövs inte i svaret", (()=>{const w=WORDS.find(w=>/^(le|la|der|die|das) /.test(w.t)&&!w.t.includes(",")); return !w||check(w.t.replace(/^\S+ /,""),variants(w.t))==="right"||L.code==="de6";})());
    { const bad=(C().prompts||[]).map(p=>[p.id,writeChecks(p,p.model).filter(c=>!c.ok).map(c=>c.label).join(" / ")]).filter(x=>x[1]).map(x=>x.join(": "));
      ok(c+": texter och modelltexter", (C().listening||[]).length>=12&&(C().reading||[]).length>=10&&(C().prompts||[]).length>=20&&!bad.length, bad.join(" | ")); }
    startMix(); runDe(); ok(c+": blandad runda", !sess); }
  useLang("de4");
  { const n=S.log.length; startMix(); ok("tyska 4: blandad runda har grammatik", [sess.cur,...sess.queue].some(x=>x.k==="gram")); runDe();
    ok("tyska 4: blandad runda klar", !sess&&S.log.length>n); }
 }catch(e){ ok("undantag", false, e.message); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

SCENARIO = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const exClick=id=>{renderStart(); const g=exGroups().find(g=>g.items.some(h=>h.includes('data-ex="'+id+'"'))); openExGroup(g.id); q('[data-ex="'+id+'"]').click();};

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
appReady().then(async()=>{ try{
  ok("molnets framsteg hämtas", S.pass===5);
  ok("pensionerat ord får ett repetitionsdatum", S.w["ancien mot"].due<1e9 && S.w["ancien mot"].s===4, JSON.stringify(S.w["ancien mot"]));
  { const x={s:3,due:0}; schedule(x,true,10,now); const k=x.s===4&&x.due===10+INT[4]&&x.mp===10;
    schedule(x,true,50,now); const k2=x.s===5&&x.due===50+INT[5];
    schedule(x,false,60,now); ok("schema: upp ett steg vid rätt, kan-ord tillbaka till steg 2 vid fel", k&&k2&&x.s===2&&!x.mp&&x.lapses===1, JSON.stringify(x));
    const y={s:1,due:0}; schedule(y,false,5,now); ok("schema: fel på steg 1 ger steg 0", y.s===0&&y.due===6); }
  { const x={s:0,due:0}; schedule(x,true,7,now); const a=x.s===1&&x.due===10&&!x.dd;
    schedule(x,true,10,now); const b=x.s===2&&x.dd===addDays(now,3)&&!isDue(x);
    schedule(x,true,11,now); const c=x.s===3&&x.dd===addDays(now,7); schedule(x,true,12,now); const d=x.s===4&&x.dd===addDays(now,20);
    x.dd=Date.now()-1; ok("schema: nästa pass, 3 pass, sedan 3, 7 och 20 dagar", a&&b&&c&&d&&isDue(x), JSON.stringify(x)); }
  { const ch=ktChapters(), c0=ch[0]; ok("kapitelprov: kapitlen samlar alla avsnitt", ch.length>=3&&!ch.some(c=>/x$/.test(c.id))&&c0.words.length>=4, ch.map(c=>c.id).join(","));
    const before=JSON.stringify(S.w[c0.words[0].id]||null);
    exClick("ktest"); q('[data-ktm="mc"]').click(); q('[data-kt="'+c0.id+'"]').click();
    ok("kapitelprov: alla ord en gång", sess&&sess.total===c0.words.length&&sess.queue.every(x=>x.noRetry), sess&&sess.total);
    document.dispatchEvent(new KeyboardEvent("keydown",{key:"1",bubbles:true})); const ans=sess.answered, i0=sess.done;
    document.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));
    ok("tangentbord: siffra svarar, Enter går vidare", ans&&!sess.answered&&i0===1);
    { let g=0; while(sess&&g++<400) answerRight(); } const r=S.kt[c0.id];
    ok("kapitelprov: resultatet sparas och schemat rörs inte", r&&r.n===c0.words.length&&JSON.stringify(S.w[c0.words[0].id]||null)===before, JSON.stringify(r));
    ok("kapitelprov: öva på missade", r.miss.length?!!q("#ktdrill"):q("#app").textContent.includes("Inga fel"));
    startKtest(c0.id,[c0.words[1].id]); ok("kapitelprov: övning på bara de missade, med omtag", sess.total===1&&!sess.cur.noRetry); quitSession(); }
  { L.content.mal=[{id:"mal-t",sec:curSec(),goals:["Jag kan A","Jag kan B"]}]; renderStart();
    ok("mål: visas på startsidan", !!q(".goals")&&q(".goals").textContent.includes("0 av 2"));
    q('[data-mal="mal-t|1"]').click(); ok("mål: bocka av sparas", S.mal["mal-t|1"]&&q(".goals").textContent.includes("1 av 2"));
    delete L.content.mal; delete S.mal;
    L.content.uttal=[{id:"utt-t",title:"é eller è?",tip:"**é** är slutet",pairs:[["été","était"],["les","lait"]]}];
    exClick("utt"); q('[data-pick="utt-t"]').click();
    ok("uttal: två frågor med orden som alternativ", sess&&sess.total===2&&sess.d.opts.length===2);
    { let g=0; while(sess&&g++<20) answerRight(); } ok("uttal: resultat sparas", S.ut["utt-t"]===100, JSON.stringify(S.ut));
    delete L.content.uttal; renderStart(); }
  { L.content.teori=[{id:"te-1",q:"Quel est l'intervalle entre do et mi bémol ?",sv:"Vilket intervall?",opts:["tierce mineure","tierce majeure"],a:0,why:"**3** halvtoner"}];
    exClick("teori"); ok("teoriprovet: frågan visas", sess&&sess.total===1&&q("#app").textContent.includes("mi bémol"));
    answerRight(); ok("teoriprovet: resultat sparas", S.te["te-1"]&&S.te["te-1"].s===1, JSON.stringify(S.te));
    delete L.content.teori; delete S.te; renderStart(); }
  { renderStart(); const m=q("#chmap"); ok("kapitelkarta: finns med staplar", !!m&&m.querySelectorAll(".chrow").length>=3&&!!m.querySelector(".track"));
    ok("rullistan visar hur långt man kommit", /%|klart/.test(q("#src").options[1].textContent), q("#src").options[1].textContent);
    const b=m.querySelectorAll("[data-chmap]")[2], id=b.dataset.chmap; b.click();
    ok("kapitelkarta: tryck väljer kapitlet", (S.chapter&&chapterKey(S.chapter)===id)||(S.src!=="auto"&&chapterKey(S.src)===id), S.chapter+" "+S.src);
    delete S.chapter; S.src="auto";
    { const n0=S.newCount; S.newCount=5000; renderStart();
      ok("musikteori: kommer inte som nästa ord", pickNew().length>0&&!pickNew().some(w=>/^mt\d$/.test(w.sec)));
      ok("musikteori: eget val i rullistan", [...q("#src").querySelectorAll("optgroup")].some(g=>g.label.includes("Musikteori")&&g.querySelector('option[value="mt1"]')));
      S.src="mt1"; ok("musikteori: kommer när man väljer den", pickNew().length>0&&pickNew().every(w=>w.sec==="mt1"));
      S.src="auto"; S.newCount=n0; renderStart(); }
    setView("stats"); { const wide=[...document.querySelectorAll("#app *")].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).slice(0,3).map(e=>e.tagName+"."+e.className);
    ok("statistik: inget sticker ut åt sidan", !wide.length, wide.join(", ")+" bredd "+document.documentElement.clientWidth); }
  ok("statistik: dag för dag", q("#app").textContent.includes("Dag för dag")&&!!q('[aria-label="Minuter per dag de senaste 28 dagarna"]')); setView("ova"); }
  ok("högst MAXDUE repetitioner per pass", dueWords().length<=MAXDUE);
  { const w=byId["rire"]; S.w["rire"].lapses=3; document.body.insertAdjacentHTML("beforeend","<div id=mt>"+studyCard(w)+"</div>");
    const f=q("#mt [data-memo]"); ok("svårt ord: fält för minnesregel", !!f); f.querySelector("input").value="Rire låter som ridikyl";
    f.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})); ok("minnesregeln sparas", S.w["rire"].memo==="Rire låter som ridikyl");
    ok("minnesregeln visas", studyCard(w).includes("Rire låter som ridikyl")&&explain(w).includes("ridikyl")); q("#mt").remove(); delete S.w["rire"].lapses; delete S.w["rire"].memo; }
  { const f=(v,t,i)=>CONJ.find(c=>c.verb===v&&c.tense===t&&c.person===L.verbs.persons[i]).full;
    ok("verb: subjonctif med que", f("avoir","subjonctif",0)==="que j'aie"&&f("avoir","subjonctif",2)==="qu'il/elle ait"&&f("parler","futur simple",3)==="nous parlerons", f("avoir","subjonctif",0)+" | "+f("avoir","subjonctif",2));
    ok("verb: que je tas bort vid rättning", check("que je fasse",["fasse"],true)==="right"); }
  ok("kurs och nivå visas", q("#coursechip").textContent.includes("Franska 3"), q("#coursechip").textContent);
  { const soon=UPCOMING.filter(u=>!LANGUAGES[u.code]); ok("kommande kurser går inte att välja", soon.every(u=>[...q("#course").options].some(o=>o.disabled&&o.text.startsWith(u.course+" · ")&&o.text.endsWith("kommer"))), soon.length+" kommande"); }
  ok("dagens pass finns", !!q("#daily"));
  ok("bokpanel med kapitel", !!q("#chapter")&&q(".book").textContent.includes("Escalade"));
  q("#chapter").value="k2"; q("#chapter").dispatchEvent(new Event("change"));
  ok("kapitlet ni läser kommer först", S.chapter==="k2"&&pickNew().filter(w=>w.sec!=="mine")[0].sec==="k2"&&curSec()==="k2", pickNew().slice(0,3).map(w=>w.sec).join());
  ok("nya ord grupperade efter bok och allmänt", !!q('#src optgroup[label^="Boken"]'));
  q("#chapter").value="k4"; q("#chapter").dispatchEvent(new Event("change"));
  ok("kapitlets grammatik kommer först", chapterTopics().includes("pron")&&!chapterTopics().includes("subj"), chapterTopics().join());
  { const g=gramItems("mix",10).map(x=>gramById(x.ref).topic); ok("blandad grammatik tar hälften från kapitlet", g.filter(t=>chapterTopics().includes(t)).length>=4, g.join()); }
  { const x=Object.values(gramBank()).find(x=>x.rule==="bok-oversatt");   // bara när den privata bokmappen finns
    if(x){ sess=null; beginQuiz("gram",[{k:"gram",id:"gram:"+x.id,ref:x.id,t:"type",canType:true}],{label:"t"});
      ok("bokens översättning: svensk mening och instruktion", q("#app").textContent.includes(x.q)&&q("#app").textContent.includes(x.ask));
      ok("bokens övningar kommer först i kapitel 4", chapterTopics().includes("bok")); sess=null; renderStart(); } }
  q("#chapter").value=""; q("#chapter").dispatchEvent(new Event("change")); ok("inget kapitel valt", !S.chapter);
  // Förhandsvisning (preview i grammar.json): etikett med nästa kurs namn, sist i listan, och en rad på regelsidan
  { openGrammar(); const ids=[...document.querySelectorAll("[data-pick]")].map(b=>b.dataset.pick), pvT=GR().topics.filter(t=>t.preview&&ids.includes(t.id));
    const pv=pvT.map(t=>t.id), lastPlain=Math.max(...ids.filter(i=>!pv.includes(i)).map(i=>ids.indexOf(i)));
    ok("förhandsvisning: subj och si är märkta", ["subj","si"].every(i=>pv.includes(i)), pv.join());
    ok("förhandsvisning: etikett med kursens namn", pvT.every(t=>(q(`[data-pick="${t.id}"] .pvtag`)||{}).textContent==="Förhandsvisning – övas mer i "+LANGUAGES[t.preview].course)
      &&q('[data-pick="subj"] .pvtag').textContent.endsWith("Franska 4")&&!q('[data-pick="pron"] .pvtag'), (q('[data-pick="subj"] .pvtag')||{}).textContent);
    ok("förhandsvisning: sorteras sist", pv.every(i=>ids.indexOf(i)>lastPlain)&&ids[0]==="mix", ids.join());
    ok("förhandsvisning: undertexten visas ändå", q('[data-pick="subj"] small').textContent===GR().topics.find(t=>t.id==="subj").sub);
    gramRules("subj"); ok("förhandsvisning: regelsidan säger var det övas mer", q("#app").textContent.includes("Förhandsvisning – övas mer i Franska 4"));
    gramRules("pron"); ok("förhandsvisning: inte på vanliga regelsidor", !q("#app").textContent.includes("Förhandsvisning")); renderStart(); }
  { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id+": "+writeChecks(p,p.model).filter(c=>!c.ok).map(c=>c.label).join("; "));
    ok("franska: modelltexterna klarar checklistan", !bad.length, bad.join(" | ")); }
  ok("övningsgrupper", document.querySelectorAll("[data-grp]").length===5, document.querySelectorAll("[data-grp]").length);
  q('[data-grp="texts"]').click(); ok("grupp öppnas på egen sida", !!q('[data-ex="rq"]')&&!q("[data-grp]")); q("#quit").click(); ok("tillbaka från gruppen", !!q("[data-grp]"));

  { const ex=Object.values(XS)[0]; ok("Tatoeba-meningar finns", !!ex&&ex.tatoeba&&sentencePool().length>0, Object.keys(XS).length);
    if(ex){ ok("Tatoeba-mening återställs", KINDS.dict.restore(ex.id).w===ex); ok("Tatoeba har källhänvisning", tatoebaNote(ex).includes("CC BY 2.0 FR")); } }
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
  await until(()=>q("#fbout").textContent.includes("Att rätta"));
  ok("Claude kommenterar texten", q("#fbout").textContent.includes("Att rätta")&&q("#fbout").textContent.includes("je suis allée")&&S.fb&&Object.keys(S.fb).length===1, q("#fbout").textContent.slice(0,80));
  ok("kommentaren bedöms mot provet", __fbPrompt.includes("DELF B1")&&__fbPrompt.includes("<<<"));
  q("#done").click(); ok("skrivning loggad", lastLog().kind==="write");

  // Provträning
  exClick("exam"); ok("provträning: uppgifter", document.querySelectorAll("[data-xt]").length>=10, document.querySelectorAll("[data-xt]").length);
  { const t=EX().tasks.find(t=>t.qs); examTask(t.id); ok("provträning: klocka", /\d:\d\d/.test(q("#exclock").textContent));
    t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click();
    ok("provträning: läsuppgift rättas", S.exam.t[t.id].pct===100&&q("#exres").textContent.includes("100 %"), JSON.stringify(S.exam.t[t.id])); }
  { const t=EX().tasks.find(t=>t.minWords); examTask(t.id); q("#xtext").value="Bonjour, je m'appelle Hugo et je joue du piano depuis dix ans. J'aimerais beaucoup étudier au conservatoire de Lyon l'année prochaine."; q("#xtext").dispatchEvent(new Event("input"));
    q("#exdone").click(); await until(()=>(S.exam.t[t.id]||{}).pct!=null);
    ok("provträning: skrivuppgift bedöms", S.exam.t[t.id].pct===70&&q("#exres").textContent.includes("70 %"), JSON.stringify(S.exam.t[t.id])); }
  { const t=EX().tasks.find(t=>!t.qs&&!t.minWords); examTask(t.id); ok("provträning: taluppgift", !!q("#talk")&&!!q("#xtext")); }
  openExam(); q("#sim").click(); let guard=0;
  while(EXSIM&&guard++<20){ const t=exTask(EXSIM.ids[EXSIM.i]);
    if(t.qs){ t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click(); q("#exnext").click(); }
    else { q("#xtext").value="Bonjour, je vous écris parce que je voudrais participer au festival de musique cet été avec mon groupe."; const n=S.log.length; q("#exdone").click(); await until(()=>S.log.length>n); q("#exnext").click(); } }
  ok("provsimulering sparas", S.exam.sims.length===1&&Object.values(S.exam.sims[0].parts).every(v=>v>=50), JSON.stringify(S.exam.sims));
  ok("provsimulering: resultat", q("#app").textContent.includes("Resultat av simuleringen"));
  openExam(); ok("provträning: tidigare simuleringar", q("#app").textContent.includes("Tidigare simuleringar"));

  // Blandad runda, avbruten och fortsatt
  renderStart(); startMix(); const kinds=[...new Set([sess.cur,...sess.queue].map(x=>x.k))];
  ok("blandad runda har flera typer", kinds.length>=4, kinds.join());
  answerRight(); answerRight(); const done=sess.done;
  sess=null; loadState(); rebuildWords(); renderStart(); q("#run-go").click();
  ok("blandad runda fortsätter", sess&&sess.done===done, sess&&sess.done+" vs "+done); runAll();

  // Dagens pass: ett kort pass i ett flöde, och knappen finns kvar efter passet (flera pass per dag, se SCENARIO_PASS)
  renderStart(); q("#daily").click(); ok("dagens pass är ett flöde med glosor och andra frågor", sess&&sess.kind==="words"&&!!sess.dp&&sess.mixIn.length>0); quitSession();
  renderStart(); ok("dagens pass finns kvar", !!q("#daily"));
  startDict(); answerRight(); q("#quit").click(); ok("avbruten övning sparas", S.runs&&S.runs["dict"]&&S.runs["dict"].done===1, JSON.stringify(Object.keys(S.runs||{})));
  startDict(); ok("fortsätt eller börja om", !!q("#rcont")&&!!q("#rnew")); q("#rcont").click(); ok("fortsätter där man slutade", sess&&sess.done===1); runAll();
  ok("klar övning glöms", !S.runs["dict"]);
  setSound(false); ok("ljud av", q("#sound").getAttribute("aria-pressed")==="true"&&!SOUND); setSound(true);
  setView("stats"); ok("statistik visar övningar", q("#app").textContent.includes("Diktamen"));
  ok("prognos över repetitioner", !!q(".fc"));
  { const keep=S.log.slice(); for(let i=0;i<1100;i++) S.log.push({d:Date.now()-i*1000,dur:10,right:1,total:1,kind:"dict"}); save();
    ok("gammal logg sammanfattas", S.log.length===1000&&S.logOld&&S.logOld.dur>0, S.log.length+" "+JSON.stringify(S.logOld)); S.log=keep; delete S.logOld; save(); }
  renderStart(); q('[data-gy="1"]').click(); ok("Gy25-namn", q("#coursechip").textContent.includes("fortsättning, nivå 1")); q('[data-gy="0"]').click();
  renderStart(); q('[data-only="1"]').click(); { const got=[...q("#course").options].map(o=>o.value); ok("bara franska: bara de franska kurserna i väljaren", onlyCourse()==="fr"&&!q(".coursepick").hidden&&got.every(c=>LANGUAGES[c]&&LANGUAGES[c].name==="Franska")&&got.filter(c=>["fr","fr4","fru"].includes(c)).join()==="fr,fr4,fru", got.join()); } q('[data-only="0"]').click();
  ok("visa alla kurser igen", !q(".coursepick").hidden&&!onlyCourse());
  setView("fb"); ok("tyck till: flik", q("#tab-fb").getAttribute("aria-selected")==="true"&&!!q("#fbtext"));
  q("#fbsend").click(); ok("tyck till: tomt meddelande skickas inte", !Object.keys(__remote).some(k=>k.startsWith("feedback/")));
  q('[data-fbk="hard"]').click(); q("#fbtext").value="Jag vill kunna öva på musikord"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click();
  await until(()=>Object.keys(__remote).some(k=>k.startsWith("feedback/u_test/msgs/")));
  { const k=Object.keys(__remote).find(k=>k.startsWith("feedback/u_test/msgs/")), f=k&&__remote[k];
    ok("tyck till: sparas i db", f&&f.kind==="hard"&&f.text.includes("musikord")&&f.uid==="u_test"&&f.status==="ny"&&f.course==="Franska 3", JSON.stringify(f));
    f.status="backlogg"; f.reply="Musikord kommer i nästa version."; }
  q("#fbtext").value="Det är otydligt"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click(); await until(()=>document.querySelectorAll("[data-qa]").length>0);
  ok("tyck till: ja/nej-frågor när det är otydligt", document.querySelectorAll("[data-qa]").length===4);
  q('[data-qa="0"][data-v="Ja"]').click(); q("#fbqsend").click(); await until(()=>Object.values(__remote).some(f=>f&&f.text==="Det är otydligt"&&f.qa));
  { const f=Object.values(__remote).find(f=>f.text==="Det är otydligt"); ok("tyck till: svaren sparas", f&&f.qa.length===2&&f.qa[0].a==="Ja", JSON.stringify(f&&f.qa)); }
  setView("fb"); await until(()=>q("#fblist")&&q("#fblist").textContent.includes("Musikord kommer"));
  ok("tyck till: status och svar visas", q("#fblist").textContent.includes("Tillagt i backloggen")&&q("#fblist").textContent.includes("Musikord kommer"), q("#fblist").textContent.slice(0,120));
  delete S.dailyDay; renderStart(); q('[data-goal="90"]').click(); ok("veckomål visas i dagens pass", q(".daily").textContent.includes("av 90 min"));
  { const w0=weekStart(Date.now()), w1=weekStart(w0-3*864e5), w2=weekStart(w1-3*864e5);
    BOARD.docs["u_other"]={nick:"Kompis",langs:{fr:{week:w1,min:42,q:100,days:3,streak:0,last:0,hist:{[w1]:42,[w2]:17}}},t:1}; }
  setView("board"); await until(()=>!!q(".brow.me")&&!!q(".winner")); { ok("topplista", !!q(".brow")); ok("förra veckans vinnare", (q(".winner")||{}).textContent==="Förra veckan vann Kompis med 42 minuter.", (q(".winner")||{}).textContent);
    ok("tidigare veckor", q("#app").textContent.includes("Tidigare veckor")&&q("#app").textContent.includes("17 min"));
    ok("veckomål i topplistan", q(".brow.me").textContent.includes("veckomålet")===(myStats().min>=90)); finish(); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); finish(); }
});
function finish(){ ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
  document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>"); }
</script>"""

# ---------------------------------------------------------------------------------------------------------
# Rättelser i övningskoden (nu src/kinds/*.js, förut exercises.js, grammar.js, exam.js; build.py): apostrof, Hitta felet, återuppta
# efter ändrat innehåll, Dagens pass, bindeord och tempus, glosor, provet. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_FIXES = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const mcRight=()=>{ answerMC(sess.d.opts.findIndex(o=>o.ok)); q("#nx").click(); };
const runMC=()=>{ let g=0; while(sess&&g++<80){ if(sess.cur.t==="mc") mcRight(); else { q("#ans").value="x"; q("#submit").click(); q("#submit").click(); } } };
appReady().then(async()=>{ try{
  // 1. Typografisk apostrof
  ok("rättelser: ’ räknas som ' i grammatiken", gnorm("aujourd’hui")==="aujourd'hui"&&gnorm("l`ami")==="l'ami");
  { const x=Object.values(gramBank()).find(x=>x.type==="gap"&&x.ans.includes("'")&&x.topic!=="maj");
    const d=KINDS.gram.type({ref:x.id}); ok("rättelser: grammatiksvar med ’ godkänns", d.check(x.ans.replace(/'/g,"’")).r==="right", x.id+" "+x.ans); }
  { const p={min:1,max:200,need:{connectors:2}}, c=writeChecks(p,"D’abord je mange. Ensuite je dors.")[1];
    ok("rättelser: d’abord räknas som bindeord", c.ok&&c.label.includes("d'abord"), c.label); }
  // 10. Bindeord och tempus
  { const p={min:1,max:200,need:{connectors:2}};
    const a=writeChecks(p,"Même si je suis fatigué, je viens.")[1]; ok("rättelser: même si räknas inte också som si", !a.ok&&a.label.startsWith("Bindeord: 1 "), a.label);
    const b=writeChecks(p,"Même si je suis fatigué, je viens si tu veux.")[1]; ok("rättelser: si på ett annat ställe räknas", b.ok, b.label); }
  { const tc=L.tenseCheck;
    ok("rättelser: imparfait nous parlions", tc.imparfait("Nous parlions de musique."));
    ok("rättelser: je connais och il sait är inte imparfait", !tc.imparfait("Je connais Paris. Il sait tout. Mais je fais du vélo."));
    ok("rättelser: je pensais är imparfait", tc.imparfait("Je pensais à toi.")); }
  // 5. usesWord med artikeln som eget ord
  ok("rättelser: usesWord fr", usesWord("J’ai lu un livre.",{id:"x-t",t:"le livre",g:"m"})&&usesWord("Il a mangé l’orange.",{id:"x-t2",t:"l'orange",g:"f"}));
  // 11. Inga dubbla alternativ
  { const w=WORDS.find(w=>w.exT&&WORDS.filter(x=>x.sec===w.sec).length>6), keep=WORDS;
    WORDS=[...WORDS,{...w,id:"dup-1"},{...w,id:"dup-2",exT:w.exT+" "},{...WORDS.find(x=>x.sec===w.sec&&x!==w),id:"dup-3"}];
    let bad=0; for(let i=0;i<30;i++){ for(const d of [KINDS.dict.mc({w}),KINDS.trans.mc({w})]){ const l=d.opts.map(o=>tok(o.label).join(" ")); if(new Set(l).size!==l.length||d.opts.filter(o=>o.ok).length!==1) bad++; } }
    WORDS=keep; ok("rättelser: diktamen och översätt utan dubbla alternativ", !bad, bad); }
  // 12. Glosor
  ok("rättelser: glosan jusqu'à går att trycka på", glossKey("jusqu’à",{"jusqu'à":{}})==="jusqu'à"&&glossKey("l’ami",{ami:{}})==="ami");
  ok("rättelser: B2-Nachweis ger ordet Nachweis", /data-k="nachweis"[^>]*>Nachweis</.test(tapText([{fr:"den B2-Nachweis"}],{nachweis:{t:"der Nachweis",sv:"intyg"}}).replace(/class="[^"]*" /,"")));
  // 3 och 6. Återuppta efter att innehållet ändrats
  { const t=(C().reading||[]).find(t=>t.questions.length>=3); startTextQs("rq",t.id); mcRight(); q("#quit").click();
    ok("rättelser: pausad läsförståelse sparas", S.run&&S.run.ctx&&S.run.ctx.id===t.id);
    const removed=t.questions.pop(); renderStart(); q("#run-go").click();
    ok("rättelser: borttagen fråga hoppas över", sess&&sess.queue.length+1===t.questions.length-1, sess&&sess.queue.length);
    runMC(); t.questions.push(removed); ok("rättelser: läsförståelsen går att avsluta", !sess&&!S.run); }
  { const s=(C().stories||[])[0]; startStory(s.id); mcRight(); pauseSession();
    const all=L.content.stories; L.content.stories=all.filter(x=>x!==s); renderStart(); q("#run-go").click();
    ok("rättelser: borttagen berättelse kraschar inte", !sess&&!!q("#app").textContent); L.content.stories=all; }
  { L.content.uttal=[{id:"utt-x",title:"t",pairs:[["été","était"],["les","lait"]]}]; startUttal("utt-x"); mcRight(); pauseSession();
    L.content.uttal[0].pairs.pop(); renderStart(); q("#run-go").click(); runMC();
    ok("rättelser: borttaget uttalspar kraschar inte", !sess); delete L.content.uttal; }
  { const x=Object.values(XS)[0]; ok("rättelser: skugga med Tatoeba-mening återställs", x&&KINDS.shadow.restore(x.id).w===x&&KINDS.shadow.recap(x.id)===x.exT); }
  ok("rättelser: saknade frågor ger null", KINDS.lq.restore("finns-inte:0")===null&&KINDS.rq.restore(((C().reading||[])[0]||{}).id+":99")===null&&KINDS.story.restore("x:0")===null&&KINDS.utt.restore("x|0|0")===null&&KINDS.utt.recap("x|9|9")==="");
  // 4. Dagens pass efter Avbryt
  { delete S.runs; delete S.run;
    startDict(); q("#quit").click(); renderStart();
    ok("rättelser: dagens pass syns när en annan övning är pausad", !!q("#daily")&&!!q("#run-go"));
    startDaily(); ok("rättelser: dagens pass hör till Dagens pass, även i S.run", sess&&sess.daily===true&&!!sess.dp&&S.run&&S.run.daily===true);
    pauseSession(); renderStart(); ok("rättelser: pausat dagens pass erbjuds i panelen", !!q("#daily-go")&&!!q("#daily")&&!!S.runs.dict);
    q("#daily-go").click(); ok("rättelser: Fortsätt i dagens pass räknas som dagens pass", sess&&sess.daily===true&&!!sess.dp);
    quitSession(); delete S.runs; }
  // Passläget (P2: Bräckligt passläge): en ny runda börjar alltid med ett nytt sess, och det som ska följa med står i opts
  { delete S.runs; delete S.run;
    sess={kind:"x",daily:true,gramMix:true,label:"gammal",ctx:{type:"x",id:"y"},game:{id:"g"},start:1};
    const it=dictPool().slice(0,2).map(dictItem); beginQuiz("dict",it,{againFn:["dict"],label:"Diktamen"});
    ok("passläge: ny runda tar inte med fält från förra sess", it.length&&sess&&sess.kind==="dict"&&!sess.daily&&!sess.gramMix&&!sess.ctx&&!sess.game&&sess.start>1&&sess.label==="Diktamen"&&S.run&&!S.run.daily,
      JSON.stringify(sess&&{d:sess.daily,g:sess.gramMix,c:sess.ctx,s:sess.start}));
    quitSession(); delete S.runs;
    const nw=WORDS.filter(w=>!isLearned(w)).slice(0,2), du=WORDS.filter(isLearned).slice(0,1);
    startSession(nw,du,{daily:true}); const t0=sess.start; let g=0; while(sess&&!sess.queue&&g++<10) q("#next").click();
    ok("passläge: glosquizet behåller orden, starttiden och Dagens pass från lärokorten", sess&&sess.kind==="words"&&sess.daily===true&&sess.start===t0
      &&sess.newW.length===2&&sess.due.length===1&&S.run&&S.run.daily===true&&!!S.runs.words);
    quitSession(); delete S.runs;
    startMix({type:"click"}); ok("passläge: startMix med en klickhändelse är en vanlig runda", sess&&sess.kind==="mix"&&sess.daily===false); quitSession(); delete S.runs;
    KINDS.mix.again(); ok("passläge: En runda till i blandad runda är en vanlig runda", sess&&sess.kind==="mix"&&sess.daily===false); quitSession(); delete S.runs;
    startMix({daily:true}); ok("passläge: startMix({daily:true}) hör till Dagens pass", sess&&sess.daily===true&&S.run.daily===true); quitSession(); delete S.runs;
    if(hasGrammar()){ S.gt=S.gt||{}; const n0=()=>(S.gt.mix||{}).n||0;
      startGram("mix"); ok("passläge: blandad grammatik har gramMix, även i S.run", sess&&sess.gramMix===true&&S.run.gramMix===true);
      let a=n0(); KINDS.gram.effect(sess.cur.ref,true); ok("passläge: blandad grammatik räknas i S.gt.mix", n0()===a+1);
      pauseSession(); S.run=S.runs["gram|mix"]; delete S.run.gramMix; resumeRun();
      ok("passläge: en blandad grammatikrunda sparad utan gramMix känns igen", sess&&sess.gramMix===true); quitSession(); delete S.runs;
      const t=GR().topics.map(x=>x.id).find(id=>id!=="mix"&&gramItems(id,1).length); startGram(t); a=n0(); if(sess&&sess.cur) KINDS.gram.effect(sess.cur.ref,true);
      ok("passläge: ett vanligt grammatikområde räknas inte i S.gt.mix", sess&&!sess.gramMix&&n0()===a, t); quitSession(); delete S.runs; } }
  // 8. Skrivuppgift: flera tryck på Klar
  { openWriting(); q("[data-pick]").click(); const n0=S.log.length;
    q("#wtext").value="Hier, je suis allé au cinéma avec mes amis."; q("#wtext").dispatchEvent(new Event("input"));
    q("#done").click(); q("#done").click(); q("#done").click();
    ok("rättelser: Klar tre gånger ger en loggpost", S.log.length===n0+1, S.log.length-n0);
    q("#wtext").value+=" C'était bien."; q("#done").click();
    ok("rättelser: ändrad text uppdaterar loggposten", S.log.length===n0+1&&S.log[S.log.length-1].words===11, JSON.stringify(S.log[S.log.length-1]));
    q("#quit").click(); q("[data-pick]").click(); q("#done").click(); ok("rättelser: samma text senare räknas inte igen", S.log.length===n0+1); }
  // 7. Provet: bedömning utan poäng, och simulering utan skrivdel
  ok("rättelser: exScore utan kriterier ger null", exScore({})===null&&exScore({kriterier:[{poang:5}]})===100);
  { const t=EX().tasks.find(t=>t.minWords), keep=SAMPLE, before=JSON.stringify(exState().t[t.id]||null);
    SAMPLE={json:async()=>({helhet:"Bra."})}; examTask(t.id);
    q("#xtext").value="Bonjour, je m'appelle Hugo et je joue du piano depuis dix ans. J'aimerais beaucoup étudier au conservatoire."; q("#exdone").click(); await until(()=>q("#exres").textContent.includes("saknade poäng"));
    ok("rättelser: bedömning utan poäng sparas inte som null %", JSON.stringify(exState().t[t.id]||null)===before&&!q("#app").textContent.includes("null"), JSON.stringify(exState().t[t.id]));
    SAMPLE=keep; openExam(); ok("rättelser: provlistan visar inte null", !q("#app").textContent.includes("null")); }
  { openExam(); q("#sim").click(); let g=0;
    while(EXSIM&&g++<20){ const t=exTask(EXSIM.ids[EXSIM.i]);
      if(t.qs){ t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click(); q("#exnext").click(); } else q("#exnext").click(); }
    const txt=q("#app").textContent;
    ok("rättelser: simulering utan skrivdel säger inte att alla delar är godkända", txt.includes("blev inte bedömd")&&!txt.includes("Alla delar över")&&!txt.includes("null"), txt.slice(0,300)); }
  // 13. Hörövning i provet med ljudet av
  { setSound(false); const t=EX().tasks.find(t=>t.qs&&(t.plays||/^(hoeren|co)$/.test(t.part))); examTask(t.id);
    ok("rättelser: hörprov säger att ljudet är av", q("#plays").textContent.includes("avstängt"));
    q("#explay").click(); ok("rättelser: hörprov slår på ljudet", SOUND&&q("#plays").textContent.includes("Uppspelad 1")); openExam(); }
  // Alla kurser: Hitta felet, glosor, tempus i skrivuppgifterna
  for(const c of testCourses()){ useLang(c);
    // Modelltexterna klarar sin egen checklista (ordgräns, bindeord, kapitelord, tempus) i varje kurs, inte bara fr, de, de4, it1, it2, fr4, de6 och fru
    { const bad=(C().prompts||[]).map(p=>[p.id,writeChecks(p,p.model).filter(x=>!x.ok).map(x=>x.label).join(" / ")]).filter(x=>x[1]).map(x=>x.join(": "));
      ok(`modelltexterna klarar checklistan: ${c}`, !bad.length, bad.slice(0,5).join(" | ")+(bad.length>5?` … (${bad.length})`:"")); }
    if(c==="fr4"){ const p={min:1,max:200,need:{connectors:2}}, a=writeChecks(p,"Il pleut, c’est pourquoi je reste, alors que tu sors.")[1];
      ok("rättelser: fr4 c’est pourquoi och alors que", a.ok&&a.label.includes("c'est pourquoi")&&a.label.includes("alors que")&&!/alors,|alors\)/.test(a.label), a.label);
      ok("rättelser: fr4 éclairait är inte conditionnel", !L.tenseCheck.conditionnel("La lune éclairait la rue.")&&L.tenseCheck.conditionnel("Je voudrais venir.")); }
    if(c==="de") ok("rättelser: usesWord der Lehrer", usesWord("Mein Lehrer ist nett.",{id:"x-t",t:"der Lehrer",g:"m"}));
    if(c==="it1") ok("rättelser: usesWord l'insalata och il libro", usesWord("Mangio un’insalata.",{id:"x-t",t:"l'insalata",g:"f"})&&usesWord("Leggo un libro.",{id:"x-t2",t:"il libro",g:"m"}));
    // Kapitelord i checklistan: böjda former per språk och ordgräns (usesWord i 40-writing.js). [text, ord, genus, ska räknas]
    { const KW={fr:[["Je suis dans le parc.","danser","",0],["J'aime danser.","dans","",0],["Nous dansons ce soir.","danser","",1],["Elle a dansé.","danser","",1],
          ["La nourriture est bonne.","nourrir","",0],["Elle est lumineuse.","lumineux, -euse","",1],["Les chevaux courent.","le cheval","m",1],
          ["Il achète du pain.","acheter","",1],["Je reprends le travail.","reprendre","",1],["Ils se sont levés tôt.","se lever","",1],["Il a obtenu son diplôme.","obtenir","",1]],
        de:[["Ich stehe früh auf.","aufstehen","",1],["Ich stehe hier.","aufstehen","",0],["Es hat gestern geregnet.","regnen","",1],["Die Regierung ist neu.","regieren","",0],
          ["Mit den Kindern spiele ich.","das Kind (-er)","n",1],["Das ist eine praktische Idee.","praktisch","",1],["Ich mache mir Sorgen.","sich Sorgen machen","",1]],
        it2:[["Sono molto curiosa.","curioso","",1],["I tifosi cantano.","il tifoso","m",1],["Piatti tipici e feste tipiche.","tipico","",1],["Le spiagge sono belle.","la spiaggia","f",1],
          ["Cerchiamo casa.","cercare","",1],["Raccontami tutto!","raccontare","",1],["Mi alzo alle sette.","alzarsi","",1],["Ho letto un libro.","leggere","",1],["Un pezzo musicale.","musicare","",0]]}[c];
      if(KW){ const bad=KW.filter(([t,w,g,want],i)=>!!usesWord(t,{id:"x-kw"+i,t:w,g})!==!!want).map(([t,w,g,want])=>(want?"saknas ":"felaktigt ")+w+": "+t);
        ok(`kapitelord i checklistan: ${c}: böjda former och ordgräns`, !bad.length, bad.join(" | ")); } }
    const glued=[], few=[]; let n=0;
    errBase().forEach(b=>errAlts(b).forEach(i=>{ n++; const x=errItem(`err|${b.id}|${i}`), bad=x.bad, pre=b.p.parts[0], post=b.p.parts[1];
      if((/\p{L}$/u.test(pre)&&/^\p{L}/u.test(bad))||(/\p{L}$/u.test(bad)&&/^\p{L}/u.test(post))||/'\s/.test(gapos(bad)+post.slice(0,1))) glued.push(x.wrongText);
      if(x.opts.length<4) few.push(b.id); }));
    // Kurser utan grammatikfrågor (t.ex. en ny, liten kurs) har ingen Hitta felet
    ok(`rättelser: ${c}: Hitta felet utan ihopklistrade ord`, (n>0||!hasGrammar())&&!glued.length, n+" "+glued.slice(0,3).join(" | "));
    ok(`rättelser: ${c}: Hitta felet har minst 3 felalternativ`, !few.length, few.slice(0,5).join());
    const tc=Object.keys(L.tenseCheck||{}), badT=(C().prompts||[]).flatMap(p=>((p.need||{}).tenses||[]).filter(t=>!tc.includes(t)).map(t=>p.id+": "+t));
    ok(`rättelser: ${c}: need.tenses finns i tenseCheck`, !badT.length, badT.join(", "));
    const miss=[];
    ["reading","listening","culture"].forEach(k=>(C()[k]||[]).forEach(t=>{ if(!t.gloss) return; const h=tapText(t.lines,t.gloss);
      Object.keys(t.gloss).forEach(g=>{ if(!h.includes(`data-k="${esc(g)}"`)) miss.push(k+"/"+t.id+": "+g); }); }));
    ok(`rättelser: ${c}: alla glosor går att trycka på`, !miss.length, miss.slice(0,5).join(", "));
  }
  useLang("fr");
 }catch(e){ ok("rättelser: undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("rättelser: inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# ---------------------------------------------------------------------------------------------------------
# Rättelser i app.js, feedback.js och lang.js: molnformatet (högst 256 KiB per dokument), poäng vid lika,
# molnläge mitt i ett pass, kö per kurs, topplistan (kö och XSS), kursbyte i fel ordning, pronomen i
# verbträningen, komma i facit, ß, glospasset, sommartid och Tyck till. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_SYNC = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=(c,ms=3000)=>typeof c==="number"?new Promise(r=>setTimeout(r,c)):until(c,ms);   // ett villkor, eller ms där det inte finns något att vänta på
const canon=v=>JSON.stringify(v,(k,x)=>x&&typeof x==="object"&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,k)=>(o[k]=x[k],o),{}):x);
const size=v=>new TextEncoder().encode(JSON.stringify(v)).length;
const P="data/users/u_test/";
const flush=async()=>{ for(let i=0;i<40&&(CLOUD.busy||Object.keys(CLOUD.pending).length);i++){ await cloudFlush(); await wait(20); } };
const fake=st=>({exists:true,metadata:{hasPendingWrites:false},data:()=>({state:st,t:st.t})});
const clone=v=>JSON.parse(JSON.stringify(v));
// Ett stort, realistiskt läge: n ord med alla fält och en full logg (1 000 poster)
function bigState(n){ const t0=Date.now()-90*864e5, st={pass:400,newCount:15,src:"auto",mode:"mix",vt:{Präsens:{r:50,n:60}},vv:{},w:{},log:[],
    logOld:{dur:36000,days:40,lastDay:"x",n:2500},runs:{dict:{kind:"dict",i:0,done:3,total:10}},t:Date.now()};
  for(let i=0;i<n;i++) st.w["das Wort "+i+" (-e) · ein längerer Eintrag"]={s:i%7,due:300+i%50,f:i%2?"type":"mc",mcR:i%9,mcW:i%4,tyR:i%5,tyW:i%3,clR:1,clW:0,lp:i%300+1,ld:t0+i*1e5,mp:i%400,md:t0+i*2e5,dd:t0+i*3e5,lapses:i%3};
  for(let i=0;i<1000;i++) st.log.push({p:i,d:t0+i*6e6,dur:600+i%300,nNew:10,nRep:25,right:30,total:35,mcR:20,mcN:25,tyR:10,tyN:10,extra:false,kind:i%3?"gram":undefined,game:"tempus"});
  st.nLog=3500; return JSON.parse(JSON.stringify(st)); }
appReady().then(async()=>{ try{
  const K=P+"franska-glosor-v2";
  // 1. Molnformatet
  ok("moln: gammalt dokument med hela state läses", S.pass===5&&!!S.w["désigner"], S.pass);
  await flush();
  ok("moln: första sparningen skriver nya formatet", __remote[K]&&__remote[K].v===2&&!__remote[K].state&&!!__remote[K+"~w0"]&&!!__remote[K+"~log"]&&__remote[K].parts.w0===__remote[K+"~w0"].rev, Object.keys(__remote).join());
  { let e=null; try{ await mockDb.doc(P+"x").set({s:"x".repeat(270000)}); }catch(x){ e=x; }
    ok("låtsaslagringen avvisar dokument över 256 KiB", e&&e.code==="invalid_argument"&&!__remote[P+"x"]); }
  { const big=bigState(2500); let err=null;
    try{ await cloudWrite("glosor-test-v1",big); }catch(e){ err=e; }
    const keys=Object.keys(__remote).filter(k=>k.startsWith(P+"glosor-test-v1"));
    ok("moln: 2 500 ord och full logg sparas i flera dokument under 256 KiB", !err&&keys.length>=4&&keys.every(k=>size(__remote[k])<=262144),
      (err?err.message+" ":"")+keys.map(k=>k.split("/").pop()+":"+Math.round(size(__remote[k])/1024)+"k").join(", "));
    const r=await cloudRead("glosor-test-v1");
    ok("moln: läses tillbaka identiskt", r&&!r.bad&&canon(r.state)===canon(big));
    // Bara ändrade bitar skrivs
    const sets=[], orig=mockDb.doc; mockDb.doc=p=>{const d=orig(p), s=d.set; d.set=async b=>{sets.push(p.split("/").pop()); return s(b);}; return d;};
    big.runs.dict.done=4; big.t++; await cloudWrite("glosor-test-v1",big); const a=sets.slice(); sets.length=0;
    const id=Object.keys(big.w)[7]; big.w[id].s=6; big.t++; await cloudWrite("glosor-test-v1",big); const b=sets.slice();
    mockDb.doc=orig;
    ok("moln: oförändrade bitar skrivs inte om", a.join()==="glosor-test-v1"&&b.length===2&&/~w\d+$/.test(b[0])&&b[1]==="glosor-test-v1", a.join()+" | "+b.join());
    // Bitar från olika sparningar blandas aldrig: en bit med fel rev gör att läsningen väntar
    const keepW=__remote[P+"glosor-test-v1~w1"]; __remote[P+"glosor-test-v1~w1"]={rev:"annan",data:{}};
    const bad=await cloudRead("glosor-test-v1"); __remote[P+"glosor-test-v1~w1"]=keepW;
    ok("moln: bitar med annan rev används inte", bad&&bad.bad===true); }
  { // Som efter omladdning: tom localStorage, allt läses från molnet
    const bigFr=bigState(2500); bigFr.pass=S.pass+100; bigFr.t=Date.now()+10;
    await cloudWrite("franska-glosor-v2",bigFr);
    localStorage.clear(); loadState(); const empty=S.pass===1&&!Object.keys(S.w).length;
    await cloudAttach(); await flush();
    ok("moln: efter omladdning (tom localStorage) läses allt tillbaka", empty&&S.pass===bigFr.pass&&canon(S.w)===canon(bigFr.w)&&canon(S.log)===canon(bigFr.log)&&S.nLog===3500, S.pass+" "+Object.keys(S.w).length+" "+S.log.length);
    ok("moln: lokalt sparat efter omladdning", JSON.parse(localStorage.getItem("franska-glosor-v2")).log.length===1000); }
  { S.huge="x".repeat(300*1024); save(); await flush();
    const w=q("#cloudwarn");
    ok("moln: för stort läge ger en tydlig varning, och sparas ändå lokalt", !!w&&w.textContent.includes("för stora")&&localStorage.getItem(L.storageKey).includes("xxxxxxxx")&&!(__remote[K].head||{}).huge, w&&w.textContent.slice(0,40));
    delete S.huge; save(); await flush();
    ok("moln: varningen försvinner när det går att spara igen", !q("#cloudwarn")); }

  // 2. Poäng vid lika
  { const L1=()=>new Array(1000).fill(0).map((_,i)=>({d:i})), a={pass:3,log:L1(),w:{a:{}},nLog:1500}, b={pass:3,log:L1(),w:{a:{}}};
    ok("poäng: räknaren för alla loggposter avgör när loggen är kapad", cmpScore(a,b)>0&&cmpScore(b,a)<0);
    ok("poäng: räknaren beräknas för gamla lägen", nLogOf({log:[{}],logOld:{n:1200}})===1201&&nLogOf({log:[{},{}]})===2);
    ok("poäng: vid lika avgör tiden", remoteWins(score(b),200,{...b,t:100})&&!remoteWins(score(b),100,{...b,t:200}));
    const n0=nLogOf(S); for(let i=0;i<1100;i++) S.log.push({d:Date.now(),dur:1,kind:"dict",right:1,total:1}); save();
    ok("poäng: räknaren fortsätter när loggen sammanfattas", S.log.length===1000&&S.nLog===n0+1100&&S.logOld.n>0, S.nLog+" "+n0);
    await flush();
    const st=clone(S); st.newCount=20; st.t=S.t+5000;
    await onRemote(L.storageKey,fake(st)); ok("onSnapshot: lika poäng, nyare tid vinner", S.newCount===20, S.newCount);
    const st2=clone(S); st2.newCount=10; st2.t=S.t-5000;
    await onRemote(L.storageKey,fake(st2)); ok("onSnapshot: lika poäng, äldre tid vinner inte", S.newCount===20);
    await flush(); }

  // 3. Molnläge mitt i ett pass
  { setView("board"); await wait(()=>!!q("#nickf")); const st=clone(S); st.pass=S.pass+1; st.t=Date.now()+100;
    await onRemote(L.storageKey,fake(st));
    ok("molnläge när topplistan visas: eleven stannar kvar", curView==="board"&&S.pass===st.pass&&!q("#src")&&!!q("#nickf"));
    setView("ova"); S.runs={}; delete S.run; startDict(); const p0=S.pass, st2=clone(S); st2.pass=p0+1; st2.t=Date.now()+200;
    await onRemote(L.storageKey,fake(st2));
    ok("molnläge mitt i ett pass: väntar", !!sess&&S.pass===p0&&!!CLOUD.deferred, !!sess+" "+S.pass+" "+p0+" "+!!CLOUD.deferred);
    pauseSession(); ok("molnläge tas emot när passet är slut", !sess&&S.pass===p0+1&&!CLOUD.deferred&&!!q("#src"), S.pass+" "+p0);
    await flush(); }

  // 4. Kö per kurs och ny anslutning
  { await flush(); CLOUD.busy=true; const k1=L.storageKey; S.newCount=11; save();
    useLang("de"); await wait(()=>L.code==="de"&&CLOUD.ready&&!CLOUD.attaching); S.newCount=12; save(); CLOUD.busy=false; await flush();
    const a=__remote[P+k1], b=__remote[P+"glosor-de-v1"];
    ok("moln: kursbyte slänger inte föregående kurs sparning", a&&a.head&&a.head.newCount===11&&b&&b.head&&b.head.newCount===12, JSON.stringify([a&&a.head&&a.head.newCount,b&&b.head&&b.head.newCount])); }
  { const use=window.claude.use; CLOUD.db=null; CLOUD.ready=false; window.claude.use=async()=>{throw new Error("nät")};
    await cloudInit(); const down=!CLOUD.db; window.claude.use=use;
    window.dispatchEvent(new Event("online")); await wait(()=>!!CLOUD.db&&CLOUD.ready);
    ok("moln: ansluter igen när nätet kommer tillbaka", down&&!!CLOUD.db&&CLOUD.ready); }

  // 5. Topplistan: väntande uppdateringar per kurs
  { delete __remote["board/u_test"]; BOARD.mine=null; useLang("de"); boardPush(); useLang("de4"); await wait(()=>{const l=(__remote["board/u_test"]||{}).langs||{}; return !!l.de&&!!l.de4;});
    const langs=(__remote["board/u_test"]||{}).langs||{};
    ok("topplista: kursbyte tappar inte den förra kursens uppdatering", !!langs.de&&!!langs.de4, Object.keys(langs).join()); }

  // 6. XSS i topplistan
  { const w0=weekStart(Date.now()), pw=weekStart(w0-3*864e5), w2=weekStart(pw-3*864e5);
    BOARD.docs["u_evil"]={nick:"<img src=x onerror=window.__xss=1>",langs:{fr:{week:w0,min:"<b id=xss1>1</b>",q:"<i id=xss2>",days:1,streak:"<u id=xss3>",last:Date.now(),goal:"<a id=xss6>",
      prev:{week:pw,min:"<s id=xss4>"},hist:{[w2]:"<em id=xss5>","<p id=xss7>":5}},x:null,y:"text"}};
    BOARD.docs["u_evil2"]={nick:{toString:null},langs:null};
    setView("board"); await wait(()=>q("#app").textContent.includes("<img src=x"));
    ok("topplista: inget från db tolkas som HTML", !q("#xss1,#xss2,#xss3,#xss4,#xss5,#xss6,#xss7,.board img")&&!window.__xss&&q("#app").textContent.includes("<img src=x"), q("#app").textContent.slice(0,60));
    delete BOARD.docs["u_evil"]; delete BOARD.docs["u_evil2"]; }

  // 13c. "Sparat." bara när namnet sparades
  { const orig=CLOUD.db.doc; CLOUD.db.doc=p=>{const d=orig(p); if(p.startsWith("board/")) d.set=async()=>{throw {code:"unavailable"}}; return d;};
    q("#nick").value="Kalle"; q("#nickf").dispatchEvent(new Event("submit",{cancelable:true})); await wait(()=>((q("#nickmsg")||{}).textContent||"").includes("kunde inte"));
    const t1=(q("#nickmsg")||{}).textContent||""; CLOUD.db.doc=orig;
    q("#nick").value="Kalle"; q("#nickf").dispatchEvent(new Event("submit",{cancelable:true})); await wait(()=>((q("#nickmsg")||{}).textContent||"")==="Sparat.");
    ok("topplista: \"Sparat.\" bara när sparningen lyckades", t1!=="Sparat."&&t1.includes("kunde inte")&&(q("#nickmsg")||{}).textContent==="Sparat."&&__remote["board/u_test"].nick==="Kalle", t1+" | "+((q("#nickmsg")||{}).textContent)); }

  // 7. Kursbyte i fel ordning
  { const w=LANGUAGES.it2.words; LANGUAGES.it2.words=null;
    LOADING.it2=new Promise(r=>setTimeout(()=>{LANGUAGES.it2.words=w; r(LANGUAGES.it2);},60));
    useLang("it2"); const loading=q("#app").textContent.includes("Hämtar"); useLang("it1"); await LOADING.it2; await wait(20);
    ok("kursbyte: en kurs som blir klar senare tar inte över", loading&&L.code==="it1"&&q("#course").value==="it1", L.code); delete LOADING.it2; }

  // 8. Pronomen i verbträningen
  { const pc=(code,input,form)=>{const k=L; L=LANGUAGES[code]; try{return check(input,[norm(form)],true)}finally{L=k}};
    const cases={fr:[["ils sont","sont"],["sont","sont"],["elles parlent","parlent"],["parlent","parlent"],["qu'ils aient","aient"],["aient","aient"],["ont","ont"],["ils ont","ont"],["tues","tues"],["tu tues","tues"],["que j'aie","aie"],["j'ai","ai"],["qu'il/elle ait","ait"]],
      de:[["esse","esse"],["ich esse","esse"],["sieht","sieht"],["er sieht","sieht"],["wird","wird"],["es wird","wird"],["wir sind","sind"]],
      it1:[["esse","esse"],["loro sono","sono"],["sono","sono"],["io ho","ho"]]};
    cases.fr4=cases.fr; cases.de4=cases.de; cases.de6=cases.de; cases.it2=cases.it1;
    const bad=[]; Object.entries(cases).forEach(([c,xs])=>xs.forEach(([i,f])=>{const r=pc(c,i,f); if(r!=="right") bad.push(c+": "+i+" → "+r);}));
    ok("verb: pronomen tas bort bara när det står ensamt (fr, fr4, de, de4, de6, it1, it2)", !bad.length, bad.join(" | ")); }

  // 9. Komma i facit, 10. ß
  { const va=(code,w)=>{const k=L; L=LANGUAGES[code]; try{return variants(w)}finally{L=k}};
    const ck=(code,i,w)=>{const k=L; L=LANGUAGES[code]; try{return check(i,variants(w))}finally{L=k}};
    ok("facit: en fras med komma delas inte", !va("de6","ich habe dieses Thema gewählt, weil").includes("weil")&&ck("de6","weil","ich habe dieses Thema gewählt, weil")==="wrong"&&ck("de6","ich habe dieses Thema gewählt, weil","ich habe dieses Thema gewählt, weil")==="right");
    ok("facit: två former av samma ord godkänns fortfarande", ["fier","fière"].every(x=>va("fr","fier, fière").includes(x))&&va("fr","correspondant, -e").includes("correspondant")
      &&va("fr","le mélomane, la mélomane").includes("mélomane")&&va("fr4","le metteur en scène, la metteuse en scène").includes("metteuse en scène"), va("fr","le mélomane, la mélomane").join("/"));
    ok("ß: ss godkänns", ck("de","die Strasse","die Straße")==="right"&&ck("de","gross","groß")==="right"&&deacc("straße")==="strasse"); }

  // 11. Glospasset finns kvar efter en annan övning
  { useLang("fr"); S.runs={}; delete S.run; renderStart(); startSession(WORDS.slice(0,3),[]); q("#next").click(); pauseSession();
    startDict(); pauseSession(); renderStart();
    const b=q('[data-wgo="words"]'); ok("glospass: kan fortsättas efter en annan övning", !!b&&!!q("#run-go")&&S.runs.words&&S.runs.words.i===1);
    b.click(); ok("glospass: fortsätter där eleven slutade", sess&&sess.kind==="words"&&sess.i===1, sess&&sess.kind+" "+sess.i);
    pauseSession(); startDict(); if(q("#rcont")) q("#rcont").click(); pauseSession(); q('[data-wdrop="words"]').click();
    ok("glospass: går att slänga", !S.runs.words&&!q('[data-wgo="words"]')&&!!S.run&&S.run.kind==="dict"); }

  // 12. Sommartid
  { const x={s:1,due:0}; schedule(x,true,9,new Date(2026,9,24,21,0).getTime());
    const y={s:1,due:0}; schedule(y,true,9,new Date(2027,2,26,21,0).getTime());
    ok("sommartid: förfallodagen räknas i kalenderdagar", x.dd===new Date(2026,9,27).getTime()&&y.dd===new Date(2027,2,29).getTime(), new Date(x.dd)+" / "+new Date(y.dd)); }

  // 13. Tyck till
  { setView("fb"); q("#fbtext").value="Det här är otydligt A"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click(); setView("ova");
    await wait(()=>Object.values(__remote).some(f=>f&&f.text==="Det här är otydligt A")); q("#fbtext")||setView("fb");
    setView("fb"); q("#fbtext").value="Något tydligt B"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click(); setView("stats");
    await wait(()=>Object.values(__remote).some(f=>f&&f.text==="Något tydligt B"));
    const n=t=>Object.values(__remote).filter(f=>f&&f.text===t).length;
    ok("tyck till: byta flik medan Claude läser kraschar inte och meddelandet sparas", !__err.length&&n("Det här är otydligt A")===1&&n("Något tydligt B")===1, __err.join(" ; "));
    const sets=[], orig=CLOUD.db.doc; CLOUD.db.doc=p=>{const d=orig(p), s=d.set; d.set=async b=>{if(p.startsWith("feedback/")) sets.push(p); return s(b);}; return d;};
    setView("fb"); q("#fbtext").value="Det är otydligt C"; q("#fbtext").dispatchEvent(new Event("input")); q("#fbsend").click(); await wait(()=>!!q("#fbqsend"));
    q("#fbqsend").click(); q("#fbqsend").click(); q("#fbsend").click(); await wait(100); CLOUD.db.doc=orig;
    ok("tyck till: skicka med svaren bara en gång", sets.length===1, sets.join()); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def run(scenario, budget=5000, root=ROOT, head=""):
    page = (root / "dist" / "preview.html").read_text(encoding="utf-8")
    html = page.replace("<title>", SEED + head + "<title>", 1).replace("</body></html>", scenario + "</body></html>")
    with tempfile.TemporaryDirectory() as tmp:
        f = pathlib.Path(tmp) / "test.html"; f.write_text(html, encoding="utf-8")
        dump = pathlib.Path(tmp) / "dump.html"
        # Utdata till fil: Chromes hjälpprocesser håller annars en pipe öppen och Python väntar för evigt
        with open(dump, "w") as fh:
            p = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={tmp}/c", "--window-size=400,900", "--dump-dom",
                                  f"--virtual-time-budget={budget}", f.as_uri()], stdout=fh, stderr=subprocess.DEVNULL)
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


SCENARIO_HTTP = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=(f,ms=4000)=>new Promise(r=>{const t0=Date.now();(function p(){if(f()||Date.now()-t0>ms)r();else setTimeout(p,50)})()});
setTimeout(async()=>{ try{
  ok("publicerad sida: ingen inbakad data", LANGUAGES.de.words==null||L.code==="de");
  await wait(()=>L&&WORDS&&WORDS.length);
  ok("kursens data hämtas från data/<kod>.json", L&&WORDS.length>200, L&&L.code+" "+WORDS.length);
  const other=Object.keys(LANGUAGES).find(c=>c!==L.code&&LANGUAGES[c].words==null);
  q("#course").value=other; q("#course").dispatchEvent(new Event("change"));
  ok("byte av kurs visar att den hämtas", q("#app").textContent.includes("Hämtar"));
  await wait(()=>L.code===other);
  ok("byte av kurs hämtar nästa kurs", L.code===other&&WORDS.length>0, other+" "+WORDS.length);
 }catch(e){ ok("undantag", false, e.message); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},300);
</script>"""


def run_http(scenario, budget=8000):
    """Den publicerade sidan (utan inbakad data) via en lokal webbserver, så att data/<kod>.json hämtas som på riktigt."""
    import http.server, shutil, threading, functools, time
    sys.path.insert(0, str(ROOT))
    from build import SKELETON_HEAD
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp)
        shutil.copytree(ROOT / "dist" / "data", t / "data")
        page = SKELETON_HEAD + (ROOT / "dist" / "index.html").read_text(encoding="utf-8") + "\n</body></html>\n"
        seed = "<script>window.__err=[];window.onerror=(m,s,l,c)=>{__err.push(m+' @'+l)};localStorage.clear();</script>"
        (t / "test.html").write_text(page.replace("<title>", seed + "<title>", 1).replace("</body></html>", scenario + "</body></html>"), encoding="utf-8")
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=tmp))
        srv.RequestHandlerClass.log_message = lambda *a: None
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        dump = t / "dump.html"
        with open(dump, "w") as fh:
            p = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={tmp}/c", "--window-size=400,900", "--dump-dom",
                                  f"--virtual-time-budget={budget}", f"http://127.0.0.1:{srv.server_address[1]}/test.html"], stdout=fh, stderr=subprocess.DEVNULL)
            for _ in range(120):
                time.sleep(0.5)
                if "</html>" in dump.read_text(encoding="utf-8", errors="replace") or p.poll() is not None:
                    break
            p.kill()
        srv.shutdown()
        out = dump.read_text(encoding="utf-8", errors="replace")
    m = re.search(r'<pre id="out">(.*?)</pre>', out, re.S)
    return m.group(1).replace("&lt;", "<").replace("&amp;", "&") if m else "FEL  hittade inget testresultat i sidan (http)"


# ---------------------------------------------------------------------------------------------------------
# Arkitektur (2026-09-28, del 6): arv mellan kurser (extends), grammatikens områden i datafilen, DATA_VERSION
# per kurs, schemaversion S.v och MIGRATIONS, minne (högst KEEP_COURSES hämtade kurser), gamla molnbitar
# raderas. Körs på en egen sida. Id-låsen i build.py testas i test_build_locks() nedan.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_ARCH = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const canon=v=>JSON.stringify(v,(k,x)=>typeof x==="function"||x instanceof RegExp?String(x):x);
const P="data/users/u_test/";
// Verbtabellerna (sv, tenses, notes) ligger i datafilen (verbTables, arvet ihopslaget av build.py) och läggs till i L.verbs när kursen hämtas
const VT=c=>withVerbTables(LANGUAGES[c].verbs,(INLINE_DATA[c]||{}).verbTables);
// Förväntat per kurs, taget från versionen med getters (före extends)
const TEXTS=["Ich habe gestern gearbeitet. Er war müde und hätte gern geschlafen.","Das Haus wird gebaut. Sie sagte, sie sei krank.",
  "Hier j'ai mangé une pomme. Il faisait beau. Je voudrais que tu sois là. Si j'avais su, je serais venu.","Je parlerais si je pouvais. Il faut qu'il finisse.",
  "Ieri ho mangiato la pizza. Da bambino giocavo sempre. Domani andrò a Roma. Vorrei un caffè.",""];
const EXP={"de": {"games": ["pres", "tempus", "b2"], "tenses": ["Konjunktiv I", "Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 498, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "de4": {"games": ["pres", "tempus", "k2"], "tenses": ["Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 450, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "de6": {"games": ["k1", "k2", "alla"], "tenses": ["Konjunktiv I", "Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 498, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "fr": {"games": ["pres", "tempus", "b1"], "tenses": ["conditionnel", "futur simple", "imparfait", "passé composé", "plus-que-parfait", "présent", "subjonctif"], "conj": 438, "nconn": 27, "conn0": "d'abord", "connLast": "si", "tc": {"futur proche": [false, false, false, false, false, false], "imparfait": [false, false, true, true, false, false], "passé composé": [false, false, true, false, false, false], "présent": [true, true, true, true, true, false]}}, "fr4": {"games": ["subj", "hyp", "recit"], "tenses": ["conditionnel", "futur simple", "imparfait", "passé composé", "plus-que-parfait", "présent", "subjonctif"], "conj": 438, "nconn": 49, "conn0": "d'abord", "connLast": "pour conclure", "tc": {"conditionnel": [false, false, true, true, false, false], "futur proche": [false, false, false, false, false, false], "imparfait": [false, false, true, true, false, false], "passé composé": [false, false, true, false, false, false], "présent": [true, true, true, true, true, false], "subjonctif": [false, false, true, true, false, false]}}, "it1": {"games": ["pres-reg", "pres-irr", "pres-mod-rifl"], "tenses": ["presente"], "conj": 240, "nconn": 22, "conn0": "ma", "connLast": "alla fine", "tc": {"futuro": [false, false, false, false, true, false], "imperfetto": [false, false, false, false, true, false], "passato prossimo": [false, false, false, false, true, false], "presente": [true, true, true, true, true, false]}}, "it2": {"games": ["pres", "pp", "imp", "fut", "cond"], "tenses": ["condizionale", "futuro semplice", "imperfetto", "passato prossimo", "presente"], "conj": 732, "nconn": 22, "conn0": "ma", "connLast": "alla fine", "tc": {"futuro": [false, false, false, false, true, false], "imperfetto": [false, false, false, false, true, false], "passato prossimo": [false, false, false, false, true, false], "presente": [true, true, true, true, true, false]}}};
setTimeout(async()=>{ try{
  // 1. Arv mellan kurser
  { const bad=[];
    for(const [c,e] of Object.entries(EXP)){ const x=LANGUAGES[c], v=VT(c);
      const conj=Object.values(v.tenses).reduce((a,t)=>a+Object.keys(t).filter(k=>k!=="rule").length*v.persons.length,0);
      if(canon((v.games||[]).map(g=>g.id))!==canon(e.games)) bad.push(c+" verbspel "+(v.games||[]).map(g=>g.id));
      if(canon(Object.keys(v.tenses).sort())!==canon(e.tenses)) bad.push(c+" tempus "+Object.keys(v.tenses));
      if(conj!==e.conj||buildConj(v).length!==e.conj) bad.push(c+" verbformer "+conj);
      if(x.connectors.length!==e.nconn||x.connectors[0]!==e.conn0||x.connectors[x.connectors.length-1]!==e.connLast) bad.push(c+" bindeord");
      const tc=Object.fromEntries(Object.keys(x.tenseCheck).map(t=>[t,TEXTS.map(s=>!!x.tenseCheck[t](s))]));
      if(canon(Object.keys(tc).sort().reduce((o,k)=>(o[k]=tc[k],o),{}))!==canon(e.tc)) bad.push(c+" tempusigenkänning "+canon(tc));
      if(Object.values(Object.getOwnPropertyDescriptors(x)).some(d=>d.get)) bad.push(c+" har getters");
      if(x.verbs!==x.verbs) bad.push(c+" verbs är ett nytt objekt vid varje åtkomst"); }
    ok("arv: bindeord, tempusigenkänning, verbspel och verbtabeller som förut i alla kurser", !bad.length, bad.join(" | ")); }
  { const de=LANGUAGES.de, d4=LANGUAGES.de4, d6=LANGUAGES.de6, fr=LANGUAGES.fr, f4=LANGUAGES.fr4, i1=LANGUAGES.it1, i2=LANGUAGES.it2;
    const [vde,vd4,vd6,vfr,vf4]=["de","de4","de6","fr","fr4"].map(VT);
    ok("arv: de4 och de6 delar bindeord och tempusigenkänning med de", d4.connectors===de.connectors&&d6.connectors===de.connectors&&d4.tenseCheck===de.tenseCheck&&d6.tenseCheck===de.tenseCheck);
    ok("arv: de4 har samma verbtabeller som de, utan Konjunktiv I och i samma ordning",
      canon(Object.keys(vd4.tenses))===canon(Object.keys(vde.tenses).filter(t=>t!=="Konjunktiv I"))
      &&Object.keys(vd4.tenses).every(t=>canon(vd4.tenses[t])===canon(vde.tenses[t]))&&d4.verbs.persons===de.verbs.persons&&d4.verbs.prefix===de.verbs.prefix&&canon(vd4.sv)===canon(vde.sv)
      &&!!vde.tenses["Konjunktiv I"], Object.keys(vd4.tenses).join());
    ok("arv: de6 har alla verbtabeller från de men egna verbspel", canon(vd6.tenses)===canon(vde.tenses)&&d6.verbs.games!==de.verbs.games&&canon(vd6.sv)===canon(vde.sv));
    ok("arv: fr4 = bindeorden från fr plus egna, tempusigenkänning från fr plus conditionnel och subjonctif",
      canon(f4.connectors.slice(0,fr.connectors.length))===canon(fr.connectors)&&f4.connectors.length===fr.connectors.length+22
      &&canon(Object.keys(f4.tenseCheck))===canon([...Object.keys(fr.tenseCheck),"conditionnel","subjonctif"])
      &&Object.keys(fr.tenseCheck).every(k=>f4.tenseCheck[k]===fr.tenseCheck[k])
      &&f4.tenseCheck.conditionnel("Je parlerais volontiers.")&&!f4.tenseCheck.conditionnel("Il tirait la corde.")&&f4.tenseCheck.subjonctif("Il faut qu'il finisse.")
      &&canon(vf4.tenses)===canon(vfr.tenses), Object.keys(f4.tenseCheck).join());
    ok("arv: it2 hämtar artiklar, pronomen, elision, bindeord och tempusigenkänning från it1",
      ["articles","hintStrip","pronouns","elision","connectors","tenseCheck"].every(k=>i2[k]===i1[k])&&i2.verbs!==i1.verbs);
    ok("arv: fält som inte står i inherit ärvs inte", String(d6.nextCourse)!==String(LANGUAGES.de.nextCourse)&&d4.nextCourse==="de"&&d6.elective===undefined&&f4.book===undefined&&String(i2.nextCourse)!==String(i1.nextCourse)&&f4.storageKey==="glosor-fr4-v1");
    const m=mergeInherited({a:[1],b:{x:1,y:2,z:3},c:1},{a:{$append:[2]},b:{$remove:["y"],z:9,w:4}});
    ok("arv: sammanslagningen ($append, $remove, egna fält vinner, förälderns ordning)", canon(m)===canon({a:[1,2],b:{x:1,z:9,w:4},c:1})&&canon(Object.keys(m.b))==='["x","z","w"]', canon(m)); }

  // 2. Grammatikens områden och regler kommer med kursens datafil
  { const fresh=Object.keys(LANGUAGES).filter(c=>c!==L.code&&LANGUAGES[c].words==null);
    ok("grammatik: finns inte i en kurs som inte är hämtad", fresh.length&&fresh.every(c=>LANGUAGES[c].grammar===undefined), fresh.join());
    fillCourses(); ok("grammatik: kursväljaren fungerar innan kurserna är hämtade", q("#course").options.length>=Object.keys(LANGUAGES).length);
    useLang("de4");
    ok("grammatik: finns när kursen är hämtad", L.code==="de4"&&L.grammar&&L.grammar.topics.length>=9&&L.grammar.rules["pf-sein"]&&L.grammar.adj&&hasGrammar());
    { const keep=S.gt, t=L.grammar.topics.find(t=>t.id!=="adj"); S.gt={[t.id]:{r:1,n:2}};
      ok("grammatik: statistiken visar områdena", statsGrammar().includes(t.name), t.name); S.gt=keep; }
    ok("grammatik: Dagens pass har grammatik i turordningen", passOrder().some(g=>g.id==="gram")&&passName(PASS_GROUPS.find(g=>g.id==="gram")).includes("grammatik"));
    if(S.runs) delete S.runs.mix; startMix(true);
    ok("grammatik: Dagens pass har grammatikfrågor", !!sess&&[sess.cur,...sess.queue].some(x=>x.k==="gram")); quitSession(); }

  // 3. DATA_VERSION per kurs
  ok("DATA_VERSION: ett hash per kurs", DATA_VERSION&&typeof DATA_VERSION==="object"&&Object.keys(LANGUAGES).every(c=>/^[0-9a-f]{10}$/.test(DATA_VERSION[c]))
    &&new Set(Object.values(DATA_VERSION)).size===Object.keys(DATA_VERSION).length
    &&Object.keys(DATA_VERSION).every(k=>k in LANGUAGES||(/-exam$/.test(k)&&k.slice(0,-5) in LANGUAGES)||/^lemma-[a-z]{2}$/.test(k)), canon(DATA_VERSION));   // även <kod>-exam (provfilen) och lemma-<språk> (grundformerna)

  // 4. Schemaversion och migreringar
  { ok("migreringar: MIGRATIONS[1] är migrateRetired och S.v är senaste versionen", MIGRATIONS[1]===migrateRetired&&S_VERSION===MIGRATIONS.length-1&&S.v===S_VERSION, S.v);
    const key=L.storageKey, keep=localStorage.getItem(key);
    localStorage.setItem(key,JSON.stringify({pass:7,w:{a:{s:4,due:1e9,mp:3},b:{s:1,due:8}},log:[]}));
    loadState(); const old=S;
    localStorage.setItem(key,JSON.stringify({v:1,pass:7,w:{a:{s:4,due:1e9,mp:3}},log:[]}));
    loadState(); const cur=S;
    localStorage.setItem(key,JSON.stringify({v:99,pass:7,w:{},log:[]}));
    loadState(); const newer=S;
    if(keep===null) localStorage.removeItem(key); else localStorage.setItem(key,keep); loadState();
    ok("migreringar: ett gammalt läge utan v migreras och får v=1", old.v===1&&old.w.a.due<1e9&&old.w.a.due>=8&&old.w.b.due===8, canon(old.w));
    ok("migreringar: ett läge med v=1 migreras inte igen", cur.v===1&&cur.w.a.due===1e9);
    ok("migreringar: ett läge från en nyare version behåller sitt nummer", newer.v===99); }

  // 5. Minne: högst KEEP_COURSES hämtade kurser, framstegen påverkas inte
  { useLang("fr"); const passFr=S.pass, wFr=Object.keys(S.w).length;
    for(const c of ["de","de4","de6","it1","it2"]) useLang(c);
    const loaded=Object.keys(LANGUAGES).filter(c=>LANGUAGES[c].words!=null);
    ok("minne: högst "+KEEP_COURSES+" kurser hämtade", loaded.length<=KEEP_COURSES&&loaded.includes("it2")&&LANGUAGES.fr.words==null&&LANGUAGES.fr.base===undefined&&LANGUAGES.fr.content===undefined&&LANGUAGES.fr.grammar===undefined, loaded.join());
    ok("minne: kursinställningarna finns kvar för en släppt kurs", LANGUAGES.fr.storageKey==="franska-glosor-v2"&&LANGUAGES.fr.verbs&&LANGUAGES.fr.course);
    useLang("fr");
    ok("minne: en släppt kurs hämtas igen med samma framsteg", L.code==="fr"&&WORDS.length>400&&L.grammar&&L.grammar.topics.length&&S.pass===passFr&&Object.keys(S.w).length===wFr, S.pass+" "+passFr);
    ok("minne: fortfarande högst "+KEEP_COURSES, Object.keys(LANGUAGES).filter(c=>LANGUAGES[c].words!=null).length<=KEEP_COURSES); }

  // 6. Molnet: gamla bitar raderas efter en lyckad sparning
  { for(let i=0;i<40&&!CLOUD.ready;i++) await wait(50);
    const K="glosor-prune-v1", t0=Date.now()-50*864e5, keys=()=>Object.keys(__remote).filter(k=>k.startsWith(P+K+"~")).map(k=>k.slice((P+K+"~").length)).sort();
    const st=(nw,nl)=>{const s={pass:10,w:{},log:[],t:Date.now()}; for(let i=0;i<nw;i++) s.w["Wort "+i]={s:i%6,due:20,lp:1,ld:t0,mcR:3,mcW:1,tyR:2,tyW:0};
      for(let i=0;i<nl;i++) s.log.push({p:i,d:t0+i*6e6,dur:600,nNew:10,nRep:25,right:30,total:35,mcR:20,mcN:25,tyR:10,tyN:10,extra:false,kind:"gram",game:"tempus-lang"}); return s;};
    const big=st(2100,1500); big.pass=10; await cloudWrite(K,big); const k1=keys();
    const small=st(300,50); small.pass=11; small.nLog=1600; await cloudWrite(K,small); const k2=keys();
    ok("moln: först flera ord- och loggbitar", k1.includes("w2")&&k1.includes("log1"), k1.join());
    ok("moln: bitar som inte längre används raderas", canon(k2)===canon(Object.keys(__remote[P+K].parts).sort())&&!k2.includes("log1")&&!k2.includes("w2"), k2.join());
    { const r=await cloudRead(K); ok("moln: läget går att läsa efter raderingen", r&&r.state&&Object.keys(r.state.w).length===300&&r.state.log.length===50); }
    // En annan enhet har sparat efter oss: då raderas ingenting
    const other={...__remote[P+K], parts:{...__remote[P+K].parts, log1:"x"}}; __remote[P+K]=other; __remote[P+K+"~log7"]={rev:"y",data:[]};
    const done=await cloudPrune(K,{w0:"a"},[{log7:"y"}]);
    ok("moln: raderar inget när huvuddokumentet är en annan enhets", !done.length&&!!__remote[P+K+"~log7"]);
    ok("moln: en bit som inte kunde raderas försöks igen vid nästa sparning", !!(CLOUD.stale[K]||{}).log7); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},1500);
</script>"""


def test_build_locks():
    """Id-låsen i build.py, i en kopia av projektet: ett borttaget id stoppar bygget, godkänd borttagning,
    ändrad eller dubblerad storageKey, nya id läggs till, bokens id hamnar inte i det publika låset."""
    import json, shutil, time
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp) / "g"
        shutil.copytree(ROOT, t, ignore=shutil.ignore_patterns(".git", "dist", "*.jpg", "*.jpeg", "*.png", "*.heic", "*.pdf"))
        build = lambda *a: subprocess.run([sys.executable, str(t / "build.py"), *a], capture_output=True, text=True)
        lock = lambda c: json.loads((t / "languages" / c / "ids.lock").read_text(encoding="utf-8"))
        r = build()
        ok("id-lås: bygget går igenom med låsen som de är", r.returncode == 0, "" if r.returncode == 0 else r.stdout[-300:])
        for c in [p.name for p in (t / "languages").iterdir() if (p / "lang.js").exists()]:
            d = lock(c)
            ok(f"id-lås: {c} har ett lås med storageKey och ord", d.get("storageKey") and len(d.get("ord", [])) > 100 and "innehåll/grammar" in d)
        # Bokens id ligger bara i book/ids.lock
        book = t / "languages" / "fr" / "book"
        if book.exists():
            b = json.loads((book / "ids.lock").read_text(encoding="utf-8"))
            pub = lock("fr")
            leak = [i for k, v in b.items() if isinstance(v, list) for i in v if i in set(pub.get(k, []))]
            ok("id-lås: bokens id finns inte i det publika låset", b.get("ord") and not leak, ", ".join(leak[:5]))
        words = t / "languages" / "de" / "words.txt"
        orig = words.read_text(encoding="utf-8")
        wid = next(ln.split("|")[0] for ln in orig.splitlines() if ln and not ln.startswith(("#", "//")) and "|" in ln)
        words.write_text("\n".join(ln for ln in orig.splitlines() if not ln.startswith(wid + "|")) + "\n", encoding="utf-8")
        r = build()
        ok("id-lås: ett borttaget ord stoppar bygget", r.returncode != 0 and wid in r.stdout and "--allow-removed" in r.stdout)
        r = build("--allow-removed", f"de:ord|{wid}")
        ok("id-lås: --allow-removed godkänner borttagningen", r.returncode == 0 and wid not in lock("de")["ord"])
        words.write_text(orig, encoding="utf-8")
        r = build()
        ok("id-lås: ett nytt id läggs till automatiskt", r.returncode == 0 and wid in lock("de")["ord"])
        # ids.removed
        rd = t / "languages" / "de" / "content" / "reading.json"
        rorig = rd.read_text(encoding="utf-8")
        items = json.loads(rorig)
        rid = items[-1]["id"]
        rd.write_text(json.dumps(items[:-1], ensure_ascii=False), encoding="utf-8")
        r1 = build()
        (t / "languages" / "de" / "ids.removed").write_text(f"// test\ninnehåll/reading|{rid}\n", encoding="utf-8")
        r2 = build()
        ok("id-lås: ett borttaget innehålls-id stoppar bygget, en rad i ids.removed godkänner det", r1.returncode != 0 and rid in r1.stdout and r2.returncode == 0 and rid not in lock("de")["innehåll/reading"])
        rd.write_text(rorig, encoding="utf-8"); (t / "languages" / "de" / "ids.removed").unlink(); build()
        # storageKey
        lj = t / "languages" / "de4" / "lang.js"
        lorig = lj.read_text(encoding="utf-8")
        lj.write_text(lorig.replace('"glosor-de4-v1"', '"glosor-de4-v2"'), encoding="utf-8")
        r = build()
        ok("id-lås: en ändrad storageKey stoppar bygget", r.returncode != 0 and "storageKey" in r.stdout and "glosor-de4-v1" in r.stdout)
        lj.write_text(lorig.replace('"glosor-de4-v1"', '"glosor-de-v1"'), encoding="utf-8")
        r = build()
        ok("id-lås: två kurser med samma storageKey stoppar bygget", r.returncode != 0 and "flera kurser" in r.stdout)
        lj.write_text(lorig.replace('extends: "de"', 'extends: "xx"'), encoding="utf-8")
        r = build()
        ok("arv: extends till en kurs som inte finns stoppar bygget", r.returncode != 0 and "extends 'xx'" in r.stdout)
        lj.write_text(lorig, encoding="utf-8")
        ok("id-lås: bygget går igenom igen", build().returncode == 0)
    # Grammatiken och DATA_VERSION i den riktiga dist/
    import hashlib
    html = (ROOT / "dist" / "index.html").read_text(encoding="utf-8")
    ok("grammatik: områdena ligger inte i index.html", "Wo? eller wohin?" not in html and "Relativpronomen i dativ" not in html and "Subjonctif efter känslor" not in html)
    de = json.loads((ROOT / "dist" / "data" / "de.json").read_text(encoding="utf-8"))
    ok("grammatik: områden och regler ligger i data/de.json", de.get("grammar", {}).get("topics") and de["grammar"].get("rules") and de["grammar"].get("adj"))
    m = re.search(r"const DATA_VERSION = (\{[^}]*\})", html)
    dv = json.loads(m.group(1)) if m else {}
    wrong = [c for c in dv if dv[c] != hashlib.sha1((ROOT / "dist" / "data" / f"{c}.json").read_bytes()).hexdigest()[:10]]
    ok("DATA_VERSION: varje kurs har sitt eget hash av sin datafil", dv and not wrong and set(dv) == {p.stem for p in (ROOT / "dist" / "data").glob("*.json")}, ", ".join(wrong))
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------------------
# Övningstyperna (src/kinds/, 2026-09-28 del 6): registret (defineKind), att fråge-id och S.runs-nycklar är
# oförändrade, tl() för fältet .fr, komma i facit i alla kurser, synk mellan två enheter mot samma låtsaslagring,
# och alla kurser (Object.keys(LANGUAGES)) genomspelade: glosquiz, blandad runda, verb, alla övningar i menyn
# (grammatik, hörtext, lästext, berättelse, fraser, uttal, kapitelprov, provträning …). Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_KINDS = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
// Väntar tills villkoret gäller (eller tiden gått ut) i stället för en fast väntetid
const wait=(cond,ms=3000)=>new Promise(r=>{const t0=Date.now();(function p(){let v=false;try{v=cond()}catch(e){} if(v||Date.now()-t0>ms) r(!!v); else setTimeout(p,20);})();});
const idle=()=>typeof CLOUD!=="undefined"&&CLOUD.ready&&!CLOUD.busy&&!CLOUD.attaching&&!Object.keys(CLOUD.pending).length;
const flush=async()=>{ for(let i=0;i<40&&(CLOUD.busy||Object.keys(CLOUD.pending).length);i++){ await cloudFlush(); await wait(()=>!CLOUD.busy,500); } };
const P_=k=>"data/users/u_test/"+k;
const canon=v=>JSON.stringify(v,(k,x)=>x&&typeof x==="object"&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,k)=>(o[k]=x[k],o),{}):x);
const exClick=id=>{renderStart(); const g=exGroups().find(g=>g.items.some(h=>h.includes('data-ex="'+id+'"'))); openExGroup(g.id); const b=q('[data-ex="'+id+'"]'); b.click(); return b;};
// Rätt svar på vilken fråga som helst, hämtat ur frågan själv (sess.d)
function answerRight(){
  const c=sess.cur, d=sess.d;
  if(c.t==="mc"){ answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return; }
  if(q("[data-sh]")){ q('[data-sh="1"]').click(); return; }
  if(d.render){ d.o.words.forEach(w=>{const b=[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w); if(b) b.click();}); q("#submit").click(); q("#submit").click(); return; }
  q("#ans").value=d.accepted?d.accepted[0]:String(d.answer).replace(/ … /g," "); q("#submit").click();
  if(q("[data-gr]")) q('[data-gr="right"]').click();
  q("#submit").click();
}
const runAll=(n=400)=>{let g=0; while(sess&&sess.cur&&g++<n) answerRight();};
const logsSince=n0=>S.log.slice(n0);
const firstRight=n0=>{const l=logsSince(n0); return l.reduce((a,e)=>a+(e.right||0),0)+"/"+l.reduce((a,e)=>a+(e.total||0),0);};
const allRight=n0=>{const l=logsSince(n0); return l.length>0&&l.every(e=>e.right===e.total);};

(async()=>{ await wait(()=>typeof L!=="undefined"&&L&&L.base&&idle()&&S.pass===5,5000); try{
  // 1. Registret
  ok("register: inga fel när typerna registreras", !KIND_ERRORS.length, KIND_ERRORS.join("; "));
  { const probs=[];
    Object.entries(KINDS).forEach(([k,K])=>{
      if(typeof K.name!=="string"||!K.name) probs.push(k+": name saknas");
      const qs=K.mc||K.type;
      if(!qs&&!K.open&&!K.again) probs.push(k+": varken frågor, open eller again");
      if(qs&&k!=="words"&&!K.restore) probs.push(k+": restore saknas (frågorna kan pausas)");   // glosorna återskapas direkt ur ordlistan
      if(qs&&k!=="words"&&!K.recap&&!K.after) probs.push(k+": recap eller after saknas");
      if(!qs&&(K.restore||K.effect||K.recap)) probs.push(k+": restore/effect/recap utan frågor");
      Object.keys(K).forEach(f=>{ if(!KIND_FIELDS.includes(f)) probs.push(k+": okänt fält "+f); });
    });
    const want=["words","verbs","cloze","dict","trans","order","shadow","phr","story","lq","rq","culture","write","ktest","utt","teori","gram","gen","plu","exam","mix"];
    const miss=want.filter(k=>!KINDS[k]);
    ok("register: varje typ har det den behöver", !probs.length&&!miss.length, probs.concat(miss.map(k=>k+" saknas")).join("; ")+" · "+Object.keys(KINDS).length+" typer"); }
  ok("register: de gamla vyerna (MC, TYPE, RESTORE …) är borta, KINDS används direkt", typeof MC==="undefined"&&typeof RESTORE==="undefined"&&typeof KIND_NAMES==="undefined"
    &&KINDS.gen.name==="der, die, das"&&!!KINDS.utt.recap&&!KINDS.culture.mc&&!!KINDS.plu.type);
  { KIND_ERRORS.length=0;
    defineKind("dict",{recap:()=>""}); defineKind("xx",{foo:1}); const e2=KIND_ERRORS.length===2&&!("foo" in KINDS.xx); KIND_ERRORS.length=0; delete KINDS.xx;
    ok("register: fel vid registrering stoppar inte appen men syns i KIND_ERRORS", e2); }

  // 2. Fråge-id och S.runs-nycklar som förut (de finns i elevernas sparade pass)
  { S.runs={}; delete S.run; const g=verbGames()[0], st=(C().stories||[])[0], lt=(C().listening||[])[0], rt=(C().reading||[])[0], kc=ktChapters()[0];
    const ids=[];
    const take=fn=>{ fn(); if(q("#rnew")) q("#rnew").click(); ids.push(sess.cur.id||("words:"+sess.cur.w.id)); answerRight(); pauseSession(); };
    take(startDict); take(startTrans); take(startOrder); take(startShadow); take(startPhrases); take(startCloze); take(()=>startVerbs(g.id));
    take(()=>startStory(st.id)); take(()=>startTextQs("lq",lt.id)); take(()=>startTextQs("rq",rt.id)); take(()=>startGram("mix")); take(startMix);
    take(()=>{KT.mode="mc"; startKtest(kc.id);});
    const hasUtt=(C().uttal||[]).length>0, hasTe=(C().teori||[]).length>0; if(hasUtt) take(()=>startUttal(null)); if(hasTe) take(startTeori);
    const keys=Object.keys(S.runs).sort().join(","), exp=["dict","trans","order","shadow","phr","cloze","verbs|"+g.id,"story|"+st.id,"lq|"+lt.id,"rq|"+rt.id,"gram|mix","mix","ktest|"+kc.id]
      .concat(hasUtt?["utt|"]:[],hasTe?["teori"]:[]).sort().join(",");
    ok("fråge-id och S.runs: nycklarna är som förut", keys===exp, keys+" / "+exp);
    const badId=ids.filter(id=>!/^[a-z]+:./.test(id)||!KINDS[id.slice(0,id.indexOf(":"))]);
    ok("fråge-id: <typ>:<ref> och typen finns i registret", !badId.length, badId.join());
    const r=S.runs["story|"+st.id]; ok("S.runs: posterna har samma fält som förut", r&&["kind","learn","i","newW","due","extra","game","queue","total","done","firstTry","firstType","tries","start","ctx","againFn","label","daily"].every(k=>k in r)&&r.queue.every(x=>x.k==="story"&&x.id.startsWith("story:")), JSON.stringify(r&&r.queue[0]));
    renderStart(); q("#run-go").click(); ok("S.runs: senaste övningen går att fortsätta", !!sess&&!!sess.cur); runAll(); S.runs={}; delete S.run; renderStart(); }

  // 3. tl(): målspråkets text läses via en hjälpfunktion, datafilerna har kvar fältet fr
  ok("tl: läser fältet fr", tl({fr:"bonjour",sv:"hej"})==="bonjour"&&tlLine("x").fr==="x"&&tl(null)===undefined);
  ok("tl: datafilerna har kvar fr", (C().phrases||[]).every(p=>typeof p.fr==="string")&&(C().listening||[]).every(t=>t.lines.every(l=>typeof l.fr==="string")));

  // 4. Synk mellan två enheter mot samma låtsaslagring (__remote). Varje enhet har eget S, egen localStorage
  //    och egna kända bitar (CLOUD.known); db är gemensam. Den som kommit längst vinner, och bitar blandas aldrig.
  { const key=L.storageKey;
    await flush();
    const A={S, known:CLOUD.known[key], ls:localStorage.getItem(key)}, B={S:null, known:null, ls:null};
    const on=async(d,fn)=>{ S=d.S; CLOUD.known[key]=d.known; if(d.ls==null) localStorage.removeItem(key); else localStorage.setItem(key,d.ls); if(S) rebuildWords();
      await fn(); await flush(); await wait(idle,1000);
      d.S=S; d.known=CLOUD.known[key]; d.ls=localStorage.getItem(key); };
    const pass=()=>{ startSession(pickNew().slice(0,3),dueWords().slice(0,3)); while(sess&&!sess.queue) q("#next").click(); runAll(); };
    const p0=A.S.pass;
    await on(B,async()=>{ loadState(); rebuildWords(); await cloudAttach(); });
    ok("två enheter: ny enhet får framstegen från molnet", B.S.pass===p0&&canon(B.S.w)===canon(A.S.w), B.S.pass+" / "+p0);
    await on(B,async()=>{ pass(); });
    const bPass=B.S.pass, bWords=Object.keys(B.S.w);
    await on(A,async()=>{ await onRemote(key,await docFor(key).get()); });
    ok("två enheter: A tar emot passet från B", A.S.pass===bPass&&bPass===p0+1&&bWords.every(id=>A.S.w[id]), A.S.pass+" / "+bPass);
    await on(A,async()=>{ pass(); });               // A: ett pass till sparas
    await on(B,async()=>{ pass(); pass(); });       // B har inte sett A:s pass, gör två pass och sparar
    const head=__remote[P_(key)];
    ok("två enheter: den som kommit längst skriver (B, 2 pass)", head&&head.score[0]===bPass+2&&B.S.pass===bPass+2, head&&JSON.stringify(head.score));
    // A sparar igen: skriver inte över, utan tar emot B:s läge (onRemote efter den överhoppade sparningen)
    await on(A,async()=>{ S.newCount=S.newCount+1; save(); await flush(); await wait(()=>S.pass===bPass+2,2000); });
    const r=await cloudRead(key);
    ok("två enheter: A skriver inte över B utan tar emot B:s läge", A.S.pass===bPass+2&&r&&!r.bad&&r.state.pass===bPass+2&&canon(r.state.w)===canon(B.S.w)&&canon(A.S.w)===canon(B.S.w)&&canon(r.state.log)===canon(B.S.log),
      A.S.pass+" "+(r&&r.state.pass));
    S=A.S; CLOUD.known[key]=A.known; localStorage.setItem(key,A.ls); rebuildWords(); renderStart(); }

  // 5. Alla kurser
  const t0=Date.now(), commaInfo=[]; let commaN=0, commaSplit=0;
  const conj=new Set(["weil","dass","aber","ob","und","oder","denn","wenn","mais","que","et","ou","car","donc","ma","e","o","che","perché","però"]);
  for(const c of testCourses()){
    useLang(c); await wait(()=>L.code===c&&WORDS&&WORDS.length>0&&!sess,5000);
    if(!(L.base&&L.base.words.length)){ ok(c+": kursen har ord i words.txt (krävs för att övningarna ska testas)", false); continue; }
    const e0=__err.length; S.runs={}; delete S.run;
    Object.values(LANGUAGES).forEach(x=>(Array.isArray(x.connectors)?x.connectors:[]).forEach(s=>conj.add(norm(s))));
    // Glosquiz
    { const n0=S.log.length, nw=pickNew().slice(0,8), du=dueWords().slice(0,4); startSession(nw,du); while(sess&&!sess.queue) q("#next").click(); runAll();
      const e=S.log[S.log.length-1]; ok(c+": glosquiz", !sess&&S.log.length===n0+1&&e.nNew===nw.length&&e.right===e.total&&e.total===nw.length+du.length, e&&(e.right+"/"+e.total)); }
    // Blandad runda och verb
    { const n0=S.log.length; startMix(); const ks=[...new Set([sess.cur,...sess.queue].map(x=>x.k))];
      const reg=[sess.cur,...sess.queue].every(x=>KINDS[x.k]&&(x.t==="mc"?KINDS[x.k].mc:KINDS[x.k].type)); runAll();
      ok(c+": blandad runda", !sess&&reg&&ks.length>=3&&allRight(n0), ks.join()+" · "+firstRight(n0)); }
    for(const g of verbGames().slice(0,1)){ const n0=S.log.length; startVerbs(g.id); runAll(); ok(c+": verb ("+g.name+")", !sess&&S.log[S.log.length-1].verb&&allRight(n0), firstRight(n0)); }
    // Varje övning i menyn
    const menu=exGroups().flatMap(g=>g.items.map(h=>(h.match(/data-ex="(\w+)"/)||[])[1]).filter(Boolean));
    ok(c+": varje knapp i menyn har en typ med open", menu.every(id=>KINDS[id]&&KINDS[id].open), menu.join());
    const need=["ktest","dict","trans","order","talk"].concat((C().listening||[]).length?["lq"]:[],(C().reading||[]).length?["rq"]:[],(C().stories||[]).length?["story"]:[],(C().phrases||[]).length?["phr"]:[],(C().prompts||[]).length?["write"]:[],hasGrammar()?["gram"]:[],(C().uttal||[]).length?["utt"]:[],hasExam()?["exam"]:[],(C().culture||[]).length?["culture"]:[]);
    ok(c+": alla övningar som kursen har innehåll för finns i menyn", need.every(k=>menu.includes(k)), need.filter(k=>!menu.includes(k)).join()+" · "+menu.length+" övningar");
    for(const id of menu){ const n0=S.log.length; let res=null, info="";
      try{
        const btn=exClick(id); if(btn.disabled){ ok(c+": "+KINDS[id].name+" (avstängd, för få inlärda ord)", true); continue; }
        if(id==="lq"||id==="rq"){ const tid=q("[data-pick]").dataset.pick; q("[data-pick]").click(); q("#toq").click(); runAll();
          res=!sess&&S.tx&&S.tx[tid]&&S.tx[tid].best===S.tx[tid].n&&!!q("#more"); info=tid; }
        else if(id==="story"){ const sid=q("[data-pick]").dataset.pick; q("[data-pick]").click(); runAll(); res=!sess&&S.stb[sid]===parseStory(storyById(sid)).gaps.length&&!!q("#more"); info=sid; }
        else if(id==="utt"){ q('[data-pick="*"]').click(); runAll(); res=!sess&&q("#app").textContent.includes("Uttal klart")&&allRight(n0); }
        else if(id==="ktest"){ q('[data-ktm="mc"]').click(); const kid=q("[data-kt]").dataset.kt; q("[data-kt]").click(); runAll(); res=!sess&&S.kt[kid]&&S.kt[kid].r===S.kt[kid].n; info=kid+" "+(S.kt[kid]&&S.kt[kid].n)+" ord"; }
        else if(id==="gram"){ q('[data-pick="mix"]').click(); runAll(); res=!sess&&S.gt.mix&&S.gt.mix.n>0&&allRight(n0); info=firstRight(n0); }
        else if(id==="culture"){ const cid=q("[data-pick]").dataset.pick; q("[data-pick]").click(); q(".opt").click(); q("#ctext").value="Test."; q("#done").click(); res=S.cu[cid]&&S.log[S.log.length-1].kind==="culture"; }
        else if(id==="write"){ const p=(C().prompts||[]).find(x=>x.id===q("[data-pick]").dataset.pick); q("[data-pick]").click(); q("#wtext").value=p.model||"Test test."; q("#wtext").dispatchEvent(new Event("input"));
          res=[...document.querySelectorAll("#checks li")].every(li=>li.classList.contains("ok")); q("#done").click(); res=res&&S.log[S.log.length-1].kind==="write"; }
        else if(id==="talk"){ q("[data-talk]").click(); q("#ttext").value="un deux trois quatre cinq six sept huit neuf dix onze douze"; q("#ttext").dispatchEvent(new Event("input")); q("#tdone").click();
          const e=S.log[S.log.length-1]; res=S.log.length===n0+1&&e.kind==="talk"&&e.words===12&&!!q("#twpm"); info=q("#twpm")&&q("#twpm").textContent+" ord/min"; openTalk(); res=res&&!!q('[data-ex="shadow"]'); renderStart(); }
        else if(id==="exam"){ const tm=EX().tasks.find(t=>t.qs), tw=EX().tasks.find(t=>t.minWords);
          examTask(tm.id); tm.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${x.a}"]`).click()); q("#exdone").click();
          res=exState().t[tm.id].pct===100;
          if(tw){ examTask(tw.id); q("#xtext").value=tw.model||"Ein zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn fünfzehn sechzehn."; q("#xtext").dispatchEvent(new Event("input")); q("#exdone").click();
            res=res&&await wait(()=>exState().t[tw.id]&&exState().t[tw.id].pct===70); }
          info=EX().name+" · "+tm.id+(tw?" · "+tw.id:""); openExam(); }
        else { if(q("[data-pick]")) q("[data-pick]").click(); if(q("#rgo")) q("#rgo").click(); runAll();
          const e=S.log[S.log.length-1]; res=!sess&&S.log.length>n0&&(e.kind===id||(id==="cloze"&&e.cloze)||(id==="gen"&&e.kind==="plu"))&&allRight(n0); info=firstRight(n0); }
      }catch(err){ res=false; info=err.message+" "+(err.stack||"").split("\n")[1]; }
      ok(c+": "+KINDS[id].name, !!res&&!sess, info); sess=null; }
    ok(c+": loggen har namn för alla typer", S.log.filter(l=>l.kind).every(l=>KINDS[l.kind]&&KINDS[l.kind].name));
    // Komma i facit: två former av samma ord godkänns var för sig, men en fras med komma delas aldrig
    { const bad=[];
      WORDS.filter(w=>w.t.includes(",")&&w.sec!=="mine").forEach(w=>{ commaN++;
        const whole=[norm(w.t.replace(/\(.*?\)/g,"").replace(/…/g,"").trim()),norm(w.t.replace(/[()]/g,""))], v=variants(w.t).filter(x=>!whole.includes(x));
        if(v.length) commaSplit++;
        v.forEach(x=>{ if(!x.includes(" ")&&conj.has(x)) bad.push(w.t+" → "+x); });
        const [a,b]=w.t.replace(/\(.*?\)/g,"").split(/\s*,\s*/);
        if(b!==undefined&&!b.startsWith("-")&&a.split(/\s+/).length>b.trim().split(/\s+/).length&&v.length) bad.push(w.t+" delas: "+v.join(" / "));
        if(v.length) commaInfo.push(c+": "+w.t+" → "+v.join(" / ")); });
      ok(c+": facit med komma blir aldrig ett enstaka bindeord eller en bit av en fras", !bad.length, bad.slice(0,6).join(" | ")); }
    ok(c+": inga JavaScript-fel", __err.length===e0, __err.slice(e0).join(" ; "));
  }
  ok("alla kurser genomspelade", true, testCourses().join(", "));
  { const ck=(code,i,w)=>{const k=L; L=LANGUAGES[code]; try{return check(i,variants(w))}finally{L=k}};
    const va=(code,w)=>{const k=L; L=LANGUAGES[code]; try{return variants(w)}finally{L=k}};
    ok("facit: moniteur de ski och monitrice de ski godkänns", ck("fr","moniteur de ski","moniteur, monitrice de ski")==="right"&&ck("fr","monitrice de ski","moniteur, monitrice de ski")==="right"
      &&ck("fr","moniteur, monitrice de ski","moniteur, monitrice de ski")==="right"&&ck("fr","moniteur","moniteur, monitrice de ski")!=="right", va("fr","moniteur, monitrice de ski").join(" / "));
    ok("facit: weil godkänns inte för en fras med komma", ck("de6","weil","ich habe dieses Thema gewählt, weil")==="wrong"&&ck("de6","aber","das mag sein, aber")==="wrong"&&ck("fr","c'est","ce qui me plaît, c'est")==="wrong");
    ok("facit: former av samma ord godkänns fortfarande", ["vif","vive"].every(x=>ck("fr",x,"vif, vive")==="right")&&ck("fr","petite amie","petit ami, petite amie")==="right"
      &&ck("fr4","l'envoyée spéciale","l'envoyé spécial, l'envoyée spéciale")==="right"&&ck("fr4","monsieur","Madame, Monsieur")!=="right");
    ok("facit: ord med komma i alla kurser", commaN>200||!!window.COURSES_UNDER_TEST, commaN+" ord med komma, "+commaSplit+" delas i former, t.ex. "+commaInfo.filter(s=>/moniteur|petit ami|envoyé/.test(s)).join(" | ")); }
  useLang("fr");
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
})();
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Transkription (ipa) och satsanalys (sats) för Franska I på universitetet (fru): spelas igenom, pausas och
# återupptas, statistiken sparas (S.ipa, S.sa), IPA-rättningen tål mellanslag, syllabering och länkning, och
# kurser utan innehållsfilen visar inga knappar. Testas med tillfälligt innehåll i fr och, om fru finns, med kursens eget.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_IPA = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=(cond,ms=3000)=>new Promise(r=>{const t0=Date.now();(function p(){let v=false;try{v=cond()}catch(e){} if(v||Date.now()-t0>ms) r(!!v); else setTimeout(p,20);})();});
const menuIds=()=>exGroups().flatMap(g=>g.items.map(h=>(h.match(/data-ex="(\w+)"/)||[])[1]).filter(Boolean));
const grpOf=id=>(exGroups().find(g=>g.items.some(h=>h.includes('data-ex="'+id+'"')))||{}).id;
const exClick=id=>{renderStart(); openExGroup(grpOf(id)); q('[data-ex="'+id+'"]').click();};
function right(){ const c=sess.cur, d=sess.d;
  if(c.t==="mc"){ answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return; }
  q("#ans").value=d.accepted[0]; q("#submit").click(); q("#submit").click(); }
const runAll=()=>{let g=0; while(sess&&sess.cur&&g++<100) right();};
const T=[
  {id:"t1",sec:"s1",topic:"liaison",fr:"les amis",ipa:"/lez‿ami/",alt:["/le ami/","/les ami/","/lez‿amis/"],why:"Obligatorisk **liaison**."},
  {id:"t2",sec:"s1",topic:"nasal",fr:"vin",ipa:"/vɛ̃/",alt:["/vin/","/vɑ̃/","/vɛn/"],why:"-in"},
  {id:"t3",sec:"s1",topic:"nasal",fr:"brun",ipa:"/bʁœ̃/",ok:["/bʁɛ̃/"],alt:["/bʁyn/","/bʁɔ̃/","/bʁœn/"],why:"-un"},
  {id:"t4",sec:"s1",topic:"ecaduc",fr:"mercredi",ipa:"/mɛʁkʁədi/",alt:["/mɛʁkʁdi/","/mɛʁkʁedi/","/meʁkʁədi/"],why:"tre konsonanter"}];
const SA=[
  {id:"s1",sec:"s1",lvl:1,t:"fn",fr:"Marie lit [[un roman]].",opts:["COI","COD","sujet","épithète"],a:1,why:"**COD**"},
  {id:"s2",sec:"s1",lvl:2,t:"prop",fr:"Je sais [[qu'il viendra]].",opts:["subordonnée relative","subordonnée complétive"],a:1,why:"complétive"},
  {id:"s3",sec:"s1",lvl:1,t:"fn",fr:"[[Le train]] part.",opts:["sujet","COD"],a:0,why:"sujet"}];

(async()=>{ await wait(()=>typeof L!=="undefined"&&L&&L.base&&typeof CLOUD!=="undefined"&&CLOUD.ready,5000); try{
  useLang("fr"); await wait(()=>L.code==="fr"&&WORDS&&WORDS.length&&!sess,5000);
  ok("ipa/sats: typerna finns i registret", KINDS.ipa&&KINDS.ipa.mc&&KINDS.ipa.type&&KINDS.ipa.restore&&KINDS.ipa.effect&&KINDS.sats&&KINDS.sats.mc&&KINDS.sats.restore&&KINDS.sats.effect&&!KIND_ERRORS.length, KIND_ERRORS.join());
  ok("ipa/sats: inga knappar utan innehållsfil (fr)", !menuIds().includes("ipa")&&!menuIds().includes("sats"), menuIds().join());
  // Rättningen
  { const x=T[0], y=T[2];
    const good=["/lez‿ami/","lezami","le zami","lez ami","[le.za.mi]","/le.z‿a.mi/","le·za·mi","  lez_ami ","ˈlezaˈmi","lezaːmi"].filter(v=>ipaCheck(v,x)!=="right");
    const bad=["le ami","/lesami/","lezamis","lɛzami"].filter(v=>ipaCheck(v,x)!=="wrong");
    ok("ipa: rättningen godkänner varianter med och utan mellanslag, syllabering och länkning", !good.length, good.join(" | "));
    ok("ipa: fel transkription godkänns inte", !bad.length, bad.join(" | "));
    ok("ipa: r och ʀ räknas som ʁ, godkända varianter (ok) och tomt svar", ipaCheck("bʀœ̃",y)==="right"&&ipaCheck("/brœ̃/",y)==="right"&&ipaCheck("bʁɛ̃",y)==="right"&&ipaCheck("bʁyn",y)==="wrong"&&ipaCheck(" / ",y)==="empty"&&ipaCheck("mɛrkrədi",T[3])==="right"); }
  // Transkription: menyn, flerval åt båda hållen och skriva
  L.content.transkription=T; L.content.satsanalys=SA; S.runs={}; delete S.run; delete S.ipa; delete S.sa;
  renderStart(); ok("ipa: knapp i gruppen med uttal", grpOf("ipa")==="speak"&&grpOf("utt")!==undefined?grpOf("ipa")===grpOf("utt"):grpOf("ipa")==="speak", grpOf("ipa"));
  ok("sats: knapp i grammatikgruppen", grpOf("sats")==="gram", grpOf("sats"));
  S.ipa={t2:{s:1,last:1},t3:{s:2,last:1}};
  exClick("ipa"); ok("ipa: väljare med moment", !!q('[data-pick="*"]')&&!!q('[data-pick="nasal"]')&&!!q('[data-pick="liaison"]'));
  q('[data-pick="*"]').click();
  const forms=[sess.cur,...sess.queue].map(c=>c.ref.split("|")[1]).sort().join("");
  ok("ipa: formen följer hur väl man kan ordet (f, r, w)", forms==="ffrw", forms);
  { const it=[sess.cur,...sess.queue].find(c=>c.ref==="t3|w"); sess.queue=[...sess.queue,sess.cur].filter(c=>c!==it); sess.cur=it; sess.d=KINDS.ipa.type(it); renderType(sess.d); }
  ok("ipa: skrivfråga med IPA-knapprad", document.querySelectorAll(".accents [data-c]").length===21&&!!q('[data-c="ɑ̃"]'), document.querySelectorAll(".accents [data-c]").length);
  q("#ans").value="b"; q("#ans").setSelectionRange(1,1); q('[data-c="ʁ"]').click(); q('[data-c="œ̃"]').click();
  ok("ipa: knapparna skriver in tecknet och flyttar markören förbi hela tecknet", q("#ans").value==="bʁœ̃"&&q("#ans").selectionStart===q("#ans").value.length, q("#ans").value);
  q("#ans").value="[b.ʁœ̃]"; q("#submit").click(); ok("ipa: syllaberat svar godkänns i appen", q("#ans").classList.contains("right")); q("#submit").click();
  { const c=sess.cur; right(); }
  pauseSession();
  ok("ipa: rundan sparas när man avbryter", S.runs["ipa|*"]&&S.runs["ipa|*"].done===2, JSON.stringify(Object.keys(S.runs)));
  exClick("ipa"); q('[data-pick="*"]').click(); ok("ipa: fråga om att fortsätta", !!q("#rcont")); q("#rcont").click();
  ok("ipa: återupptas där man slutade", sess&&sess.done===2&&sess.kind==="ipa", sess&&sess.done);
  runAll(); const e=S.log[S.log.length-1];
  ok("ipa: runda klar och loggad", !sess&&e.kind==="ipa"&&e.right===4&&e.total===4&&q("#app").textContent.includes("Transkription klar"), e&&JSON.stringify(e));
  ok("ipa: statistiken per ord (S.ipa)", S.ipa.t1&&S.ipa.t1.s===1&&S.ipa.t1.n===1&&S.ipa.t3.s===3, JSON.stringify(S.ipa));
  ok("ipa: fel svar ger tillbaka frågan och s nollställs", (()=>{ sess=null; beginQuiz("ipa",[{k:"ipa",id:"ipa:t4|w",ref:"t4|w",t:"type",canType:true}],{label:"t",againFn:["ipa","x"],ctx:{type:"ipa",id:"x"}});
    q("#ans").value="mɛʁkʁdi"; q("#submit").click(); const back=sess.queue.some(c=>c.again&&c.t==="mc"); q("#submit").click(); runAll(); return back&&S.ipa.t4.s===0&&q("#app").textContent.includes("mercredi"); })());
  // Satsanalys
  exClick("sats"); ok("sats: väljare", !!q('[data-pick="*"]')&&!!q('[data-pick="fn"]')&&!!q('[data-pick="prop"]'));
  q('[data-pick="*"]').click();
  ok("sats: lätt före svårt och markerad del", sess.cur.ref!=="s2"&&[sess.cur,...sess.queue].map(c=>c.ref).pop()==="s2"&&!!q(".q-prompt u")&&!q(".q-prompt").textContent.includes("[["), q(".q-prompt")&&q(".q-prompt").innerHTML);
  right(); pauseSession();
  ok("sats: rundan sparas när man avbryter", S.runs["sats|*"]&&S.runs["sats|*"].done===1);
  renderStart(); exClick("sats"); q('[data-pick="*"]').click(); q("#rcont").click();
  ok("sats: återupptas", sess&&sess.done===1&&sess.kind==="sats"); runAll();
  { const e=S.log[S.log.length-1]; ok("sats: runda klar och loggad", !sess&&e.kind==="sats"&&e.right===3&&e.total===3, JSON.stringify(e)); }
  ok("sats: statistiken (S.sa)", S.sa.s1&&S.sa.s1.s===1&&S.sa.s2.n===1, JSON.stringify(S.sa));
  ok("ipa/sats: restore och recap", KINDS.ipa.restore("t1|w")&&KINDS.ipa.restore("finns-inte|f")===null&&KINDS.ipa.restore("t1|x")===null&&KINDS.sats.restore("s1")&&KINDS.sats.restore("nej")===null&&KINDS.sats.recap("s1")==="un roman: COD");
  setView("stats"); ok("ipa/sats: i statistiken", q("#app").textContent.includes("Transkription per moment")&&q("#app").textContent.includes("Satsanalys")&&q("#app").textContent.includes("Transkription ·"), "");
  await wait(()=>false,300);
  { const st=JSON.parse(localStorage.getItem(L.storageKey)||"{}"); ok("ipa/sats: statistiken sparas", st.ipa&&st.ipa.t1&&st.sa&&st.sa.s1); }
  delete L.content.transkription; delete L.content.satsanalys; renderStart();
  ok("ipa/sats: knapparna försvinner utan innehåll", !menuIds().includes("ipa")&&!menuIds().includes("sats"));
  // Andra kurser än fru har inga knappar
  for(const c of testCourses().filter(c=>c!=="fru"&&c!=="fr")){ useLang(c); await wait(()=>L.code===c&&WORDS&&!sess,5000);
    ok(c+": inga knappar för transkription och satsanalys", !menuIds().includes("ipa")&&!menuIds().includes("sats")); }
  // Kursens eget innehåll
  if(LANGUAGES.fru){ useLang("fru"); await wait(()=>L.code==="fru"&&L.base&&!sess,5000);
    const tr=C().transkription||[], sa=C().satsanalys||[];
    ok("fru: 120–150 poster i vardera", tr.length>=120&&tr.length<=150&&sa.length>=120&&sa.length<=150, tr.length+" / "+sa.length);
    ok("fru: knapparna finns", menuIds().includes("ipa")&&menuIds().includes("sats"));
    const bad=tr.filter(x=>ipaCheck(x.ipa,x)!=="right"||(x.ok||[]).some(v=>ipaCheck(v,x)!=="right")||x.alt.some(a=>ipaCheck(a,x)!=="wrong")).map(x=>x.id);
    ok("fru: facit rättas som rätt och felalternativen som fel", !bad.length, bad.join());
    const topics=[...new Set(tr.map(x=>x.topic))].filter(t=>!IPA_TOPICS[t]); ok("fru: alla moment har namn", !topics.length, topics.join());
    exClick("ipa"); q('[data-pick="*"]').click(); if(q("#rnew")) q("#rnew").click(); runAll(); ok("fru: transkription genomspelad", !sess&&S.log[S.log.length-1].kind==="ipa");
    exClick("sats"); q('[data-pick="*"]').click(); if(q("#rnew")) q("#rnew").click(); runAll(); ok("fru: satsanalys genomspelad", !sess&&S.log[S.log.length-1].kind==="sats");
    useLang("fr"); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
})();
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Nivåmätaren "Var ligger jag?" i statistiken (src/kinds/80-level.js, backlogg P2: Nivåmätare): tomt läge visar
# "för lite data", många kända ord och bra provresultat placerar eleven högre, ordförrådet räknas över alla kurser i
# samma språk (men inte andra språk), "Mest att vinna" pekar på den svagaste provdelen, sparat läge ändras inte,
# ingen horisontell scroll i 400 px bredd, och panelen följer mörkt läge. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_LEVEL = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
// Headless Chrome ger minst ~500 px fönster, så sidan smalnas av till w px (400 och 320) och allt i panelen ska rymmas inom panelen
const noScroll=()=>[400,320].every(w=>{ document.body.style.width=w+"px"; const p=q("#lvl");
  const r=p?p.getBoundingClientRect():null, bad=p?[...p.querySelectorAll("*")].filter(e=>{const b=e.getBoundingClientRect(); return b.width&&(b.right>r.right+.5||b.left<r.left-.5);}):[];
  const okw=document.documentElement.scrollWidth<=window.innerWidth&&(!p||(p.scrollWidth<=p.clientWidth&&r.width<=w&&!bad.length));
  document.body.style.width=""; return okw; });
const fill=(n,pre,s)=>{const w={}; for(let i=0;i<n;i++) w[pre+i]={s,due:9,lp:1}; return w;};
function examRes(pctOf){ const e=EX(), t={}; e.parts.forEach(p=>{const k=e.tasks.find(x=>x.part===p.id); if(k) t[k.id]={pct:pctOf(p.id),best:pctOf(p.id),n:1,last:Date.now()};}); return {t,sims:[]}; }
function gramRes(s){ const gi={}, per={}; Object.values(gramBank()).filter(x=>x.type==="gap"||x.type==="rw").forEach(x=>{ per[x.topic]=(per[x.topic]||0)+1; if(per[x.topic]<=6) gi[x.id]={s,last:Date.now()}; }); return gi; }
const logOne=()=>[{p:1,d:Date.now(),dur:300,nNew:10,nRep:0,right:9,total:10,mcR:9,mcN:10,tyR:0,tyN:0,extra:false}];

appReady().then(async()=>{ try{
  useLang("de"); await until(()=>L.code==="de"&&L.base&&!sess,5000);
  // 1. Tomt läge
  S.w={}; S.log=[]; delete S.gi; delete S.gt; delete S.exam; delete S.fb;
  setView("stats");
  ok("nivå: panelen finns även utan pass", !!q("#lvl")&&q("#lvl").textContent.includes("Var ligger jag?"));
  ok("nivå: tomt läge visar för lite data", levelEstimate().lv===null&&q("#lvl").textContent.includes("För lite data")&&q("#lvl").textContent.toLowerCase().includes("för lite data"), q("#lvl")&&q("#lvl").textContent.slice(0,160));
  ok("nivå: inte ett betyg, källan anges", q("#lvl").textContent.includes("inte ett betyg")&&q("#lvl").textContent.includes("Milton & Alexiou 2009"));
  ok("nivå: ingen horisontell scroll (tomt, 400 px)", noScroll(), document.documentElement.scrollWidth+" / "+window.innerWidth);
  // 2. Svagt läge mot starkt läge
  S.log=logOne(); S.w=fill(400,"x",4); S.gi=gramRes(0); S.exam=examRes(()=>20); S.fb={"w:a":{niva:"A2",d:Date.now()}};
  const weak=levelEstimate();
  S.w=fill(3800,"x",5); S.gi=gramRes(2); S.exam=examRes(()=>85); S.fb={"w:a":{niva:"B2",d:Date.now()}};
  const strong=levelEstimate();
  ok("nivå: svagt läge får en uppskattning", weak.lv!=null&&weak.voc.n===400&&weak.gram.lv!=null&&weak.exam.lv!=null, JSON.stringify([weak.lv,weak.voc.lv,weak.gram.lv,weak.exam.lv]));
  ok("nivå: många kända ord och bra prov placeras högre", strong.lv!=null&&strong.lv>=weak.lv+1&&strong.lv>=3.5, (weak.lv||0).toFixed(2)+" → "+(strong.lv||0).toFixed(2));
  ok("nivå: delindikatorerna var för sig", strong.voc.lv>weak.voc.lv&&strong.gram.lv>weak.gram.lv&&strong.exam.lv>weak.exam.lv);
  const before=JSON.stringify(S), ls=localStorage.getItem(L.storageKey);
  setView("stats");
  ok("nivå: visas i statistiken med alla tre delar", ["Ordförråd","Grammatik","Prov och texter"].every(t=>q("#lvl").textContent.includes(t))&&!q("#lvl").textContent.includes("För lite data"), q("#lvl").textContent.slice(0,120));
  ok("nivå: sparat läge ändras inte", JSON.stringify(S)===before&&localStorage.getItem(L.storageKey)===ls);
  ok("nivå: ingen horisontell scroll (med data, 400 px)", noScroll(), document.documentElement.scrollWidth+" / "+q("#lvl").scrollWidth+" / "+q("#lvl").clientWidth);
  // 3. Mest att vinna
  S.exam=examRes(p=>p==="hoeren"?30:85); setView("stats");
  ok("nivå: mest att vinna pekar på svagaste delen", q("#lvl .insight")&&q("#lvl .insight").textContent.includes("Mest att vinna: hörförståelse"), q("#lvl .insight")&&q("#lvl .insight").textContent);
  // 4. Ordförrådet räknas över alla kurser i samma språk, men inte andra språk
  const k4=LANGUAGES.de4.storageKey, k6=LANGUAGES.de6.storageKey, kfr=LANGUAGES.fr.storageKey;
  const o4=localStorage.getItem(k4), o6=localStorage.getItem(k6), ofr=localStorage.getItem(kfr);
  S.w={...fill(500,"x",4),...fill(100,"y",2)};
  localStorage.setItem(k4,JSON.stringify({pass:3,w:fill(1000,"x",4),log:[]}));
  localStorage.setItem(k6,JSON.stringify({pass:2,w:{z1:{s:6,due:9},z2:{s:3,due:9}},log:[]}));
  localStorage.setItem(kfr,JSON.stringify({pass:2,w:fill(900,"f",5),log:[]}));
  { const v=levelEstimate().voc;
    ok("nivå: ordförrådet räknas över kursens språk (de4 + de + de6, samma ord en gång)", v.n===1001&&v.per.length===3, v.n+" "+JSON.stringify(v.per));
    setView("stats"); ok("nivå: kurserna visas i förklaringen", q("#lvl").textContent.includes("Tyska 4")&&q("#lvl").textContent.includes("Tyska 6")); }
  [[k4,o4],[k6,o6],[kfr,ofr]].forEach(([k,o])=>o===null?localStorage.removeItem(k):localStorage.setItem(k,o));
  // 5. Mörkt läge och Franska 3
  S.w=fill(3800,"x",5); setView("stats");
  document.documentElement.dataset.theme="light";   // oberoende av datorns ljusa/mörka läge
  const lightBg=getComputedStyle(q("#lvl .lvtrack")).backgroundColor;
  document.documentElement.dataset.theme="dark"; const darkBg=getComputedStyle(q("#lvl .lvtrack")).backgroundColor; delete document.documentElement.dataset.theme;
  ok("nivå: mörkt läge", lightBg!==darkBg, lightBg+" / "+darkBg);
  useLang("fr"); await until(()=>L.code==="fr"&&L.base&&!sess,5000); setView("stats");
  ok("nivå: Franska 3 mot DELF B1", !!q("#lvl")&&q("#lvl").textContent.includes("DELF B1")&&noScroll(), q("#lvl")&&q("#lvl").querySelector(".sub").textContent);
  ok("nivå: tolkar Claudes nivåer", lvNum("B1")===3&&Math.abs(lvNum("A2/B1")-2.5)<1e-9&&lvNum("B1+")>3&&lvNum("ingen")===null&&lvShort(3.5)==="B1+"&&lvShort(0.2)==="under A1");
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Provsimuleringen som hela provet (src/kinds/70-exam.js, backlogg P2): en uppgift per övning/Teil i läsa, lyssna
# och skriva, klockan går för hela delen med provets tid, delresultat av alla frågor i delen, simulering av en
# enda del, och gamla simuleringar (utan tasks) visas som förut. Alla kurser med provträning. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_EXAMSIM = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const crit={kriterier:[{namn:"A",poang:4},{namn:"B",poang:4},{namn:"C",poang:4},{namn:"D",poang:4}],helhet:"Bra."};
appReady().then(async()=>{ try{
  const keep=SAMPLE; SAMPLE={json:async()=>JSON.parse(JSON.stringify(crit))};
  for(const c of testCourses()){ useLang(c); await until(()=>L.code===c&&L.base&&!sess,5000);
    if(!hasExam()) continue;
    // Hela provet = provets huvudnivå (Franska 3: DELF B1 utan A2-delarna, som har en egen knapp)
    const e=EX(), want=[], lv0=simLvs()[0]; e.tasks.forEach(t=>{ if(simTaskOk(t,lv0)&&!want.includes(t.part+"|"+t.teil)) want.push(t.part+"|"+t.teil); });
    S.exam={t:{},sims:[{d:Date.now()-86400000,parts:{[e.parts[0].id]:40}}]}; delete S.drafts; delete S.fb;
    openExam(); ok(c+": gammal simulering visas", q("#app").textContent.includes("Tidigare simuleringar")&&!/undefined|null|NaN/.test(q("#app").textContent));
    ok(c+": knappen säger hela provet", q("#sim").textContent.includes("hela provet")&&document.querySelectorAll("[data-simp]").length===e.parts.filter(p=>simPart(p.id)).length);
    q("#sim").click();
    const got=EXSIM.ids.map(id=>{const t=exTask(id); return t.part+"|"+t.teil;});
    ok(c+": en uppgift per övning/Teil", JSON.stringify(got)===JSON.stringify(want), got.join(", "));
    ok(c+": ingen taluppgift", EXSIM.ids.every(id=>exKind(exTask(id))!=="speak"));
    let g=0, sameEnd=true, labels=true;
    while(EXSIM&&g++<30){ const t=exTask(EXSIM.ids[EXSIM.i]), p=exPart(t.part), end=EXSIM.ends[t.part];
      labels=labels&&q("#exclock").textContent.includes(p.sv)&&q("#app").textContent.includes("uppgift "+(EXSIM.i+1)+" av "+EXSIM.ids.length);
      if(EXSIM.i>0&&exTask(EXSIM.ids[EXSIM.i-1]).part===t.part) sameEnd=sameEnd&&end!=null;
      else sameEnd=sameEnd&&Math.abs(end-Date.now()-p.time*60000)<5000;
      if(exItems(t)){ exFill(t,true); q("#exnext").click(); }
      else { q("#xtext").value="Ein zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn fünfzehn sechzehn."; q("#exdone").click(); await until(()=>(S.exam.t[t.id]||{}).pct!=null); q("#exnext").click(); } }
    ok(c+": klockan gäller hela delen med provets tid", sameEnd&&labels);
    const s=S.exam.sims[S.exam.sims.length-1], parts=[...new Set(want.map(x=>x.split("|")[0]))];
    ok(c+": simuleringen sparas med alla delar och uppgifter", S.exam.sims.length===2&&JSON.stringify(Object.keys(s.parts))===JSON.stringify(parts)&&Object.keys(s.tasks).length===want.length, JSON.stringify(s));
    // Läsa/lyssna: ett fel per uppgift, delens resultat = rätt av alla frågor i delen
    const mc=parts.filter(p=>e.tasks.some(t=>t.part===p&&exItems(t))).every(p=>{ const ts=Object.keys(s.tasks).map(exTask).filter(t=>t.part===p);
      const n=ts.reduce((a,t)=>a+exItems(t),0); return s.parts[p]===exPct(n-ts.length,n); });
    ok(c+": delresultat av alla frågor i delen", mc, JSON.stringify(s.parts));
    ok(c+": skrivdelen bedömd", parts.filter(p=>e.tasks.some(t=>t.part===p&&t.minWords)).every(p=>s.parts[p]===80), JSON.stringify(s.parts));
    ok(c+": resultatsidan", q("#app").textContent.includes("Resultat av simuleringen")&&!/undefined|null|NaN/.test(q("#app").textContent));
    // En enda del
    openExam(); const p0=e.parts.find(p=>simPart(p.id)); q(`[data-simp="${p0.id}"]`).click();
    ok(c+": simulering av en del", EXSIM&&EXSIM.ids.every(id=>exTask(id).part===p0.id)&&EXSIM.ids.length===want.filter(x=>x.startsWith(p0.id+"|")).length);
    q("#quit").click(); ok(c+": avbruten simulering sparas inte", !EXSIM&&S.exam.sims.length===2);
  }
  SAMPLE=keep;
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Buggjakt 2026-09-29 (app.js och src/kinds): ett regressionstest per rättad bugg.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_ESC = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
appReady().then(async()=>{ try{
  // P1 escaping: text från datafilerna (ursprung, ordagrant, exempel, facit) med farlig HTML och "<" som text
  window.__xss=0;
  const ety='<script>window.__xss=1<\/script><img src=x onerror="window.__xss=2"> a < b & c <b onclick="window.__xss=3">fet</b> <span class="k" onmouseover="window.__xss=4">sp</span>';
  const line='a<b-ord|mindre än-ord|m|Ett [a<b-ord] med a < b <img src=x onerror="window.__xss=5">.|Svenska: a < b.|'+ety+'|<i>ordagrant</i> <img src=y onerror="window.__xss=6"> x < y';
  const w=parseWords("#xss|XSS\n"+line).words[0]; w.sec=SECTIONS[0].id; WORDS.push(w); byId[w.id]=w;
  const clean=()=>!q("#app img")&&!q("#app script")&&!q("#app [onclick]")&&!q("#app [onmouseover]")&&!q("#app [onerror]");
  S.listenFirst=false; sess={newW:[w],due:[],i:0,kind:"words",extra:true,start:Date.now()}; renderLearn(); await wait(200);
  const t=q("#app").textContent;
  ok("escaping: nya ord visar ursprunget som text", t.includes("a < b & c")&&t.includes("x < y")&&t.includes("a<b-ord")&&t.includes("Ett a<b-ord med a < b")&&t.includes("Svenska: a < b."), t.slice(0,200));
  ok("escaping: tillåten formatering i ursprunget (b, i, span med class) finns kvar", q("#app .ety b")&&q("#app .ety b").textContent==="fet"&&q("#app .lit i")&&q("#app .ety span.k"));
  ok("escaping: ingen script, img eller onclick från datan i nya ord", clean()&&window.__xss===0, q("#app").innerHTML.slice(0,300));
  beginQuiz("words",[{w,isNew:false,t:"type",canType:true}]); q("#ans").value="fel svar"; q("#submit").click(); await wait(200);
  const fb=q("#fb").textContent;
  ok("escaping: facit och lärokortet efter fel svar", fb.includes("Rätt svar: a<b-ord")&&fb.includes("a < b & c")&&q("#fb .ety b")&&clean()&&window.__xss===0, fb.slice(0,200));
  ok("escaping: safeHtml släpper bara igenom vitlistan", safeHtml('<b onclick="x">t</b>')==="<b>t</b>"&&safeHtml("a < b")==="a &lt; b"&&safeHtml("&nbsp;x & y")==="&nbsp;x &amp; y"
    &&safeHtml('<span class="k">x</span><span style="color:red">y</span>')==='<span class="k">x</span><span>y</span>'&&safeHtml("<a href=\"javascript:x\">l</a><br>")==='&lt;a href=&quot;javascript:x&quot;&gt;l&lt;/a&gt;<br>'
    &&safeHtml(null)===""&&esc(undefined)==="", safeHtml('<a href="x">l</a>'));
  quitSession(); WORDS.pop(); delete byId[w.id];
 }catch(e){ ok("undantag", false, e.message+" "+e.stack); }
 await wait(100);
 ok("escaping: inget från datan kördes", window.__xss===0, window.__xss);
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# Flamman i sidhuvudet (elevens önskemål 2026-09-30): dold utan svit, urblekt utan dagens pass, tänd med dagens pass
SCENARIO_TOPBACK = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const tick=()=>new Promise(r=>setTimeout(r,0));
appReady().then(async()=>{ try{
  const tb=()=>q("#topback");
  renderStart(); await tick();
  ok("tillbaka uppe: dold på startsidan", tb().hidden);
  openGrammar(); await tick();
  ok("tillbaka uppe: syns på en undersida", !tb().hidden);
  tb().click(); await tick();
  ok("tillbaka uppe: leder till startsidan", !q("#tabs").hidden&&tb().hidden&&!!q("#src"));
  startSession(pickNew().slice(0,3),[]); startQuiz(); await tick();
  ok("tillbaka uppe: syns i ett pass", !tb().hidden&&!!sess);
  tb().click(); await tick();
  ok("tillbaka uppe: pausar passet som sidans egen knapp", !sess&&!q("#tabs").hidden&&!!(S.run||Object.keys(S.runs||{}).length));
  q("#tab-stats").click(); await tick();
  ok("tillbaka uppe: dold i flikvyerna", tb().hidden);
  renderStart(); openListening(); await tick();
  const st=getComputedStyle(tb());
  ok("tillbaka uppe: klistrig överst", st.position==="sticky");
  openGrammar(); window.scrollTo(0,600); await tick();
  const r=tb().getBoundingClientRect();
  ok("tillbaka uppe: syns kvar högst upp efter skrollning", window.scrollY>100&&r.top>=0&&r.top<30&&r.width<200, "scrollY "+window.scrollY+", top "+Math.round(r.top)+", bredd "+Math.round(r.width));
  window.scrollTo(0,0);
  // Svarsalternativen blandas (facit stod ofta på plats 2), utom två alternativ och korta etiketter (A, B, C)
  const same=a=>a.every((x,i)=>x===i), perm=a=>a.slice().sort().join()===a.map((_,i)=>i).join();
  ok("alternativ: två behåller ordningen", same(optOrder(["Richtig","Falsch"])));
  ok("alternativ: annonsbokstäver behåller ordningen", same(optOrder(["A","B","C","D"])));
  let moved=false; for(let n=0;n<30;n++){ const o=optOrder(["un chat","un chien","une souris","un oiseau"]); if(!perm(o)) moved=null; if(!same(o)) moved=moved===null?null:true; }
  ok("alternativ: fyra långa blandas och alla finns kvar", moved===true);
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# Dagens pass som korta pass, flera om dagen (föräldern 2026-10-01): längd, blandning, rotation, räknaren, fortsätta, provdatum
SCENARIO_PASS = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const tick=()=>new Promise(r=>setTimeout(r,0));
// Svarar rätt på frågan som visas, oavsett typ (flerval, skriva, brickor, självbedömning)
const ans=()=>{ const c=sess.cur, d=sess.d;
  if(c.t==="mc"){ answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return; }
  if(d.render){ d.o.words.forEach(w=>[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w&&!x.disabled).click()); q("#submit").click(); if(sess&&sess.answered) q("#submit").click(); return; }
  q("#ans").value=String(d.answer||"x"); q("#submit").click(); const g=q('[data-gr="right"]'); if(g) g.click(); if(sess&&sess.answered) q("#submit").click(); };
const toQuiz=()=>{ let g=0; while(sess&&!sess.queue&&g++<20) q("#next").click(); };
const runPass=()=>{ toQuiz(); let g=0; while(sess&&g++<120) ans(); };
// Ungefärlig tid per fråga (s), som PASS_T i 90-mix.js
const T={phr:12,cloze:15,gram:15,gen:6,plu:10,verbs:12,dict:25,order:25};
const est=s=>[sess.cur,...sess.queue].reduce((a,c)=>a+(c.k?T[c.k]||15:c.isNew?PASS_T.new:c.t==="type"?PASS_T.type:PASS_T.mc),0);
const noWide=()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1;
appReady().then(async()=>{ try{
  document.documentElement.dataset.theme="light"; renderStart();
  ok("pass: panelen har Starta pass", !!q("#daily")&&q("#daily").textContent.includes("Starta pass")&&!q("#daily-go"));
  ok("pass: inga pass i dag än", passesToday()===0&&!q("#passn").textContent.includes("Pass "), q("#passn").textContent);
  // Pass 1: ett flöde med glosor och andra typer, ungefär fem minuter
  q("#daily").click(); const g1=sess.dp.slice(), nNew=sess.newW.length, nDue=sess.due.length; toQuiz();
  const all=[sess.cur,...sess.queue], ks=new Set(all.map(c=>c.k||"words")), e1=est();
  ok("pass: 15–22 frågor", sess.total>=15&&sess.total<=22, sess.total+" frågor, "+nNew+" nya, "+nDue+" repetitioner");
  ok("pass: ungefär fem minuter", e1>=200&&e1<=360, e1+" s");
  ok("pass: glosorna är med (nya och repetitioner)", nNew>0&&nDue>0&&all.filter(c=>!c.k).length===nNew+nDue);
  ok("pass: blandat med minst två andra typer", ks.size>=3, [...ks].join());
  ok("pass: två grupper", g1.length===2, g1.join());
  ok("pass: glosorna är utspridda i flödet", all.slice(0,Math.ceil(all.length/2)).some(c=>c.k)&&all.slice(Math.ceil(all.length/2)).some(c=>!c.k));
  ok("pass: ett sammanhängande quiz", sess.kind==="words"&&!!q(".meta")&&q(".meta").textContent.includes("Dagens pass"));
  document.body.style.width="320px"; await tick(); ok("pass: ingen horisontell scroll i 320 px (fråga)", noWide()); document.body.style.width="";
  // Avbrutet pass: Tillbaka uppe till vänster pausar, startsidan erbjuder att fortsätta, även efter omladdning
  ans(); ans(); const done=sess.done; q("#topback").click(); await tick();
  ok("pass: Tillbaka uppe pausar och sparar", !sess&&S.runs&&S.runs[PASS_KEY]&&S.runs[PASS_KEY].done===done&&!!S.runs[PASS_KEY].dp, done);
  ok("pass: startsidan erbjuder att fortsätta", !!q("#daily-go")&&!!q("#daily")&&!q("#run-go")&&q(".daily").textContent.includes(done+" av"), q(".daily").textContent.slice(0,200));
  flushLocal(); sess=null; loadState(); rebuildWords(); renderStart();
  ok("pass: finns kvar efter omladdning", !!q("#daily-go"));
  q("#daily-go").click(); ok("pass: fortsätter där det slutade", sess&&sess.done===done&&String(sess.dp)===String(g1)&&sess.queue.some(c=>c.k), sess&&sess.done);
  runPass();
  ok("pass: klart, räknas som pass 1 i dag", !sess&&passesToday()===1&&q("#app").textContent.includes("Pass 1 i dag klart"), q("#app").textContent.slice(0,80));
  ok("pass: ett pass till direkt", !!q("#again"));
  ok("pass: inga påbörjade kvar", !(S.runs||{})[PASS_KEY]&&!S.run);
  { const ps=S.log.filter(e=>e.dp); ok("pass: loggen har dp och samma tid", ps.length>=3&&new Set(ps.map(e=>e.d)).size===1&&ps.some(e=>e.nRep>0)&&ps.some(e=>e.kind||e.verb||e.cloze), JSON.stringify(ps.map(e=>e.kind||(e.verb?"verb":e.cloze?"cloze":"glosor")))); }
  ok("pass: dagens text efter vartannat pass", !!q("#dtext"));
  renderStart(); ok("pass: panelen räknar pass i dag", q("#passn").textContent.includes("Pass 2 i dag")&&q("#passn").textContent.includes("1 pass"), q("#passn").textContent);
  ok("pass: Starta pass finns kvar", !!q("#daily"));
  document.body.style.width="320px"; await tick(); ok("pass: ingen horisontell scroll i 320 px (startsidan)", noWide()); document.body.style.width="";
  // Pass 2: gruppen som inte var med kommer först
  q("#daily").click(); const g2=sess.dp.slice(); const miss=PASS_GROUPS.map(g=>g.id).find(id=>!g1.includes(id));
  ok("pass: rotation mellan pass 1 och 2", g2[0]===miss&&g2.length===2&&String(g2)!==String(g1), g1.join()+" → "+g2.join());
  runPass(); ok("pass: pass 2 i dag", passesToday()===2&&!q("#dtext")&&!!q("#again"));
  q("#again").click(); const g3=sess.dp.slice();
  ok("pass: pass 3 tar det som inte var med i pass 2", !g2.includes(g3[0]), g2.join()+" → "+g3.join());
  // Avbrutet under lärokorten: frågorna som ska blandas in sparas också
  quitSession(); S.newCount=10; startDaily();
  if(sess.newW.length){ q("#next").click(); q("#quit").click(); const r=S.runs[PASS_KEY];
    ok("pass: pausat under lärokorten sparar inblandade frågor", r&&r.learn&&r.mixIn&&r.mixIn.length>0&&r.i===1, r&&JSON.stringify({l:r.learn,m:(r.mixIn||[]).length}));
    renderStart(); ok("pass: panelen visar lärokorten", q(".daily").textContent.includes("du var på ord 2"));
    q("#daily-go").click(); ok("pass: fortsätter på samma lärokort", sess&&!sess.queue&&sess.i===1);
    toQuiz(); ok("pass: quizet får de inblandade frågorna", sess&&sess.queue&&[sess.cur,...sess.queue].some(c=>c.k)); }
  else ok("pass: nya ord finns", false);
  // Starta ett nytt pass när ett är pausat: det gamla slängs
  ans(); q("#quit").click(); const old=S.runs[PASS_KEY].done; renderStart(); q("#daily").click();
  ok("pass: nytt pass ersätter det pausade", old>=1&&sess&&!sess.done&&(S.runs[PASS_KEY].done||0)===0, old); quitSession();
  // Provdatum
  renderStart(); ok("prov: fält för provdatum", !!q("#examdate"));
  const iso=n=>planIso(new Date(planToday().getTime()+n*864e5+36e5));
  const nNew0=passWords().newW.length;
  q("#examdate").value=iso(30); q("#examdate").dispatchEvent(new Event("change"));
  ok("prov: sparas i S", S.examDate===iso(30)&&examDaysLeft()===30, S.examDate+" "+examDaysLeft());
  ok("prov: färre nya ord sex veckor före", passWords().newW.length<nNew0&&passWords().newW.length>0, nNew0+" → "+passWords().newW.length);
  ok("prov: visas i panelen", q("#examnote")&&q("#examnote").textContent.includes("Provet om 30 dagar"));
  { const t=dailyExamTask(); ok("prov: en provuppgift efter passet", !!t&&["mc","match","gaps","short","pick"].includes(exKind(t)), t&&t.id);
    startDaily(); runPass(); ok("prov: knappen efter passet", !!q("#dexam"));
    q("#dexam").click(); await until(()=>!!q("#app")&&!q("#exwait"),8000); ok("prov: uppgiften öppnas (hämtas vid behov)", examReady()&&!!q("#quit"), q("#app").textContent.slice(0,80));
    q("#quit").click(); ok("prov: tillbaka till startsidan", !q("#tabs").hidden&&!!q("#daily")); }
  S.examDate=iso(10); ok("prov: inga nya ord två veckor före", passWords().newW.length===0&&examPhase()===2);
  S.examDate=iso(-3); ok("prov: efter provet som vanligt", examPhase()===0&&passWords().newW.length>=3, passWords().newW.length);
  renderStart(); q("#examdate").value=""; q("#examdate").dispatchEvent(new Event("change")); ok("prov: datumet går att ta bort", !("examDate" in S));
  // Tyska: der/die/das i grammatikgruppen
  useLang("de"); await appReady();
  { const it=PASS_GROUPS.find(g=>g.id==="gram").items(), k=new Set(it.map(c=>c.k));
    ok("tyska: grammatikgruppen har grammatik och der/die/das", k.has("gram")&&k.has("gen")&&it.length===4, [...k].join()); }
  renderStart(); ok("tyska: panelen", !!q("#daily")); startDaily(); runPass(); ok("tyska: ett helt pass", !sess&&passesToday()===1);
  useLang("fr"); await appReady();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

SCENARIO_STREAK = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
appReady().then(async()=>{ try{
  const day=864e5, now=Date.now(), el=()=>q("#streak");
  S.log=[]; renderStart();
  ok("flamma: dold utan svit", el()&&el().hidden);
  S.log=[{kind:"quiz",d:now-2*day,total:5,dur:60},{kind:"quiz",d:now-day,total:5,dur:60}]; renderStart();
  ok("flamma: syns med svit från i går", !el().hidden&&el().textContent.trim()==="2", el().textContent);
  ok("flamma: urblekt när dagens pass inte är gjort", el().classList.contains("cold"));
  S.log.push({kind:"quiz",d:now,total:5,dur:60}); renderStart();
  ok("flamma: tänd efter dagens pass", !el().classList.contains("cold")&&el().textContent.trim()==="3", el().textContent);
  S.log=[{kind:"quiz",d:now-3*day,total:5,dur:60}]; renderStart();
  ok("flamma: bruten svit visas inte", el().hidden);
  document.body.style.width="320px"; renderStart(); S.log.push({kind:"quiz",d:now,total:5,dur:60}); renderStart();
  ok("flamma: ingen horisontell scroll i 320 px", document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# ---------------------------------------------------------------------------------------------------------
# Tidsbaserad repetition i fraser, meningar och grammatik (P3) och de gemensamma hjälpfunktionerna weakestFirst och
# srsBump i 00-common.js (P2), 2026-09-30: poäng {s, last, dd}, förfallna först, sedan nya, sedan resten; gamla poster
# {s, last} utan dd räknas som förfallna; antalet förfallna syns på övningarnas startsida. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_SRS = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
function answerRight(){
  const c=sess.cur, d=sess.d;
  if(c.t==="mc"){ answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return; }
  if(d.render){ d.o.words.forEach(w=>{const b=[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w&&x.tagName==="BUTTON"); if(b) b.click();}); q("#submit").click(); q("#submit").click(); return; }
  q("#ans").value=d.accepted?d.accepted[0]:String(d.answer).replace(/ … /g," "); q("#submit").click();
  if(q("[data-gr]")) q('[data-gr="right"]').click();
  q("#submit").click();
}
const runAll=(n=200)=>{let g=0; while(sess&&sess.cur&&g++<n) answerRight();};
const order=()=>[sess.cur,...sess.queue].map(c=>c.ref);
appReady().then(async()=>{ try{
  const day=864e5, now=Date.now(), past=now-day, future=addDays(now,5), fresh=()=>{S.runs={}; delete S.run; sess=null;};
  // srsBump: steg i dagar som orden (1, 3, 7, 20, 45, 90), fel = s 0 och ingen dd, andra fält lämnas kvar
  { const a=srsBump(undefined,true,now), b=srsBump({s:2,last:1},true,now), c=srsBump({s:5,last:1,dd:future,r:3,n:4},false,now), d=srsBump({s:9},true,now);
    ok("srs: första rätt förfaller om 1 dag", a.s===1&&a.last===now&&a.dd===addDays(now,1), JSON.stringify(a));
    ok("srs: gammal post {s,last} fortsätter (3:e rätt = 7 dagar)", b.s===3&&b.dd===addDays(now,7), JSON.stringify(b));
    ok("srs: fel nollställer och tar bort dd, r och n kvar", c.s===0&&!("dd" in c)&&c.r===3&&c.n===4&&c.last===now, JSON.stringify(c));
    ok("srs: högst 90 dagar", d.dd===addDays(now,90));
    ok("srs: SRS_DAYS som orden i dagar", SRS_DAYS.join()==="1,3,7,20,45,90"&&DAYS.slice(2).join()==="3,7,20,45,90"); }
  ok("srs: förfallen = övad och dd passerad eller saknas", !srsDue(undefined)&&srsDue({s:2,last:1})&&srsDue({s:1,dd:past})&&!srsDue({s:1,dd:future}));
  // weakestFirst: förfallna (svagast först), nya, resten
  { S.zz={a:{s:3,last:5,dd:past},b:{s:0,last:1,dd:future},d:{s:1,last:9}};
    const it=["a","b","c","d"].map(id=>({id})), r=weakestFirst(it,"zz",{due:true}).map(x=>x.id).join("");
    ok("weakestFirst: förfallna, nya, sedan resten", r==="dacb", r);
    const w=weakestFirst(it,"zz").map(x=>x.id).join("");
    ok("weakestFirst: utan due som förut (lägst s, sedan äldst)", w==="cbda"||w==="bcda", w);
    ok("weakestFirst: cap räknar höga steg lika", weakestFirst([{id:"a"},{id:"d"}],"zz",{cap:0}).map(x=>x.id).join("")==="ad");
    delete S.zz; }
  // Fraser: förfallen fras först, sedan nya; ej förfallna sist
  { const ph=C().phrases||[]; ok("fraser finns i kursen", ph.length>=4, ph.length);
    S.ph={}; ph.forEach((p,i)=>{ if(i>0) S.ph[p.id]={s:2,last:now-i,dd:future}; });
    S.ph[ph[3].id]={s:1,last:now-2*day};   // gammal post utan dd = förfallen
    delete S.ph[ph[1].id];                    // ny
    const ids=phraseItems(3).map(x=>x.ref);
    ok("fraser: förfallen först, sedan nya", ids[0]===ph[3].id&&ids.slice(1).includes(ph[0].id)&&ids.slice(1).includes(ph[1].id), ids.join(","));
    ok("fraser: förfallen gammal post skrivs", phraseItems(3).find(x=>x.ref===ph[3].id).t==="type");
    ok("fraser: antal förfallna", phraseDue()===1, phraseDue());
    fresh(); KINDS.phr.open(); const n=Object.keys(S.ph).length; runAll();
    const x=S.ph[ph[3].id];
    ok("fraser: rätt ger dd och högre s", x&&x.s===2&&x.dd===addDays(Date.now(),3), JSON.stringify(x));
    ok("fraser: inga förfallna efter rundan", phraseDue()===0, phraseDue()); }
  // Översätt: förfallna meningar först (sess-ordningen), gamla {s,last} räknas som förfallna
  { fresh(); const pool=transPool(); ok("meningar: poolen finns", pool.length>=8, pool.length);
    S.tr={}; pool.forEach(w=>S.tr[w.id]={s:3,last:now,dd:future});
    const a=pool[pool.length-1].id, b=pool[2].id; S.tr[a]={s:4,last:now-5*day}; S.tr[b]={s:1,last:now-day,dd:past};
    startTrans(); const o=order();
    ok("översätt: de förfallna först, svagast först", o[0]===b&&o[1]===a, o.slice(0,3).join(" | "));
    ok("översätt: antal förfallna", sentDue("tr",transPool())===2);
    fresh(); }
  // Diktamen och ordföljd: nya poster S.dc och S.od skrivs efter rundan
  { delete S.dc; delete S.od; fresh(); startDict(); runAll();
    const dc=S.dc||{}, k=Object.keys(dc);
    ok("diktamen: poäng per mening med dd", k.length>0&&k.every(id=>dc[id].s===1&&dc[id].dd===addDays(Date.now(),1)), JSON.stringify(dc).slice(0,120));
    fresh(); startOrder(); runAll();
    const od=S.od||{};
    ok("ordföljd: poäng per mening med dd", Object.keys(od).length>0&&Object.values(od).every(x=>x.dd>Date.now()), JSON.stringify(od).slice(0,120));
    // Förfallen diktamen kommer med i nästa runda
    const first=k[0]; dc[first].dd=past; fresh(); startDict();
    ok("diktamen: förfallen mening kommer med", order().includes(first));
    fresh(); }
  // Grammatik: förfallna först, gamla {s,last} förfallna, rätt ger dd
  if(hasGrammar()){ const bank=Object.values(gramBank()), tp=bank[0].topic, inT=bank.filter(x=>x.topic===tp);
    S.gi={}; inT.forEach(x=>S.gi[x.id]={s:5,last:now,dd:future}); const d0=inT[inT.length-1].id; S.gi[d0]={s:5,last:now-day};
    ok("grammatik: gammal post först", bankIds(tp,3)[0]===d0, bankIds(tp,3).join(","));
    ok("grammatik: antal förfallna i området", gramDue(tp)===1, gramDue(tp));
    const g=bank.find(x=>x.type==="gap"); gramEffect(g.id,true);
    ok("grammatik: rätt ger dd", S.gi[g.id].dd>Date.now()&&S.gi[g.id].s>=1, JSON.stringify(S.gi[g.id]));
    gramEffect(g.id,false); ok("grammatik: fel = förfallen", srsDue(S.gi[g.id])&&S.gi[g.id].s===0);
    openGrammar(); const b=q("[data-due]");
    ok("grammatik: väljaren visar antal att repetera i dag", b&&+b.dataset.due===gramDue(null)&&/att repetera i dag/.test(b.textContent), b&&b.textContent);
  }
  // Övningarnas startsida: antalet förfallna
  { S.dc={}; const p=dictPool(); S.dc[p[0].id]={s:1,last:now}; S.dc[p[1].id]={s:1,last:now,dd:future};
    S.ph={}; S.tr={}; S.od={}; openExGroup("words");
    const t=(q('[data-ex="dict"]')||{}).textContent||"";
    ok("startsida: diktamen visar 1 att repetera", /1 att repetera i dag/.test(t), t);
    ok("startsida: inget antal när inget är förfallet", !/att repetera/.test(q('[data-ex="trans"]').textContent));
    S.ph={[(C().phrases||[])[0].id]:{s:0,last:now}}; openExGroup("speak");
    ok("startsida: fraser visar antalet", /1 att repetera i dag/.test(q('[data-ex="phr"]').textContent)); }
  // Övriga typer: samma poäng som förut, r och n räknas fortfarande
  { S.sa={x:{s:1,last:1,r:1,n:1}}; satsEffect("x",true); const s=S.sa.x;
    ok("satsanalys: r, n och s räknas", s.s===2&&s.r===2&&s.n===2&&s.last>1, JSON.stringify(s));
    S.te={}; teoriEffect("t1",false); ok("teori: fel ger s 0", S.te.t1.s===0&&S.te.t1.last>0); delete S.sa; delete S.te; }
  renderStart();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# ---------------------------------------------------------------------------------------------------------
# Glosquizet i egen fil och nya ord (backloggen P2, 2026-09-30): glosquizet ligger i src/kinds/05-words.js och
# fungerar som förut; nya ord kommer vanligast först inom avsnittet/kapitlet (L.freq från build.py, word_freq);
# Franska 3 har det publika avsnittet "Vanliga ord" med ord som inte finns i fr, fr1 eller fr2; rätt på flerval räcker
# bara till steg 2 (lär sig), skrivet rätt behövs för "kan", och ord med högre steg sänks inte. Körs på en egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_WORDS = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
appReady().then(async()=>{ try{
  // 1. Glosquizet i 05-words.js: registrerat och spelbart som förut
  ok("glosor: typen words är registrerad", !!(KINDS.words&&KINDS.words.name==="Glosor"&&KINDS.words.mc&&KINDS.words.type)&&!KIND_ERRORS.length, KIND_ERRORS.join());
  ok("glosor: funktionerna finns", ["startSession","renderLearn","qType","startQuiz","mcOptions","memoBox","applyAnswer","tally","finishSession","litHtml"].every(f=>typeof window[f]==="function")
    &&typeof explain==="function"&&typeof studyCard==="function");
  { const n0=S.log.length, p0=S.pass; startSession(pickNew().slice(0,2),dueWords().slice(0,2));
    ok("glosor: lärokortet visas", !!q("#next")&&!!q(".t-big"));
    let g=0; while(sess&&!sess.queue&&g++<10) q("#next").click();
    g=0; while(sess&&sess.cur&&g++<40){ const c=sess.cur;
      if(c.t==="mc") q('[data-i="'+sess.d.opts.findIndex(o=>o.ok)+'"]').click();
      else { q("#ans").value=c.w.t; q("#submit").click(); }
      (q("#nx")||q("#submit")).click(); }
    ok("glosor: passet går att spela klart", !sess&&S.log.length===n0+1&&S.pass===p0+1&&q("#app").textContent.includes("klart"), q("#app").textContent.slice(0,80)); }
  renderStart();
  // 2. Vanligast först: L.freq och ordningen i pickNew
  const fq=L.freq||{};
  ok("vanligast först: L.freq finns i kursens data", Object.keys(fq).length>100, Object.keys(fq).length);
  const src0=S.src, ch0=S.chapter, nc0=S.newCount;
  const sorted=a=>a.every((w,i)=>!i||(fq[a[i-1].id]||0)>=(fq[w.id]||0));
  S.newCount=20; S.chapter="";
  const secs=SECTIONS.filter(s=>s.id!=="mine"&&WORDS.filter(w=>w.sec===s.id&&!isLearned(w)).length>=5);
  const bad=secs.filter(s=>{S.src=s.id; const p=pickNew(); return !p.length||!p.every(w=>w.sec===s.id)||!sorted(p);}).map(s=>s.id);
  ok("vanligast först: inom varje valt avsnitt", secs.length>3&&!bad.length, bad.join());
  S.src="vanliga"; const pv=pickNew();
  ok("vanligast först: de vanligaste orden i Vanliga ord kommer först", pv.length===20&&(fq[pv[0].id]||0)>=Math.max(...WORDS.filter(w=>w.sec==="vanliga"&&!isLearned(w)).map(w=>fq[w.id]||0)), pv.slice(0,5).map(w=>w.id+":"+(fq[w.id]||0)).join());
  S.src="auto"; const pa=pickNew();
  ok("vanligast först: i auto kommer avsnitten fortfarande i ordning", pa.every((w,i)=>!i||SECTIONS.findIndex(s=>s.id===pa[i-1].sec)<=SECTIONS.findIndex(s=>s.id===w.sec)), pa.map(w=>w.sec).join());
  { const k=SECTIONS.find(s=>s.book); if(k){ S.chapter=k.id; const pc=pickNew().filter(w=>w.sec!=="mine");
    const ix=w=>SECTIONS.findIndex(s=>s.id===w.sec), bySec=[...new Set(pc.map(w=>w.sec))].map(s=>pc.filter(w=>w.sec===s));
    ok("vanligast först: kapitlet ni läser kommer först, avsnitt för avsnitt och vanligast först inom avsnittet",
      pc.length&&pc.every(w=>sameChapter(w.sec,k.id))&&pc.every((w,i)=>!i||ix(pc[i-1])<=ix(w))&&bySec.every(sorted), pc.slice(0,4).map(w=>w.id).join()); } }
  S.src=src0; S.chapter=ch0; S.newCount=nc0;
  // 3. Vanliga ord i Franska 3: publikt avsnitt, 80–120 ord, inga dubbletter mot fr, fr1 och fr2
  { const sec=SECTIONS.find(s=>s.id==="vanliga"), vw=WORDS.filter(w=>w.sec==="vanliga");
    ok("vanliga ord: avsnittet finns i Franska 3 och är inte bokens", L.code==="fr"&&!!sec&&sec.name==="Vanliga ord"&&!sec.book);
    ok("vanliga ord: 80–120 ord med exempel och översättning", vw.length>=80&&vw.length<=120&&vw.every(w=>w.sv&&w.exT&&w.exSv&&w.gap), vw.length);
    const other=new Set(["fr1","fr2"].flatMap(c=>INLINE_DATA[c]?parseWords(INLINE_DATA[c].words).words.map(w=>w.id):[]));
    const dup=vw.filter(w=>other.has(w.id)).map(w=>w.id);
    ok("vanliga ord: finns inte i Franska 1 och 2", other.size>500&&!dup.length, dup.join()); }
  // 4. Bara skrivna svar ger "kan": flerval räcker till steg 2
  { const t0=Date.now();
    const a={s:0,due:0}; schedule(a,true,5,t0,"mc"); schedule(a,true,6,t0,"mc"); const a2=a.s; schedule(a,true,7,t0,"mc");
    ok("kan: flerval tar ett ord upp till steg 2 men inte längre", a2===2&&a.s===2&&a.dd===addDays(t0,DAYS[2])&&!a.mp, JSON.stringify(a));
    const b={s:3,due:0}; schedule(b,true,8,t0,"mc");
    ok("kan: rätt flerval sänker inte steg 3", b.s===3&&b.dd===addDays(t0,DAYS[3]), JSON.stringify(b));
    const c={s:5,due:0,mp:2,md:1}; schedule(c,true,9,t0,"mc");
    ok("kan: rätt flerval sänker inte ett ord man redan kan", c.s===5&&c.mp===2, JSON.stringify(c));
    const d={s:2,due:0}; schedule(d,true,10,t0,"type"); schedule(d,true,11,t0,"type");
    ok("kan: skrivet rätt tar ordet till steg 4 (kan)", d.s===4&&d.mp===11, JSON.stringify(d));
    const e={s:4,due:0}; schedule(e,false,12,t0,"mc");
    ok("kan: fel på flerval ger steg 2 som förut", e.s===2&&e.lapses===1); }
  // Hela passet: ett ord på steg 3 rätt med flerval stannar på 3, ett rätt skrivet går till 4
  { const [w1,w2]=WORDS.filter(w=>w.sec!=="mine").slice(-2), p=S.pass;
    S.w[w1.id]={s:3,due:0,f:"mc",lp:1}; S.w[w2.id]={s:3,due:0,f:"type",lp:1};
    startSession([],[w1,w2]); sess.firstTry={[w1.id]:true,[w2.id]:true}; sess.firstType={[w1.id]:"mc",[w2.id]:"type"}; finishSession();
    ok("kan: i passet stannar rätt flerval på steg 3, rätt skrivet blir kan", S.w[w1.id].s===3&&S.w[w2.id].s===4&&S.w[w2.id].mp===p&&S.w[w1.id].f==="type",
      JSON.stringify([S.w[w1.id],S.w[w2.id]]));
    ok("kan: passets slutskärm räknar bara det skrivna ordet som inlärt", q("#app").textContent.includes("1 ord är nu inlärda")); }
  // Förklaringen på startsidan
  S.mode="mix"; renderStart(); ok("kan: förklaring vid Anpassat", !!q("#mc-note")&&q("#mc-note").textContent.includes("skrivit"));
  S.mode="mc"; renderStart(); ok("kan: förklaring vid Flerval", !!q("#mc-note"));
  S.mode="type"; renderStart(); ok("kan: ingen förklaring vid Skriva", !q("#mc-note"));
  S.mode="mix"; save();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Självbedömning i fyra steg och grundformen i Mina ord (backloggen P3, 2026-09-30): efter ett rätt skrivet ord i
# glosquizet väljer eleven Igen/Svårt/Bra/Lätt (S.selfRate, av som standard; tangenterna 1–4, Enter/Nästa = Bra);
# Svårt = samma steg, Lätt = två steg, Igen = fel; flerval räcker fortfarande bara till MC_MAX. Ord utan glosa som
# sparas från en text får grundformen (lemmaOf i 03-lemma.js): fährt → fahren, belles → beau; befintliga Mina ord orörda.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_SELFRATE = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const key=k=>document.body.dispatchEvent(new KeyboardEvent("keydown",{key:k,bubbles:true}));
appReady().then(async()=>{ try{
  // 1. schedule med bedömning
  { const t0=Date.now(), a={s:2,due:0}, b={s:2,due:0}, c={s:2,due:0}, d={s:1,due:0}, e={s:5,due:0,mp:1};
    schedule(a,true,5,t0,"type","hard"); schedule(b,true,5,t0,"type"); schedule(c,true,5,t0,"type","easy"); schedule(d,true,5,t0,"mc","easy"); schedule(e,false,5,t0,"type","easy");
    ok("självbedömning: Svårt stannar på steget (kortare intervall än Bra)", a.s===2&&a.dd===addDays(t0,DAYS[2])&&b.s===3&&a.dd<b.dd, JSON.stringify([a,b]));
    ok("självbedömning: Lätt hoppar ett steg längre och kan ge kan", c.s===4&&c.mp===5&&c.dd===addDays(t0,DAYS[4]), JSON.stringify(c));
    ok("självbedömning: gäller inte flerval (MC_MAX) och inte fel svar", d.s===2&&e.s===2&&e.lapses===1, JSON.stringify([d,e])); }
  // 2. Av som standard: inga knappar, och inställningen finns
  const ws3=WORDS.filter(w=>w.sec!=="mine"&&!/[,=(]/.test(w.t)).slice(-6);
  const play=(ans)=>{ const c=sess.cur; q("#ans").value=ans===false?"zzzq":c.w.t; q("#submit").click(); return c; };
  S.mode="type"; ws3.forEach(w=>S.w[w.id]={s:2,due:0,f:"type",lp:1});
  ok("självbedömning: av som standard", !S.selfRate);
  startSession([],ws3.slice(0,1)); play(); ok("självbedömning: inga knappar när den är av", !q("[data-rate]")&&!!q("#submit"));
  quitSession();
  renderStart(); q("#setd").open=true; const sr=q('[data-sr="1"]');
  ok("självbedömning: valet finns i Fler inställningar", !!sr&&q("#setd").textContent.includes("Bedöm själv hur svårt det var"));
  sr.click(); ok("självbedömning: slås på i inställningarna", S.selfRate===true&&q('[data-sr="1"]').getAttribute("aria-pressed")==="true");
  // 3. Ett pass med bedömningar: 4 = Lätt, Nästa = Bra, 2 = Svårt, 1 = Igen, fel svar = inga knappar
  { const [w1,w2,w3,w4,w5]=ws3, p=S.pass; $("#tabs").hidden=true; beginQuiz("words",[w1,w2,w3,w4,w5].map(w=>({w,isNew:false,t:"type",canType:true})),{newW:[],due:[w1,w2,w3,w4,w5]});
    let c=play(); const btns=[...app.querySelectorAll("[data-rate]")];
    ok("självbedömning: fyra knappar efter rätt skrivet svar, Bra förvald", btns.map(b=>b.textContent).join()==="Igen,Svårt,Bra,Lätt"&&q('[data-rate="good"]').getAttribute("aria-pressed")==="true", btns.map(b=>b.textContent).join());
    ok("självbedömning: Nästa-knappen finns kvar (Enter går vidare)", q("#submit").textContent==="Nästa"&&document.activeElement===q("#submit"));
    key("4"); ok("självbedömning: tangenten 4 = Lätt och går vidare", sess.rate[c.w.id]==="easy"&&sess.cur.w.id!==c.w.id);
    c=play(); q("#submit").click(); ok("självbedömning: Nästa = Bra (inget sparat)", !(c.w.id in sess.rate));
    c=play(); key("2"); ok("självbedömning: tangenten 2 = Svårt", sess.rate[c.w.id]==="hard"&&S.run.rate&&S.run.rate[c.w.id]==="hard", JSON.stringify(S.run.rate));
    // återuppta: bedömningarna följer med
    const r0=JSON.stringify(sess.rate); resumeRun(); ok("självbedömning: sparas i S.run och följer med när passet fortsätts", JSON.stringify(sess.rate)===r0, r0);
    c=play(); key("1");
    ok("självbedömning: Igen räknas som fel och kommer tillbaka som flerval", sess.firstTry[c.w.id]===false&&sess.rate[c.w.id]==="again"&&[sess.cur,...sess.queue].some(x=>x.w.id===c.w.id&&x.t==="mc"&&x.again));
    const cw=play(false); ok("självbedömning: inga knappar efter fel svar (Igen)", !q("[data-rate]")&&sess.firstTry[cw.w.id]===false);
    q("#submit").click();
    let g=0; while(sess&&sess.cur&&g++<20){ if(sess.cur.t==="mc"){ q('[data-i="'+sess.d.opts.findIndex(o=>o.ok)+'"]').click(); ok("självbedömning: inga knappar på flerval", !q("[data-rate]")); q("#nx").click(); } else { play(); q("#submit").click(); } }
    const s=id=>S.w[id].s;
    ok("självbedömning: schemat efter passet (Lätt 4, Bra 3, Svårt 2, Igen och fel 1)", !sess&&s(w1.id)===4&&s(w2.id)===3&&s(w3.id)===2&&s(w4.id)===1&&s(w5.id)===1&&S.w[w1.id].mp===p,
      [w1,w2,w3,w4,w5].map(w=>s(w.id)).join()); }
  // 4. Extraövning och nya ord
  { const [w1]=ws3; beginQuiz("words",[{w:w1,isNew:false,t:"type",canType:true}],{newW:[],due:[w1],extra:true}); play();
    ok("självbedömning: inga knappar i extraövningen", !q("[data-rate]")); quitSession();
    const nw=WORDS.find(w=>w.sec!=="mine"&&!isLearned(w)&&!/[,=(]/.test(w.t)), p=S.pass;
    beginQuiz("words",[{w:nw,isNew:true,t:"type",canType:true}],{newW:[nw],due:[]}); play(); key("4"); if(sess&&sess.cur) q("#submit").click();
    ok("självbedömning: Lätt på ett nytt ord hoppar över nästa pass", S.w[nw.id]&&S.w[nw.id].s===1&&S.w[nw.id].due===p+INT[1], JSON.stringify(S.w[nw.id])); }
  S.selfRate=false; S.mode="mix"; save();
  // 5. Grundform: tyska
  useLang("de");
  const L1=t=>(lemmaOf(t)||{}).t;
  ok("grundform: fährt → fahren, fuhr → fahren (verbtabellerna)", L1("fährt")==="fahren"&&L1("fuhr")==="fahren", L1("fährt")+" "+L1("fuhr"));
  { const z=WORDS.find(w=>w.t==="der Zaun (Zäune)"), um=WORDS.find(w=>/^der Umweg/.test(w.t)), pe=WORDS.find(w=>/^der Pendler/.test(w.t));
    ok("grundform: tysk plural ur ordlistan (Zäune, Umwege, Pendlern)", (!z||L1("Zäune")===z.t)&&(!um||L1("Umwege")===um.t)&&(!pe||L1("Pendlern")===pe.t)&&(z||um||pe), [L1("Zäune"),L1("Umwege"),L1("Pendlern")].join()); }
  { const v=WORDS.find(w=>w.t==="streiken"), a=WORDS.find(w=>w.t==="riskant");
    ok("grundform: tyska ändelser (streikten, riskanten, gestreikt)", (!v||L1("streikten")==="streiken"&&L1("gestreikt")==="streiken")&&(!a||L1("riskanten")==="riskant")&&(v||a), [L1("streikten"),L1("gestreikt"),L1("riskanten")].join()); }
  ok("grundform: okända ord ger null, liten bokstav är inget substantiv (gefahren)", lemmaOf("xqzwkrt")===null&&lemmaOf("")===null&&L1("gefahren")==="fahren", L1("gefahren"));
  // Spara från en text: ett verb som bara finns i verbtabellerna
  { const pr=L.verbs.tenses["Präsens"], inf=Object.keys(pr).find(v=>!WORDS.some(w=>variants(w.t).includes(v))&&pr[v][2]&&!/\s|\//.test(pr[v][2])&&pr[v][2].toLowerCase()!==v);
    const form=pr[inf][2], old={t:"xoldform",sv:"gammalt",g:"",ex:"Ein [xoldform] hier.",exSv:"",src:"T"};
    S.mine=[old]; S.w["mine:xoldform"]={s:3,due:9,f:"type",lp:2}; rebuildWords();
    const text={title:"Testtext",lines:[{fr:"Er "+form+" heute.",sv:"Han … i dag."}],gloss:{heute:{t:"heute",sv:"i dag"}}};
    app.innerHTML=`<section class="panel">${tapText(text.lines,text.gloss)}<div id="gbox" hidden></div></section>`; wireGloss(text);
    [...app.querySelectorAll(".tw")].find(x=>x.textContent===form).click();
    const li=q(".picked li");
    ok("grundform: listan visar den böjda formen och (av grundformen)", !!li&&li.textContent.includes(form)&&li.textContent.includes("(av "+inf+")")&&q("[data-sv]").value===(L.verbs.sv[inf]||""), li&&li.textContent.replace(/\s+/g," "));
    if(!q("[data-sv]").value) q("[data-sv]").value="x", q("[data-sv]").dispatchEvent(new Event("input"));
    q("#addsel").click(); const m=S.mine[S.mine.length-1];
    ok("grundform: sparas i grundform med form", m.t===inf&&m.form===form&&m.ex.includes("["+form+"]")&&!!byId["mine:"+inf]&&byId["mine:"+inf].ety.includes(form), JSON.stringify(m));
    ok("grundform: befintliga Mina ord och deras framsteg är orörda", S.mine[0].t==="xoldform"&&!S.mine[0].form&&S.w["mine:xoldform"].s===3&&!!byId["mine:xoldform"]);
    // ett ord i ordlistan: visas som (av …) och läggs inte till en gång till
    const um=WORDS.find(w=>w.t==="der Zaun (Zäune)");
    if(um){ const t2={title:"T2",lines:[{fr:"Die Zäune sind hoch.",sv:""}],gloss:{hoch:{t:"hoch",sv:"hög"}}};
      app.innerHTML=`<section class="panel">${tapText(t2.lines,t2.gloss)}<div id="gbox" hidden></div></section>`; wireGloss(t2);
      [...app.querySelectorAll(".tw")].find(x=>x.textContent==="Zäune").click();
      ok("grundform: böjd form av ett ord i ordlistan känns igen", q(".picked li").textContent.includes("(av der Zaun (Zäune))")&&!!q(".pst")&&q("#addsel").disabled, q(".picked li").textContent.replace(/\s+/g," ")); }
    S.mine=[]; delete S.w["mine:xoldform"]; delete S.w["mine:"+inf]; rebuildWords(); save(); }
  // 6. Grundform: franska, verbtabellerna och kedjan (Franska 1 hämtad)
  useLang("fr");
  ok("grundform: finissons → finir, parlaient → parler", L1("finissons")==="finir"&&L1("parlaient")==="parler", L1("finissons")+" "+L1("parlaient"));
  useLang("fr1"); ok("grundform: belles → beau, belle (Franska 1)", L1("belles")==="beau, belle"&&L1("bel")==="beau, belle", L1("belles"));
  useLang("fr"); { const cw=parseWords(LANGUAGES.fr1.words).words.find(w=>/^[a-zàâçéèêëîïôûù]{5,}$/.test(w.t)&&!/[sxe]$/.test(w.t)&&!WORDS.some(x=>variants(x.t).includes(w.t)));
    ok("grundform: kedjan: ord ur en hämtad kurs i samma språk (Franska 1 i Franska 3)", !!cw&&L1(cw.t+"s")===cw.t&&L1("belles").startsWith("beau"), cw&&cw.t+" "+L1(cw.t+"s")); }
  useLang("it1"); { const w=WORDS.find(x=>/^[a-z]+o$/.test(x.t)&&x.g==="m");
    ok("grundform: italienska plural (…o → …i)", !w||L1(w.t.slice(0,-1)+"i")===w.t, w&&w.t+" "+L1(w.t.slice(0,-1)+"i")); }
  // Regression: formen själv vinner om den finns i ordlistan (med eller utan artikel), och l'été blir aldrig être
  useLang("it3"); ok("grundform: verso finns i ordlistan och förblir verso (inte versare)", WORDS.some(w=>w.t==="verso")&&L1("verso")==="verso", L1("verso"));
  useLang("fr1"); ok("grundform: été och l'été → l'été i Franska 1 (inte être)", L1("été")==="l'été"&&L1("l'été")==="l'été", L1("été")+" "+L1("l'été"));
  useLang("fr"); ok("grundform: l'été blir aldrig être (Franska 3), en artikel utesluter verbtabellerna", L1("l'été")!=="être"&&L1("l'parlé")!=="parler"&&L1("parlé")==="parler", L1("l'été")+" "+L1("l'parlé"));
  { const text={title:"Été",lines:[{fr:"Pendant l'été, il fait chaud.",sv:""}],gloss:{chaud:{t:"chaud",sv:"varm"}}};
    app.innerHTML=`<section class="panel">${tapText(text.lines,text.gloss)}<div id="gbox" hidden></div></section>`; wireGloss(text);
    [...app.querySelectorAll(".tw")].find(x=>x.textContent==="l'été").click();
    ok("grundform: l'été i en text visas inte som (av être)", !q(".picked li").textContent.includes("être"), q(".picked li").textContent.replace(/\s+/g," ")); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def test_words_build():
    """build.py: word_freq räknar grundformen i kursens texter; glosquizet ligger i 05-words.js, inte i app.js."""
    sys.path.insert(0, str(ROOT))
    from build import word_freq
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    words = "#a|A\nla vie|livet|f|La [vie] est belle.|x|y\nse lever|stiga upp||Je me lève.|x|y\ninfirmier, infirmière|x|m|Elle est infirmière.|x|y\nce qui me plaît, c'est|x||Ce qui me plaît, c'est la vie.|x|y\ndas Es|x|n|Es ist spät.|x|y\nrare|x||Rien.|x|y"
    content = {"reading": [{"lines": [{"fr": "La vie, la vie ! Il faut se lever."}], "gloss": {"lève": {"t": "se lever"}}}],
               "tatoeba": {"vie": [{"t": "vie vie vie vie"}]}, "stories": [{"text": "Une infirmière [vit|vie]."}]}
    f = word_freq(words, content)
    ok("vanligast först: word_freq räknar ord utan artikel och reflexivt pronomen", f.get("la vie") == 5 and f.get("se lever") == 2, f)
    ok("vanligast först: former med komma räknas var för sig, fraser med komma som en fras", f.get("infirmier, infirmière") == 2 and f.get("ce qui me plaît, c'est") == 1, f)
    ok("vanligast först: stor bokstav räknas bara med stor bokstav, ord som inte förekommer saknas", f.get("das Es") == 1 and "rare" not in f, f)
    app = (ROOT / "src" / "app.js").read_text(encoding="utf-8")
    words_js = (ROOT / "src" / "kinds" / "05-words.js").read_text(encoding="utf-8")
    moved = ["function renderLearn", "function qType", "function startQuiz", "function mcOptions", "const explain=", "const studyCard=",
             "function memoBox", 'defineKind("words"', "function applyAnswer", "function tally", "function finishSession"]
    ok("glosor: glosquizet ligger i src/kinds/05-words.js och inte i app.js", all(m in words_js and m not in app for m in moved),
       [m for m in moved if m in app or m not in words_js])
    return "\n".join(out)


SCENARIO_BUGHUNT = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const key=k=>document.body.dispatchEvent(new KeyboardEvent("keydown",{key:k,bubbles:true,cancelable:true}));
appReady().then(async()=>{ try{
  // 1. Översätt meningar (självbedömning): Enter i den låsta textrutan hoppade över frågan utan att den räknades
  startTrans(); const c0=sess.cur, d0=sess.done;
  q("#ans").value="xyz qqq zzz"; q("#submit").click();
  ok("självbedömning: Fel/Nästan/Rätt visas", !!q("[data-gr]"));
  q("#f").dispatchEvent(new Event("submit",{cancelable:true}));
  ok("självbedömning: Enter hoppar inte över frågan", sess&&sess.cur===c0&&sess.done===d0&&!!q("[data-gr]"));
  ok("självbedömning: textrutan släpper fokus så att siffrorna fungerar", document.activeElement!==q("#ans"));
  key("3");
  ok("självbedömning: 3 = Rätt räknas", sess&&sess.firstTry[c0.id]===true&&sess.done===d0+1, JSON.stringify(sess&&sess.firstTry));
  q("#submit").click(); ok("självbedömning: Nästa går vidare efteråt", sess&&sess.cur!==c0);
  pauseSession();
  // 2. Avbryt i ordföljd och skugga sparade inte rundan (quitSession i stället för pauseSession)
  startOrder(); ok("ordföljd: rundan startar", !!q("#tiles")); q("#quit").click();
  ok("ordföljd: Avbryt sparar rundan", !!(S.runs&&S.runs.order), JSON.stringify(Object.keys(S.runs||{})));
  startShadow(); ok("skugga: rundan startar", !!q("[data-sh]")); q("#quit").click();
  ok("skugga: Avbryt sparar rundan", !!(S.runs&&S.runs.shadow), JSON.stringify(Object.keys(S.runs||{})));
  // 3. Lyssna först: mellanslag och Enter visar ordet
  S.listenFirst=true; startSession([WORDS[0]],[]); ok("lyssna först: ordet är dolt", !!q("#show")&&!q("#next"));
  key(" "); ok("lyssna först: mellanslag visar ordet", !!q("#next"));
  sess.i=0; sess.shown={}; renderLearn(); key("Enter"); ok("lyssna först: Enter visar ordet", !!q("#next"));
  S.listenFirst=false; pauseSession();
  // 4. Tom runda (t.ex. diktamen utan meningar): vänligt meddelande i stället för "0/0 klar"
  const n0=S.log.length; beginQuiz("dict",[],{againFn:["dict"],label:"Diktamen"});
  ok("tom runda: meddelande, ingen 0/0", !!q("#empty")&&!q("#app").textContent.includes("0/0")&&!sess&&S.log.length===n0);
  q("#quit").click(); ok("tom runda: Tillbaka till startsidan", !!q("#src"));
  // 5. Gamla molndokument {state, t} utan t: lägets egen t används
  ok("molnet: t för gamla dokument", docT({state:{t:5}})===5&&docT({t:7,state:{t:5}})===7&&docT({parts:{},t:9,state:{t:1}})===9);
  // 6. Molnet i trasigt läge: en bit har en annan rev än huvuddokumentet (en enhet skrev biten men inte huvuddokumentet)
  { const K="data/users/u_test/"+L.storageKey; await appReady();
    const h=JSON.parse(JSON.stringify(__remote[K])), wn=Object.keys(h.parts).find(n=>/^w\d+$/.test(n));
    const localWords=Object.keys(S.w).length, lp=S.pass;
    h.head.pass=lp+10; h.score[0]=lp+10; h.t=Date.now()+1000; h.parts[wn]="annan-rev"; __remote[K]=h;
    for(let i=0;i<3;i++) await cloudAttach();
    await until(()=>{const d=__remote[K]; return d&&d.parts&&__remote[K+"~"+wn]&&__remote[K+"~"+wn].rev===d.parts[wn];},8000);
    const d=__remote[K];
    ok("trasigt moln: läget lagas och tas emot efter tre försök", S.pass===lp+10&&CLOUD.ready, S.pass+" "+lp);
    ok("trasigt moln: inga ord försvinner", Object.keys(S.w).length>=localWords, Object.keys(S.w).length+" "+localWords);
    ok("trasigt moln: alla bitar skrivs om och stämmer igen", !!d&&d.parts[wn]!=="annan-rev"&&Object.keys(d.parts).every(n=>__remote[K+"~"+n]&&__remote[K+"~"+n].rev===d.parts[n])&&d.head.pass===lp+10); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Nivåstyrd bedömning (2026-09-29): Claudes bedömningsprompt i provträningen (examPrompt, 70-exam.js) och för
# skrivuppgifter (feedbackPrompt, 00-common.js) följer uppgiftens/provets/kursens nivå (A1–C1), elevbeskrivningen
# byggs av kursen, och musikmålet nämns bara när lang.js har fältet goal. Korta A1-uppgifter (formulär) går att skicka.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_LEVELPROMPT = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
appReady().then(async()=>{ try{
  const codes=testCourses(), lvOf=c=>cefrOf(LANGUAGES[c].exam&&LANGUAGES[c].exam.level)||cefrOf(LANGUAGES[c].level,true);
  // A1-kurs: helst en med nivå A1 och provträning (Franska 1), annars en med provet på A1
  const a1=codes.filter(c=>lvOf(c)==="A1").sort((x,y)=>(LANGUAGES[y].level==="A1")-(LANGUAGES[x].level==="A1")||(y==="fr1")-(x==="fr1"))[0], b2=codes.find(c=>lvOf(c)==="B2"&&LANGUAGES[c].goal), nogoal=a1&&!LANGUAGES[a1].goal?a1:codes.find(c=>!LANGUAGES[c].goal);
  ok("det finns en A1-kurs och en B2-kurs att testa", !!a1&&!!b2, a1+" "+b2);
  const prompts=async c=>{ useLang(c); await until(()=>L.code===c&&L.base&&!sess,8000);
    const t=hasExam()&&EX().tasks.find(x=>exKind(x)==="write");
    return {fb:feedbackPrompt("Écris un texte.","Bonjour je m'appelle Anna."), ex:t?examPrompt(t,"Bonjour je m'appelle Anna.",false):null, t}; };
  if(a1){ const r=await prompts(a1);
    ok(a1+": skrivprompten gäller kursens nivå", r.fb.includes("förväntas på nivå "+cefrOf(L.level,true))&&/^A/.test(cefrOf(L.level,true))&&r.fb.includes(LEVEL_GUIDE[cefrOf(L.level,true)]), r.fb.slice(0,200));
    ok(a1+": elevbeskrivningen är generell", r.fb.includes("svensk elev som läser "+L.course)&&!/gymnasieelev som ska söka/.test(r.fb));
    if(r.ex){ ok(a1+": provprompten bedömer mot A1", r.ex.includes("helt på A1-nivå")&&!r.ex.includes("B1-nivå"), r.ex.slice(-400));
      ok(a1+": provprompten har A1-kriterier", r.ex.includes("A1: korta, enkla texter")); }
    // Kort A1-uppgift (formulär): färre än 15 ord räcker för att skicka in
    const f=hasExam()&&EX().tasks.filter(x=>exKind(x)==="write").sort((x,y)=>x.minWords-y.minWords)[0];
    if(f&&f.minWords<30){ const keep=SAMPLE; let called=0; SAMPLE={json:async()=>{called++; return {kriterier:[{namn:"A",poang:3}],helhet:"Bra."};}};
      examWrite(f); q("#xtext").value="Nom : Svensson. Prénom : Anna. Âge : 15 ans. Pays : Suède."; q("#exdone").click();
      await until(()=>called,3000); ok(a1+": formulär med 12 ord skickas till bedömning", called===1, q("#exres").textContent.slice(0,120));
      SAMPLE=keep; openExam(); } }
  if(nogoal){ const r=await prompts(nogoal);
    ok(nogoal+": ingen musikmening utan goal", !/musik/i.test(r.fb)&&!(r.ex&&/musik/i.test(r.ex)), (r.fb.match(/.{0,60}musik.{0,60}/i)||[""])[0]); }
  if(b2){ const r=await prompts(b2);
    ok(b2+": skrivprompten har kursens elevbeskrivning och mål", r.fb.includes(L.course)&&r.fb.includes(L.goal));
    if(r.ex){ ok(b2+": provprompten bedömer mot B2", r.ex.includes("helt på B2-nivå")&&r.ex.includes("B2: tydlig, detaljerad text"), r.ex.slice(-300));
      ok(b2+": provprompten nämner målet", /musik/.test(r.ex)); } }
  ok("nivå ur text", cefrOf("A1 → A2",true)==="A2"&&cefrOf("CELI 1 (A2)")==="A2"&&cefrOf("Goethe-Zertifikat A1: Start Deutsch 1")==="A1"&&cefrOf("")===null);
  ok("ordgräns för kommentarer", minForFeedback(15)===8&&minForFeedback(40)===15&&minForFeedback(160)===15&&minForFeedback()===15&&minForFeedback(6)===5);
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Tala (src/kinds/45-tala.js, P2: Ny övning Tala och Muntlig förberedelse): 4/3/2 med klocka och ord per minut,
# Claudes kommentarer efter varje runda (med en fejkad sample), samtal med Claude, utan sample, Skugga under Tala.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_TALK = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const words=n=>Array.from({length:n},(_,i)=>["je","joue","du","piano","depuis","dix","ans","et","j'aime","la","musique"][i%11]).join(" ");
const say=(sel,t)=>{ const el=q(sel); el.value=t; el.dispatchEvent(new Event("input")); };
appReady().then(async()=>{ try{
  const prompts=[]; let mode="ok";
  const fake={json:async(p,o)=>{ prompts.push(p); if(mode==="fail") throw {code:"rate_limited"};
    if(p.includes("Börja samtalet")) return {svar:"Bonjour ! Tu joues de quel instrument ?"};
    if(p.includes("sista svar")) return {svar:"Merci, au revoir !",helhet:"Bra samtal.",bra:["Tydliga svar"],fel:[{citat:"le piano",rattat:"du piano",varfor:"jouer de"}],nasta:"Fler bindeord",niva:"A2"};
    if(p.includes("samtalspartner")) return {svar:"Super ! Et depuis quand ?",fel_nu:[{citat:"je joue le piano",rattat:"je joue du piano",varfor:"jouer de + instrument"}]};
    return {helhet:"Bra runda.",bra:["Tydligt"],fel:[],flyt:"Lugnt tempo.",nasta:"Säg mer.",niva:"A2"}; }};
  const keep=SAMPLE; SAMPLE=fake;
  // Menyn: Tala finns under Tala och skriva, Skugga har flyttats in i Tala (samma typ "shadow")
  const grp=exGroups().find(g=>g.id==="speak"), ids=grp.items.map(h=>(h.match(/data-ex="(\w+)"/)||[])[1]);
  ok("tala: knappen finns under Tala och skriva", ids.includes("talk")&&KINDS.talk.name==="Tala", ids.join());
  ok("tala: Skugga finns inte längre direkt i menyn", !exGroups().some(g=>g.items.some(h=>h.includes('data-ex="shadow"'))));
  openExGroup("speak"); q('[data-ex="talk"]').click();
  const ts=talkTopics(), nsp=EX().tasks.filter(t=>exKind(t)==="speak").length;
  ok("tala: ämnen från provets taluppgifter och skrivuppgifterna", ts.filter(t=>t.grp==="exam").length===nsp&&nsp>0&&ts.filter(t=>t.grp==="write").length===(C().prompts||[]).length, nsp+" tal, "+ts.length+" ämnen");
  ok("tala: muntlig förberedelse (goal) med presentation och samtal", !!L.goal&&ts[0].id==="me"&&!!q('[data-talk="me"]')&&!!q('[data-chat="me"]')&&q("#app").textContent.includes("Presentera dig själv och din musik"));
  ok("tala: alla val är knappar (tangentbord)", [...document.querySelectorAll("[data-talk],[data-chat],[data-ex]")].every(b=>b.tagName==="BUTTON"));
  q('[data-ex="shadow"]').click(); ok("tala: Skugga startar från Tala", !!q("[data-sh]")&&sess&&sess.kind==="shadow"); pauseSession(); sess=null;

  // 4/3/2 med kursens nivå (Franska 3 = A2: 2, 1,5 och 1 minut)
  openTalk(); q('[data-talk="me"]').click();
  ok("tala: A2 ger 2/1,5/1 minuter", q("#tclock").textContent==="2:00"&&TALK.mins.join()==="2,1.5,1", q("#tclock").textContent);
  ok("tala: instruktion för diktering på iPad och telefon", /mikrofonen/.test(q(".howto").textContent)&&/iPad/.test(q(".howto").textContent)&&/Android/.test(q(".howto").textContent));
  q("#tdone").click(); ok("tala: tom runda sparas inte", !S.talk||!S.talk.t||!S.talk.t.me);
  const n0=S.log.length; q("#tstart").click(); ok("tala: klockan går", !!TALK.t0&&q("#tstart").hidden);
  say("#ttext",words(30)); TALK.t0-=30000; q("#tdone").click();
  let e=S.log[S.log.length-1];
  ok("tala: runda 1 ger ord per minut och loggpost", S.log.length===n0+1&&e.kind==="talk"&&e.rounds===1&&e.words===30&&S.talk.t.me.wpm.length===1&&Math.abs(S.talk.t.me.wpm[0]-60)<=2&&q("#twpm").textContent==S.talk.t.me.wpm[0], JSON.stringify(e)+" "+JSON.stringify(S.talk.t.me));
  await until(()=>q("#tfb")&&q("#tfb").textContent.includes("Flyt"),3000);
  const p1=prompts[prompts.length-1];
  ok("tala: Claude kommenterar rundan (flyt, fel, nivå)", q("#tfb").textContent.includes("Lugnt tempo")&&q("#tfb").textContent.includes("Bra runda")&&S.fb["tt:me"].r===1,q("#tfb").textContent.slice(0,100));
  ok("tala: prompten gäller transkription, inte uttal, och har ord per minut", /transkription/.test(p1)&&/Uttalet går inte att bedöma/.test(p1)&&/ord per minut/.test(p1)&&p1.includes(words(30))&&p1.includes("runda 1 av 3"));
  ok("tala: prompten är nivåstyrd med kursens elevbeskrivning och mål", p1.includes("nivå A2")&&p1.includes(LEVEL_GUIDE.A2)&&p1.includes(studentDesc())&&p1.includes(L.goal));
  q("#tnext").click();
  ok("tala: runda 2 är kortare och visar förra rundan", q("#tclock").textContent==="1:30"&&q("#app").textContent.includes("Det du sa i runda 1"), q("#tclock").textContent);
  say("#ttext",words(36)); TALK.t0-=60000; q("#tdone").click();
  e=S.log[S.log.length-1];
  ok("tala: samma loggpost uppdateras", S.log.length===n0+1&&e.rounds===2&&e.words===66&&S.talk.t.me.wpm.length===2, JSON.stringify(e));
  await until(()=>prompts.length>=2,3000); ok("tala: prompten i runda 2 jämför med förra rundan", /Förra rundan: \d+ ord per minut/.test(prompts[prompts.length-1]));
  q("#tnext").click(); ok("tala: runda 3 är 1 minut", q("#tclock").textContent==="1:00");
  // Tiden tar slut: ord som kommer efteråt räknas inte i ord per minut
  q("#tstart").click(); say("#ttext",words(20)); TALK.t0-=70000;
  await until(()=>q("#tclock").classList.contains("over"),2000);
  ok("tala: klockan visar att tiden är slut", q("#tclock").textContent==="Tiden är slut", q("#tclock").textContent);
  say("#ttext",words(50)); q("#tdone").click();
  ok("tala: ord efter tiden räknas inte", S.talk.t.me.wpm[2]===20&&TALK.words[2]===20&&S.talk.t.me.wpm.length===3&&S.talk.t.me.n===1&&!!q("#tagain"), JSON.stringify(S.talk.t.me));
  ok("tala: tabell med alla tre rundor", document.querySelectorAll("#app .tbl tr").length===4);
  statsExercises(); ok("tala: statistiken visar talet", statsExercises().includes("Du har talat 1 gång")&&!/Tala · /.test(statsExercises()));
  q("#tagain").click(); ok("tala: samma ämne igen börjar på runda 1", q("#tclock").textContent==="2:00"&&TALK.r===0);
  // 320 px
  document.documentElement.style.width="320px"; say("#ttext",words(3));
  ok("tala: ryms på 320 px", q("#app").scrollWidth<=q("#app").clientWidth+1, q("#app").scrollWidth+" > "+q("#app").clientWidth);

  // Samtal med Claude: 6 svar, följdfrågor, rättelser och sammanfattning
  const c0=S.log.length; talkChat("me");
  await until(()=>CHAT&&CHAT.msgs.length===1&&!CHAT.ctl,3000);
  ok("samtal: Claude börjar på målspråket", CHAT.msgs[0].text.startsWith("Bonjour")&&q("#chat").textContent.includes("Bonjour")&&!!q('#chat [data-say]'));
  for(let i=0;i<6;i++){ say("#cin","Je joue le piano depuis "+(i+2)+" ans et j'aime beaucoup la musique classique.");
    if(i===0){ q("#cin").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true})); } else q("#csend").click();
    await until(()=>CHAT&&!CHAT.ctl&&CHAT.msgs.length===2*i+3,3000); }
  const pc=prompts.filter(p=>p.includes("samtalspartner")), last=pc[pc.length-1];
  ok("samtal: 6 svar och 7 repliker från Claude", CHAT.msgs.filter(m=>m.who==="e").length===6&&CHAT.msgs.filter(m=>m.who==="c").length===7&&CHAT.done, CHAT.msgs.length);
  ok("samtal: Enter skickar", CHAT.msgs[1].who==="e");
  ok("samtal: följdfrågan har elevens svar i prompten", pc[2].includes("E: Je joue le piano depuis 2 ans")&&pc[2].includes("följdfråga")&&pc[2].includes("Elevens nivå: A2"));
  ok("samtal: rättelser under elevens svar", document.querySelectorAll("#chat .fbfel li").length>=5&&q("#chat").textContent.includes("je joue du piano"));
  ok("samtal: sammanfattning efter sista svaret", last.includes("sista svar")&&q("#cfb").textContent.includes("Bra samtal")&&q("#csend").disabled&&!!q("#cagain"));
  e=S.log[S.log.length-1];
  ok("samtal: sparas i S.talk och loggen", S.talk.c.me.n===1&&S.log.length===c0+1&&e.kind==="talk"&&e.chat===1&&e.words>60&&S.fb["tc:me"].helhet==="Bra samtal."&&!S.fb["c:me"],JSON.stringify(e));
  ok("samtal: ryms på 320 px", q("#app").scrollWidth<=q("#app").clientWidth+1, q("#app").scrollWidth+" > "+q("#app").clientWidth);
  document.documentElement.style.width="";
  // Fel från Claude: elevens svar läggs tillbaka i fältet
  talkChat("x:"+EX().tasks.find(t=>exKind(t)==="speak").id); await until(()=>CHAT&&CHAT.msgs.length===1&&!CHAT.ctl,3000);
  mode="fail"; say("#cin","Bonjour, je suis prêt."); q("#csend").click(); await until(()=>CHAT&&!CHAT.ctl,3000);
  ok("samtal: vid fel kommer svaret tillbaka", q("#cin").value==="Bonjour, je suis prêt."&&CHAT.msgs.length===1&&/gräns/.test(q("#cmsg").textContent), q("#cmsg").textContent);
  mode="ok";
  ok("samtal: provuppgiften har provets nivå", prompts[prompts.length-1].includes("Elevens nivå: "+examLevel(EX().tasks.find(t=>exKind(t)==="speak"))));

  // Utan sample: klockan och ord per minut fungerar, men inga kommentarer och inget samtal
  SAMPLE=null; const np=prompts.length;
  talkRound("me",0); say("#ttext",words(20)); TALK.t0-=60000; q("#tdone").click();
  ok("utan sample: ord per minut utan kommentarer", q("#twpm").textContent==="20"&&/claude\.ai/.test(q("#tfb").textContent)&&prompts.length===np, q("#tfb").textContent);
  talkChat("me"); ok("utan sample: samtalet förklarar och går inte att skicka", q("#csend").disabled&&/claude\.ai/.test(q("#cmsg").textContent));
  SAMPLE=fake;
  openTalk(); q("#quit").click(); ok("tala: Tillbaka stänger", !TALK&&!CHAT);

  // B1-kurs (Tyska 5): 4/3/2 minuter, utan goal-ämne i en kurs utan mål
  useLang("de"); await until(()=>L.code==="de"&&L.base&&!sess,8000);
  openTalk(); const t0=talkTopics()[0]; q('[data-talk="'+t0.id+'"]').click();
  ok("de: B1 ger 4/3/2 minuter", talkLow(t0.lv)||q("#tclock").textContent==="4:00", t0.id+" "+t0.lv+" "+q("#tclock").textContent);
  const nogoal=testCourses().find(c=>!LANGUAGES[c].goal);
  if(nogoal){ useLang(nogoal); await until(()=>L.code===nogoal&&L.base&&!sess,8000);
    ok(nogoal+": inget presentationsämne utan goal, men minst tre ämnen", !talkTopics().some(t=>t.id==="me")&&talkTopics().length>=3);
    openTalk(); ok(nogoal+": Tala öppnas", !!q("[data-talk]")&&!q('[data-chat="me"]'));
    const a1=talkTopics().find(t=>talkLow(t.lv)); if(a1){ talkRound(a1.id,0); ok(nogoal+": A-nivå ger kortare rundor", q("#tclock").textContent==="2:00"); } }
  SAMPLE=keep;
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Byggkontroller (arkitekturgranskning 2026-09-29): bygget går igenom utan den privata bokmappen, och stoppar när en
# grammatikfråga pekar på ett område eller en regel som inte finns i grammar.json, när en regel i regler.json saknar
# område, när inherit nämner ett fält som föräldern inte har och när nextCourse pekar på en kurs som inte finns.
# ---------------------------------------------------------------------------------------------------------
def test_build_checks():
    import json, shutil
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp) / "g"
        shutil.copytree(ROOT, t, ignore=shutil.ignore_patterns(".git", "dist", "book", "*.jpg", "*.jpeg", "*.png", "*.heic", "*.pdf"))
        build = lambda: subprocess.run([sys.executable, str(t / "build.py")], capture_output=True, text=True)
        r = build()
        ok("bygge: går igenom utan bokmappen", r.returncode == 0, r.stdout[-300:] if r.returncode else "")

        def broken(path, change, name, want):
            orig = path.read_text(encoding="utf-8")
            path.write_text(change(orig), encoding="utf-8")
            r = build()
            path.write_text(orig, encoding="utf-8")
            good = r.returncode != 0 and want in r.stdout
            ok(name, good, "" if good else r.stdout[-200:])

        ga = t / "languages" / "de" / "content" / "grammar-a.json"
        def topic(s):
            d = json.loads(s); d[0]["topic"] = "finnsinte"; return json.dumps(d, ensure_ascii=False)
        def rule(s):
            d = json.loads(s); d[0]["rule"] = "finnsinte"; return json.dumps(d, ensure_ascii=False)
        broken(ga, topic, "bygge: grammatikfråga med okänt område stoppar", "topic 'finnsinte'")
        broken(ga, rule, "bygge: grammatikfråga med okänd regel stoppar", "rule 'finnsinte'")
        rg = t / "languages" / "de" / "content" / "regler.json"
        def regel(s):
            d = json.loads(s); d["finnsinte"] = next(iter(d.values())); return json.dumps(d, ensure_ascii=False)
        broken(rg, regel, "bygge: regel utan område i grammar.json stoppar", "'finnsinte' är inget område")
        def preview(s):
            d = json.loads(s); d["topics"][0]["preview"] = "xx9"; return json.dumps(d, ensure_ascii=False)
        broken(t / "languages" / "fr" / "grammar.json", preview, "bygge: förhandsvisning (preview) till en kurs som inte finns stoppar", "preview 'xx9'")
        lj = t / "languages" / "de4" / "lang.js"
        broken(lj, lambda s: s.replace('inherit: ["connectors"', 'inherit: ["conectors"', 1), "arv: inherit med ett fält som föräldern saknar stoppar", "inherit 'conectors'")
        broken(lj, lambda s: s.replace('nextCourse: "de"', 'nextCourse: "xx"', 1), "bygge: nextCourse till en kurs som inte finns stoppar", "nextCourse 'xx'")
        # Verbtabellerna ligger i verbs.json och följer med datafilen, med arvet ihopslaget (de4 ärver från de utan Konjunktiv I)
        d4 = json.loads((t / "dist" / "data" / "de4.json").read_text(encoding="utf-8")).get("verbTables", {})
        de = json.loads((t / "dist" / "data" / "de.json").read_text(encoding="utf-8")).get("verbTables", {})
        page = (t / "dist" / "index.html").read_text(encoding="utf-8")
        ok("verb: tabellerna ligger i datafilen med arvet ihopslaget, inte i index.html",
           "Konjunktiv I" in de.get("tenses", {}) and "Konjunktiv I" not in d4.get("tenses", {}) and d4.get("sv") == de.get("sv")
           and list(d4["tenses"]) == [k for k in de["tenses"] if k != "Konjunktiv I"] and '"Präsens": {' not in page and "Präsens: {" not in page)
        broken(t / "languages" / "de" / "lang.js", lambda s: s.replace("  verbs: {", '  verbs: {\n    tenses: {"Präsens": {}},', 1),
               "verb: tabeller i lang.js stoppar bygget", "ska ligga i languages/de/verbs.json")
        broken(t / "languages" / "de" / "verbs.json", lambda s: s.replace('"tenses"', '"tenses2"', 1), "verb: okänt fält i verbs.json stoppar", "bara sv, tenses och notes")
        ok("bygge: går igenom igen", build().returncode == 0)

        # --- lang.js läses med en tokenizer (P3) och fälten per innehållstyp kontrolleras (P2), arkitekturgranskningen 2026-09-29 ---
        def passes(path, change, name):
            orig = path.read_text(encoding="utf-8")
            path.write_text(change(orig), encoding="utf-8")
            r = build()
            path.write_text(orig, encoding="utf-8")
            ok(name, r.returncode == 0, r.stdout[-300:] if r.returncode else "")
        passes(lj, lambda s: s.replace('storageKey: "glosor-de4-v1"', "storageKey: 'glosor-de4-v1'", 1).replace('extends: "de"', "extends:\n    'de'", 1),
               "lang.js: enkla citattecken och radbrytning i storageKey/extends går igenom (samma lås)")
        broken(lj, lambda s: s.replace('nextCourse: "de"', "nextCourse: /* kommentar */ 'xx'", 1), "lang.js: nextCourse med enkla citattecken och kommentar kontrolleras", "nextCourse 'xx'")
        broken(lj, lambda s: s.replace('storageKey: "glosor-de4-v1"', 'storageKey: "glosor-" + "de4-v1"', 1), "lang.js: storageKey som inte är en ren text stoppar", "ska vara en text inom citattecken")
        broken(lj, lambda s: s.replace('extends: "de"', "extends: ['de']", 1), "lang.js: extends i fel form stoppar", "extends ska vara en kod")
        broken(lj, lambda s: s.replace("LANGUAGES.de4 =", "LANGUAGES.de5 =", 1), "lang.js: LANGUAGES.<kod> ska vara mappens namn", "ska vara LANGUAGES.de4")
        broken(lj, lambda s: s.replace('storageKey: "glosor-de4-v1"', 'storageKey: "glosor-de4-v1', 1), "lang.js: en sträng som inte slutar stoppar med radnummer", "strängen slutar aldrig")

        def first(kind, change):   # ändrar första posten i de/content/<kind>.json
            def f(s):
                d = json.loads(s); change(d[0] if isinstance(d, list) else d); return json.dumps(d, ensure_ascii=False)
            return f
        dc = t / "languages" / "de" / "content"
        items = {k: json.loads((dc / f"{k}.json").read_text(encoding="utf-8")) for k in ("listening", "stories", "prompts", "phrases")}
        broken(dc / "listening.json", first("listening", lambda x: x.pop("questions")), "innehåll: hörtext utan questions stoppar (fil och id)",
               f"de/content/listening.json: {items['listening'][0]['id']} saknar questions")
        broken(dc / "reading.json", first("reading", lambda x: x["lines"][0].pop("fr")), "innehåll: lästext med en rad utan fr stoppar", "rad 1 saknar fr")
        broken(dc / "stories.json", first("stories", lambda x: x["gaps"].pop()), "innehåll: berättelse med fler luckor än gaps stoppar",
               f"{items['stories'][0]['id']} har {len(items['stories'][0]['gaps'])} luckor i text men {len(items['stories'][0]['gaps']) - 1} i gaps")
        broken(dc / "prompts.json", first("prompts", lambda x: x["need"].update(tenses=["Plusquamperfekt"])), "innehåll: need.tenses som inte finns i tenseCheck stoppar", "'Plusquamperfekt', som inte finns i kursens tenseCheck")
        broken(dc / "phrases.json", first("phrases", lambda x: x["alt"].append(x["fr"])), "innehåll: fras med sig själv bland felalternativen stoppar", "har frasen själv bland felalternativen")
        broken(dc / "regler.json", first("regler", lambda d: next(iter(d.values()))["parts"].append({})), "innehåll: tom del i en regelsida stoppar", "är tom (behöver h, t, table eller ex)")
        broken(dc / "exam.json", first("exam", lambda d: d["tasks"][0].update(part="finnsinte")), "innehåll: provuppgift med okänd part stoppar", "part 'finnsinte', som inte finns i parts")
        passes(dc / "prompts.json", first("prompts", lambda x: x.update(model="Kurz.")), "innehåll: för kort modelltext ger bara en varning")
        r = build()
        ok("innehåll: bygget går igenom igen", r.returncode == 0)

    # Tokenizern och kontrollerna direkt (utan bygge)
    sys.path.insert(0, str(ROOT))
    from build import parse_lang_js, js_object_keys, JSExpr, JSParseError, check_fields, found_connectors, js_tok
    src = """/* kommentar med LANGUAGES.xx = { och "citat" */
LANGUAGES.zz = {
  name: 'Tyska', title: "Glosor", // två fält på en rad
  storageKey:
    "glosor-zz-v1",
  re: /^(der|die|das) \\/"'/i, fn: t => /a,b/.test(t), url: "http://x.se/a", n: -3, ok: true,
  list: ["a", 'b\\'c', `d`], $x: {$append: ["y"]},
  tenseCheck: (() => { const w = "x"; return {"Präsens": t => true, 'Perfekt': t => /hat/.test(t)}; })(),
};"""
    d = parse_lang_js(src, "zz")
    good = (d.get("name") == "Tyska" and d.get("storageKey") == "glosor-zz-v1" and d.get("url") == "http://x.se/a" and d.get("n") == -3
            and d.get("ok") is True and d.get("list") == ["a", "b'c", "d"] and d.get("$x") == {"$append": ["y"]})
    ok("lang.js-tokenizer: enkla citattecken, kommentarer, radbrytning och flera fält per rad", good, "" if good else repr(d)[:200])
    ok("lang.js-tokenizer: regex och funktioner blir uttryck, tenseCheck-nycklar ur return {…}",
       isinstance(d.get("re"), JSExpr) and isinstance(d.get("fn"), JSExpr) and js_object_keys(d["tenseCheck"]) == ["Präsens", "Perfekt"])
    def fails(s, code="zz"):
        try:
            parse_lang_js(s, code)
            return False
        except JSParseError:
            return True
    ok("lang.js-tokenizer: fel form stoppar", fails('LANGUAGES.zz = {name: "x}') and fails("LANGUAGES.zz = {a: 1") and fails("var x = 1;") and fails('LANGUAGES.yy = {a: 1};'))
    ok("bindeord räknas som i appen (längsta först, apostrof)", found_connectors("Même si c'est dur, d'abord je viens.", ["si", "même si", "d'abord"]) == ["même si", "d'abord"]
       and js_tok("Bonjour, l’ami ! Ça va ?") == ["bonjour", "l'ami", "ça", "va"])
    good = {"phrases": [{"id": "p1", "sit": "s", "fr": "Hallo", "alt": ["hallo", "Hallöchen"], "why": "w"}],
            "uttal": [{"id": "u1", "title": "t", "pairs": [["a", "b"]]}],
            "mal": [{"id": "m1", "sec": "k1", "goals": ["Jag kan"]}],
            "prompts": [{"id": "w1", "sec": "", "title": "t", "task": "x", "min": 2, "max": 5, "model": "und dann ja", "need": {"connectors": 1, "tenses": ["Präsens"]}}]}
    e, w = check_fields(good, "x", ["und", "dann"], {"Präsens"})
    ok("innehåll: korrekta poster godkänns (tomt sec i en allmän skrivuppgift, versal skillnad i felalternativ)", not e and not w, "; ".join(e + w))
    bad = {"uttal": [{"id": "u1", "title": "t", "pairs": [["a"]]}], "mal": [{"id": "m1", "sec": "k1", "goals": []}],
           "stories": [{"id": "s1", "sec": "k1", "title": "t", "text": "Er [ging|geht|ging] weg.", "gaps": [{"cat": "tempus", "why": "w"}]}],
           "satsanalys": [{"id": "a1", "sec": "k1", "lvl": 1, "t": "x", "fr": "[[a]]", "opts": ["a", "b"], "a": 0, "why": "w"}],
           "prompts": [{"id": "w1", "sec": "k1", "title": "t", "task": "x", "min": 9, "max": 5, "model": "a"}]}
    e, w = check_fields(bad, "x", [], set())
    want = ["uttal.json: u1 ordpar 1", "mal.json: m1 saknar goals", "stories.json: s1 lucka 1", "satsanalys.json: a1 har t 'x'", "prompts.json: w1 har min 9 och max 5"]
    missing = [x for x in want if not any(x in m for m in e)]
    ok("innehåll: fel form ger fel med fil och id", not missing, "saknas: " + "; ".join(missing) if missing else "")
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------------------
# Skriva på ett ställe (2026-09-30, backlogg P2: Slå ihop Skriv en text och provets skrivuppgifter): skrivsidan visar
# kapitlets uppgifter och provets skrivuppgifter med filter, båda bedöms med samma prompt (writePrompt, nivå ur
# LEVEL_GUIDE, 0–5 per kriterium) och sparas i samma format i S.fb, gamla kommentarer och utkast läses, och kortet
# Veckans skrivuppgift på startsidan (7 dagar utan text, stängs för veckan i S.wrSkip, nytt fält).
# ---------------------------------------------------------------------------------------------------------
SCENARIO_WRITEHUB = r"""<script>
const out=[]; const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const noScroll=sel=>[400,320].every(w=>{ document.body.style.width=w+"px"; const p=q(sel); if(!p){ document.body.style.width=""; return false; }
  const r=p.getBoundingClientRect(), bad=[...p.querySelectorAll("*")].filter(e=>{const b=e.getBoundingClientRect(); return b.width&&(b.right>r.right+.5||b.left<r.left-.5);});
  const okw=document.documentElement.scrollWidth<=window.innerWidth&&!bad.length; document.body.style.width=""; return okw; });
appReady().then(async()=>{ try{
  useLang("fr"); await until(()=>L.code==="fr"&&L.base&&!sess,5000);
  const ps=C().prompts, xs=EX().tasks.filter(t=>exKind(t)==="write"), keep=SAMPLE;
  ok("skriv: kursen har båda sorterna", ps.length>0&&xs.length>0, ps.length+" / "+xs.length);
  // Sidan och filtret
  S.wr={}; delete S.fb; S.drafts={}; WR_FILTER="all"; KINDS.write.open();
  ok("skriv: sidan visar kapitlets uppgifter och provuppgifterna", qa("[data-pick]").length===ps.length&&qa("[data-pickx]").length===xs.length, qa("[data-pick]").length+" / "+qa("[data-pickx]").length);
  ok("skriv: kapitlets uppgifter först (samma ordning som förut)", q("[data-pick]").dataset.pick===ps[0].id);
  const lab=q("[data-pickx] small").textContent;
  ok("skriv: provuppgiften är märkt med prov och tid", lab.startsWith("Provuppgift · DELF B1")&&/\d+ min/.test(lab), lab);
  q('[data-wrf="exam"]').click(); ok("skriv: filtret Provet", !qa("[data-pick]").length&&qa("[data-pickx]").length===xs.length&&q('[data-wrf="exam"]').getAttribute("aria-pressed")==="true");
  q('[data-wrf="sec"]').click(); ok("skriv: filtret Kapitlen", qa("[data-pick]").length===ps.length&&!qa("[data-pickx]").length);
  S.wr[ps[0].id]={words:40,last:Date.now(),h:1}; exState().t[xs[0].id]={pct:60,best:60,n:1,last:Date.now()};
  q('[data-wrf="todo"]').click(); ok("skriv: filtret Oskrivna", qa("[data-pick]").length===ps.length-1&&qa("[data-pickx]").length===xs.length-1&&!q(`[data-pick="${ps[0].id}"]`));
  q('[data-wrf="all"]').click(); ok("skriv: ingen horisontell scroll (400 och 320 px)", noScroll("#wrlist"));
  // Samma bedömning: en prompt-byggare för båda sorterna
  let prompts=[]; SAMPLE={json:async p=>{prompts.push(p); return {kriterier:[{namn:"Uppgiften",poang:4,kommentar:"ok"},{namn:"Ordförråd",poang:3,kommentar:"ok"},{namn:"Grammatik",poang:2,kommentar:"ok"}],helhet:"Bra.",bra:["Tydlig"],fel:[{citat:"je suis allé",rattat:"je suis allée",varfor:"Kongruens"}],nasta:"Mer",niva:"A2"};}};
  const p0=ps.find(p=>p.min<=30)||ps[0], txt="Hier je suis allé au cinéma avec mes amis et nous avons mangé une pizza. C'était super mais un peu cher. Demain je vais travailler.";
  q(`[data-pick="${p0.id}"]`).click(); q("#wtext").value=txt; q("#wtext").dispatchEvent(new Event("input")); q("#fbbtn").click();
  await until(()=>S.fb&&S.fb["w:"+p0.id],3000);
  const fw=S.fb["w:"+p0.id], lvW=cefrOf(p0.level)||courseLevel();
  ok("skriv: Skriv en text bedöms med kriterier 0–5 och nivån", prompts.length===1&&prompts[0].includes('"poang": 0-5')&&prompts[0].includes("5 poäng = helt på "+lvW+"-nivå")&&prompts[0].includes(LEVEL_GUIDE[lvW])&&prompts[0].includes(p0.task), prompts[0]&&prompts[0].slice(0,120));
  ok("skriv: samma prompt-byggare som provet", prompts[0]===writePrompt(wrPromptOpt(p0),txt));
  ok("skriv: sparformat i S.fb (d, lv, words, pct)", fw.d>0&&fw.lv===lvW&&fw.words===tok(txt).length&&fw.pct===60, JSON.stringify({d:fw.d,lv:fw.lv,words:fw.words,pct:fw.pct}));
  ok("skriv: kriterierna och summan visas", q("#fbout").textContent.includes("Sammanlagt")&&q("#fbout").textContent.includes("60 %")&&q("#fbout").textContent.includes("je suis allée"));
  // Provuppgift från skrivsidan: samma prompt, samma format, Tillbaka leder till skrivsidan
  const x0=xs[xs.length-1]; S.drafts["x:"+x0.id]="Mon brouillon ancien"; q("#quit").click(); q(`[data-pickx="${x0.id}"]`).click();
  ok("skriv: provuppgiften öppnas med klocka och gammalt utkast", !!q("#exclock")&&q("#xtext").value==="Mon brouillon ancien");
  q("#xtext").value=txt+" "+txt+" "+txt+" "+txt; q("#xtext").dispatchEvent(new Event("input")); q("#exdone").click();
  await until(()=>S.fb["x:"+x0.id],3000);
  const fx=S.fb["x:"+x0.id], lvX=examLevel(x0);
  ok("skriv: provets prompt kommer från samma byggare", prompts.length===2&&prompts[1]===writePrompt({exam:EX().name,lv:lvX,where:exPart(x0.part).name+(x0.teil?", "+x0.teil:""),task:x0.task,criteria:x0.criteria,speak:false,words:EX().approxWords?`Cirka ${x0.minWords} ord (en text med mindre än hälften så många ord ger 0 poäng på provet).`:`Minst ${x0.minWords} ord.`},q("#xtext").value.trim()));
  ok("skriv: provets kommentar i samma format", fx.lv===lvX&&fx.pct===60&&fx.words>0&&exState().t[x0.id].pct===60, JSON.stringify({lv:fx.lv,pct:fx.pct}));
  q("#quit").click(); ok("skriv: Tillbaka från provuppgiften leder till skrivsidan", !!q("#wrlist"));
  examTask(x0.id); q("#quit").click(); ok("skriv: provuppgift från provträningen går tillbaka till provträningen", !q("#wrlist")&&!!q("#sim"));
  SAMPLE=keep;
  // Gamla format: kommentar utan kriterier, en sträng, och en gammal provkommentar utan pct/lv
  S.fb["w:"+ps[1].id]={helhet:"Gammal kommentar",fel:[{citat:"le maison",rattat:"la maison",varfor:"Genus"}],niva:"A2",d:Date.now()-9e8};
  S.drafts["w:"+ps[1].id]="Mon vieux texte";
  openWriting(); q(`[data-pick="${ps[1].id}"]`).click();
  ok("skriv: gammal kommentar och utkast visas", q("#fbout").textContent.includes("Gammal kommentar")&&q("#fbout").textContent.includes("la maison")&&q("#wtext").value==="Mon vieux texte");
  S.fb["w:"+ps[1].id]="Gammal text som sträng"; q("#quit").click(); q(`[data-pick="${ps[1].id}"]`).click();
  ok("skriv: kommentar som sträng visas", q("#fbout").textContent.includes("Gammal text som sträng"));
  S.fb["x:"+x0.id]={kriterier:[{namn:"A",poang:5},{namn:"B",poang:0}],helhet:"Förr",d:1};
  examTask(x0.id); ok("skriv: gammal provkommentar utan pct får summan", q("#exres").textContent.includes("Sammanlagt")&&q("#exres").textContent.includes("50 %")&&q("#exres").textContent.includes("Förr"), q("#exres").textContent.slice(0,100));
  ok("skriv: fbNorm", fbNorm(null)===null&&fbNorm("")===null&&fbNorm("x").helhet==="x"&&fbNorm({kriterier:[{poang:5}]}).pct===100&&fbNorm({helhet:"h"}).pct==null);
  // Veckans skrivuppgift
  const old=Date.now()-8*864e5;
  S.wr={}; S.fb={}; S.exam={t:{},sims:[]}; S.log=S.log.filter(e=>e.kind!=="write"); delete S.wrSkip; S.src=ps[0].sec||"auto"; renderStart();
  const cur=curSec(), first=ps.find(p=>p.sec===cur);
  ok("vecka: kortet visas när inget är skrivet", !!q("#wrnag")&&q("#wrnag").textContent.includes("Veckans skrivuppgift"));
  ok("vecka: förslaget är nästa oskrivna uppgift i kapitlet", !!first&&q("#wrnag-go").dataset.wrn===first.id&&q("#wrnag-go").dataset.wrx==="0", cur+" "+(q("#wrnag-go")||{dataset:{}}).dataset.wrn);
  ps.filter(p=>p.sec===cur).forEach(p=>S.wr[p.id]={words:50,last:old,h:1}); renderStart();
  ok("vecka: skrivet för 8 dagar sedan ger kortet med antal dagar", !!q("#wrnag")&&q("#wrnag").textContent.includes("8 dagar"), q("#wrnag")&&q("#wrnag").textContent.slice(0,120));
  ok("vecka: kapitlet klart ger en provuppgift", q("#wrnag-go").dataset.wrx==="1"&&xs.some(t=>t.id===q("#wrnag-go").dataset.wrn)&&q("#wrnag-go").textContent.includes("Provuppgift"));
  q("#wrnag-go").click(); ok("vecka: förslaget öppnas", !!q("#xtext")&&!!q("#exclock")); q("#quit").click(); ok("vecka: Tillbaka till skrivsidan", !!q("#wrlist"));
  S.wr[ps[0].id]={words:50,last:Date.now()-2*864e5,h:1}; renderStart(); ok("vecka: skrivet för 2 dagar sedan ger inget kort", !q("#wrnag"));
  S.wr={}; S.fb={["x:"+x0.id]:{helhet:"x",d:Date.now()-864e5}}; renderStart(); ok("vecka: en bedömd provuppgift räknas som skriven", !q("#wrnag"));
  S.fb={}; renderStart(); q("#wrnag-skip").click();
  ok("vecka: stängt för veckan", !q("#wrnag")&&S.wrSkip===wrWeek(Date.now())&&/^\d{4}-\d\d-\d\d$/.test(S.wrSkip)&&new Date(S.wrSkip+"T12:00").getDay()===1, S.wrSkip);
  ok("vecka: sparat i localStorage", JSON.parse(localStorage.getItem(L.storageKey)).wrSkip===S.wrSkip);
  renderStart(); ok("vecka: stängt kort kommer inte tillbaka samma vecka", !q("#wrnag"));
  S.wrSkip=wrWeek(Date.now()-7*864e5); renderStart(); ok("vecka: nästa vecka visas kortet igen", !!q("#wrnag"));
  ok("vecka: ingen horisontell scroll (400 och 320 px)", noScroll("#wrnag"));
  q("#wrnag-all").click(); ok("vecka: Välj en annan uppgift öppnar skrivsidan", !!q("#wrlist"));
  const log=S.log; S.log=[]; renderStart(); ok("vecka: inget kort för en helt ny elev", !q("#wrnag")); S.log=log;
  // Kurs utan prov: bara kapitlets uppgifter
  const np=testCourses().find(c=>!LANGUAGES[c].exam&&c==="it3");   // it1 har CELI Impatto sedan 2026-09-30
  if(np){ useLang(np); await until(()=>L.code===np&&L.base&&!sess,8000);
    openWriting(); ok(np+": utan prov bara kapitlets uppgifter", qa("[data-pick]").length===(C().prompts||[]).length&&!qa("[data-pickx]").length&&!q('[data-wrf="exam"]'));
    S.wr={}; delete S.wrSkip; S.log=S.log.length?S.log:[{kind:"words",d:Date.now()-864e5,dur:60,right:1,total:1}]; renderStart();
    ok(np+": kortet föreslår en uppgift ur kapitlen", !!q("#wrnag")&&q("#wrnag-go").dataset.wrx==="0"); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Studieplanen (src/kinds/82-plan.js, languages/<kod>/plan.json, backlogg P2: Studieplan för självstudier): Tyska 5 har
# en plan med veckor, varje uppgift i planen finns och går att öppna, aktuell vecka räknas från startdatumet (S.plan.start,
# nytt fält), framsteg per vecka räknas ur S.w, gamla fält i S rörs inte, och kurser utan plan visar inget. Egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_PLAN = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const noScroll=()=>[400,320].every(w=>{ document.body.style.width=w+"px"; const p=q("#planp");
  const r=p.getBoundingClientRect(), bad=[...p.querySelectorAll("*")].filter(e=>{const b=e.getBoundingClientRect(); return b.width&&(b.right>r.right+.5||b.left<r.left-.5);});
  const okw=document.documentElement.scrollWidth<=window.innerWidth&&!bad.length; document.body.style.width=""; return okw; });
appReady().then(async()=>{ try{
  useLang("de"); await until(()=>L.code==="de"&&L.base&&!sess,5000);
  delete S.plan; renderStart();
  const P=L.plan;
  ok("plan: Tyska 5 har en plan på 18–20 veckor", !!P&&P.weeks.length>=18&&P.weeks.length<=20, P&&P.weeks.length);
  ok("plan: typen finns i registret", !!KINDS.plan&&KINDS.plan.name==="Studieplan"&&typeof KINDS.plan.open==="function");
  ok("plan: kort på startsidan utan startdatum", !!q("#plancard")&&q("#plancard").textContent.includes("Studieplan")&&!/vecka \d+ av/.test(q("#plancard").textContent));
  { const bad=[]; P.weeks.forEach((w,i)=>(w.do||[]).forEach(x=>{ const it=planItem(x); if(!it||typeof it.go!=="function"||!it.title) bad.push(w.id+":"+x.k+":"+(x.id||"")); }));
    ok("plan: varje uppgift i planen finns i kursen", !bad.length, bad.join(", ")); }
  { const secs=new Set(P.weeks.flatMap(w=>(w.words||[]).map(r=>r.sec))), main=L.base.sections.filter(s=>/^d/.test(s.id)).map(s=>s.id);
    const all=P.weeks.flatMap(w=>planWords(w).map(x=>x.id)), uniq=new Set(all);
    const inMain=L.base.words.filter(w=>main.includes(w.sec)).length;
    ok("plan: alla ord i kursens avsnitt (utom musikteorin) finns i någon vecka, en gång", main.every(s=>secs.has(s))&&all.length===uniq.size&&uniq.size===inMain, uniq.size+" / "+inMain+" / "+all.length);
    const topics=new Set(P.weeks.flatMap(w=>w.grammar||[]));
    ok("plan: alla grammatikområden finns i planen", GR().topics.every(t=>topics.has(t.id)), GR().topics.filter(t=>!topics.has(t.id)).map(t=>t.id).join()); }
  // Vecka 3 i dag
  const before=JSON.stringify(Object.assign({},S,{plan:undefined,t:undefined})), keyBefore=L.storageKey;
  q("#plancard").click();
  ok("plan: sidan öppnas från kortet", !!q("#planp")&&q("#planp").querySelectorAll(".planwk").length===P.weeks.length);
  const sel=q("#plan-wk"); sel.value="2"; sel.onchange({target:sel});
  ok("plan: vecka 3 vald ger startdatum och aktuell vecka", planWeekIdx()===2&&/^\d{4}-\d\d-\d\d$/.test(S.plan.start)&&planStart().getDay()===1, JSON.stringify(S.plan));
  ok("plan: aktuell vecka är öppen och markerad", q(".planwk[open]")&&q(".planwk[open]").dataset.wk==="2"&&q(".planwk[open]").textContent.includes("denna vecka"));
  ok("plan: sparat i localStorage", JSON.parse(localStorage.getItem(L.storageKey)).plan.start===S.plan.start);
  ok("plan: inget annat i S ändras", JSON.stringify(Object.assign({},S,{plan:undefined,t:undefined}))===before&&L.storageKey===keyBefore);
  // Framsteg: veckans ord
  const w3=planWords(P.weeks[2]); const saved=w3.slice(0,5).map(w=>[w.id,S.w[w.id]]);
  w3.slice(0,4).forEach(w=>S.w[w.id]={s:5,due:9e9}); S.w[w3[4].id]={s:1,due:1};
  const pr=planProgress(P.weeks[2]);
  ok("plan: framsteg per vecka räknas ur S.w", pr.known>=4&&pr.started>=5&&pr.n===w3.length, JSON.stringify(pr));
  renderStart(); ok("plan: kortet visar vecka och ord", q("#plancard").textContent.includes("vecka 3 av "+P.weeks.length)&&q("#plancard").textContent.includes(pr.known+" av "+pr.n+" ord"), q("#plancard").textContent.trim().slice(0,120));
  saved.forEach(([id,x])=>{ if(x) S.w[id]=x; else delete S.w[id]; });
  // Knapparna
  q("#plancard").click();
  const src=S.src; q('.planwk[open] [data-plansrc]').click();
  ok("plan: Ta nya ord från veckans avsnitt sätter S.src", S.src===P.weeks[2].words[0].sec, S.src); S.src=src; save();
  q("#plancard").click(); q('.planwk[open] [data-planitem]').click();
  ok("plan: en uppgift öppnas från planen", !q("#planp"));
  renderStart(); q("#plancard").click(); q('.planwk[open] [data-plangram]').click();
  ok("plan: grammatiken öppnas från planen", !!sess&&!!sess.cur); pauseSession&&pauseSession(); S.runs={}; delete S.run;
  // Startdatum i framtiden och efter sista veckan
  renderStart(); q("#plancard").click(); const d=q("#plan-start"), f=new Date(Date.now()+10*864e5);
  d.value=planIso(f); d.onchange({target:d});
  ok("plan: startdatum i framtiden", planWeekIdx()===-1&&q("#plan-status").textContent.includes("börjar"), q("#plan-status").textContent);
  d.value="2020-01-06"; q("#plan-start").onchange({target:{value:"2020-01-06"}});
  ok("plan: efter sista veckan", planWeekIdx()===P.weeks.length&&q("#plan-status").textContent.includes("Alla veckor"));
  ok("plan: ingen horisontell scroll (400 och 320 px)", noScroll());
  q("#plan-start").onchange({target:{value:""}}); ok("plan: startdatumet kan tas bort", planWeekIdx()===null&&S.plan&&!S.plan.start);
  // Gammalt läge utan plan, och kurs utan plan
  delete S.plan; renderStart(); ok("plan: läge utan S.plan fungerar", !!q("#plancard")&&planWeekIdx()===null);
  useLang("it1"); await until(()=>L.code==="it1"&&L.base&&!sess,5000); renderStart();   // fr har en plan sedan P3: Studieplan
  ok("plan: kurs utan plan visar inget kort", !q("#plancard")&&!hasPlan());
  KINDS.plan.open(); ok("plan: öppna utan plan går till startsidan", !q("#planp"));
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


# ---------------------------------------------------------------------------------------------------------
# Studieplaner för fler kurser och Tillbaka till planen (backlogg P3: Studieplan): fr, frs4, frs5, fr4, de4 och de6 har
# en plan på 18–20 veckor som täcker kursens alla ord (utom valbara avsnitt, t.ex. musikteorin) en gång, alla
# grammatikområden, alla texter (utom bokens) och alla provuppgifter. En uppgift som öppnas i planen leder med Tillbaka,
# Avbryt och slutskärmens knapp tillbaka till planen (openFrom/RETURN_TO i app.js); öppnad från sin lista som förut.
# ---------------------------------------------------------------------------------------------------------
PLAN_COURSES = ["de", "fr", "frs4", "frs5", "fr4", "de4", "de6"]
SCENARIO_PLANS = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const PLAN_COURSES=__PLAN_COURSES__;
const CK={lq:"listening",rq:"reading",write:"prompts",culture:"culture",story:"stories"};
appReady().then(async()=>{ try{
  for(const c of PLAN_COURSES){
    useLang(c); await until(()=>L.code===c&&L.base&&!sess,8000);
    const P=L.plan, n=P?P.weeks.length:0;
    ok(c+": plan på 18–20 veckor med tips", !!P&&n>=18&&n<=20&&P.weeks.every(w=>w.id&&w.title&&w.tip), n);
    if(!P) continue;
    const bad=[]; P.weeks.forEach(w=>(w.do||[]).forEach(x=>{ const it=planItem(x); if(!it||!it.title||typeof it.go!=="function") bad.push(w.id+":"+x.k+":"+(x.id||"")); }));
    ok(c+": varje uppgift i planen finns", !bad.length, bad.slice(0,8).join(", "));
    const secs=L.base.sections.filter(s=>!isElective(s.id)).map(s=>s.id), inPlan=new Set(P.weeks.flatMap(w=>(w.words||[]).map(r=>r.sec)));
    const all=P.weeks.flatMap(w=>planWords(w).map(x=>x.id)), uniq=new Set(all), want=L.base.words.filter(w=>secs.includes(w.sec));
    ok(c+": alla ord (utom valbara avsnitt) i någon vecka, en gång", secs.every(s=>inPlan.has(s))&&all.length===uniq.size&&want.every(w=>uniq.has(w.id)),
      uniq.size+" / "+want.length+" / "+all.length+" "+secs.filter(s=>!inPlan.has(s)).join());
    ok(c+": inga valbara avsnitt i planen", ![...inPlan].some(isElective));
    const topics=new Set(P.weeks.flatMap(w=>w.grammar||[]));
    ok(c+": alla grammatikområden", GR().topics.every(t=>topics.has(t.id)), GR().topics.filter(t=>!topics.has(t.id)).map(t=>t.id).join());
    const used=new Set(P.weeks.flatMap(w=>(w.do||[]).map(x=>x.k+"|"+(x.id||""))));
    const miss=Object.entries(CK).flatMap(([k,ck])=>(C()[ck]||[]).filter(x=>!/^bok-/.test(x.id)&&!used.has(k+"|"+x.id)).map(x=>k+":"+x.id));
    ok(c+": alla texter, skrivuppgifter, kultur och berättelser (utom bokens)", !miss.length, miss.slice(0,8).join(", "));
    ok(c+": inga av bokens texter i planen", ![...used].some(u=>/\|bok-/.test(u)));
    const exMiss=hasExam()?EX().tasks.filter(t=>!used.has("exam|"+t.id)).map(t=>t.id):[];
    ok(c+": alla provuppgifter och en provsimulering", !exMiss.length&&(!hasExam()||used.has("examsim|")), exMiss.join());
  }
  // Tillbaka till planen (Tyska 4)
  useLang("de4"); await until(()=>L.code==="de4"&&L.base&&!sess,8000);
  delete S.plan; S.runs={}; delete S.run; renderStart();
  const P=L.plan, find=k=>{ for(let i=0;i<P.weeks.length;i++){ const j=(P.weeks[i].do||[]).findIndex(x=>x.k===k); if(j>=0) return [i,j]; } };
  const openItem=k=>{ const [i,j]=find(k); KINDS.plan.open(); const b=q(`[data-planitem="${i}|${j}"]`); b.click(); return i; };
  const back=(k,sel)=>{ const i=openItem(k), opened=!q("#planp")&&(!sel||!!q(sel)); q("#quit").click();
    return opened&&!!q("#planp")&&!!q(`.planwk[data-wk="${i}"][open]`); };
  ok("tillbaka: hörförståelse → planen, veckan öppen", back("lq","#toq"));
  ok("tillbaka: läsa → planen", back("rq","#toq"));
  ok("tillbaka: skriva → planen", back("write","#wtext"));
  ok("tillbaka: kultur → planen", back("culture"));
  ok("tillbaka: provuppgift → planen", back("exam"));
  ok("tillbaka: kapitelprov (Avbryt) → planen", back("ktest")); S.runs={}; delete S.run;
  ok("tillbaka: berättelse (Avbryt) → planen", back("story")); S.runs={}; delete S.run;
  { KINDS.plan.open(); q("[data-plangram]").click(); const inq=!!sess&&!!sess.cur; q("#quit").click();
    ok("tillbaka: grammatik (Avbryt) → planen", inq&&!!q("#planp")); S.runs={}; delete S.run; }
  // Hörförståelse: Till frågorna och sedan Avbryt → planen
  { openItem("lq"); q("#toq").click(); const inq=!!sess; q("#quit").click(); ok("tillbaka: Avbryt i frågorna → planen", inq&&!!q("#planp")); S.runs={}; delete S.run; }
  // Slutskärmen efter en berättelse och ett kapitelprov: knappen heter Till studieplanen och leder dit
  { openItem("story"); sess.queue=[]; nextQ(); const h=q("#home");
    ok("slutskärmen: Till studieplanen", !!h&&h.textContent==="Till studieplanen", h&&h.textContent); if(h) h.click(); ok("slutskärmen: leder till planen", !!q("#planp")); }
  { openItem("ktest"); sess.queue=[]; nextQ(); const h=q("#kthome"); ok("kapitelprovets slutskärm: Till studieplanen", !!h&&h.textContent==="Till studieplanen"); h.click(); ok("kapitelprovet: leder till planen", !!q("#planp")); }
  // Planens egen Tillbaka och vanliga vägar: som förut
  q("#quit").click(); ok("planens Tillbaka → startsidan, RETURN_TO nollställd", !q("#planp")&&RETURN_TO===null);
  KINDS.lq.open(); q("[data-pick]").click(); q("#quit").click(); ok("utan planen: Tillbaka från hörförståelse → listan", !q("#planp")&&!!q("[data-pick]")&&!q("#toq"));
  KINDS.story.open(); q("[data-pick]").click(); sess.queue=[]; nextQ(); ok("utan planen: slutskärmen säger Startsidan", q("#home")&&q("#home").textContent==="Startsidan");
  q("#home").click(); openWriting(); const x=q("[data-pickx]"); if(x){ x.click(); q("#quit").click(); ok("skrivsidan: provuppgift → Tillbaka till skrivsidan (som förut)", !!q("#wrlist")); }
  renderStart(); S.runs={}; delete S.run; save();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>""".replace("__PLAN_COURSES__", "[" + ",".join(f'"{c}"' for c in PLAN_COURSES) + "]")


# ---------------------------------------------------------------------------------------------------------
# En ny, liten kurs (2026-09-29, 8 → 21 kurser): en låtsaskurs med bara lang.js och words.txt (inget content, ingen
# grammatik, inga verb, inget prov) byggs i en temporär kopia. Bygget ska gå igenom, kursen ska stå i väljaren under
# sitt språk sorterad efter steg, kommande kurser står diskret som "kommer", nextCourse som lista ger två vägar, och
# looparna "alla kurser" i SCENARIO_FIXES och SCENARIO_KINDS körs på låtsaskursen (COURSES_UNDER_TEST; SCENARIO_IPA och
# SCENARIO_EXAMSIM använder också testCourses() och hoppar över kurser utan innehållet).
# Byggkontrollerna för step och nextCourse-listor testas också här.
# ---------------------------------------------------------------------------------------------------------
FIXTURE_COURSES = ["fr", "fr4", "fru", "de", "de4", "de6", "it1", "it2"]   # kurserna som följer med in i kopian
MINI_LANG = """/* Låtsaskurs för testerna (tests/run_tests.py, test_minimal_course): bara det en ny kurs måste ha. */
LANGUAGES.zz1 = {
  name: "Franska",
  title: "Franska glosor",
  course: "Testfranska 1",
  step: 1,
  level: "A1",
  inLang: "på franska",
  tts: "fr-FR",
  storageKey: "glosor-zz1-test",
  nextCourse: ["fr", "fr4"],
};
"""
MINI_WORDS = """// Låtsaskursens ordlista
#z1|Hälsningar
bonjour|hej||Bonjour, Marie !|Hej, Marie!|
merci|tack||Merci beaucoup.|Tack så mycket.|
au revoir|hej då||Au revoir, Paul.|Hej då, Paul.|
oui|ja|||| 
non|nej||Non, merci.|Nej tack.|
le chat|katten|m|Le chat dort.|Katten sover.|
la maison|huset|f|La maison est grande.|Huset är stort.|
le livre|boken|m|Je lis le livre.|Jag läser boken.|
la table|bordet|f|Le livre est sur la table.|Boken ligger på bordet.|
le pain|brödet|m|Je mange du pain.|Jag äter bröd.|
#z2|Familjen
la mère|mamma|f|Ma mère travaille.|Min mamma arbetar.|
le père|pappa|m|Mon père chante.|Min pappa sjunger.|
la sœur|systern|f|Ma sœur a dix ans.|Min syster är tio år.|
le frère|brodern|m|Mon frère joue au foot.|Min bror spelar fotboll.|
l'ami|vännen|m|C'est mon ami.|Det är min vän.|
l'amie|väninnan|f|C'est mon amie Léa.|Det är min väninna Léa.|
la famille|familjen|f|Ma famille est petite.|Min familj är liten.|
le fils|sonen|m|Son fils est grand.|Hennes son är lång.|
la fille|dottern|f|Leur fille est gentille.|Deras dotter är snäll.|
l'enfant|barnet|m|L'enfant rit.|Barnet skrattar.|
"""
SCENARIO_MINI = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const noScroll=()=>{ document.body.style.width="320px"; const w=document.documentElement.scrollWidth, r=q(".coursebar").getBoundingClientRect(), s=q("#course").getBoundingClientRect();
  document.body.style.width=""; return w<=window.innerWidth&&s.right<=r.right+.5; };
appReady().then(async()=>{ try{
  const opts=[...q("#course").options], groups=[...q("#course").querySelectorAll("optgroup")].map(g=>g.label);
  ok("ny kurs: finns i LANGUAGES och i väljaren", !!LANGUAGES.zz1&&opts.some(o=>o.value==="zz1"&&!o.disabled));
  ok("väljaren: en grupp per språk", groups.length>=3&&new Set(groups).size===groups.length&&groups[0]==="Franska", groups.join());
  const fr=[...q('#course optgroup[label="Franska"]').querySelectorAll("option")];
  const steps=fr.map(o=>{const m=o.text.match(/steg (\d)/); return m?+m[1]:o.text.includes("universitet")?8:9;});
  const zi=fr.findIndex(o=>o.value==="zz1");
  ok("väljaren: sorterad efter steg inom språket", steps.every((s,i)=>!i||s>=steps[i-1])&&zi>=0&&steps[zi]===1&&(zi===0||steps[zi-1]===1), fr.map(o=>o.text).join(" | "));
  const z=fr.find(o=>o.value==="zz1"); ok("väljaren: Testfranska 1 · steg 1 · A1", z&&z.text==="Testfranska 1 · steg 1 · A1", z&&z.text);
  const f3=fr.find(o=>o.value==="fr"); ok("väljaren: steg, nivå och provmål", f3&&f3.text==="Franska 3 · steg 3 · A2 · mål DELF B1", f3&&f3.text);
  const f6=fr.find(o=>o.value==="fr4"); ok("väljaren: fr4 heter Franska 6 (steg 6, B1)", f6&&f6.text==="Franska 6 · steg 6 · B1 · mål DELF B1", f6&&f6.text);
  const fu=fr.find(o=>o.value==="fru"); ok("väljaren: Franska I motsvarar steg 7 (B2) och står sist", fu&&fu.text==="Franska I (universitet) · motsvarar steg 7 · B2 · mål DELF B2"&&fr[fr.length-1]===fu, fu&&fu.text);
  const soon=opts.filter(o=>o.disabled); ok("väljaren: kommande kurser går inte att välja och står som kommer", soon.length===UPCOMING.filter(u=>!LANGUAGES[u.code]).length&&soon.every(o=>/ – kommer$/.test(o.text)&&!o.value.match(/^[a-z]+\d$/)), soon.length+" "+(soon[0]&&soon[0].text));
  ok("väljaren: kommande kurs som redan finns visas inte två gånger", !soon.some(o=>/^(Franska 3|Tyska 5) /.test(o.text)));
  ok("väljaren: ryms i 320 px", noScroll());
  // Välj kursen
  q("#course").value="zz1"; q("#course").dispatchEvent(new Event("change")); await until(()=>L.code==="zz1"&&L.base&&!sess,5000);
  ok("ny kurs: vald och har ord", L.code==="zz1"&&WORDS.length===20, WORDS.length);
  ok("ny kurs: rubriken visar steg och nivå", q("#coursechip").textContent==="Testfranska 1 · steg 1 · nivå A1", q("#coursechip").textContent);
  ok("ny kurs: startsidan och menyn", !!q("#go")&&exGroups().length>0&&!q("#app").textContent.includes("undefined"));
  setView("stats"); ok("ny kurs: statistiken", !/undefined|NaN/.test(q("#app").textContent)); setView("ova");
  // nextCourse som lista: två vägar
  const keep=S.w; S.w={}; WORDS.forEach(w=>S.w[w.id]={s:5,due:9e9,dd:Date.now()+864e7}); rebuildWords&&rebuildWords(); renderStart();
  const nb=[...document.querySelectorAll("[data-nextc]")].map(b=>b.dataset.nextc);
  ok("nextCourse som lista: två knappar", nb.join()==="fr,fr4"&&q("#app").textContent.includes("Redo för Franska 3 eller Franska 6"), nb.join());
  document.querySelector('[data-nextc="fr4"]').click(); await until(()=>L.code==="fr4"&&L.base,5000);
  ok("nextCourse som lista: knappen byter kurs", L.code==="fr4");
  useLang("zz1"); S.w=keep; save();
  ok("nextCourses: sträng och lista", nextCourses({nextCourse:"fr4"}).join()==="fr4"&&nextCourses(LANGUAGES.zz1).join()==="fr,fr4"&&nextCourses({nextCourse:["finnsinte"]}).length===0);
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def test_minimal_course():
    import json, shutil
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp) / "g"
        # Bara de etablerade kurserna följer med, så att kurser som är under arbete inte stör testet av låtsaskursen
        skip = lambda d, names: [n for n in names if pathlib.Path(d) == ROOT / "languages" and (ROOT / "languages" / n).is_dir() and n not in FIXTURE_COURSES]
        ign = shutil.ignore_patterns(".git", "dist", "book", "*.jpg", "*.jpeg", "*.png", "*.heic", "*.pdf")
        shutil.copytree(ROOT, t, ignore=lambda d, names: set(ign(d, names)) | set(skip(d, names)))
        # nextCourse som pekar på en kurs som inte följde med (t.ex. fr → frs4) tas bort i kopian
        for lj in (t / "languages").glob("*/lang.js"):
            src = lj.read_text(encoding="utf-8")
            m = re.search(r'^\s*nextCourse:\s*("[^"]*"|\[[^\]]*\]),?[^\n]*\n', src, re.M)
            if m and any(c not in FIXTURE_COURSES for c in re.findall(r'"([^"]+)"', m.group(1))):
                lj.write_text(src[:m.start()] + "\n" + src[m.end():], encoding="utf-8")
        # Samma sak för förhandsvisningar (preview i grammar.json) till en kurs som inte följde med (fr → frs4, frs5)
        for gj in (t / "languages").glob("*/grammar.json"):
            src = gj.read_text(encoding="utf-8")
            gj.write_text(re.sub(r',\s*"preview":\s*"([^"]+)"', lambda m: "" if m.group(1) not in FIXTURE_COURSES else m.group(0), src), encoding="utf-8")
        build =lambda: subprocess.run([sys.executable, str(t / "build.py")], capture_output=True, text=True)
        z = t / "languages" / "zz1"
        z.mkdir()
        (z / "lang.js").write_text(MINI_LANG, encoding="utf-8")
        (z / "words.txt").write_text(MINI_WORDS, encoding="utf-8")
        r = build()
        ok("ny kurs: bygget går igenom med bara lang.js och words.txt", r.returncode == 0, r.stdout[-400:] if r.returncode else "")
        ok("ny kurs: id-låset skapas", (z / "ids.lock").exists())
        if r.returncode:
            return "\n".join(out)

        def broken(change, name, want, warn=False):
            orig = (z / "lang.js").read_text(encoding="utf-8")
            (z / "lang.js").write_text(change(orig), encoding="utf-8")
            r = build()
            (z / "lang.js").write_text(orig, encoding="utf-8")
            good = (r.returncode == 0 if warn else r.returncode != 0) and want in r.stdout
            ok(name, good, "" if good else r.stdout[-300:])
        broken(lambda s: s.replace("  step: 1,\n", ""), "bygge: kurs utan step stoppar", "step saknas")
        broken(lambda s: s.replace("step: 1,", "step: 9,"), "bygge: step utanför 1–7 stoppar", "step ska vara 1–7")
        broken(lambda s: s.replace('level: "A1"', 'level: "B2"'), "bygge: level som inte passar steget ger en varning", "börjar inte med A1", warn=True)
        broken(lambda s: s.replace('["fr", "fr4"]', '["fr", "xx9"]'), "bygge: nextCourse-lista med en kurs som inte finns stoppar", "nextCourse 'xx9'")
        orig = (z / "lang.js").read_text(encoding="utf-8")
        (z / "lang.js").write_text(orig.replace('  nextCourse:', '  extends: "fru",\n  inherit: ["accents", "genders"],\n  nextCourse:'), encoding="utf-8")
        r = build()
        (z / "lang.js").write_text(orig, encoding="utf-8")
        ok("arv i kedja: ett fält som föräldern själv ärvt (zz1 → fru → fr) går att ärva", r.returncode == 0, r.stdout[-300:] if r.returncode else "")
        up = t / "languages" / "upcoming.json"
        orig = up.read_text(encoding="utf-8")
        up.write_text(json.dumps(json.loads(orig) + [{"code": "zz1", "name": "Franska", "course": "Testfranska 1", "step": 1, "level": "A1"}], ensure_ascii=False), encoding="utf-8")
        r = build()
        up.write_text(orig, encoding="utf-8")
        ok("bygge: kommande kurs som redan finns ger en varning", r.returncode == 0 and "zz1: kursen finns redan" in r.stdout, "" if r.returncode == 0 else r.stdout[-300:])
        r = build()
        ok("ny kurs: bygget går igenom igen", r.returncode == 0)
        head = '<script>window.COURSES_UNDER_TEST=["zz1"];</script>'
        text = run(SCENARIO_MINI, 30000, root=t)
        for name, sc, budget in [("rättelser", SCENARIO_FIXES, 5000), ("övningar", SCENARIO_KINDS, 60000)]:
            res = run(sc, budget, root=t, head=head)
            text += "\n" + "\n".join(l[:5] + "ny kurs (" + name + "): " + l[5:] if l[:5] in ("OK   ", "FEL  ") else l for l in res.splitlines())
    return "\n".join(out) + "\n" + text


# ---------------------------------------------------------------------------------------------------------
# Nya provuppgiftstyper (src/kinds/70-exam.js, backloggen): para ihop (type "match"), lucktext med flerval per lucka
# (Sprachbausteine, "gaps") och kortsvar ("short"), med rättning, resultat, tangentbord och 320 px, samt den sparade
# provsimuleringen S.exam.simRun: överlever omladdning, återupptas med den tid som var kvar, rensas när den är klar
# eller avbruten, och gamla S.exam utan fältet fungerar. Kontrollerna i build.py (check_exam_task). Egen sida.
# ---------------------------------------------------------------------------------------------------------
EXFILL = r"""<script>
// Svarar på en läs- eller höruppgift av valfri typ och lämnar in; wrong = första frågan/luckan fel
window.exFill=(t,wrong)=>{ const q=s=>document.querySelector(s), k=exKind(t);
  if(k==="mc") t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${i===0&&wrong?(x.a+1)%x.opts.length:x.a}"]`).click());
  else if(k==="pick") t.items.forEach((w,i)=>q(`.expick[data-i="${i}"] input[value="${i===0&&wrong?(w.a+1)%w.opts.length:w.a}"]`).click());
  else [...document.querySelectorAll(".exsel,.exshort")].forEach(f=>{ const i=+f.dataset.i, w=k==="gaps"?t.gaps[i]:t.items[i], bad=wrong&&i===0;
    f.value=k==="short"?(bad?"xyz":w.a[0]):String(bad?(w.a===0?1:0):w.a); f.dispatchEvent(new Event("change")); });
  q("#exdone").click(); };
</script>"""

SCENARIO_EXAMTYPES = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const bad=()=>/undefined|null|NaN|\[object/.test(q("#app").textContent);
appReady().then(async()=>{ try{
  // Rättningen av kortsvar
  ok("kortsvar: versaler, accenter, punkt och mellanslag spelar ingen roll", exShortOk({a:["beim Pförtner"]},"  BEIM  pfortner. ")&&exShortOk({a:["15. März"]},"15 marz")&&exShortOk({a:["la città"]},"La Citta"));
  ok("kortsvar: fel ord och tomt svar är fel", !exShortOk({a:["beim Pförtner"]},"Pförtnerin")&&!exShortOk({a:["Mai"]},"")&&!exShortOk({a:["Mai"]},"Juni"));
  ok("kortsvar: alla godkända varianter", exShortOk({a:["50 Euro","fünfzig Euro"]},"Fünfzig Euro"));
  const want={fr2:"match",it4:"match",it7:"gaps",de7:"gaps"}, seen={};
  for(const c of testCourses()){ useLang(c); await until(()=>L.code===c&&L.base&&!sess,5000);
    if(!hasExam()) continue;
    const ts=EX().tasks.filter(t=>["match","gaps","short"].includes(t.type));   // bildval, grafik och tal på tid: SCENARIO_EXAMTYPES2
    for(const t of ts){ seen[c+"|"+t.type]=(seen[c+"|"+t.type]||0)+1;
      delete S.exam; examTask(t.id); const n=exItems(t), fields=[...document.querySelectorAll(".exsel,.exshort")];
      ok(c+": "+t.id+" ("+t.type+") visas med ett fält per item", n>0&&fields.length===n&&!bad(), fields.length+"/"+n);
      // Tangentbord: vanliga formulärfält med etikett, i ordning
      ok(c+": "+t.id+" går med tangentbordet", fields.every(f=>(f.tagName==="SELECT"||f.tagName==="INPUT")&&f.tabIndex>=0&&(f.labels&&f.labels.length||f.getAttribute("aria-label"))));
      if(t.type==="short"){ fields[0].focus(); fields[0].dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true})); ok(c+": "+t.id+" Enter går till nästa fält", document.activeElement===fields[1]); }
      if(t.type==="match") ok(c+": "+t.id+" alternativen A–"+exLetter(t.opts.length-1)+" visas", document.querySelectorAll(".exopts li").length===t.opts.length&&fields[0].options.length===t.opts.length+1+(t.none!=null?1:0));
      if(t.type==="gaps") ok(c+": "+t.id+" luckorna sitter i texten", document.querySelectorAll(".exgaps .tl select").length===n&&!/\{\d+\}/.test(q(".exgaps").textContent));
      // 320 px: inget i uppgiften sticker ut åt sidan
      document.documentElement.style.width="320px"; const W=document.documentElement.getBoundingClientRect().right+1;
      const wide=[...app.querySelectorAll(".exopts li, .exq, .exgaps, select, input")].filter(e=>e.getBoundingClientRect().right>W);
      ok(c+": "+t.id+" får plats på 320 px", !wide.length, wide.slice(0,3).map(e=>e.className+" "+Math.round(e.getBoundingClientRect().right)).join(", "));
      document.documentElement.style.width="";
      exFill(t,true);
      const r=S.exam&&S.exam.t[t.id];
      ok(c+": "+t.id+" rättas och sparas", r&&r.pct===exPct(n-1,n)&&document.querySelectorAll(".wrong").length===1&&document.querySelectorAll(".exsel.right,.exshort.right").length===n-1, JSON.stringify(r));
      ok(c+": "+t.id+" visar resultat och facit", q("#exres").textContent.includes((n-1)+" av "+n+" rätt")&&q("#app").textContent.includes("Rätt:")&&!bad());
      ok(c+": "+t.id+" loggas som provträning", S.log[S.log.length-1].kind==="exam"&&S.log[S.log.length-1].total===n);
      q("#exnext").click(); ok(c+": "+t.id+" tillbaka till provträningen", !!q("[data-xt]"));
    }
    // Extrauppgifter (sim: false) finns i listan men inte i simuleringen
    const extra=EX().tasks.filter(t=>t.sim===false);
    if(extra.length){ openExam(); ok(c+": extrauppgifter i listan", extra.every(t=>q(`[data-xt="${t.id}"]`)));
      let never=true; for(let k=0;k<15;k++){ never=never&&simPlan().every(id=>exTask(id).sim!==false); } ok(c+": extrauppgifter ingår inte i simuleringen", never); }
  }
  ok("exempeluppgifter: minst två av varje typ i rätt kurser", seen["fr2|match"]>=2&&seen["it4|match"]>=2&&seen["it7|gaps"]>=2&&seen["de7|gaps"]>=2&&seen["de7|short"]>=2, JSON.stringify(seen));
  // Nivåmätaren räknar med de nya typerna
  useLang("de7"); await until(()=>L.code==="de7"&&L.base,5000);
  { delete S.exam; const t=EX().tasks.find(t=>t.type==="short"); examTask(t.id); exFill(t,false);
    const x=levelExam(3).parts.find(p=>p.id===t.part); ok("nivåmätaren: kortsvar räknas i provdelen", x&&x.pct===100, JSON.stringify(x)); }

  /* Sparad provsimulering (S.exam.simRun) */
  useLang("it7"); await until(()=>L.code==="it7"&&L.base,5000);
  const reload=()=>{ EXSIM=null; clearInterval(EXCLOCK); loadState(); };   // som en omladdning: S läses om från localStorage
  S.exam={t:{},sims:[{d:Date.now()-864e5,parts:{lettura:40}}]}; save();
  openExam(); ok("simRun: gammalt S.exam utan simRun fungerar", !q("#simrun")&&q("#app").textContent.includes("Tidigare simuleringar")&&!bad());
  renderStart(); ok("simRun: inget kort på startsidan utan simulering", !q("#simrun"));
  openExam(); q('[data-simp="competenza"]').click();
  { const g=EX().tasks.find(t=>t.id==="it7-ex-cl-4"); EXSIM.ids=[g.id]; for(let k=0;k<2;k++) EXSIM.ids.push(...EX().tasks.filter(t=>t.part==="competenza"&&t.id!==g.id).slice(k,k+1).map(t=>t.id)); examTask(g.id); simStore(); }
  const ids=[...EXSIM.ids], p0="competenza";
  ok("simRun: sparas när simuleringen startar", S.exam.simRun&&JSON.stringify(S.exam.simRun.ids)===JSON.stringify(ids)&&S.exam.simRun.i===0&&!!JSON.parse(localStorage.getItem(L.storageKey)).exam.simRun);
  { const f=q(".exsel"); f.value="2"; f.dispatchEvent(new Event("change")); }
  ok("simRun: svaren i uppgiften sparas", JSON.parse(localStorage.getItem(L.storageKey)).exam.simRun.cur.ans["0"]==="2");
  // Eleven stänger appen med 20 minuter kvar av delen och kommer tillbaka en timme senare
  { const st=JSON.parse(localStorage.getItem(L.storageKey)), r=st.exam.simRun; r.seen=Date.now()-3600000; r.ends[p0]=r.seen+20*60000; r.start=r.seen-5*60000; localStorage.setItem(L.storageKey,JSON.stringify(st)); }
  reload(); ok("simRun: finns kvar efter omladdning", !EXSIM&&S.exam.simRun&&S.exam.simRun.i===0);
  renderStart(); ok("simRun: kort på startsidan", !!q("#simrun")&&q("#simrun").textContent.includes("20 minuter kvar")&&q("#simrun").textContent.includes("uppgift 1 av 3".replace("u","U")), q("#simrun")&&q("#simrun").textContent.replace(/\s+/g," ").slice(0,120));
  q("#simgo").click();
  ok("simRun: återupptas med den tid som var kvar", EXSIM&&Math.abs(EXSIM.ends[p0]-Date.now()-20*60000)<5000&&/1[89]:\d\d|20:00/.test(q("#exclock").textContent), q("#exclock").textContent);
  ok("simRun: sparat svar är ifyllt", q(".exsel").value==="2");
  ok("simRun: starttiden flyttas också", Math.abs(Date.now()-EXSIM.start-5*60000)<5000);
  // Inlämnad men inte vidare till nästa: efter omladdning fortsätter den med nästa uppgift, resultatet finns kvar
  exFill(exTask(ids[0]),false); reload(); openExam(); ok("simRun: kortet i provträningen", !!q("#simrun")); q("#simgo").click();
  ok("simRun: inlämnad uppgift räknas och nästa visas", EXSIM&&EXSIM.i===1&&EXSIM.res[ids[0]]&&EXSIM.res[ids[0]].pct===100&&q("#app").textContent.includes("uppgift 2 av 3"));
  // Resten av simuleringen: klar = simRun borta och simuleringen sparad
  let g=0; while(EXSIM&&g++<10){ const t=exTask(EXSIM.ids[EXSIM.i]); exFill(t,false); q("#exnext").click(); }
  ok("simRun: rensas när simuleringen är klar", !EXSIM&&!S.exam.simRun&&S.exam.sims.length===2&&S.exam.sims[1].parts[p0]===100&&!JSON.parse(localStorage.getItem(L.storageKey)).exam.simRun, JSON.stringify(S.exam.sims[1]));
  // Avbruten: både knappen i uppgiften och på kortet
  openExam(); q("#sim").click(); ok("simRun: ny simulering sparas", !!S.exam.simRun); q("#quit").click();
  ok("simRun: rensas när den avbryts", !EXSIM&&!S.exam.simRun&&!q("#simrun"));
  openExam(); q("#sim").click(); reload(); openExam(); q("#simdrop").click(); ok("simRun: avbryt på kortet", !S.exam.simRun&&!q("#simrun"));
  // En sparad simulering med en uppgift som inte finns längre visas inte
  S.exam.simRun={ids:["finns-inte"],i:0,res:{},ends:{},start:Date.now(),seen:Date.now()}; openExam(); ok("simRun: trasig sparad simulering ignoreras", !q("#simrun")&&!bad());
  delete S.exam.simRun; save();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def test_exam_task_checks():
    """build.py: check_exam_task stoppar felaktiga uppgifter av de nya typerna."""
    sys.path.insert(0, str(ROOT))
    from build import check_exam_task
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    m = {"type": "match", "opts": ["a", "b", "c"], "items": [{"q": "x", "a": 0}, {"q": "y", "a": 2}]}
    ok("bygge: korrekt para ihop godkänns", check_exam_task(m, "t") == [])
    ok("bygge: para ihop med facit utanför opts stoppar", check_exam_task({**m, "items": [{"q": "x", "a": 5}]}, "t") != [])
    ok("bygge: para ihop med samma facit två gånger stoppar (utan reuse)", check_exam_task({**m, "items": [{"q": "x", "a": 1}, {"q": "y", "a": 1}]}, "t") != []
       and check_exam_task({**m, "reuse": True, "items": [{"q": "x", "a": 1}, {"q": "y", "a": 1}]}, "t") == [])
    ok("bygge: a = -1 kräver none", check_exam_task({**m, "items": [{"q": "x", "a": -1}]}, "t") != [] and check_exam_task({**m, "none": "", "items": [{"q": "x", "a": -1}]}, "t") == [])
    g = {"type": "gaps", "lines": [{"fr": "a {1} b {2}"}], "gaps": [{"opts": ["x", "y"], "a": 0}, {"opts": ["x", "y"], "a": 1}]}
    ok("bygge: korrekt lucktext godkänns", check_exam_task(g, "t") == [])
    ok("bygge: lucktext där markörerna inte stämmer stoppar", check_exam_task({**g, "lines": [{"fr": "a {2} b {1}"}]}, "t") != [] and check_exam_task({**g, "lines": [{"fr": "a {1}"}]}, "t") != [])
    ok("bygge: lucktext med bank", check_exam_task({**g, "bank": ["x", "y", "z"], "gaps": [{"a": 2}, {"a": 0}]}, "t") == []
       and check_exam_task({**g, "bank": ["x", "y"], "gaps": [{"a": 1}, {"a": 1}]}, "t") != [])
    ok("bygge: kortsvar utan godkända svar stoppar", check_exam_task({"type": "short", "items": [{"q": "x", "a": []}]}, "t") != []
       and check_exam_task({"type": "short", "items": [{"q": "x", "a": ["y"]}]}, "t") == [])
    ok("bygge: okänd type stoppar", check_exam_task({"type": "quiz"}, "t") != [])
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------------------
# Provträning, fler typer och nivåer (src/kinds/70-exam.js och 80-level.js, backloggen "Fler provuppgiftstyper" och
# "Provträning med två nivåer i samma kurs"): hela provet per nivå (Franska 3: DELF B1 och DELF A2), nivåmätaren räknar
# varje del mot sin nivå, provets egen skala (DELF /25, TestDaF TDN 3–5), grafikbeskrivning (type "chart"), talat
# svar på tid (type "timed" och tala med speak) och bildval (type "pick"). Kontrollerna i build.py. Egen sida.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_EXAMTYPES2 = r"""<script>
const out=[]; const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const bad=()=>/undefined|null|NaN|\[object/.test(q("#app").textContent);
const crit={kriterier:[{namn:"A",poang:4},{namn:"B",poang:3},{namn:"C",poang:4},{namn:"D",poang:4}],helhet:"Gut.",niva:"B2"};
let prompts=[]; const mock={json:async p=>{ prompts.push(p); return JSON.parse(JSON.stringify(crit)); }};
// Inget i sidan sticker ut åt sidan på 320 px
const fits=sel=>{ document.documentElement.style.width="320px"; const W=document.documentElement.getBoundingClientRect().right+1;
  const wide=qa(sel).filter(e=>e.getBoundingClientRect().right>W); document.documentElement.style.width=""; return wide.map(e=>e.tagName+"."+(e.className.baseVal??e.className)); };
const words="Die Grafik zeigt deutlich wie sich die Zahlen zwischen den Jahren verändert haben und warum das so ist meiner Meinung nach";
appReady().then(async()=>{ try{
  const keep=SAMPLE; SAMPLE=mock;
  /* 1. Två nivåer i samma kurs (Franska 3) */
  useLang("fr"); await until(()=>L.code==="fr"&&L.base&&!sess,5000);
  ok("nivåer: Franska 3 har B1 och A2", JSON.stringify(simLvs())==='["B1","A2"]', JSON.stringify(simLvs()));
  S.exam={t:{},sims:[]}; delete S.drafts; delete S.fb; openExam();
  const a2=q('[data-simlv="A2"]');
  ok("nivåer: en knapp för hela provet per nivå", q("#sim").textContent.includes("DELF B1 · hela provet")&&a2&&a2.textContent.includes("DELF A2 · hela provet")&&a2.textContent.includes("(100 minuter)"), a2&&a2.textContent);
  q("#sim").click(); ok("nivåer: B1-simuleringen tar bara B1-uppgifter", EXSIM.lv==="B1"&&EXSIM.ids.every(id=>exTaskLv(exTask(id))==="B1"&&!exPart(exTask(id).part).level), EXSIM.ids.join(",")); q("#quit").click();
  openExam(); q('[data-simlv="A2"]').click();
  ok("nivåer: A2-simuleringen tar bara A2-delarna, en per övning", EXSIM&&EXSIM.lv==="A2"&&EXSIM.ids.length===EX().tasks.filter(t=>simTaskOk(t,"A2")).length&&EXSIM.ids.every(id=>/-a2$/.test(exTask(id).part)), EXSIM&&EXSIM.ids.join(","));
  let g=0; while(EXSIM&&g++<20){ const t=exTask(EXSIM.ids[EXSIM.i]);
    if(exItems(t)){ exFill(t,false); q("#exnext").click(); }
    else { q("#xtext").value="J'habite à Stockholm avec ma famille et j'aime beaucoup la musique, surtout le piano et la guitare."; q("#exdone").click(); await until(()=>(S.exam.t[t.id]||{}).pct!=null); q("#exnext").click(); } }
  const s2=S.exam.sims[S.exam.sims.length-1];
  ok("nivåer: A2-simuleringen sparas med nivån och bara A2-delar", s2&&s2.lv==="A2"&&Object.keys(s2.parts).every(p=>/-a2$/.test(p)), JSON.stringify(s2));
  ok("skala: simuleringens resultat i DELF-poäng", q("#app").textContent.includes("Resultat av simuleringen: DELF A2")&&q("#app").textContent.includes("/25 p")&&q("#app").textContent.includes("poäng i de här delarna")&&!bad(), q("#app").textContent.replace(/\s+/g," ").slice(0,300));
  // Nivåmätaren: varje del mot sin nivå
  S.exam={t:{},sims:[{d:Date.now(),parts:{"co-a2":90,"ce-a2":90,"co":30},tasks:{},lv:"A2"}]};
  { const x=levelExam(3), pa=x.parts.filter(p=>/-a2$/.test(p.id)), pb=x.parts.find(p=>p.id==="co");
    ok("nivåmätaren: godkänt DELF A2 ger belägg för A2, inte B1", pa.length===2&&pa.every(p=>Math.abs(p.lv-2)<.01), JSON.stringify(pa));
    ok("nivåmätaren: B1-delen räknas mot B1", pb&&Math.abs(pb.lv-(2+30/50))<.01, JSON.stringify(pb));
    ok("nivåmätaren: A2-delar listas inte som saknade B1-delar", !x.missing.some(m=>/A2/.test(m))&&x.missing.includes("Läsförståelse"), JSON.stringify(x.missing));
    const e=levelEstimate(); ok("nivåmätaren: ett godkänt A2 är inte det som drar ner mest", !e.weak||!/a2/i.test(e.weak.what), e.weak&&e.weak.what);
    setView("stats"); ok("nivåmätaren: A2-delarna visas och förklaras", q("#lvl").textContent.includes("Hörförståelse A2 90 %")&&q("#lvl").textContent.includes("räknas mot sin egen nivå"), q("#lvl").textContent.replace(/\s+/g," ").slice(0,400)); }
  S.exam={t:{},sims:[]};
  /* 2. Provets skala */
  ok("skala: DELF och TDN", exScaleOf(null,"co")==="delf"&&exScaleText(50,"delf")==="12,5/25 p"&&exScaleText(100,"delf")==="25/25 p"
    &&exTdn(85)==="TDN 5"&&exTdn(65)==="TDN 4"&&exTdn(45)==="TDN 3"&&exTdn(20)==="under TDN 3");
  { const t=EX().tasks.find(t=>t.qs&&t.part==="ce"); examTask(t.id); exFill(t,false); ok("skala: DELF-uppgiftens resultat av 25", q("#exres").textContent.includes("100 % · 25/25 p"), q("#exres").textContent.slice(0,80)); }
  /* 3. Grafikbeskrivning (de7) */
  useLang("de7"); await until(()=>L.code==="de7"&&L.base&&!sess,5000);
  const seen={}; const count=(c,k)=>seen[c+"|"+k]=(seen[c+"|"+k]||0)+1;
  ok("skala: Goethe i procent, TestDaF-uppgifter i TDN", exScaleOf(EX().tasks.find(t=>t.qs))==="pct"&&EX().tasks.filter(t=>t.type==="chart"||t.type==="timed").every(t=>exScaleOf(t)==="tdn"));
  for(const t of EX().tasks.filter(t=>t.type==="chart")){ count("de7","chart"); delete S.exam; delete S.fb; delete S.drafts; prompts=[];
    examTask(t.id); const c=t.chart, svg=q("svg.chart"), marks=c.kind==="bar"?qa("svg.chart path").length:qa("svg.chart circle").length;
    ok("grafik: "+t.id+" ritas som SVG ("+c.kind+")", svg&&svg.getAttribute("role")==="img"&&marks===c.labels.length*c.series.length&&!bad(), marks);
    ok("grafik: "+t.id+" förklaring och tabell", qa(".exchart .legend span").length===(c.series.length>1?c.series.length:0)&&qa(".exchart table tr").length===c.labels.length+1&&q(".exchart figcaption").textContent.includes(c.title));
    ok("grafik: "+t.id+" värden som tips", qa("svg.chart [data-tip]").length>=c.labels.length);
    const mark=q(c.kind==="bar"?"svg.chart path":"svg.chart circle");
    document.documentElement.dataset.theme="light"; const fl=getComputedStyle(mark).fill; document.documentElement.dataset.theme="dark"; const fd=getComputedStyle(mark).fill; delete document.documentElement.dataset.theme;
    ok("grafik: "+t.id+" mörkt läge", fl&&fd&&fl!==fd, fl+" / "+fd);
    const wide=fits(".exchart, .exchart *, .extask, textarea"); ok("grafik: "+t.id+" får plats på 320 px", !wide.length, wide.slice(0,3).join(", "));
    ok("grafik: "+t.id+" ordantal 100–150", q("#xcount").textContent.includes("(100–150)"), q("#xcount").textContent);
    q("#xtext").value=words; q("#xtext").dispatchEvent(new Event("input")); q("#exdone").click(); await until(()=>(S.exam&&S.exam.t[t.id]||{}).pct!=null);
    ok("grafik: "+t.id+" bedöms av Claude med grafikens siffror och provets nivå", prompts.length===1&&prompts[0].includes(c.series[0].name+": "+c.labels[0]+" = "+c.series[0].values[0])&&prompts[0].includes("nivå C1")&&prompts[0].includes("100–150 ord"), prompts[0]&&prompts[0].slice(0,200));
    ok("grafik: "+t.id+" resultat i TDN", S.exam.t[t.id].pct===75&&q("#exres").textContent.includes("TDN 4"), q("#exres").textContent.slice(0,120));
  }
  { let never=true; for(let k=0;k<10;k++) never=never&&simPlan().every(id=>!["chart","timed"].includes(exTask(id).type)); ok("grafik och tal på tid: ingår inte i simuleringen", never); }
  /* 4. Talat svar på tid (de7) */
  for(const t0 of EX().tasks.filter(t=>t.type==="timed")){ count("de7","timed"); delete S.exam; delete S.fb; delete S.drafts; prompts=[];
    openExam(); ok("tal på tid: "+t0.id+" i listan med sekunder", q(`[data-xt="${t0.id}"]`).textContent.includes(exSecs(t0.prep)+" förberedelse + "+exSecs(t0.speak)+" tal"), q(`[data-xt="${t0.id}"]`).textContent.replace(/\s+/g," "));
    const t={...t0}; EX().tasks.push(Object.assign(t,{id:"tmp-timed",prep:1,speak:1}));
    examTask("tmp-timed"); ok("tal på tid: "+t0.id+" visar timern", !!q("#tstart")&&!q("#talk")&&q("#exclock").textContent.includes("Förberedelse 1 s")&&!bad());
    q("#tstart").click(); ok("tal på tid: förberedelsen börjar", q("#tphase").dataset.phase==="prep"&&!q("#tskip").hidden);
    await until(()=>q("#tphase").dataset.phase==="speak",4000); ok("tal på tid: taltiden börjar av sig själv", q("#tphase").dataset.phase==="speak"&&q("#exclock").textContent.includes("Taltid"));
    await until(()=>q("#tphase").dataset.phase==="done",4000); ok("tal på tid: tiden tar slut", q("#tphase").dataset.phase==="done"&&!q("#tstart").hidden&&q("#tstart").textContent==="Börja om");
    q("#tstart").click(); q("#tskip").click(); ok("tal på tid: hoppa över förberedelsen", q("#tphase").dataset.phase==="speak");
    q("#xtext").value=words; q("#exdone").click(); await until(()=>(S.exam&&S.exam.t["tmp-timed"]||{}).pct!=null);
    ok("tal på tid: "+t0.id+" kommentar av Claude, nivåstyrd och med tiderna", prompts.length===1&&prompts[0].includes("nivå C1")&&prompts[0].includes("1 s att tala")&&prompts[0].includes("muntlig")&&q("#exres").textContent.includes("TDN 4"), prompts[0]&&prompts[0].slice(0,160));
    EX().tasks.splice(EX().tasks.indexOf(t),1); clearInterval(EXCLOCK); }
  // En vanlig taluppgift kan få timern med speak (sekunder); utan speak är den som förut
  { const sp=EX().tasks.find(t=>exKind(t)==="speak"); examTask(sp.id); ok("tal på tid: vanlig taluppgift utan speak som förut", !!q("#talk")&&!q("#tstart"));
    const t={...sp,id:"tmp-speak",prep:30,speak:60}; EX().tasks.push(t); examTask(t.id);
    ok("tal på tid: vanlig taluppgift med speak får timern", !!q("#tstart")&&!q("#talk")&&q("#app").textContent.includes("30 s att förbereda dig")&&exKind(t)==="speak");
    EX().tasks.splice(EX().tasks.indexOf(t),1); clearInterval(EXCLOCK); }
  /* 5. Bildval (fr1, it2) */
  for(const c of ["fr1","it2"]){ useLang(c); await until(()=>L.code===c&&L.base&&!sess,5000);
    for(const t of EX().tasks.filter(t=>t.type==="pick")){ count(c,"pick"); delete S.exam; examTask(t.id); const n=exItems(t);
      const fs=qa(".expick");
      ok(c+": "+t.id+" en grupp bilder per fråga", fs.length===n&&fs.every((f,i)=>f.querySelectorAll("input[type=radio]").length===t.items[i].opts.length)&&!bad(), fs.length+"/"+n);
      ok(c+": "+t.id+" bilderna finns i uppsättningen", t.items.every(it=>it.opts.every(o=>EX_ICONS[o]))&&qa(".pickopt .ico").every(e=>e.textContent&&e.textContent!=="?"&&e.getAttribute("aria-label")));
      ok(c+": "+t.id+" går med tangentbordet", qa(".expick input").every(i=>i.tabIndex>=0&&i.closest("label"))&&fs.every(f=>f.querySelector("legend")));
      const wide=fits(".expick, .pickopt"); ok(c+": "+t.id+" får plats på 320 px", !wide.length, wide.slice(0,3).join(", "));
      exFill(t,true); const r=S.exam&&S.exam.t[t.id];
      ok(c+": "+t.id+" rättas och sparas", r&&r.pct===exPct(n-1,n)&&qa(".pickopt.right").length===n&&qa(".pickopt.wrong").length===1, JSON.stringify(r));
      ok(c+": "+t.id+" visar facit och resultat", q("#app").textContent.includes("Rätt:")&&q("#exres").textContent.includes((n-1)+" av "+n+" rätt")&&!bad());
      ok(c+": "+t.id+" loggas som provträning", S.log[S.log.length-1].kind==="exam"&&S.log[S.log.length-1].total===n);
      if(t.plays) ok(c+": "+t.id+" hörtexten visas efter inlämningen", !q("#lines").hidden);
    }
    // Bildval i en sparad simulering: svaret sparas och läses tillbaka
    { const t=EX().tasks.find(t=>t.type==="pick"&&simOk(t)); if(t){ EXSIM={ids:[t.id],i:0,res:{},ends:{},start:Date.now(),code:L.code}; examTask(t.id);
      q('.expick[data-i="0"] input[value="1"]').click(); const saved=S.exam.simRun&&S.exam.simRun.cur&&S.exam.simRun.cur.ans["0"];
      examTask(t.id); ok(c+": bildval i simuleringen sparar svaret", saved==="1"&&q('.expick[data-i="0"] input[value="1"]').checked&&q('.expick[data-i="0"] .pickopt.on'));
      simDrop(); } }
  }
  ok("exempeluppgifter: två av varje ny typ", seen["fr1|pick"]>=2&&seen["it2|pick"]>=2&&seen["de7|chart"]>=2&&seen["de7|timed"]>=2, JSON.stringify(seen));
  SAMPLE=keep;
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def test_exam_task_checks2():
    """build.py: check_exam_task för bildval, grafik och tal på tid."""
    sys.path.insert(0, str(ROOT))
    from build import check_exam_task
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    p = {"type": "pick", "items": [{"q": "x", "opts": ["sol", "regn", "kl8.30"], "a": 2}]}
    ok("bygge: korrekt bildval godkänns", check_exam_task(p, "t") == [], check_exam_task(p, "t"))
    ok("bygge: bildval med okänd bild stoppar", check_exam_task({**p, "items": [{"q": "x", "opts": ["sol", "enhörning"], "a": 0}]}, "t") != []
       and check_exam_task({**p, "items": [{"q": "x", "opts": ["sol", "kl13"], "a": 0}]}, "t") != [])
    ok("bygge: bildval med facit utanför stoppar", check_exam_task({**p, "items": [{"q": "x", "opts": ["sol", "regn"], "a": 2}]}, "t") != [])
    ch = {"type": "chart", "task": "Beschreiben Sie", "minWords": 100, "maxWords": 150,
          "chart": {"kind": "bar", "title": "T", "labels": ["a", "b"], "series": [{"name": "2015", "values": [1, 2]}]}}
    ok("bygge: korrekt grafik godkänns", check_exam_task(ch, "t") == [], check_exam_task(ch, "t"))
    ok("bygge: grafik med fel antal värden eller okänd kind stoppar", check_exam_task({**ch, "chart": {**ch["chart"], "series": [{"name": "x", "values": [1]}]}}, "t") != []
       and check_exam_task({**ch, "chart": {**ch["chart"], "kind": "pie"}}, "t") != [])
    ok("bygge: grafik med maxWords under minWords stoppar", check_exam_task({**ch, "maxWords": 50}, "t") != [])
    tm = {"type": "timed", "task": "Sprechen Sie", "prep": 60, "speak": 90}
    ok("bygge: korrekt tal på tid godkänns", check_exam_task(tm, "t") == [])
    ok("bygge: tal på tid utan speak eller med minuter som text stoppar", check_exam_task({**tm, "speak": None}, "t") != [] and check_exam_task({**tm, "prep": "1"}, "t") != [])
    ok("bygge: vanlig taluppgift med speak kontrolleras", check_exam_task({"task": "x", "prep": 30, "speak": 5}, "t") != [] and check_exam_task({"task": "x", "prep": 30, "speak": 60}, "t") == [])
    ok("bygge: okänd skala stoppar", check_exam_task({"scale": "poäng"}, "t") != [] and check_exam_task({"scale": "tdn"}, "t") == [])
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------------------
# Provträningen hämtas vid behov och index.html under 420 kB (backloggen "P2: Datafilerna är stora för en telefon",
# 2026-09-30): content.exam ligger i dist/data/<kod>-exam.json och kursens fil har bara ett index (split_exam i
# build.py); ensureExam/examWait väntar in filen i provträningen, simuleringen, skrivsidans provuppgifter och Tala.
# Startsidan, skrivsidans lista, nivåmätaren och planen klarar sig med indexet. Koden och stilen minifieras i bygget.
# ---------------------------------------------------------------------------------------------------------
SCENARIO_EXAMLAZY = r"""<script>
const out=[]; const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=(f,ms=6000)=>new Promise(r=>{const t0=Date.now();(function p(){let v=false;try{v=f()}catch(e){} if(v||Date.now()-t0>ms)r(v);else setTimeout(p,50)})()});
const fetched=()=>performance.getEntriesByType("resource").map(e=>e.name).filter(n=>/-exam\.json/.test(n));
const heavy=t=>["qs","lines","items","gaps","task","instr","model","criteria","chart","opts"].some(k=>k in t);
const pick=async c=>{ q("#course").value=c; q("#course").dispatchEvent(new Event("change")); await wait(()=>L.code===c&&L.base); };
setTimeout(async()=>{ try{
  await wait(()=>L&&L.base&&WORDS&&WORDS.length);
  if(!hasExam()) await pick("fr");
  const c0=L.code;
  ok("provindex: kursens fil har bara provets index", EX().lazy===true&&!examReady()&&hasExam()&&!EX().tasks.some(heavy)&&EX().tasks.every(t=>t.k), c0);
  renderStart(); setView("stats");
  const lv=levelEstimate();
  ok("provindex: startsidan, statistiken och nivåmätaren hämtar inte provet", !fetched().length&&lv.exam&&lv.exam.examName===EX().name&&!__err.length, fetched().join());
  openWriting(); const nw=EX().tasks.filter(t=>exKind(t)==="write").length;
  ok("provindex: skrivsidan listar provets skrivuppgifter ur indexet", nw>0&&qa("[data-pickx]").length===nw&&!fetched().length, qa("[data-pickx]").length+" av "+nw);
  if(L.plan){ openPlan(); ok("provindex: planen visas utan provfilen", !!q("#app .panel")&&!fetched().length&&!__err.length); }
  // Offline: hämtningen misslyckas, ett vänligt meddelande och Försök igen
  const f0=window.fetch; window.fetch=(u,...a)=>/-exam\.json/.test(String(u))?Promise.reject(new TypeError("Failed to fetch")):f0(u,...a);
  openExam(); ok("provfil: provträningen visar att provet hämtas", !!q("#exwait")&&q("#app").textContent.includes("Hämtar provuppgifterna"));
  await wait(()=>q("#exretry"));
  ok("provfil: offline ger ett vänligt meddelande med Försök igen", !!q("#exretry")&&q("#app").textContent.includes("kunde inte hämtas")&&!examReady()&&!!q("#quit"));
  window.fetch=f0; q("#exretry").click();
  await wait(()=>q("[data-xt]"));
  const f=fetched();
  ok("provfil: Försök igen hämtar data/<kod>-exam.json (med hash) och öppnar provträningen", examReady()&&!EX().lazy&&qa("[data-xt]").length===EX().tasks.length&&f.length===1&&f[0].includes("data/"+c0+"-exam.json?v="+DATA_VERSION[c0+"-exam"]), f.join());
  { const t=EX().tasks.find(t=>t.qs); examTask(t.id); ok("provfil: uppgiften visas med frågorna", qa(".exq").length===t.qs.length&&!!q("#exclock")); }
  openExam(); ok("provfil: hämtas bara en gång", fetched().length===1&&!!q("[data-xt]"));
  // En annan kurs: Tala väntar in provets taluppgifter
  await pick("de");
  ok("provfil: ny kurs börjar med indexet", !examReady()&&hasExam());
  openTalk(); ok("tala: väntar på provfilen", !!q("#exwait"));
  await wait(()=>q("[data-talk]"));
  ok("tala: provets taluppgifter efter hämtningen", examReady()&&qa('[data-talk^="x:"]').length===EX().tasks.filter(t=>exKind(t)==="speak").length&&qa('[data-talk^="x:"]').length>0);
  // Skrivsidans provuppgift (openFrom → examTask) i en kurs där provet inte är hämtat
  await pick("de4");
  openWriting(); q("[data-pickx]").click(); ok("skriv: provuppgiften väntar på provfilen", !!q("#exwait"));
  await wait(()=>q("#xtext")); ok("skriv: provuppgiften öppnas med uppgiftstexten", !!q("#xtext")&&examReady());
  // Tillbaka medan provet hämtas: ingen skärm dyker upp efteråt
  await pick("de6");
  openExam(); q("#quit").click(); await wait(()=>examReady());
  await wait(()=>false,300);
  ok("prov: Tillbaka under hämtningen stannar på startsidan", examReady()&&!q("[data-xt]")&&!q("#exwait"));
  // Provsimuleringen från planen/listan: startExamSim väntar
  await pick("de7");
  startExamSim(); ok("simulering: väntar på provfilen", !!q("#exwait")&&!EXSIM);
  await wait(()=>q("#exclock")); ok("simulering: startar efter hämtningen", !!EXSIM&&!!q("#exclock")&&examReady());
  q("#quit").click();
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},300);
</script>"""


def test_exam_split():
    """build.py: provet i egna filer, indexet i kursens fil, minifieringen och storleken på index.html."""
    sys.path.insert(0, str(ROOT))
    from build import split_exam, minify_js, minify_css, MAX_PAGE_KB
    import json as _json
    out = []
    ok = lambda name, cond, info="": out.append(("OK   " if cond else "FEL  ") + name + (f"  ({info})" if info else ""))
    data, page = ROOT / "dist" / "data", (ROOT / "dist" / "index.html").read_text(encoding="utf-8")
    codes = sorted(p.stem for p in data.glob("*.json") if not p.stem.endswith("-exam"))
    dv = _json.loads(re.search(r"const DATA_VERSION\s*=\s*(\{.*?\});", page).group(1))
    bad = []
    for c in codes:
        ex = _json.loads((data / f"{c}.json").read_text(encoding="utf-8")).get("content", {}).get("exam")
        src = ROOT / "languages" / c / "content" / "exam.json"
        f = data / f"{c}-exam.json"
        if not ex:
            if f.exists():
                bad.append(c + ": provfil utan prov")
            continue
        full = _json.loads(f.read_text(encoding="utf-8")) if f.exists() else None
        if not full or not ex.get("lazy") or f"{c}-exam" not in dv:
            bad.append(c + ": provfilen eller DATA_VERSION saknas")
            continue
        if [t["id"] for t in ex["tasks"]] != [t["id"] for t in full["tasks"]] or any(k in t for t in ex["tasks"] for k in ("qs", "lines", "items", "task")):
            bad.append(c + ": indexet stämmer inte med provfilen")
        if src.exists() and len(full["tasks"]) < len(_json.loads(src.read_text(encoding="utf-8")).get("tasks", [])):
            bad.append(c + ": provfilen saknar uppgifter")
    ok("provfil: varje kurs med prov har data/<kod>-exam.json, ett index och en egen hash", not bad and any((data / f"{c}-exam.json").exists() for c in codes), bad)
    idx, full = split_exam({"name": "DELF B1", "pass": 50, "parts": [{"id": "ce"}], "tasks": [
        {"id": "a", "part": "ce", "title": "A", "qs": [{"q": "?", "a": 0}], "lines": [{"fr": "x"}]},
        {"id": "b", "part": "pe", "minWords": 160, "task": "Écris"}, {"id": "c", "part": "po", "task": "Parle", "prep": 10},
        {"id": "d", "part": "ce", "type": "match", "items": []}]})
    ok("provfil: split_exam räknar typen som exKind och behåller provets fält", [t["k"] for t in idx["tasks"]] == ["mc", "write", "speak", "match"]
       and idx["lazy"] and idx["name"] == "DELF B1" and idx["parts"] == [{"id": "ce"}] and "qs" not in idx["tasks"][0] and full["tasks"][0]["qs"], idx)
    js = 'const a=1 // kommentar\nconst s="// inte /* en kommentar */", t=`x ${a+`${`}`}`} // y`;\nlet r=/[/]\\/"/g, d=a/2/1\nreturn\nx\na = b\n++c\n/* block */ f(a - -1, a+ +1)'
    m = minify_js(js)
    ok("minifiering: strängar, mallsträngar och reguljära uttryck orörda, kommentarer borta", '"// inte /* en kommentar */"' in m and "`x ${a+`${`}`}`} // y`" in m
       and "/[/]\\/\"/g" in m and "a/2/1" in m and "kommentar\n" not in m and "block" not in m, m)
    ok("minifiering: radbrytningar som betyder något behålls", "return\nx" in m and "b\n++c" in m and "a- -1" in m and "a+ +1" in m, m)
    ok("minifiering: CSS", minify_css('a > b , c { color : red ; content: "a  ;  b" } /* x */ .d :hover{width:calc(1px + 2px)}')
       == 'a>b,c{color : red;content: "a  ;  b"}.d :hover{width:calc(1px + 2px)}', minify_css('a > b , c { color : red ; content: "a  ;  b" } /* x */ .d :hover{width:calc(1px + 2px)}'))
    kb = len(page.encode()) / 1024
    ok(f"storlek: dist/index.html under {MAX_PAGE_KB} kB", kb < MAX_PAGE_KB and MAX_PAGE_KB <= 420, f"{kb:.0f} kB")
    return "\n".join(out)


# ---------------------------------------------------------------------------------------------------------
# Kodstädning och prestanda (2026-10-01, BACKLOG P3): död kod borta, sparningen per svar (save(true), cloudDocs utan
# kopia och med cache per bit), billigare flerval och listWord, grundformer ur hela språket (data/lemma-<språk>.json)
# och Veckans äkta ljud (46-akta-ljud.js).
# ---------------------------------------------------------------------------------------------------------
SCENARIO_KOD = r"""<script>
const out=[]; const q=s=>document.querySelector(s);
const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const canonJ=x=>JSON.stringify(x,(k,v)=>v&&typeof v==="object"&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
appReady().then(async()=>{ try{
  document.documentElement.dataset.theme="light";
  // 1. Död kod
  ok("död kod: dayStart, ktKey och vyerna MC/TYPE/RESTORE/EFFECT/RECAP/AFTER/AGAIN/KIND_NAMES finns inte", ["dayStart","ktKey","kindView","MC","TYPE","RESTORE","EFFECT","RECAP","AFTER","AGAIN","KIND_NAMES"].every(n=>{try{ return eval("typeof "+n)==="undefined"; }catch(e){ return true; }})&&typeof DAY==="number");
  // 2. Sparning: save(true) väntar, men skrivs vid pagehide, efter LOCAL_WAIT, före kursbyte och vid nästa vanliga save()
  { useLang("de"); const key=L.storageKey; save(); S.newCount=11; save(true);
    const raw=()=>JSON.parse(localStorage.getItem(key)||"{}");
    ok("save(true): localStorage skrivs inte direkt", raw().newCount!==11);
    window.dispatchEvent(new Event("pagehide")); ok("save(true): skrivs när sidan döljs (pagehide)", raw().newCount===11);
    S.newCount=12; save(true); await until(()=>raw().newCount===12,2000); ok("save(true): skrivs inom LOCAL_WAIT ms", raw().newCount===12);
    S.newCount=13; save(true); useLang("fr"); ok("save(true): kursbyte skriver den väntande kursen under rätt nyckel", raw().newCount===13&&L.storageKey!==key);
    useLang("de"); ok("save(true): läget finns kvar efter bytet tillbaka", S.newCount===13);
    S.newCount=14; save(true); save(); ok("save(): en vanlig sparning skriver direkt", raw().newCount===14&&!LOCAL_PENDING); }
  { let snaps=0; const sv=save; window.save=s=>{ if(s===true) snaps++; sv(s); }; startDict(); window.save=sv; quitSession();
    ok("snapRun sparar med save(true)", snaps>=1, snaps); }
  // 3. Molnbitarna: samma innehåll som förut, ingen kopia, rev ur cachen
  { const now=Date.now(), st={pass:9,t:now,newCount:10,w:{},log:[],runs:{a:{x:1}},extraField:"x"};
    WORDS.slice(0,1500).forEach((w,i)=>st.w[w.id]={s:i%6,due:3,dd:now+i,f:"type",mcR:i%5});
    for(let i=0;i<1300;i++) st.log.push({p:i,d:now-i*1e6,dur:200,right:9,total:10,kind:"words",pad:"x".repeat(120)});
    const a=cloudDocs(st,"kodtest"), names=Object.keys(a.docs);
    const back=cloudJoin({head:a.main.head},names,names.map(n=>JSON.parse(a.docs[n].j)));
    ok("cloudDocs: bitarna sätts ihop till samma läge (ord, logg i flera bitar, huvud)", canonJ(back)===canonJ(st)&&names.filter(n=>/^log/.test(n)).length>=2, names.join(","));
    ok("cloudDocs: rev = hash av bitens JSON", names.every(n=>a.docs[n].rev===hash(a.docs[n].j)&&a.main.parts[n]===a.docs[n].rev));
    const b=cloudDocs(st,"kodtest"); ok("cloudDocs: oförändrade bitar får samma rev", canonJ(b.main.parts)===canonJ(a.main.parts));
    const id=Object.keys(st.w)[3]; st.w[id].s=5; st.w[id].mcR=99; const c=cloudDocs(st,"kodtest"), ch=names.filter(n=>c.main.parts[n]!==a.main.parts[n]);
    ok("cloudDocs: en ändring i ett ord ändrar bara den biten", ch.length===1&&/^w\d+$/.test(ch[0]), ch.join());
    // Ögonblicksbild: ändras läget medan molnet skriver, skrivs det läge som gällde när sparningen började
    const K="glosor-kodtest-v1", P="data/users/u_test/"+K, st2={pass:1,t:now,w:{hej:{s:1}},log:[]};
    const p=cloudWrite(K,st2); st2.w.hej.s=3; st2.w.nytt={s:0}; await p;
    const wd=Object.keys(__remote).filter(k=>k.startsWith(P+"~w")).map(k=>__remote[k].data).reduce((x,y)=>Object.assign(x,y),{});
    ok("cloudWrite: skriver läget som det var när sparningen började", wd.hej&&wd.hej.s===1&&!wd.nytt, JSON.stringify(wd)); }
  // 4. Flerval utan att blanda hela ordlistan
  { const w=WORDS.find(x=>x.sec!=="mine"); let bad=0;
    for(let i=0;i<200;i++){ const o=mcOptions(w), sv=o.map(x=>x.sv); if(o.length!==5||!o.includes(w)||new Set(sv).size!==5) bad++; }
    ok("mcOptions: fem alternativ, rätt ord med, alla betydelser olika", !bad, bad);
    const few=WORDS.filter(x=>x.sec===w.sec&&x.sv!==w.sv).length, other=Array.from({length:100},()=>mcOptions(w)).flat().filter(x=>x.sec!==w.sec).length;
    ok("mcOptions: samma avsnitt först, andra avsnitt bara när det behövs", few>=4?other===0:other>0, few+" "+other);
    const cw=WORDS.find(x=>x.gap); let bad2=0;
    for(let i=0;i<100;i++){ const d=KINDS.cloze.mc({w:cw}), l=d.opts.map(o=>norm(o.label)); if(new Set(l).size!==l.length||d.opts.filter(o=>o.ok).length!==1||l.length<2) bad2++; }
    ok("meningar: flervalet har unika alternativ och ett rätt", !bad2, bad2);
    const xs=pickSome([1,2,3,4,5,6,7,8,9,10],3,x=>x%2===0); ok("pickSome: n olika element som klarar villkoret", xs.length===3&&new Set(xs).size===3&&xs.every(x=>x%2===0), xs.join());
    const seen=new Set(); for(let i=0;i<300;i++) seen.add(pickSome([1,2,3,4],1,()=>true)[0]); ok("pickSome: alla element kan väljas", seen.size===4); }
  // 5. listWord med uppslag ger samma svar som förut
  { const old=t=>WORDS.find(w=>w.sec!=="mine"&&(w.t===t||variants(w.t).includes(norm(t))));
    const forms=[...WORDS.slice(0,150).map(w=>w.t),...WORDS.slice(0,150).flatMap(w=>variants(w.t)),"xqzw","Haus","gehen","die","l'"];
    const diff=forms.filter(f=>old(f)!==listWord(f)); ok("listWord: samma ord som den gamla sökningen", !diff.length, diff.slice(0,5).join(" | ")); }
  // 6. Grundformer ur hela språket (data/lemma-<språk>.json)
  { useLang("it3"); useLang("it2"); releaseCourse("it3"); const L1=t=>(lemmaOf(t)||{}).t;
    ok("grundform: it2 saknar verso och it3 är inte hämtad", !WORDS.some(w=>w.t==="verso")&&LANGUAGES.it3.words==null);
    ok("grundform: verso → verso ur språkets fil (it3), inte versare", L1("verso")==="verso"&&!!LEMMA_ALL.it&&LEMMA_ALL.it.length>3000, L1("verso"));
    const inl=INLINE_DATA["lemma-it"], all=LEMMA_ALL.it; delete INLINE_DATA["lemma-it"]; delete LEMMA_ALL.it; LEMMA_FAIL.it=Date.now();
    const r=L1("verso"); INLINE_DATA["lemma-it"]=inl; LEMMA_ALL.it=all; delete LEMMA_FAIL.it;
    ok("grundform: utan filen fungerar det som förut (bara hämtade kurser)", r!=="verso", r);
    ok("grundform: kursens egna ord vinner över språkets fil", (()=>{ const w=WORDS.find(x=>x.sec!=="mine"&&/^[a-z]{5,}$/.test(x.t)); return !w||L1(w.t)===w.t; })()); }
  // 7. Veckans äkta ljud: bara länkar, bara på rätt nivå
  { const has=c=>{ useLang(c); openTalk(); const a=q("#realaudio a"); return a?a:null; };
    const fr=has("fr"), frs4=has("frs4"), de4=has("de4"), de=has("de"), it1=has("it1"), it4=has("it4"), fru=has("fru");
    ok("äkta ljud: inte i Franska 3, Tyska 4 eller Italienska 1", !fr&&!de4&&!it1);
    ok("äkta ljud: RFI i Franska 4 och universitetskursen, DW i Tyska 5, italienska i Italienska 4", !!frs4&&/rfi\.fr/.test(frs4.href)&&!!fru&&!!de&&/dw\.com/.test(de.href)&&!!it4);
    ok("äkta ljud: länken öppnas i en ny flik med rel=noopener, inget inbäddat", [frs4,de,it4].every(a=>a.target==="_blank"&&a.rel.includes("noopener"))&&!q("#realaudio iframe,#realaudio audio"));
    useLang("frs4"); if((C().listening||[]).length){ openListening(); ok("äkta ljud: kortet finns också under Hörförståelse", !!q("#realaudio")); }
    ok("äkta ljud: veckans tips finns", /Veckans tips/.test(q("#realaudio").textContent)); }
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""

# Den publicerade sidan hämtar data/lemma-<språk>.json med sitt hash
SCENARIO_LEMMAHTTP = r"""<script>
const out=[]; const ok=(name,cond,info="")=>out.push((cond?"OK   ":"FEL  ")+name+(info?"  ("+info+")":""));
const wait=(f,ms=6000)=>new Promise(r=>{const t0=Date.now();(function p(){if(f()||Date.now()-t0>ms)r();else setTimeout(p,50)})()});
setTimeout(async()=>{ try{
  await wait(()=>L&&WORDS&&WORDS.length);
  const lg=lemmaLang(); const a=await ensureLemmaAll();
  ok("grundformer: data/lemma-"+lg+".json hämtas i den publicerade sidan", Array.isArray(a)&&a.length>1000&&!!DATA_VERSION["lemma-"+lg], a&&a.length);
 }catch(e){ ok("undantag", false, e.message); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},300);
</script>"""


def main():
    text = run(SCENARIO) + "\n" + run(SCENARIO_DE) + "\n" + run(SCENARIO_FIXES) + "\n" + run(SCENARIO_SYNC, 30000) + "\n" + run_http(SCENARIO_HTTP)
    text += "\n" + run_http(SCENARIO_EXAMLAZY, 60000) + "\n" + test_exam_split()   # provet hämtas vid behov, minifiering, storlek (P2)
    text += "\n" + run(SCENARIO_ARCH, 30000) + "\n" + test_build_locks()   # arkitektur, del 6
    text += "\n" + test_build_checks()   # byggkontroller, arkitekturgranskning 2026-09-29
    text += "\n" + run(SCENARIO_KINDS, 60000)   # övningstyperna (src/kinds), alla kurser, två enheter, del 6
    text += "\n" + run(SCENARIO_IPA, 30000)   # transkription och satsanalys (fru)
    text += "\n" + run(SCENARIO_LEVEL, 30000)   # nivåmätaren "Var ligger jag?" (P2: Nivåmätare)
    text += "\n" + run(SCENARIO_PLAN, 30000)   # studieplanen (P2: Studieplan för självstudier)
    text += "\n" + run(SCENARIO_PLANS, 60000)   # planer för fler kurser, Tillbaka till planen (P3: Studieplan)
    text += "\n" + run(SCENARIO_EXAMSIM, 60000, head=EXFILL)   # provsimuleringen som hela provet (P2)
    text += "\n" + run(SCENARIO_EXAMTYPES, 60000, head=EXFILL) + "\n" + test_exam_task_checks()   # para ihop, lucktext, kortsvar, sparad simulering
    text += "\n" + run(SCENARIO_EXAMTYPES2, 60000, head=EXFILL) + "\n" + test_exam_task_checks2()   # nivåer, skala, grafik, tal på tid, bildval
    text += "\n" + run(SCENARIO_BUGHUNT, 30000)   # buggjakten 2026-09-29
    text += "\n" + run(SCENARIO_STREAK, 20000)   # flamman för sviten (elevens önskemål)
    text += "\n" + run(SCENARIO_TOPBACK, 20000)   # Tillbaka uppe till vänster (elevens önskemål)
    text += "\n" + run(SCENARIO_PASS, 60000)   # Dagens pass: korta pass, flera om dagen (föräldern 2026-10-01)
    text += "\n" + run(SCENARIO_SRS, 30000)   # tidsbaserad repetition i fraser, meningar och grammatik (P3), weakestFirst/srsBump (P2)
    text += "\n" + run(SCENARIO_WORDS, 30000) + "\n" + test_words_build()   # glosquizet i 05-words.js, vanligast först, "kan" kräver skrivet svar
    text += "\n" + run(SCENARIO_SELFRATE, 60000)   # självbedömning i fyra steg, grundformen i Mina ord (P3)
    text += "\n" + run(SCENARIO_ESC, 20000)   # escaping av text från datafilerna (arkitekturgranskningen, P1)
    text += "\n" + run(SCENARIO_LEVELPROMPT, 30000)   # nivåstyrd bedömning (A1–C1)
    text += "\n" + run(SCENARIO_WRITEHUB, 30000)   # skriva på ett ställe, veckans skrivuppgift (P2)
    text += "\n" + run(SCENARIO_TALK, 60000)   # Tala: 4/3/2, samtal med Claude och Skugga (P2: Ny övning Tala, Muntlig förberedelse)
    text += "\n" + run(SCENARIO_KOD, 60000) + "\n" + run_http(SCENARIO_LEMMAHTTP)   # död kod, sparning, flerval, grundformer, äkta ljud (P3)
    text += "\n" + test_minimal_course()   # en ny, liten kurs (8 → 21 kurser)
    print(text)
    sys.exit(1 if "FEL  " in text else 0)


if __name__ == "__main__":
    main()
