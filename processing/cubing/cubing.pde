Cube cube;
Mapper mapper;
boolean pressed;
PVector currentView;
PVector currentMouse;


void setup(){
  size(600,600,P3D);
  cube = new Cube();
  mapper = new Mapper(3, 3, 3, new PVector(-1, -1, -1), (int)SIZE);
  currentView = new PVector(HALF_PI*0.5, -HALF_PI*0.5);
  pressed = false;
}

void draw() {
  translate(width/2,height/2);
  background(50); 
  if(pressed){
    setView();
  }
  rotateX(currentView.y);
  rotateY(currentView.x);
  cube.setLayerPos(mapper.mapMouse());  
  cube.render();
}

void mousePressed(){
  if(mouseButton == LEFT){
    currentMouse = new PVector(mouseX, mouseY);
    pressed = true;
  }else if(mouseButton == RIGHT){
    cube.setLayerOrient(1);
  }
}

void mouseReleased(){
  if(mouseButton == LEFT){
    pressed = false;
  }
}

void mouseWheel(MouseEvent event) {
  int e = event.getCount();
  e = constrain(e, -1, 1);
  cube.inputRotate(e);
}

void keyPressed(){
 if(key == BACKSPACE){
   cube = new Cube();
   currentView = new PVector(HALF_PI*0.5, -HALF_PI*0.5);
 }else if(key == ' '){
   cube.randomize();
 }
}

void setView() {
  float dx = mouseX-currentMouse.x;
  float dy = mouseY-currentMouse.y;
  float ax = map(dx, 0, width, 0, TWO_PI);
  float ay = map(dy, height, 0, 0, TWO_PI);
  currentView.x += ax;
  currentView.y += ay;
  currentView.x = currentView.x%TWO_PI;
  currentView.y = currentView.y%TWO_PI;
  currentMouse.x = mouseX;
  currentMouse.y = mouseY;
}

void printArr(int[] a, String title){
  println(title);
  for(int i = 0; i < a.length; i++){
    print(a[i]+" ");
  }
  println();
}
