import React, { useState, useEffect, ReactElement, createElement } from "react";
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

  useEffect(() => {
    loadTravelTimes(setTravelTimes, setLoading);
    registerStorageListener(setTravelTimes, setLoading);
    updatePropertyLocation();
  }, []);

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

/*
 * Create an keep references to our react componenent and rootNode.
 * This prevents us re-creating the component each time we re-insert,
 * thus preventing re-registering the storage listeners and the
 * conflicts this causes
 */
const content = createElement(Content);
const reactRoot = document.createElement("div");

function insertIntoDOM() {
  const main = document.querySelector("[itemprop='streetAddress']");
  main?.prepend(reactRoot);
  render(content, reactRoot);
}

insertIntoDOM();

/*
 * Whilst viewing a property a user can view a gallery or map, triggering
 * the DOM to change and our rootNode to be removed. To counter this we
 * register a listener to check for when the user has returned to the std
 * property view (no suffix after the /) and then re-insert our component
 */
window.addEventListener("hashchange", async (e) => {
  // we have returned from either map or gallery view to main page
  if (e.newURL.endsWith("#/")) {
    await new Promise((r) => setTimeout(r, 50));
    // re-create root node since it will have been removed from DOM by Rightmove's React src
    insertIntoDOM();
  }
});
