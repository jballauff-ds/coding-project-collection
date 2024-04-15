class Particle {
  final static int desolver = 2;
  PVector pos;
  PVector disperser;
  int alpha;
  
  Particle(float x, float y){
    pos = new PVector(x,y);
    disperser = PVector.random2D().setMag(1);
    alpha = 255;
  }
  
  void update() {
    pos.x -= 1;
    pos.y += random(-4,4);
    float angle = pos.heading();
    angle = constrain(angle,0,TWO_PI/6);
    float magnitude = pos.mag();
    pos = PVector.fromAngle(angle);
    pos.setMag(magnitude);
  }
  
  void show() {
    fill(255, alpha);
    noStroke();
    ellipse(pos.x,pos.y,R*2,R*2);
  }
  
  boolean arrived(ArrayList<Particle> snowflake) {
    for(Particle p : snowflake){
        float d = dist(p.pos.x, p.pos.y, this.pos.x, this.pos.y);
        if(d <= 2*R){
          return(true);
        }
    }
    return(pos.x < 1);
  }
  
  void disperse() {
    pos.add(disperser);
    alpha -= desolver;
  }
}
