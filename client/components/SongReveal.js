import React from 'react';
import { parse } from 'flatted';
import * as Tone from 'tone';

class SongReveal extends React.Component {
  constructor() {
    super();
    this.state = {
      started: false,
      beat: 0,
      playing: false,
    };
    this.configPlayButton = this.configPlayButton.bind(this);
    this.configLoop = this.configLoop.bind(this);
  }

  configLoop() {
    //0: am, 1: plucky, 2: basic (order in state)
    for (let i = 0; i < fullSong.length; i++) {
      let currentGrid = fullSong[i];
      const repeat = (time) => {
        currentGrid.forEach((row, index) => {
          let note = row[this.state.beat];
          if (note.isActive) {
            let synth;
            if (note.synth === 'amSynth') {
              synth = this.state.synths[0];
            } else if (note.synth === 'pluckySynth') {
              synth = this.state.synths[1];
            } else if (note.synth === 'basicSynth') {
              synth = this.state.synths[2];
            }
            synth.triggerAttackRelease(note.note + note.octave, '8n', time);
          }
        });
        this.setState({ beat: (this.state.beat + 1) % AMOUNT_OF_NOTES });
      };
      Tone.Transport.bpm.value = BPM;
      this.setState({ beat: 0 });
    }
    //Tone.Transport.scheduleRepeat(repeat, "8n");
  }

  configPlayButton(e) {
    if (!this.state.started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
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

  render() {
    console.log('finalSong in songReveal is', this.props.location.finalSong);
    console.log(
      'Final song is available in song reveal as this.props.location.finalSong'
    );

    return (
      <div>
        <h2>This is where the song will be revealed to the players</h2>
        <button
          id="play-button"
          className="play-button"
          onClick={(event) => this.configPlayButton(event)}
        >
          Play
        </button>
      </div>
    );
  }
}

export default SongReveal;
