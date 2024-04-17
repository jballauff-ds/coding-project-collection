class QuadTree {
  //QuadTree nw, ne, sw, se;

  constructor(x, y, w, h, n) {
    this.leaf = new QtLeaf(x, y, w, h);
    this.capacity = n;
    this.divided = false;
    this.data = [];
  }

  insert(c) {
    if (!intersect(this.leaf, c)) {
      return;
    }
    if (this.data.length < this.capacity) {
      this.data.push(c);

      return;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      this.nw.insert(c);
      this.ne.insert(c);
      this.sw.insert(c);
      this.se.insert(c);
    }
  }

  subdivide() {
    let leafW = this.leaf.getBox().w / 2;
    let leafH = this.leaf.getBox().h / 2;
    let west = this.leaf.pos.x;
    let east = this.leaf.pos.x + leafW;
    let north = this.leaf.pos.y;
    let south = this.leaf.pos.y + leafH;

    this.nw = new QuadTree(west, north, leafW, leafH, this.capacity);
    this.ne = new QuadTree(east, north, leafW, leafH, this.capacity);
    this.sw = new QuadTree(west, south, leafW, leafH, this.capacity);
    this.se = new QuadTree(east, south, leafW, leafH, this.capacity);
    this.divided = true;
  }

  query(a, collidables) {
    if (collidables == undefined) {
      var collidables = [];
    }
    if (!intersect(a, this.leaf)) {
      return collidables;
    } else {
      for (let i = 0; i < this.data.length; i++) {
        let c = this.data[i];
        if (intersect(a, c)) {
          collidables.push(c);
        }
      }
      if (this.divided) {
        this.nw.query(a, collidables);
        this.ne.query(a, collidables);
        this.sw.query(a, collidables);
        this.se.query(a, collidables);
      }
      return collidables;
    }
  }

  render() {
    strokeWeight(4);
    stroke(255, 0, 0);
    for (let i = 0; i < this.data.length; i++) {
      let o = this.data[i];
      let x = o.getPos().x;
      let y = o.getPos().y;
      point(x, y);
    }
    strokeWeight(2);
    stroke(255);
    this.leaf.render();
    if (this.divided) {
      this.nw.render();
      this.ne.render();
      this.sw.render();
      this.se.render();
    }
  }
}

class CollisionBox {
  constructor(w, h) {
    if (h == undefined) {
      this.r = w;
      this.isCircle = true;
    } else {
      this.w = w;
      this.h = h;
      this.isCircle = false;
    }
  }
}

class QtLeaf {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.cBox = new CollisionBox(w, h);
  }

  getPos() {
    return this.pos;
  }

  getBox() {
    return this.cBox;
  }

  collisionEvent(c) {}

  render() {
    noFill();
    rect(this.pos.x, this.pos.y, this.cBox.w, this.cBox.h);
  }
}

function intersect(a, b) {
  let x1 = a.getPos().x;
  let x2 = b.getPos().x;
  let y1 = a.getPos().y;
  let y2 = b.getPos().y;
  if (a.getBox().isCircle && b.getBox().isCircle) {
    let r1 = a.getBox().r;
    let r2 = b.getBox().r;
    return dist(x1, y1, x2, y2) < r1 + r2;
  } else if (a.getBox().isCircle && !b.getBox().isCircle) {
    let r = a.getBox().r;
    let w = b.getBox().w;
    let h = b.getBox().h;
    let closestX = clamp(x1, x2, x2 + w);
    let closestY = clamp(y1, y2, y2 + h);
    let dX = x1 - closestX;
    let dY = y1 - closestY;
    return dX * dX + dY * dY < r * r;
  } else if (!a.getBox().isCircle && b.getBox().isCircle) {
    let r = b.getBox().r;
    let w = a.getBox().w;
    let h = a.getBox().h;
    let closestX = clamp(x2, x1, x1 + w);
    let closestY = clamp(y2, y1, y1 + h);
    let dX = x2 - closestX;
    let dY = y2 - closestY;
    return dX * dX + dY * dY < r * r;
  } else if (!a.getBox().isCircle && !b.getBox().isCircle) {
    let w1 = a.getBox().w;
    let h1 = a.getBox().h;
    let w2 = b.getBox().w;
    let h2 = b.getBox().h;
    let cond1 = x1 + w1 < x2;
    let cond2 = x1 > x2 + w2;
    let cond3 = y1 + h1 < y2;
    let cond4 = y1 > y2 + h2;
    return !(cond1 || cond2 || cond3 || cond4);
  } else {
    return false;
  }

  function clamp(val, minVal, maxVal) {
    return max(minVal, min(maxVal, val));
  }
}
