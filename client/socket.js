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

export function chatMessage(message, room) {
  socket.emit('chatMessage', message, room);
}

export function chatListener(getMessages) {
  socket.on('chat Message', (msg) => {
    getMessages(msg);
  });
}

export function joinRoom(
  roomKey,
  roomDoesNotExist,
  enterExistingRoom,
  roomFull
) {
  socket.emit('joinRoom', roomKey);
  socket.on('roomDoesNotExist', () => roomDoesNotExist());
  socket.on('roomJoined', () => {
    enterExistingRoom(roomKey);
  });
  socket.on('roomFull', () => {
    roomFull();
  });
}

export function startGame(room) {
  socket.emit('startGame', room);
}
// in GamePage componentDidMount - gets data from backend, then sets state
export function getInfo(room, setInfo) {
  socket.emit('getInfo', room);
  socket.on('info', (info) => {
    setInfo(info);
  });
}

export function newPlayerListener(newPlayer) {
  // socket.emit("getInfo", room);
  socket.on('newPlayer', (players) => {
    newPlayer(players);
  });
}

// in WaitingRoom componentDidMount - starts game for everyone when Start Game pressed
export function startListener(gameStarted) {
  socket.on('gameStarted', () => {
    gameStarted();
  });
}
// triggered when timer runs out on player's turn
export function endTurn(room, notesStr, gridStr) {
  //console.log("notesStr in endTurn", notesStr);
  socket.emit('setTurn', room, notesStr, gridStr);
}
// switches turns after backend hears that current player's turn ended
export function turnListener(callback) {
  socket.on('switchTurn', (nextPlayer, notesString, gridString) => {
    //console.log("notesStr in switchTrn is", notesString);
    callback(nextPlayer, notesString, gridString);
  });
}
// listens for backend that all rounds finished, then redirects to SongReveal
export function gameEndListener(callback) {
  socket.on('gameOver', () => {
    callback();
  });
}

export default socket;
