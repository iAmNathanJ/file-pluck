import fs from 'fs';

export default function({

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

  // write json file
  let writeJSON = (filename, obj) => {
    
    return new Promise((resolve, reject) => {
      
      if(!Object.is(obj)) resolve(new Error('writeJSON requires the second argument to be an object'));
      
      fs.writeFile(filename, JSON.stringify(obj), err => {
        if(err) reject(err);
        resolve(content);
      });
    });
  }

  // Module
  return {

    pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return str.match(pattern.snippet);
    },

    pluckSingle(str) {
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluck(str, limit) {
      if(!this.pluckable(str)) return new Error('unpluckable input'); 

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
    
    read(file) {
      return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {  
          if(err) reject(err);
          resolve(data);
        });
      });
    },

    pluckFile(file, limit) {
      return this.read(file)
      .then( fileContents => this.pluck(fileContents, limit) )
    },

    hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.match(pattern.keyValue);
    },

    pairUpSingle(str) {
      
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

    pairUp(snippets) {
      return snippets.map(snippet => this.pairUpSingle(snippet) );
    },

    writeJSON: writeJSON
  };

}