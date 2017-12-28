const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const {promisify} = require('util');

const error = require('./error');
const converter = require('./converter');

let destinationDirectory = path.join(".", "output");



function isFolderPromise(file) {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (err, stats) => {
      if (err) reject(err);

      resolve(stats.isDirectory());
    });
  });
}

function readDirPromise(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);

      resolve(files);
    });
  });
}

function openFiles(files) {
  files.forEach(file => {
    if (file.startsWith('.')) return;
    fs.readFile(file, 'utf8', (error, data) => {

      fs.writeFile(
        path.join(destinationDirectory, path.basename(file)) + ".ivs.txt",
        iconv.encode(converter.toIVS(data), 'ISO-8859-2'),
        {
          encoding: 'latin1'
        },
        err => {
          if (err) console.error(err); // TODO
        }
      );
    });
  });
}

async function open(what, destination) {
  destination = destination || destinationDirectory;
  destinationDirectory = destination;

  let files = await what.reduce(async (reducedFiles, file) => {
    if(await isFolderPromise(file)) {
      reducedFiles = (await reducedFiles).concat(await readDirPromise(file));
    } else {
      (await reducedFiles).push(file);
    }


    return reducedFiles;
  }, []);

  openFiles(files);
}



module.exports = open;
