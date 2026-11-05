/* ---------- Start: körs sist, när alla delar är definierade ---------- */
(function(){
  const codes=Object.keys(LANGUAGES);
  const sel=$("#course");
  fillCourses();
  sel.onchange=()=>{ LAST.moved=true; useLang(sel.value); };
  wireOwnWord();
  $("#sound").onclick=()=>setSound(!SOUND); setSound(SOUND);
  let saved=null; try{saved=localStorage.getItem(langKey())||localStorage.getItem(LANG_KEY)}catch(e){ /* privat läge: första kursen */ }
  const last=lastLocal(); if(last&&lastOk(last.code)) saved=last.code;   // senast övade kursen går före senast öppnade
  const only=onlyCourse();
  if(codes.includes(only)){ if(!sameLang(saved,only)) saved=only; setOnly(only); }
  useLang(codes.includes(saved)?saved:codes[0]);
  cloudInit();
})();
