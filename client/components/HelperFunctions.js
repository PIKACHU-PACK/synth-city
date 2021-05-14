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
  synths.push(amSynth, pluckySynth, basicSynth);
  return synths;
}

export function makeGrid(notes) {
  const rows = [];
  for (const note of notes) {
    const row = [];
    for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
      row.push({
        note: note,
        isActive: false,
        synth: basicSynth,
        octave: "4",
      });
    }
    rows.push(row);
  }
  return rows;
}
