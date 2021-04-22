import { Commute, LatLng } from "types";

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
 * Promise wrapper for chrome storage .set() to enable await
 */
export function storeVariable(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => resolve());
  });
}
