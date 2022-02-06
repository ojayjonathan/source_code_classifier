import assert from "assert";
import Matrix from "../src/matrix.js";

describe("Matrix", () => {
  describe("Matrix new matrix ", () => {
    const matrix = new Matrix(3, 1);
    it("Matrix with 0s", () => {
      assert.equal(
        JSON.stringify(matrix.data),
        JSON.stringify([[0], [0], [0]])
      );
    });
  });
  describe("Matrix from array ", () => {
    it("matrix from 1d array", () => {
      const matrix = Matrix.fromArray([1, 2, 3]);
      assert.equal(
        JSON.stringify(matrix.data),
        JSON.stringify([[1], [2], [3]])
      );
    });
    it("matrix from 2d array", () => {
      const matrix = Matrix.fromArray([[1, 2, 3]]);
      assert.equal(JSON.stringify(matrix.data), JSON.stringify([[1, 2, 3]]));
    });
  });
  describe("Matrix operations", () => {
    const m1 = Matrix.fromArray([[1, 2, 3, 4]]);
    const m2 = Matrix.fromRandom(m1.cols, 1);
    const m3 = m1.concat(Matrix.fromArray([[1]]), 1);
    const m4 = m1.multiply(5);
    it("Matrix scaler multiplication", () => {
      assert.equal(JSON.stringify(m4.data), JSON.stringify([[5, 10, 15, 20]]));
    });
    it("Matrix concatination along a column", () => {
      assert.equal(JSON.stringify(m3.data), JSON.stringify([[1, 2, 3, 4, 1]]));
    });
    it("Two matrices multiplication", () => {
      assert.equal(m1.multiply(m1) instanceof Matrix, true);
    });
    it("Dot product", () => {
      assert.equal(Matrix.dot(m1, m2) instanceof Matrix, true);
    });
    it("Subtraction", () => {
      assert.equal(m1.subtract(m1) instanceof Matrix, true);
    });
    it("Subtraction", () => {
      assert.equal(m1.subtract(1) instanceof Matrix, true);
    });
  });
});
