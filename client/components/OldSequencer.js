//THIS FILE HAS THE OLD SEQUENCER AND OLD PIANO JUST IN CASE, DELETE WHEN NEEDED

// import React from "react";
// import { connect } from "react-redux";
// import { Link } from "react-router-dom";
// import * as Tone from "tone";
// import classNames from "classnames";

// const AMOUNT_OF_NOTES = 16;
// //this looks like [0, 1, 2, 3, 4, 5, 6] and so forth until it reaches the total
// const numArray = Array.from(Array(AMOUNT_OF_NOTES - 1).keys());

// const CHOSEN_OCTAVE = "4";
// const synth = new Tone.PolySynth().toDestination();

// class Sequencer extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       grid: this.generateGrid(),
//       isPlaying: false,
//       currentColumn: null,
//       //music: [],
//     };
//     this.generateGrid = this.generateGrid.bind(this);
//     this.handleNoteClick = this.handleNoteClick.bind(this);
//     this.playMusic = this.playMusic.bind(this);
//   }

//   generateGrid() {
//     const grid = [];
//     for (let i = 0; i < AMOUNT_OF_NOTES; i++) {
//       let column = [
//         { note: "C", isActive: false },
//         { note: "D", isActive: false },
//         { note: "E", isActive: false },
//         { note: "F", isActive: false },
//         { note: "G", isActive: false },
//         { note: "A", isActive: false },
//         { note: "B", isActive: false },
//       ];
//       grid.push(column);
//     }
//     return grid;
//   }

//   handleNoteClick(clickedColumn, clickedNote) {
//     // Shallow copy of our grid with updated isActive
//     let updatedGrid = this.state.grid.map((column, columnIndex) =>
//       column.map((cell, cellIndex) => {
//         let cellCopy = cell;
//         // Flip isActive for the clicked note-cell in our grid
//         if (columnIndex === clickedColumn && cellIndex === clickedNote) {
//           cellCopy.isActive = !cell.isActive;
//         }
//         return cellCopy;
//       })
//     );
//     //Updates the grid with the new note toggled
//     this.setState({ grid: updatedGrid });
//     //console.log(this.state.grid[0]);
//   }

//   async playMusic() {
//     let music = [];
//     // Variable for storing our note in a appropriate format for our synth
//     this.state.grid.map((column) => {
//       let columnNotes = [];
//       column.map((shouldPlay) => {
//         //If isActive, push the given note, with our chosen octave
//         if (shouldPlay.isActive) {
//           columnNotes.push(shouldPlay.note + CHOSEN_OCTAVE);
//         }
//       });
//       console.log("columnNotes ", columnNotes);

//       music.push(columnNotes);
//     });

//     // Starts our Tone context
//     await Tone.start();

//     // Tone.Sequence()
//     //@param callback
//     //@param "events" to send with callback
//     //@param subdivision  to engage callback
//     const Sequencer = new Tone.Sequence(
//       (time, column) => {
//         // Highlight column with styling
//         this.setState({ currentColumn: column });
//         //Sends the active note to our PolySynth
//         synth.triggerAttackRelease(music[column], "8n", time);
//       },
//       numArray,
//       "8n"
//     );

//     if (this.state.isPlaying) {
//       // Turn of our player if music is currently playing
//       this.setState({ isPlaying: false, currentColumn: null });
//       music = [];

//       await Tone.Transport.stop();
//       await Sequencer.stop();
//       await Sequencer.clear();
//       await Sequencer.dispose();

//       return;
//     }
//     this.setState({ isPlaying: true });
//     // Toggles playback of our musical masterpiece
//     await Sequencer.start();
//     await Tone.Transport.start();
//   }

//   render() {
//     return (
//       <div className="sequencer">
//         <div className="note-wrapper">
//           {this.state.grid.map((column, columnIndex) => (
//             <div
//               className={classNames("note-column", {
//                 "note-column--active": this.state.currentColumn === columnIndex,
//               })}
//               key={columnIndex + "column"}
//             >
//               {column.map(({ note, isActive }, noteIndex) => (
//                 <NoteButton
//                   note={note}
//                   isActive={isActive}
//                   onClick={() => this.handleNoteClick(columnIndex, noteIndex)}
//                   key={note + columnIndex}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//         <button className="play-button" onClick={() => this.playMusic()}>
//           {this.state.isPlaying ? "Stop" : "Play"}
//         </button>
//       </div>
//     );
//   }
// }

