import { combineReducers, createStore } from "redux";
import {
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
} from "./actions";
import {
  ObjectInfoActionTypes,
  OptionsActionTypes,
  TimeActionTypes,
} from "./actionTypes";

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

const optionsReducer = (
  state: OptionsState = initialOptionsState,
  action: OptionsActionTypes
) => {
  switch (action.type) {
    case SET_SHOW_ORBITS:
      return { ...state, showOrbits: action.payload };
    case SET_SHOW_LABELS:
      return { ...state, showLabels: action.payload };
    case SET_SHOW_BACKGROUND_STARS:
      return { ...state, showBackgroundStars: action.payload };
    case SET_SHOW_DEBUG_INFO:
      return { ...state, showDebugInfo: action.payload };
    default:
      return state;
  }
};

// Object info
interface ObjectInfoState {
  keepCentered: boolean;
}

const initialObjectInfoState: ObjectInfoState = {
  keepCentered: false,
};

const objectInfoReducer = (
  state: ObjectInfoState = initialObjectInfoState,
  action: ObjectInfoActionTypes
) => {
  switch (action.type) {
    case SET_KEEP_CENTERED:
      return { ...state, keepCentered: action.payload };
    default:
      return state;
  }
};

// Date / time
interface TimeState {
  displayTime: Date;
}

const initialTimeState: TimeState = {
  displayTime: new Date(),
};

const timeReducer = (
  state: TimeState = initialTimeState,
  action: TimeActionTypes
) => {
  switch (action.type) {
    case SET_DISPLAY_TIME:
      return { ...state, displayTime: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  options: optionsReducer,
  objectInfo: objectInfoReducer,
  time: timeReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
