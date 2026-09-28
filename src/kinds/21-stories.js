/* ---------- Berättelser: tempus och bindeord ----------
   content/stories.json = [{id, sec, title, text med [rätt|fel|fel] i luckorna, gaps: [{cat, why}], sv}].
   Fråge-id "story:<id>:<lucka>". Sparat: S.stb[id] = bästa resultat, S.st.tempus och S.st.bindeord = {r, n}. */
const storyById=id=>(C().stories||[]).find(s=>s.id===id);
function parseStory(s){
  const parts=[], gaps=[]; let last=0;
  s.text.replace(/\[([^\]]+)\]/g,(m,inner,idx)=>{parts.push(s.text.slice(last,idx)); const opts=inner.split("|");
    gaps.push({ans:opts[0],opts,...((s.gaps||[])[gaps.length]||{})}); last=idx+m.length; return m;});
  parts.push(s.text.slice(last)); return {parts,gaps};
}
function openStories(){
  S.stb=S.stb||{};
  pickerScreen("Berättelser",L.storyIntro||"Läs berättelsen och välj rätt form i varje lucka.",
    (C().stories||[]).map(s=>({id:s.id,title:s.title,sec:s.sec,status:S.stb[s.id]!==undefined?`bäst ${S.stb[s.id]}/${parseStory(s).gaps.length}`:""})),startStory);
}
function startStory(id){
  const s=storyById(id); if(!s) return openStories();
  const items=parseStory(s).gaps.map((g,i)=>({k:"story",id:`story:${id}:${i}`,ref:`${id}:${i}`,t:"mc",canType:false}));
  $("#tabs").hidden=true; sess=null; beginQuiz("story",items,{ctx:{type:"story",id},againFn:["story",id],label:`Berättelse: ${s.title}`});
}
// Innehållet kan ha ändrats sedan passet pausades: frågor vars lucka, fråga eller par inte finns längre hoppas över
const storyGap=ref=>{const [id,i]=ref.split(":"), s=storyById(id); return s?parseStory(s).gaps[+i]||null:null;};
const storyMC=c=>{
  const [id,gi]=c.ref.split(":"), s=storyById(id), p=parseStory(s), g=p.gaps[+gi];
  const html=p.parts.map((t,i)=>esc(t)+(i<p.gaps.length?(i<+gi?`<b class="sg done">${esc(p.gaps[i].ans)}</b>`
    :i===+gi?`<span class="sg cur" id="gap">&nbsp;</span>`:`<span class="sg">…</span>`):"")).join("");
  return{tab:"Berättelse",head:`<p class="story" ${lang()}>${html}</p>`,
    ask:g.cat==="bindeord"?"Vilket bindeord passar i den markerade luckan?":"Vilken form passar i den markerade luckan?",
    opts:shuffle(g.opts.map((o,i)=>({label:o,ok:i===0,lang:true}))),explain:g.why?`<p>${esc(g.why)}</p>`:"",
    wire:()=>{const e=$("#gap"); if(e&&e.scrollIntoView) e.scrollIntoView({block:"center"});},
    onAnswer:()=>{const e=$("#gap"); if(e){e.textContent=g.ans; e.classList.add("filled")}}};
};
const storyEffect=(ref,ok)=>{const [id,i]=ref.split(":"), s=storyById(id); if(!s) return;
  const k=((s.gaps||[])[+i]||{}).cat==="bindeord"?"bindeord":"tempus"; S.st=S.st||{}; const o=S.st[k]||{r:0,n:0}; o.n++; if(ok)o.r++; S.st[k]=o;};
const storyRecap=ref=>{const [id,i]=ref.split(":"), s=storyById(id); if(!s) return ""; const g=parseStory(s).gaps[+i]; return g?g.ans:"";};
const storyAfter=(ctx,right,total)=>{
  const s=storyById(ctx.id); if(!s) return renderStart();
  const p=parseStory(s); S.stb=S.stb||{}; S.stb[ctx.id]=Math.max(S.stb[ctx.id]||0,right); save();
  const full=p.parts.map((t,i)=>t+(i<p.gaps.length?p.gaps[i].ans:"")).join("");
  app.innerHTML=`<section class="panel">${resultHead(`Berättelse: ${s.title}`,right,total)}
    <p class="story" ${lang()}>${p.parts.map((t,i)=>esc(t)+(i<p.gaps.length?`<b class="sg done">${esc(p.gaps[i].ans)}</b>`:"")).join("")}</p>
    ${playBar(`<button type="button" class="btn ghost" id="stop">Stoppa</button>`)}
    <details class="more"><summary>Visa svensk översättning</summary><p class="ex-sv">${esc(s.sv||"")}</p></details>
    <div class="navrow"><button class="btn ghost" id="home">Startsidan</button><button class="btn" id="more">Fler berättelser</button></div></section>`;
  wirePlay(r=>speak(full,r)); $("#stop").onclick=stopSpeech;
  $("#home").onclick=()=>{stopSpeech();renderStart()}; $("#more").onclick=()=>{stopSpeech();openStories()};
};
defineKind("story",{name:"Berättelser",mc:storyMC,restore:ref=>storyGap(ref)?{}:null,effect:storyEffect,recap:storyRecap,
  after:storyAfter,open:openStories,again:startStory});
