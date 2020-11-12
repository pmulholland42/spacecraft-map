/**
 * Converts an angle from degrees to radians
 * @param angle
 */
export const toRadians = (angle: number) => angle * (Math.PI / 180);

/**
 * Converts an angle from radians to degrees
 * @param angle
 */
export const toDegrees = (angle: number) => angle * (180 / Math.PI);
