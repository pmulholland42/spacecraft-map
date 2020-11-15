import { oneCentury } from "../constants";
import { Coordinate, OrbitalPosition, OrbitDefinition } from "../interfaces";
import { auToKm, toDegrees, toRadians } from "./conversions";

export const getOrbitalPosition = (orbit: OrbitDefinition, time: Date): OrbitalPosition => {
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
};

/**
 * Returns the period of an orbit
 * @param orbit
 * @returns The period (days)
 */
export const getPeriod = (orbit: OrbitDefinition) => {
  return 360 / (orbit.meanLongitudeRate / 36525);
};

export const getObjectCoordinates = (currentOrbit: OrbitalPosition, parentCoords: Coordinate): Coordinate => {
  const distanceFromParent = auToKm(
    currentOrbit.semiMajorAxis *
      (1 - currentOrbit.eccentricity * Math.cos(toRadians(currentOrbit.eccentricAnomaly)))
  );
  const angle = toRadians(currentOrbit.trueAnomaly + currentOrbit.longitudeOfPeriapsis);

  // The distance and angle are the polar coordinates of the object relative to its parent
  // Convert them to cartesian coords and add the parent's position to get the actual coords of the object
  const x = parentCoords.x + Math.cos(angle) * distanceFromParent;
  const y = parentCoords.y - Math.sin(angle) * distanceFromParent;

  return { x, y };
};
