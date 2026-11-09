/* ---------- Verbtabeller (elevens önskemål 2026-11-03) ----------
   "När man har lärt sig ett verb klart vill jag att det ska komma upp som verbböjningsuppgift, en tabell med pronomen och
   tempus, där man fyller i en kolumn." Kurser med L.verbs. Ett verb är klart när ordet i ordlistan har nått "kan"
   (isMastered) och verbet finns i verbtabellerna (CONJ). Tabellen har pronomenen som rader och tempus som kolumner; eleven
   fyller i en kolumn, de andra (högst VT_COLS-1, tempus eleven har övat) visas som stöd.
   Tempus att fylla i: det som verbet har gjort minst gånger, i verbspelens ordning (vtTarget). Efter Dagens pass finns en
   knapp till nästa verb med ett tempus som inte är gjort eller hade fel senast (vtNext); alla klara verb finns under
   Grammatik → Verbtabeller. Sedan 2026-11-04 (elevens önskemål) också som fråga i Dagens pass, ett tempus i taget i
   ordningen L.verbs.tabOrder; nästa tempus först när hela kolumnen var rätt, och klara verb kommer tillbaka efter
   VT_REP_DAYS dagar. Sparat: S.vtab[verb][tempus] = {r, n, last} (r = rätt av sex senast, n = antal gånger), och
   varje ruta räknas i S.vv[verb] som i verbspelen. Loggas med kind "vtab". */
const VT_COLS=4;
const vtClean=t=>String(t||"").replace(/\(.*?\)/g,"").trim();
function vtVerbs(){
  if(!L.verbs||!CONJ.length) return [];
  const have=new Set(CONJ.map(c=>c.verb)), out=[], seen=new Set();
  for(const w of WORDS){ const v=vtClean(w.t); if(have.has(v)&&!seen.has(v)){ seen.add(v); out.push({verb:v,w}); } }
  return out;
}
const vtCells=(v,t)=>L.verbs.persons.map(p=>CONJBY[v+"|"+t+"|"+p]);
// Tempusen i den ordning de låses upp: L.verbs.tabOrder (Franska: présent, passé composé, imparfait …), annars tabellernas
const vtTenses=v=>{ const all=Object.keys(L.verbs.tenses||{}), ord=(L.verbs.tabOrder||[]).filter(t=>all.includes(t));
  return [...ord,...all.filter(t=>!ord.includes(t))].filter(t=>vtCells(v,t).every(Boolean)); };
