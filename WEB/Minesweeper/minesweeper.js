/**
*
*   Minesweeper made by Pavel Meduna
*   Â© 2017
*
**/

var totalMines = 20;
var rows = 10;
var cols = 10;
var w;
var h;
var sideA;
var sideB;
var grid;
var tempSize = 50;
var fontSize = tempSize / 2;

// Game Settings Functions
$(document).ready(function(){
    $("input.change").on("change", function(){
        $("input#bombs").val($("input#width").val() * $("input#height").val() - 1);
        $("input#bombs").attr("max", $("input#width").val() * $("input#height").val());
    });

    $("input#width").on("change", function(){
        $("input#height").val($("input#width").val());
        $("input#bombs").val($("input#width").val() * $("input#height").val() - 1);
        $("input#bombs").attr("max", $("input#width").val() * $("input#height").val());
    });

    $("input#difficulty").on("click", function(){
        var values = $(this).attr("data-value");
        values = values.split(";");
        totalMines = parseInt(values[0]);
        cols = parseInt(values[1]);
        rows = parseInt(values[2]);

        setup();
        $("#menu").hide();
        $("canvas").show();
        draw();
    });

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

    $(document).contextmenu(function() {
        return false;
    });
});

function customMenu(){
    totalMines = parseInt($("input#bombs").val());
    cols = parseInt($("input#width").val());
    rows = parseInt($("input#height").val());

    setup();
    $("#menu").hide();
    $("canvas").show();
    draw();
}

function changeSettings(){
    $("canvas").hide();
    $("#menu").show();
    $("#reset").hide();
    $("#checkbox").prop('checked', false);
}

// Side Functions
Array.prototype.inArray = function(needle){
    return (this.indexOf(needle) > -1);
}

// Cell Object
function Cell(i, j, sideA, sideB) {
    this.i = i;
    this.j = j;
    this.sideA = sideA;
    this.sideB = sideB;
    this.x = this.i * this.sideA;
    this.y = this.j * this.sideB;
    this.revealed = false;
    this.bomb = false;
    this.clickable = true;
    this.neighbors = 0;
    this.flagged = false;
}

Cell.prototype.show = function(){
    stroke(0);
    fill(color(30, 144, 255)); // dodgerblue
    rect(this.x, this.y, this.sideA, this.sideB);

    if(this.revealed){
        if(this.bomb){
            fill(120);
            ellipse(this.x + this.sideA / 2, this.y + this.sideB / 2, this.sideA * 0.5);
        } else {
            fill(240);
            rect(this.x, this.y, this.sideA, this.sideB);

            if(this.neighbors > 0){
                textAlign(CENTER);
                fill(0);
                textSize(fontSize);
                text(this.neighbors, this.x + this.sideA / 2, this.y + this.sideB / 1.5);
            }
        }
    } else if(this.flagged) {
        fill(color(255, 120, 0));
        rect(this.x, this.y, this.sideA, this.sideB);
    }
}

Cell.prototype.clicked = function(x, y) {
    return (x > this.x && x < this.x + this.sideA && y > this.y && y < this.y + this.sideB);
}

Cell.prototype.findNeighbors = function() {
    if(this.bomb){
        this.neighbors = -1;
        return;
    }

    var total = 0;
    for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
            var i = this.i + x;
            var j = this.j + y;
            if(i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                if(neighbor.bomb){
                    total++;
                }
            }
        }
    }
    this.neighbors = total;
}

Cell.prototype.reveal = function(){
    this.revealed = true;
    this.clickable = false;
    if(this.neighbors == 0){
        this.revealNeighbors();
    }
}

Cell.prototype.revealNeighbors = function(){
    for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
            var i = this.i + x;
            var j = this.j + y;
            if(i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                if(!neighbor.bomb && !neighbor.revealed){
                    neighbor.reveal();
                    neighbor.clickable = false;
                }
            }
        }
    }
}

// Game Functions
function mousePressedLeft(){
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            if(grid[i][j].clicked(mouseX, mouseY)){
                if(grid[i][j].clickable){
                    grid[i][j].reveal();
                    if(grid[i][j].bomb){
                        gameOver();
                    }
                }
            }
        }
    }
}

function mousePressedMiddle() {
    for(var n = 0; n < cols; n++){
        for(var m = 0; m < rows; m++){
            if(grid[n][m].clicked(mouseX, mouseY)){
                var total = 0;
                for(var x = -1; x <= 1; x++){
                    for(var y = -1; y <= 1; y++){
                        var i = grid[n][m].i + x;
                        var j = grid[n][m].j + y;
                        if(i > -1 && i < cols && j > -1 && j < rows){
                            var neighbor = grid[i][j];
                            if(neighbor.flagged){
                                total++;
                            }
                        }
                    }
                }

                if(total >= grid[n][m].neighbors){
                    for(var x = -1; x <= 1; x++){
                        for(var y = -1; y <= 1; y++){
                            var i = grid[n][m].i + x;
                            var j = grid[n][m].j + y;
                            if(i > -1 && i < cols && j > -1 && j < rows){
                                var neighbor = grid[i][j];
                                if(!neighbor.flagged){
                                    neighbor.reveal();
                                    if(neighbor.bomb){
                                        gameOver();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function mousePressedRight() {
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            if(grid[i][j].clicked(mouseX, mouseY)){
                if(grid[i][j].flagged){
                    grid[i][j].flagged = false;
                    grid[i][j].clickable = true;
                } else {
                    grid[i][j].flagged = true;
                    grid[i][j].clickable = false;
                }
            }
        }
    }
}

function gameOver(){
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].revealed = true;
        }
    }

    $("#reset").css("display", "block");
}

function reset(){
    setup();
}

// Setup and Draw Functions
function generateArray(r, c){
    var arr = new Array(c);
    for(var i = 0; i < arr.length; i++){
        arr[i] = new Array(r);
    }
    return arr;
}

function setup(){
    $("#reset").hide();

    w = cols * tempSize;
    h = rows * tempSize;
    createCanvas(w + 1, h + 1);
    sideA = floor(w / cols);
    sideB = floor(h / rows);

    grid = generateArray(rows, cols);

    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            grid[i][j] = new Cell(i, j, sideA, sideB);
        }
    }

    // Creating bombs
    var used = [];
    for(var n = 0; n < totalMines; n++){
        var i = floor(random(grid.length));
        var j = floor(random(grid[i].length));
        if(used.inArray([i, j])){
            n--;
        } else {
            grid[i][j].bomb = true;
            used.push([i, j]);
        }
    }

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].findNeighbors();
        }
    }
}

function draw(){
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show();
        }
    }
}