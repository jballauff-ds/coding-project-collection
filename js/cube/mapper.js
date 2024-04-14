class Mapper{
  //ArrayList<PVector> mappingPoints;
  //PVector[] screenPos;
  //int xDim, yDim, zDim, scaler;
  
  constructor(x, y, z, init, scl){
    this.mappingPoints = [];
    this.scaler = scl;
    this.xDim = this.minVal(x);
    this.yDim = this.minVal(y);
    this.zDim = this.minVal(z);
    this.generatePoints(init.mult(this.scaler), this.scaler);
    this.screenPos = new Array(this.mappingPoints.length);
    this.updateScreenPos();
  }
  
  minVal(n){
    if(n <= 0){
      return(1);
    }else{
      return(n);
    }
  }
  
  generatePoints(init, scl){ 
    this.mappingPoints.push(init);
    let totalDim = this.xDim*this.yDim*this.zDim;
    for(let i = 1; i < totalDim; i++){
      this.mappingPoints.push(this.setPosition(init, i, scl));
    }
  }
  
  setPosition(init, n, scl) {
    let x = init.x;
    let y = init.y; 
    let z = init.z;    
    outer: for(let i = 0; i < this.zDim; i++){
      y = init.y;
       for(let j = 0; j < this.yDim; j++){
        x = init.x;
        for(let k = 0; k < this.xDim; k++){
          if(n == this.xDim*this.yDim*i + this.xDim*j + k){
            break outer;
          }
          x+=scl;
        }
        y+=scl;
      }
      z+=scl;
    }
    return createVector(x, y, z);
  }
  
  mapMouse() {
    this.updateScreenPos();
    return this.findClosestPoint();
  }
  
  findClosestPoint() {
    let prevDist = width*height;
    let d;
    let pointIndex = 0;
    for(let i = 0; i < this.screenPos.length; i++){
      d = dist(this.screenPos[i].x, this.screenPos[i].y, mouseX - width/2, mouseY - height/2);
      if(d  < prevDist){
        pointIndex = i;
        prevDist = d;
      }
    }
    return pointIndex;
  }
  
  updateScreenPos() {
    for(let i = 0; i < this.screenPos.length; i++) {
      let x = this.mappingPoints[i].x;
      let y = this.mappingPoints[i].y;
      let z = this.mappingPoints[i].z;
      let sX = screenPosition(x, y, z).x;
      let sY = screenPosition(x, y, z).y;
      this.screenPos[i] = createVector(sX, sY);
    }
  }
  
  
  render() {
    let index = this.mapMouse();
    for(let i = 0; i < this.mappingPoints.length; i++){
      stroke(255,0,0);
      if(i == index){
        stroke(255);
      }else if(i > 17){
        stroke(0,0,255);
      }else if(i > 8){
        stroke(0,255,0);
      }
      point(this.mappingPoints[i].x, this.mappingPoints[i].y, this.mappingPoints[i].z);
    }
  }
  
}