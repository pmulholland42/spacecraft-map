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
import {
  SetDisplayTimeAction,
  SetKeepCenteredAction,
  SetScreenCenterAction,
  SetShowBackgroundStarsAction,
  SetShowDebugInfoAction,
  SetShowLabelsAction,
  SetShowOrbitsAction,
  SetZoomAction,
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

export const setScreenCenter = (center: {
  x: number;
  y: number;
}): SetScreenCenterAction => ({
  type: SET_SCREEN_CENTER,
  payload: center,
});

export const setZoom = (zoom: number): SetZoomAction => ({
  type: SET_ZOOM,
  payload: zoom,
});
