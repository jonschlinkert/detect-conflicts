'use strict';

var utils = module.exports;

utils.success = require('success-symbol');
utils.error = require('error-symbol');
utils.red = require('ansi-red');
utils.bold = require('ansi-bold');
utils.gray = require('ansi-gray');
utils.green = require('ansi-green');
utils.yellow = require('ansi-yellow');
utils.warning = require('warning-symbol');
utils.cyan = require('ansi-cyan');
utils.abort = utils.red;
utils.diff = utils.bold;
utils.force = utils.yellow;
utils.write = utils.green;
