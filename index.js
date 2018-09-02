const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('./public'));

function onConnection(socket){
  socket.on('move', (data) => socket.broadcast.emit('move', data));
  socket.on('create', (data) => socket.broadcast.emit('create', data));
  socket.on('disconnect', (data) => socket.broadcast.emit('delete', socket.id));
  socket.on('died', (data) => socket.broadcast.emit('delete', socket.id))
  socket.on('bullet', (data) => socket.broadcast.emit('bullet', data));
}

io.on('connect', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
