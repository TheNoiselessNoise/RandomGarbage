let view;
let fft, sound;
let player;
let backEnvironment;

function preload(){
  sound = loadSound('yourmusic.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  backEnvironment = new Background(BackgroundType.LINES, 10);
  player = new Player();
  
  view = new View("test", [
      new Player()
  ]);

  fft = new p5.FFT(0.85, 128);
  p5.FFT.prototype.avg = function(bins = null){
    if(bins == null){
      bins = fft.analyze();
    }
    let sum = 0;
    for(let num of bins){
      sum += num;
    }
    return round(sum / bins.length);
  };
  p5.FFT.prototype.getBins = function() {
    return fft.analyze();
  };
  
  sound.amp(0.2);
  rectMode(CENTER);
  ellipseMode(CENTER);
}

let back_color = {
  r: 0,
  g: 0,
  b: 0
};

// MAN = Maximum Average Number
let maxi = 75; //15; // MAN
let maxiLevel = 0; // how many times MAN exceeds older MAN
function draw() {
  if(!sound.isPlaying()){
    textSize(100);
    text("CLICK TO PLAY", width / 4, height / 2);
  }

  let bins = fft.analyze();
  let avg = fft.avg(bins);

  if(avg > maxi){
    maxi = avg;
    maxiLevel++;

    updateBackgroundRandom(avg, avg, avg);
    backEnvironment.updateBinColor(avg);
    view.updateSpecial(avg);
  } else if((maxi-avg-10) < 5 && frameCount % 5 === 0) {
    if(Math.random() > .5){
      for(let i = 0; i < round(random(1, 3)); i++){
        view.addObject(new Enemy());
      }
    }

    updateBackgroundRandom(avg, avg, avg);
    backEnvironment.updateBinColor(avg);
    view.updateSpecial(avg);
  } else {
    background(avg);
  }

  backEnvironment.update(bins);
  view.update(bins);
}

function mousePressed(){
  if(!sound.isPlaying()){
    sound.play();
  }
}

function toggleMusic(){
  if(sound.isPlaying()){
    sound.stop();
  } else {
    sound.play();
  }
}

function getRandomColor(r=0,g=0,b=0,a=255){
  r = round(random(r, 255));
  g = round(random(g, 255));
  b = round(random(b, 255));
  return color(r, g, b, a);
}

function updateBackgroundRandom(r=0,g=0,b=0,a=255){
  r = round(random(r, 255));
  g = round(random(g, 255));
  b = round(random(b, 255));
  background(color(r, g, b, a));
}

function getAverageFromBins(bins = null){
  return p5.FFT.prototype.avg(bins);
}

function getBins(){
  return p5.FFT.prototype.getBins();
}