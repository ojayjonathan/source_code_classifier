import fs from "fs";
import Matrix from "./matrix.js";
import NeuralNetwork from "./nn.js";
import { tokenizer, readFiles, shuffle } from "./util.js";
import Vectorizer from "./vectorizer.js";

function main() {
  const BASE_DATA_DIR = "./data/";
  let features = [];
  let labels = [];
  const data = {};
  try {
    const dirnames = fs.readdirSync(BASE_DATA_DIR);
    dirnames.map((dirname) => {
      let dirContent = readFiles(BASE_DATA_DIR + dirname + "/");
      features = features.concat(dirContent);
      labels = labels.concat(Array(dirContent.length).fill(dirname));
    });
  } catch (e) {
    console.log(e);
    process.exit();
  }
  const vect = new Vectorizer();
  features = features.map((str) => tokenizer(str));
  vect.fit(features);
  features = vect.transform(features);
  vect.fitLabelEncoder(labels);

  let trainData = vect.toTrainSequence(features, labels, 50);

  const [x, y] = shuffle(
    trainData.features,
    vect.transformLabels(trainData.labels)
  );

  const trainSize = Math.floor(x.length * 0.75);
  const xTrain = Matrix.fromArray(x.slice(0, trainSize));
  const yTrain = Matrix.fromArray(y.slice(0, trainSize));

  const xVal = Matrix.fromArray(x.slice(trainSize));
  const yVal = Matrix.fromArray(y.slice(trainSize));

  console.log(`Train shape ${xTrain.shape}`);
  console.log(`validation shape ${xVal.shape}`);
  
  const nn = new NeuralNetwork({
    layers: [xTrain.cols, 128, 64, 32, yTrain.cols],
    lr: 0.00005,
  });

  nn.fit({
    x: xTrain,
    y: yTrain,
    epochs: 100,
    dispalyUpdates: 10,
    xVal: xVal,
    yVal: yVal,
  });
}
main();
