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
        const socketRoom = io.sockets.adapter.rooms.get(room);
        let players = [...socketRoom];
        let updatedPlayers = players.filter((player) => player !== socket.id);
        io.in(room).emit('updatePlayers', updatedPlayers);
      }
    });

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('exitRoom', (room) => {
      socket.leave(room);
    });

    socket.on('messageSent', (nickname, message, room) => {
      const received = { nickname: nickname, msg: message };
      io.in(room).emit('messageReceived', received);
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

    socket.on('getInfo', async () => {
      const thisPlayer = socket.id;
      const nickname = socket.nickname;
      const socketRoom = io.sockets.adapter.rooms.get(socket.room);
      let players = [...socketRoom];
      const musician = players[0];
      const sockets = await io.in(musician).fetchSockets();
      const musicianNickname = sockets[0].nickname;
      const rounds = players.length === 3 ? 6 : 4;
      const turn = 0;
      io.to(thisPlayer).emit('info', {
        thisPlayer,
        nickname,
        players,
        musician,
        musicianNickname,
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
          while (nextPlayer === null) {
            turn++;
            idx = turn % players.length;
            nextPlayer = players[idx];
          }
          const sockets = await io.in(nextPlayer).fetchSockets();
          const nickname = sockets[0].nickname;
          io.in(room).emit('switchTurn', nextPlayer, nickname, turn);
        }
      }
    );
  });
};
