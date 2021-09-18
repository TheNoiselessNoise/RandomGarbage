let imgs = {};

function preload(){
	imgs.PATH_1 = new XImage("images/path_1.jpg");
	imgs.PATH_2 = new XImage("images/path_2.jpg");
	imgs.WALL_1 = new XImage("images/wall_1.jpg");
}

function setup(){
	fw = new Framework();

	fw.createCanvas();
	fw.loadKeys("W A S D F");
	fw.loadImages(imgs);

	fw.createView("view_0", "START", {
		objects: [
			new Player4DirectionCircle()
		]
	});
	fw.setCurrentViewId("view_0");
}

function draw(){
	fw.update();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}