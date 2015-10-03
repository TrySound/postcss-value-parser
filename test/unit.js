var test = require('tape');
var unit = require('../lib/unit');

var tests = [{
    fixture: '.23rem',
    expected: { number: '.23', unit: 'rem' }
}, {
    fixture: '.2.3rem',
    expected: { number: '.2', unit: '.3rem' }
}, {
    fixture: '2.',
    expected: { number: '2.', unit: '' }
}, {
    fixture: '+2.',
    expected: { number: '+2.', unit: '' }
}, {
    fixture: '-2.',
    expected: { number: '-2.', unit: '' }
}, {
    fixture: '+-2.',
    expected: false
}, {
    fixture: '.',
    expected: false
}, {
    fixture: '.rem',
    expected: false
}];

test('Unit', function (t) {
    t.plan(tests.length);

    tests.forEach(function (test) {
        t.deepEqual(unit(test.fixture), test.expected);
    });
});
