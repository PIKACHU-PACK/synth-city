import React from 'react';
import { Link } from 'react-router-dom';
import {
  joinGame,
  chatListener,
  getPlayers,
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
      turn: null,
      previousNotes: [],
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
    joinGame(room);
    chatListener(this.getMessage);
    getPlayers(this.setPlayers);
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

  //   addPlayer(newPlayer) {
  //     this.setState({ players: [...this.state.players, newPlayer] });
  //   }

  gameStarted() {
    this.setState({ page: 'game' });
  }

  render() {
    console.log('Environment: ', this.state);
    const page = this.state.page;
    return (
      <>
        {page === 'waiting' ? (
          <WaitingRoom
            room={this.props.room}
            chat={this.state.chat}
            players={this.state.players}
            thisPlayer={this.state.thisPlayer}
          />
        ) : page === 'game' ? (
          <GamePage />
        ) : (
          <SongReveal />
        )}
      </>
    );
  }
}

export default Environment;
