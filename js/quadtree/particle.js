const SCALER = 3;
const BREAK_FORCE = 0.9;

class Particle {
  
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = size;
    this.speed = 10;
    this.alive = true;
    this.r = sqrt((size * SCALER)/2);
    this.cBox = new CollisionBox(this.r);
  }
  
  update() {
    this.move();
    this.wallCollision();
  }
  
  render() {
    ellipseMode(CENTER);
    noStroke();
    if(!this.alive) {
      fill(255);
    }else{
      fill(255,100);
    }
    circle(this.pos.x, this.pos.y, this.r*2);
  }
   
  wallCollision() {
    if(this.pos.x < 0 + this.r) {
      this.pos.x = 0 + this.r;
      this.vel.x *= -1;
    }
    if(this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    }
    if(this.pos.y < 0 + this.r) {
      this.pos.y = 0 + this.r;
      this.vel.y *= -1;
    }
    if(this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    }
  }
    
  applyForce(dir) {
    this.acc.add(dir);
  }
  
  move() {
    this.applyForce(p5.Vector.fromAngle(random(0,TWO_PI)).setMag(0.5));
    this.vel.add(this.acc);
    this.vel.limit(this.speed);
    this.pos.add(this.vel);
    this.vel.mult(BREAK_FORCE);
    this.acc.mult(0);
  }
  
  getSize(){
    return this.r;
  }
  
  getBox() {
    return this.cBox;
  }
  
  getPos() {
    return this.pos;
  }
}


function fuse(p1, p2) {
    if(!p1.alive | !p2.alive) {
      return;
    }
    let newSize = p1.size + p2.size;
    let newX = (p1.pos.x + p2.pos.x)/2;
    let newY = (p1.pos.y + p2.pos.y)/2;
    p1.alive = false;
    p2.alive = false;
    return(new Particle(newX, newY, newSize));
}


function burst(p) {
  if(!p.alive | p.size <= 1){
    return;
  }
  
  let newParticles = new Array(p.size);
  for(let i = 0; i < p.size; i++) {
    let newPos = p5.Vector.add(p.pos, p5.Vector.random2D().setMag(p.r));
    let dir = p5.Vector.sub(newPos, p.pos);
    let pNew = new Particle(newPos.x, newPos.y, 1);
    pNew.applyForce(dir.setMag(5));
    newParticles[i] = pNew;
  }
  p.alive = false;
  return newParticles;
}
  