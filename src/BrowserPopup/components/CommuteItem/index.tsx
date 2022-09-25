import React, { ReactElement } from "react";
import { Commute, TravelMode } from "types";
import DeleteIcon from "./DeleteIcon";
import "./style.css";

interface Props {
  commute: Commute;
  setMode: (newMode: TravelMode) => void;
  setDestination: (newDestination: string) => void;
  deleteCommute: () => void;
}

const CommuteItem = (props: Props): ReactElement => {
  const { commute, setMode, setDestination, deleteCommute } = props;
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
      />
      <button className="delete-btn" onClick={deleteCommute} type="button">
        <DeleteIcon />
      </button>
    </div>
  );
};

export default CommuteItem;
