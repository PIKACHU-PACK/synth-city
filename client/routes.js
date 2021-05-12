import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/Home";
import { SeqAttempt } from "./components/SequencerAttempt";

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sequencer" component={SeqAttempt} />
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
