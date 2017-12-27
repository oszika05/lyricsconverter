const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const error = require('./error');
const converter = require('./converter');

function openFolder(pathToDir) {

  fs.readdir(pathToDir, (err, files) => {
    if (err) return; // TODO

    files.forEach(file => {
      if (file.startsWith('.')) return;
      fs.readFile(path.join('./testSongs', file), 'utf8', (error, data) => {


        console.log(converter.toIVS(data));

        fs.writeFile(
          path.join('.', 'output', file) + ".ivs.txt",
          iconv.encode(converter.toIVS(data), 'ISO-8859-2'),
          {
            encoding: 'latin1'
          },
          err => {
            if (err) console.error(err);
          }
        );

      });
    });
  });
}

module.exports = openFolder;
