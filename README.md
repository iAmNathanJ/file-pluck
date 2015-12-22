# File Pluck

[![Build Status](https://travis-ci.org/iAmNathanJ/file-pluck.svg?branch=master)](https://travis-ci.org/iAmNathanJ/file-pluck) [![Code Climate](https://codeclimate.com/github/iAmNathanJ/file-pluck/badges/gpa.svg)](https://codeclimate.com/github/iAmNathanJ/file-pluck)  

- Pluck snippets from files (or any plain string)
- Return snippets in the form of strings or...
- Break snippets into key/value pairs
- Optionally, output a file in JSON format

File Pluck exposes an ES2015 [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API. Use it with your transpiler of choice, such as [Babel](https://babeljs.io/), or any environment that supports native JavaScript promises.  
***Note: Node.js v4.2.3 supports promises out of the box. No need for a transpiler.***

## Install
`npm i file-pluck`

## Usage
The `pluckFile` function returns a promise that will resolve to an array of "snippets" found within the target file(s). It accepts one argument&mdash;a single file as a string, or an array of files. Globs work too. Use it like so...  

Assuming a file called *example.txt* contained the following...
```
...blah blah blah

/*** pluck this text ***/

blah blah blah...

/*** pluck this text too ***/

blah...
```

By default, opening and closing delimiters are set as `/***` and `***/`. You can pluck the snippets from *example.txt* like so...
```node
'use strict';

let filePluck = require('file-pluck');

let p = filePluck();

let getSnippets = p.pluckFile('example.txt')

getSnippets.then(snippets => {
  console.log(snippets);
});

// ['pluck this text', 'pluck this text too']
```

---

Use custom delimiters on the following, *index.html*...
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

If you want to break down snippets into key/value pairs, you can do so. This requires delimiters on key/values. By default, they are `{` and `}`. Take the following file, *main.css*...
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

You can create key/value pairs like so...
```node
'use strict';

let filePluck = require('file-pluck');

let p = filePluck();

p.pluckFile('main.css')
.then(snippets => {
  console.log( p.objectify(snippets) );
});

// [{name: 'base', desc: 'Used for everything.', example: '<div class="base"></div>'}, {name: 'another-class', desc: 'Not used for everything.', example: '<div class="another-class"></div>'}]
```

Or write that data to file in JSON...
```node
'use strict';

let filePluck = require('file-pluck');

let p = filePluck();

p.pluckFile('main.css')
.then(snippets => {
  p.writeJSON('output.json', p.objectify(snippets) );
});
```

Which would yeild the file *output.json*...
```json
[
  {
    "name": "base",
    "desc": "Used for everything.",
    "example": "<div class=\"base\"></div>"
  },
  {
    "name": "another-class",
    " desc": "Not used for everything.",
    "example": "<div class=\"another-class\"></div>"
  }
]
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

**filePluck.pluckFile(file)** `promise.then(array => {})`  
Returns a promise that resolves to an array of strings. `file` can be a string value or an array of string values. Globs work, so feel free to mix and match as necessary, e.g. `pluckFile(['*.html', 'main.css'])`

**filePluck.objectify(array)** `array`  
Maps an input array to an array of JS objects (key/value pairs). 

**filePluck.writeJSON(file, object)** `promise.then(object => {})`  
Writes a javascript object to a json file, returns a promise that resolves to the input object. 
