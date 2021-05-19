import React from 'react';
import { getInfo, turnListener, endTurn, gameEndListener } from '../socket';
import Sequencer from './Sequencer';
import history from '../history';
import { parse } from 'flatted';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      musician: '',
      previousNotes: [],
      isFirst: true,
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
    this.setState({
      musician: nextPlayer,
      previousNotes: notes,
      isFirst: false,
      finalSong: [...this.state.finalSong, ...segment],
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

    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>

            <Sequencer
              finishTurn={this.finishTurn}
              previousNotes={this.state.previousNotes}
              isFirst={this.state.isFirst}
            />
          </>
        ) : (
          <>
            <h2>WAITING</h2>
          </>
        )}
      </>
    );
  }
}

export default GamePage;
