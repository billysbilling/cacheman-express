'use strict';

const CachemanExpress = require('./cacheman-express');

module.exports = (cache, getKeyFn) => {
  const cacheExpress = new CachemanExpress(cache, getKeyFn);
  return cacheExpress.middleware.bind(cacheExpress);
};
