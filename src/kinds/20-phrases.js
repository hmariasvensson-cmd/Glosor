/* ---------- Samtalsfraser ----------
   content/phrases.json = [{id, sit (situationen på svenska), fr (frasen på målspråket), alt: [felalternativ], why}].
   Sparat: S.ph[id] = {s, last, dd} (srsBump i 00-common.js). Förfallna fraser först, sedan nya, sedan resten svagast först. */
const phrById=id=>(C().phrases||[]).find(p=>p.id===id);
function phraseItems(n){
  return weakestFirst(C().phrases||[],"ph",{due:true}).slice(0,n)
    .map(p=>({k:"phr",id:"phr:"+p.id,ref:p.id,t:(S.ph[p.id]||{}).s>=1?"type":"mc",canType:true}));
}
const phraseDue=()=>srsDueCount(S.ph,(C().phrases||[]).map(p=>p.id));
function startPhrases(){ $("#tabs").hidden=true; sess=null; beginQuiz("phr",shuffle(phraseItems(8)),{againFn:["phr"],label:"Samtalsfraser"}); }
defineKind("phr",{name:"Samtalsfraser",
  mc:c=>{const p=phrById(c.ref);return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,ask:"Vad säger du?",
    opts:shuffle([{label:tl(p),ok:true,lang:true},...p.alt.map(a=>({label:a,ok:false,lang:true}))]),
    explain:`<p>${esc(p.why)}</p>`,say:tl(p),sayOnAnswer:true}},
  type:c=>{const p=phrById(c.ref), nm=s=>norm(s.replace(/,/g," "));return{tab:"Fraser",head:`<div class="situation">${esc(p.sit)}</div>`,
    ask:`Skriv vad du säger ${L.inLang}.`,placeholder:"Skriv frasen",accents:L.accents,
    check:v=>({r:check(v.replace(/,/g," "),[nm(tl(p))])}),answer:tl(p),explain:`<p>${esc(p.why)}</p>`,say:tl(p),override:true}},
  restore:ref=>phrById(ref)?{}:null,
  effect:(ref,ok)=>{S.ph=S.ph||{}; S.ph[ref]=srsBump(S.ph[ref],ok);},
  recap:ref=>tl(phrById(ref)||{})||"",
  open:startPhrases, again:startPhrases});
