let ttt;
function setup() {
  createCanvas(400, 400);
  ttt = new TicTacToe(3);
  ttt.startGame();
}

function draw() {
  background(51);
  ttt.update();
  // ttt.isFinished();
}

function mousePressed(){
  ttt.mouseIsPressed();
  ttt.isFinished();
}