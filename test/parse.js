var test = require('tape');
var parse = require('../lib/parse');

var tests = [{
    message: 'should correctly process empty input',
    fixture: '',
    expected: []
}, {
    message: 'should process escaped parentheses (open)',
    fixture: '\\(',
    expected: [
        { type: 'word', value: '\\(' }
    ]
}, {
    message: 'should process escaped parentheses (close)',
    fixture: '\\)',
    expected: [
        { type: 'word', value: '\\)' }
    ]
}, {
    message: 'should process escaped parentheses (both)',
    fixture: '\\(\\)',
    expected: [
        { type: 'word', value: '\\(\\)' }
    ]
}, {
    message: 'should process escaped parentheses (both)',
    fixture: '\\( \\)',
    expected: [
        { type: 'word', value: '\\(' },
        { type: 'space', value: ' ' },
        { type: 'word', value: '\\)' }
    ]
}, {
    message: 'should process unopened parentheses as word',
    fixture: '() )wo)rd)',
    expected: [
        { type: 'function', value: '', before: '', after: '', nodes: [] },
        { type: 'space', value: ' ' },
        { type: 'word', value: ')wo)rd)' }
    ]
}, {
    message: 'should add before prop',
    fixture: '( )',
    expected: [
        { type: 'function', value: '', before: ' ', after: '', nodes: [] }
    ]
}, {
    message: 'should add before and after prop',
    fixture: '( | )',
    expected: [
        { type: 'function', value: '', before: ' ', after: ' ', nodes: [
            { type: 'word', value: '|' }
        ] }
    ]
}, {
    message: 'should add value prop',
    fixture: 'name()',
    expected: [
        { type: 'function', value: 'name', before: '', after: '', nodes: [] }
    ]
}, {
    message: 'should process nested functions',
    fixture: '((()))',
    expected: [
        { type: 'function', value: '', before: '', after: '', nodes: [
            { type: 'function', value: '', before: '', after: '', nodes: [
                { type: 'function', value: '', before: '', after: '', nodes: [] }
            ] }
        ] }
    ]
}, {
    message: 'should process advanced nested functions',
    fixture: '( calc(( ) ))word',
    expected: [
        { type: 'function', value: '', before: ' ', after: '', nodes: [
            { type: 'function', value: 'calc', before: '', after: ' ', nodes: [
                { type: 'function', value: '', before: ' ', after: '', nodes: [] }
            ] }
        ] },
        { type: 'word', value: 'word' }
    ]
}, {
    message: 'should process divider (/)',
    fixture: '/',
    expected: [
        { type: 'div', value: '/', before: '', after: '' }
    ]
}, {
    message: 'should process divider (:)',
    fixture: ':',
    expected: [
        { type: 'div', value: ':', before: '', after: '' }
    ]
}, {
    message: 'should process divider (,)',
    fixture: ',',
    expected: [
        { type: 'div', value: ',', before: '', after: '' }
    ]
}, {
    message: 'should process complex divider',
    fixture: ' , ',
    expected: [
        { type: 'div', value: ',', before: ' ', after: ' ' }
    ]
}, {
    message: 'should process divider in function',
    fixture: '( , )',
    expected: [
        { type: 'function', value: '', before: ' ', after: ' ', nodes: [
            { type: 'div', value: ',', before: '', after: '' }
        ] }
    ]
}, {
    message: 'should process two spaced divider',
    fixture: ' , : ',
    expected: [
        { type: 'div', value: ',', before: ' ', after: ' ' },
        { type: 'div', value: ':', before: '', after: ' ' }
    ]
}, {
    message: 'should process empty quoted strings (")',
    fixture: '""',
    expected: [
        { type: 'string', value: '', quote: '"' }
    ]
}, {
    message: 'should process empty quoted strings (\')',
    fixture: '\'\'',
    expected: [
        { type: 'string', value: '', quote: '\'' }
    ]
}, {
    message: 'should process escaped quotes (\')',
    fixture: '\'word\\\'word\'',
    expected: [
        { type: 'string', value: 'word\\\'word', quote: '\'' }
    ]
}, {
    message: 'should process escaped quotes (\')',
    fixture: '"word\\"word"',
    expected: [
        { type: 'string', value: 'word\\"word', quote: '"' }
    ]
}, {
    message: 'should process single quotes inside double quotes (\')',
    fixture: '"word\'word"',
    expected: [
        { type: 'string', value: 'word\'word', quote: '"' }
    ]
}, {
    message: 'should process double quotes inside single quotes (\')',
    fixture: '\'word"word\'',
    expected: [
        { type: 'string', value: 'word"word', quote: '\'' }
    ]
}, {
    message: 'should process unclosed quotes',
    fixture: '"word',
    expected: [
        { type: 'string', value: 'word', quote: '"', unclosed: true }
    ]
}, {
    message: 'should process unclosed quotes with ended backslash',
    fixture: '"word\\',
    expected: [
        { type: 'string', value: 'word\\', quote: '"', unclosed: true }
    ]
}, {
    message: 'should process quoted strings',
    fixture: '"string"',
    expected: [
        { type: 'string', value: 'string', quote: '"' }
    ]
}, {
    message: 'should process quoted strings and words',
    fixture: 'word1"string"word2',
    expected: [
        { type: 'word', value: 'word1' },
        { type: 'string', value: 'string', quote: '"' },
        { type: 'word', value: 'word2' }
    ]
}, {
    message: 'should process quoted strings and spaces',
    fixture: ' "string" ',
    expected: [
        { type: 'space', value: ' ' },
        { type: 'string', value: 'string', quote: '"' },
        { type: 'space', value: ' ' }
    ]
}, {
    message: 'should process escaped symbols as words',
    fixture: ' \\"word\\\'\\ \\\t ',
    expected: [
        { type: 'space', value: ' ' },
        { type: 'word', value: '\\"word\\\'\\ \\\t'},
        { type: 'space', value: ' ' }
    ]
}, {
    message: 'should correctly proceess font value',
    fixture: 'bold italic 12px \t /3 \'Open Sans\', Arial, "Helvetica Neue", sans-serif',
    expected: [
        { type: 'word',   value: 'bold' },
        { type: 'space',  value: ' ' },
        { type: 'word',   value: 'italic' },
        { type: 'space',  value: ' ' },
        { type: 'word',   value: '12px' },
        { type: 'div',    value: '/' , before: ' \t ', after: '' },
        { type: 'word',   value: '3' },
        { type: 'space',  value: ' ' },
        { type: 'string', value: 'Open Sans', quote: '\'' },
        { type: 'div',    value: ',', before: '', after: ' ' },
        { type: 'word',   value: 'Arial' },
        { type: 'div',    value: ',', before: '', after: ' ' },
        { type: 'string', value: 'Helvetica Neue', quote: '"' },
        { type: 'div',    value: ',', before: '', after: ' ' },
        { type: 'word',   value: 'sans-serif' },
    ]
}, {
    message: 'should correctly proceess color value',
    fixture: 'rgba( 29, 439 , 29 )',
    expected: [
        { type: 'function', value: 'rgba', before: ' ', after: ' ', nodes: [
            { type: 'word',  value: '29' },
            { type: 'div',   value: ',', before: '', after: ' ' },
            { type: 'word',  value: '439' },
            { type: 'div',   value: ',', before: ' ', after: ' ' },
            { type: 'word',  value: '29' },
        ] }
    ]
}, {
    message: 'should correctly process url function',
    fixture: 'url(/gfx/img/bg.jpg)',
    expected: [
        { type: 'function', value: 'url', before: '', after: '', nodes: [
            { after: '', before: '', type: 'div', value: '/' },
            { type: 'word', value: 'gfx' },
            { after: '', before: '', type: 'div', value: '/' },
            { type: 'word', value: 'img' },
            { after: '', before: '', type: 'div', value: '/' },
            { type: 'word', value: 'bg.jpg' }
        ] }
    ]
}, {
    message: 'should correctly process nested calc functions',
    fixture: 'calc(((768px - 100vw) / 2) - 15px)',
    expected: [
        {type: 'function', value: 'calc', before: '', after: '', nodes: [
            { type: 'function', value: '', before: '', after: '', nodes: [
                { type: 'function', value: '', before: '', after: '', nodes: [
                    { type: 'word', value: '768px' },
                    { type: 'space', value: ' ' },
                    { type: 'word', value: '-' },
                    { type: 'space', value: ' ' },
                    { type: 'word', value: '100vw' }
                ] },
                { type: 'div', value: '/', before: ' ', after: ' ' },
                { type: 'word', value: '2' }
            ] },
            { type: 'space', value: ' ' },
            { type: 'word', value: '-' },
            { type: 'space', value: ' ' },
            { type: 'word', value: '15px' }
        ] }
    ]
}, {
    message: 'should process colons with params',
    fixture: '(min-width: 700px) and (orientation: \\$landscape)',
    expected: [
        { type: 'function', value: '', before: '', after: '', nodes: [
            { type: 'word', value: 'min-width' },
            { type: 'div', value: ':', before: '', after: ' ' },
            { type: 'word', value: '700px' }
        ] },
        { type: 'space', value: ' ' },
        { type: 'word', value: 'and' },
        { type: 'space', value: ' ' },
        { type: 'function', value: '', before: '', after: '', nodes: [
            { type: 'word', value: 'orientation' },
            { type: 'div', value: ':', before: '', after: ' ' },
            { type: 'word', value: '\\$landscape' }
        ] }
    ]
}, {
    message: 'should escape parentheses with backslash',
    fixture: 'url(http://website.com/assets\\)_test)',
    expected: [
        { type: 'function', value: 'url', before: '', after: '', nodes: [
            { type: 'word', value: 'http' },
            { type: 'div', value: ':', before: '', after: '' },
            { type: 'div', value: '/', before: '', after: '' },
            { type: 'div', value: '/', before: '', after: '' },
            { type: 'word', value: 'website.com' },
            { type: 'div', value: '/', before: '', after: '' },
            { type: 'word', value: 'assets\\)_test' }
        ] }
    ]
}, {
    message: 'should parse parentheses correctly',
    fixture: 'fn1(fn2(255), fn3(.2)), fn4(fn5(255,.2), fn6)',
    expected: [
        { type: 'function', value: 'fn1', before: '', after: '', nodes: [
            { type: 'function', value: 'fn2', before: '', after: '', nodes: [
                { type: 'word', value: '255' }
            ] },
            { type: 'div', value: ',', before: '', after: ' ' },
            { type: 'function', value: 'fn3', before: '', after: '', nodes: [
                { type: 'word', value: '.2' }
            ] },
        ] },
        { type: 'div', value: ',', before: '', after: ' ' },
        { type: 'function', value: 'fn4', before: '', after: '', nodes: [
            { type: 'function', value: 'fn5', before: '', after: '', nodes: [
                { type: 'word', value: '255' },
                { type: 'div', value: ',', before: '', after: '' },
                { type: 'word', value: '.2' }
            ] },
            { type: 'div', value: ',', before: '', after: ' '},
            { type: 'word', value: 'fn6' }
        ] }
    ]
}, {
    message: 'shouldn\'t throw an error on unclosed function',
    fixture: '(0 32 word ',
    expected: [
        { type: 'function', value: '', before: '', after: '', unclosed: true, nodes: [
            { type: 'word', value: '0' },
            { type: 'space', value: ' ' },
            { type: 'word', value: '32' },
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' }
        ] }
    ]
}, {
    message: 'should add unclosed: true prop for every unclosed function',
    fixture: '( ( ( ) ',
    expected: [
        { type: 'function', value: '', before: ' ', after: '', unclosed: true, nodes: [
            { type: 'function', value: '', before: ' ', after: '', unclosed: true, nodes: [
                { type: 'function', value: '', before: ' ', after: '', nodes: [] },
                { type: 'space', value: ' ' }
            ] }
        ] }
    ]
}, {
    message: 'shouldn\'t throw an error on unopened function',
    fixture: '0 32 word ) ',
    expected: [
        { type: 'word', value: '0' },
        { type: 'space', value: ' ' },
        { type: 'word', value: '32' },
        { type: 'space', value: ' ' },
        { type: 'word', value: 'word' },
        { type: 'space', value: ' ' },
        { type: 'word', value: ')' },
        { type: 'space', value: ' ' }
    ]
}, {
    message: 'should process escaped spaces as word in fonts',
    fixture: 'Bond\\ 007',
    expected: [
        { type: 'word', value: 'Bond\\ 007' }
    ]
}];

test('Parse', function (t) {
    t.plan(tests.length);

    tests.forEach(function (opts) {
        t.deepEqual(parse(opts.fixture), opts.expected, opts.message);
    });
});
