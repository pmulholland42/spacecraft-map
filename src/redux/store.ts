import { combineReducers, createStore } from "redux";
import {
  ADD_TEXT_BUBBLE,
  DECREMENT_TIME_STEP_INDEX,
  INCREMENT_TIME_STEP_INDEX,
  PAUSE_TIME,
  REMOVE_TEXT_BUBBLE,
  SET_DETAILS_PANE_OPEN,
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_OPTIONS_PANE_OPEN,
  SET_SCREEN_CENTER,
  SET_SELECTED_OBJECT,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
  SET_TIME_STEP_INDEX,
  SET_TOUR_MODAL_OPEN,
  SET_ZOOM,
} from "./actions";
import {
  MapActionTypes,
  ObjectInfoActionTypes,
  OptionsActionTypes,
  TimeActionTypes,
  UIActionTypes,
} from "./actionTypes";
import { AstronomicalObject, Coordinate, ITextBubble } from "../interfaces";
import { getPausedTimeStepIndex } from "../utilities";
import { timeSteps } from "../constants";

// Options
interface OptionsState {
  showOrbits: boolean;
  showLabels: boolean;
  showBackgroundStars: boolean;
  showDebugInfo: boolean;
}

const initialOptionsState: OptionsState = {
  showOrbits: true,
  showLabels: true,
  showBackgroundStars: false,
  showDebugInfo: false,
};

const optionsReducer = (state: OptionsState = initialOptionsState, action: OptionsActionTypes) => {
  switch (action.type) {
    case SET_SHOW_ORBITS:
      return { ...state, showOrbits: action.showOrbits };
    case SET_SHOW_LABELS:
      return { ...state, showLabels: action.showLabels };
    case SET_SHOW_BACKGROUND_STARS:
      return { ...state, showBackgroundStars: action.showBackgroundStars };
    case SET_SHOW_DEBUG_INFO:
      return { ...state, showDebugInfo: action.showDebugInfo };
    default:
      return state;
  }
};

// Object info
interface ObjectInfoState {
  keepCentered: boolean;
  selectedObject: AstronomicalObject | null;
}

const initialObjectInfoState: ObjectInfoState = {
  keepCentered: false,
  selectedObject: null,
};

const objectInfoReducer = (
  state: ObjectInfoState = initialObjectInfoState,
  action: ObjectInfoActionTypes
) => {
  switch (action.type) {
    case SET_KEEP_CENTERED:
      return { ...state, keepCentered: action.keepCentered };
    case SET_SELECTED_OBJECT:
      return { ...state, selectedObject: action.selectedObject };
    default:
      return state;
  }
};

// Date / time
interface TimeState {
  displayTime: Date;
  /** Index to the array of time steps which determine how fast time is passing */
  timeStepIndex: number;
}

const initialTimeState: TimeState = {
  displayTime: new Date(),
  timeStepIndex: getPausedTimeStepIndex(timeSteps),
};

const timeReducer = (state: TimeState = initialTimeState, action: TimeActionTypes) => {
  switch (action.type) {
    case SET_DISPLAY_TIME:
      return { ...state, displayTime: action.displayTime };
    case SET_TIME_STEP_INDEX:
      return { ...state, timeStepIndex: action.timeStepIndex };
    case INCREMENT_TIME_STEP_INDEX:
      return { ...state, timeStepIndex: Math.min(state.timeStepIndex + 1, timeSteps.length - 1) };
    case DECREMENT_TIME_STEP_INDEX:
      return { ...state, timeStepIndex: Math.max(state.timeStepIndex - 1, 0) };
    case PAUSE_TIME:
      return { ...state, timeStepIndex: getPausedTimeStepIndex(timeSteps) };
    default:
      return state;
  }
};

// Map
interface MapState {
  screenCenter: Coordinate;
  zoom: number;
}

const initialMapState: MapState = {
  screenCenter: { x: 0, y: 0 },
  zoom: 10,
};

const mapReducer = (state: MapState = initialMapState, action: MapActionTypes) => {
  switch (action.type) {
    case SET_SCREEN_CENTER:
      return { ...state, screenCenter: action.screenCenter };
    case SET_ZOOM:
      return { ...state, zoom: action.zoom };
    default:
      return state;
  }
};

// UI
interface UIState {
  detailsPaneOpen: boolean;
  optionsPaneOpen: boolean;
  tourModalOpen: boolean;
  textBubbles: ITextBubble[];
}

const initialUIState: UIState = {
  detailsPaneOpen: false,
  optionsPaneOpen: false,
  tourModalOpen: false,
  textBubbles: [],
};

const uiReducer = (state: UIState = initialUIState, action: UIActionTypes) => {
  switch (action.type) {
    case SET_DETAILS_PANE_OPEN:
      return { ...state, detailsPaneOpen: action.open };
    case SET_OPTIONS_PANE_OPEN:
      return { ...state, optionsPaneOpen: action.open };
    case SET_TOUR_MODAL_OPEN:
      return { ...state, tourModalOpen: action.open };
    case ADD_TEXT_BUBBLE:
      if (state.textBubbles.find((textBubble) => textBubble.id === action.textBubble.id) === undefined) {
        return { ...state, textBubbles: [...state.textBubbles, action.textBubble] };
      } else {
        return state;
      }
    case REMOVE_TEXT_BUBBLE:
      return { ...state, textBubbles: state.textBubbles.filter((textBubble) => textBubble.id !== action.id) };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  options: optionsReducer,
  objectInfo: objectInfoReducer,
  time: timeReducer,
  map: mapReducer,
  ui: uiReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
