import Re from "./re.js";
import fs from "fs";

export function tokenizer(data) {
  // console.log(data);
  const regex = new RegExp(Re.comment, "g");
  //remove comments
  data = data.replace(regex, "");
  return data.split(/\s+/);
}

export function readFiles(dirname) {
  const data = [];
  const filenames = fs.readdirSync(dirname);
  for (let i = 0; i < filenames.length; ++i) {
    const content = fs.readFileSync(dirname + filenames[i], "utf-8");
    data.push(content);
  }
  return data;
}

export function shuffle() {
  let n = 0;
  while (n < arguments[0].length) {
    const random = Math.floor(Math.random() * arguments[0].length);
    for (let i = 0; i < arguments.length; ++i) {
      if (arguments[i].length > n) {
        [arguments[i][n], arguments[i][random]] = [
          arguments[i][random],
          arguments[i][n],
        ];
      }
    }
    n += 1;
  }
  return [...arguments];
}

export function* nextBatch(x, y, batchSize) {
  let start = 0;
  while (start < x.length) {
    yield [
      x.slice(start, start + batchSize),
      y.slice(start, start + batchSize),
    ];
    start += batchSize;
  }
}
export function* next(x, batchSize) {
  let start = 0;
  while (start < x.length) {
    yield [
      x.slice(start, start + batchSize),
    ];
    start += batchSize;
  }
}
