import { oneCentury, oneDay } from "../constants";
import { AstronomicalObject, Coordinate, OrbitalPosition, OrbitDefinition } from "../interfaces";
import { auToKm, toDegrees, toRadians } from "./conversions";

import moize from "moize";
import solarSystem, { sun } from "../data/solarSystem";

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
  let trueAnomaly = toDegrees(
    2 *
      Math.atan(
        Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(toRadians(eccentricAnomaly / 2))
      )
  );

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
 * Gets the coords (in km) of an object in space via recursion
 * @param object
 * @param time
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

export const getSpacecraftCoords = (position: OrbitalPosition, time: Date) => {
  const parentCoords = getObjectCoordinates(sun, time);

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
