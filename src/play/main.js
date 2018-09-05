'use strict';

(function() {

  var socket = io();

  const icon = document.getElementsByClassName("icon")[0];
  const wholeMap = document.getElementsByClassName("map")[0];
  const TURNING_LEFT = -1;
  const TURNING_RIGHT = 1;
  let justFired = false;
  let turning = 0;
  let currentDeg = 90;
  let playerHealth = 5;
  let amAlive = true;
  let playerTop = window.innerHeight/2;
  let playerLeft =  window.innerWidth/2;
  icon.style.top = playerTop+'px';
  icon.style.left = playerLeft+'px';
  icon.style.transform = `rotate(${currentDeg}deg)`;
  icon.style.webkitTransform = `rotate(${currentDeg}deg)`;
  let isFrozen = true;

  // Have the plane always moving
  let playerMovement = setInterval(function() {
      const planeSpeed = 5;
      if(playerHealth <= 0) {
        icon.parentNode.removeChild(icon);
        amAlive = false;
        socket.emit('died', null);
        // show you died element
        const deathElement = document.getElementById('died');
        let deathOpacity = 0;
        let youDiedInterval = setInterval(function() {
          deathOpacity += .01;
          deathElement.style.opacity = deathOpacity;
          if(deathOpacity >= 1) {
            clearInterval(youDiedInterval);
          }
          console.log('showing more');
        },40);
        clearInterval(playerMovement);
      }

      if(turning === TURNING_RIGHT) {
        currentDeg += 4;
        icon.style.transform = `rotate(${currentDeg}deg)`;
        icon.style.webkitTransform = `rotate(${currentDeg}deg)`;
      } else if (turning === TURNING_LEFT) {
        currentDeg -= 4;
        icon.style.transform = `rotate(${currentDeg}deg)`;
        icon.style.webkitTransform = `rotate(${currentDeg}deg)`;
      }

      if(!isFrozen){
        playerLeft += planeSpeed * Math.sin(toRadians(currentDeg));
        playerTop -= planeSpeed * Math.cos(toRadians(currentDeg));
        icon.style.left = `${playerLeft}px`;
        icon.style.top = `${playerTop}px`;
        socket.emit('move', {id: socket.id, left: playerLeft+"px", top: playerTop+"px", degree: currentDeg});
      }
  },20);

  document.addEventListener('keyup', (event) => {
    const keyName = event.key;
      if(amAlive) {
        switch (keyName) {
          case 'h':
            turning = 0;
            break;
          case 'f':
            turning = 0;
            break;
        }
      }
  });

  document.addEventListener('keydown', (event) => {
  const keyName = event.key;
    if(amAlive) {
      switch (keyName) {
        case 'h':
          turning = TURNING_RIGHT;
          break;
        case 'f':
          turning = TURNING_LEFT;
          break;
        case 'g':
          isFrozen = !isFrozen;
          break;
        case ' ':
          if(!justFired) {
            console.warn('just fired', justFired)
            socket.emit('bullet', {image: 'assets/enemy_bullet.svg', left: playerLeft, top: playerTop, degree: currentDeg, mine: false})
            onBullet({image: 'assets/friendly_bullet.svg', left: playerLeft, top: playerTop, degree: currentDeg, mine: true});
            justFired = true;
            setTimeout(function() {
              justFired = false;
            }, 400)
          }
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
    enemy.style.webkitTransform = `rotate(${data.degree}deg)`;
    enemy.style.transform = `rotate(${data.degree}deg)`;
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

  function onBullet(data) {
    const newBullet = document.createElement("img");
    newBullet.src = data.image;
    newBullet.classList.add("bullet");
    newBullet.style.top = data.top;
    newBullet.style.left = data.left;
    newBullet.style.transform = `rotate(${data.degree}deg)`;
    newBullet.style.webkitTransform = `rotate(${data.degree}deg)`;
    wholeMap.appendChild(newBullet);

    const bulletDiffLeft = 10 * Math.sin(toRadians(data.degree));
    const bulletDiffTop = 10 * Math.cos(toRadians(data.degree));
    let bulletTop = data.top;
    let bulletLeft = data.left;

    let motionInterval = setInterval(function() {
      bulletLeft += bulletDiffLeft;
      bulletTop -= bulletDiffTop;
      if (bulletTop <= 0 || bulletTop >= window.innerHeight || bulletLeft <= 0 || bulletLeft >= window.innerWidth) {
        newBullet.parentNode.removeChild(newBullet);
        clearInterval(motionInterval);
        console.warn('killedBullet');
      }

      if (!data.mine && (playerTop + 20 >= bulletTop && playerTop - 20 <= bulletTop) && (playerLeft + 20 >= bulletLeft && playerLeft - 20 <= bulletLeft)) {
        playerHealth -= 1;
        wholeMap.removeChild(newBullet);
        console.warn('here');
        if (playerHealth <= 0) {
          playerTop = 0;
          playerLeft = 0;
          amAlive = false;
          socket.emit('died', null);
        }
        clearInterval(motionInterval);
      }
      newBullet.style.top = bulletTop+"px";
      newBullet.style.left = bulletLeft+"px";
    },20);
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

})();
