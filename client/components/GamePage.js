<<<<<<< HEAD
import React from 'react';
import { getInfo, turnListener, endTurn, gameEndListener } from '../socket';
import Sequencer from './Sequencer';
import { Timer } from 'react-countdown-clock-timer';
import { parse } from 'flatted';
import history from '../history';
=======
import React from "react";
import { getInfo, turnListener, endTurn, gameEndListener } from "../socket";
import Sequencer from "./Sequencer";
import history from "../history";
import { parse } from "flatted";
>>>>>>> 37abd7c1ed90e09db5586ac4ff811d29ddbde98b

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
<<<<<<< HEAD
      thisPlayer: '',
      musician: '',
      notes: [],
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.setTurn = this.setTurn.bind(this);
=======
      thisPlayer: "",
      musician: "",
      previousNotes: [],
      isFirst: true,
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.sendTurn = this.sendTurn.bind(this);
>>>>>>> 37abd7c1ed90e09db5586ac4ff811d29ddbde98b
    this.revealSong = this.revealSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
<<<<<<< HEAD
    turnListener(this.setTurn);
=======
    turnListener(this.sendTurn);
>>>>>>> 37abd7c1ed90e09db5586ac4ff811d29ddbde98b
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

<<<<<<< HEAD
  setTurn(nextPlayer, notesStr) {
    const notes = parse(notesStr);
    this.setState({ musician: nextPlayer, notes: notes });
  }

  finishTurn(notesStr) {
    endTurn(this.props.match.params.roomId, notesStr);
=======
  sendTurn(nextPlayer, notesStr) {
    const notes = parse(notesStr);
    this.setState({
      musician: nextPlayer,
      previousNotes: notes,
      isFirst: false,
    });
  }

  finishTurn(notesString, gridString) {
    endTurn(this.props.match.params.roomId, notesString, gridString);
>>>>>>> 37abd7c1ed90e09db5586ac4ff811d29ddbde98b
  }

  revealSong() {
    history.push({
      pathname: `/song/${this.props.match.params.roomId}`,
    });
  }

  render() {
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;
    console.log('GamePageState:', this.state);

    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>
<<<<<<< HEAD
            {/* <Timer
              durationInSeconds={4}
              onFinish={() => this.finishTurn(room)}
            /> */}
            <Sequencer finishTurn={this.finishTurn} />
=======

            <Sequencer
              finishTurn={this.finishTurn}
              previousNotes={this.state.previousNotes}
              isFirst={this.state.isFirst}
            />
>>>>>>> 37abd7c1ed90e09db5586ac4ff811d29ddbde98b
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
