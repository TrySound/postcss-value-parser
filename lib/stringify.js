function stringifyNode(node) {
    if(Array.isArray(node.nodes)) {
        if(node.type === 'function') {
            return node.value + '(' + stringify(node.nodes) + ')';
        } else {
            return stringify(node.nodes);
        }
    } else if(node.type === 'string') {
        return (node.quote || '') + node.value + (node.quote || '');
    } else if(node.type === 'div') {
        return (node.before || '') + node.value + (node.after || '');
    } else {
        return node.value;
    }
}

function stringify(nodes) {
    if(Array.isArray(nodes)) {
        return nodes.map(stringifyNode).join('');
    } else {
        return stringifyNode(nodes);
    }
};

module.exports = stringify;
