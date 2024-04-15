class Mapper{
  ArrayList<PVector> mappingPoints;
  PVector[] screenPos;
  int xDim, yDim, zDim, scaler;
  
  Mapper(int x, int y, int z, PVector init, int scl){
    mappingPoints = new ArrayList<PVector>();
    xDim = minVal(x);
    yDim = minVal(y);
    zDim = minVal(z);
    scaler = scl;
    generatePoints(init.mult(scaler), scaler);
    screenPos = new PVector[mappingPoints.size()];
    updateScreenPos();
  }
  
  int mapMouse() {
    updateScreenPos();
    return findClosestPoint();
  }
  
  int findClosestPoint() {
    float prevDist = width*height;
    float d;
    int pointIndex = 0;
    for(int i = 0; i < screenPos.length; i++){
      d = dist(screenPos[i].x, screenPos[i].y, mouseX, mouseY);
      if(d  < prevDist){
        pointIndex = i;
        prevDist = d;
      }
    }
    return pointIndex;
  }
  
  void updateScreenPos() {
    float x, y, z, sX, sY;
    for(int i = 0; i < screenPos.length; i++) {
      x = mappingPoints.get(i).x;
      y = mappingPoints.get(i).y;
      z = mappingPoints.get(i).z;
      sX = screenX(x, y, z);
      sY = screenY(x, y, z);
      screenPos[i] = new PVector(sX, sY);
    }
  }
  
  int minVal(int n){
    if(n <= 0){
      return(1);
    }else{
      return(n);
    }
  }
  
  void generatePoints(PVector init, int scl){ 
    mappingPoints.add(init);
    int totalDim = xDim*yDim*zDim;
    for(int i = 1; i < totalDim; i++){
      mappingPoints.add(setPosition(init, i, scl));
    }
  }
  
  PVector setPosition(PVector init, int n, int scl) {
  float x = init.x, y = init.y, z = init.z;    
    outer: 
    for(int i = 0; i < zDim; i++){
      y = init.y;
       for(int j = 0; j < yDim; j++){
        x = init.x;
        for(int k = 0; k < xDim; k++){
          if(n == xDim*yDim*i + xDim*j + k){
            break outer;
          }
          x+=scl;
        }
        y+=scl;
      }
      z+=scl;
    }
    return(new PVector(x, y, z));
  }
  
  void render() {
    int index = mapMouse();
    for(int i = 0; i < mappingPoints.size(); i++){
      stroke(255,0,0);
      if(i == index){
        stroke(255);
      }else if(i > 17){
        stroke(0,0,255);
      }else if(i > 8){
        stroke(0,255,0);
      }
      point(mappingPoints.get(i).x, mappingPoints.get(i).y, mappingPoints.get(i).z);
    }
  }
}
