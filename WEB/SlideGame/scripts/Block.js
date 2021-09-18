class BasicBlock {
    constructor(i, j, w, h){
        this.rowIndex = i;
        this.colIndex = j;
        this.w = w;
        this.h = h;
        this.x = this.colIndex * this.w;
        this.y = this.rowIndex * this.h;
        
        this.type = BlockType.PATH
    }
    
    move(direction){
        if(direction === "UP"){
            this.rowIndex--
        } else if(direction === "LEFT"){
            this.colIndex--
        } else if(direction === "DOWN"){
            this.rowIndex++
        } else if(direction === "RIGHT"){
            this.colIndex++
        }
    }

    getNextBlock(direction){
        if(direction === "UP"){
            return map.getBlock(this.rowIndex - 1, this.colIndex)
        } else if(direction === "LEFT"){
            return map.getBlock(this.rowIndex, this.colIndex - 1)
        } else if(direction === "DOWN"){
            return map.getBlock(this.rowIndex + 1, this.colIndex)
        } else if(direction === "RIGHT"){
            return map.getBlock(this.rowIndex, this.colIndex + 1)
        }
    }

    isPlayerOn(){
        return map.player.rowIndex === this.rowIndex && map.player.colIndex === this.colIndex
    }

    canMove(direction){
        return !this.atCorner(direction) && this.canStepOnBlock(direction)
    }
    
    atCorner(SIDE){
        if(SIDE === "UP"){
            return this.rowIndex === 0
        } else if(SIDE === "LEFT"){
            return this.colIndex === 0
        } else if(SIDE === "DOWN"){
            return this.rowIndex === map.rows - 1
        } else if(SIDE === "RIGHT"){
            return this.colIndex === map.cols - 1
        }
    }

    aiMovement(full = false){
        let directions = ["UP", "LEFT", "DOWN", "RIGHT"];

        if(this.atCorner("UP") && this.atCorner("LEFT")){
            directions = ["DOWN", "RIGHT"]
        } else if(this.atCorner("UP") && this.atCorner("RIGHT")){
            directions = ["DOWN", "LEFT"]
        } else if(this.atCorner("DOWN") && this.atCorner("LEFT")){
            directions = ["UP", "RIGHT"]
        } else if(this.atCorner("DOWN") && this.atCorner("RIGHT")){
            directions = ["UP", "LEFT"]
        } else if(this.atCorner("UP")){
            directions = ["LEFT", "DOWN", "RIGHT"]
        } else if(this.atCorner("LEFT")){
            directions = ["UP", "DOWN", "RIGHT"]
        } else if(this.atCorner("DOWN")){
            directions = ["LEFT", "UP", "RIGHT"]
        } else if(this.atCorner("RIGHT")){
            directions = ["LEFT", "DOWN", "UP"]
        } else {
            directions = ["UP", "LEFT", "DOWN", "RIGHT"]
        }

        let dir = directions[round(random(directions.length - 1))];

        if(full){
            while(this.canMove(dir)){
                this.move(dir);
                if(Map.blockIsType(this, BlockType.ENEMY)){
                    if(this.isPlayerOn()){
                        map.reset()
                    }
                }
            }
        } else {
            if(this.canMove(dir)){  
                this.move(dir);
                if(Map.blockIsType(this, BlockType.ENEMY)){
                    if(this.isPlayerOn()){
                        map.reset()
                    }
                }
            }
        }
    }
    
    canStepOnBlock(direction){
        try {
            if(direction === "UP"){
                return map.grid[this.rowIndex - 1][this.colIndex].type.stepable
            } else if(direction === "LEFT"){
                return map.grid[this.rowIndex][this.colIndex - 1].type.stepable
            } else if(direction === "DOWN"){
                return map.grid[this.rowIndex + 1][this.colIndex].type.stepable
            } else if(direction === "RIGHT"){
                return map.grid[this.rowIndex][this.colIndex + 1].type.stepable
            }
        } catch(e) {
            return false
        }
    }

    update(){
        // update position
        this.x = this.colIndex * this.w;
        this.y = this.rowIndex * this.h
    }
}

class Block extends BasicBlock {
    constructor(i, j, w, h){
        super(i, j, w, h)
    }
    
    show(minimalistic = false){
        if(Map.blockIsType(this, BlockType.PATH) || Map.blockIsType(this, BlockType.EMPTY)){
            image(images.PATH, this.x, this.y, this.w, this.h)
        } else if(Map.blockIsType(this, BlockType.WALL)){
            image(images.WALL, this.x, this.y, this.w, this.h)
        } else if(Map.blockIsType(this, BlockType.STEPPED)){
            image(images.STEPPED, this.x, this.y, this.w, this.h)
        } else if(Map.blockIsType(this, BlockType.ENEMY)){
            image(images.ENEMY, this.x, this.y, this.w, this.h)
        } else if(Map.blockIsType(this, BlockType.TRAP)){
            fill(this.type.color);
            rect(this.x, this.y, this.w, this.h);
            if(this.opened){
                image(images.TRAP_OPENED, this.x, this.y, this.w, this.h)
            } else {
                image(images.TRAP_CLOSED, this.x, this.y, this.w, this.h)
            }
        } else {
            if(minimalistic){
                // fill(BlockType.PATH.color)
                image(images.PATH, this.x, this.y, this.w, this.h);
                if(Map.blockIsType(this, BlockType.KEY)){
                    fill(this.type.color);
                    rect(this.x + this.w / 4, 
                        this.y + this.h / 4, 
                        this.w / 2, 
                        this.h / 2)
                }

                if(Map.blockIsType(this, BlockType.DOOR)){
                    if(!this.type.stepable){
                        fill(this.type.color);
                        rect(this.x + this.w / 4, 
                            this.y, 
                            this.w / 2, 
                            this.h)
                    }
                }
            } else {
                if(this.type.color instanceof p5.Color){
                    fill(this.type.color)
                } else {
                    fill(this.type.color[0], this.type.color[1], this.type.color[2])
                }
                rect(this.x, this.y, this.w, this.h)
            }
        }

        if(minimalistic){
            if(this.type.color instanceof p5.Color){
                fill(this.type.color)
            } else {
                fill(this.type.color[0], this.type.color[1], this.type.color[2])
            }

            if(Map.blockIsType(this, BlockType.SWITCH)){
                image(
                    images.SWITCH,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else if(Map.blockIsType(this, BlockType.RESET)){
                image(
                    images.RESET,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else if(Map.blockIsType(this, BlockType.TELEPORT)){
                image(
                    images.TELEPORT,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else if(Map.blockIsType(this, BlockType.TRAMPOLIN)){
                image(
                    images.TRAMPOLIN,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else if(Map.blockIsType(this, BlockType.DOOR)){
                if(this.type.stepable){
                    image(
                        images.DOOR_UNLOCKED,
                        this.x + this.w / 4, 
                        this.y, 
                        this.w / 2, 
                        this.h)
                } else {
                    image(
                        images.DOOR_LOCKED,
                        this.x + this.w / 4, 
                        this.y, 
                        this.w / 2, 
                        this.h)
                }
            } else if(Map.blockIsType(this, BlockType.KEY)){
                image(
                    images.KEY,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else if(Map.blockIsType(this, BlockType.FINISH)){
                image(
                    images.FINISH,
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2)
            } else {
                rect(
                    this.x + this.w / 4, 
                    this.y + this.h / 4, 
                    this.w / 2, 
                    this.h / 2
                )
            }
        }

        fill(0);
        textSize(32);
        text(this.type.text, this.x + (this.w / 2.4), this.y + (this.h / 1.75))
    }
}