import * as createStore from 'storeon';
import syncState from '../shared/sync-state';
import logger from '../shared/logger';

const idInput = document.getElementById('id') as HTMLInputElement;
const langInput = document.getElementById('lang') as HTMLInputElement;

const selection = store => {
  store.on('@init', () => ({ value: '' }));
  store.on('set/selection', (_, { value }) => {
    return { value };
  });  
};

const lang = store => {
  store.on('@init', () => ({ language: '' }))
  store.on('set/lang', (_, language) => ( { language }))
}

const store = createStore([
  selection,
  lang,
  syncState({
    subscribe: cb => {
      window.onmessage = event => cb(event.data.pluginMessage);
    },
    send: (arg) => parent.postMessage({ pluginMessage: arg }, '*'),
  }),
  logger('UI:')
]);

store.on('@changed', ({ value, language }: any) => {
  if (value) {
    idInput.value = value;
  }

  if (language) {
    langInput.value = language
  }
});