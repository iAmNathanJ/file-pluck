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
    return t.looseEqual(data, ['@name: Base Style\n@html: <element class="base"></element>', '@name: Another Style\n@html: <element class="another"></element>']);
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck all snippets from file with custom delimiters', function (t) {

  t.plan(1);

  var p = (0, _2['default'])({
    delimiters: {
      opening: '/*\n===',
      closing: '===\n*/'
    }
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css').then(function (data) {
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

//# sourceMappingURL=data:application/json;base64,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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVWLE1BQUksQ0FBQyxHQUFHLG1CQUFNO0FBQ1osY0FBVSxFQUFFO0FBQ1YsYUFBTyxXQUFXO0FBQ2xCLGFBQU8sV0FBVztLQUNuQjtHQUNGLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQyxDQUMvQyxJQUFJLENBQUUsVUFBQSxJQUFJO1dBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsa0lBQWtJLENBQUM7R0FBQSxDQUFFLFNBQ2pLLENBQUUsVUFBQSxHQUFHO1dBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7R0FBQSxDQUFFLENBQUE7Q0FFN0IsQ0FBQyxDQUFDOztBQUlILHVCQUFLLG1FQUFtRSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxFQUFFLFVBQUEsQ0FBQyxFQUFJOztBQUUzRixNQUFJLENBQUMsR0FBRyxtQkFBTTtBQUNaLFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBQSxjQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDZixzQkFBWSxHQUFHLGVBQVUsS0FBSyxRQUFJO09BQ25DO0tBQ0Y7R0FDRixDQUFDLENBQUM7O0FBRUgsTUFBSSxJQUFJLEdBQUc7QUFDVCxPQUFHLEVBQUUsTUFBTTtBQUNYLE9BQUcsRUFBRSxNQUFNO0dBQ1osQ0FBQzs7QUFFRixHQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7O0FBRWxFLEdBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNULENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAndGFwZSc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi4vJztcblxuXG5cbnRlc3QoJ2NoZWNrIGZvciBwbHVja2FibGUgY29udGVudCcsIHQgPT4ge1xuXG4gIC8vIFRPRE9cbiAgLy8gQWRkIFJlZ2V4IHRvIGRlbGltaXRlciB0ZXN0aW5nICgnLyoqKi8nIHdpbGwgY2F1c2UgcHJvYmxlbXMpXG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwocC5wbHVja2FibGUoJy8qKiogKioqLycpLCB0cnVlKTtcbiAgdC5lcXVhbChwLnBsdWNrYWJsZSgnLyoqICoqLycpLCBmYWxzZSk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5lcXVhbCh0eXBlb2YgcC5wbHVjaywgJ2Z1bmN0aW9uJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzdHJpbmcgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHQuZXF1YWwocC5wbHVjaygnLyoqKiBDT05URU5UICoqKi8nKSwgJ0NPTlRFTlQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdyZWFkIGEgc3RyaW5nIGZyb20gYSBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHAucmVhZChfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3RyaW5nLmNzcycpXG4gIC50aGVuKCBzdHIgPT4gdC5lcXVhbChzdHIsICd0ZXN0LXN0cmluZycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhbGwgc25pcHBldHMgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuICAgICwgc3RyID0gJy8qKiogU05JUFBFVCAxICoqKi8gLyoqKiBTTklQUEVUIDIgKioqLydcbiAgICAsIGFyciA9IHAucGx1Y2tBbGwoc3RyKTtcblxuICB0Lm9rKEFycmF5LmlzQXJyYXkoYXJyKSwgJ3BsdWNrIGFsbCBpcyBhbiBhcnJheScpO1xuICB0Lmxvb3NlRXF1YWwoYXJyLCBbJ1NOSVBQRVQgMScsICdTTklQUEVUIDInXSk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgQG5hbWU6IEJhc2UgU3R5bGVcXG5AaHRtbDogPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PmAsIGBAbmFtZTogQW5vdGhlciBTdHlsZVxcbkBodG1sOiA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+YF0pIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUgd2l0aCBjdXN0b20gZGVsaW1pdGVycycsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKHtcbiAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICBvcGVuaW5nOiBgLypcXG49PT1gLFxuICAgICAgY2xvc2luZzogYD09PVxcbiovYFxuICAgIH1cbiAgfSk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQyLmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYEBuYW1lOiBCYXNlIFN0eWxlXFxuQGh0bWw6IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD5gLCBgQG5hbWU6IEFub3RoZXIgU3R5bGVcXG5AaHRtbDogPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PmBdKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpIClcblxufSk7XG5cblxuXG50ZXN0KCdvdXRwdXQud3JhcCgpIHNob3VsZCBmb3JtYXQga2V5L3ZhbHVlIHBhaXJzIGFjY29yZGluZyB0byBvdmVycmlkZScsIHtza2lwOiB0cnVlfSwgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjayh7XG4gICAgb3V0cHV0OiB7XG4gICAgICB3cmFwKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGB7eyR7a2V5fX19IC8ge3ske3ZhbHVlfX19YFxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIFxuICBsZXQgaXRlbSA9IHtcbiAgICBrZXk6ICduYW1lJyxcbiAgICB2YWw6ICduYXRlJ1xuICB9O1xuXG4gIHQuZXF1YWwocC5vdXRwdXQud3JhcChpdGVtLmtleSwgaXRlbS52YWwpLCAne3tuYW1lfX0gLyB7e25hdGV9fScpO1xuXG4gIHQuZW5kKCk7XG59KTtcbiJdfQ==