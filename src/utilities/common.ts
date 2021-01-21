import solarSystem from "../data/solarSystem";
import { AstronomicalObject, TimeStep } from "../interfaces";

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
