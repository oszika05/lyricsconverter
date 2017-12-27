module.exports = function (msg) {
  document.querySelector('#messages').innerHTML +=
    '<div class="row"><div class="alert alert-danger col-md-12" role="alert"><strong>Hiba!</strong> '+ msg +'</div></div>';
}
