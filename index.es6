import fs from 'fs';

export default function({

  delimiters = {
    opening: '/***',
    closing: '***/',
    key: '@',
    value: ':',
  },

  output = {
    opening: '{',
    closing: '}',
    separator: ',',
    wrap(key, value) {
      return `"${key}": "${value}"`;
    }
  }

} = {}) {

  let snippets = []
    , delimiterStart = (str) => str.indexOf(delimeters.opening)
    , snippetStart = (str) => str.indexOf(delimeters.opening) + delimeters.opening.length
    , snippetEnd = (str) => str.indexOf(delimiters.closing)
    , delimiterEnd = (str) => str.indexOf(delimiters.closing) + delimiters.closing.length;

  return {

    pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return snippetStart(str) !== -1 && snippetEnd(str) !== -1;
    },

    pluck(str) {
      if(!this.pluckable(str)) return new Error('unpluckable input');
      // Returns the first pluckable snippet
      return str.substring(snippetStart(str), snippetEnd(str)).trim();
    },

    pluckAll(str) {
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
      .then( fileContents => this.pluck(fileContents) )
    },

    pluckFileAll(file) {
      return this.read(file)
      .then( fileContents => this.pluckAll(fileContents) )
    }

  };

}