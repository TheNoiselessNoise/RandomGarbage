/**
*
*   Sound Dodge made by XYZT
*   © 2018
*
**/

// Health bar system
function HealthBar() {
    this.current = 10000;
    this.active = false;
}

HealthBar.prototype.show = function(){
    fill(255, 0, 0, this.active ? 255 : 128);
    strokeWeight(10);
    stroke(255, 0, 0, this.active ? 255 : 128);

    var d = map(this.current, -5, 10000, 0, w);
    //console.log(d);
    line(-5, 5, d - 5, 5);
    this.active = false;
}

HealthBar.prototype.down = function(num){
	this.active = true;
    this.current -= num;
}