import React from "react";
import { Link } from "react-router-dom";

export const Intro = () => {
  document.body.addEventListener("click", function (e) {});

  return (
    <video width="1280" height="720" autoPlay muted>
      <source src={"./test.mp4"} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
//

//ensure rerouting occurs if animation ends
//or on click
//or on button press

//center animation as well
