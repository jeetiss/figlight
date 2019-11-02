const ast = store => {
  store.on('@init', () => ({ trees: {} }));

  store.on('ast/add', (store, ast) => ({
    trees: {
      ...store.trees,
      ...ast,
    },
  }));
};

export { ast };
