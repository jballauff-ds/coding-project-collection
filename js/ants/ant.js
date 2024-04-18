//ant vars
const ANT_SIZE = 5;
const ANT_MAX_SPEED = 1;
const ANT_MAX_FORCE = 0.5;
const ANT_DECISION_FRAMES = 5;
const ANT_RANDOM_WANDER = 0.1;
const ANT_PHER_CAPACITY = 200;

class Ant extends Entity {
  constructor(x, y, size) {
    super(x, y, size);
    this.vel = p5.Vector.random2D().setMag(ANT_MAX_SPEED);
    this.acc = createVector(0, 0);
    this.ticker = 0;
    this.carryFood = false;
    this.sensors = [];
    this.priority = null;
    this.capacity = ANT_PHER_CAPACITY;

    for (let i = 0; i < SENSOR_N; i++) {
      let sensor = createVector(SENSOR_LENGTH, 0)
        .rotate(this.vel.heading() + SENSOR_ANGLE * (i - 1))
        .add(this.pos);
      this.sensors.push(new Sensor(sensor.x, sensor.y));
    }
  }

  seek(target) {
    let steering = p5.Vector.sub(target, this.pos)
      .setMag(ANT_MAX_SPEED)
      .sub(this.vel)
      .limit(ANT_MAX_FORCE);
    this.applyForce(steering);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  wander() {
    return floor(random() * this.sensors.length);
  }

  chooseDirection() {
    if (this.priority != null) {
      this.seek(this.priority);
      return;
    }
    let dir;
    if (random() < ANT_RANDOM_WANDER) {
      dir = this.wander();
    } else {
      let maxScore = 0;
      let candidates = [];
      for (let i = 0; i < this.sensors.length; i++) {
        let score = this.sensors[i].score;
        if (score == maxScore) {
          candidates.push(i);
        } else if (score > maxScore) {
          candidates = [];
          candidates.push(i);
          maxScore = score;
        }
      }
      dir = candidates[floor(random() * candidates.length)];
    }
    let target = this.sensors[dir].pos;
    this.seek(target);
  }

  wallCollision() {
    if (
      (this.pos.x <= 0) |
      (this.pos.x > width) |
      (this.pos.y < 0) |
      (this.pos.y > height)
    ) {
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);
      this.vel.mult(-1); //.rotate(random(-HALF_PI, HALF_PI));
    }
  }

  collisionEvent(c) {
    this.pos.sub(this.vel);
    this.vel.mult(-1); //.rotate(random(-HALF_PI, HALF_PI));
    this.updateSensors();
    this.priority = null;
    if (c.name == "home") {
      this.carryFood = false;
      this.capacity = ANT_PHER_CAPACITY;
    }
    if (c.name == "food" && !this.carryFood) {
      this.carryFood = true;
      c.reduce(1);
      this.capacity = ANT_PHER_CAPACITY;
    }
  }

  updateSensors() {
    for (let i = 0; i < this.sensors.length; i++) {
      let sensor = createVector(SENSOR_LENGTH, 0).rotate(
        this.vel.heading() + SENSOR_ANGLE * (i - 1)
      );
      this.sensors[i].pos = sensor.add(this.pos);
    }
  }

  renderSensors() {
    for (let i = 0; i < this.sensors.length; i++) {
      let sensor = this.sensors[i];
      let val = constrain(sensor.score, 0, 10);
      fill(map(val, 0, 10, 50, 255));
      circle(sensor.pos.x, sensor.pos.y, SENSOR_SIZE * 2);
    }
  }

  update() {
    this.ticker++;
    if (this.ticker == ANT_DECISION_FRAMES * PHER_DEPOSIT_FRAMES) {
      this.ticker = 0;
    }

    this.wallCollision();

    this.vel.add(this.acc).limit(ANT_MAX_SPEED);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.updateSensors();
  }

  render() {
    noStroke();
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    if (this.carryFood) {
      fill(0, 200, 0);
      circle(this.r, 0, 5);
    }
    pop();
  }

  respawn(x, y) {
    this.pos.x = x;
    this.pos.y = y;
    this.vel = p5.Vector.random2D().setMag(ANT_MAX_SPEED);
    this.acc = createVector(0, 0);
    this.ticker = 0;
    this.carryFood = false;
    this.priority = null;
    this.capacity = ANT_PHER_CAPACITY;
  }
}

class Pheromone extends Entity {
  constructor(x, y) {
    super(x, y, PHER_SIZE);
    this.lifetime = 0;
  }

  update() {
    this.lifetime++;
  }

  render() {
    point(this.pos.x, this.pos.y);
  }
}

class Sensor extends Entity {
  constructor(x, y) {
    super(x, y, SENSOR_SIZE);
    this.score = 0;
    this.priority = 0;
  }
}

Ant.prototype.name = "ant";
Sensor.prototype.name = "sensor";
