class Skeleton {
    static copyObject(x){
        return Object.assign({}, x);
    }

    static isObjectEmpty(o){
        return Object.keys(o).length === 0;
    }

    static getRandomBlock(){
        return this.copyObject(BLOCKS[random(Object.keys(BLOCKS))]);
    }

    static getRandomClass(){
        return this.copyObject(CLASSES[random(Object.keys(CLASSES))]);
    }

    static isWithinBounds(val, min, max){
        return val >= min && val <= max;
    }

    static revealBlock(r, c, board=null){
        if(board === null){
            board = this.getBoard();
        }

        board.grid[r][c].def.revealed = true;
    }

    static isBlockRevealed(r, c, board=null){
        if(board === null){
            board = this.getBoard();
        }

        return board.grid[r][c].def.revealed;
    }

    static getBlockById(id){
        for(let k of Object.keys(BLOCKS)){
            if(BLOCKS[k].id === id){
                return this.copyObject(BLOCKS[k]);
            }
        }
        return null;
    }


    static getBlocksById(id, board=null){
        if(board === null){
            board = this.getBoard();
        }

        let blocks = [];
        for(let row of board.grid){
            for(let b of row){
                if(b.def.id === id){
                    blocks.push(b);
                }
            }
        }
        return blocks;
    }

    static getBlockNameById(id){
        for(let k of Object.keys(BLOCKS)){
            if(BLOCKS[k].id === id){
                return BLOCKS[k].name;
            }
        }
        return null;
    }

    static getBlockByCoords(r, c, board=null){
        if(board === null){
            board = this.getBoard();
        }

        return board.grid[r][c];
    }

    static preserveDefinitions(x){
        let o = {};

        if(x instanceof Block){
            o = x.def;
        }

        if(!(x instanceof Block) && x instanceof Object){
            o = x;
        }

        let n = {};
        
        for(let k of Object.keys(PRESERVED_DEFINITIONS)){
            if(Object.keys(o).includes(k)){
                n[k] = o[k];
            }
        }

        return n;
    }

    static changeBlockDefinition(r, c, id, preserveDefs=true, board=null){
        if(board === null){
            board = this.getBoard();
        }

        let oldBlock = this.getBlockByCoords(r, c, board);
        let oldDefs = this.preserveDefinitions(oldBlock);

        let newBlockDef = this.getBlockById(id);

        if(preserveDefs){
            for(let k of Object.keys(oldDefs)){
                newBlockDef[k] = oldDefs[k];
            }
        }

        board.grid[r][c].def = newBlockDef;
    }

    static updateOffsetsPositions(x){
        if(x instanceof Board){
            GAME_BOARD_WIDTH = GAME_BLOCK_WIDTH * x.cols;
            GAME_BOARD_HEIGHT = GAME_BLOCK_HEIGHT * x.rows;

            x.ww = windowWidth;
            x.wh = windowHeight;
            x.startX = round((x.ww - GAME_BOARD_WIDTH) / 2);
            x.startY = round((x.wh - GAME_BOARD_HEIGHT) / 2);

            // grid
            for(let row of x.grid){
                for(let b of row){
                    let imgX = x.startX + (b.c * b.def.image.width);
                    let imgY = x.startY + (b.r * b.def.image.height);
                    b.setPosition(imgX, imgY);
                }
            }
        }

        if(x instanceof Controls){
            x.ww = windowWidth;
            x.wh = windowHeight;
            x.startX = round(x.ww / 2 - (GAME_BLOCK_WIDTH * 3 / 2));
            x.startY = round(x.wh / 2 + (GAME_BOARD_HEIGHT / 2) + GAME_BOARD_BORDER);

            if(!this.isObjectEmpty(x.arrows)){
                for(let k of Object.keys(x.arrows)){
                    let kx = x.startX + (GAME_BLOCK_WIDTH * x.arrows[k].def.x);
                    let ky = x.startY + (GAME_BLOCK_HEIGHT * x.arrows[k].def.y);

                    x.arrows[k].setPosition(kx, ky);
                }
            }
        }

        if(x instanceof HUD){
            x.ww = windowWidth;
            x.wh = windowHeight;
            x.startX = round((x.ww - GAME_BOARD_WIDTH) / 2);
            x.startY = round((x.wh - GAME_BOARD_HEIGHT) / 2) - GAME_BLOCK_HEIGHT;
        }
    }

