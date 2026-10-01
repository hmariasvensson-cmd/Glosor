/* ---------- Nivåmätare: "Var ligger jag?" i statistiken ----------
   En grov uppskattning av var eleven ligger på GERS-skalan (A1 … C1), räknad helt ur det som redan finns i S.
   Inget sparas och inget nytt fält behövs. Tre delindikatorer, var för sig:
     ordförråd  ord i steg 4+ (kan) i alla kurser i samma språk (S för kursen som är öppen, localStorage för de andra),
                mot riktvärden efter Milton & Alexiou (2009): A2 ≈ 1 500, B1 ≈ 2 500–3 000, B2 ≈ 3 500–4 000 ord
     grammatik  andel rätt senast eleven svarade på varje fråga (S.gi, s ≥ 1 = senaste svaret rätt) per område,
                annars områdets totala {r, n} (S.gt). Områdets nivå = topic.level i grammar.json om den finns, annars kursens.
     prov       senaste resultaten per provdel (S.exam.t och S.exam.sims) mot godkäntgränsen, plus Claudes nivåbedömningar
                av elevens texter (f.niva i S.fb). Varje resultat räknas mot sin egen nivå (uppgiftens level, delens
                level, annars provets): ett godkänt DELF A2 i Franska 3 är belägg för A2, inte för B1. Delar på en
                annan nivå än provets listas inte som "inte gjort än", och ett godkänt resultat under målnivån räknas
                inte som det som "drar ner mest".
   Nivåerna räknas som tal: A1 = 1, A2 = 2, B1 = 3, B2 = 4, C1 = 5 (2.5 = mellan A2 och B1). */
const LV_NAMES=["under A1","A1","A2","B1","B2","C1","C2"];
const LV_MAP={A1:1,A2:2,B1:3,B2:4,C1:5,C2:6};
// "B1" → 3, "B1+" → 3.3, "A2/B1" → 2.5, "B1.2" → 3.5, "B2-" → 3.8. null om ingen nivå går att läsa.
function lvNum(s){
  const t=String(s||"").toUpperCase(), m=t.match(/[ABC][12](\.[12])?[+\-−]?/g); if(!m) return null;
  const v=m.map(x=>LV_MAP[x.slice(0,2)]+(x.includes(".2")?.5:0)+(/\+$/.test(x)?.3:/[\-−]$/.test(x)?-.2:0));
  return v.reduce((a,b)=>a+b,0)/v.length;
}
const lvTop=s=>{const m=String(s||"").toUpperCase().match(/[ABC][12]/g); return m?Math.max(...m.map(x=>LV_MAP[x])):null;};
// 3 → "B1", 3.5 → "B1+", 0.4 → "under A1". Avrundas nedåt till närmaste halva nivå (3.76 → B1+, inte B2), hellre för lågt än för högt.
function lvShort(x){
  const r=Math.floor(x*2+.1)/2; if(r<1) return LV_NAMES[0];
  const k=Math.min(6,Math.floor(r)); return LV_NAMES[k]+(r>k&&k<6?"+":"");
}
const lvClamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const nf=n=>Number(n).toLocaleString("sv-SE");

// Riktvärden för ordförrådet (Milton & Alexiou 2009, avrundat): antal ord → nivå, rät linje mellan punkterna
const VOC_PTS=[[0,0],[750,1],[1500,2],[2750,3],[3750,4],[5000,5]];
function vocabLevel(n){
  for(let i=1;i<VOC_PTS.length;i++){ const [a,la]=VOC_PTS[i-1],[b,lb]=VOC_PTS[i]; if(n<=b) return la+(lb-la)*(n-a)/(b-a); }
  return VOC_PTS[VOC_PTS.length-1][1];
}
const VOC_NEXT={1:750,2:1500,3:2500,4:3500,5:4500};   // ungefär så många ord brukar nivån kräva (den lägre siffran)

