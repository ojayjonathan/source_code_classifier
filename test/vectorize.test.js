import assert from "assert";
import Vectorizer from "../src/vectorizer.js";

describe("Vectorizer", () => {
  const vect = new Vectorizer();
  describe("label encoding", () => {
    const labels = ["python", "java", "css", "javascript"];
    vect.fitLabelEncoder(labels);
  });
});
