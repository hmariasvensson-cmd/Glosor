/* =====================================================================
   Grammatikövningar (just nu för tyska). Ämnen och regler står i L.grammar i lang.js.
   Frågorna kommer från tre håll:
     content/grammar-*.json  luckfrågor ("Das Buch liegt auf [dem] Tisch.") och
                             "sätt ihop meningar" (type "rw", byggs med ordbrickor)
     adjItem()               adjektivändelser, skapas av ordlistans substantiv och en tabell
     errItem()               "Hitta felet": en luckfråga där ett felaktigt alternativ satts in
   Fråge-id: "gram:<id>", där id är bankens id, "adj|…" eller "err|<id>|<alternativ>".
   Sparat: S.gi[id] = {s, last} per bankfråga, S.gr[regel] och S.gt[ämne] = {r, n}.
   ===================================================================== */
const GR=()=>L.grammar;
const GAPRX=/\[([^\]]+)\]/g;
const gparse=q=>{const parts=[],gaps=[]; let last=0;
  q.replace(GAPRX,(m,a,i)=>{parts.push(q.slice(last,i)); gaps.push(a); last=i+m.length; return m;}); parts.push(q.slice(last)); return {parts,gaps};};
const gnorm=s=>s.toLowerCase().replace(/…/g," ").replace(/[.,!?;:«»"“”()]/g," ").replace(/\s+/g," ").trim();
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
const ERR_SKIP=["rel-nom","rel-akk","k1-rede"];
const errBase=()=>Object.values(gramBank()).filter(x=>x.type==="gap"&&x.p.gaps.length===1&&!ERR_SKIP.includes(x.rule)&&x.alt.some(a=>!a.includes("…")));
function errItem(id){
  const [,bid,ai]=id.split("|"), b=gramBank()[bid]; if(!b) return null;
  const bad=b.alt[+ai]; if(!bad) return null;
  const wrongText=gfill(b.p,[bad]), rightText=gfill(b.p,b.p.gaps);
  // Distraktorerna är andra ord ur meningen, skrivna som de står i den
  const others=[...new Set(tok(b.p.parts.join(" ")).filter(t=>t.length>2&&!tok(bad).includes(t)&&!tok(b.p.gaps[0]).includes(t)))];
  const surface=w=>{const m=wrongText.match(new RegExp("(^|[^\\p{L}])("+reEsc(w)+")(?![\\p{L}])","iu")); return m?m[2]:w;};
  return {id,topic:"err",rule:b.rule,type:"err",bad,wrongText,rightText,
    opts:shuffle([{label:bad,ok:true,lang:true},...shuffle(others).slice(0,3).map(w=>({label:surface(w),ok:false,lang:true}))]),
    why:b.why,sv:b.sv};
}
function errIds(k){
  return shuffle(errBase()).slice(0,k).map(b=>{const ok=b.alt.map((a,i)=>i).filter(i=>!b.alt[i].includes("…"));
    return `err|${b.id}|${ok[Math.floor(Math.random()*ok.length)]}`;});
}

/* ---------- Välja frågor ---------- */
const ruleStat=r=>(S.gr||{})[r]||{r:0,n:0};
const ruleWeak=r=>{const x=ruleStat(r); return x.n?1-x.r/x.n:.5;};
// Frågor man inte har sett eller missade senast kommer först, och regler man ofta missar väger tyngre
function bankIds(topic,k){
  S.gi=S.gi||{};
  return Object.values(gramBank()).filter(x=>!topic||x.topic===topic)
    .map(x=>{const st=S.gi[x.id]||{s:0,last:0}; return {id:x.id,key:st.s-ruleWeak(x.rule)+Math.random()*.8,last:st.last};})
    .sort((a,b)=>a.key-b.key||a.last-b.last).slice(0,k).map(x=>x.id);
}
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
// Grammatikområden som hör till kapitlet eleven läser (secs i lang.js)
const chapterTopics=()=>S.chapter&&hasGrammar()?GR().topics.filter(t=>(t.secs||[]).some(s=>sameChapter(s,S.chapter))).map(t=>t.id):[];
const topicName=id=>id==="mix"?"Blandad grammatik":((GR().topics.find(t=>t.id===id)||{}).name||"Grammatik");
function startGram(topic){
  const items=gramItems(topic,10); if(!items.length) return openGrammar();
  $("#tabs").hidden=true; sess=null; beginQuiz("gram",items,{againFn:["gram",topic],label:topicName(topic)});
}
function openGrammar(){
  const gt=S.gt||{}, bank=Object.values(gramBank());
  const status=id=>{const x=gt[id]; return x&&x.n?`${pct(x.r,x.n)} % rätt av ${x.n}`:"";};
  const topics=GR().topics.filter(t=>t.id==="adj"?GR().adj&&adjNouns().length:t.id==="err"?errBase().length:bank.some(x=>x.topic===t.id));
  pickerScreen("Grammatik","Välj ett område. Frågor du missar och regler du ofta missar kommer tillbaka oftare. Blandad grammatik tar lite av allt.",
    [{id:"mix",title:"Blandad grammatik",status:status("mix")},...topics.map(t=>({id:t.id,title:t.name,status:status(t.id),here:chapterTopics().includes(t.id)}))]
      .sort((a,b)=>(b.here?1:0)-(a.here?1:0)),startGram);
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
  <p class="foot">${esc((GR().rules||{})[x.rule]||"")}</p>`;
const gramSay=x=>x.type==="rw"?x.a:x.type==="err"?x.rightText:gfill(x.p,x.p.gaps);
MC.gram=c=>{const x=gramById(c.ref);
  if(x.type==="err") return{tab:"Hitta felet",head:gramHead(x),ask:"Ett ord i meningen är fel. Vilket?",opts:x.opts,
    explain:gramExplain(x),say:gramSay(x),sayOnAnswer:true};
  if(x.type==="rw") return{tab:"Grammatik",head:`<p class="q-prompt" style="font-size:1.2rem" ${lang()}>${esc(x.q)}</p>`,
    ask:`Vilken mening är rätt ihopsatt med <b ${lang()}>${esc(x.cue)}</b>?`,
    opts:shuffle([{label:x.a,ok:true,lang:true},...x.alt.map(a=>({label:a,ok:false,lang:true}))]),explain:gramExplain(x),say:x.a,sayOnAnswer:true};
  return{tab:"Grammatik",head:gramHead(x),ask:x.type==="adj"?"Vilken form har adjektivet?":"Vad passar i luckan?",
    opts:shuffle([{label:x.ans,ok:true,lang:true},...shuffle(x.alt).slice(0,4).map(a=>({label:a,ok:false,lang:true}))]),
    explain:gramExplain(x),say:gramSay(x),sayOnAnswer:true,onAnswer:fillGaps(x)};
};
TYPE.gram=c=>{const x=gramById(c.ref);
  if(x.type==="rw"){ const o=orderTokens(x.a); o.words=o.words.map(w=>w.replace(/,$/,""));
    return{tab:"Grammatik",render:renderTiles,o,w:{exSv:x.sv},
      prompt:`<p class="q-prompt" style="font-size:1.2rem" ${lang()}>${esc(x.q)}</p><p class="ex-sv">${esc(x.sv)}</p>`,
      ask:`Sätt ihop meningarna med <b ${lang()}>${esc(x.cue)}</b>.`,
      accept:[x.a,...(x.acc||[])].map(s=>tok(s).join(" ")),answer:esc(x.a),explain:gramExplain(x),say:x.a}; }
  const acc=[x.ans,...(x.acc||[])].map(gnorm), multi=x.type!=="adj"&&x.p.gaps.length>1;
  return{tab:"Grammatik",head:gramHead(x),
    ask:x.type==="adj"?`Skriv adjektivet <b ${lang()}>${esc(x.stem)}</b> med rätt ändelse.`:multi?"Skriv orden som saknas, i ordning.":"Skriv det som saknas.",
    placeholder:x.type==="adj"?x.stem+"…":"Skriv här",accents:L.accents,
    // Grammatik rättas exakt: dem och den skiljer sig bara på en bokstav, så "nästan rätt" finns inte
    check:v=>{const n=gnorm(v); if(!n) return {r:"empty"};
      // I "stor eller liten bokstav" räknas versalerna, annars inte
      if(x.topic==="maj"){ const e=s=>s.replace(/…/g," ").replace(/[.,!?;:]/g," ").replace(/\s+/g," ").trim();
        return {r:[x.ans,...(x.acc||[])].map(e).includes(e(v))?"right":"wrong"}; }
      return {r:acc.includes(n)||(x.type==="adj"&&n.replace(/^-/,"")===x.end)?"right":"wrong"};},
    answer:esc(x.ans),explain:gramExplain(x),say:gramSay(x),onAnswer:fillGaps(x),alwaysAnswer:multi};
};
RESTORE.gram=ref=>gramById(ref)?{}:null;
EFFECT.gram=(ref,ok)=>{const x=gramById(ref); if(!x) return;
  const add=(o,k)=>{o[k]=o[k]||{r:0,n:0}; o[k].n++; if(ok) o[k].r++;};
  S.gr=S.gr||{}; S.gt=S.gt||{}; add(S.gr,x.rule); add(S.gt,x.topic);
  if(sess&&sess.againFn&&sess.againFn[1]==="mix") add(S.gt,"mix");
  if(x.type==="gap"||x.type==="rw"){S.gi=S.gi||{}; const st=S.gi[ref]||{s:0}; S.gi[ref]={s:ok?st.s+1:0,last:Date.now()};}
};
RECAP.gram=ref=>{const x=gramById(ref); return x?gramSay(x):"";};
KIND_NAMES.gram="Grammatik";
AGAIN.gram=startGram;

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

/* ---------- der, die, das och plural ----------
   Byggs av ordlistans substantiv (L.genderGame anger artiklarna). Pluralen räknas fram ur markeringen
   i ordlistan: der Konflikt (-e) → Konflikte, der Vorwurf (-würfe) → Vorwürfe, das Studium (Studien) → Studien.
   Sparat: S.ga[ord-id] = {g, p, last}, där g och p räknar rätt i rad för genus och plural. */
const unUml=s=>s.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u");
function pluralOf(noun,mark){
  if(mark==="-") return noun;
  if(!/^-?\p{L}+$/u.test(mark)) return null;
  const f=mark.replace(/^-/,""), fu=unUml(f), nu=unUml(noun);
  let best=-1, len=0;
  for(let i=0;i<nu.length;i++){ let k=0; while(i+k<nu.length&&k<fu.length&&nu[i+k]===fu[k]) k++;
    if(i+k===nu.length||k>=3){ if(k>len){len=k; best=i;} } }
  if(len>=3) return best===0?gcap(f):noun.slice(0,best)+f.toLowerCase();
  return mark.startsWith("-")?noun+f:null;
}
function genderNouns(){
  if(L._gNouns) return L._gNouns;
  const arts=L.genderGame||{};
  L._gNouns=WORDS.filter(w=>arts[w.g]).map(w=>{
    const m=w.t.match(/^(\S+) (\p{Lu}\p{L}*)(?: \(([^)]*)\))?$/u); if(!m||m[1]!==arts[w.g]) return null;
    return {w,noun:m[2],pl:m[3]?pluralOf(m[2],m[3]):null};
  }).filter(Boolean);
  return L._gNouns;
}
const gnById=id=>genderNouns().find(n=>n.w.id===id);
function startGender(){
  S.ga=S.ga||{};
  // Ord man redan övar på först, sedan resten av kapitlet man är på
  const sec=curSec(), pool=genderNouns().filter(n=>isLearned(n.w)||n.w.sec===sec);
  const pick=pool.map(n=>({n,st:S.ga[n.w.id]||{g:0,p:0,last:0},r:Math.random()}))
    .sort((a,b)=>(a.st.g+a.st.p)-(b.st.g+b.st.p)||a.st.last-b.st.last||a.r-b.r).slice(0,10);
  const items=[];
  pick.forEach(({n,st})=>{
    items.push({k:"gen",id:"gen:"+n.w.id,ref:n.w.id,t:"mc",canType:false});
    if(n.pl) items.push({k:"plu",id:"plu:"+n.w.id,ref:n.w.id,t:st.p>=1?"type":"mc",canType:true});
  });
  $("#tabs").hidden=true; sess=null; beginQuiz("gen",shuffle(items),{againFn:["gen"],label:"der, die, das"});
}
RESTORE.gen=RESTORE.plu=ref=>gnById(ref)?{}:null;
MC.gen=c=>{const n=gnById(c.ref), arts=L.genderGame;
  return{tab:"der, die, das",head:`<div class="word"><p class="q-prompt" ${lang()}>… ${esc(n.noun)}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div><p class="ex-sv">${esc(n.w.sv)}</p>`,
    ask:"Vilken artikel?",opts:["m","f","n"].map(g=>({label:arts[g],ok:g===n.w.g,lang:true})),
    explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>${genderHint(n)}`,say:n.w.t,sayOnAnswer:true}};
// Tumregler för genus som stämmer för just det här ordet
function genderHint(n){
  const rules=[[/(ung|heit|keit|schaft|ion|tät|ik|ur|ei|enz|anz)$/,"f","Ord på -ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ur, -ei, -enz och -anz är nästan alltid feminina."],
    [/(chen|lein|ment|um|nis|tum)$/,"n","Ord på -chen, -lein, -ment, -um och ofta -nis och -tum är neutrum."],
    [/(ismus|ling|or|eur|ant|ist)$/,"m","Ord på -ismus, -ling, -or, -eur, -ant och -ist är maskulina."]];
  const r=rules.find(([rx,g])=>rx.test(n.noun)&&g===n.w.g);
  const comp=!r&&genderNouns().find(o=>o!==n&&o.noun.length>=3&&n.noun.length>o.noun.length&&n.noun.endsWith(o.noun.toLowerCase())&&o.w.g===n.w.g);
  return r?`<p>${r[2]}</p>`:comp?`<p>Sammansatta ord får genus av sista delen: ${esc(comp.w.t.replace(/ \(.*\)$/,""))}.</p>`:"";
}
const pluralHead=n=>`<div class="word"><p class="q-prompt" ${lang()}>${esc(n.w.t.replace(/ \(.*\)$/,""))}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div><p class="ex-sv">${esc(n.w.sv)}</p>`;
MC.plu=c=>{const n=gnById(c.ref), b=n.noun, uml=b.replace(/([aou])([^aou]*)$/i,(m,v,r)=>({a:"ä",o:"ö",u:"ü",A:"Ä",O:"Ö",U:"Ü"}[v]+r));
  const wrong=[...new Set([b+"e",b+"en",b+"n",b+"er",b+"s",uml+"e",uml+"er",b])].filter(x=>x!==n.pl);
  return{tab:"Plural",head:pluralHead(n),ask:"Hur ser pluralen ut?",
    opts:shuffle([{label:"die "+n.pl,ok:true,lang:true},...shuffle(wrong).slice(0,3).map(x=>({label:"die "+x,ok:false,lang:true}))]),
    explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>`,say:"die "+n.pl,sayOnAnswer:true}};
TYPE.plu=c=>{const n=gnById(c.ref);
  return{tab:"Plural",head:pluralHead(n),ask:"Skriv pluralen.",placeholder:"die …",accents:L.accents,
    check:v=>{const x=gnorm(v).replace(/^die /,""); return {r:!x?"empty":x===n.pl.toLowerCase()?"right":"wrong"};},
    answer:"die "+esc(n.pl),explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>`,say:"die "+n.pl}};
const gaAdd=(ref,k,ok)=>{S.ga=S.ga||{}; const x=S.ga[ref]||{g:0,p:0}; x[k]=ok?x[k]+1:0; x.last=Date.now(); S.ga[ref]=x;};
EFFECT.gen=(ref,ok)=>gaAdd(ref,"g",ok);
EFFECT.plu=(ref,ok)=>gaAdd(ref,"p",ok);
RECAP.gen=RECAP.plu=ref=>{const n=gnById(ref); return n?n.w.t:"";};
KIND_NAMES.gen="der, die, das"; KIND_NAMES.plu="Plural";
AGAIN.gen=startGender;
