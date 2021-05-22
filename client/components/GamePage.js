import React from 'react';
import {
  getInfo,
  chatListener,
  playerLeftListener,
  updatePlayersListener,
  segmentListener,
  turnListener,
  endTurn,
  gameEndListener,
} from '../socket';
import Sequencer, { turnLength } from './Sequencer';
import history from '../history';
import { parse } from 'flatted';
import Chat from './Chat';

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
    this.playerLeft = this.playerLeft.bind(this);
    this.updatePlayers = this.updatePlayers.bind(this);
    this.getSegment = this.getSegment.bind(this);
    this.sendTurn = this.sendTurn.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.room, this.stateInfo);
    chatListener(this.getMessages);
    playerLeftListener(this.playerLeft);
    updatePlayersListener(this.updatePlayers);
    segmentListener(this.getSegment);
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

  playerLeft(departedPlayer) {
    let players = this.state.players || [];
    console.log(players, 'players');
    let updatedPlayers = players.map((player) => {
      if (player === departedPlayer) {
        player = null;
      }
      return player;
    });
    this.setState({ players: updatedPlayers });
  }

  updatePlayers(players) {
    this.setState({ players: players });
  }

  getSegment(notesStr, gridStr) {
    const notes = parse(notesStr);
    const segment = parse(gridStr);
    const songSoFar = this.state.finalSong.slice();
    songSoFar.push(segment);
    this.setState({
      finalSong: songSoFar,
      previousNotes: notes,
    });
  }

  sendTurn(nextPlayer, turn) {
    this.setState({
      musician: nextPlayer,
      isFirst: false,
      turn: turn,
    });
  }

  finishTurn(notesString, gridString) {
    endTurn(
      this.props.room,
      notesString,
      gridString,
      this.state.rounds,
      this.state.turn,
      this.state.players
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
    const musician = this.state.musician || '';
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
