import React from 'react';
import { turnListener } from '../socket';
import Sequencer from './Sequencer';

export class GamePage extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    turnListener();
  }
  render() {
    return (
      <div>
        <Sequencer />
      </div>
    );
  }
}

export default GamePage;
