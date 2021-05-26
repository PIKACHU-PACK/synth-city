import React from 'react';
import { Link } from 'react-router-dom';
import {
  getThisPlayer,
  chatListener,
  joinGame,
  createRoom,
  joinRoom,
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
      thisPlayer: '',
      nickname: '',
      musician: '',
      musicianNickname: '',
      isFirst: true,
      rounds: null,
      turn: null,
      previousNotes: [],
      finalSong: [],
    };
    this.setThisPlayer = this.setThisPlayer.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  componentDidMount() {
    const room = this.props.room;
    getThisPlayer(this.setThisPlayer);
    chatListener(this.getMessage);
    joinGame(room);
  }

  getMessage(msg) {
    this.setState({ chat: [...this.state.chat, msg] });
  }

  setThisPlayer(id, nickname) {
    this.setState({ thisPlayer: id, nickname: nickname });
  }

  addPlayer(newPlayer) {
    this.setState({ players: [...this.state.players, newPlayer] });
  }

  render() {
    console.log(this.state);
    const page = this.state.page;
    return (
      <>
        {page === 'waiting' ? (
          <WaitingRoom
            room={this.props.room}
            chat={this.state.chat}
            players={this.state.players}
            thisPlayer={this.state.thisPlayer}
            nickname={this.state.nickname}
            addPlayer={this.addPlayer}
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
