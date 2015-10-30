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
  var opening = _ref$opening === undefined ? '/***' : _ref$opening;
  var _ref$closing = _ref.closing;
  var closing = _ref$closing === undefined ? '***/' : _ref$closing;
  var _ref$key = _ref.key;
  var key = _ref$key === undefined ? '@' : _ref$key;
  var _ref$value = _ref.value;
  var value = _ref$value === undefined ? ':' : _ref$value;
  var _ref$output = _ref.output;
  var output = _ref$output === undefined ? {
    opening: '{',
    closing: '}',
    separator: ',',
    wrap: function wrap(key, value) {
      return '"' + key + '": "' + value + '"';
    }
  } : _ref$output;

  var snippets = [],
      delimiterStart = function delimiterStart(str) {
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
      return snippetStart(str) !== -1 && snippetEnd(str) !== -1;
    },

    pluck: function pluck(str) {
      if (!this.pluckable(str)) return new Error('unpluckable input');
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluckAll: function pluckAll(str) {
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
        return _this.pluck(fileContents);
      });
    },

    pluckFileAll: function pluckFileAll(file) {
      var _this2 = this;

      return this.read(file).then(function (fileContents) {
        return _this2.pluckAll(fileContents);
      });
    }

  };
};

module.exports = exports['default'];
