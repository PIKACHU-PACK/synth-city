import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// do we need this component anymore?

export const Navbar = () => {
	<div>
		<h1>SynthCity</h1>
		<nav>
			<div>
				<Link to='/login'>Login</Link>
				<Link to='/signup'>Sign Up</Link>
			</div>
		</nav>
		<hr />
	</div>;
};

/**
 * CONTAINER
 */
// const mapState = (state) => {
//   return {
//     // isLoggedIn: !!state.auth.id,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     // handleClick() {
//     //   dispatch(logout());
//     },
//   };

// export default connect(mapState, mapDispatch)(Navbar);
export default Navbar;
