'use strict';

const assert = require('chai').assert;
const Cacheman = require('Cacheman');
const express = require('express');
const request = require('supertest');

const CachemanExpress = require('../src/');
const testData = {foo: 'bar'};
const keyFn = function (req) { return req.path; };

const cacheman = new Cacheman('test', {ttl: 5});
const cacheExpr = CachemanExpress(cacheman, keyFn);

describe('cacheman-express', () => {
  let app = null;

  before(() => {
    app = express()
      .use(cacheExpr)
      .use(getData);
  });

  it('must return data and cache it if not in store', (done) => {
    request(app)
      .get('/')
      .expect(mustReturnCorrectData)
      .expect(mustCacheData)
      .expect(200, done);
  });

  it('must returned cached data if in store', (done) => {
    const _set = cacheman.set;
    cacheman.set = () => { assert.fail('Must not be called'); };

    request(app)
      .get('/')
      .expect(mustReturnCorrectData)
      .expect(200, (err) => {
        cacheman.set = _set;
        return done(err);
      });
  });

  it('must del cached data if writing new data', (done) => {
    request(app)
      .post('/')
      .expect(mustDelCachedData)
      .expect(mustReturnCorrectData)
      .expect(200, done);
  });
});

function getData(req, res) {
  return res.send(testData);
}

function mustReturnCorrectData(res) {
  assert.deepEqual(JSON.parse(res.text), testData);
}

function mustCacheData(res, next) {
  cacheman.get(keyFn(res.req), (err, data) => {
    if (err)
      return next(err);

    assert.deepEqual(data, testData);
    return next();
  });
}

function mustDelCachedData(res, next) {
  cacheman.get(keyFn(res.req), (err, data) => {
    if (err)
      return next(err);

    assert.isUndefined(data);
    return next();
  });
}