    static updateControlArrows(player, arrows, board=null){
        if(board === null){
            board = this.getBoard();
        }

        for(let k of Object.keys(arrows)){
            let arrow = arrows[k];

            if(arrow.def.rDir < 0){ // UP
                arrow.enabled = player.r !== 0;
            } else if(arrow.def.rDir > 0){ // DOWN
                arrow.enabled = player.r !== board.rows - 1;
            } else if(arrow.def.cDir < 0){ // LEFT
                arrow.enabled = player.c !== 0;
            } else if(arrow.def.cDir > 0){ // RIGHT
                arrow.enabled = player.c !== board.cols - 1;
            }

            if(player.r !== board.rows - 1 && arrow.def.rDir > 0){
                let b = this.getBlockByCoords(player.r + 1, player.c, board);
                arrow.enabled = b.def.stepable;
            } else if(player.r !== 0 && arrow.def.rDir < 0){
                let b = this.getBlockByCoords(player.r - 1, player.c, board);
                arrow.enabled = b.def.stepable;
            } else if(player.c !== board.cols - 1 && arrow.def.cDir > 0){
                let b = this.getBlockByCoords(player.r, player.c + 1, board);
                arrow.enabled = b.def.stepable;
            } else if(player.c !== 0 && arrow.def.cDir < 0){
                let b = this.getBlockByCoords(player.r, player.c - 1, board);
                arrow.enabled = b.def.stepable;
            }
        }
    }

    static getBoard(){
        if(gst_game instanceof Game && gst_game.board instanceof Board){
            return gst_game.board;
        }
        return null;
    }

    static movePlayer(player, rDir=0, cDir=0, board=null){
        if(board === null){
            board = this.getBoard();
        }

        let newR = player.r + rDir;
        let newC = player.c + cDir;

        if(this.isWithinBounds(newR, 0, board.rows - 1)){
            player.r = newR;
        }

        if(this.isWithinBounds(newC, 0, board.cols - 1)){
            player.c = newC;
        }
    }

    static movePlayerUP(player){
        this.movePlayer(player, -1);
    }

    static movePlayerDOWN(player){
        this.movePlayer(player, 1);
    }

    static movePlayerLEFT(player){
        this.movePlayer(player, 0, -1);
    }

    static movePlayerRIGHT(player){
        this.movePlayer(player, 0, 1);
    }

    static boundPlayer(player, board=null){
        if(board === null){
            board = this.getBoard();
        }

        if(player.r < 0){ this.movePlayerRIGHT(player); }
        if(player.r > board.rows - 1){ this.movePlayerLEFT(player); }
        if(player.c < 0){ this.movePlayerDOWN(player); }
        if(player.c < board.cols - 1){ this.movePlayerUP(player); }
    }

    static updatePlayerPosition(player, board=null){
        if(board === null){
            board = this.getBoard();
        }

        let imgX = board.startX + (player.c * player.def.image.width);
        let imgY = board.startY + (player.r * player.def.image.height);
        player.setPosition(imgX, imgY);
    }

    static getCurrentPlayerBlock(player, board=null){
        if(board === null){
            board = this.getBoard();
        }
        return board.grid[player.r][player.c];
    }

    static revealBlocksBasedOnPlayer(player, board=null){
        if(board === null){
            board = this.getBoard();
        }
        let upRow = player.r - 1;
        let downRow = player.r + 1;
        let leftCol = player.c - 1;
        let rightCol = player.c + 1;

        let minRows = 0;
        let maxRows = board.rows - 1;
        let minCols = 0;
        let maxCols = board.cols - 1;

        // current block which player stands on
        if(!this.isBlockRevealed(player.r, player.c, board)){
            this.revealBlock(player.r, player.c, board);
        }

        if(this.isWithinBounds(upRow, minRows, maxRows) && !this.isBlockRevealed(upRow, player.c, board)){
            this.revealBlock(upRow, player.c, board);
        }

        if(this.isWithinBounds(downRow, minRows, maxRows) && !this.isBlockRevealed(downRow, player.c, board)){
            this.revealBlock(downRow, player.c, board);
        }

        if(this.isWithinBounds(leftCol, minCols, maxCols) && !this.isBlockRevealed(player.r, leftCol, board)){
            this.revealBlock(player.r, leftCol, board);
        }

        if(this.isWithinBounds(rightCol, minCols, maxCols) && !this.isBlockRevealed(player.r, rightCol, board)){
            this.revealBlock(player.r, rightCol, board);
        }
    }
}
