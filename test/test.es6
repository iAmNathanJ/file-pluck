import test from 'tape';
import pluck from '../';



test('check for pluckable content', t => {

  // TODO
  // Add Regex to delimiter testing ('/***/' will cause problems)

  let p = pluck();

  t.equal(p.pluckable('/*** ***/'), true);
  t.equal(p.pluckable('/** **/'), false);

  t.end();
});



test('pluck should be a function', t => {

  let p = pluck();

  t.equal(typeof p.pluck, 'function');

  t.end();
});



test('pluck a string from a string', t => {

  let p = pluck();
  
  t.equal(p.pluck('/*** CONTENT ***/'), 'CONTENT');

  t.end();
});



test('read a string from a file', t => {

  t.plan(1);

  let p = pluck();
  
  p.read(__dirname + '/test-string.css')
  .then( str => t.equal(str, 'test-string') )
  .catch( err => t.fail(err) );

});



test('pluck a string from file', t => {

  t.plan(1);

  let p = pluck();

  p.compile(__dirname + '/test-stylesheet.css')
  .then( data => t.equal(data,`@name: Base Style\n@html: <element class="base"></element>`) )
  .catch( err => t.fail(err) )

});



test('pluck a string from file with custom delimiters', t => {

  t.plan(1);

  let p = pluck({
    opening: `/*\n===`,
    closing: `===\n*/`
  });

  p.compile(__dirname + '/test-stylesheet2.css')
  .then( data => t.equal(data, `@name: Base Style\n@html: <element class="base"></element>`) )
  .catch( err => t.fail(err) )

});



test('output.wrap should be a function', {skip: true}, t => {
  
  let p = pluck();

  t.equal();

  t.end();
});



test('output.wrap() should format key/value pairs for json output by default', {skip: true}, t => {

  let p = pluck();
  
  let item = {
    key: 'name',
    val: 'nate'
  };

  t.equal(p.output.wrap(item.key, item.val), '{"name": "nate"}');

  t.end();
});



test('output.wrap() should format key/value pairs according to override', {skip: true}, t => {

  let p = pluck({
    output: {
      wrap(key, value) {
        return `{{${key}}} / {{${value}}}`
      }
    }
  });
  
  let item = {
    key: 'name',
    val: 'nate'
  };

  t.equal(p.output.wrap(item.key, item.val), '{{name}} / {{nate}}');

  t.end();
});



test('build(array) should return an array', {skip: true}, t => {

  let p = pluck();

  let items = [
    { key: 'key1', value: 'val1' },
    { key: 'key2', value: 'val2' },
    { key: 'key3', value: 'val3' }
  ];

  t.equal(Array.isArray(p.build(items)), true);

  t.end();
});



test('build(array) return array should be series of key values run through output.wrap() function and separated by output.separator', {skip: true}, t => {

  let p = pluck();

  let items = [
    { key: 'key1', value: 'val1' },
    { key: 'key2', value: 'val2' },
    { key: 'key3', value: 'val3' }
  ];

  t.equal(p.build(items), [{"key1": "val1"},{"key2": "val2"},{"key3": "val3"}]);

  t.end();
});



test('build(notArray) should throw an error if argument is not an array', {skip: true}, t => {

  let arg = 'this argument is not an array';

  t.end();
});
