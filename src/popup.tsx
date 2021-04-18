import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Commute, TravelMode } from "rm-types";
import CommuteEditor from "./CommuteEditor";
import "./style.css";

const Popup = () => {
  const [commutes, setCommutes] = useState<Commute[]>([]);

  function onAddClick() {
    setCommutes((commutes) =>
      commutes.concat({
        destination: "",
        mode: TravelMode.DRIVING,
      })
    );
  }

  function onSaveClick() {
    chrome.storage.sync.set({ commutes });
  }

  function setDestination(index: number) {
    return function (newDestination: string) {
      setCommutes((commutes) =>
        commutes.map((commute, idx) => {
          if (idx === index) commute.destination = newDestination;
          return commute;
        })
      );
    };
  }

  function deleteCommute(index: number) {
    return function () {
      setCommutes((commutes) => commutes.filter((_, idx) => idx !== index));
    };
  }

  function setMode(index: number) {
    return function (newMode: TravelMode) {
      setCommutes((commutes) =>
        commutes.map((commute, idx) => {
          if (idx === index) commute.mode = newMode;
          return commute;
        })
      );
    };
  }

  useEffect(() => {
    chrome.storage.sync.get(["commutes"], ({ commutes }) => {
      setCommutes(commutes ?? []);
    });
  }, []);

  return (
    <div className="min-w-max p-5 bg-gray-100" style={{ fontSize: "14px" }}>
      <div className="flex flex-col space-y-2">
        {commutes.map((commute, idx) => (
          <CommuteEditor
            commute={commute}
            setMode={setMode(idx)}
            setDestination={setDestination(idx)}
            deleteCommute={deleteCommute(idx)}
          />
        ))}
        <button
          className="bg-white border border-gray-300 shadow-sm text-blue-500 hover:ring-2 ring-blue-200 transition rounded-md p-1 focus:outline-none"
          onClick={onAddClick}
        >
          Add Destination
        </button>
        <button
          className="bg-white border border-gray-300 shadow-sm text-green-500 hover:ring-2 ring-green-200 transition rounded-md p-1 focus:outline-none"
          onClick={onSaveClick}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("popup"));
