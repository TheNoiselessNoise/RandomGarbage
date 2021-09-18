let xyzt;
function setup(){
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    ellipseMode(CENTER);

    xyzt = new XYZT();
    IUpdateFFT();
}

function draw(){
    if(xyzt.isBacked){
        background(52);
    }

    if(!xyzt.loading() && xyzt.playing()){
        xyzt.updateBins();
        xyzt.renderBins();
        xyzt.beatDetect();
        xyzt.update();
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}