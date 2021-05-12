import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import Chat from './Chat';
import { RoomTest } from './RoomTest';

/**
 * COMPONENT
 */
const actx = Tone.context;
const dest = actx.createMediaStreamDestination();

export class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      wasPressed: false,
      // recorder: new Tone.Recorder(),
      recorderToButton: new MediaRecorder(dest.stream),
      // audio: document.querySelector('audio'),
    };
    this.strikeKey = this.strikeKey.bind(this);
  }

  strikeKey(event, note) {
    if (!this.state.wasPressed) {
      this.setState({ wasPressed: true });
      // this.state.recorder.start();
      this.state.recorderToButton.start();
    }

    const synth = new Tone.PolySynth(Tone.Synth).toDestination().connect(dest); //og = this.state.recorder
    synth.toMaster();

    event.stopPropagation();
    console.log(note);
    synth.triggerAttackRelease(note, '8n');
    setTimeout(async () => {
      const chunks = [];
      const buttonRecord = this.state.recorderToButton.stop();
      Tone.Transport.stop();
      this.state.recorderToButton.ondataavailable = (evt) =>
        chunks.push(evt.data);
      recorder.onstop = (evt) => {
        let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        audio.src = URL.createObjectURL(blob);
      };
      // const recording = await this.state.recorder.stop();
      //const url = URL.createObjectURL(recording);
      // const anchor = document.createElement("a");
      // anchor.download = "recording.webm";
      // anchor.href = url;
      // anchor.click();
    }, 5000);
  }
  render() {
    const data = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    console.log('AUDIO: ', document.querySelector('audio'));

    return (
      <div>
        <h3>Welcome</h3>
        <RoomTest />
        <div>
          <div id="piano">
            {data.map((note) => {
              let hasSharp = note !== 'E' && note !== 'B' ? true : false;
              return hasSharp ? (
                <>
                  <div
                    onClick={(event) => this.strikeKey(event, note + '4')}
                    key={`${note}4`}
                    className="whiteNote"
                    data-code={`${note}4`}
                  >
                    {note}4
                    <div
                      onClick={(event) => this.strikeKey(event, note + '#4')}
                      key={`${note}#4`}
                      className="blackNote"
                      data-code={`${note}#4`}
                    >
                      {note}#4
                    </div>
                  </div>
                </>
              ) : (
                <div
                  onClick={(event) => this.strikeKey(event, note + '4')}
                  key={`${note}4`}
                  className="whiteNote"
                  data-code={`${note}4`}
                >
                  {note}4
                </div>
              );
            })}
            {data.map((note) => {
              let hasSharp = note !== 'E' && note !== 'B' ? true : false;
              return hasSharp ? (
                <>
                  <div
                    onClick={(event) => this.strikeKey(event, note + '5')}
                    key={`${note}5`}
                    className="whiteNote"
                    data-code={`${note}5`}
                  >
                    {note}5
                    <div
                      onClick={(event) => this.strikeKey(event, note + '#5')}
                      key={`${note}#5`}
                      className="blackNote"
                      data-code={`${note}#5`}
                    >
                      {note}#5
                    </div>
                  </div>
                </>
              ) : (
                <div
                  onClick={(event) => this.strikeKey(event, note + '5')}
                  key={`${note}5`}
                  className="whiteNote"
                  data-code={`${note}5`}
                >
                  {note}5
                </div>
              );
            })}
          </div>
          <audio controls></audio>
          {/* <Chat /> */}
        </div>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // username: state.auth.username
  };
};

export default connect(mapState)(Home);
