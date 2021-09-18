let cursorPointer;
class Cursor {
  constructor(){
    this.r = 10;
    this.pos = new p5.Vector(width / 2, height / 2);
    
    // draging box
    this.isDragging = false;
    this.dragStart = null;
    this.dragEnd = null;
  }
  
  mousePressed(){
    
  }

  mouseDragged(){
    this.isDragging = true;
    if(this.dragStart == null){
      this.dragStart = new p5.Vector(
        this.pos.x, this.pos.y
      );
    }
    this.dragEnd = new p5.Vector(mouseX, mouseY);
  }

  mouseReleased(){
    this.isDragging = false;
    this.dragStart = null;
    this.dragEnd = null;
  }

  getBounds(){
    let invertx = false;
    let inverty = false;
    let sx = this.dragStart.x;
    let sy = this.dragStart.y;
    let w;
    let h;

    // default is from top left to bottom right

    // dragged from top right to bottom left
    if(sx > this.dragEnd.x && sy < this.dragEnd.y){
      sx = this.dragEnd.x;
      invertx = true;
    }

    // dragged from bottom left to top right
    if(sx < this.dragEnd.x && sy > this.dragEnd.y){
      sy = this.dragEnd.y;
      inverty = true;
    }

    // dragged from bottom right to top left
    if(sx > this.dragEnd.x && sy > this.dragEnd.y){
      sx = this.dragEnd.x;
      sy = this.dragEnd.y;
      invertx = true;
      inverty = true;
    }

    if(invertx) {
      w = this.dragStart.x - sx;
    } else {
      w = this.dragEnd.x - sx;
    }

    if(inverty) {
      h = this.dragStart.y - sy;
    } else {
      h = this.dragEnd.y - sy;
    }

    return {
      x: sx,
      y: sy,
      w: w,
      h: h
    };
  }
  
  select(entities){
    if(this.isDragging){
      let bounds = this.getBounds();
      
      print("X: " + bounds.x + " Y: " + bounds.y);
      print("W: " + bounds.w + " H: " + bounds.h);
      
      for(let e of entities){
        if(e.type === EntityTypes.RECT){
          e.selected = 
            (e.pos.x >= bounds.x) &&
            (e.pos.x + e.size <= bounds.x + bounds.w) &&
            (e.pos.y >= bounds.y) &&
            (e.pos.y + e.size <= bounds.y + bounds.h);
        }
      }
    }
  }
  
  update(){
    this.pos = new p5.Vector(mouseX, mouseY);
    this.show();
  }
  
  show(){
    push();
    noFill();
    stroke(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    
    fill(255, 0, 0);
    rect(this.pos.x, this.pos.y, this.r * 2, this.r / 5);
    rect(this.pos.x, this.pos.y, this.r / 5, this.r * 2);
    pop();
    
    // dragging styles
    if(this.isDragging){
      push();
      fill(0, 0, 255, 50);
      stroke(0, 0, 255);
      
      let rw = this.dragEnd.x - this.dragStart.x;
      let rh = this.dragEnd.y - this.dragStart.y;
      
      rect(
        this.dragStart.x, this.dragStart.y,
        rw, rh
      );
      
      pop();
    }
  }
}