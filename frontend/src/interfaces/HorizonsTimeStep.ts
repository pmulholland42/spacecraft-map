type Interval = "d" | "h" | "min";

/** Time step used by the Horizons API */
export type HorizonsTimeStep = `${number}${Interval}`;
