const FOOD_DISPLAY_SIZE = 30;
const STONE_DISPLAY_SIZE = 30;
const DISPLAY_ALPHA = 180;
const ERASER_SIZE = 40;
const TEXT_SIZE = 20;

class Cursor {
  constructor() {
    this.state = new FoodPlacement(this);
  }

  update() {
    this.state.update();
  }

  render() {
    this.state.render();
  }

  onMousePressed() {
    this.state.onMousePressed();
  }

  onMouseReleased() {
    this.state.onMouseReleased();
  }

  onKeyPressed(event) {
    this.state.onKeyPressed(event);
  }

  onKeyReleased(event) {
    this.state.onKeyReleased(event);
  }
}

class CursorState {
  constructor(cursor) {
    this.cursor = cursor;
    this.cBox = new CollisionBox(0);
    this.pos = createVector(mouseX, mouseY);
  }
  onMousePressed() {}
  onMouseReleased() {}
  onKeyPressed(event) {}
  onKeyReleased(event) {}

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
  }
  render() {}

  getBox() {
    return this.cBox;
  }

  getPos() {
    return this.pos;
  }
}

class FoodPlacement extends CursorState {
  constructor(cursor) {
    super(cursor);
    this.mouseDown = false;
    this.cBox = new CollisionBox(FOOD_SIZE);
    this.maxReached = false;
    this.overlap = false;
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    this.validPosition();
    if (this.maxReached) this.cursor.state = new MaxFoodDisplay(this.cursor);
    if (this.overlap) this.cursor.state = new IllegalFoodPlacement(this.cursor);
  }

  validPosition() {
    if (foodCount >= MAX_FOOD) {
      this.maxReached = true;
      return false;
    } else if (
      this.pos.x < FOOD_SIZE ||
      this.pos.x + FOOD_SIZE > width ||
      this.pos.y < FOOD_SIZE ||
      this.pos.y + FOOD_SIZE > height
    ) {
      this.overlap = true;
      return false;
    }
    for (let i = 0; i < entities.length; i++) {
      if (intersect(this, entities[i])) {
        this.overlap = true;
        return false;
      }
    }
    return true;
  }

  render() {
    fill(0, 150, 0, DISPLAY_ALPHA);
    noStroke();
    circle(this.pos.x, this.pos.y, FOOD_DISPLAY_SIZE);
  }

  onMousePressed() {
    this.mouseDown = true;
  }

  onMouseReleased() {
    if (this.mouseDown && this.validPosition()) {
      let food = new Food(this.pos.x, this.pos.y, FOOD_SIZE);
      placeEntity(food);
      foodCount++;
    }
    this.mouseDown = false;
  }

  onKeyPressed(event) {
    if (event.key == "Shift") {
      this.cursor.state = new StonePlacement(this.cursor);
    }
    if (event.key == "Control") {
      this.cursor.state = new Erase(this.cursor);
    }
  }
}

class StonePlacement extends CursorState {
  render() {
    fill(100, DISPLAY_ALPHA);
    noStroke();
    rect(
      this.pos.x - STONE_DISPLAY_SIZE / 3,
      this.pos.y - STONE_DISPLAY_SIZE / 3,
      STONE_DISPLAY_SIZE,
      STONE_DISPLAY_SIZE
    );
  }

  update() {
    if (stoneCount > MAX_STONE) {
      this.cursor.state = new MaxStoneDisplay(this.cursor);
    }
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    if (!this.validPosition()) {
      console.log("invalid");
      this.cursor.state = new IllegalStonePlacement(this.cursor);
    }
  }

  validPosition() {
    for (let i = 0; i < entities.length; i++) {
      let e = entities[i];
      if (!(e instanceof Home || e instanceof Food)) continue;
      if (dist(this.pos.x, this.pos.y, e.pos.x, e.pos.y) < e.r) return false;
    }
    return true;
  }

  onKeyReleased(event) {
    if (event.key == "Shift") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  onMousePressed() {
    this.cursor.state = new StoneDrag(this.cursor);
  }
}

class StoneDrag extends CursorState {
  constructor(cursor) {
    super(cursor);
    this.cBox = new CollisionBox(1, 1);
    this.origX = mouseX;
    this.origY = mouseY;
    this.overlap = false;
  }

