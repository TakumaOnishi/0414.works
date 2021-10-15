let R = 0;
let I = 0;
let pos = 0;
let dy = 0;
let pdy = 0;
let scrolling = 0;
let ay = 0;
let img = [];
let capt = [];
let hole = [];
let info = [];
let moved = false;
let touching = false;
info[0] = ['','','','','','','255','255','255','','0'];//[10]は -0.15 ~ 0.15 まで
info[1] = ['Kachera','IQ puzzle','1','3 days +','kachera',"https://kachera.wixsite.com/2020",'250','245','245',"https://twitter.com/search?q=%23kachera&src=hashtag_click",'0.03'];
info[2] = ['SPACE','3D riddle','1 +','2 hours +','0414space',"https://0414.works/space",'110','115','120',"https://twitter.com/search?q=%230414space&src=hashtag_click",'-0.05'];
info[3] = ['TETRIO','game','1,2','30 minutes +','テトリオ',"https://0414.works/tetrio",'120','115','110',"https://twitter.com/search?q=%23%E3%83%86%E3%83%88%E3%83%AA%E3%82%AA&src=hashtag_click",'0.1'];
info[4] = ['archive','static works','','','',"https://ima.goo.ne.jp/column/article/9229.html",'120','120','120','','0'];
info[5] = ['','','','','',"https://twitter.com/IlllIlllIlIlIll",'100','105','110'];

function preload(){
  for(let i=0;i<info.length;i++){
    img[i] = loadImage('assets/'+i+'.jpg');
    if(i != 0){
      capt[i] = loadImage('assets/'+i+'.PNG');
    }
  }
}

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  if(width * 0.7 < height / 2){
    R = width * 0.7;
  }else{
    R = height/2;
  }
  pos = -height-R/2;
  I = Math.round((height+R)/2);

  for(let i=0;i<info.length;i++){
    img[i].resize(Math.round(height/4+height/4*Math.sign(info.length-1-i)), height);
    if(i < info.length-1){
      hole[i] = createImage(Math.round(Math.max(height/2, R*1.2)), Math.round(Math.max(height/2, R*1.2)));
      if(i != 0){
        capt[i].resize(Math.ceil(I*0.4072727), Math.ceil(I*0.16));
      }
    }else{
      hole[i] = createImage(Math.round(Math.max(height*0.325, R*0.6)), Math.round(Math.max(height*0.325, R*0.6)));
      capt[i].resize(Math.ceil(I*0.04), Math.ceil(I*0.04));
    }
    hole[i].loadPixels();
    for (let x = 0; x < hole[i].width; x++) {
      for (let y = 0; y < hole[i].height; y++) {
        let dist = (R*(0.3+0.3*Math.sign(info.length-1-i))-Math.sqrt(Math.pow(x-hole[i].width/2,2)+Math.pow(y-hole[i].height/2,2))-2)*10/R; // 中心からの距離でグラデ
        if(dist < 0){
          hole[i].set(x, y, color(200));
        }else if(1 < dist){
          if(dist < 1.05){
            hole[i].set(x, y, color(info[i][6],info[i][7],info[i][8],(1.05-dist)*5100));
          }else{
            hole[i].set(x, y, color(0,0));
          }
        }else{
          hole[i].set(x, y, lerpColor(color(info[i][6],info[i][7],info[i][8]), color(200), Math.sqrt(1-Math.pow(dist,2))));
        }
      }
    }
    hole[i].updatePixels();
  }

  //frameRate(60)
  noStroke();
}

function draw(){
  
  //noLoop();

  if(Math.round(ay)){
    if(pos*2 < -height){//ページ上限を超えたとき
      pos += Math.ceil(ay*(I+height+pos*2)/I);//スクロール量が減衰
    }else if(-height+I*(info.length-1) < pos){//ページ下限を超えたとき
      pos += Math.floor(ay*(I-pos-height+I*(info.length-1))/I);//スクロール量が減衰
    }else{
      pos += Math.round(ay);
    }
    ay *= 15/16;
    //loop();
  }
  
  if(!touching){
    if(pos*2 < -height){//ページ上限を超えたとき
      pos += Math.ceil((-height-2*pos)/16);//定位置に戻される
      //loop();
    }else if(-height+I*(info.length-1) < pos){//ページ下限を超えたとき
      pos += Math.floor((-height+I*(info.length-1)-pos)/8);//定位置に戻される
      //loop();
    }
  }

  background(200);

  for(let i=0;i<info.length-1;i++){　// 大
    let sy = Math.ceil(i*I-pos-height/4);
    let ey = Math.floor(i*I-pos+height/4);
    if(sy-Math.ceil(R/10)<height && 0<ey+Math.floor(R/10)){
      if(sy<height && 0<ey){
        imageMode(CORNERS);
        image(img[i],
              Math.floor(width/2-height/4+info[i][10]*width), Math.max(sy,0), Math.ceil(width/2+height/4+info[i][10]*width), Math.min(ey,height),
              0, Math.max(sy,0), height/2, Math.min(ey,height)-Math.max(sy,0));
      }
      imageMode(CENTER);
      image(hole[i], Math.round(width/2+info[i][10]*width), Math.round(i*I-pos));
    }
  }
  let l = info.length-1; //　小
  let sy = Math.ceil(l*I-pos-R/2);
  let ey = Math.floor(l*I-pos);
  if(sy-Math.ceil(R/10)<height && 0<ey+Math.ceil(R/10)){
    if(sy<height && 0<ey){
      imageMode(CORNERS);
      image(img[l],
            Math.floor(width/2), Math.max(sy,0), Math.ceil(width/2+height/4), Math.min(ey,height),
            0, Math.max(sy,0), height/4, Math.min(ey,height)-Math.max(sy,0));
    }
    imageMode(CENTER);
    image(hole[l], Math.round(width/2+R/4), Math.round(l*I-pos-R/4));
  }
  
  imageMode(CORNER);
  for(let i=1;i<info.length-1;i++){
    image(capt[i], Math.round(width/2+info[i][10]*width-I*0.203636), Math.round(I*(i+0.06)+R/2)-pos); // ?
  }
  image(capt[info.length-1], Math.ceil(width/2-R/10), Math.ceil(I*(l-0.02)-pos-R/4)); // ?
}

