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
  let ignoreDate = '';
  let counter = 0;

  return store => {
    store.on('@dispatch', function(_, event) {
      const [type, state] = event;
      if (type[0] === '@') return;

      if (ignoreNext) {
        ignoreNext = false;
        return;
      }

      if (filter && !filter(type, state)) return;

      ignoreDate = Date.now() + '' + counter++;

      send([type, state, ignoreDate]);
    });

    subscribe(([type, state, ignore]) => {
      if (ignoreDate !== ignore) {
        ignoreNext = true;
        store.dispatch(type, state);
      }
    });
  };
};

export default syncState;
