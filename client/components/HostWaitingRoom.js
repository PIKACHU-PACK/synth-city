import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { startGame, startListener } from '../socket';
import history from '../history';
import socket from '../socket';

class HostWaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      chat: [],
    };
    this.onStart = this.onStart.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
    socket.on('chat Message', (msg) => {
      this.setState({
        chat: [...this.state.chat, msg],
      });
    });
  }

  onStart() {
    startGame(this.props.match.params.roomId);
  }

  gameStarted() {
    history.push({
      pathname: `/game/${this.props.match.params.roomId}`,
    });
  }

  goHome() {
    history.push({
      pathname: '/',
    });
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="waiting-room">
        <div className="waiting-view">
          <div className="home-button-container">
            <button type="button" className="home-button" onClick={this.goHome}>
              <img src={'/homebutton.png'} className="home-arrow-img" />
            </button>
          </div>
          <div className="waiting-info">
            <div className="banner">
              <h2 className="waiting-title">Loading...</h2>
            </div>
            <h2>Your code is: {roomId}</h2>
            <button type="button" className="main-cta" onClick={this.onStart}>
              Start Game
            </button>
          </div>
          <div className="chat-container">
            <Chat roomId={roomId} chat={this.state.chat} />
          </div>
        </div>
      </div>
    );
  }
}

export default HostWaitingRoom;
