cacheman-express
================

Cache middleware for express.js

```javascript
const express = require('express');
const Cacheman = require('cacheman');
const Engine = require('cacheman-...');
const CachemanExpress = require('cacheman-express');

// Usage for all application routes
const app = express();
const cacheman = new Cacheman('my-app-cache', {
  ttl: 60, // 1 minute
  engine: new Engine();
});
const keyFn = (req) => { return req.path; }
const expressCache = CachemanExpress(cacheman, keyFn);

app.use(expressCache);

// Will be called only if no data present in cache
app.route('/')
  .get((req, res, next) => {
    res.send({ foo: 'bar' });
  });

// Will delete data from cache
app.route('/')
  .post((req, res, next) => {
    // ...
  })
  .put((req, res, next) => {
    // ...
  })
  .patch((req, res, next) => {
    // ...
  })
  .delete((req, res, next) => {
    // ...
  });


// Usage for a particular route only
const app = express();
const cacheman = new Cacheman('my-app-cache', {
  ttl: 60, // 1 minute
  engine: new Engine();
});
const keyFn = (req) => { return req.path; }
const expressCache = CachemanExpress(cacheman, keyFn);

app.use('/collection/:id?', expressCache);

// Will be called only if no data present in cache
app.route('/collection/:id?')
  .get((req, res, next) => {
    res.send({ foo: 'bar' });
  });

// Will delete data from cache
app.route('/collection/:id?')
  .post((req, res, next) => {
    // ...
  })
  .put((req, res, next) => {
    // ...
  })
  .patch((req, res, next) => {
    // ...
  })
  .delete((req, res, next) => {
    // ...
  });
```
