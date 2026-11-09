/* ---------- Högskoleprovet: provpass för hela den verbala delen (backloggen, P3) ----------
   Som ett verbalt provpass: ORD, LÄS, MEK och ELF med tio uppgifter vardera, 40 uppgifter på 55 minuter (eller utan
   tid). Alla svar först och facit efteråt, och man kan gå tillbaka och ändra svar innan man lämnar in, som i Provpass ORD.
   Bara kurser med ORD-ord och innehåll i alla tre delarna (isHp() och content/mek.json, las.json, elf.json).
   Sparat i S.hp (nya fält, november 2026):
     S.hp.verb = [{d, r, n, s, lim, parts: {ord: [rätt, antal], las, mek, elf}}] (högst HP_HIST, äldst först)
     S.hp.vrun = ett pågående provpass {items: [{k, ref, opts?}], ans, i, used, lim, seen}; k = "ord", "las", "mek" eller
       "elf", ref = ordets id, "<text-id>:<nr>" eller MEK-uppgiftens id, opts = ORD-alternativens id (fryses, eftersom
       hpOptions slumpar). Klockan står still medan appen är stängd.
   Loggpost {kind: "hpverb", d, dur, right, total}. Topplistan och föräldravyn får langs.hp.hpv / courses.hp.hpv =
   {n, best, last, of, d} (hpVerbBoard). Skärmarna ligger i HP-kursens kodmodul (// @lazy hp). */
const VP_PARTS=[{k:"ord",name:"ORD"},{k:"las",name:"LÄS"},{k:"mek",name:"MEK"},{k:"elf",name:"ELF"}];
const VP_N=10, VP_TIMES=[0,3300];   // tio uppgifter per del; utan tid eller 55 minuter som på provet
const vpHist=()=>(S&&S.hp&&Array.isArray(S.hp.verb))?S.hp.verb:[];
const hasVerbProv=()=>isHp()&&(C().mek||[]).length>=VP_N&&(C().las||[]).length>0&&(C().elf||[]).length>0;
function hpVerbBoard(){ const ps=vpHist(); if(!ps.length) return null; const l=ps[ps.length-1];
  return {n:ps.length, best:Math.max(...ps.map(p=>p.r)), last:l.r, of:l.n, d:l.d}; }
defineKind("hpverb",{name:"Provpass verbal del",open:()=>openVerbProv()});

