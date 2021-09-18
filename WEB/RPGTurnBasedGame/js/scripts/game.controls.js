class ControlArrow {
    constructor(def){
        this.def = def;
        this.pos = null;
        this.enabled = true;
        this.hovered = false;
    }

    setPosition(x, y){
        this.pos = new p5.Vector(x, y);
    }

    isMouseOver(x, y){
        return (
            x > this.pos.x &&
            x < this.pos.x + GAME_BLOCK_WIDTH &&
            y > this.pos.y &&
            y < this.pos.y + GAME_BLOCK_HEIGHT);
    }

    getCurrentImage(){
        if(this.enabled){
            if(this.hovered){
                return this.def.hoveredImage;
            } else {
                return this.def.enabledImage;
            }
        }
        return this.def.disabledImage;
    }

    show(){
        push();
        translate(this.pos.x, this.pos.y);
        image(this.getCurrentImage(), 0, 0);

        noFill();
        stroke(0);
        strokeWeight(3);
        let rw = GAME_BLOCK_WIDTH;
        let rh = GAME_BLOCK_HEIGHT;
        rect(rw / 2, rh / 2, rw, rh);
        pop();
    }
}

class Controls {
    constructor(){
        this.ww = null;
        this.wh = null;
        this.startX = null;
        this.startY = null;
        this.arrows = {};
    }

    prepare(){
        Skeleton.updateOffsetsPositions(this);
    }

    setArrows(arrows){
        for(let k of Object.keys(arrows)){
            this.arrows[k] = new ControlArrow(arrows[k]);
        }

        this.prepare();
    }

    update(){
        if(!Skeleton.isObjectEmpty(this.arrows)){
            for(let k of Object.keys(this.arrows)){
                let arrow = this.arrows[k];

                if(arrow.enabled){
                    arrow.hovered = arrow.isMouseOver(mouseX, mouseY);
                }
            }
        }
    }

    show(){
        if(!Skeleton.isObjectEmpty(this.arrows)){
            for(let k of Object.keys(this.arrows)){
                this.arrows[k].show();
            }
        }
    }
}