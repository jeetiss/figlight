const value = (name, initial) => store => [
  store.on('@init', () => ({ [name]: initial })),
  store.on(`${name}/change`, (_, value) => ({ [name]: value })),
];

const list = (name, initial = []) => store => [
  store.on('@init', () => ({ [name]: initial })),
  store.on(`${name}/change`, (_, list) => ({ [name]: list })),
  store.on(`${name}/add`, (state, add) => ({ [name]: [add, ...state[name]] })),
  store.on(`${name}/remove`, (state, remove) => ({
    [name]: state[name].filter(v => v !== remove),
  })),
];

const set = (name, initial = {}) => store => [
  store.on('@init', () => ({ [name]: initial })),
  store.on(`${name}/change`, (_, list) => ({ [name]: list })),
  store.on(`${name}/add`, (state, { key, value }) => ({
    [name]: { ...state, [key]: value },
  })),
  store.on(`${name}/remove`, (state, { key }) => {
    let set = state[name];
    delete set[key];
    return { [name]: set };
  }),
];

export { value, list, set };
