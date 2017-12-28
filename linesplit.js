function splitLine(line) {
  if(line.contains(',')) {
    return line.split(',').join('\n');
  }
}

module.exports = function (paragraphs) {
  return paragraphs.map(paragraph => {
    paragraph.body = paragraph.body
    .split(/.*\n.*\n/g)
    .map(line => {
      let lines = line.split('\n');
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
