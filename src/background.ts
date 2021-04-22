import { TravelTime } from "types";
import fetchCommuteTime from "./api";
import {
  retrieveSavedCommutes,
  retrieveLatLong,
  storeVariable,
} from "./storage";
import { validApiResponse } from "./utils";

/*
 * Retrieves all commutes saved to storage and then triggers an API call
 * to calculate the duration of each. The result of each API call is then
 * sent to the FE using the port.
 */
async function calculateAllCommutes() {
  const commutes = await retrieveSavedCommutes();
  const origin = await retrieveLatLong();
  // filter any commutes where the destination has not been set
  const validCommutes = commutes.filter((c) => c.destination);

  // tell the frontend we are calculating and to await results
  await storeVariable({ travelTimes: [], loading: true });

  const apiCalls = validCommutes.map((comm) => fetchCommuteTime(origin, comm));
  const results = await Promise.all(apiCalls);
  const travelTimes: TravelTime[] = results.filter(validApiResponse);

  // tell the frontend we are done calculating results
  await storeVariable({ travelTimes, loading: false });

  console.log(`background: API calls complete`);
}

/*
 * When the user alters the destinations via the popup, changes are saved to storage.
 * This listener makes sure that after any changes are made, we recalculate our travel
 * times - if necessary
 */
chrome.storage.onChanged.addListener((changes) => {
  console.log("background: storage changed listener triggered");
  const { commutes, origin } = changes;
  // only re-calculate commute times if it was the commutes that have changed
  if (commutes || origin) {
    console.log("background: commutes changed in storage, recalculating times");
    calculateAllCommutes();
  }
});
