class Matrix {
  /**
   *
   * @param {number} rows
   * @param {Number} cols
   * @param {Number} n : fill the matrix with the given number
   */
  constructor(rows, cols, n = 0) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows)
      .fill(n)
      .map((_) => Array(cols).fill(0));
  }
  get shape() {
    return [this.rows, this.cols];
  }
  get length() {
    return this.rows;
  }
  /**
   *
   * @param {Array} array : generates a matrix object
   * @returns
   */
  static fromArray(array) {
    let rows = array.length;
    if (array[0] instanceof Array) {
      let cols = array[0].length;
      return new Matrix(rows, cols).map((_, i, j) => array[i][j]);
    }
    return new Matrix(rows, 1).map((_, i, j) => array[i]);
  }
  map(callback = (val) => val) {
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; ++j) {
        this.data[i][j] = callback(this.data[i][j], i, j);
      }
    }
    return this;
  }
  log(n = 10) {
    console.table(this.data.slice(0, n));
    return this;
  }

  static fromRandom(rows, cols, minVal = -1, maxVal = 1) {
    const matrix = new Matrix(rows, cols);
    const range = maxVal - minVal;
    return matrix.map(() => Math.random() * range + minVal);
  }
  divide(n) {
    return Matrix.fromArray(this.data).map((val) => val / n);
  }
  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log("Columns and Rows of A must match Columns and Rows of B.");
        return;
      }
      return Matrix.fromArray(this.data).map((e, i, j) => e + n.data[i][j]);
    } else {
      return Matrix.fromArray(this.data).map((e) => e + n);
    }
  }
  concat(n, axis = 0) {
    let newData;
    if (axis === 0) {
      if (this.cols !== n.cols) {
        console.log("Row  of A must match Rows  of B.");
        return;
      }
      newData = this.data.concat(n);
      // this.rows += n.rows;
    } else {
      if (this.rows !== n.rows) {
        console.log("Columns  of A must match Columns  of B.");
        return;
      }
      newData = this.data.map((arr, i) => arr.concat(n.data[i]));
      // this.cols += n.cols;
    }
    return Matrix.fromArray(newData);
  }

  static dot(a, b) {
    // Matrix dot product
    if (a.cols !== b.rows) {
      console.log("Columns of A must match rows of B.");
      return;
    }

    return new Matrix(a.rows, b.cols).map((e, i, j) => {
      // Dot product of values in col
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }

      return sum;
    });
  }
  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows).map(
      (_, i, j) => matrix.data[j][i]
    );
  }
  transpose() {
    return new Matrix(this.cols, this.rows).map((_, i, j) => this.data[j][i]);
  }
  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log("Columns and Rows of A must match Columns and Rows of B.");
        return;
      }

      return Matrix.fromArray(this.data).map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return Matrix.fromArray(this.data).map((e) => e * n);
    }
  }
  subtract(n) {
    if (n instanceof Matrix) {
      return Matrix.fromArray(this.data).map((val, i, j) => val - n.data[i][j]);
    }
    return Matrix.fromArray(this.data).map((val, i, j) => val - n);
  }
  copy() {
    return Matrix.fromArray(this.data);
  }
  sum() {
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; ++j) {
        sum += this.data[i][j];
      }
    }
    return sum;
  }
}

export default Matrix;
