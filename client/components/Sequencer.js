import classNames from 'classnames';
import * as Tone from 'tone';
import React from 'react';
import { NoteButton } from './NoteButton';
import {
  makeGrid,
  makeSynths,
  checkWhichSynth,
  songCleanUp,
} from './HelperFunctions';
import { stringify } from 'flatted';
import { Timer } from 'react-countdown-clock-timer';

export const AMOUNT_OF_NOTES = 18;
export const notes = ['COUNT', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BPM = 120;
export const turnLength = 10;

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
      firstBeat: true,
    };
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.chooseSynth = this.chooseSynth.bind(this);
    this.octaveDropDown = this.octaveDropDown.bind(this);
    this.onTurnEnd = this.onTurnEnd.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.addPreviousNotes = this.addPreviousNotes.bind(this);
    this.configLoop = this.configLoop.bind(this);
    this.timerEnd = this.timerEnd.bind(this);
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
    Tone.start();
    Tone.getDestination().volume.rampTo(-10, 0.001);
  }

  configLoop() {
    //0: am, 1: plucky, 2: basic (order in state)
    const repeat = (time) => {
      this.state.grid.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          const synthIndex = checkWhichSynth(note.synth);
          let synth = this.state.synths[synthIndex];
          synth.triggerAttackRelease(note.note + note.octave, '8n', time);
        }
      });
      const amountOfNotes = this.props.isFirst
        ? AMOUNT_OF_NOTES - 2
        : AMOUNT_OF_NOTES;

      if (this.state.beat === amountOfNotes - 1) {
        this.setState({ beat: 0, firstBeat: false });
      } else {
        this.setState({
          beat: this.state.beat + 1,
          firstBeat: true,
        });
      }
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
          if ((noteIndex === 0 || noteIndex === 1) && !this.props.isFirst) {
            return;
          }
          note.isActive = !note.isActive;
          note.synth = this.state.currSynth;
          note.octave = this.state.octave;
          if (note.isActive) {
            const synthIndex = checkWhichSynth(note.synth);
            let synth = this.state.synths[synthIndex];
            synth.triggerAttackRelease(note.note + note.octave, '8n');
          }

          e.target.className = classNames(
            'note',
            { 'note-not-active': !note.isActive },
            {
              'fuchsia-synth': note.synth === 'basicSynth' && note.isActive,
            },
            {
              'blue-synth': note.synth === 'pluckySynth' && note.isActive,
            },

            { 'orange-synth': note.synth === 'amSynth' && note.isActive }
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
    if (newOctave !== 'none') {
      this.setState({ octave: newOctave });
    }
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
    let rowGrid = makeGrid(notes, this.props.isFirst);
    if (!this.props.isFirst) {
      const newGrid = this.addPreviousNotes(rowGrid);
      this.setState({ grid: newGrid });
    } else {
      this.setState({ grid: rowGrid });
    }
  }

  timerEnd() {
    const lastNotes = this.onTurnEnd();
    const sendNotes = stringify(lastNotes);
    const cleanGrid = songCleanUp(this.state.grid, this.props.isFirst);
    const sendGrid = stringify(cleanGrid);
    this.props.finishTurn(sendNotes, sendGrid);
  }

  render() {
    return (
      <div className="sequencer-view">
        <Timer
          durationInSeconds={turnLength}
          onFinish={() => {
            this.timerEnd();
          }}
        />

        <div id="synth-options-container">
          <h2 className="game-title">Let's Make Some Jams!</h2>
        </div>
        <div>
          <div id="synth-options-container">
            <button
              className="main-cta"
              id="orange-synth-button"
              onClick={() => this.chooseSynth('amSynth')}
            >
              AM Synth
            </button>
            <button
              className="main-cta"
              id="blue-synth-button"
              onClick={() => this.chooseSynth('pluckySynth')}
            >
              Plucky Synth
            </button>
            <button
              className="main-cta"
              id="fuchsia-synth-button"
              onClick={() => this.chooseSynth('basicSynth')}
            >
              Basic Synth
            </button>
            <p></p>
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
                        firstBeat={this.state.firstBeat}
                        isFirst={this.props.isFirst}
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

export default Sequencer;
