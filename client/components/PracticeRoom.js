import classNames from "classnames";
import * as Tone from "tone";
import React from "react";
import { NoteButton } from "./NoteButton";
import {
  makeGrid,
  makeSynths,
  basicSynth,
  amSynth,
  pluckySynth,
  checkWhichSynth,
} from "./HelperFunctions";
import { AMOUNT_OF_NOTES, BPM, notes } from "./Sequencer";
import history from '../history';

class PracticeRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      synths: [],
      grid: [],
      beat: 0,
      playing: false,
      started: false,
      currSynth: "basicSynth",
      octave: "4",
      firstBeat: true,
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.chooseSynth = this.chooseSynth.bind(this);
    this.octaveDropDown = this.octaveDropDown.bind(this);
    this.configLoop = this.configLoop.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  componentDidMount() {
    Tone.start();
    Tone.getDestination().volume.rampTo(-10, 0.001);
    const rowGrid = makeGrid(notes, true);
    const synthsArr = makeSynths(basicSynth);
    this.setState({ grid: rowGrid, synths: synthsArr });
  }

  configLoop() {
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          const synthIndex = checkWhichSynth(note.synth);
          let synth = this.state.synths[synthIndex];
          synth.triggerAttackRelease(note.note + note.octave, "8n", time);
        }
      });
      if (this.state.beat === 15) {
        this.setState({ beat: 0, firstBeat: false });
      } else {
        this.setState({ beat: this.state.beat + 1, firstBeat: true });
      }
    };

    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, "8n");
  }

  handleNoteClick(clickedRowIndex, clickedNoteIndex, e) {
    let newGrid = this.state.grid.map((row, rowIndex) => {
      row.map((note, noteIndex) => {
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          if (typeof note.note === "number") {
            return;
          }
          note.isActive = !note.isActive;
          note.synth = this.state.currSynth;
          note.octave = this.state.octave;
          if (note.isActive) {
            const synthIndex = checkWhichSynth(note.synth);
            let synth = this.state.synths[synthIndex];
            synth.triggerAttackRelease(note.note + note.octave, "8n");
          }

          e.target.className = classNames(
            "note",
            { "note-not-active": !note.isActive },
            {
              "fuchsia-synth": note.synth === basicSynth && note.isActive,
            },
            {
              "blue-synth": note.synth === pluckySynth && note.isActive,
            },
            { "orange-synth": note.synth === amSynth && note.isActive }
          );
        }
        return note;
      });
      return row;
    });
    this.setState({ grid: newGrid });
  }

  configPlayButton(e) {
    if (!this.state.started) {
      // Tone.start();
      // Tone.getDestination().volume.rampTo(-10, 0.001);
      this.configLoop();
      this.setState({ started: true });
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

  chooseSynth(type) {
    this.setState({ currSynth: type });
  }

  octaveDropDown(evt) {
    const newOctave = evt.target.value;
    if (newOctave !== "none") {
      this.setState({ octave: newOctave });
    }
  }

  clearGrid() {
    let rowGrid = makeGrid(notes, true);
    this.setState({ grid: rowGrid });
  }

  goHome() {
    history.push({
      pathname: '/',
    });
  }

  render() {
    return (
      <div>
        <div id="synth-options-container">
          <h2 id="title-header">Let's Make Some Jams!</h2>
        </div>
        <div className="home-button-container">
          <button type="button" className="home-button" onClick={this.goHome}>
            <img src={'/homebutton.png'} className="home-arrow-img" />
          </button>
        </div>
        <div>
          <div id="synth-options-container">
            <button
              className="main-cta"
              id="orange-synth-button"
              onClick={() => this.chooseSynth("amSynth")}
            >
              AM Synth
            </button>
            <button
              className="main-cta"
              id="blue-synth-button"
              onClick={() => this.chooseSynth("pluckySynth")}
            >
              Plucky Synth
            </button>
            <button
              className="main-cta"
              id="fuchsia-synth-button"
              onClick={() => this.chooseSynth("basicSynth")}
            >
              Basic Synth
            </button>
          </div>
          <div id="synth-options-container">
            <select
              name="octave"
              className="custom-select"
              id="octave"
              onChange={this.octaveDropDown}
            >
              <option value="none">Octaves:</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <p></p>
        <div id="sequencer" className="container sequencer">
          {this.state.grid.map((row, rowIndex) => {
            return (
              <div
                id="rowIndex"
                className="sequencer-row"
                key={rowIndex + "row"}
              >
                {row.map(({ note, isActive, synth, octave }, noteIndex) => {
                  return (
                    <NoteButton
                      note={note}
                      key={noteIndex + "note"}
                      isActive={isActive}
                      beat={this.state.beat}
                      synth={synth}
                      octave={octave}
                      isPrevious={false}
                      firstBeat={this.state.firstBeat}
                      onClick={(event) =>
                        this.handleNoteClick(rowIndex, noteIndex, event)
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="toggle-play">
          <div className="play-container">
            <button
              className="play-button"
              onClick={(event) => this.configPlayButton(event)}
            >
              Play
            </button>
            <button className="play-button" onClick={this.clearGrid}>
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PracticeRoom;
