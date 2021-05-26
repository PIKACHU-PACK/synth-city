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
      musician: {},
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
    this.setState({ musician: this.state.players[0] });
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

  gameStarted() {
    this.setState({ page: 'game' });
  }

  render() {
    console.log('Environment: ', this.state);
    const page = this.state.page;
    const musician = this.state.players[this.state.turn];
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
          <SongReveal />
        )}
      </>
    );
  }
}

export default Environment;
