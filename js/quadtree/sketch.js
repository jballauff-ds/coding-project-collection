let button;

function setup() {
  createCanvas(600, 600);
  qt = new QuadTree(width / 2, height / 2, width / 2, height / 2, 4);
  entities = [];
  newParticles = [];
  for (let i = 0; i < 25; i++) {
    entities.push(new Particle(random(width), random(height), 50));
  }
  showQT = false;

  heading = createElement("h2", "Burst the bubbles by clicking the canvas!")
    .style("color", "white")
    .position(10, height);

  button = createButton("show Quadtree");
  button.position(width - 100);
  button.mousePressed(showTree);

  doc = createElement(
    "p",
    "This sketch features my implementation of a <a href = 'https://en.wikipedia.org/wiki/Quadtree' target='_blank'> Quadtree </a> - a recursive data structure that can help to e.g. massively reduce the number of calculations in collision detection. <br><br>\
In this example a lot of collidable particles can exist without reducing performance. The Quadtree can be visualized by clicking the button. <br><br>\
The quadtree.js can be used in any other project. It can handle circular and rectangular collison boxes. Collidable objects need a 'CollisionBox' member variable as well as a 'getBox' and 'getPos' method that returns the CollisionBox object and the position in the Quadtree respectively"
  )
    .position(20, height + 80)
    .style("text-align", "justify")
    .style("color", "white");
}

function draw() {
  background(0);

  qt = new QuadTree(width / 2, height / 2, width / 2, height / 2, 4);
  entities = entities.concat(newParticles);

  for (let i = 0; i < entities.length; i++) {
    let e = entities[i];
    e.update();
    qt.insert(e);
  }

  newParticles = [];

  for (let i = 0; i < entities.length; i++) {
    let e = entities[i];
    let others = qt.query(e);
    for (let j = 0; j < others.length; j++) {
      let c = others[j];
      if ((e != c) & intersect(e, c)) {
        let n = fuse(e, c);
        if (n != null) {
          newParticles.push(n);
        }
      }
    }
  }

  for (let i = 0; i < entities.length; i++) {
    if (!entities[i].alive) {
      entities.splice(i, 1);
    }
  }

  for (let i = 0; i < entities.length; i++) {
    entities[i].render();
  }

  if (showQT) {
    qt.render();
  }
}

function mousePressed() {
  if ((mouseX < 0) | (mouseX > width) | (mouseY < 0) | (mouseY > height)) {
    return;
  }
  for (let i = 0; i < entities.length; i++) {
    let e = entities[i];
    let children = burst(e);
    if (children != null) {
      newParticles = newParticles.concat(children);
    }
  }
}

function showTree() {
  showQT = !showQT;
  if (showQT) {
    button.html("Hide Quadtree");
  } else {
    button.html("Show Quadtree");
  }
}
