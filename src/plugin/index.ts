import * as createStore from 'storeon';

import low from 'lowlight/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

import syncState from '../shared/sync-state';
import logger from '../shared/logger';

low.registerLanguage('javascript', js);
low.registerLanguage('html', xml);
low.registerLanguage('css', css);

const selection = store => {
  store.on('@init', () => {
    return { value: '' };
  });

  store.on('set/selection', (_, { value }) => {
    return { value };
  });
};

const lang = store => {
  store.on('@init', () => ({ language: '' }))
  store.on('set/lang', (_, language) => ({ language }))
}

const store = createStore([
  selection,
  lang,
  syncState({
    subscribe: cb => {
      figma.ui.onmessage = msg => cb(msg);
    },
    send: arg => figma.ui.postMessage(arg),
  }),
  logger('Worker:'),
]);

figma.showUI(__html__);

store.on('@changed', ({ value, language }: { value: any, language: any }) => {
  if (value) {
    const slct = figma.currentPage.selection[0] as TextNode;

    const result = low.highlightAuto(slct.characters, { prefix: '' })

    if (language !== result.language) {
      store.dispatch('set/lang', result.language) 
    }
  }

  if (language) {
    console.log('lang changes', language)
  }
})

setInterval(() => {
  const { value } = <any>store.get();
  const slct = figma.currentPage.selection;
  const newValue = slct && slct.every(({ type }) => type === 'TEXT')
    ? slct.map(({ id }) => id).join('-')
    : '';

  if (newValue !== value && newValue !== '') {
      store.dispatch('set/selection', { value: newValue });
    }
}, 200);
