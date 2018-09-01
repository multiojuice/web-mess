'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  icon.style.top = "0px";
  icon.style.left = "0px";

  document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  let px_val;
  switch (keyName) {
    case 's':
      px_val = parseInt(icon.style.top || 0) + 1;
      icon.style.top = `${px_val}%`;
      break;
    case 'w':
      px_val = parseInt(icon.style.top || 0) - 1;
      icon.style.top = `${px_val}%`;
      break;
    case 'd':
      px_val = parseInt(icon.style.left || 0) + 1;
      icon.style.left = `${px_val}%`;
      break;
    case 'a':
      px_val = parseInt(icon.style.left || 0) - 1;
      icon.style.left = `${px_val}%`;
      break;
  }
  socket.emit('move', {id: 'enemy', left: icon.style.left, top: icon.style.top})
});

  socket.on('move', onMove);

  function onMove(data) {
    const enemy = document.getElementsByClassName(data.id)[0];
    enemy.style.left = data.left;
    enemy.style.top = data.top;
  }

})();
