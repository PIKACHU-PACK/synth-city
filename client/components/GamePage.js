import React from 'react';
import Sequencer from './Sequencer';
import Chat from './Chat';

export class GamePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const room = this.props.room;
    const nickname = this.props.thisPlayer.nickname
      ? this.props.thisPlayer.nickname
      : '';
    const thisPlayerID = this.props.thisPlayer.id
      ? this.props.thisPlayer.id
      : '';
    const musicianID = this.props.musician ? this.props.musician.id : null;
    const musicianNickname = this.props.musician
      ? this.props.musician.nickname
      : '';
    return (
      <>
        {thisPlayerID === musicianID ? (
          <>
            <Sequencer
              finishTurn={this.props.finishTurn}
              previousNotes={this.props.previousNotes}
              isFirst={this.props.isFirst}
            />
          </>
        ) : (
          <>
            <div>
              <h2 className="game-title">WAITING FOR YOUR TURN</h2>
              {musicianNickname ? (
                <h2 className="waiting-subheading">
                  {musicianNickname} is composing now
                </h2>
              ) : (
                <div></div>
              )}
              <div className="game-chat">
                <Chat room={room} nickname={nickname} chat={this.props.chat} />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default GamePage;
