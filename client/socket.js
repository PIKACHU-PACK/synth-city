import io from 'socket.io-client';
// import store, { gotNewMessage } from './store'

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am now connected to the server!');

  setInterval(() => {
    socket.emit('ping');
  }, 15 * 1000);
});

socket.on('disconnect', () => {
  console.log(`${socket.id} Connection has Ended`);
});

export function createRoom(callback) {
  socket.emit('createRoom', callback);
  // socket.on('createRoom', callback);
}

export function joinRoom(roomId, callback) {
  socket.emit('joinRoom', roomId, callback);
  socket.on('ready');
}

export default socket;
