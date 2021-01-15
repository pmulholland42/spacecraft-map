import { oneCentury } from "../constants";
import { AstronomicalObject, Coordinate, OrbitalPosition, OrbitDefinition, TimeStep } from "../interfaces";
import { auToKm, toDegrees, toRadians } from "./conversions";

import moize from "moize";

export const getOrbitalPosition = moize.deep(
  /**
   * Gets the orbital parameters for a given time
   * @param orbit The orbit definition
   * @param time The time
   */
  (orbit: OrbitDefinition, time: Date): OrbitalPosition => {
    const centuriesSinceEpoch = (time.getTime() - orbit.epoch.getTime()) / oneCentury;
    const semiMajorAxis = orbit.semiMajorAxis + orbit.semiMajorAxisRate * centuriesSinceEpoch;
    const eccentricity = orbit.eccentricity + orbit.eccentricityRate * centuriesSinceEpoch;
    const inclination = orbit.inclination + orbit.inclinationRate * centuriesSinceEpoch;
    const meanLongitude = orbit.meanLongitude + orbit.meanLongitudeRate * centuriesSinceEpoch;
    const longitudeOfPeriapsis =
      orbit.longitudeOfPeriapsis + orbit.longitudeOfPeriapsisRate * centuriesSinceEpoch;
    const longitudeOfAscendingNode =
      orbit.longitudeOfAscendingNode + orbit.longitudeOfAscendingNodeRate * centuriesSinceEpoch;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(eccentricity, 2));
    const distanceFromCenterToFocus = Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2)); // c^2 = a^2 - b^2

    const argumentOfPeriapsis = longitudeOfPeriapsis - longitudeOfAscendingNode;

    let meanAnomaly = meanLongitude - longitudeOfPeriapsis;

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

    meanAnomaly = meanAnomaly % 360;

    // Use Newton's method to approximate the eccentric anomaly
    let eccentricAnomaly = meanAnomaly;
    for (let i = 0; i < 5; i++) {
      let delta =
        (eccentricAnomaly - eccentricity * Math.sin(toRadians(eccentricAnomaly)) - meanAnomaly) /
        (1 - eccentricity * Math.cos(toRadians(eccentricAnomaly)));
      eccentricAnomaly -= delta;
    }

    let trueAnomaly = toDegrees(
      2 *
        Math.atan(
          Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(toRadians(eccentricAnomaly / 2))
        )
    );

    if (trueAnomaly < 0) {
      trueAnomaly += 360;
    }

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

export const getRelativeCoordinates = moize(
  /**
   * Returns the polar coordinates of an object in space, relative to its parent (radians, km)
   * @param semiMajorAxis The semi-major axis of the object's orbit (AU)
   * @param eccentricity The eccentricity of the object's orbit
   * @param eccentricAnomaly The eccentric anomaly of the object's orbit (degrees)
   * @param trueAnomaly The true anomaly of the object's orbit (degrees)
   * @param longitudeOfPeriapsis The longitude of periapsis of the object's orbit (degrees)
   */
  (
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
  }
);

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

/**
 * Gets the distance between 2D points
 * @param pointA
 * @param pointB
 */
export const getDistance = (pointA: Coordinate, pointB: Coordinate) =>
  Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));

/**
 * Get the index of the time step with value 0
 */
export const getPausedTimeStepIndex = (timeSteps: TimeStep[]) => {
  // TODO: move this function somewhere else, maybe a common.ts file?
  let index = timeSteps.findIndex((step) => step.value === 0);
  if (index === -1) {
    index = 0;
  }
  return index;
};
