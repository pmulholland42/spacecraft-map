import { Coordinate } from "../interfaces";
import {
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_SCREEN_CENTER,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
  SET_ZOOM,
} from "./actions";

// Options
export interface SetShowOrbitsAction {
  type: typeof SET_SHOW_ORBITS;
  payload: boolean;
}
export interface SetShowLabelsAction {
  type: typeof SET_SHOW_LABELS;
  payload: boolean;
}
export interface SetShowBackgroundStarsAction {
  type: typeof SET_SHOW_BACKGROUND_STARS;
  payload: boolean;
}
export interface SetShowDebugInfoAction {
  type: typeof SET_SHOW_DEBUG_INFO;
  payload: boolean;
}

export type OptionsActionTypes =
  | SetShowOrbitsAction
  | SetShowLabelsAction
  | SetShowBackgroundStarsAction
  | SetShowDebugInfoAction;

// Object info
export interface SetKeepCenteredAction {
  type: typeof SET_KEEP_CENTERED;
  payload: boolean;
}

export type ObjectInfoActionTypes = SetKeepCenteredAction;

// Time
export interface SetDisplayTimeAction {
  type: typeof SET_DISPLAY_TIME;
  payload: Date;
}

export type TimeActionTypes = SetDisplayTimeAction;

// Map

export interface SetScreenCenterAction {
  type: typeof SET_SCREEN_CENTER;
  payload: Coordinate;
}

export interface SetZoomAction {
  type: typeof SET_ZOOM;
  payload: number;
}

export type MapActionTypes = SetScreenCenterAction | SetZoomAction;
