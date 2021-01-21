import { store } from "../redux/store";
import {
  addTextBubble,
  decrementTimeStepIndex,
  pauseTime,
  removeTextBubble,
  setDisplayTime,
  setKeepCentered,
  setSelectedObject,
  setShowOrbits,
  setTimeStepIndex,
} from "../redux/actionCreators";
import {
  animateZoomAndPan,
  getObjectCoordinates,
  findObjectById,
  getPausedTimeStepIndex,
  getNextClosestApproach,
} from "../utilities";
import { defaultPlanetZoom, oneDay, timeSteps } from "../constants";
import { ITextBubble, Tour } from "../interfaces";

export const tours: Tour[] = [
  {
    title: "tourMessages.meetThePlanets.title",
    runTour: async (t) => {
      store.dispatch(setSelectedObject(null));
      store.dispatch(setKeepCentered(false));
      store.dispatch(pauseTime());
      store.dispatch(setDisplayTime(new Date()));
      const planetIds = [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
      ];
      for (let i = 0; i < planetIds.length; i++) {
        const planetId = planetIds[i];
        const textBubbleId = `${planetId}-bubble`;
        const planet = findObjectById(planetId);
        if (planet === null) {
          return Promise.resolve(false);
        }
        await animateZoomAndPan(
          getObjectCoordinates(planet, store.getState().time.displayTime),
          defaultPlanetZoom
        );
        await waitForTextBubble({
          object: planet,
          id: textBubbleId,
          text: t(`tourMessages.meetThePlanets.${planetId}`),
          promptText: t(i !== planetIds.length - 1 ? "continue" : "finish"),
        });
      }
      return true;
    },
  },
  {
    title: "tourMessages.retrogradeMars.title",
    runTour: async (t) => {
      const sun = findObjectById("sun");
      const earth = findObjectById("earth");
      const mars = findObjectById("mars");
      if (sun === null || earth === null || mars === null) {
        return Promise.resolve(false);
      }
      let nextClosestApproach = getNextClosestApproach(earth, mars, store.getState().time.displayTime);
      let marsClosestApproachCoords = getObjectCoordinates(mars, nextClosestApproach);
      let earthClosestApproachCoords = getObjectCoordinates(earth, nextClosestApproach);
      const fastForwardTimeStepIndex = getPausedTimeStepIndex(timeSteps) + 3;
      store.dispatch(setSelectedObject(null));
      store.dispatch(setKeepCentered(false));
      store.dispatch(pauseTime());
      store.dispatch(setDisplayTime(new Date()));
      const textBubblePromise = waitForTextBubble({
        id: "explanation",
        text: t("tourMessages.retrogradeMars.explanation"),
        promptText: t("finish"),
      });
      await animateZoomAndPan(getObjectCoordinates(earth, store.getState().time.displayTime), 6);
      store.dispatch(setSelectedObject(earth));
      store.dispatch(setKeepCentered(true));
      const showOrbitsWhenDone = store.getState().options.showOrbits;
      store.dispatch(setShowOrbits(false));
      store.dispatch(setTimeStepIndex(fastForwardTimeStepIndex));
      store.dispatch(
        addTextBubble({
          id: "waitForMars",
          coords: marsClosestApproachCoords,
          text: t("tourMessages.retrogradeMars.waitForMars"),
          relativeCenter: earthClosestApproachCoords,
          yOffset: 80,
        })
      );
      await waitForTime(new Date(nextClosestApproach.getTime() - oneDay * 120));
      store.dispatch(decrementTimeStepIndex());
      await waitForTime(new Date(nextClosestApproach.getTime() - oneDay * 60));
      store.dispatch(removeTextBubble("waitForMars"));
      store.dispatch(
        addTextBubble({
          id: "marsRetrograde",
          coords: marsClosestApproachCoords,
          text: t("tourMessages.retrogradeMars.retrogradeMotion"),
          relativeCenter: earthClosestApproachCoords,
          yOffset: 100,
        })
      );
      await waitForTime(new Date(nextClosestApproach.getTime() + oneDay * 80));
      store.dispatch(removeTextBubble("marsRetrograde"));

      await textBubblePromise;

      // Finish
      store.dispatch(setShowOrbits(showOrbitsWhenDone));
      store.dispatch(setSelectedObject(null));
      store.dispatch(setKeepCentered(false));
      store.dispatch(pauseTime());
      return true;
    },
  },
];

const waitForTextBubble = async (textBubble: ITextBubble) => {
  let promptPromise: Promise<void> | null = null;
  if (textBubble.promptText !== undefined) {
    promptPromise = new Promise((resolve) => {
      textBubble.onPromptClick = () => {
        store.dispatch(removeTextBubble(textBubble.id));
        resolve();
      };
    });
  }
  store.dispatch(addTextBubble(textBubble));
  if (promptPromise !== null) {
    await promptPromise;
  }
};

const waitForTime = async (time: Date) => {
  return new Promise((resolve) => {
    store.subscribe(() => {
      if (store.getState().time.displayTime.getTime() > time.getTime()) {
        resolve();
      }
    });
  });
};
