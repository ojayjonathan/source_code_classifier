import assert from "assert";

class Vectorizer {
  vocabulary = {};
  sequenceLength = 100;
  labelToNumeric = {};
  labelFromNumeric = {};

  fit(documents = [[]]) {
    let n = 0;
    for (let i = 0; i < documents.length; ++i) {
      const tokens = new Set(documents[i]);
      tokens.forEach((token) => {
        this.vocabulary[token] = n;
        n += 1;
      });
    }
    console.log(n);
  }
  transform(documents = [[]]) {
    const transformed = [];
    for (let i = 0; i < documents.length; ++i) {
      let document = documents[i];
      for (let j = 0; j < document.length; j++) {
        document[j] = this.vocabulary[document[j]] | 0;
      }
      transformed.push(document);
    }

    return transformed;
  }
  toTrainSequence(documents = [[]], labels = [], sequenceLength = 100) {
    this.sequenceLength = sequenceLength;
    const sequence = [];
    const sequenceLabels = [];
    for (let i = 0; i < documents.length; i++) {
      let document = documents[i];
      for (let n = 0; n < document.length; n += this.sequenceLength) {
        let sub_sequence = document.slice(n, n + this.sequenceLength);
        if (sub_sequence.length < this.sequenceLength) {
          let pad_length = this.sequenceLength - sub_sequence.length;
          sub_sequence = sub_sequence.concat(Array(pad_length).fill(0));
        }
        sequence.push(sub_sequence);
        sequenceLabels.push(labels[i]);
      }
    }
    assert.equal(sequenceLabels.length, sequence.length);
    return {
      labels: sequenceLabels,
      features: sequence,
    };
  }
  toSequence(documents = [[]]) {
    const sequence = [];
    for (let i = 0; i < documents.length; i++) {
      let document = documents[i];
      let sub_sequence = document.slice(0, n + this.sequenceLength);
      if (sub_sequence.length < this.sequenceLength) {
        let pad_length = this.sequenceLength - sub_sequence.length;
        sub_sequence = sub_sequence.concat(Array(pad_length).fill(0));
      }
    }
    return sequence;
  }
  loadVocabulary(vocabulary) {
    this.vocabulary = vocabulary;
  }
  fitLabelEncoder(labels = []) {
    let uniqueLabels = new Set(labels);
    uniqueLabels = Array.from(uniqueLabels);
    const l = uniqueLabels.length;
    for (let i = 0; i < l; ++i) {
      this.labelToNumeric[uniqueLabels[i]] = i;
      this.labelFromNumeric[i] = uniqueLabels[i];
    }
  }
  transformLabels(labels = []) {
    const hotOneEncodings = [];
    const l = Object.keys(this.labelToNumeric).length;
    for (const label in this.labelToNumeric) {
      const value = this.labelToNumeric[label];
      const encoding = Array(l).fill(0);
      encoding[value] = 1;
      hotOneEncodings[label] = encoding;
    }
    labels = labels.map((label) => hotOneEncodings[label]);
    return labels;
  }
}

export default Vectorizer;
