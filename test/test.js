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

  t.notOk(p.pluckable('***'), 'returns false if no delimiters found');
  t.notOk(p.pluckable('/***'), 'returns false if only one delimiter found');
  t.notOk(p.pluckable('***/'), 'returns false if only one delimiter found');
  t.ok(p.pluckable('/*** ***/'), 'returns true if both delimiters found');

  t.end();
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

//# sourceMappingURL=data:application/json;base64,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T0FBTyxDQUFDLEVBQUUsYUFBYSxFQUFFLHFEQUFxRCxDQUFDLENBQUM7O0FBRXRHLEdBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNULENBQUMsQ0FBQzs7QUFJSCx1QkFBSyxpQkFBaUIsRUFBRSxVQUFBLENBQUMsRUFBSTs7QUFFM0IsR0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFVixNQUFJLENBQUMsR0FBRyxvQkFBTztNQUVYLE9BQU8sR0FBRyxDQUNWLHFDQUFxQyxFQUNyQyxxQ0FBcUMsQ0FBQztNQUV0QyxhQUFhLEdBQUcsQ0FDaEIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFDbEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUV4QyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxHQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUN4QyxJQUFJLENBQUUsVUFBQSxPQUFPO1dBQUksQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQztHQUFBLENBQUUsU0FDckQsQ0FBRSxVQUFBLEdBQUc7V0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztHQUFBLENBQUUsQ0FBQTtDQUU3QixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ3RhcGUnO1xuaW1wb3J0IHBsdWNrIGZyb20gJy4uLyc7XG5cblxuXG50ZXN0KCdjaGVjayBmb3IgcGx1Y2thYmxlIGNvbnRlbnQnLCB0ID0+IHtcblxuICAvLyBUT0RPXG4gIC8vIEFkZCBSZWdleCB0byBkZWxpbWl0ZXIgdGVzdGluZ1xuICAvLyBGaWxlIGNvbnRlbnRzIG9mICcvKioqLycgd2lsbCBjYXVzZSBwcm9ibGVtc1xuICAvLyBBbHNvLCBpZiBvcGVuaW5nIGFuZCBjbG9zaW5nIGRlbGltaXRlcnMgYXJlIHRoZSBzYW1lIHZhbHVlLCB0aGF0IHNob3VsZCBhbHNvIGNhdXNlIGEgcHJvYmxlbVxuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcqKionKSwgJ3JldHVybnMgZmFsc2UgaWYgbm8gZGVsaW1pdGVycyBmb3VuZCcpO1xuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcvKioqJyksICdyZXR1cm5zIGZhbHNlIGlmIG9ubHkgb25lIGRlbGltaXRlciBmb3VuZCcpO1xuICB0Lm5vdE9rKHAucGx1Y2thYmxlKCcqKiovJyksICdyZXR1cm5zIGZhbHNlIGlmIG9ubHkgb25lIGRlbGltaXRlciBmb3VuZCcpO1xuICB0Lm9rKHAucGx1Y2thYmxlKCcvKioqICoqKi8nKSwgJ3JldHVybnMgdHJ1ZSBpZiBib3RoIGRlbGltaXRlcnMgZm91bmQnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVja1NpbmdsZSBzaG91bGQgYmUgYSBmdW5jdGlvbicsIHQgPT4ge1xuXG4gIGxldCBwID0gcGx1Y2soKTtcblxuICB0LmVxdWFsKHR5cGVvZiBwLnBsdWNrU2luZ2xlLCAnZnVuY3Rpb24nKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxuXG50ZXN0KCdwbHVjayBhIHN0cmluZyBmcm9tIGEgc3RyaW5nJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuICBcbiAgdC50aHJvd3MocC5wbHVja1NpbmdsZSgnKioqJyksICd0aHJvd3MgYW4gZXJyb3Igb24gdW5wbHVja2FibGUgY29udGVudCcpO1xuICB0LmVxdWFsKHAucGx1Y2tTaW5nbGUoJy8qKiogQ09OVEVOVCAqKiovJyksICdDT05URU5UJywgJ3N1Y2Nlc3NmdWxseSBwbHVja3MgZnJvbSBzdHJpbmcnKTtcblxuICB0LmVuZCgpO1xufSk7XG5cblxudGVzdCgnc2V0IGEgbGltaXQgb24gcGx1Y2tzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQuZXF1YWwocC5wbHVjaygnLyoqKiBJVEVNMSAqKiovIC8qKiogSVRFTTIgKioqLyAvKioqIElURU0zICoqKi8nLCAyKS5sZW5ndGgsIDIsICdsaW1pdCB3b3JrcycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxudGVzdCgncmVhZCBhIHN0cmluZyBmcm9tIGEgZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG4gIFxuICBwLnJlYWQoX19kaXJuYW1lICsgJy90ZXN0LXN0cmluZy5jc3MnKVxuICAudGhlbiggc3RyID0+IHQuZXF1YWwoc3RyLCAndGVzdC1zdHJpbmcnLCAnc3VjY2Vzc2Z1bGx5IHJlYWRzIGZpbGUnKSApXG4gIC5jYXRjaCggZXJyID0+IHQuZmFpbChlcnIpICk7XG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gYSBzdHJpbmcnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKClcbiAgICAsIHN0ciA9ICcvKioqIFNOSVBQRVQgMSAqKiovIC8qKiogU05JUFBFVCAyICoqKi8nXG4gICAgLCBhcnIgPSBwLnBsdWNrKHN0cik7XG5cbiAgdC5vayhBcnJheS5pc0FycmF5KGFyciksICdwbHVjayBhbGwgaXMgYW4gYXJyYXknKTtcbiAgdC5sb29zZUVxdWFsKGFyciwgWydTTklQUEVUIDEnLCAnU05JUFBFVCAyJ10sICdjb250YWlucyB0aGUgdmFsdWVzIGV4cGVjdGVkJyk7XG5cbiAgdC5lbmQoKTtcbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgcC5wbHVja0ZpbGUoX19kaXJuYW1lICsgJy90ZXN0LXN0eWxlc2hlZXQuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcbi0tLVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcbi0tLVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ3N1Y2Nlc3NmdWxseSByZXR1cm5zIGFuIGFycmF5IG9mIHNuaXBwZXRzJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgncGx1Y2sgYWxsIHNuaXBwZXRzIGZyb20gZmlsZSB3aXRoIGN1c3RvbSBkZWxpbWl0ZXJzJywgdCA9PiB7XG5cbiAgdC5wbGFuKDEpO1xuXG4gIGxldCBwID0gcGx1Y2soe1xuICAgIG9wZW5pbmc6IGAvKlxcbj09PWAsXG4gICAgY2xvc2luZzogYD09PVxcbiovYFxuICB9KTtcblxuICBwLnBsdWNrRmlsZShfX2Rpcm5hbWUgKyAnL3Rlc3Qtc3R5bGVzaGVldDIuY3NzJylcbiAgLnRoZW4oIGRhdGEgPT4gdC5sb29zZUVxdWFsKGRhdGEsIFtgbmFtZSB7IEJhc2UgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImJhc2VcIj48L2VsZW1lbnQ+IH1gLCBgbmFtZSB7IEFub3RoZXIgU3R5bGUgfVxcbmh0bWwgeyA8ZWxlbWVudCBjbGFzcz1cImFub3RoZXJcIj48L2VsZW1lbnQ+IH1gXSwgJ2N1c3RvbSBkZWxpbWl0ZXJzIG9rJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuXG5cblxudGVzdCgnY2hlY2sgc25pcHBldCBmb3Iga2V5IHZhbHVlIHBhaXJzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpO1xuXG4gIHQubm90T2socC5oYXNLZXlWYWx1ZSgnS0VZIFZBTFVFJyksICdyZXR1cm5zIGZhbHNlIGlmIG5vIGRlbGltaXRlcnMgZm91bmQnKTtcbiAgdC5ub3RPayhwLmhhc0tleVZhbHVlKCdAS0VZIHsgVkFMVUUnKSwgJ3JldHVybnMgZmFsc2UgaWYgcGFydGlhbCBkZWxpbWl0ZXJzIGZvdW5kJyk7XG4gIHQub2socC5oYXNLZXlWYWx1ZSgnQEtFWSB7IFZBTFVFIH0nKSwgJ3JldHVybnMgdHJ1ZSBpZiBhbGwgZGVsaW1pdGVycyBmb3VuZCcpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3BhaXIgdXAgc2luZ2xlIGtleS92YWx1ZSBmcm9tIHNuaXBwZXQnLCB0ID0+IHtcblxuICBsZXQgcCA9IHBsdWNrKCk7XG5cbiAgdC50aHJvd3MocC5wYWlyVXBTaW5nbGUoJ0tFWVZBTFVFJyksICdUaHJvd3MgYW4gZXJyb3Igd2hlbiBubyBrZXkvdmFsdWUgcGFpciBjYW4gYmUgZm91bmQnKTtcbiAgdC5sb29zZUVxdWFsKHAucGFpclVwU2luZ2xlKCdLRVkgeyBWQUxVRSB9JyksIHsgS0VZOiAnVkFMVUUnIH0sICdzdWNjZXNzZnVsbHkgc3BsaXRzIHNuaXBwZXQgaW50byBrZXlzL3ZhbHVlcycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3JldHVybiBhcnJheSBvZiBvYmplY3RzIGZyb20gYWxsIHNuaXBwZXRzJywgdCA9PiB7XG5cbiAgbGV0IHAgPSBwbHVjaygpXG4gICAgXG4gICAgLCB0ZXN0QXJyID0gW1xuICAgICAgJ2tleTEgeyBWQUxVRTEgfSAtLS0ga2V5MiB7IFZBTFVFMiB9JyxcbiAgICAgICdrZXkxIHsgVkFMVUUxIH0gLS0tIGtleTIgeyBWQUxVRTIgfSddXG4gICAgXG4gICAgLCBzaG91bGRCZUVxdWFsID0gW1xuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfSxcbiAgICAgIHsga2V5MTogJ1ZBTFVFMScsIGtleTI6ICdWQUxVRTInIH1dO1xuXG4gIHQubG9vc2VFcXVhbChwLnBhaXJVcCh0ZXN0QXJyKSwgc2hvdWxkQmVFcXVhbCwgJ3JldHVybnMgYW4gYXJyYXkgb2YgYWxsIHNuaXBwZXRzIGFzIGtleS92YWwgb2JqZWN0cycpO1xuXG4gIHQuZW5kKCk7XG59KTtcblxuXG5cbnRlc3QoJ3dyaXRlIEpTT04gZmlsZScsIHQgPT4ge1xuXG4gIHQucGxhbigxKTtcblxuICBsZXQgcCA9IHBsdWNrKClcbiAgICBcbiAgICAsIHRlc3RBcnIgPSBbXG4gICAgICAna2V5MSB7IFZBTFVFMSB9IC0tLSBrZXkyIHsgVkFMVUUyIH0nLFxuICAgICAgJ2tleTEgeyBWQUxVRTEgfSAtLS0ga2V5MiB7IFZBTFVFMiB9J11cbiAgICBcbiAgICAsIHNob3VsZEJlRXF1YWwgPSBbXG4gICAgICB7IGtleTE6ICdWQUxVRTEnLCBrZXkyOiAnVkFMVUUyJyB9LFxuICAgICAgeyBrZXkxOiAnVkFMVUUxJywga2V5MjogJ1ZBTFVFMicgfV07XG5cbiAgbGV0IGNvbXBpbGVkID0gcC5wYWlyVXAodGVzdEFycik7XG4gIFxuICBwLndyaXRlSlNPTigndGVzdC9vdXRwdXQuanNvbicsIGNvbXBpbGVkKVxuICAudGhlbiggc3VjY2VzcyA9PiB0LnBhc3MoJ1N1Y2Nlc3NmdWxseSB3cml0ZXMganNvbiBmaWxlJykgKVxuICAuY2F0Y2goIGVyciA9PiB0LmZhaWwoZXJyKSApXG5cbn0pO1xuIl19