const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('./public'));

function onConnection(socket){
  console.warn('connected')
  console.warn(socket)
  socket.on('repeat', (word) => socket.broadcast.emit('repeat', word));
}

io.on('connect', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
