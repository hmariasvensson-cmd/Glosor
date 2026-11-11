/* ---------- Adjektivändelser steg för steg (Tyska 4 och 5, 2026-11-11) ----------
   Eleven i tyska hade 20 % rätt på adjektivändelserna. Den här övningen tränar tankegången: 1 vilket kasus (meningen
   säger varför), 2 vilket genus eller plural, 3 visar artikeln redan genus och kasus? Ett fel svar säger vilket steg som
   blev fel (atWhy). Data i grammar.json: adjtr = {text (regeltexterna per fall, atRule), adjectives, nouns: [[ord, genus, plural, svenska]], frames: [{t, cs, why}]}
   ({X} = artikel + adjektiv + substantiv). Artiklar: der (bestämd), ein, kein, mein och ingen (bara plural).
   Ref "<substantiv>|<mening>|<artikel>|<1 = plural>|<adjektiv>" (index i adjtr). Två typer: adjk (vilket kasus?) och
   adje (vilken ändelse?); i läget Steg för steg kommer adjk före adje för samma mening.
   S.adjtr = {c: {<der|ein|kein|0>|<kasus>|<m|f|n|pl>: {r, n}}, step: 0|1}; adje räknas också in i S.gt.adj (grammatikens
   område Adjektivändelser, som föräldravyn visar). */
const AT=()=>GR()&&GR().adjtr;
const hasAdjTr=()=>{ const a=AT(); return !!(a&&(a.nouns||[]).length&&(a.frames||[]).length&&(a.adjectives||[]).length); };
const AT_CS=["nom","akk","dat"], AT_G=["m","f","n","pl"];
const AT_DEF={nom:["der","die","das","die"],akk:["den","die","das","die"],dat:["dem","der","dem","den"]};
const AT_EIN={nom:["ein","eine","ein","e"],akk:["einen","eine","ein","e"],dat:["einem","einer","einem","en"]};
const AT_END={def:{nom:["e","e","e","en"],akk:["en","e","e","en"],dat:["en","en","en","en"]},
  ein:{nom:["er","e","es","en"],akk:["en","e","es","en"],dat:["en","en","en","en"]},
  zero:{nom:["er","e","es","e"],akk:["en","e","es","e"],dat:["em","er","em","en"]}};
const atTab=art=>art==="der"?"def":art==="0"?"zero":"ein";
const AT_ARTSV={def:"der, die, das",ein:"ein, kein, mein",zero:"utan artikel"};
function atParts(ref){
  const a=AT(); if(!a) return null;
  const [ni,fi,art,pl,ai]=String(ref).split("|"), n=a.nouns[+ni], f=a.frames[+fi], adj=a.adjectives[+ai];
  if(!n||!f||!adj||!AT_CS.includes(f.cs)) return null;
  const cs=f.cs, gi=pl==="1"?3:AT_G.indexOf(n[1]), tab=atTab(art);
  if(gi<0||(gi===3&&art==="ein")||(gi<3&&art==="0")) return null;
  const A=art==="der"?AT_DEF[cs][gi]:art==="0"?"":gi===3?art+AT_EIN[cs][3]:AT_EIN[cs][gi].replace(/^ein/,art);
  const N=gi===3?n[2]+(cs==="dat"&&!/[ns]$/.test(n[2])?"n":""):n[0], end=AT_END[tab][cs][gi];
  const phrase=(A?A+" ":"")+adj+end+" "+N, key=`${art==="mein"?"kein":art}|${cs}|${AT_G[gi]}`;
  return {n,f,art,cs,gi,tab,A,N,adj,end,phrase,key,sent:f.t.replace("{X}",phrase),gap:f.t.replace("{X}",(A?A+" ":"")+adj+"… "+N)};
}
const atGsv=x=>x.gi===3?`plural (die ${x.n[2]})`:`${G_SV[x.n[1]]} (${AT_DEF.nom[x.gi]} ${x.n[0]})`;
function atRule(x){ const T=AT().text||{}, k=x.tab!=="ein"?x.tab:x.gi===3?"pl":x.end==="er"||x.end==="es"?"g":x.end==="e"?"f":"k";
  return (T[k]||"").replace("{A}",x.gi===3&&x.tab==="ein"?x.art+"e":x.A).replace("{cs}",CASE_SV[x.cs]); }
