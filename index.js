'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = function () {
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
  var _ref$keyValueSeparator = _ref.keyValueSeparator;
  var keyValueSeparator = _ref$keyValueSeparator === undefined ? '---' : _ref$keyValueSeparator;

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
    keyValue: new RegExp(esc(valueOpening) + '(.|\n)*' + esc(valueClosing), 'g')
  };

  // write json file
  var writeJSON = function writeJSON(filename, content) {
    return new Promise(function (resolve, reject) {
      _fs2['default'].writeFile(filename, JSON.stringify(content), function (err) {
        if (err) reject(err);
        resolve(content);
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
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluck: function pluck(str, limit) {
      if (!this.pluckable(str)) return new Error('unpluckable input');

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

    read: function read(file) {
      return new Promise(function (resolve, reject) {
        _fs2['default'].readFile(file, 'utf-8', function (err, data) {
          if (err) reject(err);
          resolve(data);
        });
      });
    },

    pluckFile: function pluckFile(file, limit) {
      var _this = this;

      return this.read(file).then(function (fileContents) {
        return _this.pluck(fileContents, limit);
      });
    },

    hasKeyValue: function hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.match(pattern.keyValue);
    },

    pairUpSingle: function pairUpSingle(str) {
      var _this2 = this;

      // if(!this.hasKeyValue(str)) return new Error(`No key/value pairs found - valueOpening = ${valueOpening}, valueClosing = ${valueClosing}`);

      var pair = undefined;

      return str.split(keyValueSeparator).reduce(function (prev, cur) {

        // Skip this item if its blank
        if (!cur || !_this2.hasKeyValue(cur)) return prev;

        pair = cur.trim() // Trim the string
        .slice(0, -1) // Drop the closing delimiter
        .split(valueOpening); // Split into pair

        // trim and add the pair to the reduction object
        prev[pair[0].trim()] = pair[1].trim();
        return prev;
      }, {});
    },

    pairUp: function pairUp(snippets) {
      var _this3 = this;

      return snippets.map(function (snippet) {
        return _this3.pairUpSingle(snippet);
      });
    },

    writeJSON: writeJSON
  };
};

module.exports = exports['default'];
