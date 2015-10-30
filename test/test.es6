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



test('pluck a snippet from file', t => {

  t.plan(1);

  let p = pluck();

  p.pluckFile(__dirname + '/test-stylesheet.css')
  .then( data => t.equal(data,`@name: Base Style\n@html: <element class="base"></element>`) )
  .catch( err => t.fail(err) )

});



test('pluck a snippet from file with custom delimiters', t => {

  t.plan(1);

  let p = pluck({
    delimiters: {
      opening: `/*\n===`,
      closing: `===\n*/`
    }
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css')
  .then( data => t.equal(data, `@name: Base Style\n@html: <element class="base"></element>`) )
  .catch( err => t.fail(err) )

});



test('pluck all snippets from a string', t => {

  let p = pluck()
    , str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/'
    , arr = p.pluckAll(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2']);

  t.end();
});



test('pluck all snippets from file', t => {

  t.plan(1);

  let p = pluck();

  p.pluckFileAll(__dirname + '/test-stylesheet.css')
  .then( data => t.looseEqual(data, [`@name: Base Style\n@html: <element class="base"></element>`, `@name: Another Style\n@html: <element class="another"></element>`]) )
  .catch( err => t.fail(err) )

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
