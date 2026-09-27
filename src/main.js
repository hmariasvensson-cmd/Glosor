/* ---------- Start: körs sist, när alla delar är definierade ---------- */
(function(){
  const codes=Object.keys(LANGUAGES);
  // Kursväljaren: byggda kurser går att välja, kommande kurser visas men går inte att välja än
  const sel=$("#course");
  sel.innerHTML=codes.map(c=>`<option value="${c}">${esc(LANGUAGES[c].course||LANGUAGES[c].name)} · ${esc(LANGUAGES[c].level||"")}</option>`).join("")
    +UPCOMING.map(u=>`<option disabled>${esc(u.label)} · ${esc(u.level||"")} (kommer ${esc(u.note||"senare")})</option>`).join("");
  sel.onchange=()=>useLang(sel.value);
  wireOwnWord();
  let saved=null; try{saved=localStorage.getItem(LANG_KEY)}catch(e){}
  const only=onlyCourse();
  if(codes.includes(only)){ saved=only; setOnly(only); }
  useLang(codes.includes(saved)?saved:codes[0]);
  cloudInit();
})();
