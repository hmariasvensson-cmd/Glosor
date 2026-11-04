/* ---------- Mot målet: intervjun och språkprovet (föräldern 2026-11-03) ----------
   "Något som uppskattar på vilken nivå eleven är, givet en intervju på franska i början av februari och DELF B1 i mars
   och maj, som en mätning av om han kommer att klara det, och en plan för att han ska klara det."
   Kurser med goal och prov i lang.js (fr, fr4, fru, de4, de, de6). Eleven anger sina datum: intervjun (bara kurser med
   content/intervju.json) och upp till två provtillfällen. Sparat: S.prep = {iv, d1, d2, h} (datum "ÅÅÅÅ-MM-DD", h =
   lektionstimmar i veckan utanför appen); L.exam.sessions (valfritt) föreslår provdatum och L.exam.sessionNote
   (valfritt) beskriver provtillfällena.
   Nivån: nivåmätaren (levelEstimate i 80-level.js). Prognosen använder färdigheterna (grammatik och provdelar, prepLevel)
   och visar ordförrådet för sig, eftersom ordmätaren bara räknar ord som eleven kan skriva (steg 4+).
   Prognosen: riktvärdet PREP_H timmar per GERS-nivå (Cambridge "guided learning hours": från A2 till B1 ungefär
   150–200 timmar). Elevens takt = minuter i appen de senaste 28 dagarna (S.log) plus h. Nivån vid datumet = nivån nu +
   timmar fram till dess / PREP_H. Grovt och tydligt märkt som en uppskattning.
   Planen: tre faser (fram till intervjun, fram till första provet, fram till andra provet) med en checklista för veckan
   (prepWeek) som räknas ur loggen, S.iv, S.talk och S.exam. Sammanfattningen till föräldern får fältet prep (prepSummary).
   Skolornas språkkrav (content/skolor.json, prepSchoolRows) jämförs med nivån och prognosen, även utan datum. */
