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

  return {

    pluck(str) {
      
      let start = str.indexOf(opening) + opening.length
        , end   = str.indexOf(closing) - closing.length;
    
      return str.substr(start, end).trim();
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