'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$delimiters = _ref.delimiters;
  var delimiters = _ref$delimiters === undefined ? {
    opening: '/***',
    closing: '***/',
    key: '@',
    value: '::'
  } : _ref$delimiters;
  var _ref$output = _ref.output;
  var output = _ref$output === undefined ? {
    wrap: function wrap(key, value) {
      return '"' + key + '": "' + value + '"';
    }
  } : _ref$output;

  // Helpers
  var delimiterStart = function delimiterStart(str) {
    return str.indexOf(delimiters.opening);
  },
      snippetStart = function snippetStart(str) {
    return str.indexOf(delimiters.opening) + delimiters.opening.length;
  },
      snippetEnd = function snippetEnd(str) {
    return str.indexOf(delimiters.closing);
  },
      delimiterEnd = function delimiterEnd(str) {
    return str.indexOf(delimiters.closing) + delimiters.closing.length;
  },
      keyDelimiterStart = function keyDelimiterStart(str) {
    return str.indexOf(delimiters.key);
  },
      keyStart = function keyStart(str) {
    return str.indexOf(delimiters.key) + delimiters.key.length;
  },
      valueDelimiterStart = function valueDelimiterStart(str) {
    return str.indexOf(delimiters.value);
  },
      valueStart = function valueStart(str) {
    return str.indexOf(delimiters.value) + delimiters.value.length;
  };

  return {

    pluckable: function pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return delimiterStart(str) !== -1 && snippetEnd(str) !== -1;
    },

    pluck: function pluck(str) {
      if (!this.pluckable(str)) return new Error('unpluckable input');
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluckAll: function pluckAll(str) {
      var snippets = [];
      while (this.pluckable(str)) {
        snippets.push(this.pluck(str));
        str = str.slice(delimiterEnd(str), str.length);
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
        return _this.pluckAll(fileContents);
      });
    },

    hasKeyValue: function hasKeyValue(str) {
      // Returns true if both key and value delimiters are found
      return keyDelimiterStart(str) !== -1 && valueDelimiterStart(str) !== -1;
    },

    jsonify: function jsonify(str) {}

  };
};

module.exports = exports['default'];
