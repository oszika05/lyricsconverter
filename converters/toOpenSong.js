const error = require('../error');

const MAX_LINE_WIDTH = 230; // TODO

// TODO multiple times

function processIvs(input) {

  let song = {
    order: '',
    lyrics: ''
  }

  let paragraphNumber = 0;

  let paragraphs = [];
  order = [];

  song.lyrics = input.split('\n\n')
  .map(x => x.trim())
  .filter(x => x.length > 0)
  .forEach(x => {
    let paragraph = paragraphs.find(p => p.body === x);
    if (typeof paragraph === 'undefined') {
      paragraphs.push({
        name: 'V' + (++paragraphNumber),
        body: x
      });
      order.push('V' + paragraphNumber);
    } else {
      order.push(paragraph.name);
    }
  });

  song.lyrics = paragraphs
  .reduce((sum, current) => {
    return sum + "[" + current.name + "]\n" + current.body + "\n";
  }, "");
  song.order = order.reduce((sum, p) => (sum += ' ' + p), '').trim();

  return song;
}

function createTag(name, value, depth, recursive) {
  recursive = recursive || false;
  if (recursive) value = '\n' + value;

  let indentation = '';
  for (let i = 0; i < depth; ++i) indentation += "  ";

  return indentation + "<" + name + ">" + value + "</"+ name.replace(/ [^]*/g, '') + ">\n";
}

function createXML(tags, depth) {
  return Object.keys(tags).reduce((xml, key) => {
    if (typeof tags[key] === 'object')
      xml += createTag(key, createXML(tags[key], depth + 1), depth, true);
    else
      xml += createTag(key, tags[key], depth);

    return xml;
  }, '');
}


function convert(title, input, options) {
  options = options || {};
  if (!options.hasOwnProperty('longlinesplit')) options.longlinesplit = false;

  let song = processIvs(input);

  let tags = {
    'song': {
      'title': title,
      'author': 'from IVS sequence',
      'copyright': '',
      'presentation': song.order,
      'hymn_number': '',
      'capo print="false"': '',
      'tempo': '',
      'timesig': '',
      'ccli': '',
      'theme': '',
      'alttheme': '',
      'user1': '',
      'user2': '',
      'user3': '',
      'key': '',
      'aka': '',
      'key_line': '',
      'lyrics': song.lyrics,
      'style index="default_style"': ''
    }
  };



  return '<?xml version="1.0" encoding="UTF-8"?>\n' + createXML(tags, 0);
}

module.exports = convert;
