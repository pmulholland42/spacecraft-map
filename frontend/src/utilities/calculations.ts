import { oneCentury, oneDay } from "../constants";
import { AstronomicalObject, Coordinate, OrbitalPosition, OrbitDefinition } from "../interfaces";
import { auToKm, toDegrees, toRadians } from "./conversions";

import moize from "moize";
import solarSystem from "../data/solarSystem";
import { differenceInSeconds } from "date-fns";

export const getSemiMinorAxis = (semiMajorAxis: number, eccentricity: number) =>
  semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));

export const getDistanceFromCenterToFocus = (semiMajorAxis: number, semiMinorAxis: number) =>
  Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2)); // c^2 = a^2 - b^2

export const getArgumentOfPeriapsis = (longitudeOfPeriapsis: number, longitudeOfAscendingNode: number) =>
  longitudeOfPeriapsis - longitudeOfAscendingNode;

export const getMeanAnomaly = (meanLongitude: number, longitudeOfPeriapsis: number) =>
  meanLongitude - longitudeOfPeriapsis;

export const getEccentricAnomaly = (meanAnomaly: number, eccentricity: number, iterations: number = 100) => {
  // Use Newton's method to approximate the eccentric anomaly
  // This solves Kepler's equation: M = E - e* sin(E)
  // where M is mean anomaly, E is eccentric anomaly
  let eccentricAnomaly = meanAnomaly;
  const eStar = eccentricity * 57.29578;
  for (let i = 0; i < 100; i++) {
    let prevE = eccentricAnomaly;
    eccentricAnomaly = meanAnomaly + eStar * Math.sin(toRadians(eccentricAnomaly));
    if (Math.abs(prevE - eccentricAnomaly) < 10e-6) {
      break;
    }
  }
  return eccentricAnomaly;
};

export const getTrueAnomaly = (eccentricity: number, eccentricAnomaly: number) => {
  // TODO: fix this for hyperbolic orbits (eccentricity > 1)
  let trueAnomaly = toDegrees(
    2 *
      Math.atan(
        Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(toRadians(eccentricAnomaly / 2))
      )
  );

  // Alternate equation:
  // const beta = eccentricity / (1 + Math.sqrt(1 - Math.pow(eccentricity, 2)));
  // let trueAnomaly = eccentricAnomaly +
  // 2 * Math.atan((beta * Math.sin(eccentricAnomaly)) / (1 - beta * Math.cos(eccentricAnomaly)));

  if (trueAnomaly < 0) {
    trueAnomaly += 360;
  }

  return trueAnomaly;
};

