'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  const wholeMap = document.getElementsByClassName("map")[0];
  let currentDeg = 90;
  let playerHealth = 5;
  let amAlive = true;
  let playerTop = 0;
  let playerLeft = 0;
  let isFrozen = true;

  // Have the plane always moving
  let playerMovement = setInterval(function() {
      const planeSpeed = 5;
      if(playerHealth <= 0) {
        icon.parentNode.removeChild(icon);
        amAlive = false;
        socket.emit('died', null);
        clearInterval(playerMovement);
      }

      if(!isFrozen){
        playerLeft += planeSpeed * Math.sin(toRadians(currentDeg));
        playerTop -= planeSpeed * Math.cos(toRadians(currentDeg));
        icon.style.left = `${playerLeft}px`;
        icon.style.top = `${playerTop}px`;
      }
  },20);


  document.addEventListener('keydown', (event) => {
  const keyName = event.key;
    if(amAlive) {
      switch (keyName) {
      case 'h':
      case 'f':
        handleTurn(keyName);
        break;
      case 'g':
        isFrozen = !isFrozen;
        break;
      case ' ':
        socket.emit('bullet', {image: 'assets/enemy_bullet.svg', left: playerLeft, top: playerTop, degree: currentDeg, mine: false})
        onBullet({image: 'assets/friendly_bullet.svg', left: playerLeft, top: playerTop, degree: currentDeg, mine: true});
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

  function handleTurn(keyName) {
    switch (keyName) {
      case 'h':
        currentDeg += 4;
        icon.style.transform = `rotate(${currentDeg}deg)`;
        icon.style.webkitTransform = `rotate(${currentDeg}deg)`;
        break;
      case 'f':
        currentDeg -= 4;
        icon.style.transform = `rotate(${currentDeg}deg)`;
        icon.style.webkitTransform = `rotate(${currentDeg}deg)`;
        break;
    }
  }

  function onBullet(data) {
    const newBullet = document.createElement("img");
    newBullet.src = data.image;
    newBullet.classList.add("bullet");
    newBullet.style.transform = `rotate(${data.degree}deg)`;
    newBullet.style.webkitTransform = `rotate(${data.degree}deg)`;
    newBullet.style.top = data.top;
    newBullet.style.left = data.left;
    wholeMap.appendChild(newBullet);
    

    const bulletDiffLeft = 10 * Math.sin(toRadians(data.degree));
    const bulletDiffTop = 10 * Math.cos(toRadians(data.degree));
    let bulletTop = data.top;
    let bulletLeft = data.left;

    let motionInterval = setInterval(function() {
      bulletLeft += bulletDiffLeft;
      bulletTop -= bulletDiffTop;
      // if (currentPos < 1 || currentPos >= 99) {
      //   newBullet.parentNode.removeChild(newBullet);
      //   clearInterval(motionInterval);
      // }

      if (!data.mine) {
        playerHealth -= 1;
        newBullet.parentNode.removeChild(newBullet);
        clearInterval(motionInterval);
        if (playerHealth <= 0) {
          icon.parentNode.removeChild(icon);
          amAlive = false;
          socket.emit('died', null);
        }
      }
      newBullet.style.top = bulletTop+"px";
      newBullet.style.left = bulletLeft+"px";
    },20);
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

})();
