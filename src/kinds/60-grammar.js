/* =====================================================================
   Grammatikövningar (just nu för tyska). Ämnen och regler står i languages/<kod>/grammar.json (L.grammar när kursens data har hämtats).
   Frågorna kommer från tre håll:
     content/grammar-*.json  luckfrågor ("Das Buch liegt auf [dem] Tisch.") och
                             "sätt ihop meningar" (type "rw", byggs med ordbrickor)
     adjItem()               adjektivändelser, skapas av ordlistans substantiv och en tabell
     errItem()               "Hitta felet": en luckfråga där ett felaktigt alternativ satts in
   Fråge-id: "gram:<id>", där id är bankens id, "adj|…" eller "err|<id>|<alternativ>".
   Sparat: S.gi[id] = {s, last} per bankfråga, S.gr[regel] och S.gt[ämne] = {r, n}.
   der/die/das och plural finns i 61-gender.js.
   ===================================================================== */
const GR=()=>L.grammar;
const GAPRX=/\[([^\]]+)\]/g;
const gparse=q=>{const parts=[],gaps=[]; let last=0;
  q.replace(GAPRX,(m,a,i)=>{parts.push(q.slice(last,i)); gaps.push(a); last=i+m.length; return m;}); parts.push(q.slice(last)); return {parts,gaps};};
