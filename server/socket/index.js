const { v4: uuidv4 } = require('uuid');

const rooms = {};
// rooms = {
//          ROOM_ID: {
//                   id: ROOM_ID,
//                   players: [ SOCKET_ID, SOCKET_ID... ],
//                   turn: TURN_NUMBER,
//                   rounds: NUMBER_OF_ROUNDS
//                  }
//          }

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
      rooms[room] = { players: [socket.id], turn: 0 };

      socket.join(room);
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (room) => {
      rooms[room].players.push(socket.id);
      console.log('joined', rooms[room]);
      socket.join(room);
      socket.emit('roomJoined');
    });

    socket.on('startGame', (room) => {
      io.in(room).emit('gameStarted');
    });

    socket.on('getInfo', (room) => {
      const thisPlayer = socket.id;
      const players = rooms[room].players;
      rooms[room].rounds = players.length === 3 ? 6 : 4; // determines number of rounds for game based on number of players
      const turn = rooms[room].turn;
      io.to(thisPlayer).emit('info', {
        thisPlayer: thisPlayer,
        players: players,
        musician: rooms[room].players[turn],
      });
    });

    socket.on('setTurn', (room, notesString, gridString) => {
      rooms[room].turn++;
      if (rooms[room].turn === rooms[room].rounds) {
        // checks to see if the game should end or turns should keep switching
        io.in(room).emit('switchTurn', null, notesString, gridString);
        io.in(room).emit('gameOver');
      } else {
        const players = rooms[room].players;
        const turn = rooms[room].turn % players.length; // makes it so that turns will loop if players are meant to have two turns each
        const nextPlayer = players[turn];
        io.in(room).emit('switchTurn', nextPlayer, notesString, gridString);
      }
    });
  });
};
