var test = require("tape");
var unit = require("../lib/unit");

var tests = [
  {
    fixture: ".23rem",
    expected: { number: ".23", unit: "rem" }
  },
  {
    fixture: ".2.3rem",
    expected: { number: ".2", unit: ".3rem" }
  },
  {
    fixture: "2.",
    expected: { number: "2.", unit: "" }
  },
  {
    fixture: "+2.",
    expected: { number: "+2.", unit: "" }
  },
  {
    fixture: "-2.",
    expected: { number: "-2.", unit: "" }
  },
  {
    fixture: "+-2.",
    expected: false
  },
  {
    fixture: ".",
    expected: false
  },
  {
    fixture: ".rem",
    expected: false
  },
  {
    fixture: "1e4px",
    expected: { number: "1e4", unit: "px" }
  },
  {
    fixture: "1em",
    expected: { number: "1", unit: "em" }
  },
  {
    fixture: "1e10",
    expected: { number: "1e10", unit: "" }
  },
  {
    fixture: "",
    expected: false
  },
  {
    fixture: "e",
    expected: false
  },
  {
    fixture: "e1",
    expected: false
  }
];

test("Unit", function(t) {
  t.plan(tests.length);

  tests.forEach(function(item) {
    t.deepEqual(unit(item.fixture), item.expected);
  });
});