// Sparat läge för en annan kurs, bara för läsning (localStorage på den här enheten)
// Tolkas bara om när texten i localStorage har ändrats (PEEK: {storageKey: {raw, st}}); resultatet får inte ändras.
const PEEK={};
function peekState(code){
  if(L&&code===L.code) return S;
  const k=LANGUAGES[code].storageKey;
  try{ const raw=localStorage.getItem(k)||"null"; if(PEEK[k]&&PEEK[k].raw===raw) return PEEK[k].st;
    const x=JSON.parse(raw), st=x&&typeof x==="object"?x:null; PEEK[k]={raw,st}; return st; }
  catch(e){ return null; }   // privat läge eller trasig text: kursen räknas inte med (medvetet tyst)
}

function levelVocab(){
  const codes=Object.keys(LANGUAGES).filter(c=>c===L.code||sameLang(c,L.code));
  const known=new Set(), started=new Set(), per=[];
  codes.forEach(c=>{ const st=peekState(c), w=st&&st.w&&typeof st.w==="object"?st.w:{}; let k=0;
    Object.entries(w).forEach(([id,x])=>{ if(!x||typeof x!=="object") return; started.add(id); if(x.s>=MASTER){ known.add(id); k++; } });
    if(Object.keys(w).length) per.push({code:c,name:LANGUAGES[c].course||c,k}); });
  const n=known.size, few=started.size<100;
  return {key:"voc",name:"Ordförråd",n,started:started.size,per,few,lv:few?null:vocabLevel(n)};
}

function levelGrammar(T){
  if(!hasGrammar()) return {key:"gram",name:"Grammatik",none:true,few:true,lv:null};
  const gr=GR(), bank=gramBank(), gi=S.gi||{}, gt=S.gt||{}, up=lvTop(L.level)||T;
  const G=up+(T>up?.5:0);   // kursens grammatik går mot provets nivå
  const by={};
  Object.entries(gi).forEach(([id,x])=>{ const b=bank[id]; if(!b||!x) return; (by[b.topic]=by[b.topic]||[]).push(x); });
  const topics=gr.topics.map(t=>{
    const xs=(by[t.id]||[]).slice().sort((a,b)=>(b.last||0)-(a.last||0)).slice(0,12);
    let r,n,src;
    if(xs.length>=3){ n=xs.length; r=xs.filter(x=>x.s>=1).length; src="senast"; }
    else if(gt[t.id]&&gt[t.id].n>=5){ n=gt[t.id].n; r=gt[t.id].r; src="totalt"; }
    else return null;
    const acc=r/n, base=lvNum(t.level)||G;
    return {id:t.id,name:t.name,r,n,acc,src,lv:base-1+lvClamp((acc-.5)/.35,0,1)};
  }).filter(Boolean);
  const few=topics.length<3;
  const lv=few?null:topics.reduce((a,t)=>a+t.lv,0)/topics.length;
  const acc=topics.length?topics.reduce((a,t)=>a+t.acc,0)/topics.length:null;
  return {key:"gram",name:"Grammatik",topics,total:gr.topics.length,few,lv,acc,G};
}

