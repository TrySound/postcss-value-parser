var test = require('tape');
var parse = require('../lib/parse');

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
}, {
    message: 'Should correctly process background value',
    fixture: 'url(/gfx/img/bg.jpg)',
    expected: [
        {
            type: 'function',
            value: 'url',
            nodes: [
                { after: '', before: '', type: 'div', value: '/' },
                { type: 'word', value: 'gfx' },
                { after: '', before: '', type: 'div', value: '/' },
                { type: 'word', value: 'img' },
                { after: '', before: '', type: 'div', value: '/' },
                { type: 'word', value: 'bg.jpg' }
            ]
        }
    ]
}, {
    message: 'Should correctly process nested calc functions',
    fixture: 'calc(((768px - 100vw) / 2) - 15px)',
    expected: [
        {
            type: 'function',
            value: 'calc',
            nodes: [
                {
                    type: 'function',
                    value: '',
                    nodes: [
                        {
                            type: 'function',
                            value: '',
                            nodes: [
                                { type: 'word', value: '768px' },
                                { type: 'space', value: ' ' },
                                { type: 'word', value: '-' },
                                { type: 'space', value: ' ' },
                                { type: 'word', value: '100vw' }
                            ]
                        },
                        { type: 'div', value: '/', before: ' ', after: ' ' },
                        { type: 'word', value: '2' }
                    ]
                },
                { type: 'space', value: ' ' },
                { type: 'word', value: '-' },
                { type: 'space', value: ' ' },
                { type: 'word', value: '15px' }
            ]
        }
    ]
}, {
    message: 'Should process colons with params',
    fixture: '(min-width: 700px) and (orientation: \\$landscape)',
    expected: [
        {
            type: 'function',
            value: '',
            nodes: [
                { type: 'word', value: 'min-width' },
                { type: 'div', value: ':', before: '', after: ' ' },
                { type: 'word', value: '700px' }
            ]
        },
        { type: 'space', value: ' ' },
        { type: 'word', value: 'and' },
        { type: 'space', value: ' ' },
        {
            type: 'function',
            value: '',
            nodes: [
                { type: 'word', value: 'orientation' },
                { type: 'div', value: ':', before: '', after: ' ' },
                { type: 'word', value: '\\$landscape' }
            ]
        }
    ]
}, {
    message: 'Should escape parentheses with backslash',
    fixture: 'url(http://website.com/assets\\)_test)',
    expected: [
        {
            type: 'function',
            value: 'url',
            nodes: [
                {
                    type: 'word',
                    value: 'http'
                },
                {
                    type: 'div',
                    value: ':',
                    before: '',
                    after: ''
                },
                {
                    type: 'div',
                    value: '/',
                    before: '',
                    after: ''
                },
                {
                    type: 'div',
                    value: '/',
                    before: '',
                    after: ''
                },
                {
                    type: 'word',
                    value: 'website.com'
                },
                {
                    type: 'div',
                    value: '/',
                    before: '',
                    after: ''
                },
                {
                    type: 'word',
                    value: 'assets\\)_test'
                }
            ]
        }
    ]
}, {
    message: 'Should parse parentheses correctly',
    fixture: 'fn1(fn2(255), fn3(.2)), fn4(fn5(255,.2), fn6)',
    expected: [
        {
            type: 'function',
            value: 'fn1',
            nodes: [
                {
                    type: 'function',
                    value: 'fn2',
                    nodes: [
                        { type: 'word', value: '255' }
                    ]
                },
                { type: 'div', value: ',', before: '', after: ' ' },
                {
                    type: 'function',
                    value: 'fn3',
                    nodes: [
                        { type: 'word', value: '.2' }
                    ]
                },
            ]
        },
        { type: 'div', value: ',', before: '', after: ' ' },
        {
            type: 'function',
            value: 'fn4',
            nodes:
            [
                {
                    type: 'function',
                    value: 'fn5',
                    nodes: [
                        { type: 'word', value: '255' },
                        { type: 'div', value: ',', before: '', after: '' },
                        { type: 'word', value: '.2' }
                    ]
                },
                { type: 'div', value: ',', before: '', after: ' '},
                { type: 'word', value: 'fn6' }
            ]
        }
    ]
}];

test('Parse', function (t) {
    t.plan(tests.length);

    tests.forEach(function (opts) {
        t.deepEqual(parse(opts.fixture), opts.expected, opts.message);
    });
});
