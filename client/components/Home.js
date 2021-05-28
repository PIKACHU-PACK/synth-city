import React from 'react';
import { Link } from 'react-router-dom';
import { createRoom, joinRoom } from '../socket';
import Footer from './Footer';
import history from '../history';
import Swal from 'sweetalert2';
import { turnLength } from './Sequencer';
import Aos from 'aos';

export class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      roomKey: '',
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.enterNewRoom = this.enterNewRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.enterExistingRoom = this.enterExistingRoom.bind(this);
    this.roomDoesNotExist = this.roomDoesNotExist.bind(this);
    this.roomFull = this.roomFull.bind(this);
    this.displayInstructions = this.displayInstructions.bind(this);
  }

  componentDidMount() {
    Aos.init({ duration: 2000 });
  }

  handleCreate() {
    createRoom(this.enterNewRoom);
  }

  enterNewRoom(room) {
    history.push({
      pathname: `/play/${room}`,
    });
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleJoin() {
    joinRoom(
      this.state.roomKey,
      this.roomDoesNotExist,
      this.enterExistingRoom,
      this.roomFull
    );
  }

  enterExistingRoom(room) {
    history.push({
      pathname: `/play/${room}`,
    });
  }

  roomDoesNotExist() {
    Swal.fire({
      title: 'Error:',
      html: 'Room does not exist. Please try entering your code again.',
      showCloseButton: true,
    });
  }

  roomFull() {
    Swal.fire({
      title: 'Error:',
      html: 'This room is full. Please create or join another room.',
      showCloseButton: true,
    });
  }

  displayInstructions() {
    Swal.fire({
      title: 'HOW TO PLAY:',
      html:
        `Each player will have two ${turnLength}-second turns to compose an 8-second section of an original song. The last two notes from each turn will be passed along to the next player to continue the song. <br></br>` +
        "When it is your turn, the first two notes on your display will display the final two notes from the previous player. To compose your section, click on the Sequencer's buttons. Use the menu at the top to change Octaves and Synths.<br></br>" +
        'At the end of the game, you and your teammates will be able to listen to your grammy-nominated masterpiece!',
      showCloseButton: true,
    });
  }

  render() {
    return (
      <div className="home-view">
        <div className="home-page">
          <div className="banner">
            <h2 className="home-title" data-aos="fade-in">
              SynthCity
            </h2>
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
            <button
              type="button"
              className="instructions-button"
              onClick={this.displayInstructions}
            >
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
