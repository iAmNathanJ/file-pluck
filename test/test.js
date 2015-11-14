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

(0, _tape2['default'])('read a string from a file', function (t) {

  t.plan(1);

  var p = (0, _2['default'])();

  p.read(__dirname + '/test-string.css').then(function (str) {
    return t.equal(str, 'test-string', 'successfully reads file');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

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

  t.throws(p.writeJSON('not an object'), 'throws an error if arg 2 is not an object');

  var testArr = ['key1 { VALUE1 } key2 { VALUE2 }', 'key1 { VALUE1 } key2 { VALUE2 }'],
      shouldBeEqual = [{ key1: 'VALUE1', key2: 'VALUE2' }, { key1: 'VALUE1', key2: 'VALUE2' }];

  var compiled = p.objectify(testArr);

  p.writeJSON('test/output.json', compiled).then(function (data) {
    return t.pass('Successfully writes json file');
  })['catch'](function (err) {
    return t.fail(err);
  });
});

//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLENBQUM7O0FBRXBGLE1BQUksT0FBTyxHQUFHLENBQ1YsaUNBQWlDLEVBQ2pDLGlDQUFpQyxDQUFDO01BRWxDLGFBQWEsR0FBRyxDQUNoQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUNsQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRXhDLE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXBDLEdBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQ3hDLElBQUksQ0FBRSxVQUFBLElBQUk7V0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDO0dBQUEsQ0FBRSxTQUNsRCxDQUFFLFVBQUEsR0FBRztXQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBRSxDQUFDO0NBQzlCLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAndGFwZSc7XG5pbXBvcnQgcGx1Y2sgZnJvbSAnLi4vJztcblxuXG5cbnRlc3QoJ2NoZWNrIGZvciBwbHVja2FibGUgY29udGVudCcsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCdibGFoIC8qKiogYmxhaCAvKioqIGJsYWgnKSwgJ25vdCBwbHVja2FibGUnKTtcbiAgdC5ub3RPayhwLnBsdWNrYWJsZSgnLyoqKi8nKSwgJ25vdCBwbHVja2FibGUnKVxuICB0Lm9rKHAucGx1Y2thYmxlKCdibGFoIC8qKiogYmxhaCAqKiovIGJsYWgnKSwgJ3BsdWNrYWJsZScpO1xuXG4gIGxldCBwMiA9IHBsdWNrKHtcbiAgICBvcGVuaW5nOiAnXl5eJyxcbiAgICBjbG9zaW5nOiAnIyMjJ1xuICB9KTtcblxuICB0Lm9rKHAyLnBsdWNrYWJsZSgnYmxhaCBeXl4gYmxhaCAjIyMgYmxhaCcpLCAncGx1Y2thYmxlIHdpdGggY3VzdG9tIGRlbGltaXRlcnMnKTtcblxuICBsZXQgcDMgPSBwbHVjayh7XG4gICAgb3BlbmluZzogJy8vLycsXG4gICAgY2xvc2luZzogJy8vLydcbiAgfSk7XG5cbiAgdC5vayhwMy5wbHVja2FibGUoJ2JsYWggLy8vIGJsYWggLy8vIGJsYWgnKSwgJ3BsdWNrYWJsZSB3aXRoIGVxdWFsIGRlbGltaXRlcnMnKTtcblxuICB0LmVuZCgpO1xuXG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrU2luZ2xlIHNob3VsZCBiZSBhIGZ1bmN0aW9uJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwodHlwZW9mIHAucGx1Y2tTaW5nbGUsICdmdW5jdGlvbicsICdpdCBpcyBhIGZ1bmN0aW9uJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYSBzdHJpbmcgZnJvbSBhIHN0cmluZycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHQudGhyb3dzKHAucGx1Y2tTaW5nbGUoJyoqKicpLCAndGhyb3dzIGFuIGVycm9yIG9uIHVucGx1Y2thYmxlJyk7XG4gIHQuZXF1YWwocC5wbHVja1NpbmdsZSgnLyoqKiBDT05URU5UICoqKi8nKSwgJ0NPTlRFTlQnLCAnc3VjY2Vzc2Z1bGx5IHBsdWNrcyBmcm9tIHN0cmluZycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG50ZXN0KCdzZXQgYSBsaW1pdCBvbiBwbHVja3MnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC5lcXVhbChwLnBsdWNrKCcvKioqIElURU0xICoqKi8gLyoqKiBJVEVNMiAqKiovIC8qKiogSVRFTTMgKioqLycsIDIpLmxlbmd0aCwgMiwgJ2xpbWl0IHdvcmtzJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG50ZXN0KCdyZWFkIGEgc3RyaW5nIGZyb20gYSBmaWxlJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soKTtcbiAgXG4gIHAucmVhZChfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3RyaW5nLmNzcycpXG4gIC50aGVuKCBzdHIgPT4gdC5lcXVhbChzdHIsICd0ZXN0LXN0cmluZycsICdzdWNjZXNzZnVsbHkgcmVhZHMgZmlsZScpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxufSk7XG5cblxuXG50ZXN0KCdwbHVjayBzbmlwcGV0cyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG4gICAgLCBzdHIgPSAnLyoqKiBTTklQUEVUIDEgKioqLyAvKioqIFNOSVBQRVQgMiAqKiovJ1xuICAgICwgYXJyID0gcC5wbHVjayhzdHIpO1xuXG4gIHQub2soQXJyYXkuaXNBcnJheShhcnIpLCAncGx1Y2sgYWxsIGlzIGFuIGFycmF5Jyk7XG4gIHQubG9vc2VFcXVhbChhcnIsIFsnU05JUFBFVCAxJywgJ1NOSVBQRVQgMiddLCAnY29udGFpbnMgdGhlIHZhbHVlcyBleHBlY3RlZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BsdWNrIHNuaXBwZXRzIGZyb20gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigyKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja1NpbmdsZUZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ3N1Y2Nlc3NmdWxseSByZXR1cm5zIGFuIGFycmF5IG9mIHNuaXBwZXRzJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbiAgcC5wbHVja1NpbmdsZUZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJywgMSlcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gXSwgJ2xpbWl0IHJldHVybmVkIHNuaXBwZXRzJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZSB3aXRoIGN1c3RvbSBkZWxpbWl0ZXJzJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG9wZW5pbmc6IGAvKlxcbj09PWAsXG4gICAgY2xvc2luZzogYD09PVxcbiovYFxuICB9KTtcblxuICBwLnBsdWNrU2luZ2xlRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldDIuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ2N1c3RvbSBkZWxpbWl0ZXJzIG9rJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgnY2hlY2sgc25pcHBldCBmb3Iga2V5IHZhbHVlIHBhaXJzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQubm90T2socC5oYXNLZXlWYWx1ZSgnS0VZIFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIG5vIGRlbGltaXRlcnMgZm91bmQnKTtcbiAgdC5vayhwLmhhc0tleVZhbHVlKCdLRVkgeyBWQUxVRScpLCAncmV0dXJucyB0cnVlIGlmIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICAvLyBUT0RPXG4gIC8vIEFkZCBSZWdleCB0byBkZWxpbWl0ZXIgdGVzdGluZ1xuICBcbiAgbGV0IHAyID0gcGx1Y2soe1xuICAgIHZhbHVlT3BlbmluZzogJzonLFxuICAgIHZhbHVlQ2xvc2luZzogJy4nXG4gIH0pO1xuXG4gIHQubm90T2socDIuaGFzS2V5VmFsdWUoJ0tFWSBWQUxVRScpLCAncmV0dXJucyBmYWxzZSBpZiBubyBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQub2socDIuaGFzS2V5VmFsdWUoJ0tFWSA6IFZBTFVFJyksICdyZXR1cm5zIHRydWUgaWYgY3VzdG9tIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwYWlyIHVwIHNpbmdsZSBrZXkvdmFsdWUgZnJvbSBzbmlwcGV0JywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQudGhyb3dzKHAucGFpclVwKCdLRVlWQUxVRScpLCAnVGhyb3dzIGFuIGVycm9yIHdoZW4gbm8ga2V5L3ZhbHVlIHBhaXIgY2FuIGJlIGZvdW5kJyk7XG4gIHQubG9vc2VFcXVhbChwLnBhaXJVcCgnS0VZIHsgVkFMVUUgfScpLCB7IEtFWTogJ1ZBTFVFJyB9LCAnc3VjY2Vzc2Z1bGx5IHNwbGl0cyBzbmlwcGV0IGludG8ga2V5cy92YWx1ZXMnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdyZXR1cm4gYXJyYXkgb2Ygb2JqZWN0cyBmcm9tIGFsbCBzbmlwcGV0cycsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKVxuICAgIFxuICAgICwgdGVzdEFyciA9IFtcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9JyxcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9J11cbiAgICBcbiAgICAsIHNob3VsZEJlRXF1YWwgPSBbXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9LFxuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfV07XG5cbiAgdC5sb29zZUVxdWFsKHAub2JqZWN0aWZ5KHRlc3RBcnIpLCBzaG91bGRCZUVxdWFsLCAncmV0dXJucyBhbiBhcnJheSBvZiBhbGwgc25pcHBldHMgYXMga2V5L3ZhbCBvYmplY3RzJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG50ZXN0KCdyZWFkIGFuZCBwbHVjayBmaWxlcycsIHQgPT4ge1xuXG4gIHQucGxhbigzKTtcbiAgXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICBwLnBsdWNrRmlsZShgJHtfX2Rpcm5hbWV9L3Rlc3Qtc3R5bGVzaGVldC5jc3NgKVxuICAudGhlbiggZGF0YSA9PiB0Lmxvb3NlRXF1YWwoZGF0YSwgW2BuYW1lIHsgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfWAsIGBuYW1lIHsgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfWBdLCAnc3VjY2Vzc2Z1bGx5IHBsdWNrcyBzbmlwcGV0cyBmcm9tIGEgc2luZ2xlIGZpbGUnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbiAgbGV0IGZpbGVzID0gW1xuICAgIGAke19fZGlybmFtZX0vdGVzdC1zdHlsZXNoZWV0LmNzc2AsXG4gICAgYCR7X19kaXJuYW1lfS90ZXN0LXN0eWxlc2hlZXQzLmNzc2BcbiAgXTtcblxuICBwLnBsdWNrRmlsZShmaWxlcylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IFNTMyBCYXNlIFN0eWxlIH1cXG5cXG5odG1sIHsgPGVsZW1lbnQgY2xhc3M9XCJiYXNlXCI+PC9lbGVtZW50PiB9YCwgYG5hbWUgeyBTUzMgQW5vdGhlciBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYW5vdGhlclwiPjwvZWxlbWVudD4gfWBdLCAnc3VjY2Vzc2Z1bGx5IHBsdWNrcyBzbmlwcGV0cyBmcm9tIGFuIGFycmF5IG9mIGZpbGVzJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApO1xuXG4gIGxldCBmaWxlc1dpdGhHbG9iID0gW1xuICAgIGAke19fZGlybmFtZX0vKi5odG1sYCxcbiAgICBgJHtfX2Rpcm5hbWV9L3Rlc3Qtc3R5bGVzaGVldDMuY3NzYFxuICBdO1xuXG4gIHAucGx1Y2tGaWxlKGZpbGVzV2l0aEdsb2IpXG4gIC50aGVuKCBkYXRhID0+IHQubG9vc2VFcXVhbChkYXRhLCBbICdzdHVmZicsICdtb3JlIHN0dWZmJywgJ25hbWUgeyBTUzMgQmFzZSBTdHlsZSB9XFxuXFxuaHRtbCB7IDxlbGVtZW50IGNsYXNzPVwiYmFzZVwiPjwvZWxlbWVudD4gfScsICduYW1lIHsgU1MzIEFub3RoZXIgU3R5bGUgfVxcblxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH0nIF0sICdzdWNjZXNzZnVsbHkgcGx1Y2tzIHNuaXBwZXRzIGZyb20gYW4gYXJyYXkgb2YgZmlsZXMgd2l0aCBnbG9icycpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcblxufSk7XG5cblxuXG50ZXN0KCd3cml0ZSBKU09OIGZpbGUnLCB0ID0+IHtcblxuICB0LnBsYW4oMik7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuICAgIFxuICB0LnRocm93cyhwLndyaXRlSlNPTignbm90IGFuIG9iamVjdCcpLCAndGhyb3dzIGFuIGVycm9yIGlmIGFyZyAyIGlzIG5vdCBhbiBvYmplY3QnKTtcblxuICBsZXQgdGVzdEFyciA9IFtcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9JyxcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0ga2V5MiB7IFZBTFVFMiB9J11cbiAgICBcbiAgICAsIHNob3VsZEJlRXF1YWwgPSBbXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9LFxuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfV07XG5cbiAgbGV0IGNvbXBpbGVkID0gcC5vYmplY3RpZnkodGVzdEFycik7XG5cbiAgcC53cml0ZUpTT04oJ3Rlc3Qvb3V0cHV0Lmpzb24nLCBjb21waWxlZClcbiAgLnRoZW4oIGRhdGEgPT4gdC5wYXNzKCdTdWNjZXNzZnVsbHkgd3JpdGVzIGpzb24gZmlsZScpIClcbiAgLmNhdGNoKCBlcnIgPT4gdC5mYWlsKGVycikgKTtcbn0pO1xuIl19