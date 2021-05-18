import React from "react";
import { getInfo, turnListener, endTurn, gameEndListener } from "../socket";
import Sequencer from "./Sequencer";
import { Timer } from "react-countdown-clock-timer";
import history from "../history";

export class GamePage extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      thisPlayer: "",
      musician: "",
      lastNotes: [],
      finalSong: [],
      isFirst: true,
    };
    this.stateInfo = this.stateInfo.bind(this);
    // this.finishTurn = this.finishTurn.bind(this);
    this.setUpTurn = this.setUpTurn.bind(this);
    this.revealSong = this.revealSong.bind(this);
    this.passData = this.passData.bind(this);
    this.changeLastNotes = this.changeLastNotes.bind(this);
    this.changeIsFirst = this.changeIsFirst.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.match.params.roomId, this.stateInfo);
    turnListener(this.setUpTurn);
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

  setUpTurn(nextPlayer) {
    this.setState({ musician: nextPlayer });
  }

  changeLastNotes(lastNotes) {
    this.setState({ lastNotes: lastNotes });
  }

  changeIsFirst() {
    //this.setState({ isFirst: false });
  }

  revealSong() {
    history.push({
      pathname: `/song/${this.props.match.params.roomId}`,
    });
  }

  passData(finalSong, lastNotes) {
    // this.setState({ finalSong: finalSong, lastNotes: lastNotes });
  }

  render() {
    console.log("state in render is", this.state);
    // if (this.state.musician.length > 1) {
    //   this.setState({ isFirst: true });
    // }
    const room = this.props.match.params.roomId;
    const thisPlayer = this.state.thisPlayer;
    const musician = this.state.musician;
    return (
      <>
        {thisPlayer === musician ? (
          <>
            <h2>PLAYING</h2>
            {/* <Timer
              durationInSeconds={4}
              onFinish={() => this.finishTurn(room)}
            /> */}
            <Sequencer
              // playerOrder={this.state.players}
              isFirst={this.state.isFirst}
              // passData={this.passData}
              // lastNotes={this.state.lastNotes}
              // finalSong={this.finalSong}
              room={room}
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
