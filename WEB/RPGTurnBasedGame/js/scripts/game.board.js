class Board {
    constructor(ww, wh){
        this.ww = ww;
        this.wh = wh;
        this.rows = null;
        this.cols = null;
        this.startX = null;//round((this.ww - GAME_BOARD_WIDTH) / 2);
        this.startY = null;//round((this.wh - GAME_BOARD_HEIGHT) / 2);
        this.grid = null;
        this.border = true;
    }

    showBorder(b){
        this.border = b;
    }

    prepare(rows, cols){
        this.rows = rows;
        this.cols = cols;

        this.grid = this.createDefaultGrid(this.rows, this.cols);

        Skeleton.updateOffsetsPositions(this);
    }

    prepareByLevel(level){
        this.rows = level.grid.length;
        this.cols = level.grid[0].length;

        this.grid = this.createGridByLevelGrid(level.grid);

        Skeleton.updateOffsetsPositions(this);
    }

    createDefaultGrid(rows, cols){
        let grid = new Array(rows);
        for(let r = 0; r < rows; r++){
            grid[r] = new Array(cols);
            for(let c = 0; c < cols; c++){
                let def = Skeleton.getRandomBlock();
                grid[r][c] = new Block(r, c, def);
            }
        }
        return grid;
    }

    createGridByLevelGrid(grid){
        let newGrid = new Array(grid.length);
        for(let r = 0; r < grid.length; r++){
            newGrid[r] = new Array(grid[r].length);
            for(let c = 0; c < grid[r].length; c++){
                let def = Skeleton.getBlockById(grid[r][c]);
                newGrid[r][c] = new Block(r, c, def);
            }
        }
        return newGrid;
    }

    show(){
        // SHOW BOARD
        if(this.border){
            push();
            translate(width / 2, height / 2);
            stroke(0);
            strokeWeight(GAME_BOARD_BORDER);
            rect(0, 0, GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
            pop();
        }

        // SHOW BLOCKS
        for(let row of this.grid){
            for(let block of row){
                block.show();
            }
        }
    }
}