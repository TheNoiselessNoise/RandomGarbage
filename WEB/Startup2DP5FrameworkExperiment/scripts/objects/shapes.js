class BasicShape {
    constructor(){
        this.pos = new p5.Vector();
        this.image = null;
        this.useImageSize = true; // if false, w and h will be used for image instead
        this.color = color(255, 0, 0); // used, when no image is defined
        this.viewWrapMode = ViewWrapModes.DESTROY_WRAP;
        this.moveSpeed = 0;
    }

    setPosition(vector){
        this.pos = vector;
        return this;
    }

    setImage(img){
        this.image = img;
        return this;
    }

    setUseImageSize(bool){
        this.useImageSize = bool;
        return this;
    }

    setColor(c){
        this.color = c;
        return this;
    }

    setViewWrapMode(mode){
        this.viewWrapMode = mode;
        return this;
    }

    setMoveSpeed(ms){
        this.moveSpeed = ms;
        return this;
    }

    updateBasic(){
        fw.getCurrentView().checkViewWrapMode(this.viewWrapMode, this);
    }

    move4D(){
        if(fw.isKeyPressed("W")){
            this.pos.add(new p5.Vector(0, -this.moveSpeed));
        } else if(fw.isKeyPressed("A")){
            this.pos.add(new p5.Vector(-this.moveSpeed, 0));
        } else if(fw.isKeyPressed("S")){
            this.pos.add(new p5.Vector(0, this.moveSpeed));
        } else if(fw.isKeyPressed("D")){
            this.pos.add(new p5.Vector(this.moveSpeed, 0));
        }
    }

    move8D(){
        if(fw.isKeyPressed("W") && fw.isKeyPressed("A")) {
            this.pos.add(new p5.Vector(-this.moveSpeed, -this.moveSpeed));
        } else if(fw.isKeyPressed("A") && fw.isKeyPressed("S")) {
            this.pos.add(new p5.Vector(-this.moveSpeed, this.moveSpeed));
        } else if(fw.isKeyPressed("S") && fw.isKeyPressed("D")) {
            this.pos.add(new p5.Vector(this.moveSpeed, this.moveSpeed));
        } else if(fw.isKeyPressed("D") && fw.isKeyPressed("W")) {
            this.pos.add(new p5.Vector(this.moveSpeed, -this.moveSpeed));
        } else {
            this.move4D();
        }
    }
}

class Square extends BasicShape {
    constructor(){
        super();

        this.w = null;
        this.h = null;
    }

    setWidth(w){
        this.w = w;
        return this;
    }

    setHeight(h){
        this.h = h;
        return this;
    }

    showShape(){
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
}

class Circle extends BasicShape {
    constructor(){
        super();

        this.r = null;
    }

    setRadius(r){
        this.r = r;
        return this;
    }

    showShape(){
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
}