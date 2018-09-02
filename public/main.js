'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  const wholeMap = document.getElementsByClassName("map")[0];
  let currentDir = 'up';
  let playerHealth = 5;
  let amAlive = true;

  document.addEventListener('keydown', (event) => {
  const keyName = event.key;
    if(amAlive) {
      switch (keyName) {
      case 's':
      case 'w':
      case 'd':
      case 'a':
        handleMove(keyName);
        break;
      case ' ':
        socket.emit('bullet', {image: 'assets/enemy_bullet.svg', left: icon.style.left, top: icon.style.top, dir: currentDir, mine: false})
        onBullet({image: 'assets/friendly_bullet.svg', left: icon.style.left, top: icon.style.top, dir: currentDir, mine: true});
        break;
    }
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
    enemy.classList.remove('up', 'down', 'right', 'left');
    enemy.classList.add(data.dir);
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
        icon.classList.replace(currentDir, 'down');
        currentDir = 'down';
        break;
      case 'w':
        px_val = parseInt(icon.style.top || 0) - 1;
        icon.style.top = `${px_val}%`;
        icon.classList.replace(currentDir, 'up');
        currentDir = 'up';
        break;
      case 'd':
        px_val = parseInt(icon.style.left || 0) + 1;
        icon.style.left = `${px_val}%`;
        icon.classList.replace(currentDir, 'right');
        currentDir = 'right';
        break;
      case 'a':
        px_val = parseInt(icon.style.left || 0) - 1;
        icon.style.left = `${px_val}%`;
        icon.classList.replace(currentDir, 'left');
        currentDir = 'left';
        break;
    }
    socket.emit('move', {id: socket.id, left: icon.style.left, top: icon.style.top, dir: currentDir})
  }

  function onBullet(data) {
    const newBullet = document.createElement("img");
    newBullet.src = data.image;
    newBullet.classList.add("bullet");
    newBullet.classList.add(data.dir);
    newBullet.style.top = data.top;
    newBullet.style.left = data.left;
    wholeMap.appendChild(newBullet);

    if(data.dir === 'up' || data.dir === 'down') {
      const speed = data.dir === 'up' ? -1 : 1;
      let currentPos = parseInt(data.top);
      const currentX = parseInt(data.left);

      let motionInterval = setInterval(function() {
          currentPos += speed;
          if (currentPos < 1 || currentPos >= 99) {
            newBullet.parentNode.removeChild(newBullet);
            clearInterval(motionInterval);
          }
          const iconPosX = parseInt(icon.style.left);
          const iconPosY = parseInt(icon.style.top);
          if (!data.mine && (currentPos >= iconPosY - 10 && currentPos <= iconPosY + 10) && (currentX >= iconPosX - 10 && currentX <= iconPosX + 10)) {
            console.warn('inHitArea')
            playerHealth -= 1;
            newBullet.parentNode.removeChild(newBullet);
            clearInterval(motionInterval);
            if (playerHealth <= 0) {
              icon.parentNode.removeChild(icon);
              amAlive = false;
              socket.emit('died', null);
            }
          }
          newBullet.style.top = currentPos+"%";
      },20);
    } else {
      const speed = data.dir === 'right' ? 1 : -1;
      let currentPos = parseInt(data.left);
      const currentY = parseInt(data.top);

      let motionInterval = setInterval(function() {
          currentPos += speed;
          if (currentPos < 1 || currentPos >= 99) {
            newBullet.parentNode.removeChild(newBullet);
            clearInterval(motionInterval);
          }
          const iconPosX = parseInt(icon.style.left);
          const iconPosY = parseInt(icon.style.top);
          if (!data.mine && (currentPos >= iconPosX - 10 && currentPos <= iconPosX + 10) && (currentY >= iconPosY - 10 && currentY <= iconPosY + 10)) {
            console.warn('inHitArea')
            playerHealth -= 1;
            newBullet.parentNode.removeChild(newBullet);
            clearInterval(motionInterval);
            if (playerHealth <= 0) {
              icon.parentNode.removeChild(icon);
              amAlive = false;
              socket.emit('died', null);
            }
          }
          newBullet.style.left = currentPos+"%";
      },20);
    }
  }
})();
