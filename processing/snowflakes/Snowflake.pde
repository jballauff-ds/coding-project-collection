class Snowflake {
  float x,y,size;
  ArrayList<Particle> particles;
  boolean finished, dispersing;
  int dispersingTicks;
  Particle current;
  
  Snowflake(float x, float y, float size){
    this.x = x;
    this.y = y;
    this.size = size;
    finished = false;
    dispersing = false;
    dispersingTicks = 120;
    particles = new ArrayList<Particle>();
    pushMatrix();
    translate(x,y);
    current = new Particle(size,random(10));
    popMatrix();
  }
  
  void testFinished(){
    if(particles.size() < 1) return;
    else if(particles.get(particles.size()-1).pos.x >= size)
      finished = true;
    else return;
  }
  
  void renderFreezeAnimation(){
    pushMatrix();
    translate(x,y);
    while(!current.arrived(particles)){
      current.update();
    }
    particles.add(current);
    testFinished();
    if(!finished){
      current = new Particle(size,random(10));
    }
    popMatrix();
  }
  
  void show(){
    pushMatrix();
    translate(x,y);
    for(int i = 0; i < 6; i++){
      rotate(TWO_PI/6);
      for(Particle p : particles){
        p.show();
      } 
      pushMatrix();
      scale(1,-1);
      for(Particle p : particles){
        p.show();
      }
      popMatrix();
    }
    popMatrix();
  }
  
  void disperse() {
    if(finished){
      dispersing = true;
    }
  }
  
  boolean disperseAnimation() {
    for(Particle p : particles) {
        p.disperse();
      }
    dispersingTicks--;
    return(dispersingTicks > 0);
  }
  
  
  boolean update(){
    if(!finished){
      renderFreezeAnimation();
      return true;
    }
    else if(dispersing){
      return disperseAnimation();
    }
    else{
    return(true);
    }
  }
}
  