  onKeyReleased(event) {
    if (event.key == "Shift") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  onMouseReleased() {
    if (!this.validPosition()) return;
    let stone = new Stone(this.pos.x, this.pos.y, this.cBox.w, this.cBox.h);
    placeEntity(stone);
    stoneCount++;
    this.cursor.state = new StonePlacement(this.cursor);
  }

  update() {
    if (stoneCount > MAX_STONE) {
      this.cursor.state = new MaxStoneDisplay(this.cursor);
    }
    this.cBox.w = abs(mouseX - this.origX);
    this.cBox.h = abs(mouseY - this.origY);
    this.pos.x = mouseX > this.origX ? this.origX : mouseX;
    this.pos.y = mouseY > this.origY ? this.origY : mouseY;
    this.validPosition();
    if (this.overlap) {
      let state = new IllegalStonePlacementDrag(this.cursor);
      state.origX = this.origX;
      state.origY = this.origY;
      state.pos = this.pos;
      state.cBox = this.cBox;
      this.cursor.state = state;
    }
  }

  validPosition() {
    for (let i = 0; i < entities.length; i++) {
      let e = entities[i];
      if (!(e instanceof Home || e instanceof Food)) continue;
      if (intersect(this, e)) {
        this.overlap = true;
        return false;
      }
    }
    return true;
  }

  render() {
    fill(100, DISPLAY_ALPHA);
    noStroke();
    rect(this.pos.x, this.pos.y, this.cBox.w, this.cBox.h);
  }
}

class MaxFoodDisplay extends CursorState {
  onKeyPressed(event) {
    if (event.key == "Shift") {
      this.cursor.state = new StonePlacement(this.cursor);
    }
    if (event.key == "Control") {
      this.cursor.state = new Erase(this.cursor);
    }
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    if (foodCount < MAX_FOOD) {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  render() {
    fill(200, DISPLAY_ALPHA);
    noStroke();
    circle(this.pos.x, this.pos.y, FOOD_DISPLAY_SIZE);
    fill(200, 0, 0);
    textAlign(CENTER, BOTTOM);
    textSize(TEXT_SIZE);
    text("max", this.pos.x, this.pos.y);
  }
}

class IllegalFoodPlacement extends CursorState {
  constructor(cursor) {
    super(cursor);
    this.cBox = new CollisionBox(FOOD_SIZE);
  }

  onKeyPressed(event) {
    if (event.key == "Shift") {
      this.cursor.state = new StonePlacement(this.cursor);
    }
    if (event.key == "Control") {
      this.cursor.state = new Erase(this.cursor);
    }
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    if (this.validPosition())
      this.cursor.state = new FoodPlacement(this.cursor);
  }

  validPosition() {
    if (
      this.pos.x < FOOD_SIZE ||
      this.pos.x + FOOD_SIZE > width ||
      this.pos.y < FOOD_SIZE ||
      this.pos.y + FOOD_SIZE > height
    ) {
      return false;
    }
    for (let i = 0; i < entities.length; i++) {
      if (intersect(this, entities[i])) {
        return false;
      }
    }
    return true;
  }

  render() {
    fill(200, DISPLAY_ALPHA);
    noStroke();
    circle(this.pos.x, this.pos.y, FOOD_DISPLAY_SIZE);
    fill(200, 0, 0);
    textAlign(CENTER, BOTTOM);
    textSize(TEXT_SIZE);
    text("area blocked", this.pos.x, this.pos.y);
  }
}

class MaxStoneDisplay extends CursorState {
  onKeyReleased(event) {
    if (event.key == "Shift") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  render() {
    fill(150, DISPLAY_ALPHA);
    noStroke();
    rect(
      this.pos.x - STONE_DISPLAY_SIZE / 3,
      this.pos.y - STONE_DISPLAY_SIZE / 3,
      STONE_DISPLAY_SIZE,
      STONE_DISPLAY_SIZE
    );
    fill(200, 0, 0);
    textAlign(CENTER, BOTTOM);
    textSize(TEXT_SIZE);
    text("max", this.pos.x, this.pos.y);
  }
}

class IllegalStonePlacement extends CursorState {
  render() {
    fill(100, 0, 0, DISPLAY_ALPHA);
    noStroke();
    rect(
      this.pos.x - STONE_DISPLAY_SIZE / 3,
      this.pos.y - STONE_DISPLAY_SIZE / 3,
      STONE_DISPLAY_SIZE,
      STONE_DISPLAY_SIZE
    );
    fill(200, 0, 0);
    textAlign(LEFT, BOTTOM);
    textSize(TEXT_SIZE);
    text("area blocked", this.pos.x, this.pos.y);
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    if (this.validPosition()) {
      this.cursor.state = new StonePlacement(this.cursor);
    }
  }

  validPosition() {
    for (let i = 0; i < entities.length; i++) {
      let e = entities[i];
      if (!(e instanceof Home || e instanceof Food)) continue;
      if (dist(this.pos.x, this.pos.y, e.pos.x, e.pos.y) < e.r) return false;
    }
    return true;
  }

  onKeyReleased(event) {
    if (event.key == "Shift") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }
}

class IllegalStonePlacementDrag extends CursorState {
  constructor(cursor) {
    super(cursor);
    this.cBox = new CollisionBox(1, 1);
    this.origX = mouseX;
    this.origY = mouseY;
  }

  onKeyReleased(event) {
    if (event.key == "Shift") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  onMouseReleased() {
    this.cursor.state = new FoodPlacement(this.cursor);
  }

  validPosition() {
    for (let i = 0; i < entities.length; i++) {
      let e = entities[i];
      if (!(e instanceof Home || e instanceof Food)) continue;
      if (intersect(this, e)) {
        return false;
      }
    }
    return true;
  }

  update() {
    this.cBox.w = abs(mouseX - this.origX);
    this.cBox.h = abs(mouseY - this.origY);
    this.pos.x = mouseX > this.origX ? this.origX : mouseX;
    this.pos.y = mouseY > this.origY ? this.origY : mouseY;
    if (this.validPosition()) {
      let state = new StoneDrag(this.cursor);
      state.origX = this.origX;
      state.origY = this.origY;
      state.pos = this.pos;
      state.cBox = this.cBox;
      this.cursor.state = state;
      this.cursor = state;
    }
  }

  render() {
    fill(100, 0, 0, DISPLAY_ALPHA);
    noStroke();
    rect(this.pos.x, this.pos.y, this.cBox.w, this.cBox.h);
    fill(200, 0, 0);
    textAlign(LEFT, BOTTOM);
    textSize(TEXT_SIZE);
    text("area blocked", this.pos.x, this.pos.y);
  }
}

class Erase extends CursorState {
  constructor(cursor) {
    super(cursor);
    this.selection = [];
    this.cBox = new CollisionBox(ERASER_SIZE / 2);
  }

  onMousePressed() {
    for (let i = 0; i < this.selection.length; i++) {
      this.selection[i].exists = false;
    }
  }

  onKeyReleased(event) {
    if (event.key == "Control") {
      this.cursor.state = new FoodPlacement(this.cursor);
    }
  }

  update() {
    this.selection = [];
    this.pos.x = mouseX;
    this.pos.y = mouseY;
    for (let i = 0; i < entities.length; i++) {
      let e = entities[i];
      if (!((e instanceof Food) | (e instanceof Stone))) continue;
      if (intersect(this, e)) {
        this.selection.push(e);
      }
    }
  }

  render() {
    noStroke();
    fill(200, 0, 0, 150);
    for (let i = 0; i < this.selection.length; i++) {
      let s = this.selection[i];
      if (s.cBox.isCircle) {
        circle(s.pos.x, s.pos.y, s.cBox.r * 2);
      } else {
        rect(s.pos.x, s.pos.y, s.cBox.w, s.cBox.h);
      }
    }
    fill(255, DISPLAY_ALPHA);
    stroke(255);
    strokeWeight(1.5);
    circle(this.pos.x, this.pos.y, ERASER_SIZE);
  }
}
