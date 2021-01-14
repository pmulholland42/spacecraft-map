import { combineReducers, createStore } from "redux";
import {
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
import { AstronomicalObject, Coordinate } from "../interfaces";

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
}

const initialTimeState: TimeState = {
  displayTime: new Date(),
};

const timeReducer = (state: TimeState = initialTimeState, action: TimeActionTypes) => {
  switch (action.type) {
    case SET_DISPLAY_TIME:
      return { ...state, displayTime: action.displayTime };
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
}

const initialUIState: UIState = {
  detailsPaneOpen: false,
  optionsPaneOpen: false,
  tourModalOpen: false,
};

const uiReducer = (state: UIState = initialUIState, action: UIActionTypes) => {
  switch (action.type) {
    case SET_DETAILS_PANE_OPEN:
      return { ...state, detailsPaneOpen: action.open };
    case SET_OPTIONS_PANE_OPEN:
      return { ...state, optionsPaneOpen: action.open };
    case SET_TOUR_MODAL_OPEN:
      return { ...state, tourModalOpen: action.open };
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
