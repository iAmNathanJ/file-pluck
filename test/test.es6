import test from 'tape';
import pluck from '../';



test('check for pluckable content', t => {

  // TODO
  // Add Regex to delimiter testing ('/***/' will cause problems)

  let p = pluck();

  t.notOk(p.pluckable('***'), 'returns false if no delimiters found');
  t.notOk(p.pluckable('/***'), 'returns false if only one delimiter found');
  t.notOk(p.pluckable('***/'), 'returns false if only one delimiter found');
  t.ok(p.pluckable('/*** ***/'), 'returns true if both delimiters found');

  t.end();
});



test('pluckSingle should be a function', t => {

  let p = pluck();

  t.equal(typeof p.pluckSingle, 'function');

  t.end();
});



test('pluck a string from a string', t => {

  let p = pluck();
  
  t.throws(p.pluckSingle('***'), 'Throws an error on unpluckable content');
  t.equal(p.pluckSingle('/*** CONTENT ***/'), 'CONTENT');

  t.end();
});


test('set a limit on plucks', t => {

  let p = pluck({
    limit: 2
  });

  t.equal(p.pluck('/*** ITEM1 ***/ /*** ITEM2 ***/ /*** ITEM3 ***/').length, 2);

  t.end();
});

test('read a string from a file', t => {

  t.plan(1);

  let p = pluck();
  
  p.read(__dirname + '/test-string.css')
  .then( str => t.equal(str, 'test-string') )
  .catch( err => t.fail(err) );

});



test('pluck all snippets from a string', t => {

  let p = pluck()
    , str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/'
    , arr = p.pluck(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2']);

  t.end();
});



test('pluck all snippets from file', t => {

  t.plan(1);

  let p = pluck();

  p.pluckFile(__dirname + '/test-stylesheet.css')
  .then( data => t.looseEqual(data, [`name { Base Style }\n---\nhtml { <element class="base"></element> }`, `name { Another Style }\n---\nhtml { <element class="another"></element> }`]) )
  .catch( err => t.fail(err) )

});



test('pluck all snippets from file with custom delimiters', t => {

  t.plan(1);

  let p = pluck({
    opening: `/*\n===`,
    closing: `===\n*/`
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css')
  .then( data => t.looseEqual(data, [`name { Base Style }\nhtml { <element class="base"></element> }`, `name { Another Style }\nhtml { <element class="another"></element> }`]) )
  .catch( err => t.fail(err) )

});



test('check snippet for key value pairs', t => {

  let p = pluck();

  t.notOk(p.hasKeyValue('KEY VALUE'), 'returns false if no delimiters found');
  t.notOk(p.hasKeyValue('@KEY { VALUE'), 'returns false if partial delimiters found');
  t.ok(p.hasKeyValue('@KEY { VALUE }'), 'returns true if all delimiters found');

  t.end();
});



test('pair up keys/values from snippet', t => {

  let p = pluck();

  t.throws(p.pairUp('KEYVALUE'), 'Throws an error when no key/value pair can be found');

  t.end();
});



test('return object from key/values in snippet', t => {

  let p = pluck();

  t.looseEquals(p.pairUp('key1 { VALUE1 } --- key2 { VALUE2 }'), {key1: 'VALUE1', key2: 'VALUE2'});

  t.end();
});



test('return array of objects from all snippets', t => {

  let p = pluck()
    
    , testArr = [
      'key1 { VALUE1 } --- key2 { VALUE2 }',
      'key1 { VALUE1 } --- key2 { VALUE2 }']
    
    , shouldBeEqual = [
      { key1: 'VALUE1', key2: 'VALUE2' },
      { key1: 'VALUE1', key2: 'VALUE2' }];

  t.looseEquals(p.pairUpAll(testArr), shouldBeEqual);

  t.end();
});



test('write JSON file', t => {

  t.plan(1);

  let p = pluck()
    
    , testArr = [
      'key1 { VALUE1 } --- key2 { VALUE2 }',
      'key1 { VALUE1 } --- key2 { VALUE2 }']
    
    , shouldBeEqual = [
      { key1: 'VALUE1', key2: 'VALUE2' },
      { key1: 'VALUE1', key2: 'VALUE2' }];

  let compiled = p.pairUpAll(testArr);
  
  p.write('test/output.json', compiled)
  .then( success => t.pass('Successfully writes json file') )
  .catch( err => t.fail(err) )

});



test('output should format key/value pairs according to override', {skip: true}, t => {

  let p = pluck({
    output: {
      format(key, value) {
        return `{{${key}}} / {{${value}}}`;
      }
    }
  });

  t.equal(p.output.format('name', 'nate'), '{{name}} / {{nate}}');

  t.end();
});
