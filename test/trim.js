var test = require('tape');
var trim = require('../lib/trim');

var tests = [
    {
        fixture: [
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' }
        ],
        expected: [
            { type: 'word', value: 'word' }
        ]
    },
    {
        fixture: [
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' }
        ],
        expected: [
            { type: 'word', value: 'word' }
        ]
    },
    {
        fixture: [
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
        ],
        expected: [
            { type: 'word', value: 'word' }
        ]
    },
    {
        fixture: [
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' }
        ],
        expected: [
            { type: 'word', value: 'word' },
            { type: 'space', value: ' ' },
            { type: 'word', value: 'word' },
        ]
    }
];

test('Trim', function (t) {
    t.plan(tests.length);

    tests.forEach(function (test) {
        trim(test.fixture);
        t.deepEqual(test.fixture, test.expected);
    });
});
