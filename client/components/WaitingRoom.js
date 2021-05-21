import React from 'react';
import Chat from './Chat';
import {
  startListener,
  chatListener,
  newPlayerListener,
  getInfo,
  startGame,
} from '../socket';
import history from '../history';
import Swal from 'sweetalert2';

class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      thisPlayer: '',
      chat: [],
    };
    this.gameStarted = this.gameStarted.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.newPlayer = this.newPlayer.bind(this);
    this.setInfo = this.setState.bind(this);
    this.goHome = this.goHome.bind(this);
    this.onStart = this.onStart.bind(this);
    this.wrongNumberPlayers = this.wrongNumberPlayers.bind(this);
    this.displayInstructions = this.displayInstructions.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
    chatListener(this.getMessages);
    newPlayerListener(this.newPlayer);
    getInfo(this.props.match.params.roomId, this.setInfo);
  }

  gameStarted() {
    history.push({
      pathname: `/game/${this.props.match.params.roomId}`,
    });
  }

  getMessages(msg) {
    this.setState({ chat: [...this.state.chat, msg] });
  }

  newPlayer(players) {
    this.setState({ players: players });
  }

  setInfo({ thisPlayer, players }) {
    this.setState({ thisPlayer: thisPlayer, players: players });
  }

  goHome() {
    history.push({
      pathname: '/',
    });
  }

  onStart() {
    const players = this.state.players;
    if (players.length > 1 && players.length <= 4) {
      startGame(this.props.match.params.roomId);
    } else {
      this.wrongNumberPlayers();
    }
  }

  wrongNumberPlayers() {
    Swal.fire({
      title: 'Error:',
      html: 'Sorry, you need 2-4 players to start the game.',
      showCloseButton: true,
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
    const players = this.state.players;
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
              <h2 className="waiting-title">Loading...</h2>
            </div>
            <h2>
              {players.length === 1
                ? `${players.length} Player Is Ready To Jam!`
                : `${players.length} Players Are Ready To Jam!`}
            </h2>
            <h4>SynthCity is for 2-4 players.</h4>
            <h2>Invite Your Friends With This Code: {roomId}</h2>
            {this.state.thisPlayer === players[0] ? (
              <button type="button" className="main-cta" onClick={this.onStart}>
                Start Game
              </button>
            ) : (
              <h2>Waiting for host to start game~</h2>
            )}
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
