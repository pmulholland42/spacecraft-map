// Scientific / mathematical constants that never change

/** Kilometers in one astronomical unit */
export const kmPerAU = 149597870;
/** J2000 epoch: January 1, 2000 */
export const j2000Epoch = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
/** Number of milliseconds in one second */
export const oneSecond = 1000;
/** Number of milliseconds in one minute */
export const oneMinute = 60000;
/** Number of milliseconds in one day */
export const oneDay = 86400000;
/** Number of milliseconds in one year */
export const oneYear = oneDay * 365.25;
/** Number of milliseconds in a century */
export const oneCentury = oneYear * 100;
/** Number of days in one century */
export const daysInACentury = oneCentury / oneDay;
/** Ratio between the circumference and radius of a circle */
export const tau = Math.PI * 2;
