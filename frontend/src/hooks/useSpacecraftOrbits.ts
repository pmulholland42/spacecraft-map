import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { timeSteps } from "../constants";
import { spacecraftList } from "../data/spacecraft";
import { OrbitalPosition } from "../interfaces";
import { getDaysNeededToFetch, getOrbitalData } from "../utilities/api";

/**
 * React hook that returns orbital position data for spacecraft, updated with the current display time
 * @param displayTime
 * @param timeStepIndex
 * @returns A map of spacecraft IDs to their downloaded orbital positions
 */
export const useSpacecraftOrbits = (
  displayTime: Date,
  timeStepIndex: number
): Map<string, OrbitalPosition[]> => {
  const [spacecraftOrbits, setSpacecraftOrbits] = useState<Map<string, OrbitalPosition[]>>(
    new Map<string, OrbitalPosition[]>()
  );
  const [fetching, setFetching] = useState<string[]>([]);
  const [bufferMultiplier, setBufferMultiplier] = useState(1);

  useEffect(() => {
    const initialStartDate = addDays(displayTime, -1);
    const initialStopDate = addDays(displayTime, 1);

    const newSpacecraftOrbits = new Map(spacecraftOrbits);

    const orbitPromises: Promise<void>[] = spacecraftList.map((spacecraft) => {
      if (!fetching.includes(spacecraft.id)) {
        if (!newSpacecraftOrbits.has(spacecraft.id) || newSpacecraftOrbits.get(spacecraft.id)?.length === 0) {
          setFetching((f) => f.concat([spacecraft.id]));
          return getOrbitalData({
            orbitalBodyId: spacecraft.horizonsId,
            center: spacecraft.parent.horizonsId,
            startTime: initialStartDate,
            stopTime: initialStopDate,
            step: spacecraft.timeStep,
          }).then((positions) => {
            newSpacecraftOrbits.set(spacecraft.id, positions);
            setFetching((f) => f.filter((a) => a !== spacecraft.id));
          });
        } else {
          const orbitalPositions = newSpacecraftOrbits.get(spacecraft.id)!;
          const timeWarpSpeed = timeSteps[timeStepIndex].value;
          let lastDateWithOrbitalData: Date = new Date();

          let daysToFetch = 0;
          if (timeWarpSpeed !== 0) {
            if (timeWarpSpeed > 0) {
              lastDateWithOrbitalData = orbitalPositions[orbitalPositions.length - 1].time!;
            } else {
              lastDateWithOrbitalData = orbitalPositions[0].time!;
            }
            daysToFetch = getDaysNeededToFetch(displayTime, timeWarpSpeed, lastDateWithOrbitalData);
          }

          if (daysToFetch !== 0) {
            daysToFetch *= bufferMultiplier;
            let startDate: Date;
            let stopDate: Date;

            setBufferMultiplier((b) => b * 2);

            if (timeWarpSpeed > 0) {
              daysToFetch = Math.max(daysToFetch, 2);
              startDate = addDays(lastDateWithOrbitalData, 1);
              stopDate = addDays(startDate, daysToFetch);
            } else {
              daysToFetch = Math.min(daysToFetch, -2);
              stopDate = addDays(lastDateWithOrbitalData, -1);
              startDate = addDays(stopDate, daysToFetch);
            }

            setFetching((f) => f.concat([spacecraft.id]));

            return getOrbitalData({
              orbitalBodyId: spacecraft.horizonsId,
              center: spacecraft.parent.horizonsId,
              startTime: startDate,
              stopTime: stopDate,
              step: spacecraft.timeStep,
            }).then((fetchedPositions) => {
              let newOrbitalPositions = newSpacecraftOrbits.get(spacecraft.id)!;
              if (timeWarpSpeed > 0) {
                newOrbitalPositions = newOrbitalPositions.concat(fetchedPositions);
              } else {
                newOrbitalPositions = fetchedPositions.concat(newOrbitalPositions);
              }
              newSpacecraftOrbits.set(spacecraft.id, newOrbitalPositions);
              setFetching((f) => f.filter((a) => a !== spacecraft.id));
            });
          } else {
            return Promise.resolve();
          }
        }
      } else {
        return Promise.resolve();
      }
    });
    // TODO: handle failed network requests gracefully
    Promise.all(orbitPromises).then(() => {
      setSpacecraftOrbits(newSpacecraftOrbits);
    });
  }, [displayTime, timeStepIndex, bufferMultiplier, fetching, spacecraftOrbits]);

  return spacecraftOrbits;
};
