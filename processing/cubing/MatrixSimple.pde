class Matrix {
  int[][] data;
  int rows;
  int cols;
  
  Matrix(int[] array, int x, int y){
    rows = x;
    cols = y;
    data = new int[rows][cols];
    for(int i = 0; i < rows; i++){
      for(int j = 0; j < cols; j++){
        data[i][j] = array[rows*i + j];
      }
    }
  }
  
  void transpose(){
    int[][] t = new int[cols][rows];
    for(int i = 0; i < rows; i++){
      for(int j = 0; j < cols; j++){
        t[j][i] = data[i][j];
      }
    }
    data = t;
    int temp = rows;
    rows = cols;
    cols = temp;
  }
  
  void reverseColumns() {
     for (int i = 0; i < cols; i++) {
        for (int j = 0, k = cols - 1; 
                 j < k; j++, k--) { 
                int temp = data[j][i]; 
                data[j][i] = data[k][i]; 
                data[k][i] = temp; 
            } 
      }
  }
  
  void printConsole(){
    for(int i = 0; i < rows; i++){
      for(int j = 0; j < cols; j++){
        print(data[i][j]+" ");
      }
      println();
    }
    println("____");
  }
  
  int[] getData(){
    int[] out = new int[rows*cols];
    for(int i = 0; i < rows; i++){
      for(int j = 0; j < cols; j++){
        out[i*rows+j] = data[i][j];
      }
    }
    return(out);
  }
}
