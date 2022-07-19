/**
 * Describes the state of an orbit at a particular time
 */
export interface OrbitalPosition {
  /** The current semi-major axis of the orbit (AU) */
  semiMajorAxis: number;
  /** The current eccentricity of the orbit */
  eccentricity: number;
  /** The current inclination of the orbit (degrees) */
  inclination: number;
  /** The current mean longitude of the orbit (degrees) */
  meanLongitude: number;
  /** The current longitude of periapsis (degrees) */
  longitudeOfPeriapsis: number;
  /** The current longitude of the ascending node (degrees/century) */
  longitudeOfAscendingNode: number;
  /** The current semi-minor axis of the orbit (AU) */
  semiMinorAxis: number;
  /** The current distance from the center of the orbit to its focal point (AU) */
  distanceFromCenterToFocus: number;
  /** The current argument of periapsis of the orbit (degrees) */
  argumentOfPeriapsis: number;
  /** The current mean anomaly of the orbit (degrees) */
  meanAnomaly: number;
  /** The current eccentric anomaly of the orbit (degrees) */
  eccentricAnomaly: number;
  /** The current true anomaly of the orbit (degrees) */
  trueAnomaly: number;
  /** The time that this orbital position is describing. Only necessary for spacecraft. */
  time?: Date;
}
