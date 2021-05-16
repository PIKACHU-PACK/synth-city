import React from "react";
import classNames from "classnames";
import { basicSynth, amSynth, pluckySynth } from "./HelperFunctions";

export const NoteButton = ({
  note,
  octave,
  isActive,
  synth,
  isPrevious,
  beat,
  ...rest
}) => {
  //   const noteOctave = note + octave;
  //   console.log(octave);
  return (
    <button
      className={classNames(
        { "inactive-beat": typeof note === "number" },
        { "active-beat": note === beat },
        { "note ": typeof note !== "number" },

        {
          "previous-note": typeof note !== "number" && isPrevious && !isActive,
        },
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
