const PORT = process.env.PORT || 8080;
const app = require('./app');
const server = app.listen(PORT, () =>
  console.log(`Feeling chatty on port ${PORT}`)
);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);
  socket.on('chat message', ({ nickname, msg }) => {
    io.emit('chat message', { nickname, msg });
  });
  socket.on('disconnect', () => {
    console.log('BYEEEEEE');
  });
});

const init = async () => {
  try {
    return server;
  } catch (ex) {
    console.log(ex);
  }
};

init();
