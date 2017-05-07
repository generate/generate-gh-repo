'use strict';

process.env.GENERATOR_TEST = true;
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

var cwd = process.cwd();
var fixtures = path.resolve.bind(path, __dirname, 'fixtures');

function setupMock() {
  var data1 = {
    owner: 'doowb',
    repo: 'my-project',
    name: 'my-project',
    description: 'test project',
    homepage: 'https://github.com/doowb/my-project',
    private: true
  };

  var data2 = {
    owner: 'doowb',
    repo: 'my-project',
    name: 'my-project',
    description: 'test project',
    homepage: 'https://github.com/doowb',
    private: true
  };

  mock.get('/repos/doowb/my-project')
    .query(true)
    .reply(200, {message: 'Not Found'})
    .post('/user/repos', data1)
    .query(true)
    .reply(200, {foo: 'bar'})
    .post('/user/repos', data2)
    .query(true)
    .reply(200, {foo: 'bar'});
}

describe('generate-gh-repo', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  describe('tasks', function() {
    beforeEach(function() {
      process.chdir(fixtures());
      mock = nock('https://api.github.com');
      app = generate({
        cwd: fixtures(),
        silent: true
      });
      app.use(generator);
      bddStdin(
        '\n', // Use saved credentials
        '\n', // project name
        '\n', // project description
        '\n', // project owner
        '\n', // project type
        '\n', // project homepage
        '\n', // private
        '\n', // create project?
        '\n', // git remote?
        'n\n' // enable travis-ci?
      );
    });

    afterEach(function() {
      process.chdir(cwd);
    });

    it('should return an error when the project already exists', function(cb) {
      mock.get('/repos/doowb/my-project')
        .query(true)
        .reply(200, {id: 123});

      app.build('default', function(err, results) {
        if (!err) return cb(new Error('expected an error'));
        try {
          assert.equal(err.message, 'Repository already exists.');
          cb();
        } catch(err) {
          cb(err);
        }
      });
    });

    it('should run the `default` task with .build', function(cb) {
      setupMock();
      app.build('default', cb);
    });

    it('should run the `default` task with .generate', function(cb) {
      setupMock();
      app.generate('default', cb);
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      beforeEach(function() {
        process.chdir(fixtures());
        mock = nock('https://api.github.com');
        app = generate({
          cwd: fixtures(),
          silent: true
        });
        app.use(generator);
        setupMock();
        bddStdin(
          '\n', // Use saved credentials
          '\n', // project name
          '\n', // project description
          '\n', // project owner
          '\n', // project type
          '\n', // project homepage
          '\n', // private
          '\n', // create project?
          'n\n' // enable travis-ci?
        );
      });

      afterEach(function() {
        process.chdir(cwd);
      });

      it('should run the default task using the `generate-gh-repo` name', function(cb) {
        app.generate('generate-gh-repo', cb);
      });

      it('should run the default task using the `generator` generator alias', function(cb) {
        app.generate('gh-repo', cb);
      });
    });
  }

  describe('generator (API)', function() {
    beforeEach(function() {
      process.chdir(fixtures());
      mock = nock('https://api.github.com');
      app = generate({
        cwd: fixtures(),
        silent: true
      });
      setupMock();
      bddStdin(
        '\n', // Use saved credentials
        '\n', // project name
        '\n', // project description
        '\n', // project owner
        '\n', // project type
        '\n', // project homepage
        '\n', // private
        '\n', // create project?
        'n\n' // enable travis-ci?
      );
    });

    afterEach(function() {
      process.chdir(cwd);
    });

    it('should run the default task on the generator', function(cb) {
      app.register('foo', generator);
      app.generate('foo', cb);
    });

    it('should run the `gh-repo` task', function(cb) {
      app.register('foo', generator);
      app.generate('foo:gh-repo', cb);
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('foo', generator);
      app.generate('foo:default', cb);
    });
  });

  describe('sub-generator', function() {
    beforeEach(function() {
      process.chdir(fixtures());
      mock = nock('https://api.github.com');
      app = generate({
        cwd: fixtures(),
        silent: true
      });
      setupMock();
      bddStdin(
        '\n', // Use saved credentials
        '\n', // project name
        '\n', // project description
        '\n', // project owner
        '\n', // project type
        '\n', // project homepage
        '\n', // private
        '\n', // create project?
        'n\n' // enable travis-ci?
      );
    });

    afterEach(function() {
      process.chdir(cwd);
    });

    it('should work as a sub-generator', function(cb) {
      app.register('foo', function(foo) {
        foo.register('gh-repo', generator);
      });
      app.generate('foo.gh-repo', cb);
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('gh-repo', generator);
      });
      app.generate('foo.gh-repo', cb);
    });

    it('should run the `gh-repo:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('gh-repo', generator);
      });
      app.generate('foo.gh-repo:default', cb);
    });

    it('should run the `gh-repo:gh-repo` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('gh-repo', generator);
      });
      app.generate('foo.gh-repo:gh-repo', cb);
    });

    it('should work with nested sub-generators', function(cb) {
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator);
      app.generate('foo.bar.baz', cb);
    });
  });
});
