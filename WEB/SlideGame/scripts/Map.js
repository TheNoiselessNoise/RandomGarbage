/// <reference path="./p5.global-mode.d.ts" />

class Map {
    constructor(level = null){
        this.rows = null;
        this.cols = null;
        this.bw = round(width / this.cols);
        this.bh = round(height / this.rows);
        
        this.grid = null;
        this.player = null;
        
        // variables needed for Levels object ----------------
        this.levelName = "";
        // this.currentLevel = Levels.LIST.length - 1
        this.currentLevel = level || 0; //0
        this.playerFill = true;
        this.enemies = [];
        this.steppedBlocksStepable = false;
        this.createMap()
    }
    
    static blockIsType(block, type){
        return block.type.id === type.id
    }
    
    getBlock(row, col){
        return this.grid[row][col]
    }
    
    static getBlockType(block){
        return block.type
    }
    
    static setBlockType(block, type){
        block.type = type
    }
    
    placePlayer(r = null, c = null){
        if(r != null && c != null){
            if(this.playerFill){
                let block_type = BlockType.STEPPED;
                block_type.stepable = this.steppedBlocksStepable;
                Map.setBlockType(this.getBlock(r, c), block_type)
            }
            return new Player(r, c, this.bw, this.bh)
        }
    }
    
    createMap(){
        this.enemies = [];

        let level = Levels.RESET;
        if(typeof this.currentLevel == "number"){
            level = eval("Levels." + Levels.LIST[this.currentLevel]);
            this.levelName = level.title + " (" + (this.currentLevel + 1) + "/" + Levels.LIST.length + ")"
        } else {
            eval("level = " + atob(this.currentLevel));
            this.levelName = level.title
        }

        this.playerFill = level.playerFill;
        this.steppedBlocksStepable = level.steppedBlocksStepable;
        
        this.rows = level.map.length;
        this.cols = level.map[0].length;
        this.bw = round(width / this.cols);
        this.bh = round(height / this.rows);

        // create ENEMIES
        if(level.enemies){
            for(let ex of level.enemies){
                let enemy = new Block(ex[0], ex[1], this.bw, this.bh);
                enemy.type = BlockType.ENEMY;
                enemy.data = [ex[2], ex[3]];
    
                this.enemies.push(enemy)
            }
        }
        
        let grid = [];
        let block_counts = {}; // block count for tracking level.data index
        for(let row = 0; row < this.rows; row++){
            grid[row] = [];
            
            for(let col = 0; col < this.cols; col++){
                grid[row][col] = new Block(row, col, this.bw, this.bh);
                
                let block_types = BlockType.LIST;
                for(let t = 0; t < block_types.length; t++){
                    let block_type = eval("BlockType." + block_types[t]);
                    if(block_type.id === level.map[row][col]){
                        if(!Object.keys(block_counts).includes(block_types[t])){
                            block_counts[block_types[t]] = 1
                        } else {
                            block_counts[block_types[t]]++
                        }

                        grid[row][col].type = block_type;

                        if(level.data && Object.keys(level.data).includes(String(block_type.id))){
                            grid[row][col]["data"] = level.data[block_type.id][block_counts[block_types[t]] - 1];

                            if(Map.blockIsType(grid[row][col], BlockType.TRAP)){
                                grid[row][col].opened = false
                            }
                        }
                    }
                }
            }
        }

        for(let row of grid){
            for(let block of row){
                // BlockType.DOOR [locked, keyRow, keyCol]
                if(Map.blockIsType(block, BlockType.DOOR)){
                    let color = [random(255), random(255), random(255)];
                    if(block.data[0]){
                        let r = block.data[1];
                        let c = block.data[2];
                        grid[r][c].type = BlockType.KEY;
                        grid[r][c].data = [block.rowIndex, block.colIndex];
                        grid[r][c].type.color = color
                    }
                    block.type.stepable = !block.data[0];
                    block.type.color = color
                }
            }
        }
        
        this.grid = grid;
        this.player = this.placePlayer(level.player[0], level.player[1])
    }

    reset(){
        this.createMap()
    }
    
    isFinished(){
        let filled = this.getBlocksOfType(BlockType.WALL).length;
        filled += this.getBlocksOfType(BlockType.RESET).length;
        filled += this.getBlocksOfType(BlockType.SWITCH).length;
        filled += this.getBlocksOfType(BlockType.TRAMPOLIN).length;
        filled += this.getBlocksOfType(BlockType.TELEPORT).length;
        filled += this.getBlocksOfType(BlockType.STEPPED).length;
        filled += this.getBlocksOfType(BlockType.EMPTY).length;
        filled += this.getBlocksOfType(BlockType.TRAP).length;
        filled += this.getBlocksOfType(BlockType.DOOR).length;
        filled += this.getBlocksOfType(BlockType.KEY).length;
        filled += this.getBlocksOfType(BlockType.TIMER).length;

        return filled === this.rows * this.cols
    }

    finish(){
        if(typeof this.currentLevel == "number"){
            this.currentLevel++;
            if(this.currentLevel >= Levels.LIST.length){
                this.currentLevel = 0;
                menu.gameStarted = false
            }
            this.createMap()
        } else {
            window.close()
        }
    }

