import React from 'react';
import { getInfo, turnListener, endTurn, gameEndListener } from '../socket';
import Sequencer from './Sequencer';
import { Timer } from 'react-countdown-clock-timer';
import { parse } from 'flatted';
import history from '../history';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      musician: '',
      notes: [],
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.setTurn = this.setTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
    turnListener(this.setTurn);
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

  setTurn(nextPlayer, notesStr) {
    const notes = parse(notesStr);
    this.setState({ musician: nextPlayer, notes: notes });
  }

  finishTurn(notesStr) {
    endTurn(this.props.match.params.roomId, notesStr);
  }

  revealSong() {
    history.push({
      pathname: `/song/${this.props.match.params.roomId}`,
    });
  }

  render() {
    const room = this.props.match.params.roomId;
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;
    console.log('GamePageState:', this.state);

    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>
            {/* <Timer
              durationInSeconds={4}
              onFinish={() => this.finishTurn(room)}
            /> */}
            <Sequencer finishTurn={this.finishTurn} />
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
