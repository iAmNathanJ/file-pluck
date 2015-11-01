import fs from 'fs';

export default function({

  // delimiters
  opening = '/***',
  closing = '***/',
  valueOpening = '{',
  valueClosing = '}',
  keyValueSeparator = '---',

  // output
  output = {

    // write json file
    writeJSON(filename, content) {
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(content), err => {
          if(err) reject(err);
          resolve(true);
        });
      });
    }
  }

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
    keyValue: new RegExp(esc(valueOpening) + '(.|\n)*' + esc(valueClosing), 'g')
  };

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
      // if(!this.pluckable(str)) return new Error('unpluckable input'); 

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

    pluckFile(file) {
      return this.read(file)
      .then( fileContents => this.pluck(fileContents) )
    },

    hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.match(pattern.keyValue);
    },

    pairUpSingle(str) {
      if(!this.hasKeyValue(str)) return new Error(`No key/value pairs found - valueOpening = ${valueOpening}, valueClosing = ${valueClosing}`);
      
      let pair;

      return str.split(keyValueSeparator).reduce((prev, cur) => {
        // Trim the string
        pair = cur.trim()
          // Drop the closing delimiter
          .slice(0, -1)
          // Split into pair
          .split(valueOpening);
        // add the trimmed key/value to the reduction object
        prev[pair[0].trim()] = pair[1].trim()
        return prev;
      }, {});
    },

    pairUp(snippets) {
      return snippets.map(snippet => this.pairUpSingle(snippet) );
    },

    writeJSON: output.writeJSON
  };

}