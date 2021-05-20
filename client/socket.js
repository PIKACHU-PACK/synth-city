import io from "socket.io-client";

const socket = io(window.location.origin);

socket.on("connect", () => {
  setInterval(() => {
    socket.emit("ping");
  }, 15 * 1000);
});

socket.on("disconnect", () => {
  console.log(`${socket.id} Connection has Ended`);
});

export function createRoom(callback) {
  socket.emit("createRoom");
  socket.on("roomCreated", (room) => {
    callback(room);
  });
}

export function chatMessage(message, room) {
  socket.emit("chatMessage", message, room);
}

export function joinRoom(room, callback) {
  socket.emit("joinRoom", room);
  socket.on("roomJoined", () => {
    callback(room);
  });
}

export function startGame(room) {
  socket.emit("startGame", room);
}
// in GamePage componentDidMount - gets data from backend, then sets state
export function getInfo(room, callback) {
  socket.emit("getInfo", room);
  socket.on("info", (info) => {
    callback(info);
  });
}

export function newPlayerListener(callback) {
  // socket.emit("getInfo", room);
  socket.on("newPlayer", (players) => {
    callback(players);
  });
}

// in WaitingRoom componentDidMount - starts game for everyone when Start Game pressed
export function startListener(callback) {
  socket.on("gameStarted", () => {
    callback();
  });
}
// triggered when timer runs out on player's turn
export function endTurn(room, notesStr, gridStr) {
  //console.log("notesStr in endTurn", notesStr);
  socket.emit("setTurn", room, notesStr, gridStr);
}
// switches turns after backend hears that current player's turn ended
export function turnListener(callback) {
  socket.on("switchTurn", (nextPlayer, notesString, gridString) => {
    //console.log("notesStr in switchTrn is", notesString);
    callback(nextPlayer, notesString, gridString);
  });
}
// listens for backend that all rounds finished, then redirects to SongReveal
export function gameEndListener(callback) {
  socket.on("gameOver", () => {
    callback();
  });
}

export default socket;
