import fs from 'fs';

export default function({

  delimiters = {
    opening: '/***',
    closing: '***/',
    key: '@',
    value: '::'
  },

  limit = null,

  output = {
    wrap(key, value) {
      return `"${key}": "${value}"`;
    }
  }

} = {}) {

  // Helpers
  let delimiterStart      = (str) => str.indexOf(delimiters.opening)
    , snippetStart        = (str) => str.indexOf(delimiters.opening) + delimiters.opening.length
    , snippetEnd          = (str) => str.indexOf(delimiters.closing)
    , delimiterEnd        = (str) => str.indexOf(delimiters.closing) + delimiters.closing.length
    , keyDelimiterStart   = (str) => str.indexOf(delimiters.key)
    , keyStart            = (str) => str.indexOf(delimiters.key) + delimiters.key.length
    , valueDelimiterStart = (str) => str.indexOf(delimiters.value)
    , valueStart          = (str) => str.indexOf(delimiters.value) + delimiters.value.length;

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
      // Returns true if both key and value delimiters are found
      return keyDelimiterStart(str) !== -1 && valueDelimiterStart(str) !== -1;
    },

    jsonify(str) {
      
    }

  };

}