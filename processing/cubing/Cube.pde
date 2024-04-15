float SIZE = 80;

class Cube {
  float rotation;
  boolean animating;
  int layerPos;
  int layerOrient;
  int[] activeLayer;
  int[] currentState;
  
  Element[] elements;
  
  Cube(){
    currentState = new int[27];
    elements = new Element[(int)pow(3,3)];
    layerOrient = 0;
    layerPos = 0;
    activeLayer = pickLayer(0);
    rotation = 0;
    animating = false;
    for(int i = 0; i < elements.length; i++){
      elements[i] = new Element(i);
      currentState[i] = i;
    }
    showSelectedLayer();
  }
  
  void randomize(){
    if(!animating) {
      for(int i = 0; i < 1000; i++){
        layerOrient = (int) random(3);
        layerPos = (int) random(3);
        int spin = (int) random(2) * 2 - 1;
        activeLayer = pickLayer(layerPos);
        showSelectedLayer();
        rotateLayer(spin);
      }
    }
  }
    
  void setLayerOrient(int n){
    if(!animating){
      layerOrient += n;
      if(layerOrient > 2) {
        layerOrient = 0;
      }
      if(layerOrient < 0) {
        layerOrient = 2;
      }
      activeLayer = pickLayer(layerPos);
      showSelectedLayer();
    }
  }
  
  void setLayerPos(int n){
    if(!animating){
      switch(layerOrient){
          case 0:
            layerPos = (int)n/9;
            break;
          case 1:
            layerPos = n%3;
            break;
          case 2:
            layerPos = floor(n/3)%3;
            break;
        }
      activeLayer = pickLayer(layerPos);
      showSelectedLayer();
    }
  }
  
  void inputRotate(int spin){
    println("test");
    animating = true;
    animateRotation(spin);
    if(!animating){
      rotateLayer(spin);
    }
  }
  
  void animateRotation(int spin){
    if(spin >= 0){  
      rotation += 0.005;
    }else{
      rotation -= 0.005;
    }
    if(rotation >= 1 || rotation <= -1){
      rotation = 0;
      animating = false;
    }
  }
 
  void render() {
    for(Element e : elements){
      pushMatrix();
      if(e.selected && animating){
        int spin = (int)(rotation/abs(rotation));
        inputRotate(spin);
        switch(layerOrient){
          case 0:
            rotateZ(-HALF_PI*rotation);
            break;
          case 1:
            rotateX(-HALF_PI*rotation);
            break;
          case 2:
            rotateY(-HALF_PI*rotation);
            break;
        }
      }
      e.render(); 
      popMatrix();
    }
  }
  
  void hideAllLayers(){
    for(Element e : elements){
      e.selected = false;
    }     
  }
  
  int[] pickLayer(int x){
    int[] indices = new int[9];
    int index = 0;
    for(int z = 0; z < 3; z++){
      for(int y = 0; y < 3; y++){
         switch (layerOrient) {
           case 0: index = 9*x + 3*y + z;
             break;
           case 1: index = 9*y + 3*z + x;
             break;
           case 2: index = 9*z + 3*x + y;
             break;
          }
        indices[3*z+y] = index;
      }
    }   
    return(indices);
  }
  
  void showSelectedLayer(){
  hideAllLayers();
    for(int i = 0; i < activeLayer.length; i++){
     for(Element e : elements){
       if(currentState[activeLayer[i]] == e.id){
         e.selected = true;
       }
     }
   }
  }
  
  void rotateLayer(int spin){
     int[] order = new int[activeLayer.length];
     for(int i = 0; i < order.length; i++){
       order[i] = currentState[activeLayer[i]];
     }
     Matrix m = new Matrix(order, 3, 3);
     if(spin >= 0){
       m.reverseColumns();
       m.transpose();
     }else{
       m.transpose();
       m.reverseColumns();
     }
     order = m.getData();   
     for(int i = 0; i < order.length; i++){
       currentState[activeLayer[i]] = order[i];
     } 
     moveElements(spin);
  }
  
  void moveElements(int spin){
    for(int i = 0; i < currentState.length; i++){
     for(Element e : elements){
       if(currentState[i] == e.id){
         e.changePos(i, layerOrient, spin);
       }
     }
   }
  }

  void printCube(float x, float y){
    boolean t = false;
    fill(255);
    for(int i = 0; i < currentState.length; i++){
      for(int j = 0; j < activeLayer.length; j++){
          if(activeLayer[j] == i){
            fill(255,0,0);
            text(currentState[i], x, y);
            x += 20;
            t = true;
          }
       }
         if(!t){
           text(currentState[i], x, y);
           x += 20;
         }
         t = false;
         fill(255);
      }
      println();
    }
}


///////////////////////////////////////////////////////////////////////////////


class Element {
  String[] sites;
  PVector pos;
  int id;
  boolean selected = false;
  Element(int n){
    sites = new String[] {"UP", "DOWN", "RIGHT", "LEFT", "FRONT", "BACK"};
    id = n;
    pos = place(n);
  }
  
  void changePos(int n, int direction, int spin){
    pos = place(n);
    if(selected){
      rotateBox(direction, spin);
    }
  }
  
  PVector place(int n){
    int x = 0, y = 0, z = 0;    
    outer: 
    for(int i = 0; i < 3; i++){
      y = 0;
       for(int j = 0; j < 3; j++){
        x = 0;
        for(int k = 0; k < 3; k++){
          if(n == 9*i + 3*j + k){
            break outer;
          }
          x++;
        }
        y++;
      }
      z++;
    }
    return(new PVector(x,y,z));
  }
  
  void rotateBox(int direction, int spin){
    switch(direction){
      case 0:
        rotateByX(spin);
        break;
      case 1:
        rotateByY(spin);
        break;
      case 2:
        rotateByZ(spin);
        break;
    }
  }
  
  void rotateByX(int spin){
    if(spin >= 0){
      String temp = sites[0];
      sites[0] = sites[2];
      sites[2] = sites[1];
      sites[1] = sites[3];
      sites[3] = temp;
    }else{
      String temp = sites[0];
      sites[0] = sites[3];
      sites[3] = sites[1];
      sites[1] = sites[2];
      sites[2] = temp;
    }   
   }
   
   void rotateByY(int spin){
     if(spin >= 0){
      String temp = sites[0];
      sites[0] = sites[5];
      sites[5] = sites[1];
      sites[1] = sites[4];
      sites[4] = temp;
     }else{
      String temp = sites[0];
      sites[0] = sites[4];
      sites[4] = sites[1];
      sites[1] = sites[5];
      sites[5] = temp;
    }  
   }
   
   void rotateByZ(int spin){
    if(spin >= 0){
      String temp = sites[2];
      sites[2] = sites[5];
      sites[5] = sites[3];
      sites[3] = sites[4];
      sites[4] = temp;
    }else{
      String temp = sites[2];
      sites[2] = sites[4];
      sites[4] = sites[3];
      sites[3] = sites[5];
      sites[5] = temp;
    }
   }
  
  void render(){
    for(int i = 0; i < sites.length; i++){
      pushMatrix();
      stroke(0);
      scale(SIZE);
      strokeWeight(10/SIZE);
      translate(pos.x-1, pos.y-1, pos.z-1);
      Plate p = new Plate(i, sites[i]);
      p.render(selected);
      popMatrix();
    } 
  }
}
