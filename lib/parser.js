var tokenize = require('./tokenize');
var stringify = require('./stringify');

function Parser(value) {
    this.nodes = tokenize(value);
}

Parser.prototype.toString = function () {
    return this.nodes ? stringify(this.nodes) : '';
};

Parser.prototype.walk = function (name, cb, reverse) {
    if(typeof name === 'function') {
        reverse = cb;
        cb = name;
        name = false;
    }

    walk(this.nodes, name, cb, reverse);

    return this;
};

function walk(nodes, name, cb, reverse) {
    var i, max, node;
    for(i = 0, max = nodes.length; i < max; i += 1) {
        node = nodes[i];
        if(!name || node.value === name) {
            if(!reverse) {
                cb(node, i, nodes);
            }

            if(node.nodes) {
                walk(node.nodes, name, cb, reverse);
            }

            if(reverse) {
                cb(node, i, nodes);
            }
        }
    }
}

module.exports = function (value) {
    return new Parser(value);
};

module.exports.unit = require('./unit');

module.exports.stringify = stringify;
