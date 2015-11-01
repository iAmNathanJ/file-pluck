import test from 'tape';
import pluck from '../';



test('check for pluckable content', t => {

  let p = pluck();

  t.notOk(p.pluckable('blah /*** blah /*** blah'), 'not pluckable');
  t.notOk(p.pluckable('/***/'), 'not pluckable')
  t.ok(p.pluckable('blah /*** blah ***/ blah'), 'pluckable');

  let p2 = pluck({
    opening: '^^^',
    closing: '###'
  });

  t.ok(p2.pluckable('blah ^^^ blah ### blah'), 'pluckable with custom delimiters');

  let p3 = pluck({
    opening: '///',
    closing: '///'
  });

  t.ok(p3.pluckable('blah /// blah /// blah'), 'pluckable with equal delimiters');

  t.end();

});



test('pluckSingle should be a function', t => {

  let p = pluck();

  t.equal(typeof p.pluckSingle, 'function', 'it is a function');

  t.end();
});



test('pluck a string from a string', t => {

  let p = pluck();
  
  t.throws(p.pluckSingle('***'), 'throws an error on unpluckable content');
  t.equal(p.pluckSingle('/*** CONTENT ***/'), 'CONTENT', 'successfully plucks from string');

  t.end();
});


test('set a limit on plucks', t => {

  let p = pluck();

  t.equal(p.pluck('/*** ITEM1 ***/ /*** ITEM2 ***/ /*** ITEM3 ***/', 2).length, 2, 'limit works');

  t.end();
});

test('read a string from a file', t => {

  t.plan(1);

  let p = pluck();
  
  p.read(__dirname + '/test-string.css')
  .then( str => t.equal(str, 'test-string', 'successfully reads file') )
  .catch( err => t.fail(err) );

});



test('pluck all snippets from a string', t => {

  let p = pluck()
    , str = '/*** SNIPPET 1 ***/ /*** SNIPPET 2 ***/'
    , arr = p.pluck(str);

  t.ok(Array.isArray(arr), 'pluck all is an array');
  t.looseEqual(arr, ['SNIPPET 1', 'SNIPPET 2'], 'contains the values expected');

  t.end();
});



test('pluck all snippets from file', t => {

  t.plan(1);

  let p = pluck();

  p.pluckFile(__dirname + '/test-stylesheet.css')
  .then( data => t.looseEqual(data, [`name { Base Style }\n---\nhtml { <element class="base"></element> }`, `name { Another Style }\n---\nhtml { <element class="another"></element> }`], 'successfully returns an array of snippets') )
  .catch( err => t.fail(err) )

});



test('pluck all snippets from file with custom delimiters', t => {

  t.plan(1);

  let p = pluck({
    opening: `/*\n===`,
    closing: `===\n*/`
  });

  p.pluckFile(__dirname + '/test-stylesheet2.css')
  .then( data => t.looseEqual(data, [`name { Base Style }\nhtml { <element class="base"></element> }`, `name { Another Style }\nhtml { <element class="another"></element> }`], 'custom delimiters ok') )
  .catch( err => t.fail(err) )

});



test('check snippet for key value pairs', t => {

  let p = pluck();

  t.notOk(p.hasKeyValue('KEY VALUE'), 'returns false if no delimiters found');
  t.notOk(p.hasKeyValue('KEY { VALUE'), 'returns false if partial delimiters found');
  t.ok(p.hasKeyValue('KEY { VALUE }'), 'returns true if all delimiters found');

  // TODO
  // Add Regex to delimiter testing
  
  let p2 = pluck({
    valueOpening: ':',
    valueClosing: '.'
  });

  t.notOk(p2.hasKeyValue('KEY : VALUE'), 'returns false if partial custom delimiters found');
  t.ok(p2.hasKeyValue('KEY : VALUE.'), 'returns true if all custom delimiters found');

  t.end();
});



test('pair up single key/value from snippet', t => {

  let p = pluck();

  t.throws(p.pairUpSingle('KEYVALUE'), 'Throws an error when no key/value pair can be found');
  t.looseEqual(p.pairUpSingle('KEY { VALUE }'), { KEY: 'VALUE' }, 'successfully splits snippet into keys/values');

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

  t.looseEqual(p.pairUp(testArr), shouldBeEqual, 'returns an array of all snippets as key/val objects');

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

  let compiled = p.pairUp(testArr);
  
  p.writeJSON('test/output.json', compiled)
  .then( success => t.pass('Successfully writes json file') )
  .catch( err => t.fail(err) )

});