function levelExam(T){
  const E=lvNum(L.exam&&L.exam.level)||T;
  const out={key:"exam",name:"Prov och texter",parts:[],missing:[],few:true,lv:null,E};
  // Claudes bedömningar av elevens texter (skrivuppgifter, kultur, provets skriv- och taldel): de fem senaste
  const fb=Object.values(S.fb||{}).filter(f=>f&&typeof f==="object"&&lvNum(f.niva)!=null).sort((a,b)=>(b.d||0)-(a.d||0)).slice(0,5);
  if(fb.length){ const v=fb.map(f=>lvNum(f.niva)).sort((a,b)=>a-b), m=v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2;
    out.claude={n:fb.length,lv:m,last:String(fb[0].niva).slice(0,12)}; }
  const hasEx=hasExam();
  if(hasEx){
    const e=EX(), P=e.pass||60, st=S.exam&&typeof S.exam==="object"?S.exam:{}, tt=st.t||{}, sims=Array.isArray(st.sims)?st.sims:[];
    out.pass=P; out.examName=e.name;
    // Nivån för en del och en uppgift (level i exam.json), annars provets
    const PL=p=>lvNum(p&&p.level)||E, TL=(t,p)=>lvNum(t&&t.level)||PL(p);
    // Ett resultat på nivån lv: godkänt = lv, annars proportionellt under
    const at=(pct,lv)=>pct>=P?lv:lv-1+pct/P;
    (e.parts||[]).forEach(p=>{
      const res=[], pl=PL(p);
      (e.tasks||[]).filter(t=>t.part===p.id&&tt[t.id]&&tt[t.id].n).forEach(t=>res.push({pct:+tt[t.id].pct||0,when:tt[t.id].last||0,lv:TL(t,p)}));
      sims.forEach(s=>{ const v=s&&s.parts&&s.parts[p.id]; if(v!=null&&isFinite(+v)) res.push({pct:+v,when:s.d||0,lv:pl}); });
      if(!res.length){ if(Math.abs(pl-E)<.01) out.missing.push(p.sv||p.name); return; }
      const rec=res.sort((a,b)=>b.when-a.when).slice(0,3), avg=Math.round(rec.reduce((a,x)=>a+x.pct,0)/rec.length);
      const lv=rec.reduce((a,x)=>a+at(x.pct,x.lv),0)/rec.length;
      out.parts.push({id:p.id,name:p.sv||p.name,pct:avg,last:rec[0].pct,n:res.length,lv,plv:pl,below:pl<E-.01});
    });
  }
  const pts=out.parts.map(p=>p.lv).concat(out.claude?[out.claude.lv]:[]);
  out.none=!hasEx&&!out.claude;
  out.few=pts.length<2;
  out.lv=out.few?null:pts.reduce((a,b)=>a+b,0)/pts.length;
  return out;
}

// Hela uppskattningen (bara läsning av S och localStorage). Används av statsLevel() och testerna.
function levelEstimate(){
  const T=lvNum(L.exam&&L.exam.level)||lvTop(L.level)||3;
  const voc=levelVocab(), gram=levelGrammar(T), exam=levelExam(T);
  const ind=[voc,gram,exam], have=ind.filter(i=>i.lv!=null);
  const few=have.length<2;
  const lv=few?null:have.reduce((a,i)=>a+i.lv,0)/have.length;
  const unc=few?null:(have.length===3?.5:.75)+(gram.lv!=null&&gram.topics.length<gram.total/2?.25:0);
  // Det som drar ner mest: den lägsta delen (ordförrådet, ett grammatikområde eller en provdel) under målet
  const cand=[];
  if(voc.lv!=null) cand.push({lv:voc.lv,what:"ordförrådet",why:()=>{const nx=VOC_NEXT[Math.min(5,Math.floor(voc.lv)+1)];
    return `${nf(voc.n)} ord${nx?`, ${LV_NAMES[Math.min(5,Math.floor(voc.lv)+1)]} brukar kräva ungefär ${nf(nx)}`:""}`;}});
  if(gram.lv!=null){ const w=gram.topics.slice().sort((a,b)=>a.lv-b.lv)[0]; cand.push({lv:w.lv,what:"grammatik: "+w.name.toLowerCase(),why:()=>`${Math.round(100*w.acc)} % rätt`}); }
  // En godkänd del under målnivån (DELF A2 när målet är B1) är inget att vinna på i provträningen
  exam.parts.filter(p=>!p.below||p.pct<exam.pass).forEach(p=>cand.push({lv:p.lv,what:p.name.toLowerCase(),why:()=>`${p.pct} %, gränsen är ${exam.pass} %`}));
  const weak=cand.filter(c=>c.lv<T-.05).sort((a,b)=>a.lv-b.lv)[0]||null;
  return {T,lv,unc,few,voc,gram,exam,weak:weak?{what:weak.what,why:weak.why(),lv:weak.lv}:null,
    target:L.exam&&L.exam.name?L.exam.name:LV_NAMES[Math.round(T)]};
}

