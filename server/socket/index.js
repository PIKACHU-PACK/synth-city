const { v4: uuidv4 } = require('uuid');
const { getPlayerNames, nicknames } = require('../nicknames');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('disconnecting', async () => {
      try {
        const page = socket.page || null;
        const room = socket.room;
        socket.room = null;
        socket.page = null;
        if (room) {
          if (page === 'game') {
            io.in(room).emit('playerLeft', socket.id);
          } else {
            const sockets = await io.in(room).fetchSockets();
            const players = sockets
              .filter((player) => {
                return player.id !== socket.id;
              })
              .map((player) => {
                return { id: player.id, nickname: player.nickname };
              });
            io.in(room).emit('setPlayers', players);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('exitRoom', (room) => {
      socket.leave(room);
      socket.room = null;
      socket.nickname = null;
      socket.page = null;
    });

    socket.on('exitWaiting', async (room) => {
      try {
        socket.leave(room);
        socket.room = null;
        const sockets = await io.in(room).fetchSockets();
        const players = sockets.map((socket) => {
          return { id: socket.id, nickname: socket.nickname };
        });
        io.in(room).emit('setPlayers', players);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('messageSent', (room, nickname, message) => {
      const received = { nickname: nickname, msg: message };
      io.in(room).emit('messageReceived', received);
    });

    socket.on('createRoom', () => {
      const room = uuidv4().slice(0, 5).toUpperCase();
      socket.emit('roomCreated', room);
    });

    socket.on('joinRoom', (roomKey) => {
      const socketRoom = io.sockets.adapter.rooms.get(roomKey);
      if (!socketRoom) {
        socket.emit('roomDoesNotExist');
      } else if (socketRoom.size < 4) {
        socket.emit('roomJoined', roomKey);
      } else {
        socket.emit('roomFull');
      }
    });

    socket.on('joinGame', async (room) => {
      try {
        socket.nickname = getPlayerNames(nicknames);
        let sockets = await io.in(room).fetchSockets();
        const inGame = sockets.some((player) => {
          if (player === null) {
            return true;
          } else if (player.page === 'game' || player.page === 'song') {
            return true;
          }
        });
        if (!inGame) {
          socket.join(room);
          socket.room = room;
          sockets = await io.in(room).fetchSockets();
          const players = sockets.map((socket) => {
            return { id: socket.id, nickname: socket.nickname };
          });
          io.in(room).emit('setPlayers', players);
        } else {
          socket.emit('kickOut');
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('getThisPlayer', () => {
      socket.emit('playerInfo', { id: socket.id, nickname: socket.nickname });
    });

    socket.on('startGame', async (room) => {
      try {
        const sockets = await io.in(room).fetchSockets();
        sockets.forEach((socket) => {
          socket.page = 'game';
        });
        const rounds = sockets.length === 3 ? 6 : 4;
        io.in(room).emit('gameStarted', rounds);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('passSegment', (room, notesString, gridString) => {
      io.in(room).emit('sendSegment', notesString, gridString);
    });

    socket.on('endTurn', (room) => {
      io.in(room).emit('switchTurn');
    });

    socket.on('socketPageSong', () => {
      socket.page = 'song';
    });
  });
};
