import fs from 'fs';

export default function({

  opening = '/***',
  closing = '***/',
  key = '@',
  value = ':',

  output = {
    opening: '{',
    closing: '}',
    separator: ',',
    wrap(key, value) {
      return `"${key}": "${value}"`;
    }
  }

} = {}) {

  let snippets = [];
  let start = (str) => str.indexOf(opening) + opening.length;
  let end = (str) => str.indexOf(closing);

  return {

    pluckable(str) {
      // Returns true if both opening and closing delimiters are found
      return start(str) !== -1 && end(str) !== -1;
    },

    pluck(str) {
      if(!this.pluckable(str)) throw new Error('Unpluckable input');
      // Returns the first pluckable snippet
      return str.substring(start(str), end(str)).trim();
    },

    pluckAll(str) {
    },
    
    read(file) {

      return new Promise((resolve, reject) => {
      
        fs.readFile(file, 'utf-8', (err, data) => {  
          if(err) reject(err);
          resolve(data);
        });
      
      });

    },

    compile(file) {
      return this.read(file)
      .then( fileContents => this.pluck(fileContents) )
    }

    // build(itemsArray) {
    //   return itemsArray.map((item, i, arr) => {

    //     let separator = output.separator;
        
    //     return Object.keys(item).map(key => {
        
    //       return output.wrap(key, item[key]) + separator;
        
    //     });
    //   });
    // }
  };

}