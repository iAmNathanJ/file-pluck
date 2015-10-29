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

  // input = {
  //   opening: '/***',
  //   closing: '***/',
  //   key: '@',
  //   value: ':'
  // },

  // output = {
  //   opening: '{',
  //   closing: '}',
  //   separator: ',',

  //   // function to format each key/value pair
  //   wrap(key, value) {
  //     return `"${key}": "${value}"`;
  //   }
  // }

  opening = _ref$opening === undefined ? '/***' : _ref$opening;
  var _ref$closing = _ref.closing;
  var closing = _ref$closing === undefined ? '***/' : _ref$closing;
  var _ref$key = _ref.key;
  var key = _ref$key === undefined ? '@' : _ref$key;
  var _ref$value = _ref.value;
  var value = _ref$value === undefined ? ':' : _ref$value;

  return {

    pluck: function pluck(str) {

      var start = str.indexOf(opening) + opening.length,
          end = str.indexOf(closing) - closing.length;

      return str.substr(start, end).trim();
    },

    read: function read(file) {

      return new Promise(function (resolve, reject) {

        _fs2['default'].readFile(file, 'utf-8', function (err, data) {
          if (err) reject(err);
          resolve(data);
        });
      });
    },

    compile: function compile(file) {
      var _this = this;

      return this.read(file).then(function (fileContents) {
        return _this.pluck(fileContents);
      });
    }

    // input: input,
    // output: output,

    // build(itemsArray) {
    //   return itemsArray.map((item, i, arr) => {

    //     let separator = output.separator;

    //     return Object.keys(item).map(key => {

    //       return output.wrap(key, item[key]) + separator;

    //     });
    //   });
    // }
  };
};

module.exports = exports['default'];
