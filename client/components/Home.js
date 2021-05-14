import React from "react";
import { connect } from "react-redux";
import Chat from "./Chat";
import { Rooms } from "./Rooms";
import { Link } from "react-router-dom";

export class Home extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h3>Welcome</h3>
        <Rooms />
        <Link to={"/practice"}>
          <h3>Click me for practice room</h3>
        </Link>
        <Link to={"/sequencer"}>
          <h3>Click me for current sequencer (remove when needed)</h3>
        </Link>
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
