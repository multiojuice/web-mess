'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  const wholeMap = document.getElementsByClassName("map")[0];

  document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  switch (keyName) {
    case 's':
    case 'w':
    case 'd':
    case 'a':
      handleMove(keyName);
      break;
    case ' ':
      socket.emit('bullet', {image: 'assets/enemy_bullet.svg', left: icon.style.left, top: icon.style.top})
      onBullet({image: 'assets/friendly_bullet.svg', left: icon.style.left, top: icon.style.top});
      break;
  }
});

  socket.on('move', onMove);
  socket.on('create', onCreate);
  socket.on('connect', () => socket.emit('create', {id: socket.id}))
  socket.on('delete', onDelete);
  socket.on('bullet', onBullet)

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
    newIcon.src = "assets/enemy_plane.svg";
    wholeMap.appendChild(newIcon);
  }

  function onDelete(id) {
    const deletedPlayer = document.getElementById(id);
    if(deletedPlayer) deletedPlayer.parentNode.removeChild(deletedPlayer);
  }

  function handleMove(keyName) {
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
  }

  function onBullet(data) {
    const newBullet = document.createElement("img");
    newBullet.src = data.image;
    newBullet.classList.add("bullet");
    newBullet.style.top = data.top;
    newBullet.style.left = data.left;
    wholeMap.appendChild(newBullet);
    let currentPos = parseInt(data.left);

    let motionInterval = setInterval(function() {
        currentPos += 1;
        if (currentPos < 1 || currentPos >= 99) {
          newBullet.parentNode.removeChild(newBullet);
          clearInterval(motionInterval);
        }
        newBullet.style.left = currentPos+"%";
    },20);
  }
})();
