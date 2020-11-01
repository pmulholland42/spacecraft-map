import {
  SET_SHOW_BACKGROUND_STARS,
  SET_SHOW_DEBUG_INFO,
  SET_SHOW_LABELS,
  SET_SHOW_ORBITS,
} from "./actions";
import {
  SetShowBackgroundStarsAction,
  SetShowDebugInfoAction,
  SetShowLabelsAction,
  SetShowOrbitsAction,
} from "./actionTypes";

export function setShowOrbits(showOrbits: boolean): SetShowOrbitsAction {
  return {
    type: SET_SHOW_ORBITS,
    payload: showOrbits,
  };
}
export function setShowLabels(showLabels: boolean): SetShowLabelsAction {
  return {
    type: SET_SHOW_LABELS,
    payload: showLabels,
  };
}
export function setShowBackgroundStars(
  showBackgroundStars: boolean
): SetShowBackgroundStarsAction {
  return {
    type: SET_SHOW_BACKGROUND_STARS,
    payload: showBackgroundStars,
  };
}
export function setShowDebugInfo(
  showDebugInfo: boolean
): SetShowDebugInfoAction {
  return {
    type: SET_SHOW_DEBUG_INFO,
    payload: showDebugInfo,
  };
}
