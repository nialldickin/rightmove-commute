import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { TravelTime } from "rm-types";
import "./style.css";

function saveCoordinates(longitude: number, latitude: number) {
  chrome.storage.sync.set({ origin: { latitude, longitude } });
}

function extractCoordinate(coordinateType: string, imgSrc: string): number {
  const regex = new RegExp(`${coordinateType}=([\\d|\\.|-]+)&`);
  const matches = imgSrc.match(regex);
  if (matches) {
    return parseFloat(matches[1]);
  }
  console.error(matches, `There was no ${coordinateType} match in imgSrc`);
  return 0;
}

function getMapImgSrc() {
  const imgElement = document.querySelector('[href="#/map"] > img');
  if (imgElement) {
    const imgSrc = imgElement.getAttribute("src");
    if (imgSrc) {
      const longitude = extractCoordinate("longitude", imgSrc);
      const latitude = extractCoordinate("latitude", imgSrc);
      return { latitude, longitude };
    }
  } else {
    console.log("content: failed to locate img on page");
  }
  return { latitude: 0, longitude: 0 };
}

function updatePropertyLocation() {
  const { latitude, longitude } = getMapImgSrc();
  saveCoordinates(longitude, latitude);
}

function registerMessageListener(
  setTravelTimes: (arg: TravelTime[]) => void,
  setLoading: (arg: boolean) => void
) {
  console.log("content: registering storage listener");

  chrome.storage.onChanged.addListener((changes) => {
    console.log("content: storage changed listener triggered");
    const { travelTimes, loading } = changes;

    if (travelTimes !== undefined) setTravelTimes(travelTimes.newValue);
    if (loading !== undefined) setLoading(loading.newValue);
  });
}

function initTravelTimes(
  setTravelTimes: (arg: TravelTime[]) => void,
  setLoading: (arg: boolean) => void
) {
  chrome.storage.sync.get(["travelTimes"], ({ travelTimes }) => {
    if (travelTimes) setTravelTimes(travelTimes);
    setLoading(false);
  });
}

const Content = () => {
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("content: useEffect fired");
    initTravelTimes(setTravelTimes, setLoading);
    registerMessageListener(setTravelTimes, setLoading);
    updatePropertyLocation();
  }, []);

  return (
    <div className="w-full-row">
      {loading ? <span>loading...</span> : null}
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
