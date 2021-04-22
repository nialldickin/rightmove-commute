import React, { useState, useEffect, ReactElement } from "react";
import { render } from "react-dom";
import { TravelTime } from "types";
import { storeVariable } from "../storage";
import { getMapImgSrc } from "../utils";
import "./style.css";

function updatePropertyLocation() {
  const { latitude, longitude } = getMapImgSrc(document);
  storeVariable({ origin: { longitude, latitude } });
}

function registerStorageListener(
  setTravelTimes: (arg: TravelTime[]) => void,
  setLoading: (arg: boolean) => void
) {
  console.log("content: registering storage listener");

  chrome.storage.onChanged.addListener((changes) => {
    console.log("content: storage changed listener triggered", changes);
    const { travelTimes, loading } = changes;

    if (travelTimes !== undefined) setTravelTimes(travelTimes.newValue);
    if (loading !== undefined) setLoading(loading.newValue);
  });
}

function loadTravelTimes(
  setTravelTimes: (arg: TravelTime[]) => void,
  setLoading: (arg: boolean) => void
) {
  chrome.storage.sync.get(["travelTimes"], ({ travelTimes }) => {
    if (travelTimes) setTravelTimes(travelTimes);
    setLoading(false);
  });
}

const Content = (): ReactElement => {
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function initialise() {
    loadTravelTimes(setTravelTimes, setLoading);
    registerStorageListener(setTravelTimes, setLoading);
    updatePropertyLocation();
  }

  useEffect(() => initialise(), []);

  return (
    <div className="w-full-row">
      {loading ? <span>Calculating commute times...</span> : null}
      {travelTimes.map((tt) => (
        <div className="commute-time">
          <span className="font-bold">{tt.destination}: </span>
          <span>{tt.duration}</span>
        </div>
      ))}
    </div>
  );
};

const main = document.querySelector("main");
const reactRoot = document.createElement("div");
main?.prepend(reactRoot);
render(<Content />, reactRoot);
