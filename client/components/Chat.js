import React from 'react';
import socket from '../socket';
import io from 'socket.io-client';
import sendMessage from '../socket';
// socket.on('message', (text) => {
//   const el = document.createElement('li');
//   el.innerHTML = text;
//   document.querySelector('ul').appendChild(el);
// });

// document.getElementById('send').onclick = () => {
//   const text = document.getElementById('input').value;
//   socket.emit('message', text);
// };

// export default function Chat() {
//   return (
//     <div>
//       <ul></ul>
//       <input placeholder="message" id="input"></input>
//       <button id="send">Send</button>
//     </div>
//   );

class Chat extends React.Component {
  // Add constructor to initiate
  constructor() {
    super();
    this.state = { msg: '', chat: [] };
    this.onTextChange = this.onTextChange.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  componentDidMount() {
    socket.on('chat message', ({ msg }) => {
      this.setState({
        chat: [...this.state.chat, { msg }],
      });
    });
  }
  // Function for getting text input
  onTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ msg }, idx) => (
      <div key={idx}>
        <span style={{ color: 'green' }}> </span>

        <span>{msg}</span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <span>Message</span>
        <input
          name="msg"
          onChange={(e) => this.onTextChange(e)}
          value={this.state.msg}
        />
        <button onClick={sendMessage}>Send</button>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default Chat;
