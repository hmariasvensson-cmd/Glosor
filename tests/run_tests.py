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
  { const w=byId["die Beziehung (-en)"], d=TYPE.cloze({w});
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
  ok("bara tyska: båda tyska kurserna i väljaren", !q(".coursepick").hidden&&[...q("#course").options].map(o=>o.value).join()==="de4,de,de6", [...q("#course").options].map(o=>o.value).join());
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
  // Franska 4 och Tyska 6 (steg 6)
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
    ok("kapitelkarta: tryck väljer kapitlet", (S.chapter&&ktKey(S.chapter)===id)||(S.src!=="auto"&&ktKey(S.src)===id), S.chapter+" "+S.src);
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
  ok("kommande kurs går inte att välja", [...q("#course").options].some(o=>o.disabled&&o.text.includes("Italienska 3")));
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
  { const bad=(C().prompts||[]).filter(p=>!writeChecks(p,p.model).every(c=>c.ok)).map(p=>p.id+": "+writeChecks(p,p.model).filter(c=>!c.ok).map(c=>c.label).join("; "));
    ok("franska: modelltexterna klarar checklistan", !bad.length, bad.join(" | ")); }
  ok("övningsgrupper", document.querySelectorAll("[data-grp]").length===5, document.querySelectorAll("[data-grp]").length);
  q('[data-grp="texts"]').click(); ok("grupp öppnas på egen sida", !!q('[data-ex="rq"]')&&!q("[data-grp]")); q("#quit").click(); ok("tillbaka från gruppen", !!q("[data-grp]"));

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

  // Dagens pass: glosor först, sedan knapp till blandad runda
  renderStart(); q("#daily").click(); while(sess&&!sess.queue) q("#next").click(); runAll();
  ok("dagens pass erbjuder blandad runda", !!q("#mix")); q("#mix").click(); runAll();

  renderStart(); ok("dagens pass försvinner när det är gjort", !q("#daily"));
  { const k=S.dailyDay; S.dailyDay="igår"; renderStart(); ok("dagens pass kommer tillbaka nästa dag", !!q("#daily")); S.dailyDay=k; }
  startDict(); answerRight(); q("#quit").click(); ok("avbruten övning sparas", S.runs&&S.runs["dict"]&&S.runs["dict"].done===1, JSON.stringify(Object.keys(S.runs||{})));
  startDict(); ok("fortsätt eller börja om", !!q("#rcont")&&!!q("#rnew")); q("#rcont").click(); ok("fortsätter där man slutade", sess&&sess.done===1); runAll();
  ok("klar övning glöms", !S.runs["dict"]);
  setSound(false); ok("ljud av", q("#sound").getAttribute("aria-pressed")==="true"&&!SOUND); setSound(true);
  setView("stats"); ok("statistik visar övningar", q("#app").textContent.includes("Diktamen"));
  ok("prognos över repetitioner", !!q(".fc"));
  { const keep=S.log.slice(); for(let i=0;i<1100;i++) S.log.push({d:Date.now()-i*1000,dur:10,right:1,total:1,kind:"dict"}); save();
    ok("gammal logg sammanfattas", S.log.length===1000&&S.logOld&&S.logOld.dur>0, S.log.length+" "+JSON.stringify(S.logOld)); S.log=keep; delete S.logOld; save(); }
  renderStart(); q('[data-gy="1"]').click(); ok("Gy25-namn", q("#coursechip").textContent.includes("fortsättning, nivå 1")); q('[data-gy="0"]').click();
  renderStart(); q('[data-only="1"]').click(); ok("bara franska: bara de franska kurserna i väljaren", onlyCourse()==="fr"&&!q(".coursepick").hidden&&[...q("#course").options].map(o=>o.value).join()==="fr,fr4,fru", [...q("#course").options].map(o=>o.value).join()); q('[data-only="0"]').click();
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
    const d=TYPE.gram({ref:x.id}); ok("rättelser: grammatiksvar med ’ godkänns", d.check(x.ans.replace(/'/g,"’")).r==="right", x.id+" "+x.ans); }
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
    let bad=0; for(let i=0;i<30;i++){ for(const d of [MC.dict({w}),MC.trans({w})]){ const l=d.opts.map(o=>tok(o.label).join(" ")); if(new Set(l).size!==l.length||d.opts.filter(o=>o.ok).length!==1) bad++; } }
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
  { const x=Object.values(XS)[0]; ok("rättelser: skugga med Tatoeba-mening återställs", x&&RESTORE.shadow(x.id).w===x&&RECAP.shadow(x.id)===x.exT); }
  ok("rättelser: saknade frågor ger null", RESTORE.lq("finns-inte:0")===null&&RESTORE.rq(((C().reading||[])[0]||{}).id+":99")===null&&RESTORE.story("x:0")===null&&RESTORE.utt("x|0|0")===null&&RECAP.utt("x|9|9")==="");
  // 4. Dagens pass efter Avbryt
  { const keep=S.dailyDay; delete S.dailyDay;
    startDict(); q("#quit").click(); renderStart();
    ok("rättelser: dagens pass syns när en annan övning är pausad", !!q("#daily")&&!!q("#run-go"));
    delete S.runs; delete S.run; startMix(); pauseSession();
    startDaily([],[]); ok("rättelser: dagens pass frågar om den påbörjade rundan", !!q("#rnew")); q("#rnew").click();
    ok("rättelser: Börja om i dagens pass räknas som dagens pass", sess&&sess.daily===true&&S.run&&S.run.daily===true);
    pauseSession(); renderStart(); ok("rättelser: pausat dagens pass döljer panelen", !q("#daily")&&!!q("#run-go"));
    startDaily([],[]); q("#rcont").click(); ok("rättelser: Fortsätt i dagens pass räknas som dagens pass", sess&&sess.daily===true);
    quitSession(); S.dailyDay=keep; }
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
  for(const c of Object.keys(LANGUAGES)){ useLang(c);
    if(c==="fr4"){ const p={min:1,max:200,need:{connectors:2}}, a=writeChecks(p,"Il pleut, c’est pourquoi je reste, alors que tu sors.")[1];
      ok("rättelser: fr4 c’est pourquoi och alors que", a.ok&&a.label.includes("c'est pourquoi")&&a.label.includes("alors que")&&!/alors,|alors\)/.test(a.label), a.label);
      ok("rättelser: fr4 éclairait är inte conditionnel", !L.tenseCheck.conditionnel("La lune éclairait la rue.")&&L.tenseCheck.conditionnel("Je voudrais venir.")); }
    if(c==="de") ok("rättelser: usesWord der Lehrer", usesWord("Mein Lehrer ist nett.",{id:"x-t",t:"der Lehrer",g:"m"}));
    if(c==="it1") ok("rättelser: usesWord l'insalata och il libro", usesWord("Mangio un’insalata.",{id:"x-t",t:"l'insalata",g:"f"})&&usesWord("Leggo un libro.",{id:"x-t2",t:"il libro",g:"m"}));
    const glued=[], few=[]; let n=0;
    errBase().forEach(b=>errAlts(b).forEach(i=>{ n++; const x=errItem(`err|${b.id}|${i}`), bad=x.bad, pre=b.p.parts[0], post=b.p.parts[1];
      if((/\p{L}$/u.test(pre)&&/^\p{L}/u.test(bad))||(/\p{L}$/u.test(bad)&&/^\p{L}/u.test(post))||/'\s/.test(gapos(bad)+post.slice(0,1))) glued.push(x.wrongText);
      if(x.opts.length<4) few.push(b.id); }));
    ok(`rättelser: ${c}: Hitta felet utan ihopklistrade ord`, n>0&&!glued.length, n+" "+glued.slice(0,3).join(" | "));
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


def run(scenario, budget=5000):
    page = (ROOT / "dist" / "preview.html").read_text(encoding="utf-8")
    html = page.replace("<title>", SEED + "<title>", 1).replace("</body></html>", scenario + "</body></html>")
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
  ok("byte av kurs hämtar nästa kurs", L.code===other&&WORDS.length>200, other);
 }catch(e){ ok("undantag", false, e.message); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
},300);
</script>"""


def run_http(scenario):
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
                                  "--virtual-time-budget=8000", f"http://127.0.0.1:{srv.server_address[1]}/test.html"], stdout=fh, stderr=subprocess.DEVNULL)
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
// Förväntat per kurs, taget från versionen med getters (före extends)
const TEXTS=["Ich habe gestern gearbeitet. Er war müde und hätte gern geschlafen.","Das Haus wird gebaut. Sie sagte, sie sei krank.",
  "Hier j'ai mangé une pomme. Il faisait beau. Je voudrais que tu sois là. Si j'avais su, je serais venu.","Je parlerais si je pouvais. Il faut qu'il finisse.",
  "Ieri ho mangiato la pizza. Da bambino giocavo sempre. Domani andrò a Roma. Vorrei un caffè.",""];
const EXP={"de": {"games": ["pres", "tempus", "b2"], "tenses": ["Konjunktiv I", "Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 498, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "de4": {"games": ["pres", "tempus", "k2"], "tenses": ["Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 450, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "de6": {"games": ["k1", "k2", "alla"], "tenses": ["Konjunktiv I", "Konjunktiv II", "Perfekt", "Präsens", "Präteritum"], "conj": 498, "nconn": 32, "conn0": "zuerst", "connLast": "zusammenfassend", "tc": {"Konjunktiv II": [true, false, false, false, false, false], "Passiv": [false, true, false, false, false, false], "Perfekt": [true, false, false, false, false, false], "Präsens": [true, true, true, true, true, false], "Präteritum": [true, true, false, false, false, false]}}, "fr": {"games": ["pres", "tempus", "b1"], "tenses": ["conditionnel", "futur simple", "imparfait", "passé composé", "plus-que-parfait", "présent", "subjonctif"], "conj": 438, "nconn": 27, "conn0": "d'abord", "connLast": "si", "tc": {"futur proche": [false, false, false, false, false, false], "imparfait": [false, false, true, true, false, false], "passé composé": [false, false, true, false, false, false], "présent": [true, true, true, true, true, false]}}, "fr4": {"games": ["subj", "hyp", "recit"], "tenses": ["conditionnel", "futur simple", "imparfait", "passé composé", "plus-que-parfait", "présent", "subjonctif"], "conj": 438, "nconn": 49, "conn0": "d'abord", "connLast": "pour conclure", "tc": {"conditionnel": [false, false, true, true, false, false], "futur proche": [false, false, false, false, false, false], "imparfait": [false, false, true, true, false, false], "passé composé": [false, false, true, false, false, false], "présent": [true, true, true, true, true, false], "subjonctif": [false, false, true, true, false, false]}}, "it1": {"games": ["pres-reg", "pres-irr", "pres-mod-rifl"], "tenses": ["presente"], "conj": 240, "nconn": 22, "conn0": "ma", "connLast": "alla fine", "tc": {"futuro": [false, false, false, false, true, false], "imperfetto": [false, false, false, false, true, false], "passato prossimo": [false, false, false, false, true, false], "presente": [true, true, true, true, true, false]}}, "it2": {"games": ["pres", "pp", "imp", "fut", "cond"], "tenses": ["condizionale", "futuro semplice", "imperfetto", "passato prossimo", "presente"], "conj": 732, "nconn": 22, "conn0": "ma", "connLast": "alla fine", "tc": {"futuro": [false, false, false, false, true, false], "imperfetto": [false, false, false, false, true, false], "passato prossimo": [false, false, false, false, true, false], "presente": [true, true, true, true, true, false]}}};
setTimeout(async()=>{ try{
  // 1. Arv mellan kurser
  { const bad=[];
    for(const [c,e] of Object.entries(EXP)){ const x=LANGUAGES[c], v=x.verbs;
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
    ok("arv: de4 och de6 delar bindeord och tempusigenkänning med de", d4.connectors===de.connectors&&d6.connectors===de.connectors&&d4.tenseCheck===de.tenseCheck&&d6.tenseCheck===de.tenseCheck);
    ok("arv: de4 har samma verbtabeller som de, utan Konjunktiv I och i samma ordning",
      canon(Object.keys(d4.verbs.tenses))===canon(Object.keys(de.verbs.tenses).filter(t=>t!=="Konjunktiv I"))
      &&Object.keys(d4.verbs.tenses).every(t=>d4.verbs.tenses[t]===de.verbs.tenses[t])&&d4.verbs.persons===de.verbs.persons&&d4.verbs.prefix===de.verbs.prefix&&d4.verbs.sv===de.verbs.sv
      &&!!de.verbs.tenses["Konjunktiv I"], Object.keys(d4.verbs.tenses).join());
    ok("arv: de6 har alla verbtabeller från de men egna verbspel", d6.verbs.tenses===de.verbs.tenses&&d6.verbs.games!==de.verbs.games&&d6.verbs.sv===de.verbs.sv);
    ok("arv: fr4 = bindeorden från fr plus egna, tempusigenkänning från fr plus conditionnel och subjonctif",
      canon(f4.connectors.slice(0,fr.connectors.length))===canon(fr.connectors)&&f4.connectors.length===fr.connectors.length+22
      &&canon(Object.keys(f4.tenseCheck))===canon([...Object.keys(fr.tenseCheck),"conditionnel","subjonctif"])
      &&Object.keys(fr.tenseCheck).every(k=>f4.tenseCheck[k]===fr.tenseCheck[k])
      &&f4.tenseCheck.conditionnel("Je parlerais volontiers.")&&!f4.tenseCheck.conditionnel("Il tirait la corde.")&&f4.tenseCheck.subjonctif("Il faut qu'il finisse.")
      &&f4.verbs.tenses===fr.verbs.tenses, Object.keys(f4.tenseCheck).join());
    ok("arv: it2 hämtar artiklar, pronomen, elision, bindeord och tempusigenkänning från it1",
      ["articles","hintStrip","pronouns","elision","connectors","tenseCheck"].every(k=>i2[k]===i1[k])&&i2.verbs!==i1.verbs);
    ok("arv: fält som inte står i inherit ärvs inte", d6.nextCourse===undefined&&d4.nextCourse==="de"&&d4.elective===undefined&&f4.book===undefined&&i2.nextCourse===undefined&&f4.storageKey==="glosor-fr4-v1");
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
    ok("grammatik: Dagens pass nämner grammatik", dailyPanel([],[]).includes("grammatik"));
    if(S.runs) delete S.runs.mix; startMix(true);
    ok("grammatik: Dagens pass har grammatikfrågor", !!sess&&[sess.cur,...sess.queue].some(x=>x.k==="gram")); quitSession(); }

  // 3. DATA_VERSION per kurs
  ok("DATA_VERSION: ett hash per kurs", DATA_VERSION&&typeof DATA_VERSION==="object"&&Object.keys(LANGUAGES).every(c=>/^[0-9a-f]{10}$/.test(DATA_VERSION[c]))
    &&new Set(Object.values(DATA_VERSION)).size===Object.keys(LANGUAGES).length, canon(DATA_VERSION));

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
const unesc=s=>{const t=document.createElement("textarea"); t.innerHTML=String(s==null?"":s); return t.value;};
const exClick=id=>{renderStart(); const g=exGroups().find(g=>g.items.some(h=>h.includes('data-ex="'+id+'"'))); openExGroup(g.id); const b=q('[data-ex="'+id+'"]'); b.click(); return b;};
// Rätt svar på vilken fråga som helst, hämtat ur frågan själv (sess.d)
function answerRight(){
  const c=sess.cur, d=sess.d;
  if(c.t==="mc"){ answerMC(d.opts.findIndex(o=>o.ok)); q("#nx").click(); return; }
  if(q("[data-sh]")){ q('[data-sh="1"]').click(); return; }
  if(d.render){ d.o.words.forEach(w=>{const b=[...document.querySelectorAll("[data-t]")].find(x=>x.textContent===w); if(b) b.click();}); q("#submit").click(); q("#submit").click(); return; }
  q("#ans").value=d.accepted?d.accepted[0]:unesc(d.answer).replace(/ … /g," "); q("#submit").click();
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
  ok("register: MC, TYPE, RESTORE … är vyer över registret", MC.dict===KINDS.dict.mc&&TYPE.gram===KINDS.gram.type&&RESTORE.story===KINDS.story.restore&&AFTER.lq===KINDS.lq.after
    &&AGAIN.mix===KINDS.mix.again&&KIND_NAMES.gen==="der, die, das"&&("utt" in RECAP)&&!("culture" in MC)&&Object.keys(TYPE).includes("plu"));
  { MC.nyTyp=()=>{}; const e=KIND_ERRORS.length===1&&!KINDS.nyTyp; KIND_ERRORS.length=0;
    defineKind("dict",{recap:()=>""}); defineKind("xx",{foo:1}); const e2=KIND_ERRORS.length===2&&!("foo" in KINDS.xx); KIND_ERRORS.length=0; delete KINDS.xx;
    ok("register: fel vid registrering stoppar inte appen men syns i KIND_ERRORS", e&&e2); }

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
  for(const c of Object.keys(LANGUAGES)){
    useLang(c); await wait(()=>L.code===c&&WORDS&&WORDS.length>0&&!sess,5000);
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
    const need=["lq","rq","story","phr","ktest","dict","trans","order","shadow"].concat((C().prompts||[]).length?["write"]:[],hasGrammar()?["gram"]:[],(C().uttal||[]).length?["utt"]:[],hasExam()?["exam"]:[],(C().culture||[]).length?["culture"]:[]);
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
  ok("alla kurser genomspelade", true, Object.keys(LANGUAGES).join(", "));
  { const ck=(code,i,w)=>{const k=L; L=LANGUAGES[code]; try{return check(i,variants(w))}finally{L=k}};
    const va=(code,w)=>{const k=L; L=LANGUAGES[code]; try{return variants(w)}finally{L=k}};
    ok("facit: moniteur de ski och monitrice de ski godkänns", ck("fr","moniteur de ski","moniteur, monitrice de ski")==="right"&&ck("fr","monitrice de ski","moniteur, monitrice de ski")==="right"
      &&ck("fr","moniteur, monitrice de ski","moniteur, monitrice de ski")==="right"&&ck("fr","moniteur","moniteur, monitrice de ski")!=="right", va("fr","moniteur, monitrice de ski").join(" / "));
    ok("facit: weil godkänns inte för en fras med komma", ck("de6","weil","ich habe dieses Thema gewählt, weil")==="wrong"&&ck("de6","aber","das mag sein, aber")==="wrong"&&ck("fr","c'est","ce qui me plaît, c'est")==="wrong");
    ok("facit: former av samma ord godkänns fortfarande", ["vif","vive"].every(x=>ck("fr",x,"vif, vive")==="right")&&ck("fr","petite amie","petit ami, petite amie")==="right"
      &&ck("fr4","l'envoyée spéciale","l'envoyé spécial, l'envoyée spéciale")==="right"&&ck("fr4","monsieur","Madame, Monsieur")!=="right");
    ok("facit: ord med komma i alla kurser", commaN>200, commaN+" ord med komma, "+commaSplit+" delas i former, t.ex. "+commaInfo.filter(s=>/moniteur|petit ami|envoyé/.test(s)).join(" | ")); }
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
  { const it=[sess.cur,...sess.queue].find(c=>c.ref==="t3|w"); sess.queue=[...sess.queue,sess.cur].filter(c=>c!==it); sess.cur=it; sess.d=TYPE.ipa(it); renderType(sess.d); }
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
  ok("ipa/sats: restore och recap", RESTORE.ipa("t1|w")&&RESTORE.ipa("finns-inte|f")===null&&RESTORE.ipa("t1|x")===null&&RESTORE.sats("s1")&&RESTORE.sats("nej")===null&&RECAP.sats("s1")==="un roman: COD");
  setView("stats"); ok("ipa/sats: i statistiken", q("#app").textContent.includes("Transkription per moment")&&q("#app").textContent.includes("Satsanalys")&&q("#app").textContent.includes("Transkription ·"), "");
  await wait(()=>false,300);
  { const st=JSON.parse(localStorage.getItem(L.storageKey)||"{}"); ok("ipa/sats: statistiken sparas", st.ipa&&st.ipa.t1&&st.sa&&st.sa.s1); }
  delete L.content.transkription; delete L.content.satsanalys; renderStart();
  ok("ipa/sats: knapparna försvinner utan innehåll", !menuIds().includes("ipa")&&!menuIds().includes("sats"));
  // Andra kurser än fru har inga knappar
  for(const c of Object.keys(LANGUAGES).filter(c=>c!=="fru"&&c!=="fr")){ useLang(c); await wait(()=>L.code===c&&WORDS&&!sess,5000);
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
  for(const c of Object.keys(LANGUAGES)){ useLang(c); await until(()=>L.code===c&&L.base&&!sess,5000);
    if(!hasExam()) continue;
    const e=EX(), want=[]; e.tasks.forEach(t=>{ if(exKind(t)!=="speak"&&!want.includes(t.part+"|"+t.teil)) want.push(t.part+"|"+t.teil); });
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
      if(t.qs){ t.qs.forEach((x,i)=>q(`.exq[data-q="${i}"] [data-o="${i===0?(x.a+1)%x.opts.length:x.a}"]`).click()); q("#exdone").click(); q("#exnext").click(); }
      else { q("#xtext").value="Ein zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn fünfzehn sechzehn."; q("#exdone").click(); await until(()=>(S.exam.t[t.id]||{}).pct!=null); q("#exnext").click(); } }
    ok(c+": klockan gäller hela delen med provets tid", sameEnd&&labels);
    const s=S.exam.sims[S.exam.sims.length-1], parts=[...new Set(want.map(x=>x.split("|")[0]))];
    ok(c+": simuleringen sparas med alla delar och uppgifter", S.exam.sims.length===2&&JSON.stringify(Object.keys(s.parts))===JSON.stringify(parts)&&Object.keys(s.tasks).length===want.length, JSON.stringify(s));
    // Läsa/lyssna: ett fel per uppgift, delens resultat = rätt av alla frågor i delen
    const mc=parts.filter(p=>e.tasks.some(t=>t.part===p&&t.qs)).every(p=>{ const ts=Object.keys(s.tasks).map(exTask).filter(t=>t.part===p);
      const n=ts.reduce((a,t)=>a+t.qs.length,0); return s.parts[p]===exPct(n-ts.length,n); });
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
        lj = t / "languages" / "de4" / "lang.js"
        broken(lj, lambda s: s.replace('inherit: ["connectors"', 'inherit: ["conectors"', 1), "arv: inherit med ett fält som föräldern saknar stoppar", "inherit 'conectors'")
        broken(lj, lambda s: s.replace('nextCourse: "de"', 'nextCourse: "xx"', 1), "bygge: nextCourse till en kurs som inte finns stoppar", "nextCourse 'xx'")
        ok("bygge: går igenom igen", build().returncode == 0)
    return "\n".join(out)


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
  useLang("fr"); await until(()=>L.code==="fr"&&L.base&&!sess,5000); renderStart();
  ok("plan: kurs utan plan visar inget kort", !q("#plancard")&&!hasPlan());
  KINDS.plan.open(); ok("plan: öppna utan plan går till startsidan", !q("#planp"));
 }catch(e){ ok("undantag", false, e.message+" "+(e.stack||"").split("\n")[1]); }
 ok("inga JavaScript-fel", !__err.length, __err.join(" ; "));
 document.body.insertAdjacentHTML("beforeend","<pre id=out>"+out.join("\n").replace(/</g,"&lt;")+"</pre>");
});
</script>"""


def main():
    text = run(SCENARIO) + "\n" + run(SCENARIO_DE) + "\n" + run(SCENARIO_FIXES) + "\n" + run(SCENARIO_SYNC, 30000) + "\n" + run_http(SCENARIO_HTTP)
    text += "\n" + run(SCENARIO_ARCH, 30000) + "\n" + test_build_locks()   # arkitektur, del 6
    text += "\n" + test_build_checks()   # byggkontroller, arkitekturgranskning 2026-09-29
    text += "\n" + run(SCENARIO_KINDS, 60000)   # övningstyperna (src/kinds), alla kurser, två enheter, del 6
    text += "\n" + run(SCENARIO_IPA, 30000)   # transkription och satsanalys (fru)
    text += "\n" + run(SCENARIO_LEVEL, 30000)   # nivåmätaren "Var ligger jag?" (P2: Nivåmätare)
    text += "\n" + run(SCENARIO_PLAN, 30000)   # studieplanen (P2: Studieplan för självstudier)
    text += "\n" + run(SCENARIO_EXAMSIM, 60000)   # provsimuleringen som hela provet (P2)
    text += "\n" + run(SCENARIO_BUGHUNT, 30000)   # buggjakten 2026-09-29
    print(text)
    sys.exit(1 if "FEL  " in text else 0)


if __name__ == "__main__":
    main()
