/* ---------- Startsidans panel med alla övningar ---------- */
// Övningarna i grupper. Startsidan visar en knapp per grupp, och varje grupp öppnas på en egen sida.
function exGroups(){
  const c=C(), n=clozePool().length, lname=L.name.toLowerCase();
  const g=(id,title,sub,dis)=>`<button class="game" data-ex="${id}" ${dis?"disabled":""}><span><b>${title}</b><small>${sub}</small></span><span class="go" aria-hidden="true">›</span></button>`;
  const groups=[
    ["words","Ord och meningar","Meningar, diktamen, översättning och ordföljd",[
      g("cloze","Meningar",n<4?"Lär dig några ord i quizet först.":"Fyll i luckan i en mening.",n<4),
      // srsDueNote: " · 3 att repetera i dag" (tidsbaserad repetition, 00-common.js)
      g("dict","Diktamen","Lyssna på en mening och skriv den."+srsDueNote(sentDue("dc",dictPool()))),
      g("trans","Översätt meningar",`Från svenska till ${lname}, hela meningar.`+srsDueNote(sentDue("tr",transPool()))),
      g("order","Ordföljd","Bygg meningen i rätt ordning."+srsDueNote(sentDue("od",orderPool()))),
      g("ktest","Kapitelprov","Förhör dig på alla glosor i ett kapitel, och öva sedan på dem du missade."),
      L.genderGame&&g("gen",Object.values(L.genderGame).join(", "),"Rätt artikel och plural för substantiven.")]],
    ["texts","Lyssna och läsa","Hörförståelse, texter och kultur",[
      c.listening&&g("lq","Hörförståelse","Lyssna på en dialog och svara på frågor."),
      c.reading&&g("rq","Läsa texter","Tryck på alla ord du inte kan och spara dem i Mina ord."),
      c.culture&&g("culture","Kultur","Kort fakta, en fråga och en jämförelse med Sverige.")]],
    ["gram","Grammatik","Verb, grammatikövningar och berättelser",[
      ...verbGames().map(v=>`<button class="game" data-g="${esc(v.id)}"><span><b>Verb: ${esc(v.name)}</b><small>${esc(v.sub||"")}</small></span><span class="go" aria-hidden="true">›</span></button>`),
      hasGrammar()&&g("gram","Grammatikövningar",esc(GR().topics.slice(0,4).map(t=>t.name.toLowerCase()).join(", ")+" …")+srsDueNote(gramDue(null))),
      (c.satsanalys||[]).length&&g("sats","Satsanalys","Vilken funktion har den understrukna delen? Sujet, COD, COI, subordonnée relative …"),
      c.stories&&g("story","Berättelser","Välj rätt tempus och bindeord i en berättelse.")]],
    ...(hasExam()||(c.teori||[]).length?[["exam","Språkprov och teoriprov",hasExam()?`${esc(EX().name)}: provuppgifter och simulering`:"Musikteori på målspråket",[
      hasExam()&&g("exam",`Provträning: ${esc(EX().name)}`,"Uppgifter i provets format, med klocka, poäng och provsimulering."),
      (c.teori||[]).length&&g("teori","Teoriprovet: musikteori","Uppgifter som på det skriftliga teoriprovet vid antagningen, på "+lname+".")]]]:[]),
    ["speak","Tala och skriva","Tala, samtalsfraser, skugga och skrivuppgifter",[
      g("talk","Tala",L.goal?"4/3/2 med klocka och diktering, muntlig förberedelse, samtal med Claude och skugga.":"4/3/2 med klocka och diktering, samtal med Claude och skugga."),
      c.phrases&&g("phr","Samtalsfraser","Vad man säger när man inte förstår, vill säga sin åsikt …"+srsDueNote(phraseDue())),
      (c.uttal||[]).length&&g("utt","Uttal: lyssna och välj","Ord som låter nästan lika. Vilket hör du?"),
      (c.transkription||[]).length&&g("ipa","Transkription (IPA)","Från franska till IPA och tillbaka: nasalvokaler, e caduc, liaison …"),
      c.prompts&&g("write","Skriv en text",(L.selfStudy?"Skrivuppgift med checklista och exempeltext.":"Skrivuppgift med checklista, att skicka till läraren.")+(wrExamTasks().length?" Även provets skrivuppgifter.":""))]]
  ];
  return groups.map(([id,t,sub,items])=>({id,t,sub,items:items.filter(Boolean)})).filter(g=>g.items.length);
}
function gamesPanel(){
  return `${examSimCard()}${planCard()}<section class="panel"><h2>Fler övningar</h2><div class="grpgrid">${exGroups().map(g=>`<button class="grp" data-grp="${g.id}">
    <b>${g.t}</b><small>${g.sub}</small><span class="label">${g.items.length} ${g.items.length===1?"övning":"övningar"}</span></button>`).join("")}</div></section>`;
}
function openExGroup(id){
  const g=exGroups().find(x=>x.id===id); if(!g) return renderStart();
  stopSpeech(); $("#tabs").hidden=true; sess=null;
  app.innerHTML=`<section class="panel"><h2>${g.t}</h2><div class="games">${g.items.join("")}</div></section>
    <button class="quit" id="quit">Tillbaka</button>`;
  wireGames(); $("#quit").onclick=renderStart; window.scrollTo(0,0);
}
function wireGames(){
  // data-ex är typens namn i registret, och knappen öppnar typens open
  app.querySelectorAll("[data-ex]").forEach(b=>b.onclick=()=>KINDS[b.dataset.ex].open());
  app.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>startVerbs(b.dataset.g));
  app.querySelectorAll("[data-grp]").forEach(b=>b.onclick=()=>openExGroup(b.dataset.grp));
  // En pågående provsimulering (examSimCard, 70-exam.js)
  if($("#simgo")) $("#simgo").onclick=simResume;
  if($("#simdrop")) $("#simdrop").onclick=()=>{ simDrop(); renderStart(); };
}

