import * as React from "react";
import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { TravelTime } from "rm-types";
import "./content.css";

function saveCoordinates(longitude: number, latitude: number) {
  chrome.storage.sync.set({ latitude, longitude });
}

function extractCoordinate(coordinateType: string, imgSrc: string): number {
  const regex = new RegExp(`${coordinateType}=([\\d|\\.|-]+)&`);
  const matches = imgSrc.match(regex);
  if (matches) {
    return parseFloat(matches[1]);
  } else {
    console.error(matches, `There was no ${coordinateType} match in imgSrc`);
    return 0;
  }
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

function requestTravelTimes() {
  chrome.runtime.sendMessage({ to: "background", reason: "mount" });
}

function registerMessageListener(
  setTravelTimes: React.Dispatch<React.SetStateAction<TravelTime[]>>
) {
  console.log("content: registering message listener");
  const port = chrome.runtime.connect({ name: "rmcommute" });
  port.onMessage.addListener((message) => {
    console.log("content: message received from bg port", message);
    setTravelTimes(message);
  });
}

const Content = () => {
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);

  useEffect(() => {
    console.log("content: useEffect fired");
    updatePropertyLocation();
    registerMessageListener(setTravelTimes);
    requestTravelTimes();
  }, []);

  return (
    <div className="w-full-row">
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
ReactDOM.render(<Content />, reactRoot);
