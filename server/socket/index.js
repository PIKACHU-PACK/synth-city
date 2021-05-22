const { v4: uuidv4 } = require('uuid');
const {
  getPlayerNames,
  professionalNicknames,
  funNicknames,
} = require('../nicknames');
const nicknames = professionalNicknames;

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnecting', () => {
      const room = socket.room;
      if (room) {
        io.in(room).emit('playerLeft', socket.id);
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
      socket.nickname = getPlayerNames(nicknames);
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (roomKey) => {
      const socketRoom = io.sockets.adapter.rooms.get(roomKey);
      if (!socketRoom) {
        socket.emit('roomDoesNotExist');
      } else if (socketRoom.size < 4) {
        socket.join(roomKey);
        socket.room = roomKey;
        socket.nickname = getPlayerNames(nicknames);
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

    socket.on('getInfo', async (room) => {
      const thisPlayer = socket.id;
      const socketRoom = io.sockets.adapter.rooms.get(socket.room);
      let players = [...socketRoom];
      const musician = players[0];
      const sockets = await io.in(musician).fetchSockets();
      const nickname = sockets[0].nickname;
      const rounds = players.length === 3 ? 6 : 4;
      const turn = 0;
      io.to(thisPlayer).emit('info', {
        thisPlayer,
        players,
        musician,
        nickname,
        rounds,
        turn,
      });
    });

    socket.on(
      'setTurn',
      async (room, notesString, gridString, rounds, turn, players) => {
        io.in(room).emit('sendSegment', notesString, gridString);
        turn++;
        if (turn === rounds) {
          io.in(room).emit('gameOver');
        } else {
          let idx = turn % players.length;
          let nextPlayer = players[idx];
          console.log(players);
          console.log('nextPlayer before while', nextPlayer);
          while (nextPlayer === null) {
            turn++;
            idx = turn % players.length;
            nextPlayer = players[idx];
            console.log('nextPlayer in while', nextPlayer);
          }
          const sockets = await io.in(nextPlayer).fetchSockets();
          const nickname = sockets[0].nickname;
          io.in(room).emit('switchTurn', nextPlayer, nickname, turn);
        }
      }
    );
  });
};