// Typografisk apostrof (’ från iPadens smarta skiljetecken), ` och ´ räknas som '
const gapos=s=>s.replace(/[’`´]/g,"'");
const gnorm=s=>gapos(s).toLowerCase().replace(/…/g," ").replace(/[.,!?;:«»"“”()]/g," ").replace(/\s+/g," ").trim();
const gfill=(p,fill)=>p.parts.map((t,i)=>t+(i<fill.length?fill[i]:"")).join("");
const gcap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ---------- Frågebanken ---------- */
let GBANK=null, GBANK_LANG=null;
function gramBank(){
  if(GBANK&&GBANK_LANG===L) return GBANK;
  GBANK_LANG=L; GBANK={};
  (C().grammar||[]).forEach(x=>{ const p=x.type==="rw"?null:gparse(x.q);
    GBANK[x.id]={...x,type:x.type||"gap",p,ans:p?p.gaps.join(" … "):x.a}; });
  return GBANK;
}
function gramById(id){
  if(id.startsWith("adj|")) return adjItem(id);
  if(id.startsWith("err|")) return errItem(id);
  return gramBank()[id]||null;
}
const hasGrammar=()=>!!(GR()&&GR().topics&&((C().grammar||[]).length||GR().adj));

/* ---------- Adjektivändelser ---------- */
const ADJ_ART={def:{nom:{m:"der",f:"die",n:"das"},akk:{m:"den",f:"die",n:"das"},dat:{m:"dem",f:"der",n:"dem"}},
  indef:{nom:{m:"ein",f:"eine",n:"ein"},akk:{m:"einen",f:"eine",n:"ein"},dat:{m:"einem",f:"einer",n:"einem"}}};
const ADJ_END={def:{nom:{m:"e",f:"e",n:"e"},akk:{m:"en",f:"e",n:"e"},dat:{m:"en",f:"en",n:"en"}},
  indef:{nom:{m:"er",f:"e",n:"es"},akk:{m:"en",f:"e",n:"es"},dat:{m:"en",f:"en",n:"en"}}};
const CASE_SV={nom:"nominativ",akk:"ackusativ",dat:"dativ"}, G_SV={m:"maskulinum",f:"femininum",n:"neutrum"};
// Substantiv ur ordlistan: "der Konflikt (-e)" → Konflikt. Svaga maskuliner och substantiverade adjektiv
// (der Kollege, der Angestellte) böjs annorlunda och tas inte med.
function adjNouns(){
  if(L._adjNouns) return L._adjNouns;
  L._adjNouns=L.base.words.filter(w=>{
    if(!["m","f","n"].includes(w.g)) return false;
    const m=w.t.match(/^(der|die|das) (\p{Lu}[\p{L}]+)(?: \(([^)]*)\))?$/u); if(!m) return false;
    if(w.g==="m"&&(/^-(e?n)$/.test(m[3]||"")||/(e|ent|ant|ist|oge|at)$/.test(m[2]))) return false;
    if(w.g==="n"&&/e$/.test(m[2])&&!m[3]) return false;
    return true;
  }).map(w=>({id:w.id,noun:w.t.match(/^\S+ (\S+)/)[1],g:w.g,sv:w.sv}));
  return L._adjNouns;
}
function adjItem(id){
  const [,nid,cs,art,ai,fi]=id.split("|"), n=adjNouns().find(x=>x.id===nid), cfg=GR().adj;
  if(!n||!ADJ_ART[art]||!ADJ_ART[art][cs]) return null;
  const adj=cfg.adjectives[+ai], frame=cfg.frames[cs][+fi]; if(!adj||!frame) return null;
  const a=ADJ_ART[art][cs][n.g], end=ADJ_END[art][cs][n.g];
  const q=frame.replace("{ADJ}","["+adj+end+"]").replace("{N}",n.noun).replace("{A}",a);
  const why=art==="def"
    ?"Efter der/die/das får adjektivet -e i nominativ och i ackusativ för feminint och neutrum. I alla andra fall -en."
    :"Efter ein/kein visar adjektivet genus när artikeln inte gör det: ein neuer (mask. nom.), ein neues (neutr.), eine neue (fem.). Ackusativ maskulinum och all dativ: -en.";
  const p=gparse(gcap(q));
  return {id,topic:"adj",rule:"adj-"+art,type:"adj",p,ans:adj+end,stem:adj,end,
    alt:["e","en","er","es","em"].filter(e=>e!==end).map(e=>adj+e),
    why:`<b>${G_SV[n.g]} · ${CASE_SV[cs]}</b> (${esc(a)} ${esc(n.noun)}) → -${end}. ${why}`,sv:`${n.noun} = ${n.sv}`};
}
function adjIds(k){
  const ns=shuffle(adjNouns()), cfg=GR().adj, cases=["nom","akk","dat"], out=[];
  for(let i=0;i<k&&i<ns.length;i++){
    const cs=cases[i%3], art=i%2?"indef":"def";
    out.push(["adj",ns[i].id,cs,art,Math.floor(Math.random()*cfg.adjectives.length),Math.floor(Math.random()*cfg.frames[cs].length)].join("|"));
  }
  return shuffle(out);
}

/* ---------- Hitta felet ---------- */
// Bygger på luckfrågor med en lucka: ett felaktigt alternativ sätts in, och eleven ska hitta ordet som är fel
// Regler där ett fel alternativ kan ge en annan men korrekt mening (den Jungen, der/den Lisa eingeladen hat),
// eller där vardagsspråket godtar alternativet (indikativ i indirekt tal), tas inte med
// Franskans tempusval (imparfait/passé composé, plus-que-parfait, futur/presens) och artighetsformer går ofta att försvara
// i talspråk, så de passar inte heller som "Hitta felet"
const ERR_SKIP=["rel-nom","rel-akk","k1-rede","tps-bakgrund","tps-vana","tps-handelse","tps-avbrott","tps-signal","pqp-avoir","pqp-etre","cond-poli","cond-rai","fut-reg","disc-imp","disc-pqp","disc-cond","disc-tps","nomin-reg","nomin-titre","dm-agg","dm-avv","dm-caus","dm-org","dm-parl","dm-rif","ob-pref","ob-suff","reg-form","reg-inf","reg-lex"];
// Felalternativ som går att sätta in i luckan: inga med flera delar, och när luckan sitter ihop med ett ord
// ("[parce qu']il", "Je [t']aime", "[L']estate") bara alternativ som slutar med apostrof, så att orden inte klistras ihop
// ("malgréil", "Je teaime", "Ilestate"). Meningen måste också ha minst 3 andra ord att välja mellan.
const ERR_MIN_OTHERS=3;
const errOthers=(b,bad)=>[...new Set(tok(b.p.parts.join(" ")).filter(t=>t.length>2&&!tok(bad).includes(t)&&!tok(b.p.gaps[0]).includes(t)))];
function errFits(b,bad){
  if(bad.includes("…")) return false;
  const pre=b.p.parts[0], post=b.p.parts[1], a=gapos(bad);
  if(/\p{L}$/u.test(pre)&&/^\p{L}/u.test(a)) return false;
  if(/^\p{L}/u.test(post)&&!/'$/.test(a)) return false;
  if(/'$/.test(a)&&!/^\p{L}/u.test(post)) return false;   // "qu' il"
  return errOthers(b,bad).length>=ERR_MIN_OTHERS;
}
const errAlts=b=>b.alt.map((a,i)=>i).filter(i=>errFits(b,b.alt[i]));
const errBase=()=>Object.values(gramBank()).filter(x=>x.type==="gap"&&x.p&&x.p.gaps.length===1&&!ERR_SKIP.includes(x.rule)&&errAlts(x).length);
function errItem(id){
  const [,bid,ai]=id.split("|"), b=gramBank()[bid]; if(!b||!b.p||b.p.gaps.length!==1) return null;
  const bad=b.alt[+ai]; if(!bad) return null;
  const wrongText=gfill(b.p,[bad]), rightText=gfill(b.p,b.p.gaps);
  // Distraktorerna är andra ord ur meningen, skrivna som de står i den
  const others=errOthers(b,bad);
  const surface=w=>{const m=wrongText.match(new RegExp("(^|[^\\p{L}])("+reEsc(w)+")(?![\\p{L}])","iu")); return m?m[2]:w;};
  return {id,topic:"err",rule:b.rule,type:"err",bad,wrongText,rightText,
    opts:shuffle([{label:bad,ok:true,lang:true},...shuffle(others).slice(0,3).map(w=>({label:surface(w),ok:false,lang:true}))]),
    why:b.why,sv:b.sv};
}
function errIds(k){
  return shuffle(errBase()).slice(0,k).map(b=>{const ok=errAlts(b);
    return `err|${b.id}|${ok[Math.floor(Math.random()*ok.length)]}`;});
}

/* ---------- Välja frågor ---------- */
const ruleStat=r=>(S.gr||{})[r]||{r:0,n:0};
const ruleWeak=r=>{const x=ruleStat(r); return x.n?1-x.r/x.n:.5;};
/* Tidsbaserad repetition (S.gi[id] = {s, last, dd}, srsBump i 00-common.js): förfallna frågor först (även de man
   missade senast), sedan frågor man inte har sett, sedan resten. Inom varje grupp svagast först, och regler man ofta
   missar väger tyngre. */
function bankPool(topic){
  // Bokens övningar: när eleven läser ett kapitel tas bara det kapitlets övningar (fältet kap kommer från mappen book/kapNN)
  const ch=S.chapter&&+((chapterKey(S.chapter).match(/\d+/)||[])[0]);
  const hasCh=topic==="bok"&&ch&&Object.values(gramBank()).some(y=>y.topic==="bok"&&y.kap===ch);
  const inCh=x=>!hasCh||x.kap===ch;
  return Object.values(gramBank()).filter(x=>(!topic||x.topic===topic)&&inCh(x));
}
function bankIds(topic,k){
  return weakestFirst(bankPool(topic),"gi",{due:true,key:(x,st)=>(st&&+st.s||0)-ruleWeak(x.rule)+Math.random()*.8}).slice(0,k).map(x=>x.id);
}
const gramDue=topic=>srsDueCount(S.gi,bankPool(topic).map(x=>x.id));
function gramQ(gid){
  const x=gramById(gid); if(!x) return null;
  let t="mc";
  if(x.type==="rw") t="type";
  else if(x.type==="adj"){const s=ruleStat(x.rule); t=s.n>=6&&s.r/s.n>=.7?"type":"mc";}
  else if(x.type==="gap") t=((S.gi||{})[gid]||{}).s>=1?"type":"mc";
  return {k:"gram",id:"gram:"+gid,ref:gid,t,canType:x.type!=="err"};
}
function gramItems(topic,k){
  let ids;
  if(topic==="adj") ids=adjIds(k);
  else if(topic==="err") ids=errIds(k);
  else if(topic==="mix"){ const a=GR().adj?adjIds(2):[], ch=chapterTopics();
    // Läser eleven ett bokkapitel kommer hälften av frågorna från kapitlets grammatik
    const c=ch.length?ch.flatMap(t=>bankIds(t,Math.ceil(k/2/ch.length))).slice(0,Math.ceil(k/2)):[];
    ids=[...a,...errIds(1),...c,...bankIds(null,k-1-a.length-c.length).filter(i=>!c.includes(i))]; }
  else ids=bankIds(topic,k);
  return shuffle(ids.map(gramQ).filter(Boolean));
}
// Grammatikområden som hör till kapitlet eleven läser (secs i grammar.json)
const chapterTopics=()=>S.chapter&&hasGrammar()?GR().topics.filter(t=>(t.secs||[]).some(s=>sameChapter(s,S.chapter))).map(t=>t.id):[];
const topicName=id=>id==="mix"?"Blandad grammatik":((GR().topics.find(t=>t.id===id)||{}).name||"Grammatik");
function startGram(topic){
  const items=gramItems(topic,10); if(!items.length) return openGrammar();
  $("#tabs").hidden=true; sess=null; beginQuiz("gram",items,{againFn:["gram",topic],label:topicName(topic),gramMix:topic==="mix"});
}
/* Regelsidor: content/regler.json = {<topic>: {title, intro, parts: [{h, t, ex: [{fr, sv}], table: {head, rows}, tip}]}}.
   Visas innan övningarna och går att öppna efter varje svar. **fetstil** i texterna blir <b>. */
const RULES=()=>C().regler||{};
const rmark=s=>esc(s||"").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br>");
function ruleHtml(r){
  return `${r.intro?`<p class="plan">${rmark(r.intro)}</p>`:""}${(r.parts||[]).map(p=>`<div class="rpart">
    ${p.h?`<h3>${esc(p.h)}</h3>`:""}${p.t?`<p>${rmark(p.t)}</p>`:""}
    ${p.table?`<div class="tblwrap"><table class="tbl rtbl" ${lang()}>${p.table.head?`<tr>${p.table.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr>`:""}${(p.table.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${rmark(c)}</td>`).join("")}</tr>`).join("")}</table></div>`:""}
    ${(p.ex||[]).length?`<ul class="rex">${p.ex.map(e=>`<li><span class="ex-t" ${lang()}>${rmark(tl(e))}</span>${e.sv?`<br><span class="ex-sv">${esc(e.sv)}</span>`:""}</li>`).join("")}</ul>`:""}
    ${p.tip?`<p class="rtip">${rmark(p.tip)}</p>`:""}</div>`).join("")}`;
}
function gramRules(id){
  const r=RULES()[id]; if(!r) return startGram(id);
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Regel</span><h2>${esc(r.title||topicName(id))}</h2>
    <button class="btn" id="rgo">Öva: ${esc(topicName(id))}</button>${ruleHtml(r)}
    <button class="btn" id="rgo2">Starta övningarna</button></section><button class="quit" id="quit">Tillbaka</button>`;
  $("#rgo").onclick=$("#rgo2").onclick=()=>startGram(id); $("#quit").onclick=openGrammar;
  window.scrollTo(0,0);
}
function openGrammar(){
  const gt=S.gt||{}, bank=Object.values(gramBank());
  // Status: andel rätt och hur många frågor som ska repeteras i dag (gramDue)
  const status=id=>{const x=gt[id], n=gramDue(id==="mix"?null:id);
    return ((x&&x.n?`${pct(x.r,x.n)} % rätt av ${x.n}`:"")+srsDueNote(n)).replace(/^ · /,"");};
  const due=gramDue(null);
  const topics=GR().topics.filter(t=>t.id==="adj"?GR().adj&&adjNouns().length:t.id==="err"?errBase().length:bank.some(x=>x.topic===t.id));
  pickerScreen("Grammatik",`Välj ett område. Frågor du klarar kommer tillbaka efter 1, 3, 7, 20, 45 och 90 dagar, och frågor du missar redan nästa gång. Blandad grammatik tar lite av allt.${due?` <b data-due="${due}">${due} ${due===1?"fråga":"frågor"} att repetera i dag.</b>`:""}`,
    [{id:"mix",title:"Blandad grammatik",status:status("mix")},...topics.map(t=>({id:t.id,title:t.name,status:status(t.id),here:chapterTopics().includes(t.id)}))]
      .sort((a,b)=>(b.here?1:0)-(a.here?1:0)),id=>RULES()[id]?gramRules(id):startGram(id));
  // Undertexter under ämnena
  app.querySelectorAll("[data-pick]").forEach(b=>{const t=GR().topics.find(x=>x.id===b.dataset.pick); const sm=b.querySelector("small");
    if(t&&t.sub&&sm&&!sm.textContent) sm.textContent=t.sub;});
}

/* ---------- Frågorna ---------- */
const gramHead=x=>{
  if(x.type==="err") return `<p class="cloze" ${lang()}>${esc(x.wrongText)}</p><p class="ex-sv">Betyder: ${esc(x.sv)}</p>`;
  const html=x.p.parts.map((t,i)=>esc(t)+(i<x.p.gaps.length?`<span class="gap" data-gi="${i}">${x.type==="adj"?esc(x.stem)+"…":"&nbsp;"}</span>`:"")).join("");
  return `<p class="cloze" ${lang()}>${html}</p><p class="ex-sv">${esc(x.sv)}</p>`;
};
const fillGaps=x=>()=>app.querySelectorAll("[data-gi]").forEach(g=>{g.textContent=x.p.gaps[+g.dataset.gi]; g.classList.add("filled");});
const gramExplain=x=>`${x.rightText?`<p class="ex-t" ${lang()}>${esc(x.rightText)}</p>`:""}<p>${x.type==="adj"?x.why:esc(x.why)}</p>
  <p class="foot">${esc((GR().rules||{})[x.rule]||"")}</p>
  ${RULES()[x.topic]?`<details class="more rule"><summary>Läs regeln: ${esc(RULES()[x.topic].title||topicName(x.topic))}</summary>${ruleHtml(RULES()[x.topic])}</details>`:""}`;
const gramSay=x=>x.type==="rw"?x.a:x.type==="err"?x.rightText:gfill(x.p,x.p.gaps);
const gramMC=c=>{const x=gramById(c.ref);
  if(x.type==="err") return{tab:"Hitta felet",head:gramHead(x),ask:"Ett ord i meningen är fel. Vilket?",opts:x.opts,
    explain:gramExplain(x),say:gramSay(x),sayOnAnswer:true};
  // rw med "ask" (t.ex. bokens översättningsövningar): q är en svensk mening och ask instruktionen
  if(x.type==="rw") return{tab:"Grammatik",head:`<p class="q-prompt" style="font-size:1.2rem" ${x.ask?"":lang()}>${esc(x.q)}</p>`,
    ask:x.ask?esc(x.ask):`Vilken mening är rätt ihopsatt med <b ${lang()}>${esc(x.cue)}</b>?`,
    opts:shuffle([{label:x.a,ok:true,lang:true},...x.alt.map(a=>({label:a,ok:false,lang:true}))]),explain:gramExplain(x),say:x.a,sayOnAnswer:true};
  return{tab:"Grammatik",head:gramHead(x),ask:x.type==="adj"?"Vilken form har adjektivet?":"Vad passar i luckan?",
    opts:shuffle([{label:x.ans,ok:true,lang:true},...shuffle(x.alt).slice(0,4).map(a=>({label:a,ok:false,lang:true}))]),
    explain:gramExplain(x),say:gramSay(x),sayOnAnswer:true,onAnswer:fillGaps(x)};
};
const gramType=c=>{const x=gramById(c.ref);
  if(x.type==="rw"){ const o=orderTokens(x.a); o.words=o.words.map(w=>w.replace(/,$/,""));
    return{tab:"Grammatik",render:renderTiles,o,w:{exSv:x.sv},
      prompt:x.ask?`<p class="q-prompt" style="font-size:1.2rem">${esc(x.q)}</p>`:`<p class="q-prompt" style="font-size:1.2rem" ${lang()}>${esc(x.q)}</p><p class="ex-sv">${esc(x.sv)}</p>`,
      ask:x.ask?esc(x.ask):`Sätt ihop meningarna med <b ${lang()}>${esc(x.cue)}</b>.`,
      accept:[x.a,...(x.acc||[])].map(s=>tok(s).join(" ")),answer:x.a,explain:gramExplain(x),say:x.a}; }
  const acc=[x.ans,...(x.acc||[])].map(gnorm), multi=x.type!=="adj"&&x.p.gaps.length>1;
  return{tab:"Grammatik",head:gramHead(x),
    ask:x.type==="adj"?`Skriv adjektivet <b ${lang()}>${esc(x.stem)}</b> med rätt ändelse.`:multi?"Skriv orden som saknas, i ordning.":"Skriv det som saknas.",
    placeholder:x.type==="adj"?x.stem+"…":"Skriv här",accents:L.accents,
    // Grammatik rättas exakt: dem och den skiljer sig bara på en bokstav, så "nästan rätt" finns inte
    check:v=>{const n=gnorm(v); if(!n) return {r:"empty"};
      // I "stor eller liten bokstav" räknas versalerna, annars inte
      // (även i andra frågor där ett felalternativ bara skiljer sig i stor/liten bokstav, t.ex. bokens övningar)
      if(x.topic==="maj"||(x.alt||[]).some(a=>a.toLowerCase()===x.ans.toLowerCase())){ const e=s=>gapos(s).replace(/…/g," ").replace(/[.,!?;:]/g," ").replace(/\s+/g," ").trim();
        return {r:[x.ans,...(x.acc||[])].map(e).includes(e(v))?"right":"wrong"}; }
      return {r:acc.includes(n)||(x.type==="adj"&&n.replace(/^-/,"")===x.end)?"right":"wrong"};},
    answer:x.ans,explain:gramExplain(x),say:gramSay(x),onAnswer:fillGaps(x),alwaysAnswer:multi};
};
const gramEffect=(ref,ok)=>{const x=gramById(ref); if(!x) return;
  const add=(o,k)=>{o[k]=o[k]||{r:0,n:0}; o[k].n++; if(ok) o[k].r++;};
  S.gr=S.gr||{}; S.gt=S.gt||{}; add(S.gr,x.rule); add(S.gt,x.topic);
  if(sess&&sess.gramMix) add(S.gt,"mix");   // blandad grammatik (startGram("mix")), inte den blandade rundan
  if(x.type==="gap"||x.type==="rw"){S.gi=S.gi||{}; S.gi[ref]=srsBump(S.gi[ref],ok);}
};
defineKind("gram",{name:"Grammatik",mc:gramMC,type:gramType,restore:ref=>gramById(ref)?{}:null,effect:gramEffect,
  recap:ref=>{const x=gramById(ref); return x?gramSay(x):"";},open:openGrammar,again:startGram});

/* Statistik: träffsäkerhet per ämne och de regler man missar mest */
function statsGrammar(){
  if(!hasGrammar()) return "";
  const gt=S.gt||{}, gr=S.gr||{}, rules=GR().rules||{};
  const rows=GR().topics.filter(t=>gt[t.id]&&gt[t.id].n).map(t=>meter(t.name,gt[t.id].r,gt[t.id].n)).join("");
  if(!rows) return "";
  const weak=Object.entries(gr).filter(([,x])=>x.n>=4).map(([k,x])=>({k,p:x.r/x.n,x})).filter(o=>o.p<.8).sort((a,b)=>a.p-b.p).slice(0,4);
  return `<section class="panel"><h2>Grammatik</h2>${rows}
    ${weak.length?`<p class="plan">Öva mer på: ${weak.map(o=>`${esc(rules[o.k]||o.k)} (${pct(o.x.r,o.x.n)} %)`).join(", ")}.</p>`:""}</section>`;
}
