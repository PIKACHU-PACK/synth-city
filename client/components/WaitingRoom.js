import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { RoomTest } from './Rooms';
import { startGame } from '../socket';

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.onStart = this.onStart.bind(this);
  }

  onStart() {
    startGame(this.props.match.params.roomId);
  }

  render() {
    return (
      <div>
        <h2>HELLO, PLEASE WAIT</h2>
        <p>Your code is: {this.props.match.params.roomId}</p>
        <button type="button" onClick={this.onStart}>
          Start Game
        </button>
        <Chat />
      </div>
    );
  }
}
