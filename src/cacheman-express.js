'use strict';

const debug = require('debug')('cacheman-express');
const interceptor = require('express-interceptor');

class CachemanExpress {
  constructor(cacheman, keyFn) {
    this.cacheman = cacheman;
    this.keyFn = keyFn || CachemanExpress.DEFAULT_KEY_FN;
  }

  middleware(req, res, next) {
    switch (req.method) {
      case 'GET':
        return this.read(req, res, next);
      case 'POST':
      case 'PUT':
      case 'PATCH':
      case 'DELETE':
        return this.write(req, res, next);
      default:
        return next();
    }
  }

  read(req, res, next) {
    const key = this.keyFn(req);

    return this.cacheman.get(key, (err, data) => {
      if (err)
        return next(err);

      if (data) {
        debug('get %s - %j', key, data);
        return res.send(data);
      }

      return this.cacheIntercept(key, req, res, next);
    });
  }

  write(req, res, next) {
    const key = this.keyFn(req);

    return this.cacheman.del(key, (err) => {
      if (err) {
        debug('failed to del %s', key);
        return next(err);
      }

      debug('del %s', key);
      return next();
    });
  }

  cacheIntercept(key, req, res, next) {
    return interceptor(() => {
      return {
        isInterceptable: () => { return true; },
        intercept: (data, send) => {
          // cache data
          this.cacheman.set(key, data, (err) => {
            if (err)
              return debug('failed to set %s - %j', key, data);

            debug('set %s - %j', key, data);
          });

          // resond to client
          process.nextTick(() => {
            send(data);
          });
        }
      };
    })(req, res, next);
  }

  static get DEFAULT_KEY_FN() {
    return (req) => {
      return req.url;
    };
  }
}

module.exports = CachemanExpress;
