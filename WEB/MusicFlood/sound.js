/**
*
*   MusicFlood made by XYZT
*   © 2017
*
**/

// Side Functions


// Variables
var menuOffset = 150;
var w = 1100;
var h = 900;
var cols;
var rows;
var fontSize = 32;
var blockSize = 25;
var score = 0;
var grid = [];
var multiplier = 1;
var activeBlocks = 0;
var nActiveBlocks = 0;
var floodness = 0;
var difficulty = 1;
var critical = 95;
var finish = false;

// Game Settings Functions
$(document).ready(function(){
    $(document).on("mousedown", "canvas", function(e) {
        if( e.which == 1 ) {
            e.preventDefault();
            mousePressedLeft();
        } else if( e.which == 2 ) {
            e.preventDefault();
            mousePressedMiddle();
        } else if( e.which == 3 ) {
            e.preventDefault();
            mousePressedRight();
            return false;
        }
    });

    $(document).on("keydown", function(e){
        //console.log(e.which, String.fromCharCode(e.which));
        weapons(String.fromCharCode(e.which));
    });

    $(document).contextmenu(function() {
        return false;
    });
});

// Side Functions
Array.prototype.inArray = function(needle){
    return (this.indexOf(needle) > -1);
}

// Cell Object

function Block(i, j, w) {
    this.value = random(250);
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = this.i * this.w;
    this.y = this.j * this.w;
    this.active = false;
    this.color = color(250, 0, 250);
    this.value = floor(random(5) + 1) * multiplier;
}

Block.prototype.show = function(){
    stroke(0);
    //fill(color(250, 0, 250));
    fill(120);
    rect(this.x, this.y, this.w, this.w);

    if(this.active){
        fill(this.color);
        rect(this.x, this.y, this.w, this.w);
    }
}

Block.prototype.setColor = function(val) {
    var rand = random(1);
    var r = floor(random(val / 3));
    var g = floor(random(val / 2));
    var b = floor(random(val / 1.2));
    if(rand > 0.9){
        this.color = color(r, b, g);
    } else if(rand > 0.5){
        this.color = color(r, g, b);
    } else {
        this.color = color(b, g, r);
    }
}

