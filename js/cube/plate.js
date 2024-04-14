
class Plate {
  constructor(id, pos){
    this.id = id;
    this.pos = pos;
    this.vert = new Array(4);
  }
  
  switchColor(){
    switch(this.pos) {
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
  
  switchPos(){
    let s = 0.5;
    switch(this.id){
      // Top
      case 0:
        this.vert[0] = createVector(-s, -s, -s);
        this.vert[1] = createVector( s, -s, -s);
        this.vert[2] = createVector( s, -s,  s);
        this.vert[3] = createVector(-s, -s,  s);
      break;
      // Bottom
      case 1:
       this. vert[0] = createVector(-s,  s,  s);
       this. vert[1] = createVector( s,  s,  s);
       this. vert[2] = createVector( s,  s, -s);
       this. vert[3] = createVector(-s,  s, -s);
      break;
      // Right
      case 2:
       this.vert[0] = createVector( s, -s,  s);
       this.vert[1] = createVector( s, -s, -s);
       this.vert[2] = createVector( s,  s, -s);
       this.vert[3] = createVector( s,  s,  s);
      break;
      // Left
      case 3:
        this.vert[0] = createVector(-s, -s, -s);
        this.vert[1] = createVector(-s, -s,  s);
        this.vert[2] = createVector(-s,  s,  s);
        this.vert[3] = createVector(-s,  s, -s);
      break;     
      // Front
      case 4:
        this.vert[0] = createVector(-s, -s,  s);
        this.vert[1] = createVector( s, -s,  s);
        this.vert[2] = createVector( s,  s,  s);
        this.vert[3] = createVector(-s,  s,  s);
      break;      
      // Back
      case 5:
        this.vert[0] = createVector( s, -s, -s);
        this.vert[1] = createVector(-s, -s, -s);
        this.vert[2] = createVector(-s,  s, -s);
        this.vert[3] = createVector( s,  s, -s);
      break;
    }
  }
  
  render(selected){
    this.switchColor();
    this.switchPos();
    if(selected){
      stroke(40);
    }
    beginShape(QUADS);
    vertex(this.vert[0].x, this.vert[0].y, this.vert[0].z);
    vertex(this.vert[1].x, this.vert[1].y, this.vert[1].z);
    vertex(this.vert[2].x, this.vert[2].y, this.vert[2].z);
    vertex(this.vert[3].x, this.vert[3].y, this.vert[3].z);
    endShape();
    
    if(!selected){
      noStroke();
      fill(0,75);
      beginShape(QUADS);
      vertex(this.vert[0].x, this.vert[0].y, this.vert[0].z);
      vertex(this.vert[1].x, this.vert[1].y, this.vert[1].z);
      vertex(this.vert[2].x, this.vert[2].y, this.vert[2].z);
      vertex(this.vert[3].x, this.vert[3].y, this.vert[3].z);
      endShape();
    }
  }
  
}