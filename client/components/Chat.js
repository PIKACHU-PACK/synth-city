import React from 'react';
import { chatMessage } from '../socket';

export class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      chat: [],
    };
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.msgChange = this.msgChange.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidUpdate(props, nextProps) {
    if (props.chat.length !== nextProps.chat.length) {
      this.setState({
        chat: [...this.props.chat],
      });
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  msgChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onMessageSubmit(e) {
    e.preventDefault();
    const nickname = this.props.nickname;
    const { msg } = this.state;
    chatMessage(this.props.roomId, nickname, msg); //emits message to server
    this.setState({ chat: [...this.state.chat, msg], msg: '' });
  }

  render() {
    const { chat } = this.props;
    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-button"></div>
          <div className="chat-button"></div>
          <div className="chat-button"></div>
        </div>
        <div
          className="chat-messages"
          ref={(div) => {
            this.messageList = div;
          }}
        >
          <div id="messages">
            {chat.map((rec, i) => (
              <p key={i}>
                {rec.nickname}: {rec.msg}
              </p>
            ))}
          </div>
          <i id="typing"></i>
        </div>
        <form
          className="input-container"
          id="message-form"
          onSubmit={this.onMessageSubmit}
        >
          <input
            id="message"
            className="message-input"
            placeholder="Type something uwu"
            name="msg"
            value={this.state.msg}
            onChange={this.msgChange}
            autoFocus
          />
          <button className="message-submit" type="submit"></button>
        </form>
      </div>
    );
  }
}

export default Chat;
