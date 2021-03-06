'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var generator = require('../');
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

describe('generate-gh-repo', function() {
  beforeEach(function() {
    app = generate({cwd: fixtures()});
  });

  describe('plugin', function() {
    it('should add tasks to the instance', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('gh-repo'));
    });

    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-gh-repo') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });
  });
});
