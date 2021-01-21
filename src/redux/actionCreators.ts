import { AstronomicalObject, Coordinate, ITextBubble, Tour } from "../interfaces";
import {
  ADD_TEXT_BUBBLE,
  DECREMENT_TIME_STEP_INDEX,
  INCREMENT_TIME_STEP_INDEX,
  PAUSE_TIME,
  REMOVE_TEXT_BUBBLE,
  SET_CURRENT_TOUR,
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
  SET_TIME_STEP_INDEX,
  SET_TOUR_MODAL_OPEN,
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
  SetDetailsPaneOpenAction,
  SetOptionsPaneOpenAction,
  SetTourModalOpenAction,
  SetTimeStepIndexAction,
  IncrementTimeStepIndexAction,
  DecrementTimeStepIndexAction,
  PauseTimeAction,
  AddTextBubbleAction,
  RemoveTextBubbleAction,
  SetCurrentTourAction,
} from "./actionTypes";

// Options
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

// Object info
export const setKeepCentered = (keepCentered: boolean): SetKeepCenteredAction => ({
  type: SET_KEEP_CENTERED,
  keepCentered,
});

export const setSelectedObject = (selectedObject: AstronomicalObject | null): SetSelectedObjectAction => ({
  type: SET_SELECTED_OBJECT,
  selectedObject,
});

// Time
export const setDisplayTime = (displayTime: Date): SetDisplayTimeAction => ({
  type: SET_DISPLAY_TIME,
  displayTime,
});

export const setTimeStepIndex = (timeStepIndex: number): SetTimeStepIndexAction => ({
  type: SET_TIME_STEP_INDEX,
  timeStepIndex,
});

export const incrementTimeStepIndex = (): IncrementTimeStepIndexAction => ({
  type: INCREMENT_TIME_STEP_INDEX,
});

export const decrementTimeStepIndex = (): DecrementTimeStepIndexAction => ({
  type: DECREMENT_TIME_STEP_INDEX,
});

export const pauseTime = (): PauseTimeAction => ({
  type: PAUSE_TIME,
});

export const setScreenCenter = (screenCenter: Coordinate): SetScreenCenterAction => ({
  type: SET_SCREEN_CENTER,
  screenCenter,
});

export const setZoom = (zoom: number): SetZoomAction => ({
  type: SET_ZOOM,
  zoom,
});

// UI
export const setDetailsPaneOpen = (open: boolean): SetDetailsPaneOpenAction => ({
  type: SET_DETAILS_PANE_OPEN,
  open,
});

export const setOptionsPaneOpen = (open: boolean): SetOptionsPaneOpenAction => ({
  type: SET_OPTIONS_PANE_OPEN,
  open,
});

export const setTourModalOpen = (open: boolean): SetTourModalOpenAction => ({
  type: SET_TOUR_MODAL_OPEN,
  open,
});
export const addTextBubble = (textBubble: ITextBubble): AddTextBubbleAction => ({
  type: ADD_TEXT_BUBBLE,
  textBubble,
});
export const removeTextBubble = (id: string): RemoveTextBubbleAction => ({
  type: REMOVE_TEXT_BUBBLE,
  id,
});
export const setCurrentTour = (currentTour: Tour | null): SetCurrentTourAction => ({
  type: SET_CURRENT_TOUR,
  currentTour,
});
