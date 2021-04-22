declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "rm-types" {
  export const enum TravelMode {
    DRIVING = "driving",
    PUBLIC = "transit",
    CYCLING = "bicycling",
    WALKING = "walking",
  }

  export interface Commute {
    destination: string;
    mode: TravelMode;
  }

  export interface TravelTime {
    destination: string;
    duration: string;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }
}
