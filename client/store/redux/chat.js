import axios from 'axios';
import history from '../../history';
// import socket from './socket';

//example of socket action
// serverSocket.on('connection', (socket) => {
//   console.log(`Connection from client ${socket.id}`);
//   setInterval(() => {
//     const time = (new Date()).toLocaleString()
//    //  console.log(time)
//     socket.emit('time-change', time)
//   }, 1000)
//  });

// export const sendMessage = message => async (dispatch, getState) => {
//   message.name = getState().user
//   const { data: newMessage } = await axios.post('/api/messages', message)
//   dispatch(gotNewMessage(newMessage))
//   socket.emit('new-message', newMessage)
// }

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
