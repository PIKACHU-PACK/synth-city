import { AMOUNT_OF_NOTES } from "./Sequencer";
import * as Tone from "tone";

export const amSynth = new Tone.AMSynth({
  oscillator: {
    type: "square",
  },
}).toDestination();
export const pluckySynth = new Tone.PluckSynth().toDestination();
export const basicSynth = new Tone.Synth({
  oscillator: {
    type: "sawtooth",
  },
}).toDestination();

export function makeSynths() {
  // MAKE DIFFERENT SYNTHS LATER ON INSTEAD
  const synths = [];
  synths.push(amSynth, pluckySynth, basicSynth);
  return synths;
}

const countArray = Array.from({ length: 18 }, (_, i) => i + 1);

export function makeGrid(notes, isFirst) {
  let currHeaderCount = 0;
  let CORRECT_TOTAL = AMOUNT_OF_NOTES;
  if (isFirst) {
    CORRECT_TOTAL = CORRECT_TOTAL - 2;
  }
  const rows = [];
  for (const note of notes) {
    const col = [];
    for (let i = 0; i < CORRECT_TOTAL; i++) {
      if (note === "COUNT") {
        col.push({
          note: countArray[currHeaderCount],
          isActive: false,
          isPrevious: false,
        });
        currHeaderCount++;
      } else {
        col.push({
          note: note,
          isActive: false,
          synth: "basicSynth",
          octave: "4",
          isPrevious: false,
        });
      }
    }
    rows.push(col);
  }
  return rows;
}

export function checkSynth(stringName) {
  let synthIndex;
  if (stringName === "amSynth") {
    synthIndex = 0;
  } else if (stringName === "pluckySynth") {
    synthIndex = 1;
  } else if (stringName === "basicSynth") {
    synthIndex = 2;
  }
  return synthIndex;
}

export function songCleanUp(grid, isFirst) {
  const newGrid = grid.slice();
  newGrid.shift();
  newGrid.map((eachRow) => {
    if (!isFirst) {
      eachRow.shift();
      eachRow.shift();
    }
    return eachRow;
  });
  return newGrid;
}

export const lastNotesSeed = [
  [
    {
      note: "C",
      isActive: true,
      synth: "pluckySynth",
      octave: "4",
    },
    {
      note: "C",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "D",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "D",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "E",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "E",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "F",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "F",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "G",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "G",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "A",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "A",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
  ],
  [
    {
      note: "B",
      isActive: false,
      synth: "basicSynth",
      octave: "4",
    },
    {
      note: "B",
      isActive: true,
      synth: "basicSynth",
      octave: "4",
    },
  ],
];
