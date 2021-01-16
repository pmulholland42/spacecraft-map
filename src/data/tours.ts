import { store } from "../redux/store";
import { addTextBubble, pauseTime, removeTextBubble, setDisplayTime } from "../redux/actionCreators";
import { animateZoomAndPan, getObjectCoordinates } from "../utilities";
import solarSystem from "./solarSystem";
import { defaultPlanetZoom } from "../constants";

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
  /** The message text to put in the bubble */
  text: string;
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
    name: "Meet the Planets",
    description: "lalalala",
    actions: [
      { type: "PAUSE_TIME" },
      { type: "RESET_TIME" },
      { type: "ZOOM_AND_PAN", objectId: "mercury" },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "mercuryBubble",
        objectId: "mercury",
        text: "This is Mercury!",
      },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "venusBubble",
        objectId: "venus",
        text: "This is Venus!",
      },
      { type: "WAIT", time: 3000 },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "mercuryBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "venus" },
      { type: "WAIT", time: 3000 },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "venusBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "earth" },
      { type: "WAIT", time: 3000 },
      { type: "ZOOM_AND_PAN", objectId: "mars" },
      { type: "WAIT", time: 3000 },
      {
        type: "ADD_TEXT_BUBBLE",
        textBubbleId: "jupiterBubble",
        objectId: "jupiter",
        text: "This is Jupiter!",
      },
      { type: "ZOOM_AND_PAN", objectId: "jupiter" },
      { type: "WAIT", time: 3000 },
      {
        type: "REMOVE_TEXT_BUBBLE",
        textBubbleId: "jupiterBubble",
      },
      { type: "ZOOM_AND_PAN", objectId: "saturn" },
      { type: "WAIT", time: 3000 },
      { type: "ZOOM_AND_PAN", objectId: "uranus" },
      { type: "WAIT", time: 3000 },
      { type: "ZOOM_AND_PAN", objectId: "neptune" },
      { type: "WAIT", time: 3000 },
      { type: "ZOOM_AND_PAN", objectId: "pluto" },
    ],
  },
];

export const startTour = async (tour: Tour) => {
  for (let i = 0; i < tour.actions.length; i++) {
    const action = tour.actions[i];
    switch (action.type) {
      case ZOOM_AND_PAN:
        const object = solarSystem.find((object) => object.id === action.objectId);
        if (object) {
          await animateZoomAndPan(
            getObjectCoordinates(object, store.getState().time.displayTime),
            defaultPlanetZoom
          );
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
          store.dispatch(
            addTextBubble({ id: action.textBubbleId, text: action.text, object: textBubbleTarget })
          );
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
