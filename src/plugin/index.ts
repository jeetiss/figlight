import * as createStore from 'storeon';
import * as logger from 'storeon/devtools/logger';

import low from 'lowlight/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

import syncState from '../shared/sync-state';
import { selection, lang } from '../shared/state';
import { ast } from './ast';

low.registerLanguage('javascript', js);
low.registerLanguage('html', xml);
low.registerLanguage('css', css);

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

setInterval(() => {
  const { selection } = <any>store.get();
  const slct = figma.currentPage.selection;
  const newValue = slct.map(({ id }) => id).join('-');

  if (newValue !== selection) {
    store.dispatch('selection/set', newValue);
  }
}, 200);
