class BasicPlayerSquare extends Square {
    constructor(img, x, y, w, h, mode){
        super();
        w = w || 32;
        h = h || 32;
        x = x || round(windowWidth / 2);
        y = y || round(windowHeight / 2);
        this.setPosition(new p5.Vector(x, y));
        this.setWidth(w);
        this.setHeight(h);

        if(img){
            this.setImage(img);
        }

        if(mode){
            this.setViewWrapMode(mode);
        }

        this.setMoveSpeed(10);
    }

    show(){
        if(this.image){
            rectMode(CENTER);

            if(this.useImageSize){
                image(this.image, this.pos.x, this.pos.y);
            } else {
                image(this.image, this.pos.x, this.pos.y, this.w, this.h);
            }
        } else {
            this.showShape();
        }
    }
}

class BasicPlayerCircle extends Circle {
    constructor(img, x, y, r, mode){
        super();
        r = r || 10;
        x = x || round(windowWidth / 2);
        y = y || round(windowHeight / 2);
        this.setPosition(new p5.Vector(x, y));
        this.setRadius(r);

        if(img){
            this.setImage(img);
        }

        if(mode){
            this.setViewWrapMode(mode);
        }

        this.setMoveSpeed(10);
    }

    show(){
        if(this.image){
            rectMode(CENTER);

            if(this.useImageSize){
                image(this.image, this.pos.x, this.pos.y);
            } else {
                image(this.image, this.pos.x, this.pos.y, this.r, this.r);
            }
        } else {
            this.showShape();
        }
    }
}

class Player4DirectionSquare extends BasicPlayerSquare {
    constructor() {
        super();
    }

    update() {
        this.updateBasic();
        this.move4D();
    }
}

class Player4DirectionCircle extends BasicPlayerCircle {
    constructor() {
        super();
    }

    update() {
        this.updateBasic();
        this.move4D();
    }
}

class Player8DirectionSquare extends BasicPlayerSquare {
    constructor(){
        super();
    }

    update() {
        this.updateBasic();
        this.move8D();
    }
}

class Player8DirectionCircle extends BasicPlayerCircle {
    constructor(){
        super();
    }

    update() {
        this.updateBasic();
        this.move8D();
    }
}