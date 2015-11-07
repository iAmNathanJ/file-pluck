# File Pluck

[![Build Status](https://travis-ci.org/iAmNathanJ/file-pluck.svg?branch=master)](https://travis-ci.org/iAmNathanJ/file-pluck) [![Code Climate](https://codeclimate.com/github/iAmNathanJ/file-pluck/badges/gpa.svg)](https://codeclimate.com/github/iAmNathanJ/file-pluck)  
***Expect this API to change frequently until v1.0***

- Pluck snippets from files (or any plain string)
- Return snippets in the form of strings or...
- Break snippets into key/value pairs
- Optionally, output a file in JSON format

## Install
`npm i file-pluck`

## Usage
The `pluckFile` function returns a promise that will resolve to an array of "snippets" found within the target file. Use it like so...  

*text.txt*
```
...blah blah blah

/*** pluck this text ***/

blah blah blah...

/*** pluck this text too ***/

blah...
```

```node
import filePluck from 'file-pluck';

let p = filePluck();

let getSnippets = p.pluckFile('test.txt')

getSnippets.then(snippets => {
  console.log(snippets);
});

// ['pluck this text', 'pluck this text too']
```

---

By default, opening and closing delimiters are set as `/***` and `***/`. You can change that to suit your needs.  

*index.html*
```html
<div>

  <!-- <img src="img1" /> -->

  <div></div>

  <!-- <img src="img2" /> -->

</div>
```

```node
let p = filePluck({
  opening: '<!--',
  closing: '-->'
});

let getSnippets = p.pluckFile('index.html');

getSnippets.then(snippets => {
  console.log(snippets);
});

// ['<img src="img1" />', '<img src="img2" />']
```

---

If you want to break down snippets into key/value pairs, you can do so. This requires delimiters set on key/values. By default, they are:  
`valueOpening: '{'`  
`valueClosing: '}'`

*main.css*
```css

/***

name { base }
desc { Used for everything. }
example { <div class="base"></div> }

***/

.base {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/***

name { another-class }
desc { Not used for everything. }
example { <div class="another-class"></div> }

***/

.another-class {
  margin: 2rem;
}

```

```node
import filePluck from 'file-pluck';

let p = filePluck();

p.pluckFile('main.css')
.then(snippets => {
  console.log( p.pairUp(snippets) );
});

// [{name: 'base', desc: 'Used for everything.', example: '<div class="base"></div>'}, {name: 'another-class', desc: 'Not used for everything.', example: '<div class="another-class"></div>'}]
```

---

File Pluck does not support file globs (for now). If you'd like to use globs see [glob](https://www.npmjs.com/package/glob "a little globber") and/or use the function provided below...

```node
import filePluck from 'file-pluck';
import glob from 'glob';

let getFiles = (filePattern, opts) => {
  return new Promise((resolve, reject) => {
    glob(filePattern, opts, (err, filesArray) => {
      if(err) reject(err);
      resolve(filesArray);
    });
  });
};

// glob it

let p = filePluck();

getFiles('*.html')
.then( files => p.pluckFiles(files) )
.then( snippets => p.writeJSON('output.json', p.pairUp(snippets)) )
.catch( err => console.error(err) );
```


## API

### filePluck([options])

**options.opening**  
Type: `string`  
Default: `'/***'`  

**options.closing**  
Type: `string`  
Default: `'***/'`  

**options.valueOpening**  
Type: `string`  
Default: `'{'`  

**options.valueClosing**  
Type: `string`  
Default: `'}'`  

**filePluck.pluckable(string)** `boolean`  
Returns true if the input string contains opening and closing delimiters.

**filePluck.pluck(string, [limit])** `array`  
Returns an array of strings plucked from input string. Optionally, accepts a limit argument to limit the number of items in the returned array.

**filePluck.pluckFile(file, [limit])** `promise.then(array => {})`  
Returns a promise that resolves to an array of strings. Optionally, accepts a limit argument to limit the number of items in the returned array.

**filePluck.pluckFiles(array)** `promise.then(array => {})`  
Note the plural, pluckFile**s**. This accepts and array of files and returns a promise that resolves to an array of strings.

**filePluck.pairUp(array)** `array`  
Maps an input array to an array of JS objects, key value pairs. 

**filePluck.writeJSON(file, object)** `promise.then(object => {})`  
Writes a javascript object to a json file, returns a promise that resolves to the input object. 
