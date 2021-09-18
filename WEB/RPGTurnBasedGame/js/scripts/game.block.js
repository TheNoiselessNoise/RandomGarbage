class Block {
    constructor(rIndex, cIndex, def){
        this.r = rIndex;
        this.c = cIndex;
        this.def = def;
        this.pos = null;
    }

    setPosition(x, y){
        this.pos = new p5.Vector(x, y);
    }

    show(){

        if(this.def.id === 0){
            push();
            translate(this.pos.x, this.pos.y);
            fill(GAME_BACKGROUND);
            noStroke();
            rect(GAME_BLOCK_WIDTH / 2, GAME_BLOCK_HEIGHT / 2, GAME_BLOCK_WIDTH, GAME_BLOCK_HEIGHT);
            pop();
        }

        if(this.def.revealed){
            image(this.def.image, this.pos.x, this.pos.y);
        } else {
            image(UNREVEALED_BLOCK, this.pos.x, this.pos.y);
        }
    }
}