import fs from 'fs';

export default function({

  // delimiters
  opening = '/***',
  closing = '***/',
  keyClosing = '{',
  valueClosing = '}',
  keyValueSeparator = '---',
  
  // limit number of key/value return 
  limit = null,

  // output
  output = {

    // format function for key values
    format(key, value) {
      return `"${key}": "${value}"`;
    }
  }

} = {}) {

  // Helpers
  let delimiterStart  = (str) => str.indexOf(opening)
    , snippetStart    = (str) => str.indexOf(opening) + opening.length
    , snippetEnd      = (str) => str.indexOf(closing)
    , delimiterEnd    = (str) => str.indexOf(closing) + closing.length;

  return {

    pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return delimiterStart(str) !== -1 && snippetEnd(str) !== -1;
    },

    pluck(str) {
      if(!this.pluckable(str)) return new Error('unpluckable input'); 
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluckAll(str) {
      let snippets = [];
      while(this.pluckable(str)) {
        snippets.push(this.pluck(str));
        str = str.slice(delimiterEnd(str), str.length)
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
      .then( fileContents => this.pluckAll(fileContents) )
    },

    hasKeyValue(str) {
      // Returns true if all key/value delimiters are found
      return str.indexOf(keyClosing) !== -1 && str.indexOf(valueClosing) !== -1;
    },

    pairUp(str) {
      
      if(!this.hasKeyValue(str)) return new Error(`No key/value pairs found - 
        keyClosing = ${keyClosing}, valueClosing = ${valueClosing}`);
      
      let pair;
      return str.split(keyValueSeparator).reduce((prev, cur) => {
        
        // Trim the string
        pair = cur.trim()
          // Drop the closing delimiter
          .slice(0, -1)
          // Split into pair
          .split(keyClosing);

        // add the trimmed key/value to the reduction object
        prev[pair[0].trim()] = pair[1].trim()
        return prev;

      }, {});
    },

    jsonify(str) {
      
    }

  };

}