// const NoteButton = ({ note, isActive, ...rest }) => {
//   const classes = isActive ? "note note--active" : "note";
//   return (
//     <button className={classes} {...rest}>
//       {note}
//     </button>
//   );
// };

// export default Sequencer;

// import React from "react";
// import { connect } from "react-redux";
// import * as Tone from "tone";
// import Chat from "./Chat";
// import { Rooms } from "./Rooms";
// import { Link } from "react-router-dom";

// /**
//  * COMPONENT
//  */
// const actx = Tone.context;
// const dest = actx.createMediaStreamDestination();

// export class Home extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       wasPressed: false,
//       // recorder: new Tone.Recorder(),
//       recorderToButton: new MediaRecorder(dest.stream),
//       // audio: document.querySelector('audio'),
//     };
//     this.strikeKey = this.strikeKey.bind(this);
//   }

//   strikeKey(event, note) {
//     if (!this.state.wasPressed) {
//       this.setState({ wasPressed: true });
//       // this.state.recorder.start();
//       this.state.recorderToButton.start();
//     }

//     const synth = new Tone.PolySynth(Tone.Synth).toDestination().connect(dest); //og = this.state.recorder
//     synth.toMaster();

//     event.stopPropagation();
//     console.log(note);
//     synth.triggerAttackRelease(note, "8n");
//     setTimeout(async () => {
//       const chunks = [];
//       const buttonRecord = this.state.recorderToButton.stop();
//       Tone.Transport.stop();
//       this.state.recorderToButton.ondataavailable = (evt) =>
//         chunks.push(evt.data);
//       recorder.onstop = (evt) => {
//         let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//         audio.src = URL.createObjectURL(blob);
//       };
//       // const recording = await this.state.recorder.stop();
//       //const url = URL.createObjectURL(recording);
//       // const anchor = document.createElement("a");
//       // anchor.download = "recording.webm";
//       // anchor.href = url;
//       // anchor.click();
//     }, 5000);
//   }
//   render() {
//     const data = ["C", "D", "E", "F", "G", "A", "B"];
//     console.log("AUDIO: ", document.querySelector("audio"));

//     return (
//       <div>
//         <h3>Welcome</h3>
//         <Rooms />
//         <Link to={"/practice"}>
//           <h3>Click ne for practice room</h3>
//         </Link>
//         <div>
//           <div id="piano">
//             {data.map((note) => {
//               let hasSharp = note !== "E" && note !== "B" ? true : false;
//               return hasSharp ? (
//                 <>
//                   <div
//                     onClick={(event) => this.strikeKey(event, note + "4")}
//                     key={`${note}4`}
//                     className="whiteNote"
//                     data-code={`${note}4`}
//                   >
//                     {note}4
//                     <div
//                       onClick={(event) => this.strikeKey(event, note + "#4")}
//                       key={`${note}#4`}
//                       className="blackNote"
//                       data-code={`${note}#4`}
//                     >
//                       {note}#4
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div
//                   onClick={(event) => this.strikeKey(event, note + "4")}
//                   key={`${note}4`}
//                   className="whiteNote"
//                   data-code={`${note}4`}
//                 >
//                   {note}4
//                 </div>
//               );
//             })}
//             {data.map((note) => {
//               let hasSharp = note !== "E" && note !== "B" ? true : false;
//               return hasSharp ? (
//                 <>
//                   <div
//                     onClick={(event) => this.strikeKey(event, note + "5")}
//                     key={`${note}5`}
//                     className="whiteNote"
//                     data-code={`${note}5`}
//                   >
//                     {note}5
//                     <div
//                       onClick={(event) => this.strikeKey(event, note + "#5")}
//                       key={`${note}#5`}
//                       className="blackNote"
//                       data-code={`${note}#5`}
//                     >
//                       {note}#5
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div
//                   onClick={(event) => this.strikeKey(event, note + "5")}
//                   key={`${note}5`}
//                   className="whiteNote"
//                   data-code={`${note}5`}
//                 >
//                   {note}5
//                 </div>
//               );
//             })}
//           </div>
//           <audio controls></audio>
//           {/* <Chat /> */}
//         </div>
//       </div>
//     );
//   }
// }

// /**
//  * CONTAINER
//  */
// const mapState = (state) => {
//   return {
//     // username: state.auth.username
//   };
// };

// export default connect(mapState)(Home);
