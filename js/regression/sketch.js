const X_MIN = 0,
  X_MAX = 1,
  Y_MIN = 0,
  Y_MAX = 1;
var data = [];
var data_m = listToMatrix(data);
var K = 1;

function setup() {
  createCanvas(720, 360);
  let title = createElement(
    "h2",
    "Exploring Gradient Descend (GD) and Ordinary Least Square (OLS) regression models"
  );
  let doc = createElement(
    "p",
    "Left click anywhere in the canvas to create a datapoint. Upon creating min. two datapoints OLS (green) and GD (blue) will be calculated. \
    Adding more datapoints will cause the models to update. <br> <br> Add or remove polynomials using the RIGHT/LEFT arrow keys <br><br> \
    Remove last datapoint with BACKSPACE <br><br> Press SPACE to reset<br><br> \
    Note: GS is an iterative ML process. For visualisation purposes, one iteration will run with each pass of the draw loop. Thus, in this implementation the model will become more accurate after some time. <br> \
    The source code does not use any additional math libraries and features a custom matrix class. So, it might be helpful if you want to see how these models are calculated"
  );

  title.style("color", "white");
  doc.style("color", "white");
  doc.style("display", "block");

  changes = false;
  ols = new OLS();
  gd = new GD();
}

function draw() {
  if (changes) {
    ols.resetModel();
    gd.resetModel();
    ols.regModel(data_m);
    changes = false;
  }
  gd.regModel(data_m);

  background(0);
  stroke(255);
  strokeWeight(5);
  renderData(data);

  ols.renderModel(2, color(0, 255, 0));
  gd.renderModel(2, color(0, 0, 255));
  ols.printParam(0, 32, 32, color(0, 255, 0));
  gd.printParam(0, 64, 32, color(0, 0, 255));
}

function keyPressed() {
  if (key == " ") {
    data = [];
    data_m = new Matrix(0, 0);
    ols.setK(1);
    gd.setK(1);
  }
  if (keyCode == BACKSPACE) {
    if (data.length > 0) {
      data.pop();
      data_m = listToMatrix(data);
      changes = true;
    }
  }
  if (keyCode == RIGHT_ARROW) {
    if (K < 5) {
      K++;
      gd.setK(K);
      ols.setK(K);
      changes = true;
    }
  }
  if (keyCode == LEFT_ARROW) {
    if (K > 1) {
      K--;
      gd.setK(K);
      ols.setK(K);
      changes = true;
    }
  }
}

function mousePressed() {
  let x = map(mouseX, 0, width, X_MIN, X_MAX);
  let y = map(mouseY, height, 0, Y_MIN, Y_MAX);
  data.push(createVector(x, y));
  data_m = listToMatrix(data);
  changes = true;
}

function renderData(d) {
  for (let i = 0; i < d.length; i++) {
    let x = map(d[i].x, X_MIN, X_MAX, 0, width);
    let y = map(d[i].y, Y_MIN, Y_MAX, height, 0);
    point(x, y);
  }
}

function listToMatrix(d) {
  let m = new Matrix(2, d.length);
  for (let i = 0; i < d.length; i++) {
    m.array[0][i] = d[i].x;
    m.array[1][i] = d[i].y;
  }
  return m;
}

function dynamicRightTextSize(s, size, x) {
  textSize(size);
  let newSize = size;
  let textLength = 0;
  let fit = true;
  do {
    for (let i = 0; i < s.length; i++) {
      let c = s.charAt(i);
      textLength += textWidth(c);
    }
    if (x + textLength > width) {
      newSize--;
      textSize(newSize);
      textLength = 0;
      fit = false;
    } else {
      fit = true;
    }
  } while (!fit);
  return newSize;
}
