import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import WaitingRoom from './components/WaitingRoom';
import Sequencer from './components/Sequencer';
import PracticeRoom from './components/PracticeRoom';
import Environment from './components/Environment';
import GamePage from './components/GamePage';
import SongReveal from './components/SongReveal';

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sequencer" component={Sequencer} />
          <Route exact path="/practice" component={PracticeRoom} />
          <Route
            exact
            path="/play/:room"
            render={(routeProps) => (
              <Environment
                {...routeProps}
                room={routeProps.match.params.room}
              />
            )}
          />
          {/* <Route
            exact
            path="/game/:room"
            render={(routeProps) => (
              <GamePage {...routeProps} room={routeProps.match.params.room} />
            )}
          />
          <Route
            exact
            path="/waiting/:room"
            render={(routeProps) => (
              <WaitingRoom
                {...routeProps}
                room={routeProps.match.params.room}
              />
            )}
          />
          <Route
            exact
            path="/song/:room"
            render={(routeProps) => (
              <SongReveal {...routeProps} room={routeProps.match.params.room} />
            )}
          /> */}
        </Switch>
      </div>
    );
  }
}

export default Routes;
