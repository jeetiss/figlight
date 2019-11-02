// @ts-check

import cross from 'cross-storeon';

const pluginSyncer = (key, filter) =>
  cross({
    key,
    filter,
    subscribe: cb => {
      let handler = msg => cb(msg);
      figma.ui.on('message', handler);
      return () => figma.ui.off('message', handler);
    },
    send: arg => figma.ui.postMessage(arg),
  });

export default pluginSyncer;
