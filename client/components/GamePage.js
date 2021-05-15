import React from 'react';
import { getInfo, turnListener } from '../socket';
import Sequencer from './Sequencer';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
    };
    this.stateInfo = this.stateInfo.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
    turnListener();
  }

  stateInfo(info) {
    const { thisPlayer, players } = info;
    this.setState({ thisPlayer: thisPlayer, players: players });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h2>Playing</h2>
        <Sequencer />
      </div>
    );
  }
}

export default GamePage;
