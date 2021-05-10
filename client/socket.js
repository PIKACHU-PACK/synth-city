import io from 'socket.io-client';
// import store, { gotNewMessage } from './store'

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am now connected to the server!');
});

export const sendMessage = (message) => {
  socket.emit('message', message);
};
// socket.on('message', (text) => {
//   const el = document.createElement('li');
//   el.innerHTML = text;
//   document.querySelector('ul').appendChild(el);
// });

// document.getElementById('send').onclick = () => {
//   const text = document.getElementById('input').value;
//   socket.emit('message', text);
// };

// socket.on('connection', (socket) => {
//   console.log(`Connection from client ${socket.id}`);
//   setInterval(() => {
//     const time = new Date().toLocaleString();
//     console.log(time);
//     socket.emit('time-change', time);
//   }, 1000);
// });

// socket.emit('eat-cookies');

// const timeHeader = document.getElementById('time');

// socket.on('time-change', (time) => {
//   console.log(time);
//   timeHeader.innerText = time;
// });

export default socket;
