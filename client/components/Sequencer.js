import classNames from "classnames";
import * as Tone from "tone";
import React from "react";

const AMOUNT_OF_NOTES = 16;
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
const BPM = 120;
const rowGrid = makeGrid(notes);
const synthsArr = makeSynths(6);

export default class Sequencer extends React.Component {
  constructor() {
    super();
    this.state = {
      synths: [],
      grid: [], //[[{note, isActive}, {note, isActive}], [{note, isActive}, {note, isActive}]]
      beat: 0,
      playing: false,
      started: false,
      currentColumn: false,
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
  }

  componentDidMount() {
    const rowGrid = makeGrid(notes);
    const synthsArr = makeSynths(6);
    this.setState({ grid: rowGrid, synths: synthsArr });
  }

  configLoop() {
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        let synth = this.state.synths[index];
        let note = row[this.state.beat];
        if (synth && note.isActive) {
          synth.triggerAttackRelease(note.note, "8n", time);
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
          e.target.className = classNames(
            "note",
            { "note-is-active": !!note.isActive },
            { "note-not-active": !note.isActive }
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

  render() {
    //console.log("state in render is ", this.state);
    return (
      <div>
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
                      key={noteIndex + "note"}
                      isActive={isActive}
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

const NoteButton = ({ note, isActive, ...rest }) => {
  const classes = isActive ? "note note-is-active" : "note";
  return (
    <button className={classes} {...rest}>
      {note}
    </button>
  );
};

function makeGrid(notes) {
  // our "notation" will consist of an array with 6 sub arrays
  // each sub array corresponds to one row in our sequencer grid
  // parent array to hold each rows subarray
  const rows = [];

  for (const note of notes) {
    // declare the subarray
    const row = [];
    // each subarray contains multiple objects that have an assigned note
    // and a boolean to flag whether they are "activated"
    // each element in the subarray corresponds to one eigth note
    for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }
  // we now have 6 rows each containing 16 eighth notes
  return rows;
}

function makeSynths(count) {
  // MAKE DIFFERENT SYNTHS LATER ON INSTEAD
  const synths = [];
  for (let i = 0; i < count; i++) {
    let synth = new Tone.Synth({
      oscillator: {
        type: "square8",
      },
    }).toDestination();
    synths.push(synth);
  }
  return synths;
}
