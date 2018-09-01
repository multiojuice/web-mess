'use strict';

(function() {

  var socket = io();

  // canvas.addEventListener('mousedown', onMouseDown, false);
  // canvas.addEventListener('mouseup', onMouseUp, false);
  // canvas.addEventListener('mouseout', onMouseUp, false);
  // canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  const repeat_area = document.getElementsByClassName("repeat-class")[0];
  const input_area = document.getElementsByClassName("input-area")[0];
  input_area.addEventListener('change', onChange)

  // socket.on('drawing', onDrawingEvent);
  socket.on('repeat', onRepeat);

  function onChange() {
    console.log('Change')
    console.log(input_area.value)
    socket.emit('repeat', {word: input_area.value})
  }

  function onRepeat(word) {
    console.warn(word);
    console.warn('here')
    repeat_area.innerHTML = word.word;
  }

})();
