class Cube {
  constructor(){
    this.currentState = new Array(27);
    this.elements = new Array(27);
    this.layerOrient = 0;
    this.layerPos = 0;
    this.activeLayer = this.pickLayer(0);
    this.rotation = 0;
    this.animating = false;
    for(let i = 0; i < this.elements.length; i++){
      this.elements[i] = new Element(i);
      this.currentState[i] = i;
    }
    this.showSelectedLayer();
  }

  setLayerOrient(n){
    if(!this.animating){
      this.layerOrient += n;
      if(this.layerOrient > 2) {
        this.layerOrient = 0;
      }
      if(this.layerOrient < 0) {
        this.layerOrient = 2;
      }
      this.activeLayer = this.pickLayer(this.layerPos);
      this.showSelectedLayer();
    }
  }
  
  setLayerPos(n){
    if(!this.animating){
      switch(this.layerOrient){
          case 0:
            this.layerPos = int(n/9);
            break;
          case 1:
            this.layerPos = n%3;
            break;
          case 2:
            this.layerPos = floor(n/3)%3;
            break;
        }
      this.activeLayer = this.pickLayer(this.layerPos);
      this.showSelectedLayer();
    }
  }
  
  inputRotate(spin){
    
    this.animating = true;
    this.animateRotation(spin);
    if(!this.animating){
      this.rotateLayer(spin);
    }
  }
  
  animateRotation(spin){
    if(spin >= 0){  
      this.rotation += ANIMATION_SPEED;
    }else{
      this.rotation -= ANIMATION_SPEED;
    }
    if(this.rotation >= 1 || this.rotation <= -1){
      this.rotation = 0;
      this.animating = false;
    }
  }
 
  render() {
    for(let i = 0; i < this.elements.length; i++){
      let e = this.elements[i];
      push();
      if(e.selected && this.animating){
        let spin = int(this.rotation/abs(this.rotation));
        this.inputRotate(spin);
        switch(this.layerOrient){
          case 0:
            rotateZ(-HALF_PI*this.rotation);
            break;
          case 1:
            rotateX(-HALF_PI*this.rotation);
            break;
          case 2:
            rotateY(-HALF_PI*this.rotation);
            break;
        }
      }
      e.render(); 
      pop();
    }
  }
  
  hideAllLayers(){
    for(let i = 0; i < this.elements.length; i++){
      this.elements[i].selected = false;
    }     
  }
  
  pickLayer(x){
    let indices = new Array(9);
    let index = 0;
    for(let z = 0; z < 3; z++){
      for(let y = 0; y < 3; y++){
         switch (this.layerOrient) {
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
    return indices;
  }
  
  showSelectedLayer(){
    this.hideAllLayers();
    for(let i = 0; i < this.activeLayer.length; i++){
     for(let j = 0; j < this.elements.length; j++){
       let e = this.elements[j];
       if(this.currentState[this.activeLayer[i]] == e.id){
         e.selected = true;
       }
     }
   }
  }
  
  rotateLayer(spin){
     let order = new Array(this.activeLayer.length);
     for(let i = 0; i < order.length; i++){
       order[i] = this.currentState[this.activeLayer[i]];
     }
     let m = new Matrix(order, 3, 3);
     if(spin > 0){
       m.reverseColumns();
       m.transpose();
     }else{
       m.transpose();
       m.reverseColumns();
     }
     order = m.getData();   
    for(let i = 0; i < order.length; i++){
       this.currentState[this.activeLayer[i]] = order[i];
     } 
     this.moveElements(spin);
  }
  
  moveElements(spin){
    for(let i = 0; i < this.currentState.length; i++){
     for(let j = 0; j < this.elements.length; j++){
       let e = this.elements[j];
       if(this.currentState[i] == e.id){
         e.changePos(i, this.layerOrient, spin);
       }
     }
   }
  }
}
