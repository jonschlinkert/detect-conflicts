'use strict';

/* deps: mocha */
var inquirer = require('inquirer');
var assert = require('assert');
var should = require('should');
var detect = require('./');

describe('file conflict', function () {
  it('should detect when an existing file is `identical`:', function (done) {
    var file = {path: 'fixtures/a.txt', contents: 'aaa'};
    detect(file, function (res) {
      res.should.equal('identical');
      done();
    });
  });

  it('should use the `content` property:', function (done) {
    var file = {path: 'fixtures/a.txt', content: 'aaa'};
    detect(file, function (res) {
      res.should.equal('identical');
      done();
    });
  });

  it('should throw an error when invalid args are passed:', function () {
    (function () {
      detect();
    }).should.throw('file should be an object');

    (function () {
      detect({});
    }).should.throw('file.path should be a string.');

    (function () {
      detect({path: 'foo'});
    }).should.throw('file.contents must be defined to do a comparison.');
  });
});
