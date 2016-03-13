import fs from 'fs';
import glob from 'glob';

export default function FilePluck({

  // delimiters
  opening = '/***',
  closing = '***/',
  valueOpening = '{',
  valueClosing = '}',

} = {}) {

  // Helpers
  const snippetStart    = (str) => str.indexOf(opening) + opening.length
      , snippetEnd      = (str) => str.indexOf(closing)
      , delimiterEnd    = (str) => str.indexOf(closing) + closing.length;

  // Regex escape function - allows variables with special characters in expression
  const esc = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Patterns
  const pattern = {
    snippet: new RegExp(esc(opening) + '(.|\n)*' + esc(closing), 'g'),
    keyValue: new RegExp('(.|\n)*' + esc(valueOpening) + '(.|\n)*', 'g')
  };

  // Utility Functions (read/write)
  const read = (file) => {

    return new Promise((resolve, reject) => {

      fs.readFile(file, 'utf-8', (err, fileContent) => {
        if(err) reject(err);
        resolve(fileContent);
      });
    });
  };

  // write json file, return promise
  const writeJSON = (filename, obj) => {

    return new Promise((resolve, reject) => {

      if(!Object.is(obj)) resolve(new Error('writeJSON requires the second argument to be an object'));

      fs.writeFile(filename, JSON.stringify(obj, null, 2) + '\n', err => {
        if(err) reject(err);
        resolve(obj);
      });
    });
  };


  // Module
  return {

    pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return str.match(pattern.snippet);
    },

    pluckSingle(str) {
      if(!this.pluckable(str)) return new Error(`Unpluckable input: ${str}`);

      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluck(str, limit) {
      let snippets = [];

      if(limit) {
        while(this.pluckable(str) && limit--) {
          snippets.push(this.pluckSingle(str));
          str = str.slice(delimiterEnd(str), str.length);
        }
      } else {
        while(this.pluckable(str)) {
          snippets.push(this.pluckSingle(str));
          str = str.slice(delimiterEnd(str), str.length);
        }
      }
      return snippets;
    },

    pluckSingleFile(file, limit) {
      return read(file)
      .then(fileContent => this.pluck(fileContent, limit) );
    },

    pluckFile(files) {

      // Make sure files exist
      if(!files) return new Error('pluckFile - first argument should be a file or an array of files');

      let allFiles;

      // Check if files is array. If not, force it.
      if(!Array.isArray(files)) files = [files];

      // Reduce files to flat array
      // This will handle globs and allow mapping
      // Otherwise, with globs, we would have 2D array
      allFiles = files.reduce( (prev, cur) => {
        return prev.concat( glob.sync(cur, {}) );
      }, [])

      // Map files to an array of promises
      .map( file => this.pluckSingleFile(file) );


      // return promise
      return Promise.all(allFiles)
      .then(allFileContents => {

        // reduce all files to flat array of plucked content
        return allFileContents.reduce((prev, cur) => {
          return prev.concat(cur);
        }, []);

      });
    },

    hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.match(pattern.keyValue);
    },

    pairUp(str) {

      let pair;

      return str.split(valueClosing).reduce((prev, cur) => {

        // Skip this item if its blank or if it doesn't have qualifying delimiters
        if(!cur || !this.hasKeyValue(cur)) return prev;

        pair = cur.trim()     // Trim the string
        .split(valueOpening); // Split into pair

        // trim and add the pair to the reduction object
        prev[pair[0].trim()] = pair[1].trim()
        return prev;

      }, {});
    },

    objectify(snippets) {
      return snippets.map(snippet => this.pairUp(snippet) );
    },

    writeJSON: writeJSON
  };

}
