import {
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
} from "./actions";

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
