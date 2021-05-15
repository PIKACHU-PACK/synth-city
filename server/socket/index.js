const { v4: uuidv4 } = require('uuid');
const rooms = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('chat message', ({ nickname, msg }) => {
      io.emit('chat message', { nickname, msg });
    });

    socket.on('createRoom', () => {
      const room = uuidv4().slice(0, 5).toUpperCase();
      rooms[room] = { players: [socket.id], turn: 0 };
      socket.join(room);
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (room) => {
      rooms[room].players.push(socket.id);
      socket.join(room);
      socket.emit('roomJoined');
    });

    socket.on('startGame', (room) => {
      io.in(room).emit('gameStarted');
    });

    socket.on('getInfo', (room) => {
      const thisPlayer = socket.id;
      const players = rooms[room].players;
      const turn = rooms[room].turn;
      io.to(thisPlayer).emit('info', {
        thisPlayer: thisPlayer,
        players: players,
        musician: rooms[room].players[turn],
      });
    });

    socket.on('setTurn', (room) => {
      rooms[room].turn++;
      const turn = rooms[room].turn;
      const nextPlayer = rooms[room].players[turn];
      io.in(room).emit('switchTurn', nextPlayer);
    });

    socket.on('complete', (num, room, musicArr, musicArrStarter) => {
      io.in(room).emit('finishTurn', musicArr, musicArrStarter, num);
      resetTimeOut();
      nextTurn();

      if (room.sockets.length === 2) {
        if (num === 4) {
          io.in(room).emit('finished');
        }
      }
      if (room.sockets.length === 3) {
        if (num === 6) {
          io.in(room).emit('finished');
        }
      }
      if (room.sockets.length === 4) {
        if (num === 8) {
          io.in(room).emit('finished');
        }
      }
    });
  });
};
