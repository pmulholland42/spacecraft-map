import { AstronomicalObject, Coordinate, ITextBubble, Tour } from "../interfaces";
import {
  ADD_TEXT_BUBBLE,
  ADD_TO_DISPLAY_TIME,
  DECREMENT_TIME_STEP_INDEX,
  INCREMENT_TIME_STEP_INDEX,
  PAUSE_TIME,
  REMOVE_TEXT_BUBBLE,
  SET_CREDITS_MODAL_OPEN,
  SET_CURRENT_TOUR,
  SET_DETAILS_PANE_OPEN,
  SET_DISPLAY_TIME,
  SET_KEEP_CENTERED,
  SET_OPTIONS_PANE_OPEN,
  SET_REMOVE_ANIMATIONS,
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
export interface SetRemoveAnimationsAction {
  type: typeof SET_REMOVE_ANIMATIONS;
  removeAnimations: boolean;
}
export interface SetShowDebugInfoAction {
  type: typeof SET_SHOW_DEBUG_INFO;
  showDebugInfo: boolean;
}

export type OptionsActionTypes =
  | SetShowOrbitsAction
  | SetShowLabelsAction
  | SetShowBackgroundStarsAction
  | SetRemoveAnimationsAction
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
export interface AddToDisplayTimeAction {
  type: typeof ADD_TO_DISPLAY_TIME;
  milliseconds: number;
}
export interface SetTimeStepIndexAction {
  type: typeof SET_TIME_STEP_INDEX;
  timeStepIndex: number;
}
export interface IncrementTimeStepIndexAction {
  type: typeof INCREMENT_TIME_STEP_INDEX;
}
export interface DecrementTimeStepIndexAction {
  type: typeof DECREMENT_TIME_STEP_INDEX;
}
export interface PauseTimeAction {
  type: typeof PAUSE_TIME;
}

export type TimeActionTypes =
  | SetDisplayTimeAction
  | AddToDisplayTimeAction
  | SetTimeStepIndexAction
  | IncrementTimeStepIndexAction
  | DecrementTimeStepIndexAction
  | PauseTimeAction;

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

// UI
export interface SetDetailsPaneOpenAction {
  type: typeof SET_DETAILS_PANE_OPEN;
  open: boolean;
}
export interface SetOptionsPaneOpenAction {
  type: typeof SET_OPTIONS_PANE_OPEN;
  open: boolean;
}

export interface SetCreditsModalOpenAction {
  type: typeof SET_CREDITS_MODAL_OPEN;
  open: boolean;
}
export interface SetTourModalOpenAction {
  type: typeof SET_TOUR_MODAL_OPEN;
  open: boolean;
}
export interface AddTextBubbleAction {
  type: typeof ADD_TEXT_BUBBLE;
  textBubble: ITextBubble;
}
export interface RemoveTextBubbleAction {
  type: typeof REMOVE_TEXT_BUBBLE;
  id: string;
}
export interface SetCurrentTourAction {
  type: typeof SET_CURRENT_TOUR;
  currentTour: Tour | null;
}

export type UIActionTypes =
  | SetDetailsPaneOpenAction
  | SetOptionsPaneOpenAction
  | SetTourModalOpenAction
  | SetCreditsModalOpenAction
  | AddTextBubbleAction
  | RemoveTextBubbleAction
  | SetCurrentTourAction;
