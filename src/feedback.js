/* ---------- Tyck till: eleven skriver önskemål, vad som är krångligt eller vad som är fel ----------
   Meddelandena sparas i feedback/<uid>-<tid> i artefaktens db. Claude läser dem med ArtifactData, för in dem i
   docs/BACKLOG.md och skriver status och svar (fälten status och reply) i samma dokument. Eleven ser dem här.
   Utan inloggning sparas meddelandet bara i den här webbläsaren (S.feedback). */
const FB_KINDS={wish:"Önskemål",hard:"Krångligt",bug:"Något är fel",other:"Annat"};
const FB_STATUS={ny:"Skickat, inte läst än",last:"Läst",backlogg:"Tillagt i backloggen",byggt:"Byggt",nej:"Inte just nu"};
const TT={kind:"wish",text:"",mine:null};

async function loadTyckTill(){
  if(!CLOUD.db||!CLOUD.uid) return (S.feedback||[]).slice();
  try{
    const s=await CLOUD.db.collection("feedback").where("uid","==",CLOUD.uid).get();
    return s.docs.map(d=>({id:d.id,...d.data()}));
  }catch(e){ return (S.feedback||[]).slice(); }
}

async function renderTyckTill(){
  curView="fb";
  const cloud=!!(CLOUD.db&&CLOUD.uid);
  app.innerHTML=`<section class="panel"><h2>Tyck till</h2>
    <p class="plan">Vad vill du kunna göra i appen? Vad är krångligt eller fel? Skriv hur du vill. Den som bygger appen läser allt, och önskemålen förs in i planen för vad som byggs härnäst. Här ser du sedan vad som hände med det du skrev.</p>
    <div class="field"><span class="label">Det gäller</span>
      <div class="seg" role="group" aria-label="Typ">${Object.entries(FB_KINDS).map(([k,n])=>`<button data-fbk="${k}" aria-pressed="${TT.kind===k}">${n}</button>`).join("")}</div></div>
    <textarea class="answer-in fbtext" id="fbtext" rows="5" maxlength="2000" placeholder="Till exempel: Jag skulle vilja kunna öva på …">${esc(TT.text)}</textarea>
    <button class="btn" id="fbsend">Skicka</button>
    <p class="foot" id="fbmsg">${cloud?"":"Du är inte inloggad, så meddelandet sparas bara i den här webbläsaren."}</p>
  </section>
  <section class="panel"><h2>Det du har skrivit</h2><div id="fblist"><p class="plan">Hämtar …</p></div></section>`;
  app.querySelectorAll("[data-fbk]").forEach(b=>b.onclick=()=>{TT.kind=b.dataset.fbk;
    app.querySelectorAll("[data-fbk]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  $("#fbtext").oninput=e=>{TT.text=e.target.value};
  $("#fbsend").onclick=sendTyckTill;
  showTyckTill();
}

async function showTyckTill(){
  const list=(await loadTyckTill()).sort((a,b)=>(b.t||0)-(a.t||0));
  const box=$("#fblist"); if(curView!=="fb"||!box) return;
  box.innerHTML=list.length?`<ul class="fblist">${list.map(f=>`<li>
      <div class="meta"><span class="label">${esc(FB_KINDS[f.kind]||"Annat")} · ${new Date(f.t).toLocaleDateString("sv-SE")}${f.course?` · ${esc(f.course)}`:""}</span>
        <span class="fbst fb-${esc(f.status||"ny")}">${esc(FB_STATUS[f.status]||FB_STATUS.ny)}</span></div>
      <p>${esc(f.text)}</p>${f.reply?`<p class="fbreply"><b>Svar:</b> ${esc(f.reply)}</p>`:""}</li>`).join("")}</ul>`
    :`<p class="plan">Inget än.</p>`;
}

async function sendTyckTill(){
  const text=TT.text.trim(), btn=$("#fbsend"), msg=$("#fbmsg");
  if(!text){ msg.textContent="Skriv något först."; $("#fbtext").focus(); return; }
  btn.disabled=true; btn.textContent="Skickar …";
  const f={kind:TT.kind,text:text.slice(0,2000),lang:L.code,course:L.course||L.name,t:Date.now(),status:"ny",reply:""};
  let ok=false;
  if(CLOUD.db&&CLOUD.uid){ try{ await CLOUD.db.doc(`feedback/${CLOUD.uid}-${f.t}`).set({...f,uid:CLOUD.uid}); ok=true; }catch(e){} }
  if(!ok){ S.feedback=(S.feedback||[]).slice(-49); S.feedback.push(f); save(); }
  TT.text=""; $("#fbtext").value="";
  btn.disabled=false; btn.textContent="Skicka";
  msg.textContent=ok?"Tack! Meddelandet är skickat.":"Meddelandet är sparat i den här webbläsaren, men kunde inte skickas. Öppna appen inloggad på claude.ai och skicka igen.";
  showTyckTill();
}
