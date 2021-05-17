import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { Rooms } from './Rooms';
import { gameStarted, startGame } from '../socket';
import history from '../history';

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.onStart = this.onStart.bind(this);
  }

  onStart() {
    history.push({
      pathname: `/game/${this.props.match.params.roomId}`,
    });
    startGame(this.props.match.params.roomId);
    //add turn listener into component did mount of game room
    //imported function to listen to turns
    //when called it would start the io.on
    //fire turn listener function and start implementing turns until the game ends
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="waiting-room">
        <div className="waiting-view">
          <div className="banner">
            <h2 className="waiting-title">Loading...</h2>
          </div>
          <h2>Your code is: {roomId}</h2>
          <button type="button" className="main-cta" onClick={this.onStart}>
            Start Game
          </button>
          {/* <Chat /> */}
        </div>
      </div>
    );
  }
}
