/* ---------- der, die, das och plural ----------
   Byggs av ordlistans substantiv (L.genderGame anger artiklarna). Pluralen räknas fram ur markeringen
   i ordlistan: der Konflikt (-e) → Konflikte, der Vorwurf (-würfe) → Vorwürfe, das Studium (Studien) → Studien.
   Sparat: S.ga[ord-id] = {g, p, last}, där g och p räknar rätt i rad för genus och plural. */
const unUml=s=>s.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u");
function pluralOf(noun,mark){
  if(mark==="-") return noun;
  if(!/^-?\p{L}+$/u.test(mark)) return null;
  const f=mark.replace(/^-/,""), fu=unUml(f), nu=unUml(noun);
  let best=-1, len=0;
  for(let i=0;i<nu.length;i++){ let k=0; while(i+k<nu.length&&k<fu.length&&nu[i+k]===fu[k]) k++;
    if(i+k===nu.length||k>=3){ if(k>len){len=k; best=i;} } }
  if(len>=3) return best===0?gcap(f):noun.slice(0,best)+f.toLowerCase();
  return mark.startsWith("-")?noun+f:null;
}
function genderNouns(){
  // Cachen gäller för den ordlista den byggdes från; rebuildWords (Mina ord) skapar en ny WORDS
  if(L._gNouns&&L._gWords===WORDS) return L._gNouns;
  L._gWords=WORDS;
  const arts=L.genderGame||{};
  L._gNouns=WORDS.filter(w=>arts[w.g]).map(w=>{
    const m=w.t.match(/^(\S+) (\p{Lu}\p{L}*)(?: \(([^)]*)\))?$/u); if(!m||m[1]!==arts[w.g]) return null;
    return {w,noun:m[2],pl:m[3]?pluralOf(m[2],m[3]):null};
  }).filter(Boolean);
  return L._gNouns;
}
const gnById=id=>genderNouns().find(n=>n.w.id===id);
function startGender(){
  S.ga=S.ga||{};
  // Ord man redan övar på först, sedan resten av kapitlet man är på
  const sec=curSec(), pool=genderNouns().filter(n=>isLearned(n.w)||n.w.sec===sec);
  const pick=pool.map(n=>({n,st:S.ga[n.w.id]||{g:0,p:0,last:0},r:Math.random()}))
    .sort((a,b)=>(a.st.g+a.st.p)-(b.st.g+b.st.p)||a.st.last-b.st.last||a.r-b.r).slice(0,10);
  const items=[];
  pick.forEach(({n,st})=>{
    items.push({k:"gen",id:"gen:"+n.w.id,ref:n.w.id,t:"mc",canType:false});
    if(n.pl) items.push({k:"plu",id:"plu:"+n.w.id,ref:n.w.id,t:st.p>=1?"type":"mc",canType:true});
  });
  $("#tabs").hidden=true; sess=null; beginQuiz("gen",shuffle(items),{againFn:["gen"],label:"der, die, das"});
}
const genMC=c=>{const n=gnById(c.ref), arts=L.genderGame;
  return{tab:"der, die, das",head:`<div class="word"><p class="q-prompt" ${lang()}>… ${esc(n.noun)}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div><p class="ex-sv">${esc(n.w.sv)}</p>`,
    ask:"Vilken artikel?",opts:["m","f","n"].map(g=>({label:arts[g],ok:g===n.w.g,lang:true})),
    explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>${genderHint(n)}`,say:n.w.t,sayOnAnswer:true}};
// Tumregler för genus som stämmer för just det här ordet
function genderHint(n){
  const rules=[[/(ung|heit|keit|schaft|ion|tät|ik|ur|ei|enz|anz)$/,"f","Ord på -ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ur, -ei, -enz och -anz är nästan alltid feminina."],
    [/(chen|lein|ment|um|nis|tum)$/,"n","Ord på -chen, -lein, -ment, -um och ofta -nis och -tum är neutrum."],
    [/(ismus|ling|or|eur|ant|ist)$/,"m","Ord på -ismus, -ling, -or, -eur, -ant och -ist är maskulina."]];
  const r=rules.find(([rx,g])=>rx.test(n.noun)&&g===n.w.g);
  const comp=!r&&genderNouns().find(o=>o!==n&&o.noun.length>=3&&n.noun.length>o.noun.length&&n.noun.endsWith(o.noun.toLowerCase())&&o.w.g===n.w.g);
  return r?`<p>${r[2]}</p>`:comp?`<p>Sammansatta ord får genus av sista delen: ${esc(comp.w.t.replace(/ \(.*\)$/,""))}.</p>`:"";
}
const pluralHead=n=>`<div class="word"><p class="q-prompt" ${lang()}>${esc(n.w.t.replace(/ \(.*\)$/,""))}</p><button class="speak" id="sp" aria-label="Läs upp">${SPK}</button></div><p class="ex-sv">${esc(n.w.sv)}</p>`;
const pluMC=c=>{const n=gnById(c.ref), b=n.noun, uml=b.replace(/([aou])([^aou]*)$/i,(m,v,r)=>({a:"ä",o:"ö",u:"ü",A:"Ä",O:"Ö",U:"Ü"}[v]+r));
  const wrong=[...new Set([b+"e",b+"en",b+"n",b+"er",b+"s",uml+"e",uml+"er",b])].filter(x=>x!==n.pl);
  return{tab:"Plural",head:pluralHead(n),ask:"Hur ser pluralen ut?",
    opts:shuffle([{label:"die "+n.pl,ok:true,lang:true},...shuffle(wrong).slice(0,3).map(x=>({label:"die "+x,ok:false,lang:true}))]),
    explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>`,say:"die "+n.pl,sayOnAnswer:true}};
const pluType=c=>{const n=gnById(c.ref);
  return{tab:"Plural",head:pluralHead(n),ask:"Skriv pluralen.",placeholder:"die …",accents:L.accents,
    check:v=>{const x=gnorm(v).replace(/^die /,""); return {r:!x?"empty":x===n.pl.toLowerCase()?"right":"wrong"};},
    answer:"die "+n.pl,explain:`<p class="ex-t" ${lang()}>${esc(n.w.t)}</p>`,say:"die "+n.pl}};
const gaAdd=(ref,k,ok)=>{S.ga=S.ga||{}; const x=S.ga[ref]||{g:0,p:0}; x[k]=ok?x[k]+1:0; x.last=Date.now(); S.ga[ref]=x;};
const genRecap=ref=>{const n=gnById(ref); return n?n.w.t:"";};
defineKind("gen",{name:"der, die, das",mc:genMC,restore:ref=>gnById(ref)?{}:null,effect:(ref,ok)=>gaAdd(ref,"g",ok),recap:genRecap,
  open:startGender,again:startGender});
// Pluralfrågorna kommer bara i samma runda som der/die/das (startGender)
defineKind("plu",{name:"Plural",mc:pluMC,type:pluType,restore:ref=>{const n=gnById(ref); return n&&n.pl?{}:null;},
  effect:(ref,ok)=>gaAdd(ref,"p",ok),recap:genRecap});
