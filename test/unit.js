var test = require('tape');
var unit = require('../lib/unit');

test('Unit', function (t) {
    t.plan(8);

    t.deepEqual(unit('.23rem'), {
        number: '.23',
        unit: 'rem'
    });

    t.deepEqual(unit('.2.3rem'), {
        number: '.2',
        unit: '.3rem'
    });

    t.deepEqual(unit('2.'), {
        number: '2.',
        unit: ''
    });

    t.deepEqual(unit('+2.'), {
        number: '+2.',
        unit: ''
    });

    t.deepEqual(unit('-2.'), {
        number: '-2.',
        unit: ''
    });

    t.equal(unit('+-2.'), false);

    t.equal(unit('.'), false);

    t.equal(unit('.rem'), false);
});
