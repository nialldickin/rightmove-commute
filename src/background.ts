import { TravelTime } from "types";
import fetchCommuteTime from "./api";
import {
  retrieveSavedCommutes,
  retrieveLatLong,
  storeVariable,
  retrieveArrivalTime,
} from "./storage";
import { validApiResponse } from "./utils";

/*
 * Retrieves all commutes saved to storage and then triggers an API call
 * to calculate the duration of each. The results are collate and then
 * saved to storage - triggering the content storage listener to update
 */
async function calculateAllCommutes() {
  const commutes = await retrieveSavedCommutes();
  const origin = await retrieveLatLong();
  const arrivalTime = await retrieveArrivalTime();
  // filter any commutes where the destination has not been set
  const validCommutes = commutes.filter((c) => c.destination);

  // tell the frontend we are calculating and to await results
  await storeVariable({ travelTimes: [], loading: true });

  const apiCalls = validCommutes.map((comm) =>
    fetchCommuteTime(origin, comm, arrivalTime)
  );
  const results = await Promise.all(apiCalls);
  const travelTimes: TravelTime[] = results.filter(validApiResponse);

  // tell the frontend we are done calculating results
  await storeVariable({ travelTimes, loading: false });

  console.log(`background: API calls complete`);
}

/*
 * When the user alters the destinations via the popup, changes are saved to storage.
 * Each time a user visits a new property, the corresponding lat/lng are also saved.
 * This listener makes sure that after any changes are made, we recalculate our travel
 * times - if necessary
 */
chrome.storage.onChanged.addListener((changes) => {
  console.log("background: storage changed listener triggered");
  const { commutes, origin, hour, minute, amPm } = changes;
  // only re-calculate commute times if it is necessary
  if (commutes || origin || hour || minute || amPm) {
    console.log("background: commutes changed in storage, recalculating times");
    calculateAllCommutes();
  }
});
