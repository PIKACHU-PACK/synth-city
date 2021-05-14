const { v4: uuidv4 } = require('uuid');
const rooms = {};
let players = [];
let currentTurn = 0;
let timeOut;
let turn = 0;
const MAX_WAITING = 3000;

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id);
  console.log('in joinRoom function', room);
};

const nextTurn = () => {
  turn = currentTurn++ % players.length;
  players[turn].emit('your turn');
  console.log('next turn triggered ', turn);
  triggerTimeout();
};

const triggerTimeout = () => {
  timeOut = setTimeout(() => {
    nextTurn();
  }, MAX_WAITING);
};

const resetTimeOut = () => {
  if (typeof timeOut === 'object') {
    console.log('timeout reset');
    clearTimeout(timeOut);
  }
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left, BYEEEEEE`);
    });

    socket.on('chat message', ({ nickname, msg }) => {
      io.emit('chat message', { nickname, msg });
    });

    socket.on('createRoom', () => {
      const room = {
        id: uuidv4().slice(0, 5).toUpperCase(),
        sockets: [],
      };
      rooms[room.id] = room;
      joinRoom(socket, room);
      console.log('backend', room);

      io.emit('roomCreated', room.id);
    });

    socket.on('joinRoom', (roomId, callback) => {
      const room = rooms[roomId];
      joinRoom(socket, room);
      callback();
    });

    socket.on('startGame', (roomId) => {
      console.log(socket.id, 'is ready');
      const room = rooms[roomId];
      // for (const client of room.sockets) {
      //   client.emit('initGame');
      // }
      let playersArr = room.sockets.map((player) => player.id);
      console.log(playersArr);
      players = room.sockets;
    });

    socket.on('gameStarted', (room, data) => {
      io.to(players[0]).emit('yourTurn', room, data);
      io.to(players[1]).emit('youreNext', room, data);
      for (let i = 1; i < players.length; i++) {
        io.to(players[i]).emit('youreWaiting', room, data);
      }
      nextTurn();
    });

    socket.on('passTurn', (room) => {
      players = room.sockets;
      if (players[turn] == socket) {
        resetTimeOut();
        nextTurn();
      }
    });

    socket.on('musicComp', (arr, room) => {
      socket.to(room).broadcast.emit('musicToState', arr);
    });
  });
};
