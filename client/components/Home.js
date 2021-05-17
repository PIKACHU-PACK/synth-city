import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createRoom, joinRoom } from '../socket';
import history from '../history';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export class Home extends React.Component {
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

  async openRoomInput() {
    const mySwal = withReactContent(Swal);
    await mySwal.fire({
      text: 'Join a Room',
      input: 'text',
      inputValue: this.state.roomKey,
      inputPlaceholder: 'Aa',
    });
  }
  handleJoin() {
    joinRoom(this.state.roomKey, this.enterExistingRoom);
  }
  render() {
    return (
      <div className="home-page">
        <div className="banner">
          <h2 className="home-title">SynthCity</h2>
        </div>
        <div className="options-container">
          <div className="column">
            <div onClick={this.handleCreate} className="option-card">
              <h3>Create New Game</h3>
            </div>
          </div>
          <div className="column">
            <div onClick={this.openRoomInput} className="option-card">
              <h3>Join existing game</h3>
              <input
                name="roomKey"
                value={this.state.roomKey}
                onChange={this.handleChange}
              />
              <button
                type="button"
                id="joinRoom"
                className="main-cta"
                onClick={this.handleJoin}
              >
                Join Game
              </button>
            </div>
          </div>
          <div className="column">
            <Link to={'/practice'}>
              <div className="option-card">
                <h3>Try it out</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // username: state.auth.username
  };
};

export default connect(mapState)(Home);
