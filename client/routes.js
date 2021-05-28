import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Sequencer from './components/Sequencer';
import PracticeRoom from './components/PracticeRoom';
import Environment from './components/Environment';

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
