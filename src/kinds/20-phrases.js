/* ---------- Samtalsfraser ----------
   content/phrases.json = [{id, sit (situationen på svenska), fr (frasen på målspråket), alt: [felalternativ], why}].
   Sparat: S.ph[id] = {s, last}. */
const phrById=id=>(C().phrases||[]).find(p=>p.id===id);
function phraseItems(n){
  S.ph=S.ph||{};
  return (C().phrases||[]).map(p=>({p,s:(S.ph[p.id]||{}).s||0,l:(S.ph[p.id]||{}).last||0,r:Math.random()}))
    .sort((a,b)=>a.s-b.s||a.l-b.l||a.r-b.r).slice(0,n)
    .map(x=>({k:"phr",id:"phr:"+x.p.id,ref:x.p.id,t:x.s>=1?"type":"mc",canType:true}));
}
function startPhrases(){ $("#tabs").hidden=true; sess=null; beginQuiz("phr",shuffle(phraseItems(8)),{againFn:["phr"],label:"Samtalsfraser"}); }
defineKind("phr",{name:"Samtalsfraser",
  mc:c=>{const p=phrById(c.ref);return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,ask:"Vad säger du?",
    opts:shuffle([{label:tl(p),ok:true,lang:true},...p.alt.map(a=>({label:a,ok:false,lang:true}))]),
    explain:`<p>${esc(p.why)}</p>`,say:tl(p),sayOnAnswer:true}},
  type:c=>{const p=phrById(c.ref), nm=s=>norm(s.replace(/,/g," "));return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,
    ask:`Skriv vad du säger ${L.inLang}.`,placeholder:"Skriv frasen",accents:L.accents,
    check:v=>({r:check(v.replace(/,/g," "),[nm(tl(p))])}),answer:esc(tl(p)),explain:`<p>${esc(p.why)}</p>`,say:tl(p),override:true}},
  restore:ref=>phrById(ref)?{}:null,
  effect:(ref,ok)=>{S.ph=S.ph||{}; const x=S.ph[ref]||{s:0}; S.ph[ref]={s:ok?x.s+1:0,last:Date.now()};},
  recap:ref=>tl(phrById(ref)||{})||"",
  open:startPhrases, again:startPhrases});
