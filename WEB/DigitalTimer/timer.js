let r, g, b, padding, startPause

let p = 1 // padding of digit segments
let x = 0 // x position of digit
let y = 0 // y position of digit

let started = false
let counting = false
function setup() {
  createCanvas(windowWidth, windowHeight)
  r = createSlider(0, 255, 1)
  r.position(30, 10)
  g = createSlider(0, 255, 1)
  g.position(30, 40)
  b = createSlider(0, 255, 1)
  b.position(30, 70)
  padding = createSlider(0, 3, 0)
  padding.position(30, 100)
  
  startPause = createButton("START / PAUSE")
  startPause.position(width / 2 - (startPause.width / 2), height / 2 + 100)
  startPause.mousePressed(toggleDraw)
  
  x = 0
  y = height / 2 - 100
  
  noLoop()
}

let digits = {
  2: [
    [25, 25],
    [40, 20],
    [70, 20],
    [85, 25],
    [70, 30],
    [40, 30],
    [25, 25]
  ],
  1: [
    [25, 25, 1],
    [40, 30, 1],
    [40, 70],
    [25, 75],
    [25, 25, 1]
  ],
  3: [
    [85, 25, 1],
    [70, 30, 1],
    [70, 70],
    [85, 75],
    [85, 25, 1]
  ],
  7: [
    [25, 75, 1],
    [40, 70, 1],
    [70, 70, 1],
    [85, 75, 1],
    [70, 80],
    [40, 80],
    [25, 75, 1]
  ],
  6: [
    [25, 75, 2],
    [40, 80, 1],
    [40, 120],
    [25, 125],
    [25, 75, 2]
  ],
  4: [
    [85, 75, 2],
    [70, 80, 1],
    [70, 120],
    [85, 125],
    [85, 75, 2]
  ],
  5: [
    [25, 125, 1],
    [40, 120, 1],
    [70, 120, 1],
    [85, 125, 1],
    [70, 130],
    [40, 130],
    [25, 125, 1]
  ]
}
let numbers = {
  0: [1,2,3,4,5,6],
  1: [3,4],
  2: [2,3,7,6,5],
  3: [2,3,7,4,5],
  4: [1,7,3,4],
  5: [2,1,7,4,5],
  6: [2,1,7,4,5,6],
  7: [2,3,4],
  8: [1,2,3,4,5,6,7],
  9: [1,2,3,4,5,7]
}

let ss = 0 // seconds < 10
let sd = 0 // seconds > 10
let ms = 0 // minutes < 10
let md = 0 // minutes > 10
let hs = 0 // hours < 10
let hd = 0 // hours > 10
let ds = 0 // days < 10
let dd = 0 // days > 10
function draw() {
  background(220)
  if(checkFinish()){
    noLoop()
  }
  
  if(started && !counting){
    fill(255, 0, 0)
    textSize(42)
    text("PAUSED", width / 2 - 75, 250)
  }
  
  p = padding.value()
  
  textSize(24)
  x = width / 1.6
  renderDigit(ss)
  x = x - 75
  renderDigit(sd)
  text("SECONDS", x + 35, y + 150)
  
  x = x - 100
  renderDigit(ms)
  x = x - 75
  renderDigit(md)
  text("MINUTES", x + 40, y + 150)
  
  x = x - 100
  renderDigit(hs)
  x = x - 75
  renderDigit(hd)
  text("HOURS", x + 50, y + 150)
  
  x = x - 100
  renderDigit(ds)
  x = x - 75
  renderDigit(dd)
  text("DAYS", x + 60, y + 150)
  
  textSize(12)
  fill(255, 0, 0)
  text("R:", 10, 25)
  fill(0, 255, 0)
  text("G:", 10, 55)
  fill(0, 0, 255)
  text("B:", 10, 85)
  fill(0)
  text("P:", 10, 115)
  
  if(frameCount % 60 == 0){
    ss++
    
    // SECONDS
    if(ss > 9){
      sd++
      ss = 0
    }
    
    if(sd > 5){
      ms++
      sd = 0
    }
    
    // MINUTES
    if(ms > 9){
      md++
      ms = 0
    }
    
    if(md > 5){
      hs++
      md = 0
    }
    
    // HOURS
    if(hd < 2){
      if(hs > 9){
        hd++
        hs = 0
      }
    } else {
      if(hs > 3){
        ds++
        hs = 0
        hd = 0
      }
    }
    
    // DAYS
    if(ds > 9){
      dd++
      ds = 0
    }
  }
}

function toggleDraw(){
  started = true
  counting = !counting
  
  if(counting){
    loop() 
  } else {
    noLoop()
  }
}

function checkFinish(){
  return (ss == 9 &&
          sd == 5 &&
          ms == 9 &&
          md == 5 &&
          hs == 3 &&
          hd == 2 &&
          ds == 9 &&
          dd == 9)
}

function renderDigit(n){
  for(let digit of Object.keys(digits)){
    digit = Number(digit)
    
    let number = numbers[n]
    
    if(number.includes(digit)){ // active
      fill(r.value(), g.value(), b.value())
      noStroke()
    } else { // not active
      noFill()
      stroke(r.value(), g.value(), b.value())
    }
    
    // render
    beginShape()
    for(let v of digits[digit]){
      if(v[2]){
        vertex(x + v[0], y + v[1] + (p * v[2]))
      } else {
        vertex(x + v[0], y + v[1])
      }
    }
    endShape()
  }
  
  // reset styling
  fill(r.value(), g.value(), b.value())
  noStroke()
}