# cacheman-express
Cache middleware for express.js

```javascript
var Cacheman = require('cacheman');
var Engine = require('cacheman-...');
var CachemanExpress = require('cacheman-express');

var engine = new Engine();
var cacheman = new Cacheman({ engine: engine });

var expressCache = new CachemanExpress({
	cacheman: cacheman,
	ttl: '10s'
});

app.get('/api/:collection', expressCache.cache(), function(req, res, next) {
  res.send({ foo: 'bar' });
});

app.post('/api/:collection', expressCache.clear(), function(req, res, next) {
  res.send({ foo: 'bar' });
});

app.get('/api/:collection/:id', expressCache.cache('1s'), function(req, res, next) {
  res.send({ foo: 'bar' });
});

app.delete('/api/:collection/:id', expressCache.clear({ deleteKey: '/api/:collection' }), function(req, res, next) {
  res.send({ foo: 'bar' });
});

```
