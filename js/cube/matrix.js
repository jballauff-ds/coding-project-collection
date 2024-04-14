class Matrix {
  
  constructor(array, x, y){
    this.rows = x;
    this.cols = y;
    this.data = [];
    for(let i = 0; i < this.rows; i++) {
      this.data.push([])
      for(let j = 0; j < this.cols; j++) {
        this.data[i].push(array[this.rows*i + j]);
      }
    }
  }
  
  transpose(){
    let t = [];
    for(let i = 0; i < this.cols; i++) {
      let arr = []
      for(let j = 0; j < this.rows; j++) {
        arr.push(this.data[j][i])
      }
      t.push(arr);
    }
    this.data = t;
    let temp = this.rows;
    this.rows = this.cols;
    this.cols = temp;
  }
  
  reverseColumns() {
     for (let i = 0; i < this.cols; i++) {
        for (let j = 0, k = this.cols - 1; j < k; j++, k--) { 
                let temp = this.data[j][i]; 
                this.data[j][i] = this.data[k][i]; 
                this.data[k][i] = temp; 
            } 
      }
  }
  getData(){
    let out = new Array(this.rows*this.cols);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        out[i*this.rows+j] = this.data[i][j];
      }
    }
    return out;
  }
}