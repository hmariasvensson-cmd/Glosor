/* ---------- Skriv en text till läraren ----------
   content/prompts.json = [{id, sec, title, task, min, max, need: {connectors, chapterWords, tenses}, model, modelSv}]. Ingen quiz.
   Sparat: S.wr[id] = {words, last, h}, utkastet i S.drafts["w:<id>"] och en loggpost med kind "write". */
function openWriting(){
  S.wr=S.wr||{};
  pickerScreen("Skriv en text",`Välj en skrivuppgift. Checklistan visar hur det går medan du skriver. ${L.selfStudy?"Jämför sedan med exempeltexten, och be gärna någon som kan språket att läsa din text.":"Kopiera texten och skicka den till din lärare för kommentarer."}`,
    (C().prompts||[]).map(p=>({id:p.id,title:p.title,sec:p.sec,status:S.wr[p.id]?`${S.wr[p.id].words} ord`:""})),writeScreen);
}
// Finns ordet i texten? Substantiv räknas även utan artikel och i plural, verb även i böjd form (samma stam).
// Artikeln tas bara bort när den står som ett eget ord (följd av mellanslag eller apostrof), så att
// "der Lehrer" blir "Lehrer" och inte "hrer", och "insalata" inte blir "nsalata".
const stripArt=(s,re)=>{const m=re&&s.match(re); return m&&/[\s']$/.test(m[0])?s.slice(m[0].length):s;};
function usesWord(text,w){
  text=apos(text);
  if(variants(w.t).some(v=>v.length>2&&hasWord(text,v))) return true;
  const base=apos(w.t.replace(/\(.*?\)/g,"").trim());
  if(w.g){ let bare=stripArt(base,L.hintStrip); (L.articles||[]).forEach(re=>{bare=stripArt(bare,re);});
    const pl=L.genderGame&&typeof genderNouns==="function"?(genderNouns().find(n=>n.w.id===w.id)||{}).pl:null;
    return [bare,pl,pl&&pl+"n"].some(v=>v&&v.length>2&&hasWord(text,v)); }
  const m=base.replace(/^(sich|se|s')\s*/i,"").match(/^(\p{L}{4,}?)(en|er|ir|re|n)$/u);
  return !!m&&new RegExp("(^|[^\\p{L}])(ge)?"+reEsc(m[1])+"\\p{L}*","iu").test(text);
}
// Bindeorden i texten. På varje ställe räknas bara det längsta bindeordet som passar:
// "même si" räknas inte också som "si", och "alors que" inte också som "alors".
function foundConnectors(text,list){
  text=apos(text); const hits=[];
  (list||[]).forEach(c=>{const re=new RegExp("(^|[^\\p{L}])("+reEsc(apos(c))+")(?![\\p{L}])","giu"); let m;
    while((m=re.exec(text))){ const i=m.index+m[1].length; hits.push({c,i,j:i+m[2].length}); re.lastIndex=i+1; }});
  hits.sort((a,b)=>(b.j-b.i)-(a.j-a.i)||a.i-b.i);
  const taken=[], found=[];
  hits.forEach(h=>{ if(taken.some(t=>h.i<t.j&&t.i<h.j)) return; taken.push(h); if(!found.includes(h.c)) found.push(h.c); });
  return (list||[]).filter(c=>found.includes(c));
}
function writeChecks(p,text){
  text=apos(text);
  const n=tok(text).length, need=p.need||{}, out=[];
  out.push({ok:n>=p.min&&n<=p.max,label:`Antal ord: ${n} (mål ${p.min}–${p.max})`});
  if(need.connectors){const f=foundConnectors(text,L.connectors); out.push({ok:f.length>=need.connectors,label:`Bindeord: ${f.length} av ${need.connectors}${f.length?` (${f.join(", ")})`:""}`});}
  // Kapitelorden hoppas över om kapitlet saknas (t.ex. när bokmappen inte finns)
  if(need.chapterWords&&p.sec&&WORDS.some(w=>w.sec===p.sec)){const f=WORDS.filter(w=>w.sec===p.sec&&usesWord(text,w)).map(w=>w.t);
    out.push({ok:f.length>=need.chapterWords,label:`Ord från kapitlet: ${f.length} av ${need.chapterWords}${f.length?` (${f.slice(0,5).join(", ")})`:""}`});}
  (need.tenses||[]).forEach(t=>{const rx=(L.tenseCheck||{})[t]; if(rx) out.push({ok:rx(text),label:`${t[0].toUpperCase()+t.slice(1)} verkar finnas med`});});
  return out;
}
const textHash=s=>{let h=0; for(const c of String(s).trim()) h=(h*31+c.codePointAt(0))|0; return h;};
function writeScreen(id){
  const p=(C().prompts||[]).find(x=>x.id===id); S.drafts=S.drafts||{}; S.wr=S.wr||{};
  const dk="w:"+id, start=Date.now();
  $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><span class="tab">Skriva</span>${p.sec?`<span class="label">${esc(secName(p.sec))}</span>`:""}
    <h2>${esc(p.title)}</h2><p class="plan">${esc(p.task)}</p>
    <ul class="checklist" id="checks"></ul>
    <textarea class="answer-in wtext" id="wtext" rows="10" ${lang()} autocapitalize="sentences" spellcheck="false" placeholder="Skriv din text här">${esc(S.drafts[dk]||"")}</textarea>
    ${accentKeys(L.accents)}
    <p class="foot" id="wmsg">Texten sparas medan du skriver.</p>
    <div class="navrow"><button type="button" class="btn ghost" id="copy">Kopiera texten</button><button class="btn" id="done">Klar</button></div>
    <button type="button" class="btn ghost" id="fbbtn">Få kommentarer av Claude</button><div id="fbout"></div>
    <details class="more"><summary>Visa en exempeltext</summary><p class="ex-t" ${lang()}>${esc(p.model||"")}</p><p class="ex-sv">${esc(p.modelSv||"")}</p></details></section>
  <button class="quit" id="quit">Tillbaka</button>`;
  const ta=$("#wtext"); let tm=null; wireAccents(ta);
  wireFeedback(ta,dk,`${p.title}: ${p.task} (${p.min}–${p.max} ord)`);
  const draw=()=>{$("#checks").innerHTML=writeChecks(p,ta.value).map(c=>`<li class="${c.ok?"ok":""}">${esc(c.label)}</li>`).join("");};
  ta.oninput=()=>{draw(); clearTimeout(tm); tm=setTimeout(()=>{S.drafts[dk]=ta.value; save(); const m=$("#wmsg"); if(m) m.textContent="Sparat.";},800);};
  draw();
  $("#copy").onclick=()=>copyText(ta,$("#wmsg"));
  // Flera tryck på Klar ger en enda loggpost: samma text räknas inte igen, och en ändrad text uppdaterar
  // loggposten från det här besöket i stället för att lägga till en ny
  let entry=null;
  $("#done").onclick=()=>{ const n=tok(ta.value).length; if(!n) return;
    const h=textHash(ta.value), same=S.wr[id]&&S.wr[id].h===h;
    S.drafts[dk]=ta.value; S.wr[id]={words:n,last:Date.now(),h};
    const dur=Math.min(3600,Math.round((Date.now()-start)/1000));
    if(entry&&S.log.includes(entry)) Object.assign(entry,{dur,words:n});
    else if(!same){ entry={kind:"write",d:Date.now(),dur,right:0,total:0,words:n}; S.log.push(entry); }
    save(); boardPush();
    $("#wmsg").textContent=L.selfStudy?"Klart! Jämför med exempeltexten nedanför: hittar du konstruktioner du kan låna?":"Klart! Glöm inte att kopiera texten och skicka den till din lärare."; };
  $("#quit").onclick=openWriting;
  window.scrollTo(0,0);
}
defineKind("write",{name:"Skrivna texter",open:openWriting});