const PREP_H=180, PREP_PARTS=["co","ce","pe","po"];
const hasPrep=()=>!!(L&&L.goal&&L.exam&&hasExam());
const prepState=()=>{ S.prep=S.prep&&typeof S.prep==="object"?S.prep:{}; return S.prep; };
const prepDate=s=>planDate(s);
const prepDays=s=>{ const d=prepDate(s); return d?Math.round((d-planToday())/864e5):null; };
const prepWhen=s=>{ const d=prepDate(s); return d?d.toLocaleDateString("sv-SE",{day:"numeric",month:"long",year:"numeric"}):""; };
// Datumen som gäller (bara de som inte har passerat), i tidsordning
function prepMilestones(){
  const p=S.prep||{}, ex=(L.exam&&L.exam.name)||"provet", out=[];
  if(hasIv()&&p.iv) out.push({id:"iv",name:"Intervjun",date:p.iv});
  if(p.d1) out.push({id:"d1",name:`${ex}, första tillfället`,date:p.d1});
  if(p.d2) out.push({id:"d2",name:`${ex}, andra tillfället`,date:p.d2});
  return out.filter(m=>prepDays(m.date)!=null&&prepDays(m.date)>=0).sort((a,b)=>prepDate(a.date)-prepDate(b.date));
}
const hasIv=()=>typeof ivList==="function"&&ivList().length>0;
// Timmar i veckan: appen de senaste 28 dagarna och lektionerna utanför
function prepPace(){
  const t0=Date.now()-28*864e5, sec=(S.log||[]).reduce((a,l)=>a+(l&&+l.d>=t0?+l.dur||0:0),0);
  const app=sec/3600/4, h=Math.max(0,+((S.prep||{}).h)||0);
  return {app,h,tot:app+h};
}
// Nivån för prognosen: färdigheterna (grammatik och prov), annars hela uppskattningen, annars kursens nivå
function prepLevel(est){
  const xs=[est.gram.lv,est.exam.lv].filter(v=>v!=null);
  if(xs.length) return {lv:xs.reduce((a,b)=>a+b,0)/xs.length,src:"skills"};
  if(est.lv!=null) return {lv:est.lv,src:"all"};
  return {lv:(lvTop(L.level)||2)-.5,src:"course"};
}
// DELF-delarna på provets nivå: poäng av 25 ur de senaste resultaten (nivåmätarens parts)
function prepParts(est){
  const parts=(est.exam.parts||[]).filter(p=>!p.below);
  const all=(EX().parts||[]).filter(p=>!p.level||lvNum(p.level)===est.exam.E);
  return all.map(p=>{ const x=parts.find(q=>q.id===p.id); return {id:p.id,sv:p.sv||p.name,pts:x?Math.round(x.pct/4):null,n:x?x.n:0}; });
}
function prepForecast(){
  const est=levelEstimate(), T=est.T, base=prepLevel(est), pace=prepPace(), parts=prepParts(est);
  const known=parts.filter(p=>p.pts!=null), tot=known.reduce((a,p)=>a+p.pts,0);
  const ms=prepMilestones().map(m=>{ const days=prepDays(m.date), w=Math.max(days/7,.01);
    const goal=m.id==="iv"?T-.5:T;   // intervjun: förberedda svar räcker långt, men språket ska ligga nära provets nivå
    const proj=base.lv+pace.tot*w/PREP_H, need=Math.max(0,(goal-base.lv)*PREP_H), needW=need/w;
    const status=proj>=goal-.05?"ok":proj>=goal-.3?"near":"far";
    return {...m,days,weeks:Math.round(w),goal,proj,needH:Math.round(need),needW:Math.round(needW*10)/10,status}; });
  return {est,T,base,pace,parts,known:known.length,tot,ms};
}
// Skolornas språkkrav (content/skolor.json): [{id, name, city, prio, level, levelVoice?, when, by?, certs?, apply?, note?, url}].
// level = GERS-nivån som krävs ("inget" = inget krav på kursens språk), by = ungefär när nivån ska vara klar (ÅÅÅÅ-MM-DD).
// Prognosen till by räknas som för datumen ovan; utan by jämförs nivån nu.
const prepSchools=()=>C().skolor||[];
function prepSchoolRows(f){
  return prepSchools().map(s=>{ const need=lvNum(s.level); if(!need) return {...s,none:true};
    const days=s.by?prepDays(s.by):null, proj=days!=null&&days>0?f.base.lv+f.pace.tot*days/7/PREP_H:f.base.lv;
    return {...s,need,days,proj,status:proj>=need-.05?"ok":proj>=need-.3?"near":"far"}; });
}
const PREP_ST={ok:["Rätt spår","ok"],near:["Nära, öka lite","near"],far:["Behöver mer tid","far"]};
const prepFmtH=h=>String(Math.round(h*10)/10).replace(".",",");
// Veckans start (måndag) och faserna
function prepWeekStart(){ const d=planToday(); const k=(d.getDay()+6)%7; return +d-k*864e5; }
function prepPhase(ms){
  const iv=ms.find(m=>m.id==="iv"), ex=ms.filter(m=>m.id!=="iv");
  if(iv) return {id:1,name:`Fram till intervjun (${iv.days} dagar)`};
  if(ex.length) return {id:ex[0].id==="d1"?2:3,name:`Fram till ${ex[0].name.toLowerCase()} (${ex[0].days} dagar)`};
  return null;
}
// Veckans checklista: [{t, done, n, go}] där go = övningen som knappen öppnar
function prepWeek(ph){
  const ws=prepWeekStart(), log=(S.log||[]).filter(l=>l&&+l.d>=ws), tt=((S.exam||{}).t)||{}, tasks=EX().tasks||[];
  const dp=log.filter(l=>l.dp).length, wr=log.filter(l=>l.kind==="write").length, talk=log.filter(l=>l.kind==="talk"&&!l.chat).length;
  const exDone=pts=>tasks.filter(t=>pts.includes(t.part)&&tt[t.id]&&+tt[t.id].last>=ws).length;
  const sims=(((S.exam||{}).sims)||[]).filter(s=>+s.d>=ws).length;
  const ivA=Object.values(((S.iv||{}).a)||{}).filter(a=>a&&+a.d>=ws).length;
  const mocks=Object.entries(((S.talk||{}).c)||{}).filter(([k,c])=>/^iv:/.test(k)&&c&&+c.last>=ws).length;
  const chats=log.filter(l=>l.kind==="talk"&&l.chat).length;
  const items=[{t:"Dagens pass",n:10,done:dp,go:"daily"}];
  if(ph.id===1){
    if(hasIv()) items.push({t:"Intervjufrågor med eget svar",n:4,done:ivA,go:"iv"},{t:"Övningsintervju med Claude",n:1,done:mocks,go:"iv"});
    items.push({t:"Provuppgift i hör- eller läsförståelse",n:2,done:exDone(["co","ce"]),go:"exam"},{t:"Tala 4/3/2",n:1,done:talk,go:"talk"});
  } else {
    items.push({t:"Provuppgifter (en per del: hör, läs, skriv, tala)",n:4,done:exDone(PREP_PARTS),go:"exam"},
      {t:"Skrivuppgift med Claudes kommentar",n:1,done:wr+exDone(["pe"]),go:"write"},
      {t:"Tala 4/3/2 eller samtal med Claude",n:2,done:talk+chats,go:"talk"});
    if(((planToday()-new Date(2026,0,5))/864e5/7|0)%2===0) items.push({t:"Provsimulering (varannan vecka)",n:1,done:sims,go:"exam"});
  }
  items.forEach(x=>x.ok=x.done>=x.n);
  return items;
}
/* Dagens uppdrag (föräldern 2026-11-04: "supertydligt vad de måste göra för att klara kraven"): överst på startsidan.
   Målet som ligger närmast (ett eget datum eller den skola med högst krav som eleven helst vill till), var eleven ligger
   (stapel från A1 till målet), minuter i dag mot det som behövs, och tre saker att göra i dag: Dagens pass, den svagaste
   provdelen och fasens uppgift (intervjufrågor före intervjun, annars en skrivuppgift eller Tala). Bockas av ur loggen. */
