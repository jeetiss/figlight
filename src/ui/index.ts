import * as createStore from 'storeon';
import * as logger from 'storeon/devtools/logger';

import syncState from '../shared/sync-state';
import { selection, lang, theme } from '../shared/state';

const idInput = document.getElementById('id') as HTMLInputElement;
const langInput = document.getElementById('lang') as HTMLInputElement;
const selectContainer = document.getElementById('theme');

const closeButton = document.querySelector('button.js-close');
const applyButton = document.querySelector('button.js-apply');

const store = createStore([
  selection,
  lang,
  theme,
  syncState({
    subscribe: cb => {
      window.onmessage = event => cb(event.data.pluginMessage);
    },
    send: arg => parent.postMessage({ pluginMessage: arg }, '*'),
  }),
  logger,
]);

applyButton.addEventListener('click', () => {
  store.dispatch('plugin/apply');
});

closeButton.addEventListener('click', () => {
  store.dispatch('plugin/close');
});

let destroySelector = null;

store.on('@changed', (_, { selection, language, theme }: any) => {
  if (typeof selection === 'string') {
    idInput.value = selection;
  }

  if (typeof language === 'string') {
    langInput.value = language;
  }

  if (theme) {
    destroySelector && destroySelector();

    selectContainer.innerHTML = `<select>${theme.list
      .map(
        ([value, text]) =>
          `<option ${
            theme.active === value ? 'selected' : ''
          } value=${value}>${text}</option>`
      )
      .join(' ')}</select>`;

    const select = selectContainer.querySelector('select');
    const handler = e => store.dispatch('theme/select', e.target.value);

    select.addEventListener('change', handler);
    destroySelector = () => select.removeEventListener('change', handler);
  }
});
