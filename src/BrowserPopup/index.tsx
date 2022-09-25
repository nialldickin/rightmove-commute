import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Commute, TravelMode } from "types";
import CommuteItem from "./components/CommuteItem";
import "./style.css";
import "../tailwind.css";
import DarkModeBtn from "./components/DarkMode";
import { storeVariable } from "../helpers/storage";
import ArrivalTime from "./components/ArrivalTime";

const Popup = () => {
  const [commuteList, setCommutes] = useState<Commute[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("0");
  const [amPm, setAmPm] = useState("am");

  const toggleDarkMode = () => {
    setDarkMode((d) => {
      storeVariable({ darkMode: !d });
      return !d;
    });
  };

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
    chrome.storage.sync.set({ hour, minute, amPm });
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

  function initialise() {
    chrome.storage.sync.get(["commutes"], ({ commutes }) => {
      if (commutes) setCommutes(commutes);
    });
    chrome.storage.sync.get(
      ["hour", "minute", "amPm"],
      ({ hour: h, minute: m, amPm: a }) => {
        if (h) setHour(h);
        if (m) setMinute(m);
        if (a) setAmPm(a);
      }
    );
    chrome.storage.sync.get(["darkMode"], ({ darkMode: dm }) => {
      if (dm) setDarkMode(dm);
      setLoaded(true);
    });
  }

  useEffect(() => {
    initialise();
  }, []);

  // while we're waiting for our darkmode preferences to sync, don't render any UI - stops flicker
  if (!loaded) return null;

  return (
    <div className={darkMode ? "dark" : ""}>
      <main>
        <div className="settings-row">
          <DarkModeBtn toggleDarkMode={toggleDarkMode} />
          <ArrivalTime
            setAmPm={setAmPm}
            amPm={amPm}
            setHour={setHour}
            hour={hour}
            setMinute={setMinute}
            minute={minute}
          />
        </div>
        <div className="mb-3" />
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
    </div>
  );
};

render(<Popup />, document.getElementById("popup"));
