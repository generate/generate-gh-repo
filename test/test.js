'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var nock = require('nock');
var assert = require('assert');
var generate = require('generate');
var bddStdin = require('bdd-stdin');
var npm = require('npm-install-global');
var generator = require('../');
var pkg = require('../package');
var app, mock;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

describe('generate-gh-repo', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  beforeEach(function() {
    mock = nock('https://api.github.com');
    app = generate({
      silent: true
    });
    app.cwd = fixtures();
  });

  describe('tasks', function() {
    beforeEach(function() {
      app.use(generator);
    });

    it('should ', function(cb) {
      mock.get('/repos/doowb/my-project')
        .query(true)
        .reply(200, {foo: 'bar'});

      var github = require('github-base')();
      github.get('/repos/:owner/:repo', {owner: 'doowb', repo: 'my-project'}, function(err, res) {
        if (err) return cb(err);
        console.log(res);
        cb();
      });
    });

    // it('should run the `default` task with .build', function(cb) {
    //   app.build('default', exists('test.js', cb));
    // });

    // it('should run the `default` task with .generate', function(cb) {
    //   app.generate('default', exists('test.js', cb));
    // });
  });

  // if (!process.env.CI && !process.env.TRAVIS) {
  //   describe('generator (CLI)', function() {
  //     beforeEach(function() {
  //       bddStdin('\n');
  //       app.use(generator);
  //     });

  //     it('should run the default task using the `generate-gh-repo` name', function(cb) {
  //       app.generate('generate-gh-repo', exists('test.js', cb));
  //     });

  //     it('should run the default task using the `generator` generator alias', function(cb) {
  //       app.generate('gh-repo', exists('test.js', cb));
  //     });
  //   });
  // }

  // describe('generator (API)', function() {
  //   beforeEach(function() {
  //     bddStdin('\n');
  //   });

  //   it('should run the default task on the generator', function(cb) {
  //     app.register('gh-repo', generator);
  //     app.generate('gh-repo', exists('test.js', cb));
  //   });

  //   it('should run the `gh-repo` task', function(cb) {
  //     app.register('gh-repo', generator);
  //     app.generate('gh-repo:gh-repo', exists('test.js', cb));
  //   });

  //   it('should run the `default` task when defined explicitly', function(cb) {
  //     app.register('gh-repo', generator);
  //     app.generate('gh-repo:default', exists('test.js', cb));
  //   });
  // });

  // describe('sub-generator', function() {
  //   beforeEach(function() {
  //     bddStdin('\n');
  //   });

  //   it('should work as a sub-generator', function(cb) {
  //     app.register('foo', function(foo) {
  //       foo.register('gh-repo', generator);
  //     });
  //     app.generate('foo.gh-repo', exists('test.js', cb));
  //   });

  //   it('should run the `default` task by default', function(cb) {
  //     app.register('foo', function(foo) {
  //       foo.register('gh-repo', generator);
  //     });
  //     app.generate('foo.gh-repo', exists('test.js', cb));
  //   });

  //   it('should run the `gh-repo:default` task when defined explicitly', function(cb) {
  //     app.register('foo', function(foo) {
  //       foo.register('gh-repo', generator);
  //     });
  //     app.generate('foo.gh-repo:default', exists('test.js', cb));
  //   });

  //   it('should run the `gh-repo:gh-repo` task', function(cb) {
  //     app.register('foo', function(foo) {
  //       foo.register('gh-repo', generator);
  //     });
  //     app.generate('foo.gh-repo:gh-repo', exists('test.js', cb));
  //   });

  //   it('should work with nested sub-generators', function(cb) {
  //     app
  //       .register('foo', generator)
  //       .register('bar', generator)
  //       .register('baz', generator);
  //     app.generate('foo.bar.baz', exists('test.js', cb));
  //   });
  // });
});
