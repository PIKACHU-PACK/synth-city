import React from "react";
import classNames from "classnames";
import { basicSynth, amSynth, pluckySynth } from "./HelperFunctions";

export const NoteButton = ({ note, isActive, synth, currSynth, ...rest }) => {
  //const classes = isActive ? "note note-is-active" : "note";
  return (
    <button
      className={classNames(
        "note",
        { "green-synth": synth === basicSynth && isActive },
        { "blue-synth": synth === pluckySynth && isActive },
        { "red-synth": synth === amSynth && isActive }
      )}
      {...rest}
    >
      {note}
    </button>
  );
};
