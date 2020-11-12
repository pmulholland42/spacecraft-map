import {
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
} from "./actions";
import {
  SetDisplayTimeAction,
  SetKeepCenteredAction,
  SetShowBackgroundStarsAction,
  SetShowDebugInfoAction,
  SetShowLabelsAction,
  SetShowOrbitsAction,
} from "./actionTypes";

export const setShowOrbits = (showOrbits: boolean): SetShowOrbitsAction => ({
  type: SET_SHOW_ORBITS,
  payload: showOrbits,
});

export const setShowLabels = (showLabels: boolean): SetShowLabelsAction => ({
  type: SET_SHOW_LABELS,
  payload: showLabels,
});

export const setShowBackgroundStars = (
  showBackgroundStars: boolean
): SetShowBackgroundStarsAction => ({
  type: SET_SHOW_BACKGROUND_STARS,
  payload: showBackgroundStars,
});

export const setShowDebugInfo = (
  showDebugInfo: boolean
): SetShowDebugInfoAction => ({
  type: SET_SHOW_DEBUG_INFO,
  payload: showDebugInfo,
});

export const setKeepCentered = (
  keepCentered: boolean
): SetKeepCenteredAction => ({
  type: SET_KEEP_CENTERED,
  payload: keepCentered,
});

export const setDisplayTime = (time: Date): SetDisplayTimeAction => ({
  type: SET_DISPLAY_TIME,
  payload: time,
});
