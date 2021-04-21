import * as React from "react";
import { Commute, TravelMode } from "rm-types";
import "./style.css";

interface Props {
  commute: Commute;
  setMode: (newMode: TravelMode) => void;
  setDestination: (newDestination: string) => void;
  deleteCommute: () => void;
}

const DeleteIcon = () => (
  <svg className="fill-current" width="24" height="24">
    <path d="M5 4a1 1 0 00-.7 1.7l6.3 6.3-6.3 6.3a1 1 0 101.4 1.4l6.3-6.3 6.3 6.3a1 1 0 101.4-1.4L13.4 12l6.3-6.3A1 1 0 0019 4a1 1 0 00-.7.3L12 10.6 5.7 4.3A1 1 0 005 4z" />
  </svg>
);

const CommuteEditor = ({
  commute,
  setMode,
  setDestination,
  deleteCommute,
}: Props) => {
  const { mode, destination } = commute;

  function onModeChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    setMode(e.target.value as TravelMode);
  }

  function onDestinationChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setDestination(e.target.value);
  }

  return (
    <div className="commute-item">
      <select className="common-input" onChange={onModeChanged} value={mode}>
        <option value="driving">Driving</option>
        <option value="transit">Public Transport</option>
        <option value="bicycling">Cycling</option>
        <option value="walking">Walking</option>
      </select>
      <input
        className="common-input"
        onChange={onDestinationChanged}
        placeholder="New Destination"
        type="text"
        value={destination}
      ></input>
      <button className="delete-btn" onClick={deleteCommute}>
        <DeleteIcon />
      </button>
    </div>
  );
};

export default CommuteEditor;
