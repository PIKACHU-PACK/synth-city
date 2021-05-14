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
  socket.emit('createRoom');
  socket.on('roomCreated', (roomId) => {
    callback(roomId);
  });
}

export function joinRoom(roomId, callback) {
  socket.emit('joinRoom', roomId, callback);
  //pass callback down, set state for other players
  socket.on('ready');
}

export function startGame(roomId) {
  socket.emit('startGame', roomId);
  socket.emit('gameStarted', roomId);
}

export function turnListener(callback, finishedCallback) {
  socket.on('yourTurn', (callback) => {
    console.log('its my turn');
  });
  socket.on('youreNext', (callback) => {
    console.log('im next');
  });
  socket.on('youreWaiting', (callback) => {
    console.log('im later');
  });
  socket.on('finished', finishedCallback);
}

export function passTurn(num, room, musicArr, musicArrStarter) {
  socket.emit('complete', num, room, musicArr, musicArrStarter);
}

export function newGame(room, users) {
  socket.emit('users', room, users);
  socket.emit('newgame', room);
}

export default socket;
