// This file is required by the index.html file and will,
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer

// TODO:
//   - vertical responsiveness
//   - ...

const convert = require('./converter');
const electron = require('electron');
const file = require('./file');

/*
document.querySelector('#input').value = `<?xml version="1.0" encoding="UTF-8"?><song><title>A mennyei tábor</title><author/><copyright/><hymn_number>77</hymn_number><presentation>V1 C V2 C V3 C</presentation><ccli/><capo print="false"/><key/><aka/><key_line/><user1/><user2/><user3/><theme/><tempo/><time_sig/><lyrics>[V1]
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
  let output = convert.toIVS(input);
  document.querySelector('#output').value = output;
});
*/


document.querySelector('#fileToIVS').addEventListener('click',  () => {
  ipc.send('open-file-dialog', 'toIVS');
});
document.querySelector('#fileToOpenSong').addEventListener('click',  () => {
  ipc.send('open-file-dialog', 'toOpenSong');
});

ipc.on('selected-directory', function (event, path, mode) {
  console.log('render' + mode);
  file(path, mode);
})




//file("./testSongs");
