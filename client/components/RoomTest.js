import React from 'react';
import { createRoom, joinRoom } from '../socket';

export class RoomTest extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.roomCreated = this.roomCreated.bind(this);
  }

  roomCreated(room) {
    // this.props.history.push({
    //   pathname: `/gameroom/${roomId}`,
    // });
    console.log(room);
    return room;
  }

  handleClick() {
    createRoom(this.roomCreated);
  }

  render() {
    return (
      <div>
        <button type="button" id="create-game" onClick={this.handleClick}>
          Create New Game
        </button>
        <h2>Join existing game</h2>
        <input></input>
      </div>
    );
  }
}
