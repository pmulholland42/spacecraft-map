import { kmPerAU, maxWidthDistance } from "../constants";
import { Coordinate } from "../interfaces";

/**
 * Returns the current scale factor - the ratio of the screen size to the actual size of what's being displayed
 * @param zoom The current zoom level
 */
export const getScaleFactor = (zoom: number) => {
  const kmPerPixel = maxWidthDistance / window.innerWidth;
  return Math.pow(1.5, zoom) / kmPerPixel;
};

/**
 * Converts a coordinate in space to a pixel coordinate on the screen
 * @param spaceCoords A set of coordinates in the solar system, measured in kilometers
 * @param zoom The current zoom level
 * @param screenCenter The space coordinates of the center of the screen
 * @returns The screen coordinates, in pixels
 */
export const toScreenCoords = (
  spaceCoords: Coordinate,
  zoom: number,
  screenCenter: Coordinate
): Coordinate => {
  const scaleFactor = getScaleFactor(zoom);
  const x = (spaceCoords.x - screenCenter.x) * scaleFactor + window.innerWidth / 2;
  const y = (spaceCoords.y - screenCenter.y) * scaleFactor + window.innerHeight / 2;
  return { x, y };
};

/**
 * Converts a pixel coordinate on the screen to a coordinate in space
 * @param screenCoords A set of pixel coords on the screen
 * @param zoom The current zoom level
 * @param screenCenter The space coordinates of the center of the screen
 * @returns A set of coords in the solar system, in kilometers
 */
export const toSpaceCoords = (
  screenCoords: Coordinate,
  zoom: number,
  screenCenter: Coordinate
): Coordinate => {
  const scaleFactor = getScaleFactor(zoom);

  const x = (screenCoords.x - window.innerWidth / 2) / scaleFactor + screenCenter.x;
  const y = (screenCoords.y - window.innerHeight / 2) / scaleFactor + screenCenter.y;
  return { x, y };
};

/**
 * Converts a distance from kilometers to pixels on the screen
 * @param distance The distance (km)
 * @param zoom The current zoom level
 */
export const toScreenDistance = (distance: number, zoom: number) => {
  const scaleFactor = getScaleFactor(zoom);
  return distance * scaleFactor;
};

/**
 * Converts a distance from pixels to kilometers
 * @param distance The distance (pixels)
 * @param zoom The current zoom level
 */
export const toSpaceDistance = (distance: number, zoom: number) => {
  const scaleFactor = getScaleFactor(zoom);
  return distance / scaleFactor;
};

/**
 * Converts a distance from astronomical units to kilometers
 * @param distance The distance (AU) to convert
 */
export const auToKm = (distance: number) => {
  return distance * kmPerAU;
};

/**
 * Converts an angle from degrees to radians
 * @param angle
 */
export const toRadians = (angle: number) => angle * (Math.PI / 180);

/**
 * Converts an angle from radians to degrees
 * @param angle
 */
export const toDegrees = (angle: number) => angle * (180 / Math.PI);
