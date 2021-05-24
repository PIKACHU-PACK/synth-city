import React from 'react';
import {
  getInfo,
  chatListener,
  playerLeftListener,
  segmentListener,
  turnListener,
  passSegment,
  endTurn,
  gameEndListener,
  exitRoom,
} from '../socket';
import Sequencer from './Sequencer';
import history from '../history';
import { parse } from 'flatted';
import Chat from './Chat';
import Swal from 'sweetalert2';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      nickname: '',
      musician: '',
      musicianNickname: '',
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
    this.getSegment = this.getSegment.bind(this);
    this.sendTurn = this.sendTurn.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
    this.everyoneElseLeft = this.everyoneElseLeft.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.room, this.stateInfo);
    chatListener(this.getMessages);
    playerLeftListener(this.playerLeft);
    segmentListener(this.getSegment);
    turnListener(this.sendTurn);
    gameEndListener(this.revealSong);
  }

  stateInfo({
    thisPlayer,
    nickname,
    players,
    musician,
    musicianNickname,
    rounds,
    turn,
  }) {
    this.setState({
      thisPlayer: thisPlayer,
      nickname: nickname,
      players: players,
      musician: musician,
      musicianNickname: musicianNickname,
      rounds: rounds,
      turn: turn,
    });
  }

  getMessages(received) {
    this.setState({ chat: [...this.state.chat, received] });
  }

  playerLeft(departedPlayer) {
    let players = this.state.players || [];
    let updatedPlayers = players.map((player) => {
      if (player === departedPlayer) {
        player = null;
      }
      return player;
    });
    if (updatedPlayers.filter((player) => player !== null).length < 2) {
      this.everyoneElseLeft();
    } else {
      this.setState({ players: updatedPlayers });
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

  sendTurn(nextPlayer, musicianNickname, turn) {
    this.setState({
      musician: nextPlayer,
      musicianNickname: musicianNickname,
      isFirst: false,
      turn: turn,
    });
  }

  finishTurn(notesString, gridString) {
    passSegment(notesString, gridString);
    endTurn(this.state.rounds, this.state.turn, this.state.players);
  }

  revealSong() {
    history.push({
      pathname: `/song/${this.props.room}`,
      finalSong: this.state.finalSong,
    });
  }

  everyoneElseLeft() {
    Swal.fire({
      title: 'Error:',
      html: 'Sorry, it looks like everyone else left.',
      showCloseButton: true,
    });
    exitRoom(this.props.room);
    history.push({
      pathname: '/',
    });
  }

  render() {
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician || 'tbd';
    const musicianNickname = this.state.musicianNickname;
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
              {musicianNickname ? (
                <h2 className="game-title">
                  {musicianNickname} is composing now
                </h2>
              ) : (
                <div></div>
              )}
              <div className="game-chat">
                <Chat
                  roomId={room}
                  nickname={this.state.nickname}
                  chat={this.state.chat}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default GamePage;
