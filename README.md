[![Travis CI](https://travis-ci.org/TrySound/postcss-value-parser.svg)](https://travis-ci.org/TrySound/postcss-value-parser)

# postcss-value-parser

Transforms css values and at-rule params into the tree.

## Usage

```js
var parser = require('postcss-value-parser');

/*{
    nodes: [
      type: 'function',
      value: 'rgba',
      nodes: [
        { type: 'word', value: '233' },
        { type: 'div', value: ',', before: '', after: ' ' },
        { type: 'word', value: '45' },
        { type: 'div', value: ',', before: '', after: ' ' },
        { type: 'word', value: '66' },
        { type: 'div', value: ',', before: ' ', after: '' },
        { type: 'word', value: '.5' }
      ]
    ]
  }*/
parser('rgba(233, 45, 66 ,.5)').walk('rgba', function (fn) {
    var color = fn.nodes.filter(function (node) {
      return node.type === 'word';
    }).map(function (node) {
      return Number(node.value);
    }); // [233, 45, 66, .5]

    fn.type = 'word';
    fn.value = convertToHex(color);
  }).toString(); // #E92D42
```

### Prevent walking into function

```js
parser('url(some url) 50% 50%')
  .walk(function (node) {
    // Your code

    if (node.type === 'function' && node.value === 'url') {
      return false;
    }
  })
  .toString();
```

### Url node

```
url( /path/to/image )
```

will be parsed to

```js
[{
  type: 'function',
  value: 'url',
  before: ' ',
  after: ' ',
  nodes: [
    { type: 'word', value: '/path/to/image' }
  ]
}]
```

## Node types

- `{ type: 'word', value: 'any' }`
- `{ type: 'string', value: 'string', quote: '"' }`
- `{ type: 'string', value: 'string', quote: '\'' }`
- `{ type: 'div', value: '/' , before: ' ', after: ' ' }`
- `{ type: 'div', value: ',', before: ' ', after: ' ' }`
- `{ type: 'div', value: ':', before: ' ', after: ' ' }`
- `{ type: 'space', value: ' ' }` space as a separator
- `{ type: 'function', value: 'name', before: '', after: '', nodes: [] }`

## API

```
var valueParser = require('postcss-value-parser');
```

### valueParser.unit(value)

Returns parsed value.

```js
// .2rem
{
  number: '.2',
  unit: 'rem'
}
```

### valueParser.stringify(nodes)

Stringifies node and array of nodes.

### valueParser.walk(nodes, cb[, bubble])

Walks each node and recursively each nodes of functions.
If bubble is `false` and callback returns `false` on function node then deeper walking will be prevented.
Returns `this` instance.

- `nodes` - value-parser node or nodes
- `cb(node, index, nodes)`
- `bubble` walk since the deepest functions nodes

### var p = valueParser(value)

Returns parsed tree.

### p.nodes

Root nodes list.

### p.toString()

Stringify tree to the value.

### p.walk(cb[, bubble])

Walks each node since `p.nodes`.

# License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
