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

    socket.on('disconnecting', async () => {
      const room = socket.room;
      socket.room = null;
      if (room) {
        //io.in(room).emit('playerLeft', socket.id);
        const sockets = await io.in(room).fetchSockets();
        const players = sockets.filter((player) => {
          return player.id !== socket.id;
        });
        const updatedPlayers = players.map((player) => {
          return { id: player.id, nickname: player.nickname };
        });
        //let updatedPlayers = players.filter((player) => player !== socket.id);
        io.in(room).emit('setPlayers', updatedPlayers);
      }
    });

    socket.on('disconnect', () => {
      console.log(`BYEEEEEE ${socket.id}`);
    });

    socket.on('exitRoom', (room) => {
      socket.leave(room);
    });

    socket.on('exitWaiting', async (room) => {
      socket.leave(room);
      socket.room = null;
      const sockets = await io.in(room).fetchSockets();
      const players = sockets.map((socket) => {
        return { id: socket.id, nickname: socket.nickname };
      });
      io.in(room).emit('setPlayers', players);
    });

    socket.on('messageSent', (room, nickname, message) => {
      const received = { nickname: nickname, msg: message };
      console.log('received', received);
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
        socket.emit('roomJoined');
      } else {
        socket.emit('roomFull');
      }
    });

    socket.on('joinGame', async (room) => {
      socket.join(room);
      socket.room = room;
      socket.nickname = getPlayerNames(nicknames);
      const sockets = await io.in(room).fetchSockets();
      const players = sockets.map((socket) => {
        return { id: socket.id, nickname: socket.nickname };
      });
      io.in(room).emit('setPlayers', players);
    });

    socket.on('getThisPlayer', () => {
      socket.emit('playerInfo', { id: socket.id, nickname: socket.nickname });
    });

    socket.on('startGame', (room) => {
      const socketRoom = io.sockets.adapter.rooms.get(socket.room);
      let players = [...socketRoom];
      const rounds = players.length === 3 ? 6 : 4;
      io.in(room).emit('gameStarted', rounds);
    });

    socket.on('passSegment', (room, notesString, gridString) => {
      io.in(room).emit('sendSegment', notesString, gridString);
    });

    socket.on('endTurn', async (room, rounds, turn, players) => {
      io.in(room).emit('switchTurn');
    });
  });
};