export const getOrbitalPosition = moize.deep(
  /**
   * Gets the orbital parameters for a given time
   * @param orbit The orbit definition
   * @param time The time
   */
  (orbit: OrbitDefinition, time: Date): OrbitalPosition => {
    const centuriesSinceEpoch = (time.getTime() - orbit.epoch.getTime()) / oneCentury;

    // Compute the value of each of that planet's six elements
    const semiMajorAxis = orbit.semiMajorAxis + orbit.semiMajorAxisRate * centuriesSinceEpoch;
    const eccentricity = orbit.eccentricity + orbit.eccentricityRate * centuriesSinceEpoch;
    const inclination = orbit.inclination + orbit.inclinationRate * centuriesSinceEpoch;
    const meanLongitude = orbit.meanLongitude + orbit.meanLongitudeRate * centuriesSinceEpoch;
    const longitudeOfPeriapsis =
      orbit.longitudeOfPeriapsis + orbit.longitudeOfPeriapsisRate * centuriesSinceEpoch;
    const longitudeOfAscendingNode =
      orbit.longitudeOfAscendingNode + orbit.longitudeOfAscendingNodeRate * centuriesSinceEpoch;
    const semiMinorAxis = getSemiMinorAxis(semiMajorAxis, eccentricity);
    const distanceFromCenterToFocus = getDistanceFromCenterToFocus(semiMajorAxis, semiMinorAxis);

    // Compute the argument of perihelion and the mean anomaly
    const argumentOfPeriapsis = getArgumentOfPeriapsis(longitudeOfPeriapsis, longitudeOfAscendingNode);

    let meanAnomaly = getMeanAnomaly(meanLongitude, longitudeOfPeriapsis);

    // Correction factor needed for outer planets
    if (orbit.b !== undefined) {
      meanAnomaly += orbit.b * Math.pow(centuriesSinceEpoch, 2);
    }
    if (orbit.c !== undefined && orbit.f !== undefined) {
      meanAnomaly += orbit.c * Math.cos(toRadians(orbit.f * centuriesSinceEpoch));
    }
    if (orbit.s !== undefined && orbit.f !== undefined) {
      meanAnomaly += orbit.s * Math.sin(toRadians(orbit.f * centuriesSinceEpoch));
    }

    meanAnomaly = meanAnomaly % 360; //- 180;

    const eccentricAnomaly = getEccentricAnomaly(meanAnomaly, eccentricity);

    const trueAnomaly = getTrueAnomaly(eccentricity, eccentricAnomaly);

    return {
      semiMajorAxis,
      eccentricity,
      inclination,
      meanLongitude,
      longitudeOfPeriapsis,
      longitudeOfAscendingNode,
      semiMinorAxis,
      distanceFromCenterToFocus,
      argumentOfPeriapsis,
      meanAnomaly,
      eccentricAnomaly,
      trueAnomaly,
    };
  },
  {
    // Memoization really only helps when zooming/panning, because then the map is re-rendering but the orbital positions aren't changing.
    // When time warping, the positions are changing so fast that we never get the same one twice, so the memoization cache is useless.
    // So we only need one cache entry per object, to remember each of their positions while zooming/panning. Hence this maxSize:
    maxSize: solarSystem.length,
  }
);

/**
 * Returns the period of an orbit
 * @param orbit
 * @returns The period (days)
 */
export const getPeriod = (orbit: OrbitDefinition) => {
  return 360 / (orbit.meanLongitudeRate / 36525);
};

/**
 * Returns the polar coordinates of an object in space, relative to its parent (radians, km)
 * @param semiMajorAxis The semi-major axis of the object's orbit (AU)
 * @param eccentricity The eccentricity of the object's orbit
 * @param eccentricAnomaly The eccentric anomaly of the object's orbit (degrees)
 * @param trueAnomaly The true anomaly of the object's orbit (degrees)
 * @param longitudeOfPeriapsis The longitude of periapsis of the object's orbit (degrees)
 */
export const getRelativeCoordinates = (
  semiMajorAxis: number,
  eccentricity: number,
  eccentricAnomaly: number,
  trueAnomaly: number,
  longitudeOfPeriapsis: number
): { angle: number; distanceFromParent: number } => {
  const distanceFromParent = auToKm(
    semiMajorAxis * (1 - eccentricity * Math.cos(toRadians(eccentricAnomaly)))
  );
  const angle = toRadians(trueAnomaly + longitudeOfPeriapsis);

  return { angle, distanceFromParent };
};

/**
 * Gets the coordinates of an object in space relative to the center of the Solar System
 * @param object
 * @param time
 * @returns The object coordinates in space (km)
 */
export const getObjectCoordinates = (object: AstronomicalObject | undefined, time: Date): Coordinate => {
  if (object?.parent === undefined) {
    return { x: 0, y: 0 };
  } else {
    const position = getOrbitalPosition(object.orbit, time);
    const parentCoords = getObjectCoordinates(object.parent, time);
    const { angle, distanceFromParent } = getRelativeCoordinates(
      position.semiMajorAxis,
      position.eccentricity,
      position.eccentricAnomaly,
      position.trueAnomaly,
      position.longitudeOfPeriapsis
    );

    // The distance and angle are the polar coordinates of the object relative to its parent
    // Convert them to cartesian coords and add the parent's position to get the actual coords of the object
    const x = parentCoords.x + Math.cos(angle) * distanceFromParent;
    const y = parentCoords.y - Math.sin(angle) * distanceFromParent;

    return { x, y };
  }
};

