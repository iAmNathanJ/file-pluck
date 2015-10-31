# File Pluck
[![Build Status](https://travis-ci.org/iAmNathanJ/file-pluck.svg?branch=master)](https://travis-ci.org/iAmNathanJ/file-pluck)  
---

***Expect this API to change until v1.0 is published***

- Pluck snippets from files (or any plain string)
- Return snippets in the form of strings or...
- Break snippets into key/value pairs 
- Optionally, output a file in JSON formatzz or...
- Override the format function to your liking

### TODO
- [ ] Write more tests
- [ ] Usage examples
- [ ] Add regex to search functions

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

If you want to break down snippets into key/value pairs, you can do so. This requires delimiters set on key/values. By default, they are  
`valueOpening: '{'`  
`valueClosing: '}'`  
`keyValueSeparator: '---'`  

*main.css*
```css

/***

name { base }
---
desc { Used for everything. }
---
example { <div class="base"></div> }

***/

.base {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/***

name { another-class }
---
desc { Not used for everything. }
---
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
  console.log( p.pairUpAll(snippets) );
});

// [{name: 'base', desc: 'Used for everything.', example: '<div class="base"></div>'}, {name: 'another-class', desc: 'Not used for everything.', example: '<div class="another-class"></div>'}]
```
