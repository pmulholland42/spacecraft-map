import { AstronomicalObject } from "./AstronomicalObject";
import { Coordinate } from "./Coordinate";

export interface ITextBubble {
  /** Unique identifier for this text bubble. */
  id: string;
  /** Message to display in the text bubble. */
  text: string;
  /** Text to show as a clickable prompt. If undefined, no prompt will be shown. */
  promptText?: string;
  /** Function to be called when the prompt is clicked (optional) */
  onPromptClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** The object to display this text bubble over. If coords are defined, this will not be used. If both are undefined, text bubble will be shown in the top right. */
  object?: AstronomicalObject;
  /** Space coords (km) to display the text bubble at. Takes priority over object. If both are undefined, text bubble will be shown in the top right. */
  coords?: Coordinate;
  /** How many pixels to raise the text bubble? Default 5 */
  yOffset?: number;
  /** Center coordinate to use for screen coordinate calcualtions. Use this to keep a moving point still relative to a planet's position at a desired time, for example. */
  relativeCenter?: Coordinate;
}
