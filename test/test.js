'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

var _2 = _interopRequireDefault(_);

(0, _tape2['default'])('check for pluckable content', function (t) {

  // TODO
  // Add Regex to delimiter testing
  // File contents of '/***/' will cause problems
  // Also, if opening and closing delimiters are the same value, that should also cause a problem

  var p = (0, _2['default'])();

  t.ok(p.pluckable('blah /*** blah ***/ blah'), 'pluckable');

  var p2 = (0, _2['default'])({
    opening: '^^^',
    closing: '###'
  });

  t.ok(p2.pluckable('blah ^^^ blah ### blah'), 'pluckable');

  t.end();

  // t.notOk(p.pluckable('***'), 'returns false if no delimiters found');
  // t.notOk(p.pluckable('/***'), 'returns false if only one delimiter found');
  // t.notOk(p.pluckable('***/'), 'returns false if only one delimiter found');
  // t.ok(p.pluckable('/*** ***/'), 'returns true if both delimiters found');
});

(0, _tape2['default'])('pluckSingle should be a function', function (t) {

  var p = (0, _2['default'])();

  t.equal(typeof p.pluckSingle, 'function');

  t.end();
});

(0, _tape2['default'])('pluck a string from a string', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pluckSingle('***'), 'throws an error on unpluckable content');
  t.equal(p.pluckSingle('/*** CONTENT ***/'), 'CONTENT', 'successfully plucks from string');

  t.end();
});

(0, _tape2['default'])('set a limit on plucks', function (t) {

  var p = (0, _2['default'])();

  t.equal(p.pluck('/*** ITEM1 ***/ /*** ITEM2 ***/ /*** ITEM3 ***/', 2).length, 2, 'limit works');

  t.end();
});

(0, _tape2['default'])('read a string from a file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.read(__dirname + '/test-string.css').then(function (str) {
    return t.equal(str, 'test-string', 'successfully reads file');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('pluck all snippets from a string', function (t) {

  var p = (0, _2['default'])(),
      str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/',
      arr = p.pluck(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2'], 'contains the values expected');

  t.end();
});

(0, _tape2['default'])('pluck all snippets from file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.pluckFile(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n---\nhtml { <element class="base"></element> }', 'name { Another Style }\n---\nhtml { <element class="another"></element> }'], 'successfully returns an array of snippets');
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
    return t.looseEqual(data, ['name { Base Style }\nhtml { <element class="base"></element> }', 'name { Another Style }\nhtml { <element class="another"></element> }'], 'custom delimiters ok');
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

(0, _tape2['default'])('pair up single key/value from snippet', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pairUpSingle('KEYVALUE'), 'Throws an error when no key/value pair can be found');
  t.looseEqual(p.pairUpSingle('KEY { VALUE }'), { KEY: 'VALUE' }, 'successfully splits snippet into keys/values');

  t.end();
});

(0, _tape2['default'])('return array of objects from all snippets', function (t) {

  var p = (0, _2['default'])(),
      testArr = ['key1 { VALUE1 } --- key2 { VALUE2 }', 'key1 { VALUE1 } --- key2 { VALUE2 }'],
      shouldBeEqual = [{ key1: 'VALUE1', key2: 'VALUE2' }, { key1: 'VALUE1', key2: 'VALUE2' }];

  t.looseEqual(p.pairUp(testArr), shouldBeEqual, 'returns an array of all snippets as key/val objects');

  t.end();
});