function prepGoal(f){
  const late=f.ms.find(m=>m.status!=="ok")||f.ms[0];
  if(late) return {name:late.name.charAt(0).toLowerCase()+late.name.slice(1),when:prepWhen(late.date),days:late.days,lv:lvShort(late.goal),x:late.goal,needW:late.status==="ok"?0:late.needW,status:late.status};
  const sc=prepSchoolRows(f).filter(r=>!r.none).sort((a,b)=>(a.prio||9)-(b.prio||9)||((a.days>0?a.days:1e9)-(b.days>0?b.days:1e9))||b.need-a.need)[0];   // helst-skolorna, närmast datum först
  if(!sc) return null;
  const w=sc.days>0?sc.days/7:null, need=Math.max(0,(sc.need-f.base.lv)*PREP_H);
  return {name:sc.name,when:sc.when,days:sc.days>0?sc.days:null,lv:sc.level,x:sc.need,needW:w&&sc.status!=="ok"?Math.round(need/w*10)/10:0,status:sc.status};
}
function prepToday(f,ph){
  const t0=+planToday(), log=(S.log||[]).filter(l=>l&&+l.d>=t0), tt=((S.exam||{}).t)||{}, tasks=EX().tasks||[];
  const out=[{t:"Dagens pass",ok:log.some(l=>l.dp),go:"daily"}];
  const low=f.parts.slice().sort((a,b)=>(a.pts==null?-1:a.pts)-(b.pts==null?-1:b.pts))[0];
  if(low) out.push({t:`Provuppgift: ${low.sv.toLowerCase()}${low.pts==null?" (inte gjord än)":` (${low.pts}/25)`}`,ok:tasks.some(x=>x.part===low.id&&tt[x.id]&&+tt[x.id].last>=t0),go:"exam"});
  const ivA=Object.values(((S.iv||{}).a)||{});
  if(ph&&ph.id===1&&hasIv()) out.push({t:"Två intervjufrågor: skriv ditt svar och få Claudes kommentar",ok:ivA.filter(a=>a&&+a.d>=t0).length>=2,go:"iv"});
  else if(f.parts.find(p=>p.id==="pe"&&(p.pts==null||p.pts<13))) out.push({t:"En skrivuppgift med Claudes kommentar",ok:log.some(l=>l.kind==="write"),go:"write"});
  else out.push({t:"Tala 4/3/2 eller samtal med Claude",ok:log.some(l=>l.kind==="talk"),go:"talk"});
  return {items:out,min:Math.round(log.reduce((a,l)=>a+(+l.dur||0),0)/60)};
}
const prepBar=(lv,goal)=>{ const hi=Math.max(3,Math.ceil(goal||3)), pc=n=>Math.max(0,Math.min(100,100*(n-1)/(hi-1))), ts=[];
  for(let n=1;n<=hi;n++) ts.push(n);
  return `<div class="plvbar" role="img" aria-label="Nivå ungefär ${esc(lvShort(lv))}, målet ${esc(lvShort(goal||hi))}"><div class="plvtrack"><i style="width:${pc(lv).toFixed(1)}%"></i>${ts.map(n=>`<span class="plvtick" style="left:${pc(n).toFixed(1)}%"></span>`).join("")}<span class="plvtick goal" style="left:${pc(goal||hi).toFixed(1)}%"></span></div>
    <div class="plvlabels">${ts.map(n=>`<span style="left:${pc(n).toFixed(1)}%">${esc(LV_NAMES[n]||"")}</span>`).join("")}</div></div>`; };
