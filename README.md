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
Conside this file `text.txt`  

```
...blah blah blah

/*** pluck me ***/

blah blah blah...

/*** pluck me too ***/

blah...
```

```node
import filePluck from 'file-pluck'

let p = filePluck();

let snippets = p.pluckFile('text.txt');

// ['pluck me', 'pluck me too']
```
