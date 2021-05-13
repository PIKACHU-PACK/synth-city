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
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
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
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.amSynthButton = this.amSynthButton.bind(this);
  }

  componentDidMount() {
    const rowGrid = makeGrid(notes);
    const synthsArr = makeSynths(basicSynth);
    this.setState({ grid: rowGrid, synths: synthsArr });
  }

  configLoop() {
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        //let synth = this.state.synths[index];
        let note = row[this.state.beat];
        if (note.isActive) {
          note.synth.triggerAttackRelease(note.note, "8n", time);
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
          e.target.className = classNames(
            "note",
            { "note-is-active": !!note.isActive },
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
    console.log("state in handleNoteClick is ", this.state);
  }

  configPlayButton(e) {
    if (!this.state.started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      this.configLoop();
      this.setState({ started: true });
    }
    //might need something that sets started to false below
    if (this.state.playing) {
      e.target.innerText = "Play";
      Tone.Transport.stop();
      this.setState({ playing: false, currentColumn: null });
    } else {
      e.target.innerText = "Stop";
      Tone.Transport.start();
      this.setState({ playing: true });
    }
  }

  amSynthButton(type) {
    let synthType;
    if (type == "amSynth") {
      synthType = amSynth;
    } else if (type === "basicSynth") {
      synthType = basicSynth;
    } else if (type === "pluckySynth") {
      synthType = pluckySynth;
    }
    this.setState({ currSynth: synthType });
    //synths: makeSynths(synthType),
  }

  render() {
    return (
      <div>
        <div>
          <h2>Let's Make Some Jams!</h2>
        </div>
        <div>
          <div>
            <button onClick={() => this.amSynthButton("amSynth")}>
              AM Synth (Red)
            </button>
            <button onClick={() => this.amSynthButton("pluckySynth")}>
              Plucky Synth (Blue)
            </button>
            <button onClick={() => this.amSynthButton("basicSynth")}>
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
