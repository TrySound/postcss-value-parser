module.exports = function (nodes) {
    if (Array.isArray(nodes)) {
        if (nodes.length && nodes[0].type === 'space') {
            nodes.shift();
        }

        if (nodes.length && nodes[nodes.length - 1].type === 'space') {
            nodes.pop();
        }
    }

    return nodes;
};
