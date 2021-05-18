import React from "react";
import { getInfo, turnListener, endTurn, gameEndListener } from "../socket";
import Sequencer from "./Sequencer";
import history from "../history";
import { parse } from "flatted";
import { lastNotesSeed } from "./HelperFunctions";

// let previousNotes = lastNotesSeed;

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: "",
      musician: "",
      previousNotes: lastNotesSeed,
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

  sendTurn(nextPlayer, notesStr) {
    const notes = parse(notesStr);
    console.log("setting turn, parsed notes is", notes);
    this.setState({ musician: nextPlayer, previousNotes: notes });
  }

  finishTurn(notesString) {
    endTurn(this.props.match.params.roomId, notesString);
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

    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>

            <Sequencer
              finishTurn={this.finishTurn}
              previousNotes={this.state.previousNotes}
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
