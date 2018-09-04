'use strict';

const parentRow = document.getElementById('parent-row');
let rowOpacity = 1;

document.getElementById('play').onclick = function() {
  let fadeInterval = setInterval(function() {
    rowOpacity -= .05;
    parentRow.style.opacity = rowOpacity;
    if(rowOpacity <= 0) {
      clearInterval(fadeInterval);
      window.location.replace('/play');
    }
  },20);
}
