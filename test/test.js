'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

var _2 = _interopRequireDefault(_);

(0, _tape2['default'])('check for pluckable content', function (t) {

  // TODO
  // Add Regex to delimiter testing ('/***/' will cause problems)

  var p = (0, _2['default'])();

  t.equal(p.pluckable('/*** ***/'), true);
  t.equal(p.pluckable('/** **/'), false);

  t.end();
});

(0, _tape2['default'])('pluck should be a function', function (t) {

  var p = (0, _2['default'])();

  t.equal(typeof p.pluck, 'function');

  t.end();
});

(0, _tape2['default'])('pluck a string from a string', function (t) {

  var p = (0, _2['default'])();

  t.equal(p.pluck('/*** CONTENT ***/'), 'CONTENT');

  t.end();
});

(0, _tape2['default'])('read a string from a file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.read(__dirname + '/test-string.css').then(function (str) {
    return t.equal(str, 'test-string');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck a snippet from file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.pluckFile(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.equal(data, '@name: Base Style\n@html: <element class="base"></element>');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck a snippet from file with custom delimiters', function (t) {

  t.plan(1);

  var p = (0, _2['default'])({
    opening: '/*\n===',
    closing: '===\n*/'
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css').then(function (data) {
    return t.equal(data, '@name: Base Style\n@html: <element class="base"></element>');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck all snippets from a string', function (t) {

  var p = (0, _2['default'])(),
      str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/',
      arr = p.pluckAll(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2']);

  t.end();
});

(0, _tape2['default'])('pluck all snippets from file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.pluckFileAll(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.looseEqual(data, ['@name: Base Style\n@html: <element class="base"></element>', '@name: Another Style\n@html: <element class="another"></element>']);
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('output.wrap() should format key/value pairs according to override', { skip: true }, function (t) {

  var p = (0, _2['default'])({
    output: {
      wrap: function wrap(key, value) {
        return '{{' + key + '}} / {{' + value + '}}';
      }
    }
  });

  var item = {
    key: 'name',
    val: 'nate'
  };

  t.equal(p.output.wrap(item.key, item.val), '{{name}} / {{nate}}');

  t.end();
});

//# sourceMappingURL=data:application/json;base64,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TUFBTTtHQUNaLENBQUM7O0FBRUYsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUVsRSxHQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDVCxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ3RhcGUnO1xuaW1wb3J0IHBsdWNrIGZyb20gJy4uLyc7XG5cblxuXG50ZXN0KCdjaGVjayBmb3IgcGx1Y2thYmxlIGNvbnRlbnQnLCB0ID0+IHtcblxuICAvLyBUT0RPXG4gIC8vIEFkZCBSZWdleCB0byBkZWxpbWl0ZXIgdGVzdGluZyAoJy8qKiovJyB3aWxsIGNhdXNlIHByb2JsZW1zKVxuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LmVxdWFsKHAucGx1Y2thYmxlKCcvKioqICoqKi8nKSwgdHJ1ZSk7XG4gIHQuZXF1YWwocC5wbHVja2FibGUoJy8qKiAqKi8nKSwgZmFsc2UpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwodHlwZW9mIHAucGx1Y2ssICdmdW5jdGlvbicpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGEgc3RyaW5nIGZyb20gYSBzdHJpbmcnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG4gIFxuICB0LmVxdWFsKHAucGx1Y2soJy8qKiogQ09OVEVOVCAqKiovJyksICdDT05URU5UJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncmVhZCBhIHN0cmluZyBmcm9tIGEgZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG4gIFxuICBwLnJlYWQoX19kaXJuYW1lICsgJy90ZXN0LXN0cmluZy5jc3MnKVxuICAudGhlbiggc3RyID0+IHQuZXF1YWwoc3RyLCAndGVzdC1zdHJpbmcnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzbmlwcGV0IGZyb20gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5lcXVhbChkYXRhLGBAbmFtZTogQmFzZSBTdHlsZVxcbkBodG1sOiA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+YCkgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzbmlwcGV0IGZyb20gZmlsZSB3aXRoIGN1c3RvbSBkZWxpbWl0ZXJzJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG9wZW5pbmc6IGAvKlxcbj09PWAsXG4gICAgY2xvc2luZzogYD09PVxcbiovYFxuICB9KTtcblxuICBwLnBsdWNrRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldDIuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5lcXVhbChkYXRhLCBgQG5hbWU6IEJhc2UgU3R5bGVcXG5AaHRtbDogPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PmApIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG4gICAgLCBzdHIgPSAnLyoqKiBTTklQUEVUIDEgKioqLyAvKioqIFNOSVBQRVQgMiAqKiovJ1xuICAgICwgYXJyID0gcC5wbHVja0FsbChzdHIpO1xuXG4gIHQub2soQXJyYXkuaXNBcnJheShhcnIpLCAncGx1Y2sgYWxsIGlzIGFuIGFycmF5Jyk7XG4gIHQubG9vc2VFcXVhbChhcnIsIFsnU05JUFBFVCAxJywgJ1NOSVBQRVQgMiddKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhbGwgc25pcHBldHMgZnJvbSBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICBwLnBsdWNrRmlsZUFsbChfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldC5jc3MnKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BAbmFtZTogQmFzZSBTdHlsZVxcbkBodG1sOiA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+YCwgYEBuYW1lOiBBbm90aGVyIFN0eWxlXFxuQGh0bWw6IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD5gXSkgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgnb3V0cHV0LndyYXAoKSBzaG91bGQgZm9ybWF0IGtleS92YWx1ZSBwYWlycyBhY2NvcmRpbmcgdG8gb3ZlcnJpZGUnLCB7c2tpcDogdHJ1ZX0sIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG91dHB1dDoge1xuICAgICAgd3JhcChrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBge3ske2tleX19fSAvIHt7JHt2YWx1ZX19fWBcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBcbiAgbGV0IGl0ZW0gPSB7XG4gICAga2V5OiAnbmFtZScsXG4gICAgdmFsOiAnbmF0ZSdcbiAgfTtcblxuICB0LmVxdWFsKHAub3V0cHV0LndyYXAoaXRlbS5rZXksIGl0ZW0udmFsKSwgJ3t7bmFtZX19IC8ge3tuYXRlfX0nKTtcblxuICB0LmVuZCgpO1xufSk7XG4iXX0=