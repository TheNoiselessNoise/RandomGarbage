let entities = [];

class EntityTypes {
  static get RECT(){ return 1; }
}

class BasicEntity {
  constructor(x, y, speed = 5, type = EntityTypes.RECT){
    this.size = 25;
    this.pos = new p5.Vector(x, y);
    this.speed = speed;
    this.type = type;
    this.selected = false;
  }
  
  update(){
    this.show();
  }
  
  show(){
    push();
    
    if(this.selected){
      fill(0, 255, 0);
      rect(this.pos.x - 5, this.pos.y - 5, this.size + 10, this.size + 10);
    }
    
    fill(120, 0, 120);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    
    
    pop();
  }
}