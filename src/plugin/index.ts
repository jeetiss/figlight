import * as createStore from 'storeon';
import * as logger from 'storeon/devtools/logger';

import low from 'lowlight/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

import syncState from '../shared/sync-state';
import { selection, lang } from '../shared/state';

low.registerLanguage('javascript', js);
low.registerLanguage('html', xml);
low.registerLanguage('css', css);

const store = createStore([
  selection,
  lang,
  syncState({
    subscribe: cb => {
      figma.ui.onmessage = msg => cb(msg);
    },
    send: arg => figma.ui.postMessage(arg),
  }),
  logger,
]);

figma.showUI(__html__);

store.on('@changed', (_, { selection, language }: any) => {
  if (selection) {
    const slct = figma.currentPage.selection[0] as TextNode;
    const result = low.highlightAuto(slct.characters, { prefix: '' });

    store.dispatch('set/lang', result.language);
  }

  if (language) {
    console.log('lang changes', language);
  }
});

setInterval(() => {
  const { selection } = <any>store.get();
  const slct = figma.currentPage.selection;
  const newValue =
    slct && slct.every(({ type }) => type === 'TEXT')
      ? slct.map(({ id }) => id).join('-')
      : '';

  if (newValue !== selection && newValue !== '') {
    console.log('lil');
    store.dispatch('set/selection', newValue);
  }
}, 200);