const vtStat=(v,t)=>((S.vtab||{})[v]||{})[t];
const vtFull=(v,t)=>(vtStat(v,t)||{}).r===L.verbs.persons.length;
const vtDone=v=>vtTenses(v).every(t=>vtFull(v,t));
const VT_REP_DAYS=21;   // när alla tempus är klara: tillbaka som repetition efter ungefär tre veckor
// Elevens önskemål 2026-11-04: ett tempus i taget, nästa låses upp först när hela kolumnen var rätt i samma försök.
// När alla är klara: det tempus som gjordes för längst sedan.
function vtTarget(v){
  const ts=vtTenses(v); if(!ts.length) return null;
  return ts.find(t=>!vtFull(v,t))||ts.slice().sort((a,b)=>(vtStat(v,a).last||0)-(vtStat(v,b).last||0))[0];
}
const vtReady=()=>vtVerbs().filter(x=>isMastered(x.w)&&vtTenses(x.verb).length);
// Nästa uppgift: ett klart verb med ett tempus kvar, annars ett helt klart verb som inte gjorts på VT_REP_DAYS dagar (rep)
function vtNext(){
  const xs=vtReady();
  for(const x of xs) if(!vtDone(x.verb)) return {...x,t:vtTarget(x.verb)};
  const old=Date.now()-VT_REP_DAYS*864e5, last=x=>Math.max(...vtTenses(x.verb).map(t=>(vtStat(x.verb,t)||{}).last||0));
  const r=xs.filter(x=>last(x)<old).sort((a,b)=>last(a)-last(b))[0];
  return r?{...r,t:vtTarget(r.verb),rep:true}:null;
}
// Som fråga i Dagens pass (90-mix.js): en tabell per pass när det finns en
const vtItem=x=>({k:"vtab",id:"vtab:"+x.verb+"|"+x.t,ref:x.verb+"|"+x.t,t:"type",noRetry:true});
// Kolumnerna: tempus eleven har övat (verbspelen eller en tidigare tabell), i verbspelens ordning, och alltid det som ska fyllas i
// Skärmarna hämtas först när en tabell öppnas (data/code-vtab.js, lazyRun i app.js)
// @lazy vtab
// Kolumnerna: de närmast föregående tempusen eleven redan klarat (högst VT_COLS-1) som stöd, och det som ska fyllas i
function vtCols(v,t){
  const all=vtTenses(v), i=all.indexOf(t), sup=all.filter((x,k)=>x!==t&&vtFull(v,x)&&(k<i||i<0)).slice(-(VT_COLS-1));
  return all.filter(x=>x===t||sup.includes(x));
}
function openVtabList(){
  const xs=vtReady();
  pickerScreen("Verbtabeller",xs.length
    ?"Verb du kan. Välj ett och fyll i en kolumn i tabellen. Ett nytt verb kommer hit när du kan det i glosorna."
    :"Här kommer verben när du kan dem i glosorna. Då fyller du i en kolumn i verbets tabell, ett tempus i taget.",
    xs.map(x=>{ const ts=vtTenses(x.verb), done=ts.filter(t=>(vtStat(x.verb,t)||{}).r===L.verbs.persons.length).length;
      return {id:x.verb,title:x.verb,tag:`${done}/${ts.length} tempus`,status:done===ts.length?"alla tempus klara":""}; }),
    v=>openVtab(v));
}
// Tabellen (används både på egen sida och som fråga i Dagens pass)
function vtTableHtml(v,t){
  const cols=vtCols(v,t), P=L.verbs.persons, ts=vtTenses(v), k=ts.indexOf(t);
  return `<h2><span ${lang()}>${esc(v)}</span> <span class="sub" style="font-weight:400">(${esc(L.verbs.sv[v]||"")})</span></h2>
    <p class="plan">Fyll i kolumnen <b ${lang()}>${esc(t)}</b> (tempus ${k+1} av ${ts.length}). Skriv bara verbformen, pronomenet står redan. Enter går till nästa rad. Nästa tempus kommer när hela kolumnen är rätt.</p>
    <div class="vtwrap"><table class="vtab"><thead><tr><th></th>${cols.map(c=>`<th class="${c===t?"on":""}" ${lang()}>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>${P.map((p,i)=>`<tr><th ${lang()}>${esc(p)}</th>${cols.map(c=>{ const x=CONJBY[v+"|"+c+"|"+p];
      return c===t?`<td class="on"><input class="vtin" data-vti="${i}" ${lang()} autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${esc(p)}, ${esc(t)}"><span class="vtfix" hidden></span></td>`
        :`<td ${lang()}>${esc(x.form)}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>
    ${accentKeys(L.verbAccents||L.accents)}`;
}
function vtWire(onCheck){
  const ins=[...app.querySelectorAll(".vtin")]; let last=ins[0];
  ins.forEach((inp,i)=>{ inp.onfocus=()=>{last=inp;}; inp.onkeydown=e=>{ if(e.key!=="Enter") return; e.preventDefault(); e.stopPropagation(); if(i<ins.length-1) ins[i+1].focus(); else $("#vtcheck").click(); }; });
  app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ const inp=last; if(!inp||inp.disabled) return;
    const s=inp.selectionStart??inp.value.length, e2=inp.selectionEnd??inp.value.length;
    inp.value=inp.value.slice(0,s)+b.dataset.c+inp.value.slice(e2); inp.focus(); inp.setSelectionRange(s+1,s+1); });
  $("#vtcheck").onclick=()=>onCheck(ins);
  try{ ins[0].focus({preventScroll:true}); }catch(e){ /* fokus går inte alltid att sätta */ }
  return ins;
}
// Rättar rutorna och sparar resultatet (S.vtab, S.vv); ger antal rätt
function vtScore(v,t,ins){
  const cells=vtCells(v,t); let right=0;
  ins.forEach((inp,i)=>{ const c=cells[i], r=check(inp.value,conjVariants(c),true), ok=r==="right", td=inp.parentNode, fix=td.querySelector(".vtfix");
    if(ok) right++; inp.disabled=true; td.classList.add(ok?"ok":"bad");
    if(!ok){ fix.hidden=false; fix.textContent=c.form+(r==="accent"?" (accenten)":r==="near"?" (nästan)":""); } });
  const n=cells.length; S.vtab=S.vtab||{}; S.vtab[v]=S.vtab[v]||{};
  const o=S.vtab[v][t]||{}; S.vtab[v][t]={r:right,n:(o.n||0)+1,last:Date.now()};
  S.vv=S.vv||{}; const vv=S.vv[v]||{r:0,n:0}; S.vv[v]={r:vv.r+right,n:vv.n+n};
  return right;
}
const vtResHtml=(v,t,right)=>{ const n=L.verbs.persons.length, c0=vtCells(v,t)[0], ts=vtTenses(v), nt=ts[ts.indexOf(t)+1];
  return `<p class="plan"><b>${right} av ${n} rätt.</b> ${right===n?(nt&&!vtFull(v,nt)?`Hela kolumnen stämmer! Nästa gång: ${esc(nt)}.`:"Hela kolumnen stämmer!"):"De röda rutorna visar rätt form. Samma tempus kommer igen tills hela kolumnen är rätt."}</p>
    ${ruleFor(c0)?`<p class="foot">${esc(ruleFor(c0))}</p>`:""}`; };
