/* ---------- Verbtabeller (elevens önskemål 2026-11-03) ----------
   "När man har lärt sig ett verb klart vill jag att det ska komma upp som verbböjningsuppgift, en tabell med pronomen och
   tempus, där man fyller i en kolumn." Kurser med L.verbs. Ett verb är klart när ordet i ordlistan har nått "kan"
   (isMastered) och verbet finns i verbtabellerna (CONJ). Tabellen har pronomenen som rader och tempus som kolumner; eleven
   fyller i en kolumn, de andra (högst VT_COLS-1, tempus eleven har övat) visas som stöd.
   Tempus att fylla i: det som verbet har gjort minst gånger, i verbspelens ordning (vtTarget). Efter Dagens pass finns en
   knapp till nästa verb med ett tempus som inte är gjort eller hade fel senast (vtNext); alla klara verb finns under
   Grammatik → Verbtabeller. Sparat: S.vtab[verb][tempus] = {r, n, last} (r = rätt av sex senast, n = antal gånger), och
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
const vtTenses=v=>Object.keys(L.verbs.tenses||{}).filter(t=>vtCells(v,t).every(Boolean));
const vtStat=(v,t)=>((S.vtab||{})[v]||{})[t];
function vtTarget(v){
  const ts=vtTenses(v).map((t,i)=>({t,i,n:(vtStat(v,t)||{}).n||0})).sort((a,b)=>a.n-b.n||a.i-b.i);
  return ts.length?ts[0].t:null;
}
const vtReady=()=>vtVerbs().filter(x=>isMastered(x.w)&&vtTenses(x.verb).length);
// Nästa uppgift: ett klart verb med ett tempus som inte är gjort eller hade fel senast
function vtNext(){
  for(const x of vtReady()){ const t=vtTarget(x.verb), s=vtStat(x.verb,t); if(!s||s.r<L.verbs.persons.length) return {...x,t}; }
  return null;
}
// Kolumnerna: tempus eleven har övat (verbspelen eller en tidigare tabell), i verbspelens ordning, och alltid det som ska fyllas i
function vtCols(v,t){
  const all=vtTenses(v), used=x=>((S.vt||{})[x]||{}).n>0||!!vtStat(v,x);
  let sup=all.filter(x=>x!==t&&used(x)); if(!sup.length&&t!==all[0]) sup=[all[0]];
  sup=sup.slice(0,VT_COLS-1);
  return all.filter(x=>x===t||sup.includes(x));
}
// Skärmarna hämtas först när en tabell öppnas (data/code-vtab.js, lazyRun i app.js)
// @lazy vtab
function openVtabList(){
  const xs=vtReady();
  pickerScreen("Verbtabeller",xs.length
    ?"Verb du kan. Välj ett och fyll i en kolumn i tabellen. Ett nytt verb kommer hit när du kan det i glosorna."
    :"Här kommer verben när du kan dem i glosorna. Då fyller du i en kolumn i verbets tabell, ett tempus i taget.",
    xs.map(x=>{ const ts=vtTenses(x.verb), done=ts.filter(t=>(vtStat(x.verb,t)||{}).r===L.verbs.persons.length).length;
      return {id:x.verb,title:x.verb,tag:`${done}/${ts.length} tempus`,status:done===ts.length?"alla tempus klara":""}; }),
    v=>openVtab(v));
}
function openVtab(v,t,back){
  t=t||vtTarget(v); if(!t) return openVtabList();
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  const cols=vtCols(v,t), P=L.verbs.persons, start=Date.now();
  app.innerHTML=`<section class="panel"><span class="tab">Verbtabell</span>
    <h2><span ${lang()}>${esc(v)}</span> <span class="sub" style="font-weight:400">(${esc(L.verbs.sv[v]||"")})</span></h2>
    <p class="plan">Fyll i kolumnen <b ${lang()}>${esc(t)}</b>. Skriv bara verbformen, pronomenet står redan. Enter går till nästa rad.</p>
    <div class="vtwrap"><table class="vtab"><thead><tr><th></th>${cols.map(c=>`<th class="${c===t?"on":""}" ${lang()}>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>${P.map((p,i)=>`<tr><th ${lang()}>${esc(p)}</th>${cols.map(c=>{ const x=CONJBY[v+"|"+c+"|"+p];
      return c===t?`<td class="on"><input class="vtin" data-vti="${i}" ${lang()} autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${esc(p)}, ${esc(t)}"><span class="vtfix" hidden></span></td>`
        :`<td ${lang()}>${esc(x.form)}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>
    ${accentKeys(L.verbAccents||L.accents)}
    <div id="vtres"></div>
    <div class="navrow" id="vtnav"><button class="btn" id="vtcheck">Rätta</button></div></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  const ins=[...app.querySelectorAll(".vtin")]; let last=ins[0];
  ins.forEach((inp,i)=>{ inp.onfocus=()=>{last=inp;}; inp.onkeydown=e=>{ if(e.key!=="Enter") return; e.preventDefault(); if(i<ins.length-1) ins[i+1].focus(); else $("#vtcheck").click(); }; });
  app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ const inp=last; if(!inp||inp.disabled) return;
    const s=inp.selectionStart??inp.value.length, e2=inp.selectionEnd??inp.value.length;
    inp.value=inp.value.slice(0,s)+b.dataset.c+inp.value.slice(e2); inp.focus(); inp.setSelectionRange(s+1,s+1); });
  $("#vtcheck").onclick=()=>vtGrade(v,t,ins,start);
  $("#quit").onclick=back||(()=>openVtabList()); try{ ins[0].focus({preventScroll:true}); }catch(e){ /* fokus går inte alltid att sätta */ }
  window.scrollTo(0,0);
}
function vtGrade(v,t,ins,start){
  const cells=vtCells(v,t); let right=0;
  ins.forEach((inp,i)=>{ const c=cells[i], r=check(inp.value,conjVariants(c),true), ok=r==="right", td=inp.parentNode, fix=td.querySelector(".vtfix");
    if(ok) right++; inp.disabled=true; td.classList.add(ok?"ok":"bad");
    if(!ok){ fix.hidden=false; fix.textContent=c.form+(r==="accent"?" (accenten)":r==="near"?" (nästan)":""); } });
  const n=cells.length; S.vtab=S.vtab||{}; S.vtab[v]=S.vtab[v]||{};
  const o=S.vtab[v][t]||{}; S.vtab[v][t]={r:right,n:(o.n||0)+1,last:Date.now()};
  S.vv=S.vv||{}; const vv=S.vv[v]||{r:0,n:0}; S.vv[v]={r:vv.r+right,n:vv.n+n};
  S.log.push({kind:"vtab",d:Date.now(),dur:runSecs(start),right,total:n}); save(); boardPush();
  const nx=vtNext();
  $("#vtres").innerHTML=`<p class="plan"><b>${right} av ${n} rätt.</b> ${right===n?"Hela kolumnen stämmer!":"De röda rutorna visar rätt form. Gör tabellen igen senare, så sitter den."}</p>
    ${ruleFor(cells[0])?`<p class="foot">${esc(ruleFor(cells[0]))}</p>`:""}`;
  $("#vtnav").innerHTML=`${right<n?`<button class="btn ghost" id="vtagain">Gör om</button>`:""}${nx?`<button class="btn" id="vtnext">Nästa: ${esc(nx.verb)} · ${esc(nx.t)}</button>`:`<button class="btn" id="vtlist">Alla verbtabeller</button>`}`;
  if($("#vtagain")) $("#vtagain").onclick=()=>openVtab(v,t);
  if($("#vtnext")) $("#vtnext").onclick=()=>openVtab(nx.verb,nx.t);
  if($("#vtlist")) $("#vtlist").onclick=openVtabList;
}
// @lazy-end
defineKind("vtab",{name:"Verbtabell",open:openVtabList});
