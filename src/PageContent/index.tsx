import React, { useState, useEffect, ReactElement } from "react";
import styled from "styled-components";
import { TravelTime } from "types";
import { retrieveTravelTimes, storeVariable } from "../helpers/storage";
import { setupDOM, getMapImgSrc } from "../helpers/dom";

const CommuteTimeContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CommuteTimeRow = styled.div`
  padding-right: 12px;
  padding-bottom: 8px;
`;

const Text = styled.span<{ $bold?: boolean }>`
  ${($bold) => $bold && "font-weight: bold"}
`;

function updatePropertyLocation() {
  const { latitude, longitude } = getMapImgSrc(document);
  storeVariable({ origin: { longitude, latitude } });
}

const Content = (): ReactElement => {
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);
  const [loading, setLoading] = useState(true);

  const storageListener = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    console.log("content: storage changed listener triggered", changes);
    const { travelTimes: ttChanges, loading: loadingChanges } = changes;

    if (ttChanges) setTravelTimes(ttChanges.newValue);
    if (loadingChanges) setLoading(loadingChanges.newValue);
  };

  async function loadTravelTimes() {
    const times = await retrieveTravelTimes();
    if (times) setTravelTimes(times);
    setLoading(false);
  }

  useEffect(() => {
    loadTravelTimes();
    chrome.storage.onChanged.addListener(storageListener);
    updatePropertyLocation();

    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  return (
    <CommuteTimeContainer>
      {loading ? <Text>Calculating commute times...</Text> : null}
      {travelTimes.map((travelTime) => (
        <CommuteTimeRow>
          <Text $bold>{travelTime.destination}: </Text>
          <Text>{travelTime.duration}</Text>
        </CommuteTimeRow>
      ))}
    </CommuteTimeContainer>
  );
};

export default Content;

setupDOM(Content);
