import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { startGame, startListener } from '../socket';
import history from '../history';
import socket from '../socket';
import Swal from 'sweetalert2';

class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      chat: [],
    };
    this.gameStarted = this.gameStarted.bind(this);
    this.goHome = this.goHome.bind(this);
    this.displayInstructions = this.displayInstructions.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
    socket.on('chat Message', (msg) => {
      this.setState({
        chat: [...this.state.chat, msg],
      });
    });
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

  displayInstructions() {
    Swal.fire({
      title: 'HOW TO PLAY:',
      html:
        'Each player will have two 25-second turns to compose a section of an original song. The last two notes from each turn will be passed along to the next player to continue the song. <br></br>' +
        "To compose your section, click on the Sequencer's buttons. Use the menu at the top to change Octaves and Synths.<br></br>" +
        "At the end of the game, you'll be able to hear and download your grammy-nominated masterpiece!",
      showCloseButton: true,
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
          </div>
          <div className="chat-container">
            <Chat roomId={roomId} chat={this.state.chat} />
          </div>
          <div className="waiting-instructions-container">
            <button
              type="button"
              className="waiting-instructions-button"
              onClick={this.displayInstructions}
            >
              <img
                src={'/InstructionsIcon.png'}
                className="waiting-instructions-img"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default WaitingRoom;