/**
 * Gets the coordinates of a spacecraft relative to the center of the Solar System
 * @param position
 * @param time
 * @returns The spacecraft coordinates in space (km)
 */
export const getSpacecraftCoords = (
  position: OrbitalPosition,
  time: Date,
  parent: AstronomicalObject
): Coordinate => {
  const parentCoords = getObjectCoordinates(parent, time);

  const { angle, distanceFromParent } = getRelativeCoordinates(
    position.semiMajorAxis,
    position.eccentricity,
    position.eccentricAnomaly,
    position.trueAnomaly,
    position.longitudeOfPeriapsis
  );

  // The distance and angle are the polar coordinates of the object relative to its parent
  // Convert them to cartesian coords and add the parent's position to get the actual coords of the object
  const x = parentCoords.x + Math.cos(angle) * distanceFromParent;
  const y = parentCoords.y - Math.sin(angle) * distanceFromParent;

  return { x, y };
};

/**
 * Gets the distance between 2D points
 * @param pointA
 * @param pointB
 */
export const getDistance = (pointA: Coordinate, pointB: Coordinate) =>
  Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));

/**
 * Gets the space distance (km) between two objects at a given time
 * @param objectA
 * @param objectB
 * @param time
 */
export const getObjectDistance = (
  objectA: AstronomicalObject,
  objectB: AstronomicalObject,
  time: Date
): number => getDistance(getObjectCoordinates(objectA, time), getObjectCoordinates(objectB, time));

/**
 * Gets the time of the next closest approach of two objects
 * @param objectA
 * @param objectB
 * @param time The time after which to find the next closest approach
 */
export const getNextClosestApproach = (
  objectA: AstronomicalObject,
  objectB: AstronomicalObject,
  time: Date
): Date => {
  let timeStep = oneDay * 10;
  let currentTime = new Date(time);
  let prevDistance = getObjectDistance(objectA, objectB, currentTime);
  let gettingCloser: boolean | null = null;

  while (timeStep >= oneDay / 10) {
    currentTime = new Date(currentTime.getTime() + timeStep);
    let newDistance = getObjectDistance(objectA, objectB, currentTime);
    if (newDistance > prevDistance && gettingCloser) {
      // Passed the closest approach
      currentTime = new Date(currentTime.getTime() - timeStep);
      timeStep /= 10;
    } else if (newDistance > prevDistance) {
      gettingCloser = false;
    } else {
      gettingCloser = true;
    }

    prevDistance = newDistance;
  }

  return currentTime;
};

/**
 * Gets the coordinates of a spacecraft at the specified time
 * @param orbitalPositions
 * @param displayTime
 * @returns The spacecraft coordinates in space (km)
 */
