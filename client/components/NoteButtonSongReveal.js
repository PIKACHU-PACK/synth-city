import React from "react";
import classNames from "classnames";

export const NoteButton = ({
  note,
  octave,
  isActive,
  synth,
  beat,
  firstBeat,
  index,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        "reveal-note",
        { "fuchsia-synth": synth === "basicSynth" && isActive },
        { "blue-synth": synth === "pluckySynth" && isActive },
        { "orange-synth": synth === "amSynth" && isActive },
        { "reveal-current-beat": index === beat && !isActive },
        { "current-col": index === beat },
        {
          "hidden-note":
            index !== beat &&
            index !== beat - 1 &&
            index !== beat - 2 &&
            index !== beat - 3 &&
            index !== beat + 1 &&
            index !== beat + 2 &&
            index !== beat + 3,
        }
      )}
      {...rest}
    >
      {note + octave}
    </button>
  );
};
