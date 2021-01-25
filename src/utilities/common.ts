import { daysInACentury, j2000Epoch } from "../constants";
import solarSystem from "../data/solarSystem";
import { AstronomicalObject, OrbitDefinition, TimeStep } from "../interfaces";

/**
 * Find an astronomical object by its id string
 * @param objectId
 */
export const findObjectById = (objectId: string): AstronomicalObject | null =>
  solarSystem.find((object) => object.id === objectId) ?? null;

/**
 * Get the index of the time step with value 0
 */
export const getPausedTimeStepIndex = (timeSteps: TimeStep[]) => {
  let index = timeSteps.findIndex((step) => step.value === 0);
  if (index === -1) {
    index = 0;
  }
  return index;
};

/**
 * Parses data from JPL's HORIZONS system into an OrbitDefinition
 * This is currently intended to be called manually from the browser console
 * Using the HORIZONS web interface, get elements data for the object you want to add
 * Set the output to CSV and paste the CSV data in as the argument of this function
 * @param csv
 */
export const parseHorizonsData = (csv: string): OrbitDefinition => {
  const data = csv.split(",");
  const initialSemiMajorAxis = Number(data[11]);
  const initialEccentricity = Number(data[2]);
  const initialInclination = Number(data[4]);
  const initialLongitudeOfAscendingNode = Number(data[5]);
  const initialArgumentOfPeriapsis = Number(data[6]);
  const initialMeanAnomaly = Number(data[9]);
  const initialMeanLongitude =
    initialLongitudeOfAscendingNode + initialArgumentOfPeriapsis + initialMeanAnomaly;
  const initialLongitudeOfPeriapsis = initialLongitudeOfAscendingNode + initialArgumentOfPeriapsis;

  const finalSemiMajorAxis = Number(data[11 + 14]);
  const finalEccentricity = Number(data[2 + 14]);
  const finalInclination = Number(data[4 + 14]);
  const finalLongitudeOfAscendingNode = Number(data[5 + 14]);
  const finalArgumentOfPeriapsis = Number(data[6 + 14]);
  const finalLongitudeOfPeriapsis = finalLongitudeOfAscendingNode + finalArgumentOfPeriapsis;

  const period = Number(data[13]);
  const meanLongitudeRate = (daysInACentury / period) * 360;

  const orbitDefinition: OrbitDefinition = {
    epoch: j2000Epoch,
    semiMajorAxis: initialSemiMajorAxis,
    semiMajorAxisRate: finalSemiMajorAxis - initialSemiMajorAxis,
    eccentricity: initialEccentricity,
    eccentricityRate: finalEccentricity - initialEccentricity,
    inclination: initialInclination,
    inclinationRate: finalInclination - initialInclination,
    meanLongitude: initialMeanLongitude,
    meanLongitudeRate,
    longitudeOfPeriapsis: initialLongitudeOfPeriapsis,
    longitudeOfPeriapsisRate: finalLongitudeOfPeriapsis - initialLongitudeOfPeriapsis,
    longitudeOfAscendingNode: initialLongitudeOfAscendingNode,
    longitudeOfAscendingNodeRate: finalLongitudeOfAscendingNode - initialLongitudeOfAscendingNode,
  };
  console.log(JSON.stringify(orbitDefinition));
  return orbitDefinition;
};

// eslint-disable-next-line
(window as any).parseHorizonsData = parseHorizonsData;
