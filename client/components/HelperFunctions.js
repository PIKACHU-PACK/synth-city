import { AMOUNT_OF_NOTES } from "./Sequencer";
import * as Tone from "tone";

export const amSynth = new Tone.AMSynth().toDestination();
export const pluckySynth = new Tone.PluckSynth().toDestination();
export const basicSynth = new Tone.Synth({
  oscillator: {
    type: "square8",
  },
}).toDestination();
export const lastNotesSeed = [
  [
    {
      note: "A",
      isActive: true,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "D",
      isActive: true,
      synth: basicSynth,
      octave: "4",
    },
  ],
];

export function makeSynths(synthType) {
  // MAKE DIFFERENT SYNTHS LATER ON INSTEAD
  const synths = [];
  synths.push(amSynth, pluckySynth, basicSynth);
  return synths;
}

const countArray = Array.from({ length: 16 }, (_, i) => i + 1);
let currCount = 0;

export function makeGrid(notes) {
  const rows = [];
  for (const note of notes) {
    const row = [];
    for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
      if (note === "COUNT") {
        row.push({
          note: countArray[currCount],
          isActive: false,
        });
        currCount++;
      } else {
        row.push({
          note: note,
          isActive: false,
          synth: basicSynth,
          octave: "4",
        });
      }
    }
    rows.push(row);
  }
  return rows;
}
