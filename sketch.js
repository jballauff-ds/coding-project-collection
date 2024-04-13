const R = 250;
const modular = 300;
var factor = 1;
var increment = 0.005;

function setup(){
  createCanvas(600,600);
  colorMode(HSB, 2*R, 100, 100, 100);
}

function draw() {
  translate(width/2,height/2);
  background(0);
  for(let i = 0; i < modular; i++){
    let a1 = map(i, 0, modular, 0, TWO_PI);
    let a2 = map(i * factor, 0, modular, 0, TWO_PI);
    let x = R * cos(a1);
    let y = R * sin(a1);
    let nX = R * cos(a2);
    let nY = R * sin(a2);
    stroke(dist(x,y,nX,nY), 100, 100);
    fill(dist(x,y,nX,nY), 100, 100);
    circle(x, y, 5);
    line(x, y, nX, nY);
  }
  factor += increment;
}