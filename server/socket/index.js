const { v4: uuidv4 } = require('uuid');
const rooms = {};
let timeOut;
const TURN_DURATION = 3000;

const nextTurn = () => {
  turn = currentTurn++ % players.length;
  players[turn].emit('yourTurn');
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
      const room = uuidv4().slice(0, 5).toUpperCase();
      rooms[room] = { players: [socket.id], turn: 0 };
      socket.join(room);
      // console.log('WOWOWOWOWOW', socket, 'WOWOWOWOWOW');
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
      // console.log('NOW?', players);
      io.to(thisPlayer).emit('info', {
        thisPlayer: thisPlayer,
        players: players,
      });
    });

    socket.on('setTurn', (room, data) => {
      const turn = rooms[room].turn;
      const nextPlayer = rooms[room].players[turn];
      io.in(room).emit('switchTurn', nextPlayer);
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
