class Player {
    constructor(r, c, def){
        this.r = r;
        this.c = c;
        this.def = def; // class
        this.pos = null;
    }

    setPosition(x, y){
        this.pos = new p5.Vector(x, y);
    }

    show(){
        image(this.def.image, this.pos.x, this.pos.y);
    }
}