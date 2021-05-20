import React from 'react';
import Chat from './Chat';
import { startGame, startListener } from '../socket';
import history from '../history';
import socket from '../socket';
import Swal from 'sweetalert2';
import { getInfo, newPlayerListener } from '../socket';

class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      thisPlayer: '',
      chat: [],
    };
    this.onStart = this.onStart.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.goHome = this.goHome.bind(this);
    this.displayError = this.displayError.bind(this);
    this.setInfo = this.setState.bind(this);
    this.newPlayer = this.newPlayer.bind(this);
    this.displayInstructions = this.displayInstructions.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
    getInfo(this.props.match.params.roomId, this.setInfo);
    newPlayerListener(this.newPlayer);
    socket.on('chat Message', (msg) => {
      this.setState({
        chat: [...this.state.chat, msg],
      });
    });
  }

  newPlayer(players) {
    this.setState({ players: players });
  }

  setInfo({ players, thisPlayer }) {
    this.setState({ players: players, thisPlayer: thisPlayer });
  }

  displayError() {
    Swal.fire({
      title: 'Error:',
      html: 'Sorry, you need 2-4 players to start the game.',
      showCloseButton: true,
    });
  }

  onStart() {
    const players = this.state.players;
    if (players.length > 1 && players.length <= 4) {
      startGame(this.props.match.params.roomId);
    } else {
      this.displayError();
    }
  }

  gameStarted() {
    history.push({
      pathname: `/game/${this.props.match.params.roomId}`,
    });
  }

  goHome() {
    history.push({
      pathname: '/',
    });
  }

  displayInstructions() {
    Swal.fire({
      title: 'HOW TO PLAY:',
      html:
        'Each player will have two 25-second turns to compose a section of an original song. The last two notes from each turn will be passed along to the next player to continue the song. <br></br>' +
        "To compose your section, click on the Sequencer's buttons. Use the menu at the top to change Octaves and Synths.<br></br>" +
        "At the end of the game, you'll be able to hear and download your grammy-nominated masterpiece!",
      showCloseButton: true,
    });
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="waiting-room">
        <div className="waiting-view">
          <div className="home-button-container">
            <button type="button" className="home-button" onClick={this.goHome}>
              <img src={'/homebutton.png'} className="home-arrow-img" />
            </button>
          </div>
          <div className="waiting-info">
            <div className="banner">
              {this.state.thisPlayer === this.state.players[0] ? (
                <h2 className="waiting-title">Loading Players...</h2>
              ) : (
                <h2 className="waiting-title">Waiting on Host...</h2>
              )}
              <h3 className="waiting-subheading">
                You'll need 2-4 players to start a game
              </h3>
              <p>
                Once the game begins, one player will be sent to the studio.{' '}
                <br></br>
                Everyone else, just chill and chat until it's your time to
                shine!
              </p>
            </div>
            <div className="waiting-subinfo">
              <h2>
                {this.state.players.length === 1
                  ? `${this.state.players.length} Player Is Ready To Jam!`
                  : `${this.state.players.length} Players Are Ready To Jam!`}
              </h2>
              <h2>
                Invite Your Friends With This Code:{' '}
                <h2 className="bold">{roomId}</h2>
              </h2>
              {this.state.thisPlayer === this.state.players[0] ? (
                <button
                  type="button"
                  className="main-cta"
                  onClick={this.onStart}
                >
                  Start Game
                </button>
              ) : (
                <h3>
                  Your host will start the game when everyone is ready to rock
                </h3>
              )}
            </div>
          </div>
          <div className="chat-container">
            <Chat roomId={roomId} chat={this.state.chat} />
          </div>
          <div className="waiting-instructions-container">
            <button
              type="button"
              className="waiting-instructions-button"
              onClick={this.displayInstructions}
            >
              <img
                src={'/InstructionsIcon.png'}
                className="waiting-instructions-img"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default WaitingRoom;
