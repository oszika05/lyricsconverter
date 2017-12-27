const error = require('./error');

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

function newParagraph(paragraphs, paragraph) {
  return paragraphs.find(element => {
    return element.name.trim() === paragraph.trim();
  })['body'].split('\n')
  .map(x => x.trim())
  .join('\n').trim() + '\n\n\n';
}

function convert(input) {
  let doc = new DOMParser().parseFromString(input, 'text/xml');

  if (!checkDoc(doc)) return "";


  let song = doc.getElementsByTagName('song')[0];

  let title = song.getElementsByTagName('title')[0].innerHTML;
  let order = song.getElementsByTagName('presentation')[0].innerHTML;

  let lyrics = song.getElementsByTagName('lyrics')[0].innerHTML;

  let paragraphs = lyrics.split(/\[(?=[\s\S]{1,10}\])/ig)
  .filter(paragraph => {
    return paragraph.length !== 0;
  })
  .map(paragraph => {
    return paragraph.replace(/\|\|/g, '\n').replace(/\|/g, ' ');
  })
  .map(paragraph => {
    let split = paragraph.split(']');
    return {
      name: split[0], // LOL
      body: split[1]
    }
  });

  console.log(paragraphs);


  //console.log(JSON.stringify(arr, null, 2));
  let body;

  try {
    let sequence = order.split(' ');
    body = sequence.reduce(
      (result, paragraph) => result  + newParagraph(paragraphs, paragraph),
      title + '\n\n\n\n');
  } catch (e) {
    error('A versszak nem található!');
    return "";
  }



  return body;
}

module.exports = {
  toIVS: convert,
  toOpenSong: null
};
