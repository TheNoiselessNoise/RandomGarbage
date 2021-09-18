/**
*
*   Sound Dodge made by XYZT
*   © 2018
*
**/

// Cell Object
function Block(x, y, w, xd, yd, score=false) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.xd = xd;
    this.yd = yd;
    this.score = score;

    if(score){
        this.w = 15;
        this.color = color(255, 215, 0);
        this.value = random(250); // score of score block, adding score
    } else {
        this.w = blockSize;
        this.value = random(150); // score of dangerous block, removing health
        this.color = color(random(255), random(255), random(255));
    }
}

Block.prototype.show = function(){
    strokeWeight(2);
    stroke(255);
    fill(this.color);
    ellipse(this.x, this.y, this.w);
    strokeWeight(0);
    stroke(0);
}

Block.prototype.setColor = function(val) {
    var rand = random(1);
    var r = floor(random(val / 3));
    var g = floor(random(val / 2));
    if(rand > 0.9){
        this.color = color(255, r, g);
    } else if(rand > 0.5){
        this.color = color(r, 255, g);
    } else {
        this.color = color(r, g, 255);
    }
}

Block.prototype.setSpeed = function(x=null, y=null){
    if(x !== null && y !== null){
        this.xd = x;
        this.yd = y;
    } else if(x !== null) {
        if(this.xd === 0){
            this.yd = this.yd < 0 ? -x : x;
        }

        if(this.yd === 0){
            this.xd = this.xd < 0 ? -x : x;
        }
    }
}

Block.prototype.isOut = function(){
    return (this.xd > 0 && this.x > w + this.w) ||
        (this.xd < 0 && this.x < 0 - this.w) ||
        (this.yd > 0 && this.y > h + this.w) ||
        (this.yd < 0 && this.y < 0 - this.w);
}

Block.prototype.move = function(){
    this.x = this.x + this.xd;
    this.y = this.y + this.yd;
}
