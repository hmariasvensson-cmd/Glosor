/* ---------- Högskoleprovet ORD (kind: "hp" och mono: true i lang.js) ----------
   En kurs på svenska: ordet och betydelsen är på samma språk. Allt som skiljer kursen från språkkurserna styrs av fälten
   i lang.js, aldrig av kurskoden:
   - mono: true  ingen uppläsning, inga skrivövningar på ett främmande språk (diktamen, översätt, ordföljd, Tala döljs),
                 glosquizet är alltid flerval och ett rätt flerval räcker hela vägen till "kan" (schedule i app.js),
                 ordklass i tredje fältet i words.txt (WORD_CLASSES i build.py) i stället för genus.
   - kind: "hp"  HP-formatet i glosquizet och kapitelprovet: ordet i fetstil och fem alternativ A–E (hpMC), introt och
                 provpasset på startsidan (hpPanel), Provpass ORD (10 ord, valfri tid, resultat X/10, historik i S.hp),
                 statistiken "Så förbättras du" (hpStatsPanel), provpassets resultat i topplistan och föräldravyn.
   Sparat: S.hp = {lim, prov: [{d, r, n, s, lim, ids, miss}], run} (nytt fält, oktober 2026; saknas tills eleven gjort ett
   provpass). lim = senast valda tid i sekunder (0 = utan tid), prov = historiken (högst HP_HIST, äldst först; s = sekunder,
   ids = orden, miss = de missade), run = ett pågående provpass {ids, opts, ans, i, used, lim, seen} som överlever en
   omladdning (klockan står still medan appen är stängd). Provpassets skärmar ligger i modulen "hp" (// @lazy hp nedan). */
const isMono=()=>!!(L&&L.mono);
const isHp=()=>!!(L&&L.kind==="hp");
const HP_N=5, HP_PROV=10, HP_HIST=100, HP_LETTERS="ABCDE";
const HP_TIMES=[0,180,240,300];   // provpassets tid: utan tid, 3, 4 eller 5 minuter (riktiga provet: ungefär 3–5 minuter för tio ord)
const hpState=()=>{ S.hp=S.hp&&typeof S.hp==="object"?S.hp:{}; if(!Array.isArray(S.hp.prov)) S.hp.prov=[]; return S.hp; };
const hpProvs=()=>(S&&S.hp&&Array.isArray(S.hp.prov))?S.hp.prov:[];

/* Fem alternativ: rätt betydelse och fyra andra ords betydelser. Helst samma ordklass (w.g) och ungefär samma längd,
   aldrig en synonym eller en betydelse som överlappar (alsoRight, svOverlap i 00-common.js) och aldrig två lika. */
function hpOptions(w,n=HP_N){
  const L0=(w.sv||"").length;
  const score=x=>(w.g&&x.g===w.g?0:w.g&&x.g?2:1)+Math.min(2,Math.abs((x.sv||"").length-L0)/Math.max(6,L0))+Math.random()*.8;
  const ok=(x,picks)=>x!==w&&!!x.sv&&x.sec!=="mine"&&norm(x.sv)!==norm(w.sv)&&!alsoRight(x,w)
    &&!picks.some(p=>norm(p.sv)===norm(x.sv)||svOverlap(p.sv,x.sv));
  const cands=WORDS.map(x=>({x,s:score(x)})).sort((a,b)=>a.s-b.s), picks=[];
  for(const {x} of cands){ if(picks.length>=n-1) break; if(ok(x,picks)) picks.push(x); }
  return shuffle([w,...picks]);
}
// Ordets förklaring efter svaret: rätt betydelse, exempelmeningen och förklaringen (sjätte fältet)
const hpExplain=w=>`<p class="hpans"><b>${esc(w.t)}</b> = ${esc(w.sv)}</p>${w.exT?`<p class="ex-t">${esc(w.exT)}</p>`:""}${w.ety?`<p class="ety"><span class="label">${esc(L.etyLabel||"Förklaring")}</span><br>${safeHtml(w.ety)}</p>`:""}`;
// HP-flervalet i glosquizet och kapitelprovet (KINDS.words.mc i 05-words.js frågar isHp())
function hpMC(c){
  const w=c.w;
  return {head:`<p class="q-prompt hpword"><b>${esc(w.t)}</b></p>`, ask:"Vilket alternativ betyder ungefär detsamma som ordet i fetstil?",
    letters:true, opts:hpOptions(w).map(o=>({label:o.sv,ok:o.id===w.id})), explain:hpExplain(w),
    wrongCard:`<div class="recap">${hpExplain(w)}${memoBox(w)}</div>`};
}

