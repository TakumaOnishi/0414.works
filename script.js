let pos = [
  {'y':-0.9, 'x':-1.3, 'r':0.9}, // Kachera
  {'y':-1.2, 'x':0.2, 'r':1}, // SPACE
  {'y':-2.3, 'x':0.7, 'r':0.8}, // TETRIO
  {'y':2, 'x':-0.24, 'r':0.64}, // static works
  {'y':0.5, 'x':1, 'r':0.64}, // helmet
  {'y':0, 'x':1.9, 'r':0.7}, // Nagenawa
  {'y':0.8, 'x':-0.7, 'r':0.36}, // YouTube
  {'y':1, 'x':-2, 'r':0.42}, // Twitter
  {'y':1.1, 'x':-1.1, 'r':0.34}, // Instagram
  {'y':-0.22, 'x':-0.32, 'r':0.7}, // Takuma Onishi
  {'y':1.3, 'x':1.8, 'r':0.7}, // media
  {'y':-1.8, 'x':-2, 'r':0.7}, // recognition
];

window.addEventListener('DOMContentLoaded', () => {

  let height = window.innerHeight;
  let width = window.innerWidth;
  let stageX = Math.round(width * 0.5);
  let stageY = Math.round(height * 0.5);
  let layerX = stageX;
  let layerY = stageY;
  let startX, startY, tdx, tdy, lastMove, pointerDown;
  let standardR = Math.min(width * 0.7, height * 0.5);
  const stage = document.getElementById("stage");
  const hole = document.getElementsByClassName("hole");
  const image = document.getElementsByClassName("image");
  const shadow = document.getElementsByClassName("shadow");
  const layer = document.getElementById("layer");
  const caption = document.getElementsByClassName("caption");
  const sign = document.getElementsByClassName("sign");
  for(let i=0;i<image.length;i++){
    image[i].style.backgroundImage = 'url("assets/' + i + '.jpg")';
  }

  onSet();
  onUpdate();


  document.addEventListener('wheel', function(event){
    //console.log("wheel");
    let dx = event.deltaX * 0.5;
    let dy = event.deltaY * 0.5;
    stageX -= dx;
    stageY -= dy;
    layerX -= 4 * dx;
    layerY -= 4 * dy;
    onUpdate();
    event.preventDefault();
  }, {passive: false});


  document.addEventListener('pointerdown', function(event){
    console.log("pointerdown");
    pointerDown = true;
    startX = event.changedTouches[0].pageX;
    startY = event.changedTouches[0].pageY;
    tdx = 0;
    tdy = 0;
  });


  document.addEventListener('pointermove', function(event){
    console.log("pointermove");
    if(pointerDown){
      tdx = ((event.changedTouches[0].pageX - startX) * 0.5 + tdx) * 0.5;
      tdy = ((event.changedTouches[0].pageY - startY) * 0.5 + tdy) * 0.5;
      stageX += tdx;
      stageY += tdy;
      layerX += 4 * tdx;
      layerY += 4 * tdy;
      startX = event.changedTouches[0].pageX;
      startY = event.changedTouches[0].pageY;
      onUpdate();
      lastMove = Date.now();
      event.preventDefault();
    }
  }, {passive: false});
  

  document.addEventListener('pointerup', function(event){
    console.log("pointerup");
    pointerDown = false;
    if(Date.now() - lastMove < 30){
      inertia();
    }
  });

  function inertia(){
    if(0.1<=Math.abs(tdx)||0.1<=Math.abs(tdy)){
      tdx *= 0.975;
      tdy *= 0.975;
      stageX += tdx;
      stageY += tdy;
      layerX += 4 * tdx;
      layerY += 4 * tdy;
      onUpdate();
      window.requestAnimationFrame(inertia);
    }
  }
  

  window.addEventListener('resize', function(){
    let preW = width;
    let preH = height;
    let preR = standardR;
    height = window.innerHeight;
    width = window.innerWidth;
    standardR = Math.min(width * 0.7, height * 0.5);
    stageX = (stageX-preW/2)*standardR/preR + width/2;
    stageY = (stageY-preH/2)*standardR/preR + height/2;
    layerX = (layerX-preW/2)*standardR/preR + width/2;
    layerY = (layerY-preH/2)*standardR/preR + height/2;
    onSet();
    onUpdate();
  });

  

  function onSet(){
    for(let i=0;i<caption.length;i++){
      document.documentElement.style.setProperty('--h1Size', standardR * 0.16 + 'px');
      document.documentElement.style.setProperty('--pSize', standardR * 0.06 + 'px');
      if(image[i]){
        hole[i].r = pos[i].r * standardR; 
        hole[i].style.left = Math.round(pos[i].x * standardR) + "px";
        hole[i].style.top = Math.round(pos[i].y * standardR) + "px";
        hole[i].style.width = Math.round(hole[i].r) + "px";
        hole[i].style.height = Math.round(hole[i].r) + "px";
        image[i].style.width = Math.round(hole[i].r*0.984375) + "px";
        image[i].style.height = Math.round(hole[i].r*0.984375) + "px";
        image[i].style.backgroundSize = "auto " + height + "px";
        shadow[i].style.width = hole[i].r*0.984375+height/4 + "px";
        shadow[i].style.height = hole[i].r*0.984375+height/4 + "px";
        shadow[i].style.background = "radial-gradient(circle at center, #faf5f050 " + Math.round(hole[i].r*0.45) + "px, #00080faa " + Math.round(hole[i].r*0.45+standardR*0.03) + "px)";
      }else{
        let j = i-hole.length+4;
        sign[j].style.height = Math.round(standardR*0.15) + "px"
        sign[j].style.left = Math.round((pos[i].x + pos[i].r/2) * standardR) + "px";
        sign[j].style.top = Math.round((pos[i].y + pos[i].r/2)* standardR) + "px";
      }
      caption[i].style.left = Math.round(pos[i].x * standardR) * 4 + pos[i].r * standardR * 1.3 + "px"; // (0.5*4-0.5) - (1.4-1)/2
      caption[i].style.top = Math.round(pos[i].y * standardR) * 4 + pos[i].r * standardR * 1.05 + "px";
      caption[i].style.width = Math.round(pos[i].r * standardR * 1.4) + "px";
      caption[i].style.height = Math.round(pos[i].r * standardR * 1.9) + "px";
    }
    for(let i=0;i<4;i++){
      sign[i].style.width = standardR*0.5 + "px"
      sign[i].style.height = standardR*0.5 + "px"
      sign[i].style.left = Math.round((Math.abs(i-1)-0.975)*standardR*1.5) + "px";
      sign[i].style.top = Math.round(-(Math.abs(i-2)-1.05)*standardR*1.5) + "px";
    }
  }

  function onUpdate(){
    stage.style.transform = "translate(" + Math.round(stageX) + "px, " + Math.round(stageY) + "px)"; // 原点＝消失点
    layer.style.transform = "translate(" + Math.round(layerX) + "px, " + Math.round(layerY) + "px)";
    for(let i=0;i<image.length;i++){
      let currentX = Math.round(stageX) - Math.round(width * 0.5) + Math.round(pos[i].x * standardR);
      let currentY = Math.round(stageY) - Math.round(height * 0.5) + Math.round(pos[i].y * standardR);
      image[i].style.left = Math.round(-currentX*0.015625) + "px";
      image[i].style.top = Math.round(-currentY*0.015625) + "px";
      image[i].style.backgroundPositionX = -currentX-Math.round(-currentX*0.015625)-Math.round(height*0.8) + "px"; // 0.8 ≈ (819/512)/2
      image[i].style.backgroundPositionY = -currentY-Math.round(-currentY*0.015625)-Math.round(height*0.5) + "px";
      shadow[i].style.backgroundPositionX = Math.round(-height/8-currentX*0.05-height*0.02) + "px";
      shadow[i].style.backgroundPositionY = Math.round(-height/8-currentY*0.05) + "px";
    }
  }
});