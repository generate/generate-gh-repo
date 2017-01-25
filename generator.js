'use strict';

var path = require('path');
var extend = require('extend-shallow');
var isValid = require('is-valid-app');
var GitHub = require('github-base');
var github;

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, 'generate-gh-repo')) return;

  // use generate-data to collect project and repo information
  app.use(require('generate-data'));

  // configure a datastore to hold github authentication details
  var store = app.store.create('generate-gh-repo');

  // uitility to get a property from `app.cache.data`
  var getProp = function(prop) {
    return function() {
      return app.get(`cache.data.${prop}`);
    };
  };

  // questions to ask when prompting the user for information
  var prompts = [
    'project.name',
    'project.description',
    'project.owner',
    'project.type',
    'homepage',
    'private'
  ];

  /**
   * Setup prompts that may be asked later
   *
   * @name gh-repo:questions
   */

  app.task('questions', {silent: true}, function(cb) {
    // questions to gather information about the repository being created
    app.question('project.name', 'What is the name of the repository to create?', {
      default: getProp('project.name')
    });

    app.question('project.description', 'What is the description of the repository?', {
      default: getProp('project.description')
    });

    app.question('project.owner', 'Who is the owner of the repository?', {
      default: getProp('project.owner')
    });

    app.questions.list('project.type', {
      message: 'Is the repository owner a "user" or an "organization"?',
      choices: [
        'user',
        'organization'
      ]
    });

    app.question('homepage', 'What is the repository\'s homepage?', {
      default: getProp('homepage')
    });

    app.confirm('private', 'Is the repository private?', {
      default: function() {
        var val = getProp('private')();
        if (typeof val === 'boolean') {
          return val;
        }
        return false;
      }
    });

    // questions for gathering GitHub authentication information from the user
    app.confirm('useAuth', 'Found saved GitHub authentication. Would you like to use it?');
    app.question('github.auth.username', 'GitHub username?', {force: true});
    app.question('github.auth.password', 'GitHub password?', {force: true, type: 'password'});
    app.question('github.auth.token', 'GitHub OAuth token?', {force: true});
    app.questions.list('github.auth.type', {
      force: true,
      message: 'Would you like to login using an OAuth token or your GitHub username and password?',
      choices: [
        'token',
        'username/password'
      ]
    });

    cb();
  });

  /**
   * Prompt the user for information about the repository being created.
   *
   * ```sh
   * $ gen gh-repo:prompt
   * ```
   * @name gh-repo:prompt
   */

  app.task('prompt', {silent: true}, function(cb) {
    console.log();
    app.ask(prompts, {force: true}, function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb();
    });
  });

  /**
   * Prompt the user for GitHub authentication information
   *
   * ```sh
   * $ gen gh-repo:auth
   * ```
   * @name gh-repo:auth
   */

  app.task('github-auth', {silent: true}, function(cb) {
    console.log();
    var auth = store.get('github.auth');
    if (auth) {
      app.ask('useAuth', {force: true}, function(err, answers) {
        if (err) return cb(err);
        if (answers.useAuth) {
          app.data('github.auth', auth);
        } else {
          auth = null;
        }
        if (auth) return cb();
        app.ask('github.auth.type', handleGithubType);
      });
      return;
    }
    app.ask('github.auth.type', handleGithubType);

    function handleGithubType(err, answers) {
      if (err) return cb(err);
      var type = answers.github.auth.type;
      if (type === 'token') {
        app.ask('github.auth.token', handleAnswers);
        return;
      }

      app.ask([
        'github.auth.username',
        'github.auth.password'
      ], handleAnswers);
    }

    function handleAnswers(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      store.set('github.auth', answers.github.auth);
      cb();
    }
  });

  /**
   * Initialize the github instance using the user's GitHub authentication information.
   *
   * ```sh
   * $ gen gh-repo:init-github
   * ```
   * @name gh-repo:init-github
   */

  app.task('init-github', {silent: true}, ['github-auth'], function(cb) {
    var auth = getProp('github.auth')();
    if (!auth) {
      cb(new Error('Unable to authenticate to GitHub'));
      return;
    }

    github = new GitHub(auth);
    cb();
  });

  /**
   * Create a new repository on GitHub. The generator will attempt to use data from the current project's
   * package.json and git repository information, while prompting for user input and validation.
   *
   * ```sh
   * $ gen gh-repo:gh-repo
   * ```
   * @name gh-repo:gh-repo
   * @api public
   */

  app.task('gh-repo', ['questions', 'init-github', 'prompt'], function(cb) {
    console.log();
    var opts = {
      owner: getProp('project.owner')(),
      repo: getProp('project.name')()
    };

    var data = {
      name: getProp('project.name')(),
      description: getProp('project.description')(),
      homepage: getProp('homepage')(),
      private: getProp('private')()
    };

    github.get('/repos/:owner/:repo', opts, function(err, res) {
      if (err) return cb(err);
      if (res.id && !res.message) {
        console.log(app.log.timestamp);
        console.log(app.log.timestamp, `Unable to create new repository "${opts.owner}/${opts.repo}" because it already exists.`);
        console.log(app.log.timestamp);
        cb(new Error('Repository already exists.'));
        return;
      }

      if (res.message && res.message !== 'Not Found') {
        cb(new Error(res.message));
        return;
      }

      var type = getProp('project.type')();
      var fullName = '';
      var url = '';
      if (type === 'user') {
        url = '/user/repos';
        var username = getProp('github.auth.username')();
        fullName = (username && username + '/') || '';
      } else {
        url = '/orgs/:owner/repos';
        fullName = opts.owner + '/';
      }
      fullName += data.name;

      console.log(app.log.timestamp);
      console.log(app.log.timestamp, `Creating "${fullName}" with the following settings:`);
      console.log(app.log.timestamp, `  private:     ${data.private ? 'true' : 'false'}`);
      console.log(app.log.timestamp, `  homepage:    ${data.homepage}`);
      console.log(app.log.timestamp, `  description: ${data.description}`);
      console.log(app.log.timestamp);

      app.confirm('valid', 'Are you sure you want to create this repository?');
      console.log();
      app.ask('valid', function(err, answers) {
        console.log();
        if (err) return cb(err);
        if (!answers.valid) {
          console.log(app.log.timestamp);
          console.log(app.log.timestamp, 'The repository has not been created. Run `$ gen gh-repo` again to start over.');
          console.log(app.log.timestamp);
          return cb();
        }
        github.post(url, extend({}, opts, data), function(err, res) {
          if (err) return cb(err);
          if (res.message) {
            cb(new Error(res.message));
            return;
          }
          console.log(app.log.timestamp);
          console.log(app.log.timestamp, `"${opts.owner}/${opts.repo}" has been created.`);
          console.log(app.log.timestamp);
          cb();
        });
      });
    });
  });

  /**
   * Alias for running the [gh-repo](#gh-repo) task with the following command:
   *
   * ```sh
   * $ gen gh-repo
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['gh-repo']);
};
