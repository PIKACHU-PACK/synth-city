import React from "react";
import history from "../history";
import Aos from "aos";

export class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    Aos.init({ duration: 2000 });
  }

  handleKeyDown() {
    console.log("in this func");
    history.push({
      pathname: "/",
    });
  }

  render() {
    console.log(this.props);
    return (
      <div onKeyPress={this.handleKeyDown}>
        <h2 className="home-title" data-aos="fade-in">
          SynthCity
        </h2>
        <div className="anim-container">
          <img src={"anim.gif"} height="562" width="1000" id="gif" />
        </div>
        <div>
          <p></p>
          <p></p>
          <h2 id="anim-text">Press Any Key to Start</h2>
        </div>
      </div>
    );
  }
}