const atSteps=x=>`<ol class="steps"><li><b>Kasus:</b> ${esc(CASE_SV[x.cs])}. ${esc(x.f.why.replace("{X}",x.phrase))}</li><li><b>Genus:</b> ${esc(atGsv(x))}.</li><li><b>Ändelse:</b> -${esc(x.end)}. ${esc(atRule(x))}</li></ol>`;
// Vilket steg blev fel? Ändelsen w passar för ett annat kasus, ett annat genus eller en annan sorts artikel
function atWhy(x,w){
  const T=AT_END[x.tab];
  const cs=AT_CS.find(c=>c!==x.cs&&T[c][x.gi]===w);
  if(cs) return `-${esc(w)} vore rätt i ${CASE_SV[cs]}. Här är det ${CASE_SV[x.cs]}: ${esc(x.f.why.replace("{X}",x.phrase))}`;
  const g=[0,1,2,3].find(i=>i!==x.gi&&T[x.cs][i]===w&&!(x.tab==="zero"&&i<3)&&!(x.art==="ein"&&i===3));
  if(g!=null) return `-${esc(w)} hör till ${g===3?"plural":G_SV[AT_G[g]]}. Här är det ${esc(atGsv(x))}.`;
  const t=["def","ein","zero"].find(k=>k!==x.tab&&AT_END[k][x.cs][x.gi]===w);
  if(t) return `-${esc(w)} är ändelsen ${t==="zero"?"utan artikel":"efter "+AT_ARTSV[t]}. Här står ${x.A?esc(x.A):"ingen artikel"}, och ${esc(atRule(x))}`;
  const o=AT_CS.flatMap(c=>[0,1,2,3].map(i=>[c,i])).find(([c,i])=>T[c][i]===w&&!(x.tab==="zero"&&i<3)&&!(x.art==="ein"&&i===3));
  return o?`-${esc(w)} vore rätt för ${o[1]===3?"plural":G_SV[AT_G[o[1]]]} i ${CASE_SV[o[0]]}. Här är det ${esc(atGsv(x))} i ${CASE_SV[x.cs]}: ${esc(x.f.why.replace("{X}",x.phrase))}`
    :`-${esc(w)} finns inte i ${CASE_SV[x.cs]} med ${x.A?esc(x.A):"ingen artikel"}.`;
}
const atHead=(x,full)=>`<p class="q-prompt" ${lang()}>${esc(full?x.sent:x.gap)}</p><p class="ex-sv">${esc(x.n[0])} = ${esc(x.n[3])}</p>`;
const adjkMC=c=>{ const x=atParts(c.ref);
  return {tab:"Adjektivändelser",head:atHead(x),ask:"Steg 1: vilket kasus står frasen i?",
    opts:AT_CS.map(k=>({label:CASE_SV[k],ok:k===x.cs})),explain:`<p>${esc(x.f.why.replace("{X}",x.phrase))}</p>`}; };
const adjeMC=c=>{ const x=atParts(c.ref);
  return {tab:"Adjektivändelser",head:atHead(x),ask:`Vilken ändelse får <b ${lang()}>${esc(x.adj)}</b>?`,
    opts:shuffle(["e","en","er","es","em"].map(w=>({label:x.adj+w,ok:w===x.end,lang:true,why:w===x.end?"":atWhy(x,w)}))),
    explain:`<p class="ex-t" ${lang()}>${esc(x.sent)}</p>${atSteps(x)}`,say:x.sent,sayOnAnswer:true}; };
const adjeType=c=>{ const x=atParts(c.ref);
  return {tab:"Adjektivändelser",head:atHead(x),ask:`Skriv <b ${lang()}>${esc(x.adj)}</b> med rätt ändelse.`,placeholder:x.adj+"…",accents:L.accents,
    check:v=>{ const t=gnorm(v); if(!t) return {r:"empty"}; if(t===x.adj+x.end) return {r:"right"};
      const w=t.startsWith(x.adj)?t.slice(x.adj.length):""; return {r:"wrong",html:["e","en","er","es","em"].includes(w)?`<p class="wnote">${atWhy(x,w)}</p>`:""}; },
    answer:x.adj+x.end,explain:`<p class="ex-t" ${lang()}>${esc(x.sent)}</p>${atSteps(x)}`,say:x.sent}; };
function atAdd(ref,ok){ const x=atParts(ref); if(!x) return;
  S.adjtr=S.adjtr||{c:{}}; const c=S.adjtr.c[x.key]=S.adjtr.c[x.key]||{r:0,n:0}; c.n++; if(ok) c.r++;
  S.gt=S.gt||{}; const g=S.gt.adj=S.gt.adj||{r:0,n:0}; g.n++; if(ok) g.r++; }
const atRecap=ref=>{ const x=atParts(ref); return x?x.sent:""; };
defineKind("adjk",{name:"Kasus",mc:adjkMC,restore:ref=>atParts(ref)?{}:null,recap:atRecap});
defineKind("adje",{name:"Adjektivändelser",mc:adjeMC,type:adjeType,restore:ref=>atParts(ref)?{}:null,effect:atAdd,recap:atRecap,
  after:atAfter,open:openAdjTr,again:startAdjTr});
