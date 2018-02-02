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
  return paragraphs
  .find(element => { // the paragraph with the given name
    return element.name.trim() === paragraph.trim();
  })['body']
  .split('\n')
  .map(x => x.trim()) // trimming the lines
  .join('\n').trim() + '\n\n\n'; // adding newlines to the end of the paragraph
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
    return {
      name: split[0],
      body: split[1].split('\n').map(line => line.trim()).join('\n') // trimming the lines
    }
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
      (result, paragraph) => result  + newParagraph(paragraphs, paragraph),
      title + '\n\n\n\n'
    );
  } catch (e) {
    error('A versszak nem található!');
    return "Hiba"; // TODO
  }



  return body;
}

module.exports = convert;
