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

  t.notOk(p.pluckable('***'), 'returns false if no delimiters found');
  t.notOk(p.pluckable('/***'), 'returns false if only one delimiter found');
  t.notOk(p.pluckable('***/'), 'returns false if only one delimiter found');
  t.ok(p.pluckable('/*** ***/'), 'returns true if both delimiters found');

  t.end();
});

(0, _tape2['default'])('pluck should be a function', function (t) {

  var p = (0, _2['default'])();

  t.equal(typeof p.pluck, 'function');

  t.end();
});

(0, _tape2['default'])('pluck a string from a string', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pluck('***'), 'Throws an error on unpluckable content');
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

  p.pluckFile(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\nhtml { <element class="base"></element> }', 'name { Another Style }\nhtml { <element class="another"></element> }']);
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck all snippets from file with custom delimiters', function (t) {

  t.plan(1);

  var p = (0, _2['default'])({
    opening: '/*\n===',
    closing: '===\n*/'
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\nhtml { <element class="base"></element> }', 'name { Another Style }\nhtml { <element class="another"></element> }']);
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('check snippet for key value pairs', function (t) {

  var p = (0, _2['default'])();

  t.notOk(p.hasKeyValue('KEY VALUE'), 'returns false if no delimiters found');
  t.notOk(p.hasKeyValue('@KEY { VALUE'), 'returns false if partial delimiters found');
  t.ok(p.hasKeyValue('@KEY { VALUE }'), 'returns true if all delimiters found');

  t.end();
});

(0, _tape2['default'])('pair up keys/values from snippet', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pairUp('KEYVALUE'), 'Throws an error when no key/value pair can be found');

  t.end();
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

//# sourceMappingURL=data:application/json;base64,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QztDQUNULENBQUMsQ0FBQzs7QUFJSCx1QkFBSyxrQ0FBa0MsRUFBRSxVQUFBLENBQUMsRUFBSTs7QUFFNUMsTUFBSSxDQUFDLEdBQUcsb0JBQU8sQ0FBQzs7QUFFaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLHFEQUFxRCxDQUFDLENBQUM7O0FBRXRGLEdBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNULENBQUMsQ0FBQzs7QUFHSCx1QkFBSyxtRUFBbUUsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxVQUFBLENBQUMsRUFBSTs7QUFFM0YsTUFBSSxDQUFDLEdBQUcsbUJBQU07QUFDWixVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUEsY0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ2Ysc0JBQVksR0FBRyxlQUFVLEtBQUssUUFBSTtPQUNuQztLQUNGO0dBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQUksSUFBSSxHQUFHO0FBQ1QsT0FBRyxFQUFFLE1BQU07QUFDWCxPQUFHLEVBQUUsTUFBTTtHQUNaLENBQUM7O0FBRUYsR0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDOztBQUVsRSxHQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDVCxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ3RhcGUnO1xuaW1wb3J0IHBsdWNrIGZyb20gJy4uLyc7XG5cblxuXG50ZXN0KCdjaGVjayBmb3IgcGx1Y2thYmxlIGNvbnRlbnQnLCB0ID0+IHtcblxuICAvLyBUT0RPXG4gIC8vIEFkZCBSZWdleCB0byBkZWxpbWl0ZXIgdGVzdGluZyAoJy8qKiovJyB3aWxsIGNhdXNlIHByb2JsZW1zKVxuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcqKionKSwgJ3JldHVybnMgZmFsc2UgaWYgbm8gZGVsaW1pdGVycyBmb3VuZCcpO1xuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcvKioqJyksICdyZXR1cm5zIGZhbHNlIGlmIG9ubHkgb25lIGRlbGltaXRlciBmb3VuZCcpO1xuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcqKiovJyksICdyZXR1cm5zIGZhbHNlIGlmIG9ubHkgb25lIGRlbGltaXRlciBmb3VuZCcpO1xuICB0Lm9rKHAucGx1Y2thYmxlKCcvKioqICoqKi8nKSwgJ3JldHVybnMgdHJ1ZSBpZiBib3RoIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBzaG91bGQgYmUgYSBmdW5jdGlvbicsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LmVxdWFsKHR5cGVvZiBwLnBsdWNrLCAnZnVuY3Rpb24nKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhIHN0cmluZyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuICBcbiAgdC50aHJvd3MocC5wbHVjaygnKioqJyksICdUaHJvd3MgYW4gZXJyb3Igb24gdW5wbHVja2FibGUgY29udGVudCcpO1xuICB0LmVxdWFsKHAucGx1Y2soJy8qKiogQ09OVEVOVCAqKiovJyksICdDT05URU5UJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncmVhZCBhIHN0cmluZyBmcm9tIGEgZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG4gIFxuICBwLnJlYWQoX19kaXJuYW1lICsgJy90ZXN0LXN0cmluZy5jc3MnKVxuICAudGhlbiggc3RyID0+IHQuZXF1YWwoc3RyLCAndGVzdC1zdHJpbmcnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gYSBzdHJpbmcnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKClcbiAgICAsIHN0ciA9ICcvKioqIFNOSVBQRVQgMSAqKiovIC8qKiogU05JUFBFVCAyICoqKi8nXG4gICAgLCBhcnIgPSBwLnBsdWNrQWxsKHN0cik7XG5cbiAgdC5vayhBcnJheS5pc0FycmF5KGFyciksICdwbHVjayBhbGwgaXMgYW4gYXJyYXknKTtcbiAgdC5sb29zZUVxdWFsKGFyciwgWydTTklQUEVUIDEnLCAnU05JUFBFVCAyJ10pO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMSk7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHAucGx1Y2tGaWxlKF9fZGlybmFtZSArICcvdGVzdC1zdHlsZXNoZWV0LmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0pIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUgd2l0aCBjdXN0b20gZGVsaW1pdGVycycsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiBgLypcXG49PT1gLFxuICAgIGNsb3Npbmc6IGA9PT1cXG4qL2BcbiAgfSk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQyLmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0pIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ2NoZWNrIHNuaXBwZXQgZm9yIGtleSB2YWx1ZSBwYWlycycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAuaGFzS2V5VmFsdWUoJ0tFWSBWQUxVRScpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQubm90T2socC5oYXNLZXlWYWx1ZSgnQEtFWSB7IFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIHBhcnRpYWwgZGVsaW1pdGVycyBmb3VuZCcpO1xuICB0Lm9rKHAuaGFzS2V5VmFsdWUoJ0BLRVkgeyBWQUxVRSB9JyksICdyZXR1cm5zIHRydWUgaWYgYWxsIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwYWlyIHVwIGtleXMvdmFsdWVzIGZyb20gc25pcHBldCcsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LnRocm93cyhwLnBhaXJVcCgnS0VZVkFMVUUnKSwgJ1Rocm93cyBhbiBlcnJvciB3aGVuIG5vIGtleS92YWx1ZSBwYWlyIGNhbiBiZSBmb3VuZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG50ZXN0KCdvdXRwdXQud3JhcCgpIHNob3VsZCBmb3JtYXQga2V5L3ZhbHVlIHBhaXJzIGFjY29yZGluZyB0byBvdmVycmlkZScsIHtza2lwOiB0cnVlfSwgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjayh7XG4gICAgb3V0cHV0OiB7XG4gICAgICB3cmFwKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGB7eyR7a2V5fX19IC8ge3ske3ZhbHVlfX19YFxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIFxuICBsZXQgaXRlbSA9IHtcbiAgICBrZXk6ICduYW1lJyxcbiAgICB2YWw6ICduYXRlJ1xuICB9O1xuXG4gIHQuZXF1YWwocC5vdXRwdXQud3JhcChpdGVtLmtleSwgaXRlbS52YWwpLCAne3tuYW1lfX0gLyB7e25hdGV9fScpO1xuXG4gIHQuZW5kKCk7XG59KTtcbiJdfQ==