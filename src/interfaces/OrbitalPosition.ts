/** this is a function of an OrbitDefinition and a datetime */
export interface OrbitalPosition {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  meanLongitude: number;
  longitudeOfPeriapsis: number;
  longitudeOfAscendingNode: number;
  semiMinorAxis: number;
  distanceFromCenterToFocus: number;
  period: number;
  argumentOfPeriapsis: number;
  meanAnomaly: number;
  eccentricAnomaly: number;
  trueAnomaly: number;
}
