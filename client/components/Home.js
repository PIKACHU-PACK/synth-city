import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createRoom, joinRoom } from '../socket';
import Footer from './Footer';
import history from '../history';
import Swal from 'sweetalert2';

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
    this.displayInstructions = this.displayInstructions.bind(this);
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

  displayInstructions() {
    Swal.fire({
      title: 'HOW TO PLAY:',
      html:
        'Each player will have two 45-second turns to compose a section of an original song. The last two notes from each turn will be passed along to the next player to continue the song. <br></br>' +
        "To compose your section, click on the Sequencer's buttons. Use the menu at the top to change Octaves and Synths.<br></br>" +
        "At the end of the game, you'll be able to hear and download your grammy-nominated masterpiece!",
      showCloseButton: true,
    });
  }

  handleJoin() {
    joinRoom(this.state.roomKey, this.enterExistingRoom);
  }
  render() {
    return (
      <div className="home-view">
        <div className="home-page">
          <div className="banner">
            <h2 className="home-title">SynthCity</h2>
            <h3 className="home-subheading">
              Make music with your friends before the timer runs out! <br></br>{' '}
              Your sick tunes will be passed to the next player until everyone
              has rocked out. <br></br>When the game is done, you'll have an
              award-winning masterpiece.
            </h3>
          </div>
          <div className="options-container">
            <div className="column">
              <div onClick={this.handleCreate} className="option-card">
                <h3>Create New Game</h3>
              </div>
            </div>
            <div className="column">
              <div className="join-card">
                <h3>Join existing game</h3>
                <input
                  name="roomKey"
                  value={this.state.roomKey}
                  onChange={this.handleChange}
                />
                <button
                  type="button"
                  id="joinRoom"
                  className="join-cta"
                  onClick={this.handleJoin}
                >
                  Go!
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
          <div className="instructions-container">
            {/* <p>How to Play</p> */}
            <button
              type="button"
              className="instructions-button"
              onClick={this.displayInstructions}
            >
              {/* How to play */}
              <img src="./InstructionsIcon.png" className="instructions-img" />
            </button>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Home;
