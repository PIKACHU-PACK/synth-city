module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('message', (message) => {
      console.log(message);
      io.emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('BYEEEEEE');
    });
    //   socket.on('new-channel', channel => {
    //     socket.broadcast.emit('new-channel', channel);
    //   });
    // socket.on('eat-cookies', () => {
    //   console.log('My socket has eaten cookies!');
    // });
    // setInterval(() => {
    //   const time = new Date().toLocaleString();
    //   // console.log(time)
    //   socket.emit('time-change', time);
    // }, 1000);
  });
};
