const SIZE = 80;
const ANIMATION_SPEED = 0.015;

function setup() {
  createCanvas(500, 500, WEBGL);
  addScreenPositionFunction();
  let doc = createElement(
    "p",
    "Left click and drag to change view <br><br>\
    Press 'r' to change orientation of selected layer <br><br> Use 'w' and 'e' to rotate layer"
  );
  doc.style("color", "white");
  doc.style("display", "block");

  cube = new Cube();
  mapper = new Mapper(3, 3, 3, createVector(-1, -1, -1), SIZE);
  pressed = false;
  currentView = createVector(HALF_PI * 0.5, -HALF_PI * 0.5);
}

function draw() {
  background(0);
  if (pressed) {
    setView();
  }
  rotateX(currentView.y);
  rotateY(currentView.x);
  cube.setLayerPos(mapper.mapMouse());
  cube.render();
}

function mousePressed() {
  if (mouseButton == LEFT) {
    currentMouse = createVector(mouseX, mouseY);
    pressed = true;
  }
}

function keyPressed() {
  if (key == "r") {
    cube.setLayerOrient(1);
  }
  if (key == "w") {
    cube.inputRotate(-1);
  }
  if (key == "e") {
    cube.inputRotate(1);
  }
}

function mouseReleased() {
  if (mouseButton == LEFT) {
    pressed = false;
  }
}

function setView() {
  let dx = mouseX - currentMouse.x;
  let dy = mouseY - currentMouse.y;
  let ax = map(dx, 0, width, 0, TWO_PI);
  let ay = map(dy, height, 0, 0, TWO_PI);
  currentView.x += ax;
  currentView.y += ay;
  currentView.x = currentView.x % TWO_PI;
  currentView.y = currentView.y % TWO_PI;
  currentMouse.x = mouseX;
  currentMouse.y = mouseY;
}
