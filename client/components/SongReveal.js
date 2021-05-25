import React from 'react';
import * as Tone from 'tone';
import { checkSynth, makeSynths, lastNotesSeed } from './HelperFunctions';
import history from '../history';
import { BPM } from './Sequencer';
import { exitRoom, getInfo, chatListener } from '../socket';
import { NoteButton } from './NoteButtonSongReveal';
import Chat from './Chat';

class SongReveal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beat: 3,
      started: false,
      playing: false,
      firstBeat: true,
      synths: [],
      noteClickStarted: false,
      playButtonStarted: false,
      finalSong: [],
      nickname: '',
      musician: '',
      musicianNickname: '',
      chat: [],
    };
    this.stateInfo = this.stateInfo.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.configPlayButton = this.configPlayButton.bind(this);
    this.configLoop = this.configLoop.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goToWaitingRoom = this.goToWaitingRoom.bind(this);
    this.cleanUpFinalSong = this.cleanUpFinalSong.bind(this);
  }

  componentDidMount() {
    getInfo(this.props.room, this.stateInfo);
    chatListener(this.getMessages);
    const synthsArr = makeSynths();
    this.setState({ synths: synthsArr });
    const finalCleanSong = this.cleanUpFinalSong(this.props.location.finalSong);
    this.setState({ finalSong: finalCleanSong });
  }

  stateInfo({ nickname, musician, musicianNickname }) {
    this.setState({
      nickname: nickname,
      musician: musician,
      musicianNickname: musicianNickname,
    });
  }

  getMessages(received) {
    this.setState({ chat: [...this.state.chat, received] });
  }

  cleanUpFinalSong(finalSongSegmented) {
    let newGrid = [[], [], [], [], [], [], []];
    let initialNote = {
      note: '♫',
      isActive: false,
      synth: '',
      octave: '',
    };
    for (let i = 0; i < finalSongSegmented.length; i++) {
      const currentSegment = finalSongSegmented[i];
      for (let j = 0; j < currentSegment.length; j++) {
        const currRow = currentSegment[j];
        currRow.forEach((note) => {
          if (!note.isActive) {
            note.note = '♫';
            note.octave = '';
          }
          newGrid[j].push(note);
        });
      }
    }
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i].unshift(initialNote, initialNote, initialNote);
      newGrid[i].push(initialNote, initialNote, initialNote);
    }
    return newGrid;
  }

  configLoop() {
    let synthsCount = 0;
    const fullSong = this.state.finalSong;
    //0: am, 1: plucky, 2: basic (order in state)
    const repeat = (time) => {
      fullSong.forEach((row, index) => {
        let note = row[this.state.beat];
        if (note.isActive) {
          const synthIndex = checkSynth(note.synth);
          let synth = this.state.synths[synthIndex];
          if (note.synth === 'pluckySynth') {
            synth.triggerAttackRelease(
              note.note + note.octave,
              '+2',
              time + synthsCount
            );
            synthsCount += 0.0001;
          } else {
            synth.triggerAttackRelease(
              note.note + note.octave,
              '8n',
              time + synthsCount
            );
            synthsCount += 0.0001;
          }
        }
      });
      this.setState({
        beat:
          (this.state.beat + 1) %
          (this.props.location.finalSong.length * 16 + 6),
      });
    };
    Tone.Transport.bpm.value = BPM;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  }

  configPlayButton(e) {
    if (!this.state.started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      this.setState({ started: true });
      this.configLoop();
    }
    if (this.state.playing) {
      e.target.innerText = 'Play Song';
      Tone.Transport.stop();
      this.setState({
        playing: false,
      });
    } else {
      e.target.innerText = 'Stop';
      Tone.Transport.start();
      this.setState({ playing: true });
    }
  }

  goHome() {
    exitRoom(this.props.room);
    history.push({
      pathname: '/',
    });
  }

  goToWaitingRoom() {
    history.push({
      pathname: `/waiting/${this.props.room}`,
    });
  }

  render() {
    const room = this.props.room;
    return (
      <div className="reveal-view">
        <div className="song-reveal-banner">
          <h2 className="song-reveal-title">Your Masterpiece</h2>
        </div>
        <div className="reveal-toggle-play">
          <div className="play-container">
            <button
              className="play-button"
              onClick={(event) => this.configPlayButton(event)}
            >
              Play Song
            </button>
            <button className="play-button" onClick={this.goHome}>
              New Game
            </button>
          </div>
        </div>
        <div className="song-reveal-content">
          <div className="song-reveal-column">
            <div className="sequencer-container">
              {this.state.finalSong.map((row, rowIndex) => {
                return (
                  <div
                    id="rowIndex"
                    className="sequencer-row"
                    key={rowIndex + 'row'}
                  >
                    {row.map(({ note, isActive, synth, octave }, noteIndex) => {
                      return (
                        <NoteButton
                          note={note}
                          key={noteIndex + 'note'}
                          isActive={isActive}
                          beat={this.state.beat}
                          synth={synth}
                          octave={octave}
                          firstBeat={this.state.firstBeat}
                          index={noteIndex}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="song-reveal-column">
            <Chat
              roomId={room}
              nickname={this.state.nickname}
              chat={this.state.chat}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SongReveal;
