class BorderType {
  static get CLOSED(){ return 1; } // borders of windows are closed
  static get DESTROY_OUT(){ return 2; } // destroy when out of bounds
  static get WRAP(){ return 3; } // if x < 0, x = width ...
}

class View {
  constructor(id, objects = []){
    this.id = id;
    this.objects = objects;

    this.options = {
      maxEnemies: 10
    };
  }
  
  borderTypeObject(obj){
    if(obj instanceof Player || obj instanceof Enemy){
        for(let bullet of obj.bullet.s){
          let bw = bullet.getWidth();
          let bh = bullet.getHeight();

          switch(bullet.borderType){
            case BorderType.CLOSED:
              if(bullet.pos.x < 0){ bullet.pos.x = 0; }
              if(bullet.pos.x > width){ bullet.pos.x = width; }
              if(bullet.pos.y < 0){ bullet.pos.y = 0; }
              if(bullet.pos.y > height){ bullet.pos.y = height; }
              break;
            case BorderType.DESTROY_OUT:
              if(bullet.pos.x < -(bw / 2) || bullet.pos.x > width + (bw / 2) ||
                  bullet.pos.y < -(bw / 2) || bullet.pos.y > height + (bw / 2)){
                obj.bullet.s.splice(obj.bullet.s.indexOf(bullet), 1);
              }
              break;
            case BorderType.WRAP:
              if(bullet.pos.x < -bw){ bullet.pos.x = width; }
              if(bullet.pos.x > width){ bullet.pos.x = -bw; }
              if(bullet.pos.y < -bh){ bullet.pos.y = height; }
              if(bullet.pos.y > height){ bullet.pos.y = -bh; }
              break;
          }
        }
    }

    switch(obj.borderType){
      case BorderType.CLOSED: 
        if(obj.pos.x < 0){ obj.pos.x = 0; }
        if(obj.pos.x > width - obj.w){ obj.pos.x = width - obj.w; }
        if(obj.pos.y < 0){ obj.pos.y = 0; }
        if(obj.pos.y > height - obj.h){ obj.pos.y = height - obj.h; }
        break;
      case BorderType.DESTROY_OUT:
        if(obj.pos.x < -obj.w || obj.pos.x > width ||
           obj.pos.y < -obj.h || obj.pos.y > height){
          this.objects.splice(this.objects.indexOf(obj), 1);
        }
        break;
      case BorderType.WRAP:
        if(obj.pos.x < -obj.w){ obj.pos.x = width + (obj.w / 2); }
        if(obj.pos.x > width + (obj.w / 2)){ obj.pos.x = -obj.w; }
        if(obj.pos.y < -obj.h){ obj.pos.y = height + (obj.h / 2); }
        if(obj.pos.y > height + (obj.h / 2)){ obj.pos.y = -obj.h; }
        break;
    }
  }

  // updates player
  updatePlayer(bins){
    for(let object of this.objects){
      if(object instanceof Player){
        object.doLikeMusic(bins);
        object.update(bins);
      }
    }
  }

  updatePlayerHealth(){
    this.getPlayerObject().showHealth();
  }

  checkObjectBullets(){
    for(let obj of this.objects){
      if(obj instanceof Player){
        for(let another of this.objects){
          if(another instanceof Enemy){
            for(let anotherBullet of another.bullet.s) {
              if (obj.hasBeenHit(anotherBullet)) {
                obj.makeHitVisible(anotherBullet);
                another.removeBullet(anotherBullet);
              }
            }

            for(let bullet of obj.bullet.s){
              if(another.hasBeenHit(bullet)){
                another.makeHitVisible(bullet);
                obj.removeBullet(bullet);
              }

              for(let anotherBullet of another.bullet.s) {
                if(anotherBullet.hasBeenHit(bullet)){
                  obj.removeBullet(bullet);
                  another.removeBullet(anotherBullet);
                }
              }

            }
          }
        }
      }
    }
  }

  // updates when music BEATZ
  updateSpecial(avg){
    for(let obj of this.objects){
      if(obj instanceof Player){
        for(let i = 0; i < round(random(1, 10)); i++) {
          obj.updateTail(avg);
        }
      }
    }
  }

  // classic update function
  update(bins){
    if(!sound.isPlaying()){
      return;
    }

    this.checkObjectBullets();
    this.updatePlayer(bins);

    for(let obj of this.objects){
      this.borderTypeObject(obj);

      if(obj instanceof Player){
        if(obj.health <= 0){
          push();
          background(0);
          textSize(100);
          text("GAME OVER", width / 4, height / 2);
          noLoop();
          pop();
        }
      }

      if(obj instanceof Enemy){
        if(obj.type.health <= 0){
          this.removeObject(obj);
        }
      }

      obj.update();
    }

    this.updatePlayerHealth();
  }

  getPlayerObject(){
    for(let obj of this.objects){
      if(obj instanceof Player){
        return obj;
      }
    }
  }

  countObjects(cls){
    let c = 0;
    for(let o of this.objects){
      if(o instanceof cls){
        c++;
      }
    }
    return c;
  }

  addObject(obj){
    if(this.countObjects(Enemy) < this.options.maxEnemies){
      this.objects.push(obj);
    }
  }

  removeObject(obj){
    this.objects.splice(this.objects.indexOf(obj), 1);
  }
}