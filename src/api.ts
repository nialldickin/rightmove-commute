import { LatLng, Commute, TravelTime } from "types";
import { composeTravelTime } from "./utils";

const awsUrl =
  "https://o1txka9p4j.execute-api.us-east-1.amazonaws.com/dev/travelmatrix/";

export default async function fetchCommuteTime(
  origin: LatLng,
  commute: Commute,
  arrivalTime: Date
): Promise<TravelTime | null> {
  const { destination, mode } = commute;
  const { latitude, longitude } = origin;

  const url = new URL(awsUrl);
  url.searchParams.append("latitude", `${latitude}`);
  url.searchParams.append("longitude", `${longitude}`);
  url.searchParams.append("destination", destination);
  url.searchParams.append("mode", mode);
  url.searchParams.append(
    "arrival_time",
    `${Math.floor(arrivalTime.getTime() / 1000)}`
  );

  console.log(url.href);

  const response = await fetch(encodeURI(url.href));
  if (response.ok) {
    const json = await response.json();

    console.log("background: received response from gAPI", json);

    return composeTravelTime(json.durationText, destination, mode);
  }
  // TODO: handle 500 errors by alerting user of incorrect destination
  console.warn("background: received bad status from gAPI", response);
  return null;
}
