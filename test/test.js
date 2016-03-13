'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('../');

var _2 = _interopRequireDefault(_);

(0, _tape2['default'])('check for pluckable content', function (t) {

  var p = (0, _2['default'])();

  t.notOk(p.pluckable('blah /*** blah /*** blah'), 'not pluckable');
  t.notOk(p.pluckable('/***/'), 'not pluckable');
  t.ok(p.pluckable('blah /*** blah ***/ blah'), 'pluckable');

  var p2 = (0, _2['default'])({
    opening: '^^^',
    closing: '###'
  });

  t.ok(p2.pluckable('blah ^^^ blah ### blah'), 'pluckable with custom delimiters');

  var p3 = (0, _2['default'])({
    opening: '///',
    closing: '///'
  });

  t.ok(p3.pluckable('blah /// blah /// blah'), 'pluckable with equal delimiters');

  t.end();
});

(0, _tape2['default'])('pluckSingle should be a function', function (t) {

  var p = (0, _2['default'])();

  t.equal(typeof p.pluckSingle, 'function', 'it is a function');

  t.end();
});

(0, _tape2['default'])('pluck a string from a string', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pluckSingle('***'), 'throws an error on unpluckable');
  t.equal(p.pluckSingle('/*** CONTENT ***/'), 'CONTENT', 'successfully plucks from string');

  t.end();
});

(0, _tape2['default'])('set a limit on plucks', function (t) {

  var p = (0, _2['default'])();

  t.equal(p.pluck('/*** ITEM1 ***/ /*** ITEM2 ***/ /*** ITEM3 ***/', 2).length, 2, 'limit works');

  t.end();
});

// test('read a string from a file', t => {

//   t.plan(1);

//   let p = pluck();

//   p.read(__dirname + '/test-string.css')
//   .then( str => t.equal(str, 'test-string', 'successfully reads file') )
//   .catch( err => t.fail(err) );

// });

