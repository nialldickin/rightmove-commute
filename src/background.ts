import { Commute, LatLng, TravelMode, TravelTime } from "rm-types";

// let port: chrome.runtime.Port | undefined;

// chrome.runtime.onConnect.addListener((newPort) => {
//   console.log("background: new connection");
//   console.assert(newPort.name === "rmcommute");
//   if (newPort.name === "rmcommute") {
//     port = newPort;
//   }
// });

/* 
  Translates our transport mode to the correct verb
 */
function translateTransportMode(mode: TravelMode) {
  switch (mode) {
    case TravelMode.DRIVING:
      return "car";
    case TravelMode.CYCLING:
      return "bicycle";
    case TravelMode.PUBLIC:
      return "public transport";
    case TravelMode.WALKING:
      return "foot";
    default:
      return "car";
  }
}

function composeTravelTime(
  timeText: string,
  destination: string,
  mode: TravelMode
): TravelTime {
  return {
    destination,
    duration: `${timeText} by ${translateTransportMode(mode)}`,
  };
}

// /*
//   Sends calculated results to the FE via the messaging port
//  */
// function sendMessageToContent(message: Object) {
//   if (port) {
//     port.postMessage(results);
//     console.log("background: sent message to content", results);
//   } else {
//     console.warn(
//       "background: failed to send results to content as missing active port"
//     );
//   }
// }

async function fetchCommuteTime(
  origin: LatLng,
  commute: Commute
): Promise<TravelTime | undefined> {
  const { destination, mode } = commute;
  const { latitude, longitude } = origin;

  const url = [
    "https://o1txka9p4j.execute-api.us-east-1.amazonaws.com/dev/travelmatrix/?",
    `latitude=${latitude}&`,
    `longitude=${longitude}&`,
    `destination=${destination}&`,
    `mode=${mode}`,
  ].join("");

  const response = await fetch(encodeURI(url));
  if (response.ok) {
    const json = await response.json();

    console.log("background: received response from gAPI", json);

    return composeTravelTime(json.durationText, destination, mode);
  }
  // TODO: handle 500 errors by alerting user of incorrect destination
  console.error("background: received bad status from gAPI", response);
  return undefined;
}

/* 
  Retrieves the lat/lng coords saved to storage by the FE
 */
function retrieveLatLong(): Promise<LatLng> {
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
  Retrieves all commutes saved to storage
 */
function retrieveSavedCommutes(): Promise<Commute[]> {
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

function setChromeStorage(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => resolve());
  });
}

function validApiResponse(item: TravelTime | undefined): item is TravelTime {
  return !!item;
}

/* 
  Retrieves all commutes saved to storage and then triggers an API call
  to calculate the duration of each. The result of each API call is then
  sent to the FE using the port.
 */
async function calculateAllCommutes() {
  const commutes = await retrieveSavedCommutes();
  const origin = await retrieveLatLong();
  // filter any commutes where the destination has not been set
  const validCommutes = commutes.filter((c) => c.destination);

  // tell the frontend we are calculating and to await results
  await setChromeStorage({ travelTimes: [], loading: true });

  const apiCalls = validCommutes.map((comm) => fetchCommuteTime(origin, comm));
  const results = await Promise.all(apiCalls);
  const travelTimes: TravelTime[] = results.filter(validApiResponse);

  // tell the frontend we are done calculating results
  await setChromeStorage({ travelTimes, loading: false });

  console.log(travelTimes);

  console.log(`background: API calls complete`);
}

// /*
//  When the frontend (content.tsx) mounts it sends a message
//  requesting a fresh calculation for commute times. This listener
//  handles that message and triggers the calculations / response.
//  */
// chrome.runtime.onMessage.addListener((message) => {
//   if (message.to === "background" && message.reason === "mount") {
//     console.log("background: received mount msg from FE");
//     calculateAllCommutes();
//   }
// });

/* 
 When the user alters the destinations via the popup, changes are saved to storage.
 This listener makes sure that after any changes are made, we recalculate our travel
 times - if necessary
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
