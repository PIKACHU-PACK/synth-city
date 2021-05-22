import React from "react";
import classNames from "classnames";
import AMOUNT_OF_NOTES from "./Sequencer";

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
  return (
    <button
      className={classNames(
        { "inactive-beat": typeof note === "number" },
        { "active-beat": note === beat },
        {
          "active-beat":
            note === AMOUNT_OF_NOTES - 2 && beat === 0 && !firstBeat && isFirst,
        },
        {
          "active-beat":
            note === AMOUNT_OF_NOTES && beat === 0 && !firstBeat && !isFirst,
        },
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
