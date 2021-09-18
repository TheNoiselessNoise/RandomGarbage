class Cell {
	constructor(i, j, spos, w, h){
		this.i = i;
		this.j = j;
		this.resize(spos, w, h);
		this.value = '';
		this.mouseover = false;
		this.winner = false;
	}

	resize(spos, w, h){
		this.spos = spos;
		this.w = w;
		this.h = h;

		this.x = this.spos.x + (this.w * this.i);
		this.y = this.spos.y + (this.h * this.j);
	}

	isEmpty(){
		return this.value === '';
	}

	update(x, y){
		this.mouseover = x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}

	show(startPos, w, h){
		stroke(0);

		if(this.value !== ''){
			fill(0);
		} else {
			if(this.mouseover){
				fill(120, 120, 255);
			} else {
				fill(120);
			}
		}

		if(this.winner){
			fill(255, 215, 0);
		}

		rect(this.x, this.y, this.w, this.h);

		if(this.value !== ''){
			fill(255);
			textAlign(CENTER, CENTER);
			textSize(windowWidth / windowHeight * 75);
			text(this.value, this.x + (this.w / 2), this.y + (this.h / 2));
		}
	}
}

class TicTacToe {
	constructor(pw=3, ph=3, currentPlayer=true, twoPlayers=false){
		// how many cells for X and Y
		this.pw = pw;
		this.ph = ph;
		this.resize();
		this.grid = this.genGrid(this.pw, this.ph);

		this.twoPlayers = twoPlayers; // two humanoid players
		this.currentPlayer = currentPlayer; // true - me, false - computer/second player
		this.playerLetters = ["X", "O"];
		this.finished = false;
		this.winner = null;

		this.used_pos = [];
	}

	resize(){
		this.w = width / 2; // width of TicTacToe
		this.h = height / 2; // height of TicTacToe
		this.cw = this.w / this.pw; // width of cell
		this.ch = this.h / this.ph; // height of cell
		this.pos = createVector(
			width / 2 - this.w / 2, // starting pos x
			height / 2 - this.h / 2 // starting pos y
		);

		if(this.grid !== undefined){
			for(let row of this.grid){
				for(let cell of row){
					cell.resize(this.pos, this.cw, this.ch);
				}
			}
		}
	}

	is_grid_filled(){
		for(let row of this.grid){
			for(let cell of row){
				if(cell.isEmpty()){
					return false;
				}
			}
		}

		return true;
	}

	show_winner(a, w){
		this.finished = true;
		for(let x of a){
			this.grid[x[0]][x[1]].winner = true;
		}
		this.winner = w;
	}

	click(cell){
		if(!cell.isEmpty()){
			return;
		}

		let currentValue = this.currentPlayer ? this.playerLetters[0] : this.playerLetters[1];
		cell.value = currentValue;
		this.used_pos.push([cell.i, cell.j]);

		for(let i = 0; i < this.pw; i++){
			let breakFlag = false;
			// cols
			let used = [];
			for(let j = 0; j < this.ph; j++){
				if(this.grid[i][j].value !== currentValue){
					break;
				}
				used.push([i, j]);

				if(j === this.ph - 1){
					breakFlag = true;
					this.show_winner(used, currentValue);
				}
			}

			// rows
			used = [];
			for(let j = 0; j < this.ph; j++){
				if(this.grid[j][i].value !== currentValue){
					break;
				}
				used.push([j, i]);

				if(j === this.ph - 1){
					breakFlag = true;
					this.show_winner(used, currentValue);
				}
			}

			if(breakFlag){
				break;
			}
		}

		// diagnoals
		let used_diag = [];
		for(let j = 0; j < this.ph; j++){
			if(this.grid[j][j].value !== currentValue){
				break;
			}
			used_diag.push([j, j]);

			if(j === this.ph - 1){
				this.show_winner(used_diag, currentValue);
			}
		}

		// 2,0 1,1, 0,2
		used_diag = [];
		for(let j = 0; j < this.ph; j++){
			if(this.grid[j][(this.ph-1)-j].value !== currentValue){
				break;
			}
			used_diag.push([j, (this.ph-1)-j]);

			if(j === this.ph - 1){
				this.show_winner(used_diag, currentValue);
			}
		}

		this.currentPlayer = !this.currentPlayer;

		if(!this.finished && !this.twoPlayers){
			this.make_random_move(this.currentPlayer);
			this.currentPlayer = !this.currentPlayer;
		}
	}

	make_random_move(player){
		console.log("COMPUTER IS: " + player);
		let i = round(random(0, this.pw-1));
		let j = round(random(0, this.ph-1));

		let cell = this.grid[i][j];
		if(cell.isEmpty()){
			let currentValue = this.player ? this.playerLetters[0] : this.playerLetters[1];
			cell.value = currentValue;
		} else {
			this.make_random_move(player);
		}
	}

	genGrid(x, y){
		let a = [];
		for(let ix = 0; ix < x; ix++){
			a.push([]);
			for(let iy = 0; iy < y; iy++){
				a[ix].push(new Cell(ix, iy, this.pos, this.cw, this.ch));
			}
		}
		return a;
	}

	update(x, y){
		if(!this.finished){
			for(let row of this.grid){
				for(let cell of row){
					cell.update(x, y);
				}
			}
		}
	}

	reset(){
		this.grid = this.genGrid(this.pw, this.ph);
		this.finished = false;	
		this.winner = null;
		this.used_pos = [];
	}

	show(){
		fill(200, 200, 200);
		stroke(0);

		for(let row of this.grid){
			for(let cell of row){
				cell.show(this.pos, this.cw, this.ch);
			}
		}


		let ty = this.pos.y - 100;
		let tx = this.pos.x + this.w / 2;
		let currentValue = this.currentPlayer ? this.playerLetters[0] : this.playerLetters[1];
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(windowWidth / windowHeight * 25);
		
		if(this.winner === null){
			text("CURRENT PLAYER: " + currentValue, tx, ty);
		} else {
			text("WINNER IS: " + this.winner, tx, ty);
		}
	}
}

let ttt;
let resetBtn;
function setup() {
	createCanvas(windowWidth, windowHeight);
	ttt = new TicTacToe(3, 3);
	resetBtn = createButton("RESET");
	resetBtn.position(windowWidth / 2, windowHeight / 1.25);
	resetBtn.mousePressed(ttt.reset.bind(ttt));
}

function draw() {
	background(50);
	ttt.update(mouseX, mouseY);
	ttt.show();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	ttt.resize();
}

function mousePressed(){
	for(let row of ttt.grid){
		for(let cell of row){
			if(cell.mouseover){
				ttt.click(cell);
			}
		}
	}
}
