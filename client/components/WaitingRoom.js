import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { RoomTest } from './Rooms';

export class WaitingRoom extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <h2>HELLO, PLEASE WAIT</h2>
        <p>Your code is: {this.props.match.params.roomId}</p>
        <Chat />
      </div>
    );
  }
}
