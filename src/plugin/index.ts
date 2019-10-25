import * as createStore from 'storeon';
import * as logger from 'storeon/devtools/logger';

import low from 'lowlight/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import go from 'highlight.js/lib/languages/go';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';

import syncState from '../shared/sync-state';
import { selection, lang } from '../shared/state';
import { ast } from './ast';

import first from './style';

low.registerLanguage('html, xml', xml);
low.registerLanguage('css', css);
low.registerLanguage('js, jsx', js);
low.registerLanguage('go', go);
low.registerLanguage('C++', cpp);

const store = createStore([
  selection,
  lang,
  ast,
  syncState({
    filter: type => !type.startsWith('ast'),
    subscribe: cb => {
      figma.ui.onmessage = msg => cb(msg);
    },
    send: arg => figma.ui.postMessage(arg),
  }),
  logger,
]);

figma.showUI(__html__);

store.on('@changed', (_, { selection }: any) => {
  if (selection === '' || selection) {
    const selections = figma.currentPage.selection;

    const allText = selections.every(slct => slct.type === 'TEXT');

    if (selections.length > 0 && allText) {
      const asts = selections.reduce((all, slct: TextNode) => {
        all[slct.id] = low.highlightAuto(slct.characters, { prefix: '' });

        return all;
      }, {});

      store.dispatch('ast/add', asts);

      const languages = Object.values(asts).map((ast: any) => ast.language);

      if (new Set(languages).size === 1) {
        store.dispatch('lang/set', languages[0]);
      } else {
        store.dispatch('lang/set', 'Mixed');
      }
    } else {
      store.dispatch('lang/set', '');
    }
  }
});

store.on('plugin/close', () => {
  figma.closePlugin();
});

store.on('plugin/apply', (state: any) => {
  const slct = figma.currentPage.selection[0] as TextNode;

  const rules = state.trees[slct.id];

  if (rules) {
    travel(rules.value, (_, start, end, styles) => {
      console.log(_, start, end, styles);

      const paints = styles.map(style => first[style]);
      if (paints.every(paint => !!paint)) {
        slct.setRangeFills(start, end, paints);
      }
    });
  }
});

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

setInterval(() => {
  const { selection } = <any>store.get();
  const slct = figma.currentPage.selection;
  const newValue = slct.map(({ id }) => id).join('-');

  if (newValue !== selection) {
    store.dispatch('selection/set', newValue);
  }
}, 200);
