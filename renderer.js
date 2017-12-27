// This file is required by the index.html file and will,
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// TODO:
//   - vertical responsiveness
//   - ...

function error (msg) {
  document.querySelector('#messages').innerHTML +=
    '<div class="row"><div class="alert alert-danger col-md-12" role="alert"><strong>Teringettét!</strong> '+ msg +'</div></div>';
}

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

  if (song.getElementsByTagName('presentation').length === 0) {
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

document.querySelector('#input').value = `<song><title>A mennyei tábor</title><author/><copyright/><hymn_number>77</hymn_number><presentation>V1 C V2 C V3 C</presentation><ccli/><capo print="false"/><key/><aka/><key_line/><user1/><user2/><user3/><theme/><tempo/><time_sig/><lyrics>[V1]
 A mennyei tábor ma mellettünk áll,
 a harcban a győztes az Úr!
 A gonoszság bástyája porba száll,
 a harcban a győztes az Úr!
[C]
 És mi áldunk, magasztalunk,
 dicsérjük szent Neved!
 Mert Te jó vagy, irgalmas,
 megtartod népedet!
[V2]
 Ha gyűlölet ádázul rád tör, mint szélvész,
 a harcban a győztes az Úr!
 egy ellened készült fegyver sem szerencsés,
 a harcban a győztes az Úr!
[V3]
 Ha ellenség gúnyol, szidalmaz és vádol,
 a harcban a győztes az Úr!
 az oroszlán szája egyszercsak bezárul,
 a harcban a győztes az Úr!
 </lyrics></song>`;

document.querySelector('#convertbutton').addEventListener('click',  () => {
  document.querySelector('#messages').innerHTML = "";
  let input = document.querySelector('#input').value;
  //console.log(input);
  let output = convert(input);
  document.querySelector('#output').value = output;
});
