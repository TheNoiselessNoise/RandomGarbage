let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  noCursor();

  cursorPointer = new Cursor();
  entities.push(new BasicEntity(width / 2, height / 2));
  entities.push(new BasicEntity(200, 150));
}

function draw() {
  background(220);

  for (let entity of entities) {
    entity.update();
  }
  
  cursorPointer.update();
}

function mousePressed(e){
  cursorPointer.mousePressed();
}

function mouseDragged() {
  cursorPointer.mouseDragged();
  cursorPointer.select(entities);
}

function mouseReleased() {
  cursorPointer.mouseReleased();
}

