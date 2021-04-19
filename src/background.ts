import { Commute, TravelMode, TravelTime } from "rm-types";

let port: chrome.runtime.Port | undefined;

chrome.runtime.onConnect.addListener((newPort) => {
  console.log("background: new connection");
  console.assert(newPort.name == "rmcommute");
  if (newPort.name === "rmcommute") {
    port = newPort;
  }
});

function composeTravelTime(
  timeText: string,
  destination: string,
  mode: TravelMode
): TravelTime {
  return {
    destination: destination,
    duration: `${timeText} by ${translateTransportMode(mode)}`,
  };
}

/* 
  Sends calculated results to the FE via the messaging port
 */
function sendResultsToContent(results: TravelTime[]) {
  if (port) {
    port.postMessage(results);
    console.log("background: sent message to content", results);
  } else {
    console.warn(
      "background: failed to send results to content as missing active port"
    );
  }
}

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
  }
}

async function fetchCommuteTime(
  origin: { latitude: number; longitude: number },
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
  } else {
    // TODO: handle 500 errors by alerting user of incorrect destination
    console.error("background: received bad status from gAPI", response);
  }
  return;
}

/* 
  Retrieves the lat/lng coords saved to storage by the FE
 */
function retrieveLatLong(
  callback: (latitude: number, longitude: number) => void
) {
  chrome.storage.sync.get(
    ["latitude", "longitude"],
    ({ latitude, longitude }) => callback(latitude, longitude)
  );
}

/* 
  Retrieves all commutes saved to storage
 */
function retrieveSavedCommutes(callback: (commutes: Commute[]) => void) {
  chrome.storage.sync.get(["commutes"], ({ commutes }) => {
    if (commutes) {
      console.log(
        "background: sucessfully retrieved commutes from storage",
        commutes
      );
      callback(commutes);
    } else {
      console.warn("background: failed to retrieve any saved commutes");
    }
  });
}

/* 
  Retrieves all commutes saved to storage and then triggers an API call
  to calculate the duration of each. The result of each API call is then
  sent to the FE using the port.
 */
function calculateAllCommutes() {
  retrieveSavedCommutes((commutes: Commute[]) => {
    retrieveLatLong(async (latitude, longitude) => {
      const results: TravelTime[] = [];

      for (const commute of commutes) {
        // filters out any commutes where the user has not yet inputted a destination
        if (commute.destination) {
          const result = await fetchCommuteTime(
            { latitude, longitude },
            commute
          );
          if (result) results.push(result);
        }
      }

      console.log(
        `background: API calls complete, retrieved ${results.length} sucessful responses`
      );

      sendResultsToContent(results);
    });
  });
}

/* 
 When the frontend (content.tsx) mounts it sends a message 
 requesting a fresh calculation for commute times. This listener
 handles that message and triggers the calculations / response.
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.to === "background" && message.reason === "mount") {
    console.log("background: received mount msg from FE");
    calculateAllCommutes();
  }
});

/* 
 When the user alters the destinations via the popup, changes are saved to storage.
 This listener makes sure that after any changes are made, we recalculate our travel
 times - if necessary
 */
chrome.storage.onChanged.addListener((changes) => {
  console.log("background: storage changed listener triggered");
  for (const [key] of Object.entries(changes)) {
    // only re-calculate commute times if it was the commutes that have changed
    if (key === "commutes") {
      console.log(
        "background: commutes changed in storage, recalculating times"
      );
      calculateAllCommutes();
    }
  }
});
