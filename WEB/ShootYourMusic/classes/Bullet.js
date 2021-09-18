class BulletDisplayType {
  static get ELLIPSE(){ return 2; }
  static get RECT(){ return 3; }
}

class BulletBehavior {
  static get FOLLOW(){ return 1; }
  static get STRAIGHT(){ return 2; }
}

class BulletType {
  static get BASIC(){ return {
    damage: 10,
    firerate: 5,
    delay: 1,
    display: {
      object: BulletDisplayType.ELLIPSE,
      w: 10,
      h: 5
    },
    color: color(0, 255, 0)
  }}
  
  static get SQUARE(){ return {
    damage: 25,
    firerate: 7,
    delay: 3,
    display: {
      object: BulletDisplayType.RECT,
      w: 10,
      h: 10
    },
    color: color(0, 255, 0)
  }}
}

class Bullet {
  constructor(pos, type = BulletType.BASIC, borderType=BorderType.DESTROY_OUT, target = null){
    this.startPos = pos;
    this.pos = this.startPos;
    this.type = type;
    this.acc = new p5.Vector();
    this.mou = target;
    this.borderType = borderType;

    if(this.mou != null){
      this.mou.sub(this.pos);
      this.mou.setMag(0.5);
      this.acc = this.mou;
      this.acc.mult(10);
    }
  }

  hasBeenHit(b){
    let hasBeen = false;
    if (b instanceof Bullet) {
      if (this.type.display.object === BulletDisplayType.RECT) {
        if (b.type.display.object === BulletDisplayType.RECT) {
          hasBeen = p5collideRectRect(
              this.pos.x, this.pos.y, this.type.display.w, this.type.display.h,
              b.pos.x, b.pos.y, b.type.display.w, b.type.display.h
          );
        } else if (b.type.display.object === BulletDisplayType.ELLIPSE) {
          hasBeen = p5collideRectCircle(
              this.pos.x, this.pos.y, this.type.display.w, this.type.display.h,
              b.pos.x, b.pos.y, b.type.display.w
          );
        }
      } else if (this.type.display.object === EnemyDisplayType.ELLIPSE) {
        if (b.type.display.object === BulletDisplayType.RECT) {
          hasBeen = p5collideRectCircle(
              b.pos.x, b.pos.y, b.type.display.w, b.type.display.h,
              this.pos.x, this.pos.y, this.type.display.w
          );
        } else if (b.type.display.object === BulletDisplayType.ELLIPSE) {
          hasBeen = p5collideCircleCircle(
              this.pos.x, this.pos.y, this.type.display.w,
              b.pos.x, b.pos.y, b.type.display.w
          );
        }
      }
    }
    return hasBeen;
  }

  getWidth(){
    return this.type.display.w;
  }

  getHeight(){
    return this.type.display.h;
  }
  
  update(){
    if(this.mou == null){
      this.mou = new p5.Vector(mouseX, mouseY);
      this.mou.sub(this.pos);
      this.mou.setMag(0.5);
      this.acc = this.mou;
      this.acc.mult(10);
    }

    this.pos.add(this.acc);
    this.show();
  }
  
  show(){
    fill(this.type.color);
    switch(this.type.display.object){
      case BulletDisplayType.ELLIPSE:
        ellipse(this.pos.x, this.pos.y, this.type.display.w, this.type.display.h);
        break;
      case BulletDisplayType.RECT:
        rect(this.pos.x, this.pos.y, this.type.display.w, this.type.display.h);
        break;
    }
  }
}