// @lazy hp
let VP_TIMER=null;
const vpRun=()=>S.hp&&S.hp.vrun;
// LÄS och ELF: frågor ur hela texter tills det blir n (den sista texten kan kortas), de minst gjorda texterna först
function vpTextItems(k,n){
  const ts=shuffle(hpvTexts(k).slice()).sort((a,b)=>((S.tx||{})[a.id]?1:0)-((S.tx||{})[b.id]?1:0)), out=[];
  for(const t of ts){ (t.questions||[]).forEach((q,i)=>{ if(out.length<n) out.push({k,ref:`${t.id}:${i}`}); }); if(out.length>=n) break; }
  return out;
}
function vpItems(){
  const ord=hpPick().slice(0,VP_N).map(w=>({k:"ord",ref:w.id,opts:hpOptions(w).map(o=>o.id)}));
  return [...ord,...vpTextItems("las",VP_N),...mekPick(VP_N).map(m=>({k:"mek",ref:m.id})),...vpTextItems("elf",VP_N)];
}
// Alternativen och det rätta svarets index för en uppgift
function vpOpts(it){
  if(it.k==="ord") return {opts:it.opts.map(id=>(optById(id)||{}).sv||""),a:it.opts.indexOf(it.ref)};
  if(it.k==="mek"){ const m=mekById(it.ref); return m?{opts:m.opts,a:m.a}:null; }
  const x=hpvQ(it.k,it.ref); return x?{opts:x.q.opts,a:x.q.a}:null;
}
const vpOk=it=>it.k==="ord"?!!byId[it.ref]&&it.opts.every(id=>optById(id)):!!vpOpts(it);
const vpPart=k=>VP_PARTS.find(p=>p.k===k)||VP_PARTS[0];
function openVerbProv(){
  if(textsWait(()=>openVerbProv(),"provpasset")) return;   // LÄS och ELF ligger i textfilen
  clearInterval(VP_TIMER); stopSpeech(); $("#tabs").hidden=true; sess=null;
  const h=hpState(), r=h.vrun, ps=vpHist(), lim=VP_TIMES.includes(h.vlim)?h.vlim:3300;
  app.innerHTML=`<section class="panel" id="vpstart"><h2>Provpass: verbala delen</h2>
    <p class="plan">Som ett verbalt provpass på Högskoleprovet: ORD, LÄS, MEK och ELF med tio uppgifter vardera, 40 uppgifter på 55 minuter. Du ser facit först när du lämnar in och kan gå tillbaka och ändra svar innan dess. Räkna med ungefär 5 minuter för ORD, 22 för LÄS, 8 för MEK och 20 för ELF.</p>
    ${r?`<p class="plan">Du har ett påbörjat provpass: ${r.ans.filter(a=>a>=0).length} av ${r.items.length} besvarade.</p><button class="btn" id="vpcont">Fortsätt provpasset</button>`:""}
    <div class="field"><span class="label">Tid</span><div class="seg" role="group" aria-label="Tid">${VP_TIMES.map(t=>`<button data-vplim="${t}" aria-pressed="${t===lim}">${t?t/60+" min":"Utan tid"}</button>`).join("")}</div></div>
    ${hasVerbProv()?`<button class="btn${r?" ghost":""}" id="vpnew">${r?"Börja om med nya uppgifter":"Starta provpasset"}</button>`:`<p class="plan">Det behövs ord och uppgifter i MEK, LÄS och ELF.</p>`}
    ${ps.length?`<div class="field"><span class="label">Dina provpass</span><ul class="missed" id="vphist">${ps.slice(-10).reverse().map(p=>`<li><span>${esc(new Date(p.d).toLocaleDateString("sv-SE"))}${p.lim?` · ${p.lim/60} min`:""}</span><span><b>${p.r}/${p.n}</b> · ${VP_PARTS.map(x=>`${x.name} ${((p.parts||{})[x.k]||[0])[0]}`).join(", ")}</span></li>`).join("")}</ul></div>`:""}</section>
    <button class="quit" id="quit">Tillbaka</button>`;
  app.querySelectorAll("[data-vplim]").forEach(b=>b.onclick=()=>{ h.vlim=+b.dataset.vplim; save(); app.querySelectorAll("[data-vplim]").forEach(x=>x.setAttribute("aria-pressed",x===b)); });
  if($("#vpcont")) $("#vpcont").onclick=()=>{ r.seen=Date.now(); vpQ(); };
  if($("#vpnew")) $("#vpnew").onclick=()=>vpStart();
  $("#quit").onclick=backTo(renderStart); window.scrollTo(0,0);
}
function vpStart(){
  const h=hpState(), lim=VP_TIMES.includes(h.vlim)?h.vlim:3300, items=vpItems();
  h.vlim=lim; h.vrun={items,ans:items.map(()=>-1),i:0,used:0,lim,seen:Date.now()};
  save(); vpQ();
}
function vpQ(){
  const r=vpRun(); if(!r) return openVerbProv();
  if(r.items.some(it=>!vpOk(it))){ delete S.hp.vrun; save(); return openVerbProv(); }   // innehållet har ändrats
  hpClock(r); if(r.lim&&hpLeft(r)<=0) return vpDone(true);
  const i=r.i, it=r.items[i], n=r.items.length, o=vpOpts(it), p=vpPart(it.k);
  let head="", ask="";
  if(it.k==="ord"){ head=`<p class="q-prompt hpword"><b>${esc(byId[it.ref].t)}</b></p>`; ask="Vilket alternativ betyder ungefär detsamma som ordet i fetstil?"; }
  else if(it.k==="mek"){ const m=mekById(it.ref); head=`<p class="cloze mek">${esc(m.text).replace(/___/g,`<span class="gap mekgap">&nbsp;</span>`)}</p>`;
    ask=(m.text.match(/___/g)||[]).length>1?"Vilket alternativ passar bäst i luckorna?":"Vilket alternativ passar bäst i luckan?"; }
  else { const x=hpvQ(it.k,it.ref); head=`<details class="more" open><summary>Texten: ${esc(x.t.title)}</summary>${hpvBody(it.k,x.t)}</details>`; ask=`<b lang="${HPV[it.k].lang}">${esc(x.q.q)}</b>`; }
  const lang_=it.k==="elf"?` lang="en"`:"";
  $("#tabs").hidden=true;
  app.innerHTML=`<section class="panel" id="vpq"><span class="tab">Provpass verbal del · ${p.name}</span>
    <div class="meta"><span>Uppgift ${i+1} av ${n}</span><span id="vpclock">${r.lim?hpFmt(hpLeft(r))+" kvar":hpFmt(r.used)}</span></div>
    <div class="bar"><i style="width:${100*r.ans.filter(a=>a>=0).length/n}%"></i></div>
    ${head}<p class="q-ask">${ask}</p>
    <div class="opts">${o.opts.map((t,k)=>`<button class="opt${r.ans[i]===k?" sel":""}" data-vpo="${k}" aria-pressed="${r.ans[i]===k}"><span class="k">${HP_LETTERS[k]}</span><span${lang_}>${esc(t)}</span></button>`).join("")}</div>
    ${VP_PARTS.map(x=>{ const ks=r.items.map((y,k)=>y.k===x.k?k:-1).filter(k=>k>=0); return ks.length?`<div class="hpnav" aria-label="${x.name}"><span class="label">${x.name}</span>${ks.map(k=>`<button type="button" data-vpi="${k}" class="${k===i?"cur ":""}${r.ans[k]>=0?"done":""}" aria-label="Uppgift ${k+1}${r.ans[k]>=0?", besvarad":""}">${k+1}</button>`).join("")}</div>`:""; }).join("")}
    <div class="navrow"><button class="btn ghost" id="vpprev" ${i?"":"disabled"}>Föregående</button>${i<n-1?`<button class="btn ghost" id="vpnext">Nästa</button>`:""}</div>
    <button class="btn" id="vpdone">Lämna in${r.ans.some(a=>a<0)?` (${r.ans.filter(a=>a<0).length} obesvarade)`:""}</button></section>
    <button class="quit" id="quit">Pausa provpasset</button>`;
  app.querySelectorAll("[data-vpo]").forEach(b=>b.onclick=()=>vpAnswer(+b.dataset.vpo));
  app.querySelectorAll("[data-vpi]").forEach(b=>b.onclick=()=>vpGo(+b.dataset.vpi));
  $("#vpprev").onclick=()=>vpGo(i-1); if($("#vpnext")) $("#vpnext").onclick=()=>vpGo(i+1);
  $("#vpdone").onclick=()=>vpDone(false);
  $("#quit").onclick=()=>{ hpClock(r); clearInterval(VP_TIMER); save(); renderStart(); };
  clearInterval(VP_TIMER); VP_TIMER=setInterval(vpTick,1000);
  save(true); window.scrollTo(0,0);
}
function vpTick(){
  const r=vpRun(), el=$("#vpclock"); if(!r||!el||!$("#vpq")){ clearInterval(VP_TIMER); return; }
  hpClock(r);
  if(r.lim&&hpLeft(r)<=0){ clearInterval(VP_TIMER); return vpDone(true); }
  el.textContent=r.lim?hpFmt(hpLeft(r))+" kvar":hpFmt(r.used);
  if(Math.floor(r.used)%60===0) save(true);
}
function vpGo(i){ const r=vpRun(); if(!r||i<0||i>=r.items.length) return; r.i=i; vpQ(); }
function vpAnswer(k){
  const r=vpRun(); if(!r) return; r.ans[r.i]=k; save(true);
  app.querySelectorAll("[data-vpo]").forEach(b=>{ const on=+b.dataset.vpo===k; b.classList.toggle("sel",on); b.setAttribute("aria-pressed",on); });
  const i=r.i, nx=r.ans.findIndex((a,j)=>j>i&&a<0), back=r.ans.findIndex(a=>a<0);
  setTimeout(()=>{ if(vpRun()===r&&r.i===i&&$("#vpq")) vpGo(nx>=0?nx:back>=0?back:i); },250);
}
function vpDone(timeUp){
  clearInterval(VP_TIMER);
  const r=vpRun(); if(!r) return openVerbProv(); hpClock(r);
  const h=hpState(), n=r.items.length, os=r.items.map(vpOpts), ok=r.items.map((it,i)=>r.ans[i]>=0&&r.ans[i]===os[i].a), right=ok.filter(Boolean).length;
  const parts={}; VP_PARTS.forEach(p=>{ const ks=r.items.map((it,i)=>it.k===p.k?i:-1).filter(i=>i>=0); parts[p.k]=[ks.filter(i=>ok[i]).length,ks.length]; });
  const s=Math.round(Math.min(r.used,r.lim||r.used)), prev=vpHist()[vpHist().length-1], now=Date.now();
  h.verb=vpHist().concat([{d:now,r:right,n,s,lim:r.lim||0,parts}]).slice(-HP_HIST);
  // Resultatet per uppgift räknas som vanligt: MEK i S.mek, ORD-orden flyttas inte i schemat (som Provpass ORD)
  r.items.forEach((it,i)=>{ if(it.k==="mek"&&KINDS.mek.effect) KINDS.mek.effect(it.ref,ok[i]); });
  S.log.push({d:now,dur:Math.min(MAX_RUN_SEC,s),right,total:n,kind:"hpverb"});
  delete h.vrun; save(); boardPush();
  const why=(it,i)=>{ if(it.k==="ord"){ const w=byId[it.ref]; return `<b>${esc(w.t)}</b> = ${esc(w.sv)}`; }
    if(it.k==="mek"){ const m=mekById(it.ref); return esc(m.why||""); }
    const x=hpvQ(it.k,it.ref); return `${esc(x.t.title)}: ${esc(x.q.why||"")}`; };
  const rows=r.items.map((it,i)=>ok[i]?"":`<li class="hpres bad"><span class="t"><b>${vpPart(it.k).name} ${i+1}</b> ✗</span>
    <span class="sv">${r.ans[i]>=0?`Du svarade ${HP_LETTERS[r.ans[i]]}. `:"Obesvarad. "}Rätt: ${HP_LETTERS[os[i].a]}: <b${it.k==="elf"?' lang="en"':""}>${esc(os[i].opts[os[i].a])}</b></span>
    <span class="foot">${why(it,i)}</span></li>`).join("");
  const diff=prev?right-prev.r:null;
  app.innerHTML=`<section class="panel" id="vpres"><span class="label">Provpass verbal del${timeUp?" · tiden är slut":""}</span>
    <div style="display:flex;align-items:baseline;gap:10px"><span class="big">${right}/${n}</span><span class="sub">rätt · ${esc(fmtMin(s))}${r.lim?` av ${r.lim/60} min`:""}</span></div>
    <table class="hpv"><tbody>${VP_PARTS.map(p=>`<tr><th>${p.name}</th><td>${parts[p.k][0]} av ${parts[p.k][1]}</td></tr>`).join("")}</tbody></table>
    <p class="plan">${diff==null?"Ditt första verbala provpass. Gör ett nytt om några veckor och jämför.":diff>0?`${diff} fler rätt än förra gången.`:diff<0?`${-diff} färre rätt än förra gången.`:"Lika många rätt som förra gången."} Öva mest på den del där du hade minst rätt.</p>
    ${rows?`<h3>Det du missade</h3><ul class="missed hplist">${rows}</ul>`:`<p class="plan">Alla rätt!</p>`}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn ghost" id="vpagain">Nytt provpass</button></div></section>`;
  $("#home").onclick=renderStart; $("#vpagain").onclick=()=>openVerbProv();
  window.scrollTo(0,0);
}
document.addEventListener("keydown",e=>{
  if(!$("#vpq")||e.ctrlKey||e.metaKey||e.altKey||(e.target&&e.target.matches&&e.target.matches("input,textarea,select,summary"))) return;
  const r=vpRun(); if(!r) return; const n=(vpOpts(r.items[r.i])||{opts:[]}).opts.length;
  const k=e.key.length===1?(HP_LETTERS.indexOf(e.key.toUpperCase())>=0?HP_LETTERS.indexOf(e.key.toUpperCase()):+e.key-1):-1;
  if(k>=0&&k<n){ e.preventDefault(); vpAnswer(k); }
  else if(e.key==="ArrowRight"){ e.preventDefault(); vpGo(r.i+1); }
  else if(e.key==="ArrowLeft"){ e.preventDefault(); vpGo(r.i-1); }
});
// @lazy-end
