const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('chatMessage', (message, room) => {
      io.in(room).emit('chat Message', message);
    });

    socket.on('createRoom', () => {
      const room = uuidv4().slice(0, 5).toUpperCase();
      socket.join(room);
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (roomKey) => {
      const socketRoom = io.sockets.adapter.rooms.get(roomKey);
      if (!socketRoom) {
        socket.emit('roomDoesNotExist');
      } else if (socketRoom.size < 4) {
        socket.join(roomKey);
        socket.emit('roomJoined');
        const players = [...socketRoom];
        io.in(roomKey).emit('newPlayer', players);
      } else {
        console.log('more than 3!');
        socket.emit('roomFull');
      }
    });

    socket.on('startGame', (room) => {
      io.in(room).emit('gameStarted');
    });

    socket.on('getInfo', (room) => {
      const thisPlayer = socket.id;
      const socketRoom = io.sockets.adapter.rooms.get(room);
      const players = [...socketRoom];
      const musician = players[0];
      const rounds = players.length === 3 ? 6 : 4;
      const turn = 0;
      io.to(thisPlayer).emit('info', {
        thisPlayer,
        players,
        musician,
        rounds,
        turn,
      });
    });

    socket.on('setTurn', (room, notesString, gridString, rounds, turn) => {
      turn++;
      console.log('turn: ', turn);
      if (turn === rounds) {
        io.in(room).emit('switchTurn', notesString, gridString);
        io.in(room).emit('gameOver');
      } else {
        const socketRoom = io.sockets.adapter.rooms.get(room);
        const players = [...socketRoom];
        const currentTurn = turn % players.length;
        console.log('currentTurn:', currentTurn);
        const nextPlayer = players[currentTurn];
        console.log('nextPlayer:', nextPlayer);
        io.in(room).emit(
          'switchTurn',
          notesString,
          gridString,
          nextPlayer,
          turn
        );
      }
    });
  });
};
