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
Consider the following *text.txt*
```
...blah blah blah

/*** pluck me ***/

blah blah blah...

/*** pluck me too ***/

blah...
```

call `pluckFile` on text.txt

```node
import filePluck from 'file-pluck'

let p = filePluck();

let snippets = p.pluckFile('text.txt');

// ['pluck me', 'pluck me too']
```

---

By default opening and closing delimiters are set as `/***` and `***/`. You can change that to suit your needs.
```html
<div>

  <!-- <img src="img1" /> -->

  <div></div>

  <!-- <img src="img2" /> -->

</div>
```

call `pluckFile` on text.txt

```node
import filePluck from 'file-pluck'

let p = filePluck({
  opening: '<!--',
  closing: '-->'
});

let snippets = p.pluckFile('text.txt');

// ['pluck me', 'pluck me too']
```
