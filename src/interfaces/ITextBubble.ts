import { AstronomicalObject } from "./AstronomicalObject";

export interface ITextBubble {
  /** Unique identifier for this text bubble. */
  id: string;
  /** Message to display in the text bubble. */
  text: string;
  /** Text to show as a clickable prompt. If undefined, no prompt will be shown. */
  promptText?: string;
  /** Function to be called when the prompt is clicked (optional) */
  onPromptClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** The object to display this text bubble over. */
  object: AstronomicalObject;
}
