'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = FilePluck;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function FilePluck() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$opening = _ref.opening;
  var

  // delimiters
  opening = _ref$opening === undefined ? '/***' : _ref$opening;
  var _ref$closing = _ref.closing;
  var closing = _ref$closing === undefined ? '***/' : _ref$closing;
  var _ref$valueOpening = _ref.valueOpening;
  var valueOpening = _ref$valueOpening === undefined ? '{' : _ref$valueOpening;
  var _ref$valueClosing = _ref.valueClosing;
  var valueClosing = _ref$valueClosing === undefined ? '}' : _ref$valueClosing;

  // Helpers
  var snippetStart = function snippetStart(str) {
    return str.indexOf(opening) + opening.length;
  },
      snippetEnd = function snippetEnd(str) {
    return str.indexOf(closing);
  },
      delimiterEnd = function delimiterEnd(str) {
    return str.indexOf(closing) + closing.length;
  };

  // Regex escape function - allows variables with special characters in expression
  var esc = function esc(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  // Patterns
  var pattern = {
    snippet: new RegExp(esc(opening) + '(.|\n)*' + esc(closing), 'g'),
    keyValue: new RegExp('(.|\n)*' + esc(valueOpening) + '(.|\n)*', 'g')
  };

  // Utility Functions (read/write)
  var read = function read(file) {

    return new Promise(function (resolve, reject) {

      _fs2['default'].readFile(file, 'utf-8', function (err, fileContent) {
        if (err) reject(err);
        resolve(fileContent);
      });
    });
  };

  // write json file, return promise
  var writeJSON = function writeJSON(filename, obj) {

    return new Promise(function (resolve, reject) {

      if (!Object.is(obj)) resolve(new Error('writeJSON requires the second argument to be an object'));

      _fs2['default'].writeFile(filename, JSON.stringify(obj, null, 2) + '\n', function (err) {
        if (err) reject(err);
        resolve(obj);
      });
    });
  };

  // Module
  return {

    pluckable: function pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return str.match(pattern.snippet);
    },

    pluckSingle: function pluckSingle(str) {
      if (!this.pluckable(str)) return new Error('Unpluckable input: ' + str);

      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluck: function pluck(str, limit) {
      var snippets = [];

      if (limit) {
        while (this.pluckable(str) && limit--) {
          snippets.push(this.pluckSingle(str));
          str = str.slice(delimiterEnd(str), str.length);
        }
      } else {
        while (this.pluckable(str)) {
          snippets.push(this.pluckSingle(str));
          str = str.slice(delimiterEnd(str), str.length);
        }
      }
      return snippets;
    },

    pluckSingleFile: function pluckSingleFile(file, limit) {
      var _this = this;

      return read(file).then(function (fileContent) {
        return _this.pluck(fileContent, limit);
      });
    },

    pluckFile: function pluckFile(files) {
      var _this2 = this;

      // Make sure files exist
      if (!files) return new Error('pluckFile - first argument should be a file or an array of files');

      var allFiles = undefined;

      // Check if files is array. If not, force it.
      if (!Array.isArray(files)) files = [files];

      // Reduce files to flat array
      // This will handle globs and allow mapping
      // Otherwise, with globs, we would have 2D array
      allFiles = files.reduce(function (prev, cur) {
        return prev.concat(_glob2['default'].sync(cur, {}));
      }, [])

      // Map files to an array of promises
      .map(function (file) {
        return _this2.pluckSingleFile(file);
      });

      // return promise
      return Promise.all(allFiles).then(function (allFileContents) {

        // reduce all files to flat array of plucked content
        return allFileContents.reduce(function (prev, cur) {
          return prev.concat(cur);
        }, []);
      });
    },

    hasKeyValue: function hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.match(pattern.keyValue);
    },

    pairUp: function pairUp(str) {
      var _this3 = this;

      var pair = undefined;

      return str.split(valueClosing).reduce(function (prev, cur) {

        // Skip this item if its blank or if it doesn't have qualifying delimiters
        if (!cur || !_this3.hasKeyValue(cur)) return prev;

        pair = cur.trim() // Trim the string
        .split(valueOpening); // Split into pair

        // trim and add the pair to the reduction object
        prev[pair[0].trim()] = pair[1].trim();
        return prev;
      }, {});
    },

    objectify: function objectify(snippets) {
      var _this4 = this;

      return snippets.map(function (snippet) {
        return _this4.pairUp(snippet);
      });
    },

    writeJSON: writeJSON
  };
}

module.exports = exports['default'];
