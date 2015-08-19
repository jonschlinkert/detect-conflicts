'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils');

var lazy = require('lazy-cache')(require);
lazy('diff');
lazy('inquirer');
lazy('is-binary');

/**
 * Detects potential conflict between an existing file and content about to be
 * written to disk:
 *
 * If a file already exists, we:
 *
 *   1. Try to read its contents from the file system
 *   2. Compare it with the provided content
 *   3. If identical, mark it as is and skip the check
 *   4. If diverged, prepare and show up the file detect menu
 *
 * @param  {Object} `file` File object with `path` and `contents` properties.
 * @param  {Function} `cb` The callback returns one of the following status strings: 'identical', 'create', 'skip', 'force'
 * @return {undefined}
 * @api public
 */

function detect(file, opts, cb) {
  if (typeof file !== 'object') {
    throw new TypeError('file should be an object');
  }
  if (typeof file.path !== 'string') {
    throw new TypeError('file.path should be a string.');
  }

  if (!file.contents && file.content) {
    file.contents = file.content;
  }

  if (!file.contents) {
    throw new TypeError('file.contents must be defined to do a comparison.');
  }

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  var silent = opts.silent;
  var fp = path.relative(process.cwd(), file.path);
  if (!fs.existsSync(fp)) {
    return cb('create');
  }

  if (opts.force) {
    if (!silent) {
      msg = utils.green(utils.success) + ' file written to';
      console.log(msg, utils.green(fp));
    }
    return cb('force');
  }

  opts.existing = opts.existing || fs.readFileSync(fp, 'utf8');
  if (opts.existing !== file.contents) {
    if (!silent) {
      var msg = utils.yellow(utils.warning) + '  conflict detected:';
      console.log(msg, utils.yellow(fp));
    }
    if (opts.ask === false) {
      return cb('conflict');
    }
    return ask(file, opts, cb);
  }

  if (!silent) {
    var msg = 'File not written, identical contents to:';
    console.log(msg, utils.cyan(fp));
  }
  return cb('identical');
}

/**
 * Show a diff comparison of the existing content versus the content
 * about to be written.
 *
 * @param  {String} `existing`
 * @param  {String} `proposed`
 * @param  {String} method Optionally pass a specific method name from the [diff] library to use for the diff.
 * @return {String} Visual diff comparison.
 */

function stringDiff(existing, proposed, method) {
  method = method || 'diffJson';
  lazy.diff[method](existing, proposed).forEach(function (res) {
    var color = utils.gray;
    if (res.added) color = utils.green;
    if (res.removed) color = utils.red;
    process.stdout.write(color(res.value));
  });
  console.log('\n');
}

/**
 * Prompt the user for feedback.
 *
 * @param {Object} `file`
 * @param {Function} `cb`
 */

function ask(file, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  var prompt = lazy.inquirer.createPromptModule();
  var fp = path.relative(process.cwd(), file.path);

  var questions = {
    name: 'action',
    type: 'expand',
    message: 'Overwrite `' + fp + '`?',
    value: 'nothing',
    choices: [{
      key: 'n',
      name: 'do not overwrite',
      value: 'skip'
    }, {
      key: 'y',
      name: 'overwrite',
      value: 'write'
    }, {
      key: 'a',
      name: 'overwrite this and all others',
      value: 'force'
    }, {
      key: 'x',
      name: 'abort',
      value: 'abort'
    }, {
      key: 'd',
      name: 'diff comparison between the current and new:',
      value: 'diff'
    }]
  };

  prompt([questions], function (answers) {
    var msg = answers.action;

    switch(answers.action) {
      case 'skip':
        cb(answers.action);
        process.exit(0);

      case 'abort':
        msg = utils.red(utils.error) + ' Aborted. No action was taken.';
        if (!opts.silent) console.log(msg);
        cb(answers.action);
        process.exit(0);

      case 'diff':
        var existing = opts.existing || fs.readFileSync(fp, 'utf8');
        if (lazy.isBinary(existing) && typeof opts.binaryDiff === 'function') {
          opts.binaryDiff(existing, file.contents);
        } else {
          stringDiff(existing, file.contents.toString());
        }
        return ask(file, opts, cb);

      case 'force':
        opts.force = true;
        break;

      case 'write':
        msg = utils.green(utils.success) + ' file written to';
        opts.force = true;
        break;

      default: {
        msg = utils.red(utils.error) + utils.red(' Aborted.') + ' No action was taken.';
        if (!opts.silent) console.log(msg);
        cb(answers.action);
        process.exit(0);
      }
    }

    var rel = path.relative(process.cwd(), fp);
    var filepath = utils[answers.action](rel);
    if (!opts.silent) {
      console.log(msg, filepath);
    }
    return cb(answers.action);
  });
}

/**
 * Expose `Conflicts`
 */

module.exports = detect;
