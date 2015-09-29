var openParentheses = '('.charCodeAt(0);
var closeParentheses = ')'.charCodeAt(0);
var singleQuote = '\''.charCodeAt(0);
var doubleQuote = '"'.charCodeAt(0);
var backslash = '\\'.charCodeAt(0);
var slash = '/'.charCodeAt(0);
var comma = ','.charCodeAt(0);
var colon = ':'.charCodeAt(0);

module.exports = function (input) {
    var tokens = [];
    var value = input;

    var next, quote, prev, token;
    var pos = 0;
    var code = value.charCodeAt(pos);
    var max = value.length;
    var stack = [{ nodes: tokens }];
    var balanced = 0;
    var parent;

    var name = '';
    var before = '';
    var after = '';

    while (pos < max) {
        // Whitespaces
        if (code <= 32) {
            next = pos;
            do {
                next += 1;
                code = value.charCodeAt(next);
            } while (code <= 32);
            token = value.slice(pos, next);
            pos = next;

            prev = tokens[tokens.length - 1];
            if (code === closeParentheses && balanced) {
                after = token;
            } else if (prev && prev.type === 'div') {
                prev.after = token;
            } else if (code === slash || code === comma || code === colon) {
                before = token;
            } else {
                tokens.push({ type: 'space', value: token });
            }

        // Quotes
        } else if (code === singleQuote || code === doubleQuote) {
            next = pos;
            quote = code;
            do {
                if (code === backslash) {
                    next += 1;
                }
                next += 1;
                code = value.charCodeAt(next);
            } while (code !== quote && next < max);
            quote = value[pos];
            token = value.slice(pos + 1, next);
            pos = next + 1;
            code = value.charCodeAt(pos);

            tokens.push({ type: 'string', quote: quote, value: token });

        // Dividers
        } else if (code === slash || code === comma || code === colon) {
            token = value[pos];
            pos += 1;
            code = value.charCodeAt(pos);

            tokens.push({ type: 'div', value: token, before: before, after: '' });
            before = '';

        // Open parentheses
        } else if (openParentheses === code) {
            // Whitespaces after open parentheses
            next = pos;
            do {
                next += 1;
                code = value.charCodeAt(next);
            } while (code <= 32);
            before = value.slice(pos + 1, next);
            pos = next;

            balanced += 1;
            parent = { type: 'function', value: name, before: before, after: '', nodes: [] };
            before = '';
            name = '';
            tokens.push(parent);
            stack.push(parent);
            tokens = parent.nodes;

        // Close parentheses
        } else if (closeParentheses === code && balanced) {
            pos += 1;
            code = value.charCodeAt(pos);

            parent.after = after;
            after = '';
            balanced -= 1;
            stack.pop();
            parent = stack[balanced];
            tokens = parent.nodes;

        // Words
        } else {
            next = pos;
            do {
                if (code === backslash) {
                    next += 1;
                }
                next += 1;
                code = value.charCodeAt(next);
            } while (next < max && !(
                code <= 32 ||
                code === singleQuote || code === doubleQuote ||
                code === slash || code === comma || code === colon ||
                code === openParentheses || code === closeParentheses && balanced
            ));
            token = value.slice(pos, next);
            pos = next;

            if (openParentheses === code) {
                name = token;
            } else {
                tokens.push({ type: 'word', value: token });
            }
        }
    }

    return stack[0].nodes;
};
