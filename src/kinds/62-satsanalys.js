/* ---------- Satsanalys med fransk terminologi (universitetskursen) ----------
   content/satsanalys.json = [{id, sec, lvl (1 lätt – 3 svår), t ("fn" satsdel/ordets funktion, "prop" satstyp),
   fr (meningen, den markerade delen inom [[…]]), opts: [franska termer], a (index), why (svenska, med fransk och svensk term)}].
   S.sa = {<id>: {s, last, r, n}}. Fråge-id "sats:<id>". */
const SATS_GROUPS={fn:"Satsdelar och ordets funktion",prop:"Satstyper: huvudsats och bisatser"};
const satsById=id=>(C().satsanalys||[]).find(x=>x.id===id);
const satsMark=fr=>esc(fr).replace(/\[\[(.+?)\]\]/g,'<u style="text-decoration-thickness:2px;text-underline-offset:4px;font-weight:600">$1</u>');
const satsPart=x=>((x.fr||"").match(/\[\[(.+?)\]\]/)||[])[1]||"";
function openSats(){
  S.sa=S.sa||{}; const all=C().satsanalys||[];
  const info=t=>{const xs=all.filter(x=>!t||x.t===t), k=xs.filter(x=>(S.sa[x.id]||{}).s>=1).length; return `${k} av ${xs.length} rätt senast`;};
  pickerScreen("Satsanalys","En mening på franska med en understruken del. Välj dess funktion eller vilken sorts sats det är, med den franska termen. Förklaringen har både den franska och den svenska termen. Lätta meningar först.",
    [{id:"*",title:"Blandat · "+info(null),status:""},...Object.keys(SATS_GROUPS).filter(t=>all.some(x=>x.t===t)).map(t=>({id:t,title:SATS_GROUPS[t]+" · "+info(t),status:""}))],
    id=>startSats(id==="*"?null:id));
}
function startSats(grp){
  grp=grp&&grp!=="*"?grp:null; S.sa=S.sa||{};
  // Det man inte kan eller inte sett först, lätt före svårt; rundan visas från lätt till svårt
  const items=(C().satsanalys||[]).filter(x=>!grp||x.t===grp).map(x=>({x,st:S.sa[x.id]||{s:0,last:0},r:Math.random()}))
    .sort((a,b)=>Math.min(a.st.s,2)-Math.min(b.st.s,2)||(a.x.lvl||1)-(b.x.lvl||1)||a.st.last-b.st.last||a.r-b.r).slice(0,10)
    .sort((a,b)=>(a.x.lvl||1)-(b.x.lvl||1)||a.r-b.r).map(({x})=>({k:"sats",id:"sats:"+x.id,ref:x.id,t:"mc"}));
  if(!items.length) return renderStart();
  $("#tabs").hidden=true; sess=null;
  beginQuiz("sats",items,{againFn:["sats",grp||"*"],label:grp?`Satsanalys: ${SATS_GROUPS[grp]}`:"Satsanalys"});
}
const satsRestore=ref=>{const x=satsById(ref); return x&&Array.isArray(x.opts)&&x.opts[x.a]!==undefined&&satsPart(x)?{}:null;};
const satsMC=c=>{const x=satsById(c.ref);
  return{tab:"Satsanalys",head:`<div class="word"><p class="q-prompt" style="font-size:1.25rem" ${lang()}>${satsMark(x.fr)}</p><button class="speak" id="sp" type="button" aria-label="Läs upp">${SPK}</button></div>`,
    ask:x.t==="prop"?"Vilken sorts sats är den understrukna delen?":"Vilken funktion har den understrukna delen?",
    opts:x.opts.map((o,j)=>({label:o,ok:j===x.a,lang:true})),
    explain:x.why?`<p>${rmark(x.why)}</p>`:"",say:x.fr.replace(/\[\[|\]\]/g,"")};};
const satsEffect=(ref,ok)=>{S.sa=S.sa||{}; const o=S.sa[ref]||{s:0,r:0,n:0}; S.sa[ref]={s:ok?o.s+1:0,last:Date.now(),r:(o.r||0)+(ok?1:0),n:(o.n||0)+1};};
const satsRecap=ref=>{const x=satsById(ref); return x?`${satsPart(x)}: ${x.opts[x.a]}`:"";};
// Statistiken: andel rätt för satsdelar och satstyper
function satsStats(){
  const all=C().satsanalys||[], st=S.sa||{}; if(!all.length||!Object.keys(st).length) return "";
  return `<p class="label" style="margin-top:14px">Satsanalys</p>`+Object.keys(SATS_GROUPS).map(t=>{
    const xs=all.filter(x=>x.t===t&&st[x.id]), r=xs.reduce((a,x)=>a+(st[x.id].r||0),0), n=xs.reduce((a,x)=>a+(st[x.id].n||0),0);
    return n?meter(SATS_GROUPS[t],r,n):""; }).join("");
}
defineKind("sats",{name:"Satsanalys",mc:satsMC,restore:satsRestore,effect:satsEffect,recap:satsRecap,open:openSats,again:startSats});
