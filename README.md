# File Pluck
[![Build Status](https://travis-ci.org/iAmNathanJ/file-pluck.svg?branch=master)](https://travis-ci.org/iAmNathanJ/file-pluck)

---

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
*text.txt*
```
...blah blah blah

/*** pluck me ***/

blah blah blah...

/*** pluck me too ***/

blah...
```

```node
import filePluck from 'file-pluck';

let p = filePluck();

let snippets = p.pluckFile('text.txt');

// ['pluck me', 'pluck me too']
```

---

By default opening and closing delimiters are set as `/***` and `***/`. You can change that to suit your needs.  
*index.html*
```html
<div>

  <!-- <img src="img1" /> -->

  <div></div>

  <!-- <img src="img2" /> -->

</div>
```

```node
import filePluck from 'file-pluck';

let p = filePluck({
  opening: '<!--',
  closing: '-->'
});

let snippets = p.pluckFile('index.html');

// ['<img src="img1" />', '<img src="img2" />']
```

---

If you want to break down snippets into key/value pairs, you can do so. This requires delimiters set on key/values. By default, they are valueOpening `{`, valueClosing `}`, and keyValueSeparator `---`.
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

className { another-class }
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

let snippets = p.pairUpAll('main.css');

// [{name: 'base', desc: 'Used for everything.', example: '<div class="base"></div>'}, {name: 'another-class', desc: 'Not used for everything.', example: '<div class="another-class"></div>'}]
```
