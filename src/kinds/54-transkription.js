/* ---------- Transkription: franska ↔ IPA (universitetskursen) ----------
   content/transkription.json = [{id, sec, topic, fr, ipa: "/…/", alt: [tre typiska fel], ok?: [fler godkända skrivsätt], why}].
   Tre former av samma post, ref "<id>|<form>": f = ordet → välj IPA (flerval), r = IPA → välj ordet (flerval),
   w = skriv transkriptionen med IPA-knappraden. Formen väljs efter hur väl eleven kan posten (S.ipa[id].s: 0 → f, 1 → r, 2+ → w).
   S.ipa = {<id>: {s, last, r, n}}. Fråge-id "ipa:<id>|<form>". */
const IPA_TOPICS={nasal:"Nasalvokaler",ecaduc:"E caduc",liaison:"Liaison och enchaînement",voy:"Öppna och slutna vokaler",
  yu:"[y], [u], [ø] och [œ]",semi:"Halvvokaler",h:"H aspiré",graf:"Grafem och fonem",sv:"Kontraster med svenskan"};
const IPA_KEYS="ɑ̃ ɛ̃ ɔ̃ œ̃ ə ɛ ɔ ø œ y ʁ ʃ ʒ ɲ ŋ ɥ w j ː ‿ ·";
const ipaById=id=>(C().transkription||[]).find(x=>x.id===id);
// Rättningen: bara ljuden räknas. Snedstreck, hakparenteser, mellanslag, syllabering (. · -), länkning (‿ _),
// betoningstecken och längdtecken tas bort; r/ʀ räknas som ʁ, g som ɡ, : som ː.
function ipaNorm(s){
  return String(s||"").normalize("NFD").toLowerCase()
    .replace(/[\/\[\]\s.·‿_\-ˈˌ'’ː:|]/g,"").replace(/[rʀ]/g,"ʁ").replace(/ɡ/g,"g").normalize("NFC");
}
function ipaCheck(input,x){
  if(!ipaNorm(input)) return "empty";
  const a=ipaNorm(input); return [x.ipa,...(x.ok||[])].some(v=>ipaNorm(v)===a)?"right":"wrong";
}
function ipaItems(topic,n){
  S.ipa=S.ipa||{};
  return (C().transkription||[]).filter(x=>!topic||x.topic===topic)
    .map(x=>({x,st:S.ipa[x.id]||{s:0,last:0},r:Math.random()}))
    .sort((a,b)=>Math.min(a.st.s,3)-Math.min(b.st.s,3)||a.st.last-b.st.last||a.r-b.r).slice(0,n)
    .map(({x,st})=>{const f=["f","r","w"][Math.min(st.s,2)]; return {k:"ipa",id:`ipa:${x.id}|${f}`,ref:`${x.id}|${f}`,t:f==="w"?"type":"mc",canType:f==="w"};});
}
function openIpa(){
  S.ipa=S.ipa||{}; const all=C().transkription||[];
  const done=t=>{const xs=all.filter(x=>!t||x.topic===t), k=xs.filter(x=>(S.ipa[x.id]||{}).s>=2).length; return k?`${k} av ${xs.length} sitter`:`${xs.length} ord`;};
  const topics=Object.keys(IPA_TOPICS).filter(t=>all.some(x=>x.topic===t));
  pickerScreen("Transkription (IPA)","Från franska till IPA och tillbaka. Först väljer du rätt transkription, sedan rätt ord, och när du kan ordet skriver du transkriptionen själv med knapparna. Mellanslag, punkter för stavelser och ‿ för länkning spelar ingen roll i rättningen.",
    [{id:"*",title:"Blandat",status:""},...topics.map(t=>({id:t,title:IPA_TOPICS[t],status:""})).map(it=>({...it,title:it.title+" · "+done(it.id)}))],
    id=>startIpa(id==="*"?null:id));
}
function startIpa(topic){
  topic=topic&&topic!=="*"?topic:null;
  const items=ipaItems(topic,10); if(!items.length) return renderStart();
  $("#tabs").hidden=true; sess=null;
  beginQuiz("ipa",shuffle(items),{againFn:["ipa",topic||"*"],label:topic?`Transkription: ${IPA_TOPICS[topic]}`:"Transkription",ctx:{type:"ipa",id:topic||"*"}});
}
const ipaShow=s=>`<span class="ipa" style="font-family:'Charis SIL','Doulos SIL','Gentium Plus','Lucida Grande','Segoe UI',sans-serif">${esc(s)}</span>`;
const ipaExplain=x=>`<p><b ${lang()}>${esc(x.fr)}</b> ${ipaShow(x.ipa)} <button type="button" class="speak xs" data-say="${esc(x.fr)}" aria-label="Läs upp ${esc(x.fr)}">${SPK}</button></p>${x.why?`<p>${rmark(x.why)}</p>`:""}`;
const ipaHeadFr=x=>`<div class="word"><p class="q-prompt" ${lang()}>${esc(x.fr)}</p><button class="speak" id="sp" type="button" aria-label="Läs upp">${SPK}</button></div>`;
function ipaWords(x){ // tre andra ord som alternativ, helst från samma moment
  const all=(C().transkription||[]).filter(y=>y.fr!==x.fr);
  const same=shuffle(all.filter(y=>y.topic===x.topic)), other=shuffle(all.filter(y=>y.topic!==x.topic)), out=[];
  for(const y of same.concat(other)){ if(out.length>=3) break; if(!out.includes(y.fr)) out.push(y.fr); }
  return out;
}
const ipaMC=c=>{const [id,f]=c.ref.split("|"), x=ipaById(id);
  if(f==="r") return{tab:"IPA",head:`<p class="q-prompt">${ipaShow(x.ipa)}</p>`,ask:"Vilket ord eller vilken fras är det?",
    opts:shuffle([{label:x.fr,ok:true,lang:true},...ipaWords(x).map(w=>({label:w,ok:false,lang:true}))]),
    explain:ipaExplain(x),say:x.fr,sayOnAnswer:true};
  return{tab:"IPA",head:ipaHeadFr(x),ask:"Välj rätt transkription.",
    opts:shuffle([{label:x.ipa,ok:true},...(x.alt||[]).map(a=>({label:a,ok:false}))]),
    explain:ipaExplain(x),say:x.fr,sayOnShow:true,
    wire:()=>app.querySelectorAll(".opt span:last-child").forEach(s=>s.style.fontFamily="'Charis SIL','Doulos SIL','Gentium Plus','Lucida Grande','Segoe UI',sans-serif")};};
const ipaType=c=>{const x=ipaById(c.ref.split("|")[0]);
  return{tab:"IPA",head:ipaHeadFr(x),ask:"Skriv transkriptionen i IPA.",placeholder:"/…/",accents:IPA_KEYS,
    accepted:[x.ipa],check:v=>({r:ipaCheck(v,x)}),answer:ipaShow(x.ipa),explain:x.why?`<p>${rmark(x.why)}</p>`:"",say:x.fr,autoplay:true,override:true,
    wire:()=>{ const inp=$("#ans");
      if($("#sp")) $("#sp").onclick=()=>speak(x.fr);
      // Knapparna: tecken som ɑ̃ är två kodpunkter, så markören flyttas hela teckenlängden
      app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{
        const s=inp.selectionStart??inp.value.length, e=inp.selectionEnd??inp.value.length, ch=b.dataset.c;
        inp.value=inp.value.slice(0,s)+ch+inp.value.slice(e); inp.focus(); inp.setSelectionRange(s+ch.length,s+ch.length); }); }};};
const ipaRestore=ref=>{const [id,f]=ref.split("|"), x=ipaById(id); return x&&["f","r","w"].includes(f)&&x.ipa&&(x.alt||[]).length?{}:null;};
const ipaEffect=(ref,ok)=>{S.ipa=S.ipa||{}; const id=ref.split("|")[0], o=S.ipa[id]||{s:0,r:0,n:0};
  S.ipa[id]={s:ok?o.s+1:0,last:Date.now(),r:(o.r||0)+(ok?1:0),n:(o.n||0)+1};};
const ipaRecap=ref=>{const x=ipaById(ref.split("|")[0]); return x?x.fr:"";};
// Slutskärmen: de missade orden med transkription och uppläsning
function ipaAfter(ctx,right,total,miss){
  const xs=[...new Set(miss.map(r=>r.split("|")[0]))].map(ipaById).filter(Boolean);
  app.innerHTML=`<section class="panel">${resultHead("Transkription klar",right,total)}
    ${xs.length?`<div class="field"><span class="label">Titta på de här en gång till</span><ul class="missed">${xs.map(x=>`<li><span><span ${lang()}>${esc(x.fr)}</span> ${ipaShow(x.ipa)}</span><button type="button" class="speak xs" data-say="${esc(x.fr)}" aria-label="Läs upp">${SPK}</button></li>`).join("")}</ul></div>`:""}
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="again">En runda till</button></div>
    <button class="btn ghost" id="st">Se statistik</button></section>`;
  $("#home").onclick=renderStart; $("#again").onclick=()=>startIpa(ctx.id); $("#st").onclick=()=>setView("stats"); renderList();
}
// Statistiken: andel rätt per moment
function ipaStats(){
  const all=C().transkription||[], st=S.ipa||{}; if(!all.length||!Object.keys(st).length) return "";
  return `<p class="label" style="margin-top:14px">Transkription per moment</p>`+Object.keys(IPA_TOPICS).map(t=>{
    const xs=all.filter(x=>x.topic===t&&st[x.id]), r=xs.reduce((a,x)=>a+(st[x.id].r||0),0), n=xs.reduce((a,x)=>a+(st[x.id].n||0),0);
    return n?meter(IPA_TOPICS[t],r,n):""; }).join("");
}
defineKind("ipa",{name:"Transkription",mc:ipaMC,type:ipaType,restore:ipaRestore,effect:ipaEffect,recap:ipaRecap,after:ipaAfter,open:openIpa,again:startIpa});
