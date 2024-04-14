const modular = 300;
var factor = 1;
var increment = 0.005;
var R;

function setup() {
  createCanvas(450, 450);

  let title = createElement(
    "h2",
    "Visual representation of a Multiplication Table"
  );
  let doc = createElement(
    "p",
    "Nodes represent a fixed number of values mapped on a circle using polar coordinates. Each number is multiplied with a fixed factor and an edge is drawn between the number and the respective result (results larger than the maximum value wrap around). The factor is incremented slightly each frame. The color of nodes and edges is determined by the edge length of the outgoing node. <br><br> For more watch the <a href='https://www.youtube.com/watch?v=bl3nc_a1nvs' target=”_blank”> coding challenge </a> by Dan Shiffman"
  );
  title.style("color", "white");
  doc.style("color", "white");
  doc.style("display", "block");

  R = (width - 20) / 2;
  colorMode(HSB, 2 * R, 100, 100, 100);
}

function draw() {
  translate(width / 2, height / 2);
  background(0);
  for (let i = 0; i < modular; i++) {
    let a1 = map(i, 0, modular, 0, TWO_PI);
    let a2 = map(i * factor, 0, modular, 0, TWO_PI);
    let x = R * cos(a1);
    let y = R * sin(a1);
    let nX = R * cos(a2);
    let nY = R * sin(a2);
    stroke(dist(x, y, nX, nY), 100, 100);
    fill(dist(x, y, nX, nY), 100, 100);
    circle(x, y, 5);
    line(x, y, nX, nY);
  }
  factor += increment;
}
