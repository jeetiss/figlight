export default (prefix = '') => {
  return function(store) {
    store.on('@dispatch', function(state, data) {
      if (data[0] === '@changed') {
        var keys = Object.keys(data[1]).join(', ');
        console.log(prefix + ' changed ' + keys, state);
      } else if (typeof data[1] !== 'undefined') {
        console.log(prefix + ' action ' + String(data[0]), data[1]);
      } else {
        console.log(prefix + ' action ' + String(data[0]));
      }
    });
  };
};