    checkBlockAction(block){
        if(Map.blockIsType(block, BlockType.FINISH)){
            this.finish()
        }

        if(Map.blockIsType(block, BlockType.SWITCH)){
            let changed_block = null;

            if(block.data === "UP"){
                changed_block = this.getBlock(block.rowIndex - 1, block.colIndex)
            } else if(block.data === "LEFT"){
                changed_block = this.getBlock(block.rowIndex, block.colIndex - 1)
            } else if(block.data === "DOWN"){
                changed_block = this.getBlock(block.rowIndex + 1, block.colIndex)
            } else if(block.data === "RIGHT"){
                changed_block = this.getBlock(block.rowIndex, block.colIndex + 1)
            } else {
                if(block.data.length === 2){ // position
                    changed_block = this.getBlock(block.data[1], block.data[0])                    
                } else { // change block to given type
                    changed_block = this.getBlock(block.data[1], block.data[0]);
                    if(typeof block.data[2] == "string"){
                        changed_block.type = eval(block.data[2])
                    } else {
                        changed_block.type = block.data[2]
                    }
                    changed_block.data = block.data[3];
                    return true
                }
            }

            if(changed_block != null){
                Map.setBlockType(changed_block, BlockType.PATH)
            }
        }

        if(Map.blockIsType(block, BlockType.RESET)){
            for(let row of this.grid){
                for(let block of row){
                    if(Map.blockIsType(block, BlockType.STEPPED) && !block.isPlayerOn()){
                        Map.setBlockType(block, BlockType.PATH)
                    }
                }
            }
        }

        if(Map.blockIsType(block, BlockType.TRAMPOLIN)){
            let direction = block.data[0];
            let movement = block.data[1];

            if(typeof movement == "number"){ // how many
                for(let i = 0; i < movement; i++){
                    this.player.updateMove(direction)
                }
            } else { // full or not
                this.player.updateMove(direction, movement)
            }
        }
        
        if(Map.blockIsType(block, BlockType.TELEPORT)){
            let new_pos = block.data;
            this.player = this.placePlayer(new_pos[1], new_pos[0])
        }

        if(Map.blockIsType(block, BlockType.TIMER)){
            // TODO: SET TIMER TO
            let new_pos = block.data;
            this.player = this.placePlayer(new_pos[1], new_pos[0])
        }

        if(Map.blockIsType(block, BlockType.KEY)){
            let door = this.getBlock(block.data[0], block.data[1]);
            door.type.stepable = true
        }

        // -----
        if(Map.blockIsNotType(block, [
            BlockType.TRAP
        ])){
            if(this.playerFill){
                let stepped_block_type = BlockType.STEPPED;
                stepped_block_type.stepable = this.steppedBlocksStepable;
                Map.setBlockType(block, stepped_block_type)
            } else {
                if(Map.blockIsType(block, BlockType.KEY)){
                    Map.setBlockType(block, BlockType.PATH)
                }
            }
        }
    }

    checkDangerousBlocks(){
        // let currentPlayerBlock = this.getBlock(this.player.rowIndex, this.player.colIndex);

        // check enemies
        for(let enemy of this.enemies){
            if(enemy.isPlayerOn()){
                this.reset()
            }
        }

        // check TRAPS
        for(let trap of this.getBlocksOfType(BlockType.TRAP)){
            if(trap.isPlayerOn() && trap.opened){
                this.reset()
            }
        }
    }
    
    getBlocksOfType(type){
        let blocks = [];
        for(let row of this.grid){
            for(let block of row){
                if(Map.blockIsType(block, type)){
                    blocks.push(block)
                }
            }
        }
        return blocks
    }
    
    update(){
        this.player.update();
        this.player.updateAction();

        // move ENEMY blocks
        for(let enemy of this.enemies){
            if(frameCount % (enemy.data[0] * 10) === 0){
                enemy.aiMovement(enemy.data[1])
            }
            enemy.update()
        }

        // open/close TRAP blocks
        for(let trap of this.getBlocksOfType(BlockType.TRAP)){
            if(frameCount % (trap.data * 10) === 0){
                trap.opened = !trap.opened
            }
        }
        
        this.show()
    }

    static blockIsNotType(block, types){
        let isNotType = true;
        for(let type of types){
            if(Map.blockIsType(block, type)){
                isNotType = false
            }
        }
        return isNotType
    }
    
    show(){
        for(let row of this.grid){
            for(let block of row){
                block.show(Map.blockIsNotType(block, [
                    BlockType.STEPPED,
                    BlockType.WALL,
                    BlockType.PATH,
                    BlockType.EMPTY,
                    BlockType.TRAP
                ]))
            }
        }

        for(let enemy of this.enemies){
            enemy.show()
        }
        
        this.player.show();

        fill(0, 0, 0, 100);
        rect(0, 0, width, 50);

        fill(255);
        text(this.levelName, 20, 35);

        let block_count = this.rows * this.cols;
        block_count -= this.getBlocksOfType(BlockType.WALL).length;
        block_count -= this.getBlocksOfType(BlockType.RESET).length;
        block_count -= this.getBlocksOfType(BlockType.SWITCH).length;
        block_count -= this.getBlocksOfType(BlockType.TRAMPOLIN).length;
        block_count -= this.getBlocksOfType(BlockType.EMPTY).length;
        block_count -= this.getBlocksOfType(BlockType.TELEPORT).length;
        block_count -= this.getBlocksOfType(BlockType.TRAP).length;
        let filled = this.getBlocksOfType(BlockType.STEPPED).length;
        let perc = round(filled / (block_count / 100));

        if(this.playerFill){
            text(perc + "%", width - 100, 35)
        }
    }
}