/* Startsidan: vad ORD är, hur man övar och provpasset */
function hpPanel(){
  const ps=hpProvs(), last=ps[ps.length-1], best=ps.length?Math.max(...ps.map(p=>p.r)):0, run=S.hp&&S.hp.run;
  return `<section class="panel hp" id="hppanel"><h2>Högskoleprovet: ORD</h2>
    <p class="plan">Delprovet ORD mäter ordförståelse. Varje uppgift är ett ord eller uttryck i fetstil och fem svarsalternativ, A–E. Du väljer det alternativ som bäst motsvarar ordets betydelse.</p>
    <details class="more"><summary>Så övar du</summary><p class="plan">Kör <b>Dagens pass</b> varje dag: nya ord ur ordlistan och repetition av dem du har övat, med allt längre mellanrum. Ett ord räknas som <b>kan</b> när du har haft rätt i fyra repetitioner i rad. Gör ett <b>provpass</b> då och då: tio ord som på provet, gärna med klocka (3–5 minuter). Under Statistik ser du hur resultaten utvecklas.</p></details>
    ${last?`<p class="plan" id="hplast">Senaste provpasset: <b>${last.r}/${last.n}</b>${ps.length>1?` · bästa ${best}/${HP_PROV} · ${ps.length} provpass`:""}.</p>`:""}
    <button class="btn" id="hpgo">${run?`Fortsätt provpasset (${run.ans.filter(a=>a>=0).length} av ${run.ids.length} besvarade)`:"Provpass ORD: 10 ord"}</button></section>`;
}
function wireHpPanel(){ const b=$("#hpgo"); if(b) b.onclick=()=>openHpProv(); }

