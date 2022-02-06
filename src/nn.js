import Matrix from "./matrix.js";
import { nextBatch } from "./util.js";
/**
 * A neural network with an architecture from given layers
 */
class NeuralNetwork {
  /**
   *@typedef {Object} Param
   * @property {double} lr : rate weights will be updated
   * @property {Array}  layers : neural network layers
   * specifying the number of nodes eg [256,64,32,10] will give 256 - 64 - 32 - 10 architecture
   * where 256 is the input layer and 10 output layer
   */
  /**
   * 
   * @param {Param}  args
   */
  constructor({ lr = 0.005, layers }) {
    this.lr = lr;
    this.layers = layers;
    this.weights = [];
    // Generates weights for each of hidden layers. Etra node is added foe the
    //  bias

    for (let i = 0; i < this.layers.length - 2; ++i) {
      this.weights.push(
        Matrix.fromRandom(layers[i] + 1, layers[i + 1] + 1).divide(
          Math.sqrt(this.layers[i])
        )
      );
    }
    //Generates weights for the   last layer.Bias in not needed
    const l = layers.length;
    const w = Matrix.fromRandom(layers[l - 2] + 1, layers[l - 1]).divide(
      Math.sqrt(this.layers[l - 2])
    );
    this.weights.push(w);
  }
  /**
   *
   * @param {Matrix} x : input feature matrix
   * @param {Matrix} y : class labels matrix
   */
  partialFit(x, y) {
    //A - output prediction of each layer
    const A = [x.copy()];
    // Foward propagation - pass through each layer, computer the prediction for that
    // layer.Prediction previous layer is used as input for current layer
    for (let i = 0; i < this.weights.length; ++i) {
      // prediction of layers[i]
      const net = Matrix.dot(A[i], this.weights[i]);
      const out = this.sigmoid_activation(net);
      A.push(out);
    }

    // back propagation - compute the error of the last layer, use it to update
    // each of the layers.
    // The delta which = output for each layer * derivative of activation function
    const error = A[A.length - 1].subtract(y);
    // D- output for each layer * derivative of activation function
    let D = [error.multiply(this.sigmoid_deriv(A[A.length - 1]))];
    for (let i = this.weights.length - 1; i > 0; --i) {
      let delta = Matrix.dot(D[D.length - 1], this.weights[i].transpose());
      delta = delta.multiply(this.sigmoid_deriv(A[i]));
      D.push(delta);
    }
    // update weights using the deltas at each layer
    D = D.reverse();
    for (let i = 0; i < this.weights.length; ++i) {
      let gradient = Matrix.dot(A[i].transpose(), D[i]).multiply(-this.lr);
      this.weights[i] = this.weights[i].add(gradient);
    }
  }
  /**
   *
   * @param {Matrix} x : input feature matrix
   * @param {Matrix} y : class labels matrix
   * @param {number} epochs : number of iterations
   * @param {number} dispalyUpdates : nth step to display updates
   * @param {Matrix} xVal : validation input feature matrix
   * @param {Matrix} yVal : validation labels matrix
   * @param {number} batchSize : batchSize
   */
  fit({ x, y, epochs = 100, dispalyUpdates = 10, xVal, yVal, batchSize = 32 }) {
    //Add  bias to train data
    x = x.concat(new Matrix(x.rows, 1), 1);
    const steps = Math.ceil(y.rows / batchSize);
    for (let i = 0; i < epochs; ++i) {
      let trainLoss = 0,
        trainAcc = 0;
      let iterator = nextBatch(x.data, y.data, batchSize);
      for (let data of iterator) {
        let x = Matrix.fromArray(data[0]);
        let y = Matrix.fromArray(data[1]);
        this.partialFit(x, y);
      }
      // Dispay updates after n iterations
      if ((i + 1) % dispalyUpdates == 0 || i == 1) {
        iterator = nextBatch(x.data, y.data, batchSize);
        let n = 1;
        let message;
        for (let data of iterator) {
          let x = Matrix.fromArray(data[0]);
          let y = Matrix.fromArray(data[1]);
          //calculate loss
          const preds = this.predict(x);
          let loss = y.subtract(preds).map((val) => val ** 2);
          trainLoss += loss.sum() / y.rows;
          trainAcc += this.accuracy(this.argmax(preds), this.argmax(y));
          message = `[INFO] epoch ${i + 1} ${n}/${steps}, loss ${(
            trainLoss / n
          ).toFixed(5)}, acc ${(trainAcc / n).toFixed(2)}%`;
          n += 1;
          process.stdout.write(message + "\r");
        }
        if (xVal && yVal) {
          iterator = nextBatch(xVal.data, yVal.data, batchSize);
          let valLoss = 0;
          let valAcc = 0;
          n = 1;
          for (let data of iterator) {
            let x = Matrix.fromArray(data[0]);
            let y = Matrix.fromArray(data[1]);
            const preds = this.predict(x, true);
            let loss = y.subtract(preds).map((val) => val ** 2);
            valLoss += loss.sum() / yVal.rows;
            valAcc += this.accuracy(this.argmax(preds), this.argmax(y));
            let m = `, val_loss ${(valLoss / n).toFixed(5)}, val_accuracy ${(
              valAcc / n
            ).toFixed(2)}%`;
            n += 1;
            process.stdout.write(message + m + "\r");
          }
        }
        process.stdout.write("\n");
      }
    }
  }
  /**
   *
   * @param {Matrix} x : input feature matrix
   * @param {boolean} addBias : specify if bias term is added to the matrix
   */
  predict(x, addBias = false) {
    if (addBias) {
      const bias = new Matrix(x.rows, 1);
      x = x.concat(bias, 1);
    }
    let p = x;
    for (let layer = 0; layer < this.weights.length; ++layer) {
      p = this.sigmoid_activation(Matrix.dot(p, this.weights[layer]));
    }
    return p;
  }
  /**
   *
   * @param {Matrix} x : feature matrix
   */
  sigmoid_activation(matrix) {
    return matrix.map((val) => 1 / (1 + Math.exp(-val)));
  }
  loadWeights(wights) {
    this.weights = this.weights;
  }
  calculateLoss(X, target) {
    const preds = this.predict(X);
    let loss = target.subtract(preds).map((val) => val ** 2);
    return loss.sum() / target.rows;
  }
  gradient() {}
  /**
   *
   * @param {Matrix} prediction : model output targets
   * @param {Matrix} action : action class targets
   */
  accuracy(preds, actual) {
    let a = 0;
    for (let i = 0; i < preds.length; ++i) {
      if (preds[i] == actual[i]) {
        a += 1;
      }
    }
    return (a / preds.length) * 100;
  }
  toString() {
    return `NeuralNetwork:${this.layers.join("-")}`;
  }
  softmax_activation(matrix) {
    matrix.data = matrix.data.map((arr) => {
      const sum = [...arr].reduce(
        (partialSum, a) => partialSum + Math.exp(a),
        0
      );
      arr = arr.map((a) => Math.exp(a) / sum);
      return arr;
    });
    return matrix;
  }
  /**
   *
   * @param {Matrix} x : feature matrix
   */
  sigmoid_deriv(matrix) {
    return matrix.map((val) => val * (1 - val));
  }
  /**
   *
   * @param {Matrix} x : model output matrix
   */
  argmax(matrix) {
    return matrix.data.map((arr) => arr.indexOf(Math.max(...arr)));
  }
  categoricalCrossentropyLoss(actualMatrix, modelOutputMatrix) {
    /**
     * Loss=−i=1∑sizeoutput​​yi​⋅logy^​i
     */
    const loss = actualMatrix.map(
      (val, i, j) => -val * Math.log(modelOutputMatrix.data[i][j])
    );
    return loss.data.map((arr) =>
      arr.reduce((partialSum, i) => partialSum + i, 0)
    );
  }
}
export default NeuralNetwork;
