const PORT = process.env.PORT || 8080;
const app = require('./app');
const server = app.listen(PORT, () =>
  console.log(`Feeling chatty on port ${PORT}`)
);
const io = require('socket.io')(server);

require('./socket')(io);

const init = async () => {
  try {
    return server;
  } catch (ex) {
    console.log(ex);
  }
};

init();
