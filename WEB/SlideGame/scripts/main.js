let map, menu;
let images = {};
function preload(){
	images.PATH = loadImage("images/path.jpg");
	images.WALL = loadImage("images/wall.jpg");
	images.STEPPED = loadImage("images/stepped.jpg");
	images.ENEMY = loadImage("images/enemy.jpg");
	images.SWITCH = loadImage("images/switch.png");
	images.RESET = loadImage("images/reset.png");
	images.TELEPORT = loadImage("images/teleport.png");
	images.TRAMPOLIN = loadImage("images/trampolin.png");
	images.FINISH = loadImage("images/finish.png");
	images.PLAYER = loadImage("images/player.png");
	images.KEY = loadImage("images/key.png");
	images.DOOR_LOCKED = loadImage("images/door_locked.png");
	images.DOOR_UNLOCKED = loadImage("images/door_unlocked.png");
	images.TRAP_OPENED = loadImage("images/trap_opened.png");
	images.TRAP_CLOSED = loadImage("images/trap_closed.png")
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	menu = new Menu();

	let level = window.location.search.split("=")[1];

	if(level !== undefined){
		map = new Map(level);
		menu.gameStarted = true
	} else {
		map = new Map()
	}
}

function draw(){
	background(51);
	
	if(menu.gameStarted){
		map.update();

		if(map.isFinished()){
			map.finish()
		}	
	} else {
		menu.show()
	}
}

function keyPressed(){
	if(menu.gameStarted){
		map.player.updateMove()
	}
}

function mousePressed(){
	if(!menu.gameStarted){
		menu.mousePressed()
	}
}