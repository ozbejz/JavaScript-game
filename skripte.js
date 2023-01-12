let lives = 3;
let score = 0;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width/2; // pozicija zoge
let y = canvas.height-30;
var ballRadius = 10;

let bx = canvas.width/2;
let by = canvas.height-20;

let dx = 2;
let dy = -2;

let brickRowCount = localStorage.getItem('brickRowCount');
let brickColumnCount = 11;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let highScore = localStorage.getItem('highScore');

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
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    
    /* preveri, ce se dotika roba canvasa */
    if(x > canvas.width-ballRadius || x < ballRadius) {
        dx = -dx;
    }
    if(y > canvas.height-ballRadius || y < ballRadius) {
        dy = -dy;
    }

    else if(y + dy > canvas.height-20-ballRadius) {
        if(x > bx && x < bx + 100) {
            dy = -dy;
        }
        else{
            lives--;
            if(!lives){
              // ko je konec igre preveri, ce je to highscore, resetira igro
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBlock();
    drawB();
    collisionDetection();
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

function updateBlock(i){
  bx += i; // preprosto se poveca/pomanjsa pozicija bloka za 8, vizualno ne zgleda prevec dobro
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
              /* ne dela
              let current = localStorage.getItem('brickRowCount');
              localStorage.setItem('brickRowCount', current+1);
              brickRowCount = localStorage.getItem('brickRowCount');
              for (let c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (let r = 0; r < brickRowCount; r++) {
                  bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
              }*/
            }
          }
        }
      }
    }
}

let playCount = 0; // da uporabnik ne more spammat
function play(){
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
  }
}

/* dobi kontrole is localstorage, ce se pritisne prava tipka se premakne blok */
document.addEventListener('keydown', (event)=>{
  let desno = localStorage.getItem('desno');
  let levo = localStorage.getItem('levo');
  console.log('desno: ', desno);
  let code = event.code;
    switch(code){
        case levo:
            updateBlock(-8);
            break;
        case desno:
            updateBlock(8);
            break;
    }
})

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
  })
  document.getElementById("tezavnostT").addEventListener('click', ()=>{
    localStorage.setItem('brickRowCount', 4);
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