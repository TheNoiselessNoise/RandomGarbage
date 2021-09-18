class EnemyDisplayType {
    static get ELLIPSE(){ return 2; }
    static get RECT(){ return 3; }
}

class EnemyShowType {
    static get BINS(){return 0;}
}

class EnemyBulletType {
    static get LASERS(){return 0;}
}

class EnemyType {
    static get BASIC(){return {
        displayType: EnemyDisplayType.RECT,
        showType: EnemyShowType.BINS,
        damage: 10,
        firerate: 10,
        health: 500,
        bulletType: EnemyBulletType.LASERS,
        inPlace: false // true - no acc, false - with acc
    }}

    static get TURRET_1(){return {
        displayType: EnemyDisplayType.ELLIPSE,
        showType: EnemyShowType.BINS,
        damage: 15,
        firerate: 12,
        health: 1000,
        bulletType: EnemyBulletType.LASERS,
        inPlace: true
    }}
}

class Enemy {
    constructor(type=EnemyType.BASIC, borderType=BorderType.WRAP){
        this.type = type;
        this.borderType = borderType;

        // temp
        this.w = 32;
        this.h = 32;

        // position
        this.pos = new p5.Vector(
            random(this.w, width - this.w),
            random(this.h, height - this.h)
        );

        let speedX = this.type.inPlace ? 0 : random(-1, 1);
        let speedY = this.type.inPlace ? 0 : random(-1, 1);
        this.acc = new p5.Vector(speedX, speedY);

        // spawning
        this.isSpawning = true;
        this.spawned = false;
        this.spawningR = round(random(50, 200));

        this.bullet = {
            interval: round(random(10, 200)),
            max: 10,
            s: []
        };
    }

    makeHitVisible(b){
        this.type.health -= b.type.damage + b.type.display.w;
    }

    hasBeenHit(b){
        if(this.isSpawning || !this.spawned){
            return false;
        }

        let hasBeen = false;
        if (b instanceof Bullet) {
            if (this.type.displayType === EnemyDisplayType.RECT) {
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
            } else if (this.type.displayType === EnemyDisplayType.ELLIPSE) {
                if (b.type.display.object === BulletDisplayType.RECT) {
                    hasBeen = p5collideRectCircle(
                        b.pos.x, b.pos.y, b.type.display.w, b.type.display.h,
                        this.pos.x, this.pos.y, this.w
                    );
                } else if (b.type.display.object === BulletDisplayType.ELLIPSE) {
                    hasBeen = p5collideCircleCircle(
                        this.pos.x, this.pos.y, this.w,
                        b.pos.x, b.pos.y, b.type.display.w
                    );
                }
            }
        }
        return hasBeen;
    }

    update(){
        if(!this.isSpawning && this.spawned) {
            if (this.bullet.s.length < this.bullet.max) {
                if (frameCount % this.bullet.interval === 0) {
                    let player = view.getPlayerObject();

                    let newBullet = new Bullet(
                        new p5.Vector(this.pos.x, this.pos.y),
                        BulletType.SQUARE,
                        BorderType.DESTROY_OUT,
                        new p5.Vector(player.pos.x, player.pos.y)
                    );
                    newBullet.type.color = color(255, 0, 0);
                    this.bullet.s.push(newBullet);
                }
            }
        }

        for(let bullet of this.bullet.s){
            bullet.update();
        }

        this.show();
    }

    show(){
        if(this.isSpawning || !this.spawned){
            push();
            stroke(255, 0, 0, 150);
            noFill();
            ellipse(this.pos.x, this.pos.y, this.spawningR * 2);
            pop();

            this.spawningR--;

            if(this.spawningR <= 1){
                this.isSpawning = false;
                this.spawned = true;
            }
            return;
        }

        switch(this.type.showType){
            case EnemyShowType.BINS:
                // 32 x 32 -> 8w or 8h
                var binCount = 8;
                var bins = getBins().splice(0, binCount).filter(x => x !== 0);

                if(bins.length) {
                    let mhealth = round(map(this.type.health, 0, 500, 0, binCount));
                    mhealth = binCount - mhealth;

                    push();
                    noStroke();
                    fill(0, 0, 255);
                    rect(this.pos.x, this.pos.y, this.w, this.h);

                    for (let i = 0; i < (bins.length - mhealth); i++) {
                        let c = getRandomColor();
                        let bHeight = round(this.h / bins.length);
                        let mWidth = map(bins[i], 0, 255, 0, this.w);
                        mWidth = round(mWidth);

                        fill(c);
                        rect(
                            this.pos.x,
                            (this.pos.y - (this.h / 2) + 2) + (bHeight * i),
                            mWidth,
                            bHeight
                        );
                    }
                    pop();
                }
        }
    }

    removeBullet(bullet){
        this.bullet.s.splice(this.bullet.s.indexOf(bullet), 1);
    }
}