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

export function createRoom(enterNewRoom) {
  socket.emit('createRoom');
  socket.on('roomCreated', (room) => {
    enterNewRoom(room);
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

export function joinGame(room, setPlayers) {
  socket.emit('joinGame', room);
  socket.on('setPlayers', (players) => {
    setPlayers(players);
  });
}

export function getPlayersListener(setPlayers, room) {
  socket.emit('getPlayers', room);
  socket.on('setPlayers', (players) => {
    setPlayers(players);
  });
}

export function getThisPlayer(setThisPlayer) {
  socket.emit('getThisPlayer');
  socket.on('playerInfo', (thisPlayer) => {
    setThisPlayer(thisPlayer);
  });
}

export function newPlayerListener(addPlayer) {
  socket.on('newPlayer', (newPlayer) => {
    addPlayer(newPlayer);
  });
}

export function exitRoom(room) {
  socket.emit('exitRoom', room);
}

export function exitWaiting(room) {
  socket.emit('exitWaiting', room);
}

export function chatMessage(room, nickname, message) {
  console.log('chatMes', nickname, message);
  socket.emit('messageSent', room, nickname, message);
}

export function chatListener(getMessage) {
  socket.on('messageReceived', (received) => {
    console.log('in messageRecieved', received);
    getMessage(received);
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
  socket.off('newPlayer');
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
