const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const {promisify} = require('util');

const error = require('./error');
const converter = require('./converter');

let destinationDirectory = path.join(".", "output");

let options = {
  converterFunction: null,
  fileExtention: '',
  format: {
    from: '',
    to: '',
    toNode: ''
  }
};




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
    fs.readFile(file, options.format.from, (error, data) => {

      fs.writeFile(
        path.join(destinationDirectory, path.parse(file).name) + options.fileExtention,
        iconv.encode(options.converterFunction(path.parse(file).name, data), options.format.to),
        {
          encoding: options.format.toNode
        },
        err => {
          if (err) console.error(err); // TODO
        }
      );
    });
  });
}

async function open(what, mode, destination) {
  destination = destination || destinationDirectory;
  destinationDirectory = destination;

  console.log(mode);

  switch (mode) {
    case 'toOpenSong':
      console.log('opensong');
      options = {
        converterFunction: converter.toOpenSong,
        fileExtention: '',
        format: {
          from: 'latin1',
          to: 'utf8',
          toNode: 'utf8'
        }
      };
      break;
    case 'toIVS':
    default:
      console.log('ivs');
      options = {
        converterFunction: converter.toIVS,
        fileExtention: '.txt',
        format: {
          from: 'utf8',
          to: 'ISO-8859-2',
          toNode: 'latin1'
        }
      };
      break;
  }

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