export const getInterpolatedSpacecraftCoords = (
  orbitalPositions: OrbitalPosition[],
  displayTime: Date,
  parent: AstronomicalObject
): Coordinate => {
  // From all the orbital positions in the list, we want to find the ones directly before and
  // directly after the current display time
  let interpolatedPosition: OrbitalPosition;

  let minTimeDiffBefore = Infinity;
  let minTimeDiffAfter = -Infinity;
  let orbitalPositionBefore: OrbitalPosition | null = null;
  let orbitalPositionAfter: OrbitalPosition | null = null;

  // TODO: find a more efficient way to do this.
  // The array shouldTM be sorted so this can probably be simplified.
  for (let i = 0; i < orbitalPositions.length; i++) {
    const orbit = orbitalPositions[i];
    if (orbit.time !== undefined) {
      const timeDiff = differenceInSeconds(displayTime, orbit.time);
      if (timeDiff >= 0) {
        if (timeDiff < minTimeDiffBefore) {
          minTimeDiffBefore = timeDiff;
          orbitalPositionBefore = orbit;
        }
      } else {
        if (timeDiff > minTimeDiffAfter) {
          minTimeDiffAfter = timeDiff;
          orbitalPositionAfter = orbit;
        }
      }
    }
  }

  if (orbitalPositionBefore === null) {
    // The current display time is before all positions in the array, so use the earliest one
    interpolatedPosition = orbitalPositionAfter!;
  } else if (orbitalPositionAfter === null) {
    // The current display time is before all positions in the array, so use the latest one
    interpolatedPosition = orbitalPositionBefore;
  } else {
    // Now that we've found the two positions, do the actual interpolation
    // Both positions must have time defined or else they wouldn't have been picked in the for loop, hence the !
    const beforeTimeDiff = differenceInSeconds(displayTime, orbitalPositionBefore.time!);
    const afterTimeDiff = differenceInSeconds(orbitalPositionAfter.time!, displayTime);
    const percent = beforeTimeDiff / (beforeTimeDiff + afterTimeDiff);

    const eccentricity = interpolate(
      orbitalPositionBefore.eccentricity,
      orbitalPositionAfter.eccentricity,
      percent
    );
    // Currently, getRelativeCoordinates doesn't use some of these attributes,
    // so we can just leave them as 0, or any number really
    const inclination = 0;
    const longitudeOfAscendingNode = 0;
    const longitudeOfPeriapsis = interpolate(
      orbitalPositionBefore.longitudeOfPeriapsis,
      orbitalPositionAfter.longitudeOfPeriapsis,
      percent
    );

    const meanLongitude = interpolateDegrees(
      orbitalPositionBefore.meanLongitude,
      orbitalPositionAfter.meanLongitude,
      percent
    );

    const semiMajorAxis = interpolate(
      orbitalPositionBefore.semiMajorAxis,
      orbitalPositionAfter.semiMajorAxis,
      percent
    );
    const semiMinorAxis = getSemiMinorAxis(semiMajorAxis, eccentricity);
    const distanceFromCenterToFocus = getDistanceFromCenterToFocus(semiMajorAxis, semiMinorAxis);
    const argumentOfPeriapsis = 0; // getArgumentOfPeriapsis(longitudeOfPeriapsis, longitudeOfAscendingNode);
    const meanAnomaly = getMeanAnomaly(meanLongitude, longitudeOfPeriapsis);
    const eccentricAnomaly = getEccentricAnomaly(meanAnomaly, eccentricity);
    const trueAnomaly = getTrueAnomaly(eccentricity, eccentricAnomaly);

    interpolatedPosition = {
      argumentOfPeriapsis,
      distanceFromCenterToFocus,
      eccentricAnomaly,
      eccentricity,
      inclination,
      longitudeOfAscendingNode,
      longitudeOfPeriapsis,
      meanAnomaly,
      meanLongitude,
      semiMajorAxis,
      semiMinorAxis,
      trueAnomaly,
    };
  }

  // We could have instead called getSpacecraftCoords on the before and after positions,
  // and then interpolated the resulting {x, y} coordinates. However when done this way, there
  // is a slight "bouncing" effect on the object as it moves. Doing it this way
  // (interpolating the individual orbital properties first) makes for a smoother animation.
  const coords = getSpacecraftCoords(interpolatedPosition, displayTime, parent);
  return coords;
};

const interpolate = (a: number, b: number, percent: number) => {
  return a + (b - a) * percent;
};

const interpolateDegrees = (a: number, b: number, percent: number) => {
  const diff = Math.abs(b - a);
  if (diff > 180) {
    if (b > a) {
      a += 360;
    } else {
      b += 360;
    }
  }

  const result = interpolate(a, b, percent);

  if (result >= 0 && result <= 360) {
    return result;
  } else {
    return result % 360;
  }
};
