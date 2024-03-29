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

export function extractCoordinate(
  coordinateType: string,
  imgSrc: string
): number {
  const regex = new RegExp(`${coordinateType}=([\\d|\\.|-]+)&`);
  const matches = imgSrc.match(regex);
  if (matches) {
    return parseFloat(matches[1]);
  }
  console.error(matches, `There was no ${coordinateType} match in imgSrc`);
  return 0;
}

export function composeDate(hour: string, minute: string, amPm: string): Date {
  const date = new Date();
  let formattedHour = parseInt(hour, 10);
  // handle formatting into a 24 hour format
  if (amPm === "AM") {
    if (formattedHour === 12) formattedHour = 0;
  }
  if (amPm === "PM") {
    if (formattedHour !== 12) formattedHour += 12;
  }
  date.setHours(formattedHour);
  date.setMinutes(parseInt(minute, 10));
  return date;
}
