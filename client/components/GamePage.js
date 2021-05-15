import React from 'react';
import { getInfo, turnListener, endTurn } from '../socket';
import Sequencer from './Sequencer';
import { Timer } from 'react-countdown-clock-timer';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
      musician: '',
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.changeMusician = this.changeMusician.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
    turnListener(this.changeMusician);
  }

  stateInfo(info) {
    const { thisPlayer, players, musician } = info;
    this.setState({
      thisPlayer: thisPlayer,
      players: players,
      musician: musician,
    });
  }

  changeMusician(nextPlayer) {
    this.setState({ musician: nextPlayer });
  }

  finishTurn(room) {
    endTurn(room);
  }

  render() {
    const room = this.props.match.params.roomId;
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;

    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>
            <Timer
              durationInSeconds={4}
              onFinish={() => this.finishTurn(room)}
            />
            <Sequencer />
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
