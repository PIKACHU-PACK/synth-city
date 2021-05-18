import React from "react";
import classNames from "classnames";

export const NoteButton = ({
  note,
  octave,
  isActive,
  synth,
  isPrevious,
  beat,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        { "inactive-beat": typeof note === "number" },
        { "active-beat": note === beat },
        { "note ": typeof note !== "number" },
        {
          "previous-note": typeof note !== "number" && isPrevious && !isActive,
        },
        { "green-synth": synth === "basicSynth" && isActive },
        { "blue-synth": synth === "pluckySynth" && isActive },
        { "red-synth": synth === "amSynth" && isActive }
      )}
      {...rest}
    >
      {note + `${octave ? octave : ""}`}
    </button>
  );
};
