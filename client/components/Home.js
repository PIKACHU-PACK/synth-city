import React from 'react';
import { connect } from 'react-redux';

/**
 * COMPONENT
 */
export const Home = (props) => {
  return (
    <div>
      <h3>Welcome</h3>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // username: state.auth.username
  };
};

export default connect(mapState)(Home);
