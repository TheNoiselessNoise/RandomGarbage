let canvas;
let w, h;
let musics = [];

function setup(){
	w = windowWidth;
	h = windowHeight;
	canvas = createCanvas(w, h);

	music = new LIVEMUSIC("songs/" + "musicname" + ".mp3");
}


function draw(){
	background(255);
	if(music.isBuffered()){
		music.update();
		music.userInput();

		if(!music.isPlaying() && !music.isCountdown()){
			music.showReady();
		}
	} else {
		music.showLoading();
	}
}

function keyPressed(){
	music.playNotes.checkKey(key, true);
}

function keyReleased(){
	music.playNotes.checkKey(key, false);
}