import React from 'react';
import Chat from './Chat';
import {
  startListener,
  chatListener,
  updatePlayersListener,
  getInfo,
  startGame,
  exitRoom,
} from '../socket';
import history from '../history';
import Swal from 'sweetalert2';
import { turnLength } from './Sequencer';

class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      thisPlayer: '',
      nickname: '',
      chat: [],
    };
    this.setInfo = this.setState.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.updatePlayers = this.updatePlayers.bind(this);
    this.goHome = this.goHome.bind(this);
    this.onStart = this.onStart.bind(this);
    this.wrongNumberPlayers = this.wrongNumberPlayers.bind(this);
    this.displayInstructions = this.displayInstructions.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.room, this.setInfo);
    chatListener(this.getMessages);
    startListener(this.gameStarted);
    updatePlayersListener(this.updatePlayers);
  }

  setInfo({ thisPlayer, nickname, players }) {
    this.setState({
      thisPlayer: thisPlayer,
      nickname: nickname,
      players: players,
    });
  }

  getMessages(msg) {
    this.setState({ chat: [...this.state.chat, msg] });
  }

  gameStarted() {
    history.push({
      pathname: `/game/${this.props.room}`,
    });
  }

  updatePlayers(players) {
    this.setState({ players: players });
  }

  goHome() {
    exitRoom(this.props.room);
    history.push({
      pathname: '/',
    });
  }

  onStart() {
    const players = this.state.players;
    if (players.length > 1 && players.length <= 4) {
      startGame(this.props.room);
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
        `Each player will have two ${turnLength}-second turns to compose an 8-second section of an original song. The last two notes from each turn will be passed along to the next player to continue the song. <br></br>` +
        "When it is your turn, the first two notes on your display will display the final two notes from the previous player. To compose your section, click on the Sequencer's buttons. Use the menu at the top to change Octaves and Synths.<br></br>" +
        'At the end of the game, you and your teammates will be able to listen to your grammy-nominated masterpiece!',
      showCloseButton: true,
    });
  }

  render() {
    const room = this.props.room;
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
                {players.length === 1
                  ? `${players.length} Player Is Ready To Jam!`
                  : `${players.length} Players Are Ready To Jam!`}
              </h2>
              <h2>
                Invite Your Friends With This Code:{' '}
                <h2 className="bold">{room}</h2>
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
            <Chat
              roomId={room}
              nickname={this.state.nickname}
              chat={this.state.chat}
            />
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