// Panelen på startsidan
function prepPanel(){
  try{
    if(!hasPrep()) return "";
    const ms=prepMilestones(), f=prepForecast(), g=prepGoal(f);
    if(!g) return `<section class="panel" id="prep"><div class="meta"><span class="label">Dagens uppdrag</span></div>
      <p class="plan">Lägg in datumen för ${hasIv()?"antagningsintervjun och ":""}${esc(L.exam.name)}, så räknar appen ut var du ligger, om du hinner och vad du ska göra varje dag.</p>
      <button class="btn ghost" id="prepopen">Lägg in datum</button></section>`;
    const ph=ms.length?prepPhase(ms):null, td=prepToday(f,ph), dayMin=Math.max(20,Math.ceil((g.needW||f.pace.tot)*60/7/5)*5), done=td.items.filter(x=>x.ok).length;
    return `<section class="panel" id="prep"><div class="meta"><span class="label">Dagens uppdrag</span><span class="prepst ${PREP_ST[g.status][1]}">${PREP_ST[g.status][0]}</span></div>
      <p class="plan">Målet: <b>${esc(g.lv)} till ${esc(g.name)}</b>${g.days!=null?` (${g.days} dagar kvar)`:""}${g.when&&g.days==null?` (${esc(g.when)})`:""}. Du ligger på ungefär <b>${esc(lvShort(f.base.lv))}</b>.</p>
      ${prepBar(f.base.lv,g.x||f.T)}
      <ul class="prepwk">${td.items.map((x,i)=>`<li class="${x.ok?"ok":""}"><button type="button" class="goal-ck" data-prepday="${i}"><span class="box" aria-hidden="true">${x.ok?"✓":""}</span><span>${esc(x.t)}</span></button></li>`).join("")}</ul>
      <p class="foot">I dag: ${td.min} av ${dayMin} minuter${g.needW?` (för att hinna behövs ungefär ${prepFmtH(g.needW)} timmar i veckan)`:""}. ${done===td.items.length?"Dagens uppdrag är klart!":""}</p>
      <button class="btn ghost" id="prepopen">Planen och prognosen</button></section>`;
  }catch(e){ warnErr("Dagens uppdrag kunde inte visas",e); return ""; }
}
function wirePrep(){
  if($("#prepopen")) $("#prepopen").onclick=()=>openFrom(renderStart,openPrep,"Till startsidan");
  const its=app.querySelector("[data-prepday]")?prepToday(prepForecast(),prepMilestones().length?prepPhase(prepMilestones()):null).items:[];
  app.querySelectorAll("[data-prepday]").forEach(b=>b.onclick=()=>{ const x=its[+b.dataset.prepday]; if(x) openFrom(renderStart,()=>prepGo(x.go),"Till startsidan"); });
}
// Sidan med datum, nivå, prognos och veckans plan hämtas först när den öppnas (data/code-prep.js, lazyRun i app.js)
// @lazy prep
function prepGo(k){
  if(k==="daily") return startDaily();
  if(k==="iv") return KINDS.iv.open();
  if(k==="write") return KINDS.write.open();
  if(k==="talk") return KINDS.talk.open();
  return KINDS.exam.open();
}
function openPrep(){
  if(examWait(openPrep)) return;
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  const p=prepState(), f=prepForecast(), ms=f.ms, ph=ms.length?prepPhase(ms):null, wk=ph?prepWeek(ph):[];
  const sug=(L.exam.sessions||[]).filter(d=>prepDays(d)>=0);
  const voc=f.est.voc, vocNeed=VOC_NEXT[Math.round(f.T)]||2500;
  const pr=f.parts.map(x=>`<tr><th>${esc(x.sv)}</th><td>${x.pts==null?"inte gjord än":`${x.pts}/25`}</td><td>${x.pts==null?"":x.pts<5?"under spärren 5":x.pts<12.5?"under halva":"godkänd nivå"}</td></tr>`).join("");
  app.innerHTML=`<section class="panel"><span class="tab">Mot målet</span><h2>${hasIv()?"Intervjun och ":""}${esc(L.exam.name)}</h2>
    <div class="prepdates">
      ${hasIv()?`<label class="field"><span class="label">Antagningsintervjun</span><input type="date" id="prep-iv" value="${esc(p.iv||"")}"></label>`:""}
      <label class="field"><span class="label">${esc(L.exam.name)}, första tillfället</span><input type="date" id="prep-d1" value="${esc(p.d1||"")}"></label>
      <label class="field"><span class="label">${esc(L.exam.name)}, andra tillfället</span><input type="date" id="prep-d2" value="${esc(p.d2||"")}"></label>
      <label class="field"><span class="label">Lektioner utanför appen, timmar i veckan</span><input type="number" id="prep-h" min="0" max="20" step="0.5" value="${esc(String(p.h||0))}" inputmode="decimal"></label>
    </div>
    ${L.exam.sessionNote?`<p class="foot">${esc(L.exam.sessionNote)}</p>`:""}
    ${sug.length?`<p class="foot">Provdatum i Sverige: ${sug.map(d=>esc(prepWhen(d))).join(" och ")} (kontrollera hos provcentret och anmäl dig i tid).</p>`:""}
    </section>
    <section class="panel"><span class="label">Var du ligger nu</span>
    <p class="plan">Ungefär <b>${esc(lvShort(f.base.lv))}</b>${f.base.src==="course"?" (kursens nivå; gör några provuppgifter och grammatikövningar för en egen uppskattning)":""}. Målet är ${esc(LV_NAMES[Math.round(f.T)])}. ${f.est.few?"Uppskattningen bygger på lite data än så länge.":""}</p>
    <div class="vtwrap"><table class="hpv"><tbody>${pr}<tr><th>Ordförråd</th><td>${nf(voc.n)} ord du kan skriva</td><td>${esc(L.exam.name)} brukar kräva ungefär ${nf(vocNeed)}</td></tr>${f.est.gram.lv!=null?`<tr><th>Grammatik</th><td>${Math.round(100*(f.est.gram.acc||0))} % rätt</td><td>ungefär ${esc(lvShort(f.est.gram.lv))}</td></tr>`:""}</tbody></table></div>
    <p class="foot">${f.known===f.parts.length?`Provet just nu: ungefär <b>${f.tot}/100</b> (gränsen är 50, och minst 5 av 25 i varje del).`:`Gör minst en provuppgift i varje del för en prognos av poängen (${f.known} av ${f.parts.length} delar gjorda).`}${f.est.weak?` Det som drar ner mest: ${esc(f.est.weak.what)} (${esc(f.est.weak.why)}).`:""}</p></section>
    ${prepSchools().length?prepSchoolsHtml(f):""}
    ${ms.length?`<section class="panel"><span class="label">Hinner du?</span>
    <p class="plan">Du övar ungefär <b>${prepFmtH(f.pace.app)} timmar i veckan</b> i appen${f.pace.h?` och ${prepFmtH(f.pace.h)} timmar på lektioner`:""}. Från en nivå till nästa brukar det behövas ungefär ${PREP_H} timmar (Cambridges riktvärde 150–200 timmar från A2 till B1).</p>
    <ul class="prepms">${ms.map(m=>`<li><span><b>${esc(m.name)}</b><small>${esc(prepWhen(m.date))} · ${m.weeks} veckor kvar · med din takt ungefär ${esc(lvShort(m.proj))}${m.status==="ok"?"":`; för ${esc(LV_NAMES[Math.round(m.goal)]||lvShort(m.goal))} behövs ungefär ${prepFmtH(m.needW)} timmar i veckan`}</small></span><span class="prepst ${PREP_ST[m.status][1]}">${PREP_ST[m.status][0]}</span></li>`).join("")}</ul>
    <p class="foot">En grov uppskattning: den bygger på dina resultat i appen och ett riktvärde, inte på ett riktigt prov. Den blir säkrare ju fler provuppgifter du gör.</p></section>
    <section class="panel"><span class="label">Den här veckan · ${esc(ph.name)}</span>
    <ul class="prepwk">${wk.map((x,i)=>`<li class="${x.ok?"ok":""}"><button type="button" class="goal-ck" data-prepgo="${i}"><span class="box" aria-hidden="true">${x.ok?"✓":""}</span><span>${esc(x.t)} <small>${Math.min(x.done,x.n)} av ${x.n}</small></span></button></li>`).join("")}</ul>
    ${prepAdvice(f,ph)}</section>`:""}
    <button class="quit" id="quit">Tillbaka</button>`;
  const set=(k,v)=>{ const st=prepState(); if(v===""||v==null) delete st[k]; else st[k]=v; save(); boardPush(); openPrep(); };
  ["iv","d1","d2"].forEach(k=>{ const el=$("#prep-"+k); if(el) el.onchange=()=>set(k,el.value); });
  $("#prep-h").onchange=()=>set("h",Math.max(0,Math.min(20,+$("#prep-h").value||0)));
  app.querySelectorAll("[data-prepgo]").forEach(b=>b.onclick=()=>openFrom(openPrep,()=>prepGo(wk[+b.dataset.prepgo].go),"Till planen"));
  $("#quit").onclick=backTo(renderStart); window.scrollTo(0,0);
}
function prepSchoolsHtml(f){
  const rows=prepSchoolRows(f).sort((a,b)=>(a.prio||9)-(b.prio||9)||(b.need||0)-(a.need||0));
  const head=p=>p===1?"Vill helst söka":p===2?"Funderar på":"Skolorna";
  let lastP=null;
  return `<section class="panel"><span class="label">Skolornas krav på ${esc(L.name.toLowerCase())}</span>
    <p class="plan">Du ligger nu på ungefär <b>${esc(lvShort(f.base.lv))}</b>. Prognosen till varje skola räknas med din takt nu (${prepFmtH(f.pace.tot)} timmar i veckan).</p>
    <ul class="prepms">${rows.map(r=>{ const h=r.prio!==lastP?`<li class="prephead"><span class="label">${head(r.prio)}</span></li>`:""; lastP=r.prio;
      return h+`<li><span><b>${esc(r.name)}</b><small>${r.none?`Inget krav på ${esc(L.name.toLowerCase())}`:`${esc(r.level)}${r.levelVoice&&r.levelVoice!==r.level?` (sång: ${esc(r.levelVoice)})`:""} · ${esc(r.when||"")}${r.days!=null&&r.days>0?` · med din takt ungefär ${esc(lvShort(r.proj))}`:""}`}</small>
        <details class="more"><summary>Mer om ${esc(r.name)}</summary>${[r.certs&&`Godkända prov: ${r.certs}`,r.apply&&`Ansökan och prov: ${r.apply}`,r.note].filter(Boolean).map(t=>`<p class="foot">${esc(t)}</p>`).join("")}<p class="foot"><a href="${esc(r.url||"#")}" target="_blank" rel="noopener">Skolans sida</a>. Kraven ändras varje år, så kontrollera alltid där.</p></details></span>
        ${r.none?`<span class="prepst ok">Inget krav</span>`:`<span class="prepst ${PREP_ST[r.status][1]}">${PREP_ST[r.status][0]}</span>`}</li>`; }).join("")}</ul></section>`;
}
// Råd för fasen: vad som ger mest just nu
function prepAdvice(f,ph){
  const tips=[];
  if(ph.id===1) tips.push("Fram till intervjun: skriv ett eget svar på varje intervjufråga, få kommentarer av Claude och säg svaren högt tills de sitter. Gör en övningsintervju med Claude i veckan, och mot slutet flera.");
  else tips.push(`Fram till provet: gör provuppgifter i alla fyra delar varje vecka och en provsimulering varannan vecka. Skrivuppgifterna ska vara minst 160 ord, som på ${esc(L.exam.name)}.`);
  const low=f.parts.filter(p=>p.pts!=null).sort((a,b)=>a.pts-b.pts)[0];
  if(low&&low.pts<12.5) tips.push(`Svagast just nu: ${esc(low.sv.toLowerCase())} (${low.pts}/25). Lägg en extra uppgift där varje vecka.`);
  const miss=f.parts.filter(p=>p.pts==null); if(miss.length) tips.push(`Inte gjort än: ${esc(miss.map(p=>p.sv.toLowerCase()).join(", "))}. Gör en uppgift i varje, så blir prognosen säkrare.`);
  if(f.est.voc.n<1000) tips.push("Skriv svaren på glosorna i stället för flerval: ett ord räknas som \"kan\" först när du har skrivit det rätt några gånger.");
  const far=f.ms.find(m=>m.status!=="ok"); if(far) tips.push(`För att hinna till ${esc(far.name.toLowerCase())} behövs ungefär ${prepFmtH(far.needW)} timmar i veckan. Det är ungefär ${Math.ceil(far.needW*60/7/5)*5} minuter om dagen.`);
  return `<p class="fbh">Det här ger mest just nu</p><ul>${tips.map(t=>`<li>${t}</li>`).join("")}</ul>`;
}
// @lazy-end
// Till föräldravyn (summaryOf i 95-parent.js)
function prepSummary(){
  if(!hasPrep()) return null;
  const ms=prepMilestones(); if(!ms.length&&!prepSchools().length) return null;
  const f=prepForecast(), ph=ms.length?prepPhase(ms):null, wk=ph?prepWeek(ph):[];
  const sc=prepSchoolRows(f).map(r=>({name:r.name,prio:r.prio||0,level:r.level||"",when:r.when||"",status:r.none?"none":r.status,proj:r.none?"":lvShort(r.proj)}));
  const need=prepSchools().map(x=>lvNum(x.level)).filter(Boolean);
  return {lv:lvShort(f.base.lv),x:Math.round(f.base.lv*100)/100,T:f.T,top:need.length?Math.max(...need):null,goal:LV_NAMES[Math.round(f.T)]||"",appH:Math.round(f.pace.app*10)/10,h:f.pace.h,
    ms:f.ms.map(m=>({id:m.id,name:m.name,date:m.date,days:m.days,proj:lvShort(m.proj),status:m.status,needW:m.needW})),
    parts:f.parts.map(p=>({sv:p.sv,pts:p.pts})),tot:f.known===f.parts.length?f.tot:null,
    iv:hasIv()?{done:ivDone(),n:ivList().length}:null,week:ph?{ok:wk.filter(x=>x.ok).length,n:wk.length,phase:ph.name}:null,
    ...(sc.length?{schools:sc}:{})};
}
