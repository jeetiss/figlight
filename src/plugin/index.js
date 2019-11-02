// @ts-check
/// <reference path="../../figma.d.ts" />

const logger = require('storeon/devtools/logger');

const syncer = require('./syncer').default;
const create = require('../shared/destroy-storeon').default;
// @ts-ignore
const { value, list } = require('../shared/state');

figma.showUI(__html__, { width: 185, height: 200 });

const isDev = process.env.NODE_ENV !== 'production';

// state
const language = create([
  value('value'),
  value('disabled', false),
  list('language'),
  syncer('language'),
  isDev && logger,
]);

const style = create([
  value('value'),
  value('disabled', false),
  list('style'),
  syncer('style'),
  isDev && logger,
]);

const plugin = create([syncer('plugin'), isDev && logger]);

let ast = {};

// changes
const selectionChange = () => {
  const selections = figma.currentPage.selection;
  const allText = selections.every(slct => slct.type === 'TEXT');
  const { language: langList, disabled, value } = language.get();

  if (selections.length > 0 && allText) {
    const asts = selections.reduce((all, slct) => {
      // @ts-ignore
      let cached = ast[slct.id] && ast[slct.id].text === slct.characters;

      // @ts-ignore
      all[slct.id] = cached ? ast[slct.id] : highlight(slct.characters);

      return all;
    }, {});

    ast = {
      ...ast,
      ...asts,
    };

    const languages = Object.values(asts).map(ast => ast.language);

    disabled && language.dispatch('disabled/change', false);

    if (new Set(languages).size === 1) {
      langList.indexOf('Mixed') === -1 ||
        language.dispatch('language/remove', 'Mixed');

      value !== languages[0] && language.dispatch('value/change', languages[0]);
    } else {
      langList.indexOf('Mixed') === -1 &&
        language.dispatch('language/add', 'Mixed');

      value !== 'Mixed' && language.dispatch('value/change', 'Mixed');
    }
  } else {
    disabled || language.dispatch('disabled/change', true);
  }
};

figma.on('selectionchange', selectionChange);

plugin.on('plugin/close', () => {
  // @ts-ignore
  [plugin, style, language].forEach(mdl => mdl.destroy());
  figma.closePlugin();
});

plugin.on('plugin/apply', () => {
  const { value: selectedStyle } = style.get();
  const { value: selectedLanguage } = language.get();

  const currentTheme = styles[revert[selectedStyle]].style;

  if (figma.currentPage.selection.length === 0) {
    figma.notify(
      'Please select Text Node with code before applying color scheme'
    );
  } else {
    figma.currentPage.selection.forEach(slct => {
      const useCache =
        ast[slct.id] &&
        (ast[slct.id].language === selectedLanguage ||
          selectedLanguage === 'Mixed');

      const rules = useCache
        ? ast[slct.id]
        : // @ts-ignore
          highlight(slct.characters, selectedLanguage);

      const [run, data] = timer(() => {
        travel(rules.value, (_, start, end, styles) => {
          const paints = styles.map(style => currentTheme[style]);

          if (paints.every(paint => !!paint)) {
            // @ts-ignore
            pokras(start, end, paints);
          }
        });
      });

      const [pokras, porkData] = timer((start, end, paints) => {
        // @ts-ignore
        slct.setRangeFills(start, end, paints);
      });

      // @ts-ignore
      pokras(0, slct.characters.length, [currentTheme.default]);
      // @ts-ignore
      run();

      // @ts-ignore
      console.log('travel: ', data);
      // @ts-ignore
      console.log('setRangeFills: ', porkData);
    });
  }
});

const timer = cb => {
  const ref = { time: 0, calls: 0 };

  const fn = (...args) => {
    let start = Date.now();
    let result = cb(...args);
    ref.time += Date.now() - start;
    ref.calls += 1;

    return result;
  };

  return [fn, ref];
};

const travel = (nodes, cb, index = 0, name = ['default']) => {
  let currentIndex = index;

  nodes.forEach(node => {
    if (node.type === 'text') {
      cb(node.value, currentIndex, (currentIndex += node.value.length), name);
    } else if (node.type === 'element') {
      const newName = node.properties.className;

      currentIndex = travel(node.children, cb, currentIndex, newName);
    }
  });

  return currentIndex;
};

// init languages
const low = require('lowlight/lib/core');
const { languages } = require('./languages');

// @ts-ignore
languages.forEach(([name, syntax]) => low.registerLanguage(name, syntax));
language.dispatch('language/change', languages.map(([name]) => name));
// @ts-ignore
language.dispatch('value/change', languages[0][0]);

const highlight = (text, language) => {
  let defaultOptions = { prefix: '' };

  let res = language
    ? low.highlight(language, text, defaultOptions)
    : low.highlightAuto(text, defaultOptions);

  return { text, language: res.language, value: res.value };
};

// init styles
const styles = require('../styles');
const revert = Object.entries(styles).reduce((rev, [key, value]) => {
  rev[value.name] = key;

  return rev;
}, {});
// @ts-ignore
const themes = Object.entries(styles).map(([key, value]) => value.name);

style.dispatch('style/change', themes);
style.dispatch('value/change', themes[0]);
selectionChange();
