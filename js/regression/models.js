 class Regression {

  constructor(){
    this.k = 1;
    this.poly = Array(this.k+1).fill(0);
    this.error = 0;
    this.init = false;
  }
  
  applyModel(x){
    let y = 0;
    for(let i = 0; i <= this.k; i++){
        y += this.poly[i]*pow(x,i);
      }
    return y;
  }
  
  calculateError(data_matrix){
    let e = 0;
    let xi, yi, yMod;
    for(let i = 0; i < data_matrix.cols; i++){
      xi = data_matrix.array[0][i];
      yi = data_matrix.array[1][i];
      yMod = this.applyModel(xi);
      e += pow(yi-yMod,2);
    }
    return e;
  }
  
  renderModel(weight, col){
    if(this.init){
      strokeWeight(weight);
      stroke(col);
      noFill();
      beginShape();
      for (let i = X_MIN; i <= X_MAX+0.0001; i += (X_MAX-X_MIN)*0.05) {
        let xi = i;
        let yi = this.applyModel(xi);    
        xi = map(xi, X_MIN, X_MAX, 0, width);
        yi = map(yi, Y_MIN, Y_MAX, height, 0);
        vertex(xi,yi);
      }
      endShape();
    }
  }
  
  printParam(x, y, size, col){
    let string;
    if(this.init){
      string = "f(x) = ";
      for(let i = 0; i <= this.k; i++){
        let cov = nf(this.poly[i], 0, 2);
        string += cov;
        if(i > 1){
          string += "x^" + i;
        }else if(i == 1){
          string += "x";
        }
        if(i < this.k && this.poly[i+1] > 0){
          string += "+";
        }
      }
      string += " ERR: " + nf(this.error,0,2);   
    } else {
      string = "NaN";
    }
    noStroke();
    fill(col);
    let newSize = dynamicRightTextSize(string, size, x);
    textSize(newSize);
    textAlign(LEFT);
    text(string, x, y);
  }
  
  resetModel(){
    this.poly = Array(this.k+1).fill(0);
    this.error = 0;
    this.init = false;
  }
  
  setK(k) {
    this.k = k;
    this.resetModel();
  }
}

class GD extends Regression{
  
  constructor(){
    super();
    this.r = 0.1;
    this.t = 1;
  }
  
  regModel(data_matrix){
    if(data_matrix.cols >= 2){
      this.init = true;
      for(let i = 0; i < data_matrix.cols; i++){ 
        let xi = data_matrix.array[0][i];
        let yi = data_matrix.array[1][i];
        let guess = 0;
        let e = 0;
        for(let j = 0; j <= this.k; j++){
          guess += this.poly[j]*pow(xi, j);
        }
        e += yi - guess;
        for(let j = 0; j <= this.k; j++){
          this.poly[j] = this.poly[j] + (e * pow(xi, j)) * this.r;
        }
      }
    }
    this.error = this.calculateError(data_matrix);
  }
}

class OLS extends Regression {
  constructor(){
    super();
  }
  
  regModel(data_matrix){
    if(data_matrix.cols >= 2){
      this.init = true;
      let m = new Matrix(this.k+1, this.k+1);
      //let b = new Matrix(this.k+1, 1);
      let N = data_matrix.cols;
      //let sum_m, sum_b, m_det, mi_det;
      
      for(let i = 0; i <= this.k; i++){
        for(let j = 0; j <= this.k; j++){
          let sum_m = 0;
          for(let l = 0; l < N; l++){
            sum_m += pow(data_matrix.array[0][l],i+j);
          }
          m.array[i][j] = sum_m;
        }
      }
      console.log(m)
      
      let b = new Matrix(this.k+1, 1);
      for(let i = 0; i <= this.k; i++){
        let sum_b = 0;
        for(let j = 0; j < N; j++){
          sum_b += pow(data_matrix.array[0][j],i)*data_matrix.array[1][j];
        }
        b.array[i][0] = sum_b;
      }
      console.log(b)
      let m_det = m.determinant();
      for(let i = 0; i <= this.k; i++){
        let mi = m.copyMatrix();
        for(let j = 0; j <= this.k; j++){
          mi.array[j][i] = b.array[j][0];
        }
        let mi_det = mi.determinant();
        this.poly[i] = mi_det/m_det;
      } 
    }
    this.error = this.calculateError(data_matrix);
  }
}