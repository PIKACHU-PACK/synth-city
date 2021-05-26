import React from 'react';
import { Link } from 'react-router-dom';
import {
  joinGame,
  chatListener,
  getThisPlayer,
  startListener,
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
      // musician: {},
      isFirst: true,
      rounds: null,
      turn: 0,
      //previousNotes: [],
      finalSong: [],
    };
    this.getMessage = this.getMessage.bind(this);
    this.setPlayers = this.setPlayers.bind(this);
    this.setThisPlayer = this.setThisPlayer.bind(this);
    //this.addPlayer = this.addPlayer.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
  }

  componentDidMount() {
    const room = this.props.room;
    joinGame(room, this.setPlayers); // JOINS THE SOCKET AND LISTENS FOR PLAYERS
    chatListener(this.getMessage);
    getThisPlayer(this.setThisPlayer);
    startListener(this.gameStarted);
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
    this.setState({ page: 'game', rounds: rounds });
  }

  render() {
    console.log('Environment: ', this.state);
    const page = this.state.page;
    const turnIdx = this.state.turn % this.state.players.length;
    console.log('turnIdx', turnIdx);
    const musician = this.state.players[turnIdx];
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
          />
        ) : (
          <SongReveal
            room={this.props.room}
            chat={this.state.chat}
            thisPlayer={this.state.thisPlayer}
          />
        )}
      </>
    );
  }
}

export default Environment;
