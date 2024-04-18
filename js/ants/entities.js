//home vars
const HOME_SIZE = 30;
const HOME_X = 50;
const HOME_Y = 200;

//food vars
const FOOD_SIZE = 15;
const FOOD_QUANT_SCALER = 30;

//pheromone vars;
const PHER_LIFE_FRAMES = 220;
const PHER_DEPOSIT_FRAMES = 10;
const PHER_SIZE = 1;

//sensor vars
const SENSOR_SIZE = 7;
const SENSOR_LENGTH = 20;
const SENSOR_ANGLE = 0.6;
const SENSOR_N = 3;

class Entity {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.r = size;
    this.cBox = new CollisionBox(this.r);
    this.exists = true;
  }

  getPos() {
    return this.pos;
  }

  getBox() {
    return this.cBox;
  }
  render() {}
}

class Home extends Entity {
  render() {
    noStroke();
    fill(150, 100, 20);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Food extends Entity {
  constructor(x, y, size) {
    super(x, y, size);
    this.capacity = size * FOOD_QUANT_SCALER;
  }

  reduce(x) {
    this.capacity -= x;
    let a = PI * this.r * this.r;
    let aNew = a * (this.capacity / (this.capacity + x));
    this.r = sqrt(aNew / PI);
    this.cBox.r = this.r;
    this.exists = this.capacity > 0;
  }

  render() {
    noStroke();
    fill(0, 100, 0);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Stone extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w);
    this.cBox = new CollisionBox(w, h);
    this.w = w;
    this.h = h;
  }

  render() {
    fill(100);
    noStroke();
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }
}

Entity.prototype.name = "default";
Home.prototype.name = "home";
Food.prototype.name = "food";
Stone.prototype.name = "stone";