// Skärmarna hämtas när övningen öppnas (data/code-ovningar.js)
// @lazy ovningar
const AT_ARTS=["der","ein","kein","mein","0"];
function atCells(){
  const st=(S.adjtr||{}).c||{}, out=[];
  AT_ARTS.forEach(art=>AT_CS.forEach(cs=>[0,1,2,3].forEach(gi=>{ if((gi===3&&art==="ein")||(gi<3&&art==="0")) return;
    const k=`${art==="mein"?"kein":art}|${cs}|${AT_G[gi]}`, s=st[k]||{r:0,n:0};
    out.push({art,cs,gi,k,s,w:s.n<3?1:1.15-s.r/s.n}); })));
  return out;
}
function startAdjTr(){
  const a=AT(), cells=atCells(), items=[], step=!!(S.adjtr||{step:1}).step;
  for(let i=0;i<10&&cells.length;i++){
    let r=Math.random()*cells.reduce((t,c)=>t+c.w,0), j=0; while(j<cells.length-1&&(r-=cells[j].w)>0) j++;
    const c=cells.splice(j,1)[0];
    const ns=a.nouns.map((n,ni)=>[n,ni]).filter(([n])=>c.gi===3||n[1]===AT_G[c.gi]), fs=a.frames.map((f,fi)=>[f,fi]).filter(([f])=>f.cs===c.cs);
    if(!ns.length||!fs.length) continue;
    const ref=[ns[Math.floor(Math.random()*ns.length)][1],fs[Math.floor(Math.random()*fs.length)][1],c.art,c.gi===3?1:0,Math.floor(Math.random()*a.adjectives.length)].join("|");
    if(step) items.push({k:"adjk",id:"adjk:"+ref,ref,t:"mc"});
    items.push({k:"adje",id:"adje:"+ref,ref,t:c.s.n>=4&&c.s.r/c.s.n>=.8?"type":"mc",canType:true});
  }
  $("#tabs").hidden=true; sess=null;
  beginQuiz("adje",items,{againFn:["adje"],label:"Adjektivändelser",ctx:{type:"adje"}});
}
function atTable(){
  const st=(S.adjtr||{}).c||{}, pc=k=>{ const s=st[k]; return s&&s.n?`${Math.round(100*s.r/s.n)} %`:"–"; };
  const rows=["der","ein","kein","0"].map(art=>`<tr><th>${art==="0"?"utan artikel":art==="kein"?"kein, mein":art==="der"?"der, die, das":"ein"}</th>${AT_CS.map(cs=>`<td>${["m","f","n","pl"].filter(g=>!(art==="ein"&&g==="pl")&&!(art==="0"&&g!=="pl")).map(g=>`${g} ${pc(`${art}|${cs}|${g}`)}`).join("<br>")}</td>`).join("")}</tr>`).join("");
  return `<div class="tablewrap"><table class="adjtab"><tr><th></th>${AT_CS.map(cs=>`<th>${CASE_SV[cs]}</th>`).join("")}</tr>${rows}</table></div>`;
}
function openAdjTr(){
  talkStop&&talkStop(); stopSpeech(); $("#tabs").hidden=true; sess=null; curView="ova";
  S.adjtr=S.adjtr||{c:{},step:1}; const step=!!S.adjtr.step;
  app.innerHTML=`<section class="panel"><span class="tab">Adjektivändelser</span><h2>Adjektivändelser steg för steg</h2>
    <p class="plan">Tänk i tre steg: <b>1</b> vilket kasus (subjekt, objekt eller efter en preposition?), <b>2</b> vilket genus eller plural, <b>3</b> visar artikeln redan genus och kasus? Efter der/die/das blir det -e eller -en; efter ein, kein och mein visar adjektivet genus när artikeln inte gör det (-er, -es); utan artikel tar adjektivet artikelns ändelse. Svarar du fel säger appen vilket steg som blev fel. Frågorna väljs bland det du har svårast för.</p>
    <div class="seg" role="group" aria-label="Läge"><button data-atstep="1" aria-pressed="${step}">Steg för steg</button><button data-atstep="0" aria-pressed="${!step}">Bara ändelsen</button></div>
    <p class="foot">Steg för steg frågar först efter kasus och sedan efter ändelsen. Där du har minst 80 % rätt skriver du ändelsen själv.</p>
    <span class="label">Så här har det gått (andel rätt per ruta)</span>${atTable()}
    <div class="navrow"><button class="btn ghost" id="home">Tillbaka</button><button class="btn" id="atgo">Börja (10 meningar)</button></div></section>`;
  app.querySelectorAll("[data-atstep]").forEach(b=>b.onclick=()=>{ S.adjtr.step=+b.dataset.atstep; save(); openAdjTr(); });
  $("#home").onclick=renderStart; $("#atgo").onclick=startAdjTr;
}
function atAfter(ctx,right,total,miss){
  save();
  app.innerHTML=`<section class="panel">${resultHead("Adjektivändelser klart",right,total)}
    ${miss.length?`<div class="field"><span class="label">Titta på de här en gång till</span><ul class="missed">${miss.map(m=>`<li ${lang()}>${esc(m)}</li>`).join("")}</ul></div>`:""}
    <span class="label">Andel rätt per ruta</span>${atTable()}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="again">En runda till</button></div></section>`;
  $("#home").onclick=renderStart; $("#again").onclick=startAdjTr; renderList();
}
// @lazy-end
