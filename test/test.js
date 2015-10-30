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

(0, _tape2['default'])('produce object from key/values in snippet', function (t) {

  var p = (0, _2['default'])();

  t.looseEquals(p.pairUp('key1 { VALUE1 } --- key2 { VALUE2 }'), { key1: 'VALUE1', key2: 'VALUE2' });

  t.end();
});

(0, _tape2['default'])('output should format key/value pairs according to override', { skip: true }, function (t) {

  var p = (0, _2['default'])({
    output: {
      format: function format(key, value) {
        return '{{' + key + '}} / {{' + value + '}}';
      }
    }
  });

  t.equal(p.output.format('name', 'nate'), '{{name}} / {{nate}}');

  t.end();
});

//# sourceMappingURL=data:application/json;base64,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QztDQUNULENBQUMsQ0FBQzs7QUFJSCx1QkFBSyxrQ0FBa0MsRUFBRSxVQUFBLENBQUMsRUFBSTs7QUFFNUMsTUFBSSxDQUFDLEdBQUcsb0JBQU8sQ0FBQzs7QUFFaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLHFEQUFxRCxDQUFDLENBQUM7O0FBRXRGLEdBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNULENBQUMsQ0FBQzs7QUFJSCx1QkFBSywyQ0FBMkMsRUFBRSxVQUFBLENBQUMsRUFBSTs7QUFFckQsTUFBSSxDQUFDLEdBQUcsb0JBQU8sQ0FBQzs7QUFFaEIsR0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHFDQUFxQyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDOztBQUVqRyxHQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDVCxDQUFDLENBQUM7O0FBSUgsdUJBQUssNERBQTRELEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQSxDQUFDLEVBQUk7O0FBRXBGLE1BQUksQ0FBQyxHQUFHLG1CQUFNO0FBQ1osVUFBTSxFQUFFO0FBQ04sWUFBTSxFQUFBLGdCQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDakIsc0JBQVksR0FBRyxlQUFVLEtBQUssUUFBSztPQUNwQztLQUNGO0dBQ0YsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7O0FBRWhFLEdBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNULENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAndGFwZSc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi4vJztcblxuXG5cbnRlc3QoJ2NoZWNrIGZvciBwbHVja2FibGUgY29udGVudCcsIHQgPT4ge1xuXG4gIC8vIFRPRE9cbiAgLy8gQWRkIFJlZ2V4IHRvIGRlbGltaXRlciB0ZXN0aW5nICgnLyoqKi8nIHdpbGwgY2F1c2UgcHJvYmxlbXMpXG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQubm90T2socC5wbHVja2FibGUoJyoqKicpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQubm90T2socC5wbHVja2FibGUoJy8qKionKSwgJ3JldHVybnMgZmFsc2UgaWYgb25seSBvbmUgZGVsaW1pdGVyIGZvdW5kJyk7XG4gIHQubm90T2socC5wbHVja2FibGUoJyoqKi8nKSwgJ3JldHVybnMgZmFsc2UgaWYgb25seSBvbmUgZGVsaW1pdGVyIGZvdW5kJyk7XG4gIHQub2socC5wbHVja2FibGUoJy8qKiogKioqLycpLCAncmV0dXJucyB0cnVlIGlmIGJvdGggZGVsaW1pdGVycyBmb3VuZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIHNob3VsZCBiZSBhIGZ1bmN0aW9uJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwodHlwZW9mIHAucGx1Y2ssICdmdW5jdGlvbicpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGEgc3RyaW5nIGZyb20gYSBzdHJpbmcnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG4gIFxuICB0LnRocm93cyhwLnBsdWNrKCcqKionKSwgJ1Rocm93cyBhbiBlcnJvciBvbiB1bnBsdWNrYWJsZSBjb250ZW50Jyk7XG4gIHQuZXF1YWwocC5wbHVjaygnLyoqKiBDT05URU5UICoqKi8nKSwgJ0NPTlRFTlQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdyZWFkIGEgc3RyaW5nIGZyb20gYSBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHAucmVhZChfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3RyaW5nLmNzcycpXG4gIC50aGVuKCBzdHIgPT4gdC5lcXVhbChzdHIsICd0ZXN0LXN0cmluZycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhbGwgc25pcHBldHMgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuICAgICwgc3RyID0gJy8qKiogU05JUFBFVCAxICoqKi8gLyoqKiBTTklQUEVUIDIgKioqLydcbiAgICAsIGFyciA9IHAucGx1Y2tBbGwoc3RyKTtcblxuICB0Lm9rKEFycmF5LmlzQXJyYXkoYXJyKSwgJ3BsdWNrIGFsbCBpcyBhbiBhcnJheScpO1xuICB0Lmxvb3NlRXF1YWwoYXJyLCBbJ1NOSVBQRVQgMScsICdTTklQUEVUIDInXSk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSkgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZSB3aXRoIGN1c3RvbSBkZWxpbWl0ZXJzJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG9wZW5pbmc6IGAvKlxcbj09PWAsXG4gICAgY2xvc2luZzogYD09PVxcbiovYFxuICB9KTtcblxuICBwLnBsdWNrRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldDIuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSkgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgnY2hlY2sgc25pcHBldCBmb3Iga2V5IHZhbHVlIHBhaXJzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQubm90T2socC5oYXNLZXlWYWx1ZSgnS0VZIFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIG5vIGRlbGltaXRlcnMgZm91bmQnKTtcbiAgdC5ub3RPayhwLmhhc0tleVZhbHVlKCdAS0VZIHsgVkFMVUUnKSwgJ3JldHVybnMgZmFsc2UgaWYgcGFydGlhbCBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQub2socC5oYXNLZXlWYWx1ZSgnQEtFWSB7IFZBTFVFIH0nKSwgJ3JldHVybnMgdHJ1ZSBpZiBhbGwgZGVsaW1pdGVycyBmb3VuZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BhaXIgdXAga2V5cy92YWx1ZXMgZnJvbSBzbmlwcGV0JywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQudGhyb3dzKHAucGFpclVwKCdLRVlWQUxVRScpLCAnVGhyb3dzIGFuIGVycm9yIHdoZW4gbm8ga2V5L3ZhbHVlIHBhaXIgY2FuIGJlIGZvdW5kJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncHJvZHVjZSBvYmplY3QgZnJvbSBrZXkvdmFsdWVzIGluIHNuaXBwZXQnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5sb29zZUVxdWFscyhwLnBhaXJVcCgna2V5MSB7IFZBTFVFMSB9IC0tLSBrZXkyIHsgVkFMVUUyIH0nKSwge2tleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJ30pO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ291dHB1dCBzaG91bGQgZm9ybWF0IGtleS92YWx1ZSBwYWlycyBhY2NvcmRpbmcgdG8gb3ZlcnJpZGUnLCB7c2tpcDogdHJ1ZX0sIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG91dHB1dDoge1xuICAgICAgZm9ybWF0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGB7eyR7a2V5fX19IC8ge3ske3ZhbHVlfX19YDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHQuZXF1YWwocC5vdXRwdXQuZm9ybWF0KCduYW1lJywgJ25hdGUnKSwgJ3t7bmFtZX19IC8ge3tuYXRlfX0nKTtcblxuICB0LmVuZCgpO1xufSk7XG4iXX0=