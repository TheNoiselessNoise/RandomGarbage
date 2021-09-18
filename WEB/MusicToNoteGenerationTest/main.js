/// <reference path="./p5.global-mode.d.ts" />

let music;

function setup(){
    createCanvas(windowWidth, windowHeight);
    music = new LIVEMUSIC("your_music_file.mp3");
}   

let checked = false;
function draw(){
    background(51);
    if(music.isBuffered && music.isFilteredBuffered){
        if(music.isPlaying()) {
            if (!checked) {
                checked = true;
            }

            music.userInput();
            music.render();
        }
    }
}

function toggleMusic(pause=true){
    if(music.isPlaying()){
        if(pause){
            music.pause();
        } else {
            music.stop();
        }
    } else {
        music.play();
    }
}