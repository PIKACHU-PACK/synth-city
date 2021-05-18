import { AMOUNT_OF_NOTES } from "./Sequencer";
import * as Tone from "tone";

export const amSynth = new Tone.AMSynth().toDestination();
export const pluckySynth = new Tone.PluckSynth().toDestination();
export const basicSynth = new Tone.Synth({
  oscillator: {
    type: "square8",
  },
}).toDestination();

export function makeSynths() {
  // MAKE DIFFERENT SYNTHS LATER ON INSTEAD
  const synths = [];
  synths.push(amSynth, pluckySynth, basicSynth);
  return synths;
}

const countArray = Array.from({ length: 18 }, (_, i) => i + 1);
let currHeaderCount = 0;
let prevCount = 0;

export function makeGrid(notes, isFirst) {
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
          synth: basicSynth,
          octave: "4",
          isPrevious: false,
        });
      }
    }
    rows.push(col);
  }
  return rows;
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
