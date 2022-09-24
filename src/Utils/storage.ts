import { Commute, LatLng, TravelTime } from "types";
import { composeDate } from "./utils";

/*
 * Retrieves the travel times saved to storage
 */
export function retrieveTravelTimes(): Promise<TravelTime[] | undefined> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["travelTimes"], ({ travelTimes }) => {
      resolve(travelTimes);
    });
  });
}

/*
 * Retrieves the lat/lng coords saved to storage
 */
export function retrieveLatLong(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["origin"], ({ origin }) => {
      if (origin) {
        resolve(origin);
      } else {
        reject(new Error("Failed to retrieve any saved coordinates"));
      }
    });
  });
}

/*
 * Retrieves all commutes saved to storage
 */
export function retrieveSavedCommutes(): Promise<Commute[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["commutes"], ({ commutes }) => {
      if (commutes) {
        console.log(
          "background: sucessfully retrieved commutes from storage",
          commutes
        );
        resolve(commutes);
      } else {
        reject(new Error("Failed to retrieve any saved commutes"));
      }
    });
  });
}

/*
 * Retrieves arrival time saved to storage
 */
export function retrieveArrivalTime(): Promise<Date> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ["hour", "minute", "amPm"],
      ({ hour, minute, amPm }) => {
        if (hour && minute && amPm) {
          resolve(composeDate(hour, minute, amPm));
        } else {
          reject(new Error("Failed to retrieve arrival time from storage"));
        }
      }
    );
  });
}

/*
 * Promise wrapper for chrome storage .set() to enable await
 */
export function storeVariable(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => resolve());
  });
}
