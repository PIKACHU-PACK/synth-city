import React from 'react';
import io from 'socket.io-client';
import { chatMessage } from '../socket';

export class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      msg: '',
      chat: [],
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
  }

  onTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  onMessageSubmit() {
    const { msg } = this.state;
    const room = this.props.match.params.roomId;
    console.log(this.state);
    this.setState({ chat: [...this.state.chat, msg] });
    chatMessage(msg);
  }

  render() {
    const { chat } = this.state;
    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-button"></div>
          <div className="chat-button"></div>
          <div className="chat-button"></div>
        </div>

        <div className="chat-messages">
          <div id="messages">
            {chat.map((msg, idx) => (
              <div key={idx}>
                <ul>
                  <li key={idx} className="message-item">
                    {msg.body}
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <i id="typing"></i>
        </div>
        <form className="input-container" id="message-form">
          <textarea
            id="message"
            name="msg"
            value={this.state.msg}
            className="message-input"
            placeholder="Type something uwu"
            onChange={this.onTextChange}
          />
          <button
            className="message-submit"
            onClick={this.onMessageSubmit}
          ></button>
        </form>
      </div>
    );
  }
}

export default Chat;
