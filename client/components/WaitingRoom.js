import React from "react";
import Chat from "./Chat";
import { startGame, startListener } from "../socket";
import history from "../history";
import socket from "../socket";
import Swal from "sweetalert2";
import { getInfo, newPlayerListener } from "../socket";

class WaitingRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      thisPlayer: "",
      chat: [],
    };
    this.onStart = this.onStart.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.goHome = this.goHome.bind(this);
    this.displayError = this.displayError.bind(this);
    this.setInfo = this.setState.bind(this);
    this.newPlayer = this.newPlayer.bind(this);
  }

  componentDidMount() {
    startListener(this.gameStarted);
    getInfo(this.props.match.params.roomId, this.setInfo);
    newPlayerListener(this.newPlayer);
    socket.on("chat Message", (msg) => {
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
      title: "Error:",
      html: "Sorry, you need 2-4 players to start the game.",
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
      pathname: "/",
    });
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="waiting-room">
        <div className="waiting-view">
          <div className="home-button-container">
            <button type="button" className="home-button" onClick={this.goHome}>
              <img src={"/homebutton.png"} className="home-arrow-img" />
            </button>
          </div>
          <div className="waiting-info">
            <div className="banner">
              <h2 className="waiting-title">Loading...</h2>
            </div>
            <h2>
              {this.state.players.length === 1
                ? `${this.state.players.length} Player Is Ready To Jam!`
                : `${this.state.players.length} Players Are Ready To Jam!`}
            </h2>
            <h4>SynthCity is for 2-4 players.</h4>
            <h2>Your code is: {roomId}</h2>
            {this.state.thisPlayer === this.state.players[0] ? (
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
        </div>
      </div>
    );
  }
}

export default WaitingRoom;
