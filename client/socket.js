import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('connect', () => {
  //console.log("I am now connected to the server!");
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

export function exitRoom(room) {
  socket.emit('exitRoom', room);
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

export function getInfo(room, infoState) {
  socket.emit('getInfo', room);
  socket.on('info', (info) => {
    infoState(info);
  });
}

export function updatePlayersListener(updatePlayers) {
  socket.on('updatePlayers', (players) => {
    updatePlayers(players);
  });
}

export function playerLeftListener(playerLeft) {
  socket.on('playerLeft', (departedPlayer) => {
    playerLeft(departedPlayer);
  });
}

export function startListener(gameStarted) {
  socket.on('gameStarted', () => {
    gameStarted();
  });
}

export function endTurn(room, notesStr, gridStr, rounds, turn, players) {
  socket.emit('setTurn', room, notesStr, gridStr, rounds, turn, players);
}

export function segmentListener(getSegment) {
  socket.on('sendSegment', (notesStr, gridStr) => {
    getSegment(notesStr, gridStr);
  });
}

export function turnListener(sendTurn) {
  socket.on('switchTurn', (nextPlayer, turn) => {
    sendTurn(nextPlayer, turn);
  });
}

export function gameEndListener(revealSong) {
  socket.on('gameOver', () => {
    revealSong();
  });
}
