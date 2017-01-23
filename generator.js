'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, 'generate-gh-repo')) return;

  /**
   * Generate a `index.js` file to the current working directory. Learn how to [customize
   * behavior(#customization) or override built-in templates.
   *
   * ```sh
   * $ gen gh-repo:gh-repo
   * ```
   * @name gh-repo:gh-repo
   * @api public
   */

  task(app, 'gh-repo', 'index.js');

  /**
   * Alias for running the [gh-repo](#gh-repo) task with the following command:
   *
   * ```sh
   * $ gen gh-repo
   * ```
   * @name gh-repo
   * @api public
   */

  app.task('default', ['gh-repo']);
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern) {
  app.task(name, function() {
    return app.src(pattern, {cwd: __dirname})
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(app.cwd))
      .pipe(app.dest(app.cwd));
  });
}
