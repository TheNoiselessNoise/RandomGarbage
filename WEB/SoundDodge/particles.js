// Particle System
var particles = [];
function Particle(loc) {
    this.loc = loc;
    this.acc = new p5.Vector();
    this.vel = new p5.Vector(random(-2, 2), random(-2, 0));
    this.lifespan = 255;
    this.color = color(random(255), random(255), random(255));
}

Particle.prototype = {
    constructor: Particle,
    update: function() {
        this.vel.add(this.acc);
        this.loc.add(this.vel);
        this.lifespan -= 3.0;
    },
    display: function() {
        stroke(random(0), this.lifespan);
        fill(this.color);
        // ellipse(this.loc.x, this.loc.y, 20, 20);
        fill(255, 255, 255, this.lifespan);
        rect(this.loc.x, this.loc.y, 5, 5);
        // ellipse(this.loc.x, this.loc.y, 3, 3);
    }
}