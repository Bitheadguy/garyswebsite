
(() => {
  const STORAGE_KEY="wghEasterEggsV131";
  const COMPLETED_KEY="wghEasterCompletedV131";
  const WINDOW_KEY="__WGH_EASTER_V131__";
  const totals={code:6,worm:2,scripture:4};

  function defaultFound(){ return {code:[],worm:[],scripture:[]}; }
  function defaultCompleted(){ return {code:false,worm:false,scripture:false}; }

  function safeParse(raw, fallback){
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }

  function readWindowState(){
    try{
      if(!window.name || !window.name.startsWith(WINDOW_KEY)) return null;
      return safeParse(window.name.slice(WINDOW_KEY.length), null);
    }catch{return null;}
  }

  function readLocal(key, fallback){
    try{
      const raw=localStorage.getItem(key);
      return safeParse(raw, fallback);
    }catch{return fallback;}
  }

  const windowState=readWindowState();
  let found = readLocal(STORAGE_KEY, windowState?.found || defaultFound());
  let completed = readLocal(COMPLETED_KEY, windowState?.completed || defaultCompleted());

  ["code","worm","scripture"].forEach(k=>{
    if(!Array.isArray(found[k])) found[k]=[];
    if(typeof completed[k] !== "boolean") completed[k]=false;
  });

  function persist(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(found)); }catch{}
    try{ localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed)); }catch{}
    // window.name persists as the visitor follows local file:// links in the same browser tab,
    // so local testing behaves much more like the live site.
    try{
      window.name=WINDOW_KEY + JSON.stringify({found,completed});
    }catch{}
  }
  persist();

  const modal=document.getElementById("easterModal");
  const content=document.getElementById("easterContent");
  const show=html=>{
    if(!modal||!content)return;
    content.innerHTML=html;
    modal.hidden=false;
    requestAnimationFrame(()=>modal.classList.add("show"));
  };
  const hide=()=>{
    if(!modal)return;
    modal.classList.remove("show");
    setTimeout(()=>modal.hidden=true,220);
  };
  document.getElementById("closeEaster")?.addEventListener("click",hide);
  modal?.addEventListener("click",e=>{if(e.target===modal)hide();});

  const tracker=document.getElementById("eggTracker");
  function updateTracker(){
    Object.keys(totals).forEach(section=>{
      const n=found[section].length;
      const count=document.querySelector(`[data-count="${section}"]`);
      const bar=document.querySelector(`[data-bar="${section}"]`);
      if(count) count.textContent = n===0 ? "No Easter eggs found yet" : `${n} / ${totals[section]} found`;
      if(bar) bar.style.width = n===0 ? "0%" : `${Math.min(100,n/totals[section]*100)}%`;
    });
  }
  function openTracker(){ updateTracker(); if(tracker) tracker.hidden=false; }
  document.getElementById("eggTrackerButton")?.addEventListener("click",openTracker);
  document.getElementById("closeEggTracker")?.addEventListener("click",()=>{if(tracker)tracker.hidden=true;});
  tracker?.addEventListener("click",e=>{if(e.target===tracker)tracker.hidden=true;});

  function confetti(){
    const layer=document.getElementById("confettiLayer");
    if(!layer)return;
    layer.innerHTML="";
    const glyphs=["▮","◆","●","★","■"];
    for(let i=0;i<90;i++){
      const piece=document.createElement("i");
      piece.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];
      piece.style.left=Math.random()*100+"vw";
      piece.style.animationDelay=Math.random()*.35+"s";
      piece.style.animationDuration=(1.9+Math.random()*1.8)+"s";
      piece.style.fontSize=(8+Math.random()*13)+"px";
      piece.style.setProperty("--drift",((Math.random()-.5)*180)+"px");
      layer.appendChild(piece);
    }
    setTimeout(()=>layer.innerHTML="",4200);
  }

  function celebrate(section){
    if(completed[section]) return;
    completed[section]=true;
    persist();
    confetti();
    if(localStorage.getItem("projectLaunchSound")!=="off"){
      const a=new Audio("assets/audio/celebrate.wav");
      a.volume=.45;
      a.play().catch(()=>{});
    }
    const msg=document.getElementById("completionMessage");
    if(msg){
      const sectionName = section==="code" ? "THE CODE REDEEMER" : section==="worm" ? "WORM JOKES" : "DISCOVERIES";
      msg.innerHTML=`<strong>You found them all!</strong><span>Every hidden Easter egg in ${sectionName} has been discovered.</span>`;
      msg.hidden=false;
      requestAnimationFrame(()=>msg.classList.add("show"));
      setTimeout(()=>{
        msg.classList.remove("show");
        setTimeout(()=>msg.hidden=true,300);
      },3200);
    }
  }

  function discover(section,id){
    if(!found[section].includes(id)){
      found[section].push(id);
      persist();
      updateTracker();
      if(found[section].length>=totals[section]) celebrate(section);
    }
  }

  // Homepage Easter eggs
  document.getElementById("hiddenNrCode")?.addEventListener("click",()=>{
    discover("code","nr");
    show("<p class='egg-kicker'>GENESIS 22:13</p><h2>One of many hidden references.</h2><p>NR-GN22-13 points beneath the surface.</p>");
  });

  document.getElementById("differentSquare")?.addEventListener("click",()=>{
    discover("code","square");
    show("<h2>Yes, this square is different.</h2><p>You notice stuff like that too, huh?</p>");
  });

  // Code Redeemer page Easter eggs
  document.getElementById("valeCross")?.addEventListener("click",()=>{
    discover("code","vale");
    show("<h2>Dr. Stephen Vale</h2>");
  });

  const term=document.getElementById("hiddenTerminal");
  const response=document.getElementById("terminalResponse");
  term?.addEventListener("keydown",e=>{
    if(e.key!=="Enter") return;
    const v=term.value.trim();
    if(v.toLowerCase()==="son"){
      discover("code","son");
      if(response) response.textContent="ADONAI";
    }else if(response){
      response.textContent="NO MATCH";
    }
    term.value="";
  });

  document.getElementById("tier7Link")?.addEventListener("click",()=>{
    discover("code","tier7");
    show("<p class='egg-kicker'>ACCESS DENIED</p><h2>TOP SECRET SECURITY CLEARANCE REQUIRED.</h2><p>Unauthorized access attempt logged.</p>");
    setTimeout(hide,3200);
  });

  // Worm
  const hole=document.getElementById("wormHole");
  const secret=document.getElementById("wormSecret");
  hole?.addEventListener("click",()=>{
    discover("worm","worm-hole");
    if(!secret)return;
    secret.hidden=false;
    hole.classList.add("found");
    secret.classList.add("show");
  });

  // Discoveries page
  const ref=document.getElementById("scriptureToggle");
  ref?.addEventListener("click",()=>{
    discover("scripture","leviticus");
    ref.textContent = ref.textContent.trim()==="Leviticus 16:8" ? "Leviticus 14:4–7" : "Leviticus 16:8";
  });

  document.getElementById("johnHexEgg")?.addEventListener("click",()=>{
    discover("scripture","hex");
    show("<h2>JOHN 3:16</h2><p>Decoded from ASCII hexadecimal.</p>");
  });

  document.getElementById("finalDiscovery")?.addEventListener("click",()=>{
    discover("scripture","final");
    show("<h2>You looked beneath the surface.</h2><p>I knew someone would find it.</p>");
  });

  document.querySelector(".easter-hint")?.addEventListener("click",()=>{
    discover("scripture","hint");
    show("<h2>Hidden in plain sight.</h2><p>Sometimes noticing is the whole point.</p>");
  });

  // LUCI: appears in a dedicated box so it never sits on top of page text.
  // It counts only if the visitor actually clicks it.
  const whisper=document.getElementById("luciWhisper");
  if(whisper){
    whisper.setAttribute("role","button");
    whisper.setAttribute("tabindex","0");
    const activate=()=>{
      discover("code","luci");
      whisper.classList.add("acknowledged");
      setTimeout(()=>whisper.classList.remove("appear"),250);
    };
    whisper.addEventListener("click",activate);
    whisper.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});
    setTimeout(()=>{
      whisper.classList.add("appear");
      setTimeout(()=>whisper.classList.remove("appear"),5200);
    },6500+Math.random()*3500);
  }


  // Wormy page playful interactions
  const finished=document.getElementById("finishedLaughing");
  finished?.addEventListener("click",()=>{
    discover("worm","finished-laughing");
    finished.textContent="HA!";
    setTimeout(()=>finished.textContent="Finished laughing?",3000);
  });

  const wrongHole=document.getElementById("wrongWormHole");
  const wormFun=document.getElementById("wormFunMessage");
  wrongHole?.addEventListener("click",()=>{
    if(!wormFun)return;
    wormFun.textContent="WRONG HOLE. TRY AGAIN!";
    wormFun.classList.add("show");
    setTimeout(()=>{wormFun.classList.remove("show");wormFun.textContent="";},2800);
  });

  document.getElementById("sunEgg")?.addEventListener("click",()=>{
    if(!wormFun)return;
    wormFun.textContent="HAVE A SUN SHINY DAY!";
    wormFun.classList.add("show","sunny");
    setTimeout(()=>{wormFun.classList.remove("show","sunny");wormFun.textContent="";},3000);
  });

  const grid=document.querySelector(".cartoon-grid");
  const rotationMessage=document.getElementById("rotationMessage");
  let rotationClicks=0;

  function rotateCards(dir){
    if(!grid)return;
    const cards=[...grid.querySelectorAll(".worm-card-interactive")];
    if(cards.length!==4)return;

    // Visual positions in the 2x2 gallery:
    // 0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right
    // Clockwise path: TL -> TR -> BR -> BL -> TL
    const order = dir==="cw"
      ? [cards[2], cards[0], cards[3], cards[1]]
      : [cards[1], cards[3], cards[0], cards[2]];

    order.forEach(c=>grid.appendChild(c));

    rotationClicks++;
    grid.classList.remove("grid-shuffle");
    void grid.offsetWidth;
    grid.classList.add("grid-shuffle");

    if(rotationClicks===12 && rotationMessage){
      rotationMessage.textContent="You're still doing this?";
      rotationMessage.classList.add("show");
      setTimeout(()=>rotationMessage.classList.remove("show"),3000);
    }
  }
  // The controls belong to the POSITIONS, not to a particular cartoon.
  // Whatever cartoon is currently top-right rotates the gallery clockwise.
  // Whatever cartoon is currently top-left rotates it counterclockwise.
  grid?.addEventListener("click",(event)=>{
    const clicked=event.target.closest(".worm-card-interactive");
    if(!clicked || !grid.contains(clicked)) return;

    const cards=[...grid.querySelectorAll(".worm-card-interactive")];
    const position=cards.indexOf(clicked);

    if(position===1){
      rotateCards("cw");       // current top-right
    }else if(position===0){
      rotateCards("ccw");      // current top-left
    }
  });

  updateTracker();
})();
