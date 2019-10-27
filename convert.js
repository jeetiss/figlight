const parser = require('postcss-selector-parser');
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const changeCase = require('change-case');
const parse = require('color-parse');

const fix = val => Number(val.toFixed(3));

const valuesToRGB = ({ values: [r, g, b] }) =>
  JSON.stringify({
    r: fix((r /= 255)),
    g: fix((g /= 255)),
    b: fix((b /= 255)),
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

const highlightStyles = [
  ['a11y-dark', 'a11y-dark.css'],
  ['a11y-light', 'a11y-light.css'],
  ['agate', 'agate.css'],
  ['an-old-hope', 'an-old-hope.css'],
  ['androidstudio', 'androidstudio.css'],
  ['arduino-light', 'arduino-light.css'],
  ['arta', 'arta.css'],
  ['ascetic', 'ascetic.css'],
  ['atelier-cave-dark', 'atelier-cave-dark.css'],
  ['atelier-cave-light', 'atelier-cave-light.css'],
  ['atelier-dune-dark', 'atelier-dune-dark.css'],
  ['atelier-dune-light', 'atelier-dune-light.css'],
  ['atelier-estuary-dark', 'atelier-estuary-dark.css'],
  ['atelier-estuary-light', 'atelier-estuary-light.css'],
  ['atelier-forest-dark', 'atelier-forest-dark.css'],
  ['atelier-forest-light', 'atelier-forest-light.css'],
  ['atelier-heath-dark', 'atelier-heath-dark.css'],
  ['atelier-heath-light', 'atelier-heath-light.css'],
  ['atelier-lakeside-dark', 'atelier-lakeside-dark.css'],
  ['atelier-lakeside-light', 'atelier-lakeside-light.css'],
  ['atelier-plateau-dark', 'atelier-plateau-dark.css'],
  ['atelier-plateau-light', 'atelier-plateau-light.css'],
  ['atelier-savanna-dark', 'atelier-savanna-dark.css'],
  ['atelier-savanna-light', 'atelier-savanna-light.css'],
  ['atelier-seaside-dark', 'atelier-seaside-dark.css'],
  ['atelier-seaside-light', 'atelier-seaside-light.css'],
  ['atelier-sulphurpool-dark', 'atelier-sulphurpool-dark.css'],
  ['atelier-sulphurpool-light', 'atelier-sulphurpool-light.css'],
  ['atom-one-dark-reasonable', 'atom-one-dark-reasonable.css'],
  ['atom-one-dark', 'atom-one-dark.css'],
  ['atom-one-light', 'atom-one-light.css'],
  ['brown-paper', 'brown-paper.css'],
  ['codepen-embed', 'codepen-embed.css'],
  ['color-brewer', 'color-brewer.css'],
  ['darcula', 'darcula.css'],
  ['dark', 'dark.css'],
  ['darkula', 'darkula.css'],
  ['highligth-js', 'default.css'],
  ['docco', 'docco.css'],
  ['dracula', 'dracula.css'],
  ['far', 'far.css'],
  ['foundation', 'foundation.css'],
  ['github-gist', 'github-gist.css'],
  ['github', 'github.css'],
  ['gml', 'gml.css'],
  ['googlecode', 'googlecode.css'],
  ['grayscale', 'grayscale.css'],
  ['gruvbox-dark', 'gruvbox-dark.css'],
  ['gruvbox-light', 'gruvbox-light.css'],
  ['hopscotch', 'hopscotch.css'],
  ['hybrid', 'hybrid.css'],
  ['idea', 'idea.css'],
  ['ir-black', 'ir-black.css'],
  ['isbl-editor-dark', 'isbl-editor-dark.css'],
  ['isbl-editor-light', 'isbl-editor-light.css'],
  ['kimbie.dark', 'kimbie.dark.css'],
  ['kimbie.light', 'kimbie.light.css'],
  ['lightfair', 'lightfair.css'],
  ['magula', 'magula.css'],
  ['mono-blue', 'mono-blue.css'],
  ['monokai-sublime', 'monokai-sublime.css'],
  ['monokai', 'monokai.css'],
  // ['night-owl', 'night-owl.css'],
  ['nord', 'nord.css'],
  ['obsidian', 'obsidian.css'],
  ['ocean', 'ocean.css'],
  ['paraiso-dark', 'paraiso-dark.css'],
  ['paraiso-light', 'paraiso-light.css'],
  ['pojoaque', 'pojoaque.css'],
  ['purebasic', 'purebasic.css'],
  ['qtcreator_dark', 'qtcreator_dark.css'],
  ['qtcreator_light', 'qtcreator_light.css'],
  ['railscasts', 'railscasts.css'],
  ['rainbow', 'rainbow.css'],
  ['routeros', 'routeros.css'],
  ['school-book', 'school-book.css'],
  ['shades-of-purple', 'shades-of-purple.css'],
  ['solarized-dark', 'solarized-dark.css'],
  ['solarized-light', 'solarized-light.css'],
  ['sunburst', 'sunburst.css'],
  ['tomorrow-night-blue', 'tomorrow-night-blue.css'],
  ['tomorrow-night-bright', 'tomorrow-night-bright.css'],
  ['tomorrow-night-eighties', 'tomorrow-night-eighties.css'],
  ['tomorrow-night', 'tomorrow-night.css'],
  ['tomorrow', 'tomorrow.css'],
  ['vs', 'vs.css'],
  ['vs2015', 'vs2015.css'],
  ['xcode', 'xcode.css'],
  ['xt256', 'xt256.css'],
  ['zenburn', 'zenburn.css'],
];

const pcss = postcss([walker]);
const stylesPath = './src/styles/';

highlightStyles.forEach(([name, cssFile]) => {
  fs.readFile(require.resolve(`highlight.js/styles/${cssFile}`), (err, css) => {
    pcss
      .process(css, { from: undefined })
      .then(result => {
        const code = styleTemplate(name, result.figmaRules);
        const file = path.join(__dirname, stylesPath, `${name}.js`);

        fs.writeFile(file, code, err => err && console.log(name, err));
      })
      .catch(err => err && console.log(name, err));
  });
});

const styleTemplate = (name, rules) => {
  const styleNameVar = changeCase.camelCase(name);
  const styleDisplayNameVar = `${styleNameVar}DisplayName`;

  return `
    const ${styleDisplayNameVar} = '${changeCase.sentenceCase(name)}';
  
    const ${styleNameVar} = {
      ${rules
        .map(
          ([token, color]) => `'${token}': {
        type: 'SOLID',
        color: ${valuesToRGB(parse(color))},
      },`
        )
        .join('\n')}
    }
  
    export { ${styleNameVar}, ${styleDisplayNameVar} }
  `;
};
