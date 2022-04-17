import { format } from "date-fns";
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

export const getOrbitalData = async (
  orbitalBodyId: number,
  center: string,
  startTime: Date,
  stopTime: Date,
  step: string
) => {
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
    };
  });

  return orbitalPositions;
};
