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
  var _ref$limit = _ref.limit;
  var

  // limit number of returns
  limit = _ref$limit === undefined ? false : _ref$limit;
  var _ref$output = _ref.output;
  var

  // output
  output = _ref$output === undefined ? {

    // format function for key values
    format: function format(key, value) {
      return '"' + key + '": "' + value + '"';
    },

    // write formatted file to
    write: function write(filename, content) {
      return new Promise(function (resolve, reject) {
        _fs2['default'].writeFile(filename, JSON.stringify(content), function (err) {
          if (err) reject(err);
          resolve(true);
        });
      });
    }
  } : _ref$output;

  // Helpers
  var delimiterStart = function delimiterStart(str) {
    return str.indexOf(opening);
  },
      snippetStart = function snippetStart(str) {
    return str.indexOf(opening) + opening.length;
  },
      snippetEnd = function snippetEnd(str) {
    return str.indexOf(closing);
  },
      delimiterEnd = function delimiterEnd(str) {
    return str.indexOf(closing) + closing.length;
  };

  return {

    pluckable: function pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return delimiterStart(str) !== -1 && snippetEnd(str) !== -1;
    },

    pluckSingle: function pluckSingle(str) {
      if (!this.pluckable(str)) return new Error('unpluckable input');
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluck: function pluck(str) {
      var snippets = [];

      if (limit) {
        var i = limit;
        while (this.pluckable(str) && i--) {
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

    pluckFile: function pluckFile(file) {
      var _this = this;

      return this.read(file).then(function (fileContents) {
        return _this.pluck(fileContents);
      });
    },

    hasKeyValue: function hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.indexOf(valueOpening) !== -1 && str.indexOf(valueClosing) !== -1;
    },

    pairUp: function pairUp(str) {
      if (!this.hasKeyValue(str)) return new Error('No key/value pairs found - \n        valueOpening = ' + valueOpening + ', valueClosing = ' + valueClosing);

      var pair = undefined;

      return str.split(keyValueSeparator).reduce(function (prev, cur) {
        // Trim the string
        pair = cur.trim()
        // Drop the closing delimiter
        .slice(0, -1)
        // Split into pair
        .split(valueOpening);
        // add the trimmed key/value to the reduction object
        prev[pair[0].trim()] = pair[1].trim();
        return prev;
      }, {});
    },

    pairUpAll: function pairUpAll(snippets) {
      var _this2 = this;

      return snippets.map(function (snippet) {
        return _this2.pairUp(snippet);
      });
    },

    write: output.write
  };
};

module.exports = exports['default'];
