class ColorToolItem {
	constructor(x, y, c, i){
		this.x = x;
		this.y = y;
		this.color = c;
		this.selected = false;
		this.finished = false;
		this.size = 50;
		this.index = i;
	}

	mouseIsOver(){
		return (
			mouseX > this.x &&
			mouseX < this.x + this.size &&
			mouseY > this.y &&
			mouseY < this.y + this.size
		);
	}

	update(){
	}

	show() {
		if (!this.finished) {
			noStroke();
			if (!this.selected) {
				fill(255, 0, 0);
			} else {
				fill(0, 255, 0);
			}
			rect(this.x - 3, this.y - 3, this.size + 6, this.size + 6);

			fill(this.color);
			rect(this.x, this.y, this.size, this.size);

			fill(0);
			textSize(32);
			text(this.index, this.x + (this.size / 3), this.y + (this.size / 1.5));
		} else {
			fill(255, 255, 255);
			rect(this.x, this.y, this.size, this.size);
		}
	}
}

class ColorTool {
	constructor(x, y, colors){
		this.x = x;
		this.y = y;
		this.items = this.createItemsFromColors(colors);
	}

	mouseIsOver(){
		let firstItem = this.items[0];
		let lastItem = this.items[this.items.length - 1];

		return (
			mouseX > firstItem.x &&
			mouseX < firstItem.x + firstItem.size &&
			mouseY > firstItem.y &&
			mouseY < lastItem.y + lastItem.size
		);
	}

	getSelectedItem(){
		for(let item of this.items){
			if(item.selected){
				return item;
			}
		}
		return null;
	}

	createItemsFromColors(colors){
		let items = [];

		let index = 0;
		for(let c of colors){
			items.push(new ColorToolItem(this.x, this.y + (index * 50) * 1.25, c, index));
			index++;
		}

		return items;
	}

	update(){
		for(let c of this.items){
			c.update();
			c.show();
		}
	}
}

class Cell {
	constructor(r, c, size, col, cIndex){
		this.rowIndex = r;
		this.colIndex = c;
		this.size = size;
		this.cIndex = cIndex;
		this.cValues = col;
		this.color = color(this.cValues[0], this.cValues[1], this.cValues[2]);
		this.colored = false;

		this.x = this.rowIndex * this.size;
		this.y = this.colIndex * this.size;
	}

	mouseIsOver(){
		return (
			mouseX > this.x &&
			mouseX < this.x + this.size &&
			mouseY > this.y &&
			mouseY < this.y + this.size
		);
	}

	show(){
		if(this.colored){
			fill(this.color);
		} else {
			fill(120);
		}

		rect(this.x, this.y, this.size, this.size);

		if(!this.colored){
			fill(0);
			textSize(32);
			text(this.cIndex, this.x + (this.size / 2.25), this.y + (this.size / 1.75));
		}
	}
}

let grid;
class Grid {
	constructor(img){
		this.image = img;
		this.width = this.image.width;
		this.height = this.image.height;
		this.cellSize = 50;
		// this.cellSize = round((width - height) / (this.width + (this.width - this.height)) * 3);
		this.colors = this.getAllColorsFromImage(this.image); // unique colors, not duplicates
		this.pixelMap = this.createPixelMapFromImage(this.image);
		this.cellMap = this.createCellMapFromPixelMap(this.pixelMap);
		this.colorTool = new ColorTool(width - 75, 25, this.colors);
	}

	checkMousePress(){
		if(this.colorTool.mouseIsOver()){
			for(let item of this.colorTool.items){
				item.selected = item.mouseIsOver();
			}
		}
	}

	createCellMapFromPixelMap(pixelMap){
		let cellMap = [];

		for(let row = 0; row < pixelMap.length; row++){
			cellMap[row] = [];
			for(let col = 0; col < pixelMap[row].length; col++){
				let c = pixelMap[row][col];
				cellMap[row][col] = new Cell(
					row,
					col,
					this.cellSize,
					c,
					this.getIndexOfColorFromColors(this.colors, c)
				);
			}
		}

		return cellMap;
	}

	getIndexOfColorFromColors(colors, c){
		for(let i = 0; i < colors.length; i++) {
			if (colors[i][0] === c[0] &&
				colors[i][1] === c[1] &&
				colors[i][2] === c[2]) {
				return i;
			}
		}

		return -1;
	}

	getAllColorsFromImage(img){
		let colors = [];

		for(let r = 0; r < img.height; r++){
			for(let c = 0; c < img.width; c++) {
				let col = img.get(c, r);
				if(!this.colorsContainsColor(colors, col)){
					colors.push(col);
				}
			}
		}

		return colors;
	}

	colorsContainsColor(colors, c){
		for(let col of colors){
			if(col[0] === c[0] &&
			   col[1] === c[1] &&
			   col[2] === c[2]){
				return true;
			}
		}
		return false;
	}

	createPixelMapFromImage(img){
		let pixelMap = [];

		for(let r = 0; r < img.height; r++){
			pixelMap[r] = [];
			for(let c = 0; c < img.width; c++) {
				pixelMap[r][c] = img.get(c, r);
			}
		}

		return pixelMap;
	}

	update(){
		for(let cellRow of this.cellMap){
			for(let cell of cellRow){
				cell.show();
			}
		}

		for(let cellRow of this.cellMap){
			for(let cell of cellRow){
				let selectedItem = this.colorTool.getSelectedItem();
				if(selectedItem){
					let colorIndex = this.getIndexOfColorFromColors(this.colors, selectedItem.color);
					if(cell.cIndex === colorIndex && cell.mouseIsOver() && !cell.colored && mouseIsPressed){
						cell.colored = true;
						break;
					}
				}
			}
		}

		// check if item is finished, if there is any cell of color that is not colored
		for(let item of this.colorTool.items){
			let isFinished = true;

			for(let cellRow of this.cellMap){
				for(let cell of cellRow){
					if(cell.cIndex === item.index){
						if(!cell.colored){
							isFinished = false;
						}
					}
				}
			}

			item.finished = isFinished;
		}

		this.colorTool.update();
	}
}

let imgs = {};
function preload(){
	imgs.test = loadImage("images/test.jpg");
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	grid = new Grid(imgs.test);
}

function draw(){
	background(51);
	grid.update();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
	grid.checkMousePress();
}