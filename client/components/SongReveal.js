import React from "react";
import * as Tone from "tone";
import { checkSynth, makeSynths } from "./HelperFunctions";
import history from "../history";
import { BPM } from "./Sequencer";

class SongReveal extends React.Component {
  constructor() {
    super();
    this.state = {
      started: false,
      beat: 0,
      playing: false,
      //recorder: new Tone.Recorder(),
      synths: [],
      finalSong: [],
    };
    this.configPlayButton = this.configPlayButton.bind(this);
    this.configLoop = this.configLoop.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goToWaitingRoom = this.goToWaitingRoom.bind(this);
    this.cleanUpFinalSong = this.cleanUpFinalSong.bind(this);
  }

  componentDidMount() {
    const synthsArr = makeSynths();
    this.setState({ synths: synthsArr });
    const finalCleanSong = this.cleanUpFinalSong(this.props.location.finalSong);
    this.setState({ finalSong: finalCleanSong });
  }

  cleanUpFinalSong(finalSongSegmented) {
    let newGrid = [[], [], [], [], [], [], []];

    for (let i = 0; i < finalSongSegmented.length; i++) {
      const currentSegment = finalSongSegmented[i];
      for (let j = 0; j < currentSegment.length; j++) {
        const currRow = currentSegment[j];
        currRow.forEach((note) => {
          newGrid[j].push(note);
        });
      }
    }
    return newGrid;
  }

  configLoop() {
    const fullSong = this.state.finalSong;
    //0: am, 1: plucky, 2: basic (order in state)
    const repeat = (time) => {
      fullSong.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          const synthIndex = checkSynth(note.synth);
          let synth = this.state.synths[synthIndex];
          synth.triggerAttackRelease(note.note + note.octave, "8n", time);
        }
      });
      this.setState({
        beat:
          (this.state.beat + 1) % (this.props.location.finalSong.length * 16),
      });
    };
    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, "8n");
  }

  configPlayButton(e) {
    if (!this.state.started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      this.setState({ started: true });
      this.configLoop();
    }
    if (this.state.playing) {
      e.target.innerText = "Play";
      Tone.Transport.stop();
      this.setState({
        playing: false,
        beat: 0,
      });
    } else {
      e.target.innerText = "Stop";
      Tone.Transport.start();
      this.setState({ playing: true });
    }
  }

  goHome() {
    history.push({
      pathname: "/",
    });
  }

  goToWaitingRoom() {
    history.push({
      pathname: `/waiting/${this.props.room}`,
    });
  }

  render() {
    return (
      <div className="song-reveal-view">
        <div className="song-reveal-banner">
          <h2 className="home-title">Your Masterpiece</h2>
        </div>

        <div className="toggle-play">
          <div className="play-container">
            <button
              className="play-button"
              onClick={(event) => this.configPlayButton(event)}
            >
              Play Song
            </button>
            <button className="play-button" onClick={this.goHome}>
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SongReveal;
