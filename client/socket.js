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

export function getThisPlayer(setThisPlayer) {
  socket.emit('getThisPlayer');
  socket.on('playerInfo', (thisPlayer) => {
    setThisPlayer(thisPlayer);
  });
}

export function exitRoom(room) {
  socket.emit('exitRoom', room);
}

export function exitWaiting(room) {
  socket.emit('exitWaiting', room);
}

export function chatMessage(room, nickname, message) {
  socket.emit('messageSent', room, nickname, message);
}

export function chatListener(getMessage) {
  socket.on('messageReceived', (received) => {
    getMessage(received);
  });
}

export function playerLeftListener(playerLeft) {
  socket.on('playerLeft', (departedPlayer) => {
    playerLeft(departedPlayer);
  });
}

export function kickOutListener(sendHome) {
  socket.on('kickOut', () => {
    sendHome();
  });
}

export function startListener(gameStarted) {
  socket.on('gameStarted', (rounds) => {
    gameStarted(rounds);
  });
}

export function startGame(room) {
  socket.emit('startGame', room);
}

export function passSegment(room, notesStr, gridStr) {
  socket.emit('passSegment', room, notesStr, gridStr);
}

export function endTurn(room, rounds, turn, players) {
  socket.emit('endTurn', room, rounds, turn, players);
}

export function segmentListener(getSegment) {
  socket.on('sendSegment', (notesStr, gridStr) => {
    getSegment(notesStr, gridStr);
  });
}

export function turnListener(setTurn) {
  socket.on('switchTurn', () => {
    setTurn();
  });
}

export function environmnetUnmount() {
  socket.off('setPlayers');
  socket.off('playerInfo');
  socket.off('messageReceived');
  socket.off('playerLeft');
  socket.off('kickOut');
  socket.off('gameStarted');
  socket.off('sendSegment');
  socket.off('switchTurn');
}
