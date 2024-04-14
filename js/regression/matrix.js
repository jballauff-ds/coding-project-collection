class Matrix{
  
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.array = []
    for(let i = 0; i < rows; i++) {
      this.array.push([])
      for(let j = 0; j < cols; j++) {
        this.array[i].push(null);
      }
    }
  }
  
  
  determinant(){
    if(this.rows!=this.cols){
      throw new NumberFormatException("Error: must be a square marix of NxN");
    }
    let n = this.rows;
    if(n == 1){
      let d = this.array[0][0];
      return(d);
    }
    let sum = 0;
    for(let i = 0; i < n; i++){
      let m = this.createSubMatrix(i);
      sum += m.determinant() * pow(-1, i) * this.array[0][i];
    }
    return(sum);
  }
  
  createSubMatrix(p){
    if(this.rows!=this.cols){
      throw new NumberFormatException("Error: must be a square marix of NxN");
    }
    let m = new Matrix(this.rows-1, this.cols-1);
    let count = 0;
    for(let i = 1; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(j != p){
          m.array[i-1][count] = this.array[i][j];
          count++;
        }
      }
      count = 0;
    }
    return(m);
  }
  
  copyMatrix() {
    let m = new Matrix(this.rows,this.cols);
    for(let i = 0; i < m.rows; i++) {
      for(let j = 0; j < m.cols; j++) {
        m.array[i][j] = this.array[i][j];
      }
    }
    return(m);
  }
  

  printConsole() {
    console.log(this.array)
  }
  
}