import Re from "../src/re.js";
import assert from "assert";

const re = new RegExp(Re.comment, "s");
const tests = [
  ["//hellow \n", true],
  ["//hellow \n", true],
  ["/* \n heloow */", true],
  ["# hellow \n", true],
  ["/ hellow \n", false],
  ["/* hellow \n", false],
  ["''' hellow \n '''", true],
  ['""" hellow \n """', true],
  ['""" hellow \n', false],
];
tests.map(
  (t) =>
    describe("Regex", function () {
      it(t[0], function () {
        assert.equal(re.test(t[0]), t[1]);
      });
    })
);
