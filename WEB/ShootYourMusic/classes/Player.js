class PlayerTail {
  constructor(pos, w, h, c, l=null, lineTo=null){
    this.pos = pos; // position
    this.acc = new p5.Vector(
        random(-.5, .5),
        random(-.5, .5)
    ); // acceleration
    this.w = w; // width
    this.h = h; // height
    this.c = c; // color
    this.l = l; // lifespan
    this.lineTarget = lineTo;
    
    this.removed = false;
  }
  
  update(){
    if(this.l != null && this.l != 0){
      this.l--;
      if(this.l <= 0){
        this.removed = true;
      }
    }
    this.pos.add(this.acc);
    this.show();
  }
  
  show(){
    if(this.l != null){
      let c = this.c._array;
      let ml = map(this.l, 0, 255, 0, 50);
      fill(220, 220, 220, ml);
    } else {
      fill(this.c);
    }
    if(this.lineTarget != null){
      strokeWeight(3);
      stroke(0);
      line(
        this.pos.x + (this.w / 2), 
        this.pos.y + (this.h / 2), 
        this.lineTarget.pos.x + (this.lineTarget.w / 2), 
        this.lineTarget.pos.y + (this.lineTarget.h / 2)
      );
      noStroke();
    }
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }
}

class Player {
  constructor(x=width/2, y=height/2, w=30, h=30, s=0.5, borderType=BorderType.WRAP){
    this.pos = new p5.Vector(x, y);
    this.acc = new p5.Vector();
    this.borderType = borderType;
    
    this.w = w; // width
    this.h = h; // height
    this.s = s; // speed
    this.c = color(255, 0, 0); // color
    this.health = 5000;
    
    this.tail = {
      colors: {
        r: random(0, 255),
        g: random(0, 255),
        b: random(0, 255)
      },
      interval: 15,
      max: 255,
      s: [],
      lifespan: 255
    };

    this.bullet = {
      interval: 50,
      max: 9999,
      s: []
    };
  }
  
  move(){
    // w = 87, a = 65, s = 83, d = 68
    if(keyIsDown(87) && keyIsDown(65)){ // W + A
      this.acc.add(new p5.Vector(-this.s, -this.s));
    } else if(keyIsDown(65) && keyIsDown(83)){ // A + S
      this.acc.add(new p5.Vector(-this.s, this.s));
    } else if(keyIsDown(83) && keyIsDown(68)){ // S + D
      this.acc.add(new p5.Vector(this.s, this.s));
    } else if(keyIsDown(68) && keyIsDown(87)){ // D + W
      this.acc.add(new p5.Vector(this.s, -this.s));
    } else if(keyIsDown(87)){ // W
      this.acc.add(new p5.Vector(0, -this.s));
    } else if(keyIsDown(65)){ // A
      this.acc.add(new p5.Vector(-this.s, 0));
    } else if(keyIsDown(83)){ // S
      this.acc.add(new p5.Vector(0, this.s));
    } else if(keyIsDown(68)){ // D
      this.acc.add(new p5.Vector(this.s, 0));
    }
    
    this.pos.add(this.acc);
    this.acc.mult(0.88);
  }

  doLikeMusic(bins){
    let sum = getAverageFromBins();

    if(this.bullet.s.length > 0){
      let bw = map(sum, 0, 255, 10, 75);
      this.bullet.s[this.bullet.s.length - 1].type.display.w = bw;
      this.bullet.s[this.bullet.s.length - 1].type.display.h = bw;
    }

    let tw = map(sum, 0, 255, 0, 100);
    let th = map(sum, 0, 255, 0, 100);
    if(this.tail.s.length > 0){
      for(let i = 0; i < 32; i++){
        let random_tail = this.tail.s[round(random(0, this.tail.s.length - 1))];
        random_tail.w = tw;
        random_tail.h = th;
      }
    }

    let mapped = round(map(sum, 0, 255, 5, 30));
    this.bullet.interval = round(mapped / 2);
    this.tail.interval = round(mapped / 1.5);
  }
  
  updateTail(avg){
    if(this.tail.s.length < this.tail.max) {
      if (true){//frameCount % this.tail.interval === 0) {
        let tc = this.tail.colors;
        let centerPos = new p5.Vector(
            this.pos.x,
            this.pos.y
        );

        this.tail.s.push(
            new PlayerTail(
                centerPos,
                this.w,
                this.h,
                color(tc.r, tc.g, tc.b),
                255
            )
        );
        tc.r++;
      }
    } else {
      this.tail.s.shift();
    }
  }
  updateBullets(bins){
    if(mouseIsPressed && frameCount % this.bullet.interval === 0){
      let centerPos = new p5.Vector(
          this.pos.x,
          this.pos.y
      );

      let avg = getAverageFromBins(bins);
      let mapped = map(avg, 0, 255, 100, 200);
      let rand = round(random(0, round(mapped / 50)));

      for(let pad = 0; pad < rand; pad++){
        this.bullet.s.push(
          new Bullet(
            centerPos,
            BulletType.BASIC
          )
        );
      }
    }
    
    for(let bullet of this.bullet.s){
      // check if bullet is not the last one
      // let bIndex = this.bullet.s.indexOf(bullet);
      // if(bIndex !== (this.bullet.s.length - 1)){
      //   // draw a line from current bullet to bIndex + 1
      //   let next = this.bullet.s[bIndex + 1];
      //   stroke(0);
      //   strokeWeight(bullet.type.display.w);
      //   line(bullet.pos.x, bullet.pos.y, next.pos.x, next.pos.y);
      //   noStroke();
      // }

      bullet.update();
    }
  }

  makeHitVisible(b){
    this.health -= b.type.damage;
  }

  hasBeenHit(b){
    let hasBeen = false;
    if (b instanceof Bullet) {
      if (b.type.display.object === BulletDisplayType.RECT) {
        hasBeen = p5collideRectRect(
            this.pos.x, this.pos.y, this.w, this.h,
            b.pos.x, b.pos.y, b.type.display.w, b.type.display.h
        );
      } else if (b.type.display.object === BulletDisplayType.ELLIPSE) {
        hasBeen = p5collideRectCircle(
            this.pos.x, this.pos.y, this.w, this.h,
            b.pos.x, b.pos.y, b.type.display.w
        );
      }
    }
    return hasBeen;
  }
  
  update(bins){
    for(let tail of this.tail.s){
      tail.update();
      if(tail.removed){
        this.tail.s.splice(this.tail.s.indexOf(tail), 1);
      }
    }

    this.updateBullets(bins);
    this.move();
    this.show();
  }

  showHealth(){
    let mhealth = map(this.health, 0, 5000, 0, width);

    push();
    fill(255, 0, 0, 220);
    noStroke();
    rect(width / 2, 0, mhealth, 50);
    pop();
  }
  
  show(){
    fill(this.c);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }

  removeBullet(bullet){
    this.bullet.s.splice(this.bullet.s.indexOf(bullet), 1);
  }
}