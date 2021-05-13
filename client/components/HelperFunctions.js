import { AMOUNT_OF_NOTES } from "./Sequencer";
import * as Tone from "tone";

export const amSynth = new Tone.AMSynth().toDestination();
export const pluckySynth = new Tone.PluckSynth().toDestination();
export const basicSynth = new Tone.Synth({
  oscillator: {
    type: "square8",
  },
}).toDestination();

export function makeSynths(synthType) {
  // MAKE DIFFERENT SYNTHS LATER ON INSTEAD
  const synths = [];
  //   for (let i = 0; i < 7; i++) {
  //     synths.push(synthType);
  //   }
  synths.push(amSynth, pluckySynth, basicSynth);
  return synths;
}

export function makeGrid(notes) {
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
        synth: basicSynth,
      });
    }
    rows.push(row);
  }
  // we now have 6 rows each containing 16 eighth notes
  return rows;
}
