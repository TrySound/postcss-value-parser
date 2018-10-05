var test = require("tape");
var parse = require("../lib/parse");
var stringify = require("../lib/stringify");

var tests = [
  {
    message: "Should correctly add quotes",
    fixture:
      "bold italic 12px/3 'Open Sans', Arial, \"Helvetica Neue\", sans-serif"
  },
  {
    message: "Should not close unclosed strings",
    fixture: '" 12,  54, 65 '
  },
  {
    message: "Should correctly add brackets",
    fixture: " rgba( 12,  54, 65) "
  },
  {
    message: "Should not close unclosed functions",
    fixture: " rgba( 12,  54, 65 "
  },
  {
    message: "Should correctly process advanced gradients",
    fixture:
      "background-image:linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2) 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent),linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2))"
  },
  {
    message: "Should correctly add comments",
    fixture: "/*comment*/ 1px /* unclosed "
  },
  {
    message: "Should correctly process comments inside functions",
    fixture:
      "/*before*/ rgb( /*red component*/ 12,  54 /*green component*/, /* blue */ 65)/* after */ "
  }
];

test("Stringify", function(t) {
  t.plan(tests.length + 3);

  tests.forEach(function(opts) {
    t.equal(stringify(parse(opts.fixture)), opts.fixture, opts.message);
  });

  var tokens = parse(" rgba(12,  54, 65 ) ");

  t.equal(
    stringify(tokens, function(node) {
      if (node.type === "function") {
        return (
          node.value +
          "[" +
          [node.nodes[0].value, node.nodes[2].value, node.nodes[4].value].join(
            ","
          ) +
          "]"
        );
      }
    }),
    " rgba[12,54,65] "
  );

  t.equal(
    stringify(tokens[1], function(node) {
      if (node.type === "function") {
        return (
          node.value +
          "[" +
          [node.nodes[0].value, node.nodes[2].value, node.nodes[4].value].join(
            ","
          ) +
          "]"
        );
      }
    }),
    "rgba[12,54,65]"
  );

  tokens[1].type = "word";
  t.equal(stringify(tokens), " rgba ", "Shouldn't process nodes of work type");
});
