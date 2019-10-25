const selection = store => {
  store.on('@init', () => ({ selection: '' }));
  store.on('selection/set', (_, value) => ({ selection: value }));
};

const lang = store => {
  store.on('@init', () => ({ language: '' }));
  store.on('lang/set', (_, language) => ({ language }));
};

export { selection, lang };
