import React from 'react';
import { turnListener } from '../socket';
import Sequencer from './Sequencer';

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: '',
    };
  }

  componentDidMount() {
    turnListener();
  }

  render() {
    return (
      <div>
        <h2>Playing</h2>
        <Sequencer />
      </div>
    );
  }
}

export default GamePage;
