import React from "react";
import { getInfo, turnListener, endTurn, gameEndListener } from "../socket";
import Sequencer, { turnLength } from "./Sequencer";
import history from "../history";
import { parse } from "flatted";
import Chat from "./Chat";
import socket from "../socket";
import { Timer } from "react-countdown-clock-timer";

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: "",
      musician: "",
      previousNotes: [],
      isFirst: true,
      chosenBeat: [],
      chat: [],
      finalSong: [],
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.sendTurn = this.sendTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
    turnListener(this.sendTurn);
    socket.on("chat Message", (msg) => {
      this.setState({
        chat: [...this.state.chat, msg],
      });
    });
    gameEndListener(this.revealSong);
  }

  stateInfo(info) {
    const { thisPlayer, players, musician } = info;
    this.setState({
      thisPlayer: thisPlayer,
      players: players,
      musician: musician,
    });
  }

  sendTurn(nextPlayer, notesStr, gridStr) {
    const notes = parse(notesStr);
    const segment = parse(gridStr);
    const songSoFar = this.state.finalSong.slice();
    songSoFar.push(segment);
    this.setState({
      musician: nextPlayer,
      previousNotes: notes,
      isFirst: false,
      finalSong: songSoFar,
    });
  }

  finishTurn(notesString, gridString) {
    endTurn(this.props.match.params.roomId, notesString, gridString);
  }

  revealSong() {
    this.props.history.push({
      pathname: `/song/${this.props.match.params.roomId}`,
      finalSong: this.state.finalSong,
    });
  }

  render() {
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;
    const roomId = this.props.match.params.roomId;
    return (
      <>
        {thisPlayer === musician ? (
          <>
            <Sequencer
              finishTurn={this.finishTurn}
              previousNotes={this.state.previousNotes}
              isFirst={this.state.isFirst}
            />
          </>
        ) : (
          <>
            <div>
              <h2 className="game-title">WAITING</h2>
              <Timer durationInSeconds={turnLength} />
              <div className="game-chat">
                <Chat roomId={roomId} chat={this.state.chat} />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default GamePage;
