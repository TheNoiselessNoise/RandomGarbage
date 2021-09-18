/**
*
*   Sound Dodge made by XYZT
*   © 2018
*
**/

// Variables
var w;
var h;
var blockSize = 25;
var blockScoreSize = 15;
var score = 0;
var stopscoring = false;
var difficulty = 1;
var finish = false;
var maxBlocks = 1000;

// Setup variables
var sound;
var bins;
var fft;
var amp;
var binCount = 128;
var r, g, b;
var duration;
var minutes, seconds;
var lineWidthPart;
var lineHeightPart;
var lineWidthIndex = 0;
var lineHeightIndex = 0;
var checkbox;
var mobile;

// Backend variables
var c = 0; // brightness, when beat drops
var maxi = 150; // max value of bin to set brightness
var offset = 15; // offset of player sqaure
var mobileOffset = 0; // mobile offset

// Welcome text
var txts = ["Dodge 'em!", "Dodge those balls!", "Ready your reflexions!"];
var txt_alpha = 255;
var txt_curr = Math.round(Math.random() * (txts.length - 1));

// Main variables holding all objects
var healthbar;
var blocks = [];
var powerups = [];

// Intervals variables
var dInt; // difficulty interval
var cInt; // song duration counter interval
let timer = 0; //

// Game Functions
/*
function windowResized() {
  resizeCanvas(windowWidth - 50, windowHeight - 50);
}
*/

// Game
function preload(){
    try {
        sound = loadSound("songs/" + $("#song").val());
    } catch(e) {
        preload();
    }
}

function setup(){
    w = windowWidth;
    h = windowHeight;
    createCanvas(w, h);
    
    checkbox = createCheckbox('LSD');
    checkbox.position(windowWidth - 100, 20);
    checkbox.checked(false);
    
    mobile = createCheckbox('Mobile?');
    mobile.position(windowWidth - 100, 40);
    mobile.checked(false);
    
    var ch = document.querySelectorAll("label");
    for(var i = 0; i < ch.length; i++){
        ch[i].style.color = "#FFFFFF";
    }

    fft = new p5.FFT(0, binCount);
    amp = new p5.Amplitude();
    sound.amp(0.2);

    duration = sound.duration();
    minutes = floor(duration / 60);
    seconds = floor(duration - minutes * 60);

    lineWidthPart = w / duration;
    lineHeightPart = h / duration;
    healthbar = new HealthBar();

    togglePlay();
}

function draw(){
    bins = fft.analyze();
    mobileOffset = mobile.checked() ? 200 : 0;

    if(healthbar.current <= 0){
        finish = true;
    }
        
    background(c);
    if(c >= 20){
        c = 0;
    }
    
    if(txt_alpha != 0){
        textAlign(CENTER);
        fill(255, 255, 255, txt_alpha);
        textSize(50);
        text(txts[txt_curr], w / 2, h / 2);
        txt_alpha--;    
    }

    var newspeed = map(amp.getLevel(), 0, 1, 0, 15) * difficulty * 1.5;
    for(var i = 0; i < blocks.length; i++){
        // Update speed
        blocks[i].setSpeed(newspeed);

        // Move the blocks
        var d = dist(blocks[i].x, blocks[i].y, mouseX, mouseY - mobileOffset);

        if(d < (blocks[i].w / 2) + offset){
            if(blocks[i].score && !stopscoring){
                score += round(blocks[i].value);
                blocks.splice(i, 1);
                continue;
            } else {
                // finish = true;
                // stopscoring = true;
                healthbar.down(round(Math.sqrt(blocks[i].value)) * Math.pow(difficulty, 2));
            }
        }

        blocks[i].move();
        blocks[i].show();

        if(blocks[i].isOut()){
            blocks.splice(i, 1);
        }
    }

    if(bins.max() > maxi){
        maxi = bins.max();
    }

    for(var n = 0; n < bins.length; n++){
        if(bins.max() == maxi){
            c = 20;
            if(blocks.length != 0 && checkbox.checked()){
                blocks[round(random(blocks.length - 1))].setColor(random(255));
            }

            var r = random(1);
            if(r > 0.975 && !mobile.checked()){
                particles.push(new Particle(new p5.Vector(mouseX, mouseY - mobileOffset)));
            }
        }

        if(bins[n] > maxi - (difficulty * 3) && blocks.length < maxBlocks){
            var rscore = random(1);

            if(rscore > 0.90){
                addBlock(true);
            } else {
                addBlock(false);
            }
        }
    }
    
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].lifespan <= 0) {
            particles.splice(i, 2);
        } else {
            particles[i].update();
            particles[i].display();
        }
    }

    printAllNeeded();

    fill(255);
    rect(mouseX - offset, mouseY - offset - mobileOffset, 30, 30);

    if(finish){
        noLoop();
        textSize(50);
        fill(255, 0, 0);
        text("Game Over!", w / 2, h / 2);
        // togglePlay();
    }

    if (millis() >= 1000+timer) {
        timer = millis();
        updateTime();
    }
}

function updateTime(){
    if(seconds <= 0 && minutes >= 1){
        minutes--;
        seconds = 59;
    } else {
        if(seconds != 0){
            seconds--;
        }
        lineWidthIndex += 1;
        lineHeightIndex += 1;
    }
}

function togglePlay() {
    if (sound.isPlaying()) {
        sound.stop();
        clearInterval(dInt);
        clearInterval(cInt);
        finish = false;
    } else {
        sound.play();
        updateTime();
            
        dInt = setInterval(function(){
            difficulty++;
        }, 25000);

        // cInt = setInterval(function(){
        //     if(seconds <= 0 && minutes >= 1){
        //         minutes--;
        //         seconds = 59;
        //     } else {
        //         if(seconds != 0){
        //             seconds--;
        //         }
        //         lineWidthIndex += 1;
        //         lineHeightIndex += 1;
        //     }
        // }, 1000);
    }
}