/* ---------- Verbträning ----------
   Verbspelen står i L.verbs i lang.js (games, tenses). Fråge-id "verbs:<verb>|<tempus>|<person>".
   Sparat: S.vt[tempus] och S.vv[verb] = {r, n}. */
/* Viktat urval: tabellerna står i ungefärlig frekvensordning (handskrivna kärnverb först, sedan tools/verbdata.py efter
   frekvens), så verb tidigt i tempusets tabell kommer oftare, och verb som eleven ofta svarar fel på kommer oftare
   (S.vv). Viktat urval utan återläggning (nyckel = slump^(1/vikt)). */
function verbRank(){
  if(verbRank.c&&verbRank.of===CONJ) return verbRank.c;
  const r={}; Object.values((L.verbs||{}).tenses||{}).forEach(o=>Object.keys(o).filter(k=>k!=="rule").forEach((k,i)=>{ if(!(k in r)||i<r[k]) r[k]=i; }));
  verbRank.of=CONJ; return verbRank.c=r;
}
function verbWeight(verb){
  const rank=verbRank()[verb]||0, st=(S.vv||{})[verb];
  const miss=st&&st.n?1-st.r/st.n:0.5;
  return (1/(1+rank/4))*(0.5+miss);
}
const verbPick=(pool,n)=>pool.map(c=>[Math.pow(Math.random(),1/verbWeight(c.verb)),c]).sort((a,b)=>b[0]-a[0]).slice(0,n).map(x=>x[1]);
const verbItems=(g,n)=>shuffle(verbPick(CONJ.filter(c=>g.tenses.includes(c.tense)&&(!g.verbs||g.verbs.includes(c.verb))),n)).map(c=>{
  const ref=c.verb+"|"+c.tense+"|"+c.person; return {k:"verbs",id:"verbs:"+ref,ref,c,w:{id:ref},t:"type",canType:true,tenses:g.tenses};});
const verbHead=c=>`<p class="q-prompt" ${lang()}>${esc(c.verb)} <span class="sub" style="font-family:var(--sans);font-weight:400">(${esc(L.verbs.sv[c.verb]||"")})</span></p>`;
function startVerbs(gid){
  const g=verbGames().find(x=>x.id===gid)||verbGames()[0];
  $("#tabs").hidden=true;
  const q=verbItems(g,12);
  sess=null;
  beginQuiz("verbs",q,{game:g,tenses:g.tenses,againFn:["verbs",g.id],label:`Verb: ${g.name}`});
}
defineKind("verbs",{name:"Verb",
  mc:c=>{const x=c.c;
    const tn=c.tenses||sess.tenses||[x.tense];
    const pool=[...new Set(CONJ.filter(y=>y.verb===x.verb&&tn.includes(y.tense)&&(y.tense===x.tense||y.person===x.person)).map(y=>y.form))].filter(f=>f!==x.form);
    return{tab:"Verb", head:verbHead(x),
      ask:`Välj rätt form: <b>${esc(x.person)}</b> · ${esc(x.tense)}`,
      opts:shuffle([{label:x.form,ok:true,lang:true},...shuffle(pool).slice(0,4).map(f=>({label:f,ok:false,lang:true}))]),
      explain:`<p>Rätt svar: <b ${lang()}>${esc(x.full)}</b></p><p>${esc(ruleFor(x))}</p>`, say:x.full, sayOnAnswer:true}},
  type:c=>{const x=c.c;return{tab:"Verb", head:verbHead(x),
    ask:`<b>${esc(x.person)}</b> · ${esc(x.tense)}`, placeholder:"Skriv verbformen", accents:L.verbAccents||L.accents,
    accepted:conjVariants(x), strip:true, answer:x.full, alwaysAnswer:true, nearMsg:"Nästan!",
    explain:`<p>${esc(ruleFor(x))}</p>`, say:x.full}},
  restore:ref=>CONJBY[ref]?{c:CONJBY[ref],w:{id:ref}}:null,
  effect:(ref,ok)=>{const c=CONJBY[ref]; if(!c) return;
    [[S.vt,c.tense],[S.vv,c.verb]].forEach(([o,k])=>{o[k]=o[k]||{r:0,n:0}; o[k].n++; if(ok) o[k].r++;});},
  recap:ref=>CONJBY[ref]?CONJBY[ref].full:"",
  // Loggposten har verb:true och spelet i stället för kind (så har det alltid varit)
  log:(e,s)=>{e.verb=true; e.game=s.game?s.game.id:"mix";},
  again:startVerbs});
