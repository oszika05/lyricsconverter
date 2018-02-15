const error = require('../error');

const MAX_LINE_WIDTH = 230; // TODO

function checkDoc (doc) {
  if (doc.getElementsByTagName('song').length === 0) {
    error('Rossz formátum!');
    return false;
  }

  let song = doc.getElementsByTagName('song')[0];

  if (song.getElementsByTagName('title').length === 0) {
    error('Nincs cím!');
    return false;
  }

  if (song.getElementsByTagName('presentation').length === 0) { // TODO ha nincs sorrend, akkor legyendefault
    error('Hiányzik a sorrend!');
    return false;
  }

  if (doc.getElementsByTagName('lyrics').length === 0) {
    error('Hiányzik a szöveg!');
    return false;
  }

  return true;
}

/**
 * Finds the paragraph with a given name
 */
function newParagraph(paragraphs, paragraph) {
  let ret = paragraphs
  .find(element => { // the paragraph with the given name
    return element.name.trim() === paragraph.trim();
  })['body']
  .map(p => p.join('\n'))
  .join('\n') + '\n\n\n'; // adding newlines to the end of the paragraph

  console.log('2paragraph:\n|' + ret + '|');

  return ret;
}

function createPairs(paragraph) {
  let lines = paragraph.trim().split('\n');
  let ret = []

  for (let i = 0; i < lines.length - 1; i += 2) {
    ret.push([
      lines[i].trim(),
      lines[i + 1].trim()
    ]);
  }

  if (lines.length % 2 == 1) ret.push([lines[lines.length - 1].trim(), ''])

  console.log(ret)

  return ret;
}

function convert(title, input, options) {
  console.log(input);

  options = options || {};
  if (!options.hasOwnProperty('longlinesplit')) options.longlinesplit = false;
  if (!options.hasOwnProperty('autoorder')) options.autoorder = false;

  let doc = new DOMParser().parseFromString(input, 'text/xml');

  if (!checkDoc(doc)) return "Hiba";


  let song = doc.getElementsByTagName('song')[0];
  title = song.getElementsByTagName('title')[0].innerHTML;
  let order = song.getElementsByTagName('presentation')[0].innerHTML;
  let lyrics = song.getElementsByTagName('lyrics')[0].innerHTML;


  let paragraphs = lyrics.split(/\[(?=[\s\S]{1,10}\])/ig)
  .filter(paragraph => { // filtering empty paragraphs
    return paragraph.length !== 0;
  })
  .map(paragraph => { // replacing | and || to space and newline
    return paragraph.replace(/\|\|/g, '\n').replace(/\|/g, ' ');
  })
  .map(paragraph => { // extracting the paragraphs into an array
    let split = paragraph.split(']');
    let ret = {
      name: split[0],
      body: createPairs(split[1])
    }
    console.log('1paragraph:\n');
    ret.body.forEach(x => x.forEach(y => console.log('.'+y)))
    return ret;
  });

  // optional functions

  // long line split
  if(options.longlinesplit === true) {
    let newParagraphs = require('./linesplit')(paragraphs);
    if (newParagraphs.length !== paragraphs.length) {
      paragraphs = 'Ez a fájl automatikusan tördelve lett.\n\n' + newParagraphs;
    }
  }
  // automatic order

  // maybe? multiplication

  let body;
  try {
    let sequence = order.split(' ');
    body = sequence.reduce( // putting the paragraphs into the right order
      (result, paragraph) => result + newParagraph(paragraphs, paragraph),
      title + '\n\n\n\n'
    );
  } catch (e) {
    error('A versszak nem található!');
    return "Hiba"; // TODO
  }

  console.log(body);

  return body;
}

module.exports = convert;
