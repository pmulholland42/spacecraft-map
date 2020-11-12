import { maxWidthDistance } from "../constants";
import { Coordinate } from "../interfaces/Coordinate";

/**
 * Converts a coordinate in space to a pixel coordinate on the screen
 * @param spaceCoords A set of coordinates in the solar system
 * @param zoom The current zoom level
 * @param screenCenter The space coordinates of the center of the screen
 */
export const toScreenCoords = (
  spaceCoords: Coordinate,
  zoom: number,
  screenCenter: Coordinate
): Coordinate => {
  const kmPerPixel = maxWidthDistance / window.innerWidth;
  const x = (spaceCoords.x + screenCenter.x) * (zoom / kmPerPixel) + window.innerWidth / 2;
  const y = (spaceCoords.y + screenCenter.y) * (zoom / kmPerPixel) + window.innerHeight / 2;
  return { x, y };
};

/**
 * Converts a pixel coordinate on the screen to a coordinate in space
 * @param screenCoords A set of coords on the screen
 * @param zoom The current zoom level
 * @param screenCenter The space coordinates of the center of the screen
 */
export const toSpaceCoords = (
  screenCoords: Coordinate,
  zoom: number,
  screenCenter: Coordinate
): Coordinate => {
  const kmPerPixel = maxWidthDistance / window.innerWidth;

  const x = (screenCoords.x - window.innerWidth / 2) / (zoom / kmPerPixel) - screenCenter.x;
  const y = (screenCoords.y - window.innerHeight / 2) / (zoom / kmPerPixel) - screenCenter.y;
  return { x, y };
};
