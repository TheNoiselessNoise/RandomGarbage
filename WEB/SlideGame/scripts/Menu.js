class MenuItem {
	constructor(index, text, func){
		this.index = index;
		this.text = text;
		this.func = func;
		this.hover = false;

		this.x = width / 2.5;
		this.y = height / (this.index + 2);
		this.w = width / 4;
		this.h = 100
	}

	doAction(){
		this.func()
	}

	isMouseOver(){
		return (
			mouseX > this.x &&
			mouseX < this.x + this.w &&
			mouseY > this.y &&
			mouseY < this.y + this.h
		)
	}

	update(){
		this.hover = this.isMouseOver()
	}

	show(){
		if(this.hover) fill(120);
		else fill(255);

		rect(this.x, this.y, this.w, this.h);

		fill(0);
		textSize(60);
		text(
			this.text,
			width / 2.25, 
			height / (this.index + 2) + 70
		)
	}
}

class Menu {
	constructor(){
		this.gameStarted = false;
		this.menuItems = {
			"Level Editor": Menu.levelEditor,
			"Start Game": Menu.startGame
		};
		this.items = [];

		this.createMenu()
	}

	createMenu(){
		let count = 0;
		for(let key of Object.keys(this.menuItems)){
			this.items.push(new MenuItem(count, key, this.menuItems[key]));
			count++
		}
	}

	mousePressed(){
		for(let item of this.items){
			if(item.hover){
				item.func()
			}
		}
	}

	static startGame(){
		menu.gameStarted = true
	}

	static levelEditor(){
		window.location = "editor.html"
	}

	show(){
		for(let item of this.items){
			item.update();
			item.show()
		}
	}
}