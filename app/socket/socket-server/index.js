const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const websocketOrigin = `https://converse.socian.ai:3500`
// const websocketOrigin = `http://localhost:3000`

const io = new Server(server, {
  cors: {
    origin: websocketOrigin,
    methods: ["GET", "POST"]
  }
});

function handleSocketEvent(socket, io, msg) {
  io.emit(msg.socket.eventPrivateKey, msg.data);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });


  socket.on('conversation:updated', (msg) => {
    handleSocketEvent(socket, io, msg)
  });

  socket.on('message:updated', (msg) => {
    handleSocketEvent(socket, io, msg)
  });

  socket.on('agent:task:assigned', (msg) => {
    handleSocketEvent(socket, io, msg)
  });

  socket.on('agent:task:closed', (msg) => {
    console.log(`agent:task:closed`, msg.socket)
    handleSocketEvent(socket, io, msg)
  });

});

const port = 4000

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
