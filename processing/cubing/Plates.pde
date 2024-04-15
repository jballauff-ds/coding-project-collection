class Plate {
  int id;
  String pos;
  PVector[] vert;
  Plate(int id, String pos){
    this.id = id;
    this.pos = pos;
    vert = new PVector[4];
  }
  
  void switchColor(){
    switch(pos) {
      case "UP":
        fill(255); //white
        break;
      case "DOWN":
        fill(0,0,255); // blue
        break;
      case "RIGHT":
        fill(200,0,0); //red
        break;
      case "LEFT":
        fill(255,125,0); //orange
        break;
      case "FRONT":
        fill(0,175,50); //green
        break;
      case "BACK":
        fill(255,255,0); //yellow
        break;
    }
  }
  
  void switchPos(){
    float s = 0.5;
    switch(id){
      // Top
      case 0:
        vert[0] = new PVector(-s, -s, -s);
        vert[1] = new PVector( s, -s, -s);
        vert[2] = new PVector( s, -s,  s);
        vert[3] = new PVector(-s, -s,  s);
      break;
      // Bottom
      case 1:
        vert[0] = new PVector(-s,  s,  s);
        vert[1] = new PVector( s,  s,  s);
        vert[2] = new PVector( s,  s, -s);
        vert[3] = new PVector(-s,  s, -s);
      break;
      // Right
      case 2:
        vert[0] = new PVector( s, -s,  s);
        vert[1] = new PVector( s, -s, -s);
        vert[2] = new PVector( s,  s, -s);
        vert[3] = new PVector( s,  s,  s);
      break;
      // Left
      case 3:
        vert[0] = new PVector(-s, -s, -s);
        vert[1] = new PVector(-s, -s,  s);
        vert[2] = new PVector(-s,  s,  s);
        vert[3] = new PVector(-s,  s, -s);
      break;     
      // Front
      case 4:
        vert[0] = new PVector(-s, -s,  s);
        vert[1] = new PVector( s, -s,  s);
        vert[2] = new PVector( s,  s,  s);
        vert[3] = new PVector(-s,  s,  s);
      break;      
      // Back
      case 5:
        vert[0] = new PVector( s, -s, -s);
        vert[1] = new PVector(-s, -s, -s);
        vert[2] = new PVector(-s,  s, -s);
        vert[3] = new PVector( s,  s, -s);
      break;
    }
  }
  
  void render(boolean selected){
    switchColor();
    switchPos();
    
    if(selected){
      stroke(40);
    }
    beginShape(QUADS);
    vertex(vert[0].x, vert[0].y, vert[0].z);
    vertex(vert[1].x, vert[1].y, vert[1].z);
    vertex(vert[2].x, vert[2].y, vert[2].z);
    vertex(vert[3].x, vert[3].y, vert[3].z);
    endShape();
    
    if(!selected){
      noStroke();
      fill(0,75);
      beginShape(QUADS);
      vertex(vert[0].x, vert[0].y, vert[0].z);
      vertex(vert[1].x, vert[1].y, vert[1].z);
      vertex(vert[2].x, vert[2].y, vert[2].z);
      vertex(vert[3].x, vert[3].y, vert[3].z);
      endShape();
    }
  }
  
}
