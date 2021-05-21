const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnecting', () => {
      const room = socket.room;
      if (room) {
        const socketRoom = io.sockets.adapter.rooms.get(room);
        const players = [...socketRoom];
        console.log('players:', players);
        let updatedPlayers = players.map((player) => {
          if (player === socket.id) {
            player = null;
          }
          return player;
        });
        console.log('updatedPlayers:', updatedPlayers);
        io.in(room).emit('updatePlayers', updatedPlayers);
      }
    });

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('exitRoom', (room) => {
      socket.leave(room);
    });

    socket.on('chatMessage', (message, room) => {
      io.in(room).emit('chat Message', message);
    });

    socket.on('createRoom', () => {
      const room = uuidv4().slice(0, 5).toUpperCase();
      socket.join(room);
      socket.room = room;
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (roomKey) => {
      const socketRoom = io.sockets.adapter.rooms.get(roomKey);
      if (!socketRoom) {
        socket.emit('roomDoesNotExist');
      } else if (socketRoom.size < 4) {
        socket.join(roomKey);
        socket.room = roomKey;
        socket.emit('roomJoined');
        const players = [...socketRoom];
        io.in(roomKey).emit('updatePlayers', players);
      } else {
        socket.emit('roomFull');
      }
    });

    socket.on('startGame', (room) => {
      io.in(room).emit('gameStarted');
    });

    socket.on('getInfo', (room) => {
      const thisPlayer = socket.id;
      const socketRoom = io.sockets.adapter.rooms.get(socket.room);
      let players = [...socketRoom];
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

    socket.on(
      'setTurn',
      (room, notesString, gridString, rounds, turn, players) => {
        io.in(room).emit('sendSegment', notesString, gridString);
        turn++;
        if (turn === rounds) {
          io.in(room).emit('gameOver');
        } else {
          let currentTurn = turn % players.length;
          let nextPlayer = players[currentTurn];
          console.log(players);
          console.log('nextPlayer before while', nextPlayer);
          if (nextPlayer === null) {
            turn++;
            currentTurn = turn % players.length;
            nextPlayer = players[currentTurn];
            console.log('nextPlayer in while', nextPlayer);
          }
          io.in(room).emit('switchTurn', nextPlayer, turn);
        }
      }
    );
  });
};
