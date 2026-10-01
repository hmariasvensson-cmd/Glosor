/* ---------- Veckans äkta ljud ----------
   Ett kort med länkar till riktiga nyheter i långsam takt, för kurser på rätt nivå. Visas på Tala-sidan och under
   Hörförståelse (bara länkar som öppnas i en ny flik, inget inbäddat, inget sparas). Källorna per språk (lemmaLang,
   de två första bokstäverna i tts) och lägsta steg (universitetskurser räknas som stepAs, annars 7):
     fr  RFI "Journal en français facile" (B1), från steg 4
     de  DW "Langsam gesprochene Nachrichten" (B1–B2), från steg 5
     it  News in Slow Italian (nybörjare/mellannivå), från steg 4 (ingen stabil källa från RAI hittades 2026-10-01)
   URL:erna kontrollerades 2026-10-01. Veckans tips (hur man lyssnar) byts varje måndag. */
const REAL_AUDIO={
  fr:{min:4,name:"Journal en français facile",by:"RFI",url:"https://francaisfacile.rfi.fr/fr/podcasts/journal-en-fran%C3%A7ais-facile/",
    what:"Dagens nyheter på tio minuter, läst långsamt och tydligt. Hela texten finns under varje avsnitt."},
  de:{min:5,name:"Langsam gesprochene Nachrichten",by:"DW",url:"https://learngerman.dw.com/de/langsam-gesprochene-nachrichten/s-60040332",
    what:"Dagens nyheter från Deutsche Welle, lästa långsamt. Texten finns bredvid ljudet."},
  it:{min:4,name:"News in Slow Italian",by:"News in Slow Italian",url:"https://www.newsinslowitalian.com/home/news/beginner",
    what:"Veckans nyheter på italienska i långsam takt, med texten att läsa samtidigt."}
};
const REAL_AUDIO_TIPS=[
  "Lyssna en gång utan texten och försök säga vad nyheten handlar om. Lyssna sedan igen och läs samtidigt.",
  "Välj en nyhet och skriv ner fem ord du inte kunde. Lägg till dem i Mina ord.",
  "Skugga: pausa efter en mening och säg den högt, med samma rytm.",
  "Lyssna på samma nyhet två dagar i rad. Märker du hur mycket mer du förstår andra gången?"
];
const courseStepNum=()=>L.step==="U"?(+L.stepAs||7):(+L.step||0);
const realAudio=()=>{ const s=REAL_AUDIO[lemmaLang()]; return s&&courseStepNum()>=s.min?s:null; };
function realAudioPanel(){
  const s=realAudio(); if(!s) return "";
  const tip=REAL_AUDIO_TIPS[Math.round(weekStart(Date.now())/(7*DAY))%REAL_AUDIO_TIPS.length];
  return `<section class="panel" id="realaudio"><span class="tab">Veckans äkta ljud</span><h2>${esc(s.name)}</h2>
    <p class="plan">${esc(s.what)}</p>
    <p class="foot"><b>Veckans tips:</b> ${esc(tip)}</p>
    <a class="btn ghost" href="${esc(s.url)}" target="_blank" rel="noopener">Öppna ${esc(s.by)} i en ny flik</a></section>`;
}
