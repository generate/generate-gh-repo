<p align="center">

<a href="https://github.com/generate/generate">
<img height="150" width="150" src="https://raw.githubusercontent.com/generate/generate/master/docs/logo.png">
</a>
</p>

Generate generator to create a new repository on GitHub.

# generate-gh-repo

[![NPM version](https://img.shields.io/npm/v/generate-gh-repo.svg?style=flat)](https://www.npmjs.com/package/generate-gh-repo) [![NPM monthly downloads](https://img.shields.io/npm/dm/generate-gh-repo.svg?style=flat)](https://npmjs.org/package/generate-gh-repo) [![Build Status](https://img.shields.io/travis/generate/generate-gh-repo.svg?style=flat)](https://travis-ci.org/generate/generate-gh-repo)

![generate-gh-repo demo](https://raw.githubusercontent.com/generate/generate-gh-repo/master/docs/demo.gif)

## Usage

### CLI

When installed globally, the `gh-repo` generator is available to use through the `gen` command:

Create a new GitHub repository using the [default](#default) task.

```sh
$ gen gh-repo
```

### API

**Params**

* `app` **{Object}**: [generate](https://github.com/generate/generate) instance to add tasks to.

**Example**

```js
// use as a plugin with existing generate instance
// $ gen gh-repo
app.use(require('generate-gh-repo'));

// use as a subgenerator on an existing generate instance
// $ gen repo
app.register('repo', require('generate-gh-repo'));
```

## What is "Generate"?

Generate is a command line tool and developer framework for scaffolding out new GitHub projects using [generators](https://github.com/generate/generate/blob/master/docs/generators.md) and [tasks](https://github.com/generate/generate/blob/master/docs/tasks.md).

Answers to prompts and the user's environment can be used to determine the templates, directories, files and contents to build. Support for [gulp](http://gulpjs.com), [base](https://github.com/node-base/base) and [assemble](https://github.com/assemble/assemble) plugins, and much more.

**For more information**:

* Visit the [generate project](https://github.com/generate/generate/)
* Visit the [generate documentation](https://github.com/generate/generate/blob/master/docs/)
* Find [generators on npm](https://www.npmjs.com/browse/keyword/generate-generator) (help us [author generators](https://github.com/generate/generate/blob/master/docs/micro-generators.md))

## Getting started

### Install

**Installing the CLI**

To run the `gh-repo` generator from the command line, you'll need to install [Generate](https://github.com/generate/generate) globally first. You can do that now with the following command:

```sh
$ npm install --global generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

**Install generate-gh-repo**

Install this module with the following command:

```sh
$ npm install --global generate-gh-repo
```

### Usage

Run this generator's `default` [task](https://github.com/generate/generate/blob/master/docs/tasks.md#default) with the following command:

```sh
$ gen gh-repo
```

**What you should see in the terminal**

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).

### Help

To see a general help menu and available commands for Generate's CLI, run:

```sh
$ gen help
```

## Tasks

All available tasks.

### [gh-repo:gh-repo](generator.js#L228)

Create a new repository on GitHub. The generator will attempt to use data from the current project's package.json and git repository information, while prompting for user input and validation.

**Example**

```sh
$ gen gh-repo:gh-repo
```

### [gh-repo:enable-travis](generator.js#L328)

Enable Travis-CI for the repository by creating a new webhook. This task will ask for the Travis-CI username (this should be the same as the GitHub username) and a Travis-CI token which can be found under the Accounts menu on Travis-CI.

**Example**

```sh
# use it standalone if the repository has already been created on GitHub
$ gen gh-repo:enable-travis
# use it when creating the repository on github
$ gen gh-repo:default,enable-travis
```

### [default](generator.js#L402)

Alias for running the [gh-repo](#gh-repo) task with the following command:

**Example**

```sh
$ gen gh-repo
```

Visit Generate's [documentation for tasks](https://github.com/generate/generate/blob/master/docs/tasks.md).

## Next steps

### Running unit tests

It's never too early to begin running unit tests. When you're ready to get started, the following command will ensure the project's dependencies are installed then run all of the unit tests:

```sh
$ npm install && test
```

### Publishing your generator

If you're tests are passing and you're ready to publish your generator to [npm](https://www.npmjs.com), you can do that now with the following command:

**Are you sure you're ready?!**

Let's go!

```sh
$ npm publish
```

## About

### Community

Are you using [Generate](https://github.com/generate/generate) in your project? Have you published a [generator](https://github.com/generate/generate/blob/master/docs/generators.md) and want to share your project with the world?

Here are some suggestions!

* If you get like Generate and want to tweet about it, please feel free to mention `@generatejs` or use the `#generatejs` hashtag
* Show your love by starring [Generate](https://github.com/generate/generate) and `generate-gh-repo`
* Get implementation help on [StackOverflow](http://stackoverflow.com/questions/tagged/generate) (please use the `generatejs` tag in questions)
* **Gitter** Discuss Generate with us on [Gitter](https://gitter.im/generate/generate)
* If you publish an generator, thank you! To make your project as discoverable as possible, please add the keyword `generategenerator` to package.json.

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for avice on opening issues, pull requests, and coding standards.

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

### License

Copyright © 2017, [Brian Woodward](https://github.com/doowb).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.3.0, on January 25, 2017._