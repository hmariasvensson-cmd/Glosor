/* ---------- Teoriprovet: musikteori på målspråket ----------
   content/teori.json = [{id, sec, q (uppgiften på målspråket, som på provet), sv (svensk översättning), opts: [...], a (index), why}].
   Frågor man missat eller inte sett kommer först (S.te[id] = {s, last}). */
const teoriById=id=>(C().teori||[]).find(x=>x.id===id);
function startTeori(){
  const items=weakestFirst(C().teori||[],"te").slice(0,10).map(x=>({k:"teori",id:"teori:"+x.id,ref:x.id,t:"mc"}));
  if(!items.length) return renderStart();
  $("#tabs").hidden=true; sess=null; beginQuiz("teori",shuffle(items),{againFn:["teori"],label:"Teoriprovet"});
}
const teoriRestore=ref=>{const x=teoriById(ref); return x&&Array.isArray(x.opts)&&x.opts[x.a]!==undefined?{}:null;};
const teoriMC=c=>{const x=teoriById(c.ref);
  return{tab:"Teori",head:`<p class="q-prompt" style="font-size:1.25rem" ${lang()}>${rmark(x.q)}</p><details class="more"><summary>Visa på svenska</summary><p class="ex-sv">${esc(x.sv||"")}</p></details>`,
    ask:"Välj rätt svar.",opts:x.opts.map((o,j)=>({label:o,ok:j===x.a,lang:true})),
    explain:x.why?`<p>${rmark(x.why)}</p>`:"",say:x.opts[x.a],sayOnAnswer:true};};
const teoriEffect=(ref,ok)=>{S.te=S.te||{}; S.te[ref]=srsBump(S.te[ref],ok);};
const teoriRecap=ref=>{const x=teoriById(ref); return x?x.opts[x.a]:"";};
defineKind("teori",{name:"Teoriprovet",mc:teoriMC,restore:teoriRestore,effect:teoriEffect,recap:teoriRecap,open:startTeori,again:startTeori});