function windowResized(){
  let pR = R;
  resizeCanvas(window.innerWidth, window.innerHeight);
  if(width * 0.7 < height / 2){
    R = width * 0.7
  }else{
    R = height / 2
  }
  pos *= R/pR;
  I = Math.round((height+R)/2);

  for(let i=0;i<info.length;i++){
    img[i].resize(Math.round(height/4+height/4*Math.sign(info.length-1-i)), height);
    if(i < info.length-1){
      hole[i].resize(Math.round(Math.max(height/2, R*1.2)), Math.round(Math.max(height/2, R*1.2)));
      if(i != 0){
        capt[i].resize(Math.ceil(I*0.4072727), Math.ceil(I*0.16));
      }
    }else{
      hole[i].resize(Math.round(Math.max(height*0.325, R*0.6)), Math.round(Math.max(height*0.325, R*0.6)));
      capt[i].resize(Math.ceil(I*0.04), Math.ceil(I*0.04));
    }
  }
  //loop();
}

function mouseClicked(){
  for(let i=1;i<info.length;i++){
    if(i<info.length-1 && pow(width/2+info[i][10]*width - mouseX,2) + pow(i*I-pos - mouseY,2) < pow(R/2, 2)){
      link(info[i][5],"_new");
      break;
    }else if(i==info.length-1 && pow(width/2+R/4 - mouseX,2) + pow(i*I-pos-R/4 - mouseY,2) < pow(R/5, 2)){
      link(info[i][5],"_new");
      break;
    }else if(i<info.length-2 && abs(width/2+info[i][10]*width+R/7-mouseX)<R/7 && abs(-pos+I*(i+0.21)+R/2-mouseY)<I/40){
      link(info[i][9],"_new");
      break;
    }
  }
  //loop();
}

function mouseWheel(event){
  pdy = dy;
  dy = event.delta;
  if(pos*2 < -height){ // ページ上限を超えたとき
    pos += Math.ceil(dy*(I+height+pos*2)/I); // スクロール量が減衰
  }else if(-height+I*(info.length-1) < pos){ // ページ下限を超えたとき
    pos += Math.floor(dy*(I-pos-height+I*(info.length-1))/I); // スクロール量が減衰
  }else{
    pos += Math.round(dy);
  }
  cursor(ARROW);
  for(let i=1;i<info.length;i++){
    if(i<info.length-1 && pow(width/2+info[i][10]*width - mouseX,2) + pow(i*I-pos - mouseY,2) < pow(R/2, 2)){ // hole
      cursor(HAND);
      break;
    }else if(i == info.length-1 && pow(width/2+R/4 - mouseX,2) + pow(i*I-pos-R/4 - mouseY,2) < pow(R/5, 2)){ // 小hole
      cursor(HAND);
      break;
    }else if(i<info.length-2 && abs(width/2+info[i][10]*width+R/7-mouseX)<R/7 && abs(-pos+I*(i+0.21)+R/2-mouseY)<I/40){ // hashtag
      cursor(HAND);
      break;
    }
  }
  //loop();
  return false;
}

function mouseMoved() {
  cursor(ARROW);
  for(let i=1;i<info.length;i++){
    if(i<info.length-1 && pow(width/2+info[i][10]*width - mouseX,2) + pow(i*I-pos - mouseY,2) < pow(R/2, 2)){ // hole
      cursor(HAND);
      break;
    }else if(i == info.length-1 && pow(width/2+R/4 - mouseX,2) + pow(i*I-pos-R/4 - mouseY,2) < pow(R/5, 2)){ // 小hole
      cursor(HAND);
      break;
    }else if(i<info.length-2 && abs(width/2+info[i][10]*width+R/7-mouseX)<R/7 && abs(-pos+I*(i+0.21)+R/2-mouseY)<I/40){ // hashtag
      cursor(HAND);
      break;
    }
  }
}

function touchStarted() {
  ay = 0;
  dy = 0;
  pdy = mouseY;
  moved = false;
  touching = true;
  return false;
}

function touchMoved() {
  dy = pdy - mouseY;
  pdy = mouseY;
  if(pos*2 < -height){ // ページ上限を超えたとき
    pos += Math.ceil(dy*(I+height+pos*2)/I); // スクロール量が減衰
  }else if(-height+I*(info.length-1) < pos){ // ページ下限を超えたとき
    pos += Math.floor(dy*(I-pos-height+I*(info.length-1))/I); // スクロール量が減衰
  }else{
    pos += Math.round(dy);
  }
  if(!moved){
    moved = true;
  }
  //loop();
  return false;
}

function touchEnded() {
  if(!moved){
    mouseClicked();
  }
  touching = false;
  ay = Math.round(dy);
  //loop();
  return false;
}

function link(url, winName, options){
  winName && open(url, winName, options) || (location = url);
}