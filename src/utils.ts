import { TravelMode, TravelTime } from "types";

/*
 * Translates our transport mode to the correct verb
 */
export function translateTransportMode(mode: TravelMode): string {
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

export function composeTravelTime(
  timeText: string,
  destination: string,
  mode: TravelMode
): TravelTime {
  return {
    destination,
    duration: `${timeText} by ${translateTransportMode(mode)}`,
  };
}

export function validApiResponse(item: TravelTime | null): item is TravelTime {
  return !!item;
}

function extractCoordinate(coordinateType: string, imgSrc: string): number {
  const regex = new RegExp(`${coordinateType}=([\\d|\\.|-]+)&`);
  const matches = imgSrc.match(regex);
  if (matches) {
    return parseFloat(matches[1]);
  }
  console.error(matches, `There was no ${coordinateType} match in imgSrc`);
  return 0;
}

export function getMapImgSrc(document: Document) {
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
