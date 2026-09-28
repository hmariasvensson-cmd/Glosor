/* ---------- Uttal: lyssna och välj ----------
   content/uttal.json = [{id, sec, title, tip, pairs: [["été","était"], …]}]: ord som låter nästan lika.
   Ett av orden läses upp och eleven väljer vilket det var. Fråge-id "utt:<id>|<par>|<ord>". */
const uttById=id=>(C().uttal||[]).find(u=>u.id===id);
function uttItems(set,n){
  const sets=set?[uttById(set)]:(C().uttal||[]), all=[];
  sets.forEach(u=>u.pairs.forEach((p,pi)=>{const wi=Math.floor(Math.random()*p.length); all.push({k:"utt",id:`utt:${u.id}|${pi}|${wi}`,ref:`${u.id}|${pi}|${wi}`,t:"mc"});}));
  return shuffle(all).slice(0,n);
}
function openUttal(){
  S.ut=S.ut||{};
  pickerScreen("Uttal: lyssna och välj",`Du hör ett ord och väljer vilket av orden det var. Orden låter nästan lika, så lyssna noga. Slå på ljudet${SOUND?"":" (det är avstängt nu)"}.`,
    [{id:"*",title:"Blandat",status:""},...(C().uttal||[]).map(u=>({id:u.id,title:u.title,sec:u.sec,status:S.ut[u.id]?`bäst ${S.ut[u.id]} %`:""}))],
    id=>startUttal(id==="*"?null:id));
}
function startUttal(set){
  const items=uttItems(set,10); if(!items.length) return openUttal();
  if(!SOUND) setSound(true);
  $("#tabs").hidden=true; sess=null; beginQuiz("utt",items,{againFn:["utt",set],label:set?`Uttal: ${uttById(set).title}`:"Uttal: blandat",ctx:{type:"utt",id:set||"*"}});
}
const uttMC=c=>{const [id,pi,wi]=c.ref.split("|"), u=uttById(id), p=u.pairs[+pi], w=p[+wi];
  return{tab:"Uttal",head:`<p class="q-prompt" style="font-size:1.3rem">Vilket ord hör du?</p>${playBar()}`,ask:esc(u.title),
    opts:p.map((x,j)=>({label:x,ok:j===+wi,lang:true})),
    explain:`<p>${p.map(x=>`<span ${lang()}><b>${esc(x)}</b></span> <button type="button" class="speak xs" data-say="${esc(x)}" aria-label="Läs upp ${esc(x)}">${SPK}</button>`).join(" · ")}</p>${u.tip?`<p>${rmark(u.tip)}</p>`:""}`,
    say:w,sayOnShow:true,wire:()=>wirePlay(r=>speak(w,r))};};
const uttRecap=ref=>{const [id,pi,wi]=ref.split("|"), u=uttById(id), p=u&&u.pairs[+pi]; return p&&p[+wi]||"";};
function uttAfter(ctx,right,total,miss){
  S.ut=S.ut||{}; const pc=total?Math.round(100*right/total):0; if(ctx.id!=="*") S.ut[ctx.id]=Math.max(S.ut[ctx.id]||0,pc); save();
  app.innerHTML=`<section class="panel">${resultHead("Uttal klart",right,total)}
    ${miss.length?`<div class="field"><span class="label">Lyssna igen på</span><ul class="missed">${miss.map(uttRecap).filter(Boolean).map(m=>`<li><span ${lang()}>${esc(m)}</span><button type="button" class="speak xs" data-say="${esc(m)}" aria-label="Läs upp">${SPK}</button></li>`).join("")}</ul></div>`:""}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="again">En runda till</button></div></section>`;
  $("#home").onclick=renderStart; $("#again").onclick=()=>startUttal(ctx.id==="*"?null:ctx.id); renderList();
}
defineKind("utt",{name:"Uttal",mc:uttMC,restore:ref=>uttRecap(ref)?{}:null,recap:uttRecap,after:uttAfter,open:openUttal});
