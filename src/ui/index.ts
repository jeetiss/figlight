import * as createStore from 'storeon';
import * as logger from 'storeon/devtools/logger';

import syncState from '../shared/sync-state';
import { selection, lang } from '../shared/state';

const idInput = document.getElementById('id') as HTMLInputElement;
const langInput = document.getElementById('lang') as HTMLInputElement;

const store = createStore([
  selection,
  lang,
  syncState({
    subscribe: cb => {
      window.onmessage = event => cb(event.data.pluginMessage);
    },
    send: arg => parent.postMessage({ pluginMessage: arg }, '*'),
  }),
  logger,
]);

store.on('@changed', (_, { selection, language }: any) => {
  if (typeof selection === 'string') {
    idInput.value = selection;
  }

  if (typeof language === 'string') {
    langInput.value = language;
  }
});
