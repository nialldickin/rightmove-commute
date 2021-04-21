import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Commute, TravelMode } from "rm-types";
import CommuteItem from "./CommuteItem";
import "./style.css";
import "../tailwind.css";

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

  function CommuteList() {
    return (
      <>
        {commutes.map((commute, idx) => (
          <CommuteItem
            commute={commute}
            setMode={setMode(idx)}
            setDestination={setDestination(idx)}
            deleteCommute={deleteCommute(idx)}
          />
        ))}
      </>
    );
  }

  return (
    <main>
      <CommuteList />
      <button className="btn btn-blue" onClick={onAddClick}>
        Add Destination
      </button>
      <button className="btn btn-green" onClick={onSaveClick}>
        Save Changes
      </button>
    </main>
  );
};

render(<Popup />, document.getElementById("popup"));
