import { store } from "../redux/store";
import { addTextBubble, pauseTime, removeTextBubble, setDisplayTime } from "../redux/actionCreators";
import { animateZoomAndPan, getObjectCoordinates } from "../utilities";
import solarSystem from "./solarSystem";
import { defaultPlanetZoom } from "../constants";
import { ITextBubble } from "../interfaces";
import { TFunction } from "i18next";

const WAIT = "WAIT";
const ZOOM_AND_PAN = "ZOOM_AND_PAN";
const PAUSE_TIME = "PAUSE_TIME";
const RESET_TIME = "RESET_TIME";
const ADD_TEXT_BUBBLE = "ADD_TEXT_BUBBLE";
const REMOVE_TEXT_BUBBLE = "REMOVE_TEXT_BUBBLE";

interface ZoomAndPanAction {
  type: typeof ZOOM_AND_PAN;
  /** The id of the object to zoom and pan to */
  objectId: string;
}
interface PauseTimeAction {
  type: typeof PAUSE_TIME;
}
interface ResetTimeAction {
  type: typeof RESET_TIME;
}
interface WaitAction {
  type: typeof WAIT;
  /** Time to wait, in ms */
  time: number;
}
interface AddTextBubbleAction {
  type: typeof ADD_TEXT_BUBBLE;
  /** Unique id for the text bubble */
  textBubbleId: string;
  /** The id of the object to put the bubble over */
  objectId: string;
  /** The message text to put in the bubble. Will be translated. */
  text: string;
  /**
   * Prompt text to display in the bubble.
   * If defined, the tour will wait for the prompt to be clicked before continuing.
   * Will be translated.
   */
  prompt?: string;
}
interface RemoveTextBubbleAction {
  type: typeof REMOVE_TEXT_BUBBLE;
  /** The id of the text bubble to remove */
  textBubbleId: string;
}
type TourAction =
  | ZoomAndPanAction
  | PauseTimeAction
  | ResetTimeAction
  | WaitAction
  | AddTextBubbleAction
  | RemoveTextBubbleAction;

interface Tour {
  name: string;
  description: string;
  actions: TourAction[];
}

export const tours: Tour[] = [
  {
    name: "tourMessages.meetThePlanets.title",
    description: "",
    actions: [
      { type: "PAUSE_TIME" },
      { type: "RESET_TIME" },
      { type: "ZOOM_AND_PAN", objectId: "mercury" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "mercuryBubble",
        objectId: "mercury",
        text: "tourMessages.meetThePlanets.mercury",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "mercuryBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "venus" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "venusBubble",
        objectId: "venus",
        text: "tourMessages.meetThePlanets.venus",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "venusBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "earth" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "earthBubble",
        objectId: "earth",
        text: "tourMessages.meetThePlanets.earth",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "earthBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "mars" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "marsBubble",
        objectId: "mars",
        text: "tourMessages.meetThePlanets.mars",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "marsBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "jupiter" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "jupiterBubble",
        objectId: "jupiter",
        text: "tourMessages.meetThePlanets.jupiter",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "jupiterBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "saturn" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "saturnBubble",
        objectId: "saturn",
        text: "tourMessages.meetThePlanets.saturn",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "saturnBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "uranus" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "uranusBubble",
        objectId: "uranus",
        text: "tourMessages.meetThePlanets.uranus",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "uranusBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "neptune" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "neptuneBubble",
        objectId: "neptune",
        text: "tourMessages.meetThePlanets.neptune",
        prompt: "continue",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "neptuneBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "pluto" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "plutoBubble",
        objectId: "pluto",
        text: "tourMessages.meetThePlanets.pluto",
        prompt: "finish",
      },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "plutoBubble",
      },
    ],
  },
];

/**
 * Runs through the steps of a tour
 * @param tour The tour to start
 * @param t Translation function
 */
export const startTour = async (tour: Tour, t: TFunction) => {
  for (let i = 0; i < tour.actions.length; i++) {
    const action = tour.actions[i];
    switch (action.type) {
      case ZOOM_AND_PAN:
        const object = solarSystem.find((object) => object.id === action.objectId);
        if (object !== undefined) {
          await animateZoomAndPan(
            getObjectCoordinates(object, store.getState().time.displayTime),
            defaultPlanetZoom
          );
        } else {
          console.warn(`Could not find object with id ${action.objectId} for tour ${t(tour.name)}`);
        }
        break;
      case PAUSE_TIME:
        store.dispatch(pauseTime());
        break;
      case RESET_TIME:
        store.dispatch(setDisplayTime(new Date()));
        break;
      case WAIT:
        await new Promise((resolve) => setTimeout(resolve, action.time));
        break;
      case ADD_TEXT_BUBBLE:
        const textBubbleTarget = solarSystem.find((object) => object.id === action.objectId);
        if (textBubbleTarget) {
          const textBubble: ITextBubble = {
            id: action.textBubbleId,
            text: t(action.text),
            object: textBubbleTarget,
          };
          let promptPromise: Promise<void> | null = null;
          if (action.prompt !== undefined) {
            textBubble.promptText = t(action.prompt);
            promptPromise = new Promise((resolve) => {
              textBubble.onPromptClick = () => {
                resolve();
              };
            });
          }
          store.dispatch(addTextBubble(textBubble));
          if (promptPromise !== null) {
            await promptPromise;
          }
        } else {
          console.warn(`Could not find object with id ${action.objectId} for tour ${t(tour.name)}`);
        }
        break;
      case REMOVE_TEXT_BUBBLE:
        store.dispatch(removeTextBubble(action.textBubbleId));
        break;
      default:
        break;
    }
  }
};