Block.prototype.hover = function(x, y){
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Block.prototype.dry = function(){
    score += this.value;
    this.destroy();
}

Block.prototype.destroy = function(){
    this.active = false;
    this.value = floor(random(5) + 1) * multiplier;
}

// Game Functions
function weapons(letter){
    // Flood Attack
    if(letter == "R" && score >= 500){
        score -= 500;
        for(var m = 0; m < grid.length; m++){
            for(var n = 0; n < grid[m].length; n++){
                if(grid[m][n].hover(mouseX, mouseY)){
                    for(var x = -8; x <= 8; x++){
                        for(var y = -8; y <= 8; y++){
                            var i = grid[m][n].i + x;
                            var j = grid[m][n].j + y;
                            if(i > -1 && i < cols - (menuOffset / blockSize - 4) && j > -1 && j < rows){
                                var neighbor = grid[i][j];
                                if(neighbor.active){
                                    neighbor.destroy();
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if(letter == "T" && score >= 750){
        score -= 750;
        for(var m = 0; m < grid.length; m++){
            for(var n = 0; n < grid[m].length; n++){
                if(grid[m][n].hover(mouseX, mouseY)){
                    for(var x = -grid.length; x <= grid.length; x++){
                        for(var y = -grid.length; y <= grid.length; y++){
                            var i = grid[m][n].i + x;
                            var j = grid[m][n].j + y;
                            if(i > -1 && i < cols - (menuOffset / blockSize - 4) && j > -1 && j < rows){
                                var neighbor = grid[i][floor(random(j + 1))];
                                if(neighbor.active){
                                    neighbor.destroy();
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if(letter == "E" && score >= 2500){
        score -= 2500;
        for(var m = 0; m < grid.length; m++){
            for(var n = 0; n < grid[m].length; n++){
                var i = floor(random(grid.length));
                var j = floor(random(grid[i].length));
                grid[i][j].destroy();
            }
        }
    } else if(letter == "W" && score >= 2000){
        score -= 2000;
        multiplier++;
    } else if(letter == "Q" && score >= 2500){
        score -= 2500;
        critical += 10;
    }
}

function mouseDragged(){
    for(var m = 0; m < grid.length; m++){
        for(var n = 0; n < grid[m].length; n++){
            if(grid[m][n].hover(mouseX, mouseY)){
                for(var x = -1; x <= 1; x++){
                    for(var y = -1; y <= 1; y++){
                        var i = grid[m][n].i + x;
                        var j = grid[m][n].j + y;
                        if(i > -1 && i < cols - (menuOffset / blockSize - 4) && j > -1 && j < rows){
                            var neighbor = grid[i][j];
                            if(neighbor.active){
                                neighbor.dry();
                            }
                        }
                    }
                }
            }
        }
    }
}

// function mousePressedLeft(){
//     /*
//     for(var i = 0; i < grid.length; i++){
//         for(var j = 0; j < grid[i].length; j++){
//             if(grid[i][j].hover(mouseX, mouseY)){
//                 if(grid[i][j].active){
//                     grid[i][j].destroy();
//                 }
//             }
//         }
//     }
//     */
//     weapons("R");
// }

function mousePressedLeft(){
}

function mousePressedMiddle() {
}

function mousePressedRight() {

}

setTimeout(function(){
    togglePlay();
}, 3000);

// Setup and Draw Functions
var sound;
var canvas;
var fft;
var binCount = 128;
var r, g, b;
var duration;
var minutes, seconds;
var wasPlaying = false;

function generateArray(r, c){
    var arr = new Array(c);
    for(var i = 0; i < arr.length; i++){
        arr[i] = new Array(r);
    }
    return arr;
}

// Menu
function createMenu(){
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("Music Flood", w - 30, 50);

    stroke(0);
    text("Difficulty: " + difficulty + " (" + (250 - (difficulty * 13)) + ")", w - 30, 110);

    textSize(25);
    text($("#song").val(), w - 30, 200);

    textSize(75);
    text(minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds), w - 30, 280);

    textSize(20);
    text("[T] Upper Dryness (750 pts)", w - 30, 350);
    text("[R] Dry Crater (500 pts)", w - 30, 380);
    text("[E] Random Dryness (2500 pts)", w - 30, 410);
    text("[W] Score Multiplier +1 (2000 pts)", w - 30, 440);
    text("[Q] +10% Critical F. (2500 pts)", w - 30, 470);

    textSize(30);
    text("Floodness: " + floodness + "%", w - 30, h - 210);
    text("Critical: ! " + critical + "%", w - 30, h - 180);
    text("Total Blocks: " + (cols * rows), w - 30, h - 120);
    text("Grey Blocks: " + nActiveBlocks, w - 30, h - 90);
    text("Music Blocks: " + activeBlocks, w - 30, h - 60);

    text("Score: " + score + " (" + multiplier + "x)", w - 30, h - 30);
}

// Game
function preload(){
    sound = loadSound("songs/" + $("#song").val());
}

function setup(){
    cols = floor((w  - menuOffset) / blockSize);
    rows = floor(h / blockSize);
    grid = generateArray(cols, rows);
    canvas = createCanvas(w + menuOffset + 1, h + 1);

    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            grid[i][j] = new Block(i, j, blockSize);
        }
    }

    fft = new p5.FFT(0, binCount);
    sound.amp(0.2);

    duration = sound.duration();
    minutes = floor(duration / 60);
    seconds = floor(duration - minutes * 60);
}

function draw(){
    background(0);
    createMenu();
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            grid[i][j].show();
        }
    }

    if(!sound.isPlaying()) {
        if(wasPlaying){
            seconds = 0;
            minutes = 0;
            background(0);
            createMenu();
            results();
        }
        return;
    }

    var bins = fft.analyze();
    for(var n = 0; n < bins.length; n++){
        if(bins[n] > 250 - (difficulty * 13)){
            var i = floor(random(grid.length));
            var j = floor(random(grid[i].length));
            grid[i][j].setColor(bins[n]);
            grid[i][j].active = true;
        }
    }

    var m = 0;
    var g = 0;
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            if(grid[i][j].active){
                m++;
            } else {
                g++;
            }
        }
    }
    activeBlocks = m;
    nActiveBlocks = g;
    floodness = floor(activeBlocks / ((cols * rows) / 100));

    if(floodness >= critical){
        results();
    } else {
        if(finish == false && minutes == 0 && seconds == 0){
            results();
        }
    }
}

function results() {
    finish = true;
    sound.stop();
    noLoop();

    if(floodness < critical){
        alert('You win!');
    } else {
        alert('You failed! The floodness has exceeded the limit!');
    }
}

var dInt; // difficulty interval
var cInt; // song duration counter interval
var fInt; // critical floodness interval;
function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
        clearInterval(dInt);
        clearInterval(cInt);
        clearInterval(fInt);
    } else {
        wasPlaying = true;
        sound.play();
        dInt = setInterval(function(){
            difficulty++;
        }, 25000);

        cInt = setInterval(function(){
            if(seconds <= 0 && minutes >= 1){
                minutes--;
                seconds = 59;
            } else {
                if(seconds != 0){
                    seconds--;
                }
            }
        }, 1000);

        fInt = setInterval(function(){
            if(duration > 200){
                critical -= 0.25;
            } else if(duration > 100){
                critical -= 0.1;
                critical = parseFloat(critical.toFixed(1));
            } else if(duration > 50 && duration < 100){
                critical -= 0.05;
                critical = parseFloat(critical.toFixed(2));
            } else {
                critical -= 0.025;
                critical = parseFloat(critical.toFixed(3));
            }
        }, 1000);
    }
}
