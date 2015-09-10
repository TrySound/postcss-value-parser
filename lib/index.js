var parse = require('./parse');
var stringify = require('./stringify');

function ValueParser(value) {
    this.nodes = parse(value);
}

ValueParser.prototype.toString = function () {
    return this.nodes ? stringify(this.nodes) : '';
};

ValueParser.prototype.walk = function (name, cb, reverse) {
    if (typeof name === 'function') {
        reverse = cb;
        cb = name;
        name = false;
    }

    walk(this.nodes, name, cb, reverse);

    return this;
};

function walk(nodes, name, cb, reverse) {
    var i, max, node, result, type;

    for (i = 0, max = nodes.length; i < max; i += 1) {
        node = nodes[i];
        if (!name || node.value === name) {
            if (!reverse) {
                result = cb(node, i, nodes);
            }

            type = node.type;
            if (result !== false && node.nodes && type !== 'string' &&
                                                 type !== 'space'  &&
                                                 type !== 'word'   &&
                                                 type !== 'div') {
                walk(node.nodes, name, cb, reverse);
            }

            if (reverse) {
                cb(node, i, nodes);
            }
        }
    }
}

module.exports = function (value) {
    return new ValueParser(value);
};

module.exports.unit = require('./unit');

module.exports.trim = require('./trim');

module.exports.stringify = stringify;
