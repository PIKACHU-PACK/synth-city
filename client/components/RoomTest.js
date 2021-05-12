import React from 'react';
import { createRoom, joinRoom } from '../socket';
import history from '../history';

export class RoomTest extends React.Component {
  constructor() {
    super();
    this.state = {
      roomKey: '',
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.roomCreated = this.roomCreated.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  enterRoom(roomId) {
    history.push({
      pathname: `/waiting/${roomId}`,
    });
    // console.log(room);
    // return room;
  }

  handleChange(evt) {
    this.setState({
      roomKey: evt.target.value,
    });
  }

  handleCreate() {
    createRoom(this.enterRoom);
    console.log('history', history);
  }

  handleJoin(evt) {
    evt.preventDefault();
    joinRoom(this.state.roomKey, this.enterRoom);
  }

  render() {
    return (
      <div>
        <button type="button" id="create-game" onClick={this.handleCreate}>
          Create New Game
        </button>
        <h2>Join existing game</h2>
        <input></input>
        <button type="submit" onSubmit={this.handleJoin}>
          Join Game
        </button>
      </div>
    );
  }
}
