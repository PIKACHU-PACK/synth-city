const { v4: uuidv4 } = require('uuid');
const rooms = {};

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id);
  console.log('in joinRoom function', room);
  // socket.join(room.id, () => {
  //   socket.roomId = room.id;
  //   console.log(socket.id, 'Joined', room.id);
  // });
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

    socket.on('ready', () => {
      console.log(socket.id, 'is ready');
      const room = rooms[socket.roomId];
      if (room.sockets.length >= 2 && room.sockets.length <= 4) {
        for (const client of room.sockets) {
          client.emit('initGame');
        }
      }
    });

    socket.on('musicComp', (arr, room) => {
      socket.to(room).broadcast.emit('musicToState', arr);
    });
  });
};
