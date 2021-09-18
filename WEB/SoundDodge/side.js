// Game Settings Functions
$(document).ready(function(){
    $(document).on("mousedown", "canvas", function(e) {
        if( e.which == 1 ) {
            e.preventDefault();
            return false;
        } else if( e.which == 2 ) {
            e.preventDefault();
            return false;
        } else if( e.which == 3 ) {
            e.preventDefault();
            return false;
        }
    });

    $(document).contextmenu(function() {
        return false;
    });
});

// Side Functions
Array.prototype.inArray = function(needle){
    return (this.indexOf(needle) > -1);
}

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
Array.prototype.avg = function() {
    return (this.min() + this.max()) / 2;
}

// Other Game Functions
function addBlock(type){
    var z = random(1);
    var x;
    var y;
    var xDir;
    var yDir;
    var diff = difficulty;// / 10 + map(bins.avg(), 0, 255, 0, 10);
    if(type) { // score block
        if(z > 0.95){ // top
            x = floor(random(blockScoreSize / 2, w - blockScoreSize / 2));
            y = -blockScoreSize;
            xDir = 0;
            yDir = diff;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.9){ // right
            x = w + blockScoreSize;
            y = floor(random(blockScoreSize / 2, h - blockScoreSize / 2));
            xDir = -diff;
            yDir = 0;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.85){ // bottom
            x = floor(random(blockScoreSize / 2, w - blockScoreSize / 2));
            y = h + blockScoreSize;
            xDir = 0;
            yDir = -diff;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.8){ // left
            x = -blockScoreSize;
            y = floor(random(blockScoreSize / 2, h - blockScoreSize / 2));
            xDir = diff;
            yDir = 0;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        }
    } else { // normal block
        if(z > 0.95){ // top
            x = floor(random(blockSize / 2, w - blockSize / 2));
            y = -blockSize;
            xDir = 0;
            yDir = diff;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.9){ // right
            x = w + blockSize;
            y = floor(random(blockSize / 2, h - blockSize / 2));
            xDir = -diff;
            yDir = 0;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.85){ // bottom
            x = floor(random(blockSize / 2, w - blockSize / 2));
            y = h + blockSize;
            xDir = 0;
            yDir = -diff;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        } else if(z > 0.8){ // left
            x = -blockSize;
            y = floor(random(blockSize / 2, h - blockSize / 2));
            xDir = diff;
            yDir = 0;
            blocks.push(new Block(x, y, blockScoreSize, xDir, yDir, type));
        }
    }
}

function printAllNeeded(){
    textAlign(CENTER);
    fill(255, 255, 255, 40);
    textSize(25);
    text($("#song").val(), w / 2, h - 60);

    textSize(25);
    text(minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds), w / 2, h - 30);

    text("Score: " + score, w / 2, 50);

    textSize(15);
    text("ZONE", w / 2, h / 2 - 75);

    textSize(100);
    text(difficulty, w / 2, h / 2);

    fill(255);
    noStroke();
    // strokeWeight(10);
    // stroke(255, 255, 255);
    // Music duration lines
    // Top and bottom
    //line(w + 5, 5, w - lineWidth, 5); // top
    rect(0, h - 5, lineWidthPart * lineWidthIndex, 5);
    // line(-5, h - 5, lineWidthPart * lineWidthIndex, h - 5); // bottom
    // Left and right
    //line(w - 5, h + 5, w - 5, h - lineHeight); // right
    //line(5, -5, 5, lineHeight); // left

    healthbar.show();

    stroke(0, 0, 0);
    strokeWeight(1);
}