/* ---------- Statistik för övningarna ---------- */
function statsExercises(){
  const logs=S.log.filter(l=>l.kind); if(!logs.length) return "";
  const agg={}; logs.forEach(l=>{const a=agg[l.kind]=agg[l.kind]||{r:0,n:0,c:0,w:0}; a.r+=l.right||0; a.n+=l.total||0; a.c++; a.w+=l.words||0;});
  const rows=Object.entries(agg).filter(([k])=>k!=="write"&&k!=="talk").map(([k,a])=>meter(`${(KINDS[k]||{}).name||k} · ${a.c} ${a.c===1?"gång":"gånger"}`,a.r,a.n)).join("");
  const st=S.st||{}, t=st.tempus||{}, b=st.bindeord||{};
  return `<section class="panel"><h2>Övningar</h2>${rows}${ipaStats()}${satsStats()}
    ${t.n||b.n?`<p class="plan">I berättelserna: tempus ${pct(t.r,t.n)??"–"}% rätt, bindeord ${pct(b.r,b.n)??"–"}% rätt.</p>`:""}
    ${agg.talk?`<p class="plan">Du har talat ${agg.talk.c} ${agg.talk.c===1?"gång":"gånger"}, sammanlagt ${agg.talk.w} ord${((S.talk||{}).t&&Object.keys(S.talk.t).length)?`, bäst ${Math.max(...Object.values(S.talk.t).map(x=>x.best||0))} ord per minut`:""}.</p>`:""}
    ${agg.write?`<p class="plan">Du har skrivit ${agg.write.c} ${agg.write.c===1?"text":"texter"}, sammanlagt ${agg.write.w} ord.</p>`:""}
    ${(S.mine||[]).length?`<p class="plan">${S.mine.length} ord sparade från texterna i Mina ord.</p>`:""}</section>`;
}
