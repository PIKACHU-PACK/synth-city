import io from 'socket.io-client';

const socket = io(window.location.origin);

socket.on('connect', () => {
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

export function exitRoom(room) {
  socket.emit('exitRoom', room);
}

export function chatMessage(nickname, message, room) {
  socket.emit('messageSent', nickname, message, room);
}

export function chatListener(getMessages) {
  socket.on('messageReceived', (received) => {
    getMessages(received);
  });
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

export function startGame(room) {
  socket.emit('startGame', room);
}

export function passSegment(notesStr, gridStr) {
  socket.emit('passSegment', notesStr, gridStr);
}

export function endTurn(rounds, turn, players) {
  socket.emit('setTurn', rounds, turn, players);
}

export function segmentListener(getSegment) {
  socket.on('sendSegment', (notesStr, gridStr) => {
    getSegment(notesStr, gridStr);
  });
}

export function turnListener(sendTurn) {
  socket.on('switchTurn', (nextPlayer, nickname, turn) => {
    sendTurn(nextPlayer, nickname, turn);
  });
}

export function gameEndListener(revealSong) {
  socket.on('gameOver', () => {
    revealSong();
  });
}

export function waitingRoomUnmounted() {
  socket.off('info');
  socket.off('gameStarted');
  socket.off('messageReceived');
  socket.off('updatePlayers');
}

export function gameRoomUnmounted() {
  socket.off('info');
  socket.off('gameOver');
  socket.off('messageReceived');
  socket.off('switchTurn');
  socket.off('sendSegment');
  socket.off('playerLeft');
}
