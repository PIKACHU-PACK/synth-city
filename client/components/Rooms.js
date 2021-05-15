import React from 'react';
import { createRoom, joinRoom } from '../socket';
import history from '../history';

export class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {
      roomKey: '',
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.enterNewRoom = this.enterNewRoom.bind(this);
    this.enterExistingRoom = this.enterExistingRoom.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  enterNewRoom(room) {
    history.push({
      pathname: `/waiting/${room}`,
    });
  }

  enterExistingRoom() {
    history.push({
      pathname: `/waiting/${this.state.roomKey}`,
    });
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleCreate() {
    createRoom(this.enterNewRoom);
  }

  handleJoin() {
    joinRoom(this.state.roomKey, this.enterExistingRoom);
  }

  render() {
    return (
      <div>
        <button type="button" id="create-game" onClick={this.handleCreate}>
          Create New Game
        </button>
        <h2>Join existing game</h2>
        <input
          name="roomKey"
          value={this.state.roomKey}
          onChange={this.handleChange}
        />
        <button type="button" id="joinRoom" onClick={this.handleJoin}>
          Join Game
        </button>
      </div>
    );
  }
}