/* ---------- Visning ---------- */
function lvScale(T){
  const R=Math.round(T), ticks=R>=4?[R-2,R-1,R]:[Math.max(1,R-1),Math.max(2,R),Math.max(3,R+1)];
  return {ticks,lo:ticks[0]-.5,hi:ticks[ticks.length-1]+.5};
}
const lvPos=(sc,x)=>lvClamp(100*(x-sc.lo)/(sc.hi-sc.lo),2,98).toFixed(1);
function lvTrack(sc,est,opt){
  opt=opt||{};
  const tk=sc.ticks.map(t=>`<i class="lvtk" style="left:${lvPos(sc,t)}%"></i>`).join("");
  const band=est!=null&&opt.unc?`<i class="lvband" style="left:${lvPos(sc,est-opt.unc)}%;width:${(lvPos(sc,est+opt.unc)-lvPos(sc,est-opt.unc)).toFixed(1)}%"></i>`:"";
  const goal=opt.goal!=null?`<i class="lvgoal" style="left:${lvPos(sc,opt.goal)}%"></i>`:"";
  const dot=est!=null?`<i class="lvdot${opt.big?" big":""}" style="left:${lvPos(sc,est)}%"></i>`:"";
  return `<div class="lvtrack${est==null?" empty":""}" data-tip="${esc(opt.tip||"")}">${tk}${band}${goal}${dot}</div>`;
}
const lvTicks=sc=>`<div class="lvticks" aria-hidden="true">${sc.ticks.map(t=>`<span style="left:${lvPos(sc,t)}%">${LV_NAMES[t]}</span>`).join("")}</div>`;

