const selection = store => {
  store.on('@init', () => ({ selection: '' }));
  store.on('set/selection', (_, value) => ({ selection: value }));
};

const lang = store => {
  store.on('@init', () => ({ language: '' }));
  store.on('set/lang', (_, language) => ({ language }));
};

export { selection, lang };
