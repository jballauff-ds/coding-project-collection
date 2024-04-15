final static int R = 250;
int modular;
int col;
float factor = 1;
float increment;

void setup(){
  size(600,600);
  colorMode(HSB, 2*R, 100, 100, 100);
  modular = 350;
  col = 0;
  increment = 0.005;
}

void draw() {
  translate(width/2,height/2);
  background(0,0,0);
  noFill();
  for(int i = 0; i < modular; i++){
    float n = i * factor;
    float a1 = map(i, 0, modular, 0, TWO_PI);
    float a2 = map(n, 0, modular, 0, TWO_PI);
    float x = R * sin(a1);
    float y = R * cos(a1);
    float nX = R * sin(a2);
    float nY = R * cos(a2);
    stroke(0.5*R+dist(x,y,nX,nY), 100, 100);
    line(x, y, nX, nY);
  }
  text(factor,-width/2,height/2);
  factor += increment;
}

void mouseWheel(MouseEvent e){
  increment = increment+0.001*e.getCount();
  increment = constrain(increment, -0.5, 0.5);
}

void mousePressed(){
  if(mouseButton == RIGHT){
    increment = 0;
  }
  if(mouseButton == LEFT){
    increment = 0.005;
  }
}