(0, _tape2['default'])('write JSON file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])(),
      testArr = ['key1 { VALUE1 } --- key2 { VALUE2 }', 'key1 { VALUE1 } --- key2 { VALUE2 }'],
      shouldBeEqual = [{ key1: 'VALUE1', key2: 'VALUE2' }, { key1: 'VALUE1', key2: 'VALUE2' }];

  var compiled = p.pairUp(testArr);

  p.writeJSON('test/output.json', compiled).then(function (success) {
    return t.pass('Successfully writes json file');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

//# sourceMappingURL=data:application/json;base64,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LENBQUM7Q0FDVCxDQUFDLENBQUM7O0FBSUgsdUJBQUssaUJBQWlCLEVBQUUsVUFBQSxDQUFDLEVBQUk7O0FBRTNCLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRVYsTUFBSSxDQUFDLEdBQUcsb0JBQU87TUFFWCxPQUFPLEdBQUcsQ0FDVixxQ0FBcUMsRUFDckMscUNBQXFDLENBQUM7TUFFdEMsYUFBYSxHQUFHLENBQ2hCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQ2xDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFeEMsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFakMsR0FBQyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FDeEMsSUFBSSxDQUFFLFVBQUEsT0FBTztXQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUM7R0FBQSxDQUFFLFNBQ3JELENBQUUsVUFBQSxHQUFHO1dBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7R0FBQSxDQUFFLENBQUE7Q0FFN0IsQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGVzdCBmcm9tICd0YXBlJztcbmltcG9ydCBwbHVjayBmcm9tICcuLi8nO1xuXG5cblxudGVzdCgnY2hlY2sgZm9yIHBsdWNrYWJsZSBjb250ZW50JywgdCA9PiB7XG5cbiAgLy8gVE9ET1xuICAvLyBBZGQgUmVnZXggdG8gZGVsaW1pdGVyIHRlc3RpbmdcbiAgLy8gRmlsZSBjb250ZW50cyBvZiAnLyoqKi8nIHdpbGwgY2F1c2UgcHJvYmxlbXNcbiAgLy8gQWxzbywgaWYgb3BlbmluZyBhbmQgY2xvc2luZyBkZWxpbWl0ZXJzIGFyZSB0aGUgc2FtZSB2YWx1ZSwgdGhhdCBzaG91bGQgYWxzbyBjYXVzZSBhIHByb2JsZW1cblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5vayhwLnBsdWNrYWJsZSgnYmxhaCAvKioqIGJsYWggKioqLyBibGFoJyksICdwbHVja2FibGUnKTtcblxuICBsZXQgcDIgPSBwbHVjayh7XG4gICAgb3BlbmluZzogJ15eXicsXG4gICAgY2xvc2luZzogJyMjIydcbiAgfSk7XG5cbiAgdC5vayhwMi5wbHVja2FibGUoJ2JsYWggXl5eIGJsYWggIyMjIGJsYWgnKSwgJ3BsdWNrYWJsZScpO1xuXG4gIHQuZW5kKCk7XG5cbiAgLy8gdC5ub3RPayhwLnBsdWNrYWJsZSgnKioqJyksICdyZXR1cm5zIGZhbHNlIGlmIG5vIGRlbGltaXRlcnMgZm91bmQnKTtcbiAgLy8gdC5ub3RPayhwLnBsdWNrYWJsZSgnLyoqKicpLCAncmV0dXJucyBmYWxzZSBpZiBvbmx5IG9uZSBkZWxpbWl0ZXIgZm91bmQnKTtcbiAgLy8gdC5ub3RPayhwLnBsdWNrYWJsZSgnKioqLycpLCAncmV0dXJucyBmYWxzZSBpZiBvbmx5IG9uZSBkZWxpbWl0ZXIgZm91bmQnKTtcbiAgLy8gdC5vayhwLnBsdWNrYWJsZSgnLyoqKiAqKiovJyksICdyZXR1cm5zIHRydWUgaWYgYm90aCBkZWxpbWl0ZXJzIGZvdW5kJyk7XG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2tTaW5nbGUgc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5lcXVhbCh0eXBlb2YgcC5wbHVja1NpbmdsZSwgJ2Z1bmN0aW9uJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzdHJpbmcgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHQudGhyb3dzKHAucGx1Y2tTaW5nbGUoJyoqKicpLCAndGhyb3dzIGFuIGVycm9yIG9uIHVucGx1Y2thYmxlIGNvbnRlbnQnKTtcbiAgdC5lcXVhbChwLnBsdWNrU2luZ2xlKCcvKioqIENPTlRFTlQgKioqLycpLCAnQ09OVEVOVCcsICdzdWNjZXNzZnVsbHkgcGx1Y2tzIGZyb20gc3RyaW5nJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cbnRlc3QoJ3NldCBhIGxpbWl0IG9uIHBsdWNrcycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LmVxdWFsKHAucGx1Y2soJy8qKiogSVRFTTEgKioqLyAvKioqIElURU0yICoqKi8gLyoqKiBJVEVNMyAqKiovJywgMikubGVuZ3RoLCAyLCAnbGltaXQgd29ya3MnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cbnRlc3QoJ3JlYWQgYSBzdHJpbmcgZnJvbSBhIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMSk7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuICBcbiAgcC5yZWFkKF9fZGlybmFtZSArICcvdGVzdC1zdHJpbmcuY3NzJylcbiAgLnRoZW4oIHN0ciA9PiB0LmVxdWFsKHN0ciwgJ3Rlc3Qtc3RyaW5nJywgJ3N1Y2Nlc3NmdWxseSByZWFkcyBmaWxlJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG4gICAgLCBzdHIgPSAnLyoqKiBTTklQUEVUIDEgKioqLyAvKioqIFNOSVBQRVQgMiAqKiovJ1xuICAgICwgYXJyID0gcC5wbHVjayhzdHIpO1xuXG4gIHQub2soQXJyYXkuaXNBcnJheShhcnIpLCAncGx1Y2sgYWxsIGlzIGFuIGFycmF5Jyk7XG4gIHQubG9vc2VFcXVhbChhcnIsIFsnU05JUFBFVCAxJywgJ1NOSVBQRVQgMiddLCAnY29udGFpbnMgdGhlIHZhbHVlcyBleHBlY3RlZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMSk7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHAucGx1Y2tGaWxlKF9fZGlybmFtZSArICcvdGVzdC1zdHlsZXNoZWV0LmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG4tLS1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG4tLS1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdzdWNjZXNzZnVsbHkgcmV0dXJucyBhbiBhcnJheSBvZiBzbmlwcGV0cycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUgd2l0aCBjdXN0b20gZGVsaW1pdGVycycsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiBgLypcXG49PT1gLFxuICAgIGNsb3Npbmc6IGA9PT1cXG4qL2BcbiAgfSk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQyLmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdjdXN0b20gZGVsaW1pdGVycyBvaycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ2NoZWNrIHNuaXBwZXQgZm9yIGtleSB2YWx1ZSBwYWlycycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAuaGFzS2V5VmFsdWUoJ0tFWSBWQUxVRScpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQubm90T2socC5oYXNLZXlWYWx1ZSgnQEtFWSB7IFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIHBhcnRpYWwgZGVsaW1pdGVycyBmb3VuZCcpO1xuICB0Lm9rKHAuaGFzS2V5VmFsdWUoJ0BLRVkgeyBWQUxVRSB9JyksICdyZXR1cm5zIHRydWUgaWYgYWxsIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwYWlyIHVwIHNpbmdsZSBrZXkvdmFsdWUgZnJvbSBzbmlwcGV0JywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQudGhyb3dzKHAucGFpclVwU2luZ2xlKCdLRVlWQUxVRScpLCAnVGhyb3dzIGFuIGVycm9yIHdoZW4gbm8ga2V5L3ZhbHVlIHBhaXIgY2FuIGJlIGZvdW5kJyk7XG4gIHQubG9vc2VFcXVhbChwLnBhaXJVcFNpbmdsZSgnS0VZIHsgVkFMVUUgfScpLCB7IEtFWTogJ1ZBTFVFJyB9LCAnc3VjY2Vzc2Z1bGx5IHNwbGl0cyBzbmlwcGV0IGludG8ga2V5cy92YWx1ZXMnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdyZXR1cm4gYXJyYXkgb2Ygb2JqZWN0cyBmcm9tIGFsbCBzbmlwcGV0cycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuICAgIFxuICAgICwgdGVzdEFyciA9IFtcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0gLS0tIGtleTIgeyBWQUxVRTIgfScsXG4gICAgICAna2V5MSB7IFZBTFVFMSB9IC0tLSBrZXkyIHsgVkFMVUUyIH0nXVxuICAgIFxuICAgICwgc2hvdWxkQmVFcXVhbCA9IFtcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH0sXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9XTtcblxuICB0Lmxvb3NlRXF1YWwocC5wYWlyVXAodGVzdEFyciksIHNob3VsZEJlRXF1YWwsICdyZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBzbmlwcGV0cyBhcyBrZXkvdmFsIG9iamVjdHMnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCd3cml0ZSBKU09OIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMSk7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG4gICAgXG4gICAgLCB0ZXN0QXJyID0gW1xuICAgICAgJ2tleTEgeyBWQUxVRTEgfSAtLS0ga2V5MiB7IFZBTFVFMiB9JyxcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0gLS0tIGtleTIgeyBWQUxVRTIgfSddXG4gICAgXG4gICAgLCBzaG91bGRCZUVxdWFsID0gW1xuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfSxcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH1dO1xuXG4gIGxldCBjb21waWxlZCA9IHAucGFpclVwKHRlc3RBcnIpO1xuICBcbiAgcC53cml0ZUpTT04oJ3Rlc3Qvb3V0cHV0Lmpzb24nLCBjb21waWxlZClcbiAgLnRoZW4oIHN1Y2Nlc3MgPT4gdC5wYXNzKCdTdWNjZXNzZnVsbHkgd3JpdGVzIGpzb24gZmlsZScpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcbiJdfQ==