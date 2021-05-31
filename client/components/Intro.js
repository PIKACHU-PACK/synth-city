import React from "react";
import history from "../history";
import Aos from "aos";

export class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    Aos.init({ duration: 2000 });
  }

  handleClick() {
    history.push({
      pathname: "/home",
    });
  }

  render() {
    return (
      <div data-aos="fade-in" onClick={() => this.handleClick()}>
        <h2 className="intro-title">SynthCity</h2>
        <div className="anim-container">
          <img src={"anim.gif"} height="562" width="1000" id="gif" />
        </div>
        <div>
          <p></p>
          <p></p>
          <h2 id="anim-text">Click Anywhere to Start</h2>
        </div>
      </div>
    );
  }
}
