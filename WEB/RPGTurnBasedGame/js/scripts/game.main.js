class Game {
    constructor(ww, wh){
        this.ww = ww;
        this.wh = wh;
        this.board = new Board(this.ww, this.wh);
        this.player = null;
        this.currentTurn = 0; // 0 - player
    }

    switchTurn(){
        if(this.currentTurn === 0){
            this.currentTurn = 1;
        } else {
            this.currentTurn = 0;
        }
    }

    prepareBoard(rows, cols, border=false){
        this.board.prepare(rows, cols);
        this.board.showBorder(border);
        this.preparePlayer();
    }

    prepareBoardByLevel(level, border=false){
        this.board.prepareByLevel(level);
        this.board.showBorder(border);
        this.preparePlayer(level.player.r, level.player.c);
    }

    preparePlayer(r, c){
        let def = Skeleton.getRandomClass();
        let rIndex = r || round(random(this.board.rows - 1));
        let cIndex = c || round(random(this.board.cols - 1));

        let player = new Player(rIndex, cIndex, def);

        Skeleton.updatePlayerPosition(player, this.board);

        this.player = player;
    }

    update(){
        Skeleton.updatePlayerPosition(this.player, this.board);
        Skeleton.revealBlocksBasedOnPlayer(this.player, this.board);
        Skeleton.updateControlArrows(this.player, controls.arrows);
    }

    showHUD(hud){
        hud.showPlayerDefinition(this.player);
    }

    show(){
        this.board.show();
        this.player.show();
    }
}