import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as Tone from "tone";
//import classNames from "classnames";

const AMOUNT_OF_NOTES = 16;
const AMOUNT_OF_ROWS = 4;

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
    let updatedGrid = grid.map((column, columnIndex) =>
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

  render() {
    return (
      <div>
        <div className="note-wrapper">
          {grid.map((column, columnIndex) => (
            <div
              className={classNames("note-column", {
                "note-column--active": currentColumn === columnIndex,
              })}
              key={columnIndex + "column"}
            >
              {column.map(({ note, isActive }, noteIndex) => (
                <NoteButton
                  note={note}
                  isActive={isActive}
                  onClick={() => handleNoteClick(columnIndex, noteIndex)}
                  key={note + columnIndex}
                />
              ))}
            </div>
          ))}
        </div>
        <button className="play-button" onClick={() => PlayMusic()}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    );
  }
}

export default Sequencer;
