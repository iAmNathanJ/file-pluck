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

//# sourceMappingURL=data:application/json;base64,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SSxDQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDO0dBQUEsQ0FBRSxTQUNsRCxDQUFFLFVBQUEsR0FBRztXQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBRSxDQUFDO0NBQzlCLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAndGFwZSc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi4vJztcblxudGVzdCgnY2hlY2sgZm9yIHBsdWNrYWJsZSBjb250ZW50JywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQubm90T2socC5wbHVja2FibGUoJ2JsYWggLyoqKiBibGFoIC8qKiogYmxhaCcpLCAnbm90IHBsdWNrYWJsZScpO1xuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcvKioqLycpLCAnbm90IHBsdWNrYWJsZScpXG4gIHQub2socC5wbHVja2FibGUoJ2JsYWggLyoqKiBibGFoICoqKi8gYmxhaCcpLCAncGx1Y2thYmxlJyk7XG5cbiAgbGV0IHAyID0gcGx1Y2soe1xuICAgIG9wZW5pbmc6ICdeXl4nLFxuICAgIGNsb3Npbmc6ICcjIyMnXG4gIH0pO1xuXG4gIHQub2socDIucGx1Y2thYmxlKCdibGFoIF5eXiBibGFoICMjIyBibGFoJyksICdwbHVja2FibGUgd2l0aCBjdXN0b20gZGVsaW1pdGVycycpO1xuXG4gIGxldCBwMyA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiAnLy8vJyxcbiAgICBjbG9zaW5nOiAnLy8vJ1xuICB9KTtcblxuICB0Lm9rKHAzLnBsdWNrYWJsZSgnYmxhaCAvLy8gYmxhaCAvLy8gYmxhaCcpLCAncGx1Y2thYmxlIHdpdGggZXF1YWwgZGVsaW1pdGVycycpO1xuXG4gIHQuZW5kKCk7XG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2tTaW5nbGUgc2hvdWxkIGJlIGEgZnVuY3Rpb24nLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5lcXVhbCh0eXBlb2YgcC5wbHVja1NpbmdsZSwgJ2Z1bmN0aW9uJywgJ2l0IGlzIGEgZnVuY3Rpb24nKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhIHN0cmluZyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQudGhyb3dzKHAucGx1Y2tTaW5nbGUoJyoqKicpLCAndGhyb3dzIGFuIGVycm9yIG9uIHVucGx1Y2thYmxlJyk7XG4gIHQuZXF1YWwocC5wbHVja1NpbmdsZSgnLyoqKiBDT05URU5UICoqKi8nKSwgJ0NPTlRFTlQnLCAnc3VjY2Vzc2Z1bGx5IHBsdWNrcyBmcm9tIHN0cmluZycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG50ZXN0KCdzZXQgYSBsaW1pdCBvbiBwbHVja3MnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5lcXVhbChwLnBsdWNrKCcvKioqIElURU0xICoqKi8gLyoqKiBJVEVNMiAqKiovIC8qKiogSVRFTTMgKioqLycsIDIpLmxlbmd0aCwgMiwgJ2xpbWl0IHdvcmtzJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG4vLyB0ZXN0KCdyZWFkIGEgc3RyaW5nIGZyb20gYSBmaWxlJywgdCA9PiB7XG5cbi8vICAgdC5wbGFuKDEpO1xuXG4vLyAgIGxldCBwID0gcGx1Y2soKTtcblxuLy8gICBwLnJlYWQoX19kaXJuYW1lICsgJy90ZXN0LXN0cmluZy5jc3MnKVxuLy8gICAudGhlbiggc3RyID0+IHQuZXF1YWwoc3RyLCAndGVzdC1zdHJpbmcnLCAnc3VjY2Vzc2Z1bGx5IHJlYWRzIGZpbGUnKSApXG4vLyAgIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbi8vIH0pO1xuXG5cblxudGVzdCgncGx1Y2sgc25pcHBldHMgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuICAgICwgc3RyID0gJy8qKiogU05JUFBFVCAxICoqKi8gLyoqKiBTTklQUEVUIDIgKioqLydcbiAgICAsIGFyciA9IHAucGx1Y2soc3RyKTtcblxuICB0Lm9rKEFycmF5LmlzQXJyYXkoYXJyKSwgJ3BsdWNrIGFsbCBpcyBhbiBhcnJheScpO1xuICB0Lmxvb3NlRXF1YWwoYXJyLCBbJ1NOSVBQRVQgMScsICdTTklQUEVUIDInXSwgJ2NvbnRhaW5zIHRoZSB2YWx1ZXMgZXhwZWN0ZWQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBzbmlwcGV0cyBmcm9tIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMik7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHAucGx1Y2tTaW5nbGVGaWxlKF9fZGlybmFtZSArICcvdGVzdC1zdHlsZXNoZWV0LmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdzdWNjZXNzZnVsbHkgcmV0dXJucyBhbiBhcnJheSBvZiBzbmlwcGV0cycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG4gIHAucGx1Y2tTaW5nbGVGaWxlKF9fZGlybmFtZSArICcvdGVzdC1zdHlsZXNoZWV0LmNzcycsIDEpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YF0sICdsaW1pdCByZXR1cm5lZCBzbmlwcGV0cycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIGFsbCBzbmlwcGV0cyBmcm9tIGZpbGUgd2l0aCBjdXN0b20gZGVsaW1pdGVycycsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiBgLypcXG49PT1gLFxuICAgIGNsb3Npbmc6IGA9PT1cXG4qL2BcbiAgfSk7XG5cbiAgcC5wbHVja1NpbmdsZUZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQyLmNzcycpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YF0sICdjdXN0b20gZGVsaW1pdGVycyBvaycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKVxuXG59KTtcblxuXG5cbnRlc3QoJ2NoZWNrIHNuaXBwZXQgZm9yIGtleSB2YWx1ZSBwYWlycycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAuaGFzS2V5VmFsdWUoJ0tFWSBWQUxVRScpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQub2socC5oYXNLZXlWYWx1ZSgnS0VZIHsgVkFMVUUnKSwgJ3JldHVybnMgdHJ1ZSBpZiBkZWxpbWl0ZXJzIGZvdW5kJyk7XG5cbiAgLy8gVE9ET1xuICAvLyBBZGQgUmVnZXggdG8gZGVsaW1pdGVyIHRlc3RpbmdcblxuICBsZXQgcDIgPSBwbHVjayh7XG4gICAgdmFsdWVPcGVuaW5nOiAnOicsXG4gICAgdmFsdWVDbG9zaW5nOiAnLidcbiAgfSk7XG5cbiAgdC5ub3RPayhwMi5oYXNLZXlWYWx1ZSgnS0VZIFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIG5vIGRlbGltaXRlcnMgZm91bmQnKTtcbiAgdC5vayhwMi5oYXNLZXlWYWx1ZSgnS0VZIDogVkFMVUUnKSwgJ3JldHVybnMgdHJ1ZSBpZiBjdXN0b20gZGVsaW1pdGVycyBmb3VuZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BhaXIgdXAgc2luZ2xlIGtleS92YWx1ZSBmcm9tIHNuaXBwZXQnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC50aHJvd3MocC5wYWlyVXAoJ0tFWVZBTFVFJyksICdUaHJvd3MgYW4gZXJyb3Igd2hlbiBubyBrZXkvdmFsdWUgcGFpciBjYW4gYmUgZm91bmQnKTtcbiAgdC5sb29zZUVxdWFsKHAucGFpclVwKCdLRVkgeyBWQUxVRSB9JyksIHsgS0VZOiAnVkFMVUUnIH0sICdzdWNjZXNzZnVsbHkgc3BsaXRzIHNuaXBwZXQgaW50byBrZXlzL3ZhbHVlcycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3JldHVybiBhcnJheSBvZiBvYmplY3RzIGZyb20gYWxsIHNuaXBwZXRzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG5cbiAgICAsIHRlc3RBcnIgPSBbXG4gICAgICAna2V5MSB7IFZBTFVFMSB9IGtleTIgeyBWQUxVRTIgfScsXG4gICAgICAna2V5MSB7IFZBTFVFMSB9IGtleTIgeyBWQUxVRTIgfSddXG5cbiAgICAsIHNob3VsZEJlRXF1YWwgPSBbXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9LFxuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfV07XG5cbiAgdC5sb29zZUVxdWFsKHAub2JqZWN0aWZ5KHRlc3RBcnIpLCBzaG91bGRCZUVxdWFsLCAncmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc25pcHBldHMgYXMga2V5L3ZhbCBvYmplY3RzJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG50ZXN0KCdyZWFkIGFuZCBwbHVjayBmaWxlcycsIHQgPT4ge1xuXG4gIHQucGxhbigzKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja0ZpbGUoYCR7X19kaXJuYW1lfS90ZXN0LXN0eWxlc2hlZXQuY3NzYClcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ3N1Y2Nlc3NmdWxseSBwbHVja3Mgc25pcHBldHMgZnJvbSBhIHNpbmdsZSBmaWxlJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xuXG4gIGxldCBmaWxlcyA9IFtcbiAgICBgJHtfX2Rpcm5hbWV9L3Rlc3Qtc3R5bGVzaGVldC5jc3NgLFxuICAgIGAke19fZGlybmFtZX0vdGVzdC1zdHlsZXNoZWV0My5jc3NgXG4gIF07XG5cbiAgcC5wbHVja0ZpbGUoZmlsZXMpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbYG5hbWUgeyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBTUzMgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgU1MzIEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ3N1Y2Nlc3NmdWxseSBwbHVja3Mgc25pcHBldHMgZnJvbSBhbiBhcnJheSBvZiBmaWxlcycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxuICBsZXQgZmlsZXNXaXRoR2xvYiA9IFtcbiAgICBgJHtfX2Rpcm5hbWV9LyouaHRtbGAsXG4gICAgYCR7X19kaXJuYW1lfS90ZXN0LXN0eWxlc2hlZXQzLmNzc2BcbiAgXTtcblxuICBwLnBsdWNrRmlsZShmaWxlc1dpdGhHbG9iKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgWyAnc3R1ZmYnLCAnbW9yZSBzdHVmZicsICduYW1lIHsgU1MzIEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH0nLCAnbmFtZSB7IFNTMyBBbm90aGVyIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJhbm90aGVyXCI+PC9lbGVtZW50PiB9JyBdLCAnc3VjY2Vzc2Z1bGx5IHBsdWNrcyBzbmlwcGV0cyBmcm9tIGFuIGFycmF5IG9mIGZpbGVzIHdpdGggZ2xvYnMnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbn0pO1xuXG5cblxudGVzdCgnd3JpdGUgSlNPTiBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDIpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LnRocm93cyhwLndyaXRlSlNPTigndGVzdC9ub3QgYW4gb2JqZWN0JyksICd0aHJvd3MgYW4gZXJyb3IgaWYgYXJnIDIgaXMgbm90IGFuIG9iamVjdCcpO1xuXG4gIGxldCB0ZXN0QXJyID0gW1xuICAgICAgJ2tleTEgeyBWQUxVRTEgfSBrZXkyIHsgVkFMVUUyIH0nLFxuICAgICAgJ2tleTEgeyBWQUxVRTEgfSBrZXkyIHsgVkFMVUUyIH0nXVxuXG4gICAgLCBzaG91bGRCZUVxdWFsID0gW1xuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfSxcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH1dO1xuXG4gIGxldCBjb21waWxlZCA9IHAub2JqZWN0aWZ5KHRlc3RBcnIpO1xuXG4gIHAud3JpdGVKU09OKCd0ZXN0L291dHB1dC5qc29uJywgY29tcGlsZWQpXG4gIC50aGVuKCBkYXRhID0+IHQucGFzcygnU3VjY2Vzc2Z1bGx5IHdyaXRlcyBqc29uIGZpbGUnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG59KTtcbiJdfQ==