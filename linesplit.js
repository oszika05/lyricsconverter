
// const inflationStep = 0.36787944117; // 1/e idk why
const inflationStep = 0.71545464409; // (2.5/e)^4 idk why TODO test


const splitChars = { // TODO test this
  'és': 1,
  'vagy': 1,
  's': 1
};
const splitEnds = {
  ',': 2
}
const whatToRemove = [
  ','
];

function inflation(position, size) {
  return Math.pow(inflationStep, Math.abs(position - size/2));
}

function valueOf(word) {
  for (let splitChar of Object.keys(splitChars)) {
    if (splitChar === word) return splitChars[splitChar];
  }

  for (let splitEnd of Object.keys(splitEnds)) {
    if (word.endsWith(splitEnd)) return splitEnds[splitEnd];
  }

  return -1;
}

/**
 * Returns the best choice for breaking the line
 */
function bestChoice(words, position) {

  let bestPosition = {
    score: -1,
    position: -1
  };

  // exit conditions
  if(position >= words.length) return bestPosition;


  let value = valueOf(words[position]);

  bestPosition = {
    score: value * inflation(position + 1, words.length),
    position: position
  };

  let next = bestChoice(words, position + 1);

  bestPosition = bestPosition.score > next.score ? bestPosition : next;

  return bestPosition;
}

function splitline(line) {
  let words = line.split(' ');
  let bestPosition = bestChoice(words, 0);

  return words.slice(0, bestPosition.position + 1).join(' ')
    + '|\n|'
    + words.slice(bestPosition.position + 1, words.length).join(' ').replace(/,$/g, '');
}


function getLength(lines) {
  let width = [];

  let span = document.createElement('span');
  span.id = 'hidden'
  span.style = 'visibility: hidden;';
  document.getElementById('hiddenDiv').appendChild(span);

  document.getElementById('hidden').innerHTML = lines[0];
  width[0] = document.getElementById('hidden').offsetWidth;
  document.getElementById('hidden').innerHTML = lines[1];
  width[1] = document.getElementById('hidden').offsetWidth;
  document.getElementById('hiddenDiv').innerHTML = "";

  return width;
}

module.exports = function (paragraphs) {
  return paragraphs.map(paragraph => {
    paragraph.body = paragraph.body
    .split(/.*\n.*\n/g)
    .map(line => {
      let lines = line.split('\n');

      let width = getLength(lines);


      if (width[0] > MAX_LINE_WIDTH) {
        lines[0] = splitline(lines[0]);
        if (width[1] <= MAX_LINE_WIDTH) {
          lines[1] += '\n';
        }
      }

      if (width[1] > MAX_LINE_WIDTH) {
        lines[1] = splitline(lines[1]);
        if (width[0] <= MAX_LINE_WIDTH) {
          lines[0] += '\n';
        }
      }

      return line;
    })
    .join('\n');

    return paragraphs;
  });
};
