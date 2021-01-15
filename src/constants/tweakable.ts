import { TimeStep } from "../interfaces";
import { oneDay, oneYear } from "./scientific";

// Constants that can be tweaked to alter the behavior of the app

/** When zoomed out all the way, how much distance (km) should the width of the screen take up? */
export const maxWidthDistance = 14960000000;
/** How big should planets appear when they are zoomed out really far */
export const minPlanetSize = 2;
/** Minimum zoom level - zoomed out all the way so the whole solar system is visible */
export const minZoomLevel = -1.5;
/** Maximum zoom level - zoomed in really close */
export const maxZoomLevel = 40;
/** Zoom in to this level when selecting a planet */
export const defaultPlanetZoom = 25;

export const timeSteps: TimeStep[] = [
  { label: "timeSteps.negativeTenYears", value: -oneYear * 10 },
  { label: "timeSteps.negativeOneYear", value: -oneYear },
  { label: "timeSteps.negativeThirtyDays", value: -oneDay * 30 },
  { label: "timeSteps.negativeOneDay", value: -oneDay },
  { label: "timeSteps.paused", value: 0 },
  { label: "timeSteps.oneDay", value: oneDay },
  { label: "timeSteps.thirtyDays", value: oneDay * 30 },
  { label: "timeSteps.oneYear", value: oneYear },
  { label: "timeSteps.tenYears", value: oneYear * 10 },
];
