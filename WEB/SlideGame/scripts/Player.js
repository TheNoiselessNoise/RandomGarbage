let player;
class Player extends BasicBlock {
    constructor(i, j, w, h){
        super(i, j, w, h);
        this.moveKeys = {
            w: "UP", 
            a: "LEFT", 
            s: "DOWN", 
            d: "RIGHT"
        };
        this.type = BlockType.PLAYER;
        this.tmpText = ""
    }

    updateAction(){
        let currentBlock = map.getBlock(this.rowIndex, this.colIndex);

        map.checkDangerousBlocks();
        map.checkBlockAction(currentBlock)
    }
    
    updateMove(dir, full = false){
        let direction = dir || this.moveKeys[key];

        if(full){
            // FULL MOVEMENT
            while(this.canStepOnBlock(direction)){
                if(!this.atCorner(direction)){
                    this.move(direction);
                    this.updateAction()
                }
            }
        } else {
            // STEP MOVEMENT
            if(Object.keys(this.moveKeys).includes(key)){
                if(this.canMove(direction)){
                    this.move(direction);
                    this.updateAction()
                }
            } else {
                if(key === "r"){
                    map.reset()
                }
            }
        }
    }
    
    show(){
        // fill(this.type.color)
        // rect(this.x, this.y, this.w, this.h)

        // if(map.playerFill){
        //     image(images.STEPPED, this.x, this.y, this.w, this.h)
        // } else {
        //     image(images.PATH, this.x, this.y, this.w, this.h)            
        // }

        image(
            images.PLAYER,
            // this.x + this.w / 4, 
            this.x, 
            // this.y + this.h / 4, 
            this.y, 
            // this.w / 2, 
            this.w, 
            // this.h / 2
            this.h
        );
        
        fill(0);
        text(this.tmpText, this.x + (this.w / 3), this.y + (this.h / 3))
    }
}