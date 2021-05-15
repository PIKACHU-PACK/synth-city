import io from 'socket.io-client';

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
  socket.on('roomCreated', (room) => {
    callback(room);
  });
}

export function joinRoom(room, callback) {
  socket.emit('joinRoom', room);
  socket.on('roomJoined', () => {
    callback(room);
  });
}

export function startGame(room) {
  socket.emit('startGame', room);
}

export function getInfo(room, callback) {
  socket.emit('getInfo', room);
  socket.on('info', (info) => {
    callback(info);
  });
}

export function startListener(callback) {
  socket.on('gameStarted', () => {
    callback();
  });
}

export function endTurn(room) {
  socket.emit('setTurn', room);
}

export function turnListener(callback, finishedCallback) {
  socket.on('switchTurn', (nextPlayer) => {
    callback(nextPlayer);
  });
}

export function passTurn(num, room, musicArr, musicArrStarter) {
  socket.emit('complete', num, room, musicArr, musicArrStarter);
}

export function newGame(room, users) {
  socket.emit('users', room, users);
  socket.emit('newgame', room);
}

export default socket;
