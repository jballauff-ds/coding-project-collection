let frames = [];
let fps = -1;

const MAX_FOOD = 5;
const MAX_STONE = 10;

function setup() {
  createCanvas(400, 400);
  button = createButton("show pheromone trail");
  button.position(width - 130);
  button.mousePressed(showPher);

  createElement(
    "h3",
    "Click to place food - watch the ants get organized!<br><br>\
  To easy? - Hold Shift + LMB and drag to place barriers!<br><br>\
  Hold CTRL to erase food and barriers!"
  )
    .style("color", "white")
    .position(20, height + 25);

  doc = createElement(
    "p",
    "The ‘ants’ are autonomous agents that can perceive their environment in a limited field ahead of them. \
      Initially they wander around aimlessly while dropping ‘home-markers’ (i.e. ‘pheromone’). \
      If they run into food, they will start to follow the higher concentration of ‘home-markers’ in their field of view. They will also start to drop ‘food-markers’. \
      Ants that are not carrying food will follow theses markers. Ants have a certain probability to deviate from this behaviour and wander of randomly, allowing for the formation of new paths. <br><br>\
      Even though this simulation is a strong oversimplification how ants in the real world organize, these few rules are enough to form a complex system. \
      This small sketch was inspired by <a href = 'https://www.youtube.com/watch?v=81GQNPJip2Y' target = '_blank'> this </a> impressive project by johnBuffer."
  )
    .position(20, height + 180)
    .style("text-align", "justify")
    .style("color", "white");
  cursor = new Cursor();
  entities = [];
  ants = [];
  homePher = [];
  foragePher = [];
  foodCount = 0;
  stoneCount = 0;
  showTrail = false;

  home_x = random(0 + 2 * HOME_SIZE, width - 2 * HOME_SIZE);
  home_y = random(0 + 2 * HOME_SIZE, height - 2 * HOME_SIZE);

  entities.push(new Home(home_x, home_y, HOME_SIZE));

  for (let i = 0; i < 100; i++) {
    let startPosition = createVector(home_x, home_y).add(
      p5.Vector.random2D().setMag(HOME_SIZE + 2)
    );
    ants.push(new Ant(startPosition.x, startPosition.y, ANT_SIZE));
  }
}

function draw() {
  background(0);
  cursor.update();

  for (let i = entities.length - 1; i > -1; i--) {
    let e = entities[i];
    if (!e.exists) {
      if (e.name == "food") foodCount--;
      if (e.name == "stone") stoneCount--;
      entities.splice(i, 1);
    }
  }

  homeQt = new QuadTree(0, 0, width, height, 4);
  forageQt = new QuadTree(0, 0, width, height, 4);
  strokeWeight(2);
  stroke(0, 100, 250);
  updatePher(homePher, homeQt);
  stroke(200, 0, 0);
  updatePher(foragePher, forageQt);

  for (let i = 0; i < ants.length; i++) {
    let a = ants[i];
    for (let j = 0; j < entities.length; j++) {
      let e = entities[j];
      if (!e.exists) continue;
      if (checkEntityCollisions(a, e)) a.collisionEvent(e);
    }
  }

  for (let i = 0; i < ants.length; i++) {
    let a = ants[i];
    a.update();

    if (a.ticker % ANT_DECISION_FRAMES == 0) {
      checkPriority(a);
      if (a.priority == null) {
        let qt = a.carryFood ? homeQt : forageQt;
        for (let j = 0; j < SENSOR_N; j++) {
          a.sensors[j].score = qt.query(a.sensors[j]).length;
        }
      }
      a.chooseDirection();
    }

    if (a.ticker % PHER_DEPOSIT_FRAMES == 0 && a.capacity > 0) {
      let pher = a.carryFood ? foragePher : homePher;
      pher.push(new Pheromone(a.pos.x, a.pos.y));
      a.capacity--;
    }

    a.render();
  }
  for (i = 0; i < entities.length; i++) {
    entities[i].render();
  }
  cursor.render();

  frames.push(frameRate());
  if (frames.length > 30 || fps < 0) {
    let sum = 0;
    for (let i = 0; i < frames.length; i++) {
      sum += frames[i];
    }
    fps = sum / frames.length;
    frames = [];
  }
  textSize(16);
  noStroke(255);
  fill(255);
  textAlign(LEFT, BOTTOM);
  text("FPS: " + floor(fps), 10, 20);
}

function checkEntityCollisions(a, e) {
  if (e.cBox.isCircle) {
    return dist(a.pos.x, a.pos.y, e.pos.x, e.pos.y) < e.r;
  } else {
    return (
      (a.pos.x > e.pos.x) &
      (a.pos.x < e.pos.x + e.w) &
      (a.pos.y > e.pos.y) &
      (a.pos.y < e.pos.y + e.h)
    );
  }
}

function updatePher(pher, qt) {
  for (let i = pher.length - 1; i > -1; i--) {
    let p = pher[i];
    p.update();
    if (p.lifetime > PHER_LIFE_FRAMES || !qt.insert(pher[i])) pher.splice(i, 1);
    else if (showTrail) p.render();
  }
}

function checkPriority(ant) {
  for (let i = 0; i < ant.sensors.length; i++) {
    let sensor = ant.sensors[i];
    for (let j = 0; j < entities.length; j++) {
      let e = entities[j];
      if (!e.exists) {
        continue;
      }
      if (intersect(sensor, e)) {
        if (
          (ant.carryFood && e.name == "home") |
          (!ant.carryFood && e.name == "food")
        ) {
          ant.priority = e.pos;
          return;
        }
      }
    }
  }
  ant.priority = null;
}

function placeEntity(e) {
  for (let i = 0; i < ants.length; i++) {
    let a = ants[i];
    if (checkEntityCollisions(a, e)) {
      let startPosition = createVector(home_x, home_y).add(
        p5.Vector.random2D().setMag(HOME_SIZE + 2)
      );
      a.respawn(startPosition.x, startPosition.y);
    }
  }
  entities.push(e);
}

function showPher() {
  showTrail = !showTrail;
  if (showTrail) {
    button.html("hide pheromone trail");
  } else {
    button.html("show pheromone trail");
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    cursor.onMousePressed();
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    cursor.onMouseReleased();
  }
}

function keyPressed(event) {
  cursor.onKeyPressed(event);
}

function keyReleased(event) {
  cursor.onKeyReleased(event);
}
