
(() => {
  const modal=document.getElementById("easterModal"),content=document.getElementById("easterContent");
  const show=html=>{if(!modal||!content)return;content.innerHTML=html;modal.hidden=false;requestAnimationFrame(()=>modal.classList.add("show"));};
  const hide=()=>{if(!modal)return;modal.classList.remove("show");setTimeout(()=>modal.hidden=true,250);};
  document.getElementById("closeEaster")?.addEventListener("click",hide);
  modal?.addEventListener("click",e=>{if(e.target===modal)hide();});
  document.getElementById("hiddenNrCode")?.addEventListener("click",()=>show("<p class='egg-kicker'>GENESIS 22:13</p><h2>One of many hidden references.</h2><p>NR-GN22-13 points beneath the surface.</p>"));
  document.getElementById("differentSquare")?.addEventListener("click",()=>show("<h2>Yes, this square is different.</h2><p>You notice stuff like that too, huh?</p>"));
  const ref=document.getElementById("scriptureToggle");
  ref?.addEventListener("click",()=>ref.textContent=ref.textContent.trim()==="Leviticus 16:8"?"Leviticus 14:4–7":"Leviticus 16:8");
  const hole=document.getElementById("wormHole"),secret=document.getElementById("wormSecret");
  hole?.addEventListener("click",()=>{if(!secret)return;secret.hidden=false;hole.classList.add("found");secret.classList.add("show");});
  document.getElementById("finalDiscovery")?.addEventListener("click",()=>show("<h2>You looked beneath the surface.</h2><p>I knew someone would find it.</p>"));
  const whisper=document.getElementById("luciWhisper");
  if(whisper){setTimeout(()=>{whisper.classList.add("appear");setTimeout(()=>whisper.classList.remove("appear"),2600);},9000+Math.random()*9000);}
})();
