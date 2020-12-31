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
import {
  SetDisplayTimeAction,
  SetKeepCenteredAction,
  SetScreenCenterAction,
  SetSelectedObjectAction,
  SetShowBackgroundStarsAction,
  SetShowDebugInfoAction,
  SetShowLabelsAction,
  SetShowOrbitsAction,
  SetZoomAction,
} from "./actionTypes";

export const setShowOrbits = (showOrbits: boolean): SetShowOrbitsAction => ({
  type: SET_SHOW_ORBITS,
  showOrbits,
});

export const setShowLabels = (showLabels: boolean): SetShowLabelsAction => ({
  type: SET_SHOW_LABELS,
  showLabels,
});

export const setShowBackgroundStars = (showBackgroundStars: boolean): SetShowBackgroundStarsAction => ({
  type: SET_SHOW_BACKGROUND_STARS,
  showBackgroundStars,
});

export const setShowDebugInfo = (showDebugInfo: boolean): SetShowDebugInfoAction => ({
  type: SET_SHOW_DEBUG_INFO,
  showDebugInfo,
});

export const setKeepCentered = (keepCentered: boolean): SetKeepCenteredAction => ({
  type: SET_KEEP_CENTERED,
  keepCentered,
});

export const setSelectedObject = (selectedObject: AstronomicalObject | null): SetSelectedObjectAction => ({
  type: SET_SELECTED_OBJECT,
  selectedObject,
});

export const setDisplayTime = (displayTime: Date): SetDisplayTimeAction => ({
  type: SET_DISPLAY_TIME,
  displayTime,
});

export const setScreenCenter = (screenCenter: Coordinate): SetScreenCenterAction => ({
  type: SET_SCREEN_CENTER,
  screenCenter,
});

export const setZoom = (zoom: number): SetZoomAction => ({
  type: SET_ZOOM,
  zoom,
});
