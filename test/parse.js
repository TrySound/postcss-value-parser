var test = require("tape");
var parse = require("../lib/parse");

var tests = [
  {
    message: "should correctly process empty input",
    fixture: "",
    expected: []
  },
  {
    message: "should process escaped parentheses (open)",
    fixture: "\\(",
    expected: [{ type: "word", sourceIndex: 0, value: "\\(" }]
  },
  {
    message: "should process escaped parentheses (close)",
    fixture: "\\)",
    expected: [{ type: "word", sourceIndex: 0, value: "\\)" }]
  },
  {
    message: "should process escaped parentheses (both)",
    fixture: "\\(\\)",
    expected: [{ type: "word", sourceIndex: 0, value: "\\(\\)" }]
  },
  {
    message: "should process escaped parentheses (both)",
    fixture: "\\( \\)",
    expected: [
      { type: "word", sourceIndex: 0, value: "\\(" },
      { type: "space", sourceIndex: 2, value: " " },
      { type: "word", sourceIndex: 3, value: "\\)" }
    ]
  },
  {
    message: "should process unopened parentheses as word",
    fixture: "() )wo)rd)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: "",
        after: "",
        nodes: []
      },
      { type: "space", sourceIndex: 2, value: " " },
      { type: "word", sourceIndex: 3, value: ")wo)rd)" }
    ]
  },
  {
    message: "should add before prop",
    fixture: "( )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: " ",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should add before and after prop",
    fixture: "( | )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: " ",
        after: " ",
        nodes: [{ type: "word", sourceIndex: 2, value: "|" }]
      }
    ]
  },
  {
    message: "should add value prop",
    fixture: "name()",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "name",
        before: "",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should process nested functions",
    fixture: "((()))",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: "",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 1,
            value: "",
            before: "",
            after: "",
            nodes: [
              {
                type: "function",
                sourceIndex: 2,
                value: "",
                before: "",
                after: "",
                nodes: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    message: "should process advanced nested functions",
    fixture: "( calc(( ) ))word",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 2,
            value: "calc",
            before: "",
            after: " ",
            nodes: [
              {
                type: "function",
                sourceIndex: 7,
                value: "",
                before: " ",
                after: "",
                nodes: []
              }
            ]
          }
        ]
      },
      { type: "word", sourceIndex: 13, value: "word" }
    ]
  },
  {
    message: "should process divider (/)",
    fixture: "/",
    expected: [
      { type: "div", sourceIndex: 0, value: "/", before: "", after: "" }
    ]
  },
  {
    message: "should process divider (:)",
    fixture: ":",
    expected: [
      { type: "div", sourceIndex: 0, value: ":", before: "", after: "" }
    ]
  },
  {
    message: "should process divider (,)",
    fixture: ",",
    expected: [
      { type: "div", sourceIndex: 0, value: ",", before: "", after: "" }
    ]
  },
  {
    message: "should process complex divider",
    fixture: " , ",
    expected: [
      { type: "div", sourceIndex: 0, value: ",", before: " ", after: " " }
    ]
  },
  {
    message: "should process divider in function",
    fixture: "( , )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "div",
            sourceIndex: 2,
            value: ",",
            before: "",
            after: ""
          }
        ]
      }
    ]
  },
  {
    message: "should process two spaced divider",
    fixture: " , : ",
    expected: [
      {
        type: "div",
        sourceIndex: 0,
        value: ",",
        before: " ",
        after: " "
      },
      { type: "div", sourceIndex: 3, value: ":", before: "", after: " " }
    ]
  },
  {
    message: 'should process empty quoted strings (")',
    fixture: '""',
    expected: [{ type: "string", sourceIndex: 0, value: "", quote: '"' }]
  },
  {
    message: "should process empty quoted strings (')",
    fixture: "''",
    expected: [{ type: "string", sourceIndex: 0, value: "", quote: "'" }]
  },
  {
    message: "should process escaped quotes (')",
    fixture: "'word\\'word'",
    expected: [
      { type: "string", sourceIndex: 0, value: "word\\'word", quote: "'" }
    ]
  },
  {
    message: "should process escaped quotes (')",
    fixture: '"word\\"word"',
    expected: [
      { type: "string", sourceIndex: 0, value: 'word\\"word', quote: '"' }
    ]
  },
  {
    message: "should process single quotes inside double quotes (')",
    fixture: '"word\'word"',
    expected: [
      { type: "string", sourceIndex: 0, value: "word'word", quote: '"' }
    ]
  },
  {
    message: "should process double quotes inside single quotes (')",
    fixture: "'word\"word'",
    expected: [
      { type: "string", sourceIndex: 0, value: 'word"word', quote: "'" }
    ]
  },
  {
    message: "should process unclosed quotes",
    fixture: '"word',
    expected: [
      {
        type: "string",
        sourceIndex: 0,
        value: "word",
        quote: '"',
        unclosed: true
      }
    ]
  },
  {
    message: "should process unclosed quotes with ended backslash",
    fixture: '"word\\',
    expected: [
      {
        type: "string",
        sourceIndex: 0,
        value: "word\\",
        quote: '"',
        unclosed: true
      }
    ]
  },
  {
    message: "should process quoted strings",
    fixture: '"string"',
    expected: [{ type: "string", sourceIndex: 0, value: "string", quote: '"' }]
  },
  {
    message: "should process quoted strings and words",
    fixture: 'word1"string"word2',
    expected: [
      { type: "word", sourceIndex: 0, value: "word1" },
      { type: "string", sourceIndex: 5, value: "string", quote: '"' },
      { type: "word", sourceIndex: 13, value: "word2" }
    ]
  },
  {
    message: "should process quoted strings and spaces",
    fixture: ' "string" ',
    expected: [
      { type: "space", sourceIndex: 0, value: " " },
      { type: "string", sourceIndex: 1, value: "string", quote: '"' },
      { type: "space", sourceIndex: 9, value: " " }
    ]
  },
  {
    message: "should process escaped symbols as words",
    fixture: " \\\"word\\'\\ \\\t ",
    expected: [
      { type: "space", sourceIndex: 0, value: " " },
      { type: "word", sourceIndex: 1, value: "\\\"word\\'\\ \\\t" },
      { type: "space", sourceIndex: 13, value: " " }
    ]
  },
  {
    message: "should correctly proceess font value",
    fixture:
      "bold italic 12px \t /3 'Open Sans', Arial, \"Helvetica Neue\", sans-serif",
    expected: [
      { type: "word", sourceIndex: 0, value: "bold" },
      { type: "space", sourceIndex: 4, value: " " },
      { type: "word", sourceIndex: 5, value: "italic" },
      { type: "space", sourceIndex: 11, value: " " },
      { type: "word", sourceIndex: 12, value: "12px" },
      {
        type: "div",
        sourceIndex: 16,
        value: "/",
        before: " \t ",
        after: ""
      },
      { type: "word", sourceIndex: 20, value: "3" },
      { type: "space", sourceIndex: 21, value: " " },
      { type: "string", sourceIndex: 22, value: "Open Sans", quote: "'" },
      {
        type: "div",
        sourceIndex: 33,
        value: ",",
        before: "",
        after: " "
      },
      { type: "word", sourceIndex: 35, value: "Arial" },
      {
        type: "div",
        sourceIndex: 40,
        value: ",",
        before: "",
        after: " "
      },
      {
        type: "string",
        sourceIndex: 42,
        value: "Helvetica Neue",
        quote: '"'
      },
      {
        type: "div",
        sourceIndex: 58,
        value: ",",
        before: "",
        after: " "
      },
      { type: "word", sourceIndex: 60, value: "sans-serif" }
    ]
  },
  {
    message: "should correctly proceess color value",
    fixture: "rgba( 29, 439 , 29 )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "rgba",
        before: " ",
        after: " ",
        nodes: [
          { type: "word", sourceIndex: 6, value: "29" },
          {
            type: "div",
            sourceIndex: 8,
            value: ",",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 10, value: "439" },
          {
            type: "div",
            sourceIndex: 13,
            value: ",",
            before: " ",
            after: " "
          },
          { type: "word", sourceIndex: 16, value: "29" }
        ]
      }
    ]
  },
  {
    message: "should correctly process url function",
    fixture: "url( /gfx/img/bg.jpg )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [{ type: "word", sourceIndex: 5, value: "/gfx/img/bg.jpg" }]
      }
    ]
  },
  {
    message: "should add unclosed: true prop for url function",
    fixture: "url( /gfx/img/bg.jpg ",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: "",
        unclosed: true,
        nodes: [
          { type: "word", sourceIndex: 5, value: "/gfx/img/bg.jpg" },
          { type: "space", sourceIndex: 20, value: " " }
        ]
      }
    ]
  },
  {
    message: "should correctly process url function with quoted first argument",
    fixture: 'url( "/gfx/img/bg.jpg" hello )',
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "string",
            sourceIndex: 5,
            quote: '"',
            value: "/gfx/img/bg.jpg"
          },
          { type: "space", sourceIndex: 22, value: " " },
          { type: "word", sourceIndex: 23, value: "hello" }
        ]
      }
    ]
  },
  {
    message: "should correctly parse spaces",
    fixture: "calc(1 + 2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "space",
            sourceIndex: 6,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "+"
          },
          {
            type: "space",
            sourceIndex: 8,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 9,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly parse subtraction with spaces",
    fixture: "calc(1 - 2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "space",
            sourceIndex: 6,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "-"
          },
          {
            type: "space",
            sourceIndex: 8,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 9,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly parse multiplication with spaces",
    fixture: "calc(1 * 2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "space",
            sourceIndex: 6,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "*"
          },
          {
            type: "space",
            sourceIndex: 8,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 9,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly parse division with spaces",
    fixture: "calc(1 / 2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "space",
            sourceIndex: 6,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "/"
          },
          {
            type: "space",
            sourceIndex: 8,
            value: " "
          },
          {
            type: "word",
            sourceIndex: 9,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly parse multiplication without spaces",
    fixture: "calc(1*2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "word",
            sourceIndex: 6,
            value: "*"
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly parse division without spaces",
    fixture: "calc(1/2)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "1"
          },
          {
            type: "word",
            sourceIndex: 6,
            value: "/"
          },
          {
            type: "word",
            sourceIndex: 7,
            value: "2"
          }
        ]
      }
    ]
  },
  {
    message: "should correctly process nested calc functions",
    fixture: "calc(((768px - 100vw) / 2) - 15px)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "calc",
        before: "",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 5,
            value: "",
            before: "",
            after: "",
            nodes: [
              {
                type: "function",
                sourceIndex: 6,
                value: "",
                before: "",
                after: "",
                nodes: [
                  {
                    type: "word",
                    sourceIndex: 7,
                    value: "768px"
                  },
                  {
                    type: "space",
                    sourceIndex: 12,
                    value: " "
                  },
                  {
                    type: "word",
                    sourceIndex: 13,
                    value: "-"
                  },
                  {
                    type: "space",
                    sourceIndex: 14,
                    value: " "
                  },
                  {
                    type: "word",
                    sourceIndex: 15,
                    value: "100vw"
                  }
                ]
              },
              {
                type: "div",
                sourceIndex: 21,
                value: "/",
                before: " ",
                after: " "
              },
              { type: "word", sourceIndex: 24, value: "2" }
            ]
          },
          { type: "space", sourceIndex: 26, value: " " },
          { type: "word", sourceIndex: 27, value: "-" },
          { type: "space", sourceIndex: 28, value: " " },
          { type: "word", sourceIndex: 29, value: "15px" }
        ]
      }
    ]
  },
  {
    message: "should process colons with params",
    fixture: "(min-width: 700px) and (orientation: \\$landscape)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: "",
        after: "",
        nodes: [
          { type: "word", sourceIndex: 1, value: "min-width" },
          {
            type: "div",
            sourceIndex: 10,
            value: ":",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 12, value: "700px" }
        ]
      },
      { type: "space", sourceIndex: 18, value: " " },
      { type: "word", sourceIndex: 19, value: "and" },
      { type: "space", sourceIndex: 22, value: " " },
      {
        type: "function",
        sourceIndex: 23,
        value: "",
        before: "",
        after: "",
        nodes: [
          { type: "word", sourceIndex: 24, value: "orientation" },
          {
            type: "div",
            sourceIndex: 35,
            value: ":",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 37, value: "\\$landscape" }
        ]
      }
    ]
  },
  {
    message: "should escape parentheses with backslash",
    fixture: "url( http://website.com/assets\\)_test )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "http://website.com/assets\\)_test"
          }
        ]
      }
    ]
  },
  {
    message: "should parse parentheses correctly",
    fixture: "fn1(fn2(255), fn3(.2)), fn4(fn5(255,.2), fn6)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "fn1",
        before: "",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 4,
            value: "fn2",
            before: "",
            after: "",
            nodes: [{ type: "word", sourceIndex: 8, value: "255" }]
          },
          {
            type: "div",
            sourceIndex: 12,
            value: ",",
            before: "",
            after: " "
          },
          {
            type: "function",
            sourceIndex: 14,
            value: "fn3",
            before: "",
            after: "",
            nodes: [{ type: "word", sourceIndex: 18, value: ".2" }]
          }
        ]
      },
      {
        type: "div",
        sourceIndex: 22,
        value: ",",
        before: "",
        after: " "
      },
      {
        type: "function",
        sourceIndex: 24,
        value: "fn4",
        before: "",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 28,
            value: "fn5",
            before: "",
            after: "",
            nodes: [
              { type: "word", sourceIndex: 32, value: "255" },
              {
                type: "div",
                sourceIndex: 35,
                value: ",",
                before: "",
                after: ""
              },
              { type: "word", sourceIndex: 36, value: ".2" }
            ]
          },
          {
            type: "div",
            sourceIndex: 39,
            value: ",",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 41, value: "fn6" }
        ]
      }
    ]
  },
  {
    message: "shouldn't throw an error on unclosed function",
    fixture: "(0 32 word ",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: "",
        after: "",
        unclosed: true,
        nodes: [
          { type: "word", sourceIndex: 1, value: "0" },
          { type: "space", sourceIndex: 2, value: " " },
          { type: "word", sourceIndex: 3, value: "32" },
          { type: "space", sourceIndex: 5, value: " " },
          { type: "word", sourceIndex: 6, value: "word" },
          { type: "space", sourceIndex: 10, value: " " }
        ]
      }
    ]
  },
  {
    message: "should add unclosed: true prop for every unclosed function",
    fixture: "( ( ( ) ",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "",
        before: " ",
        after: "",
        unclosed: true,
        nodes: [
          {
            type: "function",
            sourceIndex: 2,
            value: "",
            before: " ",
            after: "",
            unclosed: true,
            nodes: [
              {
                type: "function",
                sourceIndex: 4,
                value: "",
                before: " ",
                after: "",
                nodes: []
              },
              { type: "space", sourceIndex: 7, value: " " }
            ]
          }
        ]
      }
    ]
  },
  {
    message: "shouldn't throw an error on unopened function",
    fixture: "0 32 word ) ",
    expected: [
      { type: "word", sourceIndex: 0, value: "0" },
      { type: "space", sourceIndex: 1, value: " " },
      { type: "word", sourceIndex: 2, value: "32" },
      { type: "space", sourceIndex: 4, value: " " },
      { type: "word", sourceIndex: 5, value: "word" },
      { type: "space", sourceIndex: 9, value: " " },
      { type: "word", sourceIndex: 10, value: ")" },
      { type: "space", sourceIndex: 11, value: " " }
    ]
  },
  {
    message: "should process escaped spaces as word in fonts",
    fixture: "Bond\\ 007",
    expected: [{ type: "word", sourceIndex: 0, value: "Bond\\ 007" }]
  },
  {
    message: "should parse double url and comma",
    fixture: "url(foo/bar.jpg), url(http://website.com/img.jpg)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "",
        after: "",
        nodes: [{ type: "word", sourceIndex: 4, value: "foo/bar.jpg" }]
      },
      {
        type: "div",
        sourceIndex: 16,
        value: ",",
        before: "",
        after: " "
      },
      {
        type: "function",
        sourceIndex: 18,
        value: "url",
        before: "",
        after: "",
        nodes: [
          {
            type: "word",
            sourceIndex: 22,
            value: "http://website.com/img.jpg"
          }
        ]
      }
    ]
  },
  {
    message: "should parse empty url",
    fixture: "url()",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with space",
    fixture: "url( )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with multiple spaces",
    fixture: "url(   )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "   ",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with newline (LF)",
    fixture: "url(\n)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "\n",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with newline (CRLF)",
    fixture: "url(\r\n)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "\r\n",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with multiple newlines (LF)",
    fixture: "url(\n\n\n)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "\n\n\n",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with multiple newlines (CRLF)",
    fixture: "url(\r\n\r\n\r\n)",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "\r\n\r\n\r\n",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse empty url with whitespace characters",
    fixture: "url(  \n \t  \r\n  )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: "  \n \t  \r\n  ",
        after: "",
        nodes: []
      }
    ]
  },
  {
    message: "should parse comments",
    fixture: "/*before*/ 1px /*between*/ 1px /*after*/",
    expected: [
      { type: "comment", sourceIndex: 0, value: "before" },
      { type: "space", sourceIndex: 10, value: " " },
      { type: "word", sourceIndex: 11, value: "1px" },
      { type: "space", sourceIndex: 14, value: " " },
      { type: "comment", sourceIndex: 15, value: "between" },
      { type: "space", sourceIndex: 26, value: " " },
      { type: "word", sourceIndex: 27, value: "1px" },
      { type: "space", sourceIndex: 30, value: " " },
      { type: "comment", sourceIndex: 31, value: "after" }
    ]
  },
  {
    message: "should parse comments inside functions",
    fixture: "rgba( 0, 55/55, 0/*,.5*/ )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "rgba",
        before: " ",
        after: " ",
        nodes: [
          { type: "word", sourceIndex: 6, value: "0" },
          {
            type: "div",
            sourceIndex: 7,
            value: ",",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 9, value: "55" },
          {
            type: "div",
            sourceIndex: 11,
            value: "/",
            before: "",
            after: ""
          },
          { type: "word", sourceIndex: 12, value: "55" },
          {
            type: "div",
            sourceIndex: 14,
            value: ",",
            before: "",
            after: " "
          },
          { type: "word", sourceIndex: 16, value: "0" },
          { type: "comment", sourceIndex: 17, value: ",.5" }
        ]
      }
    ]
  },
  {
    message:
      "should parse comments at the end of url functions with quoted first argument",
    fixture: 'url( "/demo/bg.png" /*comment*/ )',
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "string",
            sourceIndex: 5,
            value: "/demo/bg.png",
            quote: '"'
          },
          { type: "space", sourceIndex: 19, value: " " },
          { type: "comment", sourceIndex: 20, value: "comment" }
        ]
      }
    ]
  },
  {
    message:
      "should not parse comments at the start of url function with unquoted first argument",
    fixture: "url( /*comment*/ /demo/bg.png )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "/*comment*/ /demo/bg.png"
          }
        ]
      }
    ]
  },
  {
    message:
      "should not parse comments at the end of url function with unquoted first argument",
    fixture: "url( /demo/bg.png /*comment*/ )",
    expected: [
      {
        type: "function",
        sourceIndex: 0,
        value: "url",
        before: " ",
        after: " ",
        nodes: [
          {
            type: "word",
            sourceIndex: 5,
            value: "/demo/bg.png /*comment*/"
          }
        ]
      }
    ]
  },
  {
    message: "should parse unclosed comments",
    fixture: "/*comment*/ 1px /* unclosed ",
    expected: [
      { type: "comment", sourceIndex: 0, value: "comment" },
      { type: "space", sourceIndex: 11, value: " " },
      { type: "word", sourceIndex: 12, value: "1px" },
      { type: "space", sourceIndex: 15, value: " " },
      {
        type: "comment",
        sourceIndex: 16,
        value: " unclosed ",
        unclosed: true
      }
    ]
  },
  {
    message: "should respect escape character",
    fixture: "Hawaii \\35 -0",
    expected: [
      { type: "word", sourceIndex: 0, value: "Hawaii" },
      { type: "space", sourceIndex: 6, value: " " },
      { type: "word", sourceIndex: 7, value: "\\35" },
      { type: "space", sourceIndex: 10, value: " " },
      { type: "word", sourceIndex: 11, value: "-0" }
    ]
  },
  {
    message: "should parse unicode-range (single codepoint)",
    fixture: "U+26",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "U+26" }]
  },
  {
    message: "should parse unicode-range (single codepoint) 2",
    fixture: "U+0-7F",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "U+0-7F" }]
  },
  {
    message: "should parse unicode-range (single codepoint) 3",
    fixture: "U+0-7f",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "U+0-7f" }]
  },
  {
    message: "should parse unicode-range (single codepoint) (lowercase)",
    fixture: "u+26",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "u+26" }]
  },
  {
    message: "should parse unicode-range (codepoint range)",
    fixture: "U+0025-00FF",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "U+0025-00FF" }]
  },
  {
    message: "should parse unicode-range (wildcard range)",
    fixture: "U+4??",
    expected: [{ type: "unicode-range", sourceIndex: 0, value: "U+4??" }]
  },
  {
    message: "should parse unicode-range (multiple values)",
    fixture: "U+0025-00FF, U+4??",
    expected: [
      { type: "unicode-range", sourceIndex: 0, value: "U+0025-00FF" },
      { type: "div", sourceIndex: 11, value: ",", before: "", after: " " },
      { type: "unicode-range", sourceIndex: 13, value: "U+4??" }
    ]
  },
  {
    message: "should parse invalid unicode-range as word",
    fixture: "U+4??Z",
    expected: [{ type: "word", sourceIndex: 0, value: "U+4??Z" }]
  },
  {
    message: "should parse invalid unicode-range as word 2",
    fixture: "U+",
    expected: [{ type: "word", sourceIndex: 0, value: "U+" }]
  },
  {
    message: "should parse invalid unicode-range as word 2",
    fixture: "U+Z",
    expected: [{ type: "word", sourceIndex: 0, value: "U+Z" }]
  }
];

test("Parse", function(t) {
  t.plan(tests.length);

  tests.forEach(function(opts) {
    t.deepEqual(parse(opts.fixture), opts.expected, opts.message);
  });
});
