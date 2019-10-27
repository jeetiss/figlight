const selection = store => {
  store.on('@init', () => ({ selection: '' }));
  store.on('selection/set', (_, value) => ({ selection: value }));
};

const lang = store => {
  store.on('@init', () => ({ language: '' }));
  store.on('lang/set', (_, language) => ({ language }));
};

const theme = store => {
  store.on('@init', () => ({
    theme: {
      list: [],
      active: 'highligthJs',
    },
  }));

  store.on('theme/add', (store, theme) => ({
    theme: {
      ...store.theme,
      list: [...store.theme.list, ...theme],
    },
  }));

  store.on('theme/select', (store, value) => ({
    theme: {
      ...store.theme,
      active: value,
    },
  }));
};

export { selection, lang, theme };
