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
      <div>
        <h2>HELLO, PLEASE WAIT</h2>
        <p>Your code is: {roomId}</p>
        <button type="button" onClick={this.onStart}>
          Start Game
        </button>
        {/* <Chat /> */}
      </div>
    );
  }
}

export default WaitingRoom;
