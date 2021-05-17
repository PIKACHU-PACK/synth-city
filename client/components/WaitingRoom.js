import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { Rooms } from './Rooms';
import { startGame, startListener } from '../socket';
import history from '../history';

class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
    };
    this.onStart = this.onStart.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
  }

  onStart() {
    startGame(this.props.match.params.roomId);
    //add turn listener into component did mount of game room
    //imported function to listen to turns
    //when called it would start the io.on
    //fire turn listener function and start implementing turns until the game ends
  }

  gameStarted() {
    history.push({
      pathname: `/game/${this.props.match.params.roomId}`,
    });
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="waiting-room">
        <div className="waiting-view">
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
            <Chat />
          </div>
        </div>
      </div>
    );
  }
}

export default WaitingRoom;
