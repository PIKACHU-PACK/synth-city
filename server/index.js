const PORT = process.env.PORT || 8080;
const app = require('./app');
const server = app.listen(PORT, () => console.log(`Rocking out ${PORT}`));
const socketio = require('socket.io');

const init = async () => {
  try {
    const io = socketio(server, {
      pingInterval: 10000,
      pingTimeout: 600000, //10 minutes
    });
    require('./socket')(io);
    return server;
  } catch (ex) {
    console.log(ex);
  }
};

init();
