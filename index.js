const parser = require('postcss-selector-parser');
const postcss = require('postcss');
const fs = require('fs');

const monokai = require.resolve('highlight.js/styles/monokai.css');

console.log(monokai);

fs.readFile(monokai, (err, css) => {
  postcss([walker])
    .process(css, { from: undefined })
    .then(result => {
      console.log(result.figmaRules);
    });
});

const walker = postcss.plugin('walker', options => {
  const findColor = nodes =>
    nodes.reduce(
      (color, node) =>
        node.type === 'decl' && node.prop === 'color' ? node.value : color,
      null
    );

  const walk = node => {
    if (node.type === 'rule') {
      const clr = findColor(node.nodes);

      return clr ? [node.selector, clr] : [];
    }

    return [];
  };

  const parseSelectors = ([selector, color]) => {
    let tokens = [];
    const transform = selectors => {
      selectors.walk(selector => {
        if (selector.type === 'class') {
          tokens.push(selector.value);
        }
      });
    };

    parser(transform).processSync(selector);

    return tokens.map(token => [
      token.replace('hljs-', '').replace('hljs', 'default'),
      color,
    ]);
  };

  return (root, result) => {
    const rules = root.nodes
      .map(walk)
      .filter(res => !!res.length)
      .map(parseSelectors)
      .flat();

    result.figmaRules = rules;

    return result;
  };
});
