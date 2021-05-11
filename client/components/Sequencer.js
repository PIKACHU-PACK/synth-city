import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as Tone from "tone";
import classNames from "classnames";

const AMOUNT_OF_NOTES = 16;
const AMOUNT_OF_ROWS = 4;
//this looks like [0, 1, 2, 3, 5, 6] and so forth until it reaches the total
const numArray = Array.from(Array(AMOUNT_OF_NOTES).keys());

const CHOSEN_OCTAVE = "4";
const synth = new Tone.PolySynth().toDestination();

class Sequencer extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: this.generateGrid(),
      isPlaying: false,
      currentColumn: null,
    };
    this.generateGrid = this.generateGrid.bind(this);
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }

  generateGrid() {
    const grid = [];
    for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
      let column = [
        { note: "C", isActive: false },
        { note: "D", isActive: false },
        { note: "E", isActive: false },
        { note: "F", isActive: false },
        { note: "G", isActive: false },
        { note: "A", isActive: false },
        { note: "B", isActive: false },
      ];
      grid.push(column);
    }
    return grid;
  }

  handleNoteClick(clickedColumn, clickedNote) {
    // Shallow copy of our grid with updated isActive
    let updatedGrid = this.state.grid.map((column, columnIndex) =>
      column.map((cell, cellIndex) => {
        let cellCopy = cell;
        // Flip isActive for the clicked note-cell in our grid
        if (columnIndex === clickedColumn && cellIndex === clickedNote) {
          cellCopy.isActive = !cell.isActive;
        }
        return cellCopy;
      })
    );
    //Updates the grid with the new note toggled
    this.setState({ grid: updatedGrid });
  }

  async playMusic() {
    // Variable for storing our note in a appropriate format for our synth
    let music = [];

    this.state.grid.map((column) => {
      let columnNotes = [];
      column.map(
        (shouldPlay) =>
          //If isActive, push the given note, with our chosen octave
          shouldPlay.isActive &&
          columnNotes.push(shouldPlay.note + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    });

    // Starts our Tone context
    await Tone.start();

    // Tone.Sequence()
    //@param callback
    //@param "events" to send with callback
    //@param subdivision  to engage callback
    const Sequencer = new Tone.Sequence(
      (time, column) => {
        // Highlight column with styling
        this.setState({ currentColumn: column });
        //Sends the active note to our PolySynth
        synth.triggerAttackRelease(music[column], "8n", time);
      },
      numArray,
      "8n"
    );

    if (this.state.isPlaying) {
      // Turn of our player if music is currently playing
      this.setState({ isPlaying: false, currentColumn: null });

      await Tone.Transport.stop();
      await Sequencer.stop();
      await Sequencer.clear();
      await Sequencer.dispose();

      return;
    }
    this.setState({ isPlaying: true });
    // Toggles playback of our musical masterpiece
    await Sequencer.start();
    await Tone.Transport.start();
  }

  render() {
    return (
      <div className="sequencer">
        <div className="note-wrapper">
          {this.state.grid.map((column, columnIndex) => (
            <div
              className={classNames("note-column", {
                "note-column--active": this.state.currentColumn === columnIndex,
              })}
              key={columnIndex + "column"}
            >
              {column.map(({ note, isActive }, noteIndex) => (
                <NoteButton
                  note={note}
                  isActive={isActive}
                  onClick={() => this.handleNoteClick(columnIndex, noteIndex)}
                  key={note + columnIndex}
                />
              ))}
            </div>
          ))}
        </div>
        <button className="play-button" onClick={() => this.playMusic()}>
          {this.state.isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    );
  }
}

const NoteButton = ({ note, isActive, ...rest }) => {
  const classes = isActive ? "note note--active" : "note";
  return (
    <button className={classes} {...rest}>
      {note}
    </button>
  );
};

export default Sequencer;
