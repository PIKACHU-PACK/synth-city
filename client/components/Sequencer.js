import classNames from 'classnames';
import * as Tone from 'tone';
import React from 'react';
import { NoteButton } from './NoteButton';
import { makeGrid, makeSynths } from './HelperFunctions';
import { stringify } from 'flatted';
import { Timer } from 'react-countdown-clock-timer';

export const AMOUNT_OF_NOTES = 18;
export const notes = ['COUNT', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BPM = 120;

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      synths: [],
      grid: [],
      beat: 0,
      playing: false,
      started: false,
      currSynth: 'basicSynth',
      octave: '4',
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.chooseSynth = this.chooseSynth.bind(this);
    this.octaveDropDown = this.octaveDropDown.bind(this);
    this.onTurnEnd = this.onTurnEnd.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.addPreviousNotes = this.addPreviousNotes.bind(this);
    this.configLoop = this.configLoop.bind(this);
  }

  componentDidMount() {
    let rowGrid = makeGrid(notes, this.props.isFirst);
    const synthsArr = makeSynths();
    if (!this.props.isFirst) {
      const newGrid = this.addPreviousNotes(rowGrid);
      this.setState({ grid: newGrid, synths: synthsArr });
    } else {
      this.setState({ grid: rowGrid, synths: synthsArr });
    }
  }

  configLoop() {
    //0: am, 1: plucky, 2: basic (order in state)
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          let synth;
          if (note.synth === 'amSynth') {
            synth = this.state.synths[0];
          } else if (note.synth === 'pluckySynth') {
            synth = this.state.synths[1];
          } else if (note.synth === 'basicSynth') {
            synth = this.state.synths[2];
          }
          synth.triggerAttackRelease(note.note + note.octave, '8n', time);
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
          if (noteIndex === 0 || noteIndex === 1) {
            return;
          }
          note.isActive = !note.isActive;
          note.synth = this.state.currSynth;
          note.octave = this.state.octave;
          e.target.className = classNames(
            'note',
            { 'note-not-active': !note.isActive },
            {
              'green-synth': note.synth === 'basicSynth' && note.isActive,
            },
            {
              'blue-synth': note.synth === 'pluckySynth' && note.isActive,
            },
            { 'red-synth': note.synth === 'amSynth' && note.isActive }
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
    this.setState({ currSynth: type });
  }

  octaveDropDown(evt) {
    const newOctave = evt.target.value;
    this.setState({ octave: newOctave });
  }

  onTurnEnd() {
    let penultimate = 16;
    let ultimate = 17;
    if (this.props.isFirst) {
      penultimate = 14;
      ultimate = 15;
    }
    const nextNotes = [];
    let grid = this.state.grid.slice();
    for (let i = 1; i < grid.length; i++) {
      let currRow = grid[i];
      let newRow = [];
      newRow.push(currRow[penultimate]);
      newRow.push(currRow[ultimate]);
      nextNotes.push(newRow);
    }
    Tone.Transport.stop();
    return nextNotes;
  }

  addPreviousNotes(grid) {
    if (this.props.previousNotes[0][0] !== null) {
      let newGrid = grid.map((eachRow, rowIndex) => {
        if (rowIndex === 0) {
          return eachRow;
        }
        let newRow = eachRow.map((eachCol, colIndex) => {
          if (colIndex === 0) {
            eachCol = this.props.previousNotes[rowIndex - 1][0];
            eachCol['isPrevious'] = true;
            return eachCol;
          } else if (colIndex === 1) {
            eachCol = this.props.previousNotes[rowIndex - 1][1];
            eachCol['isPrevious'] = true;
            return eachCol;
          } else {
            return eachCol;
          }
        });
        return newRow;
      });
      return newGrid;
    } else {
      return grid;
    }
  }

  clearGrid() {
    //NOT WORKING YET TBD
    // const newGrid = makeGrid(notes);
    // this.setState({ grid: newGrid });
    // console.log("new gri is", this.state.grid);
  }

  render() {
    const turnLength = 3;
    return (
      <div>
        <Timer
          durationInSeconds={turnLength}
          onFinish={() => {
            const lastNotes = this.onTurnEnd();
            const sendNotes = stringify(lastNotes);
            const sendGrid = stringify(this.state.grid);
            this.props.finishTurn(sendNotes, sendGrid);
          }}
        />
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
                {row.map(
                  (
                    { note, isActive, synth, isPrevious, octave },
                    noteIndex
                  ) => {
                    return (
                      <NoteButton
                        note={note}
                        key={noteIndex + 'note'}
                        isActive={isActive}
                        beat={this.state.beat}
                        synth={synth}
                        octave={octave}
                        isPrevious={isPrevious}
                        onClick={(event) =>
                          this.handleNoteClick(rowIndex, noteIndex, event)
                        }
                      />
                    );
                  }
                )}
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
