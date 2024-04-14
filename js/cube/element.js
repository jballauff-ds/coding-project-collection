
class Element {
  
  constructor(n){
    this.sites = ["UP", "DOWN", "RIGHT", "LEFT", "FRONT", "BACK"];
    this.id = n;
    this.selected = false;
    this.pos = this.place(n);  
  }
  
  place(n){
    
    //n = DIMS*DIMS*z + DIMS*y + x;
    let x = 0;
    let y = 0;
    let z = 0;
    
    outer: for(let i = 0; i < 3; i++){
      y = 0;
       for(let j = 0; j < 3; j++){
        x = 0;
        for(let k = 0; k < 3; k++){
          if(n == 9*i + 3*j + k){
            break outer;
          }
          x++;
        }
        y++;
      }
      z++;
    }
    return createVector(x,y,z);
  }
  
  changePos(n, direction, spin){
    this.pos = this.place(n);
    if(this.selected){
      this.rotateBox(direction, spin);
    }
  }
  
  rotateBox(direction, spin){
    switch(direction){
      case 0:
        this.rotateByX(spin);
        break;
      case 1:
        this.rotateByY(spin);
        break;
      case 2:
        this.rotateByZ(spin);
        break;
    }
  }
  
  rotateByX(spin){
    if(spin >= 0){
      let temp = this.sites[0];
      this.sites[0] = this.sites[2];
      this.sites[2] = this.sites[1];
      this.sites[1] = this.sites[3];
      this.sites[3] = temp;
    }else{
      let temp = this.sites[0];
      this.sites[0] = this.sites[3];
      this.sites[3] = this.sites[1];
      this.sites[1] = this.sites[2];
      this.sites[2] = temp;
    }   
   }
   
   rotateByY(spin){
     if(spin >= 0){
      let temp = this.sites[0];
      this.sites[0] = this.sites[5];
      this.sites[5] = this.sites[1];
      this.sites[1] = this.sites[4];
      this.sites[4] = temp;
     }else{
      let temp = this.sites[0];
      this.sites[0] = this.sites[4];
      this.sites[4] = this.sites[1];
      this.sites[1] = this.sites[5];
      this.sites[5] = temp;
    }  
   }
   
   rotateByZ(spin){
    if(spin >= 0){
      let temp = this.sites[2];
      this.sites[2] = this.sites[5];
      this.sites[5] = this.sites[3];
      this.sites[3] = this.sites[4];
      this.sites[4] = temp;
    }else{
      let temp = this.sites[2];
      this.sites[2] = this.sites[4];
      this.sites[4] = this.sites[3];
      this.sites[3] = this.sites[5];
      this.sites[5] = temp;
    }
   }
  
  render(){
    for(let i = 0; i < this.sites.length; i++){
      push();
      stroke(0);
      scale(SIZE);
      strokeWeight(SIZE/10);
      translate(this.pos.x-1, this.pos.y-1, this.pos.z-1);
      let p = new Plate(i, this.sites[i]);
      p.render(this.selected);
      pop();
    } 
  }
  
}