(0, _tape2['default'])('pluck snippets from a string', function (t) {

  var p = (0, _2['default'])(),
      str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/',
      arr = p.pluck(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2'], 'contains the values expected');

  t.end();
});

(0, _tape2['default'])('pluck snippets from file', function (t) {

  t.plan(2);

  var p = (0, _2['default'])();

  p.pluckSingleFile(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n\nhtml { <element class="base"></element> }', 'name { Another Style }\n\nhtml { <element class="another"></element> }'], 'successfully returns an array of snippets');
  })['catch'](function (err) {
    return t.fail(err);
  });

  p.pluckSingleFile(__dirname + '/test-stylesheet.css', 1).then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n\nhtml { <element class="base"></element> }'], 'limit returned snippets');
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

  p.pluckSingleFile(__dirname + '/test-stylesheet2.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n\nhtml { <element class="base"></element> }', 'name { Another Style }\n\nhtml { <element class="another"></element> }'], 'custom delimiters ok');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('check snippet for key value pairs', function (t) {

  var p = (0, _2['default'])();

  t.notOk(p.hasKeyValue('KEY VALUE'), 'returns false if no delimiters found');
  t.ok(p.hasKeyValue('KEY { VALUE'), 'returns true if delimiters found');

  // TODO
  // Add Regex to delimiter testing

  var p2 = (0, _2['default'])({
    valueOpening: ':',
    valueClosing: '.'
  });

  t.notOk(p2.hasKeyValue('KEY VALUE'), 'returns false if no delimiters found');
  t.ok(p2.hasKeyValue('KEY : VALUE'), 'returns true if custom delimiters found');

  t.end();
});

(0, _tape2['default'])('pair up single key/value from snippet', function (t) {

  var p = (0, _2['default'])();

  t.throws(p.pairUp('KEYVALUE'), 'Throws an error when no key/value pair can be found');
  t.looseEqual(p.pairUp('KEY { VALUE }'), { KEY: 'VALUE' }, 'successfully splits snippet into keys/values');

  t.end();
});

(0, _tape2['default'])('return array of objects from all snippets', function (t) {

  var p = (0, _2['default'])(),
      testArr = ['key1 { VALUE1 } key2 { VALUE2 }', 'key1 { VALUE1 } key2 { VALUE2 }'],
      shouldBeEqual = [{ key1: 'VALUE1', key2: 'VALUE2' }, { key1: 'VALUE1', key2: 'VALUE2' }];

  t.looseEqual(p.objectify(testArr), shouldBeEqual, 'returns an array of all snippets as key/val objects');

  t.end();
});

(0, _tape2['default'])('read and pluck files', function (t) {

  t.plan(3);

  var p = (0, _2['default'])();

  p.pluckFile(__dirname + '/test-stylesheet.css').then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n\nhtml { <element class="base"></element> }', 'name { Another Style }\n\nhtml { <element class="another"></element> }'], 'successfully plucks snippets from a single file');
  })['catch'](function (err) {
    return t.fail(err);
  });

  var files = [__dirname + '/test-stylesheet.css', __dirname + '/test-stylesheet3.css'];

  p.pluckFile(files).then(function (data) {
    return t.looseEqual(data, ['name { Base Style }\n\nhtml { <element class="base"></element> }', 'name { Another Style }\n\nhtml { <element class="another"></element> }', 'name { SS3 Base Style }\n\nhtml { <element class="base"></element> }', 'name { SS3 Another Style }\n\nhtml { <element class="another"></element> }'], 'successfully plucks snippets from an array of files');
  })['catch'](function (err) {
    return t.fail(err);
  });

  var filesWithGlob = [__dirname + '/*.html', __dirname + '/test-stylesheet3.css'];

  p.pluckFile(filesWithGlob).then(function (data) {
    return t.looseEqual(data, ['stuff', 'more stuff', 'name { SS3 Base Style }\n\nhtml { <element class="base"></element> }', 'name { SS3 Another Style }\n\nhtml { <element class="another"></element> }'], 'successfully plucks snippets from an array of files with globs');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

(0, _tape2['default'])('write JSON file', function (t) {

  t.plan(2);

  var p = (0, _2['default'])();

  t.throws(p.writeJSON('test/not an object'), 'throws an error if arg 2 is not an object');

  var testArr = ['key1 { VALUE1 } key2 { VALUE2 }', 'key1 { VALUE1 } key2 { VALUE2 }'],
      shouldBeEqual = [{ key1: 'VALUE1', key2: 'VALUE2' }, { key1: 'VALUE1', key2: 'VALUE2' }];

  var compiled = p.objectify(testArr);

  p.writeJSON('test/output.json', compiled).then(function (data) {
    return t.pass('Successfully writes json file');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDO0dBQUEsQ0FBRSxTQUNsRCxDQUFFLFVBQUEsR0FBRztXQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBRSxDQUFDO0NBQzlCLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAndGFwZSc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi4vJztcblxuXG5cbnRlc3QoJ2NoZWNrIGZvciBwbHVja2FibGUgY29udGVudCcsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCdibGFoIC8qKiogYmxhaCAvKioqIGJsYWgnKSwgJ25vdCBwbHVja2FibGUnKTtcbiAgdC5ub3RPayhwLnBsdWNrYWJsZSgnLyoqKi8nKSwgJ25vdCBwbHVja2FibGUnKVxuICB0Lm9rKHAucGx1Y2thYmxlKCdibGFoIC8qKiogYmxhaCAqKiovIGJsYWgnKSwgJ3BsdWNrYWJsZScpO1xuXG4gIGxldCBwMiA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiAnXl5eJyxcbiAgICBjbG9zaW5nOiAnIyMjJ1xuICB9KTtcblxuICB0Lm9rKHAyLnBsdWNrYWJsZSgnYmxhaCBeXl4gYmxhaCAjIyMgYmxhaCcpLCAncGx1Y2thYmxlIHdpdGggY3VzdG9tIGRlbGltaXRlcnMnKTtcblxuICBsZXQgcDMgPSBwbHVjayh7XG4gICAgb3BlbmluZzogJy8vLycsXG4gICAgY2xvc2luZzogJy8vLydcbiAgfSk7XG5cbiAgdC5vayhwMy5wbHVja2FibGUoJ2JsYWggLy8vIGJsYWggLy8vIGJsYWgnKSwgJ3BsdWNrYWJsZSB3aXRoIGVxdWFsIGRlbGltaXRlcnMnKTtcblxuICB0LmVuZCgpO1xuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrU2luZ2xlIHNob3VsZCBiZSBhIGZ1bmN0aW9uJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwodHlwZW9mIHAucGx1Y2tTaW5nbGUsICdmdW5jdGlvbicsICdpdCBpcyBhIGZ1bmN0aW9uJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzdHJpbmcgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LnRocm93cyhwLnBsdWNrU2luZ2xlKCcqKionKSwgJ3Rocm93cyBhbiBlcnJvciBvbiB1bnBsdWNrYWJsZScpO1xuICB0LmVxdWFsKHAucGx1Y2tTaW5nbGUoJy8qKiogQ09OVEVOVCAqKiovJyksICdDT05URU5UJywgJ3N1Y2Nlc3NmdWxseSBwbHVja3MgZnJvbSBzdHJpbmcnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxudGVzdCgnc2V0IGEgbGltaXQgb24gcGx1Y2tzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwocC5wbHVjaygnLyoqKiBJVEVNMSAqKiovIC8qKiogSVRFTTIgKioqLyAvKioqIElURU0zICoqKi8nLCAyKS5sZW5ndGgsIDIsICdsaW1pdCB3b3JrcycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuLy8gdGVzdCgncmVhZCBhIHN0cmluZyBmcm9tIGEgZmlsZScsIHQgPT4ge1xuXG4vLyAgIHQucGxhbigxKTtcblxuLy8gICBsZXQgcCA9IHBsdWNrKCk7XG5cbi8vICAgcC5yZWFkKF9fZGlybmFtZSArICcvdGVzdC1zdHJpbmcuY3NzJylcbi8vICAgLnRoZW4oIHN0ciA9PiB0LmVxdWFsKHN0ciwgJ3Rlc3Qtc3RyaW5nJywgJ3N1Y2Nlc3NmdWxseSByZWFkcyBmaWxlJykgKVxuLy8gICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xuXG4vLyB9KTtcblxuXG5cbnRlc3QoJ3BsdWNrIHNuaXBwZXRzIGZyb20gYSBzdHJpbmcnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKClcbiAgICAsIHN0ciA9ICcvKioqIFNOSVBQRVQgMSAqKiovIC8qKiogU05JUFBFVCAyICoqKi8nXG4gICAgLCBhcnIgPSBwLnBsdWNrKHN0cik7XG5cbiAgdC5vayhBcnJheS5pc0FycmF5KGFyciksICdwbHVjayBhbGwgaXMgYW4gYXJyYXknKTtcbiAgdC5sb29zZUVxdWFsKGFyciwgWydTTklQUEVUIDEnLCAnU05JUFBFVCAyJ10sICdjb250YWlucyB0aGUgdmFsdWVzIGV4cGVjdGVkJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgc25pcHBldHMgZnJvbSBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDIpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICBwLnBsdWNrU2luZ2xlRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldC5jc3MnKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BuYW1lIHsgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfWBdLCAnc3VjY2Vzc2Z1bGx5IHJldHVybnMgYW4gYXJyYXkgb2Ygc25pcHBldHMnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpIClcblxuICBwLnBsdWNrU2luZ2xlRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldC5jc3MnLCAxKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BuYW1lIHsgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWBdLCAnbGltaXQgcmV0dXJuZWQgc25pcHBldHMnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpIClcblxufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhbGwgc25pcHBldHMgZnJvbSBmaWxlIHdpdGggY3VzdG9tIGRlbGltaXRlcnMnLCB0ID0+IHtcblxuICB0LnBsYW4oMSk7XG5cbiAgbGV0IHAgPSBwbHVjayh7XG4gICAgb3BlbmluZzogYC8qXFxuPT09YCxcbiAgICBjbG9zaW5nOiBgPT09XFxuKi9gXG4gIH0pO1xuXG4gIHAucGx1Y2tTaW5nbGVGaWxlKF9fZGlybmFtZSArICcvdGVzdC1zdHlsZXNoZWV0Mi5jc3MnKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BuYW1lIHsgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfWBdLCAnY3VzdG9tIGRlbGltaXRlcnMgb2snKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpIClcblxufSk7XG5cblxuXG50ZXN0KCdjaGVjayBzbmlwcGV0IGZvciBrZXkgdmFsdWUgcGFpcnMnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5ub3RPayhwLmhhc0tleVZhbHVlKCdLRVkgVkFMVUUnKSwgJ3JldHVybnMgZmFsc2UgaWYgbm8gZGVsaW1pdGVycyBmb3VuZCcpO1xuICB0Lm9rKHAuaGFzS2V5VmFsdWUoJ0tFWSB7IFZBTFVFJyksICdyZXR1cm5zIHRydWUgaWYgZGVsaW1pdGVycyBmb3VuZCcpO1xuXG4gIC8vIFRPRE9cbiAgLy8gQWRkIFJlZ2V4IHRvIGRlbGltaXRlciB0ZXN0aW5nXG5cbiAgbGV0IHAyID0gcGx1Y2soe1xuICAgIHZhbHVlT3BlbmluZzogJzonLFxuICAgIHZhbHVlQ2xvc2luZzogJy4nXG4gIH0pO1xuXG4gIHQubm90T2socDIuaGFzS2V5VmFsdWUoJ0tFWSBWQUxVRScpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQub2socDIuaGFzS2V5VmFsdWUoJ0tFWSA6IFZBTFVFJyksICdyZXR1cm5zIHRydWUgaWYgY3VzdG9tIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwYWlyIHVwIHNpbmdsZSBrZXkvdmFsdWUgZnJvbSBzbmlwcGV0JywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQudGhyb3dzKHAucGFpclVwKCdLRVlWQUxVRScpLCAnVGhyb3dzIGFuIGVycm9yIHdoZW4gbm8ga2V5L3ZhbHVlIHBhaXIgY2FuIGJlIGZvdW5kJyk7XG4gIHQubG9vc2VFcXVhbChwLnBhaXJVcCgnS0VZIHsgVkFMVUUgfScpLCB7IEtFWTogJ1ZBTFVFJyB9LCAnc3VjY2Vzc2Z1bGx5IHNwbGl0cyBzbmlwcGV0IGludG8ga2V5cy92YWx1ZXMnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdyZXR1cm4gYXJyYXkgb2Ygb2JqZWN0cyBmcm9tIGFsbCBzbmlwcGV0cycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuXG4gICAgLCB0ZXN0QXJyID0gW1xuICAgICAgJ2tleTEgeyBWQUxVRTEgfSBrZXkyIHsgVkFMVUUyIH0nLFxuICAgICAgJ2tleTEgeyBWQUxVRTEgfSBrZXkyIHsgVkFMVUUyIH0nXVxuXG4gICAgLCBzaG91bGRCZUVxdWFsID0gW1xuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfSxcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH1dO1xuXG4gIHQubG9vc2VFcXVhbChwLm9iamVjdGlmeSh0ZXN0QXJyKSwgc2hvdWxkQmVFcXVhbCwgJ3JldHVybnMgYW4gYXJyYXkgb2YgYWxsIHNuaXBwZXRzIGFzIGtleS92YWwgb2JqZWN0cycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxudGVzdCgncmVhZCBhbmQgcGx1Y2sgZmlsZXMnLCB0ID0+IHtcblxuICB0LnBsYW4oMyk7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHAucGx1Y2tGaWxlKGAke19fZGlybmFtZX0vdGVzdC1zdHlsZXNoZWV0LmNzc2ApXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdzdWNjZXNzZnVsbHkgcGx1Y2tzIHNuaXBwZXRzIGZyb20gYSBzaW5nbGUgZmlsZScpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxuICBsZXQgZmlsZXMgPSBbXG4gICAgYCR7X19kaXJuYW1lfS90ZXN0LXN0eWxlc2hlZXQuY3NzYCxcbiAgICBgJHtfX2Rpcm5hbWV9L3Rlc3Qtc3R5bGVzaGVldDMuY3NzYFxuICBdO1xuXG4gIHAucGx1Y2tGaWxlKGZpbGVzKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BuYW1lIHsgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgU1MzIEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IFNTMyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdzdWNjZXNzZnVsbHkgcGx1Y2tzIHNuaXBwZXRzIGZyb20gYW4gYXJyYXkgb2YgZmlsZXMnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbiAgbGV0IGZpbGVzV2l0aEdsb2IgPSBbXG4gICAgYCR7X19kaXJuYW1lfS8qLmh0bWxgLFxuICAgIGAke19fZGlybmFtZX0vdGVzdC1zdHlsZXNoZWV0My5jc3NgXG4gIF07XG5cbiAgcC5wbHVja0ZpbGUoZmlsZXNXaXRoR2xvYilcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFsgJ3N0dWZmJywgJ21vcmUgc3R1ZmYnLCAnbmFtZSB7IFNTMyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9JywgJ25hbWUgeyBTUzMgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfScgXSwgJ3N1Y2Nlc3NmdWxseSBwbHVja3Mgc25pcHBldHMgZnJvbSBhbiBhcnJheSBvZiBmaWxlcyB3aXRoIGdsb2JzJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xuXG59KTtcblxuXG5cbnRlc3QoJ3dyaXRlIEpTT04gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigyKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC50aHJvd3MocC53cml0ZUpTT04oJ3Rlc3Qvbm90IGFuIG9iamVjdCcpLCAndGhyb3dzIGFuIGVycm9yIGlmIGFyZyAyIGlzIG5vdCBhbiBvYmplY3QnKTtcblxuICBsZXQgdGVzdEFyciA9IFtcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9JyxcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9J11cblxuICAgICwgc2hvdWxkQmVFcXVhbCA9IFtcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH0sXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9XTtcblxuICBsZXQgY29tcGlsZWQgPSBwLm9iamVjdGlmeSh0ZXN0QXJyKTtcblxuICBwLndyaXRlSlNPTigndGVzdC9vdXRwdXQuanNvbicsIGNvbXBpbGVkKVxuICAudGhlbiggZGF0YSA9PiB0LnBhc3MoJ1N1Y2Nlc3NmdWxseSB3cml0ZXMganNvbiBmaWxlJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xufSk7XG4iXX0=