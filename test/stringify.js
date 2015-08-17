var test = require('tape');
var tokenize = require('../lib/tokenize');
var stringify = require('../lib/stringify');

var tests = [
    {
        message: 'Should correctly add quotes',
        fixture: 'bold italic 12px/3 \'Open Sans\', Arial, "Helvetica Neue", sans-serif',
        expected: 'bold italic 12px/3 \'Open Sans\', Arial, "Helvetica Neue", sans-serif'
    },
    {
        message: 'Should correctly add brackets',
        fixture: ' rgba( 12,  54, 65) ',
        expected: ' rgba( 12,  54, 65) '
    },
];

test('Stringify', function (t) {
    t.plan(tests.length);

    tests.forEach(function (opts) {
        t.equal(stringify(tokenize(opts.fixture)), opts.expected, opts.message);
    });
});
