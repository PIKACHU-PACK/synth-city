import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { Rooms } from './Rooms';
import { gameStarted, startGame } from '../socket';

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.onStart = this.onStart.bind(this);
  }

  onStart() {
    startGame(this.props.match.params.roomId);
    //add turn listener into component did mount of game room
    //imported function to listen to turns
    //when called it would start the io.on
    //fire turn listener function and start implementing turns until the game ends
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div>
        <h2>HELLO, PLEASE WAIT</h2>
        <p>Your code is: {roomId}</p>
        {/* <a href={`/game/${roomId}/sequencer`}> */}
        <button type="button" onClick={this.onStart}>
          Start Game
        </button>
        {/* </a> */}
        {/* <Chat /> */}
      </div>
    );
  }
}
