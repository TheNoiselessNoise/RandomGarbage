class Block {
  constructor(rIndex, cIndex, sa, sb, m) {
    this.x = rIndex * sa;
    this.y = cIndex * sb;
    this.sa = sa;
    this.sb = sb;
    this.m = m; // measure or number of items in row

    this.picked = false;
    this.type = null; // true => player1 (X), false => player2 (O)
  }

  isMouseOver() {
    return (
      mouseX > this.x && mouseX < this.x + this.sa &&
      mouseY > this.y && mouseY < this.y + this.sb
    );
  }

  show() {
    if (this.isMouseOver() && !this.picked) {
      fill(150);
    } else {
      fill(255);
    }

    strokeWeight(5);
    stroke(0);
    rect(this.x, this.y, this.sa, this.sb);

    if (this.picked) {
      let t = this.type ? "X" : "O";
      if (this.type) {
        fill(255, 0, 0);
      } else {
        fill(0, 0, 255);
      }

      strokeWeight(3);
      textSize(floor(100 / this.m * 2));
      textAlign(CENTER, CENTER);
      text(t, this.x + (this.sa / 2), this.y + (this.sb / 2));
    }
  }
}

class TicTacToe {
  constructor(n) {
    this.n = n;
    this.blocks = [];
    this.sizeA = floor(width / this.n);
    this.sizeB = floor(height / this.n);
    this.turn = true; // true => player1 (X), false => player2 (O)
    this.finished = false;
    this.finishedType = null;
  }

  startGame() {
    let blocks = [];
    for (let r = 0; r < this.n; r++) {
      blocks.push([]);
      for (let c = 0; c < this.n; c++) {
        blocks[r][c] = new Block(
          r, c, this.sizeA, this.sizeB, this.n
        );
      }
    }
    this.blocks = blocks;
  }

  isFinished() {
    let currentGrid = [];

    for (let r = 0; r < this.blocks.length; r++) {
      currentGrid.push([]);
      for (let c = 0; c < this.blocks[r].length; c++) {
        let block = this.blocks[r][c];
        if (block.type == null) {
          currentGrid[r][c] = null;
        } else {
          currentGrid[r][c] = block.type ? 1 : -1;
        }
      }
    }

    // check cols
    for (let n = 0; n < this.n; n++) {
      this.checkFinishedArray(currentGrid[n]);
    }

    // check rows
    for (let n = 0; n < this.n; n++) {
      let rowArr = [];
      for (let x = 0; x < this.n; x++) {
        rowArr.push(currentGrid[x][n]);
      }
      this.checkFinishedArray(rowArr);
    }

    // check diagonals
    let leftDiag = [];
    for (let i = 0; i < this.n; i++) {
      leftDiag.push(currentGrid[i][i]);
    }
    this.checkFinishedArray(leftDiag);
    
    let rightDiag = [];
    for (let i = 0; i < this.n; i++) {
      rightDiag.push(currentGrid[(this.n - i - 1)][i]);
    }
    this.checkFinishedArray(rightDiag);
    
    // check if grid is full
    let gridFull = true;
    for(let i = 0; i < this.n; i++){
      for(let j = 0; j < this.n; j++){
        if(currentGrid[i][j] == null){
          gridFull = false;
        }
      }
    }
    
    if(gridFull && !this.finished){
      this.finish(null);
    }
  }

  finish(type) {
    this.finished = true;
    this.finishedType = type;
  }

  checkFinishedArray(a) {
    let c = 0;
    for (let n of a) {
      if (n != null) {
        c += n;
      }
    }
    if (c == -this.n) {
      this.finish(false);
    } else if (c == this.n) {
      this.finish(true);
    } else {
      return null;
    }
  }

  mouseIsPressed() {
    if(this.finished){
      this.finished = false;
      this.finishedType = null;
      this.startGame();
      return;
    }
    
    for (let row of this.blocks) {
      for (let block of row) {
        if (block.isMouseOver() && !block.picked) {
          block.picked = true;
          block.type = this.turn;
          this.turn = !this.turn;
        }
      }
    }
  }

  update() {
    if(!this.finished){
      for (let row of this.blocks) {
        for (let block of row) {
          block.show();
        }
      }
    } else {
      fill(0, 255, 0);
      strokeWeight(3);
      textSize(floor(75 / this.n * 2));
      textAlign(CENTER);
      
      if(this.finishedType === null){
        text(
          "IT IS A DRAW",
          width / 2,
          height / 2
        );
      } else {
        text(
          "WINNER IS: " + (this.finishedType ? "X" : "O"),
          width / 2,
          height / 2
        );
      }
      
      
      fill(0, 255, 255);
      textSize(16);
      text(
        "CLICK FOR ANOTHER ROUND",
        width / 2,
        height / 2 + 50
      );
    }
  }
}