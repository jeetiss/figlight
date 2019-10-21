const syncState = ({
  send,
  subscribe,
  filter,
}: {
  send: Function;
  subscribe: Function;
  filter?: Function;
}) => {
  let ignoreNext = false;

  return store => {
    store.on('@dispatch', function(_, event) {
      const [type, state] = event;
      if (type[0] === '@') return;

      if (ignoreNext) {
        ignoreNext = false;
        return;
      }

      if (filter && !filter(type, state)) return;

      send([type, state]);
    });

    subscribe(([type, state]) => {
      ignoreNext = true;
      store.dispatch(type, state);
    });
  };
};

export default syncState;
