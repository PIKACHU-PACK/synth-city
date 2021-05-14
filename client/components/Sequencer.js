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
} from "./HelperFunctions";

export const AMOUNT_OF_NOTES = 16;
const notes = ["C", "D", "E", "F", "G", "A", "B"];
const BPM = 120;

class Sequencer extends React.Component {
  constructor() {
    super();
    this.state = {
      synths: [],
      grid: [],
      beat: 0,
      playing: false,
      started: false,
      currentColumn: false,
      currSynth: basicSynth,
      octave: "4",
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.chooseSynth = this.chooseSynth.bind(this);
    this.octaveDropDown = this.octaveDropDown.bind(this);
  }

  componentDidMount() {
    const rowGrid = makeGrid(notes);
    const synthsArr = makeSynths(basicSynth);
    this.setState({ grid: rowGrid, synths: synthsArr });
  }

  configLoop() {
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          note.synth.triggerAttackRelease(note.note + note.octave, "8n", time);
        }
      });
      this.setState({ beat: (this.state.beat + 1) % AMOUNT_OF_NOTES });
    };

    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, "8n");
  }

  handleNoteClick(clickedRowIndex, clickedNoteIndex, e) {
    let newGrid = this.state.grid.map((row, rowIndex) => {
      row.map((note, noteIndex) => {
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          note.isActive = !note.isActive;
          note.synth = this.state.currSynth;
          note.octave = this.state.octave;
          e.target.className = classNames(
            "note",
            { "note-not-active": !note.isActive },
            {
              "green-synth": note.synth === basicSynth && note.isActive,
            },
            {
              "blue-synth": note.synth === pluckySynth && note.isActive,
            },
            { "red-synth": note.synth === amSynth && note.isActive }
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
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      this.configLoop();
      this.setState({ started: true });
    }
    if (this.state.playing) {
      e.target.innerText = "Play";
      Tone.Transport.stop();
      this.setState({
        playing: false,
        currentColumn: null,
        beat: 0,
        started: false,
      });
    } else {
      e.target.innerText = "Stop";
      Tone.Transport.start();
      this.setState({ playing: true });
    }
  }

  chooseSynth(type) {
    let synthType;
    if (type == "amSynth") {
      synthType = amSynth;
    } else if (type === "basicSynth") {
      synthType = basicSynth;
    } else if (type === "pluckySynth") {
      synthType = pluckySynth;
    }
    this.setState({ currSynth: synthType });
  }

  octaveDropDown(evt) {
    const newOctave = evt.target.value;
    this.setState({ octave: newOctave });
  }

  render() {
    return (
      <div>
        <div>
          <h2>Let's Make Some Jams!</h2>
        </div>
        <div>
          <div>
            <select name="octave" id="octave" onChange={this.octaveDropDown}>
              <option selected hidden>
                Octave:
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
            <button onClick={() => this.chooseSynth("amSynth")}>
              AM Synth (Red)
            </button>
            <button onClick={() => this.chooseSynth("pluckySynth")}>
              Plucky Synth (Blue)
            </button>
            <button onClick={() => this.chooseSynth("basicSynth")}>
              Basic Synth (Green)
            </button>
            <p></p>
          </div>
        </div>
        <div id="sequencer" className="container sequencer">
          {this.state.grid.map((row, rowIndex) => {
            return (
              <div
                id="rowIndex"
                className="sequencer-row"
                key={rowIndex + "row"}
              >
                {row.map(({ note, isActive }, noteIndex) => {
                  return (
                    <NoteButton
                      note={note}
                      key={noteIndex + "note"}
                      isActive={isActive}
                      currSynth={this.state.currSynth}
                      className="note"
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
          <button
            id="play-button"
            className="play-button"
            onClick={(event) => this.configPlayButton(event)}
          >
            Play
          </button>
        </div>
      </div>
    );
  }
}

export default Sequencer;
