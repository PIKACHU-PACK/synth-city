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

const countArray = Array.from({ length: 18 }, (_, i) => i + 1);
let currHeaderCount = 0;
let prevCount = 0;

export function makeGrid(notes) {
  const rows = [];
  for (const note of notes) {
    const col = [];
    for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
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
      synth: pluckySynth,
      octave: "4",
    },
    {
      note: "C",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "D",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "D",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "E",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "E",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "F",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "F",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "G",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "G",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "A",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "A",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
  ],
  [
    {
      note: "B",
      isActive: false,
      synth: basicSynth,
      octave: "4",
    },
    {
      note: "B",
      isActive: true,
      synth: basicSynth,
      octave: "4",
    },
  ],
];

//THIS VERSION OF MAKEGRID DOES NOT WORK OK,
// export function makeGrid(notes, previousNotes) {
//   const rows = [];
//   for (let i = 0; i < notes.length; i++) {
//     const currentNote = notes[i];
//     const col = [];
//     const basicNote = {
//       note: currentNote,
//       isActive: false,
//       synth: basicSynth,
//       octave: "4",
//     };
//     for (let j = 0; j < AMOUNT_OF_NOTES; j++) {
//       if (currentNote === "COUNT") {
//         col.push({
//           note: countArray[currHeaderCount],
//           isActive: false,
//         });
//         currHeaderCount++;
//       } else {
//         // if (j >= 2) {
//         col.push(basicNote);
//       }
//       //   else if (j === 0) {
//       //     console.log("im in j===0");
//       //     col.push(previousNotes[i - 1][j]);
//       //   } else if (j === 1) {
//       //     console.log("im in j===1");
//       //     col.push(previousNotes[i - 1][j]);
//       //   }
//     }
//     rows.push(col);
//   }
//   return rows;
// }
