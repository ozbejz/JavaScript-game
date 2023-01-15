let lives = 3;
let score = 0;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2; // pozicija zoge
let y = canvas.height-30;
var ballRadius = 10;

let bx = canvas.width/2;
let by = canvas.height-20;

let dx = 3;
let dy = -3;

let brickRowCount = localStorage.getItem('brickRowCount');
let brickColumnCount = 11;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let highScore = localStorage.getItem('highScore');

// dobi kontrole is localstorage, ko je keyboard input, preveri ce je prava koda, plosca se premika dokler je pritisnjen
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let desno;
let levo;

function keyDownHandler(e) {
  desno = localStorage.getItem('desno');
  levo = localStorage.getItem('levo');
    if(e.code == desno) {
        rightPressed = true;
    }
    else if(e.code == levo) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.code == desno) {
        rightPressed = false;
    }
    else if(e.code == levo) {
        leftPressed = false;
    }
}

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawB() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if(bricks[c][r].status == 1){
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        }
      }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "rgb(194, 79, 26)";
    ctx.fill();
    ctx.closePath();
    
    /* preveri, ce se dotika roba canvasa */
    if(x > canvas.width-ballRadius || x < ballRadius) {
        dx = -dx;
    }
    if(y > canvas.height-ballRadius || y < ballRadius) {
        dy = -dy;
    }

    else if(y + dy > canvas.height-10-ballRadius) {
        if(x > bx && x < bx + 100) {
            dy = -dy;
        }
        else{
            x = canvas.width/2;
            y = canvas.height-30;
            bx = canvas.width/2;
            by = canvas.height-20;
            lives--;
            if(!lives){
              // ko je konec igre preveri ce je to highscore, nato resetira igro
                if(score > highScore){
                  highScore = score;
                  localStorage.setItem('highScore', score);
                }
                alert("GAME OVER");
                lives=3;
                score = 0;
                for (let c = 0; c < brickColumnCount; c++) {
                  bricks[c] = [];
                  for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 };
                  }
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            dy = -dy;
        }
    }
}

function draw() {
    document.getElementById("counter").innerHTML="lives: " + lives;
    document.getElementById("score").innerHTML="score: " + score;
    document.getElementById("highScore").innerHTML="high score: " + highScore;
    document.getElementById("tezavnost").innerHTML="tezavnost: " + localStorage.getItem("tezavnost");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBlock();
    drawB();
    collisionDetection();
    updateBlock();
    x += dx;
    y += dy;
}

function drawBlock(){
    ctx.beginPath();
    ctx.rect(bx,by,100,10);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function updateBlock(){
  // dokler drzimo tipko za levo/desno se premika plosca
  if(rightPressed) {
    bx += 7;
    if (bx + 100 > canvas.width){
        bx = canvas.width - 100;
    }
  }
  else if(leftPressed) {
      bx -= 7;
      if (bx < 0){
          bx = 0;
      }
  }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            /* ce se dotakne bloka, zoga spremeni smer, blok dobi status 0, ga ne narise vec na zaslon, poveca se score */
            dy = -dy;
            b.status = 0;
            score++;
            /* ce je score enak stevilu blokov, je igralec zmagal */
            if(score == brickRowCount*brickColumnCount) {
              if(score > highScore){
                highScore = score;
                localStorage.setItem('highScore', score);
              }
              alert("game over!");
              x = canvas.width/2; // pozicija zoge
              y = canvas.height-30;
              lives=3;
                score = 0;
                for (let c = 0; c < brickColumnCount; c++) {
                  bricks[c] = [];
                  for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 };
                  }
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        }
      }
    }
}

let playCount = 0; // da uporabnik ne more spammat
function play(){
  canvas.style = "border: 1px solid black; background-color: rgb(214, 202, 228);";
  playCount++;
  if(playCount < 2)
    setInterval(draw, 10);
}

/* ne dela, ce klicem funkcijo v igra.html */
function setDefaults(){
  if(localStorage.getItem('desno') === null){
    localStorage.setItem('levo', 'ArrowLeft');
    localStorage.setItem('desno', 'ArrowRight');
    localStorage.setItem('brickRowCount', 3);
    localStorage.setItem('highScore', 0);
    localStorage.setItem('tezavnost', 'normalna');
    
  }
}


// gumbom se doda event listener, ce je pritisnjen, caka na vhod tipkovnice(za kontrole) dokler ne pritisnemo kaj drugega
function settings(){
  document.getElementById("desno").addEventListener('click', ()=>{
    setInterval(setDesno, 10);
  })
  document.getElementById("levo").addEventListener('click', ()=>{
    setInterval(setLevo, 10);
  })
  document.getElementById("reset").addEventListener('click', ()=>{
    localStorage.clear();
    setDefaults();
  })
  document.getElementById("tezavnostL").addEventListener('click', ()=>{
    localStorage.setItem('brickRowCount', 2);
    localStorage.setItem('tezavnost', 'lahka');
  })
  document.getElementById("tezavnostT").addEventListener('click', ()=>{
    localStorage.setItem('brickRowCount', 4);
    localStorage.setItem('tezavnost', 'tezka');
  })
}

function setDesno(){
  document.addEventListener('keydown', (e)=>{
    let code = e.code;
    localStorage.setItem('desno', code);
    document.location.reload();
  })
}

function setLevo(){
  document.addEventListener('keydown', (e)=>{
    let code = e.code;
    localStorage.setItem('levo', code);
    document.location.reload();
  })
}