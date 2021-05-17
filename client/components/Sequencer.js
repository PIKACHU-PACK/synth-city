import classNames from 'classnames';
import * as Tone from 'tone';
import React from 'react';
import { NoteButton } from './NoteButton';
import {
  makeGrid,
  makeSynths,
  basicSynth,
  amSynth,
  pluckySynth,
  lastNotesSeed,
} from './HelperFunctions';

export const AMOUNT_OF_NOTES = 16;
export const notes = ['COUNT', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BPM = 120;
const PREVIOUS_COLUMNS_TOTAL = 2;

class Sequencer extends React.Component {
  constructor() {
    super();
    this.state = {
      synths: [],
      grid: [],
      beat: 0,
      playing: false,
      started: false,
      currSynth: basicSynth,
      octave: '4',
      previousNotes: lastNotesSeed,
      nextNotes: [],
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.chooseSynth = this.chooseSynth.bind(this);
    this.octaveDropDown = this.octaveDropDown.bind(this);
    this.onTurnEnd = this.onTurnEnd.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
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
          note.synth.triggerAttackRelease(note.note + note.octave, '8n', time);
        }
      });
      this.setState({ beat: (this.state.beat + 1) % AMOUNT_OF_NOTES });
    };

    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  }

  handleNoteClick(clickedRowIndex, clickedNoteIndex, e) {
    let newGrid = this.state.grid.map((row, rowIndex) => {
      row.map((note, noteIndex) => {
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          if (typeof note.note === 'number') {
            return;
          }
          note.isActive = !note.isActive;
          note.synth = this.state.currSynth;
          note.octave = this.state.octave;
          e.target.className = classNames(
            'note',
            { 'note-not-active': !note.isActive },
            {
              'green-synth': note.synth === basicSynth && note.isActive,
            },
            {
              'blue-synth': note.synth === pluckySynth && note.isActive,
            },
            { 'red-synth': note.synth === amSynth && note.isActive }
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
      this.setState({ started: true });
      this.configLoop();
    }
    if (this.state.playing) {
      e.target.innerText = 'Play';
      Tone.Transport.stop();
      this.setState({
        playing: false,
        beat: 0,
      });
    } else {
      e.target.innerText = 'Stop';
      Tone.Transport.start();
      this.setState({ playing: true });
    }
  }

  chooseSynth(type) {
    let synthType;
    if (type == 'amSynth') {
      synthType = amSynth;
    } else if (type === 'basicSynth') {
      synthType = basicSynth;
    } else if (type === 'pluckySynth') {
      synthType = pluckySynth;
    }
    this.setState({ currSynth: synthType });
  }

  octaveDropDown(evt) {
    const newOctave = evt.target.value;
    this.setState({ octave: newOctave });
  }

  onTurnEnd() {
    let count = 0;
    const nextNotes = new Array(PREVIOUS_COLUMNS_TOTAL).fill([]);
    let grid = this.state.grid;
    for (let i = 1; i < grid.length; i++) {
      let row = grid[i];
      for (let j = row.length - PREVIOUS_COLUMNS_TOTAL; j < row.length; j++) {
        let currNote = row[j];
        if (currNote.isActive) {
          nextNotes[count].push(currNote);
        }
        count++;
      }
      count = 0;
    }
    this.setState({ nextNotes: nextNotes });
  }

  clearGrid() {
    //NOT WORKING YET TBD
    // const newGrid = makeGrid(notes);
    // this.setState({ grid: newGrid });
    // console.log("new gri is", this.state.grid);
  }

  render() {
    console.log('state is', this.state);
    return (
      <div>
        <div>
          <h2>Let's Make Some Jams!</h2>
        </div>
        <div>
          <div>
            <select
              name="octave"
              className="custom-select"
              id="octave"
              onChange={this.octaveDropDown}
            >
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <button
              className="main-cta"
              onClick={() => this.chooseSynth('amSynth')}
            >
              AM Synth (Red)
            </button>
            <button
              className="main-cta"
              onClick={() => this.chooseSynth('pluckySynth')}
            >
              Plucky Synth (Blue)
            </button>
            <button
              className="main-cta"
              onClick={() => this.chooseSynth('basicSynth')}
            >
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
                key={rowIndex + 'row'}
              >
                {row.map(({ note, isActive }, noteIndex) => {
                  return (
                    <NoteButton
                      note={note}
                      key={noteIndex + 'note'}
                      isActive={isActive}
                      currSynth={this.state.currSynth}
                      beat={this.state.beat}
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
              id="play-button"
              className="play-button"
              onClick={(event) => this.configPlayButton(event)}
            >
              Play
            </button>
            <button className="play-button" onClick={this.clearGrid}>
              Clear
            </button>
            <button className="play-button" onClick={this.onTurnEnd}>
              End Turn
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Sequencer;
