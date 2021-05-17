import React from 'react';
import io from 'socket.io-client';
import { chatMessage } from '../socket';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = { msg: '', chat: [] };
    this.onTextChange = this.onTextChange.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.renderChat = this.renderChat.bind(this);
  }

  onTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onMessageSubmit() {
    const { msg } = this.state;
    const room = this.props.match.params.roomId;
    chatMessage(msg, room);
    this.setState({ msg: '' });
  }

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ msg }, idx) => (
      <div key={idx}>
        <span></span>

        <span>{msg}</span>
      </div>
    ));
  }

  render() {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-button"></div>
          <div className="chat-button"></div>
          <div className="chat-button"></div>
        </div>

        <div className="chat-messages">
          <div id="messages"></div>
          <i id="typing"></i>
        </div>
        <form className="input-container" id="message-form">
          <input
            id="message"
            className="message-input"
            placeholder="Type something uwu"
          />
          <button
            className="message-submit"
            onSubmit={this.onMessageSubmit}
          ></button>
        </form>
      </div>
    );
  }
}

export default Chat;
