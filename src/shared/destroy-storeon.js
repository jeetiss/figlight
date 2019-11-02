import storeon from 'storeon';

var create = function(modules) {
  var subs = [];
  var destroy = function() {
    subs.forEach(function(i) {
      if (i) i();
    });
  };

  var store = storeon([
    store => {
      modules.forEach(function(i) {
        if (i) subs = subs.concat(i(store));
      });
    },
  ]);

  store.destroy = destroy;

  return store;
};

export default create;
