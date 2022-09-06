import { addDays, format, isAfter, isBefore, parse } from "date-fns";
import { oneDay, oneSecond } from "../constants";
import { HorizonsTimeStep } from "../interfaces";
import { OrbitalPosition } from "../interfaces/OrbitalPosition";
import {
  getArgumentOfPeriapsis,
  getDistanceFromCenterToFocus,
  getEccentricAnomaly,
  getMeanAnomaly,
  getSemiMinorAxis,
  getTrueAnomaly,
} from "./calculations";

const dateFormat = "yyyy-MM-dd";
const baseUrl = "http://127.0.0.1:8000";

// TODO: keep a rolling average of actual response times
/** Time (ms) for the horizons api to respond */
const apiResponseTime = 700;
/** Extra time (ms) to make requests early */
const bufferTime = 500;

interface OrbitalDataRequestParams {
  orbitalBodyId: string;
  center: string;
  startTime: Date;
  stopTime: Date;
  step: HorizonsTimeStep;
}

export const getOrbitalData = async ({
  orbitalBodyId,
  center,
  startTime,
  stopTime,
  step,
}: OrbitalDataRequestParams) => {
  const formattedStartTime = format(startTime, dateFormat);
  const formattedStopTime = format(stopTime, dateFormat);
  const url = `${baseUrl}/horizonsapi/orbital_position/?orbital_body_id=${orbitalBodyId}&center=${center}&start_time=${formattedStartTime}&stop_time=${formattedStopTime}&step=${step}`;
  const response: any[] = await fetch(url).then((response) => response.json());

  const orbitalPositions: OrbitalPosition[] = response.map((position) => {
    const eccentricity = position.fields.eccentricity;
    const inclination = position.fields.inclination;
    const longitudeOfAscendingNode = position.fields.longitude_of_ascending_node;
    const longitudeOfPeriapsis = position.fields.longitude_of_periapsis;
    const meanLongitude = position.fields.mean_longitude;
    const semiMajorAxis = position.fields.semimajor_axis;
    const time = parse(position.fields.time, "yyyy-MM-dd'T'HH:mm:ssX", new Date());
    const semiMinorAxis = getSemiMinorAxis(semiMajorAxis, eccentricity);
    const distanceFromCenterToFocus = getDistanceFromCenterToFocus(semiMajorAxis, semiMinorAxis);
    const argumentOfPeriapsis = getArgumentOfPeriapsis(longitudeOfPeriapsis, longitudeOfAscendingNode);
    const meanAnomaly = getMeanAnomaly(meanLongitude, longitudeOfPeriapsis);
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
      time,
    };
  });

  return orbitalPositions;
};

/**
 * Determines the number of days in advance for which we need to fetch orbital data.
 * The faster the time warp speed, the more of a "buffer" of data is needed.
 * @param displayTime
 * @param timeWarpSpeed Milliseconds per second
 * @param lastDateWithOrbitalData Earliest or latest depending on time warp direction
 * @returns A number of days, or 0 if no buffering is necessary at the moment.
 */
export const getDaysNeededToFetch = (
  displayTime: Date,
  timeWarpSpeed: number,
  lastDateWithOrbitalData: Date
): number => {
  const daysPerSecond = timeWarpSpeed / oneDay;
  const secondsNeeded = (apiResponseTime + bufferTime) / oneSecond;
  const daysNeeded = secondsNeeded * daysPerSecond;
  const dateNeeded = addDays(displayTime, daysNeeded);

  if (timeWarpSpeed > 0) {
    if (isAfter(dateNeeded, lastDateWithOrbitalData)) {
      return Math.ceil(daysNeeded);
    }
  } else if (timeWarpSpeed < 0) {
    if (isBefore(dateNeeded, lastDateWithOrbitalData)) {
      return Math.floor(daysNeeded);
    }
  }
  return 0;
};