// Frågan i Dagens pass: tabellen i quizet, ett försök, och resultatet räknas i passet
function renderVtabQ(d){
  const [v,t]=d.ref.split("|");
  app.innerHTML=`<section class="panel"><span class="tab">Verbtabell</span>${progressHead()}${vtTableHtml(v,t)}${tenseUse(t)}
    <div id="fb"></div><div class="navrow" id="vtnav"><button class="btn" id="vtcheck">Rätta</button></div></section>${quitBtn()}`;
  $("#quit").onclick=pauseSession;
  vtWire(ins=>{ if(sess.answered) return; sess.answered=true; const right=vtScore(v,t,ins), ok=right===ins.length;
    record(ok); sess.done++; snapRun(); save();
    $("#fb").innerHTML=vtResHtml(v,t,right); $("#vtnav").innerHTML=`<button class="btn" id="nx">Nästa</button>`; $("#nx").onclick=nextQ; $("#nx").focus(); });
  window.scrollTo(0,0);
}
function openVtab(v,t,back){
  t=t||vtTarget(v); if(!t) return openVtabList();
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  const start=Date.now();
  app.innerHTML=`<section class="panel"><span class="tab">Verbtabell</span>${vtTableHtml(v,t)}${tenseUse(t)}
    <div id="vtres"></div>
    <div class="navrow" id="vtnav"><button class="btn" id="vtcheck">Rätta</button></div></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  vtWire(ins=>vtGrade(v,t,ins,start));
  $("#quit").onclick=back||(()=>openVtabList());
  window.scrollTo(0,0);
}
function vtGrade(v,t,ins,start){
  const n=ins.length, right=vtScore(v,t,ins);
  S.log.push({kind:"vtab",d:Date.now(),dur:runSecs(start),right,total:n}); save(); boardPush();
  const nx=vtNext();
  $("#vtres").innerHTML=vtResHtml(v,t,right);
  $("#vtnav").innerHTML=`${right<n?`<button class="btn ghost" id="vtagain">Gör om</button>`:""}${nx?`<button class="btn" id="vtnext">Nästa: ${esc(nx.verb)} · ${esc(nx.t)}</button>`:`<button class="btn" id="vtlist">Alla verbtabeller</button>`}`;
  if($("#vtagain")) $("#vtagain").onclick=()=>openVtab(v,t);
  if($("#vtnext")) $("#vtnext").onclick=()=>openVtab(nx.verb,nx.t);
  if($("#vtlist")) $("#vtlist").onclick=openVtabList;
}
// @lazy-end
defineKind("vtab",{name:"Verbtabell",open:openVtabList,
  type:c=>({tab:"Verbtabell",render:renderVtabQ,ref:c.ref,answer:"",explain:""}),
  restore:ref=>{ const [v,t]=String(ref).split("|"); return L.verbs&&vtCells(v,t).every(Boolean)?{}:null; },
  recap:ref=>String(ref).replace("|"," · ")});
