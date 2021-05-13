import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Sequencer from './components/Sequencer';
import { WaitingRoom } from './components/WaitingRoom';

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
          <Route path="/waiting/:roomId" component={WaitingRoom} />
          {/* <Redirect to="/" /> */}
        </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
// const mapState = (state) => {};

// const mapDispatch = dispatch => {
//   return {
//     loadInitialData() {
//       dispatch(me())
//     }
//   }
// }

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
// export default withRouter(connect(mapState, mapDispatch)(Routes));
export default Routes;