function statsLevel(){
  if(!L) return "";
  const e=levelEstimate(), sc=lvScale(e.T), v=e.voc, g=e.gram, x=e.exam;
  const val=i=>i.lv==null?(i.none?"finns inte i kursen":"för lite data"):"≈ "+lvShort(i.lv);
  const row=(i,info,expl)=>`<div class="lvrow"><div class="meter-top"><span>${i.name}</span><span>${info?info+" · ":""}${val(i)}</span></div>
    ${lvTrack(sc,i.lv,{tip:`${i.name}: ${i.lv==null?"för lite data":"ungefär "+lvShort(i.lv)}`})}<p class="foot">${expl}</p></div>`;

  const perCourse=v.per.length>1?` (${v.per.map(p=>`${esc(p.name)} ${nf(p.k)}`).join(", ")}; samma ord räknas en gång)`:"";
  const vocExpl=(v.few?`Du har bara börjat på ${nf(v.started)} ord i appen, så det går inte att säga något än. `:"")
    +`Ord du kan (steg 4 eller högre) i alla kurser i ${esc(L.name.toLowerCase())}${perCourse}. Riktvärden: A2 ≈ 1 500, B1 ≈ 2 500–3 000 och B2 ≈ 3 500–4 000 ord (Milton & Alexiou 2009). Bara ord från appen räknas, så du kan fler än så.`;

  const gramExpl=g.none?"Den här kursen har ingen grammatikövning."
    :(g.few?`Du har övat ${g.topics.length} av ${g.total} områden tillräckligt (minst tre frågor). Det behövs minst tre områden. `
      :`Andel rätt senast du svarade, i ${g.topics.length} av ${g.total} områden (i snitt ${Math.round(100*g.acc)} %). `)
    +(g.none?"":`Omkring 85 % rätt räknas som att du behärskar kursens grammatik (ungefär ${lvShort(g.G)}).${!g.few&&g.topics.length<g.total/2?" Du har övat mindre än hälften av områdena, så bilden är ofullständig.":""}`);
  const gramInfo=g.topics&&g.topics.length?`${Math.round(100*g.acc)} % rätt`:"";

  // Delar på en annan nivå än provets märks med nivån (om den inte redan står i namnet)
  const exParts=x.parts.map(p=>{ const ln=LV_NAMES[Math.round(p.plv)]||""; return `${esc(p.name)}${p.plv!==x.E&&!String(p.name).includes(ln)?` (${ln})`:""} ${p.pct} %`; }).join(", ");
  const exExpl=(x.pass!=null
      ?(x.parts.length?`Senaste resultaten per del i provträningen: ${exParts} (gränsen för godkänt är ${x.pass} %). `:`Du har inte gjort någon uppgift i provträningen än. `)
        +(x.missing.length&&x.parts.length?`Inte gjort än: ${esc(x.missing.join(", ").toLowerCase())}. `:"")
      :"Kursen har ingen provträning. ")
    +(x.parts.some(p=>p.below)?`Delar på en lägre nivå räknas mot sin egen nivå: ett godkänt resultat där visar den nivån, inte målet. `:"")
    +(x.claude?`Claudes bedömning av dina senaste ${x.claude.n===1?"text":x.claude.n+" texter"}: ungefär ${lvShort(x.claude.lv)}. `:"")
    +(x.few&&!x.none?"Det behövs resultat från minst två delar (eller en del och en bedömning av Claude). ":"");

  const head=e.few
    ?`<div class="lvnow"><b>För lite data</b><span>Det behövs underlag från minst två av de tre delarna nedan. Fortsätt öva, gör några uppgifter i provträningen och låt Claude kommentera en text, så kommer en uppskattning.</span></div>`
    :`<div class="lvnow"><b>≈ ${lvShort(e.lv)}</b><span>troligen någonstans mellan ${lvShort(e.lv-e.unc)} och ${lvShort(e.lv+e.unc)} · målet är ${esc(e.target)}</span></div>`;
  const aria=e.few?"För lite data för en uppskattning":`Uppskattad nivå ungefär ${lvShort(e.lv)}, mål ${LV_NAMES[Math.round(e.T)]||""}`;
  const weak=e.weak?`<p class="insight"><b>Mest att vinna:</b> ${esc(e.weak.what)} (${esc(e.weak.why)}).</p>`
    :!e.few?`<p class="insight">Allt du har övat ligger ungefär vid målet. Gör gärna en hel provsimulering för att se att det håller.</p>`:"";

  return `<section class="panel lvl" id="lvl"><h2>Var ligger jag?</h2>
    <p class="sub">${esc(courseName())} mot ${esc(e.target)}. En grov uppskattning utifrån det du har gjort i appen, inte ett betyg och inget löfte om provresultatet.</p>
    ${head}
    <div class="lvscale" role="img" aria-label="${esc(aria)}">${lvTrack(sc,e.lv,{unc:e.unc,goal:e.T,big:true,tip:aria})}${lvTicks(sc)}</div>
    <div class="legend"><span><i class="sw" style="background:var(--c2)"></i>Uppskattning</span>${e.few?"":`<span><i class="sw lvsw-band"></i>Osäkerhet</span>`}<span><i class="sw lvsw-goal"></i>Mål</span></div>
    ${weak}
    ${row(v,v.n?`${nf(v.n)} ord`:"",vocExpl)}
    ${row(g,gramInfo,gramExpl)}
    ${row(x,"",exExpl)}
    <p class="foot">Uppskattningen är medelvärdet av delarna som har tillräckligt underlag. Den bygger på övningar i appen, som inte är riktiga prov, och Claude kan bedöma fel. Ett riktigt prov mäter också sådant som appen inte ser, till exempel hur du talar.</p>
  </section>`;
}
