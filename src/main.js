/* ---------- Start: körs sist, när alla delar är definierade ---------- */
(function(){
  const codes=Object.keys(LANGUAGES);
  const sel=$("#course");
  fillCourses();
  sel.onchange=()=>useLang(sel.value);
  wireOwnWord();
  let saved=null; try{saved=localStorage.getItem(LANG_KEY)}catch(e){}
  const only=onlyCourse();
  if(codes.includes(only)){ if(!sameLang(saved,only)) saved=only; setOnly(only); }
  useLang(codes.includes(saved)?saved:codes[0]);
  cloudInit();
})();
