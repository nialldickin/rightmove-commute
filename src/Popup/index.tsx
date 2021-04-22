import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Commute, TravelMode } from "types";
import CommuteItem from "./CommuteItem";
import "./style.css";
import "../tailwind.css";

const Popup = () => {
  const [commuteList, setCommutes] = useState<Commute[]>([]);

  function onAddClick() {
    setCommutes((state) =>
      state.concat({
        destination: "",
        mode: TravelMode.DRIVING,
      })
    );
  }

  function onSaveClick() {
    chrome.storage.sync.set({ commutes: commuteList });
  }

  function deleteCommute(index: number) {
    return () => {
      setCommutes((state) => state.filter((_, idx) => idx !== index));
    };
  }

  function setDestination(index: number) {
    return (newDestination: string) => {
      setCommutes((state) =>
        state.map((commute, idx) => {
          if (idx === index) return { ...commute, destination: newDestination };
          return commute;
        })
      );
    };
  }

  function setMode(index: number) {
    return (newMode: TravelMode) => {
      setCommutes((state) =>
        state.map((commute, idx) => {
          if (idx === index) return { ...commute, mode: newMode };
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
    <main>
      {commuteList.map((commute, idx) => (
        <CommuteItem
          commute={commute}
          setMode={setMode(idx)}
          setDestination={setDestination(idx)}
          deleteCommute={deleteCommute(idx)}
        />
      ))}
      <button className="btn btn-blue" onClick={onAddClick} type="button">
        Add Destination
      </button>
      <button className="btn btn-green" onClick={onSaveClick} type="button">
        Save Changes
      </button>
    </main>
  );
};

render(<Popup />, document.getElementById("popup"));
