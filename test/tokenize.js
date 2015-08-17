var test = require('tape');
var tokenize = require('../lib/tokenize');

var tests = [{
    message: 'Should correctly process empty input',
    fixture: '',
    expected: []
}, {
    message: 'Should correctly proceess font value',
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
    message: 'Should correctly proceess color value',
    fixture: 'rgba( 29, 439 , 29 )',
    expected: [
        {
            type: 'function',
            value: 'rgba',
            nodes: [
                { type: 'space', value: ' ' },
                { type: 'word',  value: '29' },
                { type: 'div',   value: ',', before: '', after: ' ' },
                { type: 'word',  value: '439' },
                { type: 'div',   value: ',', before: ' ', after: ' ' },
                { type: 'word',  value: '29' },
                { type: 'space', value: ' ' },
            ]
        }
    ]
}];

test('Tokenize', function (t) {
    t.plan(tests.length);

    tests.forEach(function (opts) {
        t.deepEqual(tokenize(opts.fixture), opts.expected, opts.message);
    });
});
