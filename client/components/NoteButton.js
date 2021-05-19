import React from "react";
import classNames from "classnames";

export const NoteButton = ({
  note,
  octave,
  isActive,
  synth,
  isPrevious,
  beat,
  firstBeat,
  isFirst,
  ...rest
}) => {
  let isLast = note === 16 && beat === 0;
  return (
    <button
      className={classNames(
        { "inactive-beat": typeof note === "number" },
        { "active-beat": note === beat },
        { "active-beat": note === 16 && beat === 0 && !firstBeat && isFirst },
        { "active-beat": note === 18 && beat === 0 && !firstBeat && !isFirst },
        { "note ": typeof note !== "number" },
        {
          "previous-note": typeof note !== "number" && isPrevious && !isActive,
        },
        { "fuchsia-synth": synth === "basicSynth" && isActive },
        { "blue-synth": synth === "pluckySynth" && isActive },
        { "orange-synth": synth === "amSynth" && isActive }
      )}
      {...rest}
    >
      {note + `${octave ? octave : ""}`}
    </button>
  );
};
