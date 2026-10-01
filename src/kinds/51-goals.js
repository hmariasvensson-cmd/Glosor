/* ---------- Kapitlets mål ----------
   content/mal.json = [{id, sec, goals: ["Jag kan …"]}]: vad eleven ska kunna efter avsnittet, som bokens "I det här kapitlet …".
   Visas på startsidan för avsnittet man är på. Eleven bockar av det hon eller han kan (S.mal["<id>|<nr>"] = tid).
   VIKTIGT: nyckeln är målets plats i listan. Nya mål ska läggas SIST i goals, och mål får inte flyttas eller tas bort
   ur mitten (skriv hellre om texten på samma plats), annars hamnar elevens bockar på fel mål. Ändra inte id. */
const malFor=sec=>(C().mal||[]).find(m=>m.sec===sec)||(C().mal||[]).find(m=>SECTIONS.some(s=>s.id===m.sec)&&sameChapter(m.sec,sec));
function goalsPanel(){
  const sec=curSec(), m=sec&&malFor(sec); if(!m) return "";
  S.mal=S.mal||{}; const done=m.goals.filter((g,i)=>S.mal[m.id+"|"+i]).length;
  return `<section class="panel goals"><div class="meta"><span class="label">Mål · ${esc(secName(m.sec))}</span><span>${done} av ${m.goals.length}</span></div>
    <p class="plan">När du är klar med avsnittet ska du kunna det här. Bocka av det du tycker att du kan.</p>
    <ul class="goallist">${m.goals.map((g,i)=>{const on=!!S.mal[m.id+"|"+i];
      return `<li><button type="button" class="goal-ck" data-mal="${esc(m.id)}|${i}" aria-pressed="${on}"><span class="box" aria-hidden="true">${on?"✓":""}</span><span>${esc(g)}</span></button></li>`;}).join("")}</ul></section>`;
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-mal]"); if(!b) return;
  S.mal=S.mal||{}; const k=b.dataset.mal; if(S.mal[k]) delete S.mal[k]; else S.mal[k]=Date.now(); save();
  const on=!!S.mal[k]; b.setAttribute("aria-pressed",on); b.querySelector(".box").textContent=on?"✓":"";
  const p=b.closest(".goals"); if(p){ const n=p.querySelectorAll('[aria-pressed="true"]').length, t=p.querySelectorAll("[data-mal]").length; p.querySelector(".meta span:last-child").textContent=`${n} av ${t}`; }});
