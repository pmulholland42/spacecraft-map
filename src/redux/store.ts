import { combineReducers, createStore } from "redux";
import {
  SET_KEEP_CENTERED,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
} from "./actions";
import { ObjectInfoActionTypes, OptionsActionTypes } from "./actionTypes";

// Options
interface Options {
  showOrbits: boolean;
  showLabels: boolean;
  showBackgroundStars: boolean;
  showDebugInfo: boolean;
}

const initialOptionsState: Options = {
  showOrbits: true,
  showLabels: true,
  showBackgroundStars: false,
  showDebugInfo: false,
};

const optionsReducer = (
  state: Options = initialOptionsState,
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
interface ObjectInfo {
  keepCentered: boolean;
}

const initialObjectInfoState: ObjectInfo = {
  keepCentered: false,
};

const objectInfoReducer = (
  state: ObjectInfo = initialObjectInfoState,
  action: ObjectInfoActionTypes
) => {
  switch (action.type) {
    case SET_KEEP_CENTERED:
      return { ...state, keepCentered: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  options: optionsReducer,
  objectInfo: objectInfoReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
