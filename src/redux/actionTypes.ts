import { AstronomicalObject, Coordinate } from "../interfaces";
import {
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_SCREEN_CENTER,
  SET_SELECTED_OBJECT,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
  SET_ZOOM,
} from "./actions";

// Options
export interface SetShowOrbitsAction {
  type: typeof SET_SHOW_ORBITS;
  showOrbits: boolean;
}
export interface SetShowLabelsAction {
  type: typeof SET_SHOW_LABELS;
  showLabels: boolean;
}
export interface SetShowBackgroundStarsAction {
  type: typeof SET_SHOW_BACKGROUND_STARS;
  showBackgroundStars: boolean;
}
export interface SetShowDebugInfoAction {
  type: typeof SET_SHOW_DEBUG_INFO;
  showDebugInfo: boolean;
}

export type OptionsActionTypes =
  | SetShowOrbitsAction
  | SetShowLabelsAction
  | SetShowBackgroundStarsAction
  | SetShowDebugInfoAction;

// Object info
export interface SetKeepCenteredAction {
  type: typeof SET_KEEP_CENTERED;
  keepCentered: boolean;
}
export interface SetSelectedObjectAction {
  type: typeof SET_SELECTED_OBJECT;
  selectedObject: AstronomicalObject | null;
}

export type ObjectInfoActionTypes = SetKeepCenteredAction | SetSelectedObjectAction;

// Time
export interface SetDisplayTimeAction {
  type: typeof SET_DISPLAY_TIME;
  displayTime: Date;
}

export type TimeActionTypes = SetDisplayTimeAction;

// Map

export interface SetScreenCenterAction {
  type: typeof SET_SCREEN_CENTER;
  screenCenter: Coordinate;
}

export interface SetZoomAction {
  type: typeof SET_ZOOM;
  zoom: number;
}

export type MapActionTypes = SetScreenCenterAction | SetZoomAction;
