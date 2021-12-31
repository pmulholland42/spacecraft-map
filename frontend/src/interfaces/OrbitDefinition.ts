/**
 * Defines an orbit's state at an epoch and how it changes over time
 */
export interface OrbitDefinition {
  /** The epoch is the time at which the initial orbit values are measured */
  epoch: Date;
  /** The semi-major axis of the orbit at the epoch (AU) */
  semiMajorAxis: number;
  /** The rate of change of the semi-major axis (AU/century) */
  semiMajorAxisRate: number;
  /** The eccentricity of the orbit at the epoch */
  eccentricity: number;
  /** The rate of change of the eccentricity per century */
  eccentricityRate: number;
  /** The inclination of the orbit at the epoch (degrees) */
  inclination: number;
  /** The rate of change of the inclination (degrees/century) */
  inclinationRate: number;
  /** The mean longitude of the object at the epoch (degrees) */
  meanLongitude: number;
  /** The rate of change of the mean longitude (degrees/century) */
  meanLongitudeRate: number;
  /** The longitude of periapsis at the epoch (degrees) */
  longitudeOfPeriapsis: number;
  /** The rate of change of the longitude of periapsis (degrees/century) */
  longitudeOfPeriapsisRate: number;
  /** The longitude of the ascending node at the epoch (degrees/century) */
  longitudeOfAscendingNode: number;
  /** The rate of change of the longitude of the ascending node (degrees/century) */
  longitudeOfAscendingNodeRate: number;
  /** Additional correction factor needed for Jupiter through Pluto */
  b?: number;
  /** Additional correction factor needed for Jupiter through Pluto */
  c?: number;
  /** Additional correction factor needed for Jupiter through Pluto */
  s?: number;
  /** Additional correction factor needed for Jupiter through Pluto */
  f?: number;
}
