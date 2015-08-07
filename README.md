# detect-conflicts [![NPM version](https://badge.fury.io/js/detect-conflicts.svg)](http://badge.fury.io/js/detect-conflicts)

> Check for conflicts before writing a file to disk.

Some of this code is based on the [conflicter in yeoman-generator](https://github.com/yeoman/generator) and the [visual diff method in verb](https://github.com/verbose/verb).

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i detect-conflicts --save
```

## Usage

```js
var detectConflicts = require('detect-conflicts');

var file = {path: 'fixtures/a.txt', contents: 'aaa'};
detectConflicts(file, function (res) {
  //=> 
});
```

## Related projects

* [assemble](http://assemble.io): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt,… [more](http://assemble.io)
* [snippet](https://github.com/jonschlinkert/snippet): CLI and API for easily creating, reusing, sharing and generating snippets of code from the… [more](https://github.com/jonschlinkert/snippet)
* [template](https://github.com/jonschlinkert/template): Render templates using any engine. Supports, layouts, pages, partials and custom template types. Use template… [more](https://github.com/jonschlinkert/template)
* [yeoman](http://yeoman.io): The Yeoman CLI is deprecated. See http://yeoman.io/migrate.html for more info.

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/detect-conflicts/issues/new)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
[BSD license](http://opensource.org/licenses/bsd-license.php)
Copyright (c) Google
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 07, 2015._