const PORT = process.env.PORT || 8080;
const app = require('./app');
const server = app.listen(PORT, () => console.log(`Rocking out on ${PORT}`));
const socketio = require('socket.io');

const init = async () => {
  try {
    const io = socketio(server, {
      pingInterval: 10000,
      pingTimeout: 600000,
    });
    require('./socket')(io);
    return server;
  } catch (ex) {
    console.log(ex);
  }
};

init();