/* Statistiken: provpassen över tid, andel ord du kan och övade ord per vecka */
// Enkelt diagram med ett tydligt värde vid varje punkt eller stapel: {labels, values, max, bar, tips, unit}
function hpChart(o){
  const n=o.values.length, W=600, H=220, ml=36, mr=16, mt=22, mb=30, iw=W-ml-mr, ih=H-mt-mb, max=o.max||niceMax(Math.max(1,...o.values));
  const x=i=>o.bar?ml+(i+.5)*iw/n:ml+(n===1?iw/2:i*iw/(n-1)), y=v=>mt+ih-(v/max)*ih;
  let g="";
  [0,.5,1].forEach(f=>{ const v=Math.round(max*f); g+=`<line class="gl" x1="${ml}" x2="${W-mr}" y1="${y(v)}" y2="${y(v)}"/><text x="${ml-8}" y="${y(v)+5}" text-anchor="end">${v}${o.unit||""}</text>`; });
  const step=Math.max(1,Math.ceil(n/8));
  if(o.bar){ const bw=Math.min(40,iw/n-6);
    o.values.forEach((v,i)=>{ const h=Math.max(v?2:0,ih*v/max);
      g+=`<rect x="${x(i)-bw/2}" y="${mt+ih-h}" width="${bw}" height="${h}" rx="3" fill="var(--c2)" data-tip="${esc(o.tips[i])}"><title>${esc(o.tips[i])}</title></rect>`; }); }
  else g+=`<polyline points="${o.values.map((v,i)=>`${x(i)},${y(v)}`).join(" ")}" fill="none" stroke="var(--c1)" stroke-width="2" stroke-linejoin="round"/>`
    +o.values.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="var(--c1)" stroke="var(--surface)" stroke-width="2" data-tip="${esc(o.tips[i])}"><title>${esc(o.tips[i])}</title></circle>`).join("");
  o.values.forEach((v,i)=>{ g+=`<text x="${x(i)}" y="${y(v)-9}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${v}${o.unit||""}</text>`;
    if(i%step===0||i===n-1) g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle">${esc(o.labels[i])}</text>`; });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria||"Diagram")}">${g}</svg>`;
}
const hpDate=d=>{ const t=new Date(d); return t.getDate()+"/"+(t.getMonth()+1); };
// Veckorna bakåt (äldst först): [{w: veckostart, e: veckoslut}]
function hpWeeks(n){ const out=[]; let w=weekStart(Date.now()); for(let i=0;i<n;i++){ out.unshift({w,e:w+7*864e5}); w=weekStart(w-3*864e5); } return out; }
function hpStatsPanel(){
  const ps=hpProvs().slice(-20), all=hpProvs(), weeks=hpWeeks(8), n=WORDS.length||1;
  const known=WORDS.filter(isMastered).length;
  // Andel kan-ord i slutet av varje vecka: ord som blev "kan" före veckans slut (md) och fortfarande kan
  const kan=weeks.map(k=>Math.round(100*WORDS.filter(w=>{ const x=ws(w.id); return x&&x.s>=MASTER&&(x.md||0)<k.e; }).length/n));
  // Övade ord per vecka: frågor i glosquizet, Dagens pass, kapitelprovet, meningar och provpassen
  const qs=weeks.map(k=>S.log.reduce((a,l)=>a+(l.d>=k.w&&l.d<k.e?(+l.total||0):0),0));
  const avg=a=>a.length?Math.round(10*a.reduce((s,p)=>s+p.r,0)/a.length)/10:null;
  const first=avg(all.slice(0,3)), lastA=avg(all.slice(-3));
  return `<section class="panel" id="hpstats"><h2>Så förbättras du</h2>
    <div class="stats4">
      <div class="stat"><b>${all.length?all[all.length-1].r+"/"+all[all.length-1].n:"–"}</b><span>senaste provpasset</span></div>
      <div class="stat"><b>${all.length?Math.max(...all.map(p=>p.r))+"/"+HP_PROV:"–"}</b><span>bästa provpasset</span></div>
      <div class="stat"><b>${Math.round(100*known/n)}%</b><span>av orden kan du (${known} av ${WORDS.length})</span></div>
      <div class="stat"><b>${qs[qs.length-1]}</b><span>övade ord den här veckan</span></div>
    </div>
    <h3>Provpass ORD</h3>
    ${ps.length?hpChart({labels:ps.map(p=>hpDate(p.d)),values:ps.map(p=>p.r),max:HP_PROV,aria:"Provpassens resultat över tid",
        tips:ps.map(p=>`${new Date(p.d).toLocaleDateString("sv-SE")}: ${p.r} av ${p.n} rätt${p.s?`, ${fmtMin(p.s)}`:""}${p.lim?` (gräns ${p.lim/60} min)`:""}`)})
      +(all.length>=6&&first!=null?`<p class="insight">I snitt ${String(lastA).replace(".",",")} rätt i de tre senaste provpassen, mot ${String(first).replace(".",",")} i de tre första.</p>`:"")
      :`<p class="plan">Du har inte gjort något provpass än. Gör ett, så syns resultatet här.</p>`}
    <h3>Andel ord du kan</h3>
    ${hpChart({labels:weeks.map(k=>"v. "+isoWeek(new Date(k.w))),values:kan,max:100,unit:"%",bar:true,aria:"Andel ord du kan, vecka för vecka",
      tips:weeks.map((k,i)=>`Vecka ${isoWeek(new Date(k.w))}: ${kan[i]} % av orden räknas som kan`)})}
    <h3>Övade ord per vecka</h3>
    ${hpChart({labels:weeks.map(k=>"v. "+isoWeek(new Date(k.w))),values:qs,bar:true,aria:"Övade ord per vecka",
      tips:weeks.map((k,i)=>`Vecka ${isoWeek(new Date(k.w))}: ${qs[i]} övade ord`)})}
    ${typeof hpVerbalStats==="function"?hpVerbalStats():""}
    <p class="foot">Ett ord räknas som kan när du har haft rätt i fyra repetitioner i rad (nästa pass, efter 3 pass, efter 3 och efter 7 dagar).</p>
    <button class="btn ghost" id="hpstatgo">Gör ett provpass</button></section>`;
}
function wireHpStats(){ const b=$("#hpstatgo"); if(b) b.onclick=()=>openHpProv(); }
// Topplistan och föräldravyn: provpassens bästa och senaste resultat (nya fält, befintliga ändras inte)
function hpBoard(){ const ps=hpProvs(); if(!ps.length) return null; const l=ps[ps.length-1];
  return {n:ps.length, best:Math.max(...ps.map(p=>p.r)), last:l.r, of:l.n, d:l.d}; }

defineKind("hpprov",{name:"Provpass ORD",open:()=>openHpProv()});

// @lazy hp
/* Provpass ORD: tio ord som på provet, alla svar först och facit efteråt. Valfri klocka; när tiden är slut lämnas
   provpasset in (obesvarade räknas som fel). Kan pausas och fortsättas (S.hp.run). */
let HP_TIMER=null;
function hpRun(){ return S.hp&&S.hp.run; }
function hpClock(r){ const now=Date.now(); r.used=(r.used||0)+Math.max(0,(now-(r.seen||now))/1000); r.seen=now; }
function hpPick(){
  const recent=new Set(hpProvs().slice(-2).flatMap(p=>p.ids||[]));
  let pool=WORDS.filter(w=>w.sec!=="mine"&&!recent.has(w.id)); if(pool.length<HP_PROV) pool=WORDS.filter(w=>w.sec!=="mine");
  // Hälften bland ord eleven har övat (om det finns), resten bland de andra: provet har både kända och okända ord
  const seen=shuffle(pool.filter(isLearned)), fresh=shuffle(pool.filter(w=>!isLearned(w))), k=Math.min(seen.length,HP_PROV/2);
  const out=[...seen.slice(0,k),...fresh.slice(0,HP_PROV-k)]; if(out.length<HP_PROV) out.push(...seen.slice(k,k+HP_PROV-out.length));
  return shuffle(out);
}
function openHpProv(){
  clearInterval(HP_TIMER); stopSpeech(); $("#tabs").hidden=true; sess=null;
  const h=hpState(), r=h.run, ps=h.prov, lim=HP_TIMES.includes(h.lim)?h.lim:240;
  const enough=WORDS.filter(w=>w.sec!=="mine").length>=HP_N;
  app.innerHTML=`<section class="panel" id="hpstart"><h2>Provpass ORD</h2>
    <p class="plan">Tio ord, som en del av provet. Välj det alternativ (A–E) som bäst motsvarar ordets betydelse. Du ser facit först när du lämnar in, och kan gå tillbaka och ändra svar innan dess. På riktiga provet har du ungefär 3–5 minuter för tio ord.</p>
    ${r?`<p class="plan">Du har ett påbörjat provpass: ${r.ans.filter(a=>a>=0).length} av ${r.ids.length} besvarade.</p><button class="btn" id="hpcont">Fortsätt provpasset</button>`:""}
    <div class="field"><span class="label">Tid</span><div class="seg" role="group" aria-label="Tid">${HP_TIMES.map(t=>`<button data-hplim="${t}" aria-pressed="${t===lim}">${t?t/60+" min":"Utan tid"}</button>`).join("")}</div></div>
    ${enough?`<button class="btn${r?" ghost":""}" id="hpnew">${r?"Börja om med nya ord":"Starta provpasset"}</button>`:`<p class="plan">Det behövs minst ${HP_N} ord i ordlistan.</p>`}
    ${ps.length?`<div class="field"><span class="label">Dina provpass</span><ul class="missed" id="hphist">${ps.slice(-10).reverse().map(p=>`<li><span>${esc(new Date(p.d).toLocaleDateString("sv-SE"))}${p.lim?` · ${p.lim/60} min`:""}</span><span><b>${p.r}/${p.n}</b>${p.s?` · ${esc(fmtMin(p.s))}`:""}</span></li>`).join("")}</ul></div>
      <button class="btn ghost" id="hpstats2">Se hur du förbättras</button>`:""}</section>
    <button class="quit" id="quit">Tillbaka</button>`;
  app.querySelectorAll("[data-hplim]").forEach(b=>b.onclick=()=>{ h.lim=+b.dataset.hplim; save(); app.querySelectorAll("[data-hplim]").forEach(x=>x.setAttribute("aria-pressed",x===b)); });
  if($("#hpcont")) $("#hpcont").onclick=()=>{ r.seen=Date.now(); hpQ(); };
  if($("#hpnew")) $("#hpnew").onclick=()=>hpStart();
  if($("#hpstats2")) $("#hpstats2").onclick=()=>setView("stats");
  $("#quit").onclick=backTo(renderStart); window.scrollTo(0,0);
}
function hpStart(){
  const h=hpState(), lim=HP_TIMES.includes(h.lim)?h.lim:240, ws_=hpPick();
  h.lim=lim; h.run={ids:ws_.map(w=>w.id),opts:ws_.map(w=>hpOptions(w).map(o=>o.id)),ans:ws_.map(()=>-1),i:0,used:0,lim,seen:Date.now()};
  save(); hpQ();
}
const hpLeft=r=>r.lim?Math.max(0,Math.ceil(r.lim-r.used)):null;
const hpFmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
function hpQ(){
  const r=hpRun(); if(!r) return openHpProv();
  if(r.ids.some(id=>!byId[id])||r.opts.some(o=>o.some(id=>!byId[id]))){ delete S.hp.run; save(); return openHpProv(); }   // ordlistan har ändrats
  hpClock(r); if(r.lim&&hpLeft(r)<=0) return hpDone(true);
  const i=r.i, w=byId[r.ids[i]], n=r.ids.length;
  $("#tabs").hidden=true;
  app.innerHTML=`<section class="panel" id="hpq"><span class="tab">Provpass ORD</span>
    <div class="meta"><span>Uppgift ${i+1} av ${n}</span><span id="hpclock">${r.lim?hpFmt(hpLeft(r))+" kvar":hpFmt(r.used)}</span></div>
    <div class="bar"><i style="width:${100*r.ans.filter(a=>a>=0).length/n}%"></i></div>
    <p class="q-prompt hpword"><b>${esc(w.t)}</b></p>
    <p class="q-ask">Vilket alternativ betyder ungefär detsamma som ordet i fetstil?</p>
    <div class="opts">${r.opts[i].map((id,k)=>`<button class="opt${r.ans[i]===k?" sel":""}" data-hpo="${k}" aria-pressed="${r.ans[i]===k}"><span class="k">${HP_LETTERS[k]}</span><span>${esc(byId[id].sv)}</span></button>`).join("")}</div>
    <div class="hpnav" aria-label="Uppgifterna">${r.ids.map((_,k)=>`<button type="button" data-hpi="${k}" class="${k===i?"cur ":""}${r.ans[k]>=0?"done":""}" aria-label="Uppgift ${k+1}${r.ans[k]>=0?", besvarad":""}">${k+1}</button>`).join("")}</div>
    <div class="navrow"><button class="btn ghost" id="hpprev" ${i?"":"disabled"}>Föregående</button>${i<n-1?`<button class="btn ghost" id="hpnext">Nästa</button>`:""}</div>
    <button class="btn" id="hpdone">Lämna in${r.ans.some(a=>a<0)?` (${r.ans.filter(a=>a<0).length} obesvarade)`:""}</button></section>
    <button class="quit" id="quit">Pausa provpasset</button>`;
  app.querySelectorAll("[data-hpo]").forEach(b=>b.onclick=()=>hpAnswer(+b.dataset.hpo));
  app.querySelectorAll("[data-hpi]").forEach(b=>b.onclick=()=>hpGo(+b.dataset.hpi));
  $("#hpprev").onclick=()=>hpGo(i-1); if($("#hpnext")) $("#hpnext").onclick=()=>hpGo(i+1);
  $("#hpdone").onclick=()=>hpDone(false);
  $("#quit").onclick=()=>{ hpClock(r); clearInterval(HP_TIMER); save(); renderStart(); };
  clearInterval(HP_TIMER); HP_TIMER=setInterval(hpTick,1000);
  save(true);
}
function hpTick(){
  const r=hpRun(), el=$("#hpclock"); if(!r||!el||!$("#hpq")){ clearInterval(HP_TIMER); return; }
  hpClock(r);
  if(r.lim&&hpLeft(r)<=0){ clearInterval(HP_TIMER); return hpDone(true); }
  el.textContent=r.lim?hpFmt(hpLeft(r))+" kvar":hpFmt(r.used);
  if(Math.floor(r.used)%60===0) save(true);   // en gång i minuten, så att tiden överlever en omladdning
}
function hpGo(i){ const r=hpRun(); if(!r||i<0||i>=r.ids.length) return; r.i=i; hpQ(); }
// Ett val markeras och provpasset går vidare till nästa obesvarade uppgift (efter en kort stund, så att valet syns)
function hpAnswer(k){
  const r=hpRun(); if(!r) return; r.ans[r.i]=k; save(true);
  app.querySelectorAll("[data-hpo]").forEach(b=>{ const on=+b.dataset.hpo===k; b.classList.toggle("sel",on); b.setAttribute("aria-pressed",on); });
  const i=r.i, nx=r.ans.findIndex((a,j)=>j>i&&a<0), back=r.ans.findIndex(a=>a<0);
  setTimeout(()=>{ if(hpRun()===r&&r.i===i&&$("#hpq")) hpGo(nx>=0?nx:back>=0?back:i); },250);
}
function hpDone(timeUp){
  clearInterval(HP_TIMER);
  const r=hpRun(); if(!r) return openHpProv(); hpClock(r);
  const h=hpState(), n=r.ids.length, ok=r.ids.map((id,i)=>r.ans[i]>=0&&r.opts[i][r.ans[i]]===id), right=ok.filter(Boolean).length;
  const miss=r.ids.filter((_,i)=>!ok[i]), s=Math.round(Math.min(r.used,r.lim||r.used)), prev=h.prov[h.prov.length-1], now=Date.now();
  h.prov.push({d:now,r:right,n,s,lim:r.lim||0,ids:r.ids,miss}); if(h.prov.length>HP_HIST) h.prov=h.prov.slice(-HP_HIST);
  S.log.push({d:now,dur:Math.min(MAX_RUN_SEC,s),right,total:n,kind:"hpprov"});
  delete h.run; save(); boardPush();
  const rows=r.ids.map((id,i)=>{ const w=byId[id], a=r.ans[i]; return `<li class="hpres ${ok[i]?"ok":"bad"}"><span class="t"><b>${esc(w.t)}</b> ${ok[i]?"✓":"✗"}</span>
    <span class="sv">${ok[i]?esc(w.sv):`${a>=0?`Du svarade ${HP_LETTERS[a]}: ${esc(byId[r.opts[i][a]].sv)}. `:"Obesvarad. "}Rätt: ${HP_LETTERS[r.opts[i].indexOf(id)]}: <b>${esc(w.sv)}</b>`}</span>
    ${w.exT||w.ety?`<span class="foot">${w.exT?esc(w.exT):""}${w.exT&&w.ety?" · ":""}${w.ety?safeHtml(w.ety):""}</span>`:""}</li>`; }).join("");
  const diff=prev?right-prev.r:null;
  app.innerHTML=`<section class="panel" id="hpres"><span class="label">Provpass ORD${timeUp?" · tiden är slut":""}</span>
    <div style="display:flex;align-items:baseline;gap:10px"><span class="big">${right}/${n}</span><span class="sub">rätt · ${esc(fmtMin(s))}${r.lim?` av ${r.lim/60} min`:""}</span></div>
    <p class="plan">${diff==null?"Ditt första provpass. Gör ett nytt om några dagar och se hur det går.":diff>0?`${diff} fler rätt än förra gången.`:diff<0?`${-diff} färre rätt än förra gången.`:"Lika många rätt som förra gången."}</p>
    <ul class="missed hplist">${rows}</ul>
    ${miss.length?`<button class="btn" id="hpdrill">Öva på ${miss.length===1?"ordet":`de ${miss.length} orden`} du missade</button>`:`<p class="plan">Alla rätt!</p>`}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn ghost" id="hpagain">Nytt provpass</button></div>
    <button class="btn ghost" id="st">Se hur du förbättras</button></section>`;
  // De missade orden i ett vanligt glospass: nya ord med lärokort, de övade som repetition
  if($("#hpdrill")) $("#hpdrill").onclick=()=>{ const ws_=miss.map(id=>byId[id]).filter(Boolean); startSession(ws_.filter(w=>!isLearned(w)),ws_.filter(isLearned)); };
  $("#home").onclick=renderStart; $("#hpagain").onclick=()=>openHpProv(); $("#st").onclick=()=>setView("stats");
  window.scrollTo(0,0); renderList();
}
// Tangentbordet i provpasset: A–E eller 1–5 väljer, pilarna bläddrar
document.addEventListener("keydown",e=>{
  if(!$("#hpq")||e.ctrlKey||e.metaKey||e.altKey||(e.target&&e.target.matches&&e.target.matches("input,textarea,select"))) return;
  const k=e.key.length===1?(HP_LETTERS.indexOf(e.key.toUpperCase())>=0?HP_LETTERS.indexOf(e.key.toUpperCase()):+e.key-1):-1;
  const r=hpRun(); if(!r) return;
  if(k>=0&&k<HP_N){ e.preventDefault(); hpAnswer(k); }
  else if(e.key==="ArrowRight"){ e.preventDefault(); hpGo(r.i+1); }
  else if(e.key==="ArrowLeft"){ e.preventDefault(); hpGo(r.i-1); }
});
// @lazy-end
