import React from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'flatted';
import {
  joinGame,
  chatListener,
  getThisPlayer,
  startListener,
  turnListener,
  segmentListener,
  passSegment,
  endTurn,
} from '../socket';
import history from '../history';
import Swal from 'sweetalert2';
import { turnLength } from './Sequencer';
import Aos from 'aos';
import WaitingRoom from './WaitingRoom';
import GamePage from './GamePage';
import SongReveal from './SongReveal';

export class Environment extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 'waiting',
      chat: [],
      players: [],
      thisPlayer: {},
      musician: {},
      isFirst: true,
      rounds: null,
      turn: 0,
      previousNotes: [],
      finalSong: [],
    };
    this.getMessage = this.getMessage.bind(this);
    this.setPlayers = this.setPlayers.bind(this);
    this.setThisPlayer = this.setThisPlayer.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.setTurn = this.setTurn.bind(this);
    this.getSegment = this.getSegment.bind(this);
  }

  componentDidMount() {
    const room = this.props.room;
    joinGame(room, this.setPlayers); // JOINS THE SOCKET AND LISTENS FOR PLAYERS
    chatListener(this.getMessage);
    getThisPlayer(this.setThisPlayer);
    startListener(this.gameStarted);
    turnListener(this.setTurn);
    segmentListener(this.getSegment);
  }

  getMessage(msg) {
    this.setState({ chat: [...this.state.chat, msg] });
  }

  setPlayers(players) {
    this.setState({ players: players });
  }

  setThisPlayer(player) {
    this.setState({ thisPlayer: player });
  }

  gameStarted(rounds) {
    const musician = this.state.players[0];
    this.setState({ page: 'game', rounds: rounds, musician: musician });
  }

  finishTurn(notesString, gridString) {
    passSegment(this.props.room, notesString, gridString);
    endTurn(
      this.props.room,
      this.state.rounds,
      this.state.turn,
      this.state.players
    );
  }

  setTurn() {
    let nextTurn = this.state.turn + 1;
    if (nextTurn === this.state.rounds || nextTurn > this.state.rounds) {
      this.setState({ page: 'song' });
    } else {
      let turnIdx = nextTurn % this.state.players.length;
      let nextMusician = this.state.players[turnIdx];
      while (nextMusician === null) {
        nextTurn++;
        turnIdx = nextTurn % this.state.players.length;
        nextMusician = this.state.players[turnIdx];
      }
      this.setState({ musician: nextMusician, isFirst: false, turn: nextTurn });
    }
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

  render() {
    console.log('Players: ', this.state.players);
    const page = this.state.page;
    const musician = this.state.musician;
    return (
      <>
        {page === 'waiting' ? (
          <WaitingRoom
            room={this.props.room}
            chat={this.state.chat}
            players={this.state.players}
            thisPlayer={this.state.thisPlayer}
            setPlayers={this.setPlayers}
          />
        ) : page === 'game' ? (
          <GamePage
            room={this.props.room}
            chat={this.state.chat}
            players={this.state.players}
            thisPlayer={this.state.thisPlayer}
            musician={musician}
            isFirst={this.state.isFirst}
            finishTurn={this.finishTurn}
            previousNotes={this.state.previousNotes}
          />
        ) : (
          <SongReveal
            room={this.props.room}
            chat={this.state.chat}
            thisPlayer={this.state.thisPlayer}
            finalSong={this.state.finalSong}
          />
        )}
      </>
    );
  }
}

export default Environment;
