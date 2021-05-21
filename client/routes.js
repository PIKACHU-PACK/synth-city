import React, { Component } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/Home";
import WaitingRoom from "./components/WaitingRoom";
import Sequencer from "./components/Sequencer";
import PracticeRoom from "./components/PracticeRoom";
import GamePage from "./components/GamePage";
import SongReveal from "./components/SongReveal";

/**
 * COMPONENT
 */

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sequencer" component={Sequencer} />
          <Route exact path="/practice" component={PracticeRoom} />
          <Route exact path="/game/:roomId" component={GamePage} />
          <Route exact path="/waiting/:roomId" component={WaitingRoom} />
          <Route path="/song/:roomId" component={SongReveal} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
