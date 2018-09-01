'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  const wholeMap = document.getElementsByClassName("map")[0];

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
  socket.emit('move', {id: socket.id, left: icon.style.left, top: icon.style.top})
});

  socket.on('move', onMove);
  socket.on('create', onCreate);
  socket.on('connect', () => socket.emit('create', {id: socket.id}))

  function onMove(data) {
    let enemy = document.getElementById(data.id);
    if(!enemy) onCreate({id: data.id});
    enemy = document.getElementById(data.id);
    enemy.style.left = data.left;
    enemy.style.top = data.top;
  }

  function onCreate(data) {
    const newIcon = document.createElement("img");
    newIcon.classList.add("enemy");
    newIcon.id = data.id;
    newIcon.src = "tank.svg";
    wholeMap.appendChild(newIcon);
  }
})();
