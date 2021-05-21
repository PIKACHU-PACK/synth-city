import React from 'react';
import {
  getInfo,
  chatListener,
  turnListener,
  endTurn,
  gameEndListener,
} from '../socket';
import Sequencer, { turnLength } from './Sequencer';
import history from '../history';
import { parse } from 'flatted';
import Chat from './Chat';
import { Timer } from 'react-countdown-clock-timer';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      musician: '',
      rounds: null,
      turn: null,
      previousNotes: [],
      isFirst: true,
      chosenBeat: [],
      chat: [],
      finalSong: [],
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.sendTurn = this.sendTurn.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.room, this.stateInfo);
    chatListener(this.getMessages);
    turnListener(this.sendTurn);
    gameEndListener(this.revealSong);
  }

  stateInfo({ thisPlayer, players, musician, rounds, turn }) {
    this.setState({
      thisPlayer: thisPlayer,
      players: players,
      musician: musician,
      rounds: rounds,
      turn: turn,
    });
  }

  getMessages(msg) {
    this.setState({ chat: [...this.state.chat, msg] });
  }

  sendTurn(notesStr, gridStr, nextPlayer, turn) {
    const notes = parse(notesStr);
    const segment = parse(gridStr);
    const songSoFar = this.state.finalSong.slice();
    songSoFar.push(segment);
    this.setState({
      musician: nextPlayer,
      previousNotes: notes,
      isFirst: false,
      finalSong: songSoFar,
      turn: turn,
    });
  }

  finishTurn(notesString, gridString) {
    endTurn(
      this.props.room,
      notesString,
      gridString,
      this.state.rounds,
      this.state.turn
    );
  }

  revealSong() {
    history.push({
      pathname: `/song/${this.props.room}`,
      finalSong: this.state.finalSong,
    });
  }

  render() {
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;
    const room = this.props.room;
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
              <h2 className="game-title">WAITING FOR YOUR TURN</h2>
              {/* <Timer durationInSeconds={turnLength} /> */}
              <div className="game-chat">
                <Chat roomId={room} chat={this.state.chat} />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default GamePage;
