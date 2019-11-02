// @ts-check

import cross from 'cross-storeon';

const uiSyncer = key =>
  cross({
    key,
    subscribe: cb => {
      let handler = event => cb(event.data.pluginMessage);
      window.addEventListener('message', handler);

      return () => window.removeEventListener('message', handler);
    },
    send: arg => parent.postMessage({ pluginMessage: arg }, '*'),
  });

export default uiSyncer;
