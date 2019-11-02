// @ts-check

import logger from 'storeon/devtools/logger';
import syncer from './syncer';

import create from '../shared/destroy-storeon';
import { value, list } from '../shared/state';

import './ui.css';

const languageSelector = document.querySelector('.js-lang');
const schemeSelector = document.querySelector('.js-style');

// const closeButton = document.querySelector('button.js-close');
const applyButton = document.querySelector('button.js-apply');

const isDev = process.env.NODE_ENV !== 'production';

const select = (el, name) => store => {
  const select = el.querySelector('select');
  const button = el.querySelector('div');

  const handler = e => store.dispatch('value/change', e.target.value);
  select.addEventListener('change', handler);

  return [
    () => select.removeEventListener('change', handler),
    store.on('@changed', (_, changed) => {
      if (changed[name]) {
        changed[name].forEach((option, i) => {
          select.options[i] = new Option(option);
        });
      }

      if (typeof changed.value !== 'undefined') {
        button.innerText = changed.value;
        select.value = changed.value;
      }

      if (typeof changed.disabled !== 'undefined') {
        changed.disabled
          ? select.setAttribute('disabled', '')
          : select.removeAttribute('disabled');

        el.classList.toggle('disabled', changed.disabled);
      }
    }),
  ];
};

const language = create([
  value('value'),
  value('disabled', false),
  list('language'),
  syncer('language'),
  select(languageSelector, 'language'),
  isDev && logger,
]);

const style = create([
  value('value'),
  value('disabled', false),
  list('style'),
  syncer('style'),
  select(schemeSelector, 'style'),
  isDev && logger,
]);

const plugin = create([syncer('plugin'), isDev && logger]);

applyButton.addEventListener('click', () => {
  plugin.dispatch('plugin/apply');
});

// closeButton.addEventListener('click', () => {
//   plugin.dispatch('plugin/close');

//   // @ts-ignore
//   [plugin, style, language].forEach(mdl => mdl.destroy());
// });
