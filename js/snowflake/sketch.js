const R = 2;
let flake;

function setup() {
  createCanvas(450, 450);
  let doc = createElement(
    "p",
    "Generate a unique Snowflake!<br><br>\
    After its done, left click to redraw"
  );
  doc.style("color", "white");
  doc.style("display", "block");

  flake = new Snowflake(
    width / 2,
    height / 2,
    int(random((width / 2) * 0.75, (width / 2) * 0.9))
  );
}

function draw() {
  background(0);
  let existing = flake.update();
  if (!existing) {
    flake = new Snowflake(
      width / 2,
      height / 2,
      int(random((width / 2) * 0.75, (width / 2) * 0.9))
    );
  }
  flake.show();
}

function mousePressed() {
  flake.disperse();
}

class Snowflake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.finished = false;
    this.dispersing = false;
    this.dispersingTicks = 120;
    this.particles = [];
    push();
    translate(this.x, this.y);
    this.current = new Particle(this.size, random(10));
    pop();
  }

  testFinished() {
    if (this.particles.length < 1) {
      return;
    } else if (this.particles[this.particles.length - 1].pos.x >= this.size) {
      this.finished = true;
    } else return;
  }

  renderFreezeAnimation() {
    push();
    translate(this.x, this.y);
    while (!this.current.arrived(this.particles)) {
      this.current.update();
    }
    this.particles.push(this.current);
    this.testFinished();
    if (!this.finished) {
      this.current = new Particle(this.size, random(10));
    }
    pop();
  }

  show() {
    push();
    translate(this.x, this.y);
    for (let i = 0; i < 6; i++) {
      rotate(TWO_PI / 6);
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
      push();
      scale(1, -1);
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
      pop();
    }
    pop();
  }

  disperse() {
    if (this.finished) {
      this.dispersing = true;
    }
  }

  disperseAnimation() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].disperse();
    }
    this.dispersingTicks--;
    return this.dispersingTicks > 0;
  }

  update() {
    if (!this.finished) {
      this.renderFreezeAnimation();
      return true;
    } else if (this.dispersing) {
      return this.disperseAnimation();
    } else {
      return true;
    }
  }
}

class Particle {
  constructor(x, y) {
    this.desolver = 2;
    this.pos = createVector(x, y);
    this.disperser = p5.Vector.random2D();
    this.a = 255;
  }

  update() {
    this.pos.x -= 1;
    this.pos.y += random(-4, 4);
    let angle = this.pos.heading();
    angle = constrain(angle, 0, TWO_PI / 6);
    let magnitude = this.pos.mag();
    this.pos = p5.Vector.fromAngle(angle);
    this.pos.setMag(magnitude);
  }

  show() {
    fill(255, this.a);
    noStroke();
    ellipse(this.pos.x, this.pos.y, R * 2, R * 2);
  }

  arrived(snowflake) {
    for (let i = 0; i < snowflake.length; i++) {
      let p = snowflake[i];
      let d = dist(p.pos.x, p.pos.y, this.pos.x, this.pos.y);
      if (d <= 2 * R) {
        return true;
      }
    }
    return this.pos.x < 1;
  }

  disperse() {
    this.pos.add(this.disperser);
    this.a -= this.desolver;
  }
}
